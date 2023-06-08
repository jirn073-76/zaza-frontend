<template>
    <n-space vertical>
        <n-steps size="small" :current="currentRef" :status="currentStatus">
            <n-step title="Payment Recieved"
                description="We recieved the payment, but further processing needs to happen." />
            <n-step title="Payment Confirmed" description="The Payment was confirmed." />
            <n-step title="Payment Unlocked" description="The Payment was successfully unlocked. Game starts now." />
        </n-steps>
        <n-space>
            <!-- <n-button-group>
          <n-button @click="prev">
            <template #icon>
              <n-icon>
                <md-arrow-round-back />
              </n-icon>
            </template>
          </n-button>
          <n-button @click="next">
            <template #icon>
              <n-icon>
                <md-arrow-round-forward />
              </n-icon>
            </template>
          </n-button>
        </n-button-group> -->
            <!-- <n-radio-group v-model:value="currentStatus" size="medium" name="size">
          <n-radio-button value="error">
            Error
          </n-radio-button>
          <n-radio-button value="process">
            Process
          </n-radio-button>
          <n-radio-button value="wait">
            Wait
          </n-radio-button>
          <n-radio-button value="finish">
            Finish
          </n-radio-button>
        </n-radio-group> -->
        </n-space>
    </n-space>
</template>
  
<script>
import { defineComponent, ref } from "vue";
import { MdArrowRoundBack, MdArrowRoundForward } from "@vicons/ionicons4";

export default defineComponent({
    components: {
        MdArrowRoundBack,
        MdArrowRoundForward
    },
    setup() {
        const currentRef = ref(1);
        const next = () => {
            // if (currentRef.value === null)
            //     currentRef.value = 1;
            // else if (currentRef.value >= 4)
            //     currentRef.value = null;
            // else
            //     currentRef.value++;
            
            //     return "Raasclatt"
            currentRef.value++;
        }
        // prev() {
        //     if (currentRef.value === 0)
        //         currentRef.value = null;
        //     else if (currentRef.value === null)
        //         currentRef.value = 4
        //     else
        //         currentRef.value--;
        // }
        return {
            currentStatus: ref("process"),
            current: currentRef,
            currentRef,
            next
        };
    }
});
</script>