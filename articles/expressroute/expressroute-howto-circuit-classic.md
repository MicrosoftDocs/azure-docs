<properties
   pageTitle="Steps for configuring an ExpressRoute circuit using PowerShell| Microsoft Azure"
   description="This article walks you through the steps for creating and provisioning an ExpressRoute circuit. This article also shows you how to check the status, update, or delete and deprovision your circuit."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-service-management"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/04/2016"
   ms.author="cherylmc"/>

# Create and modify an ExpressRoute circuit using PowerShell

> [AZURE.SELECTOR]
[PowerShell - Classic](expressroute-howto-circuit-classic.md)
[PowerShell - Resource Manager](expressroute-howto-circuit-arm.md)

This article walks you through the steps to create an ExpressRoute circuit using PowerShell cmdlets and the **classic** deployment model. The steps below will also show you how to check the status, update, or delete and deprovision an ExpressRoute circuit. If you want to create and modify an ExpressRoute circuit using the **Resource Manager** deployment model, see [Create and modify an ExpressRoute circuit using the Resource Manager deployment model](expressroute-howto-circuit-arm.md).

[AZURE.INCLUDE [vpn-gateway-sm-rm](../../includes/vpn-gateway-sm-rm-include.md)] 


## Configuration prerequisites

- You will need the latest version of the Azure PowerShell modules. You can download the latest PowerShell module from the PowerShell section of the [Azure Downloads page](https://azure.microsoft.com/downloads/). Follow the instructions on the [How to install and configure Azure PowerShell](../powershell-install-configure.md) page for step-by-step guidance on how to configure your computer to use the Azure PowerShell modules. 
- Make sure that you have reviewed the [Prerequisites](expressroute-prerequisites.md) page and the [Workflows](expressroute-workflows.md) page before you begin configuration.

## To create and provision an ExpressRoute circuit

1. **Import the PowerShell module for ExpressRoute.**

 	You must import the Azure and ExpressRoute modules into the PowerShell session in order to start using the ExpressRoute cmdlets. Run the following commands to import the Azure and ExpressRoute modules into the PowerShell session.  

	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\Azure.psd1'
	    Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ServiceManagement\Azure\ExpressRoute\ExpressRoute.psd1'

2. **Get the list of providers, locations, and bandwidths supported.**

	Before creating an ExpressRoute circuit, you will need the list of connectivity providers, supported locations, and bandwidth options. The PowerShell cmdlet *Get-AzureDedicatedCircuitServiceProvider* returns this information, which you’ll use in later steps. When you run the cmdlet, your result will look similar to the example below.

		PS C:\> Get-AzureDedicatedCircuitServiceProvider

		Name                 DedicatedCircuitLocations      DedicatedCircuitBandwidths                                                                                                                                                                                   
		----                 -------------------------      --------------------------                                                                                                                                                                                   
		Aryaka Networks      Silicon Valley,Washington      200Mbps:200, 500Mbps:500, 1Gbps:1000                                                                                                                                                                         
		                     DC,Singapore                                                                                                                                                                                                                                
		AT&T                 Silicon Valley,Washington DC   10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		AT&T Netbond         Washington DC,Silicon          10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		                     Valley,Dallas                                                                                                                                                                                                                               
		British Telecom      London,Amsterdam,Washington    10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		                     DC,Tokyo,Silicon Valley                                                                                                                                                                                                                     
		Colt Ethernet        Amsterdam,London               200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		Colt IPVPN           Amsterdam,London               10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Comcast              Washington DC,Silicon Valley   200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		Equinix              Amsterdam,Atlanta,Chicago,Dall 200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		                     as,New York,Seattle,Silicon                                                                                                                                                                                                                 
		                     Valley,Washington                                                                                                                                                                                                                           
		                     DC,London,Hong Kong,Singapore,                                                                                                                                                                                                              
		                     Sydney,Tokyo,Sao Paulo,Los                                                                                                                                                                                                                  
		                     Angeles,Melbourne                                                                                                                                                                                                                           
		IIJ                  Tokyo                          10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		InterCloud           Washington                     200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		                     DC,London,Singapore,Amsterdam                                                                                                                                                                                                               
		Internet Solutions   London,Amsterdam               10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		– Cloud Connect                                                                                                                                                                                                                                                  
		Interxion            Amsterdam                      200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		Level 3              London,Chicago,Dallas,Seattle, 200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		Communications -     Silicon Valley,Washington DC                                                                                                                                                                                                                
		Exchange                                                                                                                                                                                                                                                         
		Level 3              London,Chicago,Dallas,Seattle, 10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Communications -     Silicon Valley,Washington DC                                                                                                                                                                                                                
		IPVPN                                                                                                                                                                                                                                                            
		Megaport             Melbourne,Sydney               200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		NEXTDC               Melbourne                      200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		NTT Communications   Tokyo                          10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Orange               Amsterdam,London,Silicon       10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		                     Valley,Washington DC,Hong Kong                                                                                                                                                                                                              
		PCCW Global Limited  Hong Kong                      10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		SingTel Domestic     Singapore                      10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		SingTel              Singapore                      10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		International                                                                                                                                                                                                                                                    
		Tata Communications  Hong Kong,Singapore,London,Ams 10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		                     terdam,Chennai,Mumbai                                                                                                                                                                                                                       
		TeleCity Group       Amsterdam,London               200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
		Telstra Corporation  Sydney,Melbourne               10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Verizon              London,Hong Kong,Silicon       10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		                     Valley,Washington DC                                                                                                                                                                                                                        
		Vodafone             London                         10Mbps:10, 50Mbps:50, 100Mbps:100, 500Mbps:500, 1Gbps:1000                                                                                                                                                   
		Zayo Group           Washington DC                  200Mbps:200, 500Mbps:500, 1Gbps:1000, 10Gbps:10000                                                                                                                                                           
    	

3. **Create an ExpressRoute circuit.**

	The example below shows how to create a 200 Mbps ExpressRoute circuit through Equinix in Silicon Valley. If you are using a different provider and different settings, substitute that information when making your request.

	Below is an example request for a new service key:

		#Creating a new circuit
		$Bandwidth = 200
		$CircuitName = "MyTestCircuit"
		$ServiceProvider = "Equinix"
		$Location = "Silicon Valley"

		New-AzureDedicatedCircuit -CircuitName $CircuitName -ServiceProviderName $ServiceProvider -Bandwidth $Bandwidth -Location $Location -sku Standard -BillingType MeteredData 

	Or, if you want to create an ExpressRoute circuit with the premium add-on, use the following example below. Refer to the [ExpressRoute FAQ](expressroute-faqs.md) page for more details on the premium add-on.

		New-AzureDedicatedCircuit -CircuitName $CircuitName -ServiceProviderName $ServiceProvider -Bandwidth $Bandwidth -Location $Location -sku Premium - BillingType MeteredData
	
	
	The response will contain the service key. You can get detailed descriptions of all the parameters by running the following:

		get-help new-azurededicatedcircuit -detailed 

4. **List all ExpressRoute circuits.**

	You can run the *Get-AzureDedicatedCircuit* command to get a list of all ExpressRoute circuits you created.

		#Getting service key
		Get-AzureDedicatedCircuit

	The response will be something similar to the example below:

		Bandwidth                        : 200
		CircuitName                      : MyTestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : NotProvisioned
		Sku                              : Standard
		Status                           : Enabled

	You can retrieve this information at any time using the *Get-AzureDedicatedCircuit* cmdlet. Making the call without any parameters will list all circuits. Your Service Key will be listed in the *ServiceKey* field.

		PS C:\> Get-AzureDedicatedCircuit

		Bandwidth                        : 200
		CircuitName                      : MyTestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : NotProvisioned
		Sku                              : Standard
		Status                           : Enabled

	You can get detailed descriptions of all the parameters by running the following:

		get-help get-azurededicatedcircuit -detailed 

5. **Send the Service Key to your connectivity provider for provisioning.**

	When you create a new ExpressRoute circuit, the circuit will be the following state:
	
		ServiceProviderProvisioningState : NotProvisioned
		
		Status                           : Enabled

	The *ServiceProviderProvisioningState* provides information on the current state of provisioning on the service provider side and the Status provides the state on the Microsoft side. An ExpressRoute circuit must be in the following state for you to be able to use it.

		ServiceProviderProvisioningState : Provisioned
		
		Status                           : Enabled

	The circuit will go to the following state when the connectivity provider is in the process of enabling it for you. 

		ServiceProviderProvisioningState : Provisioned
		
		Status                           : Enabled



5. **Periodically check the status and the state of the circuit key.**

	This lets you know when your provider has enabled your circuit. Once the circuit has been configured, the *ServiceProviderProvisioningState* will display as *Provisioned* as shown in the example below.

		PS C:\> Get-AzureDedicatedCircuit

		Bandwidth                        : 200
		CircuitName                      : MyTestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled

6. **Create your routing configuration.**
	
	Refer to the [ExpressRoute circuit routing configuration (create and modify circuit peerings)](expressroute-howto-routing-classic.md) page for step-by-step instructions. 

7. **Link a VNet to an ExpressRoute circuit.** 

	Next, link a VNet to your ExpressRoute circuit. Refer to [Linking ExpressRoute circuits to VNets](expressroute-howto-linkvnet-classic.md) for step by step instructions. If you need to create a virtual network using the classic deployment model for ExpressRoute, see [Create a VNet for ExpressRoute](expressroute-howto-vnet-portal-classic.md) for instructions. 

##  To get the status of an ExpressRoute circuit

You can retrieve this information at any time using the *Get-AzureCircuit* cmdlet. Making the call without any parameters will list all circuits. 

		PS C:\> Get-AzureDedicatedCircuit

		Bandwidth                        : 200
		CircuitName                      : MyTestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled

		Bandwidth                        : 1000
		CircuitName                      : MyAsiaCircuit
		Location                         : Singapore
		ServiceKey                       : #################################
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled

You can get information on a specific ExpressRoute circuit by passing the service key as a parameter to the call.

		PS C:\> Get-AzureDedicatedCircuit -ServiceKey "*********************************"

		Bandwidth                        : 200
		CircuitName                      : MyTestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled


You can get detailed descriptions of all the parameters by running the following:

		get-help get-azurededicatedcircuit -detailed 

##  To modify an ExpressRoute circuit

You can modify certain properties of an ExpressRoute circuit without impacting connectivity. 

You can do the following: 

- Enable / disable ExpressRoute premium add-on for your ExpressRoute circuit without any downtime.
- Increase the bandwidth of your ExpressRoute circuit without any downtime.

Refer to the [ExpressRoute FAQ](expressroute-faqs.md) page for more information on limits and limitations. 

### How to enable the ExpressRoute premium add-on

You can enable the ExpressRoute premium add-on for your existing circuit using the following PowerShell cmdlet:
	
		PS C:\> Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Premium
		
		Bandwidth                        : 1000
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Premium
		Status                           : Enabled

Your circuit will now have the ExpressRoute premium add-on features enabled. Note that we will start billing you for the premium add-on capability as soon as the command has successfully run.

### How to disable the ExpressRoute premium add-on

You can disable the ExpressRoute premium add-on for your existing circuit using the following PowerShell cmdlet:
	
		PS C:\> Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Standard
		
		Bandwidth                        : 1000
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled

The premium add-on is now disabled for your circuit. 

>[AZURE.IMPORTANT] This operation can fail if you are using resources greater than what is permitted for the standard circuit.
>
>- You must ensure that the number of virtual networks linked to the circuit is less than 10 before you downgrade from premium to standard. If you don't do so, your update request will fail and you will be billed the premium rates.
- You must unlink all virtual networks in other geopolitical regions. If you don't do so, your update request will fail and you will be billed the premium rates.
- Your route table must be less than 4000 routes for private peering. If your route table size is greater than 4000 routes, the BGP session will drop and won't be re-enabled till the number of advertised prefixes goes below 4000.


### How to update the ExpressRoute circuit bandwidth

Check the [ExpressRoute FAQ](expressroute-faqs.md) page for supported bandwidth options for your provider. You can pick any size greater than the size of your existing circuit. Once you decided what size you need, you can use the following command to re-size your circuit.

		PS C:\> Set-AzureDedicatedCircuitProperties -ServiceKey ********************************* -Bandwidth 1000
		
		Bandwidth                        : 1000
		CircuitName                      : TestCircuit
		Location                         : Silicon Valley
		ServiceKey                       : *********************************
		ServiceProviderName              : equinix
		ServiceProviderProvisioningState : Provisioned
		Sku                              : Standard
		Status                           : Enabled

Your circuit will have been sized up on the Microsoft side. You must contact your connectivity provider to update configurations on their side to match this change. Note that we will start billing you for the updated bandwidth option from this point on.

>[AZURE.IMPORTANT] You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth will require you to deprovision the ExpressRoute circuit, and then re-provision a new ExpressRoute circuit.

##  To delete and deprovision an ExpressRoute circuit

You can delete your ExpressRoute circuit by running the following command:

		PS C:\> Remove-AzureDedicatedCircuit -ServiceKey "*********************************"	

Note that you must unlink all virtual networks from the ExpressRoute for this operation to succeed. Check if you have any virtual networks linked to the circuit if this operation fails.

If the ExpressRoute circuit service provider provisioning state is enabled, the status will move to *disabling* from enabled state. You must work with your service provider to deprovision the circuit on their side. We will continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and sends us a notification.

If the service provider has deprovisioned the circuit (the service provider provisioning state is set to *not provisioned*) before you run the above cmdlet, we will deprovision the circuit and stop billing you. 

## Next steps

- [Configure routing](expressroute-howto-routing-classic.md)

