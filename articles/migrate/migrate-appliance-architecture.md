---
title: Azure Migrate appliance architecture
description: Provides an overview of the Azure Migrate appliance used in server discovery, assessment and migration.
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 03/18/2021
---


# Azure Migrate appliance architecture

This article describes the Azure Migrate appliance architecture and processes. The Azure Migrate appliance is a lightweight appliance that's deployed on premises, to discover servers for migration to Azure.

## Deployment scenarios

The Azure Migrate appliance is used in the following scenarios.

**Scenario** | **Tool** | **Used to**
--- | --- | ---
**Discovery and assessment of servers running in VMware environment** | Azure Migrate: Discovery and assessment | Discover servers running in your VMware environment<br/><br/> Perform discovery of installed software inventory, agentless dependency analysis and discover SQL Server instances and databases.<br/><br/> Collect server configuration and performance metadata for assessments.
**Agentless migration of servers running in VMware environment** | Azure Migrate:Server Migration | Discover servers running in your VMware environment.<br/><br/> Replicate servers without installing any agents on them.
**Discovery and assessment of servers running in Hyper-V environment** | Azure Migrate: Discovery and assessment | Discover servers running in your Hyper-V environment.<br/><br/> Collect server configuration and performance metadata for assessments.
**Discovery and assessment of physical or virtualized servers on-premises** |  Azure Migrate: Discovery and assessment |  Discover physical or virtualized servers on-premises.<br/><br/> Collect server configuration and performance metadata for assessments.

## Deployment methods

The appliance can be deployed using a couple of methods:

- The appliance can be deployed using a template for servers running in VMware or Hyper-V environment ([OVA template for VMware](how-to-set-up-appliance-vmware.md) or [VHD for Hyper-V](how-to-set-up-appliance-hyper-v.md)).
- If you don't want to use a template, you can deploy the appliance for VMware or Hyper-V environment using a [PowerShell installer script](deploy-appliance-script.md).
- In Azure Government, you should deploy the appliance using a PowerShell installer script. Refer to the steps of deployment [here](deploy-appliance-script-government.md).
- For physical or virtualized servers on-premises or any other cloud, you always deploy the appliance using a PowerShell installer script.Refer to the steps of deployment [here](how-to-set-up-appliance-physical.md).
- Download links are available in the tables below.

## Appliance services

The appliance has the following services:

- **Appliance configuration manager**: This is a web application which can be configured with source details to start the discovery and assessment of servers. 
- **Discovery agent**: The agent collects server configuration metadata which can be used to create as on-premises assessments.
- **Assessment agent**: The agent collects server performance metadata which can be used to create performance-based assessments.
- **Auto update service**: The service keeps all the agents running on the appliance up-to-date. It automatically runs once every 24 hours.
- **DRA agent**: Orchestrates server replication, and coordinates communication between replicated servers and Azure. Used only when replicating servers to Azure using agentless migration.
- **Gateway**: Sends replicated data to Azure. Used only when replicating servers to Azure using agentless migration.
- **SQL discovery and assessment agent**: sends the configuration and performance metadata of SQL Server instances and databases to Azure.

> [!Note]
> The last 3 services are only available in the appliance used for discovery and assessment of servers running in your VMware environment.<br/> Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. To try out this feature, use [**this link**](https://aka.ms/AzureMigrate/SQL) to create a project in **Australia East** region. If you already have a project in Australia East and want to try out this feature, please ensure that you have completed these [**prerequisites**](how-to-discover-sql-existing-project.md) on the portal.

## Discovery and collection process

:::image type="content" source="./media/migrate-appliance-architecture/architecture1.png" alt-text="Appliance architecture":::

The appliance communicates with the discovery sources using the following process.

**Process** | **VMware appliance** | **Hyper-V appliance** | **Physical appliance**
---|---|---|---
**Start discovery** | The appliance communicates with the vCenter server on TCP port 443 by default. If the vCenter server listens on a different port, you can configure it in the appliance configuration manager. | The appliance communicates with the Hyper-V hosts on WinRM port 5985 (HTTP). | The appliance communicates with Windows servers over WinRM port 5985 (HTTP) with Linux servers over port 22 (TCP).
**Gather configuration and performance metadata** | The appliance collects the metadata of servers running on vCenter Server using vSphere APIs by connecting on port 443 (default port) or any other port vCenter Server listens on. | The appliance collects the metadata of servers running on Hyper-V hosts using a Common Information Model (CIM) session with hosts on port 5985.| The appliance collects metadata from Windows servers using Common Information Model (CIM) session with servers on port 5985 and from Linux servers using SSH connectivity on port 22.
**Send discovery data** | The appliance sends the collected data to Azure Migrate: Discovery and assessment and Azure Migrate: Server Migration over SSL port 443.<br/><br/>  The appliance can connect to Azure over the internet or via ExpressRoute private peering or Microsoft peering circuits. | The appliance sends the collected data to Azure Migrate: Discovery and assessment over SSL port 443.<br/><br/> The appliance can connect to Azure over the internet or via ExpressRoute private peering or Microsoft peering circuits. | The appliance sends the collected data to Azure Migrate: Discovery and assessment over SSL port 443.<br/><br/> The appliance can connect to Azure over the internet or via ExpressRoute private peering or Microsoft peering circuits. 
**Data collection frequency** | Configuration metadata is collected and sent every 30 minutes. <br/><br/> Performance metadata is collected every 20 seconds and is aggregated to send a data point to Azure every 10 minutes. <br/><br/> Software inventory data is sent to Azure once every 12 hours. <br/><br/> Agentless dependency data is collected every 5 mins, aggregated on appliance and sent to Azure every 6 hours. <br/><br/> The SQL Server configuration data is updated once every 24 hours and the performance data is captured every 30 seconds.| Configuration metadata is collected and sent every 30 mins. <br/><br/> Performance metadata is collected every 30 seconds and is aggregated to send a data point to Azure every 10 minutes.|  Configuration metadata is collected and sent every 30 mins. <br/><br/> Performance metadata is collected every 5 minutes and is aggregated to send a data point to Azure every 10 minutes.
**Assess and migrate** | You can create assessments from the metadata collected by the appliance using Azure Migrate: Discovery and assessment tool.<br/><br/>In addition, you can also start migrating servers running in your VMware environment using Azure Migrate:  Server Migration tool to orchestrate agentless server replication.| You can create assessments from the metadata collected by the appliance using Azure Migrate: Discovery and assessment tool. | You can create assessments from the metadata collected by the appliance using Azure Migrate: Discovery and assessment tool.

## Next steps

[Review](migrate-appliance.md) the appliance support matrix.