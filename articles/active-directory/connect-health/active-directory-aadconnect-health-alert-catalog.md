---
title: Azure AD Connect Health - Alert Catalog | Microsoft Docs
description: This document shows the catalog of all alerts in Azure AD Connect Health.
services: active-directory
documentationcenter: ''
author: zhiweiw
manager: maheshu
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/15/2018
ms.author: zhiweiw
---

# Azure Active Directory Connect Health Alert Catalog 


## Connect Health for Sync

| Alert Name | Description | Remediation |
| --- | --- | ----- |
| Azure AD Connect Sync Service is not running 
| Microsoft Azure AD Sync Windows service is not running or could not start. As a result, objects will not synchronize with Azure Active Directory. 
| Start Microsoft Azure Active Directory Sync Services</b> <ol> <li>Click <b>Start</b>, click <b>Run</b>, type <b>Services.msc</b>, and then click <b>OK</b>.</li> <li>Locate the <b>Microsoft Azure AD Sync service</b>, and then check whether the service is started. If the service isn't started, right-click it, and then click <b>Start</b> | 

| Import from Azure Active Directory failed 
| The import operation from Azure Active Directory Connector has failed.	
| Please investigate the event log errors of import operation for further details.  |

| Connection to Azure Active Directory failed due to authentication failure  |
| Connection to Azure Active Directory failed due to authentication failure. As a result objects will not be synchronized with Azure Active Directory.	|
| Please investigate the event log errors for further details. If problem persists, please contact Microsoft Support for further assistance. |



## Next steps
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
