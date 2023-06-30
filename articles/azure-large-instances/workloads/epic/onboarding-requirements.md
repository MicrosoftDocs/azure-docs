---
title: Onboarding requirements
description: Provides an overview of onboarding requirements for ALI for Epic.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# ALI for Epic onboarding requirements

This article suggests actions to take after you receive an environment from the Microsoft ALI team.

## Azure portal

* Use Azure portal to:
  * Create Azure Virtual Network (or networks) and ExpressRoute Gateway or Gateways with High or Ultra Performance Reference.
  * Link them with ALI for Epic stamps using the Circuit/peer ID and Authorization Keys provided by Microsoft team.  

## VNET address space

Ensure that the VNET address space provided in your request is the same as what you configure.  

## Time sync

Setup time synchronization with NTP server.  

## Jump box

* Set up a jump box in a VM to connect to ALI for Epic stamps.
* Change the root password at first login and store password in a secure location.  

## Satellite server

Install a red hat satellite server in a VM for RHEL 8.4 and patch download.

## ALI for Epic stamps

* Validate ALI for Epic stamps and configure and patch OS based on your requirements.  
* Verify that the stamps are visible on Azure portal.

  > [!Note]
  > Do *not* place large files like ALI for Epic installation bits on the boot volume. The Boot volume is small and can fill quickly, which could cause the server to hang (50 GB per OS is the boot limit).

## Secure Server IP pool address range

This IP address range is used to assign the individual IP address to ALI for Epic servers.
The recommended subnet size is a /24 CIDR block. If needed, it can be smaller, with as few as 64 IP addresses.

From this range, the first 30 IP addresses are reserved for use by Microsoft.
Make sure that you account for this when you choose the size of the range.
This range must NOT overlap with your on-premises or other Azure IP addresses.

Your corporate network team or service provider should provide an IP address range that's not currently being used inside your network.
This range is an IP address range, which must be submitted to Microsoft when asking for an initial deployment.

## Optional IP address ranges to submit to Microsoft
  
If you choose to use ExpressRoute Global Reach to enable direct routing from on-premises to ALI for Epic instance units, you must reserve another /29 IP address range.
This range may not overlap with any of the other IP addresses ranges you defined before.  

If you choose to use ExpressRoute Global Reach to enable direct routing from an ALI for Epic instance tenant in one Azure region to another ALI for Epic instance tenant in another Azure region, you must reserve another /29 IP address range.
This range may not overlap with the  IP address ranges you defined before.  

## Using ExpressRoute Fast Path

You can use ExpressRoute Fast Path to access your Azure ALI servers from anywhere, Azure VMs (hub and spoke) and on-premises.

For setup instructions, see [Enable ExpressRoute Fast Path](#enable-expressroute-fast-path).

To see the learned routes from ALI, one of the options is looking at the Effective Routes table of one of your VMs, as follows:

1. In Azure portal, select any of your VMs (any connected to the Hub, or to a Spoke connected to the Hub which is connected to ALI for Epic), select **Networking**, select the network interface name, then select **Effective Routes**.

2. Make sure to enable accelerated networking with all VMs connecting to ALI for Epic (link1) or (link2).

3. Set up ALI for Epic solution based on your system requirements and take a system backup.  
4. Take an OS backup.  
5. Set up volume groups. (See [Create a volume group](create-a-volume-group.md).)  
6. Set up a storage snapshot, backup, and data offload. (For detailed steps, see [Azure Large Instances NETAPP storage data protection with Azure CVO](ali-netapp-with-cvo.md)).

> [!Note]
> A storage snapshot should only be set up after all data-intensive work (for example, Endian conversions) are complete in order to avoid creating unnecessary snapshots while build work is in progress

The Azure subscription you use for ALI deployments is already registered with the ALI resource provider by the Microsoft Operations team during the provisioning process.
If you don't see your deployed Azure Large Instances under your subscription, register the resource provider with your subscription. For more information, see [Register the ALI resource provider](register-the-ali-resource-provider.md).

### Enable ExpressRoute Fast Path

Before you begin, install the latest version of the Azure resource manager power shell cmdlets, at least 4.0 or later.
For more information about installing the power shell cmdlets, see [How to install Azure Powershell](https://learn.microsoft.com/powershell/azure/install-azure-powershell?view=azps-10.0.0).

For more information, see these resources:

* [Azure ExpressRoute overview](https://azure.microsoft.com/products/expressroute/)

* [How to create a connection between your VPN Gateway and ExpressRoute circuit](https://learn.microsoft.com/shows/azure/expressroute-how-to-create-connection-between-your-vpn-gateway-expressroute-circuit) 


* [How to set up Microsoft peering for your ExpressRoute circuit](https://learn.microsoft.com/shows/azure/expressroute-how-to-set-up-microsoft-peering-your-expressroute-circuit)

### Authorizing  

Ensure you have an authorization key for the express route (ER) circuit used for virtual gateway connection to ER circuit. 
Also obtain ER circuit resource ID.

If you don’t have this information, obtain the details from the circuit owner (these details are usually provided by the Microsoft team as part of provisioning request completion.
Reach out to
<a href=mailto:"AzureBMISupportEpic@microsoft.com">Microsoft support</a> in case of any inconsistencies).  

### Declare variables

This example declares the variables using the values for this exercise.
Replace the values with your subscription values.

```azurecli
$Sub1 = "Replace_With_Your_Subcription_Name"  

$RG1 = "TestRG1"  

$Location1 = "East US"  

$GWName1 = "VNet1GW"  

$Authkey = “Express route circuit auth key”  

$Sub1 = "Replace_With_Your_Subcription_Name"  

$RG1 = "TestRG1"  

$Location1 = "East US"  

$GWName1 = "VNet1GW"  

$Authkey = “Express route circuit auth key”  
```
  
### Connect to your account

```azurecli
Connect-AzureRmAccount  
```
  
#### Check the subscriptions for the account

```azurecli
Get-AzureRmSubscription  
```

#### Specify the subscription that you want to use

```azurecli
Select-AzureRmSubscription -SubscriptionName $Sub1  
```
  
### Enable ExpressRoute fast path on the gateway connection  

#### Declare a variable for the gateway object

```azurecli
$gw = Get-AzureRmVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1  
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
Ffor more details on supported VM sizes, OS and how to enable AN for existing VMs, see
[Use Azure CLI to create a Windows or Linux VM with Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md).



## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure Large Instances?](../../what-is-azure-large-instances.md)
