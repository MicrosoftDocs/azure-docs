---
title: Discovery methods in Azure Migrate 
description: Azure Migrate offers modes for discovering resources
ms.topic: conceptual
author: habibaum
ms.author: v-uhabiba
ms.manager: molir
ms.service: azure-migrate
ms.date: 05/28/2025
ms.custom: engagement-fy24
---

# Discovery methods in Azure Migrate 

This article explains the different discovery methods in Azure Migrate and gives guidance to choose the most suitable approach based on your requirements.
 

## Prerequisites

Before you begin, make sure you create an Azure Migrate project by following the steps in [Quickstart: Create an Azure Migrate project using portal](quickstart-create-project.md)

## Appliance-based discovery

The appliance-based discovery method involves deploying a virtual appliance that scans your environment to collect metadata about resources. This approach is ideal for scenarios where detailed, automated, and continuous discovery are required. 

**Key features**: 

- Continuous collection of configuration and performance data.  
- Supports discovering workloads such as SQL databases, webapps, and MySQL. 
- Discover software inventory and enable dependency analysis.  

## Guidance to choose the right appliance

**VMware environments**: For VMware-based infrastructures, we recommend to [deploy VMware stack of Azure Migrate appliance](tutorial-discover-vmware.md). This appliance also supports agentless migrations.

**Hyper-V environments**: For Hyper-V environments, we recommend to [deploy Hyper-V stack of Azure Migrate appliance](tutorial-discover-vmware.md). Also, download the [Hyper-V replication provider](tutorial-migrate-hyper-v.md) to migrate Hyper-V servers.  

**Physical & public Cloud servers**: To discover and assess physical servers and servers running in any public cloud, we recommend setting up a [physical stack of appliance](tutorial-discover-physical.md). To migrate physical servers, install a secondary [replication appliance](tutorial-migrate-physical-virtual-machines.md).

## Import-based discovery 

Import-based discovery is a simpler and faster alternative, relying on manual upload of inventory data in a structured format.  

**Key features**: 

- Manual data entry via CSV file uploads. 
- Add output inventory from CMDB tools to CSV templates. 
- Supports VMware inventory exported from RVTools XLSX file. 
- Build a quick business case using the servers discovered via import. 


## Supported workloads for discovery 

Ensure that software inventory is enabled before initiating workload discovery. Azure Migrate supports the following workloads: 

- Discovery of SQL Server instances and databases. 
- Discovery of ASP.NET web apps. 
- Discovery of MySQL database instances. 


## Next steps

- Learn more about [Appliance requirements](migrate-appliance.md).  
- Learn more about creating a [business case using import](tutorial-discover-import.md).