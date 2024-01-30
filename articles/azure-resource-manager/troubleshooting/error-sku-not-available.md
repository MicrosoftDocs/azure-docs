---
title: SKU not available errors
description: Describes how to troubleshoot the SKU not available error when deploying resources with an Azure Resource Manager template (ARM template) or Bicep file.
ms.topic: troubleshooting
ms.custom: devx-track-arm-template, devx-track-bicep
ms.date: 04/05/2023
---

# Resolve errors for SKU not available

This article describes how to resolve errors when a SKU isn't available in an Azure subscription's region or availability zones. Examples of resource SKUs are virtual machine (VM) size or storage account types. Errors occur during deployments with an Azure Resource Manager template (ARM template) or Bicep file. The error also occurs with commands like [New-AzVM](/powershell/module/az.compute/new-azvm) or [az vm create](/cli/azure/vm#az-vm-create) that specify a `size` parameter for a SKU that's not available.

## Symptom

When a VM is deployed for a SKU that's not available, an error occurs. Azure CLI and Azure PowerShell deployment commands display an error message that the requested size isn't available in the location or zone. In the Azure portal activity log, you'll see error codes `SkuNotAvailable` or `InvalidTemplateDeployment`.

In this example, `New-AzVM` specified the `-Size` parameter for a SKU that's not available. The error code `SkuNotAvailable` is shown in the portal's activity log.

```Output
The requested size for resource '<resource ID>' is currently not available in location '<location>'
zones '<zones>' for subscription '<subscription ID>'.
Please try another size or deploy to a different location or zones.
```

When a VM is deployed with an ARM template or Bicep file for a SKU that's not available, a validation error occurs. The error code `InvalidTemplateDeployment` and error message are displayed. The deployment doesn't start so there's no deployment history, but the error is in the portal's activity log.

```Output
Error: Code=InvalidTemplateDeployment
Message=The template deployment failed with error: The resource with id: '<resource ID>' failed validation
with message: The requested size for resource '<resource ID>' is currently not available in
location '<location>' zones '<zones>' for subscription '<subscription ID>'.
Please try another size or deploy to a different location or zones.
```

## Cause

You receive this error in the following scenarios:

- When the resource SKU you've selected, such as VM size, isn't available for a location or zone.
- If you're deploying an Azure Spot VM or Spot scale set instance, and there isn't any capacity for Azure Spot in this location. For more information, see [Spot error messages](../../virtual-machines/error-codes-spot.md).

## Solution

If a SKU isn't available for your subscription in a location or zone that meets your business needs, submit a [SKU request](/troubleshoot/azure/general/region-access-request-process) to Azure Support.

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
