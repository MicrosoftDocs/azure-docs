---
author: cherylmc
ms.author: cherylmc
ms.date: 03/19/2025
ms.service: azure-virtual-wan
ms.topic: include

# this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

### <a name="export"></a>Export and distribute a client profile

Once you have a working profile and need to distribute it to other users, you can export it using the following steps:

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Export**.

   :::image type="content" source="./media/vpn-gateway-vwan-azure-vpn-client-entra-windows/export.png" alt-text="Screenshot that shows the Azure VPN Client page, with the ellipsis selected and Export highlighted." lightbox="./media/vpn-gateway-vwan-azure-vpn-client-entra-windows/export.png":::

1. Select the location that you want to save this profile to, leave the file name as is, then select **Save** to save the xml file.

### <a name="delete"></a>Delete a client profile

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Remove**.

1. On the confirmation popup, select **Remove** to delete.