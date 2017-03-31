---
title: Logic Apps B2B best practices - Azure Logic Apps | Microsoft Docs
description: Azure Logic Apps B2B best practices
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: ''

ms.assetid: cf44af18-1fe5-41d5-9e06-cc57a968207c
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/15/2016
ms.author: padmavc

---

# Azure Logic Apps B2B best practices
Here are the best practices that help to manage B2B volumes and traffic

## Number of partners in Integration Account 
Integration account allows adding multiple partners.  All B2B connectors establish a connection to integration account to access artifacts like agreements, schemas, maps and certificates. Based on volumes, you need to decide how many partners to be configured in an integration account.  Here are the throttling limits for a single connection per logic apps

| Action | Throttling limits |
| --- | --- |
| AS2 |3000 actions per minute |
| X12 |1800 actions per minute |
| EDFIACT |1800 actions per minute |
| Transform |3000 actions per minute |
| Flat file |3000 actions per minute |
| XML Validation |3000 actions per minute |


## Connection to integration account
To access integration account artifacts, the user creates a connection to the integration account from the B2B connector.  Establishing a unique connection from B2B connectors to an integration account helps to cache the artifact at connection level and improves the performance.


## Artifact maintenance and deployment
You can store integration account artifacts like agreements, maps, schemas, and certificates store in source control like VSTS. Automate deployments using [REST API](/rest/api/logic/) or [PowerShell](/powershell/resourcemanager/azurerm.logicapp/v2.3.0/azurerm.logicapp).  

