---
title: Azure Active Directory recommendation - Integrate third party apps with Azure AD | Microsoft Docs
description: Learn why you should integrate third party apps with Azure AD
services: active-directory
author: shlipsey3
manager: amycolannino

ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 10/31/2022
ms.author: sarahlipsey
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Integrate third party apps 

[Azure Active Directory (Azure AD) recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to integrate your third party apps with Azure AD. 

## Description

As an Azure AD admin responsible for managing applications, you want to use the Azure AD security features with your third party apps. Integrating these apps into Azure AD enables you to use one unified method to manage access to your third party apps. Your users also benefit from using single sign-on to access all your apps with a single password.

If Azure AD determines that none of your users are using Azure AD to authenticate to your third party apps, this recommendation shows up. 

## Value 

Integrating third party apps with Azure AD allows you to utilize the core identity and access features provided by Azure AD. Manage access, single sign-on, and other properties. Add an extra security layer by using [Conditional Access](../conditional-access/overview.md) to control how your users can access your apps.

Integrating third party apps with Azure AD:
- Improves the productivity of your users.

- Lowers your app management cost.

## Action plan

1. Review the configuration of your apps. 
2. For each app that isn't integrated into Azure AD, verify whether an integration is possible.
 

## Next steps

- [Explore tutorials for integrating SaaS applications with Azure AD](../saas-apps/tutorial-list.md)
