---
title: Use Azure AD v2.0 to sign in users on browser-less devices | Microsoft Docs
description: Build embedded and browser-less authentication flows using the device code grant.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 780eec4d-7ee1-48b7-b29f-cd0b8cb41ed3
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/02/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# Azure Active Directory v2.0 and the OAuth 2.0 device code flow

Azure AD supports the [device code grant](https://tools.ietf.org/html/draft-ietf-oauth-device-flow-12), which allows users to sign in to input-constrained devices such as a smart TV, IoT device, or printer.  To enable this flow, the device has the user visit a webpage in their browser on another device to log in.  Once the user logs in, the device is able to get access tokens and refresh tokens as needed.  

> [!Important] 
> At this time, the v2.0 endpoint only supports the device flow for Azure AD tenants, but not personal accounts.  This means that you must use a tenanted endpoint, or the organizations endpoint.  
>
> Personal accounts that are invited to an Azure AD tenant will be able to use the device flow grant, but only in the context of the tenant.

