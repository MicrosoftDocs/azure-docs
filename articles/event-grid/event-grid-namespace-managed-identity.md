---
title: Managed identity for Event Grid namespace
description: Describes how to enable managed identity for an Event Grid namespace
ms.topic: how-to
ms.date: 8/14/2023
author: veyaddan
ms.author: veyaddan
---

# Enabling managed identity for Event Grid namespace
In this article, you learn how to assign a system-assigned or a user-assigned identity to an Event Grid namespace. To learn about managed identities in general, see [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

> [!NOTE]
> - You can assign one system-assigned identity and up to two user-assigned identities to a namespace.

## Enable managed identity for an existing namespace
This section shows you how to enable a managed identity for an existing system topic. 

1. Go to the [Azure portal](https://portal.azure.com).
2. Search for **event grid namespace** in the search bar at the top.
3. Select the Event Grid namespace for which you want to enable the managed identity.
4. Select **Identity** under Settings on the left menu.  

### Enable system-assigned identity
1. Turn **on** the switch to enable the identity.
1. Select **Save** on the toolbar to save the setting.

    :::image type="content" source="./media/event-grid-namespace-managed-identity/event-grid-enable-managed-identity.png" alt-text="System-assigned identity page for an Event Grid namespace.":::

1. Select **Yes** on the confirmation message.

1. Confirm that you see the object ID of the system-assigned managed identity and see a link to assign roles.

    :::image type="content" source="./media/event-grid-namespace-managed-identity/event-grid-enable-managed-identity-confirmation.png" alt-text="Assigning identity to a namespace is completed.":::

### Enable user-assigned identity

1. First, create a user-assigned identity by following instructions in the [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) article.

1. On the **Identity** page, switch to the **User assigned** tab in the right pane, and then select **+ Add** on the toolbar.

    :::image type="content" source="./media/event-grid-namespace-managed-identity/event-grid-enable-user-assigned-managed-identity.png" alt-text="Image showing the Add button selected in the User assigned tab of the Identity page.":::

1. In the **Add user managed identity** window, follow these steps:
    1. Select the **Azure subscription** that has the user-assigned identity.
    1. Select the **user-assigned identity**.
    1. Select **Add**.
1. Refresh the list in the **User assigned** tab to see the added user-assigned identity.

## Enable managed identity when creating an Event Grid namespace

1. In the Azure portal, in the search bar, search for and select **Event Grid namespace**. 
1. On the **Event Grid Namespaces** page, select **Create** on the toolbar. 
1. On the **Basics** page of the creation wizard, follow these steps:
    1. Select values for subscription, resource group, location as per your preference. 
    1. Specify a name for the namespace.
    1. In the security tab, you can enable managed identity:
        1. To enable system-assigned identity, select **Enable system assigned identity**. 
        1. To enable user assigned identity: 
            1. Select **User assigned identity**, and then select **Add user identity**.
            1. In the **Add user managed identity** window, follow these steps:
                1. Select the **Azure subscription** that has the user-assigned identity.
                1. Select the **user-assigned identity**.
                1. Select **Add**.

        :::image type="content" source="./media/event-grid-namespace-managed-identity/event-grid-enable-managed-identity-create-flow.png" alt-text="Image showing the screenshot of namespace creation wizard with system assigned identity and user assigned identity options selected.":::

## Next steps
See [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md)
