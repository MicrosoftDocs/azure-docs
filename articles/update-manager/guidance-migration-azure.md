---
title: Patching guidance overview for Microsoft Configuration Manager to Azure
description: Patching guidance overview for Microsoft Configuration Manager to Azure. View on how to get started with Azure Update Manager, mapping capabilities of MCM software and FAQs.
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 04/19/2024
ms.author: sudhirsneha
---

# Guidance on migrating virtual machines from Microsoft Configuration Manager to Azure Update Manager 

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides a guide to start using Azure Update Manager (for update management) for virtual machines that are currently using Microsoft Configuration Manager (MCM). 

Before initiating migration, you need to understand mapping between System Center components and equivalent services in Azure.

| **System Center Component** | **Azure equivalent service** |
| --- | --- |
| System Center Operations Manager (SCOM) | Azure Monitor SCOM Managed Instance |
| System Center Configuration Manager (SCCM), now called Microsoft Configuration Manager (MCM) | Azure Update Manager, </br> Change Tracking and Inventory, </br> Guest Config, </br> Azure Automation, </br> Desired State Configuration (DSC), </br> Defender for Cloud | 
| System Center Virtual Machine Manager (SCVMM) | Arc enabled System Center VMM | 
| System Center Data Protection Manager (SCDPM) | Arc enabled DPM | 
| System Center Orchestrator (SCORCH) | Arc enabled DPM | 
| System Center Service Manager (SCSM)  | - |

> [!NOTE]
> As part of your migration journey, we recommend the following options:
> 1. Fully migrate your virtual machines to Azure and replace System Center with Azure native services.
> 1. Take a hybrid approach and replace System Center with Azure native services. Where both Azure and on-premises virtual machines are managed using Azure native services. For on-premises virtual machines, the capabilities of the Azure platform are extended to on-premises via Azure Arc.

## Migrate to Azure Update Manager
MCM helps you to manage PCs and servers, keep software up to date, set configuration and security policies, and monitor system status. MCM offers [multiple features and capabilities](/mem/configmgr/core/plan-design/changes/features-and-capabilities) and software [update management](/mem/configmgr/sum/understand/software-updates-introduction) is one of these.

Specifically for update management or patching, as per your requirements, you can use the native [Azure Update Manager](overview.md) to manage and govern update compliance for Windows and Linux machines across your deployments in a consistent manner. Unlike MCM which needs maintaining Azure virtual machines for hosting the different Configuration Manager roles, Azure Update Manager is designed as a standalone Azure service to provide SaaS experience on Azure to manage hybrid environments. You don't need a license to use Azure Update Manager.

> [!NOTE]
> - To manage clients/devices, Intune is the recommended Microsoft solution.
> - Azure Update Manager does not provide migration support for Azure VMs in MCM. For example, configurations.

## Software update management capability map

The following table maps the **software update management capabilities** of MCM to Azure Update Manager.

