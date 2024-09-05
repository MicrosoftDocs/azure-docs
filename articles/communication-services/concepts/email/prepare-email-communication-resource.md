---
title:  Prepare an email communication resource for Azure Communication Services
titleSuffix: An Azure Communication Services concept article
description: Learn about the Azure Communication Services email resources and domains.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Prepare an email communication resource for Azure Communication Services 

Similar to Chat, VoIP, and SMS modalities under Azure Communication Services, you can send an email by using an Azure Communication Services resource. Sending an email requires certain preconfiguration steps, and you have to rely on an admin in your organization to help set that up. The admin needs to:

- Approve the domain that your organization allows you to send mail from.
- Define the sender domain for the P1 sender email address (also known as the Mail From email address) that appears on the envelope of the email. For more information, see [RFC 5321](https://tools.ietf.org/html/rfc5321).
- Define the P2 sender email address that most email recipients see on their email client. For more information, see [RFC 5322](https://tools.ietf.org/html/rfc5322).
- Set up and verify the sender domain by adding necessary DNS records for the sender verification to succeed.

One of the key principles for Azure Communication Services is to have a simplified developer experience. The service's email platform simplifies the experience for developers and eases the back-and-forth operation with organization administrators. It improves the end-to-end experience by allowing admin developers to configure the necessary sender authentication and other compliance-related steps to send email, so you can focus on building the required payload.

Your Azure admin creates a new resource of type **Email Communication Services** and adds the allowed email sender domains under this resource. The domains added under this resource type contain all the sender authentication and engagement tracking configurations that must be completed before you start sending emails.

After the sender domains are configured and verified, you can link these domains with your Azure Communication Services resource. You can select which of the verified domains is suitable for your application and connect them to send emails from your application.  

## Admin responsibilities

- Plan all the required email domains for the applications in the organization.
- Create the new email communication resource.
- Add custom domains or get an Azure-managed domain.
- Perform the sender verification steps for custom domains.
- Set up a Domain-based Message Authentication, Reporting, and Conformance (DMARC) policy for the verified sender domains.

## Developer responsibilities

- Connect the preferred domain to Azure Communication Services resources.
- Generate the email payload and define these required elements:
  - Email headers
  - Email body
  - Recipient list
  - Attachments, if any
- Submit to the Azure Communication Services Email API.
- Verify the status of email delivery.

## Next steps

- [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)
- [Create and manage an email communication resource in Azure Communication Services](../../quickstarts/email/create-email-communication-resource.md)
- [Connect a verified email domain in Azure Communication Services](../../quickstarts/email/connect-email-communication-resource.md)

The following topics might be interesting to you:

- Familiarize yourself with the [email client library](../email/sdk-features.md).
- Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
- Learn how to send emails with [Azure-managed domains](../../quickstarts/email/add-azure-managed-domains.md).
