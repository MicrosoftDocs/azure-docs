---
title: 'Azure AD Connect Provisioning Agent: Version release history | Microsoft Docs'
description: This article lists all releases of Azure AD Connect Provisioning Agent and describes new features and fixed issues
services: active-directory
documentationcenter: ''
author: cmmdesai
manager: daveba
editor: ''
ms.assetid: 
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/05/2019
ms.subservice: app-mgmt
ms.author: chmutali

ms.collection: M365-identity-device-management
---
# Azure AD Connect Provisioning Agent: Version release history
This article lists the versions and features of Azure AD Connect Provisioning Agent that have been released. The Azure AD team regularly updates the Provisioning Agent with new features and functionality. Provisioning Agents are updated automatically when a new version is released. 

We recommend enabling auto update for your agents to ensure that you have the latest features and bug fixes. Microsoft provides direct support for the latest agent version and one version before.

## 1.1.67.0

### Release status

September 9, 2019: Released for auto update

### New features and improvements

* Ability to configure additional tracing and logging for debugging provisioning agent issues
* Ability to fetch only those AD attributes that are configured in the mapping to improve performance of sync

### Fixed issues

* Fixed a bug where-in the agent went into an unresponsive state if there were issues with AD connection failures
* Fixed a bug that caused issues when binary data was read from Active Directory
* Fixed a bug where-in the agent failed to renew trust with the cloud Hybrid Identity Service

## 1.1.30.0

### Release status

Jan 23, 2019: Released for download

### New features and improvements

* Revamped Provisioning Agent & Connector architecture for better performance, stability and reliability 
* Simplified Provisioning Agent configuration using UI-driven Installation Wizard 
* Added support for automatic agent updates

