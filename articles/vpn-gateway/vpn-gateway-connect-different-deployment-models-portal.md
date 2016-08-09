<properties 
   pageTitle="How to connect classic virtual networks to Resource Manager virtual networks in the portal  | Microsoft Azure"
   description="Learn how to create a VPN connection between classic VNets and Resource Manager VNets using VPN Gateway and the portal"
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-service-management,azure-resource-manager"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/09/2016"
   ms.author="cherylmc" />

# Connect virtual networks from different deployment models in the portal

> [AZURE.SELECTOR]
- [Portal](vpn-gateway-connect-different-deployment-models-portal.md)
- [PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)


Azure currently has two management models: classic and Resource Manager (RM). If you have been using Azure for some time, you probably have Azure VMs and instance roles running in a classic VNet. Your newer VMs and role instances may be running in a VNet created in Resource Manager. This article will walk you through connecting classic VNets to Resource Manager VNets to allow the resources located in the separate deployment models to communicate with each other over a gateway connection. 

You can create a connection between VNets that are in different subscriptions, in different regions, and in different deployment models. You can also connect VNets that already have connections to on-premises networks, provided that the gateway that they have been configured with is dynamic or route-based. For more information about VNet-to-VNet connections, see the [VNet-to-VNet FAQ](#faq) at the end of this article.

[AZURE.INCLUDE [vpn-gateway-vnetpeeringlink](../../includes/vpn-gateway-vnetpeeringlink-include.md)]

## Before beginning

The steps below will walk you through the settings necessary to configure a dynamic or route-based gateway for each VNet and create a VPN connection between the gateways. Note that this configuration does not support static or policy-based gateways. In the steps below, we will use the classic portal, the Azure portal, and PowerShell. At this time, it is not possible to create this configuration using only the Azure portal.

Before beginning, verify the following:

 - Both VNets have already been created.
 - The address ranges for the VNets do not overlap with each other, or overlap with any of the ranges for other connections that the gateways may be connected to.
 - You have installed the latest PowerShell cmdlets (1.0.2 or later). See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information. Make sure you install both the Service Management (SM) and the Resource Manager (RM) cmdlets. 

### <a name="values"></a>Example settings

You can use the example settings as reference when using the PowerShell cmdlets in the steps below.

**Classic VNet settings**

VNet Name = ClassicVNet <br>
Location = West US <br>
Virtual Network Address Spaces = 10.0.0.0/8 <br>
Subnet-1 = 10.0.0.0/11 <br>
GatewaySubnet = 10.32.0.0/29 <br>
Local Network Name = RMVNetLocal <br>

**Resource Manager VNet settings**

VNet Name = RMVNet <br>
Resource Group = RG1 <br>
Virtual Network IP Address Spaces = 192.168.1.0/16 <br>
Subnet -1 = 192.168.1.0/24 <br>
GatewaySubnet = 192.168.0.0/26 <br>
Location = East US <br>
Virtual network gateway name = RMGateway <br>
Gateway public IP name = gwpip <br>
Gateway type = VPN <br>
VPN type = Route-based <br>
Local network gateway = ClassicVNetLocal <br>

## <a name="createsmgw"></a>Section 1: Configure classic VNet settings


In this section, we will create the local network and the gateway for your classic VNet. The instructions in this section use the classic portal. At this time, the Azure portal does not offer all of the settings that pertain to a classic VNet.

### Part 1 - Create a new local network

Open the [classic portal](https://manage.windowsazure.com) and sign in with your Azure account.

1. On the bottom left corner of the screen, click **NEW** > **Network Services** > **Virtual Network** > **Add local network**.

2. In the **Specify your local network details** window, type a name for the RM VNet you want to connect to. In the **VPN device IP address (optional)** box, type any valid public IP address. This is just a temporary placeholder. You'll change this IP address later. On the bottom right corner of the window, click on the arrow button.
 
3. On the **Specify the address space** page, in the **Starting IP** text box, type the network prefix and CIDR block for the Resource Manager VNet you want to connect to. This setting is used to specify the address space to route to the RM VNet.

### Part 2 - Associate the local network to your VNet

1. Click **Virtual Networks** at the top of the page to switch to the Virtual Networks screen, then click to select your classic VNet. On the page for your VNet, click **Configure** to navigate to the configuration page.

2. Under the **site-to-site connectivity** connection section, select the **Connect to the local network** checkbox. Then select the local network that you just created. If you have multiple local networks that you created, be sure to select the one that you created to represent your Resource Manager VNet from the dropdown.

3. Click **Save** at the bottom of the page to save your settings.

### Part 3 - Create the gateway

1. After saving the settings, click **Dashboard** at the top of the page to change to the Dashboard page. On the bottom of the Dashboard page, click **Create Gateway**, then click **Dynamic Routing**. Click **Yes** to begin creating your gateway. Note that a Dynamic Routing gateway is required for this configuration.

2. Wait for the gateway to be created. This can sometimes take 45 minutes or more to complete.

### <a name="ip"></a>Part 4 - View the gatetway public IP address

After the gateway has been created, you can view the gateway IP address on the **Dashboard** page. This is the public IP address of your gateway. Write down or copy the public IP address. You will use it in later steps when you create the local network for your Resource Manager VNet configuration.


## <a name="creatermgw"></a>Section 2: Configure Resource Manager VNet settings

In this section, we will create the virtual network gateway and the local network for your Resource Manager VNet. Don't start the following steps until after you have retrieved the public IP address for the classic VNet's gateway.

The screenshots are provided as examples. Be sure to replace the values with your own. If you are creating this configuration as an exercise, refer to these [values](#values).


### Part 1 - Create a gateway subnet

Before connecting your virtual network to a gateway, you'll first need to create the gateway subnet for the virtual network to which you want to connect. Create a gateway subnet with CIDR count of /28 or larger (/27, /26, etc.)

From a browser, navigate to the [Azure portal](http://portal.azure.com) and sign in with your Azure account.

[AZURE.INCLUDE [vpn-gateway-add-gwsubnet-rm-portal](../../includes/vpn-gateway-add-gwsubnet-rm-portal-include.md)]

### Part 2 - Create a virtual network gateway


[AZURE.INCLUDE [vpn-gateway-add-gw-rm-portal](../../includes/vpn-gateway-add-gw-rm-portal-include.md)]


### Part 3 - Create a local network gateway

The 'local network gateway' typically refers to your on-premises location. It tells Azure which IP address ranges to route to the location and the public IP address of the device for that location. However, in this case, it will refer to the address range and public IP address associated with your classic VNet and virtual network gateway.

Give the local network gateway a name by which Azure can refer to it. You can create your local network gateway while your virtual network gateway is being created. For this configuration, you'll use the public IP address that was assigned to your classic VNet gateway in the [previous section](#ip).

[AZURE.INCLUDE [vpn-gateway-add-lng-rm-portal](../../includes/vpn-gateway-add-lng-rm-portal-include.md)]


### Part 4 - Copy the public IP address

Once the virtual network gateway has finished creating, copy the public IP address that is associated with the gateway. You'll use it when you configure the local network settings for your classic VNet. 


## Section 3: Modify the local network for the classic VNet

Open the [classic portal](https://manage.windowsazure.com).

2. In the classic portal, scroll down on the left side and click **Networks**. On the **networks** page, click **Local Networks** at the top of the page. 

3. Click to select the local network that you configured in Part 1. At the bottom of the page, click **Edit**.

4. On the **Specify your local network details** page, replace the placeholder IP address that you used in the earlier section with the public IP address for the Resource Manager gateway that you retrieved in the previous section. Click the arrow to move to the next page. Verify that the **Address Space** is correct, and then click the checkmark to accept the changes.

## <a name="connect"></a>Section 4: Create the connection

In this section, we will create the connection between the VNets. The steps for this require PowerShell. You cannot create this connection in either of the portals. Make sure you have downloaded and installed both the classic (SM) and Resource Manager (RM) PowerShell cmdlets.


1. Log in to your Azure account in the PowerShell console. You will be prompted for the login credentials for your Azure Account. After logging in, it downloads your account settings so that they are available to Azure PowerShell.

		Login-AzureRmAccount 

 	Get a list of your Azure subscriptions if you have more than one subscription.

		Get-AzureRmSubscription

	Specify the subscription that you want to use. 

		Select-AzureRmSubscription -SubscriptionName "Name of subscription"


2. Add your Azure Account in order to use the classic PowerShell cmdlets. To do so, you can use the following command:

		Add-AzureAccount

3. Set your shared key by running the command below. In this sample, `-VNetName` is the name of the classic VNet and `-LocalNetworkSiteName` is the name you specified for the local network when you configured it in the classic portal. The `-SharedKey` is a value that you can generate and specify. The value you specify here must be the same value that you specify in the next step when you create your connection.

		Set-AzureVNetGatewayKey -VNetName ClassicVNet `
		-LocalNetworkSiteName RMVNetLocal -SharedKey abc123

4. Create the VPN connection by running the commands below.
	
	**Set the variables**

		$vnet01gateway = Get-AzureRMLocalNetworkGateway -Name ClassicVNetLocal -ResourceGroupName RG1
		$vnet02gateway = Get-AzureRmVirtualNetworkGateway -Name RMGateway -ResourceGroupName RG1

	**Create the connection**<br> Note that the `-ConnectionType` is 'IPsec', not 'Vnet2Vnet'. In this sample, `-Name` is the name that you want to call your connection. The sample below creates a connection named '*rm-to-classic-connection*'.
		
		New-AzureRmVirtualNetworkGatewayConnection -Name rm-to-classic-connection -ResourceGroupName RG1 `
		-Location "East US" -VirtualNetworkGateway1 `
		$vnet02gateway -LocalNetworkGateway2 `
		$vnet01gateway -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'

## Verify your connection

You can verify your connection by using the classic portal, the Azure portal, or PowerShell. You can use the steps below to verify your connection. Replace the values with your own.

[AZURE.INCLUDE [vpn-gateway-verify connection](../../includes/vpn-gateway-verify-connection-rm-include.md)] 

## <a name="faq"></a>VNet-to-VNet FAQ

View the FAQ details for additional information about VNet-to-VNet connections.

[AZURE.INCLUDE [vpn-gateway-vnet-vnet-faq](../../includes/vpn-gateway-vnet-vnet-faq-include.md)] 


