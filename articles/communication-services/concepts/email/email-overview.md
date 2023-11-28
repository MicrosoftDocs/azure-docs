---
title: Email as service overview in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Email concepts.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Email in Azure Communication Services

Azure Communication Services offers an intelligent communication platform to enable businesses to build engaging B2C experiences. Email continues to be a key customer engagement channel globally for businesses and they rely heavily on email communication for seamless business operations. Email as Service in Azure Communication Services facilitates high volume transactional, bulk and marketing emails on the Azure Communication Services platform and supports Application-to-Person (A2P) use cases. Azure Communication Services Email is going to simplify the integration of email capabilities to your applications using production-ready email SDK options and also supports SMTP commands. Email enables rich collaboration in communication modalities combining with SMS and other communication channels to build collaborative applications to help reach your customers in their preferred communication channel.

Azure Communication Services Email offers will improve your time-to-market with scalable, reliable email capabilities with your own SMTP domains. Like other communication modalities Email offering has the benefit of only paying for what you use.

## Key principles of Azure Communication Services Email
Key principles of Azure Communication Services Email Service include:

- **Easy Onboarding** steps for adding Email capability to your applications.
- **High Volume Sending** support for A2P (Application to Person) use cases.
- **Custom Domain** support to enable emails to send from email domains that are verified by your Domain Providers.
- **Reliable Delivery** status on emails sent from your application in near real-time.
- **Email Analytics** to measure the success of delivery, richer breakdown of  Engagement Tracking.
- **Opt-Out** handling support to automatically detect and respect opt-outs managed in our suppression list.
- **SDKs** to add rich collaboration capabilities to your applications.
- **Security and Compliance** to honor and respect data handling and privacy requirements that Azure promises to our customers. 

## Key features
Key features include:

- **Azure Managed Domain** - Customers will be able to send mail from the pre-provisioned domain (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net) 
- **Custom Domain** - 	Customers will be able to send mail from their own verified domain(notify.contoso.com).
- **Sender Authentication Support** - 	Platform Enables support for SPF(Sender Policy Framework) and DKIM(Domain Keys Identified Mail) settings for both Azure managed and Custom Domains with ARC (Authenticated Received Chain) support which preserves the Email authentication result during transitioning.
- **Email Spam Protection and Fraud Detection** - Platform performs email hygiene for all messages and offers comprehensive email protection leveraging Microsoft Defender components by enabling the existing transport rules for detecting malware's, URL Blocking and Content Heuristic. 
- **Email Analytics** -	 Email Analytics through Azure Insights. To meet GDPR requirements we will emit logs at the request level which will contain messageId and recipient information for diagnostic and auditing purposes. 
- **Engagement Tracking** - Bounce, Blocked, Open and Click Tracking.

## Next steps

* [What is Email Communication Communication Service](./prepare-email-communication-resource.md)

* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../email/sdk-features.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
