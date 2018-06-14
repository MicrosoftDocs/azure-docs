---
title: Azure File Sync on-premises firewall and proxy settings | Microsoft Docs
description: Azure File Sync on-premises network configuration
services: storage
documentationcenter: ''
author: fauhse
manager: klaasl
editor: tamram

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/26/2018
ms.author: fauhse
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
Azure File Sync currently supports machine-wide proxy settings. This proxy setting is transparent to the Azure File Sync agent as the entire traffic of the server is routed through this proxy.

App-specific proxy settings are currently under development and will be supported in a future release of the Azure File Sync agent. This will allow configuration of a proxy specifically for Azure File Sync traffic.

## Firewall
As mentioned in a previous section, port 443 needs to be open outbound. Based on policies in your datacenter, branch or region, further restricting traffic over this port to specific domains may be desired or required.

The following table describes the required domains for communication:

| Service | Domain | Usage |
|---------|----------------|------------------------------|
| **Azure Resource Manager** | https://management.azure.com | Any user call (like PowerShell) goes to/through this URL, including the initial server registration call. |
| **Azure Active Directory** | https://login.windows.net | Azure Resource Manager calls must be made by an authenticated user. To succeed, this URL is used for user authentication. |
| **Azure Active Directory** | https://graph.windows.net/ | As part of deploying Azure File Sync, a service principal in the subscription's Azure Active Directory will be created. This URL is used for that. This principal is used for delegating a minimal set of rights to the Azure File Sync service. The user performing the initial setup of Azure File Sync must be an authenticated user with subscription owner privileges. |
| **Azure Storage** | &ast;.core.windows.net | When the server downloads a file, then the server performs that data movement more efficiently when talking directly to the Azure File Share in the Storage Account. The server has a SAS key that only allows for targeted file share access. |
| **Azure File Sync** | &ast;.one.microsoft.com | After initial server registration, the server receives a regional URL for the Azure File Sync service instance in that region. The server can use the URL to communicate directly and efficiently with the instance handling its sync. |

> [!Important]
> When allowing traffic to &ast;.one.microsoft.com, traffic to more than just the sync service is possible from the server. There are many more Microsoft services available under subdomains.

If &ast;.one.microsoft.com is too broad, you can limit the server's communication by allowing communication to only explicit regional instances of the Azure Files Sync service. Which instance(s) to choose depends on the region of the storage sync service you have deployed and registered the server to. That region is called "Primary endpoint URL" in the table below.

For business continuity and disaster recovery (BCDR) reasons you may have specified your Azure file shares in a globally redundant (GRS) storage account. If that is the case, then your Azure file shares will fail over to the paired region in the event of a lasting regional outage. Azure File Sync uses the same regional pairings as storage. So if you use GRS storage accounts, you need to enable additional URLs to allow your server to talk to the paired region for Azure File Sync. This is called "Paired region" in the table below. Additionally, there is a traffic manager profile URL that needs to be enabled as well. This will ensure network traffic can be seamlessly re-routed to the paired region in the event of a fail-over and is called "Discovery URL" in the table below.

| Region | Primary endpoint URL | Paired region | Discovery URL |
|--------|---------------------------------------|
| Australia East | https://kailani-aue.one.microsoft.com | Australia South East | https://kailani-aue.one.microsoft.com |
| Canada Central | https://kailani-cac.one.microsoft.com | Canada East | https://tm-kailani-cac.one.microsoft.com |
| East US | https://kailani1.one.microsoft.com | - | - |
| Southeast Asia | https://kailani10.one.microsoft.com | - | - |
| UK South | https://kailani-uks.one.microsoft.com | - | - |
| West Europe | https://kailani6.one.microsoft.com | - | - |
| West US | https://kailani.one.microsoft.com | - | - |

> [!Info]
> If you use locally redundant (LRS) or zone redundant (ZRS) storage accounts, you only need to enable the URL listed under "Regional endpoint URL".
> If you use globally redundant (GRS) storage accounts, enable three URLs. Example: You deploy a storage sync service in "West US" and register your server with it. The URLs to allow the server to communicate to are for this case: 
> - https://kailani.one.microsoft.com (primary endpoint)
> - https://kailani1.one.microsoft.com (paired fail-over region East US)
> - https://tm-kailani.one.microsoft.com (discovery URL of the primary region)

> [!Important]
> If you define these detailed firewall rules, check this document often and update your firewall rules to avoid service interruptions due to outdated or incomplete URL listings in your firewall settings.

## Summary and risk limitation
The lists earlier in this document contain the URLs Azure File Sync currently communicates with. Firewalls must be able to allow traffic outbound to these domains as well as responses from them. Microsoft strives to keep this list updated.

Setting up domain restricting firewall rules can be a measure to improve security. If these firewall configurations are used, one needs to keep in mind that URLs will be added and changed over time. Therefore it is a prudent measure to check the tables in this document as part of a change management process from one Azure File Sync agent version to another on a test-deployment of the latest agent. This way you can ensure that your firewall is configured to allow traffic to domains the most recent agent requires.

## Next steps
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
- [Deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md)
