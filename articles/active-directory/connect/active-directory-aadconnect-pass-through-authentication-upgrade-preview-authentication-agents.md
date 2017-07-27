---
title: 'Azure AD Connect: Pass-through Authentication - Upgrade preview Authentication Agents | Microsoft Docs'
description: This article describes how to upgrade your Azure Active Directory (Azure AD) Pass-through Authentication configuration.
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/25/2017
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Upgrade preview Authentication Agents

## Overview

This article is for customers using Azure AD Pass-through Authentication through preview. We recently re-branded and upgraded the Authentication Agent software used with Pass-through Authentication. You will need to manually upgrade the preview versions of the Authentication Agents installed on your on-premises servers. This is a one-time upgrade only. The reasons for you to upgrade are as follows:

- The preview versions of Authentication Agents won’t be receiving any further security or bug fixes.
-	You won’t be able to install additional Authentication Agents (preview versions only) to achieve high availability.
-	Upgrading to the newer Authentication Agent version will ensure that your Authentication Agents receive all future updates automatically.

## Next steps
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
