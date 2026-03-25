---
title: Instance size flexibility for Azure Reservations
description: Learn how instance size flexibility works for reservations and how discount matching is calculated.
author: pri-mittal
ms.author: primittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: concept-article
ms.date: 03/19/2026
---

# Instance size flexibility (ISF)

Instance Size Flexibility (ISF) is an Azure Reservations capability that allows a single reservation purchase to automatically apply across multiple SKUs, rather than being locked to one exact size. Instead of requiring customers to predict and reserve a specific SKU, ISF applies reservation benefits dynamically based on usage, as long as the resources belong to the same flexibility group. This ensures customers continue to receive reserved pricing even when workloads scale up, scale down, or shift across compatible sizes, reducing operational overhead and improving reservation utilization.

## How instance size flexibility works

Each reservation-enabled service defines instance size flexibility groups where ISF is supported. Only SKUs in the same flexibility group can share a reservation benefit. For example, multiple VM sizes in the same VM family can be in one group, while sizes in a different family aren't.

Within a flexibility group, each SKU has a relative ratio:
- Smaller sizes have lower ratios.
- Larger sizes have higher ratios.

When you purchase a reservation, you commit to fixed quantity. Microsoft applies reservation benefit to running eligible usage until it's consumed. Ratios are relative units, not prices.

Microsoft continuously evaluates running usage and applies reservation discounts to eligible resources on a first-come, first-served basis within the reservation scope. If usage exceeds the purchased quantity, the remaining usage is billed at pay-as-you-go rates. No manual assignment is required.

## Examples

### Virtual Machine example

With a reserved virtual machine instance that's optimized for instance size flexibility, the reservation you buy can apply to the virtual machines (VMs) sizes in the same instance size flexibility group. In other words, when you buy a reserved VM instance of any size within an instance flexibility group, the instance applies to all sizes within the group. For example, if you buy a reservation for a VM size that's listed in the DSv2 Series, like Standard_DS3_v2, the reservation discount can apply to the other sizes that are listed in that same instance size flexibility group:

Standard_DS1_v2
Standard_DS2_v2
Standard_DS3_v2
Standard_DS4_v2
But that reservation discount doesn't apply to VMs sizes that are listed in different instance size flexibility groups, like SKUs in DSv2 Series High Memory: Standard_DS11_v2, Standard_DS12_v2, and so on.

Within the instance size flexibility group, the number of VMs the reservation discount applies to depends on the VM size you pick when you buy a reservation. It also depends on the sizes of the VMs that you have running. The ratio column compares the relative footprint for each VM size in that instance size flexibility group. Use the ratio value to calculate how the reservation discount applies to the VMs you have running.

### Microsoft Foundry example

Assume you buy a 300-PTU Global reservation for Microsoft Foundry Provisioned Throughput.

- If you deploy 250 Global PTUs for Azure OpenAI Service, and 50 Global PTUs for DeepSeek in same region, all 300 PTUs are covered by the reservation.

Global, Data Zone, and Regional reservations aren't interchangeable, so each deployment type needs its own matching reservation.

## Other services

Reservation benefit matching isn't limited to VM reservations. Similar service-specific reservation behavior also exists for other services, and you can find details on individual documents for each reservation type.

## Extract Instance Size Flexibility ratios using Azure Catalogs API

This section describes how to use the Azure Reservations Catalogs API to extract Instance Size Flexibility (ISF) ratios for Azure Reservations. ISF allows you to apply reservation benefits flexibly across different sizes within the same resource family and region. This applies to various Azure reservation types including Virtual Machines, Azure Redis Cache and other supported services.

## What you'll learn

How to use the Azure Catalogs API via PowerShell to extract Instance Size Flexibility ratios for various Azure reservation types, construct ISF CSV files, and handle different resource types that support ISF.

## Prerequisites

- Azure subscription with appropriate permissions
- Access to Azure Resource Management APIs
- PowerShell with Az.Reservations module (for PowerShell examples)
- Understanding of the Azure resource types you want to generate ISF ratios for

## ISF CSV file structure

The resulting CSV file contains three columns:

| Column | Description |
| -------- | ----------- |
| `InstanceSizeFlexibilityGroup` | The flexibility group name (e.g., "Av2 Series", "General Purpose Gen5") |
| `ArmSkuName` | The Azure Resource Manager SKU name (e.g., "Standard_A1_v2", "GP_Gen5_2") |
| `Ratio` | The flexibility ratio for the SKU within its group |

## API Documentation Reference

For developers who prefer to use the REST API directly, refer to the [Azure Reservations Catalog REST API documentation](/rest/api/reserved-vm-instances/get-catalog/get-catalog?tabs=HTTP).

The ISF ratio information is found in the API response within each catalog item's `skuProperties` array. Look for properties with the following names:
- `ReservationsAutofitGroup` - Contains the flexibility group name
- `ReservationsAutofitRatio` - Contains the ratio value for that SKU

 ## Normalize ISF ratios

The raw ISF ratios from the API and powershell don't always start at `1` for the smallest SKU in a group. For example, the `BS Series` group starts at `0.25` and the `Ddsv5 Series` starts at `2`. To make ratios easier to compare, you can normalize them so the smallest SKU in each flexibility group has a ratio of `1`.

