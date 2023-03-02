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
ms.custom: private_preview, event-tier1-build-2022
---
# Quickstart: How to add Azure Managed Domains to Email Communication Service

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

In this quick start, you'll learn about how to provision the Azure Managed domain in Azure Communication Services to send email.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)

## Provision Azure Managed Domain

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Create the Azure Managed Domain.   
    - (Option 1) Click the **1-click add** button under **Add a free Azure subdomain**. Move to the next step.
    
    :::image type="content" source="./media/email-add-azure-domain.png" alt-text="Screenshot that highlights the adding a free Azure Managed Domain.":::

    - (Option 2) Click **Provision Domains** on the left navigation panel.
    
    :::image type="content" source="./media/email-add-azure-domain-navigation.png" alt-text="Screenshot that shows the Provision Domains navigation page.":::

    - Click **Add domain** on the upper navigation bar.
    - Select **Azure domain** from the dropdown.
3. Wait for the deployment to complete.
 
    :::image type="content" source="./media/email-add-azure-domain-progress.png" alt-text="Screenshot that shows the Deployment Progress." lightbox="media/email-add-azure-domain-progress-expanded.png":::

4. After domain creation is completed, you'll see a list view with the created domain.

    :::image type="content" source="./media/email-add-azure-domain-created.png" alt-text="Screenshot that shows the list of provisioned email domains." lightbox="media/email-add-azure-domain-created-expanded.png":::

5. Click the name of the provisioned domain. This will navigate you to the overview page for the domain resource type.

    :::image type="content" source="./media/email-azure-domain-overview.png"  alt-text="Screenshot that shows Azure Managed Domain overview page." lightbox="media/email-azure-domain-overview-expanded.png":::

## Sender authentication for Azure Managed Domain
Azure communication Services Email automatically configures the required email authentication protocols to set proper authentication for the email as detailed in [Email Authentication best practices](../../concepts/email/email-authentication-best-practice.md). 

## Changing MailFrom and FROM display name for Azure Managed Domain
When Azure Manged Domain is provisioned to send mail, it has default Mail From address as donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net and the FROM display name would be the same. You'll able to configure and change the Mail from address and FROM display name to more user friendly value.

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Click **Provision Domains** on the left navigation panel. You'll see list of provisioned domains.
3. Click on the Azure Manged Domain link
 
    :::image type="content" source="./media/email-provisioned-domains.png" alt-text="Screenshot that shows Azure Managed Domain link in list of provisioned email domains." lightbox="media/email-provisioned-domains-expanded.png":::
4. The navigation lands in Azure Managed Domain Overview page where you'll able to see Mailfrom and From attributes.
 
   :::image type="content" source="./media/email-provisioned-domains-overview.png" alt-text="Screenshot that shows the overview page of provisioned email domain."  lightbox="media/email-provisioned-domains-overview-expanded.png":::

5. Click on edit link on MailFrom 

    :::image type="content" source="./media/email-domains-mailfrom.png" alt-text="Screenshot that explains how to change Mail From address and display name for an email address.":::

6. You'll able to modify the Display Name and MailFrom address. 
 
    :::image type="content" source="./media/email-domains-mailfrom-change.png" alt-text="Screenshot that shows the submit button to save Mail From address and display name changes.":::

7. Click **Save**. You'll see the updated values in the overview page. 

    :::image type="content" source="./media/email-domains-overview-updated.png" alt-text="Screenshot that shows Azure Managed Domain overview page with updated values." lightbox="media/email-provisioned-domains-overview-expanded.png":::

**Your email domain is now ready to send emails.**

## Next steps

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
