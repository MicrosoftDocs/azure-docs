---
title: Discovery methods in Azure Migrate
description: Learn about the discovery methods in Azure Migrate, including appliance, collector, import, and Arc-based discovery, and choose the approach that best fits your requirements.
ms.topic: concept-article
author: Jeronika-MS
ms.author: v-gajeronika
ms.manager: molir
ms.service: azure-migrate
ms.date: 11/10/2026
ms.update-cycle: 1095-days
ms.custom: engagement-fy24
---

# Discovery methods in Azure Migrate

Azure Migrate supports the following modes of discovery:

- Discovery using the appliance
- Discovery using the collector
- Discovery using import, either from the Azure Migrate CSV template and RVTools, or from your own inventory exports (preview)
- Discovery of Arc-enabled servers and SQL Server instances (preview)

This article explains the different discovery methods in Azure Migrate and gives guidance to help you choose the most suitable approach for your requirements.

## Choose a discovery method

Use the following table to decide which discovery method to use.

| Capability | Azure Migrate appliance | Azure Migrate collector | Import (CSV template or RVTools) | Import inventory exports (preview) |
| --- | --- | --- | --- | --- |
| Description | Continuous discovery of your IT estate to generate lift and shift or modernize TCO benchmark reports, map server dependencies, and run migrations. | Quick offline snapshot of your IT estate to generate lift and shift or modernize TCO benchmark reports. | Upload inventory by using the CSV template or an RVTools export to generate lift and shift TCO benchmark reports. | Upload exports from your CMDB or tools such as ServiceNow, Dynatrace, or Ansible in their original format. AI maps the data to the Azure Migrate inventory to generate lift and shift or modernize TCO benchmark reports. |
| Mode of discovery | Continuous data collection | One-time data collection; you manually upload the collected data to Azure | Upload preexisting inventory files | Upload preexisting inventory exports, with an optional context file |
| Time to discover | Requires setup time | Quick to set up | Instant (reuse existing inventory data) | Quick (reuse existing exports, then review the AI-generated proposal) |
| Assessment types | Lift and shift, Modernize | Lift and shift, Modernize | Lift and shift | Lift and shift, Modernize |
| Performance-based assessment | Yes | Yes | No | Yes, when the exports include performance data |
| Guest discovery (installed software, security insights, database instances) | Yes | Yes | No | No |
| Security insights | Yes | Yes | No | No |
| Workload discovery (web apps, SQL, PostgreSQL, MySQL, MongoDB) | Yes | Yes | No | Databases and web apps, when the source data includes them |
| Hypervisor support | VMware, Hyper-V, Physical (hypervisor-agnostic) | VMware, Physical (hypervisor-agnostic) | CSV (hypervisor-agnostic), RVTools (VMware) | Hypervisor-agnostic |
| Migration execution | Yes | No | No | No |
| Identify server dependencies | Yes | No | No | No |
| Connectivity | Requires Azure connection for discovery | Offline discovery | Not applicable | Not applicable |

## Appliance-based discovery

The appliance-based discovery method involves deploying a virtual appliance that scans your environment to collect metadata about resources. This approach is ideal for scenarios where detailed, automated, and continuous discovery is required.

### Key features

- Continuous collection of configuration data.
- Real-time collection of performance data.
- Supports discovering workloads such as SQL databases, web apps, PostgreSQL, MySQL, and MongoDB.
- Discovers software inventory and enables dependency analysis.

### Guidance to choose the right appliance

- **VMware environments**: For VMware-based infrastructures, [deploy the VMware stack of the Azure Migrate appliance](tutorial-discover-vmware.md). This appliance also supports agentless migrations.
- **Hyper-V environments**: For Hyper-V environments, [deploy the Hyper-V stack of the Azure Migrate appliance](tutorial-discover-hyper-v.md). Also, download the [Hyper-V replication provider](tutorial-migrate-hyper-v.md) to migrate Hyper-V servers.
- **Physical and public cloud servers**: To discover and assess physical servers and servers running in any public cloud, [set up the physical stack of the appliance](tutorial-discover-physical.md). To migrate physical servers, install a secondary [replication appliance](tutorial-migrate-physical-virtual-machines.md).

