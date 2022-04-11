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

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Create the Azure Managed Domain.   
    - (Option 1) Click the **1-click add** button under **Add a free Azure subdomain**. Move to the next step.
    ![image](https://user-images.githubusercontent.com/35741731/162805148-27db800c-67ed-45ce-968e-4e4a58ee88ae.png)

    - (Option 2) Click **Provision Domains** on the left navigation panel.
    ![image](https://user-images.githubusercontent.com/35741731/162805308-f94c6014-f500-41b5-a7e8-5129aa8e465b.png)

    - Click **Add domain** on the upper navigation bar.
    - Select **Azure domain** from the dropdown.
3. Wait for the deployment to complete.

![image](https://user-images.githubusercontent.com/35741731/162805570-d2e7d767-132d-4e07-98c3-4b1a6f8b6b85.png)

4. After domain creation is completed, you will see a list view with the created domain.
![image](https://user-images.githubusercontent.com/35741731/162805744-2e0cd43c-c7f2-483a-88bb-869cb789f5cc.png)

5. Click the name of the provisioned domain. This will navigate you to the overview page for the domain resource type.
![image](https://user-images.githubusercontent.com/35741731/162805877-a1f66c24-1530-4c3b-8e8f-e7a5f7bed70a.png)

## Sender Authentication for Azure Managed Domain

Azure communication Services Email automatically configures the required email authentication protocols to set proper authentication for the email as detailed in [Email Authentication Best Practices](../../concepts/Email/email-authentication-bestpractice.md). 

Your email domain is now ready to send emails.

## Next steps

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/Email/connect-email-communication-acs-resource.md)

> [Best Practices for Sender Authentication Support in Azure Communication Services Email](./email-authentication-bestpractice.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../Email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/Email/add-custom-verified-domains.md)
