---
title: Discovery methods in Azure Migrate 
description: Azure Migrate offers modes for discovering resources
ms.topic: concept-article
author: habibaum
ms.author: v-uhabiba
ms.manager: molir
ms.service: azure-migrate
ms.date: 10/21/2025
ms.custom: engagement-fy24
---

# Discovery methods in Azure Migrate 

This article explains the different discovery methods in Azure Migrate and gives guidance to choose the most suitable approach based on your requirements.
 
## Prerequisites

Before you begin, ensure you create an Azure Migrate project by following the steps in [Quickstart: Create an Azure Migrate project using portal](quickstart-create-project.md).

## Appliance-based discovery

The appliance-based discovery method involves deploying a virtual appliance that scans your environment to collect metadata about resources. This approach is ideal for scenarios where detailed, automated, and continuous discovery are required. 

### Key features

- Continuous collection of configuration and performance data.  
- Supports discovering workloads such as SQL databases, webapps, PostgreSQL and MySQL. 
- Discover software inventory and enable dependency analysis.  

### Guidance to choose the right appliance

**VMware environments**: For VMware-based infrastructures, we recommend to [deploy VMware stack of Azure Migrate appliance](tutorial-discover-vmware.md). This appliance also supports agentless migrations.

**Hyper-V environments**: For Hyper-V environments, we recommend to [deploy Hyper-V stack of Azure Migrate appliance](tutorial-discover-hyper-v.md). Also, download the [Hyper-V replication provider](tutorial-migrate-hyper-v.md) to migrate Hyper-V servers.  

**Physical & public Cloud servers**: To discover and assess physical servers and servers running in any public cloud, we recommend setting up a [physical stack of appliance](tutorial-discover-physical.md). To migrate physical servers, install a secondary [replication appliance](tutorial-migrate-physical-virtual-machines.md).

## Supported workloads for appliance-based discovery 

Ensure that software inventory is enabled before initiating workload discovery. Azure Migrate supports the following workloads with appliance-based discovery:

- Discovery of SQL Server instances and databases.
- Discovery of ASP.NET web apps.
- Discovery of MySQL database instances.
- Discovery of PostgreSQL instances and databases.

## Import-based discovery 

Import-based discovery is a simpler and faster alternative, relying on manual upload of inventory data in a structured format.  

### Key features

- Manual data entry via CSV file uploads. 
- Add output inventory from CMDB tools to CSV templates. 
- Supports VMware inventory exported from RVTools XLSX file. 
- Build a quick business case using the servers discovered via import. 

## Arc-based discovery (Preview)

If you have already Arc-enabled your servers and SQL Server instances, Arc-based discovery provides a simple alternative that doesn't require any additional on-premises deployments. To use Arc-based discovery, you must [create a new Azure Migrate project from Arc Center](quickstart-evaluate-readiness-savings-for-arc-resources.md). 

### Key features

- Azure Migrate integrates natively with Azure Arc and requires no additional on-premises deployments to get started.
- Scope Arc resources by subscription into the project.
- Azure Migrate automatically generates default business case and assessments, typically within an hour.
- Collect additional information (utilization history) using the Azure Migrate Collector VM extension. 

Learn more about [Arc-based discovery (Preview)](concepts-arc-resource-discovery.md).

## Next steps

- Learn more about [Appliance requirements](migrate-appliance.md).  
- Learn more about creating a [business case using import](tutorial-discover-import.md).
- Learn more about [Arc-based discovery for migration](concepts-arc-resource-discovery.md).