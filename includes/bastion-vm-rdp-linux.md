---
author: cherylmc
ms.author: cherylmc
ms.date: 04/26/2023
ms.service: virtual-wan
ms.topic: include
---

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine that you want to connect to. On the **Overview** page, select **Connect**, then select **Bastion** from the dropdown to open the Bastion page.

   :::image type="content" source="./media/bastion-connect-vm-rdp-linux/connect.png" alt-text="Screenshot of Connect." lightbox="./media/bastion-connect-vm-rdp-linux/connect.png":::

1. On the **Bastion** page, expand the **Connection Settings** section.    If you don't see **Connection Settings**, your Bastion deployment is using the **Basic** SKU. See [Upgrade a SKU](../articles/bastion/upgrade-sku.md) for steps to upgrade.

   * Select **RDP**. 
   * If you plan to use an inbound port different from the standard RDP port (3389), enter the **Port**. 

    :::image type="content" source="./media/bastion-connect-vm-rdp-linux/connection-settings.png" alt-text="Screenshot showing port." lightbox="./media/bastion-connect-vm-rdp-linux/connection-settings.png":::

1. Enter the **Username** and **Password**, and then select **Connect** to connect to the VM. The RDP connection to this virtual machine via Bastion will open directly in the browser (over HTML5) using port 443 and the Bastion service.