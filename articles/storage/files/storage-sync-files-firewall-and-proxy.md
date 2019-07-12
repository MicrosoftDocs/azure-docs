---
title: Azure File Sync on-premises firewall and proxy settings | Microsoft Docs
description: Azure File Sync on-premises network configuration
services: storage
author: roygara
ms.service: storage
ms.topic: article
ms.date: 06/24/2019
ms.author: rogarana
ms.subservice: files
---

# Azure File Sync proxy and firewall settings
Azure File Sync connects your on-premises servers to Azure Files, enabling multi-site synchronization and cloud tiering features. As such, an on-premises server must be connected to the internet. An IT admin needs to decide the best path for the server to reach into Azure cloud services.

This article will provide insight into specific requirements and options available to successfully and securely connect your server to Azure File Sync.

> [!Important]
> Azure File Sync does not yet support firewalls and virtual networks for a storage account.

## Overview
Azure File Sync acts as an orchestration service between your Windows Server, your Azure file share, and several other Azure services to sync data as described in your sync group. For Azure File Sync to work correctly, you will need to configure your servers to communicate with the following Azure services:

- Azure Storage
- Azure File Sync
- Azure Resource Manager
- Authentication services

> [!Note]  
> The Azure File Sync agent on Windows Server initiates all requests to cloud services which results in only having to consider outbound traffic from a firewall perspective. <br /> No Azure service initiates a connection to the Azure File Sync agent.

## Ports
Azure File Sync moves file data and metadata exclusively over HTTPS and requires port 443 to be open outbound.
As a result all traffic is encrypted.

## Networks and special connections to Azure
The Azure File Sync agent has no requirements regarding special channels like [ExpressRoute](../../expressroute/expressroute-introduction.md), etc. to Azure.

