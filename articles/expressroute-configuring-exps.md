<properties 
   pageTitle="Configuring ExpressRoute through an Exchange Provider"
   description="This tutorial walks you through setting up ExpressRoute through exchange providers (EXPs)."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/29/2015"
   ms.author="cherylmc"/>

#  Configure an ExpressRoute Connection through an Exchange Provider

To configure your ExpressRoute connection through an exchange provider, you’ll need to complete multiple steps in the proper order. These instructions will help you do the following:

- Create and Manage ExpressRoute circuits
- Configure BGP peering for ExpressRoute circuits
- Link a Virtual Network to the ExpressRoute circuit

##  Configuration Prerequisites


Before you begin configuration, verify that you have met the following prerequisites:

- Azure subscription 
- Latest version of Azure PowerShell 
- The following Virtual Network requirements: 
	- A set of IP address prefixes to be used in virtual networks in Azure
	- A set of IP prefixes on-premises (can contain public IP addresses)
	- The Virtual Network Gateway must be created with a /28 subnet.
	- Additional set of IP prefixes (/28) that is outside of the virtual network. This will be used for configuring BGP peering.
	- AS number for your network. For more information about AS numbers, see [Autonomous System (AS) Numbers](http://www.iana.org/assignments/as-numbers/as-numbers.xhtml).
	- MD5 hash if you need an authenticated BGP session
	- VLAN IDs on which traffic will be sent. You will need 2 VLAN IDs for each circuit: one for virtual networks and the other for services hosted on public IP addresses.
	- [Autonomous System (AS) Numbers](http://www.iana.org/assignments/as-numbers/as-numbers.xhtml) for your network.
	- Two 1 Gbps / 10 Gbps cross-connects to the Exchange provider’s Ethernet Exchange.
	- A pair of routers capable of supporting BGP for routing

##  Deployment Workflow


![](./media/expressroute-configuring-exps/expressroute-exp-connectivity-workflow.png)

##  Configuring Settings using PowerShell

Windows PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For more information please refer to the PowerShell documentation in [MSDN](https://msdn.microsoft.com/library/windowsazure/jj156055.aspx).

1. **Import the PowerShell module for ExpressRoute.**

	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1' 
	
2. **Get the list of providers, locations, and bandwidths supported.**

	Before creating a circuit you will need a list of service providers, supported locations, and bandwidth options for each location. The following PowerShell cmdlet returns this information which you’ll use in later steps.

    	PS C:\> Get-AzureDedicatedCircuitServiceProvider
		**The information returned will look similar to the example below:**
		
		
		Name                 DedicatedCircuitLocations      DedicatedCircuitBandwidths                                                                                                                                                                                   
		----                 -------------------------      --------------------------                                                                                                                                                                                   
		AT&T                 Silicon Valley,Washington DC   10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		British Telecom      London,Amsterdam               10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Equinix              Amsterdam,Atlanta,Chicago,Dall 200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		                     as,New York,Seattle,Silicon                                                                                                                                                                                                                 
		                     Valley,Washington                                                                                                                                                                                                                           
		                     DC,London,Hong                                                                                                                                                                                                                              
		                     Kong,Singapore,Sydney,Tokyo                                                                                                                                                                                                                 
		IIJ                  Tokyo                          10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Level 3              London,Silicon                 200Mbps:200, 500Mbps:500, 1Gbps:1000                                                                                                                                                                         
		Communications -     Valley,Washington DC                                                                                                                                                                                                                        
		Exchange                                                                                                                                                                                                                                                         
		Level 3              London,Silicon                 10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Communications -     Valley,Washington DC                                                                                                                                                                                                                        
		IPVPN                                                                                                                                                                                                                                                            
		Orange               Amsterdam,London               10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		SingTel Domestic     Singapore                      10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		SingTel              Singapore                      10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		International                                                                                                                                                                                                                                                    
		TeleCity Group       Amsterdam,London               200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		Telstra Corporation  Sydney                         10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Verizon              Silicon Valley,Washington DC   10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000
 
3. **Create a Dedicated Circuit**
 
	The example below shows how to create a 200 Mbps ExpressRoute circuit through Equinix Silicon Valley. If you are using a different provider and different settings, substitute that information when making your request. 

	Below is an example request for a new service key:
      
		#Creating a new circuit
		$Bandwidth = 200
		$CircuitName = "EquinixSVTest"
		$ServiceProvider = "Equinix"
		$Location = "Silicon Valley"
		 
		New-AzureDedicatedCircuit -CircuitName $CircuitName -ServiceProviderName $ServiceProvider -Bandwidth $Bandwidth -Location $Location
		 
		#Getting service key
		Get-AzureDedicatedCircuit
 
	The response will be something similar to the example below:
            
		Bandwidth                        : 200
		CircuitName                      : EquinixSVTest
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : NotProvisioned
		Status                           : Enabled

	You can retrieve this information at any time using the Get-AzureCircuit cmdlet. Making the call without any parameters will list all circuits. Your Service Key will be listed in the ServiceKey field.

		PS C:\> Get-AzureDedicatedCircuit
				 
		Bandwidth                        : 200
		CircuitName                      : EquinixSVTest
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : NotProvisioned
		Status                           : Enabled


4. **Send the Service Key to your exchange provider.** 

	Your exchange provider will use the Service Key to enable their end of the connection. You will have to provide the connectivity provider with additional information to enable connectivity.

5. **Periodically check the status and the state of the circuit key.** 

	This will allow you to know when your provider has enabled your circuit. Once the circuit has been enabled, the *ServiceProviderProvisioningState* will display as *Provisioned* as shown in the example below.

		PS C:\> Get-AzureDedicatedCircuit
				 
		Bandwidth                        : 200
		CircuitName                      : EquinixSVTest
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Status                           : Enabled
 
6. **Configure routing for virtual network.** 

	We use BGP sessions to exchange routes and also make sure that we have high availability. Use the example below to create a BGP session for your circuit. Substitute your own values when creating your session.

		#Setting up a bgp session
		$ServiceKey = "<your key>"
		$PriSN = "<subnet/30 you use IP #1 and Azure uses IP #2>"
		$SecSN = "<subnet/30 use IP #1 and Azure uses IP #2>"
		$ASN = <your ASN>
		$VLAN = <your vlan ID>
		 
		#Create a new bgp peering session
		New-AzureBGPPeering -ServiceKey $ServiceKey -PrimaryPeerSubnet $PriSN -SecondaryPeerSubnet $SecSN -PeerAsn $ASN VlanId $VLAN –AccessType Private
		#Get BGP parameters and Azure ASN
		Get-AzureBGPPeering -ServiceKey $ServiceKey –AccessType Private
		#Update BGP peering config
		Set-AzureBGPPeering  -ServiceKey $ServiceKey -PrimaryPeerSubnet $PriSN -SecondaryPeerSubnet $SecSN -PeerAsn $ASN -VlanId $VLAN –AccessType Private
		#Removing BGP peering config
		Remove-AzureBGPPeering -ServiceKey $ServiceKey –AccessType Private

	You can get routing information for a circuit using Get-AzureBGPPeering by providing the service key. You can also update the BGP settings using Set-AzureBGPPeering. The BGP session will not come up when this command is run. The circuit must be linked with at least one VNet to get the BGP session up.

	The response below will provide you with the information that you will need for the next steps. Use the peer ASN to configure BGP on your router’s VRFs.
                    
		PS C:\> New-AzureBGPPeering -ServiceKey $ServiceKey -PrimaryPeerSubnet $PriSN -SecondaryPeerSubnet $SecSN -PeerAsn $ASN -VlanId $VLAN –AccessType Private
				
		AzureAsn            : 12076
		PeerAsn             : 65001
		PrimaryAzurePort    : EQIX-SJC-06GMR-CIS-1-PRI-A
		PrimaryPeerSubnet   : 10.0.1.0/30
		SecondaryAzurePort  : EQIX-SJC-06GMR-CIS-2-SEC-A
		SecondaryPeerSubnet : 10.0.2.0/30
		State               : Enabled
		VlanId              : 100

7. **Configure routing for services hosted on public IP addresses.** 
	
	We use BGP sessions to exchange routes and also make sure that we have high availability. Use the example below to create a BGP session for your circuit. Substitute your own values when creating your session.

		#Setting up a bgp session
		$ServiceKey = "<your key>"
		$PriSN = "<subnet/30 subnet you use IP #1 and Azure uses IP #2>"
		$SecSN = "< subnet/30 subnet you use IP #1 and Azure uses IP #2>"
		$ASN = <your ASN> 
		$VLAN = <your vlan ID>
		 
		#Create a new bgp peering session
		New-AzureBGPPeering -ServiceKey $ServiceKey -PrimaryPeerSubnet $PriSN -SecondaryPeerSubnet $SecSN -PeerAsn $ASN -VlanId $VLAN –AccessType Public
		#Get BGP parameters and Azure ASN
		Get-AzureBGPPeering -ServiceKey $ServiceKey –AccessType Public
		#Update BGP peering config
		Set-AzureBGPPeering  -ServiceKey $ServiceKey -PrimaryPeerSubnet $PriSN -SecondaryPeerSubnet $SecSN -PeerAsn $ASN -VlanId $VLAN –AccessType Public
		#Removing BGP peering config
		Remove-AzureBGPPeering -ServiceKey $ServiceKey –AccessType Public
 
	You can get routing information for a circuit using Get-AzureBGPPeering by providing the service key. You can also update the BGP settings using Set-AzureBGPPeering. The BGP session will not come up when this command is run. The circuit must be linked with at least one VNet to get the BGP session up.

	The response below will provide you with the information that you will need for the next steps. Use the peer ASN to configure BGP on your router’s VRFs.

		PS C:\> New-AzureBGPPeering -ServiceKey $ServiceKey -PrimaryPeerSubnet $PriSN -SecondaryPeerSubnet $SecSN -PeerAsn $ASN -VlanId $VLAN –AccessType Private
		 
		AzureAsn            : 12076
		PeerAsn             : 65001
		PrimaryAzurePort    : EQIX-SJC-06GMR-CIS-1-PRI-A
		PrimaryPeerSubnet   : 10.0.1.8/30
		SecondaryAzurePort  : EQIX-SJC-06GMR-CIS-2-SEC-A
		SecondaryPeerSubnet : 10.0.2.8/30
		State               : Enabled
		VlanId              : 101
 
8. **Configure your Virtual Network and Gateway.** 

	See [Configure a Virtual Network and Gateway for ExpressRoute](https://msdn.microsoft.com/library/azure/dn643737.aspx). Note that the gateway subnet must be /28 in order to work with an ExpressRoute connection.

9. **Link your network to a circuit.** Proceed with the following instructions only after you have confirmed that your circuit has moved to the following state and status: 
	- ServiceProviderProvisioningState: Provisioned
	- Status: Enabled
	 
			PS C:\> $Vnet = "MyTestVNet"
			New-AzureDedicatedCircuitLink -ServiceKey $ServiceKey -VNetName $Vnet