---
title: Adding Azure Managed domains for Email Communication Services
titleSuffix: An Azure Communication Services quick start guide
description: Learn about adding Azure Managed domains for Email Communication Services.
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

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/Email/create-email-communication-resource.md)

## Provision Azure Managed Domain
- Go the overview page of the Email Communications Service resource
- Adding Azure Manged Domain
    - Click the 1-click add button under Add a free Azure subdomain. 
    - Or 
        - Click Domains on the left navigation panel.
        - Click Add domain on the upper navigation bar. 
        - Select Azure domain from the dropdown.
- Wait for email domain provisioning to complete 
- After domain creation is completed, you will see a list view with the created domain.
- Click the name of the provisioned domain. This will navigate you to the overview page for the domain resource type.

## Email Authentication for Azure Managed Domain

Azure communication Services Email automatically configures the required email authentication protocols to set proper authentication for the email as detailed in [Email Authentication Best Practices](../../concepts/Email/email-authentication-bestpractice.md). 

Your email domain is now ready to send emails.

## Next steps

> [!div class="nextstepaction"]
> [Understanding Email Domains in Azure Communication Services](../../concepts/Email/Understanding-email-domain-setup.md)

> [Get started with Creating Email Communication Resource](../../quickstarts/Email/create-email-communication-resource.md)

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/Email/connect-email-communication-acs-resource.md)
