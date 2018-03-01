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
ms.date: 2/26/2018
ms.author: fauhse
---

# Azure File Sync proxy and firewall settings
Azure File Sync connects your on-premises servers to Azure storage, enabling multi-site synchronization and cloud tiering features. As such, an on-premises server must be connected to the internet. An IT admin needs to decide the best path for the server to take to reach into Azure cloud services.

This article will provide insight into specific requirements and options available to successfully and securely connect your server to Azure File Sync.

## Overview
Azure File Sync orchestrates multiple cloud services involved in delivering an integrated sync experience.
As a result, enabling your network to support Azure File Sync through firewalls and proxies requires enabling communication to several cloud services.

For instance:
- Azure Storage
- Azure File Sync
- Azure Resource Manager
- Authentication services

> [!Note]  
> The Azure File Sync agent on Windows Server initiates all requests to cloud services. (outbound)
> No Azure service initiates communication to the Azure File Sync agent.


## Ports
Azure File Sync communicates exclusively over port 443 (SSL).
As a result, all traffic is encrypted in transport. 

* As a result, sync meta data as well as file data movements are always encrypted. 
* Storage account encryption decides encryption-at-rest behavior and is an independent setting on an Azure Storage account.

## Networks and special connections to Azure
The Azure File Sync agent has no requirements regarding special channels like [ExpressRoute](../../expressroute/expressroute-introduction.md), etc. to Azure.

Azure File Sync will work through any means available that allow reach into Azure, automatically adapting to various network characteristics like bandwidth, latency as well as offering admin control for fine-tuning. *some features are not yet available

## Proxy
Azure File Sync currently supports machine-wide proxy settings. This proxy setting is transparent to the Azure File Sync agent as the entire traffic of the server is routed through this proxy.

Soon the Azure File Sync agent installer will allow for configuration of app-specific proxy settings. This will allow configuration of a proxy specifically for Azure File Sync traffic.

## Firewall
As mentioned before, port 443 needs to be open outbound. Based on policies in your datacenter, branch or region, further restricting traffic over this port to specific domains may be desired or required.

The following table describes the required domains for communication:

| Service | Domain | Usage |
|---------|----------------|------------------------------|
| **Azure Resource Manager** | https://management.azure.com | Any user call (like PowerShell) goes to/through this URL, incl. the initial server registration call. |
| **Azure Active Directory** | https://login.windows.net | Azure Resource Manager calls must be made by an authenticated user. To succeed, this URL is used for user authentication. |
| **Azure Active Directory** | https://graph.windows.net/ | A service principal in the Azure Active Directory of the used subscription for delegating a minimal set of rights to the Azure File Sync service. This creation of a service principal is done automatically and only once, when Azure File Sync is set up for the first time. As a result, this action must be performed by an authenticated user with subscription owner privileges. |
| **Azure Storage** | *.core.windows.net | When the server downloads a file (sync or recall in the cloud tiering case), then the server performs that data movement more efficiently when talking directly to the Azure File Share in the Storage Account. The server has a SAS key that only allows for targeted file share access. |
| **Azure File Sync** | *.one.microsoft.com | After initial server registration, the server will be given a regional URL of the Azure File Sync service instance in that region. The server will use it to communicate directly and efficiently with the instance handling its sync. |

> [!Important]
> When allowing traffic to *.one.microsoft.com, traffic to more than just the sync service is possible from the server. There are many more Microsoft services available under subdomains.

> If *.one.microsoft.com is too broad you can limit the server's communication by allowing only explicit regional instances of the Azure Files Service. Which instance to choose depends on the region of the Storage Sync Service you have deployed and registered the server with. That is the region you need to allow for the server. Soon there will be more URLs to enable new business continuity features. 

> | Region | Azure File Sync regional endpoint URL |
> |--------|---------------------------------------|
> | Australia East | https://kailani-aue.one.microsoft.com |
> | Canada Central | https://kailani-cac.one.microsoft.com |
> | East US | https://kailani1.one.microsoft.com |
> | Southeast Asia | https://kailani10.one.microsoft.com |
> | UK South | https://kailani-uks.one.microsoft.com |
> | West Europe | https://kailani6.one.microsoft.com |
> | West US | https://kailani.one.microsoft.com |

> > [!Important]
> > If you define these detailed firewall rules, check this document often and update your firewall rules to avoid service interruptions due to outdated or incomplete URL listings in your firewall settings.

## Summary and risk limitation
The list earlier in this document contains the URLs Azure File Sync currently communicates with. Firewalls must be able to allow traffic outbound to these domains as well as responses from them. Microsoft strives to keep this list updated.

Setting up domain restricting firewall rules can be a measure to improve security. If these firewall configurations are used, one needs to keep in mind that URLs can change. Therefore it is a prudent measure to check the table in this document as part of a change management process from one Azure File Sync agent version to another on a test-deployment of the latest agent. This way you can ensure that your firewall is configured to allow traffic to domains the most recent agent requires.

## Next steps
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
- [Deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md)