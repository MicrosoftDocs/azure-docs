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

# Deploy an Azure Firewall with Availability Zones

Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability.

This feature enables the following scenarios:

- You can increase availability to 99.99% uptime. For more information, see the Azure Firewall [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/azure-firewall/v1_0/). The 99.99% uptime SLA is offered when two or more Availability Zones are selected.
- You can also associate Azure Firewall to a specific zone just for proximity reasons, using the service standard 99.95% SLA.

For more information about Azure Firewall Availability Zones, see [Azure Firewall features by SKU](features-by-sku.md#built-in-high-availability-and-availability-zones).

## Configure Availability Zones in Azure Firewall

Azure Firewall can be configured to use Availability Zones during deployment to enhance availability and reliability. This configuration can be performed using the Azure portal, Azure PowerShell, or other deployment methods.

### Using Azure portal

- By default, the Azure portal does not provide an option to select specific Availability Zones when creating a new Azure Firewall. Azure Firewall is deployed as Zone Redundant by default, adhering to zone redundancy requirements.

### Using APIs

- It is recommended not to specify any zones during deployment, as the backend will automatically configure the firewall as Zone Redundant by default.
- If specific zones are provided during deployment via API, the specified zones will be honored.

### Using Azure PowerShell

You can configure Availability Zones using Azure PowerShell. The following example demonstrates how to create a firewall in zones 1, 2, and 3.

When a standard public IP address is created without specifying a zone, it is configured as zone-redundant by default. Standard public IP addresses can be associated with all zones or a single zone.

It is important to note that a firewall cannot be deployed in one zone while its public IP address is in another zone. However, you can deploy a firewall in a specific zone and associate it with a zone-redundant public IP address, or deploy both the firewall and the public IP address in the same zone for proximity purposes.

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
- In regions with zonal restrictions due to capacity constraints, deploying a Zone Redundant Firewall may fail. In such cases, you can deploy the firewall in a single zone or in available zones to proceed with the deployment.
- Zonal Restrictions are documented in the [Azure Firewall known issues](firewall-known-issues.md) page. 

By configuring Availability Zones, you can achieve higher availability and ensure your network security infrastructure is more resilient. 

## Next steps

- [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
