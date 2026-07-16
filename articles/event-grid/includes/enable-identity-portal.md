---
 title: Enable identity for an Event Grid namespace - portal
 description: This article shows you how to enable a managed identity for an Event Grid namespace in the Azure portal.
 author: spelluru
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 06/25/2025
 ms.author: spelluru
ms.custom: include file
---

## Enable managed identity for the Event Grid namespace 

1. On the **Event Grid Namespace** page, under **Settings**, select **Identity**.
1. To enable a system assigned managed identity, select **On**.
1. Select **Save** to save the setting.

   :::image type="content" source="./media/enable-identity-portal/event-grid-enable-managed-identity.png" alt-text="Screenshot of a system-assigned identity page for an Event Grid namespace." lightbox="./media/enable-identity-portal/event-grid-enable-managed-identity.png":::

1. On the confirmation message, select **Yes**.
1. Confirm that you see the object ID of the system-assigned managed identity and see a link to assign roles.

   :::image type="content" source="./media/enable-identity-portal/event-grid-enable-managed-identity-confirmation.png" alt-text="Screenshot that shows assigning identity to a namespace is completed." lightbox="./media/enable-identity-portal/event-grid-enable-managed-identity-confirmation.png":::

   Check notifications in the Azure portal to confirm that the managed identity is enabled for the namespace.
