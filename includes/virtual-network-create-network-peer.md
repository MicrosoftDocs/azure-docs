---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 06/17/2024
 ms.author: allensu
 ms.custom: include file
---

## Create virtual network peer

Use the following steps to create a two way network peer between **vnet1** and **vnet2**.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-1**.

1. In **Settings** select **Peerings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    |---|---|
    | **Remote virtual network summary** |  |
    | Peering link name | Enter **vnet-2-to-vnet-1**. |
    | Virtual network deployment model | Leave the default of **Resource Manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-2**. |
    | **Remote virtual network peering settings** |  |
    | Allow 'vnet-2' to access 'vnet-1' | Leave the default of selected.  |
    | Allow 'vnet-2' to receive forwarded traffic from 'vnet-1' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-2' to forward traffic to 'vnet-1' | Leave the default of cleared. |
    | Enable 'vnet-2' to use 'vnet-1's' remote gateway or route server | Leave the default of cleared. |
    | **Local virtual network peering summary** |  |
    | Peering link name | Enter **vnet-1-to-vnet-2**. |
    | **Local virtual network peering settings** |  |
    | Allow 'vnet-1' to access 'vnet-2' | Leave the default of selected. |
    | Allow 'vnet-1' to receive forwarded traffic from 'vnet-2' | Select the checkbox. |
    | Allow gateway or route server in 'vnet-1' to forward traffic to 'vnet-2' | Leave the default of cleared. |
    | Enable 'vnet-1' to use 'vnet-2's' remote gateway or route server | Leave the default of cleared. |

    :::image type="content" source="./media/virtual-network-create-network-peer/add-peering.png" alt-text="Screenshot of Add peering in the Azure portal.":::

1. Select **Add**.

