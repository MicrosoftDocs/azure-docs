---
title: Quickstart - Create and manage Email resources in Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create and manage your first Azure Email Communication Services resource.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: private_preview
---
# Quickstart - Create and manage Email resources in Azure Communication Services
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).
 
Get started with Email by provisioning your first Email Communication Services resource. Communication services resources can be provisioned through the [Azure portal](https://portal.azure.com) or with the .NET management client library. The management client library and the Azure portal allow you to create, configure, update and delete your resources and interface with [Azure Resource Manager](../../../azure-resource-manager/management/overview.md), Azure's deployment and management service. All functionality available in the client libraries is available in the Azure portal. 

Create the Email Communications Service Resource using Portal
--------------------------

1. Navigate to the [Azure Portal](https://portal.azure.com/) to create a new resource.
2. Search for Email Communication Services and hit enter. Select **Email Communication Services** and press **Create**.

   :::image type="content" source="./media/email-comm-search.png" alt-text="Search Email Communication Service":::

   :::image type="content" source="./media/email-comm-create.png" alt-text="Create Email Communication Service":::

3. Complete the required information on the basics tab:
    - Select an existing Azure subscription.
    - Select an existing resource group, or create a new one by clicking the **Create new** link.
    - Provide a valid name for the resource. 
    - Select **United States** as the data location.
    - If you would like to add tags, click  **Next: Tags**. 
      - Add any name/value pairs. 
    - Click **Next: Review + create**.
    
      :::image type="content" source="./media/email-comm-create-review.png" alt-text="Review and Create Email Communication Service":::

4. Wait for the validation to pass. Click **Create**. 
5. Wait for the Deployment to complete. Click **Go to Resource** will land on Email Communication Service Overview Page.

   :::image type="content" source="./media/email-comm-overview.png" alt-text="Overview of Email Communication Service":::

## Next steps

> [Best Practices for Sender Authentication Support in Azure Communication Services Email](../../concepts/email/email-authentication-bestpractice.md)

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/email/connect-email-communication-acs-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Communication Service managed domains?[Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)


 

