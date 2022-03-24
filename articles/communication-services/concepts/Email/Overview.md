---
title: Email as Service Overview in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services Email concepts.
author: bashan
manager: shanhen
services: azure-communication-services

ms.author: bashan
ms.date: 02/15/2022
ms.topic: overview
ms.service: azure-communication-services
ms.custom: private_preview
---
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

# Email Overview


Azure Communication Services Email is a new primitive that facilitates high volume transactional, bulk and marketing emails on the Azure Communication Services platform and will enable Application-to-Person (A2P) use cases. Azure Communication Services Email is going to simplify the integration of email capabilities to your applications using production-ready email SDK options. Email enables rich collaboration in communication modalities combining with SMS and other communication channels to build collaborative application to help reach your customers in their preferred communication channel.

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

## Key Features
Key features include:

- **Azure Managed Domain** - Customers will be able to send mail from the pre-provisioned domain (<-guid->.azurecomm.net) 
- **Custom Domain** - 	Customers will be able to send mail from the domain(notify.contoso.com) where mail from domain will also from the verified domain (notify.contoso.com).
- **Sender Authentication Support** - 	Platform Enables support for SPF and DKIM settings for both Azure managed and Custom Domains with ARC (Authenticated Received Chain) support which preserves the Email authentication result during transitioning.

- **Email Spam Protection and Fraud Detection** - 
	Platform performs email hygiene for all messages and offers comprehensive email protection leveraging Microsoft Defender components by enabling the existing transport rules for detecting Malwares, URL Blocking and Content Heuristic. 
- **Email Analytics** -	 Email Analytics through Azure Insights. To meet GDPR requirements we will emit logs at the request level which will contain messageId and recipient information for diagnostic and auditing purposes. 
- **Engagement Tracking** - 	Bounce, Blocked, Open and Click Tracking.


## Next steps


> [Understanding Email Domains in Azure Communication Services](./Understanding-email-domain-setup.md)

> [Get started with Creating Email Communication Resource](../../quickstarts/Email/create-email-communication-resource.md)

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/Email/connect-email-communication-acs-resource.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../Email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/Email/add-custom-verified-domains.md)
- How to send emails with Azure Communication Service managed domains?[Add Azure Managed domains](../../quickstarts/Email/add-azure-managed-domains.md)
