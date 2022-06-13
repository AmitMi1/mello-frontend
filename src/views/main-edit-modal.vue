<template>
    <section
        v-clickoutside="closeModal"
        class="main-edit-modal"
        :style="{ 'top': posCorrected.y + 'px', 'left': posCorrected.x + 'px' }"
        ref="elModal"
    >
        <header class="edit-modal-header">
            <span class="modal-header-title">{{ modalTitle }}</span>
            <button class="exit-btn" @click="closeModal"></button>
        </header>
        <main class="edit-modal-main" :style="{ 'max-height': maxHeight + 'px' }">
            <slot></slot>
        </main>
    </section>
</template>

<script>
export default {
    name: 'main-edit-modal',
    props: {
        modalTitle: String,
        pos: Object,
    },
    mounted() {
        const resizeObserver = new ResizeObserver(() => {
            this.correctPosition()
        });
        resizeObserver.observe(this.$refs.elModal);

        this.$emit('mounted')
    },
    data() {
        return {
            posCorrected: (this.pos)? JSON.parse(JSON.stringify(this.pos)): {x: 0, y: 0},
            maxHeight: (window.innerHeight || document.documentElement.clientHeight)
        }
    },
    methods: {
        closeModal() {
            this.$emit('editModalClosed')
        },
        correctPosition() {
            if (!this.$refs.elModal || !this.pos) return
            const pos = JSON.parse(JSON.stringify(this.pos))
            const elArea = this.$refs.elModal.getBoundingClientRect()
            const viewPortSize = {
                h: (window.innerHeight || document.documentElement.clientHeight),
                w: (window.innerWidth || document.documentElement.clientWidth)
            }

            if (pos.x < 0) pos.x = 20
            if (pos.x + elArea.width > viewPortSize.w) {
                pos.x = viewPortSize.w - elArea.width - 20
            }

            this.maxHeight = viewPortSize.h
            if (pos.y + elArea.height > viewPortSize.h) {
                pos.y = viewPortSize.h - elArea.height - 20
            }

            if (pos.y < 20) {
                pos.y = 20
                this.maxHeight = viewPortSize.h - 80
            }

            this.posCorrected = pos
        }
    },
    computed: {
        position() {
            return this.$refs.elModal
        },
        elheight() {
            if (!this.$refs.elModal) return
            return this.$refs.elModal.getBoundingClientRect().height
        }
    },
    watch: {

    },
    unmounted() {
        this.$emit('unmounted')
    }

}
</script>

<style>
</style>