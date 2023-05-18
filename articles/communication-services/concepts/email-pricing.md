---
title: Email pricing 
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Email pricing.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Email pricing in Azure Communication Services

Prices for Azure Communication Services are generally based on a pay-as-you-go model and Email offers pay-as-you-go pricing as well. The prices in the following examples are for illustrative purposes and may not reflect the latest Azure pricing.

## Email price

 The price is based on number of messages sent to the recipient and amount of data transferred to each recipient which includes headers, message content (including text and images), and attachments. Messages can be sent to one or more recipients.


|Email Send |Data Transferred|
|------------|------------|
|0.00025/email   | $0.00012/MB|

## Pricing example: A user of the Communication Services Virtual Visit Solution sends Appointment Reminders 

Alice is managing virtual visit solution for all the patients. Alice will be scheduling the visit and sends email invites to all patients reminding about their upcoming visit.

Alice sends an Email of 1 MB Size to 100 patients every day and pricing for 30 days would be

100 emails x 30 = 3000 Emails x 0.00025 = $0.75 USD

1 MB x 100 x 30 = 3000 MB x 0.00012 = $0.36 USD

## Next steps

* [What is Email Communication Services](./email/prepare-email-communication-resource.md)

* [What is Email Domains in Email Communication Services](./email/email-domain-and-sender-authentication.md)

* [Get started with creating Email Communication Resource](../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication resource with a Communication Service resource](../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](./email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Communication Service managed domains?[Add Azure Managed domains](../quickstarts/email/add-azure-managed-domains.md)
