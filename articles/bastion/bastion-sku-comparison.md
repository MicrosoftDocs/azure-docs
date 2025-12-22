---
title: Choose the right Azure Bastion SKU to meet your needs
description: Learn about the different Azure Bastion SKU tiers and choose the right one for your requirements.
author: abell
ms.author: abell
ms.service: azure-bastion
ms.topic: concept-article
ms.date: 11/24/2025
# Customer intent: As a cloud administrator, I want to compare Azure Bastion SKU tiers and understand their features, so that I can select the appropriate tier for my organization's secure remote access requirements.
---

# Choose the right Azure Bastion SKU to meet your needs

Azure Bastion offers four SKU tiers: **Developer**, **Basic**, **Standard**, and **Premium**.

For detailed information about all Azure Bastion features and configuration settings, see [About Bastion configuration settings](configuration-settings.md).

## Feature comparison

Compare the features across all four Azure Bastion SKU tiers:

| Category | Feature | Developer | Basic | Standard | Premium |
| --- | --- | --- | --- | --- | --- |
| **Deployment & Requirements** | Requires AzureBastionSubnet¹ | No | Yes | Yes | Yes |
|  | Requires Public IP address¹ | No | Yes | Yes | No² |
|  | Dedicated bastion host | No³ | Yes | Yes | Yes |
|  | Availability zones | Yes⁴ | Yes | Yes | Yes |
|  | Virtual network peering support | No | Yes | Yes | Yes |
| **VM Connectivity** | Connect to VMs in same virtual network | Yes | Yes | Yes | Yes |
|  | Connect to VMs in peered virtual networks | No | Yes | Yes | Yes |
|  | Support for concurrent connections | No | Yes | Yes | Yes |
|  | Connect to Linux VM using SSH | Yes | Yes | Yes | Yes |
|  | Connect to Windows VM using RDP | Yes | Yes | Yes | Yes |
|  | Connect to Linux VM using RDP | No | No | Yes | Yes |
|  | Connect to Windows VM using SSH | No | No | Yes | Yes |
| **Authentication & Security** | Access Linux VM Private Keys in Azure Key Vault | Yes | Yes | Yes | Yes |
|  | Kerberos authentication | Yes | Yes | Yes | Yes |
|  | Session recording | No | No | No | Yes |
|  | Private-only deployment (no public IP) | No | No | No | Yes |
| **Connection Methods & Protocols** | Azure portal based connections | Yes | Yes | Yes | Yes |
|  | Connect to VMs using Azure CLI (native client) | No | No | Yes | Yes |
|  | Specify custom inbound port | No | No | Yes | Yes |
|  | IP-Connect feature | No | No | Yes | Yes |
|  | Shareable link | No | No | Yes | Yes |
|  | Upload or download files (native client) | No | No | Yes | Yes |
| **User Experience** | VM audio output | Yes | Yes | Yes | Yes |
|  | Copy/paste (web-based clients) | Yes | Yes | Yes | Yes |
|  | Disable copy/paste (web-based clients) | No | No | Yes | Yes |
| **Cost** | Hourly charge | Free | Paid | Paid | Paid |
|  | Outbound data transfer charges | Free | Paid⁶ | Paid⁶ | Paid⁶ |

