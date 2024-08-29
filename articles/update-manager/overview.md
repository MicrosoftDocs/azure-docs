---
title: Azure Update Manager overview
description: This article tells what Azure Update Manager in Azure is and the system updates for your Windows and Linux machines in Azure, on-premises, and other cloud environments.
ms.service: azure-update-manager
ms.custom: linux-related-content
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 07/14/2024
ms.topic: overview
---

# About Azure Update Manager

> [!Important]
> On 31 August 2024, both Azure Automation Update Management and the Log Analytics agent it uses [will be retired](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). Therefore, if you are using the Automation Update Management solution, we recommend that you move to Azure Update Manager for your software update needs. Follow the [guidance](guidance-migration-automation-update-management-azure-update-manager.md#migration-scripts) to move your machines and schedules from Automation Update Management to Azure Update Manager.
> For more information, see the [FAQs on retirement](update-manager-faq.md#impact-of-log-analytics-agent-retirement). You can [sign up](https://developer.microsoft.com/reactor/?search=Azure+Update+Manager&page=1) for monthly live sessions on migration including Q&A sessions.


Update Manager is a unified service to help manage and govern updates for all your machines. You can monitor Windows and Linux update compliance across your machines in Azure and on-premises/on other cloud platforms (connected by [Azure Arc](/azure/azure-arc/)) from a single pane of management. You can also use Update Manager to make real-time updates or schedule them within a defined maintenance window. 

You can use Update Manager in Azure to:

- Instantly check for updates or [deploy security or critical updates](https://aka.ms/on-demand-patching) to help secure your machines.
- Enable [periodic assessment](https://aka.ms/umc-periodic-assessment-policy) to check for updates every 24 hours.
- Use flexible patching options such as:
    - [Customer-defined maintenance schedules](https://aka.ms/umc-scheduled-patching) for both Azure and Arc-connected machines.
    - [Automatic virtual machine (VM) guest patching](/azure/virtual-machines/automatic-vm-guest-patching) and [hot patching](/azure/automanage/automanage-hotpatch) for Azure VMs.
- Build custom reporting dashboards for reporting update status and [configure alerts](https://aka.ms/aum-alerts) on certain conditions.
- Oversee update compliance for your entire fleet of machines in Azure and on-premises/in other cloud environments connected by [Azure Arc](/azure/azure-arc/) through a single pane. The different types of machines that can be managed are:
- 
    - [Hybrid machines](/azure/azure-arc/servers/)
    - [VMWare machines](/azure/azure-arc/vmware-vsphere/)
    - [SCVMM machines](/azure/azure-arc/system-center-virtual-machine-manager/)
    - [Azure Stack HCI VMs](/azure-stack/hci/)

## Key benefits

Update Manager offers many new features and provides enhanced and native functionalities. Following are some of the benefits:

- Provides native experience with zero on-boarding.
  - Built as native functionality on Azure virtual machines and Azure Arc for Servers platforms for ease of use.
  - No dependency on Log Analytics and Azure Automation.
  - Azure [Policy support](https://aka.ms/aum-policy-support).
  - Availability in most [Azure virtual machines and Azure Arc regions](https://aka.ms/aum-supported-regions).
- Works with Azure roles and identity. 
  - Granular access control at the per-resource level instead of access control at the level of the Azure Automation account and Log Analytics workspace. 
  - Update Manager has Azure Resource Manager-based operations. It allows [role-based access control](../role-based-access-control/overview.md) and roles based on Azure Resource Manager in Azure.
  - Offers enhanced flexibility
    - Take immediate action either by [installing updates immediately](https://aka.ms/on-demand-patching) or [scheduling them for a later date](https://aka.ms/umc-scheduled-patching).
    - [Check updates automatically](https://aka.ms/aum-policy-support) or [on demand](https://aka.ms/on-demand-assessment).
    - Secure machines with new ways of patching such as [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching) in Azure, [hot patching](/azure/automanage/automanage-hotpatch) or  [custom maintenance schedules](https://aka.ms/umc-scheduled-patching).
    - Sync patch cycles in relation to **patch Tuesday** the unofficial term for Microsoft's scheduled security fix release on every second Tuesday of each month. 
- Reporting and alerting
    - Build custom reporting dashboards through [Azure Workbooks](manage-workbooks.md) to monitor the update compliance of your infrastructure. 
    - [Configure alerts](https://aka.ms/aum-alerts) on updates/compliance to be notified or to automate action whenever something requires your attention. 
      

## Next steps
- [How Update Manager works](workflow-update-manager.md)
- [Prerequisites of Update Manager](prerequisites.md)
- [View updates for a single machine](view-updates.md).
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md).
- [Enable periodic assessment at scale using policy](https://aka.ms/aum-policy-support).
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md).
- [Manage multiple machines by using Update Manager](manage-multiple-machines.md).
