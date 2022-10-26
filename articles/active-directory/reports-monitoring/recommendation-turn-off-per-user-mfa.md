---
title: Azure Active Directory recommendation - Turn off per user MFA in Azure AD | Microsoft Docs
description: Learn why you should turn off per user MFA in Azure AD
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: amycolannino
editor: ''

ms.assetid: 9b88958d-94a2-4f4b-a18c-616f0617a24e
ms.service: active-directory
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: markvi
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Turn off per user MFA 

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.


This article covers the recommendation to turn off per user MFA. 


## Description

As an admin, you want to maintain security for my company’s resources, but you also want your employees to easily access resources as needed.

Multi-factor authentication (MFA) enables you to enhance the security posture of your tenant. In your tenant, you can enable MFA on a per-user basis. In this scenario, your users perform MFA each time they sign in (with some exceptions, such as when they sign in from trusted IP addresses or when the remember MFA on trusted devices feature is turned on). 

While enabling MFA is a good practice, you can reduce the number of times your users are prompted for MFA by converting per-user MFA to MFA based on conditional access.   


## Logic 

This recommendation shows up, if:

- You have per-user MFA configured for at least 5% of your users
- Conditional access policies are active for more than 1% of your users (indicating familiarity with CA policies).

## Value 

This recommendation improves your user's productivity and minimizes the sign-in time with fewer MFA prompts. Ensure that your most sensitive resources can have the tightest controls, while your least sensitive resources can be more freely accessible.

## Action plan

1. To get started, confirm that there's an existing conditional access policy with an MFA requirement. Ensure that you're covering all resources and users you would like to secure with MFA. Review your [conditional access policies](https://portal.azure.com/?Microsoft_AAD_IAM_enableAadvisorFeaturePreview=true&amp%3BMicrosoft_AAD_IAM_enableAadvisorFeature=true#blade/Microsoft_AAD_IAM/PoliciesTemplateBlade).

2.	To require MFA using a conditional access policy, follow the steps in [Secure user sign-in events with Azure AD Multi-Factor Authentication](../authentication/tutorial-enable-azure-mfa.md).

3. Ensure that the per-user MFA configuration is turned off. 

 

## Next steps

- [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md)
- [Azure AD reports overview](overview-reports.md)
