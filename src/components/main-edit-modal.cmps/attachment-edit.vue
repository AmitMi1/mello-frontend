<template>
    <section class="attachment-edit flex column">
        <span class="secondary-section-title">Upload file</span>
        <label v-if="currStatus.isWaiting">
            <img
                class="upload-icon"
                src="../../../src/assets/Upload-PNG-Image-File.png"
                :alt="currStatus.txt"
            />
            <input class="search" type="file" v-focus @change="onUpload" />
        </label>
        <div class="status-msg flex align-center" v-else-if="currStatus.isLoading">
            <span
                class="secondary-section-title"
                :style="{ color: currStatus.txtColor }"
            >{{ currStatus.txt }}</span>
            <img class="status-icon" src="../../../src/assets/loader.gif" />
        </div>
        <div class="status-msg flex align-center" v-else-if="currStatus.isComplete">
            <span
                class="secondary-section-title"
                :style="{ color: currStatus.txtColor }"
            >{{ currStatus.txt }}</span>
            <img class="status-icon" src="../../../src/assets/checkmark-cut.gif" ref="checkmarkImg" />
        </div>
        <div class="status-msg flex align-center" v-else-if="currStatus.isFailed">
            <span
                class="secondary-section-title"
                :style="{ color: currStatus.txtColor }"
            >{{ currStatus.txt }}</span>
            <img class="status-icon" src="../../../src/assets/ezgif.com-gif-maker.gif" />
        </div>
    
    </section>
</template>

<script>
import { uploadImg } from "../../services/imgUpload.service";

export default {
    name: 'attachment-edit',
    props: {
        currTask: Object
    },
    created() {
        this.currStatus = this.statusOptions.waiting
    },
    data() {
        return {
            currStatus: null,
            statusOptions: {
                waiting: {
                    txt: "Upload file",
                    isWaiting: true
                },
                loading: {
                    txt: 'Loading...',
                    isLoading: true,
                    txtColor: '#00c2e0'
                },
                complete: {
                    txt: 'Attachment added successfuly!',
                    isComplete: true,
                    txtColor: '#61bd4f'
                },
                failed: {
                    txt: 'OOPS! File upload failed!',
                    isFailed: true,
                    txtColor: '#eb5a46'
                }
            }
        }
    },
    methods: {
        async onUpload(ev) {
            this.currStatus = this.statusOptions.loading;
            try {
                const attachment = await uploadImg(ev)
                if (!this.taskToEdit.attachments) this.taskToEdit.attachments = [];
                this.taskToEdit.attachments.push(attachment)
                this.$emit('taskUpdated', this.taskToEdit)
                this.currStatus = this.statusOptions.complete
            } catch (err) {
                this.currStatus = this.statusOptions.failed
            }
            setTimeout(() => {
                this.closeModal()
                this.$refs.checkmarkImg.src += `?v=${Date.now()}`
            }, 2000)
        },
        closeModal() {
            this.$emit('editModalClosed')
        }
    },
    computed: {
        taskToEdit() {
            return JSON.parse(JSON.stringify(this.currTask))
        }
    }
}
</script>

<style>
</style>