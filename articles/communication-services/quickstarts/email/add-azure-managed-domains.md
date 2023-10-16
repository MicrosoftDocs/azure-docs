---
title: How to add Azure Managed Domains to Email Communication Service
titleSuffix: An Azure Communication Services quick start guide
description: Learn about adding Azure Managed domains for Email Communication Services.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: How to add Azure Managed Domains to Email Communication Service

In this quick start, you learn about how to provision the Azure Managed domain in Azure Communication Services to send email.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)

## Azure Managed Domains vs. Custom Domains

Before provisioning an Azure Managed Domain, review the following table to determine which domain type is most appropriate for your particular use case.

| | [Azure Managed Domains](./add-azure-managed-domains.md) | [Custom Domains](./add-custom-verified-domains.md) | 
|---|---|---|
|**Pros:** | - Setup is quick & easy<br/>- No domain verification required<br /> | - Emails are sent from your own domain |
|**Cons:** | - Sender domain is not personalized and cannot be changed | - Requires verification of domain records <br /> - Longer setup for verification |


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

5. Click the name of the provisioned domain, which navigates you to the overview page for the domain resource type.

    :::image type="content" source="./media/email-azure-domain-overview.png"  alt-text="Screenshot that shows Azure Managed Domain overview page." lightbox="media/email-azure-domain-overview-expanded.png":::

## Sender authentication for Azure Managed Domain
Azure communication Services Email automatically configures the required email authentication protocols to set proper authentication for the email as detailed in [Email Authentication best practices](../../concepts/email/email-authentication-best-practice.md). 

## Changing MailFrom and FROM display name for Azure Managed Domain

You can optionally configure your MailFrom address to be something other than the default DoNotReply, and also add more than one sender username to your domain. To understand how to configure your sender address, see how to [add multiple sender addresses](add-multiple-senders.md).

> [!NOTE]
> Azure Managed Domains facilitate developers in rapidly initiating application development. Once your application is prepared for deployment, you can seamlessly integrate your custom domain. It's crucial to note that if you continue to rely on Azure Managed Domains, the MailFrom Address displayed in the recipient's mailbox will differ from what you observe in the Portal. This address is dynamically generated, dependent on the data location. As an illustration, if the data location is set to the US, the received email address will transform into 'donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.US1.azurecomm.net'.

**Your email domain is now ready to send emails.**

## Next steps

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

* [How to send an email using Azure Communication Service](../../quickstarts/email/send-email.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
