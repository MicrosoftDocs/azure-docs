---
title: Share a Windows folder with Azure IoT Edge for Linux on Windows | Microsoft Docs
description: How to share a Windows folder with the Azure IoT Edge for Linux on Windows virtual machine
author: PatAltimore
ms.reviewer: fcabrera
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 11/1/2022
ms.author: patricka
---

# Share a Windows folder with Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The Azure IoT Edge for Linux on Windows (EFLOW) virtual machine is isolated from the Windows host OS and the virtual machine doesn't have access to the host file system. By default, the EFLOW virtual machine has its own file system and has no access to the folders or files on the host computer. The *EFLOW file and folder sharing mechanism* provides a way to share Windows files and folders to the CBL-Mariner Linux EFLOW VM.  

This article shows you how to enable the folder sharing between the Windows host OS and the EFLOW virtual machine. 

## Prerequisites
- Azure IoT Edge for Linux on Windows 1.4.4 LTS update or higher. For more information about EFLOW release notes, see [EFLOW Releases](https://aka.ms/AzEFLOW-Releases).
- A machine with an x64/x86 processor.
- Windows 10/11 (21H2) or higher with [November 2022](https://support.microsoft.com/en-us/topic/november-15-2022-kb5020030-os-builds-19042-2311-19043-2311-19044-2311-and-19045-2311-preview-237a9048-f853-4e29-a3a2-62efdbea95e2) update applied.

If you don't have an EFLOW device ready, you should create one before continuing with this guide. Follow the steps in [Create and provision an IoT Edge for Linux on Windows device using symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md) to install, deploy and provision EFLOW.

## How it works?

The Azure IoT Edge for Linux on Windows file and folder sharing mechanism is implemented using [virtiofs](https://virtio-fs.gitlab.io/) technology. *Virtiofs* is a shared file system that lets virtual machines access a directory tree on the host OS. Unlike other approaches, it's designed to offer local file system semantics and performance. *Virtiofs* isn't a network file system repurposed for virtualization. It's designed to take advantage of the locality of virtual machines and the hypervisor. It takes advantage of the virtual machine's co-location with the hypervisor to avoid overhead associated with network file systems.

:::image type="content" source="media/how-to-share-windows-folder-to-vm/folder-sharing-virtiofs.png" alt-text="Screenshot of a Windows folder shared with the EFLOW virtual machine using Virtio-FS technology.":::

Only Windows folders can be shared to the EFLOW Linux VM and not the other way. Also, for security reasons, when setting the folder sharing mechanism, the user must provide a _root folder_ and all the shared folders must be under that _root folder_. 

Before starting with the adding and removing share mechanisms, let's define four concepts:

- **Root folder**: Windows folder that is the root path containing subfolders to be shared to the EFLOW VM. The root folder isn't shared to the EFLOW VM. Only the subfolders under the root folder are shared to the EFLOW VM.
- **Shared folder**: A Windows folder that's under the _root folder_ and is shared with the EFLOW VM. All the content inside this folder is shared with the EFLOW VM.
- **Mounting point**: Path inside the EFLOW VM where the Windows folder content is placed. 
- **Mounting option**: *Read-only* or *read and write* access. Controls the file access of the mounted folder inside the EFLOW VM. 

## Add shared folders
The following steps provide example EFLOW PowerShell commands to share one or more Windows host OS folders with the EFLOW virtual machine. 

>[!NOTE]
>If you're using Windows 10, ensure to reboot your Windows host OS after your fresh MSI instlalation or update before adding the Windows shared folders to the EFLOW VM.

1. Start by creating a new root shared folder. Go to **File Explorer** and choose a location for the *root folder* and create the folder. 

   For example, create a *root folder* under _C:\Shared_ named **EFLOW-Shared**.

   :::image type="content" source="media/how-to-share-windows-folder-to-vm/root-folder.png" alt-text="Screenshot of the Windows root folder.":::

1. Create one or more *shared folders* to be shared with the EFLOW virtual machine. Shared folders should be created under the *root folder* from the previous step. 

   For example, create two folders one named **Read-Access** and one named **Read-Write-Access**. 

   :::image type="content" source="media/how-to-share-windows-folder-to-vm/shared-folders.png" alt-text="Screenshot of Windows shared folders.":::

1. Within the _Read-Access_ shared folder, create a sample file that we'll later read inside the EFLOW virtual machine.

    For example, using a text editor, create a file named _Hello-World.txt_ within the _Read-Access_ folder and save some text in the file.

1. Using a text editor, create the shared folder configuration file. This file contains the information about the folders to be shared with the EFLOW VM including the mounting points and the mounting options. For more information about the JSON configuration file, see [PowerShell functions for IoT Edge for Linux on Windows](reference-iot-edge-for-linux-on-windows-functions.md).

    For example, using the previous scenario, we'll share the two *shared folders* we created under the *root folder*. 
    - _Read-Access_ shared folder will be mounted in the EFLOW virtual machine under the path _/tmp/host-read-access_ with *read-only* access.
    - _Read-Write-Access_ shared folder will be mounted in the EFLOW virtual machine under the path _/tmp/host-read-write-access_ with *read and write* access.

    Create the JSON configuration file named **sharedFolders.json** within the *root folder* *EFLOW-Shared* with the following contents:

    ```json
    [
        {
            "sharedFolderRoot": "C:\\Shared\\EFLOW-Shared",
            "sharedFolders": [
                {   
                    "hostFolderPath": "Read-Access", 
                    "readOnly": true, 
                    "targetFolderOnGuest": "/tmp/host-read-access" 
                },
                {   
                    "hostFolderPath": "Read-Write-Access", 
                    "readOnly": false, 
                    "targetFolderOnGuest": "/tmp/host-read-write-access" 
                }
            ]
        }
    ]
    ```

1. Open an elevated _PowerShell_ session by starting with **Run as Administrator**.

1. Create the shared folder assignation using the configuration file (_sharedFolders.json_) previously created.

    ```powershell
    Add-EflowVmSharedFolder -sharedFoldersJsonPath "C:\Shared\EFLOW-Shared\sharedFolders.json"
    ```  

1. Once the cmdlet finished, the EFLOW virtual machine should have access to the shared folders. Connect to the EFLOW virtual machine and check the folders are correctly shared.
    ```powershell
    Connect-EflowVm
    ``` 

1. Go to the _Read-Access_ shared folder (mounted under _/tmp/host-read-access_) and check the content of the _Hello-World.txt_ file.
    
    >[!NOTE]
    >By default, all shared folders are shared under *root* ownership. To access the folder, you should log in as root using `sudo su` or change the folder ownership to *iotedge-user* using `chown` command.
    
    ```bash
    sudo su
    cd /tmp/host-read-access
    cat Hello-World.txt
    ```
If everything was successful, you should be able to see the contents of the _Hello-World.txt_ file within the EFLOW virtual machine. Verify write access by creating a file inside the _/tmp/host-read-write-access_ and then checking the contents of the new created file inside the _Read-Write-Access_ Windows host folder. 

## Check shared folders
The following steps provide example EFLOW PowerShell commands to check the Windows shared folders and options (access permissions and mounting point) with the EFLOW virtual machine.

1. Open an elevated PowerShell session by starting with **Run as Administrator**.

1. List the information of the Windows shared folders under the *root folder*.
    For example, using the scenario in the previous section, we can list the information of both _Read-Access_ and _Read-Write-Access_ shared folders. 
    ```powershell
    Get-EflowVmSharedFolder -sharedfolderRoot "C:\Shared\EFLOW-Shared" -hostFolderPath @("Read-Access", "Read-Write-Access")
    ``` 

For more information about the `Get-EflowVmSharedFolder` cmdlet, see [PowerShell functions for IoT Edge for Linux on Windows](reference-iot-edge-for-linux-on-windows-functions.md).


## Remove shared folders
The following steps provide example EFLOW PowerShell commands to stop sharing a Windows shared folder with the EFLOW virtual machine. 

1. Open an elevated PowerShell session by starting with **Run as Administrator**.

1. Stop sharing the folder named _Read-Access_ under the **Root folder** with the EFLOW virtual machine.
    ```powershell
    Remove-EflowVmSharedFolder -sharedfolderRoot "C:\Shared\EFLOW-Shared" -hostFolderPath "Read-Access"
    ``` 

For more information about the `Remove-EflowVmSharedFolder` cmdlet, see [PowerShell functions for IoT Edge for Linux on Windows](reference-iot-edge-for-linux-on-windows-functions.md).

## Next steps
Follow the steps in [Common issues and resolutions for Azure IoT Edge for Linux on Windows](troubleshoot-iot-edge-for-linux-on-windows-common-errors.md) to troubleshoot any issues encountered when setting up IoT Edge for Linux on Windows.
