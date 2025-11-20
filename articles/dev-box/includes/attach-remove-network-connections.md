---
author: RoseHJM
ms.author: rosemalcolm
ms.date: 08/27/2025
ms.topic: include
ms.service: dev-box
---

## Attach a network connection to a dev center

You can attach existing network connections to a dev center. You must attach a network connection to a dev center before you can use it in projects to create dev box pools.

Network connections enable dev boxes to connect to existing virtual networks. The location, or Azure region, of the network connection determines where associated dev boxes are hosted.

Follow these steps to attach a network connection to a dev center in Microsoft Dev Box:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the specific dev center that you want to update.

1. Under **Dev box configuration**, select **Networking**, and then select **+ Add**:

   :::image type="content" source="../media/how-to-manage-network-connection/select-add-network-connection.png" alt-text="Screenshot that shows how to select Add to attach a network connection to a dev center.":::

1. On the **Add network connection** pane, select the network connection, and then select **Add**:

   :::image type="content" source="../media/how-to-manage-network-connection/add-network-connection.png" alt-text="Screenshot that shows the pane for selecting the network connection to add.":::

After you attach a network connection, the Azure portal runs several health checks on the network. You can view the status of the checks on the resource overview page:

:::image type="content" source="../media/how-to-manage-network-connection/network-connection-grid-populated.png" alt-text="Screenshot that shows the status of the network connections attached to the dev center.":::

You can add network connections that pass all health checks to a dev center and use them to create dev box pools. Dev boxes within dev box pools are created and domain-joined in the location of the virtual network assigned to the network connection.

To resolve any errors, see [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Remove a network connection from a dev center

Follow these steps to remove an attached network connection from a dev center.

> [!NOTE]
> If a network connection is in use by one or more dev centers, the connection can't be removed.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that has the connection you want to remove.

1. Under **Dev box configuration**, select **Networking**.

1. Select the network connection that you want to remove, and then select **Remove**:

   :::image type="content" source="../media/how-to-manage-network-connection/remove-network-connection.png" alt-text="Screenshot that shows how to remove a selected network connection attached to a dev center.":::

1. Review the warning message, and then select **OK**.

After you remove a network connection, it's no longer available for use in dev box pools within the dev center.
