---
title: Location Ineligible
description: Information about 'location ineligible' error
ms.topic: troubleshooting
ms.date: 07/30/2024
---

# Information about Location Ineligible error

This article provides information about the 'location ineligible' error that might occur when you attempt to create new resources in certain Azure regions.

## Symptom

The following error message is returned when you attempt to create a new resource in Azure's West Europe region using an Azure Resource Manager (ARM) template, Azure CLI, or Azure PowerShell. Or, you might see this error in Azure Portal when you select West Europe in the region drop-down while attempting to create a new resource.

```Output
The selected region is currently not accepting new customers: https://aka.ms/locationineligible
```

## Cause

To maximize access for Azure customers already deployed in an Azure location, Microsoft will sometimes restrict access for customers not using that location. This policy is currently in effect for Azure's West Europe region. When you attempt to create resources in West Europe under a tenant that is new to this region, you will recieve the error message mentioned above.

## Solution

You 

- When 
- If 

# [Azure CLI](#tab/azure-cli)

To determine which SKUs are available in a location or zone, use the [az vm list-skus](/cli/azure/vm#az-vm-list-skus) command.

```azurecli-interactive
az vm list-skus --location centralus --size Standard_D --all --output table
```

- `--location` filters output by location.
- `--size` searches by a partial size name.
- `--all` shows all information and includes sizes that aren't available for the current subscription.

```Output
ResourceType     Locations    Name               Zones    Restrictions
---------------  -----------  --------------     -------  --------------
virtualMachines  centralus    Standard_D1        1        None
virtualMachines  centralus    Standard_D11       1        None
virtualMachines  centralus    Standard_D11_v2    1,2,3    None
virtualMachines  centralus    Standard_D16ds_v4  1,2,3    NotAvailableForSubscription, type: Zone,
                                                          locations: centralus, zones: 1,2,3
```

### Availability zones

You can view all the compute resources for a location's availability zones. By default, only SKUs without restrictions are displayed. To include SKUs with restrictions, use the `--all` parameter.

```azurecli-interactive
az vm list-skus --location centralus --zone --all --output table
```

```Output
ResourceType      Locations    Name                 Zones    Restrictions
----------------  -----------  -------------------  -------  --------------
disks             centralus    Premium_LRS          1,2,3    None
disks             centralus    Premium_LRS          1,2,3    None
virtualMachines   centralus    Standard_A2_v2       1,2,3    None
virtualMachines   centralus    Standard_D16ds_v4    1,2,3    NotAvailableForSubscription, type: Zone,
                                                             locations: centralus, zones: 1,2,3
```

You can filter by a `resourceType` like VMs for availability zones.

```azurecli-interactive
az vm list-skus --location centralus --resource-type virtualMachines --zone --all --output table
```

```Output
ResourceType      Locations    Name                 Zones    Restrictions
----------------  -----------  -------------------  -------  --------------
virtualMachines   centralus    Standard_A1_v2       1,2,3    None
virtualMachines   centralus    Standard_A2m_v2      1,2,3    None
virtualMachines   centralus    Standard_A2_v2       1,2,3    None
virtualMachines   centralus    Standard_D16ds_v4    1,2,3    NotAvailableForSubscription, type: Zone,
                                                             locations: centralus, zones: 1,2,3
```

# [PowerShell](#tab/azure-powershell)

To determine which SKUs are available in a location or zone, use the [Get-AzComputeResourceSku](/powershell/module/az.compute/get-azcomputeresourcesku) command.

```azurepowershell-interactive
Get-AzComputeResourceSku | Where-Object { $_.Locations -contains "centralus" }
```

The `Get-AzComputeResourceSku` cmdlet gets all the compute resources. The objects are sent down the pipeline and [Where-Object](/powershell/module/microsoft.powershell.core/where-object) filters the output to include only the specified location. SKUs that aren't available for the current subscription are listed as `NotAvailableForSubscription`.

```Output
ResourceType                       Name  Location      Zones                  Restriction            Capability    Value
------------                       ----  --------      -----                  -----------            ----------    -----
disks                       Premium_LRS centralus   {1, 3, 2}                                        MaxSizeGiB        4
disks                       Premium_LRS centralus   {1, 3, 2}                                        MaxSizeGiB      128
virtualMachines             Standard_A1 centralus                                           MaxResourceVolumeMB    71680
virtualMachines          Standard_A1_v2 centralus   {1, 2, 3}                               MaxResourceVolumeMB    10240
virtualMachines       Standard_D16ds_v4 centralus   {1, 3, 2}  NotAvailableForSubscription  MaxResourceVolumeMB   614400
```

The following PowerShell script filters by location and SKU:

```azurepowershell-interactive
$SubId = (Get-AzContext).Subscription.Id

$Region = "centralus" # change region here
$VMSku = "Standard_D" # change VM SKU here

$VMSKUs = Get-AzComputeResourceSku | where {$_.Locations.Contains($Region) -and $_.ResourceType.Contains("virtualMachines") -and $_.Name.Contains($VMSku)}

$OutTable = @()

foreach ($SkuName in $VMSKUs.Name)
        {
            $LocRestriction = if ((($VMSKUs | where Name -EQ $SkuName).Restrictions.Type | Out-String).Contains("Location")){"NotAvailableInRegion"}else{"Available - No region restrictions applied" }
            $ZoneRestriction = if ((($VMSKUs | where Name -EQ $SkuName).Restrictions.Type | Out-String).Contains("Zone")){"NotAvailableInZone: "+(((($VMSKUs | where Name -EQ $SkuName).Restrictions.RestrictionInfo.Zones)| Where-Object {$_}) -join ",")}else{"Available - No zone restrictions applied"}


            $OutTable += New-Object PSObject -Property @{
                                                         "Name" = $SkuName
                                                         "Location" = $Region
                                                         "Applies to SubscriptionID" = $SubId
                                                         "Subscription Restriction" = $LocRestriction
                                                         "Zone Restriction" = $ZoneRestriction
                                                         }
         }

$OutTable | select Name, Location, "Applies to SubscriptionID", "Subscription Restriction", "Zone Restriction" | Sort-Object -Property Name | Format-Table

```

```Output
Name                   Location  Applies to SubscriptionID              Subscription Restriction                     Zone Restriction
----                   --------  -------------------------              ------------------------                     ----------------
Standard_D1            centralus 11111111-1111-1111-1111-111111111111   Available - No region restrictions applied   Available - No zone restrictions applied
Standard_D1_v2         centralus 11111111-1111-1111-1111-111111111111   Available - No region restrictions applied   Available - No zone restrictions applied
Standard_D16d_v4       centralus 11111111-1111-1111-1111-111111111111   Available - No region restrictions applied   NotAvailableInZone: 1,2,3
Standard_D16d_v5       centralus 11111111-1111-1111-1111-111111111111   Available - No region restrictions applied   Available - No zone restrictions applied
Standard_D16ds_v4      centralus 11111111-1111-1111-1111-111111111111   Available - No region restrictions applied   NotAvailableInZone: 1,2,3
Standard_D16ds_v5      centralus 11111111-1111-1111-1111-111111111111   Available - No region restrictions applied   Available - No zone restrictions applied
```

### Availability zones

The following command only shows VM sizes for availability zones. SKUs that aren't available for the current subscription are listed as `NotAvailableForSubscription`.

```azurepowershell-interactive
Get-AzComputeResourceSku | Where-Object { $_.Locations -contains "centralus" -and $_.LocationInfo.Zones -ne $null -and $_.ResourceType -eq "virtualmachines" }
```

```Output
ResourceType                 Name   Location      Zones                 Restriction           Capability    Value
------------                 ----   --------      -----                 -----------           ----------    -----
virtualMachines     Standard_A1_v2  centralus {1, 2, 3}                              MaxResourceVolumeMB    10240
virtualMachines    Standard_A2m_v2  centralus {1, 2, 3}                              MaxResourceVolumeMB    20480
virtualMachines     Standard_A2_v2  centralus {1, 2, 3}                              MaxResourceVolumeMB    20480
virtualMachines  Standard_D16ds_v4  centralus {1, 3, 2} NotAvailableForSubscription  MaxResourceVolumeMB   614400
```

# [Portal](#tab/azure-portal)

To determine which SKUs are available in a **Region**, use the [portal](https://portal.azure.com). Sign in to the portal, and create a VM resource. You can select a **Size** with the drop-down menu of the available SKUs. You don't need to complete the deployment.

- To see other available sizes, select **See all sizes**.

  :::image type="content" source="media/error-sku-not-available/create-vm.png" alt-text="Screenshot of Azure portal deployment interface displaying options to select a virtual machine size from a drop-down menu.":::

- You can filter and scroll through the available sizes. When you find the VM size you want to use, choose **Select**.

  :::image type="content" source="media/error-sku-not-available/available-sizes.png" alt-text="Screenshot of Azure portal showing a list of available virtual machine sizes along with filtering options to narrow down the selection.":::

# [REST](#tab/rest)

To determine which SKUs are available in a location, use the [Resource Skus - List](/rest/api/compute/resourceskus/list) operation.

You can use [az rest](/cli/azure/reference-index#az-rest) to run the list operation. Replace `<subscription ID>` including the angle brackets with your subscription ID. The output is a large data set that you can save to a JSON file.

```azurecli
az rest --method get --uri https://management.azure.com/subscriptions/<subscription ID>/providers/Microsoft.Compute/skus?api-version=2021-07-01 --output-file .\sku-list.json
```

The command returns available SKUs and locations in JSON format:

```json
{
  "resourceType": "virtualMachines",
  "name": "Standard_A1_v2",
  "tier": "Standard",
  "size": "A1_v2",
  "family": "standardAv2Family",
  "locations": [
    "centralus"
  ],
  "locationInfo": [
    {
      "location": "centralus",
      "zones": [
        "1",
        "2",
        "3"
      ],
      "zoneDetails": []
    }
  ],
  "capabilities": [
    {
      "name": "MaxResourceVolumeMB",
      "value": "10240"
    },
    {
      "name": "OSVhdSizeMB",
      "value": "1047552"
    },
    {
      "name": "vCPUs",
      "value": "1"
    }
  ],
  "restrictions": []
}
```

---
