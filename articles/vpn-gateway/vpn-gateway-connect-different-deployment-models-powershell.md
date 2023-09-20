---
title: 'Connect classic virtual networks to Azure Resource Manager VNets: PowerShell'
description: Learn how to connect classic VNets to Resource Manager VNets using PowerShell.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.topic: how-to
ms.date: 04/26/2022
ms.author: cherylmc
---
# Connect virtual networks from different deployment models using PowerShell

This article helps you connect classic VNets to Resource Manager VNets to allow the resources located in the separate deployment models to communicate with each other. The steps in this article use PowerShell.

This article is intended for customers who already have a VNet that was created using the classic (legacy) deployment model, and now want to connect the classic VNet to anther VNet that was created using the latest deployment model. If you don't already have a legacy VNet, use the [Create a VNet-to-VNet connection](vpn-gateway-vnet-vnet-rm-ps.md) article instead.

## Architecture

Connecting a classic VNet to a Resource Manager VNet is similar to connecting a VNet to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE. You can create a connection between VNets that are in different subscriptions and in different regions. You can also connect VNets that already have connections to on-premises networks, as long as the gateway is dynamic or route-based. For more information about VNet-to-VNet connections, see the [VNet-to-VNet FAQ](vpn-gateway-vpn-faq.md).

For this configuration, you create a VPN gateway connection over an IPsec/IKE VPN tunnel between the virtual networks. Make sure that none of your VNet ranges overlap with each other, or with any of the local networks that they connect to.

The following table shows an example of how the example VNets and local sites are defined:

| Virtual Network | Address Space | Region | Connects to local network site |
|:--- |:--- |:--- |:--- |
| ClassicVNet |(10.1.0.0/16) |West US | RMVNetSite (192.168.0.0/16) |
| RMVNet | (192.168.0.0/16) |East US |ClassicVNetSite (10.1.0.0/16) |

## <a name="pre"></a>Prerequisites

The following steps walk you through the settings necessary to configure a dynamic or route-based gateway for each VNet and create a VPN connection between the gateways. This configuration doesn't support static or policy-based gateways.

These steps assume that you have a legacy classic VNet and a Resource Manager VNet already created.

* Verify that the address ranges for the VNets don't overlap with each other, or overlap with any of the ranges for other connections that the gateways may be connected to.
* In this article, we use PowerShell. Install the latest PowerShell cmdlets to your computer for **both** Resource Manager and Service Management.

  While it's possible to perform a few of the PowerShell commands using the Azure Cloud Shell environment, you need to install both versions of the cmdlets to create the connections properly.

  * [Service Management (classic) PowerShell cmdlets](/powershell/azure/servicemanagement/install-azure-ps?). When you install the Service Management cmdlets, you may need to modify the [Execution policy](/powershell/module/microsoft.powershell.core/about/about_execution_policies?) in order to install the classic version of the Azure module.

  * [AZ PowerShell cmdlets for Resource Manager](/powershell/azure/install-az-ps?)

  For more information, see [How to install and configure Azure PowerShell](/powershell/azure/).

### <a name="exampleref"></a>Example settings

You can use these values to better understand the examples.

**Classic VNet**

VNet Name = ClassicVNet <br>
Resource Group = ClassicRG
Location = West US <br>
Virtual Network Address Spaces = 10.1.0.0/16 <br>
Subnet1 = 10.1.0.0/24 <br>
GatewaySubnet = 10.1.255.0/27 <br>
Local Network Name = RMVNetSite <br>
GatewayType = DynamicRouting <br>

**Resource Manager VNet**

VNet Name = RMVNet <br>
Resource Group = RMRG <br>
Virtual Network IP Address Spaces = 192.168.0.0/16 <br>
Subnet1 = 192.168.1.0/24 <br>
GatewaySubnet = 192.168.255.0/27 <br>
Location = East US <br>
Gateway public IP name = rmgwpip <br>
Local Network Gateway = ClassicVNetSite <br>
Virtual Network Gateway name = RMGateway <br>
Gateway IP addressing configuration = gwipconfig

## <a name="createsmgw"></a>Configure the classic VNet

In this section, you configure your already existing classic VNet. If your VNet already has a gateway, verify that the gateway is Route-based, then proceed to the next section. If the gateway isn't Route-based, delete the gateway before moving forward with the next steps. You'll have the opportunity to create a new gateway later.

### 1. Download your network configuration file

