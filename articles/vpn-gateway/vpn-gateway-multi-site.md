<properties 
   pageTitle="Connect multiple on-premises sites to a virtual network using a VPN Gateway"
   description="This article will walk you through connecting multiple local on-premises sites to a virtual network using a VPN Gateway for the classic deployment model."
   services="vpn-gateway"
   documentationCenter="na"
   authors="yushwang"
   manager="rossort"
   editor=""
   tags="azure-service-management"/>

<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/11/2016"
   ms.author="yushwang" />

# Connect multiple on-premises sites to a virtual network

This article applies to connecting multiple on-premises sites to a VNet created using the classic deployment model (also known as Service Management). When we have an article with steps for VNets created using the Resource Manager model, I'll link to it from this page. 

**About Azure deployment models**

[AZURE.INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 

**Deployment models and tools for multi-site connections**

[AZURE.INCLUDE [vpn-gateway-table-multi-site](../../includes/vpn-gateway-table-multisite-include.md)] 


## About connecting

You can connect multiple on-premises sites to a single virtual network. This is especially attractive for building hybrid cloud solutions. Creating a multi-site connection to your Azure virtual network gateway is very similar to creating other Site-to-Site connections. In fact, you can use an existing Azure VPN gateway, as long as the gateway is dynamic (route-based).

If you already have a static gateway connected to your virtual network, you can change the gateway type to dynamic without needing to rebuild the virtual network in order to accommodate multi-site. Before changing the routing type, make sure that your on-premises VPN gateway supports route-based VPN configurations. 

![multi-site diagram](./media/vpn-gateway-multi-site/multisite.png "multi-site")

## Points to consider

**You won't be able to use the Azure Classic Portal to make changes to this virtual network.** For this release, you'll need to make changes to the network configuration file instead of using the Azure Classic Portal. If you make changes in the Azure Classic Portal, they'll overwrite your multi-site reference settings for this virtual network. 

You should feel pretty comfortable using the network configuration file by the time you've completed the multi-site procedure. However, if you have multiple people working on your network configuration, you'll need to make sure that everyone knows about this limitation. This doesn't mean that you can't use the Azure Classic Portal at all. You can use it for everything else, except making configuration changes to this particular virtual network.

## Before you begin

Before you begin configuration, verify that you have the following:

- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).

- Compatible VPN hardware for each on-premises location. Check [About VPN Devices for Virtual Network Connectivity](vpn-gateway-about-vpn-devices.md) to verify if the device that you want to use is something that is known to be compatible.

- An externally facing public IPv4 IP address for each VPN device. The IP address cannot be located behind a NAT. This is requirement.

- You'll need to install the latest version of the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.

- Someone who is proficient at configuring your VPN hardware. You won't be able to use the auto-generated VPN scripts from the Azure Classic Portal to configure your VPN devices. This means you'll have to have a strong understanding of how to configure your VPN device, or work with someone who does.

