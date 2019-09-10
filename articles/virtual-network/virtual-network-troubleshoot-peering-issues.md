---
title: Troubleshoot virtual network peering issues
description: Steps to help resolve most virtual network peering issues.
services: virtual-network
documentationcenter: na
author: v-miegge
manager: dcscontentpm
editor: ''

ms.assetid: 1a3d1e84-f793-41b4-aa04-774a7e8f7719
ms.service: virtual-network
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/28/2019
ms.author: kaushika

---

# Troubleshoot virtual network peering issues

This troubleshooting guide provides steps to help you resolve most [virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) issues.

![IMAGE](./media/virtual-network-troubleshoot-peering-issues/4489538_en_1.png)

## Scenario 1: Configure virtual network peering between two virtual networks

Are the virtual networks in the same subscription or in different subscriptions?

### Connection Type 1: The virtual networks are in the same subscription

To configure virtual network peering for the virtual networks that are in the same subscription, use the methods that are provided in the following articles, as appropriate:

* If the virtual networks are in the **same region**, follow the steps to [create a peering for virtual networks in the same subscription](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#create-a-peering).
* If the virtual networks are in the **different regions**, follow the steps to set up [global virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview).  

**Note:** Connectivity won't work over Global VNet Peering for the following resources: 

   * VMs behind Basic ILB SKU
   * Redis Cache (uses Basic ILB SKU)
   * Application Gateway (uses Basic ILB SKU)
   * Scale Sets (uses Basic ILB SKU)
   * Service Fabric clusters (uses Basic ILB SKU)
   * SQL Always-on (uses Basic ILB SKU)
   * App Service Environments (ASE) (uses Basic ILB SKU)
   * API Management (uses Basic ILB SKU)
   * Azure Active Directory Domain Service (ADDS) (uses Basic ILB SKU)

For more information, see the [requirements and constraints](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#requirements-and-constraints) of global peering.

### Connection Type 2: The virtual networks are in different subscriptions or AD tenants

To configure virtual network peering for virtual networks in different subscriptions or Active Directory tenants, follow the steps in [Create peering in different subscriptions for Azure CLI](https://docs.microsoft.com/azure/virtual-network/create-peering-different-subscriptions#cli).

**Note:** To configure network peering, you must have **Network Contributor** permissions in both subscriptions. For more information, see [Peering permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering%23permissions).

## Scenario 2: Configure virtual network peering with Hub-spoke topology that uses on-premises resources

![IMAGE](./media/virtual-network-troubleshoot-peering-issues/4488712_en_1a.png)

### Connection Type 1: For site-to-site connection or ExpressRoute connection

Follow the steps in: [Configure VPN gateway transit for virtual network peering](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-peering-gateway-transit?toc=/azure/virtual-network/toc.json).

### Connection Type 2: For point-to-site connections

1. Follow the steps in: [Configure VPN gateway transit for virtual network peering](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-peering-gateway-transit?toc=/azure/virtual-network/toc.json).
2. After virtual network peering is established or changed, the point-to-site package must be downloaded and installed again in order for the point-to-site clients to get the updated routes to the spoke virtual network.

## Scenario 3: Configure virtual network peering with Hub-spoke topology for Azure Virtual Network

![IMAGE](./media/virtual-network-troubleshoot-peering-issues/4488712_en_1b.png)

### Connection Type 1: The virtual networks are in the same region

You must configure a Network Virtual Appliance (NVA) in the hub virtual network and have user-defined routes with next hop "Network Virtual Appliance" applied in the spoke virtual networks. For more information, see [Service chaining](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#service-chaining).

**Note:** If you require help to set up an NVA, [contact the NVA vendor](https://support.microsoft.com/help/2984655/support-for-azure-market-place-for-virtual-machines).

For help with troubleshooting the NVA device setup and routing, see [Network virtual appliance issues in Azure](https://docs.microsoft.com/azure/virtual-network/virtual-network-troubleshoot-nva).

### Connection Type 2: The virtual networks are in different regions

Transit over Global VNet Peering is now supported. Connectivity does not work over Global VNet Peering for the following resources:

* VMs behind Basic ILB SKU
* Redis Cache (uses Basic ILB SKU)
* Application Gateway (uses Basic ILB SKU)
* Scale Sets (uses Basic ILB SKU)
* Service Fabric clusters (uses Basic ILB SKU)
* SQL Always-on (uses Basic ILB SKU)
* App Service Environments (ASE) (uses Basic ILB SKU)
* API Management (uses Basic ILB SKU)
* Azure Active Directory Domain Service (ADDS) (uses Basic ILB SKU)

To learn more about Global Peering requirements and restraints, see [Virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#requirements-and-constraints).

## Scenario 4: I have a connectivity issue between two peered virtual networks

Sign-in to the [Azure portal](https://portal.azure.com/) with an account that has the necessary [roles and permissions](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#roles-permissions). Select the virtual network, select **Peering**, then check the **Status** field. What is the status?

### Connection Type 1: The peering status shows 'Connected'

To troubleshoot the issue, follow these steps:

1. Check the network traffic flows:

   Use [Connection Troubleshoot](https://docs.microsoft.com/azure/network-watcher/network-watcher-connectivity-overview) and [IP flow verify](https://docs.microsoft.com/azure/network-watcher/network-watcher-ip-flow-verify-overview) from the source VM to the destination VM to determine whether there is an NSG or UDR that is causing interference in traffic flows.

   If you're using a firewall or NVA appliance, follow these steps: 
   1. Document the UDR parameters so that you can restore them after this step is completed.
   2. Remove the UDR from the source VM subnet or NIC that points to the NVA as the next hop. Verify connectivity from source VM directly to the destination that is bypassing the NVA. If this step works, refer to the [NVA troubleshooter](https://docs.microsoft.com/azure/virtual-network/virtual-network-troubleshoot-nva).

2. Take a network trace: 
   1. Start a network trace on the destination VM. For Windows, you can use **Netsh**. For Linux, use **TCPDump**.
   2. Run **TcpPing** or **PsPing** from the source to the destination IP.

   * This is an example of a **TcpPing** command: `tcping64.exe -t <destination VM address> 3389`

   3. After the **TcpPing** is complete, stop the network trace on the destination.
   4. If packets arrive from the source, there is no networking issue. Examine both the VM firewall and the application listening on that port to locate the configuration issue.

   **Note:** You can't connect to the following resource types over global virtual network peering (virtual networks in different regions):

   * VMs behind Basic ILB SKU
   * Redis Cache (uses Basic ILB SKU)
   * Application Gateway (uses Basic ILB SKU)
   * Scale Sets (uses Basic ILB SKU)
   * Service Fabric clusters (uses Basic ILB SKU)
   * SQL Always-on (uses Basic ILB SKU)
   * App Service Environments (ASE) (uses Basic ILB SKU)
   * API Management (uses Basic ILB SKU)
   * Azure Active Directory Domain Service (ADDS) (uses Basic ILB SKU)

For more information, see the [requirements and constraints](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#requirements-and-constraints) of global peering.

### Connection Type 2: The Peering status shows 'Disconnected'

You must delete peerings from both VNets and re-create them.

## Scenario 5: I have a connectivity issue between a Hub-Spoke virtual network and on-premises resource

Do you use a third-party NVA or VPN gateway?

### Connection Type 1: My network uses a third-party NVA or VPN gateway

To troubleshoot connectivity issues that affect a third-party NVA or VPN gateway, see the following articles:

* [NVA troubleshooter](https://docs.microsoft.com/azure/virtual-network/virtual-network-troubleshoot-nva)
* [Service chaining](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#service-chaining)

### Connection Type 2: My network does not a third-party NVA or VPN gateway

Do both the hub and spoke virtual networks have a VPN gateway?

#### Both the hub and spoke virtual networks have a VPN gateway

Using a remote gateway isn't supported.

Because of a VNet Peering limitation, **Use Remote Gateway** isn't supported on the spoke VNet if the Spoke VNet already has a VPN gateway.

#### Both the hub and spoke virtual networks don't have a VPN gateway

For site-to-site or ExpressRoute connections, check these primary causes of connectivity issues to the remote virtual network from on-premises.

* Verify that the **Allow forwarded traffic** check box is selected on the virtual network that has a gateway.
* Verify that the **Use remote gateway** check box is selected on the virtual network that does not have a gateway.
* Have your network administrator check your on-premises devices to verify that they all have the remote virtual network address space added.

For Point-to-Site connections:

* Verify that the **Allow forwarded traffic** check box is selected on the virtual network that has a gateway.
* Verify that the **Use remote gateway** check box is selected on the virtual network that does not have a gateway.
* Download and install the Point-to-Site client package again. Virtual network routes that are newly peered don't automatically add routes to Point-to-Site clients.

## Scenario 6: I have a Hub-Spoke network connectivity issue between spoke virtual networks in the same region

You must have an NVA in a hub network, configure UDRs in spokes that have an NVA set as the next hop, and enable **Allow Forwarded Traffic** in the hub virtual network.

For more information, see [Service chaining](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#service-chaining), and discuss these requirements with the [NVA vendor](https://support.microsoft.com/help/2984655/support-for-azure-market-place-for-virtual-machines) of your choice.

## Scenario 7: I have a Hub-Spoke network connectivity issue between spoke virtual networks in different regions

Transit over Global VNet Peering is now supported. Connectivity won't work over Global VNet Peering for the following resources:

* VMs behind Basic ILB SKU
* Redis Cache (uses Basic ILB SKU)
* Application Gateway (uses Basic ILB SKU)
* Scale Sets (uses Basic ILB SKU)
* Service Fabric clusters (uses Basic ILB SKU)
* SQL Always-on (uses Basic ILB SKU)
* App Service Environments (ASE) (uses Basic ILB SKU)
* API Management (uses Basic ILB SKU)
* Azure Active Directory Domain Service (ADDS) (uses Basic ILB SKU)

For more information, see the [requirements and constraints](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview#requirements-and-constraints) of global peering, and [Different VPN Topologies](https://blogs.msdn.microsoft.com/igorpag/2016/02/11/hubspoke-daisy-chain-and-full-mesh-vnet-topologies-in-azure-arm-v2/).

## Scenario 8: I have a Hub-Spoke network connectivity issue between a web app and the spoke virtual network

To troubleshoot this issue, follow these steps:

1. Sign-in to the Azure portal. Go to the web app, select **networking**, and then select **VNet Integration**.
2. Check whether you can see the remote virtual network. Manually input the remote virtual network address space (**Sync Network** and **Add Routes**).

For more information, see the following articles:

* [Integrate your app with an Azure Virtual Network](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet)
* [About Point-to-Site VPN routing](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-point-to-site-routing)

## Scenario 9: I receive an error when configuring virtual network peering

### Error 1: Current tenant '<TENANT ID>' isn't authorized to access linked subscription

To resolve this issue, follow the steps in [Create peering - Azure CLI](https://docs.microsoft.com/azure/virtual-network/create-peering-different-subscriptions#cli).

### Error 2: Not Connected

You must delete peerings from both VNets and recreate them.

### Error 3: Failed to peer a Databricks virtual network

To resolve this issue, configure the virtual network peering from the **Azure Databricks** blade, and then specify the target virtual network by using **Resource ID**. For more information, see [Peer a Databricks virtual network to a remote virtual network](https://docs.azuredatabricks.net/administration-guide/cloud-configurations/azure/vnet-peering.html#id2).
