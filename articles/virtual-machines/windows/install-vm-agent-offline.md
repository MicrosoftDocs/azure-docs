---
title: Reset the password or Remote Desktop configuration on a Windows VM | Microsoft Docs
description: Learn how to reset an account password or Remote Desktop services on a Windows VM using the Azure portal or Azure PowerShell.
services: virtual-machines-windows
documentationcenter: ''
author: genlin
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 45c69812-d3e4-48de-a98d-39a0f5675777
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 01/26/2018
ms.author: genli

---
# Install the VM Agent in Offline mode

The VM agent provides useful features likes local administrator
password reset, and script push. This article shows how to install the
VM Agent for a VM that is offline.

## Detail steps

**Step 1: Attach the OS disk of the VM to another (troubleshooter) VM as
a data disk**

1.  Delete the VM. Make sure that you select the **Keep the disks**
    option when you do this.

2.  Attach the OS disk as a data disk to another VM (a
    troubleshooting VM). For more information, see [How to attach a data
    disk to a Windows VM in the Azure
    portal](attach-managed-disk-portal.md)

3.  Connect to the troubleshooting VM. Open **Computer management** &gt;
    **Disk management**. Make sure that the OS disk is online and that
    its partitions have drive letters assigned.

**Step 2: Modify the registry hive on the OS disk**

1.  Remote desktop to the troubleshoot VM.

2.  On the OS disk you attached, navigate to
    **\\windows\\system32\\config**. Copy all the files as a backup in
    case a rollback is required.

3.  Open Registry Editor (regedit.exe).

4.  Click the **HKEY_LOCAL_MACHINE** key, and then select
    **File&gt;Load Hive** on the menu.

5.  Navigate to **\windows\system32\config\SYSTEM** on the OS disk
    you attached, type BROKENSYSTEM as the name for the hive. After you do this, you will see the registry hive under
    **HKEY_LOCAL_MACHINE **

6.  Navigate to **\windows\system32\config\SOFTWARE** on the OS disk
    you attached, type BROKENSOFTWARE as the name for the hive.

7.  If you have a current version of the agent that is not working,
    perform a backup of the current configuration. If the VM does not
    have VM agent installed, move to the next step.  
      
    1. Rename the folder \windowsazure to \windowsazure.old

    2. Export the following registries

        - HKEY_LOCAL_MACHINE\BROKENSYSTEM\ControlSet001\Services\WindowsAzureGuestAgent
        
        - HKEY_LOCAL_MACHINE
        \BROKENSYSTEM\\ControlSet001\Services\WindowsAzureTelemetryService
        
        - HKEY_LOCAL_MACHINE\BROKENSYSTEM\ControlSet001\Services\RdAgent

**Step 3: Use the existing files on the troubleshooting VM as a repository for the VM agent installation**

   
1.  Copy the VM agent folder from C:\windowsazure\packages
    to the <OS disk you attached>:\windowsazure\packages 
      
    Note: Don’t copy the logs folder as we need fresh new logs, which
    will be generated after service starts.

3.  Click BROKENSYSTEM and select File > Unload Hive​ from the menu.

4.  Click BROKENSOFTWARE and select File > Unload Hive​ from the menu

5.  Detach the disk and recreate the VM by using the OS disk.

6.  Now if you access the VM you will see the RDAgent running and the
    logs getting created.

7.  If this is an CRP machine you are done but if this is an RDFE
    machine, you must also use Azure PowerShell to update the
    ProvisionGuestAgent property so Azure knows the VM has the
    agent installed. To accomplish this, proceed with the following from
    Azure Powershell:

        $vm = Get-AzureVM –ServiceName <cloud service name> –Name <VM name>
        $vm.VM.ProvisionGuestAgent = $true
        Update-AzureVM –Name <VM name> –VM $vm.VM –ServiceName <cloud service name>

    Now if you run Get-AzureVM again, the GuestAgentStatus property should be populated instead of blank:

        Get-AzureVM –ServiceName <cloud service name> –Name <VM name>
        GuestAgentStatus:Microsoft.WindowsAzure.Commands.ServiceManagement.Model.PersistentVMModel.GuestAgentStatus