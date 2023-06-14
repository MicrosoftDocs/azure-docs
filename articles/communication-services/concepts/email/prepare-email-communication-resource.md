---
title:  Prepare Email Communication Resource for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Email Communication Resources and Domains.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Prepare Email Communication resource for Azure Communication Service 

Similar to Chat, VoIP and SMS modalities under the Azure Communication Services, you'll be able to send an email using Azure Communication Resource. However sending an email requires certain pre-configuration steps and you have to rely on your organization admins help setting that up. The administrator of your organization needs to,
- Approve the domain that your organization allows you to send mail from 
- Define the sender domain they'll  use as the P1 sender email address (also known as MailFrom email address) that shows up on the envelope of the email [RFC 5321](https://tools.ietf.org/html/rfc5321)
- Define the P2 sender email address that most email recipients will see on their email client [RFC 5322](https://tools.ietf.org/html/rfc5322). 
- Setup and verify the sender domain by adding necessary DNS records for sender verification to succeed.

Once the sender domain is successfully configured correctly and verified you'll able to link the verified domains with your Azure Communication Services resource and start sending emails.
 
One of the key principles for Azure Communication Services is to have a simplified developer experience. Our email platform will simplify the experience for developers and ease this back and forth operation with organization administrators and improve the end to end experience by allowing admin developers to configure the necessary sender authentication and other compliance related steps to send email and letting you focus on building the required payload.

Your Azure Administrators will create a new resource of type “Email Communication Services” and add the allowed email sender domains under this resource. The domains added under this resource type will contain all the sender authentication and engagement tracking configurations that are required to be completed before start sending emails. Once the sender domain is configured and verified, you'll able to link these domains with your Azure Communication Services resource and you can select which  of the verified domains is suitable for your application and connect them to send emails from your application.  

## Organization Admins \ Admin developers responsibility 

- Plan all the required Email Domains for the applications in the organization
- Create the new resource of type “Email Communication Services”
- Add Custom Domains or get an Azure Managed Domain.
- Perform the sender verification steps for Custom Domains
- Set up DMARC Policy for the verified Sender Domains.

## Developers responsibility 
- Connect the preferred domain to Azure Communication Service resources.
- Generate email payload and define the required
  - Email headers 
  - Body of email
  - Recipient list
  - Attachments if any
- Submits to Communication Services Email API.
- Verify the status of Email delivery.

## Next steps

* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../email/sdk-features.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
