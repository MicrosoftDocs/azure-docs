---
title: 'Microsoft Entra pass-through authentication: Version release history'
description: This article lists all releases of the Microsoft Entra pass-through authentication agent
services: active-directory
author: billmath
manager: amycolannino
ms.assetid: ef2797d7-d440-4a9a-a648-db32ad137494
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Microsoft Entra pass-through authentication agent: Version release history
 
The agents installed on-premises that enable Pass-through Authentication are updated regularly to provide new capabilities. This article lists the versions and features that are added when new functionality is introduced. Pass-through authentication agents are updated automatically when a new version is released. 

Here are related topics: 

- [User sign-in with Microsoft Entra pass-through authentication](how-to-connect-pta.md) 
- [Microsoft Entra pass-through authentication agent installation](how-to-connect-pta-quick-start.md) 

## 1.5.2482.0
### Release Status: 
07/07/2021: Released for download

### New features and improvements

- Upgraded the packages/libraries to newer versions signed using SHA-256RSA.

## 1.5.1742.0
### Release Status: 
04/09/2020: Released for download

### New features and improvements

- Added support for targeting cloud environments upon installation. The bundle can be pinned to a given cloud environment.



## 1.5.1007.0 
### Release status 
1/22/2019: Released for download  
### New features and improvements 
- Added support for Service Bus reliable channels to add another layer of connection resiliency for outbound connections 
- Enforce TLS 1.2 during agent registration 

## 1.5.643.0 
### Release status 
4/10/2018: Released for download  
### New features and improvements 
- Web socket connection support 
- Set TLS 1.2 as the default protocol for the agent 
 
## 1.5.405.0 
### Release status 
1/31/2018: Released for download  
### Fixed issues 
- Fixed a bug that caused some memory leaks in the agent. 
- Updated the Azure Service Bus version, which includes a bug fix for connector timeout issues. 
### New features and improvements 
- Added support for websocket based connections between the agent and Microsoft Entra services to improve connection resiliency

## 1.5.402.0 
### Release status 
11/25/2017: Released for download  
### Fixed issues 
- Fixed bugs related to the DNS cache for default proxy scenarios 
 
## 1.5.389.0 
### Release status 
10/17/2017: Released for download  
### New features and improvements 
- Added DNS cache functionality for outbound connections to add resiliency from DNS failures 
 
## 1.5.261.0 
### Release status 
08/31/2017: Released for download  
### New features and improvements 
- GA version of the Microsoft Entra pass-through authentication agent 

## Next steps

- [User sign-in with Microsoft Entra pass-through authentication](how-to-connect-pta.md)
