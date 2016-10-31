<properties 
   pageTitle="How to connect classic virtual networks to Resource Manager virtual networks using PowerShell | Microsoft Azure"
   description="Learn how to create a VPN connection between classic VNets and Resource Manager VNets using VPN Gateway and PowerShell"
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
   ms.date="09/23/2016"
   ms.author="cherylmc" />

# Connect virtual networks from different deployment models using PowerShell

> [AZURE.SELECTOR]
- [Portal](vpn-gateway-connect-different-deployment-models-portal.md)
- [PowerShell](vpn-gateway-connect-different-deployment-models-powershell.md)

Azure currently has two management models: classic and Resource Manager (RM). If you have been using Azure for some time, you probably have Azure VMs and instance roles running in a classic VNet. Your newer VMs and role instances may be running in a VNet created in Resource Manager. This article walks you through connecting classic VNets to Resource Manager VNets to allow the resources located in the separate deployment models to communicate with each other over a gateway connection.

You can create a connection between VNets that are in different subscriptions and in different regions. You can also connect VNets that already have connections to on-premises networks, as long as the gateway that they have been configured with is dynamic or route-based. For more information about VNet-to-VNet connections, see the [VNet-to-VNet FAQ](#faq) at the end of this article.

### Deployment models and methods for connecting VNets in different deployment models

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

We update the following table as new articles and additional tools become available for this configuration. When an article is available, we link directly to it from the table.<br><br>

[AZURE.INCLUDE [vpn-gateway-table-vnet-vnet](../../includes/vpn-gateway-table-vnet-to-vnet-include.md)] 

#### VNet peering

[AZURE.INCLUDE [vpn-gateway-vnetpeeringlink](../../includes/vpn-gateway-vnetpeeringlink-include.md)]


## Before beginning

The following steps walk you through the settings necessary to configure a dynamic or route-based gateway for each VNet and create a VPN connection between the gateways. This configuration does not support static or policy-based gateways.

### Prerequisites

 - Both VNets have already been created.
 - The address ranges for the VNets do not overlap with each other, or overlap with any of the ranges for other connections that the gateways may be connected to.
 - You have installed the latest PowerShell cmdlets (1.0.2 or later). See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information. Make sure you install both the Service Management (SM) and the Resource Manager (RM) cmdlets. 

### <a name="exampleref"></a>Example settings

You can use the example settings as a reference.

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

### Part 1 - Download your network configuration file

1. Log in to your Azure account in the PowerShell console with elevated rights. The following cmdlet prompts you for the login credentials for your Azure Account. After logging in, it downloads your account settings so that they are available to Azure PowerShell. You will be using the SM PowerShell cmdlets to complete this part of the configuration.

		Add-AzureAccount

2. Export your Azure network configuration file by running the following command. You can change the location of the file to export to a different location if necessary. You will edit the file and then import it to Azure.

		Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml

3. Open the .xml file that you downloaded to edit it. For an example of the network configuration file, see the [Network Configuration Schema](https://msdn.microsoft.com/library/jj157100.aspx).
 

### Part 2 -Verify the gateway subnet

In the **VirtualNetworkSites** element, add a gateway subnet to your VNet if one has not already been created. When working with the network configuration file, the gateway subnet MUST be named "GatewaySubnet" or Azure cannot recognize and use it as a gateway subnet.

[AZURE.INCLUDE [vpn-gateway-no-nsg-include](../../includes/vpn-gateway-no-nsg-include.md)]

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
       
### Part 3 - Add the local network site

The local network site you add represents the RM VNet to which you want to connect. You may have to add a **LocalNetworkSites** element to the file if one doesn't already exist. At this point in the configuration, the VPNGatewayAddress can be any valid public IP address because we haven't yet created the gateway for the Resource Manager VNet. Once we create the gateway, we replace this placeholder IP address with the correct public IP address that has been assigned to the RM gateway.

    <LocalNetworkSites>
      <LocalNetworkSite name="RMVNetLocal">
        <AddressSpace>
          <AddressPrefix>192.168.0.0/16</AddressPrefix>
        </AddressSpace>
        <VPNGatewayAddress>13.68.210.16</VPNGatewayAddress>
      </LocalNetworkSite>
    </LocalNetworkSites>

### Part 4 - Associate the VNet with the local network site

In this section, we specify the local network site that you want to connect the VNet to. In this case, it is the Resource Manager VNet that you referenced earlier. Make sure the names match. This step does not create a gateway. It specifies the local network that the gateway will connect to.

		<Gateway>
          <ConnectionsToLocalNetwork>
            <LocalNetworkSiteRef name="RMVNetLocal">
              <Connection type="IPsec" />
            </LocalNetworkSiteRef>
          </ConnectionsToLocalNetwork>
        </Gateway>

### Part 5 - Save the file and upload

Save the file, then import it to Azure by running the following command. Make sure you change the file path as necessary for your environment.

		Set-AzureVNetConfig -ConfigurationPath C:\AzureNet\NetworkConfig.xml

You should see something similar to this result showing that the import succeeded.

		OperationDescription        OperationId                      OperationStatus                                                
		--------------------        -----------                      ---------------                                                
		Set-AzureVNetConfig        e0ee6e66-9167-cfa7-a746-7casb9    Succeeded 

### Part 6 - Create the gateway 

You can create the VNet gateway either by using the classic portal, or by using PowerShell.

Use the following example to create a dynamic routing gateway:

	New-AzureVNetGateway -VNetName ClassicVNet -GatewayType DynamicRouting

You can check the status of the gateway by using the `Get-AzureVNetGateway` cmdlet.


## <a name="creatermgw"></a>Section 2: Configure the RM VNet gateway

To create a VPN gateway for the RM VNet, follow the following instructions. Don't start the steps until after you have retrieved the public IP address for the classic VNet's gateway. 

1. **Log in to your Azure account** in the PowerShell console. The following cmdlet prompts you for the login credentials for your Azure Account. After logging in, your account settings are downloaded so that they are available to Azure PowerShell.

		Login-AzureRmAccount 

 	Get a list of your Azure subscriptions if you have more than one subscription.

		Get-AzureRmSubscription

	Specify the subscription that you want to use. 

		Select-AzureRmSubscription -SubscriptionName "Name of subscription"


2.  **Create a local network gateway**. In a virtual network, the local network gateway typically refers to your on-premises location. In this case, the local network gateway refers to your Classic VNet. Give it a name by which Azure can refer to it, and also specify the address space prefix. Azure uses the IP address prefix you specify to identify which traffic to send to your on-premises location. If you need to adjust the information here later, before creating your gateway, you can modify the values and run the sample again.<br><br>
	- `-Name` is the name you want to assign to refer to the local network gateway.<br>
	- `-AddressPrefix` is the Address Space for your classic VNet.<br>
	- `-GatewayIpAddress` is the public IP address of the classic VNet's gateway. Be sure to change the following sample to reflect the correct IP address.
	
			New-AzureRmLocalNetworkGateway -Name ClassicVNetLocal `
			-Location "West US" -AddressPrefix "10.0.0.0/24" `
			-GatewayIpAddress "n.n.n.n" -ResourceGroupName RG1

3. **Request a public IP address** to be allocated to the virtual network gateway for the Resource Manager VNet. You can't specify the IP address that you want to use. The IP address is dynamically allocated to the virtual network gateway. However, this does not mean the IP address will change. The only time the virtual network gateway IP address changes is when the gateway is deleted and recreated. It won't change across resizing, resetting, or other internal maintenance/upgrades of the gateway.<br>In this step, we also set a variable that is used in a later step.


		$ipaddress = New-AzureRmPublicIpAddress -Name gwpip `
		-ResourceGroupName RG1 -Location 'EastUS' `
		-AllocationMethod Dynamic

4. **Verify that your virtual network has a gateway subnet**. If no gateway subnet exists, add one. Make sure the gateway subnet is named *GatewaySubnet*.

5. **Retrieve the subnet** used for the gateway by running the following command. In this step, we also set a variable to be used in the next step.
	- `-Name` is the name of your Resource Manager VNet.
	- `-ResourceGroupName` is the resource group that the VNet is associated with. The gateway subnet must already exist for this VNet and must be named *GatewaySubnet* to work properly.


			$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name GatewaySubnet `
			-VirtualNetwork (Get-AzureRmVirtualNetwork -Name RMVNet -ResourceGroupName RG1) 

6. **Create the gateway IP addressing configuration**. The gateway configuration defines the subnet and the public IP address to use. Use the following sample to create your gateway configuration.<br>In this step, the `-SubnetId` and `-PublicIpAddressId` parameters must be passed the id property from the subnet, and IP address objects, respectively. You cannot use a simple string. These variables are set in the step to request a public IP and the step to retrieve the subnet.

		$gwipconfig = New-AzureRmVirtualNetworkGatewayIpConfig `
		-Name gwipconfig -SubnetId $subnet.id `
		-PublicIpAddressId $ipaddress.id
	
7. **Create the Resource Manager virtual network gateway** by running the following command. The `-VpnType` must be *RouteBased*. It can take 45 minutes or more for this to complete.

		New-AzureRmVirtualNetworkGateway -Name RMGateway -ResourceGroupName RG1 `
		-Location "EastUS" -GatewaySKU Standard -GatewayType Vpn `
		-IpConfigurations $gwipconfig `
		-EnableBgp $false -VpnType RouteBased

8. **Copy the public IP address** once the VPN gateway has been created. You use it when you configure the local network settings for your Classic VNet. You can use the following cmdlet to retrieve the public IP address. The public IP address is listed in the return as *IpAddress*.

		Get-AzureRmPublicIpAddress -Name gwpip -ResourceGroupName RG1

## Section 3: Modify the local network for the classic VNet

You can do this step either by exporting the network configuration file, editing it, and then saving and importing the file back to Azure. Or, you can modify this setting in the classic portal. 

### To modify in the portal

1. Open the [classic portal](https://manage.windowsazure.com).

2. In the classic portal, scroll down on the left side and click **Networks**. On the **networks** page, click **Local Networks** at the top of the page. 

3. On the **Local Networks** page, click to select the local network that you configured in Part 1, and then go to the bottom of the page and click **Edit**.

4. On the **Specify your local network details** page, replace the placeholder IP address with the public IP address for the Resource Manager gateway that you created in the previous section. Click the arrow to move to the next section. Verify that the **Address Space** is correct, and then click the checkmark to accept the changes.

### To modify using the network configuration file

1. Export the network configuration file.
2. In a text editor, modify the VPN gateway IP address.

	    <VPNGatewayAddress>13.68.210.16</VPNGatewayAddress>

3. Save your changes and import the edited file back to Azure.


## <a name="connect"></a>Section 4: Create a connection between the gateways

Creating a connection between the gateways requires PowerShell. You may need to add your Azure Account to use the classic PowerShell cmdlets. To do so, you can use the following cmdlet: 
		
	Add-AzureAccount

1. **Set your shared key** by running the following command. In this sample, `-VNetName` is the name of the classic VNet and `-LocalNetworkSiteName` is the name you specified for the local network when you configured it in the classic portal. The `-SharedKey` is a value that you can generate and specify. The value you specify here must be the same value that you specify in the next step when you create your connection. The return for this sample should show **Status: Successful**.

		Set-AzureVNetGatewayKey -VNetName ClassicVNet `
		-LocalNetworkSiteName RMVNetLocal -SharedKey abc123

2. Create the VPN connection by running the following commands.

	**Set the variables**

		$vnet01gateway = Get-AzureRMLocalNetworkGateway -Name ClassicVNetLocal -ResourceGroupName RG1
		$vnet02gateway = Get-AzureRmVirtualNetworkGateway -Name RMGateway -ResourceGroupName RG1

	**Create the connection**<br> Note that the `-ConnectionType` is IPsec, not Vnet2Vnet.
		
		New-AzureRmVirtualNetworkGatewayConnection -Name RM-Classic -ResourceGroupName RG1 `
		-Location "East US" -VirtualNetworkGateway1 `
		$vnet02gateway -LocalNetworkGateway2 `
		$vnet01gateway -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'

3. You can view your connection in either portal, or by using the `Get-AzureRmVirtualNetworkGatewayConnection` cmdlet.

		Get-AzureRmVirtualNetworkGatewayConnection -Name RM-Classic -ResourceGroupName RG1

## <a name="faq"></a>VNet-to-VNet FAQ

View the FAQ details for additional information about VNet-to-VNet connections.

[AZURE.INCLUDE [vpn-gateway-vnet-vnet-faq](../../includes/vpn-gateway-vnet-vnet-faq-include.md)] 