1. Sign in to your Azure account in the PowerShell console with elevated rights. The following cmdlet prompts you for the sign-in credentials for your Azure Account. After logging in, it downloads your account settings so that they're available to Azure PowerShell. The classic Service Management (SM) Azure PowerShell cmdlets are used in this section.

   ```azurepowershell
   Add-AzureAccount
   ```

   Get your Azure subscription.

   ```azurepowershell
   Get-AzureSubscription
   ```

   If you have more than one subscription, select the subscription that you want to use.

   ```azurepowershell
   Select-AzureSubscription -SubscriptionName "Name of subscription"
   ```

1. Create a directory on your computer. For this example, we created **AzureNet**.

1. Export your Azure network configuration file by running the following command. You can change the location of the file to export to a different location if necessary.

   ```azurepowershell
   Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
   ```

1. Open the .xml file that you downloaded to edit it. For an example of the network configuration file, see the [Network Configuration Schema](../cloud-services/schema-cscfg-networkconfiguration.md).

1. Take note of the `VirtualNetworkSite name=` value. If you created your classic VNet using the portal, the name follows a format similar to "Group ClassicRG ClassicVNet", rather than "ClassicVNet" in the portal.

### 2. Verify the gateway subnet

In the **VirtualNetworkSites** element, add a gateway subnet to your VNet if one hasn't already been created. The gateway subnet MUST be named "GatewaySubnet" or Azure can't recognize and use it as a gateway subnet.

[!INCLUDE [No NSG](../../includes/vpn-gateway-no-nsg-include.md)]

**Example:**

```xml
<VirtualNetworkSites>
  <VirtualNetworkSite name="ClassicVNet" Location="West US">
    <AddressSpace>
      <AddressPrefix>10.1.0.0/16</AddressPrefix>
    </AddressSpace>
    <Subnets>
      <Subnet name="Subnet1">
        <AddressPrefix>10.1.0.0/24</AddressPrefix>
      </Subnet>
      <Subnet name="GatewaySubnet">
        <AddressPrefix>10.1.255.0/27</AddressPrefix>
      </Subnet>
    </Subnets>
  </VirtualNetworkSite>
</VirtualNetworkSites>
```

### 3. Add the local network site

The local network site you add represents the RM VNet to which you want to connect. Add a **LocalNetworkSites** element to the file if one doesn't already exist. At this point in the configuration, the VPNGatewayAddress can be any valid public IP address because we haven't yet created the gateway for the Resource Manager VNet. Once you create the RM gateway, you'll replace this placeholder IP address with the correct public IP address that has been assigned to the RM gateway.

```xml
<LocalNetworkSites>
  <LocalNetworkSite name="RMVNetSite">
    <AddressSpace>
      <AddressPrefix>192.168.0.0/16</AddressPrefix>
    </AddressSpace>
    <VPNGatewayAddress>5.4.3.2</VPNGatewayAddress>
  </LocalNetworkSite>
</LocalNetworkSites>
```

### 4. Associate the VNet with the local network site

In this section, we specify the local network site that you want to connect the VNet to. In this case, it's the Resource Manager VNet that you referenced earlier. Make sure the names match. This step doesn't create a gateway. It specifies the local network that the gateway will connect to.

```xml
<Gateway>
  <ConnectionsToLocalNetwork>
    <LocalNetworkSiteRef name="RMVNetSite">
      <Connection type="IPsec" />
    </LocalNetworkSiteRef>
  </ConnectionsToLocalNetwork>
</Gateway>
```

### 5. Save the file and upload

Save the file, then import it to Azure by running the following command. Make sure you change the file path as necessary for your environment.

```azurepowershell
Set-AzureVNetConfig -ConfigurationPath C:\AzureNet\NetworkConfig.xml
```

You'll see a similar result showing that the import succeeded.

```output
OperationDescription        OperationId                      OperationStatus                                                
--------------------        -----------                      ---------------                                                
Set-AzureVNetConfig        e0ee6e66-9167-cfa7-a746-7casb9    Succeeded 
```

### 6. Create the gateway

Before running this example, refer to the network configuration file that you downloaded for the exact names that Azure expects to see. The network configuration file contains the values for your classic virtual networks. When a classic VNet is created using the portal, the virtual network name is different in the network configuration file. For example, if you used the Azure portal to create a classic VNet named 'Classic VNet' and created it in a resource group named 'ClassicRG', the name that is contained in the network configuration file is converted to 'Group ClassicRG Classic VNet'. Always use the name contained in the network configuration file when you are working with PowerShell.When you specify the name of a VNet that contains spaces, use quotation marks around the value.

Use the following example to create a dynamic routing gateway:

```azurepowershell
New-AzureVNetGateway -VNetName ClassicVNet -GatewayType DynamicRouting
```

You can check the status of the gateway by using the **Get-AzureVNetGateway** cmdlet.

