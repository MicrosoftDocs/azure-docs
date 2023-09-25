---
title: 'Tutorial: Diagnose communication problem between virtual networks - Azure portal'
titleSuffix: Azure Network Watcher
description: In this tutorial, you learn how to use Azure Network Watcher VPN troubleshoot to diagnose a communication problem between two Azure virtual networks connected by Azure VPN gateways.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: tutorial
ms.date: 07/17/2023
ms.custom: template-tutorial, engagement-fy23
# Customer intent: I need to determine why resources in a virtual network can't communicate with resources in a different virtual network over a VPN connection.
---

# Tutorial: Diagnose a communication problem between virtual networks using the Azure portal

Azure VPN gateway is a type of virtual network gateway that you can use to send encrypted traffic between an Azure virtual network and your on-premises locations over the public internet. You can also use VPN gateway to send encrypted traffic between Azure virtual networks over the Microsoft network. A VPN gateway allows you to create multiple connections to on-premises VPN devices and Azure VPN gateways. For more information about the number of connections that you can create with each VPN gateway SKU, see [Gateway SKUs](../../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku). Whenever you need to troubleshoot an issue with a VPN gateway or one of its connections, you can use Azure Network Watcher VPN troubleshoot to help you checking the VPN gateway or its connections to find and resolve the problem in easy and simple steps.

This tutorial helps you use Azure Network Watcher [VPN troubleshoot](network-watcher-troubleshoot-overview.md) capability to diagnose and troubleshoot a connectivity issue that's preventing two virtual networks from communicating with each other. These two virtual networks are connected via VPN gateways using VNet-to-VNet connections.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual networks
> * Create virtual network gateways (VPN gateways)
> * Create connections between VPN gateways
> * Diagnose and troubleshoot a connectivity issue  
> * Resolve the problem
> * Verify the problem is resolved

## Prerequisites

- An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create virtual networks

In this section, you create two virtual networks that you connect later using virtual network gateways.

### Create first virtual network

1. In the search box at the top of the portal, enter *virtual networks*. Select **Virtual networks** in the search results.

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/virtual-network-azure-portal.png" alt-text="Screenshot shows searching for virtual networks in the Azure portal.":::

1. Select **+ Create**. In **Create virtual network**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter *myVNet1*. |
    | Region | Select **East US**. |

1. Select the **IP Addresses** tab, or select **Next: IP Addresses** button at the bottom of the page.

1. Enter the following values in the **IP Addresses** tab:

    | Setting | Value |
    | --- | --- |
    | IPv4 address space | Enter *10.1.0.0/16*. |
    | Subnet name | Enter *mySubnet*. |
    | Subnet address range | Enter *10.1.0.0/24*. |

1. Select the **Review + create** tab or select the **Review + create** button at the bottom of the page.

1. Review the settings, and then select **Create**. 

### Create second virtual network

Repeat the previous steps to create the second virtual network using the following values:

| Setting | Value |
| --- | --- |
| Name | **myVNet2** |
| IPv4 address space | **10.2.0.0/16** |
| Subnet name | **mySubnet** |
| Subnet address range | **10.2.0.0/24** |

## Create a storage account and a container

In this section, you create a storage account, then you create a container in it.

