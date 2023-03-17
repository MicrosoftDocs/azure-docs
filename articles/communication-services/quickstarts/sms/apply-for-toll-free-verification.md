---
title: Apply for a toll-free verification
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
# Quickstart: Apply for Toll-Free Verification

## Prerequisites

- [An active Communication Services resource.](../create-communication-resource.md)
- Toll-free number 

## Submit a toll-free verification
To begin toll-free verification, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="./media/apply-for-short-code/manage-phone-azure-portal-start1.png"alt-text="Screenshot showing a Communication Services resource's main page.":::

## Apply for a toll-free verification
Navigate to the Regulatory Documents blade in the resource menu and click on "Add" button to launch the toll-free verification application wizard. For detailed guidance on how to fill out the program brief application check the [toll-free verification filling guidelines](../../concepts/sms/toll-free-verification-guidelines.md). 


A toll-free verification application consists of the following five sections:
### Application Type
You will first need to choose country/region and toll-free numbers you would like to get verified. If you have not acquired a toll-free number, then you will need to first acquire the number and then come back to this application. If you have selected more than 1 toll-free number to verify, you need to provide justification on how the multiple numbers will be used for the campaign. 

### Contact Details
This section requires you to provide information about your company and point of contact in the case we need additional information for this application.

:::image type="content" source="./media/apply-for-short-code/contact-details.png" alt-text="Screenshot showing contact details section.":::

### Program Content
This section requires you to provide description of the SMS campaign, opt-in method (how you plan to get consent from the customer to receive SMS), and screenshots of the selected opt-in method.  

:::image type="content" source="./media/apply-for-short-code/program-details.png" alt-text="Screenshot showing program details section.":::


### Volume Details
This section requires you to provide an estimate of the number of messages you plan on sending per month.

:::image type="content" source="./media/apply-for-short-code/volume.png" alt-text="Screenshot showing volume details section.":::

### Template Information
This section captures sample messages related to your campaign. Provide samples of each type of message you will be sending out to recipients.

:::image type="content" source="./media/apply-for-short-code/templates-01.png" alt-text="Screenshot showing template 1 details section.":::

### Review 
Once completed, review the toll-free verification details and submit the completed application through the Azure Portal. 

:::image type="content" source="./media/apply-for-short-code/review.png" alt-text="Screenshot showing template details section.":::
 
This program brief will now be automatically sent to the toll-free messaging aggregator for review. The toll-free aggregator will then review the details of the toll-free verification application, a process that can typically take between 5-6 weeks. Once they approve the application, you'll be notified via application status change in the Azure portal. You can now start sending and receiving messages with low filtering on this toll-free number for your messaging programs.

## Next steps

> [!div class="nextstepaction"]
> [Check guidelines for filling a short code program brief application](../../concepts/sms/toll-free-verification-guidelines.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS SDK](../../concepts/sms/sdk-features.md)