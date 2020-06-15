---
title: Azure Migrate appliance architecture
description: Provides an overview of the Azure Migrate appliance used in server assessment and migration.
ms.topic: conceptual
ms.date: 06/09/2020
---


# Azure Migrate appliance architecture

This article describes the Azure Migrate appliance architecture and processes. The Azure Migrate appliance is a lightweight appliance that's deployed on premises, to discover VMs and physical servers for migration to Azure. 

## Deployment scenarios

The Azure Migrate appliance is used in the following scenarios.

**Scenario** | **Tool** | **Used for** 
--- | --- | ---
**VMware VM assessment** | Azure Migrate:Server Assessment | Discover VMware VMs.<br/><br/> Discover machine apps and dependencies.<br/><br/> Collect machine metadata and performance metadata and send to Azure.
**VMware VM migration (agentless)** | Azure Migrate:Server Migration | Discover VMware VMs<br/><br/>  Replicate VMware VMs with [agentless migration](server-migrate-overview.md).
**Hyper-V VM assessment** | Azure Migrate:Server Assessment | Discover Hyper-V VMs.<br/><br/> Collect machine metadata and performance metadata and send to Azure.
**Physical machine** |  Azure Migrate:Server Assessment |  Discover physical servers.<br/><br/> Collect machine metadata and performance metadata and send to Azure.

## Appliance components

The appliance has a number of components.

- **Management app**: This is a web app for user input during appliance deployment. Used when assessing machines for migration to Azure.
- **Discovery agent**: The agent gathers machine configuration data. Used when assessing machines for migration to Azure. 
- **Assessment agent**: The agent collects performance data. Used when assessing machines for migration to Azure.
- **DRA agent**: Orchestrates VM replication, and coordinates communication between replicated machines and Azure. Used only when replicating VMware VMs to Azure using agentless migration.
- **Gateway**: Sends replicated data to Azure. Used only when replicating VMware VMs to Azure using agentless migration.
- **Auto update service**: Updates appliance components (runs every 24 hours).



## Appliance deployment

- The Azure Migrate appliance can be set up using a template for [Hyper-V](how-to-set-up-appliance-hyper-v.md) or [VMware](how-to-set-up-appliance-vmware.md) or using a PowerShell script installer for [VMware/Hyper-V](deploy-appliance-script.md), and for [physical servers](how-to-set-up-appliance-physical.md). 
- Appliance support requirements and deployment prerequisites are summarized in the [appliance support matrix](migrate-appliance.md).


## Appliance registration

During appliance setup, you register the appliance with Azure Migrate, and the actions summarized in the table occur.

**Action** | **Details** | **Permissions**
--- | --- | ---
**Register source providers** | These resources providers are registered in the subscription you choose during appliance setup: Microsoft.OffAzure, Microsoft.Migrate and Microsoft.KeyVault.<br/><br/> Registering a resource provider configures your subscription to work with the resource provider. | To register the resource providers, you need a Contributor or Owner role on the subscription.
**Create Azure AD app-communication** | Azure Migrate creates an Azure Active Directory (Azure AD) app for communication (authentication and authorization) between the agents running on the appliance, and their respective services running on Azure.<br/><br/> This app does not have privileges to make Azure Resource Manager calls, or RBAC access on any resource. | You need [these permissions](tutorial-prepare-vmware.md#assign-permissions-to-create-azure-ad-apps) for Azure Migrate to create the app.
**Create Azure AD apps-Key vault** | This app is created only for agentless migration of VMware VMs to Azure.<br/><br/> It's used exclusively to access the key vault created in the user's subscription for agentless migration.<br/><br/> It has RBAC access on the Azure key vault (created in customer's tenant), when discovery is initiated from the appliance. | You need [these permissions](tutorial-prepare-vmware.md#assign-permissions-to-create-a-key-vault) for Azure Migrate to create the app.



## Collected data

Data collected by the client for all deployment scenarios is summarized in the [appliance support matrix](migrate-appliance.md).

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

You turn off auto-update in the registry by setting the HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance "AutoUpdate" key to 0 (DWORD).

 

## Next steps

[Review](migrate-appliance.md) the appliance support matrix.

