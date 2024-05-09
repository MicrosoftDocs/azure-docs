---
title: Quickstart - Create and manage Email Communication Service resource in Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: This quickstart describes how to create and manage your first Azure Email Communication Service resource.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart: Create and manage Email Communication Service resources

 
Get started with Email by provisioning your first Email Communication Service resource. Provision Email Communication Service resources through the [Azure portal](https://portal.azure.com/) or using the .NET management client library. The management client library and the Azure portal enable you to create, configure, update, and delete your resources and interface using Azure's deployment and management service: [Azure Resource Manager](../../../azure-resource-manager/management/overview.md). All functions available in the client libraries are available in the Azure portal.

## Create the Email Communications Service resource using portal

1. Open the [Azure portal](https://portal.azure.com/) to create a new resource.
2. Search for **Email Communication Services**.

   :::image type="content" source="./media/email-communication-search.png" alt-text="Screenshot that shows how to search Email Communication Service in market place.":::

1. Select **Email Communication Services** and click **Create**.

   :::image type="content" source="./media/email-communication-create.png" alt-text="Screenshot that shows Create link to create Email Communication Service.":::

4. Enter the required information in the Basics tab:
    - Select an existing Azure subscription.
    - Select an existing resource group, or create a new one by clicking the **Create new** link.
    - Provide a valid name for the resource.
    - Select the region where the resource needs to be available.
    - Select **United States** as the data location.
    - To add tags, click  **Next: Tags** 
    - Add any name/value pairs. 
    
      :::image type="content" source="./media/email-communication-create-review.png" alt-text="Screenshot that shows how to the summary for review and create Email Communication Service.":::

5. Click **Next: Review + create**.
5. Wait for the validation to pass, then click **Create**.
6. Wait for the Deployment to complete, then click **Go to Resource** to opens the Email Communication Service overview.

   :::image type="content" source="./media/email-communication-overview.png" alt-text="Screenshot that shows the overview of Email Communication Service resource.":::

## Next steps

* [Email domains and sender authentication for Azure Communication Services](../../concepts/email/email-domain-and-sender-authentication.md)

* [Quickstart: How to connect a verified email domain](../../quickstarts/email/connect-email-communication-resource.md)

## Related articles

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- Learn how to send emails with custom verified domains in [Quickstart: How to add custom verified email domains](../../quickstarts/email/add-custom-verified-domains.md)
- Learn how to send emails with Azure Managed Domains in [Quickstart: How to add Azure Managed Domains to email](../../quickstarts/email/add-azure-managed-domains.md)