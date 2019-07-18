---
title: 'Connect classic virtual networks to Azure Resource Manager VNets: Portal | Microsoft Docs'
description: Steps to connect classic VNets to Resource Manager VNets using VPN Gateway and the portal
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/17/2018
ms.author: cherylmc
---
# Connect virtual networks from different deployment models using the portal

This article shows you how to connect classic VNets to Resource Manager VNets to allow the resources located in the separate deployment models to communicate with each other. The steps in this article primarily use the Azure portal, but you can also create this configuration using the PowerShell by selecting the article from this list.

> [!div class="op_single_selector"]
> * [Portal](vpn-gateway-connect-different-deployment-models-portal.md)
> * [PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)
> 
> 

Connecting a classic VNet to a Resource Manager VNet is similar to connecting a VNet to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE. You can create a connection between VNets that are in different subscriptions and in different regions. You can also connect VNets that already have connections to on-premises networks, as long as the gateway that they have been configured with is dynamic or route-based. For more information about VNet-to-VNet connections, see the [VNet-to-VNet FAQ](#faq) at the end of this article. 

If you do not already have a virtual network gateway and do not want to create one, you may want to instead consider connecting your VNets using VNet Peering. VNet peering does not use a VPN gateway. For more information, see [VNet peering](../virtual-network/virtual-network-peering-overview.md).

### <a name="before"></a>Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

* These steps assume that both VNets have already been created. If you are using this article as an exercise and don't have VNets, there are links in the steps to help you create them.
* Verify that the address ranges for the VNets do not overlap with each other, or overlap with any of the ranges for other connections that the gateways may be connected to.
* Install the latest PowerShell cmdlets for both Resource Manager and Service Management (classic). In this article, we use both the Azure portal and PowerShell. PowerShell is required to create the connection from the classic VNet to the Resource Manager VNet. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview). 

### <a name="values"></a>Example settings

You can use these values to create a test environment, or refer to them to better understand the examples in this article.

**Classic VNet**

VNet name = ClassicVNet <br>
Address space = 10.0.0.0/24 <br>
Subnet name = Subnet-1 <br>
Subnet address range = 10.0.0.0/27 <br>
Subscription = the subscription you want to use <br>
Resource Group = ClassicRG <br>
Location = West US <br>
GatewaySubnet = 10.0.0.32/28 <br>
Local site = RMVNetLocal <br>

**Resource Manager VNet**

VNet name = RMVNet <br>
Address space = 192.168.0.0/16 <br>
Resource Group = RG1 <br>
Location = East US <br>
Subnet name = Subnet-1 <br>
Address range = 192.168.1.0/24 <br>
GatewaySubnet = 192.168.0.0/26 <br>
Virtual network gateway name = RMGateway <br>
Gateway type = VPN <br>
VPN type = Route-based <br>
SKU = VpnGw1 <br>
Location = East US <br>
Virtual network = RMVNet <br> (associate the VPN gateway to this VNet)
First IP configuration = rmgwpip <br> (gateway public IP address)
Local network gateway = ClassicVNetLocal <br>
Connection name = RMtoClassic

### <a name="connectoverview"></a>Connection overview

For this configuration, you create a VPN gateway connection over an IPsec/IKE VPN tunnel between the virtual networks. Make sure that none of your VNet ranges overlap with each other, or with any of the local networks that they connect to.

The following table shows an example of how the example VNets and local sites are defined:

| Virtual Network | Address Space | Region | Connects to local network site |
|:--- |:--- |:--- |:--- |
| ClassicVNet |(10.0.0.0/24) |West US | RMVNetLocal (192.168.0.0/16) |
| RMVNet | (192.168.0.0/16) |East US |ClassicVNetLocal (10.0.0.0/24) |

## <a name="classicvnet"></a>Section 1 - Configure the classic VNet settings

