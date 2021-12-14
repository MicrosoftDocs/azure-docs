---
title: Connect to AD-integrated Azure Arc-enabled SQL Managed Instance
description: Connect to AD-integrated Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/15/2021
ms.topic: how-to
---

# Connect to AD-integrated Azure Arc-enabled SQL Managed Instance

This article describes how to connect to Azure Arc-enabled SQL Managed Instance endpoints deployed in Active Directory (AD) manual mode. Before you proceed, make sure you have an AD-integrated Azure Arc-enabled SQL Managed Instance.

See [Tutorial – Deploy AD-integrated Azure Arc-enabled data services in manual mode](../deploy-active-directory-manual-mode.md) to deploy a Azure Arc-enabled SQL Managed Instance in Active Directory (AD) Authentication mode. 

## Connect to Azure Arc-enabled SQL Managed Instance 

From your domain joined Windows-based or Linux-based client machine, you can use `sqlcmd` utility, or open [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio (ADS)](sql/azure-data-studio/download-azure-data-studio) to connect to the Azure Arc-enabled SQL Managed Instance using AD authentication.

Connect to Azure Arc-enabled SQL Managed Instance instance from Linux/Mac OS

```bash
kinit <username>@<domain name>
sqlcmd -S <DNS name for master instance>,31433 -E
 ```
 
## Connect to SQL MI instance from Windows

```bash
sqlcmd -S <DNS name for master instance>,31433 -E
```

## Connect to SQL MI instance from SSMS

![Connect with SSMS](../media/active-directory-deployment/connect-with-ssms.png)

## Connect to SQL MI instance from ADS

![Connect with ADS](../media/active-directory-deployment/connect-with-ads.png)

## Next steps

* [Plan Azure Arc-enabled SQL Managed Instance in Active Directory (AD) Manual Authentication mode](plan-active-directory-integrated-deployment.md).
* Deploying [Arc-enabled SQL Managed Instance in Active Directory (AD) Manual Authentication mode](deploy-active-directory-manual-mode.md).