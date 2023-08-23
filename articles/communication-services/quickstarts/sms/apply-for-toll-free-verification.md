---
title: Apply for toll-free verification
titleSuffix: An Azure Communication Services quickstart 
description: Learn about how to apply for toll-free verification
author: prakulka
manager: sundraman
services: azure-communication-services

ms.author: prakulka
ms.date: 03/16/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: mode-other
---
# Quickstart: Apply for toll-free verification
Get started with reliable SMS service using toll-free numbers by submitting a toll-free verification. Toll-free verification maximizes deliverability of messages with low to no traffic filtering.

## Prerequisites
- [An active Communication Services resource.](../create-communication-resource.md)
- [An SMS-enabled toll-free number](../telephony/get-phone-number.md)
  
### What is toll free verification?
The toll-free verification process ensures that your services running on toll-free numbers (TFNs) comply with carrier policies and [industry best practices](../../concepts/sms/messaging-policy.md). This also provides relevant service information to the downstream carriers, reduces the likelihood of false positive filtering and wrongful spam blocks. For detailed process and timelines toll-free verification process check the [toll-free verification FAQ](../../concepts/sms/sms-faq.md#toll-free-verification).

Verification is **required** for best SMS delivery experience.

## Submit a toll-free verification
To begin toll-free verification, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="./media/apply-for-toll-free-verification/manage-phone-azure-portal-start-1.png"alt-text="Screenshot showing a Communication Services resource's main page.":::

## Apply for a toll-free verification
Navigate to the Regulatory Documents blade in the resource menu and click on "Add" button to launch the toll-free verification application wizard. For detailed guidance on how to fill out the program brief application check the [toll-free verification filling guidelines](../../concepts/sms/toll-free-verification-guidelines.md). 

:::image type="content" source="./media/apply-for-toll-free-verification/regulatory-screen-1.png" alt-text="Screenshot showing Regulatory Documents Blade.":::

A toll-free verification application consists of the following five sections:
### Application type
You first need to choose country/region and toll-free numbers you would like to get verified. If you have not acquired a toll-free number, then you need to first acquire the number and then come back to this application. If you have selected more than one toll-free number to verify, you need to provide justification on how the multiple numbers are used for the campaign. 

:::image type="content" source="./media/apply-for-toll-free-verification/regulatory-screen-2.png" alt-text="Screenshot showing Application type section." lightbox="./media/apply-for-toll-free-verification/regulatory-screen-2.png":::

### Contact details
This section requires you to provide information about your company and point of contact in the case we need additional information for this application.

:::image type="content" source="./media/apply-for-toll-free-verification/regulatory-screen-3.png" alt-text="Screenshot showing contact details section." lightbox="./media/apply-for-toll-free-verification/regulatory-screen-3.png":::

### Program content
This section requires you to provide description of the SMS campaign, opt-in method (how you plan to get consent from the customer to receive SMS), and screenshots of the selected opt-in method.  

:::image type="content" source="./media/apply-for-toll-free-verification/regulatory-screen-4.png" alt-text="Screenshot showing Program content section." lightbox="./media/apply-for-toll-free-verification/regulatory-screen-4.png":::

### Volume details
This section requires you to provide an estimate of the number of messages you plan on sending per month.

:::image type="content" source="./media/apply-for-toll-free-verification/regulatory-screen-5.png" alt-text="Screenshot showing Volume details section." lightbox="./media/apply-for-toll-free-verification/regulatory-screen-5.png":::

### Template information
This section captures sample messages related to your campaign. Provide samples of each type of message you are sending out to recipients.

:::image type="content" source="./media/apply-for-toll-free-verification/regulatory-screen-6.png" alt-text="Screenshot showing Template details section." lightbox="./media/apply-for-toll-free-verification/regulatory-screen-6.png":::

### Review 
Once completed, review the toll-free verification details and submit the completed application through the Azure portal. 

:::image type="content" source="./media/apply-for-toll-free-verification/regulatory-screen-7.png" alt-text="Screenshot showing review section." lightbox="./media/apply-for-toll-free-verification/regulatory-screen-7.png":::
 
This program brief is automatically sent to the toll-free messaging aggregator for review. The toll-free aggregator then reviews the details of the toll-free verification application, a process that can typically take between 5-6 weeks. Once they approve the application, you are notified via application status change in the Azure portal. You can now start sending and receiving messages with low filtering on this toll-free number for your messaging programs.

## Next steps

> [!div class="nextstepaction"]
> [Check guidelines for filling a toll-free verification application](../../concepts/sms/toll-free-verification-guidelines.md)

> [!div class="nextstepaction"]
> [Send an SMS](../sms/send.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS SDK](../../concepts/sms/sdk-features.md)
- Familiarize yourself with the [SMS FAQ](../../concepts/sms/sms-faq.md)