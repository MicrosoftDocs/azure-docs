---
title: Azure Active Directory recommendation: Integrate third party apps with Azure AD | Microsoft Docs
description: Learn why you should integrate third party apps with Azure AD
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: karenhoran
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 05/13/2019
ms.author: markvi
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Integrate your third party apps 

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights with actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to integrate third party apps. 


## Description

As an Azure AD admin responsible for managing applications, you want the to leverage Azure AD security features. 

No users are currently authenticating to any pre-integrated, custom app (BYOA) or SaaS app. 

 

## Logic 

Any customer that is not currently authenticating to any pre-integrated, custom (BYOA), or SaaS app with AAD will receive this recommendation. This is validated by whether an application has an "application template id" or "parentappId" in the app metadata, These 2 values indicate that the customer has configured a pre-integrated app from our app gallery or configured a customer application via Bring Your Own App. 

## Value 

Integrating 3rd party apps with Azure AD allows you to leverage Azure AD's security features, which enables seamless, more productive and more secure sign-ins. You can add an additional security layer to your 3rd party app sign-ins by using conditional access.Action Plan 

Review your apps. Enterprise applications 

For each eligible apps, integrate your 3rd party app with Azure AD. Tutorials for integrating SaaS applications with Azure AD 

 

 



## Next steps

* [Azure AD reports overview](overview-reports.md)
* [Programmatic access to Azure AD reports](concept-reporting-api.md)
* [Azure Active Directory risk detections](../identity-protection/overview-identity-protection.md)