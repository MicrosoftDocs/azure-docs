---
title: Email Pricing 
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Email pricing.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: private_preview
---
# Email Pricing in Azure Communication Services

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

### Email Price

Email offers pay-as-you-go pricing. The price is based on number of messages sent to the reciepient and amount of data transfered to each recipient which includes headers, message content (including text and images), and attachments.
Messages can be sent to one more recipeints.


|Email Send |Data Transferred|
|------------|------------|
|0.00025/email   | $0.00012/MB|

### Pricing example: A user of the Communication Services Virtual Visit Solution sends Appointment Reminder 

Alice is managing virtual visit solution for all the patients. Alice will be schdueling the visit and sends email invites to all patients reminding about their upcoming visit. 

Alice sends an Email of 1 MB Size to 100 patients every day and pricing for 30 days would be

100 emails x 30 = 3000 Emails x 0.00025 = $0.75 USD

1 MB x 100 x 30 = 3000 MB x 0.00012 = $0.36 USD

