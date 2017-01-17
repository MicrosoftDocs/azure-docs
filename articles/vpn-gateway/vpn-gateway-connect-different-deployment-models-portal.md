---
title: How to connect classic virtual networks to Resource Manager virtual networks in the portal  | Microsoft Docs
description: Learn how to create a VPN connection between classic VNets and Resource Manager VNets using VPN Gateway and the portal
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: carmonm
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 5a90498c-4520-4bd3-a833-ad85924ecaf9
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/17/2017
ms.author: cherylmc

---
# Connect virtual networks from different deployment models using the portal
> [!div class="op_single_selector"]
> * [Portal](vpn-gateway-connect-different-deployment-models-portal.md)
> * [PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)
> 
> 

Azure currently has two management models: classic and Resource Manager (RM). If you have been using Azure for some time, you probably have Azure VMs and instance roles running in a classic VNet. Your newer VMs and role instances may be running in a VNet created in Resource Manager. This article walks you through connecting classic VNets to Resource Manager VNets to allow the resources located in the separate deployment models to communicate with each other over a gateway connection. 

You can create a connection between VNets that are in different subscriptions and in different regions. You can also connect VNets that already have connections to on-premises networks, as long as the gateway that they have been configured with is dynamic or route-based. For more information about VNet-to-VNet connections, see the [VNet-to-VNet considerations](#faq) section at the end of this article.

### Deployment models and methods for VNet-to-VNet connections
[!INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)]

We update the following table as new articles and additional tools become available for this configuration. When an article is available, we link directly to it from the table.<br><br>

**VNet-to-VNet**

[!INCLUDE [vpn-gateway-table-vnet-vnet](../../includes/vpn-gateway-table-vnet-to-vnet-include.md)]

**VNet peering**

[!INCLUDE [vpn-gateway-vnetpeeringlink](../../includes/vpn-gateway-vnetpeeringlink-include.md)]

## <a name="before"></a>Before beginning
The following steps walk you through the settings necessary to configure a dynamic or route-based gateway for each VNet and create a VPN connection between the gateways. This configuration does not support static or policy-based gateways. 

In this article, we will use the Azure portal and PowerShell. PowerShell is required to create the connections between the virtual networks. You cannot create the connections for this configuration by using the portal.

### Prerequisites
* Both VNets have already been created.
* The address ranges for the VNets do not overlap with each other, or overlap with any of the ranges for other connections that the gateways may be connected to.
* You have installed the latest PowerShell cmdlets. See [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) for more information. Make sure you install both the Service Management (SM) and the Resource Manager (RM) cmdlets. 

### <a name="values"></a>Example settings
You can use the example settings as reference.

**Classic VNet settings**

VNet Name = ClassicVNet <br>
Address space = 10.0.0.0/24 <br>
Subnet-1 = 10.0.0.0/27 <br>
Resource Group = ClassicRG <br>
Location = West US <br>
GatewaySubnet = 10.0.0.32/28 <br>
Local site = RMVNetLocal <br>

**Resource Manager VNet settings**

VNet Name = RMVNet <br>
Address space = 192.168.0.0/16 <br>
Subnet-1 = 192.168.1.0/24 <br>
GatewaySubnet = 192.168.0.0/26 <br>
Resource Group = RG1 <br>
Location = East US <br>
Virtual network gateway name = RMGateway <br>
Gateway type = VPN <br>
VPN type = Route-based <br>
Gateway public IP name = gwpip <br>
Local network gateway = ClassicVNetLocal <br>

## <a name="createsmgw"></a>Section 1: Configure classic VNet settings
In this section, we will create the local network (local site) and the virtual network gateway for your classic VNet. The instructions in this section use the Azure portal. The steps here assume that a VPN gateway has not been created for the classic VNet. If you already have a gateway, verify that it is a Dynamic gateway. If it's Static, you must first delete the VPN gateway, then proceed with the following steps.

### Part 1 - Configure the local site

