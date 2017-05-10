---
title: 'Create and modify an ExpressRoute circuit: PowerShell: Azure Resource Manager | Microsoft Docs'
description: This article describes how to create, provision, verify, update, delete, and deprovision an ExpressRoute circuit.
documentationcenter: na
services: expressroute
author: ganesr
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f997182e-9b25-4a7a-b079-b004221dadcc
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/12/2017
ms.author: ganesr;cherylmc

---
# Create and modify an ExpressRoute circuit using PowerShell
> [!div class="op_single_selector"]
> * [Resource Manager - Azure Portal](expressroute-howto-circuit-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-circuit-arm.md)
> * [Video - Azure Portal](http://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-an-expressroute-circuit)
> 
>

This article describes how to create an Azure ExpressRoute circuit by using PowerShell cmdlets and the Azure Resource Manager deployment model. This article also shows you how to check the status of the circuit, update it, or delete and deprovision it.

## Before you begin
* Install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [Overview of Azure PowerShell](/powershell/azure/overview).
* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.


## Create and provision an ExpressRoute circuit
### 1. Sign in to your Azure account and select your subscription
To begin your configuration, sign in to your Azure account. Use the following examples to help you connect:

```powershell
Login-AzureRmAccount
```

Check the subscriptions for the account:

```powershell
Get-AzureRmSubscription
```

Select the subscription that you want to create an ExpressRoute circuit for:

```powershell
Select-AzureRmSubscription -SubscriptionId "<subscription ID>"
```

### 2. Get the list of supported providers, locations, and bandwidths
Before you create an ExpressRoute circuit, you need the list of supported connectivity providers, locations, and bandwidth options.

The PowerShell cmdlet **Get-AzureRmExpressRouteServiceProvider** returns this information, which you’ll use in later steps:

```powershell
Get-AzureRmExpressRouteServiceProvider
```

Check to see if your connectivity provider is listed there. Make a note of the following information. You'll need it later when you create a circuit.

* Name
* PeeringLocations
* BandwidthsOffered

You're now ready to create an ExpressRoute circuit.   

### 3. Create an ExpressRoute circuit
If you don't already have a resource group, you must create one before you create your ExpressRoute circuit. You can do so by running the following command:

```powershell
New-AzureRmResourceGroup -Name "ExpressRouteResourceGroup" -Location "West US"
```


The following example shows how to create a 200-Mbps ExpressRoute circuit through Equinix in Silicon Valley. If you're using a different provider and different settings, substitute that information when you make your request. The following is an example request for a new service key:

```powershell
New-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup" -Location "West US" -SkuTier Standard -SkuFamily MeteredData -ServiceProviderName "Equinix" -PeeringLocation "Silicon Valley" -BandwidthInMbps 200
```

Make sure that you specify the correct SKU tier and SKU family:

* SKU tier determines whether an ExpressRoute standard or an ExpressRoute premium add-on is enabled. You can specify *Standard* to get the standard SKU or *Premium* for the premium add-on.
* SKU family determines the billing type. You can specify *Metereddata* for a metered data plan and *Unlimiteddata* for an unlimited data plan. You can change the billing type from *Metereddata* to *Unlimiteddata*, but you can't change the type from *Unlimiteddata* to *Metereddata*.

> [!IMPORTANT]
> Your ExpressRoute circuit will be billed from the moment a service key is issued. Ensure that you perform this operation when the connectivity provider is ready to provision the circuit.
> 
> 

The response contains the service key. You can get detailed descriptions of all the parameters by running the following command:

```powershell
get-help New-AzureRmExpressRouteCircuit -detailed
```


### 4. List all ExpressRoute circuits
To get a list of all the ExpressRoute circuits that you created, run the **Get-AzureRmExpressRouteCircuit** command:

```powershell
Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
```

The response will look similar to the following example:

    Name                             : ExpressRouteARMCircuit
    ResourceGroupName                : ExpressRouteResourceGroup
    Location                         : westus
    Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
    Etag                             : W/"################################"
    ProvisioningState                : Succeeded
    Sku                              : {
                                         "Name": "Standard_MeteredData",
                                         "Tier": "Standard",
                                         "Family": "MeteredData"
                                          }
    CircuitProvisioningState          : Enabled
    ServiceProviderProvisioningState  : NotProvisioned
    ServiceProviderNotes              :
    ServiceProviderProperties         : {
                                          "ServiceProviderName": "Equinix",
                                          "PeeringLocation": "Silicon Valley",
                                          "BandwidthInMbps": 200
                                        }
    ServiceKey                        : **************************************
    Peerings                          : []

You can retrieve this information at any time by using the `Get-AzureRmExpressRouteCircuit` cmdlet. Making the call with no parameters lists all the circuits. Your service key will be listed in the *ServiceKey* field:

```powershell
Get-AzureRmExpressRouteCircuit
```


The response will look similar to the following example:

    Name                             : ExpressRouteARMCircuit
    ResourceGroupName                : ExpressRouteResourceGroup
    Location                         : westus
    Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
    Etag                             : W/"################################"
    ProvisioningState                : Succeeded
    Sku                              : {
                                         "Name": "Standard_MeteredData",
                                         "Tier": "Standard",
                                         "Family": "MeteredData"
                                          }
    CircuitProvisioningState         : Enabled
    ServiceProviderProvisioningState : NotProvisioned
    ServiceProviderNotes             :
    ServiceProviderProperties        : {
                                         "ServiceProviderName": "Equinix",
                                         "PeeringLocation": "Silicon Valley",
                                         "BandwidthInMbps": 200
                                          }
    ServiceKey                       : **************************************
    Peerings                         : []


You can get detailed descriptions of all the parameters by running the following command:

```powershell
get-help Get-AzureRmExpressRouteCircuit -detailed
```

### 5. Send the service key to your connectivity provider for provisioning
*ServiceProviderProvisioningState* provides information about the current state of provisioning on the service-provider side. Status provides the state on the Microsoft side. For more information about circuit provisioning states, see the [Workflows](expressroute-workflows.md#expressroute-circuit-provisioning-states) article.

When you create a new ExpressRoute circuit, the circuit will be in the following state:

    ServiceProviderProvisioningState : NotProvisioned
    CircuitProvisioningState         : Enabled



The circuit will change to the following state when the connectivity provider is in the process of enabling it for you:

    ServiceProviderProvisioningState : Provisioning
    Status                           : Enabled

For you to be able to use an ExpressRoute circuit, it must be in the following state:

    ServiceProviderProvisioningState : Provisioned
    CircuitProvisioningState         : Enabled

### 6. Periodically check the status and the state of the circuit key
Checking the status and the state of the circuit key lets you know when your provider has enabled your circuit. After the circuit has been configured, *ServiceProviderProvisioningState* appears as *Provisioned*, as shown in the following example:

```powershell
Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
```


The response will look similar to the following example:

    Name                             : ExpressRouteARMCircuit
    ResourceGroupName                : ExpressRouteResourceGroup
    Location                         : westus
    Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
    Etag                             : W/"################################"
    ProvisioningState                : Succeeded
    Sku                              : {
                                         "Name": "Standard_MeteredData",
                                         "Tier": "Standard",
                                         "Family": "MeteredData"
                                       }
    CircuitProvisioningState         : Enabled
    ServiceProviderProvisioningState : Provisioned
    ServiceProviderNotes             :
    ServiceProviderProperties        : {
                                         "ServiceProviderName": "Equinix",
                                         "PeeringLocation": "Silicon Valley",
                                         "BandwidthInMbps": 200
                                       }
    ServiceKey                       : **************************************
    Peerings                         : []

### 7. Create your routing configuration
For step-by-step instructions, see the [ExpressRoute circuit routing configuration](expressroute-howto-routing-arm.md) article to create and modify circuit peerings.

> [!IMPORTANT]
> These instructions only apply to circuits that are created with service providers that offer layer 2 connectivity services. If you're using a service provider that offers managed layer 3 services (typically an IP VPN, like MPLS), your connectivity provider will configure and manage routing for you.
> 
> 

### 8. Link a virtual network to an ExpressRoute circuit
Next, link a virtual network to your ExpressRoute circuit. Use the [Linking virtual networks to ExpressRoute circuits](expressroute-howto-linkvnet-arm.md) article when you work with the Resource Manager deployment model.

## Getting the status of an ExpressRoute circuit
You can retrieve this information at any time by using the **Get-AzureRmExpressRouteCircuit** cmdlet. Making the call with no parameters lists all the circuits.

```powershell
Get-AzureRmExpressRouteCircuit
```


The response will be similar to the following example:

    Name                             : ExpressRouteARMCircuit
    ResourceGroupName                : ExpressRouteResourceGroup
    Location                         : westus
    Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
    Etag                             : W/"################################"
    ProvisioningState                : Succeeded
    Sku                              : {
                                         "Name": "Standard_MeteredData",
                                         "Tier": "Standard",
                                         "Family": "MeteredData"
                                       }
    CircuitProvisioningState         : Enabled
    ServiceProviderProvisioningState : Provisioned
    ServiceProviderNotes             :
    ServiceProviderProperties        : {
                                            "ServiceProviderName": "Equinix",
                                            "PeeringLocation": "Silicon Valley",
                                            "BandwidthInMbps": 200
                                          }
    ServiceKey                       : **************************************
    Peerings                         : []


You can get information on a specific ExpressRoute circuit by passing the resource group name and circuit name as a parameter to the call:

```powershell
Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
```


The response will look similar to the following example:

    Name                             : ExpressRouteARMCircuit
    ResourceGroupName                : ExpressRouteResourceGroup
    Location                         : westus
    Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
    Etag                             : W/"################################"
    ProvisioningState                : Succeeded
    Sku                              : {
                                         "Name": "Standard_MeteredData",
                                            "Tier": "Standard",
                                            "Family": "MeteredData"
                                          }
    CircuitProvisioningState         : Enabled
    ServiceProviderProvisioningState : Provisioned
    ServiceProviderNotes             :
    ServiceProviderProperties        : {
                                         "ServiceProviderName": "Equinix",
                                         "PeeringLocation": "Silicon Valley",
                                         "BandwidthInMbps": 200
                                          }
    ServiceKey                       : **************************************
    Peerings                         : []


You can get detailed descriptions of all the parameters by running the following command:

```powershell
get-help get-azurededicatedcircuit -detailed
```

## <a name="modify"></a>Modifying an ExpressRoute circuit
You can modify certain properties of an ExpressRoute circuit without impacting connectivity.

You can do the following with no downtime:

* Enable or disable an ExpressRoute premium add-on for your ExpressRoute circuit.
* Increase the bandwidth of your ExpressRoute circuit provided there is capacity available on the port. Downgrading the bandwidth of a circuit is not supported. 
* Change the metering plan from Metered Data to Unlimited Data. Changing the metering plan from Unlimited Data to Metered Data is not supported.
* You can enable and disable *Allow Classic Operations*.

For more information on limits and limitations, refer to the [ExpressRoute FAQ](expressroute-faqs.md).

### To enable the ExpressRoute premium add-on
You can enable the ExpressRoute premium add-on for your existing circuit by using the following PowerShell snippet:

```powershell
$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.Sku.Tier = "Premium"
$ckt.sku.Name = "Premium_MeteredData"

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

The circuit will now have the ExpressRoute premium add-on features enabled. We will begin billing you for the premium add-on capability as soon as the command has successfully run.

### To disable the ExpressRoute premium add-on
> [!IMPORTANT]
> This operation can fail if you're using resources that are greater than what is permitted for the standard circuit.
> 
> 

Note the following:

* Before you downgrade from premium to standard, you must ensure that the number of virtual networks that are linked to the circuit is less than 10. If you don't do this, your update request fails, and we will bill you at premium rates.
* You must unlink all virtual networks in other geopolitical regions. If you don't do this, your update request will fail, and we will bill you at premium rates.
* Your route table must be less than 4,000 routes for private peering. If your route table size is greater than 4,000 routes, the BGP session drops and won't be reenabled until the number of advertised prefixes goes below 4,000.

You can disable the ExpressRoute premium add-on for the existing circuit by using the following PowerShell cmdlet:

```powershell
$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.Sku.Tier = "Standard"
$ckt.sku.Name = "Standard_MeteredData"

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### To update the ExpressRoute circuit bandwidth
For supported bandwidth options for your provider, check the [ExpressRoute FAQ](expressroute-faqs.md). You can pick any size greater than the size of your existing circuit.

> [!IMPORTANT]
> You may have to recreate the ExpressRoute circuit if there is inadequate capacity on the existing port. You cannot upgrade the circuit if there is no additional capacity available at that location.
>
> You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth requires you to deprovision the ExpressRoute circuit and then reprovision a new ExpressRoute circuit.
> 

After you decide what size you need, use the following command to resize your circuit:

```powershell
$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.ServiceProviderProperties.BandwidthInMbps = 1000

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```


Your circuit will be sized up on the Microsoft side. Then you must contact your connectivity provider to update configurations on their side to match this change. After you make this notification, we will begin billing you for the updated bandwidth option.

### To move the SKU from metered to unlimited
You can change the SKU of an ExpressRoute circuit by using the following PowerShell snippet:

```powershell
$ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.Sku.Family = "UnlimitedData"
$ckt.sku.Name = "Premium_UnlimitedData"

Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### To control access to the classic and Resource Manager environments
Review the instructions in [Move ExpressRoute circuits from the classic to the Resource Manager deployment model](expressroute-howto-move-arm.md).  

## Deprovisioning and deleting an ExpressRoute circuit
Note the following:

* You must unlink all virtual networks from the ExpressRoute circuit. If this operation fails, check to see if any virtual networks are linked to the circuit.
* If the ExpressRoute circuit service provider provisioning state is **Provisioning** or **Provisioned** you must work with your service provider to deprovision the circuit on their side. We will continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and notifies us.
* If the service provider has deprovisioned the circuit (the service provider provisioning state is set to **Not provisioned**) you can then delete the circuit. This will stop billing for the circuit

You can delete your ExpressRoute circuit by running the following command:

```powershell
Remove-AzureRmExpressRouteCircuit -ResourceGroupName "ExpressRouteResourceGroup" -Name "ExpressRouteARMCircuit"
```

## Next steps

After you create your circuit, make sure that you do the following:

* [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-arm.md)
* [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
