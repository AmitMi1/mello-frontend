<template>
    <section class="labels-edit">
        <div v-if="!labelInEdit" class="all-labels">
            <input class="search" type="text" placeholder="Search labels..." v-model="filterBy" />
            <span class="secondary-section-title">Labels</span>
            <ul class="clean-list">
                <li v-for="label in labelsForDisplay" :key="label.id">
                    <div
                        class="label"
                        :class="[checkIfTaskLabel(label) ? 'selected' : '', label.class]"
                        :style="{ 'background-color': label.color }"
                        @click="toggleLabelFromTask(label)"
                    >
                        <span>{{ label.title }}</span>
                    </div>
                    <span
                        class="edit-icon"
                        @click.stop="labelInEdit = JSON.parse(JSON.stringify(label))"
                    ></span>
                </li>
            </ul>
        </div>
        <div v-else class="label-editor">
            <div
                class="label"
                :class="[checkIfTaskLabel(labelInEdit) ? 'selected' : '']"
                :style="{ 'background-color': labelInEdit.color }"
            >
            <input
                type="text"
                placeholder="Enter label name..."
                v-model="labelInEdit.title"
            />
            </div>
            <div class="controlls flex space-between align-center">
                <button class="primary-btn" @click="saveLabel">Save</button>
                <button class="btn" @click="labelInEdit = null">Cancel</button>
            </div>

        </div>
    </section>
</template>

<script>
export default {
    name: 'labels-edit',
    props: {
        currTask: Object
    },
    data() {
        return {
            filterBy: '',
            labelInEdit: null
        }
    },
    methods: {
        checkIfTaskLabel(label) {
            if (!this.taskToEdit.labelIds) return false
            return this.taskToEdit.labelIds.some(id => id === label.id)
        },
        toggleLabelFromTask(label) {
            if (!this.taskToEdit.labelIds) this.taskToEdit.labelIds = [];
            var labelIds = this.taskToEdit.labelIds
            const idx = labelIds.findIndex(id => id === label.id)
            if (idx === -1) labelIds.push(label.id)
            else labelIds.splice(idx, 1)
            this.$emit('taskUpdated', this.taskToEdit)
        },
        saveLabel(){
            this.$emit('labelUpdated', this.labelInEdit)
            this.labelInEdit = null
        }
    },
    computed: {
        labels() {
            return this.$store.getters.currBoardLabels
        },
        taskToEdit() {
            return JSON.parse(JSON.stringify(this.currTask))
        },
        labelsForDisplay() {
            return this.labels.filter(label => {
                return label.title.toLowerCase().includes(this.filterBy.toLowerCase())
            })
        }
    }
}
</script>

<style>
</style>