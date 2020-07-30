---
title: abc123
description: abc123
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 07/19/2018
ms.author: rogarana
ms.subservice: files
---

# Deploy Azure File Sync TEST
Use Azure File Sync to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

We strongly recommend that you read [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) before you complete the steps described in this article.

## Prerequisites
* An Azure file share in the same region that you want to deploy Azure File Sync. For more information, see:
    - [Region availability](storage-sync-files-planning.md#azure-file-sync-region-availability) for Azure File Sync.
    - [Create a file share](storage-how-to-create-file-share.md) for a step-by-step description of how to create a file share.
* At least one supported instance of Windows Server or Windows Server cluster to sync with Azure File Sync. For more information about supported versions of Windows Server and recommended system resources, see [Windows file server considerations](storage-sync-files-planning.md#windows-file-server-considerations).

# [Portal](#tab/azure-portal)

say something here

# [PowerShell](#tab/azure-powershell)

* The Az PowerShell module may be used with either PowerShell 5.1 or PowerShell 6+. You may use the Az PowerShell module for Azure File Sync on any supported system, including non-Windows systems, however the server registration cmdlet must always be run on the Windows Server instance you are registering (this can be done directly or via PowerShell remoting). On Windows Server 2012 R2, you can verify that you are running at least PowerShell 5.1.\* by looking at the value of the **PSVersion** property of the **$PSVersionTable** object:

    ```powershell
    $PSVersionTable.PSVersion
    ```

    If your **PSVersion** value is less than 5.1.\*, as will be the case with most fresh installations of Windows Server 2012 R2, you can easily upgrade by downloading and installing [Windows Management Framework (WMF) 5.1](https://www.microsoft.com/download/details.aspx?id=54616). The appropriate package to download and install for Windows Server 2012 R2 is **Win8.1AndW2K12R2-KB\*\*\*\*\*\*\*-x64.msu**. 

    PowerShell 6+ can be used with any supported system, and can be downloaded via its [GitHub page](https://github.com/PowerShell/PowerShell#get-powershell). 

    > [!Important]  
    > If you plan to use the Server Registration UI, rather than registering directly from PowerShell, you must use PowerShell 5.1.

* If you have opted to use PowerShell 5.1, ensure that at least .NET 4.7.2 is installed. Learn more about [.NET Framework versions and dependencies](https://docs.microsoft.com/dotnet/framework/migration-guide/versions-and-dependencies) on your system.

    > [!Important]  
    > If you are installing .NET 4.7.2+ on Windows Server Core, you must install with the `quiet` and `norestart` flags or the installation will fail. For example, if installing .NET 4.8, the command would look like the following:
    > ```PowerShell
    > Start-Process -FilePath "ndp48-x86-x64-allos-enu.exe" -ArgumentList "/q /norestart" -Wait
    > ```

* The Az PowerShell module, which can be installed by following the instructions here: [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-Az-ps).
     
    > [!Note]  
    > The Az.StorageSync module is now installed automatically when you install the Az PowerShell module.

# [Azure CLI](#tab/azure-cli)

1. [Install the Azure CLI](/cli/azure/install-azure-cli)

   If you prefer, you can also use Azure Cloud Shell to complete the steps in this tutorial.  Azure Cloud Shell is an interactive shell environment that you use through your browser.  Start Cloud Shell by using one of these methods:

   - Select **Try It** in the upper-right corner of a code block. **Try It** will open Azure Cloud Shell, but it doesn't automatically copy the code to Cloud Shell.

   - Open Cloud Shell by going to [https://shell.azure.com](https://shell.azure.com)

   - Select the **Cloud Shell** button on the menu bar at the upper right corner in the [Azure portal](https://portal.azure.com)

1. Sign in.

   Sign in using the [az login](/cli/azure/reference-index#az-login) command if you're using a local install of the CLI.

   ```azurecli
   az login
   ```

    Follow the steps displayed in your terminal to complete the authentication process.

1. Install the [az filesync](/cli/azure/ext/storagesync/storagesync) Azure CLI extension.

   ```azurecli
   az extension add --name storagesync
   ```

   After installing the **storagesync** extension reference, you will receive the following warning.

   ```output
   The installed extension 'storagesync' is experimental and not covered by customer support. Please use with discretion.
   ```

---

## Prepare Windows Server to use with Azure File Sync
For each server that you intend to use with Azure File Sync, including each server node in a Failover Cluster, disable **Internet Explorer Enhanced Security Configuration**. This is required only for initial server registration. You can re-enable it after the server has been registered.

# [Portal](#tab/azure-portal)
> [!Note]  
> You can skip this step if you're deploying Azure File Sync on Windows Server Core.

1. Open Server Manager.
2. Click **Local Server**:  
    !["Local Server" on the left side of the Server Manager UI](media/storage-sync-files-deployment-guide/prepare-server-disable-IEESC-1.PNG)
3. On the **Properties** subpane, select the link for **IE Enhanced Security Configuration**.  
    ![The "IE Enhanced Security Configuration" pane in the Server Manager UI](media/storage-sync-files-deployment-guide/prepare-server-disable-IEESC-2.PNG)
4. In the **Internet Explorer Enhanced Security Configuration** dialog box, select **Off** for **Administrators** and **Users**:  
    ![The Internet Explorer Enhanced Security Configuration pop-window with "Off" selected](media/storage-sync-files-deployment-guide/prepare-server-disable-IEESC-3.png)

# [PowerShell](#tab/azure-powershell)
To disable the Internet Explorer Enhanced Security Configuration, execute the following from an elevated PowerShell session:

```powershell
$installType = (Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\").InstallationType

# This step is not required for Server Core
if ($installType -ne "Server Core") {
    # Disable Internet Explorer Enhanced Security Configuration 
    # for Administrators
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A7-37EF-4b3f-8CFC-4F3A74704073}" -Name "IsInstalled" -Value 0 -Force
    
    # Disable Internet Explorer Enhanced Security Configuration 
    # for Users
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Active Setup\Installed Components\{A509B1A8-37EF-4b3f-8CFC-4F3A74704073}" -Name "IsInstalled" -Value 0 -Force
    
    # Force Internet Explorer closed, if open. This is required to fully apply the setting.
    # Save any work you have open in the IE browser. This will not affect other browsers,
    # including Microsoft Edge.
    Stop-Process -Name iexplore -ErrorAction SilentlyContinue
}
``` 
# [Azure CLI](#tab/azure-cli)

say something here.

---

## Deploy the Storage Sync Service 
The deployment of Azure File Sync starts with placing a **Storage Sync Service** resource into a resource group of your selected subscription. We recommend provisioning as few of these as needed. You will create a trust relationship between your servers and this resource and a server can only be registered to one Storage Sync Service. As a result, it is recommended to deploy as many storage sync services as you need to separate groups of servers. Keep in mind that servers from different storage sync services cannot sync with each other.

> [!Note]
> The Storage Sync Service inherits access permissions from the subscription and resource group it has been deployed into. We recommend that you carefully check who has access to it. Entities with write access can start syncing new sets of files from servers registered to this storage sync service and cause data to flow to Azure storage that is accessible to them.
