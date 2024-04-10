---
title: Overview of Azure Communication Services email
titleSuffix: An Azure Communication Services concept article
description: Learn about the concepts of using Azure Communication Services to send email.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Overview of Azure Communication Services email

Email continues to be a key customer engagement channel globally for businesses. Businesses rely heavily on email communication for seamless business operations.

Azure Communication Services offers an intelligent communication platform to enable businesses to build engaging business-to-consumer (B2C) experiences. Azure Communication Services facilitates high-volume transactional, bulk, and marketing emails. It supports application-to-person (A2P) use cases.

Azure Communication Services can simplify the integration of the email capability in your applications by using production-ready email SDK options. It also supports SMTP commands.

Azure Communication Services email enables rich collaboration in communication modalities. It combines with SMS and other communication channels to build collaborative applications to help reach your customers in their preferred communication channel.

With Azure Communication Services, you can speed up your market entry with scalable and reliable email features by using your own SMTP domains. As with other communication channels, when you use Azure Communication Services to send email, you pay for only what you use.

[!INCLUDE [Survey Request](../../includes/survey-request.md)]

## Key principles

- **Easy onboarding** steps for adding the email capability to your applications.
- **High-volume sending** support for A2P use cases.
- **Custom domain** support to enable emails to send from email domains that your domain providers verified.
- **Reliable delivery** status on emails sent from your application in near real time.
- **Email analytics** to measure the success of delivery, with a detailed breakdown of engagement tracking.
- **Opt-out** handling support to automatically detect and respect opt-outs managed in a suppression list.
- **SDKs** to add rich collaboration capabilities to your applications.
- **Security and compliance** to honor and respect data-handling and privacy requirements that Azure promises to customers.

## Key features

- **Azure-managed domain**: Customers can send mail from the pre-provisioned domain (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net`).
- **Custom domain**: Customers can send mail from their own verified domain (`notify.contoso.com`).
- **Sender authentication support**: The platform enables support for Sender Policy Framework (SPF) and Domain Keys Identified Mail (DKIM) settings for both Azure-managed and custom domains. Authenticated Received Chain (ARC) support preserves the email authentication result during transitioning.
- **Email spam protection and fraud detection**: The platform performs email hygiene for all messages. It offers comprehensive email protection through Microsoft Defender components by enabling the existing transport rules for detecting malware: URL Blocking and Content Heuristic.
- **Email analytics**: The **Insights** dashboard provides email analytics. The service emits logs at the request level. Each log has a message ID and recipient information for diagnostic and auditing purposes.
- **Engagement tracking**: The platform supports bounce, blocked, open, and click tracking.

## Next steps

- [Prepare an email communication resource for Azure Communication Services](./prepare-email-communication-resource.md)
- [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)
- [Create and manage an email communication resource in Azure Communication Services](../../quickstarts/email/create-email-communication-resource.md)
- [Connect a verified email domain in Azure Communication Services](../../quickstarts/email/connect-email-communication-resource.md)

The following topics might be interesting to you:

- Familiarize yourself with the [email client library](../email/sdk-features.md).
- Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
- Learn how to send emails with [Azure-managed domains](../../quickstarts/email/add-azure-managed-domains.md).
