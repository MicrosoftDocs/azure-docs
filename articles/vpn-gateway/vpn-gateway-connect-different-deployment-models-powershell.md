---
title: 'Connect classic virtual networks to Azure Resource Manager VNets: PowerShell'
description: Create a VPN connection between classic VNets and Resource Manager VNets using VPN Gateway and PowerShell.
services: vpn-gateway
titleSuffix: Azure VPN Gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 10/17/2018
ms.author: cherylmc

---
# Connect virtual networks from different deployment models using PowerShell

This article helps you connect classic VNets to Resource Manager VNets to allow the resources located in the separate deployment models to communicate with each other. The steps in this article use PowerShell, but you can also create this configuration using the Azure portal by selecting the article from this list.

> [!div class="op_single_selector"]
> * [Portal](vpn-gateway-connect-different-deployment-models-portal.md)
> * [PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)
> 
> 

Connecting a classic VNet to a Resource Manager VNet is similar to connecting a VNet to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE. You can create a connection between VNets that are in different subscriptions and in different regions. You can also connect VNets that already have connections to on-premises networks, as long as the gateway that they have been configured with is dynamic or route-based. For more information about VNet-to-VNet connections, see the [VNet-to-VNet FAQ](#faq) at the end of this article. 

If you do not already have a virtual network gateway and do not want to create one, you may want to instead consider connecting your VNets using VNet Peering. VNet peering does not use a VPN gateway. For more information, see [VNet peering](../virtual-network/virtual-network-peering-overview.md).

## <a name="before"></a>Before you begin

The following steps walk you through the settings necessary to configure a dynamic or route-based gateway for each VNet and create a VPN connection between the gateways. This configuration does not support static or policy-based gateways.

### <a name="pre"></a>Prerequisites

* Both VNets have already been created. If you need to create a resource manager virtual network, see [Create a resource group and a virtual network](../virtual-network/quick-create-powershell.md#create-a-resource-group-and-a-virtual-network). To create a classic virtual network, see [Create a classic VNet](https://docs.microsoft.com/azure/virtual-network/create-virtual-network-classic).
* The address ranges for the VNets do not overlap with each other, or overlap with any of the ranges for other connections that the gateways may be connected to.
* You have installed the latest PowerShell cmdlets. See [How to install and configure Azure PowerShell](/powershell/azure/overview) for more information. Make sure you install both the Service Management (SM) and the Resource Manager (RM) cmdlets. 

### <a name="exampleref"></a>Example settings

You can use these values to create a test environment, or refer to them to better understand the examples in this article.

**Classic VNet settings**

VNet Name = ClassicVNet <br>
Location = West US <br>
Virtual Network Address Spaces = 10.0.0.0/24 <br>
Subnet-1 = 10.0.0.0/27 <br>
GatewaySubnet = 10.0.0.32/29 <br>
Local Network Name = RMVNetLocal <br>
GatewayType = DynamicRouting

**Resource Manager VNet settings**

VNet Name = RMVNet <br>
Resource Group = RG1 <br>
Virtual Network IP Address Spaces = 192.168.0.0/16 <br>
Subnet-1 = 192.168.1.0/24 <br>
GatewaySubnet = 192.168.0.0/26 <br>
Location = East US <br>
Gateway public IP name = gwpip <br>
Local Network Gateway = ClassicVNetLocal <br>
Virtual Network Gateway name = RMGateway <br>
Gateway IP addressing configuration = gwipconfig

## <a name="createsmgw"></a>Section 1 - Configure the classic VNet
### 1. Download your network configuration file
1. Log in to your Azure account in the PowerShell console with elevated rights. The following cmdlet prompts you for the login credentials for your Azure Account. After logging in, it downloads your account settings so that they are available to Azure PowerShell. The classic Service Management (SM) Azure PowerShell cmdlets are used in this section.

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
2. Export your Azure network configuration file by running the following command. You can change the location of the file to export to a different location if necessary.

   ```azurepowershell
   Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
   ```
3. Open the .xml file that you downloaded to edit it. For an example of the network configuration file, see the [Network Configuration Schema](https://msdn.microsoft.com/library/jj157100.aspx).

### 2. Verify the gateway subnet
In the **VirtualNetworkSites** element, add a gateway subnet to your VNet if one has not already been created. When working with the network configuration file, the gateway subnet MUST be named "GatewaySubnet" or Azure cannot recognize and use it as a gateway subnet.

[!INCLUDE [vpn-gateway-no-nsg-include](../../includes/vpn-gateway-no-nsg-include.md)]

**Example:**

    <VirtualNetworkSites>
      <VirtualNetworkSite name="ClassicVNet" Location="West US">
        <AddressSpace>
          <AddressPrefix>10.0.0.0/24</AddressPrefix>
        </AddressSpace>
        <Subnets>
          <Subnet name="Subnet-1">
            <AddressPrefix>10.0.0.0/27</AddressPrefix>
          </Subnet>
          <Subnet name="GatewaySubnet">
            <AddressPrefix>10.0.0.32/29</AddressPrefix>
          </Subnet>
        </Subnets>
      </VirtualNetworkSite>
    </VirtualNetworkSites>

### 3. Add the local network site
The local network site you add represents the RM VNet to which you want to connect. Add a **LocalNetworkSites** element to the file if one doesn't already exist. At this point in the configuration, the VPNGatewayAddress can be any valid public IP address because we haven't yet created the gateway for the Resource Manager VNet. Once we create the gateway, we replace this placeholder IP address with the correct public IP address that has been assigned to the RM gateway.

    <LocalNetworkSites>
      <LocalNetworkSite name="RMVNetLocal">
        <AddressSpace>
          <AddressPrefix>192.168.0.0/16</AddressPrefix>
        </AddressSpace>
        <VPNGatewayAddress>13.68.210.16</VPNGatewayAddress>
      </LocalNetworkSite>
    </LocalNetworkSites>

### 4. Associate the VNet with the local network site
In this section, we specify the local network site that you want to connect the VNet to. In this case, it is the Resource Manager VNet that you referenced earlier. Make sure the names match. This step does not create a gateway. It specifies the local network that the gateway will connect to.

        <Gateway>
          <ConnectionsToLocalNetwork>
            <LocalNetworkSiteRef name="RMVNetLocal">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
          </ConnectionsToLocalNetwork>
        </Gateway>

### 5. Save the file and upload
Save the file, then import it to Azure by running the following command. Make sure you change the file path as necessary for your environment.

```azurepowershell
Set-AzureVNetConfig -ConfigurationPath C:\AzureNet\NetworkConfig.xml
```

You will see a similar result showing that the import succeeded.

        OperationDescription        OperationId                      OperationStatus                                                
        --------------------        -----------                      ---------------                                                
        Set-AzureVNetConfig        e0ee6e66-9167-cfa7-a746-7casb9    Succeeded 

### 6. Create the gateway

Before running this example, refer to the network configuration file that you downloaded for the exact names that Azure expects to see. The network configuration file contains the values for your classic virtual networks. Sometimes the names for classic VNets are changed in the network configuration file when creating classic VNet settings in the Azure portal due to the differences in the deployment models. For example, if you used the Azure portal to create a classic VNet named 'Classic VNet' and created it in a resource group named 'ClassicRG', the name that is contained in the network configuration file is converted to 'Group ClassicRG Classic VNet'. When specifying the name of a VNet that contains spaces, use quotation marks around the value.


Use the following example to create a dynamic routing gateway:

```azurepowershell
New-AzureVNetGateway -VNetName ClassicVNet -GatewayType DynamicRouting
```

You can check the status of the gateway by using the **Get-AzureVNetGateway** cmdlet.

## <a name="creatermgw"></a>Section 2 - Configure the RM VNet gateway



The prerequisites assume that you already have created an RM VNet. In this step, you create a VPN gateway for the RM VNet. Don't start these steps until after you have retrieved the public IP address for the classic VNet's gateway. 

1. Sign in to your Azure account in the PowerShell console. The following cmdlet prompts you for the login credentials for your Azure Account. After signing in, your account settings are downloaded so that they are available to Azure PowerShell. You can optionally use the "Try It" feature to launch Azure Cloud Shell in the browser.

   If you use Azure Cloud Shell, skip the following cmdlet:

   ```azurepowershell
   Connect-AzAccount
   ``` 
   To verify that you are using the right subscription, run the following cmdlet:  

   ```azurepowershell-interactive
   Get-AzSubscription
   ```
   
   If you have more than one subscription, specify the subscription that you want to use.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName "Name of subscription"
   ```
2. Create a local network gateway. In a virtual network, the local network gateway typically refers to your on-premises location. In this case, the local network gateway refers to your Classic VNet. Give it a name by which Azure can refer to it, and also specify the address space prefix. Azure uses the IP address prefix you specify to identify which traffic to send to your on-premises location. If you need to adjust the information here later, before creating your gateway, you can modify the values and run the sample again.
   
   **-Name** is the name you want to assign to refer to the local network gateway.<br>
   **-AddressPrefix** is the Address Space for your classic VNet.<br>
   **-GatewayIpAddress** is the public IP address of the classic VNet's gateway. Be sure to change the following sample text "n.n.n.n" to reflect the correct IP address.<br>

   ```azurepowershell-interactive
   New-AzLocalNetworkGateway -Name ClassicVNetLocal `
   -Location "West US" -AddressPrefix "10.0.0.0/24" `
   -GatewayIpAddress "n.n.n.n" -ResourceGroupName RG1
   ```
3. Request a public IP address to be allocated to the virtual network gateway for the Resource Manager VNet. You can't specify the IP address that you want to use. The IP address is dynamically allocated to the virtual network gateway. However, this does not mean the IP address changes. The only time the virtual network gateway IP address changes is when the gateway is deleted and recreated. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of the gateway.

   In this step, we also set a variable that is used in a later step.

   ```azurepowershell-interactive
   $ipaddress = New-AzPublicIpAddress -Name gwpip `
   -ResourceGroupName RG1 -Location 'EastUS' `
   -AllocationMethod Dynamic
   ```

4. Verify that your virtual network has a gateway subnet. If no gateway subnet exists, add one. Make sure the gateway subnet is named *GatewaySubnet*.
5. Retrieve the subnet used for the gateway by running the following command. In this step, we also set a variable to be used in the next step.
   
   **-Name** is the name of your Resource Manager VNet.<br>
   **-ResourceGroupName** is the resource group that the VNet is associated with. The gateway subnet must already exist for this VNet and must be named *GatewaySubnet* to work properly.<br>

   ```azurepowershell-interactive
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name GatewaySubnet `
   -VirtualNetwork (Get-AzVirtualNetwork -Name RMVNet -ResourceGroupName RG1)
   ``` 

6. Create the gateway IP addressing configuration. The gateway configuration defines the subnet and the public IP address to use. Use the following sample to create your gateway configuration.

   In this step, the **-SubnetId** and **-PublicIpAddressId** parameters must be passed the id property from the subnet, and IP address objects, respectively. You can't use a simple string. These variables are set in the step to request a public IP and the step to retrieve the subnet.

   ```azurepowershell-interactive
   $gwipconfig = New-AzVirtualNetworkGatewayIpConfig `
   -Name gwipconfig -SubnetId $subnet.id `
   -PublicIpAddressId $ipaddress.id
   ```
7. Create the Resource Manager virtual network gateway by running the following command. The `-VpnType` must be *RouteBased*. It can take 45 minutes or more for the gateway to create.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name RMGateway -ResourceGroupName RG1 `
   -Location "EastUS" -GatewaySKU Standard -GatewayType Vpn `
   -IpConfigurations $gwipconfig `
   -EnableBgp $false -VpnType RouteBased
   ```
8. Copy the public IP address once the VPN gateway has been created. You use it when you configure the local network settings for your Classic VNet. You can use the following cmdlet to retrieve the public IP address. The public IP address is listed in the return as *IpAddress*.

   ```azurepowershell-interactive
   Get-AzPublicIpAddress -Name gwpip -ResourceGroupName RG1
   ```

## <a name="localsite"></a>Section 3 - Modify the classic VNet local site settings

In this section, you work with the classic VNet. You replace the placeholder IP address that you used when specifying the local site settings that will be used to connect to the Resource Manager VNet gateway. Because you are working with the classic VNet, use PowerShell installed locally to your computer, not the Azure Cloud Shell TryIt.

1. Export the network configuration file.

   ```azurepowershell
   Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
   ```
2. Using a text editor, modify the value for VPNGatewayAddress. Replace the placeholder IP address with the public IP address of the Resource Manager gateway and then save the changes.

   ```
   <VPNGatewayAddress>13.68.210.16</VPNGatewayAddress>
   ```
3. Import the modified network configuration file to Azure.

   ```azurepowershell
   Set-AzureVNetConfig -ConfigurationPath C:\AzureNet\NetworkConfig.xml
   ```

## <a name="connect"></a>Section 4 - Create a connection between the gateways
Creating a connection between the gateways requires PowerShell. You may need to add your Azure Account to use the classic version of the PowerShell cmdlets. To do so, use **Add-AzureAccount**.

1. In the PowerShell console, set your shared key. Before running the cmdlets, refer to the network configuration file that you downloaded for the exact names that Azure expects to see. When specifying the name of a VNet that contains spaces, use single quotation marks around the value.<br><br>In following example, **-VNetName** is the name of the classic VNet and **-LocalNetworkSiteName** is the name you specified for the local network site. The **-SharedKey** is a value that you generate and specify. In the example, we used 'abc123', but you can generate and use something more complex. The important thing is that the value you specify here must be the same value that you specify in the next step when you create your connection. The return should show **Status: Successful**.

   ```azurepowershell
   Set-AzureVNetGatewayKey -VNetName ClassicVNet `
   -LocalNetworkSiteName RMVNetLocal -SharedKey abc123
   ```
2. Create the VPN connection by running the following commands:
   
   Set the variables.

   ```azurepowershell-interactive
   $vnet01gateway = Get-AzLocalNetworkGateway -Name ClassicVNetLocal -ResourceGroupName RG1
   $vnet02gateway = Get-AzVirtualNetworkGateway -Name RMGateway -ResourceGroupName RG1
   ```
   
   Create the connection. Notice that the **-ConnectionType** is IPsec, not Vnet2Vnet.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGatewayConnection -Name RM-Classic -ResourceGroupName RG1 `
   -Location "East US" -VirtualNetworkGateway1 `
   $vnet02gateway -LocalNetworkGateway2 `
   $vnet01gateway -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
   ```

## <a name="verify"></a>Section 5 - Verify your connections

### To verify the connection from your classic VNet to your Resource Manager VNet

#### PowerShell

[!INCLUDE [vpn-gateway-verify-connection-ps-classic](../../includes/vpn-gateway-verify-connection-ps-classic-include.md)]

#### Azure portal

[!INCLUDE [vpn-gateway-verify-connection-azureportal-classic](../../includes/vpn-gateway-verify-connection-azureportal-classic-include.md)]


### To verify the connection from your Resource Manager VNet to your classic VNet

#### PowerShell

[!INCLUDE [vpn-gateway-verify-ps-rm](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

#### Azure portal

[!INCLUDE [vpn-gateway-verify-connection-portal-rm](../../includes/vpn-gateway-verify-connection-portal-rm-include.md)]

## <a name="faq"></a>VNet-to-VNet FAQ

[!INCLUDE [vpn-gateway-vnet-vnet-faq](../../includes/vpn-gateway-faq-vnet-vnet-include.md)]
