---
title: 'AADCloudSyncTools PowerShell Module for Azure AD Connect Cloud Sync'
description: This article describes how to install the Azure AD Connect cloud provisioning agent.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/16/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# AADCloudSyncTools PowerShell Module for Azure AD Connect Cloud Sync

With the release of public preview refresh 2, Microsoft has introduced the AADCloudSyncTools PowerShell Module.  This module provides a set of useful tools that you can use to help manage your Azure AD Connect Cloud Sync deployments.

## Pre-requisites
This module uses MSAL authentication, so it requires MSAL.PS module installed. It no longer depends on Azure AD or Azure AD Preview.   To verify this, in an Admin PowerShell window execute “Get-module MSAL.PS”. If the module is installed correctly you will get a response.  Otherwise, you can install the latest version 