Azure File Sync will work through any means available that allow reach into Azure, automatically adapting to various network characteristics like bandwidth, latency as well as offering admin control for fine-tuning. Not all features are available at this time. If you would like to configure specific behavior, let us know via [Azure Files UserVoice](https://feedback.azure.com/forums/217298-storage?category_id=180670).

## Proxy
Azure File Sync supports app-specific and machine-wide proxy settings.

**App-specific proxy settings** allow configuration of a proxy specifically for Azure File Sync traffic. App-specific proxy settings are supported on agent version 4.0.1.0 or newer and can be configured during the agent installation or by using the Set-StorageSyncProxyConfiguration PowerShell cmdlet.

PowerShell commands to configure app-specific proxy settings:
```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Set-StorageSyncProxyConfiguration -Address <url> -Port <port number> -ProxyCredential <credentials>
```
**Machine-wide proxy settings** are transparent to the Azure File Sync agent as the entire traffic of the server is routed through the proxy.

To configure machine-wide proxy settings, follow the steps below: 

1. Configure proxy settings for .NET applications 

   - Edit these two files:  
     C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config  
     C:\Windows\Microsoft.NET\Framework\v4.0.30319\Config\machine.config

   - Add the <system.net> section in the machine.config files (below the <system.serviceModel> section).  Change 127.0.01:8888 to the IP address and port for the proxy server. 
     ```
      <system.net>
        <defaultProxy enabled="true" useDefaultCredentials="true">
          <proxy autoDetect="false" bypassonlocal="false" proxyaddress="http://127.0.0.1:8888" usesystemdefault="false" />
        </defaultProxy>
      </system.net>
     ```

2. Set the WinHTTP proxy settings 

   - Run the following command from an elevated command prompt or PowerShell to see the existing proxy setting:   

     netsh winhttp show proxy

   - Run the following command from an elevated command prompt or PowerShell to set the proxy setting (change 127.0.01:8888 to the IP address and port for the proxy server):  

     netsh winhttp set proxy 127.0.0.1:8888

3. Restart the Storage Sync Agent service by running the following command from an elevated command prompt or PowerShell: 

      net stop filesyncsvc

      Note: The Storage Sync Agent (filesyncsvc) service will auto-start once stopped.

## Firewall
As mentioned in a previous section, port 443 needs to be open outbound. Based on policies in your datacenter, branch or region, further restricting traffic over this port to specific domains may be desired or required.

The following table describes the required domains for communication:

| Service | Public cloud endpoint | Azure Government endpoint | Usage |
|---------|----------------|---------------|------------------------------|
| **Azure Resource Manager** | https://management.azure.com | https://management.usgovcloudapi.net | Any user call (like PowerShell) goes to/through this URL, including the initial server registration call. |
| **Azure Active Directory** | https://login.windows.net | https://login.microsoftonline.us | Azure Resource Manager calls must be made by an authenticated user. To succeed, this URL is used for user authentication. |
| **Azure Active Directory** | https://graph.windows.net/ | https://graph.windows.net/ | As part of deploying Azure File Sync, a service principal in the subscription's Azure Active Directory will be created. This URL is used for that. This principal is used for delegating a minimal set of rights to the Azure File Sync service. The user performing the initial setup of Azure File Sync must be an authenticated user with subscription owner privileges. |
| **Azure Storage** | &ast;.core.windows.net | &ast;.core.usgovcloudapi.net | When the server downloads a file, then the server performs that data movement more efficiently when talking directly to the Azure file share in the Storage Account. The server has a SAS key that only allows for targeted file share access. |
| **Azure File Sync** | &ast;.one.microsoft.com | &ast;.afs.azure.us | After initial server registration, the server receives a regional URL for the Azure File Sync service instance in that region. The server can use the URL to communicate directly and efficiently with the instance handling its sync. |
| **Microsoft PKI** | `https://www.microsoft.com/pki/mscorp`<br /><http://ocsp.msocsp.com> | `https://www.microsoft.com/pki/mscorp`<br /><http://ocsp.msocsp.com> | Once the Azure File Sync agent is installed, the PKI URL is used to download intermediate certificates required to communicate with the Azure File Sync service and Azure file share. The OCSP URL is used to check the status of a certificate. |

> [!Important]
> When allowing traffic to &ast;.one.microsoft.com, traffic to more than just the sync service is possible from the server. There are many more Microsoft services available under subdomains.

If &ast;.one.microsoft.com is too broad, you can limit the server's communication by allowing communication to only explicit regional instances of the Azure Files Sync service. Which instance(s) to choose depends on the region of the storage sync service you have deployed and registered the server to. That region is called "Primary endpoint URL" in the table below.

For business continuity and disaster recovery (BCDR) reasons you may have specified your Azure file shares in a globally redundant (GRS) storage account. If that is the case, then your Azure file shares will fail over to the paired region in the event of a lasting regional outage. Azure File Sync uses the same regional pairings as storage. So if you use GRS storage accounts, you need to enable additional URLs to allow your server to talk to the paired region for Azure File Sync. The table below calls this "Paired region". Additionally, there is a traffic manager profile URL that needs to be enabled as well. This will ensure network traffic can be seamlessly re-routed to the paired region in the event of a fail-over and is called "Discovery URL" in the table below.

| Cloud  | Region | Primary endpoint URL | Paired region | Discovery URL |
|--------|--------|----------------------|---------------|---------------|
| Public |Australia East | https:\//kailani-aue.one.microsoft.com | Australia Southeast | https:\//tm-kailani-aue.one.microsoft.com |
| Public |Australia Southeast | https:\//kailani-aus.one.microsoft.com | Australia East | https:\//tm-kailani-aus.one.microsoft.com |
| Public | Brazil South | https:\//brazilsouth01.afs.azure.net | South Central US | https:\//tm-brazilsouth01.afs.azure.net |
| Public | Canada Central | https:\//kailani-cac.one.microsoft.com | Canada East | https:\//tm-kailani-cac.one.microsoft.com |
| Public | Canada East | https:\//kailani-cae.one.microsoft.com | Canada Central | https:\//tm-kailani.cae.one.microsoft.com |
| Public | Central India | https:\//kailani-cin.one.microsoft.com | South India | https:\//tm-kailani-cin.one.microsoft.com |
| Public | Central US | https:\//kailani-cus.one.microsoft.com | East US 2 | https:\//tm-kailani-cus.one.microsoft.com |
| Public | East Asia | https:\//kailani11.one.microsoft.com | Southeast Asia | https:\//tm-kailani11.one.microsoft.com |
| Public | East US | https:\//kailani1.one.microsoft.com | West US | https:\//tm-kailani1.one.microsoft.com |
| Public | East US 2 | https:\//kailani-ess.one.microsoft.com | Central US | https:\//tm-kailani-ess.one.microsoft.com |
| Public | Japan East | https:\//japaneast01.afs.azure.net | Japan West | https:\//tm-japaneast01.afs.azure.net |
| Public | Japan West | https:\//japanwest01.afs.azure.net | Japan East | https:\//tm-japanwest01.afs.azure.net |
| Public | Korea Central | https:\//koreacentral01.afs.azure.net/ | Korea South | https:\//tm-koreacentral01.afs.azure.net/ |
| Public | Korea South | https:\//koreasouth01.afs.azure.net/ | Korea Central | https:\//tm-koreasouth01.afs.azure.net/ |
| Public | North Central US | https:\//northcentralus01.afs.azure.net | South Central US | https:\//tm-northcentralus01.afs.azure.net |
| Public | North Europe | https:\//kailani7.one.microsoft.com | West Europe | https:\//tm-kailani7.one.microsoft.com |
| Public | South Central US | https:\//southcentralus01.afs.azure.net | North Central US | https:\//tm-southcentralus01.afs.azure.net |
| Public | South India | https:\//kailani-sin.one.microsoft.com | Central India | https:\//tm-kailani-sin.one.microsoft.com |
| Public | Southeast Asia | https:\//kailani10.one.microsoft.com | East Asia | https:\//tm-kailani10.one.microsoft.com |
| Public | UK South | https:\//kailani-uks.one.microsoft.com | UK West | https:\//tm-kailani-uks.one.microsoft.com |
| Public | UK West | https:\//kailani-ukw.one.microsoft.com | UK South | https:\//tm-kailani-ukw.one.microsoft.com |
| Public | West Central US | https:\//westcentralus01.afs.azure.net | West US 2 | https:\//tm-westcentralus01.afs.azure.net |
| Public | West Europe | https:\//kailani6.one.microsoft.com | North Europe | https:\//tm-kailani6.one.microsoft.com |
| Public | West US | https:\//kailani.one.microsoft.com | East US | https:\//tm-kailani.one.microsoft.com |
| Public | West US 2 | https:\//westus201.afs.azure.net | West Central US | https:\//tm-westus201.afs.azure.net |
| Government | US Gov Arizona | https:\//usgovarizona01.afs.azure.us | US Gov Texas | https:\//tm-usgovarizona01.afs.azure.us |
| Government | US Gov Texas | https:\//usgovtexas01.afs.azure.us | US Gov Arizona | https:\//tm-usgovtexas01.afs.azure.us |

- If you use locally redundant (LRS) or zone redundant (ZRS) storage accounts, you only need to enable the URL listed under "Primary endpoint URL".

- If you use globally redundant (GRS) storage accounts, enable three URLs.

**Example:** You deploy a storage sync service in `"West US"` and register your server with it. The URLs to allow the server to communicate to for this case are:

> - https:\//kailani.one.microsoft.com (primary endpoint: West US)
> - https:\//kailani1.one.microsoft.com (paired fail-over region: East US)
> - https:\//tm-kailani.one.microsoft.com (discovery URL of the primary region)

## Summary and risk limitation
The lists earlier in this document contain the URLs Azure File Sync currently communicates with. Firewalls must be able to allow traffic outbound to these domains. Microsoft strives to keep this list updated.

Setting up domain restricting firewall rules can be a measure to improve security. If these firewall configurations are used, one needs to keep in mind that URLs will be added and might even change over time. Check this article periodically.

## Next steps
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
- [Deploy Azure File Sync](storage-sync-files-deployment-guide.md)
- [Monitor Azure File Sync](storage-sync-files-monitoring.md)
