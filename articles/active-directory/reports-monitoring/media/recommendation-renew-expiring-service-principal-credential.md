---
title: Azure Active Directory recommendation - Renew expiring service principal credentials | Microsoft Docs
description: Learn why you should Renew expiring service principal credentials.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 01/05/2023
ms.author: sarahlipsey
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Renew expiring service principal credentials

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.


This article covers the recommendation to renew expiring service principal credentials.


## Description

As an admin, you want to maintain security for your company’s resources, but you also want your employees to 


## Logic 

This recommendation shows up, if you have set the remember multi-factor authentication feature to less than 30 days.


## Value 

This recommendation improves your user's productivity and minimizes the sign-in time with fewer MFA prompts. Ensure that your most sensitive resources can have the tightest controls, while your least sensitive resources can be more freely accessible.

## Action plan

1. Review [configure Azure AD Multi-Factor Authentication settings](../authentication/howto-mfa-mfasettings.md).  

2. Set the remember multi-factor authentication feature to 90 days.
 

## Next steps

- [What is Azure Active Directory recommendations](overview-recommendations.md)

- [Azure AD reports overview](overview-reports.md)