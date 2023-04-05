---
title: 'Connect classic virtual networks to Azure Resource Manager VNets: Portal'
titleSuffix: Azure VPN Gateway
description: Learn how to connect classic VNets to Resource Manager VNets using the portal.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 04/25/2022
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell, devx-track-arm-template
---
# Connect virtual networks from different deployment models using the portal

This article shows you how to connect classic VNets to Resource Manager VNets to allow the resources located in the separate deployment models to communicate with each other. The steps in this article primarily use the Azure portal, but you can also create this configuration using the PowerShell by selecting the article from this list.

This article is intended for customers who already have a VNet that was created using the classic (legacy) deployment model and want to connect the classic VNet to anther VNet that was created using the latest deployment model. If you don't already have a legacy VNet, use the [Create a VNet-to-VNet connection](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article instead.

## Architecture

Connecting a classic VNet to a Resource Manager VNet is similar to connecting a VNet to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE. You can create a connection between VNets that are in different subscriptions and in different regions. You can also connect VNets that already have connections to on-premises networks, as long as the gateway is dynamic or route-based. For more information about VNet-to-VNet connections, see the [VNet-to-VNet FAQ](vpn-gateway-vpn-faq.md).

For this configuration, you create a VPN gateway connection over an IPsec/IKE VPN tunnel between the virtual networks. Make sure that none of your VNet ranges overlap with each other, or with any of the local networks that they connect to.

The following table shows an example of how the example VNets and local sites are defined:

| Virtual Network | Address Space | Region | Connects to local network site |
|:--- |:--- |:--- |:--- |
| ClassicVNet |(10.1.0.0/16) |West US | RMVNetSite (192.168.0.0/16) |
| RMVNet | (192.168.0.0/16) |East US |ClassicVNetSite (10.1.0.0/16) |

## <a name="before"></a>Prerequisites

These steps assume that both VNets have already been created. If you're using this article as an exercise and don't have VNets, there are links in the steps to help you create them.

* Verify that the address ranges for the VNets don't overlap with each other, or overlap with any of the ranges for other connections that the gateways may be connected to.
* In this article, we use both the Azure portal and PowerShell. PowerShell is required to create the connection from the classic VNet to the Resource Manager VNet. Install the latest PowerShell cmdlets for **both** Resource Manager and Service Management.

  While it's possible to perform a few of the PowerShell commands using the Azure Cloud Shell environment, you need to install both versions of the cmdlets to create the connections properly.

  * [Service Management (classic) PowerShell cmdlets](/powershell/azure/servicemanagement/install-azure-ps?). When you install the Service Management cmdlets, you may need to modify the [Execution policy](/powershell/module/microsoft.powershell.core/about/about_execution_policies?) in order to install the classic version of the Azure module.

  * [AZ PowerShell cmdlets for Resource Manager](/powershell/azure/install-az-ps?)

  For more information, see [How to install and configure Azure PowerShell](/powershell/azure/).

### <a name="values"></a>Example settings

You can use these values to create a test environment, or refer to them to better understand the examples in this article.

**Classic VNet**

VNet name = ClassicVNet <br>
Address space = 10.1.0.0/16 <br>
Subnet name = Subnet1 <br>
Subnet address range = 10.1.0.0/24 <br>
Subscription = the subscription you want to use <br>
Resource Group = ClassicRG <br>
Location = West US <br>
GatewaySubnet Address range = 10.1.255.0/27 <br>
Local site name = RMVNetSite <br>
Gateway Size = Standard

**Resource Manager VNet**

VNet name = RMVNet <br>
Address space = 192.168.0.0/16 <br>
Resource Group = RMRG <br>
Location = East US <br>
Subnet name = Subnet1 <br>
Address range = 192.168.1.0/24 <br>
GatewaySubnet = 192.168.255.0/27 <br>
Virtual network gateway name = RMGateway <br>
Gateway type = VPN <br>
VPN type = Route-based <br>
SKU = VpnGw1 <br>
Location = East US <br>
Virtual network = RMVNet(associate the VPN gateway to this VNet) <br> 
First IP configuration = rmgwpip (gateway public IP address) <br> 
Local network gateway = ClassicVNetSite <br>
Connection name = RM-Classic

## <a name="classicvnet"></a>Configure the classic VNet

