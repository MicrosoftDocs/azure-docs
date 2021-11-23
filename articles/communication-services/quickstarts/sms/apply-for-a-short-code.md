---
title: Apply for a short code
titleSuffix: An Azure Communication Services quickstart 
description: Learn about how to apply for a short code
author: prakulka
manager: shahen
services: azure-communication-services

ms.author: prakulka
ms.date: 11/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
---
# Quickstart: Apply for a short code

> [!IMPORTANT]
> Short code availability is currently restricted to Azure enterprise subscriptions that have a billing address in the United States and Communication Services resources that have a US data location. Short code cannot be acquired on trial accounts or using Azure free credits. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [An active Communication Services resource.](../../create-communication-resource.md)

## Get a short code
To begin provisioning a short code, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

## Apply for a short code
Navigate to the Short Codes blade in the resource menu and click on Get button to launch the short code program brief application wizard. 

The wizard on short codes blade will walk you through a series of questions about the program as well as a description of content which helps carriers review and approve your short code program brief. For detailed guidance on how to fill the program brief application please check [program brief filling guidelines](TO BE ADDED)

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

Short Code Program Brief registration requires details about your messaging program, including the user experience (e.g., call to action, opt-in, opt-out, and message flows) and information about your company. This information helps mobile carriers ensure that your program meets the CTIA (Cellular Telecommunications Industry Association) guidelines as well as regulatory requirements. A short code Program Brief application consists of the following 4 sections:
 
### Program Details 
You will first need to provide program name and choose the country/region where you would like to provision the phone number. 

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

#### Select short code type
Configuring your short code is broken down into two steps:
- The selection of short code type
- The selection of the short code features

You can select from two short code types: Random, and Vanity. If you select a random short code, you will get a short code that is randomly selected by the U.S. Common Short Codes Association (CSCA). If you select a vanity short code, you are required to input a prioritized list of vanity short codes that you’d like to use for your program. The alternatives in the list will be used if the first short code in your list is not available to lease. Example: 123456, 123457, 123458. You can look up the list of available short codes in the [US Short Codes Directory](https://usshortcodedirectory.com/).

When you’ve selected a number type, you can then choose the message type, and target date.  Short code registration with carriers usually takes 8-12 weeks, so this target date should be selected considering this registration period.

In our example, we’ve selected a Vanity short code with SMS feature.

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

> [!Note]
> Azure Communication Service currently only supports SMS. Please check [roadmap](TO BE ADDED) for MMS launch.

#### Enter program information
This section requires you to provide details about your program such as recurrence of the program, messaging content, type and description of program, privacy policy, and terms of the program.

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

### Contact Details
This section requires you to provide information about your company and customer care in the case that end users need help or support with the program. 

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

### Volume Details
This section requires you to provide an estimate of the number of messages you plan on sending per user per month and the disclose any expected traffic spikes as part of the program.

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

### Template Information
This section captures sample messages related to opt-in, opt-out, and other message flows.


:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::


Once completed, review the Program Brief information provided and submit the completed application through the Azure Portal. 
 
This program brief will now be automatically sent to the Azure Communication Services’ service desk for review. The service desk specifically is looking to ensure that the provided information is in the right format before sending to all US mobile carriers for approval. The carriers will then review the details of the short code program, a process that can typically take between 8-12 weeks. Once carriers approve the program brief, you will be notified via email. You can now start sending and receiving messages on this short code for your messaging programs.

## Find your short code on the Azure Portal
Navigate to your Azure Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

Select the Short Codes blade in the resource menu to manage your short codes.

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

## Troubleshooting
Common questions and issues:
- Purchasing short codes is supported in the US only. To purchase phone numbers, ensure that:
  - The associated Azure subscription billing address is located in the United States. You cannot move a resource to another subscription at this time.
  - Your Communication Services resource is provisioned in the United States data location. You cannot move a resource to another data location at this time.
- Short codes release is not supported currently.

## Next steps

> [!div class="nextstepaction"]
> [Check guidelines for filling a short code program brief application](../../concepts/sms/program-brief-guidelines.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md)

