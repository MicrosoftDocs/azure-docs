---
title: Quickstart - Create and manage Email Communication Service resource in Azure Communication Service
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create and manage your first Azure Email Communication Services resource.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart - Create and manage Email Communication Service resource in Azure Communication Service

 
Get started with Email by provisioning your first Email Communication Services resource. Communication services resources can be provisioned through the [Azure portal](https://portal.azure.com/) or with the .NET management client library. The management client library and the Azure portal allow you to create, configure, update and delete your resources and interface with [Azure Resource Manager](../../../azure-resource-manager/management/overview.md), Azure's deployment and management service. All functionality available in the client libraries is available in the Azure portal. 

## Create the Email Communications Service resource using portal

1. Navigate to the [Azure portal](https://portal.azure.com/) to create a new resource.
2. Search for Email Communication Services and hit enter. Select **Email Communication Services** and press **Create**

   :::image type="content" source="./media/email-communication-search.png" alt-text="Screenshot that shows how to search Email Communication Service in market place.":::

   :::image type="content" source="./media/email-communication-create.png" alt-text="Screenshot that shows Create link to create Email Communication Service.":::

3. Complete the required information on the basics tab:
    - Select an existing Azure subscription.
    - Select an existing resource group, or create a new one by clicking the **Create new** link.
    - Provide a valid name for the resource. 
    - Select **United States** as the data location.
    - If you would like to add tags, click  **Next: Tags** 
      - Add any name/value pairs. 
    - Click **Next: Review + create**.
    
      :::image type="content" source="./media/email-communication-create-review.png" alt-text="Screenshot that shows how to the summary for review and create Email Communication Service.":::

4. Wait for the validation to pass. Click **Create** 
5. Wait for the Deployment to complete. Click **Go to Resource** will land on Email Communication Service Overview Page.

   :::image type="content" source="./media/email-communication-overview.png" alt-text="Screenshot that shows the overview of Email Communication Service resource.":::

## Next steps

* [Email domains and sender authentication for Azure Communication Services](../../concepts/email/email-domain-and-sender-authentication.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains?[Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
