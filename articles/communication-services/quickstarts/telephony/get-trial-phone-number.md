---
title: Quickstart - get and manage trial phone numbers in Azure Communication Services
description: Learn how to get and use trial phone numbers in Azure Communication Services.
author: jadacampbell
ms.author: jadacampbell
ms.service: azure-communication-services
ms.topic: quickstart
ms.date: 07/19/2023
ms.custom: template-quickstart
---

# Quickstart: get and manage a trial phone number in Azure Communication Services

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

> [!NOTE]
> Trial Phone Numbers are currently only supported by Azure subscriptions with billing addresses based in the United States. For other geographies, please visit the [Subscription eligibility](../../concepts/numbers/sub-eligibility-number-capability.md) documentation to determine where you can purchase a phone number. 

Azure Communication Services provides powerful communication capabilities for developers to integrate voice, video, and SMS functionalities into their applications. One of the key features is the ability to acquire phone numbers for making and receiving calls. This quickstart guide walks you through the process of obtaining a trial phone number for Azure Communication Services. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource. [Create a Communication Services resource](../create-communication-resource.md).

## Get a trial phone number

1. Navigate to your Communication Service resource in the [Azure portal](https://portal.azure.com). 
:::image type="content" source="./media/trial-phone-numbers/trial-overview.png" alt-text="Screenshot showing a Communication Services resource's main page." lightbox="./media/trial-phone-numbers/trial-overview.png":::

2. In the Communication Services resource overview, select on the "Phone numbers" option in the left-hand menu. 
:::image type="content" source="./media/trial-phone-numbers/trial-empty.png" alt-text="Screenshot showing a Communication Services resource's phone numbers page." lightbox="./media/trial-phone-numbers/trial-empty.png":::
If you don’t have any phone numbers yet, you will see an empty list of phone numbers followed by this call to action for trial phone numbers.  
If you already have numbers for your Communication Services resource, you can also activate a trial phone number: 
:::image type="content" source="./media/trial-phone-numbers/trial-empty-with-purchased-numbers.png" alt-text="Screenshot showing a Communication Services resource's phone numbers page with already purchased numbers." lightbox="./media/trial-phone-numbers/trial-empty-with-purchased-numbers.png":::

3. Select on “Activate trial phone number”. This immediately provisions a trial phone number to your Communication Services resource. Once the trial phone number is provisioned, you can view it on the Phone numbers page. 
:::image type="content" source="./media/trial-phone-numbers/trial-activated.png" alt-text="Screenshot showing a Communication Services resource's phone numbers page with a trial phone number." lightbox="./media/trial-phone-numbers/trial-activated.png":::

## Add a verified phone number to your trial phone number
When using a trial phone number in Azure Communication Services for PSTN Calling capabilities, it is mandatory to verify the recipient phone number. This verification process ensures that the trial phone number can only make calls to the verified number. 

1. Once your trial phone number is provisioned, select the number in the Phone Numbers page and navigate to the “Trial details” tab: 
:::image type="content" source="./media/trial-phone-numbers/trial-details.png" alt-text="Screenshot showing a Communication Services resource's phone numbers page with a side panel open with the trial details tab." lightbox="./media/trial-phone-numbers/trial-details.png":::
This tab shows the current limitations on the number, including the days left to use the number, the total calling minutes, and how many verified phone numbers are attached to the trial phone number. You can find more information on the trial phone number limitations [here](../../concepts/telephony/trial-phone-numbers-faq.md).

2. Select on “Manage verified phone numbers” to start adding verified phone numbers. 
:::image type="content" source="./media/trial-phone-numbers/verified-empty.png" alt-text="Screenshot showing a side panel with an empty list of verified phone numbers." lightbox="./media/trial-phone-numbers/verified-empty.png":::

3. Select “Add” or “Verify a phone number” and enter your phone number and designated country code associated with it. This recipient phone number is verified by sending a one-time passcode (OTP) to their number either through SMS or automated voicemail. Choose the option you prefer, and then press “Next” to receive the OTP. 
:::image type="content" source="./media/trial-phone-numbers/verified-enter-number.png" alt-text="Screenshot showing a side panel with an entered phone number to verify. The radio button to text the phone number has been selected." lightbox="./media/trial-phone-numbers/verified-enter-number.png":::

4. Once the user gets the one-time-passcode (OTP), enter the code into the Portal to verify the number.  
:::image type="content" source="./media/trial-phone-numbers/verified-text-code.png" alt-text="Screenshot showing a side panel with an entered one-time passcode." lightbox="./media/trial-phone-numbers/verified-text-code.png":::

5. Once the correct OTP is entered, the phone number is verified, it should show up in the list of verified numbers that the trial number can call. 
:::image type="content" source="./media/trial-phone-numbers/verified-added.png" alt-text="Screenshot showing a side panel with an added verified phone number." lightbox="./media/trial-phone-numbers/verified-added.png"::: 

## Conclusion
Congratulations! You have successfully obtained a trial phone number for Azure Communication Services. You can now use this phone number to add voice capabilities to your applications. Explore the documentation and resources provided by Microsoft to learn more about Azure Communication Services and integrate it into your solutions. 

Remember that trial phone numbers have limitations and are intended for evaluation and development purposes. If you require production-ready phone numbers, you can upgrade your Azure Communication Services subscription and [purchase a phone number](get-phone-number.md). 


## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
> * Activate a trial phone number
> * View your trial phone number limits
> * Add a verified phone number

> [!div class="nextstepaction"]
> [Make your first outbound call with Call Automation](../call-automation/quickstart-make-an-outbound-call.md)

> [!div class="nextstepaction"]
> [Add PSTN calling in your app](pstn-call.md)

