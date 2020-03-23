---
title: Azure Migrate appliance architecture
description: Provides an overview of the Azure Migrate appliance used in server assessment and migration.
ms.topic: conceptual
ms.date: 03/23/2020
---


# Azure Migrate appliance architecture

This article describes the Azure Migrate appliance architecture and processes. The Azure Migrate appliance is a lightweight appliance that's deployed on premises, to discover VMs and physical servers that you want to assess for migration to Azure. 

## Deployment scenarios

The Azure Migrate appliance is used in the following scenarios.

**Scenario** | **Tool** | **Used for** 
--- | --- | ---
**VMware VM assessment** | Azure Migrate: Server Assessment | Discover VMware VMs.<br/><br/> Discover machine apps and dependencies.<br/><br/> Collect machine metadata and performance metadata and send to Azure.
**VMware VM migration (agentless)** | Azure Migrate: Server Migration | Discover VMware VMs<br/><br/>  Replicate VMware VMs with [agentless migration](server-migrate-overview.md).
**Hyper-V VM assessment** | Azure Migrate: Server Assessment | Discover Hyper-V VMs.<br/><br/> Collect machine metadata and performance metadata and send to Azure.
**Physical machine** |  Azure Migrate: Server Assessment |  Discover physical servers.<br/><br/> Collect machine metadata and performance metadata and send to Azure.

## Appliance components

The appliance has a number of components.

- **Management app**: This is a web app for user input during appliance deployment. Used when assessing machines for migration to Azure.
- **Discovery agent**: The agent gathers machine configuration data. Used when assessing machines for migration to Azure. 
- **Assessment agent**: The agent collects performance data. Used when assessing machines for migration to Azure.
- **DRA agent**: Orchestrates VM replication, and coordinates communication between replicated machines and Azure. Used only when replicating VMware VMs to Azure using agentless migration.
- **Gateway**: Sends replicated data to Azure. Used only when replicating VMware VMs to Azure using agentless migration.
- **Auto update service**: Updates appliance components (runs every 24 hours).

## Appliance deployment

- The Azure Migrate appliance can be set up using a template (Hyper-V or VMware only) or a PowerShell script installer. [Learn more](deploy-appliance.md#deployment-options) about the options. 
- Appliance support requirements and deployment prerequisites are summarized in the [appliance support matrix](migrate-appliance.md).

## Collected data

Data collected by the client for all deployment scenarios is captured fully in the [appliance support matrix](migrate-appliance.md).

## Discovery and collection process

![Architecture](./media/migrate-appliance-architecture/architecture.png)

The appliance communicates with vCenter Servers and Hyper-V hosts/cluster using the following process.

1. **Start discovery**:
    - When you start the discovery on the Hyper-V appliance, it communicates with the Hyper-V hosts on WinRM ports 5985 (HTTP) and 5986 (HTTPS).
    - When you start discovery on the VMware appliance, it communicates with the vCenter server on TCP port 443 by default. IF the vCenter server listens on a different port, you can configure it in the appliance web app.
2. **Gather metadata and performance data**:
    - The appliance uses a Common Information Model (CIM) session to gather Hyper-V VM data from the Hyper-V host on ports 5985 and 5986.
    - The appliance communicates with port 443 by default, to gather VMware VM data from the vCenter Server.
3. **Send data**: The appliance sends the collected data to Azure Migrate Server Assessment and Azure Migrate Server Migration over SSL port 443. The appliance can connect to Azure over the internet, or you can use ExpressRoute with public/Microsoft peering.
    - For performance data, the appliance collects real-time utilization data.
        - Performance data is collected every 20 seconds for VMware, and every 30 seconds for Hyper-V, for each performance metric.
        - The collected data is rolled up to create a single data point for 10 minutes.
        - The peak utilization value is selected from all of the 20/30-second data points, and sent to Azure for assessment calculation.
        - Based on the percentile value specified in the assessment properties (50th/90th/95th/99th), the ten-minute points are sorted in ascending order, and the appropriate percentile value is used to compute the assessment
    - For Server Migration, the appliance starts collecting VM data, and replicates it to Azure.
4. **Assess and migrate**: You can now create assessments from the metadata collected by the appliance using Azure Migrate Server Assessment. In addition, you can also start migrating VMware VMs using Azure Migrate Server Migration to orchestrate agentless VM replication.





## Appliance upgrades

The appliance is upgraded as the Azure Migrate agents running on the appliance are updated. This happens automatically because auto-update is enabled on the appliance by default. You can change this default setting to update the agents manually.

You turn off auto-update in the registry by setting HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance "AutoUpdate" key to 0 (DWORD). If you decide to use manual updates, it's important to update all agents on the appliance at the same time, using the  **Update** button for each outdated agent on the appliance..
 

## Next steps

[Review](migrate-appliance.md) the appliance support matrix.

