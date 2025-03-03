---
title: Azure Update Manager support matrix
description: This article provides a summary of supported regions and operating system settings.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 01/29/2025
ms.topic: overview
ms.custom: references_regions
---

# Support matrix for Azure Update Manager

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Azure Update Manager. The article includes the supported regions and specific versions of the Windows Server and Linux operating systems running on Azure virtual machines (VMs) or machines managed by Azure Arc-enabled servers.

## Supported operating systems

>[!NOTE]
> - Only x64 operating systems are currently supported. Neither ARM64 nor x86 are supported for any operating system.

## Support for Updates/One time Updates/Periodic assessments and Scheduled patching

For Updates/One time Updates/Periodic assessments and Scheduled patching, see the list of [supported OS images](support-matrix-updates.md).

## Support for automatic VM Guest patching

If [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching) is enabled on a VM, then the available Critical and Security patches are downloaded and applied automatically on the VM.

- For marketplace images, see the list of [supported OS images](/azure/virtual-machines/automatic-vm-guest-patching#supported-os-images).
- For VMs created from customized images even if the Patch orchestration mode is set to `Azure Orchestrated/AutomaticByPlatform`, automatic VM guest patching doesn't work. We recommend that you use scheduled patching to patch the machines by defining your own schedules or install updates on-demand.


## Unsupported workloads

The following table lists the workloads that aren't supported.

   | **Workloads**| **Notes**
   |----------|-------------|
   | Windows client | For client operating systems such as Windows 10 and Windows 11, we recommend [Microsoft Intune](/mem/intune/) to manage updates.|
   | Virtual Machine Scale Sets| We recommend that you use [Automatic upgrades](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade) to patch the Virtual Machine Scale Sets.|
   | Azure Kubernetes Service nodes| We recommend the patching described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](/azure/aks/node-updates-kured).|

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).


## Supported regions

Update Manager scales to all regions for both Azure VMs and Azure Arc-enabled servers. The following table lists the Azure public cloud where you can use Update Manager.

#### [Azure Public cloud](#tab/public)

### Azure VMs

Azure Update Manager is available in all Azure public regions where compute virtual machines are available.

### Azure Arc-enabled servers

Azure Update Manager is currently supported in the following regions. It implies that VMs must be in the following regions.

**Geography** | **Supported regions**
--- | ---
Africa | South Africa North
Asia Pacific | East Asia </br> South East Asia
Australia | Australia East </br> Australia Southeast
Brazil | Brazil South
Canada | Canada Central </br> Canada East
Europe | North Europe </br> West Europe
France | France Central
Germany | Germany West Central
India | Central India
Italy | Italy North
Japan | Japan East
Korea | Korea Central
Norway | Norway East
Sweden | Sweden Central
Switzerland | Switzerland North
UAE | UAE North
United Kingdom | UK South </br> UK West
United States | Central US </br> East US </br> East US 2</br> North Central US </br> South Central US </br> West Central US </br> West US </br> West US 2 </br> West US 3

#### [Azure for US Government](#tab/gov)

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
United States | USGovVirginia </br>  USGovArizona </br> USGovTexas | For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For Azure VMs only

#### [Azure operated by 21Vianet](#tab/21via)

**Geography** | **Supported regions** | **Details** 
--- | --- | ---
China | ChinaEast </br> ChinaEast3 </br>  ChinaNorth </br> ChinaNorth3 </br> ChinaEast2 </br>  ChinaNorth2 | For Azure VMs only </br> For Azure VMs only </br> For Azure VMs only </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers </br> For both Azure VMs and Azure Arc-enabled servers.

---

### Supported update sources
For more information, see the  supported [update sources](workflow-update-manager.md#update-source). 

### Supported update types
The following types of updates are supported.

#### Operating system updates
Update Manager supports operating system updates for both Windows and Linux.

Update Manager doesn't support driver updates.

#### Extended Security Updates (ESU) for Windows Server

Using Azure Update Manager, you can deploy Extended Security Updates for your Azure Arc-enabled Windows Server 2012 / R2 machines. ESUs are available by default to Azure Virtual machines. To enroll in Windows Server 2012 Extended Security Updates on Arc connected machines, follow the guidance on [How to get Extended Security Updates (ESU) for Windows Server 2012 and 2012 R2 via Azure Arc](/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-enabled-by-azure-arc).


#### Microsoft application updates on Windows

By default, the Windows Update client is configured to provide updates only for the Windows operating system. 

If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other Microsoft products. Updates include security patches for Microsoft SQL Server and other Microsoft software.

Use one of the following options to perform the settings change at scale:

•	For all Windows Servers running on an earlier operating system than Windows Server 2016, run the following PowerShell script on the server you want to change:

   ```azurepowershell-interactive
    
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.AddService2($ServiceId,7,"")
   ```

•	For servers running Windows Server 2016 or later, you can use Group Policy to control this process by downloading and using the latest Group Policy Administrative template files.

> [!NOTE]
> Run the following PowerShell script on the server to disable Microsoft applications updates:

   ```azurepowershell-interactive
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.RemoveService($ServiceId)
   ```

#### Third party application updates

#### [Windows](#tab/third-party-win)

Update Manager relies on the locally configured update repository to update supported Windows systems, either WSUS or Windows Update. Tools such as [System Center Updates Publisher](/mem/configmgr/sum/tools/updates-publisher) allow you to import and publish custom updates with WSUS. This scenario allows Update Manager to update machines that use Configuration Manager as their update repository with third party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/mem/configmgr/sum/tools/install-updates-publisher).

#### [Linux](#tab/third-party-lin)

Third party application updates are supported in Azure Update Manager. If you include a specific third party software repository in the Linux package manager repository location, it's scanned when it performs software update operations. The package isn't available for assessment and installation if you remove it.

---

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).


## Next steps

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)
