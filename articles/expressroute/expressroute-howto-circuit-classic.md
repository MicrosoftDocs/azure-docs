---
title: 'Modify an ExpressRoute circuit: PowerShell: Azure classic| Microsoft Docs'
description: This article walks you through the steps to check the status, update, or delete and deprovision your ExpressRoute classic deployment model circuit.
services: expressroute
author: ganesr

ms.service: expressroute
ms.topic: conceptual
ms.date: 07/26/2018
ms.author: ganesr;cherylmc

---
# Modify an ExpressRoute circuit using PowerShell (classic)

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-circuit-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-circuit-arm.md)
> * [Azure CLI](howto-circuit-cli.md)
> * [Video - Azure portal](http://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-an-expressroute-circuit)
> * [PowerShell (classic)](expressroute-howto-circuit-classic.md)
>

This article also shows you how to check the status, update, or delete and deprovision an ExpressRoute circuit.

[!INCLUDE [expressroute-classic-end-include](../../includes/expressroute-classic-end-include.md)]

**About Azure deployment models**

[!INCLUDE [vpn-gateway-clasic-rm](../../includes/vpn-gateway-classic-rm-include.md)]

## Before you begin

Install the latest versions of the Azure Service Management (SM) PowerShell modules and the ExpressRoute module.  When using the following example, note that the version number (in this example, 5.1.1) will change as newer versions of the cmdlets are released.

```powershell
Import-Module 'C:\Program Files\WindowsPowerShell\Modules\Azure\5.1.1\Azure\Azure.psd1'
Import-Module 'C:\Program Files\WindowsPowerShell\Modules\Azure\5.1.1\ExpressRoute\ExpressRoute.psd1'
```

If you need more information about Azure PowerShell, see [Getting started with Azure PowerShell cmdlets](/powershell/azure/overview) for step-by-step guidance on how to configure your computer to use the Azure PowerShell modules.

To sign in to your Azure account, use the following example:

1. Open your PowerShell console with elevated rights and connect to your account. Use the following example to help you connect:

  ```powershell
  Connect-AzureRmAccount
  ```
2. Check the subscriptions for the account.

  ```powershell
  Get-AzureRmSubscription
  ```
3. If you have more than one subscription, select the subscription that you want to use.

  ```powershell
  Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"
  ```

4. Next, use the following cmdlet to add your Azure subscription to PowerShell for the classic deployment model.

  ```powershell
  Add-AzureAccount
  ```

## Get the status of a circuit

You can retrieve this information at any time by using the `Get-AzureCircuit` cmdlet. Making the call without any parameters lists all the circuits.

```powershell
Get-AzureDedicatedCircuit

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
```

You can get information on a specific ExpressRoute circuit by passing the service key as a parameter to the call.

```powershell
Get-AzureDedicatedCircuit -ServiceKey "*********************************"

Bandwidth                        : 200
CircuitName                      : MyTestCircuit
Location                         : Silicon Valley
ServiceKey                       : *********************************
ServiceProviderName              : equinix
ServiceProviderProvisioningState : Provisioned
Sku                              : Standard
Status                           : Enabled
```

You can get detailed descriptions of all the parameters by running the following example:

```powershell
get-help get-azurededicatedcircuit -detailed
```

## Modify a circuit

You can modify certain properties of an ExpressRoute circuit without impacting connectivity.

You can do the following tasks with no downtime:

* Enable or disable an ExpressRoute premium add-on for your ExpressRoute circuit.
* Increase the bandwidth of your ExpressRoute circuit provided there is capacity available on the port. Downgrading the bandwidth of a circuit is not supported. 
* Change the metering plan from Metered Data to Unlimited Data. Changing the metering plan from Unlimited Data to Metered Data is not supported.
* You can enable and disable *Allow Classic Operations*.

Refer to the [ExpressRoute FAQ](expressroute-faqs.md) for more information on limits and limitations.

### Enable the ExpressRoute premium add-on

You can enable the ExpressRoute premium add-on for your existing circuit by using the following PowerShell cmdlet:

```powershell
Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Premium

Bandwidth                        : 1000
CircuitName                      : TestCircuit
Location                         : Silicon Valley
ServiceKey                       : *********************************
ServiceProviderName              : equinix
ServiceProviderProvisioningState : Provisioned
Sku                              : Premium
Status                           : Enabled
```

Your circuit will now have the ExpressRoute premium add-on features enabled. As soon as the command has been successfully run, billing for the premium add-on capability begins.

### Disable the ExpressRoute premium add-on

> [!IMPORTANT]
> This operation can fail if you're using resources that are greater than what is permitted for the standard circuit.
> 
> 

#### Considerations

* Make sure that the number of virtual networks linked to the circuit is less than 10 before you downgrade from premium to standard. If you don't do this, your update request fails, and you are billed the premium rates.
* You must unlink all virtual networks in other geopolitical regions. If you don't, your update request fails, and you are billed the premium rates.
* Your route table must be less than 4,000 routes for private peering. If your route table size is greater than 4,000 routes, the BGP session drops and won't be reenabled until the number of advertised prefixes goes below 4,000.

#### To disable the premium add-on

You can disable the ExpressRoute premium add-on for your existing circuit by using the following PowerShell cmdlet:

```powershell

Set-AzureDedicatedCircuitProperties -ServiceKey "*********************************" -Sku Standard

Bandwidth                        : 1000
CircuitName                      : TestCircuit
Location                         : Silicon Valley
ServiceKey                       : *********************************
ServiceProviderName              : equinix
ServiceProviderProvisioningState : Provisioned
Sku                              : Standard
Status                           : Enabled
```

### Update the ExpressRoute circuit bandwidth

Check the [ExpressRoute FAQ](expressroute-faqs.md) for supported bandwidth options for your provider. You can pick any size that is greater than the size of your existing circuit as long as the physical port (on which your circuit is created) allows.

> [!IMPORTANT]
> You may have to recreate the ExpressRoute circuit if there is inadequate capacity on the existing port. You cannot upgrade the circuit if there is no additional capacity available at that location.
>
> You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth requires you to deprovision the ExpressRoute circuit and then reprovision a new ExpressRoute circuit.
> 
> 

#### Resize a circuit

After you decide what size you need, you can use the following command to resize your circuit:

```powershell
Set-AzureDedicatedCircuitProperties -ServiceKey ********************************* -Bandwidth 1000

Bandwidth                        : 1000
CircuitName                      : TestCircuit
Location                         : Silicon Valley
ServiceKey                       : *********************************
ServiceProviderName              : equinix
ServiceProviderProvisioningState : Provisioned
Sku                              : Standard
Status                           : Enabled
```

Once your circuit has been sized up on the Microsoft side, you must contact your connectivity provider to update configurations on their side to match this change. Billing begins for the updated bandwidth option from this point on.

If you see the following error when increasing the circuit bandwidth, it means there is no sufficient bandwidth left on the physical port where your existing circuit is created. You must delete this circuit and create a new circuit of the size you need.

```powershell
Set-AzureDedicatedCircuitProperties : InvalidOperation : Insufficient bandwidth available to perform this circuit
update operation
At line:1 char:1
+ Set-AzureDedicatedCircuitProperties -ServiceKey ********************* ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  + CategoryInfo          : CloseError: (:) [Set-AzureDedicatedCircuitProperties], CloudException
  + FullyQualifiedErrorId : Microsoft.WindowsAzure.Commands.ExpressRoute.SetAzureDedicatedCircuitPropertiesCommand
```

## Deprovision and delete a circuit

### Considerations

* You must unlink all virtual networks from the ExpressRoute circuit for this operation to succeed. Check to see if you have any virtual networks that are linked to the circuit if this operation fails.
* If the ExpressRoute circuit service provider provisioning state is **Provisioning** or **Provisioned** you must work with your service provider to deprovision the circuit on their side. We continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and notifies us.
* If the service provider has deprovisioned the circuit (the service provider provisioning state is set to **Not provisioned**), you can then delete the circuit. This stops billing for the circuit.

#### Delete a circuit

You can delete your ExpressRoute circuit by running the following command:

```powershell
Remove-AzureDedicatedCircuit -ServiceKey "*********************************"
```
