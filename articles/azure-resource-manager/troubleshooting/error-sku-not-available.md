---
title: SKU not available errors
description: Describes how to troubleshoot the SKU not available error when deploying resources with Azure Resource Manager.
ms.topic: troubleshooting
ms.date: 04/14/2021 
ms.custom: devx-track-azurepowershell
---
# Resolve errors for SKU not available

This article describes how to resolve the **SkuNotAvailable** error. If you're unable to find a suitable SKU in that region/zone or an alternative region/zone that meets your business needs, submit a [SKU request](/troubleshoot/azure/general/region-access-request-process) to Azure Support.

## Symptom

When deploying a resource (typically a virtual machine), you receive the following error code and error message:

```
Code: SkuNotAvailable
Message: The requested tier for resource '<resource>' is currently not available in location '<location>'
for subscription '<subscriptionID>'. Please try another tier or deploy to a different location.
```

## Cause

You receive this error when the resource SKU you've selected (such as VM size) isn't available for the location you've selected.

If you're deploying an Azure Spot VM or Spot scale set instance, there isn't any capacity for Azure Spot in this location. For more information, see [Spot error messages](../../virtual-machines/error-codes-spot.md).

## Solution 1 - PowerShell

To determine which SKUs are available in a region/zone, use the [Get-AzComputeResourceSku](/powershell/module/az.compute/get-azcomputeresourcesku) command. Filter the results by location. You must have the latest version of PowerShell for this command.

```azurepowershell-interactive
Get-AzComputeResourceSku | where {$_.Locations -icontains "centralus"}
```

The results include a list of SKUs for the location and any restrictions for that SKU. Notice that a SKU might be listed as `NotAvailableForSubscription`.

```output
ResourceType          Name           Locations   Zone      Restriction                      Capability           Value
------------          ----           ---------   ----      -----------                      ----------           -----
virtualMachines       Standard_A0    centralus             NotAvailableForSubscription      MaxResourceVolumeMB   20480
virtualMachines       Standard_A1    centralus             NotAvailableForSubscription      MaxResourceVolumeMB   71680
virtualMachines       Standard_A2    centralus             NotAvailableForSubscription      MaxResourceVolumeMB  138240
virtualMachines       Standard_D1_v2 centralus   {2, 1, 3}                                  MaxResourceVolumeMB
```

To filter by location and SKU, use:

```azurepowershell-interactive
$SubId = (Get-AzContext).Subscription.Id

$Region = "centralus" # change region here
$VMSku = "Standard_M" # change VM SKU here

$VMSKUs = Get-AzComputeResourceSku | where {$_.Locations.Contains($Region) -and $_.ResourceType.Contains("virtualMachines") -and $_.Name.Contains($VMSku)}

$OutTable = @()

foreach ($SkuName in $VMSKUs.Name)
        {
            $LocRestriction = if ((($VMSKUs | where Name -EQ $SkuName).Restrictions.Type | Out-String).Contains("Location")){"NotAvavalableInRegion"}else{"Available - No region restrictions applied" }
            $ZoneRestriction = if ((($VMSKUs | where Name -EQ $SkuName).Restrictions.Type | Out-String).Contains("Zone")){"NotAvavalableInZone: "+(((($VMSKUs | where Name -EQ $SkuName).Restrictions.RestrictionInfo.Zones)| Where-Object {$_}) -join ",")}else{"Available - No zone restrictions applied"}
            
            
            $OutTable += New-Object PSObject -Property @{
                                                         "Name" = $SkuName
                                                         "Location" = $Region
                                                         "Applies to SubscriptionID" = $SubId
                                                         "Subscription Restriction" = $LocRestriction
                                                         "Zone Restriction" = $ZoneRestriction
                                                         }
         }

$OutTable | select Name, Location, "Applies to SubscriptionID", "Region Restriction", "Zone Restriction" | Sort-Object -Property Name | FT
```

The command returns results like:

```output
Name                   Location  Applies to SubscriptionID            Region Restriction                         Zone Restriction                        
----                   --------  -------------------------            ------------------------                   ----------------     
Standard_M128          centralus xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Available - No region restrictions applied Available - No zone restrictions applied
Standard_M128-32ms     centralus xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Available - No region restrictions applied Available - No zone restrictions applied
Standard_M128-64ms     centralus xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx Available - No region restrictions applied Available - No zone restrictions applied
Standard_M128dms_v2    centralus xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx NotAvavalableInRegion                      NotAvavalableInZone: 1,2,3
```

## Solution 2 - Azure CLI

To determine which SKUs are available in a region, use the [az vm list-skus](/cli/azure/vm#az_vm_list_skus) command. Use the `--location` parameter to filter output by location. Use the `--size` parameter to search by a partial size name. Use the `--all` parameter to show all information, including sizes that aren't available for the current subscription.

You must have Azure CLI version 2.15.0 or later. To check your version, use `az --version`. If needed, [update your installation](/cli/azure/update-azure-cli).

```azurecli-interactive
az vm list-skus --location southcentralus --size Standard_F --all --output table
```

The command returns results like:

```output
ResourceType     Locations       Name              Zones    Restrictions
---------------  --------------  ----------------  -------  --------------
virtualMachines  southcentralus  Standard_F1       1,2,3    None
virtualMachines  southcentralus  Standard_F2       1,2,3    None
virtualMachines  southcentralus  Standard_F4       1,2,3    None
...
virtualMachines  southcentralus  Standard_F72s_v2  1,2,3    NotAvailableForSubscription, type: Zone, locations: southcentralus, zones: 1,2,3
...
```

## Solution 3 - Azure portal

To determine which SKUs are available in a region, use the [portal](https://portal.azure.com). Sign in to the portal, and add a resource through the interface. As you set the values, you see the available SKUs for that resource. You don't need to complete the deployment.

For example, start the process of creating a virtual machine. To see other available size, select **Change size**.

![Create VM](./media/error-sku-not-available/create-vm.png)

You can filter and scroll through the available sizes.

![Available SKUs](./media/error-sku-not-available/available-sizes.png)

## Solution 4 - REST

To determine which SKUs are available in a region, use the [Resource Skus - List](/rest/api/compute/resourceskus/list) operation.

It returns available SKUs and regions in the following format:

```json
{
  "value": [
    {
      "resourceType": "virtualMachines",
      "name": "Standard_A0",
      "tier": "Standard",
      "size": "A0",
      "locations": [
        "eastus"
      ],
      "restrictions": []
    },
    {
      "resourceType": "virtualMachines",
      "name": "Standard_A1",
      "tier": "Standard",
      "size": "A1",
      "locations": [
        "eastus"
      ],
      "restrictions": []
    },
    ...
  ]
}
```
