---
title: Install the Azure VM Agent in offline mode | Microsoft Docs
description: Learn how to install the Azure VM Agent in offline mode.
services: virtual-machines-windows
documentationcenter: ''
author: genlin
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 10/31/2018
ms.author: genli

---
# Install the Azure Virtual Machine Agent in offline mode 

The Azure Virtual Machine Agent (VM Agent) provides useful features, such as local administrator password reset and script pushing. This article shows you how to install the VM Agent for an offline Windows virtual machine (VM). 

## When to use the VM Agent in offline mode

Install the VM Agent in offline mode in the following scenarios:

- The deployed Azure VM doesn't have the VM Agent installed or the agent isn't working.
- You forgot the administrator password for the VM or you can't access the VM.

## How to install the VM Agent in offline mode

Use the following steps to install the VM Agent in offline mode.

> [!NOTE]
> You can automate the process of installing the VM Agent in offline mode.
> To do this, use the [Azure VM Recovery Scripts](https://github.com/Azure/azure-support-scripts/blob/master/VMRecovery/ResourceManager/README.md). If you choose to use the Azure VM Recovery Scripts, you can use the following process:
> 1. Skip step 1 by using the scripts to attach the OS disk of the affected VM to a recovery VM.
> 2. Follow steps 2–10 to apply the mitigations.
> 3. Skip step 11 by using the scripts to rebuild the VM.
> 4. Follow step 12.

### Step 1: Attach the OS disk of the VM to another VM as a data disk

1.  Delete the VM. Be sure to select the **Keep the disks** option when you delete the VM.

2.  Attach the OS disk as a data disk to another VM (known as a _troubleshooter_ VM). For more information, see [Attach a data disk to a Windows VM in the Azure portal](../windows/attach-managed-disk-portal.md).

3.  Connect to the troubleshooter VM. Open **Computer management** > **Disk management**. Confirm that the OS disk is online and that drive letters are assigned to the disk partitions.

### Step 2: Modify the OS disk to install the Azure VM Agent

1.  Make a remote desktop connection to the troubleshooter VM.

2.  On the OS disk that you attached, browse to the \windows\system32\config folder. Copy all of the files in this folder as a backup, in case a rollback is required.

3.  Start the **Registry Editor** (regedit.exe).

4.  Select the **HKEY_LOCAL_MACHINE** key. On the menu, select **File** > **Load Hive**:

    ![Load the hive](./media/install-vm-agent-offline/load-hive.png)

5.  Browse to the \windows\system32\config\SYSTEM folder on the OS disk that you attached. For the name of the hive, enter **BROKENSYSTEM**. The new registry hive is displayed under the **HKEY_LOCAL_MACHINE** key.

6.  Browse to the \windows\system32\config\SOFTWARE folder on the OS disk that you attached. For the name of the hive software, enter **BROKENSOFTWARE**.

7. If the Attached OS disk has the VM agent installed, perform a backup of the current configuration. If it does not have VM agent installed, move to the next step.
      
    1. Rename the \windowsazure folder to \windowsazure.old.

    2. Export the following registries:
        - HKEY_LOCAL_MACHINE\BROKENSYSTEM\ControlSet001\Services\WindowsAzureGuestAgent
        - HKEY_LOCAL_MACHINE\BROKENSYSTEM\\ControlSet001\Services\WindowsAzureTelemetryService
        - HKEY_LOCAL_MACHINE\BROKENSYSTEM\ControlSet001\Services\RdAgent

8.	Use the existing files on the troubleshooter VM as a repository for the VM Agent installation. Complete the following steps:

    1. From the troubleshooter VM, export the following subkeys in registry format (.reg): 
        - HKEY_LOCAL_MACHINE  \SYSTEM\ControlSet001\Services\WindowsAzureGuestAgent
        - HKEY_LOCAL_MACHINE  \SYSTEM\ControlSet001\Services\WindowsAzureTelemetryService
        - HKEY_LOCAL_MACHINE  \SYSTEM\ControlSet001\Services\RdAgent

          ![Export the registry subkeys](./media/install-vm-agent-offline/backup-reg.png)

    2. Edit the registry files. In each file, change the entry value **SYSTEM** to **BROKENSYSTEM** (as shown in the following images) and save the file. Remember the **ImagePath** of the current VM agent. We will need to copy the corresponding folder to the attached OS disk. 

        ![Change the registry subkey values](./media/install-vm-agent-offline/change-reg.png)

    3. Import the registry files into the repository by double-clicking each registry file.

    4. Confirm that the following three subkeys are successfully imported into the **BROKENSYSTEM** hive:
        - WindowsAzureGuestAgent
        - WindowsAzureTelemetryService
        - RdAgent

    5. Copy the installation folder of the current VM Agent to the attached OS disk: 

        1.	On the OS disk that you attached, create a folder named WindowsAzure in the root path.

        2.	Go to C:\WindowsAzure on the troubleshooter VM, look for any folder with the name C:\WindowsAzure\GuestAgent_X.X.XXXX.XXX. Copy the GuestAgent folder that has latest version number from C:\WindowsAzure to the WindowsAzure folder in the attached OS disk. If you are not sure which folder should be copied, copy all GuestAgent folders. The following image shows an example of the GuestAgent folder that is copied to the attached OS disk.

             ![Copy GuestAgent folder](./media/install-vm-agent-offline/copy-files.png)

9.  Select **BROKENSYSTEM**. From the menu, select **File** > **Unload Hive**​.

10.  Select **BROKENSOFTWARE**. From the menu, select **File** > **Unload Hive**​.

11.  Detach the OS disk, and then recreate the VM by using the OS disk.

12.  Access the VM. Notice that the RdAgent is running and the logs are being generated.

If you created the VM by using the Resource Manager deployment model, you're done.

### Use the ProvisionGuestAgent property for classic VMs

If you created the VM by using the classic model, use the Azure PowerShell module to update the **ProvisionGuestAgent** property. The property informs Azure that the VM has the VM Agent installed.

To set the **ProvisionGuestAgent** property, run the following commands in Azure PowerShell:

   ```powershell
   $vm = Get-AzureVM –ServiceName <cloud service name> –Name <VM name>
   $vm.VM.ProvisionGuestAgent = $true
   Update-AzureVM –Name <VM name> –VM $vm.VM –ServiceName <cloud service name>
   ```

Then run the `Get-AzureVM` command. Notice that the **GuestAgentStatus** property is now populated with data:

   ```powershell
   Get-AzureVM –ServiceName <cloud service name> –Name <VM name>
   GuestAgentStatus:Microsoft.WindowsAzure.Commands.ServiceManagement.Model.PersistentVMModel.GuestAgentStatus
   ```

## Next steps

- [Azure Virtual Machine Agent overview](../extensions/agent-windows.md)
- [Virtual machine extensions and features for Windows](../extensions/features-windows.md)
