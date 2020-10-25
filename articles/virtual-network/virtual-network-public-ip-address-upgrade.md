---
title: Upgrade public IP addresses
titleSuffix: Azure Virtual Network
description:  Upgrade public IP addresses from Basic to Standard.
services: virtual-network
documentationcenter: na
author: blehr
editor: ''

ms.assetid: bb71abaf-b2d9-4147-b607-38067a10caf6 
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang: NA
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/07/2020
ms.author: blehr
ms.custom: references_regions 
---

# Upgrade public IP addresses

Azure public IP addresses are created with a SKU--either Basic or Standard--which determines aspects of their functionality (including allocation method, usage across availability zones, and which resources they can be associated with). 

The following scenarios are reviewed in this article:
* How to upgrade a Basic SKU public IP to a Standard SKU public IP (using Portal, PowerShell, or CLI)
* How to migrate a Classic Azure Reserved IP to an Azure Resource Manager Basic SKU public IP

## Upgrade public IP address from Basic to Standard SKU

>[!NOTE]
>The ability to upgrade public IPs from Basic to Standard is not available in all regions.  Please see [**Limitations**](#limitations) for more details.

In order to upgrade a public IP, it must not be associated with any resource (see [this page](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address#view-modify-settings-for-or-delete-a-public-ip-address) for more information about how to disassociate public IPs).

>[!IMPORTANT]
>Public IPs upgraded from Basic to Standard SKU continue to have no [availability zones](https://docs.microsoft.com/azure/availability-zones/az-overview?toc=/azure/virtual-network/toc.json#availability-zones).  This means they cannot be associated with an Azure resource that is either zone-redundant or tied to a pre-specified zone in regions where this is offered.

---
# [**Basic to Standard - PowerShell**](#tab/option-upgrade-powershell)

The following example assumes previous creation of a Basic SKU public IP, using the example given on [this page](https://docs.microsoft.com/azure/virtual-network/create-public-ip-powershell?tabs=option-create-public-ip-basic) with a Basic public IP **myBasicPublicIP** in **myResourceGroup**.

In order to upgrade the IP, simply execute the commands below using PowerShell.  Note if the IP address is already statically allocated, that section can be skipped.

```azurepowershell-interactive
## Variables for the command ##
$rg = 'myResourceGroup'
$name = 'myBasicPublicIP'
$newsku = 'Standard'
$pubIP = Get-AzPublicIpAddress -name $name -ResourceGroupName $rg

## This section is only needed if the Basic IP is not already set to Static ##
$pubIP.PublicIpAllocationMethod = 'Static'
Set-AzPublicIpAddress -PublicIpAddress $pubIP

## This section is for conversion to Standard ##
$pubIP.Sku.Name = $newsku
Set-AzPublicIpAddress -PublicIpAddress $pubIP
```

# [**Basic to Standard - CLI**](#tab/option-upgrade-cli)

The following example assumes previous creation of a Basic SKU public IP, using the example given on [this page](https://docs.microsoft.com/azure/virtual-network/create-public-ip-cli?tabs=option-create-public-ip-basic) with a Basic public IP **myBasicPublicIP** in **myResourceGroup**.

In order to upgrade the IP, simply execute the commands below using the Azure CLI.  Note if the IP address is already statically allocated, that section can be skipped.

```azurecli-interactive
## Variables for the command ##
$rg = 'myResourceGroup'
$name = 'myBasicPublicIP'

## This section is only needed if the Basic IP is not already set to Static ##
az network public-ip update \
--resource-group $rg \
--name $name \
--allocation-method Static 

## This section is for conversion to Standard ##
az network public-ip update \
--resource-group $rg \
--name $name \
--sku Standard
```
---

## Upgrade (migrate) a classic Reserved IP to a static public IP

To benefit from the new capabilities in Azure Resource Manager, you can migrate existing public static IP address--called Reserved IPs--from the Classic model to the modern Azure Resource Manager model.  The migrated public IP will be a Basic SKU type.


---

# [**Reserved to Basic - PowerShell**](#tab/option-migrate-powershell)

The following example assumes previous creation of a classic Azure Reserved IP **myReservedIP** in **myResourceGroup**. Another prerequisite for migration is to ensure the Azure Resource Manager subscription has registered for migration. This is covered in detail on Steps 3 and 4 of [this page](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-ps).

In order to migrate the Reserved IP, execute the commands below using PowerShell.  Note if the IP address is not associated with any service (below there is a service named **myService**), that step can be skipped.

```azurepowershell-interactive
## Variables for the command ##
$name = 'myReservedIP'

## This section is only needed if the Reserved IP is not already disassociated from any Cloud Services ##
$serviceName = 'myService'
Remove-AzureReservedIPAssociation -ReservedIPName $name -ServiceName $service

$validate = Move-AzureReservedIP -ReservedIPName $name -Validate
$validate.ValidationMessages
```
The previous command displays any warnings and errors that block migration. If validation is successful, you can proceed with the following steps to Prepare and Commit the migration:
```azurepowershell-interactive
Move-AzureReservedIP -ReservedIPName $name -Prepare
Move-AzureReservedIP -ReservedIPName $name -Commit
```
A new resource group in Azure Resource Manager is created using the name of the migrated Reserved IP (in the example above, it would be resource group **myReservedIP-Migrated**).

# [**Reserved to Basic - CLI**](#tab/option-migrate-cli)

The following example assumes previous creation of a classic Azure Reserved IP **myReservedIP** in **myResourceGroup**. Another prerequisite for migration is to ensure the Azure Resource Manager subscription has registered for migration. This is covered in detail on Steps 3 and 4 of [this page](https://docs.microsoft.com/azure/virtual-machines/linux/migration-classic-resource-manager-cli).

In order to migrate the Reserved IP, execute the commands below using the Azure CLI.  Note if the IP address is not associated with any service (below there is a service named **myService** and deployment **myDeployment**), that step can be skipped.

```azurecli-interactive
## Variables for the command ##
$name = 'myReservedIP'

## This section is only needed if the Reserved IP is not already disassociated from any Cloud Services ##
$service = 'myService'
$deployment = 'myDeployment'
azure network reserved-ip disassociate $name $service $deployment

azure network reserved-ip validate-migration $name
```
The previous command displays any warnings and errors that block migration. If validation is successful, you can proceed with the following steps to Prepare and Commit the migration:
```azurecli-interactive
azure network reserved-ip prepare-migration $name
azure network reserved-ip commit-migration $name
```
A new resource group in Azure Resource Manager is created using the name of the migrated Reserved IP (in the example above, it would be resource group **myReservedIP-Migrated**).

---

## Limitations

* This capability is currently only available in the following regions:<br>
West Central US<br>
North Central US<br>
West US<br>
West US 2<br>
Norway East<br>
East US<br>
East US 2<br>
Switzerland North<br>
India West<br>
Germany North

* In order to upgrade a Basic Public IP, it cannot be associated with any Azure resource.  Please review [this page](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address#view-modify-settings-for-or-delete-a-public-ip-address) for more information on how to disassociate public IPs.  Similarly, in order to migrate a Reserved IP, it cannot be associated with any Cloud Service.  Please review [this page](https://docs.microsoft.com/azure/virtual-network/remove-public-ip-address-vm) for more information on how to disassociate reserved IPs.  
* Public IPs upgraded from Basic to Standard SKU will continue to have no [availability zones](https://docs.microsoft.com/azure/availability-zones/az-overview?toc=/azure/virtual-network/toc.json#availability-zones) and therefore cannot be associated with an Azure resource that is either zone-redundant or zonal.  Note this only applies to regions that offer availability zones.

## Next Steps

- Learn more about [public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses) in Azure, including the difference between the SKU types, as well as [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
- Learn how to [Upgrade Azure Public Load Balancers from Basic to Standard](https://docs.microsoft.com/azure/load-balancer/upgrade-basic-standard).
- Understand [Classic Azure Reserved IPs](https://docs.microsoft.com/previous-versions/azure/virtual-network/virtual-networks-reserved-public-ip) and [Migration of Classic resources to Azure Resource Manager](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-overview).