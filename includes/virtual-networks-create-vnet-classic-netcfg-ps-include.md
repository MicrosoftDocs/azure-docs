## How to create a VNet using a network config file from PowerShell

Azure uses an xml file to define all VNets available to a subscription. You can download this file, and edit it to modify or delete existing VNets, and create new ones. In this document, you will learn how to download this file, referred to as network configuration (or netcgf) file, and edit it to create a new VNet. Check the [Azure virtual network configuration schema](https://msdn.microsoft.com/library/azure/jj157100.aspx) to learn more about the network configuration file.

To create a VNet using a netcfg file using PowerShell, follow the steps below.

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](../articles/powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. To create the virtual network described in this scenario, create a NetworkConfig.xml file in any text editor that contains the following:

		<?xml version="1.0" encoding="utf-8"?>
		<NetworkConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
		  <VirtualNetworkConfiguration>
		    <Dns />
		    <VirtualNetworkSites>
			<VirtualNetworkSite name="TestVNet" Location="Central US">
			  <AddressSpace>
				<AddressPrefix>192.168.0.0/16</AddressPrefix>
			  </AddressSpace>
			  <Subnets>
				<Subnet name="FrontEnd">
				  <AddressPrefix>192.168.1.0/24</AddressPrefix>
				</Subnet>
				<Subnet name="BackEnd">
				  <AddressPrefix>192.168.2.0/24</AddressPrefix>
				</Subnet>
			  </Subnets>
			</VirtualNetworkSite>
		    </VirtualNetworkSites>
		  </VirtualNetworkConfiguration>
		</NetworkConfiguration>

3.  Save the network configuration file. In this example, it was saved at the following path c:\NetworkConfig.xml
4. From the Azure PowerShell console, use the **Set-AzureVnetConfig** cmdlet to upload the network configuration file by running the command below. Notice the output under the command, you should see **Succeeded** under **OperationStatus**. If that is not the case, check the xml file for errors.

		Set-AzureVNetConfig -ConfigurationPath c:\NetworkConfig.xml

	Here is the expected output for the command above:

		OperationDescription OperationId                          OperationStatus
		-------------------- -----------                          ---------------
		Set-AzureVNetConfig  49579cb9-3f49-07c3-ada2-7abd0e28c4e4 Succeeded

11. From the Azure PowerShell console, use the **Get-AzureVnetSite** cmdlet to verify that the new network was added by running the command below.

		Get-AzureVNetSite -VNetName TestVNet

	Here is the expected output for the command above:

		AddressSpacePrefixes : {192.168.0.0/16}
		Location             : Central US
		AffinityGroup        :
		DnsServers           : {}
		GatewayProfile       :
		GatewaySites         :
		Id                   : b953f47b-fad9-4075-8cfe-73ff9c98278f
		InUse                : False
		Label                :
		Name                 : TestVNet
		State                : Created
		Subnets              : {FrontEnd, BackEnd}
		OperationDescription : Get-AzureVNetSite
		OperationId          : 3f35d533-1f38-09c0-b286-3d07cd0904d8
		OperationStatus      : Succeeded
