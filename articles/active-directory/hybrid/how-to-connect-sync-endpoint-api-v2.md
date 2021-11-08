---
title: 'Azure AD Connect sync V2 endpoint | Microsoft Docs'
description: This document covers updates to the Azure AD connect sync v2 endpoints API.
services: active-directory
author: billmath
manager: daveba
editor: ''
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/04/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD Connect sync V2 endpoint API 
Microsoft has deployed a new endpoint (API) for Azure AD Connect that improves the performance of the synchronization service operations to Azure Active Directory. By utilizing the new V2 endpoint, you will experience noticeable performance gains on export and import to Azure AD. This new endpoint supports the following:
    
 - syncing groups with up to 250k members
 - performance gains on export and import to Azure AD
 
> [!NOTE]
> Currently, the new endpoint does not have a configured group size limit for Microsoft 365 groups that are written back. This may have an effect on your Active Directory and sync cycle latencies. It is recommended to increase your group sizes incrementally.  

>[!NOTE]
> The Azure AD Connect sync V2 endpoint API is Generally Available but currently can only be used in these Azure environments:
> - Azure Commercial
> - Azure China cloud
> - Azure US Government cloud
> It will not be made available in the Azure German cloud

## Prerequisites  
In order to use the new V2 endpoint, you will need to use Azure AD Connect v2.0. When you deploy AADConnect V2.0, the V2 endpoint will be automatically enabled.
Note that support for the V2 endpoint is no longer available for V1.x versions. If you need to sync groups with more than 50K members you need to upgrade to Azure AD Connect V2.0.

## Frequently asked questions  
 
**When will the new end point become the default for upgrades and new installations?**  
The V2 endpoint is the default setting for AADConnect V2.0 and is not supported for AADConnect V1.x

## Next steps

* [Azure AD Connect sync: Understand and customize synchronization](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)
