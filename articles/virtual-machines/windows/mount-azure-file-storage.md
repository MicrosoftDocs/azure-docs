---
title: Mount Azure file storage from an Azure Windows VM | Microsoft Docs
description: Store file in the cloud with Azure file storage, and mount your cloud file share from an Azure virtual machine (VM).
documentationcenter: 
author: cynthn
manager: jeconnoc
editor: tysonn

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 01/02/2018
ms.author: cynthn

---

# Use Azure file shares with Windows VMs 

You can use Azure file shares as a way to store and access files from your VM. For example, you can store a script or an application configuration file that you want all your VMs to share. In this article, we show you how to create and mount an Azure file share, and how to upload and download files.

## Connect to a file share from a VM

This section assumes you already have a file share that you want to connect to. If you need to create one, see [Create a file share](#create-a-file-share) later in this article.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. Select a file share or click **+ File share** to create a new file share to use.
6. Click **Connect** to open a page that shows the command-line syntax for mounting the file share from Windows or Linux.
7. In **Drive letter**, select the letter that you would like to use to identify the drive.
8. Choose which syntax to use and select the copy button on the right to copy it to your clipboard. Paste it some place where you can easily access it. 
8. Connect to your VM and open a command prompt.
9. Paste in the edited connection syntax and hit **Enter**.
10. When the connection has been created, you get the message **The command completed successfully.**
11. Check the connection by typing in the drive letter to switch to that drive and then type **dir** to see the contents of the file share.



## Create a file share 
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. In the File Service page, click **+ File share**.
6. Fill in the file share name. File share names can use lowercase letters, numbers and single hyphens. The name cannot start with a hyphen and you can't use multiple, consecutive hyphens. 
7. Fill in a limit on how large the file can be, up to 5120 GB.
8. Click **OK** to create the file share.
   
## Upload files
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. Select a file share.
6. Click **Upload** to open the **Upload files** page.
7. Click on the folder icon to browse your local file system for a file to upload.   
8. Click **Upload** to upload the file to the file share.

## Download files
1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left menu, click **Storage accounts**.
3. Choose your storage account.
4. In the **Overview** page, under **Services**, select **Files**.
5. Select a file share.
6. Right-click on the file and choose **Download** to download it to your local machine.
   

## Next steps

You can also create and manage file shares using PowerShell. For more information, see [Get started with Azure File storage on Windows](../../storage/files/storage-dotnet-how-to-use-files.md).
