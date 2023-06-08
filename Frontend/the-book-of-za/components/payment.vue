<template>
    <n-card title="Set Bet and Pay" size="huge">

        <n-space>
            <n-skeleton height="100px" width="100px" v-if="isLoading">
            </n-skeleton>
            <n-image v-if="showImage" width="100" :src="qrCodeData" />
            <!-- <nuxt-img v-else class="image" :src="imgSrc" alt="Image" /> -->
            <n-input-number v-model:value="betAmount" :parse="parseCurrency" :format="formatCurrency" />
            <n-input-group>
                <n-input v-model:value="walletAddress" placeholder="Wallet Addr." :loading="isLoading" />
                <n-button type="primary" ghost>
                    <NaiveIcon name="ion:clipboard" />
                </n-button>
            </n-input-group>
            <n-button @click="info">Bet !</n-button>


            <PaymentProgress ref="paymentProgress"></PaymentProgress>

        </n-space>
    </n-card>
</template>
  
<script>
import { defineComponent, ref } from "vue";
import { useMessage, NButton, NInputGroup, NInput, NCard, NSpace, NImage, NInputNumber } from 'naive-ui'
import QRCode from 'qrcode';
import axios from 'axios'

export default defineComponent({
    components: {
        NButton,
        NInputGroup,
        NInput,
        NCard,
        NSpace,
        NImage,
        NInputNumber,
    },
    props: {
        setText: {
            type: Function,
            required: true,
        },
        winText: {
            type: Function,
            required: true,
        },
    },
    setup(props) {
        const message = useMessage()
        const walletAddress = ref('')
        const isLoading = ref(false)
        const showImage = ref(false)
        const betAmount = ref(10)
        const qrCodeData = ref('')
        const paymentProgress = ref(null)

        const info = async () => {
            isLoading.value = true

            // Simulate asynchronous operation

            isLoading.value = false
            let wallet = await axios.get('http://127.0.0.1:3001/address', { crossDomain: true })
            walletAddress.value = wallet.data.address;
            var thing = `monero:${walletAddress.value}?tx_amount=${await convertDollarsToMonero(betAmount.value)}&recipient_name=Zasino&tx_description=BetPayment`
            qrCodeData.value = await createQRCode(thing)
            showImage.value = true


            pollStatus("http://127.0.0.1:3001/outputs", 2000)

            props.setText(`Current Bet = $${betAmount.value}`)
            // Display info message
            message.info("Bet Submitted, generating wallet now.", {
                keepAliveOnHover: true
            })
            // next()
        }
        const getMoneroConversionRate = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd');
                const moneroRate = response.data.monero.usd;
                return moneroRate;
            } catch (error) {
                console.error('Failed to fetch Monero conversion rate:', error);
                return null;
            }
        };
        const next = () => {
            // console.log(paymentProgress.value)
        }

        const convertDollarsToMonero = async (dollars) => {
            const moneroRate = await getMoneroConversionRate();
            if (moneroRate) {
                const moneroAmount = dollars / moneroRate;
                return moneroAmount.toFixed(12);
            }
            return null;
        };


        async function pollStatus(url, interval) {
            let response;
            let expected_length = 0;
            do {
                try {
                    response = await axios.get(url);
                    //console.log(response)
                    // Check if the expected result is received
                    let last_element = response.data.length - 1
                    if (response.data[last_element].isConfirmed === false) {
                        paymentProgress.value.next()
                    } else if (response.data[last_element].isConfirmed === true) {
                        paymentProgress.value.next()
                        setTimeout(() => {
                            paymentProgress.value.next()
                        }, 2000)
                        return;
                    }

                    // Wait for the specified interval before polling again
                    await new Promise(resolve => setTimeout(resolve, interval));
                } catch (error) {
                    console.error('Error occurred:', error);
                }
            } while (true);
        }
        const betPaid = () => {
            setTimeout(() => {
                message.success("Payment recieved!", {
                    keepAliveOnHover: true
                })
                paymentProgress.value.next()
            }, 3500)

        }

        const createQRCode = async data => {
            const qr = await QRCode.toDataURL(data, { width: 240, height: 240, errorCorrectionLevel: 'Q' });
            return qr;
        }

        const parse = (input) => {
            const nums = input.replace(/,/g, "").trim();
            if (/^\d+(\.(\d+)?)?$/.test(nums))
                return Number(nums);
            return nums === "" ? null : Number.NaN;
        }

        const format = (value) => {
            if (value === null)
                return "";
            return value.toLocaleString("en-US");
        }

        const parseCurrency = (input) => {
            const nums = input.replace(/(,|\$|\s)/g, "").trim();
            if (/^\d+(\.(\d+)?)?$/.test(nums))
                return Number(nums);
            return nums === "" ? null : Number.NaN;
        }

        const formatCurrency = (value) => {
            if (value === null)
                return "";
            return `${value.toLocaleString("en-US")} $`;
        }

        const writeMessage = (text) => {
            message.success(text);
        };

        const mounted = async () => {
            // paymentProgress = $refs.paymentProgress
        }

        return {
            info,
            parse,
            format,
            parseCurrency,
            formatCurrency,
            walletAddress,
            isLoading,
            showImage,
            betAmount,
            writeMessage,
            qrCodeData,
            mounted,
            paymentProgress

        };
    },
});
</script>