---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 2/20/2020
ms.author: kendownie
ms.custom: include file
---

In this section, you install the Azure File Sync agent on your Windows Server instance.

The [deployment guide](../articles/storage/file-sync/file-sync-deployment-guide.md) explains that you need to turn off **Internet Explorer Enhanced Security Configuration**. This security measure isn't applicable with Azure File Sync. Turning it off allows you to authenticate to Azure without any problems.

Open PowerShell. Install the required PowerShell modules by using the following commands. Be sure to install the full module and the NuGet provider when you're prompted to do so.

```powershell
Install-Module -Name Az -AllowClobber
Install-Module -Name Az.StorageSync
```

If you have any problems reaching the internet from your server, now is the time to solve them. Azure File Sync uses any available network connection to the internet. Requiring a proxy server to reach the internet is also supported. You can either configure a machine-wide proxy now or, during agent installation, specify a proxy that only Azure File Sync will use.

If configuring a proxy means you need to open your firewalls for the server, that approach might be acceptable to you. At the end of the server installation, after you've completed server registration, a network connectivity report will show you the exact endpoint URLs in Azure that Azure File Sync needs to communicate with for the region you've selected. The report also tells you why communication is needed. You can use the report to lock down the firewalls around the server to specific URLs.

You can also take a more conservative approach in which you don't open the firewalls wide. You can instead limit the server to communicate with higher-level DNS namespaces. For more information, see [Azure File Sync proxy and firewall settings](../articles/storage/file-sync/file-sync-firewall-and-proxy.md). Follow your own networking best practices.

At the end of the server installation wizard, a server registration wizard will open. Register the server to your Storage Sync Service's Azure resource from earlier.

These steps are described in more detail in the deployment guide, which includes the PowerShell modules that you should install first:
[Azure File Sync agent installation](../articles/storage/file-sync/file-sync-deployment-guide.md).

Use the latest agent. You can download it from the Microsoft Download Center:
[Azure File Sync Agent](https://aka.ms/AFS/agent "Azure File Sync Agent download").

After a successful installation and server registration, you can confirm that you've successfully completed this step. Go to the Storage Sync Service resource in the Azure portal. In the left menu, go to **Registered servers**. You'll see your server listed there.
