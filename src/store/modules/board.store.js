import { boardService } from "../../services/board.service";
import { userService } from "../../services/user.service";
import { utilService } from "../../services/util.service";
import { socketService } from '../../services/socket.service';
import { SOCKET_ON_BOARD_UPDATE } from '../../services/socket.service';
export const boardStore = {
    state: {
        boards: [],
        currBoard: null,
        recentBoards: [],
        currTaskIdxs: null
    },
    getters: {

        boards(state) {
            return JSON.parse(JSON.stringify(state.boards))
        },
        starBoards(state) {
            return JSON.parse(JSON.stringify(state.boards.filter(b => b.star)))
        },
        currBoard(state) {
            return JSON.parse(JSON.stringify(state.currBoard))
        },
        currBoardLabels(getters) {
            return getters.currBoard.labels
        },
        currBoardMembers(getters) {
            return getters.currBoard.members
        },
        currBoardChecklists(getters) {
            const allChecklists = []
            getters.currBoard.groups.forEach(g => {
                g.tasks.forEach(t => {
                    if (!t.checklists || !t.checklists.length) return
                    allChecklists.push({ taskId: t.id, taskTitle: t.title, checklists: t.checklists })

                })
            })
            return allChecklists
        },
        getCurrTask({ currTaskIdxs, currBoard }) {
            if (!currTaskIdxs) return null
            const { groupIdx, currTaskIdx } = currTaskIdxs
            const currTask = currBoard.groups[groupIdx].tasks[currTaskIdx]
            return JSON.parse(JSON.stringify(currTask))
        },
        recentBoards({ recentBoards }) { return recentBoards },
        cardEdit({ cardEdit }) { return cardEdit },
        boardsToShow(state) {
            let regex = new RegExp(state.filterBy.txt, 'i')
            return state.boards.filter(board => {
                return regex.test(board.title)
            })
        },
    },
    mutations: {
        setCurrTask(state, { currTaskIdx, groupIdx }) {
            state.currTaskIdxs = { currTaskIdx, groupIdx }
        },
        setCurrBoard(state, { currBoard }) {
            state.currBoard = currBoard
        },
        addBoardToRecentBoards(state, { board }) {
            if (state.recentBoards.length >= 5) state.recentBoards.pop()
            state.recentBoards = state.recentBoards.filter(currBoard =>
                currBoard._id !== board._id)
            state.recentBoards.unshift(board)
        },
        addBoard(state, { savedBoard }) {
            state.boards.push(savedBoard);
        },

        loadBoards(state, { boards }) {
            state.boards = boards
        },
    },
    actions: {
        async loadCurrBoard(context, { boardId }) {
            try {
                const currBoard = await boardService.getById(boardId)
                context.commit({ type: 'setCurrBoard', currBoard })
                socketService.emit('watch board', currBoard._id)
                socketService.off(SOCKET_ON_BOARD_UPDATE)
                socketService.on(SOCKET_ON_BOARD_UPDATE, (updatedBoard) => {
                    context.commit({ type: 'setCurrBoard', currBoard: updatedBoard })
                })
                return JSON.parse(JSON.stringify(currBoard))
            }
            catch (err) {
                console.error('Cannot load currBoard: ', err);
                context.dispatch({ type: 'flashUserMsg', msg: 'Oops! Cannot load selected board...', style: 'warning' })
            }
            finally {
                context.commit({ type: 'setIsLoading', loadingStatus: false })
            }
        },
        async saveCurrBoard(context, { boardToSave }) {
            const boardUnchanged = context.getters.currBoard
            try {
                context.commit({ type: 'setCurrBoard', currBoard: boardToSave })
                const currBoard = await boardService.save(boardToSave)
                socketService.emit('board update', boardToSave)
                context.dispatch({ type: 'flashUserMsg', msg: `Board ${currBoard._id} saved successfully`, style: 'success' })
                return currBoard
            }
            catch (err) {
                context.commit({ type: 'setCurrBoard', currBoard: boardUnchanged })
                console.error(`Cannot save board ${context.getters.currBoard._id}: `, err)
                context.dispatch({ type: 'flashUserMsg', msg: `Oops! Cannot save board ${context.getters.currBoard._id}...`, style: 'warning' })
            }
            finally {
                context.commit({ type: 'setIsLoading', loadingStatus: false })
            }
        },
        async updateGroup(context, { groupToSave }) {
            context.commit({ type: 'setIsLoading', loadingStatus: true })
            try {
                const board = context.getters.currBoard
                if (groupToSave.id) {
                    const idx = board.groups.findIndex(g => g.id === groupToSave.id)
                    board.groups.splice(idx, 1, groupToSave)
                } else {
                    groupToSave.id = utilService.makeId()
                    board.groups.push(groupToSave)
                }
                const currBoard = await context.dispatch({ type: 'saveCurrBoard', boardToSave: board })
                socketService.emit('board update', board)
                return currBoard
            }
            catch (err) {
                console.error(`Cannot save group ${context.getters.currBoard._Id}: `, err)
                context.dispatch({ type: 'flashUserMsg', msg: `Oops! Cannot save board ${context.getters.currBoard._id}...`, style: 'warning' })
            }
            finally {
                context.commit({ type: 'setIsLoading', loadingStatus: false })
            }
        },
        async copyGroup(context, { groupToSave }) {
            context.commit({ type: 'setIsLoading', loadingStatus: true })
            try {
                groupToSave.id = utilService.makeId()
                const board = context.getters.currBoard
                board.groups.push(groupToSave)
                return await context.dispatch({ type: 'saveCurrBoard', boardToSave: board })
            }
            catch (err) {
                console.error(`Cannot save group ${context.getters.currBoard._Id}: `, err)
                context.dispatch({ type: 'flashUserMsg', msg: `Oops! Cannot save board ${context.getters.currBoard._Id}...`, style: 'warning' })
            }
            finally {
                context.commit({ type: 'setIsLoading', loadingStatus: false })
            }
        },
        async getEmptyBoard(context) {
            context.commit({ type: 'setIsLoading', loadingStatus: true })
            try {
                return boardService.getEmptyBoard()
            }
            catch {
                console.error(`Cannot get empty board: `, err)
                context.dispatch({ type: 'flashUserMsg', msg: `Oops! Cannot initiate a new board...`, style: 'warning' })
            }
            finally {
                context.commit({ type: 'setIsLoading', loadingStatus: false })
            }
        },
        async loadCurrTask({ commit, getters }, { groupId, taskId }) {
            const currBoard = getters.currBoard
            const groupIdx = currBoard.groups.findIndex(g => g.id === groupId)
            const currTaskIdx = currBoard.groups[groupIdx].tasks.findIndex(t => t.id === taskId)
            commit({ type: 'setCurrTask', groupIdx, currTaskIdx })
        },
        async getTaskById({ getters }, { groupId, taskId }) {
            const currBoard = getters.currBoard
            const currGroup = currBoard.groups.find(g => g.id === groupId)
            const currTask = currGroup.tasks.find(t => t.id === taskId)
            return currTask
        },
        async saveTask(context, { groupId, taskToSave }) {
            const boardToSave = context.getters.currBoard
            const currGroup = boardToSave.groups.find(g => g.id === groupId)
            if (!taskToSave.id) {
                debugger
                taskToSave.id = utilService.makeId()
                taskToSave.createdAt = Date.now()
                currGroup.tasks.push(taskToSave)
            } else {
                const taskIdx = currGroup.tasks.findIndex(t => t.id === taskToSave.id)
                currGroup.tasks[taskIdx] = taskToSave
            }
            return context.dispatch({ type: 'saveCurrBoard', boardToSave })
        },
        async removeTask(context, { groupId, taskId }) {
            const boardToSave = context.getters.currBoard
            const currGroup = boardToSave.groups.find(g => g.id === groupId)
            const taskIdx = currGroup.tasks.findIndex(t => t.id === taskId)
            currGroup.tasks.splice(taskIdx, 1)
            return await context.dispatch({ type: 'saveCurrBoard', boardToSave })
        },
        async removeGroup(context, { group }) {
            const boardToSave = context.getters.currBoard
            const idx = boardToSave.groups.findIndex(g => g.id === group.id)
            boardToSave.groups.splice(idx, 1)
            const board = await context.dispatch({ type: 'saveCurrBoard', boardToSave })
            return board
        },
        async getBoardById(context, { boardId }) {
            try {
                return await boardService.getById(boardId)
            } catch (err) {
                console.log('Cannot get board', boardId, ',', err);
                throw err;
            }
        },
        async loadBoards({ commit }) {
            try {
                var boards = await boardService.query()
                const user = userService.getLoggedinUser()
                boards = boards.filter(board => board.createdBy._id == user._id)
                commit({ type: 'loadBoards', boards })
                return boards
            }
            catch (err) {
                console.log('Cannot load boards', err);
                throw err;
            }
        },
        async updateLabel(context, { label }) {
            const currBoard = context.getters.currBoard
            const idx = currBoard.labels.findIndex(l => l.id === label.id)
            currBoard.labels[idx] = label
            return await context.dispatch({ type: 'saveCurrBoard', boardToSave: currBoard })

        }

    }
}