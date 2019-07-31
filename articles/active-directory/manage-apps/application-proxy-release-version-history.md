---
title: 'Azure AD Application Proxy: Version release history | Microsoft Docs'
description: This article lists all releases of Azure AD Application Proxy and describes new features and fixed issues
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG
editor: ''
ms.assetid: 
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/05/2019
ms.subservice: app-mgmt
ms.author: mimart

ms.collection: M365-identity-device-management
---
# Azure AD Application Proxy: Version release history
This article lists the versions and features of Azure Active Directory (Azure AD) Application Proxy that have been released. The Azure AD team regularly updates Application Proxy with new features and functionality. Application Proxy connectors are updated automatically when a new version is released.

Here is a list of related resources:

Resource |  Details
--------- | --------- |
How to enable Application Proxy | Pre-requisites for enabling Application Proxy and installing and registering a connector are described in this [tutorial](application-proxy-add-on-premises-application.md).
Understand Azure AD Application Proxy connectors | Find out more about [connector management](application-proxy-connectors.md) and how connectors [auto-upgrade](application-proxy-connectors.md#automatic-updates).
Azure AD Application Proxy Connector Download |  [Download the latest connector](https://download.msappproxy.net/subscription/d3c8b69d-6bf7-42be-a529-3fe9c2e70c90/connector/download).

## 1.5.612.0

### Release status

September 20, 2018: Released for download

### New features and improvements

- Added WebSocket support for the QlikSense application. To learn more about how to integrate QlikSense with Application Proxy, see this [walkthrough](application-proxy-qlik.md). 
- Improved the installation wizard to make it easier to configure an outbound proxy. 
- Set TLS 1.2 as the default protocol for connectors. 
- Added a new End-User License Agreement (EULA).  

### Fixed issues

- Fixed a bug that caused some memory leaks in the connector.
- Updated the Azure Service Bus version, which includes a bug fix for connector timeout issues.

## 1.5.402.0

### Release status

January 19, 2018: Released for download

### Fixed issues

- Added support for custom domains that need domain translation in the cookie.

## 1.5.132.0

### Release status 

May 25, 2017: Released for download 

### New features and improvements 

Improved control over connectors' outbound connection limits. 

## 1.5.36.0

### Release status

April 15, 2017: Released for download

### New features and improvements

- Simplified onboarding and management with fewer required ports. Application Proxy now requires opening only two standard outbound ports: 443 and 80. Application Proxy continues to use only outbound connections, so you still don't need any components in a DMZ. For details, see our [configuration documentation](application-proxy-add-on-premises-application.md).  
- If supported by your external proxy or firewall, you can now open your network by DNS instead of IP range. Application Proxy services require connections to *.msappproxy.net and *.servicebus.windows.net only.


## Earlier versions

If you're using an Application Proxy connector version earlier than 1.5.36.0, update to the latest version to ensure you have the latest fully supported features.

## Next steps
- Learn more about [Remote access to on-premises applications through Azure AD Application Proxy](application-proxy.md).
- To start using Application Proxy, see [Tutorial: Add an on-premises application for remote access through Application Proxy](application-proxy-add-on-premises-application.md).