## <a name="creatermgw"></a>Configure the RM VNet gateway

The prerequisites assume that you already have created an RM VNet. In this step, you create a VPN gateway for the RM VNet. Don't start these steps until after you have retrieved the public IP address for the classic VNet's gateway.

1. Sign in to your Azure account in the PowerShell console. The following cmdlet prompts you for the sign-in credentials for your Azure Account. After signing in, your account settings are downloaded so that they're available to Azure PowerShell. You can optionally use the "Try It" feature to launch Azure Cloud Shell in the browser.

   If you use Azure Cloud Shell, skip the following cmdlet:

   ```azurepowershell
   Connect-AzAccount
   ```

   To verify that you're using the right subscription, run the following cmdlet:  

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

   If you have more than one subscription, specify the subscription that you want to use.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName "Name of subscription"
   ```

1. Create a local network gateway. In a virtual network, the local network gateway typically refers to your on-premises location. In this case, the local network gateway refers to your Classic VNet. Give it a name by which Azure can refer to it, and also specify the address space prefix. Azure uses the IP address prefix you specify to identify which traffic to send to your on-premises location. If you need to adjust the information here later, before creating your gateway, you can modify the values and run the sample again.

   **-Name** is the name you want to assign to refer to the local network gateway.<br>
   **-AddressPrefix** is the Address Space for your classic VNet.<br>
   **-GatewayIpAddress** is the public IP address of the classic VNet's gateway. Be sure to change the following sample text "n.n.n.n" to reflect the correct IP address.<br>

   ```azurepowershell-interactive
   New-AzLocalNetworkGateway -Name ClassicVNetSite `
   -Location "West US" -AddressPrefix "10.1.0.0/16" `
   -GatewayIpAddress "n.n.n.n" -ResourceGroupName RMRG
   ```

1. Request a public IP address to be allocated to the virtual network gateway for the Resource Manager VNet. You can't specify the IP address that you want to use. The IP address is dynamically allocated to the virtual network gateway. However, this doesn't mean the IP address changes. The only time the virtual network gateway IP address changes is when the gateway is deleted and recreated. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of the gateway.

   In this step, we also set a variable that is used in a later step.

   ```azurepowershell-interactive
   $ipaddress = New-AzPublicIpAddress -Name rmgwpip `
   -ResourceGroupName RMRG -Location 'EastUS' `
   -AllocationMethod Dynamic
   ```

1. Verify that your virtual network has a gateway subnet. If no gateway subnet exists, add one. Make sure the gateway subnet is named *GatewaySubnet*.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -ResourceGroupName RMRG -Name RMVNet
   Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 192.168.255.0/27 -VirtualNetwork $vnet
   Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```

1. Retrieve the subnet used for the gateway by running the following command. In this step, we also set a variable to be used in the next step.

   **-Name** is the name of your Resource Manager VNet.<br>
   **-ResourceGroupName** is the resource group that the VNet is associated with. The gateway subnet must already exist for this VNet and must be named *GatewaySubnet* to work properly.<br>

   ```azurepowershell-interactive
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name GatewaySubnet `
   -VirtualNetwork (Get-AzVirtualNetwork -Name RMVNet -ResourceGroupName RMRG)
   ```

1. Create the gateway IP addressing configuration. The gateway configuration defines the subnet and the public IP address to use. Use the following sample to create your gateway configuration.

   In this step, the **-SubnetId** and **-PublicIpAddressId** parameters must be passed the ID property from the subnet, and IP address objects, respectively. You can't use a simple string. These variables are set in the step to request a public IP and the step to retrieve the subnet.

   ```azurepowershell-interactive
   $gwipconfig = New-AzVirtualNetworkGatewayIpConfig `
   -Name gwipconfig -SubnetId $subnet.id `
   -PublicIpAddressId $ipaddress.id
   ```

1. Create the Resource Manager virtual network gateway by running the following command. The `-VpnType` must be *RouteBased*. It can take 45 minutes or more for the gateway to create.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name RMGateway -ResourceGroupName RMRG `
   -Location "EastUS" -GatewaySKU Standard -GatewayType Vpn `
   -IpConfigurations $gwipconfig `
   -EnableBgp $false -VpnType RouteBased
   ```

1. Copy the public IP address once the VPN gateway has been created. You use it when you configure the local network settings for your Classic VNet. You can use the following cmdlet to retrieve the public IP address. The public IP address is listed in the return as *IpAddress*.

   ```azurepowershell-interactive
   Get-AzPublicIpAddress -Name rmgwpip -ResourceGroupName RMRG
   ```

## <a name="localsite"></a>Modify the classic VNet local site settings

In this section, you work with the classic VNet. You replace the placeholder IP address that you used when specifying the local site settings that will be used to connect to the Resource Manager VNet gateway. Because you're working with the classic VNet, use PowerShell installed locally to your computer, not the Azure Cloud Shell TryIt.

1. Export the network configuration file.

   ```azurepowershell
   Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
   ```

1. Using a text editor, modify the value for VPNGatewayAddress. Replace the placeholder IP address with the public IP address of the Resource Manager gateway and then save the changes.

   ```xml
   <VPNGatewayAddress>13.68.210.16</VPNGatewayAddress>
   ```

1. Import the modified network configuration file to Azure.

   ```azurepowershell
   Set-AzureVNetConfig -ConfigurationPath C:\AzureNet\NetworkConfig.xml
   ```

## <a name="connect"></a>Create a connection between the gateways

Creating a connection between the gateways requires PowerShell. You may need to add your Azure Account to use the classic version of the PowerShell cmdlets. To do so, use **Add-AzureAccount**.

1. In the PowerShell console, set your shared key. Before running the cmdlets, refer to the network configuration file that you downloaded for the exact names that Azure expects to see. When specifying the name of a VNet that contains spaces, use single quotation marks around the value.

   In following example, **-VNetName** is the name of the classic VNet and **-LocalNetworkSiteName** is the name you specified for the local network site. Verify the names of both in the network configuration file that you downloaded earlier.

   The **-SharedKey** is a value that you generate and specify. In the example, we used 'abc123', but you can generate and use something more complex. The important thing is that the value you specify here must be the same value that you specify in the next step when you create your connection. The return should show **Status: Successful**.

   ```azurepowershell
   Set-AzureVNetGatewayKey -VNetName ClassicVNet `
   -LocalNetworkSiteName RMVNetSite -SharedKey abc123
   ```

