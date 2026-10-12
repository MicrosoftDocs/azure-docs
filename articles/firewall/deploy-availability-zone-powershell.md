---
title: Deploy Azure Firewall with Availability Zones
description: Learn how to deploy Azure Firewall with platform-managed zone redundancy, without specifying availability zones, and review regional rollout coverage.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 10/09/2026
ms.author: duau 
ms.custom: devx-track-azurepowershell, references_regions
# Customer intent: "As a cloud administrator, I want to deploy Azure Firewall across multiple Availability Zones, so that I can ensure high availability and enhance the reliability of my network security infrastructure."
---

# Deploy an Azure Firewall with availability zones

## What are availability zones

**Availability zones (AZs)** are physically separate datacenters within an Azure region, each with independent power, cooling, and networking. Availability zones isolate infrastructure failures and improve the resiliency and availability of applications.

A **region** that supports availability zones typically has three distinct zones (for example, Zone 1, Zone 2, and Zone 3). Not all Azure regions support availability zones.
For Azure Firewall, availability zones determine how firewall instances are placed within a region and how resilient the firewall is to zonal failures. 

## Zone redundancy

Azure Firewall uses a **Zone-redundant-by-default** deployment model to improve resiliency, availability, and protection against zonal failures.

For new deployments, **don't specify availability zones for the firewall**. Azure manages backend zone allocation across multiple availability zones in regions where the default is available. You don't need to choose zone identifiers to get zone redundancy.

- New firewalls with no specified zones are zone redundant by default in the [ZR compatible regions](#zr-compatible-regions).
- Existing non-zone-redundant firewalls, including firewalls with an explicitly specified single zone, are platform-migrated in regions that support multiple availability zones.
- Migration is complete in the listed regions. Other regions are enabled as the migration progresses.
- You don't need to deallocate, redeploy, or change the firewall's zone settings to receive the automatic migration.

## Definitions

Azure Firewall deployment options fall into the following categories. 

| Deployment type | Description |
| --- | --- |
| **Zone Redundant (ZR)** | Firewall is deployed across multiple availability zones (two or more). |
| **Zonal (single zone)** | Firewall configured with a single zone (for example, Zone 1 only). |
| **Regional (no zones)** | Firewall configured to no zones. |

Some regions don't support availability zones. In those regions, Azure Firewall continues to deploy as a regional resource.

## Platform migration of existing firewalls

Azure Firewall migrates existing non-zone-redundant firewalls to become zone redundant in regions that support multiple availability zones:
- Migration is automatic and transparent.
- No downtime or administrator action is required.

### ZR compatible regions

As of October 9, 2026, migration is complete and zone redundancy by default is available in the following regions.

| Cloud | Region identifier |
| --- | --- |
| Azure public | `eastus2` |
| Azure public | `eastus` |
| Azure public | `japaneast` |
| Azure public | `australiaeast` |
| Azure public | `canadacentral` |
| Azure public | `westus2` |
| Azure public | `centralus` |
| Azure public | `westeurope` |
| Azure public | `northeurope` |
| Azure public | `southcentralus` |
| Azure public | `francecentral` |
| Azure public | `centralindia` |
| Azure public | `koreacentral` |
| Azure public | `southeastasia` |
| Azure public | `germanywestcentral` |
| Azure public | `uksouth` |
| Azure public | `swedencentral` |
| Azure public | `uaenorth` |
| Azure public | `switzerlandnorth` |
| Azure public | `southafricanorth` |
| Azure public | `eastasia` |
| Azure public | `brazilsouth` |
| Azure public | `westus3` |
| Azure public | `israelcentral` |
| Azure public | `polandcentral` |
| Azure public | `norwayeast` |
| Azure public | `italynorth` |
| Azure public | `spaincentral` |
| Azure public | `qatarcentral` |
| Azure public | `mexicocentral` |
| Azure public | `newzealandnorth` |
| Azure public | `indonesiacentral` |
| Azure public (EUAP) | `centraluseuap` |
| Azure public (EUAP) | `eastus2euap` |
| Azure China | `chinanorth3` |
| Azure Government | `usgovvirginia` |

EUAP regions have restricted access. Use a region available to your subscription in the appropriate Azure cloud.

## Understanding zone properties after migration

After migration:
- For backward compatibility, migration status (that is, updated zone configuration) doesn't immediately appear in ARM template, JSON, or Azure Resource Graph (ARG) properties.
- The firewall is still zone redundant at the backend.
- The platform infrastructure manages zone redundancy independently of the ARM template properties.


## Configure availability zones in Azure Firewall

For the recommended deployment path, omit firewall zone settings and let Azure manage allocation. Choose a [ZR compatible region](#zr-compatible-regions) when you require zone redundancy by default. 

### Using Azure portal

- The Azure portal doesn't require you to select specific availability zones when creating a new firewall. In ZR compatible regions, Azure manages zone-redundant placement by default.

### Using APIs

- Omit the firewall's `zones` property in API requests, ARM templates, Bicep, and Terraform configurations. In compatible regions, Azure manages zone redundancy at the backend.
- Don't add explicit zones to existing configurations solely to obtain zone redundancy. Eligible existing firewalls are migrated automatically.

### Using Azure PowerShell

The following example creates a firewall without passing `-Zone` to `New-AzFirewall`. Azure manages the firewall's backend zone allocation in East US, a ZR compatible region.

When you create a standard public IP address without specifying a zone, it's configured as zone-redundant by default. Standard public IP addresses can be associated with all zones or a single zone.

```azurepowershell
$rgName = "Test-FW-RG"

$vnet = Get-AzVirtualNetwork `
  -Name "Test-FW-VN" `
  -ResourceGroupName $rgName

$pip1 = New-AzPublicIpAddress `
  -Name "AzFwPublicIp1" `
  -ResourceGroupName "Test-FW-RG" `
  -Sku "Standard" `
  -Location "eastus" `
  -AllocationMethod Static `
  -Zone 1,2,3

New-AzFirewall `
  -Name "azFw" `
  -ResourceGroupName $rgName `
  -Location "eastus" `
  -VirtualNetwork $vnet `
  -PublicIpAddress @($pip1)
```

### Limitations

- Zone redundancy requires a region that supports multiple availability zones. In regions without availability zones, Azure Firewall remains a regional resource.
- Regional capacity restrictions can affect deployment. Omitting zones doesn't bypass capacity restrictions. Review deployment errors and the [Azure Firewall known issues](firewall-known-issues.md) before changing your configuration.
- Portal and resource zone properties don't necessarily display platform-managed backend placement. For more information, see [Understanding zone properties after migration](#understanding-zone-properties-after-migration).


## Service level agreements (SLA)

- When you deploy Azure Firewall as zone redundant (two or more Availability Zones), you get a **99.99%** uptime SLA.
- A **99.95%** uptime SLA applies to regional deployments in regions that don't support Availability Zones.

For more information, see the Azure Firewall [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/azure-firewall/v1_0/) and [Azure Firewall features by SKU](features-by-sku.md#built-in-high-availability-and-availability-zones).


## Next steps

- [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
