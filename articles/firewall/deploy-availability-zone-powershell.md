---
title: Deploy Azure Firewall with Availability Zones
description: In this article, you learn how to deploy an Azure Firewall with Availability Zones. 
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 12/05/2025
ms.author: duau 
ms.custom: devx-track-azurepowershell
# Customer intent: "As a cloud administrator, I want to deploy Azure Firewall across multiple Availability Zones, so that I can ensure high availability and enhance the reliability of my network security infrastructure."
---

# Deploy an Azure Firewall with availability zones

## What are availability zones

**Availability zones (AZs)** are physically separate datacenters within an Azure region, each with independent power, cooling, and networking. Availability zones isolate infrastructure failures and improve the resiliency and availability of applications.

A **region** that supports availability zones typically has three distinct zones (for example, Zone 1, Zone 2, and Zone 3). Not all Azure regions support availability zones.
For Azure Firewall, availability zones determine how firewall instances are placed within a region and how resilient the firewall is to zonal failures. 

## Zone redundancy

Azure Firewall uses a **Zone-redundant-by-default** deployment model to improve resiliency, availability, and protection against zonal failures.

Current behavior:
- **All new Azure Firewall deployments that don't explicitly specify zones (that is, set to None)** are zone redundant by default in regions that support availability zones.
- **All existing firewalls without a specified zone (that is, set to None)** are being platform-migrated to become zone redundant (ZR).
- **All existing firewalls deployed in a single zone** aren't migrated at this time.
- You don't need to take any administrator action to migrate.  

## Definitions

Azure Firewall deployment options fall into the following categories. 

| Deployment type | Description |
| --- | --- |
| **Zone Redundant (ZR)** | Firewall is deployed across multiple availability zones (two or more). |
| **Zonal (single zone)** | Firewall deployed into a single zone (for example, Zone 1 only). |
| **Regional (no zones)** | Firewall deployed to no zones. The platform automatically migrates these firewalls to zone redundant. |

Some regions don't support availability zones. In those regions, Azure Firewall continues to deploy as a regional resource.

## Platform migration of existing firewalls

Azure Firewall is actively migrating existing non-ZR firewalls to become zone redundant:
- Migration is automatic and transparent.
- No downtime or administrator action is required.

## Understanding zone properties after migration

After migration:
- For backward compatibility, migration status (that is, updated zone configuration) doesn't immediately appear in ARM template, JSON, or Azure Resource Group (ARG) properties.
- The firewall is still zone redundant at the backend.
- The platform infrastructure manages zone redundancy independently of the ARM template properties.

## Configure availability zones in Azure Firewall

You can configure Azure Firewall to use availability zones during deployment to enhance availability and reliability. Use the Azure portal, Azure PowerShell, or other deployment methods to set this configuration.

### Using Azure portal

- By default, the Azure portal doesn't provide an option to select specific Availability Zones when creating a new Azure Firewall. Azure Firewall is deployed as Zone Redundant by default, adhering to zone redundancy requirements.

### Using APIs

- Don't specify any zones during deployment. The backend automatically configures the firewall as Zone Redundant by default.
- If you provide specific zones during deployment via API, the specified zones are honored.

### Using Azure PowerShell

You can configure Availability Zones by using Azure PowerShell. The following example demonstrates how to create a firewall in zones 1, 2, and 3.

When you create a standard public IP address without specifying a zone, it's configured as zone-redundant by default. Standard public IP addresses can be associated with all zones or a single zone.

A firewall can't be deployed in one zone while its public IP address is in another zone. However, you can deploy a firewall in a specific zone and associate it with a zone-redundant public IP address, or deploy both the firewall and the public IP address in the same zone for proximity purposes.

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
  -PublicIpAddress @($pip1) `
  -Zone 1,2,3
```

### Limitations

- Azure Firewall with Availability Zones is supported only in regions that offer Availability Zones.
- In regions with zonal restrictions due to capacity constraints, deploying a Zone Redundant Firewall fails. In such cases, you can deploy the firewall in a single zone or in available zones to proceed with the deployment.
- Zonal Restrictions are documented in the [Azure Firewall known issues](firewall-known-issues.md) page. 

By configuring Availability Zones, you can achieve higher availability and ensure your network security infrastructure is more resilient. 

## Service level agreements (SLA)

- When you deploy Azure Firewall as zone redundant (two or more Availability Zones), you get a **99.99%** uptime SLA.
- A **99.95%** uptime SLA applies to regional deployments in regions that don't support Availability Zones.

For more information, see the Azure Firewall [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/azure-firewall/v1_0/) and [Azure Firewall features by SKU](features-by-sku.md#built-in-high-availability-and-availability-zones).


## Next steps

- [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
