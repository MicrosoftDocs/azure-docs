---
title: Email domains and sender authentication
titleSuffix: An Azure Communication Services article
description: This article describes Azure Communication Services Email Domains and Sender Authentication.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Email domains and sender authentication for Azure Communication Services

An email domain is a unique name that appears after the **@** sign-in email addresses. It typically takes the form of your organization's name and brand that is recognized in public. Using your domain in email enables users to trust that this message isn't a phishing attempt, and that it's coming from a trusted source, building credibility for your brand. If you prefer, you can use an email domain offered through the Azure Communication Services. We offer an email domain that you can use to send emails on behalf of your organization.

## Email domains and sender authentication

Email Communication Services enables you to configure email with two types of domains: **Azure Managed Domains** and **Custom Domains**. 

### Azure managed domains

Getting Azure managed Domains is one click setup. You can add a free Azure Subdomain to your email communication resource and you'll able to send emails using mail from domains like `donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net`. Your Azure Managed domain is preconfigured with required sender authentication support.

### Custom domains

In this option, you add a domain that you already own. You have to add your domain and verify the ownership to send email and then configure for required authentication support. 

### Sender authentication for domains
Email authentication (also known as email validation) is a group of standards that tries to stop spoofing (email messages from forged senders). Our email pipeline uses these standards to verify the emails that are sent. Trust in email begins with Authentication and Azure communication Services Email helps senders to properly configure the following email authentication protocols to set proper authentication for the emails.

**SPF (Sender Policy Framework)**
SPF [RFC 7208](https://tools.ietf.org/html/rfc7208) is a mechanism that allows domain owners to publish and maintain, via a standard DNS TXT record, a list of systems authorized to send email on their behalf. Azure Communication Services allows you to configure the required SPF record that needs to be added to your DNS to verify your custom domains.

**DKIM (Domain Keys Identified Mail)**
DKIM [RFC 6376](https://tools.ietf.org/html/rfc6376) allows an organization to claim responsibility for transmitting a message in a way that can be validated by the recipient. Azure Communication Services allows you to configure the required DKIM records that need to be added to your DNS to verify your custom domains.

Follow the steps [to setup sender authentication for your domain.](../../quickstarts/email/add-custom-verified-domains.md) 

### Choosing the domain type

You can choose the experience that works best for your business. You can start with development by using the Azure Managed domain and switch to a custom domain when you're  ready to launch your applications. 

## How to connect a domain to send email

Email Communication Service resources are designed to enable domain validation steps as decoupled as possible from  application integration. Application Integration linked with Azure Communication Service and each communication service can be linked with one of verified domains from Email Communication Services. Follow the steps [to connect your verified domains](../../quickstarts/email/connect-email-communication-resource.md). To switch from one verified domain to other, you need to [disconnect the domain and connect a different domain](../../quickstarts/email/connect-email-communication-resource.md).  

## Next steps

* [Best practices for sender authentication support in Azure Communication Services Email](./email-authentication-best-practice.md)

* [Create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Connect Email Communication Service with Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

## Related articles

- Familiarize yourself with the [Email client library](../email/sdk-features.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