- The IP address ranges that you want to use for your virtual network (if you haven't already created one). 

- The IP address ranges for each of the local network sites that you'll be connecting to. You'll need to make sure that the IP address ranges for each of the local network sites that you want to connect to do not overlap. Otherwise, the Azure Classic Portal or the REST API will reject the configuration being uploaded. 

	For example, if you have two local network sites that both contain the IP address range 10.2.3.0/24 and you have a package with a destination address 10.2.3.3, Azure wouldn't know which site you want to send the package to because the address ranges are overlapping. To prevent routing issues, Azure doesn't allow you to upload a configuration file that has overlapping ranges.



## 1. Create a Site-to-Site VPN

If you already have a Site-to-Site VPN with a dynamic routing gateway, great! You can proceed to [Export the virtual network configuration settings](#export). If not, do the following:

### If you already have a Site-to-Site virtual network, but it has a static (policy-based) routing gateway:

1. Change your gateway type to dynamic routing. A multi-site VPN requires a dynamic (also known as route-based) routing gateway. To change your gateway type, you'll need to first delete the existing gateway, then create a new one. For instructions, see [How to change the VPN routing type for your gateway](../vpn-gateway/vpn-gateway-configure-vpn-gateway-mp.md#how-to-change-the-vpn-routing-type-for-your-gateway).  

2. Configure your new gateway and create your VPN tunnel. For instructions, see [Configure a VPN Gateway in the Azure Classic Portal](vpn-gateway-configure-vpn-gateway-mp.md). First, change your gateway type to dynamic routing. 

### If you don't have a Site-to-Site virtual network:

1. Create your Site-to-Site virtual network using these instructions: [Create a Virtual Network with a Site-to-Site VPN Connection in the Azure Classic Portal](vpn-gateway-site-to-site-create.md).  

2. Configure a dynamic routing gateway using these instructions: [Configure a VPN Gateway](vpn-gateway-configure-vpn-gateway-mp.md). Be sure to select **dynamic routing** for your gateway type.

## <a name="export"></a>2. Export the network configuration file 

Export your network configuration file. The file that you export will be used to configure your new multi-site settings. If you need instructions on how to export a file, see the section in the article: [How to create a VNet using a network configuration file in the Azure Portal](../virtual-network/virtual-networks-create-vnet-classic-portal.md#how-to-create-a-vnet-using-a-network-config-file-in-the-azure-portal). 

## 3. Open the network configuration file

Open the network configuration file that you downloaded in the last step. Use any xml editor that you like. The file should look similar to the following:

		<NetworkConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
		  <VirtualNetworkConfiguration>
		    <LocalNetworkSites>
		      <LocalNetworkSite name="Site1">
		        <AddressSpace>
		          <AddressPrefix>10.0.0.0/16</AddressPrefix>
		          <AddressPrefix>10.1.0.0/16</AddressPrefix>
		        </AddressSpace>
		        <VPNGatewayAddress>131.2.3.4</VPNGatewayAddress>
		      </LocalNetworkSite>
		      <LocalNetworkSite name="Site2">
		        <AddressSpace>
		          <AddressPrefix>10.2.0.0/16</AddressPrefix>
		          <AddressPrefix>10.3.0.0/16</AddressPrefix>
		        </AddressSpace>
		        <VPNGatewayAddress>131.4.5.6</VPNGatewayAddress>
		      </LocalNetworkSite>
		    </LocalNetworkSites>
		    <VirtualNetworkSites>
		      <VirtualNetworkSite name="VNet1" AffinityGroup="USWest">
		        <AddressSpace>
		          <AddressPrefix>10.20.0.0/16</AddressPrefix>
		          <AddressPrefix>10.21.0.0/16</AddressPrefix>
		        </AddressSpace>
		        <Subnets>
		          <Subnet name="FE">
		            <AddressPrefix>10.20.0.0/24</AddressPrefix>
		          </Subnet>
		          <Subnet name="BE">
		            <AddressPrefix>10.20.1.0/24</AddressPrefix>
		          </Subnet>
		          <Subnet name="GatewaySubnet">
		            <AddressPrefix>10.20.2.0/29</AddressPrefix>
		          </Subnet>
		        </Subnets>
		        <Gateway>
		          <ConnectionsToLocalNetwork>
		            <LocalNetworkSiteRef name="Site1">
		              <Connection type="IPsec" />
		            </LocalNetworkSiteRef>
		          </ConnectionsToLocalNetwork>
		        </Gateway>
		      </VirtualNetworkSite>
		    </VirtualNetworkSites>
		  </VirtualNetworkConfiguration>
		</NetworkConfiguration>

## 4. Add multiple site references

When you add or remove site reference information, you'll make configuration changes to the ConnectionsToLocalNetwork/LocalNetworkSiteRef. Adding a new local site reference triggers Azure to create a new tunnel. In the example below, the network configuration is for a single-site connection. Save the file once you have finished making your changes.

		<Gateway>
          <ConnectionsToLocalNetwork>
            <LocalNetworkSiteRef name="Site1"><Connection type="IPsec" /></LocalNetworkSiteRef>
          </ConnectionsToLocalNetwork>
        </Gateway>

	To add additional site references (create a multi-site configuration), simply add additional "LocalNetworkSiteRef" lines, as shown in the example below: 

        <Gateway>
          <ConnectionsToLocalNetwork>
            <LocalNetworkSiteRef name="Site1"><Connection type="IPsec" /></LocalNetworkSiteRef>
            <LocalNetworkSiteRef name="Site2"><Connection type="IPsec" /></LocalNetworkSiteRef>
          </ConnectionsToLocalNetwork>
        </Gateway>

## 5. Import the network configuration file

Import the network configuration file. When you import this file with the changes, the new tunnels will be added. The tunnels will use the dynamic gateway that you created earlier. If you need instructions on how to import the file, see the section in the article: [How to create a VNet using a network configuration file in the Azure Portal](../virtual-network/virtual-networks-create-vnet-classic-portal.md#how-to-create-a-vnet-using-a-network-config-file-in-the-azure-portal). 

## 6. Download keys

Once your new tunnels have been added, use the PowerShell cmdlet `Get-AzureVNetGatewayKey` to get the IPsec/IKE pre-shared keys for each tunnel.

For example:

	Get-AzureVNetGatewayKey –VNetName "VNet1" –LocalNetworkSiteName "Site1"

	Get-AzureVNetGatewayKey –VNetName "VNet1" –LocalNetworkSiteName "Site2"

If you prefer, you can also use the *Get Virual Network Gateway Shared Key* REST API to get the pre-shared keys.

## 7. Verify your connections

Check the multi-site tunnel status. After downloading the keys for each tunnel, you'll want to verify connections. Use `Get-AzureVnetConnection` to get a list of virtual network tunnels, as shown in the example below. VNet1 is the name of the VNet.

	Get-AzureVnetConnection -VNetName VNET1
		
	ConnectivityState         : Connected
	EgressBytesTransferred    : 661530
	IngressBytesTransferred   : 519207
	LastConnectionEstablished : 5/2/2014 2:51:40 PM
	LastEventID               : 23401
	LastEventMessage          : The connectivity state for the local network site 'Site1' changed from Not Connected to Connected.
	LastEventTimeStamp        : 5/2/2014 2:51:40 PM
	LocalNetworkSiteName      : Site1
	OperationDescription      : Get-AzureVNetConnection
	OperationId               : 7f68a8e6-51e9-9db4-88c2-16b8067fed7f
	OperationStatus           : Succeeded
		
	ConnectivityState         : Connected
	EgressBytesTransferred    : 789398
	IngressBytesTransferred   : 143908
	LastConnectionEstablished : 5/2/2014 3:20:40 PM
	LastEventID               : 23401
	LastEventMessage          : The connectivity state for the local network site 'Site2' changed from Not Connected to Connected.
	LastEventTimeStamp        : 5/2/2014 2:51:40 PM
	LocalNetworkSiteName      : Site2
	OperationDescription      : Get-AzureVNetConnection
	OperationId               : 7893b329-51e9-9db4-88c2-16b8067fed7f
	OperationStatus           : Succeeded

## Next steps

To learn more about VPN Gateways, see [About VPN Gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md).

