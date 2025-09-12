---
title: Application Installation on RemoteApp Virtual Machine
titleSuffix: Azure Virtual Enclaves
description: Application Installation on RemoteApp Virtual Machine.
author: aserfass-msft
ms.author: aserfass
ms.topic: overview
ms.date: 04/08/2025
---

# Application installation using RemoteApp Virtual Machine

Install an application via RemoteAppVM Template

The application installation scripting supports the following scenarios:

  - The most common use case for the RemoteApp app installation is to deploy remote applications that can be accessed from an Azure Virtual Destop.
  - Install customer prerequisites such as cyber security and monitoring agents.
  - Script configuration changes for compliance or application setup.

  > [!NOTE] 
  > 
  > This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.


## Prerequisites
The RemoteApp template supports scripting to automate the process of installing applications and configuring the VM. Before you can start using the RemoteAppVM app installation, you need to make sure you have the following:
- You need a [community](./what-community.md), [enclave](./what-enclave.md), [workload](./what-workload.md), and at least one [workload resource group](./what-workload.md#workload-resource-group) and permissions to create resources inside the workload resource group.
- Enable `Advanced` [maintenance mode](./maintenance-mode.md) for your enclave so you can add the Private Link resources to your enclave managed resource group.
- A [container](/azure/storage/blobs/blob-containers-portal) (artifacts) within the [storage account](./deploy-storage-account-service-catalog.md).
- A [community endpoint](./create-community-endpoint-portal.md) to the storage account and AzToolBox.
- A copy of AzCopy.exe
    1. Get AzCopy from the [AzToolBox](./application-deployment-using-remote-app-vm.md). Create a [community endpoint](./create-community-endpoint-portal.md) to the storage account and AzToolBox.
    2. Use my copy of [AzCopy.exe](/azure/storage/common/storage-use-azcopy-v10#download-azcopy) in my Storage Account/Container.
        - Upload the AzCopy installer to the storage account at the same level as your app folder.
        - File Structure: 
            ```md
                - storage account
                    - artifacts container
                        - app folder
                        - azcopy.exe 
            ```
        ![Screenshot showing storage container organization structure.](./media/remoteapp-container-artifacts.png)

        - The picture shows multiple app folders can be in the same container and utilize the same copy of AzCopy.exe.
- [Enclave connections](./create-enclave-connection-portal.md) to the previously made community endpoints using IP groups `(enclave-name}`-ipg-eas and another at `{enclave-name}`-ipg-mgmt-vms.

![Screenshot showing example community endpoint rules.](./media/remoteapp-community-endpoint-rules.png)

> [!NOTE]
> 
> If the storage account is in a different enclave, create an [enclave endpoint](./create-enclave-endpoint-portal.md) in the enclave with the storage account and [enclave connection](./create-enclave-connection-portal.md) to that storage account.


### Azure Resources Deployed

- RemoteApp example VM
  - NIC
  - WindowsVM 
  - Windows VM Extension


### Software Deployed

- Windows
- Application of your choice

## Installation 

### Setup Storage Account
1. Add app folder to container within storage account
![Diagram showing method of installation within the same enclave.](./media/remoteapp-install-inside-storage-account-enclave.png)
![Diagram showing method of installation outside enclave that contains the storage account.](./media/remoteapp-install-outside-storage-account-enclave.png)
    - File Structure:
        ```md
            - artifacts container
                - app folder
                    - app installer
                    - main script to install app
                    - (optional) additional scripts
                    - (optional) azcopy.exe
        ```
2. Download [Vscode.exe file](https://code.visualstudio.com/sha/download?build=stable&os=win32-x64) and upload the installer (.exe file) into the app folder
3. Upload `main.ps1` script, using whichever version of VS Code you installed into the app folder:
    ```
        # Main powershell script that installs the application

        Start-Process 'C:/vscode/VSCodeSetup-x64-{version}.exe' -Argument "/VERYSILENT /MERGETASKS=!runcode"
    ```

### Setup Template
1. On the workload overview page, select `+Add an Azure Service`.

![Screenshot showing workload overview page.](./media/workload-overview.png)

2. For `Service`, select `RemoteApp VM`.
3. For `Version`, if not selected by default, select the most recent version (for example: 1.0.0(latest)).

![Screenshot showing RemoteApp VM selected from the service catalog list.](./media/service-catalog-list-virtual-machine.png)

4. Select `Next`
5. Basics Tab:
    - For `Virtual Machine name`, input the name of the VM.
    - For  `Admin username` and `Admin password`, input the username and password you use to log into your VM.
6. App Tab:
    - For `App folder URI`, input the URI to the container. Select on an artifact within the container, copy its URI, **remove everything** after the folder name in the URI.
        ![Screenshot showing the application folder URI for use in this deployment.](./media/remoteapp-vm-app-folder-uri.png)

        | Original URI | Fixed URI |
        |--|--|
        | https://`<storage-account>`.blob.core.windows.net/`<container-name>`/`<folder-name>`/`<script>`.ps1 | https://`<storage-account>`.blob.core.windows.net/`<container-name>`/`<folder-name>` |

    - Example:
        - storageaccountexample.blob.core.windows.net/artifacts/vscode
    - For `Main Script` input the name (ex: main.ps1) of the script that installs the application.

    ![Screenshow showing the App tab during a RemoteApp VM deployment.](./media/remoteapp-app-tab.png)

### Private Container:

1. For `App folder in private container` select `true` to allow `reader` role access to the storage account via the Virtual Machine. 
2. For `Storage container resource id` get the following three parts: `<storage-account-resource-id>` + '/blobServices/default/containers/' + `<container-name>`.
    - To get `Storage container resource id`, from the storage account, select "Overview," select "JSON View" in the far right corner, copy the storage account resource ID.

    ![Screenshot of account resource id for use in this deployment.](./media/remoteapp-storage-account-resource-id.png)

    - For the container name, copy the name of the private container that holds the artifacts.
    - Example storage container resource ID: `subscriptions/000000a0-a0a0-000a-00a0-0000aaa0a000/resourceGroups/providers/Microsoft.Storage/storageAccounts/storage-account-example/blobServices/default/containers/container-name`
3. If the parameter `AzCopy File URI` is displayed, add the URI to the azcopy.exe from the container
    - Select on the file, and copy its URL:

    ![Screenshot showing storage container organization structure with azcopy.exe file.](./media/remoteapp-container-artifacts.png)
    
    ![Screenshot showing the URI for the azcopy.exe file.](./media/remoteapp-azcopy-container-uri.png)

Example Private Container Parameters:

![Screenshot showing the App tab parameters completed.](./media/remoteapp-tab-parameters.png)

4. Select `Review and Create`, if validations pass, select `Create`.
5. Once resources are deployed, check to see if app is installed on application VM by connecting to the Application VM. [Connect to the Application VM](./deploy-remoteapp-vm-service-catalog.md#connect-to-the-application-vm)

## WinGet Installation

Folder Structure:
```
- artifacts container
    - WinGet app folder ('winget')
        - WinGet installer ('Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle')
        - Windows UI Library ('Microsoft.UI.Xaml.2.8.x64.appx')
        - main script to schedule install ('main.ps1')
        - script to install and schedule reboot('install_winget.ps1')
        - ('restart.ps1')
```
[ ![Screenshot showing the artifacts needed to install winget onto the RemoteApp to then install and manage other applications using winget.](./media/remoteapp-winget-folder.png) ](./media/remoteapp-winget-folder.png#lightbox)

1. Download installers and upload them to the winget folder in storage container
    1. WinGet MSIX bundle ([Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle](https://github.com/microsoft/winget-cli/releases/tag/v1.8.1911))
    2. Windows UI Library ([Microsoft.UI.Xaml.2.8.x64.appx](https://github.com/microsoft/microsoft-ui-xaml/releases/tag/v2.8.6))
2. Create and upload scripts
    1. main.ps1
        ```
        # This script creates and runs a scheduled task to install the appx package and msix bundle with elevated privileges

        $installScriptPath = "C:\winget\install_winget.ps1"

        # Create a scheduled task action to run the installation script with elevated permissions
        $taskAction = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-ExecutionPolicy Bypass -File $installScriptPath"

        # Set the task to start 30 seconds from now
        $taskTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddSeconds(30)
        $taskPrincipal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

        # Register the scheduled task
        Register-ScheduledTask -TaskName "InstallWinget" -Action $taskAction -Trigger $taskTrigger -Principal $taskPrincipal
        ```
    2. install_winget.ps1
        ```
        Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

        Start-Process -FilePath "DISM.exe" -ArgumentList "/Online /Add-ProvisionedAppxPackage /PackagePath:C:\winget\Microsoft.UI.Xaml.2.8.x64.appx /SkipLicense" -NoNewWindow -Wait
        Start-Process -FilePath "DISM.exe" -ArgumentList "/Online /Add-ProvisionedAppxPackage /PackagePath:C:\winget\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle /SkipLicense" -NoNewWindow -Wait

        $wingetDir = 'C:\Program Files\WindowsApps\Microsoft.DesktopAppInstaller_1.23.1791.0_x64__8wekyb3d8bbwe'
        $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
        [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$wingetDir", [System.EnvironmentVariableTarget]::Machine)

        # Schedule the reboot script
        $rebootScriptPath = "C:\winget\reboot.ps1"
        $taskAction = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-ExecutionPolicy Bypass -File $rebootScriptPath"

        # Set the task to start 30 seconds from now
        $taskTrigger = New-ScheduledTaskTrigger -Once -At ((Get-Date).AddSeconds(30))
        $taskPrincipal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

        # Register the scheduled task
        Register-ScheduledTask -TaskName "Reboot" -Action $taskAction -Trigger $taskTrigger -Principal $taskPrincipal
        ```
    3.  restart.ps1
        ```
        Restart-Computer -Force
        ```
3. Proceed to [Deploy Template](#setup-template)
