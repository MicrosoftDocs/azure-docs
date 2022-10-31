---
title: Azure Active Directory recommendation - Integrate third party apps with Azure AD | Microsoft Docs
description: Learn why you should integrate third party apps with Azure AD
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: billmath
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Integrate your third party apps 

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to integrate third party apps. 


## Description

As an Azure AD admin responsible for managing applications, you want to use the Azure AD security features with your third party apps. Integrating these apps into Azure AD enables:

- You to use one unified method to manage access to your third party apps.
- Your users to benefit from using single sign-on to access all your apps with a single password.


## Logic 

If Azure AD determines that none of your users are using Azure AD to authenticate to your third party apps, this recommendation shows up.

## Value 

Integrating third party apps with Azure AD allows you to use Azure AD's security features.
The integration:
- Improves the productivity of your users.

- Lowers your app management cost.

You can then add an extra security layer by using conditional access to control how your users can access your apps.

## Action plan

1. Review the configuration of your apps. 
2. For each app that isn't integrated into Azure AD yet, verify whether an integration is possible.
 

## Next steps

- [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md)
- [Azure AD reports overview](overview-reports.md)
