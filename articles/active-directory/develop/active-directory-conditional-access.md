---
title: Developer Guidance for Conditional Access | Microsoft Docs
description: 
services: active-directory
keywords: 
author: danieldobalian
manager: mbaldwin
editor: PatAltimore
ms.author: dadobali
ms.date: 07/19/2017
ms.assetid: 115bdab2-e1fd-4403-ac15-d4195e24ac95
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
---

# Developer Guidance for Conditional Access

## Introduction

Azure AD offers several great ways to secure your app and protect a service.  One of these unique features is Conditional Access.  Conditional Access enables developers and enterprise customers to protect services in a multitude of ways including Multi-Factor Authentication, only allowing Intune enrolled devices to access specific services, restricting user locations and ip ranges, and several other factors.    
For more information on the full capabilities of Conditional Access, checkout [Conditional Access in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access).  
In this article, we'll be focusing on what Conditional Access means to developers building apps for Azure AD.  It assumes knowledge of [single](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-integrating-applications) & [multi-tenanted](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview) apps and [common authentication patterns](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios).   
We'll dive into the impact of accessing resources you don't have control over that may have conditional access policies applied.  Moreover, we will explore the implications of Conditional Access in the On-Behalf-Of flow, Web Apps, accessing the Microsoft Graph, and calling API's.  