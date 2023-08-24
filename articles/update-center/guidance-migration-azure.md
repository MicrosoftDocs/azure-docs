---
title: Patching guidance overview for Microsoft Configuration Manager (MCM) to Azure
description: Patching guidance overview for Microsoft Configuration Manager to Azure. View on how to get started with Azure Update Manager, mapping capabilities of MCM software and FAQs.
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 08/23/2023
ms.author: sudhirsneha
---

# Guidance on patching while migrating from Microsoft Configuration Manager to Azure

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides the details on how to patch your migrated virtual machines on Azure.

Microsoft Configuration Manager (MCM) helps you to manage PCs and servers, keep software up-to-date, setting configuration and security policies, and monitor system status.

 The [Azure Migration tool](https://learn.microsoft.com/mem/configmgr/core/support/azure-migration-tool) helps you to programmatically create Azure virtual machines (VMs) for Configuration Manager and installs the various site roles with default settings. The validation of new roles and removal of the on-premises site system role enables MCM to provide all the on-premises capabilities and experiences in Azure.

Additionally, you can use the native [Azure Update Manager](overview.md) to manage and govern update compliance for Windows and Linux machines across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard, with no operational cost for managing the patching infrastructure. Azure Update Manager is similar to the update management component of MCM that is designed as a standalone Azure service to provide SaaS experience on Azure to manage hybrid environments.

The MCM in Azure and Azure Update Manager can fulfill your patching requirements as per your requirement. 
- Using MCM, you can continue with the existing investments in MCM and the processes to maintain the patch update management cycle for Windows VMs.
- Using Azure Update Manager, you can achieve a consistent management of VMs and operating system updates across your cloud and hybrid environment. You don't need to maintain Azure virtual machines for hosting the different Configuration Manager roles and don't need an MCM license there by reducing the total cost for maintaining the patch update management cycle for all the machines in your environment. [Learn more](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/what-s-uup-new-update-style-coming-next-week/ba-p/3773065)


## Manage software updates using Azure Update Manager

1. Sign in to the [Azure portal](https://portal.azure.com) and search for Azure Update Manager (preview).
   :::image type="content" source="./media/guidance-migration-azure/update-manager-service-selection-inline.png" alt-text="Screenshot of selecting the Azure Update Manager from Azure portal." lightbox="./media/manage-multiple-machines/overview-page-expanded.png":::
1. In the **Azure Update Manager (Preview)** home page, Under **Manage** > **Machines**, select your subscription to view all your machines.
1. Filter as per the available options to know the status of your specific machines.
   :::image type="content" source="./media/guidance-migration-azure/filter-machine-status-inline.png" alt-text="Screenshot of selecting the filters in Azure Update Manager to view the machines." lightbox="./media/guidance-migration-azure/filter-machine-status-expanded.png":::
1. Select the suitable [assessment](assessment-options.md) and [patching](updates-maintenance-schedules.md) options as per your requirement.

## Map MCM capabilities to Azure Update Manager

The following table explains the mapping capabilities of MCM software Update Management to AUM.
|    | **MCM** | **AUM**|
| --- | --- | --- |
|Synchronize software updates between sites(Central Admin site, Primary, Secondary sites)| The top site (either central admin site or stand-alone primary site) connects to Microsoft Update to retrieve software updates.[Learn more](https://learn.microsoft.com/mem/configmgr/sum/understand/software-updates-introduction). After the top sites are synchronized, the child sites are synchronized | There's no hierarchy of machines in Azure and therefore all machines connected to Azure receive updates from the source repository. |
|Synchronize software updates/check for updates (retrieve patch metadata) | You can scan for updates periodically by setting configuration on the Software update point. [Learn more](https://learn.microsoft.com/mem/configmgr/sum/get-started/synchronize-software-updates#to-schedule-software-updates-synchronization). | You can enable periodic assessment to enable scan of patches every 24 hours. [Learn more](assessment-options.md).
| Configuring classifications/products to synchronize/scan/assess | You can choose the update classifications (security or critical updates) to synchronize/scan/assess. [Learn more](https://learn.microsoft.com/mem/configmgr/sum/get-started/configure-classifications-and-products). | There's no capability here. The entire software metadata is scanned.| 
| Deploy software updates (install patches)| Provides three modes of deploying updates: </br> Manual deployment </br> Automatic deployment </br> Phased deployment. [Learn more](https://learn.microsoft.com/mem/configmgr/sum/deploy-use/deploy-software-updates).| Manual deployment is mapped to deploying [one-time updates](deploy-updates.md) and Automatic deployment is mapped to [scheduled updates](scheduled-patching.md). (The [Automatic Deployment Rules (ADRs)](https://learn.microsoft.com/mem/configmgr/sum/deploy-use/automatically-deploy-software-updates#BKMK_CreateAutomaticDeploymentRule) can be mapped to schedules). There's no phased deployment option. |

## Limitations in Azure Update Manager (preview)

The following are the current limitations:

- **Orchestration groups with Pre/Post scripts** - [Orchestration groups](https://learn.microsoft.com/mem/configmgr/sum/deploy-use/orchestration-groups) can't be created in AUM to specify a maintenance sequence, allow some machines for updates at the same time and so on. (The orchestration groups allow you to use the pre/post scripts to run tasks before and after a patch deployment).
- **Patching machines** - After your setup configurations for assessment and patching are complete, you can deploy/install either through [on-demand updates](deploy-updates.md) (one time or manual update) or [schedule updates](scheduled-patching.md) (automatic update) only. You can also deploy updates using [AUM's API](manage-vms-programmatically.md).

## Frequently asked questions

**Where does AUM get its updates from?**

AUM refers to the repository that the machines point to. Most Windows machines by default point to the Windows Update catalog and Linux machines are configured to get updates from the apt or yum repositories. If the machines point to another repository such as [WSUS](https://learn.microsoft.com/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) or a local repository and AUM gets the updates from that repo.

**Can AUM patch OS, SQL and Third party software?**

AUM refers to the repositories that the VMs point to. If the repository contains third party and SQL patches, AUM can install SQL and third party patches.
> [!NOTE]
> By default, Windows VMs point to Windows Update repository that does not contain SQL and third party patches. If the VMs point to Microsoft Update, AUM will patch OS, SQL and third party.

**Do I need to configure WSUS to use AUM?**

You don't need WSUS to deploy patches in AUM. Typically, all the machines connect to the internet repository to get updates (unless the machines point to WSUS or local repository that isn't connected to the internet). [Learn more](https://learn.microsoft.com/mem/configmgr/sum/).
 
## Next steps
- [An overview on Azure Update Manager](overview.md)
- [View updates for single machine](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
