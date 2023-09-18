---
title: 'Quickstart: Create and modify an ExpressRoute circuit using Azure PowerShell'
description: This quickstart shows you how to create, provision, verify, update, delete, and deprovision an ExpressRoute circuit.
services: expressroute
author: duongau
ms.author: duau
ms.date: 12/27/2022
ms.topic: quickstart
ms.service: expressroute
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create and modify an ExpressRoute circuit using Azure PowerShell

This quickstart shows you how to create an ExpressRoute circuit using PowerShell cmdlets and the Azure Resource Manager deployment model. You can also check the status, update, delete, or deprovision a circuit.

:::image type="content" source="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png" alt-text="Diagram of ExpressRoute circuit deployment environment using Azure PowerShell.":::

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## <a name="create"></a>Create and provision an ExpressRoute circuit

### Sign in to your Azure account and select your subscription

[!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

### Get the list of supported providers, locations, and bandwidths

Before you create an ExpressRoute circuit, you need the list of supported connectivity providers, locations, and bandwidth options.

The PowerShell cmdlet **Get-AzExpressRouteServiceProvider** returns this information, which you’ll use in later steps:

```azurepowershell-interactive
Get-AzExpressRouteServiceProvider
```

Check to see if your connectivity provider is listed there. Make a note of the following information, which you need later when you create a circuit:

* Name
* PeeringLocations
* BandwidthsOffered

You're now ready to create an ExpressRoute circuit.

### Create an ExpressRoute circuit

If you don't already have a resource group, you must create one before you create your ExpressRoute circuit. You can do so by running the following command:

```azurepowershell-interactive
New-AzResourceGroup -Name "ExpressRouteResourceGroup" -Location "West US"
```

The following example shows how to create a 200-Mbps ExpressRoute circuit through Equinix in Silicon Valley. If you're using a different provider and different settings, replace that information when you make your request. Use the following example to request a new service key:

```azurepowershell-interactive
New-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup" -Location "West US" -SkuTier Standard -SkuFamily MeteredData -ServiceProviderName "Equinix" -PeeringLocation "Silicon Valley" -BandwidthInMbps 200
```

Make sure that you specify the correct SKU tier and SKU family:

* SKU tier determines whether an ExpressRoute circuit is [Local](expressroute-faqs.md#expressroute-local), Standard, or [Premium](expressroute-faqs.md#expressroute-premium). You can specify *Local*, *Standard, or *Premium*.
* SKU family determines the billing type. You can specify *MeteredData* for a metered data plan and *UnlimitedData* for an unlimited data plan. You can change the billing type from *MeteredData* to *UnlimitedData*, but you can't change the type from *UnlimitedData* to *MeteredData*. A *Local* circuit is always *UnlimitedData*.

> [!IMPORTANT]
> Your ExpressRoute circuit is billed from the moment a service key is issued. Ensure that you perform this operation when the connectivity provider is ready to provision the circuit.
>

The response contains the service key. You can get detailed descriptions of all the parameters by running the following command:

```azurepowershell-interactive
get-help New-AzExpressRouteCircuit -detailed
```

### List all ExpressRoute circuits

To get a list of all the ExpressRoute circuits that you created, run the **Get-AzExpressRouteCircuit** command:

```azurepowershell-interactive
Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
```

The response looks similar to the following example:

```azurepowershell
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
```

You can retrieve this information at any time by using the `Get-AzExpressRouteCircuit` cmdlet. Making the call with no parameters lists all the circuits. Your service key is listed in the *ServiceKey* field:

```azurepowershell-interactive
Get-AzExpressRouteCircuit
```

The response looks similar to the following example:

```azurepowershell
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
```

### Send the service key to your connectivity provider for provisioning

*ServiceProviderProvisioningState* provides you information about the current state of provisioning on the service-provider side. *CircuitProvisioningState* provides you the status on the Microsoft side. For more information about circuit provisioning states, see [Workflows](expressroute-workflows.md#expressroute-circuit-provisioning-states).

When you create a new ExpressRoute circuit, the circuit is in the following state:

```azurepowershell
ServiceProviderProvisioningState : NotProvisioned
CircuitProvisioningState         : Enabled
```

The circuit changes to the following state when the connectivity provider is currently enabling it for you:

```azurepowershell
ServiceProviderProvisioningState : Provisioning
CircuitProvisioningState         : Enabled
```

To use the ExpressRoute circuit, it must be in the following state:

```azurepowershell
ServiceProviderProvisioningState : Provisioned
CircuitProvisioningState         : Enabled
```

### Periodically check the status and the state of the circuit key

Checking the status and the state of the service key will let you know when your provider has provisioned your circuit. After the circuit has been configured, *ServiceProviderProvisioningState* appears as *Provisioned*, as shown in the following example:

```azurepowershell-interactive
Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
```

The response looks similar to the following example:

```azurepowershell
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
```

### Create your routing configuration

For step-by-step instructions, see the [ExpressRoute circuit routing configuration](expressroute-howto-routing-arm.md) article to create and modify circuit peerings.

> [!IMPORTANT]
> These instructions only apply to circuits that are created with service providers that offer layer 2 connectivity services. If you're using a service provider that offers managed layer 3 services (typically an IP VPN, like MPLS), your connectivity provider configures and manages routing for you.
>

### Link a virtual network to an ExpressRoute circuit

Next, link a virtual network to your ExpressRoute circuit. Use the [Linking virtual networks to ExpressRoute circuits](expressroute-howto-linkvnet-arm.md) article when you work with the Resource Manager deployment model.

## Getting the status of an ExpressRoute circuit

You can retrieve this information at any time by using the **Get-AzExpressRouteCircuit** cmdlet. Making the call with no parameters lists all the circuits.

```azurepowershell-interactive
Get-AzExpressRouteCircuit
```

The response is similar to the following example:

```azurepowershell
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
```

You can get information on a specific ExpressRoute circuit by passing the resource group name and circuit name as a parameter to the call:

```azurepowershell-interactive
Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
```

The response looks similar to the following example:

```azurepowershell
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
```

You can get detailed descriptions of all the parameters by running the following command:

```azurepowershell-interactive
get-help Get-AzExpressRouteCircuit -detailed
```

## <a name="modify"></a>Modifying an ExpressRoute circuit

You can modify certain properties of an ExpressRoute circuit without impacting connectivity.

You can do the following tasks with no downtime:

* Enable or disable an ExpressRoute premium add-on for your ExpressRoute circuit.
* Increase the bandwidth of your ExpressRoute circuit provided there's capacity available on the port. Downgrading the bandwidth of a circuit isn't supported.
* Change the metering plan from Metered Data to Unlimited Data. Changing the metering plan from Unlimited Data to Metered Data isn't supported.
* You can enable and disable *Allow Classic Operations*.

For more information on limits and limitations, see the [ExpressRoute FAQ](expressroute-faqs.md).

### To enable the ExpressRoute premium add-on

You can enable the ExpressRoute premium add-on for your existing circuit by using the following PowerShell snippet:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.Sku.Tier = "Premium"
$ckt.sku.Name = "Premium_MeteredData"

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

The circuit now has the ExpressRoute premium add-on features enabled. We begin billing you for the premium add-on capability as soon as the command has successfully run.

### To disable the ExpressRoute premium add-on

> [!IMPORTANT]
> If you're using resources that are greater than what is permitted for the standard circuit, this operation can fail.
>

Note the following information:

* Before you downgrade from premium to standard, you must ensure that the number of virtual networks that are linked to the circuit is less than 10. If you don't, your update request fails, and we bill you at premium rates.
* All virtual networks in other geopolitical regions must be first unlinked. If you don't remove the link, your update request will fail and we continue to bill you at premium rates.
* Your route table must be less than 4,000 routes for private peering. If your route table size is greater than 4,000 routes, the BGP session will drop. The BGP session won't be re-enabled until the number of advertised prefixes is under 4,000.

You can disable the ExpressRoute premium add-on for the existing circuit by using the following PowerShell cmdlet:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.Sku.Tier = "Standard"
$ckt.sku.Name = "Standard_MeteredData"

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### To update the ExpressRoute circuit bandwidth

For supported bandwidth options for your provider, check the [ExpressRoute FAQ](expressroute-faqs.md). You can pick any size greater than the size of your existing circuit.

> [!IMPORTANT]
> You may have to recreate the ExpressRoute circuit if there is inadequate capacity on the existing port. You cannot upgrade the circuit if there is no additional capacity available at that location.
>
> You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth requires you to deprovision the ExpressRoute circuit and then reprovision a new ExpressRoute circuit.
>

After you decide what size you need, use the following command to resize your circuit:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.ServiceProviderProperties.BandwidthInMbps = 1000

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

Your circuit will be upgraded on the Microsoft side. Then you must contact your connectivity provider to update configurations on their side to match this change. After you make this notification, we'll begin billing you for the updated bandwidth option.

### To move the SKU from metered to unlimited

You can change the SKU of an ExpressRoute circuit by using the following PowerShell snippet:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

$ckt.Sku.Family = "UnlimitedData"
$ckt.sku.Name = "Premium_UnlimitedData"

Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

### To control access to the classic and Resource Manager environments

Review the instructions in [Move ExpressRoute circuits from the classic to the Resource Manager deployment model](expressroute-howto-move-arm.md).

## <a name="delete"></a>Deprovisioning an ExpressRoute circuit

Note the following information:

* All virtual networks must be unlinked from the ExpressRoute circuit. If this operation fails, check to see if any virtual networks are linked to the circuit.
* If the ExpressRoute circuit service provider provisioning state is **Provisioning** or **Provisioned** you must work with your service provider to deprovision the circuit on their side. We continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and notifies us.
* If the service provider has deprovisioned the circuit meaning the service provider provisioning state gets set to **Not provisioned**, you can delete the circuit. The billing for the circuit will then stop.

## Clean up resources

You can delete your ExpressRoute circuit by running the following command:

```azurepowershell-interactive
Remove-AzExpressRouteCircuit -ResourceGroupName "ExpressRouteResourceGroup" -Name "ExpressRouteARMCircuit"
```

## Next steps

After you create your circuit and provision it with your provider, continue to the next step to configure the peering:

> [!div class="nextstepaction"]
> [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-arm.md)
