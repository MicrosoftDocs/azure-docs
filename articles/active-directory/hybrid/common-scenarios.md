---
title: 'Common hybrid scenarios with Microsoft Entra ID'
description: This article describes the common scenarios for using Microsoft Entra Connect cloud sync and Microsoft Entra Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/25/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Hybrid scenarios 
The following document describes the common and supported hybrid sync scenarios.

## Supported sync scenarios
The following table outlines the most common and supported sync scenarios.

|Scenario|Supported with cloud sync|Supported with connect sync|Supported with MIM and the Graph Connector|Supported with ECMA Host connector|
|-----|-----|-----|-----|-----|
|New Hybrid customers managing identities|●|●|●|N/A|
|Mergers and acquisitions (disconnected forest)|●|N/A|●|N/A|
|High availability - latency (I need high availability)|●|N/A|●|N/A|
|Migration from connect sync to cloud sync|●|●|N/A|N/A|
|Microsoft Entra hybrid join|N/A|●|N/A|N/A|
|Exchange hybrid|●|●|N/A|N/A|
|User accounts in one forest / mailboxes in resource forest|N/A|●|N/A|N/A|
|Sync large domains with more than 250K objects|N/A|●|●|N/A|
|Filter directory objects based on attribute values|N/A|●|●|N/A|
|Windows Hello for Business|N/A|●|N/A|N/A|
|Synchronize from cloud to on-premises AD|N/A|N/A|●|N/A|
|Synchronize from cloud to on-premises LDAP|N/A|N/A|●|●|
|Synchronize from cloud to on-premises SQL|N/A|N/A|●|●|

For additional information, see [Supported topologies for cloud sync](cloud-sync/plan-cloud-sync-topologies.md) and [Supported topologies for connect sync](connect/plan-connect-topologies.md)


## Additional information
- You can sync users & groups from the same domain using Connect Sync and cloud sync if:
    - Scoping filters in each sync is mutually exclusive
    - If inclusive, don’t have the same attributes values clashing (Precedence isn’t supported)
- You can sync users & groups using Connect Sync while using cloud sync’s net new capabilities (*called out in Roadmap)
- You can sync objects from a single AD to multiple Azure ADs if writeback capabilities are enabled only in a single Microsoft Entra tenant.


## Cloud sync and connect sync in parallel
You can run cloud sync and Microsoft Entra Connect in the same forest.  You can use cloud sync to manage your users and groups and use Microsoft Entra Connect for devices, for example.  You may decide to do allow cloud sync to handle 80% and use Microsoft Entra Connect for some of your more obscure, 20% scenarios.  The tutorial, [Migrate to Microsoft Entra Connect cloud sync for an existing synced AD forest](cloud-sync/tutorial-pilot-aadc-aadccp.md) shows an example of how you would run each.

## Common authentication methods and scenarios

Hybrid identity scenarios use one of three authentication methods.   The three methods are: 

- **[Password hash synchronization (PHS)](connect/whatis-phs.md)**  
- **[Pass-through authentication (PTA)](connect/how-to-connect-pta.md)**  
- **[Federation (AD FS)](connect/whatis-fed.md)** 

These authentication methods also provide [single-sign on](connect/how-to-connect-sso.md) capabilities.  Single-sign on automatically signs your users in when they are on their corporate devices, connected to your corporate network.

For additional information, see [Choose the right authentication method for your Microsoft Entra hybrid identity solution](connect/choose-ad-authn.md). 

|I need to:|PHS and SSO| PTA and SSO|Federation| 
|-----|-----|-----|-----| 
|Sync new user, contact, and group accounts created in my on-premises Active Directory to the cloud automatically.|●| ● |●| 
|Set up my tenant for Microsoft 365 hybrid scenarios.|●| ● |●| 
|Enable my users to sign in and access cloud services using their on-premises password.|●| ● |●| 
|Implement single sign-on using corporate credentials.|●| ● |●|  
|Ensure no password hashes are stored in the cloud.| |●|●| 
|Enable cloud-based multi-factor authentication solutions.|●|●|●| 
|Enable on-premises multi-factor authentication solutions.| | |●| 
|Support smartcard authentication for my users.| | |●| 

## Next steps
- [Tools for synchronization](sync-tools.md)
- [Choosing the right sync tool](https://setup.microsoft.com/azure/add-or-sync-users-to-azure-ad)
- [Steps to start](get-started.md)
- [Prerequisites](prerequisites.md)
