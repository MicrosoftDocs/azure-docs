---
title: How to Use DFS-N with Azure Files
description: Common DFS-N use cases with Azure Files
author: mtalasila
ms.service: storage
ms.topic: how-to
ms.date: 1/20/2020
ms.author: mtalasila
ms.subservice: files
ms.topic: how-to
---

# Using DFS-N with Azure Files

## DFS-N Overview
 DFS-N (DFS Namespaces) is a role in Windows Server that enables you to group shared folders located on different servers into logically structured namespaces. If the data in a shared folder is located on a different server, the folder becomes a reparse point that redirects to the folder with the data on a different server (folder target). For more details about DFS-N, please see [DFS Namespaces overview] (https://docs.microsoft.com/windows-server/storage/dfs-namespaces/dfs-overview). 

[![Demo on how to set up DFS-N with Azure Files - click to play!](./media/storage-files-dfsn/video-snapshot-dfsn.png)](https://www.youtube.com/watch?v=KG0OX0RgytI). 
> [!NOTE]
> Skip to 10:10 in the video to see how to set up DFS-N.  


## Common Use Cases
DFS-N has 4 major use cases with Azure Files. 

1. Using an alternate name (ex: an existing file server name) to mount your file share
2. Having the ability to establish a cache of data next to your users but keep UNC paths the same across branch offices
3. Circumventing folder size or server space limitations
4. Active Directory integration with DFS-N
	
### Use Case 1: Using an alternate name (ex: an existing file server name) to mount your file share

1. Go to your DFS-N server. If this is a Windows VM, install the DFS-N role via Server Manager.
	
2. Add some registry entries to enable the root consolidation feature:

    1. Open an elevated PowerShell session
    1. Run the following commands:
        ```powershell
        new-item -Type Registry HKLM:SYSTEM\CurrentControlSet\Services\Dfs
        
        new-item -Type Registry HKLM:SYSTEM\CurrentControlSet\Services\Dfs\Parameters
    		
        new-item -Type Registry HKLM:SYSTEM\CurrentControlSet\Services\Dfs\Parameters\Replicated
    	
        new-itemproperty HKLM:SYSTEM\CurrentControlSet\Services\Dfs\Parameters\Replicated ServerConsolidationRetry -Value 1
        ```
3. Now that you enabled the root consolidation feature, you must have the new server take over the name of your old server.
	1. Create an A record for the old server and assign it to the IP address of the new server.
	1. Create a new namespace. Under **"Enter the name of the server that will host the namespace"**, enter your DFS-N server name. Select **"Next"**. Then, under **"Enter a name for the namespace"**, enter **#[old server name]**. Select **"Next"**. Select a **standalone namespace**, because the root consolidation feature only works with a standalone namespace. Select **"Next"**. Select **"Create"**.
4. Navigate into your newly created namespace and create a folder target for your share.
	1. Add the path to your storage account as: **\\\\[FQDN]\\[share name]**

5. Now, to test this out, open your client-side file explorer, enter the name of your old server and the share you want to access as: **\\\\[old server name]\\[share name]**
	1. You should be able to see any files that you may have within that specific file share!

### Use Case 2: Having the ability to establish a cache of data next to your users but keep UNC paths the same across branch offices

DFS-N is useful in scenarios like this because it lets you have multiple folder targets for each share. 

To add a folder target by using DFS Management, use the following procedure:
1. Click **Start**, point to **Administrative Tools**, and then click **DFS Management**.
2. In the console tree, under the Namespaces node, right-click a folder, and then click **Add Folder Target**.
3. Type the path to the folder target or click **Browse** to locate the folder target. Add as many folder targets as you would like. 
		a. To create a folder target for your Azure file share, when adding a new folder target, add the path to your storage account as: **\\\\[FQDN]\\[share name]**.

### Use Case 3: Circumventing file share size limitations

DFS-N is beneficial if you have size/space limitations on a folder or server. You can store overflowing folders on another server or in Azure Files and add a folder target. This way, you can still maintain a single namespace while circumventing size/space limitations. 

> [!NOTE]
> If you do not already have DFS-N set up, please see the video at the top of this page and skip to 10:10.  

1. Change the folders you plan to migrate to read-only access. This is to avoid data loss during migration.
2. Migrate all the data in those chosen folders to new file share(s) in Azure Files.
3. In the console tree, under the Namespaces node, right-click each folder target, and then click **Add Folder Target**.
4. For each folder you chose to migrate, add the path to your storage account as: **\\\\[FQDN]\\[share name]**. This effectively converts these folders to reparse points. 
5. Add back read-write access, if desired.

### Use Case 4: AD integration with DFS-N

1. Ensure that the storage account with the file shares you want to add as targets has the appropriate identity-based access option enabled.
	1. If you are using **Azure AD** - Go to your storage account, click on **Configuration** under Settings in the side navigation, and click on **Enabled** under Azure Active Directory Domain Services. 
	2. If you are using **on-premises AD** - see [Enable AD DS authentication to Azure file shares](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-identity-ad-ds-enable).
2. Go to your DFS-N server. If this is a Windows VM, install the DFS-N role via Server Manager if you haven't already.
3. Create a new namespace. Choose **domain-based namespace** and follow the wizard's instructions. 
4. In the console tree, under the Namespaces node, right-click each folder target, and then click **Add Folder Target**.
5. Type the path to the folder target, or click **Browse** to locate the folder target. Add as many folder targets as you would like. 
	1. To create a folder target for your Azure file share, when adding a new folder target, add the path to your storage account as: **\\\\[FQDN]\\[share name]**.
