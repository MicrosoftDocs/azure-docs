---
title: Azure Analysis Services high availability | Microsoft Docs
description: Assuring Azure Analysis Services high availability.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 01/09/2019
ms.author: owend
ms.reviewer: minewiskan

---

# Analysis Services high availability

This article describes assuring high availability for Azure Analysis Services servers. 

## Assuring high availability during a service disruption

While rare, an Azure data center can have an outage. When an outage occurs, it causes a business disruption that might last a few minutes or might last for hours. High availability is most often achieved with server redundancy. With Azure Analysis Services, you can achieve redundancy by creating additional, secondary servers in one or more regions. When creating redundant servers, to assure the data and metadata on those servers is in-sync with the server in a region that has gone offline, you can:

* Deploy models to redundant servers in other regions. This method requires processing data on both your primary server and redundant servers in-parallel, assuring all servers are in-sync.

* [Backup](analysis-services-backup.md) databases from your primary server and restore on redundant servers. For example, you can automate nightly backups to Azure storage, and restore to other redundant servers in other regions. 

In either case, if your primary server experiences an outage, you must change the connection strings in reporting clients to connect to the server in a different regional datacenter. This change should be considered a last resort and only if a catastrophic regional data center outage occurs. It's more likely a data center outage hosting your primary server would come back online before you could update connections on all clients. 

To avoid having to change connection strings on reporting clients, you can create a server [alias](analysis-services-server-alias.md) for your primary server. If the primary server goes down, you can change the alias to point to a redundant server in another region. You can automate alias to server name by coding an endpoint health check on the primary server. If the health check fails, the same endpoint can direct to a redundant server in another region. 

## Related information

[Backup and restore](analysis-services-backup.md)   
[Manage Azure Analysis Services](analysis-services-manage.md)   
[Alias server names](analysis-services-server-alias.md) 

