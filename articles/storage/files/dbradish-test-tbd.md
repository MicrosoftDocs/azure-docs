---
title: Deploy Azure File Sync | Microsoft Docs
description: Learn how to deploy Azure File Sync, from start to finish.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 07/19/2018
ms.author: rogarana
ms.subservice: files
---

# Deploy Azure File Sync
Use Azure File Sync to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

We strongly recommend that you read [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) before you complete the steps described in this article.

## Prerequisites
* An Azure file share in the same region that you want to deploy Azure File Sync. For more information, see:
    - [Region availability](storage-sync-files-planning.md#azure-file-sync-region-availability) for Azure File Sync.
    - [Create a file share](storage-how-to-create-file-share.md) for a step-by-step description of how to create a file share.
* At least one supported instance of Windows Server or Windows Server cluster to sync with Azure File Sync. For more information about supported versions of Windows Server and recommended system resources, see [Windows file server considerations](storage-sync-files-planning.md#windows-file-server-considerations).

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
