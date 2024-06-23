---
title: Enable managed identity on Azure Event Grid system topic
description: This article describes how enable managed service identity for an Azure Event Grid system topic. 
ms.topic: how-to
ms.date: 11/02/2021
---

# Assign a system-managed identity to an Event Grid system topic
In this article, you learn how to assign a system-assigned or a user-assigned identity to an Event Grid system topic. To learn about managed identities in general, see [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).  

> [!NOTE]
> - You can assign one system-assigned identity and up to two user-assigned identities to a system topic. 
> - You can enable identities for system topics associated with global Azure resources such as Azure subscriptions, resource groups, or Azure Maps. System topics for these global sources are also not associated with a specific region.

## Enable managed identity for an existing system topic
This section shows you how to enable a managed identity for an existing system topic. 

1. Go to the [Azure portal](https://portal.azure.com).
2. Search for **event grid system topics** in the search bar at the top.
3. Select the **system topic** for which you want to enable the managed identity. 
4. Select **Identity** on the left menu.  

### Enable system-assigned identity
1. Turn **on** the switch to enable the identity. 
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-system-topic.png" alt-text="Identity page for a system topic."::: 
1. Select **Yes** on the confirmation message. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-system-topic-confirmation.png" alt-text="Assign identity to a system topic - confirmation."::: 
1. Confirm that you see the object ID of the system-assigned managed identity and see a link to assign roles. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-system-topic-completed.png" alt-text="Assign identity to a system topic - completed."::: 

### Enable user-assigned identity

1. First, create a user-assigned identity by following instructions in the [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) article. 
1. On the **Identity** page, switch to the **User assigned** tab in the right pane, and then select **+ Add** on the toolbar.

    :::image type="content" source="./media/managed-service-identity/system-topic-user-identity-add-button.png" alt-text="Image showing the Add button selected in the User assigned tab of the Identity page.":::
1. In the **Add user managed identity** window, follow these steps:
    1. Select the **Azure subscription** that has the user-assigned identity. 
    1. Select the **user-assigned identity**. 
    1. Select **Add**. 
1. Refresh the list in the **User assigned** tab to see the added user-assigned identity.

## Enable managed identity when creating a system topic

1. In the Azure portal, in the search bar, search for and select **Event Grid System Topics**. 
1. On the **Event Grid System Topics** page, select **Create** on the toolbar. 
1. On the **Basics** page of the creation wizard, follow these steps: 
    1. For **Topic Types**, select the type of the topic that supports a system topic. In the following example, **Storage Accounts** is selected. 
    2. For **Subscription**, select the Azure subscription that contains the Azure resource. 
    1. For **Resource Group**, select the resource group that contains the Azure resource. 
    1. For **Resource**, select the resource. 
    1. Specify a **name** for the system topic.
    1. Enable managed identity:
        1. To enable system-assigned identity, select **Enable system assigned identity**. 
        
            :::image type="content" source="./media/managed-service-identity/system-topic-creation-enable-managed-identity.png" alt-text="Image showing the screenshot of system topic creation wizard with system assigned identity option selected.":::            
        1. To enable user assigned identity: 
            1. Select **User assigned identity**, and then select **Add user identity**. 
        
                :::image type="content" source="./media/managed-service-identity/system-topic-creation-enable-user-identity.png" alt-text="Image showing the screenshot of system topic creation wizard with user assigned identity option selected.":::            
            1. In the **Add user managed identity** window, follow these steps:
                1. Select the **Azure subscription** that has the user-assigned identity. 
                1. Select the **user-assigned identity**. 
                1. Select **Add**.                         

> [!NOTE]
> - Currently, Azure portal doesn't allow you to assign both system assigned and user assigned identities when creating a system topic. You can assign both after the system topic is created. 
> - Currently, you can't enable a managed identity for a new system topic when creating an event subscription on an Azure resource that supports system topics. 


## Next steps
Add the identity to an appropriate role (for example, Service Bus Data Sender) on the destination (for example, a Service Bus queue). For detailed steps, see [Grant managed identity the access to Event Grid destination](add-identity-roles.md). 