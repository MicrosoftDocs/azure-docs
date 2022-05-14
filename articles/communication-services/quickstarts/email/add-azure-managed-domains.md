---
title: How to add Azure Managed Domains to Email Communication Service
titleSuffix: An Azure Communication Services quick start guide
description: Learn about adding Azure Managed domains for Email Communication Services.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: private_preview
---
# Quickstart: How to add Azure Managed Domains to Email Communication Service
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)

## Provision Azure Managed Domain

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Create the Azure Managed Domain.   
    - (Option 1) Click the **1-click add** button under **Add a free Azure subdomain**. Move to the next step.
    
    :::image type="content" source="./media/email-add-azuredomain.png" alt-text="Add a free Azure subdomain":::

    - (Option 2) Click **Provision Domains** on the left navigation panel.
    
    :::image type="content" source="./media/email-add-azuredomain-nav.png" alt-text="Navigate to Provision Domains":::

    - Click **Add domain** on the upper navigation bar.
    - Select **Azure domain** from the dropdown.
3. Wait for the deployment to complete.
 
    :::image type="content" source="./media/email-add-azuredomain-progress.png" alt-text="Deployment Progress":::

4. After domain creation is completed, you will see a list view with the created domain.

    :::image type="content" source="./media/email-add-azuredomain-created.png" alt-text="Provisioned Domains List":::

5. Click the name of the provisioned domain. This will navigate you to the overview page for the domain resource type.

    :::image type="content" source="./media/email-azuredomain-overview.png"  alt-text="Navigate to Azure Managed Domain Overview":::

## Sender authentication for Azure Managed Domain
Azure communication Services Email automatically configures the required email authentication protocols to set proper authentication for the email as detailed in [Email Authentication Best Practices](../../concepts/email/email-authentication-bestpractice.md). 

## Changing MailFrom and FROM display name for Azure Managed Domain
When Azure Manged Domain is provisioned to send mail, it has default Mail From address as donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net and the FROM display name would be the same. You will able to configure and change the Mail from address and FROM display name to more user friendly value.

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Click **Provision Domains** on the left navigation panel. You'll see list of provisioned domains.
3. Click on the Azure Manged Domain link
 
    :::image type="content" source="./media/email-provisioned-domains.png" alt-text="Click Azure Managed Domain link  in provisioned Domains":::
4. The navigation lands in Azure Managed Domain Overview page where you'll able to see Mailfrom and From attributes.
 
   :::image type="content" source="./media/email-provisioned-domains-overview.png" alt-text="Provisioned Domain Overview":::

5. Click on edit link on MailFrom 

    :::image type="content" source="./media/email-domains-mailfrom.png" alt-text="Change Mail From Address and Display Name":::

6. You will able to modify the Display Name and MailFrom address. 
 
    :::image type="content" source="./media/email-domains-mailfrom-change.png" alt-text="Submit Changes":::

7. Click **Save**. You'll see the updated values in the overview page. 

    :::image type="content" source="./media/email-domains-overview-updated.png" alt-text="Azure Managed Domain Overview":::

**Your email domain is now ready to send emails.**

## Next steps

> [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

> [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-acs-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
