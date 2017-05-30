---
title: Azure SQL Database Connectivity Architecture | Microsoft Docs
description: This document explains the Azure SQLDB connectivity architecture from within Azure or from outside of Azure. 
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: monicar
ms.assetid: 
ms.service: sql-database
ms.custom: architecture
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 05/30/2017
ms.author: carlrab

---
# Azure SQL Database Connectivity Architecture 

Client applications connect to an Azure SQL database through the Azure SQL Database software load-balancer (SLB) to the Azure SQL Database gateway. This gateway is responsible for establishing the connection to the database. This article explains how these connectivity components function to direct network traffic to the Azure database with clients connecting from within Azure and with clients connecting from outside of Azure. This article also provides script samples to change how connectivity occurs.

## Connectivity architecture

The following diagram provides a high-level overview of the Azure SQL Database connectivity architecture. 

![architecture overview](./media/sql-database-connectivity-architecture/architecture-overview.png)


The following steps describe how an connection is established to an Azure SQL database through the Azure SQL Database software load-balancer (SLB) and the Azure SQL Database gateway.

- Clients within Azure or outside of Azure connect to the SLB, which has a a public IP address and listens on port 1433.
- The SLB directs traffic to the Azure SQL Database gateway.
- The gateway redirects the traffic to the correct proxy middleware.
- The proxy middleware redirects the traffic to the appropriate Azure SQL database.

> [!IMPORTANT]
> Each of these components have distributed denial of service (DDoS) protection built-in at the network and the app layer.
>

### Connectivity from within Azure

If you are connecting from within Azure, your connections will be **Redirect**. This means that connections will be established via the Azure SQL Database gateway. After the TCP session is established, it then be redirected to the proxy middleware and incur a change of the destination virtual IP from that of the Azure SQL Database gateway to that of the proxy middleware.

![architecture overview](./media/sql-database-connectivity-architecture/connectivity-from-within-azure.png)


### Connectivity from outside of Azure

If you are connecting from outside Azure then the connectivity will be ‘Proxy’ by default and the connection will be established via the gateway all subsequent packets will flow via the gateway.

![architecture overview](./media/sql-database-connectivity-architecture/connectivity-from-outside-azure.png)


## Change Azure SQL Database connection policy

You to use the [REST API](https://msdn.microsoft.com/library/azure/mt604439.aspx) to change the connection connection policy for an Azure SQL Database server from proxy to redirect, and from redirect to proxy. 

## Next steps

