---
title: Enable managed identity for a namespace
description: Learn how to enable a system-assigned or user-assigned managed identity for an Azure Event Hubs namespace. 
ms.topic: how-to
ms.date: 01/29/2025
# Customer intent: As a developer or administrator, I want to learn how to enable managed identity for an Azure Event Hubs namespace. 
---

# Enable managed identity for an Azure Event Hubs namespace
This article shows you how to enable a managed identity for an Azure Event Hubs namespace. The identity can be either a system-assigned managed identity or a user-assigned managed identity. 

## Enable system-assigned managed identity for a namespace
Here are the steps to enable a system-assigned managed identity for an Event Hubs namespace by using the Azure portal.

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Event Hubs namespace. 
1. On the **Event Hubs namespace** page, select **Identity** on the left menu.
1. On the **Identity** page, confirm that you are on the **System assigned** tab.
1. For the **Status** field, select **On**.
1. Select **Save** the command bar. 

    :::image type="content" source="./media/enable-managed-identity/system-assigned-identity.png" alt-text="Screenshot that shows the Identity page for an Event Hubs namespace with system-assigned managed identity enabled." lightbox="./media/enable-managed-identity/system-assigned-identity.png":::
1. In the Pop-up window, select **Yes**. 

    :::image type="content" source="./media/enable-managed-identity/system-assigned-identity-enable.png" alt-text="Screenshot that shows the popup window to enable the system-assigned identity.":::


## Enable user-assigned managed identity for a namespace
Here are the steps to enable a user-assigned managed identity for an Event Hubs namespace by using the Azure portal.

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. If you didn't create a user-assigned identity already, create one by following instructions from: [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).
1. In the Azure portal, navigate to your Event Hubs namespace. 
1. On the **Event Hubs namespace** page, select **Identity** on the left menu.
1. Switch to the **User assigned** tab, and select **+ Add** on the command bar. 

    :::image type="content" source="./media/enable-managed-identity/user-assigned-add-button.png" alt-text="Screenshot that shows the User assigned tab." lightbox="./media/enable-managed-identity/user-assigned-add-button.png":::    
1. In the **Add user assigned identity** pane, search for and select a user-assigned identity, and then select **Add**.

    :::image type="content" source="./media/enable-managed-identity/select-user-assigned-identity.png" alt-text="Screenshot that shows the selection of a user assigned identity." :::    

## Related content
After you enable managed identity for your Event Hubs namespace, grant the identity appropriate role on a target resource. For example, if you want to enable capturing of event data on an event hub using a managed identity, the managed identity should be added to the **Storage Blob Data Contributor** role on the Azure storage or Data Lake Store account. For more information on using identities for capturing event data, see [Authenticate modes for capturing events to destinations in Azure Event Hubs](event-hubs-capture-managed-identity.md). 