---
title: Overview of Arc-based discovery in Azure Migrate (preview)
description: Learn how Azure Migrate discovers Azure Arc resources to simplify migration planning for Arc customers.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 10/23/2025
ms.custom: engagement-fy25
monikerRange: migrate
---

# Overview of Arc-based discovery in Azure Migrate (preview)

This article provides an overview of how Azure Migrate works with [Azure Arc-enabled servers](/azure/azure-arc/servers/overview) and [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview) to assess your on-premises resources for migration to Azure.

If you have already Arc-enabled your on-premises servers and SQL Server instances, Azure Migrate can use this existing infrastructure to discover, assess, and build a business case for migration without requiring any other on-premises deployments. This approach helps accelerate migration planning and reduces deployment complexity. 

> [!IMPORTANT]
> This feature is currently in preview. As a preview feature, the capabilities presented in this article are subject to [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What is Arc-based discovery?

Arc-based discovery is a discovery method in Azure Migrate that uses your existing Azure Arc infrastructure to automatically discover and assess Arc-enabled resources for migration to Azure. Unlike appliance-based discovery, Arc-based discovery requires no other on-premises deployments and uses native integration between Azure Migrate and Azure Arc.

### Key benefits

- **No additional on-premises infrastructure**: Uses your existing Arc-enabled servers and SQL Server instances.
- **Fast time to insights**: Azure Migrate automatically generates default business cases and assessments, typically within an hour.
- **Subscription-based scoping**: Select one or more subscriptions containing Arc resources to include in your project.
- **Optional performance data collection**: Install the Azure Migrate Collector VM extension to collect performance history for right-sized assessments.

## Supported Arc resource types

Azure Migrate supports discovery and assessment of the following Arc-enabled resource types:

| Resource Type | Assessment Support | Details |
|---------------|-------------------|---------|
| **Arc-enabled servers** | ✅ Supported | Windows and Linux servers running Arc connected machine agent version 1.46 or higher |
| **Arc-enabled SQL Server** | ✅ Supported | SQL Server instances managed by Azure Arc. [Migration assessment](/sql/sql-server/azure-arc/migration-assessment) must be enabled to get rightsizing and SQL MI and Azure SQL DB recommendations. |

## How Arc-based discovery works

Arc-based discovery uses data already collected by Azure Arc Connected Machine Agent and Azure Arc SQL extension to accelerate migration decision making and planning for Azure Arc customers. It collects additional data using the Azure Migrate Collector VM extension for Arc servers. 

### Discovery process
Discovery process is as simple as creating a project and scoping Arc resources into the project. 

1. **Create an Azure Migrate project**: Create a project from Azure Arc Center and select subscriptions that contain Arc resources. Arc-based discovery currently only works with new projects.

2. **Data sync**: When you create a project with Arc resources, Azure Migrate syncs a snapshot of metadata from your Arc-enabled resources in the selected subscriptions. This includes:
   - Server configuration (CPU, memory, disk, network)
   - Operating system information
   - Hypervisor information
   - SQL Server instance and database information

3. **Default artifacts generation**: After the sync completes, Azure Migrate automatically generates:
   - Two default business cases (modernize preference and minimize migration time preference)
   - One default assessment covering all workloads (servers and SQL Servers)

4. **Optional performance collection**: Install the Azure Migrate Collector VM extension on Arc-enabled servers to collect:
   - CPU and memory utilization over time
   - Disk IOPS and throughput
   - Network utilization

### Data storage

The Azure Migrate project stores metadata about your Arc resources in the region you select during project creation, regardless of where the Arc-enabled servers are located. 

### Trigger a sync

To keep data current, you can manually trigger a sync at any time from the Azure Arc Center. This is useful when:
- New Arc-enabled servers or Arc-enabled SQL Server instances are added to/removed from subscriptions in scope
- Configuration of the server itself changes

### Automatic sync
Automatic sync configures your Azure Migrate project to periodically sync Arc resource data without manual intervention. This ensures your assessments and business cases always reflect current infrastructure state.

Automatic sync uses the Azure Migrate project's managed identity to read Arc resource data. Ensure that the managed identity has the **Migrate Arc Discovery Reader - Preview** role on the subscriptions in scope. 

## Project scope management

Unlike appliance-based discovery that discovers resources in a specific datacenter, Arc-based discovery is scoped by Azure subscriptions. When creating a project:

- Select one or more subscriptions containing Arc resources
- Only Arc-enabled servers with agent version 1.46 or higher are included
- Currently, only VMware or Hyper-V VMs are included
- Subscriptions must have the `Microsoft.OffAzure` resource provider registered

You can edit the scope at any time to add or remove subscriptions. Based on the sync type, either the user (for manual sync) or the managed identity (for automatic sync) must have the **Migrate Arc Discovery Reader - Preview** role. 

## Assessment types

Arc-based discovery supports the same assessment types as other discovery methods:

### Application assessments
Assess multiple workload types together (servers and SQL Servers) as part of a single application. This provides a holistic view of migration readiness and costs.

### Workload-specific assessments
Create separate assessments for:
- **Azure VM assessments**: For Arc-enabled servers
- **Azure SQL assessments**: For Arc-enabled SQL Server instances

All assessments evaluate:
- **Migration readiness**: Whether resources are suitable for migration to Azure.
- **Right-sized targets**: Recommended Azure SKUs based on configuration and optionally performance data.
- **Cost estimates**: Monthly Azure resource costs in the target region.

## Business case

When you create an Azure Migrate project with Arc resources, two default business cases are automatically generated:

### Default business cases

- **Modernize strategy** (`default-modernize`): Evaluates migration using Platform-as-a-Service (PaaS) options where possible, such as:
   - Azure SQL Database or Azure SQL Managed Instance for SQL workloads
   - Azure App Service for web applications
   - Azure VMs when PaaS isn't suitable

- **Minimize migration time** (`default-faster-mgn-az-vm`): Evaluates Infrastructure-as-a-Service (IaaS) lift-and-shift migration to Azure VMs for all workloads.

Both business cases calculate:
- Estimated cost savings compared to on-premises
- Total cost of ownership (TCO) in Azure
- Return on investment (ROI) timeline

You can create custom business cases with different settings or scoped to specific resources. For more information, see [Build a business case](how-to-build-a-business-case.md).

## Performance-based vs. as-on-premises sizing

Arc-based discovery supports two sizing approaches:

### As-on-premises sizing
- Recommendations are based on the current on-premises server configuration.
- No performance data collection required.
- Assumes peak capacity utilization.
- Might result in larger Azure SKUs than necessary.

### Performance-based sizing (requires VM extension)
- Recommendations are based on actual resource utilization over time.
- Requires the installation of Azure Migrate Collector VM extension.
- Uses performance history to determine optimal SKUs.
- Typically results in cost savings through right-sizing.

To enable performance-based sizing:
1. Install the Azure Migrate Collector VM extension on Arc-enabled servers
2. Wait for performance data collection (recommended: at least a day)
3. Create or recalculate assessments with performance-based sizing

> [!NOTE]
> The default assessment and business cases are always created with performance-based sizing. This is to ensure once you start performance data collection, you only need to recalculate them.

Learn more about [installing the Azure Migrate Collector VM extension](how-to-enable-additional-data-collection-for-arc-servers.md).

## Azure Migrate Collector VM extension

The Azure Migrate Collector VM extension is an optional component that provides enhanced assessment capabilities. 

### What it collects
- CPU utilization percentages over time
- Memory utilization percentages over time  
- Disk IOPS (read and write operations)
- Disk throughput (MB/s read and write)
- Network utilization

### Installation options
- **Single server**: Use Azure portal or Azure CLI commands.
- **At scale**: Use Azure Policy to deploy across all Arc-enabled servers in selected subscriptions.

### Requirements
- You need **Hybrid Server Resource Administrator** role on Arc-enabled server resources to install the extension.
- Ensure network connectivity from the server to Azure Migrate endpoint - ```https://*.migration.windowsazure.com```

For detailed installation instructions, see [Install Azure Migrate Collector VM extension](how-to-enable-additional-data-collection-for-arc-servers.md).

## Current limitations

During the preview, the following limitations apply:

- **Software Inventory**: Not available for Arc-discovered servers.
- **Dependency analysis**:  Not available for Arc-discovered servers.
- **Web app discovery**: Web apps aren't discovered through Arc-based discovery.
- **PostgreSQL/MySQL discovery**: PostgreSQL and MySQL databases aren't discovered through Arc-based discovery. 


## Next steps

- [Evaluate readiness and identify savings of migrating your Arc enabled servers to Azure](quickstart-evaluate-readiness-savings-for-arc-resources.md)
- [Enable additional data collection for more accurate migration planning](how-to-enable-additional-data-collection-for-arc-servers.md)
- [Manage the sync of Arc resource data into Azure Migrate project](how-to-manage-arc-resource-sync.md)
- [Build a business case](how-to-build-a-business-case.md)
- [Create an application assessment](create-application-assessment.md)