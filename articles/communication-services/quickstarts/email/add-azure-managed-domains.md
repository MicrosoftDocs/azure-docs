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

In this quick start, you learn how to provision the Azure Managed Domain to Email Communication Service in Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Communication Services Email Resource created and ready to add the domains. See [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md).

## Azure Managed Domains compared to Custom Domains

Before provisioning an Azure Managed Domain, review the following table to decide which domain type best meets your needs.

| | [Azure Managed Domains](./add-azure-managed-domains.md) | [Custom Domains](./add-custom-verified-domains.md) | 
|---|---|---|
|**Pros:** | - Setup is quick & easy<br/>- No domain verification required<br /> | - Emails are sent from your own domain |
|**Cons:** | - Sender domain is not personalized and cannot be changed<br/>- Sender usernames can't be personalized<br/>- Very limited sending volume<br />- User Engagement Tracking can't be enabled <br /> | - Requires verification of domain records <br /> - Longer setup for verification |


## Provision Azure Managed Domain

1. Open the Overview page of the Email Communications Service resource that you created in [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md).
2. Create an Azure Managed Domain using one of the following options.
    - (Option 1) Click the **1-click add** button under **Add a free Azure subdomain**. Continue to **step 3**.
    
    :::image type="content" source="./media/email-add-azure-domain.png" alt-text="Screenshot that highlights the adding a free Azure Managed Domain.":::

    - (Option 2) Click **Provision Domains** on the left navigation panel.
    
    :::image type="content" source="./media/email-add-azure-domain-navigation.png" alt-text="Screenshot that shows the Provision Domains navigation page.":::

    - Click **Add domain** on the upper navigation bar.
    - Select **Azure domain** from the dropdown.
    
3. Wait for the deployment to complete.
 
    :::image type="content" source="./media/email-add-azure-domain-progress.png" alt-text="Screenshot that shows the Deployment Progress." lightbox="media/email-add-azure-domain-progress-expanded.png":::

4. Once the domain is created, you see a list view with the new domain.

    :::image type="content" source="./media/email-add-azure-domain-created.png" alt-text="Screenshot that shows the list of provisioned email domains." lightbox="media/email-add-azure-domain-created-expanded.png":::

5. Click the name of the provisioned domain to open the overview page for the domain resource type.

    :::image type="content" source="./media/email-azure-domain-overview.png"  alt-text="Screenshot that shows Azure Managed Domain overview page." lightbox="media/email-azure-domain-overview-expanded.png":::

## Sender authentication for Azure Managed Domain

Azure Communication Services automatically configures the required email authentication protocols for the email as described in [Email Authentication best practices](../../concepts/email/email-authentication-best-practice.md). 

**Your email domain is now ready to send emails.**

## Next steps

* [Quickstart: How to connect a verified email domain](../../quickstarts/email/connect-email-communication-resource.md)

* [How to send an email using Azure Communication Service](../../quickstarts/email/send-email.md)

## Related articles

* Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
* Learn how to send emails with custom verified domains in [Quickstart: How to add custom verified email domains](../../quickstarts/email/add-custom-verified-domains.md)
