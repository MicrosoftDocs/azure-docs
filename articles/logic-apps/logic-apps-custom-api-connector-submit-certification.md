---
title: Certify custom API connectors - Azure Logic Apps | Microsoft Docs
description: Make custom API connectors available for all users in Azure Logic Apps, Microsoft Flow, and PowerApps
author: ecfan
manager: anneta
editor: 
services: logic-apps
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/1/2017
ms.author: LADocs; estfan
---

# Submit your custom API connector for certification by Microsoft for Azure Logic Apps, Microsoft Flow, and PowerApps

As part of our third party certification process, we review your connector before publishing. By certifying a connector, it becomes available to all users of Microsoft Flow, PowerApps, and Logic Apps. Following are the criteria and steps for certification.


## Criteria

| Capability | Details | Required or Recommended |
|------------|---------|-------------------------|
| Software as a Service (SaaS) app for business |  Business user scenario that fits well with Microsoft Flow, PowerApps, and Logic Apps | Required |
| Authentication Type | Your API must support OAuth2, API key, or Basic authentication | Required |
| Support | You must provide a support contact where customers can find help | Required |
| Availability / Uptime | Your app should have an uptime of at least 99.9% | Recommended |


## Submitting your connector

Certify your connector for Microsoft Flow, PowerApps, and Logic Apps in three simple steps:

1. **Nomination**

    - [Submit a nomination](https://go.microsoft.com/fwlink/?linkid=848754)
    - You will receive a mutual Non-Disclosure Agreement and Partner Agreement. The signed contracts are required in order to proceed.
    - We'll check if your app meets the criteria. Once approved, we'll notify you along with instructions for onboarding.
    
2. **Review**

    Submit the following information to your nomination contact for review:

    - OpenAPI file that describes your API
	- icon.png file (~160px logo inside a 230px square, white on a colored background is preferred)
	- Brand color in hex (matching the colored background in the icon file)
	- A test account for validation
	- A support contact

    If additional information is required, we'll contact you with more details.

3. **Publishing**

    After we validate connector functionality and content, we will stage the connector for deployment across all products and regions.
    
    By default, all connectors are published as "premium". If your app is built on Azure, you can apply to have your connector listed as a “standard” connector available to all users of Office 365 Enterprise plans. Ask your nomination contact for more details.
