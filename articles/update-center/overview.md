---
title: Update management center (preview) overview
description: The article tells what Update management center (preview) in Azure is and the system updates for your Windows and Linux machines in Azure, on-premises, and other cloud environments.
ms.service: update-management-center
author: SGSneha
ms.author: v-ssudhir
ms.date: 03/07/2022
ms.topic: overview
---

# Update management center (preview) overview

You can use update management center (preview) in Azure to centrally manage operating system updates, update configuration settings, and manage the process of installing required updates for your Windows and Linux virtual machines (VMs) in Azure, physical or VMs in on-premises environments, and in other cloud environments. You can quickly assess the status of available updates and manage the process of installing required updates for your machines reporting to update management center (preview). 

Microsoft offers other capabilities to help you manage updates for your Azure VMs or Azure virtual machine scale sets that you should consider as part of your overall update management strategy. Review the Azure VM [Update options](/azure/virtual-machines/updates-maintenance-overview) to learn more about the options available.

Before enabling your machines for update management center (preview), make sure that you understand the information in the following sections.

> [!IMPORTANT]
> Update management center (preview) can manage machines currently managed by Azure Automation [Update management](/azure/automation/update-management/overview) feature without interrupting your update management process. However, we don't recommend migrating from Automation Update Management since this preview gives you a chance to evaluate and provide feedback on features before it's generally available (GA). 
>
> While update management center is in **preview**, the [Supplemental Terms of Use for Microsoft Azure Previews](/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## About Update management center (preview)

Update management center (preview) has been redesigned and doesn't depend on Azure Automation or Azure Monitor Logs, as required by the [Azure Automation Update Management feature](/azure/automation/update-management/overview). It offers all of the same functionality as the original version available with Azure Automation, but it's designed to:

- Take advantage of newer technology in Azure
- Deliver a native update capability
- No onboarding steps are required
- Granular role based access 

The following diagram illustrates how update management center (preview) assesses and applies updates to all Azure machines and Arc-enabled servers for both Windows and Linux.

![Update center workflow](./media/overview/update-management-center-overview.png)

To support management of your Azure VM or non-Azure machine, update management center (preview) relies on a new Azure extension designed to provide all the functionality required to interact with the operating system to manage the assessment and application of updates. This extension is installed when you initiate management of your machine, and the extension supports deployment to Azure VMs or Arc enabled servers using the extension framework. The update management center (preview) extension is installed and managed using the following:

- [Azure virtual machine Windows agent](/azure/virtual-machines/extensions/agent-windows) or [Azure virtual machine Linux agent](/azure/virtual-machines/extensions/agent-linux) for Azure VMs.
- [Azure arc-enabled servers agent](/azure/azure-arc/servers/agent-overview) for non-Azure Linux and Windows machines or physical servers.

When you initiate management of your Azure VM or non-Azure machine, update management center (preview) pushes an extension to the Azure VM agent or Arc enabled server agent. The agent installation and configuration is managed by update management center (preview) and there's no manual intervention required as long as the Azure VM agent or Azure Arc-enabled server agent is functional. The update management center (preview) extension runs code locally on the machine to interact with the operating system, and it includes:

- Retrieving assessment information about status of system updates for it specified by the Windows Update client or Linux package manager.
- Initiate download and installation of approved updates with Windows Update client or Linux package manager. 

All assessment information and update installation results is reported to update management center (preview) from the extension and is available for analysis with [Azure Resource Graph](/azure/governance/resource-graph/overview). You can view up to the last seven days of assessment data, and up to the last 30 days of update installation results. 

The machines assigned to update management center (preview) report how up to date they're based on what source they're configured to synchronize with. Windows Update Agent (WUA) on Windows machines can be configured to report to [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) or Microsoft Update, and Linux machines can be configured to report to a local or public YUM or APT package repository. If the Windows Update Agent is configured to report to WSUS, depending on when WSUS last synchronized with Microsoft Update, the results in update management center (preview) might differ from what Microsoft Update shows. This behavior is the same for Linux machines that are configured to report to a local repository instead of a public package repository. 

You can manage your Azure VMs or Arc-enabled servers directly, or at-scale with update management center (preview).

## Prerequisites

### Role

**Resource** | **Role**
--- | ---
|Azure VM | [Azure Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) or Azure [Owner](/azure/role-based-access-control/built-in-roles#owner).
Arc enabled server | [Azure Connected Machine Resource Administrator](/azure/azure-arc/servers/security-overview#identity-and-access-control).


### Permissions

To create and manage update deployments, you need specific permissions. The following table shows the permissions needed when using update management center (preview).

 
**Actions** |**Permission** |**Scope** |
--- | --- | --- |
|Install update on Azure VMs |*Microsoft.Compute/virtualMachines/installPatches/action* ||
|Update assessment on Azure VMs |*Microsoft.Compute/virtualMachines/assessPatches/action* ||
|Install update on Arc enabled server |*Microsoft.HybridCompute/machines/installPatches/action* ||
|Update assessment on Arc enabled server |*Microsoft.HybridCompute/machines/assessPatches/action* ||
|Create/modify maintenance configuration |*Microsoft.Maintenance/maintenanceConfigurations/write* |Subscription/resource group |
|Create/modify configuration assignments |*Microsoft.Maintenance/configurationAssignments/write* |Machine |
|Read permission for Maintenance updates resource |*Microsoft.Maintenance/updates/read* |Machine |
|Read permission for Maintenance apply updates resource |*Microsoft.Maintenance/applyUpdates/read* |Machine |

 
## Next steps

- [Enable update management center (preview)](enable-machines.md) for your Azure VMs or Azure Arc-enabled servers.
- [View updates for single machine](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via Portal](manage-update-settings.md)
- [Manage multiple machines using update management center](manage-multiple-machines.md)
