---
title: Connect to AD-integrated Arc-enabled SQL Managed instance
description: Connect to AD-integrated Arc-enabled SQL Managed instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: melqin
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/10/2021
ms.topic: how-to
---

# Connect to AD-integrated Arc-enabled SQL Managed instance

This article describes how to connect to Arc-enabled SQL Managed instance endpoints deployed in Active Directory (AD) manual mode. Before you proceed, make sure you have an AD-integrated Arc-enabled SQL Managed instance, check out this to know how to deploy a Arc-enabled SQL Managed instance in Active Directory (AD) Authentication mode. 

## Connect to Arc-enabled SQL Managed instance 
From your domain joined windows-based or Linux-based client machine, you can user sqlcmd utility, or open SSMS or Azure Data Studio (ADS) to connect to the Arc-enabled SQL Managed instance using AD authentication.
Connect to SQL MI instance from Linux/Mac OS


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

* [Plan Arc-enabled SQL Managed instance in Active Directory (AD) Manual Authentication mode](plan-active-directory-integrated-deployment.md).
* Deploying [Arc-enabled SQL Managed instance in Active Directory (AD) Manual Authentication mode](deploy-active-directory-manual-mode.md).