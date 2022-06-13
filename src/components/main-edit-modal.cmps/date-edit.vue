<template>
    <section class="date-edit">
            <Datepicker
            AutoApply
            v-model="dueDate"
            utc inline
            :startTime="{}"
            :monthChangeOnScroll="false"
            weekStart="0"
            monthNameFormat="long">
                 <template #action-select>
                    <button class="btn-save-date" @click="selectDate">Save</button>
                </template>
            </Datepicker>
            <p v-if="currTask.dueDate" class="date-title">Due date</p>
        <pre>{{ taskDate }}</pre>
    </section>
</template>

<script>

  import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: 'date-edit',
    props: {
        currTask: Object,
    },
    components: { Datepicker },
    data() {
        return {
            startDate: null,
            dueDate: null,
            taskDate: null,
            currTaskDates: {
                startDate: null,
                endDate: null,
                endTime: null,
                date: null
            }
        }
    },
    computed: {
        taskToEdit() {
            return JSON.parse(JSON.stringify(this.currTask))
        }

    },
    mounted(){
        if(this.currTask.dueDate)
        this.dueDate = new Date(this.currTask.dueDate)
        else this.dueDate = null
    },
    methods:{
        selectDate(){
            var elDate = document.querySelector('.dp__selection_preview')
            var date = Date.parse(elDate.innerText)
            this.taskToEdit.dueDate = date
        if (this.dueDate - Date.now() < 0){
          this.taskToEdit.status = 'over-due'
        } 
      if (this.dueDate - Date.now() < 86400 * 1000) {
        this.taskToEdit.status = 'due-soon'
      }
          if (this.dueDate - Date.now() > 86400 * 1000){
            this.taskToEdit.status = 'in-progress'
          } 
            this.$emit('taskUpdated', this.taskToEdit)
        },
    },
}
</script>

<style>
</style>