In this section, you create the classic VNet, the local network (local site), and the virtual network gateway. Screenshots are provided as examples. Be sure to replace the values with your own, or use the [Example](#values) values.

If you already have a VNet with a VPN gateway, verify that the gateway is Dynamic. If it's Static, you must first delete the VPN gateway before you proceed to [Configure the site and gateway](#classicgw).

### 1. <a name="classicvnet"></a>Create a classic VNet

If you don't have a classic VNet and are using these steps as an exercise, you can create a VNet using the example values. Follow the steps below, making sure to use the navigation method in the steps to create your virtual network.

**Example values**

* Project details
  * Resource Group = ClassicRG
* Instance details
  * Name = ClassicVNet
  * Address space = 10.1.0.0/16
  * Subnet name = Subnet1
  * Subnet address range = 10.1.0.0/24
  * Location = West US

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.
   > [!Important]
   > To see the option to create a classic VNet, you have to navigate to the page using the following steps.

1. Click **+ Create a resource** at the top of the page to open the page showing **Search service and marketplace**.
1. In the **Search services and marketplace** field, type 'Virtual Network'.
1. Locate **Virtual Network** from the returned list and click it to open the **Virtual network** page.
1. On the **Virtual network** page, in the text under the 'Create' button, click **(change to Classic)** to toggle to the Deploy with Classic wording. If you accidentally don't do this, you'll  wind up with a Resource Manager VNet instead.
1. Click **Create** to open the **Create a virtual network (classic)** page.
1. Fill in the values, then click **Review + Create** and **Create** to create your classic VNet.

### 2. <a name="classicgw"></a>Configure classic site and virtual network gateway

1. Go to your classic VNet.
1. In the left menu list, click **Gateway**, then click the banner to open the page to configure a gateway.
1. On the **Configure a VPN connection and gateway** page **Connection** tab, fill in the values, using the exercise [Example values](#values) if necessary.
   * Connection type = Site-to-site
   * Local site name = RMVNetSite
   * VPN gateway IP address = use a placeholder value if you don't know the Public IP address of the Resource Manager VPN gateway or you haven't yet created one. You can update this setting later.
   * Local site client addresses = The address range for the RM VNet. For example, 192.168.0.0/16.
1. At the bottom of the page, click **Next: Gateway** to advance to the Gateway tab.
1. On the **Gateway** tab, configure the settings:

   * Size = Standard
   * Routing Type = Dynamic
   * Address range for the GatewaySubnet = 10.1.255.0/27
1. Click **Review + create** to validate the settings.
1. Click **Create** to create the gateway. The gateway can take up to 45 minutes to create. While the gateway configures, you can continue with the next steps.

## <a name="rmvnet"></a>Configure the Resource Manager VNet

In this section, you create the RM virtual network and the RM VPN gateway. If you already have a Resource Manager virtual network and VPN gateway, verify that the gateway is route-based.

### 1. Create an RM virtual network

Create a Resource Manager VNet.

For steps, see [Create a virtual network](../virtual-network/quick-create-portal.md).

**Example values:**

* Project details
  * Resource Group = RMRG
* Instance details
  * VNet name = RMVNet
  * Region = East US
* IP Addresses
  * Address space = 192.168.0.0/16
  * Subnet name = Subnet1
  * Address range = 192.168.1.0/24

### <a name="creategw"></a>2. Create an RM virtual network gateway

Next, create the virtual network gateway (VPN gateway) object for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. 

For steps, see [Create a VPN gateway](tutorial-site-to-site-portal.md#VNetGateway)

**Example values:**

* Instance details
  * Name = RMGateway
  * Region = East US
  * Gateway type = VPN
  * VPN type = Route-based
  * SKU = VpnGw2
  * Generation = Generation2
  * Virtual network = RMVNet
  * GatewaySubnet address range = 192.168.255.0/27
  * Public IP Address Type = Basic
* Public IP address
  * Public IP address = Create new
  * Public IP address name = RMGWpip

### <a name="createlng"></a>3. Create an RM local network gateway

In this step, you create the local network gateway. The local network gateway is an object that specifies the address range and the Public IP address endpoint associated with your classic VNet and its virtual network gateway.

For steps, see [Create a local network gateway](tutorial-site-to-site-portal.md#LocalNetworkGateway).

**Example values**

* Project details
  * Resource Group = RMRG
  * Region = East US
* Name = ClassicVNetSite
* Endpoint = IP address
* IP address = the Gateway Public IP address of the Classic VNet. If necessary, you can use a placeholder IP address, and then go back and modify later.
* Address space = 10.1.0.0/16 (address space of the Classic VNet)

## <a name="modifylng"></a>Modify site and local network gateway settings

After both gateways have completed deployment, you can proceed with the next steps. The next steps require the public IP address that is assigned to each gateway.

### <a name="modify-classic"></a>Modify classic VNet local site settings

In this section, you modify the local network site for the classic VNet by updating the public IP address field with the address of the Resource Manager virtual network gateway.

1. For these steps, you need to obtain the public IP address for the **Resource Manager virtual network gateway**. You can find the gateway IP address by going to the RM virtual network gateway **Overview** page. Copy the IP address.
1. Next, go to the **classic VNet**.
1. On the left menu, click **Site-to-site connections** to open the Site-to-site connections page.
1. Under **Name**, click the name of the RM site you created. For example, RMVNetSite. This opens the **Properties** page for your local site.
1. On the Properties page, click **Edit local site**.
1. Change the **VPN gateway IP address** to the Public IP address that is assigned to the RMVNet gateway (the gateway to which you want to connect).
1. Click **OK** to save the settings.

### <a name="modify-rm"></a>Modify RM VNet local network gateway settings

In this section, you modify the local network gateway settings for the Resource Manager local network gateway object by updating the public IP address field with the address of the classic virtual network gateway.

1. For these steps, you need to obtain the public IP address for the **classic virtual network gateway**. You can find the gateway IP address by going to the classic virtual network **Overview** page.
1. In **All resources**, locate the local network gateway. In our example, the local network gateway is **ClassicVNetSite**.
1. In the left menu, click **Configuration** and update the IP address. Close the page.

For steps, see [Modify local network gateway settings](vpn-gateway-modify-local-network-gateway-portal.md).

## <a name="connections"></a>Configure connections

This section helps you connect your classic VNet to your RM VNet. Even though it appears that you can do the classic VNet connection in the portal, it will fail. This section requires PowerShell to be installed locally on your computer, as specified in the [Prerequisites](#before).

### <a name="classic-values"></a>Get classic VNet values

When you create a VNet in the Azure portal, the full values for name and site aren't visible in the portal. For example, a VNet that appears to be named 'ClassicVNet' in the Azure portal may have a much longer name in the network configuration file. The name might look something like: 'Group ClassicRG ClassicVNet'. The local network site may also have a much longer name than what appears in the portal.

In these steps, you download the network configuration file and to obtain the values used for the next sections.

#### 1. Connect to your Azure account

Open the PowerShell console with elevated rights and sign in to your Azure account. After logging in, your account settings are downloaded so that they're available to Azure PowerShell. The following cmdlets prompts you for the sign-in credentials for your Azure Account for the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md):

1. First, connect to RM.

   Connect to use the RM cmdlets.

    ```powershell
    Connect-AzAccount
    ```

1. Get a list of your Azure subscriptions (optional).

   ```powershell
   Get-AzSubscription
   ```

1. If you have more than one subscription, specify the subscription that you want to use.

   ```powershell
   Select-AzSubscription -SubscriptionName "Name of subscription"
   ```

1. Next, you must connect to the classic PowerShell cmdlets.

   Use the following command to add your Azure account for the classic deployment model:

   ```powershell
   Add-AzureAccount
   ```

1. Get a list of your subscriptions (optional).

   ```powershell
   Get-AzureSubscription
   ```

1. If you have more than one subscription, specify the subscription that you want to use.

   ```powershell
   Select-AzureSubscription -SubscriptionName "Name of subscription"
   ```

#### 2. View the network configuration file values

1. Create a directory on your computer. For our example, we created a directory called "AzureNet".
1. Export the network configuration file to the directory. In this example, the network configuration file is exported to C:\AzureNet.

   ```powershell
   Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
   ```

1. Open the file with a text editor and view the name for your classic VNet. Use the names in the network configuration file when running your PowerShell cmdlets.

   * VNet names are listed as **VirtualNetworkSite name =**
   * Site names are listed as **LocalNetworkSite name=**

#### 3. Create the connection

Set the shared key and create the connection from the classic VNet to the Resource Manager VNet. The connections must be created using PowerShell, not the Azure portal.

If you get an error, verify the site and the VNet names are correct. Also, make sure that you've authenticated for both versions of PowerShell or you won't be able to set the shared key.

* In this example, **-VNetName** is the name of the classic VNet as found in your network configuration file.
* The **-LocalNetworkSiteName** is the name you specified for the local site, as found in your network configuration file. Use the entire site name, including any numbers.
* The **-SharedKey** is a value that you generate and specify. For this example, we used *abc123*, but you should generate and use something more complex. The value you specify here must be the same value that you specify when creating your Resource Manager to classic connection.

1. Set the key.

   ```powershell
   Set-AzureVNetGatewayKey -VNetName "Group ClassicRG ClassicVNet" `
   -LocalNetworkSiteName "172B916_RMVNetSite" -SharedKey abc123
   ```

1. Create the VPN connection by running the following commands. Be sure to modify the commands to reflect your environment.

   Set the variables.

   ```powershell
   $vnet01gateway = Get-AzLocalNetworkGateway -Name ClassicVNetSite -ResourceGroupName RMRG
   $vnet02gateway = Get-AzVirtualNetworkGateway -Name RMGateway -ResourceGroupName RMRG
   ```

   Create the connection. Notice that the **-ConnectionType** is IPsec, not Vnet2Vnet.

   ```powershell
   New-AzVirtualNetworkGatewayConnection -Name RM-Classic -ResourceGroupName RMRG `
   -Location "East US" -VirtualNetworkGateway1 `
   $vnet02gateway -LocalNetworkGateway2 `
   $vnet01gateway -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
   ```

## <a name="verify"></a>Verify your connections

You can verify your connections by using the Azure portal or PowerShell. When verifying, you may need to wait a minute or two as the connection is being created. When a connection is successful, the connectivity state changes from 'Connecting' to 'Connected'.

### Verify the classic VNet to RM connection

[!INCLUDE [Verify connection classic](../../includes/vpn-gateway-verify-connection-azureportal-classic-include.md)]

### Verify the RM VNet to classic connection

[!INCLUDE [Verify connection RM](../../includes/vpn-gateway-verify-connection-portal-rm-include.md)]

## Next steps

For more information about VNet-to-VNet connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).
