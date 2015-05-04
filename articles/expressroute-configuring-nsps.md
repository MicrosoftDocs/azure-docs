<properties 
   pageTitle="Configuring Expressroute with NSPs"
   description="This tutorial walks you through setting up ExpressRoute through NSPs"
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn"/>

<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/29/2015"
   ms.author="cherylmc"/>

#  Configure an ExpressRoute Connection through a Network Service Provider

To configure your ExpressRoute connection through a network service provider, you’ll need to complete multiple steps in the proper order. These instructions will help you:

- Create and manage ExpressRoute circuits
- Link a Virtual Network to the ExpressRoute circuit

##  Configuration Prerequisites


Before you begin configuration, verify that you have met the following prerequisites:

- Azure subscription
- Latest version of Windows PowerShell
- The following Virtual Network requirements:
	- A set of IP address prefixes to be used in virtual networks in Azure.
	- A set of IP prefixes on-premises (can contain public IP addresses).
	- The Virtual Network Gateway must be created with a /28 subnet.
	- Additional set of IP prefixes (/28) that is outside of the virtual network. This will be used for configuring routes. – You will have to provide this to the network service provider.
	- AS number for your network. You will have to provide this to the network service provider. You can use private AS numbers. If you choose to do so, it must be > 65000. For more information about AS numbers, see Autonomous System (AS) Numbers.	- 

- From the network service provider:
	- You must have a VPN service that is supported with ExpressRoute. Check with your network service provider if your existing VPN service qualifies.

##  Deployment Workflow

![Network Service Provider Workflow](./media/expressroute-configuring-nsps/expressroute-nsp-connectivity-workflow.png)

##  Configuring Settings using PowerShell
Windows PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. For more information please refer to the PowerShell documentation in [MSDN](https://msdn.microsoft.com/library/windowsazure/jj156055.aspx)



1. **Import the PowerShell module for ExpressRoute.**

		Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
		Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1' 

2. **Get the list of providers, locations, and bandwidths supported.**

	Before creating a circuit you will need a list of service providers, supported locations, and bandwidth options for each location. The following PowerShell cmdlet returns this information which you’ll use in later steps.

		PS C:\> Get-AzureDedicatedCircuitServiceProvider

	The information returned will look similar to the example below:

		PS C:\> Get-AzureDedicatedCircuitServiceProvider
	
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
		

3. **Make a request for a service key and pass it to your exchange provider.** 

	You will use a PowerShell cmdlet to make this request. For this example we’ll use AT&T Netbond as the service provider and will specify a 50 Mbps ExpressRoute circuit in Silicon Valley. If you are using a different provider and different settings, substitute that information when making your request.

	Below is an example request for a new service key:

		##Creating a new circuit
		$Bandwidth = 50
		$CircuitName = "NetBondSVTest"
		$ServiceProvider = "at&t"
		$Location = "Silicon Valley"
		
		New-AzureDedicatedCircuit -CircuitName $CircuitName -ServiceProviderName $ServiceProvider -Bandwidth $Bandwidth -Location $Location
		
		#Getting service key
		Get-AzureDedicatedCircuit

	The response will be something similar to the example below:

		Bandwidth                        : 50
		CircuitName                      : NetBondSVTest
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : at&t
		ServiceProviderProvisioningState : NotProvisioned
		Status                           : Enabled

	You can retrieve this information at any time using the Get-AzureCircuit cmdlet. Making the call without any parameters will list all circuits. Your Service Key will be listed in the ServiceKey field.

		PS C:\> Get-AzureDedicatedCircuit
		
		Bandwidth                        : 500
		CircuitName                      : NetBondSVTest
		Location                         : Silicon Valley
		ServiceKey                       : 00-0000-0000-0000-0000000000
		ServiceProviderName              : at&t
		ServiceProviderProvisioningState : NotProvisioned
		Status                           : Enabled

	Once this step is complete, you’ll have connectivity to Azure storage and other services.



4. **Configure your Virtual Network and Gateway.** 

	See [Configure a Virtual Network and Gateway for ExpressRoute](https://msdn.microsoft.com/library/azure/dn643737.aspx). Note that the gateway subnet must be /28 in order to work with an ExpressRoute connection.

5. **Link your network to a circuit.** 

	Proceed with the following steps only after you have confirmed that your
 
	- ServiceProviderState: Provisioned
	- Status: Enabled

	Verify that you have at least one Azure virtual network with a gateway created. The gateway must be running.

		PS C:\> $Vnet = "MyTestVNet"
		New-AzureDedicatedCircuitLink -ServiceKey $ServiceKey -VNetName $Vnet
		
		Provisioned