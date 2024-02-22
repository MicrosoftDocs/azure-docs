---
title: Patching guidance overview for Microsoft Configuration Manager to Azure
description: Patching guidance overview for Microsoft Configuration Manager to Azure. View on how to get started with Azure Update Manager, mapping capabilities of MCM software and FAQs.
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 09/18/2023
ms.author: sudhirsneha
---

# Guidance on migrating Azure VMs from Microsoft Configuration Manager to Azure Update Manager 

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides a guide to start using Azure Update Manager (for update management) for Azure virtual machines that are currently using Microsoft Configuration Manager (MCM). 

Microsoft Configuration Manager (MCM), previously known as System Center Configuration Manager (SCCM), helps you to manage PCs and servers, keep software up to date, set configuration and security policies, and monitor system status.

MCM supports several [cloud services](/mem/configmgr/core/understand/use-cloud-services) that can supplement on-premises infrastructure and can help solve business problems such as:
- How to manage clients that roam onto the internet.
- How to provide content resources to isolated clients or resources on the intranet, outside your firewall.
- How to scale out infrastructure when the physical hardware isn't available or isn't logically placed to support your needs.

Customers [extend and migrate an on-premises site to Azure](/mem/configmgr/core/support/azure-migration-tool) and create Azure virtual machines (VMs) for Configuration Manager and install the various site roles with default settings. The validation of new roles and removal of the on-premises site system role enables MCM to provide all the on-premises capabilities and experiences in Azure. For more information, see [Configuration Manager on Azure FAQ](/mem/configmgr/core/understand/configuration-manager-on-azure).


## Migrate to Azure Update Manager

MCM offers [multiple features and capabilities](/mem/configmgr/core/plan-design/changes/features-and-capabilities) and software [update management](/mem/configmgr/sum/understand/software-updates-introduction) is one of these.By using MCM in Azure, you can continue with the existing investments in MCM and processes to manage update cycle for Windows VMs.

**Specifically for update management or patching**, as per your requirements, you can also use the native [Azure Update Manager](overview.md) to manage and govern update compliance for Windows and Linux machines across your deployments in a consistent manner. Unlike MCM that needs maintaining Azure virtual machines for hosting the different Configuration Manager roles. Azure Update Manager is designed as a standalone Azure service to provide SaaS experience on Azure to manage hybrid environments. You don't need license to use Azure Update Manager.

> [!NOTE]
> Azure Update Manager does not provide migration support for Azure VMs in MCM. For example, configurations.

## Software update management capability map

The following table maps the **software update management capabilities** of MCM to Azure Update Manager.

**Capability** | **Microsoft Configuration Manager** | **Azure Update Manager** |
--- | --- | --- |
Synchronize software updates between sites (Central Admin site, Primary, Secondary sites) | The top site (either central admin site or stand-alone primary site) connects to Microsoft Update to retrieve software update. [Learn more](/mem/configmgr/sum/understand/software-updates-introduction). After the top sites are synchronized, the child sites are synchronized. | There's no hierarchy of machines in Azure and therefore all machines connected to Azure receive updates from the source repository.
Synchronize software updates/check for updates (retrieve patch metadata) | You can scan for updates periodically by setting configuration on the Software update point. [Learn more](/mem/configmgr/sum/get-started/synchronize-software-updates#to-schedule-software-updates-synchronization) | You can enable periodic assessment to enable scan of patches every 24 hours. [Learn more](assessment-options.md)|
Configuring classifications/products to synchronize/scan/assess | You can choose the update classifications (security or critical updates) to synchronize/scan/assess. [Learn more](/mem/configmgr/sum/get-started/configure-classifications-and-products) | There's no such capability here. The entire software metadata is scanned. | 
Deploy software updates (install patches) | Provides three modes of deploying updates: </br> Manual deployment </br> Automatic deployment </br> Phased deployment [Learn more](/mem/configmgr/sum/deploy-use/deploy-software-updates) | Manual deployment is mapped to deploy [one-time updates](deploy-updates.md) and Automatic deployment is mapped to [scheduled updates](scheduled-patching.md) (The [Automatic Deployment Rules (ADRs)](/mem/configmgr/sum/deploy-use/automatically-deploy-software-updates#BKMK_CreateAutomaticDeploymentRule)) can be mapped to schedules. There's no phased deployment option.

## Manage software updates using Azure Update Manager

1. Sign in to the [Azure portal](https://portal.azure.com) and search for **Azure Update Manager**.

   :::image type="content" source="./media/guidance-migration-azure/update-manager-service-selection-inline.png" alt-text="Screenshot of selecting the Azure Update Manager from Azure portal." lightbox="./media/guidance-migration-azure/update-manager-service-selection-expanded.png":::

1. In the **Azure Update Manager** home page, under **Manage** > **Machines**, select your subscription to view all your machines.
1. Filter as per the available options to know the status of your specific machines.

   :::image type="content" source="./media/guidance-migration-azure/filter-machine-status-inline.png" alt-text="Screenshot of selecting the filters in Azure Update Manager to view the machines." lightbox="./media/guidance-migration-azure/filter-machine-status-expanded.png":::

1. Select the suitable [assessment](assessment-options.md) and [patching](updates-maintenance-schedules.md) options as per your requirement.


### Patch machines

After you set up configuration for assessment and patching, you can deploy/install either through [on-demand updates](deploy-updates.md) (One-time or manual update)or [schedule updates](scheduled-patching.md) (automatic update) only. You can also deploy updates using [Azure Update Manager's API](manage-vms-programmatically.md).

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
 
## Next steps
- [An overview on Azure Update Manager](overview.md)
- [Check update compliance](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
