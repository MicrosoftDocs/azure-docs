---
title: Configure load balancer or DNN for connectivity to an FCI 
description: Learn how to configure either an Azure load balancer or dynamic network name (DNN) to route traffic to your SQL Server on Azure VM failover cluster instance (FCI). 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: jroth
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/02/2020
ms.author: mathoma
ms.reviewer: jroth

---
# Configure connectivity for an FCI (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article teaches you to configure an Azure load balancer or dynamic network name to use with your failover cluster instance (FCI) for SQL Server on Azure Virtual Machine.

In a traditional on-premises SQL Server environment, traffic is routed to the primary instance using DNS. However, since the virtual machines are hosted in Azure, an additional networking component is necessary route traffic to the primary node in the cluster. As such, the use of failover clustering with SQL Server on Azure VMs requires the configuration of an Azure load balancer, or if you're on Windows Server 2019, you can use a dynamic network name instead. 



## Load balancer

## Dynamic network name 

## 



## Next steps

For more information, see the following articles: 



