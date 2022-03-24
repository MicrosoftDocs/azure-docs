---
title: Email Domains and Sender Authentication overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Email Domains and Sender Authentication.
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
# Email Domains in Azure Communication Services
 
## Email Domains 
Domain is a unique name that appears after the @ sign in email addresses. It typically takes the form of your organization's name and brand that is recognized in public. Using your domains in email helps build credibility and reputation for email that you send. If you prefer to off board the managing domains  Azure Communication Services offers email domain that can be used to send emails on behalf if your applications.

Email Communication Services allows you configure email with two types of domains : **Azure Managed Domains** and **Custom Domains**. 

### Azure Managed Domains
You can add a free Azure Subdomain to your email communication resource and you will able to send emails leveraging mail from domains like donotreply@someguid.azurecomm.net. 
### Custom Domains
In this options you are adding a domain that you already own.You have to add your domain and verify the ownership to send email and then configure for required Authentication Support. 

Please follow the steps [here](../../quickstarts/Email/setup-email-authentication.md) to configure email authentication for your domain.

### Choosing the Domain type
You can choose the experience that works best for your business. You can start to use the Azure managed domain option for now and switch to a custom domain later.

## Email Authentication for Domains

Email authentication (also known as email validation) is a group of standards that tries to stop spoofing (email messages from forged senders). Our email pipeline uses these standards to verify the emails that are sent. Trust in email begins with Authentication and Azure communication Services Email helps senders to properly configure the following email authentication protocols to set proper authentication for the emails.
To Learn more on Email Authentication Best Practices click [here](./email-authentication-bestpractice.md)  

## How to connect a Domain to Send email
Email Communication Service resources are designed to enable domain validation steps as decoupled as possible from  application integration. Application Integration linked with Azure Communication Service and each communication service will be allowed to be linked with one of verified domains from Email Communication Services. Please follow the steps [here](../../quickstarts/Email/connect-email-communication-acs-resource.md) to connect your verified domains. To switch from one verified domain to other you need to follow the steps [here](../../quickstarts/Email/connect-email-communication-acs-resource.md) to disconnect the domain and connect a different domain.  

## Next steps

> [!div class="nextstepaction"]
> [Understanding Email Domains in Azure Communication Services](./Understanding-email-domain-setup.md)

> [Get started with Creating Email Communication Resource](../../quickstarts/Email/create-email-communication-resource.md)

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/Email/connect-email-communication-acs-resource.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../Email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/Email/add-custom-verified-domains.md)
- How to send emails with Azure Communication Service managed domains?[Add Azure Managed domains](../../quickstarts/Email/add-azure-managed-domains.md)
