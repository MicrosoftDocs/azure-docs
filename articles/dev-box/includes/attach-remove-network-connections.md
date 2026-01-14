---
author: RoseHJM
ms.author: rosemalcolm
ms.date: 11/19/2025
ms.topic: include
ms.service: dev-box
---

## Attach and remove network connections

Network connections enable dev boxes to connect to existing virtual networks. The location or Azure region of the network connection determines where associated dev boxes are hosted.

If you have an existing network connection you want to use with Microsoft Dev Box, you must attach it to a dev center before you can use it for dev box projects and pools. You can attach multiple network connections to a dev center.

### Attach a network connection to a dev center

To attach a network connection to a dev center:

1. In the [Azure portal](https://portal.azure.com), go to the page for the dev center you want to attach the network connection to.
1. On the dev center page, select **Networking** under **Dev box configuration** in the left navigation menu.
1. On the **Networking** page, select **Add**.

   :::image type="content" source="../media/how-to-manage-network-connection/select-add-network-connection.png" alt-text="Screenshot that shows how to select Add to attach a network connection to a dev center.":::

1. On the **Add network connection** pane, select the network connection you want to use, and then select **Add**:

   :::image type="content" source="../media/how-to-manage-network-connection/add-network-connection.png" alt-text="Screenshot that shows the pane for selecting the network connection to add.":::

After you attach the network connection, the Azure portal runs several health checks on the network. You can view the status of the checks on the dev center **Networking** page.

:::image type="content" source="../media/how-to-manage-network-connection/network-connection-grid-populated.png" alt-text="Screenshot that shows the status of the network connections attached to the dev center.":::

If all the health checks pass, the network connection is added to the dev center and you can select it when you create dev box pools. Dev boxes in the pools are created and domain-joined in the virtual network location assigned to the network connection.

To address health check errors and issues, see [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

### Remove a network connection from a dev center

Follow these steps to remove an attached network connection from a dev center.

> [!NOTE]
> If the network connection is in use by one or more dev centers, you can't remove it.

1. In the [Azure portal](https://portal.azure.com), select the dev center that has the connection you want to remove.
1. On the dev center page, select **Networking** under **Dev box configuration** in the left navigation menu.
1. Select the network connection you want to remove and then select **Remove**.

   :::image type="content" source="../media/how-to-manage-network-connection/remove-network-connection.png" alt-text="Screenshot that shows how to remove a selected network connection attached to a dev center.":::

1. Respond **OK** to the confirmation message.

After you remove a network connection, it's no longer available for use by dev box pools in the dev center.