**Capability** | **Microsoft Configuration Manager** | **Azure Update Manager** |
--- | --- | --- |
Synchronize software updates between sites (Central Admin site, Primary, Secondary sites) | The top site (either central admin site or stand-alone primary site) connects to Microsoft Update to retrieve software update. [Learn more](/mem/configmgr/sum/understand/software-updates-introduction). After the top sites are synchronized, the child sites are synchronized. | There's no hierarchy of machines in Azure and therefore all machines connected to Azure receive updates from the source repository.
Synchronize software updates/check for updates (retrieve patch metadata) | You can scan for updates periodically by setting configuration on the Software update point. [Learn more](/mem/configmgr/sum/get-started/synchronize-software-updates#to-schedule-software-updates-synchronization) | You can enable periodic assessment to enable scan of patches every 24 hours. [Learn more](assessment-options.md)|
Configuring classifications/products to synchronize/scan/assess | You can choose the update classifications (security or critical updates) to synchronize/scan/assess. [Learn more](/mem/configmgr/sum/get-started/configure-classifications-and-products) | There's no such capability here. The entire software metadata is scanned. | 
Deploy software updates (install patches) | Provides three modes of deploying updates: </br> Manual deployment </br> Automatic deployment </br> Phased deployment [Learn more](/mem/configmgr/sum/deploy-use/deploy-software-updates) | - Manual deployment is mapped to deploy [one-time updates](deploy-updates.md) </br> - Automatic deployment is mapped to scheduled updates </br> - There's no phased deployment option.
| Deploy software updates on Windows and Linux machines (in Azure or on-premises or other clouds) | SCCM helps manage tracking and applying software updates to Windows machines (Currently, we don't support Linux machines.) | Azure Update Manager supports software updates on both Windows and Linux machines. | 

## Guidance to use Azure Update Manager on MCM managed machines

As a first step in MCM user's journey towards Azure Update Manager, you need to enable Azure Update Manager on your existing MCM managed servers (i.e. ensure that Azure Update Manager and MCM co-existence is achieved). The following section address few challenges that you might encounter in this first step.

### Overview of current MCM setup

MCM client uses WSUS server to scan for first-party updates, therefore you have WSUS server configured as part of the initial setup.  
 
Third-party updates content is published to this WSUS server as well. Azure Update Manager has the capability of scanning & installing updates from WSUS, so we would leverage the WSUS server configured as part of MCM setup to make Azure Update Manager work along with MCM.

### First party updates

For Azure Update Manager to scan and install first party updates (Windows and Microsoft updates), you should start approving the required updates in the configured WSUS server. This is done by [configuring an auto approval rule in WSUS](/windows-server/administration/windows-server-update-services/deploy/3-approve-and-deploy-updates-in-wsus#32-configure-auto-approval-rules) like what users have configured on MCM server.
 
### Third party updates

Third party updates should work as expected with Azure Update Manager provided you have already configured MCM for third party patching and it is able to successfully patch Third party updates via MCM. Ensure that you continue to publish third party updates to WSUS from MCM [Step 3 in Enable third-party updates](/mem/configmgr/sum/deploy-use/third-party-software-updates#publish-and-deploy-third-party-software-updates). After you publish to WSUS, Azure Update Manager will be able to detect and install these updates from WSUS server.

## Manage software updates using Azure Update Manager

1. Sign in to the [Azure portal](https://portal.azure.com) and search for **Azure Update Manager**.

   :::image type="content" source="./media/guidance-migration-azure/update-manager-service-selection-inline.png" alt-text="Screenshot of selecting the Azure Update Manager from Azure portal." lightbox="./media/guidance-migration-azure/update-manager-service-selection-expanded.png":::

1. In the **Azure Update Manager** home page, under **Manage** > **Machines**, select your subscription to view all your machines.
1. Filter as per the available options to know the status of your specific machines.

   :::image type="content" source="./media/guidance-migration-azure/filter-machine-status-inline.png" alt-text="Screenshot of selecting the filters in Azure Update Manager to view the machines." lightbox="./media/guidance-migration-azure/filter-machine-status-expanded.png":::

1. Select the suitable [assessment](assessment-options.md) and [patching](updates-maintenance-schedules.md) options as per your requirement.

### Patch machines

After you set up configuration for assessment and patching, you can deploy/install either through [on-demand updates](deploy-updates.md) (One-time or manual update) or [schedule updates](scheduled-patching.md) (automatic update) only. You can also deploy updates using [Azure Update Manager's API](manage-vms-programmatically.md).

## Limitations in Azure Update Manager

The following are the current limitations:

- **Orchestration groups with Pre/Post scripts** - [Orchestration groups](/mem/configmgr/sum/deploy-use/orchestration-groups) can't be created in Azure Update Manager to specify a maintenance sequence, allow some machines for updates at the same time and so on. (The orchestration groups allow you to use the pre/post scripts to run tasks before and after a patch deployment).

## Frequently asked questions

### Where does Azure Update Manager get its updates from?

Azure Update Manager refers to the repository that the machines point to. Most Windows machines by default point to the Windows Update catalog and Linux machines are configured to get updates from the `apt` or `yum` repositories. If the machines point to another repository such as [WSUS](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) or a local repository then Azure Update Manager gets the updates from that repository.

### Can Azure Update Manager patch OS, SQL and Third party software?

Azure Update Manager refers to the repositories (or endpoints) that the VMs point to. If the repository (or endpoints) contains updates for Microsoft products, third party software etc. then Azure Update Manager can install these patches.

By default, Windows VMs point to Windows Update server. Windows Update server doesn't contain updates for Microsoft products, and third party software. If the VMs point to Microsoft Update, Azure Update Manager patches OS and Microsoft products.

For the third party software patching, Azure Update Manager should be connected to WSUS and you must publish the third party updates. We can't patch third party software for Windows VMs unless they're available in WSUS.

### Do I need to configure WSUS to use Azure Update Manager?

WSUS is a way to manage patches. Azure Update Manager will refer to whichever endpoint it's pointed to. (Windows Update, Microsoft Update, or WSUS).

### Should I deploy the monthly patch through MCM?

No, only approving patches in WSUS monthly or setting the Automatic Deployment Rules (ADRs) will scan and install patches on your servers.

### How Azure Update Manager can be used to manage on-premises virtual machines?

Azure Update Manager can be used on-premises by using Azure Arc. Azure Arc is a bridge that extends the Azure platform to help you build applications and services with the flexibility to run across datacenters, at the edge, and in multicloud environments.  Azure Arc VM management lets you provision and manage Windows and Linux VMs hosted on-premises. This feature enables IT admins to manage Arc VMs by using Azure management tools, including Azure portal, Azure CLI, Azure PowerShell, and Azure Resource Manager (ARM) templates.  
 
## Next steps
- [An overview on Azure Update Manager](overview.md)
- [Check update compliance](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
- [An overview of Azure Arc-enabled servers](../azure-arc/servers/overview.md)

