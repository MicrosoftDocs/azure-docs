---
title: Enable managed identity for an Azure Event Grid partner topic
description: This article describes how enable managed service identity for an Azure Event Grid partner topic. 
ms.topic: how-to
ms.date: 07/21/2022
---

# Assign a managed identity to an Azure Event Grid partner topic 
This article shows you how to use the Azure portal to assign a system-assigned or a user-assigned [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to an Event Grid partner topic. When you use the Azure portal, you can assign one system assigned identity and up to two user assigned identities to an existing partner topic.

## Navigate to your partner topic
1. Go to the [Azure portal](https://portal.azure.com).
2. Search for **event grid partner topics** in the search bar at the top.
3. Select the **partner topic** for which you want to enable the managed identity. 
4. Select **Identity** on the left menu.

## Assign a system-assigned identity
1. In the **System assigned** tab, turn **on** the switch to enable the identity. 
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/enable-identity-partner-topic/identity-existing-topic.png" alt-text="Screenshot showing the Identity page for a partner topic."::: 

## Assign a user-assigned identity
1. Create a user-assigned identity by following instructions in the [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) article. 
1. On the **Identity** page, switch to the **User assigned** tab in the right pane, and then select **+ Add** on the toolbar.

    :::image type="content" source="./media/enable-identity-partner-topic/user-assigned-identity-add-button.png" alt-text="Screenshot showing the User Assigned Identity tab":::     
1. In the **Add user managed identity** window, follow these steps:
    1. Select the **Azure subscription** that has the user-assigned identity. 
    1. Select the **user-assigned identity**. 
    1. Select **Add**. 
1. Refresh the list in the **User assigned** tab to see the added user-assigned identity.


## Next steps
Add the identity to an appropriate role (for example, Service Bus Data Sender) on the destination (for example, a Service Bus queue). For detailed steps, see [Grant managed identity the access to Event Grid destination](add-identity-roles.md). 
