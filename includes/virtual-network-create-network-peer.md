---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 10/13/2023
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
    | **This virtual network** |  |
    | Peering link name | Enter **vnet-1-to-vnet-2**. |
    | Allow 'vnet-1' to access 'vnet-2' | Leave the default of selected.  |
    | Allow 'vnet-1' to receive forwarded traffic from 'vnet-2' | Select the checkbox. |
    | Allow gateway in 'vnet-1' to forward traffic to 'vnet-2' | Leave the default of cleared. |
    | Enable 'vnet-1' to use 'vnet-2' remote gateway | Leave the default of cleared. |
    | **Remote virtual network** |  |
    | Peering link name | Enter **vnet-2-to-vnet-1**. |
    | Virtual network deployment model | Leave the default of **Resource Manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-2**. |
    | Allow 'vnet-2' to access 'vnet-1' | Leave the default of selected.  |
    | Allow 'vnet-2' to receive forwarded traffic from 'vnet-1' | Select the checkbox. |
    | Allow gateway in 'vnet-2' to forward traffic to 'vnet-1' | Leave the default of cleared. |
    | Enable 'vnet-2' to use 'vnet-1's' remote gateway | Leave the default of cleared. |

    :::image type="content" source="./media/virtual-network-create-network-peer/add-peering.png" alt-text="Screenshot of Add peering in the Azure portal.":::

1. Select **Add**.

