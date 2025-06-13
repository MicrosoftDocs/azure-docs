---
title: Azure Update Manager update sources, and types
description: This article provides information on update sources, update types, Microsoft updates and Third party updates for managing updates on your Azure VMs and servers.
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 02/26/2025
ms.topic: overview
---

# Supported update sources, types, Microsoft application updates and Third party updates

This article provides detailed information on the supported update sources, update types, Microsoft application and Third party updates that can be managed using Azure Update Manager.

## Supported update sources

Azure Update Manager honors the update source settings on the machine and will fetch updates accordingly. AUM doesn't publish or provide updates.
For more information, see the  supported [update sources](workflow-update-manager.md#update-source). 

## Supported update types
The following types of updates are supported.

**Operating system updates** - Azure Update Manager supports operating system updates for both Windows and Linux.

>[!NOTE]
> Update Manager allows you to view driver updates during assessment, but does not currently support installing driver updates on your machines.

## Microsoft application updates on Windows

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

## Third party application updates

#### [Windows](#tab/third-party-win)

Update Manager relies on the locally configured update repository to update supported Windows systems, either WSUS or Windows Update. Tools such as [System Center Updates Publisher](/mem/configmgr/sum/tools/updates-publisher) allow you to import and publish custom updates with WSUS. 

This scenario allows Update Manager to update machines that use Configuration Manager as their update repository with third party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/mem/configmgr/sum/tools/install-updates-publisher).

#### [Linux](#tab/third-party-lin)

Third party application updates are supported in Azure Update Manager. If you include a specific third party software repository in the Linux package manager repository location, it's scanned when it performs software update operations. 
The package isn't available for assessment and installation if you remove it.

---

As Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).


## Next steps

- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager. 
- Learn about [security vulnerabilities and Ubuntu Pro support](security-awareness-ubuntu-support.md).
- Learn about [Extended Security Updates (ESU) using Azure Update Manager](extended-security-updates.md).