Open the [Azure portal](https://ms.portal.azure.com) and sign in with your Azure account.

1. Navigate to **All resources** and locate the classic virtual network.
2. On the **Overview** blade, in the **VPN connections** section, click the **Gateway** graphic to create a gateway.

	![Configure a VPN gateway](./media/vpn-gateway-connect-different-deployment-models-portal/gatewaygraphic.png "Configure a VPN gateway")
3. On the **New VPN Connection** blade, select **Site-to-site**.
4. In the **Local site** section of the blade, click **Configure required settings**. This will open the **Local site** blade.
5. On the **Local site** blade, create a name that you will use to refer to the Resource Manager VNet.
6. If the VPN gateway for the Resource Manager VNet already has a public IP address, use the value for the **VPN gateway IP address** field. If you have not yet created a virtual network gateway for your Resource Manager VNet, you can use a placeholder IP address. Make sure that the placeholder IP address uses a valid format. Later, you must replace the placeholder IP address with the public IP address of the Resource Manager virtual network gateway.
7. For **Client Address Space**, use the values for the virtual network IP address spaces for the Resource Manager VNet. This setting is used to specify the address spaces to route to the RM VNet.
8. Click **OK** to save the values.

### Part 2 - Create the virtual network gateway
1. On the **New VPN Connection** blade, select the **Create gateway immediately** checkbox.

	![Open gateway configuration blade](./media/vpn-gateway-connect-different-deployment-models-portal/optionalgatewayconfiguration.png "Open gateway configuration blade")
2. Click **Optional gateway configuration** to open the **Gateway configuration** blade.
3. Click **Subnet - Configure required settings** to open the **Add subnet** blade. On this blade, you'll see that the Name is already configured with the required value **GatewaySubnet**.
4. The **Address range** refers to the range for the gateway subnet. Although you can create a gateway subnet with a /29 address range (3 addresses), we recommend creating a gateway subnet that contains more available IP addresses to accommodate possible future configurations that require more available IP addresses. If possible, use /27 or /28. Click **OK** to create the gateway subnet.
5. On the **Gateway configuration** blade, **Gateway size** refers to the gateway SKU. Select the gateway SKU for your VPN gateway.
6. Verify the **Routing type** is **Dynamic**, then click **OK**.
7. On the **New VPN Connection** blade, click **OK** to begin creating your VPN gateway. Creating a VPN gateway can take up to 45 minutes to complete.


### <a name="ip"></a>Part 3 - Copy the virtual network gateway public IP address
After the virtual network gateway has been created, you can view the gateway IP address. 

1. Navigate to your classic VNet, and click **Overview**.
2. Click **VPN connections** to open the VPN connections blade. On the VPN connections blade, you can view the public IP address. This is the public IP address assigned to your virtual network gateway. Write down or copy the IP address. You will use it in later steps when you create the local network for your Resource Manager VNet configuration. You can also view the status of your gateway connections on this blade. Notice the local network site you created is listed as 'Connecting'. The status will change after you have created your connections.

## <a name="creatermgw"></a>Section 2: Configure Resource Manager VNet settings
In this section, we will create the virtual network gateway and the local network for your Resource Manager VNet. Screenshots are provided as examples. Be sure to replace the values with your own. If you are creating this configuration as an exercise, refer to these [values](#values).

### Part 1 - Create a gateway subnet
Before creating a virtual network gateway, you first need to create the gateway subnet. Create a gateway subnet with CIDR count of /28 or larger. (/27, /26, etc.)

[!INCLUDE [vpn-gateway-no-nsg-include](../../includes/vpn-gateway-no-nsg-include.md)]

From a browser, navigate to the [Azure portal](http://portal.azure.com) and sign in with your Azure account.

[!INCLUDE [vpn-gateway-add-gwsubnet-rm-portal](../../includes/vpn-gateway-add-gwsubnet-rm-portal-include.md)]

### Part 2 - Create a virtual network gateway
[!INCLUDE [vpn-gateway-add-gw-rm-portal](../../includes/vpn-gateway-add-gw-rm-portal-include.md)]

Creating a virtual network gateway can take up to 45 minutes. You can wait for the Resource Manager virtual network gateway creation to complete, or you can proceed to [Part 3 - Create a local network gateway](#createlng). Once the gateway has been created, it is assigned a public IP address. In later steps, this IP address is used to replace the placeholder IP address information for the classic VNet local site settings you created in Section 1. 

### <a name="createlng"></a>Part 3 - Create a local network gateway

The local network gateway specifies the address range and the public IP address associated with your classic VNet and its virtual network gateway. Use the public IP address that was assigned to your classic VNet gateway in the [previous section](#ip). Give the local network gateway a name by which Azure can refer to it. For example, 'ClassicVNetLocal'.

[!INCLUDE [vpn-gateway-add-lng-rm-portal](../../includes/vpn-gateway-add-lng-rm-portal-include.md)]


## Section 3: Modify the classic VNet local site settings

In this section, you will work with the classic VNet. You will replace the placeholder IP address that you used when specifying the local site settings. This section uses the classic (SM) PowerShell cmdlets. If you have not yet done so, view the virtual network gateway for the Resource Manager VNet and copy the public IP address. This is the IP address that you will use to replace the placeholder IP address.

Verify that you have downloaded the latest version of these cmdlets, as specified in the [Before beginning](#before) section.

1. In the Azure portal, navigate to the classic virtual network.
2. On the blade for your virtual network, click **Overview**.
3. In the **VPN connections** section, click the name of your local site in the graphic.

	![VPN-connections](./media/vpn-gateway-connect-different-deployment-models-portal/vpnconnections.png "VPN Connections")
4. On the **Site-to-site VPN connections** blade, click the name of the site.

	![Site-name](./media/vpn-gateway-connect-different-deployment-models-portal/sitetosite3.png "Local site name")
5. On the connection blade for your local site, click the name of the local site to open the **Local site** blade.

	![Open-local-site](./media/vpn-gateway-connect-different-deployment-models-portal/openlocal.png "Open local site")
6. On the **Local site** blade, replace the VPN gateway IP address with the IP address of the Resource Manager gateway.

	![Gateway-ip-address](./media/vpn-gateway-connect-different-deployment-models-portal/gwipaddress.png "Gateway IP address")
7. Click **OK** to update the IP address.


## <a name="connect"></a>Section 4: Create the connection
In this section, you will create the connection between the VNets. These steps require PowerShell. You can't create this connection in either of the portals. Make sure you have downloaded and installed both the classic (SM) and Resource Manager (RM) PowerShell cmdlets.

### Log in to your Azure Account

1. Log in to your Azure account in the PowerShell console. The following cmdlet prompts you for the login credentials for your Azure Account. After logging in, your account settings are downloaded so that they are available to Azure PowerShell.
   
        Login-AzureRmAccount 
   
2. Get a list of your Azure subscriptions if you have more than one subscription.
   
        Get-AzureRmSubscription
   
3. Specify the subscription that you want to use. 
   
        Select-AzureRmSubscription -SubscriptionName "Name of subscription"

4. Add your Azure Account to use the classic PowerShell cmdlets. To do so, you can use the following command:
   
        Add-AzureAccount

### Set the shared key

1. Set the shared key for the connection from the classic VNet to the Resource Manager VNet.<br><br>Before running this sample, you may want to download and view network configuration file for your classic deployment model VNet. Sometimes the names for classic VNets are changed in the network configuration file when creating classic VNet settings in the Azure portal due to the differences in the deployment models. For example, using the Azure portal, we named the classic VNet 'Classic VNet' and created it in a resource group named 'ClassicRG'. The name that is contained in the network configuration file is converted to 'Group ClassicRG Classic VNet'. When specifying the name of a VNet that contains spaces, use quotation marks around the value. You can use the classic (Service Management) PowerShell cmdlet `Get-AzureVNetConfig` or the classic portal to download the file.<br><br>In this example, `-VNetName` is the name of the classic VNet and `-LocalNetworkSiteName` is the name you specified for the local site. The `-SharedKey` is a value that you generate and specify. For this example, we used abc123, but you can generate something more complex. The important thing is that the value you specify here must be the same value that you specify in the next step when you create your connection.<br><br>In the PowerShell console, set your shared key by running the following sample. The return for this sample should show **Status: Successful**.<br>
   
        Set-AzureVNetGatewayKey -VNetName "Group ClassicRG ClassicVNet" `
        -LocalNetworkSiteName RMVNetLocal -SharedKey abc123
2. Create the VPN connection by running the following commands:
   
    **Set the variables**
   
        $vnet01gateway = Get-AzureRMLocalNetworkGateway -Name ClassicVNetLocal -ResourceGroupName RG1
        $vnet02gateway = Get-AzureRmVirtualNetworkGateway -Name RMGateway -ResourceGroupName RG1
   
    **Create the connection**<br> Notice that the `-ConnectionType` is 'IPsec', not 'Vnet2Vnet'. In this example, `-Name` is the name that you want to name your connection, not something that you have already created. The following example creates a connection named 'RM-Classic'.
   
        New-AzureRmVirtualNetworkGatewayConnection -Name RM-Classic -ResourceGroupName RG1 `
        -Location "East US" -VirtualNetworkGateway1 `
        $vnet02gateway -LocalNetworkGateway2 `
        $vnet01gateway -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'

## Section 5: Verify your connections
You can verify your connections by using the Azure portal or PowerShell.

### To verify the connection from your classic VNet to your Resource Manager VNet

####Verify your connection using PowerShell


[!INCLUDE [vpn-gateway-verify-connection-ps-classic](../../includes/vpn-gateway-verify-connection-ps-classic-include.md)]

####Verify your connection using the Azure Portal

[!INCLUDE [vpn-gateway-verify-connection-azureportal-classic](../../includes/vpn-gateway-verify-connection-azureportal-classic-include.md)]


###To verify the connection from your Resource Manager VNet to your classic VNet

####Verify your connection using PowerShell

[!INCLUDE [vpn-gateway-verify-ps-rm](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

####Verify your connection using the Azure portal

[!INCLUDE [vpn-gateway-verify-connection-portal-rm](../../includes/vpn-gateway-verify-connection-portal-rm-include.md)]

## <a name="faq"></a>VNet-to-VNet considerations

[!INCLUDE [vpn-gateway-vnet-vnet-faq](../../includes/vpn-gateway-vnet-vnet-faq-include.md)]