### Supported workloads for appliance-based discovery

Ensure that software inventory is enabled before you start workload discovery. Azure Migrate supports the following workloads with appliance-based discovery:

- Discovery of SQL Server instances and databases.
- Discovery of ASP.NET web apps.
- Discovery of MySQL database instances.
- Discovery of MongoDB database instances.
- Discovery of PostgreSQL instances and databases.

## Collector-based discovery

The Azure Migrate collector enables offline discovery of your IT estate. By using this lightweight tool, you can collect server configuration, performance, software inventory, and workload metadata without requiring connectivity to Azure during discovery. You can securely upload the collected data back to the Azure Migrate project you created.

This approach is ideal for scenarios where quick discovery of your IT estate is required. It supports the discovery of VMware environments and physical or virtual servers in a hypervisor-agnostic approach.

For step-by-step instructions, see [Discover using Azure Migrate collector](how-to-discover-using-collector.md).

### Key features

- Captures a one-time snapshot of server configuration data.
- Collects historical performance data.
- Discovers installed software.
- Discovers workloads such as SQL Server, web apps, PostgreSQL, MySQL, and MongoDB.

## Import-based discovery

Import-based discovery is a simpler and faster alternative that uses inventory data you already have. You don't deploy an appliance or collector. In your Azure Migrate project, select **Start discovery** > **Using file import**, and then choose one of the following import types.

### Import by using the CSV template or RVTools

Upload inventory data in a structured format.

#### Key features

- Manual data entry through CSV file uploads.
- Add inventory output from CMDB tools by using the provided CSV templates.
- Import VMware inventory exported from RVTools.
- Build a quick business case by using the servers discovered through import.

### Import inventory exports with AI (preview)

Upload exports from your CMDB or from tools such as ServiceNow, Dynatrace, or Ansible, without reformatting them to fit a template. Azure Migrate uses AI to analyze your files and generate a proposed inventory, which you review and correct before you save it to your project.

This approach is ideal when your inventory already exists in other tools, or when your organization prefers discovery without installing tools, running automated scans, or sharing credentials to on-premises servers.

For step-by-step instructions, see [Discover servers and workloads by importing inventory exports](how-to-import-inventory-exports-file-import.md).

#### Key features

- Upload exports in their original structure as .csv, .xlsx, or .json files, individually or in a ZIP file, up to 500 MB per upload.
- Add an optional context file to explain custom columns, units, matching rules, and records to exclude.
- Interpret multiple exports together, and link and merge records that refer to the same host.
- Discover servers, and also databases and web apps when the source data includes them.
- Review the AI-generated proposal before saving, and correct it by editing downloadable review files or by using Copilot.
- Add more imports to the same project later. Each saved import adds to the project inventory instead of replacing it.

> [!NOTE]
> Imported data is a point-in-time snapshot of what your exports contain. If your exports include performance data, such as CPU or memory utilization, Azure Migrate reads it as part of the import. For continuous discovery, real-time performance collection, or server dependencies, use the appliance. For installed software, use the appliance or the collector. You can add either method to the same project later.

## Arc-based discovery (preview)

If you already Arc-enabled your servers and SQL Server instances, Arc-based discovery provides a simple alternative that doesn't require any additional on-premises deployments. To use Arc-based discovery, you must [create a new Azure Migrate project from Arc Center](quickstart-evaluate-readiness-savings-for-arc-resources.md).

### Key features

- Azure Migrate integrates natively with Azure Arc and requires no additional on-premises deployments to get started.
- Scope Arc resources by subscription into the project.
- Azure Migrate automatically generates a default business case and assessments, typically within an hour.
- Collect additional information, such as utilization history, by using the Azure Migrate collector VM extension.

Learn more about [Arc-based discovery (preview)](concepts-arc-resource-discovery.md).

## Next steps

- Learn more about [appliance requirements](migrate-appliance.md).
- Learn more about [creating a business case by using import](tutorial-discover-import.md).
- Learn how to [discover servers and workloads by importing inventory exports](how-to-import-inventory-exports-file-import.md).
- Learn more about [Arc-based discovery for migration](concepts-arc-resource-discovery.md).