In this section, you create the classic VNet, the local network (local site), and the virtual network gateway. Screenshots are provided as examples. Be sure to replace the values with your own, or use the [Example](#values) values.

### 1. <a name="classicvnet"></a>Create a classic VNet

If you don't have a classic VNet and are running these steps as an exercise, you can create a VNet by using [this article](../virtual-network/virtual-networks-create-vnet-classic-pportal.md) and the [Example](#values) settings values from above.

If you already have a VNet with a VPN gateway, verify that the gateway is Dynamic. If it's Static, you must first delete the VPN gateway before you proceed to [Configure the local site](#local).

1. Open the [Azure portal](https://ms.portal.azure.com) and sign in with your Azure account.
2. Click **+ Create a resource** to open the 'New' page.
3. In the 'Search the marketplace' field, type 'Virtual Network'. If you instead, select Networking -> Virtual Network, you will not get the option to create a classic VNet.
4. Locate 'Virtual Network' from the returned list and click it to open the Virtual Network page. 
5. On the virtual network page, select 'Classic' to create a classic VNet. If you take the default here, you will wind up with a Resource Manager VNet instead.

### 2. <a name="local"></a>Configure the local site

1. Navigate to **All resources** and locate the **ClassicVNet** in the list.
2. On the **Overview** page, in the **VPN connections** section, click **Gateway** to create a gateway.
  ![Configure a VPN gateway](./media/vpn-gateway-connect-different-deployment-models-portal/gatewaygraphic.png "Configure a VPN gateway")
3. On the **New VPN Connection** page, for **Connection type**, select **Site-to-site**.
4. For **Local site**, click **Configure required settings**. This opens the **Local site** page.
5. On the **Local site** page, create a name to refer to the Resource Manager VNet. For example, 'RMVNetLocal'.
6. If the VPN gateway for the Resource Manager VNet already has a Public IP address, use the value for the **VPN gateway IP address** field. If you are doing these steps as an exercise, or don't yet have a virtual network gateway for your Resource Manager VNet, you can make up a placeholder IP address. Make sure that the placeholder IP address uses a valid format. Later, you replace the placeholder IP address with the Public IP address of the Resource Manager virtual network gateway.
7. For **Client Address Space**, use the [values](#connectoverview) for the virtual network IP address spaces for the Resource Manager VNet. This setting is used to specify the address spaces to route to the Resource Manager virtual network. In the example, we use 192.168.0.0/16, the address range for the RMVNet.
8. Click **OK** to save the values and return to the **New VPN Connection** page.

### <a name="classicgw"></a>3. Create the virtual network gateway

1. On the **New VPN Connection** page, select the **Create gateway immediately** checkbox.
2. Click **Optional gateway configuration** to open the **Gateway configuration** page.

   ![Open gateway configuration page](./media/vpn-gateway-connect-different-deployment-models-portal/optionalgatewayconfiguration.png "Open gateway configuration page")
3. Click **Subnet - Configure required settings** to open the **Add subnet** page. The **Name** is already configured with the required value: **GatewaySubnet**.
4. The **Address range** refers to the range for the gateway subnet. Although you can create a gateway subnet with a /29 address range (3 addresses), we recommend creating a gateway subnet that contains more IP addresses. This will accommodate future configurations that may require more available IP addresses. If possible, use /27 or /28. If you are using these steps as an exercise, you can refer to the [Example values](#values). For this example, we use '10.0.0.32/28'. Click **OK** to create the gateway subnet.
5. On the **Gateway configuration** page, **Size** refers to the gateway SKU. Select the gateway SKU for your VPN gateway.
6. Verify the **Routing Type** is **Dynamic**, then click **OK** to return to the **New VPN Connection** page.
7. On the **New VPN Connection** page, click **OK** to begin creating your VPN gateway. Creating a VPN gateway can take up to 45 minutes to complete.

### <a name="ip"></a>4. Copy the virtual network gateway Public IP address

After the virtual network gateway has been created, you can view the gateway IP address. 

1. Navigate to your classic VNet, and click **Overview**.
2. Click **VPN connections** to open the VPN connections page. On the VPN connections page, you can view the Public IP address. This is the Public IP address assigned to your virtual network gateway. Make a note of the IP address. You use it in later steps when you work with your Resource Manager local network gateway configuration settings. 
3. You can view the status of your gateway connections. Notice the local network site you created is listed as 'Connecting'. The status will change after you have created your connections. You can close this page when you are finished viewing the status.

## <a name="rmvnet"></a>Section 2 - Configure the Resource Manager VNet settings

In this section, you create the virtual network gateway and the local network gateway for your Resource Manager VNet. Screenshots are provided as examples. Be sure to replace the values with your own, or use the [Example](#values) values.

### 1. Create a virtual network

**Example values:**

* VNet name = RMVNet <br>
* Address space = 192.168.0.0/16 <br>
* Resource Group = RG1 <br>
* Location = East US <br>
* Subnet name = Subnet-1 <br>
* Address range = 192.168.1.0/24 <br>


If you don't have a Resource Manager VNet and are running these steps as an exercise, create a virtual network with the steps in [Create a virtual network](../virtual-network/quick-create-portal.md), using the example values.

### 2. Create a gateway subnet

**Example value:** GatewaySubnet = 192.168.0.0/26

Before creating a virtual network gateway, you first need to create the gateway subnet. Create a gateway subnet with CIDR count of /28 or larger (/27, /26, etc.). If you are creating this as part of an exercise, you can use the Example values.

[!INCLUDE [vpn-gateway-add-gwsubnet-rm-portal](../../includes/vpn-gateway-add-gwsubnet-rm-portal-include.md)]

[!INCLUDE [vpn-gateway-no-nsg-include](../../includes/vpn-gateway-no-nsg-include.md)]

### <a name="creategw"></a>3. Create a virtual network gateway

**Example values:**

* Virtual network gateway name = RMGateway <br>
* Gateway type = VPN <br>
* VPN type = Route-based <br>
* SKU = VpnGw1 <br>
* Location = East US <br>
* Virtual network = RMVNet <br>
* First IP configuration = rmgwpip <br>

[!INCLUDE [vpn-gateway-add-gw-rm-portal](../../includes/vpn-gateway-add-gw-rm-portal-include.md)]

### <a name="createlng"></a>4. Create a local network gateway

**Example values:** Local network gateway = ClassicVNetLocal

| Virtual Network | Address Space | Region | Connects to local network site |Gateway Public IP address|
|:--- |:--- |:--- |:--- |:--- |
| ClassicVNet |(10.0.0.0/24) |West US | RMVNetLocal (192.168.0.0/16) |The Public IP address that is assigned to the ClassicVNet gateway|
| RMVNet | (192.168.0.0/16) |East US |ClassicVNetLocal (10.0.0.0/24) |The Public IP address that is assigned to the RMVNet gateway.|

The local network gateway specifies the address range and the Public IP address associated with your classic VNet and its virtual network gateway. If you are doing these steps as an exercise, refer to the Example values.

[!INCLUDE [vpn-gateway-add-lng-rm-portal](../../includes/vpn-gateway-add-lng-rm-portal-include.md)]

## <a name="modifylng"></a>Section 3 - Modify the classic VNet local site settings

In this section, you replace the placeholder IP address that you used when specifying the local site settings, with the Resource Manager VPN gateway IP address. This section uses the classic (SM) PowerShell cmdlets.

1. In the Azure portal, navigate to the classic virtual network.
2. On the page for your virtual network, click **Overview**.
3. In the **VPN connections** section, click the name of your local site in the graphic.

   ![VPN-connections](./media/vpn-gateway-connect-different-deployment-models-portal/vpnconnections.png "VPN Connections")
4. On the **Site-to-site VPN connections** page, click the name of the site.

   ![Site-name](./media/vpn-gateway-connect-different-deployment-models-portal/sitetosite3.png "Local site name")
5. On the connection page for your local site, click the name of the local site to open the **Local site** page.

   ![Open-local-site](./media/vpn-gateway-connect-different-deployment-models-portal/openlocal.png "Open local site")
6. On the **Local site** page, replace the **VPN gateway IP address** with the IP address of the Resource Manager gateway.

   ![Gateway-ip-address](./media/vpn-gateway-connect-different-deployment-models-portal/gwipaddress.png "Gateway IP address")
7. Click **OK** to update the IP address.

## <a name="RMtoclassic"></a>Section 4 - Create Resource Manager to classic connection

In these steps, you configure the connection from the Resource Manager VNet to the classic VNet using the Azure portal.

1. In **All resources**, locate the local network gateway. In our example, the local network gateway is **ClassicVNetLocal**.
2. Click **Configuration** and verify that the IP address value is the VPN gateway for the classic VNet. Update, if needed, then click **Save**. Close the page.
3. In **All resources**, click the local network gateway.
4. Click **Connections** to open the Connections page.
5. On the **Connections** page, click **+** to add a connection.
6. On the **Add connection** page, name the connection. For example, 'RMtoClassic'.
7. **Site-to-Site** is already selected on this page.
8. Select the virtual network gateway that you want to associate with this site.
9. Create a **shared key**. This key is also used in the connection that you create from the classic VNet to the Resource Manager VNet. You can generate the key or make one up. In our example, we use 'abc123', but you can (and should) use something more complex.
10. Click **OK** to create the connection.

## <a name="classictoRM"></a>Section 5 - Create classic to Resource Manager connection

In these steps, you configure the connection from the classic VNet to the Resource Manager VNet. These steps require PowerShell. You can't create this connection in the portal. Make sure you have downloaded and installed both the classic (SM) and Resource Manager (RM) PowerShell cmdlets.

### 1. Connect to your Azure account

Open the PowerShell console with elevated rights and log in to your Azure account. After logging in, your account settings are downloaded so that they are available to Azure PowerShell. The following cmdlet prompts you for the login credentials for your Azure Account for the Resource Manager deployment model:

```powershell
Connect-AzAccount
```

Get a list of your Azure subscriptions.

```powershell
Get-AzSubscription
```

If you have more than one subscription, specify the subscription that you want to use.

```powershell
Select-AzSubscription -SubscriptionName "Name of subscription"
```

Next, log in to use the classic PowerShell cmdlets (Service Management). Use the following command to add your Azure account for the classic deployment model:

```powershell
Add-AzureAccount
```

Get a list of your subscriptions. This step may be necessary when adding the Service Management cmdlets, depending on your Azure module install.

```powershell
Get-AzureSubscription
```

If you have more than one subscription, specify the subscription that you want to use.

```powershell
Select-AzureSubscription -SubscriptionName "Name of subscription"
```

### 2. View the network configuration file values

When you create a VNet in the Azure portal, the full name that Azure uses is not visible in the Azure portal. For example, a VNet that appears to be named 'ClassicVNet' in the Azure portal may have a much longer name in the network configuration file. The name might look something like: 'Group ClassicRG ClassicVNet'. In these steps, you download the network configuration file and view the values.

Create a directory on your computer and then export the network configuration file to the directory. 
In this example, the network configuration file is exported to C:\AzureNet.

```powershell
Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
```

Open the file with a text editor and view the name for your classic VNet. Use the names in the network configuration file when running your PowerShell cmdlets.

- VNet names are listed as **VirtualNetworkSite name =**
- Site names are listed as **LocalNetworkSite name=**

### 3. Create the connection

Set the shared key and create the connection from the classic VNet to the Resource Manager VNet. You cannot set the shared key using the portal. Make sure you run these steps while logged in using the classic version of the PowerShell cmdlets. To do so, use **Add-AzureAccount**. Otherwise, you will not be able to set the '-AzureVNetGatewayKey'.

- In this example, **-VNetName** is the name of the classic VNet as found in your network configuration file. 
- The **-LocalNetworkSiteName** is the name you specified for the local site, as found in your network configuration file.
- The **-SharedKey** is a value that you generate and specify. For this example, we used *abc123*, but you can generate something more complex. The important thing is that the value you specify here must be the same value that you specified when creating your Resource Manager to classic connection.

```powershell
Set-AzureVNetGatewayKey -VNetName "Group ClassicRG ClassicVNet" `
-LocalNetworkSiteName "172B9E16_RMVNetLocal" -SharedKey abc123
```

## <a name="verify"></a>Section 6 - Verify your connections

You can verify your connections by using the Azure portal or PowerShell. When verifying, you may need to wait a minute or two as the connection is being created. When a connection is successful, the connectivity state changes from 'Connecting' to 'Connected'.

### To verify the connection from your classic VNet to your Resource Manager VNet

[!INCLUDE [vpn-gateway-verify-connection-azureportal-classic](../../includes/vpn-gateway-verify-connection-azureportal-classic-include.md)]

### To verify the connection from your Resource Manager VNet to your classic VNet

[!INCLUDE [vpn-gateway-verify-connection-portal-rm](../../includes/vpn-gateway-verify-connection-portal-rm-include.md)]

## <a name="faq"></a>VNet-to-VNet FAQ

[!INCLUDE [vpn-gateway-vnet-vnet-faq](../../includes/vpn-gateway-faq-vnet-vnet-include.md)]