```powershell
# Function to normalize ISF ratios so the smallest SKU in each group = 1
function Get-NormalizedISFRatios {
    param(
        [Parameter(Mandatory=$true)]
        [PSCustomObject[]]$ISFData
    )

    $NormalizedData = @()
    $groups = $ISFData | Group-Object InstanceSizeFlexibilityGroup

    foreach ($group in $groups) {
        # Find the minimum ratio in the group
        $minRatio = ($group.Group | ForEach-Object { [double]$_.Ratio } | Measure-Object -Minimum).Minimum

        foreach ($item in $group.Group) {
            $NormalizedData += [PSCustomObject]@{
                InstanceSizeFlexibilityGroup = $item.InstanceSizeFlexibilityGroup
                ArmSkuName                   = $item.ArmSkuName
                Ratio                        = [math]::Round([double]$item.Ratio / $minRatio, 4)
            }
        }
    }

    return $NormalizedData
}

# Normalize the extracted ISF data
$NormalizedRatios = Get-NormalizedISFRatios -ISFData $ISFRatios

# Export to CSV
$NormalizedRatios | Export-Csv -Path "isf-ratios-normalized.csv" -NoTypeInformation

# Display sample results
$NormalizedRatios | Select-Object -First 10 | Format-Table
```

#### Example: before and after normalization

**BS Series**

| ArmSkuName | Original Ratio | Normalized Ratio |
|---|---|---|
| Standard\_B1ls | 0.25 | 1 |
| Standard\_B1s | 0.5 | 2 |
| Standard\_B2s | 2 | 8 |

**Ddsv5 Series**

| ArmSkuName | Original Ratio | Normalized Ratio |
|---|---|---|
| Standard\_D2ds\_v5 | 2 | 1 |
| Standard\_D4ds\_v5 | 4 | 2 |
| Standard\_D8ds\_v5 | 8 | 4 |
| Standard\_D16ds\_v5 | 16 | 8 |
| Standard\_D32ds\_v5 | 32 | 16 |
| Standard\_D48ds\_v5 | 48 | 24 |
| Standard\_D64ds\_v5 | 64 | 32 |
| Standard\_D96ds\_v5 | 96 | 48 |

#### Normalized CSV file structure

| Column | Description |
|---|---|
| `InstanceSizeFlexibilityGroup` | The flexibility group name |
| `ArmSkuName` | The Azure Resource Manager SKU name |
| `Ratio` | The normalized ratio (smallest SKU in each group = 1) |

> [!NOTE]
> After normalization, the ratios remain proportional within each group. A normalized ratio of 2 means the SKU consumes twice the reservation units of the smallest SKU in that group.
 

## Using PowerShell

### Install required module

```powershell
# Install the Az.Reservations module if not already installed
Install-Module -Name Az.Reservations -Force -AllowClobber

# Connect to Azure
Connect-AzAccount
```

### Get catalog data with PowerShell

```powershell
# Set parameters
$SubscriptionId = "your-subscription-id"
$Location = "eastus"
$ResourceType = "VirtualMachines"  # Change for different resource types

# Set subscription context
Set-AzContext -SubscriptionId $SubscriptionId

# Get catalog data
$CatalogData = Get-AzReservationCatalog -SubscriptionId $SubscriptionId -Location $Location -ReservedResourceType $ResourceType

# Display results
$CatalogData | Select-Object Name, ResourceType | Format-Table
```

## Extract ISF ratios from PowerShell response

The Catalogs API response contains ISF ratio information in the `skuProperties` array. Look for properties with names "InstanceSizeFlexibilityRatio" and "InstanceSizeFlexibilityGroup".

### PowerShell parsing example

```powershell
# Function to extract ISF data from catalog response
function Get-ISFRatios {
    param(
        [Parameter(Mandatory=$true)]
        $CatalogData
    )
   
    $ISFData = @()
   
    foreach ($item in $CatalogData) {
        $flexGroup = ""
        $ratio = ""
       
        # Extract ISF properties
        foreach ($property in $item.SkuProperties) {
            if ($property.Name -eq "ReservationsAutofitGroup") {
                $flexGroup = $property.Value
            }
            elseif ($property.Name -eq "ReservationsAutofitRatio") {
                $ratio = $property.Value
            }
        }
       
        # Only include items with both group and ratio
        if ($flexGroup -and $ratio) {
            $ISFData += [PSCustomObject]@{
                InstanceSizeFlexibilityGroup = $flexGroup
                ArmSkuName = $item.Name
                Ratio = $ratio
            }
        }
    }
   
    return $ISFData
}

# Extract ISF data
$ISFRatios = Get-ISFRatios -CatalogData $CatalogData

# Export to CSV
$ISFRatios | Export-Csv -Path "isf-ratios.csv" -NoTypeInformation

# Display sample results
$ISFRatios | Select-Object -First 10 | Format-Table
```

## Important considerations

- **Pagination**: The API returns paginated results. Use the `nextLink` property to retrieve all data.
- **Region-specific data**: ISF ratios can vary by Azure region. Generate separate files for each target region.
- **Resource type support**: Not all Azure services support ISF. Check the API response for InstanceSizeFlexibilityGroup properties.
- **Regular updates**: ISF ratios may change when new resource sizes are introduced. Update your files regularly.
- **Service-specific ratios**: Different services may have different ISF calculation methods and ratio scales.

## Troubleshooting

### Common issues and solutions

| Issue | Solution |
| ------- | ---------- |
| Authentication errors | Ensure you have `Microsoft.Capacity/catalogs/read` permission |
| Empty results | Verify the location parameter matches an Azure region name and the resource type supports ISF |
| Missing ISF properties | Some resource families may not support ISF - this is expected behavior |
| Invalid resource type | Check the supported reservedResourceType values for your target service |

## Next steps

- [Learn more about Azure Reservations](save-compute-costs-reservations.md)
- [Understanding Instance Size Flexibility for different services](reservation-discount-application.md#discount-applies-to-different-sizes)
- [Azure Resource Manager REST API reference](/rest/api/resources/)

## Related articles

- [Azure Reservations documentation](save-compute-costs-reservations.md)
- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Azure PowerShell documentation](/powershell/azure/)