If you have a storage account that you want to use, you can skip the following steps and go to [Create VPN gateways](#create-vpn-gateways).

1. In the search box at the top of the portal, enter *storage accounts*. Select **Storage accounts** in the search results.

1. Select **+ Create**. In **Create a storage account**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Storage account name | Enter a unique name. This tutorial uses **mynwstorageaccount**. |
    | Region | Select **(US) East US**. |
    | Performance | Select **Standard**. |
    | Redundancy | Select **Locally-redundant storage (LRS)**. |

1. Select the **Review** tab or select the **Review** button.

1. Review the settings, and then select **Create**.

1. Once the deployment is complete, select **Go to resource** to go to the **Overview** page of **mynwstorageaccount**.

1. Under **Data storage**, select **Containers**.

1. Select **+ Container**.

1. In **New container**, enter or select the following values then select **Create**.

    | Setting | Value |
    | --- | --- |
    | Name | Enter *vpn*. |
    | Public access level | Select **Private (no anonymous access)**. |

## Create VPN gateways

In this section, you create two VPN gateways that will be used to connect the two virtual networks you created previously.

### Create first VPN gateway

1. In the search box at the top of the portal, enter *virtual network gateways*. Select **Virtual network gateways** in the search results.

1. Select **+ Create**. In **Create virtual network gateway**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | **Instance details** |  |
    | Name | Enter *VNet1GW*. |
    | Region | Select **East US**. |
    | Gateway type | Select **VPN**. |
    | VPN type | Select **Route-based**. |
    | SKU | Select **VpnGw1**. |
    | Generation | Select **Generation1**. |
    | Virtual network | Select **myVNet1**. |
    | Gateway subnet address range | Enter *10.1.1.0/27*. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new**. |
    | Public IP address name | Enter *VNet1GW-ip*. |
    | Enable active-active mode | Select **Disabled**. |
    | Configure BGP | Select **Disabled**. |

1. Select **Review + create**.

1. Review the settings, and then select **Create**. A gateway can take 45 minutes or more to fully create and deploy.

### Create second VPN gateway

To create the second VPN gateway, repeat the previous steps you used to create the first VPN gateway with the following values:

| Setting | Value |
| --- | --- |
| Name | **VNet2GW**. |
| Virtual network | **myVNet2**. |
| Gateway subnet address range | **10.2.1.0/27**. |
| Public IP address name | **VNet2GW-ip**. |

## Create gateway connections

After creating **VNet1GW** and **VNet2GW** virtual network gateways, you can create connections between them to allow communication over secure IPsec/IKE tunnel between **VNet1** and **VNet2** virtual networks. To create the IPsec/IKE tunnel, you create two connections:

- From **VNet1** to **VNet2**
- From **VNet2** to **VNet1**

### Create first connection

1. Go to **VNet1GW** gateway.

1. Under **Settings**, select **Connections**.

1. Select **+ Add** to create a connection from **VNet1** to **VNet2**.

1. In **Add connection**, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Name | Enter *to-VNet2*. |
    | Connection type | Select **VNet-to-VNet**. |
    | Second virtual network gateway | Select **VNet2GW**. |
    | Shared key (PSK) | Enter *123*. |

1. Select **OK**.

### Create second connection

1. Go to **VNet2GW** gateway.

1. Create the second connection by following the previous steps you used to create the first connection with the following values:

    | Setting | Value |
    | --- | --- |
    | Name | **to-VNet1** |
    | Second virtual network gateway | **VNet1GW** |
    | Shared key (PSK) | **000** |

    > [!NOTE]
    > To successfully create an IPsec/IKE tunnel between two Azure VPN gateways, the connections between the gateways must use identical shared keys. In the previous steps, two different keys were used to create a problem with the gateway connections.

## Diagnose the VPN problem

In this section, you use Network Watcher VPN troubleshoot to check the two VPN gateways and their connections.

1. Under **Settings** of **VNet2GW** gateway, select **Connection**. 

1. Select **Refresh** to see the connections and their current status, which is **Not connected** (because of mismatch between the shared keys).

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/second-gateway-connections-not-connected.png" alt-text="Screenshot shows the gateway connections in the Azure portal and their not connected status.":::

1. Under **Help** of **VNet2GW** gateway, select **VPN troubleshoot**.

1. Select **Select storage account** to choose the storage account and the container that you want to save the logs to.

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/second-gateway-vpn-troubleshoot-not-started.png" alt-text="Screenshot shows vpn troubleshoot in the Azure portal before troubleshooting started.":::

1. From the list, select **VNet1GW** and **VNet2GW**, and then select **Start troubleshooting** to start checking the gateways.

1. Once the check is completed, the troubleshooting status of both gateways changes to **Unhealthy**. Select a gateway to see more details under **Status** tab.

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/gateway-unhealthy.png" alt-text="Screenshot shows the status of a gateway and results of VPN troubleshoot test in the Azure portal after troubleshooting completed.":::

1. Because the VPN tunnels are disconnected, select the connections, and then select **Start troubleshooting** to start checking them.

    > [!NOTE]
    > You can troubleshoot gateways and their connections in one step. However, checking only the gateways takes less time and based on the result, you decide if you need to check the connections.

1. Once the check is completed, the troubleshooting status of the connections changes to **Unhealthy**. Select a connection to see more details under **Status** tab.

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/connection-unhealthy.png" alt-text="Screenshot shows the status of a connection and results of VPN troubleshoot test in the Azure portal after troubleshooting completed.":::

    VPN troubleshoot checked the connections and found a mismatch in the shared keys.

## Fix the problem and verify using VPN troubleshoot

### Fix the problem

Fix the problem by correcting the key on **to-VNet1** connection to match the key on **to-VNet2** connection. 

1. Go to **to-VNet1** connection.

1. Under **Settings**, select **Shared key**.

1. In **Shared key (PSK)**, enter *123* and then select **Save**.

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/correct-shared-key.png" alt-text="Screenshot shows correcting and saving the shared key for of VPN connection in the Azure portal.":::

### Check connection status

1. Go to **VNet2GW** gateway (you can check the connections status from **VNet1GW** gateway too).

1. Under **Settings**, select **Connections**.

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/second-gateway-connections-connected.png" alt-text="Screenshot shows the gateway connections in the Azure portal and their connected status.":::

    > [!NOTE]
    > You may need to wait for a few minutes and then select **Refresh** to see the connections status as **Connected**.

### Check connection health with VPN troubleshoot

1. Under **Help** of **VNet2GW**, select **VPN troubleshoot**.

1. Select **Select storage account** to choose the storage account and the container that you want to save the logs to.

1. Select **VNet1GW** and **VNet2GW**, and then select **Start troubleshooting** to start checking the gateways

    :::image type="content" source="./media/diagnose-communication-problem-between-networks/connection-healthy.png" alt-text="Screenshot shows the status of gateways and their connections in the Azure portal after correcting the shared key.":::

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter ***myResourceGroup*** in the search box at the top of the portal. When you see **myResourceGroup** in the search results, select it.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Next steps

In this tutorial, you learned how to diagnose a connectivity problem between two connected virtual networks via VPN gateways. For more information about connecting virtual networks using VPN gateways, see [VNet-to-VNet connections](../../articles/vpn-gateway/design.md#V2V).

To learn how to log network communication to and from a virtual machine so that you can review the log for anomalies, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Log network traffic to and from a VM](network-watcher-nsg-flow-logging-portal.md)
