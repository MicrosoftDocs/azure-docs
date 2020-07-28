---
title: 'Azure AD Connect Provisioning Agent: Version release history | Microsoft Docs'
description: This article lists all releases of Azure AD Connect Provisioning Agent and describes new features and fixed issues
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.date: 02/26/2020
ms.subservice: app-provisioning
ms.author: kenwith
ms.reviewer: celested
---

# Azure AD Connect Provisioning Agent: Version release history

This article lists the versions and features of Azure Active Directory Connect Provisioning Agent that have been released. The Azure AD team regularly updates the Provisioning Agent with new features and functionality. The Provisioning Agent is updated automatically when a new version is released. 

Microsoft provides direct support for the latest agent version and one version before.

## 1.1.96.0

### Release status

December 4, 2019: Released for download

### New features and improvements

* Includes support for [Azure AD Connect cloud provisioning](../cloud-provisioning/what-is-cloud-provisioning.md) to synchronize user, contact and group data from on-premises Active Directory to Azure AD


## 1.1.67.0

### Release status

September 9, 2019: Released for auto update

### New features and improvements

* Ability to configure additional tracing and logging for debugging Provisioning Agent issues
* Ability to fetch only those Azure AD attributes that are configured in the mapping to improve performance of sync

### Fixed issues

* Fixed a bug wherein the agent went into an unresponsive state if there were issues with Azure AD connection failures
* Fixed a bug that caused issues when binary data was read from Azure Active Directory
* Fixed a bug wherein the agent failed to renew trust with the cloud hybrid identity service

## 1.1.30.0

### Release status

January 23, 2019: Released for download

### New features and improvements

* Revamped the Provisioning Agent and connector architecture for better performance, stability, and reliability 
* Simplified the Provisioning Agent configuration using UI-driven installation wizard 
* Added support for automatic agent updates

