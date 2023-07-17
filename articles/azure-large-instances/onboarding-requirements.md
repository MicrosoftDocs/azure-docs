---
title: Onboarding requirements
description: Provides an overview of onboarding requirements for ALI.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-large-instances
ms.date: 06/01/2023
---

# ALI onboarding requirements

This article explains the actions to take after you receive an environment from the Microsoft ALI team.

## Azure portal

Use the Azure portal to:
  * Create Azure Virtual Network (or networks) and ExpressRoute Gateway or Gateways with High or Ultra Performance Reference.
  * Link them with ALI stamps using the Circuit/peer ID and Authorization Keys provided by Microsoft team.  

## VNET address space

Ensure that the VNET address space provided in your request is the same as what you configure. 

## Time sync

Setup time synchronization with NTP server.  

## Jump box

* Set up a jump box in a VM to connect to ALI stamps.
* Change the root password at first login and store password in a secure location.  

## Satellite server

Install a red hat satellite server in a VM for RHEL 8.4 and patch download.

## ALI stamps

* Validate ALI stamps and configure and patch OS based on your requirements.  
* Verify that the servers are visible on Azure portal.

  > [!Note]
  > Do *not* place large files like ALI installation bits on the boot volume. The Boot volume is small and can fill quickly, which could cause the server to hang (50 GB per OS is the boot limit).

## Secure Server IP pool address range

This IP address range is used to assign the individual IP address to ALI servers.
The recommended subnet size is a /24 CIDR block. If needed, it can be smaller, with as few as 64 IP addresses.

From this range, the first 30 IP addresses are reserved for use by Microsoft.
Make sure that you account for this when you choose the size of the range.
This range must NOT overlap with your on-premises or other Azure IP addresses.

Your corporate network team or service provider should provide an IP address range that's not currently being used inside your network.
This range is an IP address range, which must be submitted to Microsoft when asking for an initial deployment.

## Optional IP address ranges to submit to Microsoft
  
If you choose to use ExpressRoute Global Reach to enable direct routing from on-premises to ALI tenant, you must reserve another /29 IP address range.
This range may not overlap with any of the other IP addresses ranges you defined before.  

If you choose to use ExpressRoute Global Reach to enable direct routing from an ALI instance tenant in one Azure region to another ALI  tenant in another Azure region, you must reserve another /29 IP address range.
This range may not overlap with the  IP address ranges you defined before.  

## Using ExpressRoute Fast Path

You can use ExpressRoute Fast Path to access your Azure ALI servers from anywhere, Azure VMs (hub and spoke) and on-premises.

For setup instructions, see [Enable ExpressRoute Fast Path](#enable-expressroute-fast-path).

To see the learned routes from ALI, one of the options is looking at the Effective Routes table of one of your VMs, as follows:

1. In Azure portal, select any of your VMs (any connected to the Hub, or to a Spoke connected to the Hub that is connected to ALI), select **Networking**, select the network interface name, then select **Effective Routes**.

2. Make sure to enable accelerated networking with all VMs connecting to ALI. 

3. Set up ALI solution based on your system requirements and take a system backup.  
4. Take an OS backup.  
5. Set up volume groups. For more information, see [Create a volume group](./workloads/epic/create-a-volume-group.md).  
6. Set up a storage snapshot, backup, and data offload. For more information, see [Azure Large Instances NETAPP storage data protection with Azure CVO](ali-netapp-with-cvo.md).

> [!Note]
> A storage snapshot should only be set up after all data-intensive work (for example, Endian conversions) are complete in order to avoid creating unnecessary snapshots while build work is in progress

The Azure subscription you use for ALI deployments is already registered with the ALI resource provider by the Microsoft Operations team during the provisioning process.
If you don't see your deployed Azure Large Instances under your subscription, register the resource provider with your subscription. For more information, see Register the resource provider in [What is Azure Large Instances?](what-is-azure-large-instances.md)

### Enable ExpressRoute Fast Path

Before you begin, install the latest version of the Azure resource manager PowerShell cmdlets, at least 4.0 or later.
If
For more information, see these resources:

* [Azure ExpressRoute overview](https://azure.microsoft.com/products/expressroute/)

* [How to create a connection between your VPN Gateway and ExpressRoute circuit](https://learn.microsoft.com/shows/azure/expressroute-how-to-create-connection-between-your-vpn-gateway-expressroute-circuit) 


* [How to set up Microsoft peering for your ExpressRoute circuit](https://learn.microsoft.com/shows/azure/expressroute-how-to-set-up-microsoft-peering-your-expressroute-circuit)

### Authorizing  

Ensure you have an authorization key for the express route (ER) circuit used for virtual gateway connection to ER circuit. 
Also obtain ER circuit resource ID.

If you don’t have this information, obtain the details from the circuit owner. Reach out to ALI support by [creating a support ticket](work-with-ali-in-the-azure-portal.md#open-a-support-request-for-ali-instances) with the Azure Customer Support team.
### Declare variables

This example declares the variables using the values for this exercise.
Replace the values with your subscription values.

```azurecli
$Sub = "Replace_With_Your_Subscription_ID"
$RG = "Your_Resource_Group_Name"
$CircuitName="ExpressRoute Circuit Name"
$Location="Location_Name" #Example: "East US"
$GWName="VNET_Gateway_Name"
$ConnectionName=”ER Gateway Connection Name”
$Authkey="ExpressRoute Circuit Authorization Key" 
```
  
### Check the subscription for the account.
```azurecli
Get-AzSubscription  
```
### Specify the subscription that you want to use

```azurecli
Select-AzSubscription -SubscriptionId $Sub1  
```
  
### Enable ER FastPath on the gateway connection.  
```$Circuit = Get-AzExpressRouteCircuit -Name $CircuitName -ResourceGroupName $RG
$GW = Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG```
dotnetcli

```
#### Declare a variable for the gateway object

```azurecli
$gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1

Enable MSEEv2 using "ExpressRouteGatewayBypass" flag
$connection = New-AzVirtualNetworkGatewayConnection -Name $ConnectionName -ResourceGroupName $RG -ExpressRouteGatewayBypass -VirtualNetworkGateway1 $GW -PeerId $Circuit.Id -ConnectionType ExpressRoute -Location $Location -AuthorizationKey $Authkey  
```

#### Declare a variable for the Express route circuit ID

```azurecli
$id = "/subscriptions/”express route subscrioption ID”/resourceGroups/”ER resource group”/providers/Microsoft.Network/expressRouteCircuits/”circuit”  
```

#### Enable MSEEv2 using the **ExpressRouteGatewayBypass** flag

```azurecli
New-AzureRmVirtualNetworkGatewayConnection -Name "Virtual Gateway connection name" -ResourceGroupName $RG1 -Location $Location1 -VirtualNetworkGateway1 $gw -PeerId $id -AuthorizationKey $Authkey -ConnectionType ExpressRoute -ExpressRouteGatewayBypass   
```
  
### Enable Accelerated Networking on VMs

To take advantage of low latency access on VMs network stack, enable accelerated networking (AN), also known as SR-IOV, on supported VMs.
For more information, see [Accelerated networking for Windows or Linux virtual machines](./../virtual-network/create-vm-accelerated-networking-cli.md).
