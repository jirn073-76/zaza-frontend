<template>
            <n-skeleton height="100px" width="100px" v-if="isLoading">
            </n-skeleton>
            <n-image v-if="thisVariableDoesntWork" width="100"
                src="https://boofcv.org/images/thumb/3/35/Example_rendered_qrcode.png/400px-Example_rendered_qrcode.png" />
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMessage, NButton, NInputGroup, NInput, NCard, NSpace, NImage, NInputNumber } from 'naive-ui'

export default defineComponent({
    components: {
      //Components here
    },
    setup() {
        const isLoading = ref(false)
        const thisVariableDoesntWork = ref(false)

        const simulateLoad = () => {
            isLoading.value = true
            // Simulate asynchronous operation
            setTimeout(() => {
                isLoading.value = false
                thisVariableDoesntWork.value = true
            }, 5000)


        }
    }
    </script>