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
Communication with Azure for the purposes of file sync is not monolithic. There are multiple services in Azure, all with individual endpoints to which the server must be enabled to communicate with.

For instance:
- Azure Storage
- Azure File Sync
- Azure Resource Manager
- Authentication services

> [!Note]  
> With Azure File Sync all calls are made by the server (outbound). None of the involved services ever initiate communication to the server.

## Ports
All required communication uses port 443(SSL) exclusively.
Ensure that this port is open, outbound.

## Networks and special connections to Azure
The Azure File Sync agent has no requirements regarding special channels like [ExpressRoute](../../expressroute/expressroute-introduction.md), etc. to Azure.

File sync will work through any means available that allow reach into Azure, automatically adapting to various network characteristics like bandwidth, latency as well as offering admin control for fine tuning. *some features are not yet available

## Proxy support
Azure File Sync currently supports machine wide proxy settings. These are transparent to the Azure File Sync agent as the entire traffic of the server is routed through this proxy.

Soon the Azure File Sync agent installer will allow for configuration of app specific proxy settings. This will allow an admin to configure a proxy specifically for Azure File Sync.

## Firewall
As mentioned above, port 443 needs to be open outbound. Based on policies in your datacenter, branch or region, further restricting traffic over this port to specific domains may be desired or required. Certain challenges come attached with that.

The following table describes the required domains for communication.

| Service | Domain | Usage |
|---------|----------------|------------------------------|
| **Azure Resource Manager** | https://management.azure.com | Any user call (like PowerShell) goes to/through this URL, incl. the initial server registration call. |
| **Azure Active Directory** | https://login.windows.net | ARM calls must be made by an authenticated user. To succeed, this URL is used for user authentication. |
| **Azure Active Directory** | https://graph.windows.net/ | For delegating a minimal set of rights in the customers Azure subscription, a service principal in the customers AAD must be created for Azure File Sync - the first time Azure File Sync is set up. This must be done by an authenticated user with subscription owner privileges. |
| **Azure Storage** | *.core.windows.net | When the server downloads a file (sync or recall in the cloud tiering case), then the server performs that more efficiently when talking directly to the Azure File Share in the Storage Account. The server has a SAS key that only allows for targeted file share access. |
| **Azure File Sync** | *.one.microsoft.com | After initial server registration, the server will be given a regional URL of the Azure File Sync service instance in that region. The server will use it to communicate directly and efficiently with the instance handling its sync. |

> [!Note]
> The subdomain under *.one.microsoft.com can change for the server. That is why it is not clearly defined here. If this instance experiences a service interruption, another regions takes over (business continuity case). So for instance WestEurope has Kailani6.one.microsoft.com but that can change – as a result it is not recommended to limit traffic beyond the described level in the domain.

> [!Important]
> When allowing traffic to *.one.microsoft.com, traffic to more than just the sync service is possible from the server. There are many more Microsoft services available under a sub-domain.

## Summary
The above list is what Azure File Sync currently communicates with and a firewall must be able to allow traffic outbound to these domains as well as responses from them. We strive to keep this list updated but it is possible that the list of required URLs changes over time and the documentation may be behind.

A specific challenge to consider when setting up firewall rules is redirection (e.g. in authentication flows).

That leads to the conclusion that a too restrictive firewall setting might impede or prevent file sync from working correctly, especially when upgrading to a newer version of an Azure File Sync agent.

## Risk limitation
Setting up domain resticting firewall rules can be a measure to improve security but they also come at a risk as discussed above. If these restricitve firewall rules are used, one needs to keep in mind that URLs can change - and might do so without prior announcement. Therefore it is a prudent measure to include a network trace as part of a change management process from one Azure File Sync agent version to another on a test-deployment of the latest agent.

Upgrading to the latest agent is always advisable but with this measure any negative impact on production systems from set firewall rules can be limited.

## Next steps
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
- [Deploy Azure File Sync (preview)](storage-sync-files-deployment-guide.md)