¹ For dedicated deployments (Basic, Standard, Premium), the AzureBastionSubnet must be /26 or larger (/25, /24, etc.). For more information, see [Azure Bastion subnet](configuration-settings.md#subnet).  
² Private-only deployment option doesn't require public IP address. For more information, see [Private-only deployment](private-only-deployment.md).  
³ Bastion Developer uses a shared resource and supports one VM connection at a time.  
⁴ Developer SKU supports availability zones in select regions. For more information, see [Reliability in Azure Bastion](../reliability/reliability-bastion.md).  
⁵ At maximum scale (50 instances). For more information, see [Instances and host scaling](configuration-settings.md#instance).  
⁶ First 5 GB per month is free. For more information, see [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion/).

## Performance and scalability

The following table shows the capacity and scaling characteristics of each SKU tier:

| Metric | Developer | Basic | Standard | Premium |
|--------|-----------|----------|---------|---------|
| **Deployment model** | Shared resource | Dedicated host | Dedicated host | Dedicated host |
| **Host scaling** | No | No | Yes (2-50 instances) | Yes (2-50 instances) |
| **Instance count** | N/A (shared) | 2 (fixed) | 2-50 (configurable) | 2-50 (configurable) |
| **Fixed instance count** | 1 VM at a time | 2 instances | Configurable | Configurable |
| **Concurrent VM connections** | 1 VM at a time | Multiple VMs | Multiple VMs | Multiple VMs |
| **Max concurrent RDP sessions⁵** | 1 | 40 (2 instances × 20) | 1,000 (50 instances × 20) | 1,000 (50 instances × 20) |
| **Max concurrent SSH sessions⁵** | 1 | 80 (2 instances × 40) | 2,000 (50 instances × 40) | 2,000 (50 instances × 40) |
| **Per instance capacity** | N/A | 20 RDP + 40 SSH | 20 RDP + 40 SSH | 20 RDP + 40 SSH |

## Regional availability

Azure Bastion SKU availability varies by region:

- **Developer SKU**: Available in select regions. For the current list of supported regions, see [Connect with Azure Bastion Developer](quickstart-developer.md).
- **Basic, Standard, Premium SKUs**: Available in all Azure regions where Azure Bastion is supported.

## Decision framework

Select an Azure Bastion SKU based on your requirements.

### Developer SKU

Developer SKU is available for development and test environments at no cost. Choose Developer SKU when:

- You're working in dev/test environments
- You don't require virtual network peering or concurrent connections
- You're operating in a [supported region](quickstart-developer.md)

> [!WARNING]
> Developer SKU isn't suitable for production workloads. It provides access to only one VM at a time and doesn't support virtual network peering.

### Basic SKU

Basic SKU provides dedicated deployment with fixed capacity. Choose Basic SKU when:

- You need dedicated production deployment
- Fixed capacity of two instances (40 RDP/80 SSH sessions) is sufficient
- You don't need advanced features (native client, shareable links, IP-based connections, custom ports, file transfer)

### Standard SKU

Standard SKU includes advanced features and configurable scaling. Choose Standard SKU when:

- You need advanced features (native client, shareable links, IP-based connections, custom ports, file transfer)
- You require host scaling (2-50 instances)
- You need high concurrency (up to 1,000 RDP or 2,000 SSH sessions at max scale)

### Premium SKU

Premium SKU includes all Standard features plus session recording and private-only deployment. Choose Premium SKU when:

- You require session recording for compliance or audit requirements
- You need private-only deployment (no public IP address)
- Compliance requirements mandate session audit trails

> [!TIP]
> The cost difference between Standard and Premium is marginal. Premium SKU is the recommended choice for production deployments.

## Upgrade considerations

Azure Bastion supports upgrading from lower SKUs to higher SKUs, but downgrading isn't supported.

### Upgrade paths

- **Developer to Basic/Standard/Premium**: Requires creating an AzureBastionSubnet (/26 or larger) and a public IP address (Standard SKU, Static allocation). See [Upgrade from Bastion Developer](upgrade-sku.md#upgrade-from-bastion-developer).
- **Basic and Higher**: Upgrade through the Azure portal. You can add features at the same time you upgrade. See [Upgrade from Basic or Standard SKU](upgrade-sku.md#upgrade-from-the-basic-or-standard-sku).

> [!IMPORTANT]
> Upgrades take approximately 10 minutes. Downgrading a SKU isn't supported. You must delete and recreate Azure Bastion. You can add features during the upgrade process.

For step-by-step upgrade instructions, see [View or upgrade a SKU](upgrade-sku.md).

## Pricing model

Azure Bastion pricing combines hourly SKU charges with outbound data transfer costs. Developer SKU is free. For dedicated SKUs (Basic, Standard, Premium), you pay hourly rates plus data transfer charges (first 5 GB/month free).

For detailed pricing information and cost optimization strategies, see [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion/) and [Azure Bastion cost optimization principles](cost-optimization.md).

## Next steps

- [Connect with Azure Bastion Developer](quickstart-developer.md)
- [Deploy Bastion with default settings (Standard SKU)](quickstart-host-portal.md)
- [Deploy Bastion using specified settings (Basic SKU or higher)](tutorial-create-host-portal.md)
- [About Bastion configuration settings](configuration-settings.md)
- [View or upgrade a SKU](upgrade-sku.md)
- [Configure host scaling](configure-host-scaling.md)
- [Configure session recording](session-recording.md)
- [Deploy private-only Bastion](private-only-deployment.md)
- [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion/)