1. Create the VPN connection by running the following commands:

   Set the variables.

   ```azurepowershell-interactive
   $vnet01gateway = Get-AzLocalNetworkGateway -Name ClassicVNetSite -ResourceGroupName RMRG
   $vnet02gateway = Get-AzVirtualNetworkGateway -Name RMGateway -ResourceGroupName RMRG
   ```

   Create the connection. Notice that the **-ConnectionType** is IPsec, not Vnet2Vnet.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection -Name RM-Classic -ResourceGroupName RMRG `
   -Location "East US" -VirtualNetworkGateway1 `
   $vnet02gateway -LocalNetworkGateway2 `
   $vnet01gateway -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
   ```

## <a name="verify"></a>Verify your connections

### Classic VNet to RM VNet

You can verify that your connection succeeded by using the 'Get-AzureVNetConnection' cmdlet. This cmdlet must be run locally on your computer.

1. Use the following cmdlet example, configuring the values to match your own. The name of the virtual network must be in quotes if it contains spaces. Use the name of the virtual network, as found in the network configuration file.

   ```azurepowershell
   Get-AzureVNetConnection "ClassicVNet"
   ```

1. After the cmdlet has finished, view the values. In the example below, the Connectivity State shows as 'Connected' and you can see ingress and egress bytes.

   ```output
   ConnectivityState         : Connected
   EgressBytesTransferred    : 0
   IngressBytesTransferred   : 0
   LastConnectionEstablished : 4/25/2022 4:24:34 PM
   LastEventID               : 24401
   LastEventMessage          : The connectivity state for the local network site 'RMVNetSite' changed from Not Connected to Connected.
   LastEventTimeStamp        : 4/25/2022 4:24:34 PM
   LocalNetworkSiteName      : RMVNetSite
   OperationDescription      :
   OperationId               :
   OperationStatus           :
   ```  

### RM VNet to classic VNet

You can verify that your connection succeeded by using the 'Get-AzVirtualNetworkGatewayConnection' cmdlet, with or without '-Debug'.

1. Use the following cmdlet example, configuring the values to match your own. If prompted, select 'A' in order to run 'All'. In the example, '-Name' refers to the name of the connection that you want to test.

   ```azurepowershell-interactive
   Get-AzVirtualNetworkGatewayConnection -Name VNet1toSite1 -ResourceGroupName TestRG1
   ```

1. After the cmdlet has finished, view the values. In the example below, the connection status shows as 'Connected' and you can see ingress and egress bytes.

   ```azure-powershell-interactive
   "connectionStatus": "Connected",
   "ingressBytesTransferred": 33509044,
   "egressBytesTransferred": 4142431
   ```

## Next steps

For more information about VNet-to-VNet connections, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).
