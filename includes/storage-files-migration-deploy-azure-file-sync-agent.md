---
title: Deploy the Azure File Sync agent
description: Deploying the Azure File Sync agent. A common text block, shared across migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

In this section, you install the Azure File Sync agent on your Windows Server instance.

The [deployment guide](../articles/storage/files/storage-sync-files-deployment-guide.md) illustrates that you need to turn off **Internet Explorer Enhanced Security Configuration**. This security measure is not applicable with Azure File Sync. Turning it off allows you to authenticate to Azure without any issues.

Open PowerShell and install the required PowerShell modules by using the following commands. Make sure to install the full module and the NuGet provider when you're prompted.

```powershell
Install-Module -Name Az -AllowClobber
Install-Module -Name Az.StorageSync
```

If you have any issues reaching the internet from your server, now is the time to solve them. Azure File Sync uses any available network connection to the internet. Requiring a proxy server to reach the internet is also supported. You can either configure a machine-wide proxy now, or specify a proxy that just Azure File Sync will use, during agent installation.

If configuring a proxy means you need to open your firewalls for this server, that might be an acceptable approach to you. At the end of the server installation, after you've completed server registration, a network connectivity report will show you the exact endpoint URLs in Azure that Azure File Sync needs to communicate with for the region you've selected. The report also tells you the reason why communication is needed. You can use the report to lock down the firewalls around this server to specific URLs.

You can also follow a more conservative approach in which you don't open the firewalls wide, but instead limit the server to communicate with higher-level DNS namespaces. For more information, see [Azure File Sync proxy and firewall settings](../articles/storage/files/storage-sync-files-firewall-and-proxy.md). Follow your own networking best practices.

At the end of the server *installation* wizard, a server *registration* wizard will open. Register the server to your Storage Sync Service's Azure resource from earlier.

These steps are described in more detail in the deployment guide, including the PowerShell modules that you should install first:
[Azure File Sync agent installation](../articles/storage/files/storage-sync-files-deployment-guide.md).

Use the latest agent. You can download it from the Microsoft Download Center:
[Azure File Sync Agent](https://aka.ms/AFS/agent "Azure File Sync Agent download").

After a successful installation and server registration, you can check that you have successfully completed this step. Go to the Storage Sync Service resource in the Azure portal, and then follow the left menu to **Registered servers**. You'll see your server listed there.
