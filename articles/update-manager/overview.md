---
title: Azure Update Manager overview
description: This article tells what Azure Update Manager in Azure is and the system updates for your Windows and Linux machines in Azure, on-premises, and other cloud environments.
ms.service: azure-update-manager
ms.custom: linux-related-content, ignite-2024
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 02/03/2025
ms.topic: overview
---

# About Azure Update Manager

> [!Important]
> Both Azure Automation Update Management and the Log Analytics agent it uses [have been retired on 31st August 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). Therefore, if you are using the Automation Update Management solution, we recommend that you move to Azure Update Manager for your software update needs. Follow the [guidance](guidance-migration-automation-update-management-azure-update-manager.md#migration-scripts) to move your machines and schedules from Automation Update Management to Azure Update Manager.
> For more information, see the [FAQs on retirement](update-manager-faq.md#impact-of-log-analytics-agent-retirement).


Update Manager is a unified service to help manage and govern updates for all your machines (running a server operating system). You can monitor Windows and Linux update compliance across your machines in Azure, and on-premises or other cloud environments (connected by [Azure Arc](/azure/azure-arc/)) from a single pane of management. You can also use Update Manager to make real-time updates or schedule them within a defined maintenance window. 

You can use Update Manager for:

- **Unified Update Management** - Monitor update compliance across Windows and Linux machines (running a server operating system) from a single dashboard, including machines in Azure, and on-premises or other cloud environments (connected by Azure Arc).
- **Flexible patching options**:
    - Schedule updates within [customer-defined maintenance ](https://aka.ms/umc-scheduled-patching), for both Azure and Arc-connected machines.
    - [Apply updates in real-time](deploy-updates.md) 
    - Use [Automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching), to automatically apply updates to Azure VMs without requiring manual intervention. 
    - Use [hotpatching](/windows-server/get-started/hotpatch), to apply critical updates to Azure VMs without requiring a reboot, minimizing downtime
- **Security and Compliance tracking** - Apply security and critical patches with enhanced security measures and compliance tracking. 
- **Periodic update Assessments** - Enable [periodic assessments](https://aka.ms/umc-periodic-assessment-policy) to check for updates every 24 hours. 
- **Dynamic Scoping** - Group machines based on criteria and apply updates at scale. 
- **Custom Reporting and Alerts** - Build custom dashboards to report update status and [configure alerts](manage-alerts.md) to notify you of update statuses and any issues that arise. 
- **Granular Access Control** - Use role-based access control (RBAC) to delegate permissions for patch management tasks at a per-resource level. 
- **Software updates including application updates**: 
    - That are available in Microsoft Updates  
    - That are available in Linux packages 
    - That are published to [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) 
- Patching diverse resources 
    - Azure Virtual Machines (VMs): both Windows and Linux VMs in Azure (including SQL servers). VMs also include the ones which are created by Azure Migrate, Azure Backup, and Azure Site Recovery. 
    - [Hybrid machines](/azure/azure-arc/servers/) (including SQL Arc servers) and Windows IoT Enterprise on Arc enabled servers 
    - [VMware machines](/azure/azure-arc/vmware-vsphere/)
    - [System Center Virtual Machine Manager (SCVMM) machines](/azure/azure-arc/system-center-virtual-machine-manager/) 
    - [Azure Local clusters](/azure/azure-local/)
    - [Cross-subscription-patching](cross-subscription-patching.md)

These features make Azure Update Manager a powerful tool for maintaining the security and performance of your IT infrastructure. 

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
    - Secure machines with new ways of patching such as [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching) in Azure, [hotpatching](/azure/automanage/automanage-hotpatch) or  [custom maintenance schedules](https://aka.ms/umc-scheduled-patching).
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
