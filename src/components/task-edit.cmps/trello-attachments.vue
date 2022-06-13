<template>
    <section class="trello-attachments">
        <div class="section-title text-m icon-attachment">Attachments</div>
        <ul class="attachments clean-list">
            <li
                class="flex align-center"
                v-for="(attachment, attachmentIdx) in attachments"
                :key="attachment.asset_id"
            >
                <img
                    class="img-preview"
                    :src="attachment.secure_url"
                    :alt="attachment.original_filename"
                />
                <p class="file-details">
                    <span
                        class="attachment-name"
                    >{{ attachment.original_filename + '.' + attachment.format }}</span>
                    <span class="attachment-addedAt">Added at {{ formatCreatedAt(attachment) }}</span>
                    <span class="attachment-delete">
                        <a href="#" @click.prevent="openDeleteModal($event, attachmentIdx)">Delete</a>
                    </span>
                    <span class="attachment-edit-name">
                        <a href="#" @click.prevent="openNameModal($event, attachmentIdx)">Edit</a>
                    </span>
                    <span class="attachment-make-cover">
                        <a href="#" @click.prevent="makeCover(attachmentIdx)">Make-cover</a>
                    </span>
                </p>
            </li>
        </ul>
        <button class="btn" @click="openEditModal">Add an attachment</button>
        <Teleport v-if="isDeleteContentTeleported && isEditModalMounted" to=".teleport-container">
            <p class="msg">Deleting an attachment is permanent. There is no undo.</p>
            <button @click="removeAttachment" class="delete-btn btn">Delete</button>
        </Teleport>
    </section>
</template>

<script>
import format from 'date-fns/format'


export default {
    name: 'trello-attachments',
    props: {
        attachments: Array,
        isEditModalMounted: Boolean
    },
    data() {
        return {
            attachmentToEditIdx: NaN,
            isDeleteContentTeleported: false,
            isNameContentTeleported: false,
        }
    },
    methods: {
        removeAttachment() {
            this.updatedAttachments.splice(this.attachmentToEditIdx, 1)
            this.$emit('updated', this.updatedAttachments)
            this.$emit('editModalClosed')
        },
        openEditModal(event) {
            this.$emit('editModalOpened', event)
        },
        openDeleteModal(event, attachmentIdx) {
            this.attachmentToEditIdx = attachmentIdx
            this.isDeleteContentTeleported = true
            this.$emit('teleportContainerOpened', event)
        },
        openNameModal(event, attachmentIdx) {
            this.attachmentToEditIdx = attachmentIdx
            this.isNameContentTeleported = true
            this.$emit('teleportContainerOpened', event)
        },
        formatCreatedAt(attachment) {
            const createdAt = new Date(attachment.created_at).getTime()
            return format(createdAt, 'MMM d') + ' at ' + format(createdAt, 'HH:MM')
        }

    },
    computed: {
        updatedAttachments() {
            return JSON.parse(JSON.stringify(this.attachments))
        }
    },
    watch: {
        isEditModalMounted(val) {
            if (!val) {
                this.isDeleteContentTeleported = false
                this.isNameContentTeleported = false
            }
        }
    }

}
</script>

<style>
</style>