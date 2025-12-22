---
title: Azure Update Manager Overview
description: This article describes features and benefits of Azure Update Manager for updating Windows and Linux machines in Azure, on-premises, and in other cloud environments.
ms.service: azure-update-manager
ms.custom: linux-related-content, ignite-2024
author: habibaum
ms.author: v-uhabiba
ms.date: 02/03/2025
ms.topic: overview
# Customer intent: As an IT administrator who manages diverse server environments, I want to use Azure Update Manager to monitor and automate software updates so that I can ensure compliance and enhance the security of my Windows and Linux machines across Azure and on-premises environments.
---

# What is Azure Update Manager?

Azure Update Manager is a unified service to help manage and govern updates for all your machines that run a server operating system. With Update Manager, you can monitor Windows and Linux update compliance across your machines in Azure, on-premises, or in other cloud environments (connected by [Azure Arc](/azure/azure-arc/)) from a single pane of management. You can also use Update Manager to make real-time updates or schedule updates within a defined maintenance window.

## Features

You can use Update Manager for:

- **Unified update management**: Monitor update compliance across Windows and Linux servers from a single dashboard.

- **Flexible patching options**:
  - Schedule updates within [customer-defined maintenance](https://aka.ms/umc-scheduled-patching) for both Azure virtual machines (VMs) and Azure Arc-connected machines.
  - [Apply updates in real time](deploy-updates.md).
  - Use [automatic guest patching](/azure/virtual-machines/automatic-vm-guest-patching) to automatically apply updates to Azure VMs without requiring manual intervention.
  - Use [hotpatching](/windows-server/get-started/hotpatch) to apply critical updates to Azure VMs without requiring a restart, minimizing downtime.

- **Security and compliance tracking**: Apply security and critical patches with enhanced security measures and compliance tracking.

- **Periodic update assessments**: Enable [periodic assessments](https://aka.ms/umc-periodic-assessment-policy) to check for updates every 24 hours.

- **Dynamic scoping**: Group machines based on criteria and apply updates at scale.

- **Custom reports and alerts**: Build custom dashboards to report update status, and [configure alerts](manage-alerts.md) to notify you of update statuses and any problems that arise.

- **Granular access control**: Use role-based access control (RBAC) to delegate permissions for patch management tasks at a per-resource level.

- **Software updates, including application updates**:
  - Apply updates that are available in Microsoft Update.
  - Apply updates that are available in Linux packages.
  - Apply updates that are published to [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus).

- **Patching diverse resources**:
  - Patch Windows and Linux VMs in Azure (including SQL servers).
  - Patch [hybrid machines](/azure/azure-arc/servers/), including deployments of SQL Server enabled by Azure Arc and Windows IoT Enterprise on Azure Arc-enabled servers.
  - Patch [VMware machines](/azure/azure-arc/vmware-vsphere/).
  - Patch [System Center Virtual Machine Manager machines](/azure/azure-arc/system-center-virtual-machine-manager/).
  - Patch [Azure Local clusters](/azure/azure-local/).
  - Perform [cross-subscription patching](cross-subscription-patching.md).

- **Reports and alerts**:
  - Build custom reporting dashboards through [Azure Workbooks](manage-workbooks.md) to monitor the update compliance of your infrastructure.
  - [Configure alerts](https://aka.ms/aum-alerts) on updates and compliance to notify you or to automate action whenever something requires your attention.

These features make Update Manager a powerful tool for maintaining the security and performance of your IT infrastructure.

## Key benefits

Here are some of the benefits of Update Manager:

- Provides native experience with zero onboarding:
  - Built as native functionality on Azure VMs and Azure Arc-enabled servers for ease of use.
  - No dependency on Log Analytics and Azure Automation.
  - [Azure Policy support](https://aka.ms/aum-policy-support).
  - Available in most [Azure VMs and Azure Arc regions](https://aka.ms/aum-supported-regions).

- Works with Azure roles and identity:
  - Granular access control at the per-resource level instead of access control at the level of the Azure Automation account and Log Analytics workspace.
  - Azure Resource Manager-based operations. Update Manager allows [role-based access control](../role-based-access-control/overview.md) and roles based on Resource Manager in Azure.
  - Enhanced flexibility:
    - Take immediate action by either [installing updates immediately](https://aka.ms/on-demand-patching) or [scheduling them for a later date](https://aka.ms/umc-scheduled-patching).
    - [Check updates automatically](https://aka.ms/aum-policy-support) or [on demand](https://aka.ms/on-demand-assessment).
    - Secure machines with new ways of patching, such as [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching) in Azure, [hotpatching](/azure/automanage/automanage-hotpatch), or  [custom maintenance schedules](https://aka.ms/umc-scheduled-patching).
    - Sync patch cycles in relation to *patch Tuesday*, the unofficial term for Microsoft's scheduled release of security fixes on the second Tuesday of each month.

## Related content

- [How Update Manager works](workflow-update-manager.md)
- [Prerequisites for Azure Update Manager](prerequisites.md)
- [Check update compliance with Azure Update Manager](view-updates.md)
- [Deploy updates now and track results with Azure Update Manager](deploy-updates.md)
- [Automate assessment at scale by using Azure Policy](https://aka.ms/aum-policy-support)
- [Schedule recurring updates for machines by using the Azure portal and Azure Policy](scheduled-patching.md)
- [Manage update configuration settings](manage-update-settings.md)
- [Manage multiple machines with Azure Update Manager](manage-multiple-machines.md)
- [Plan deployment for updating Windows VMs in Azure](/azure/architecture/example-scenario/wsus#azure-update-manager)
