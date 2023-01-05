---
title: Azure Active Directory recommendation - Update to latest version of Azure AD Connect | Microsoft Docs
description: Learn why you should update to the latest version of Azure AD Connect.
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

# Azure AD recommendation: Upgrade to latest version of Azure AD Connect 

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to update to the latest version of Azure AD Connect. 

## Description

Support for Azure AD Connect V1 ceased on August 31, 2022. Installations of Azure AD Connect V1 may stop working unexpectedly.

For more information, see [Introduction to Azure AD Connect V2.0](../../hybrid/whatis-azure-ad-connect-v2.md). 

## Logic 

This recommendation shows up if you are using the deprecated version of Azure AD Connect. 

## Value 

Updating to Azure AD Connect V2 brings into alignment several protocols and standards, such at TLS 1.2, SHA-2 signing algorithms and Windows Server 2016. The update also addresses several security issues.

## Action plan

1.	Read about [what to do when you are using a deprecated version](../../hybrid/deprecated-azure-ad-connect.md).
2.	Learn about the [Azure AD Connect V2.0 update](../../hybrid/whatis-azure-ad-connect-v2.md).
3.	Upgrade to the latest version of Azure AD Connect, using the [upgrade how-to documentation](../../hybrid/how-to-upgrade-previous-version.md).

## Next steps

- [What is Azure Active Directory recommendations](overview-recommendations.md)
