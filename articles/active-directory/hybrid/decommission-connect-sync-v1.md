---
title: 'Decommissioning Azure AD Connect V1'
description: This article describes Azure AD Connect V1 decommissioning and how to migrate to V2.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/31/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Decommission Azure AD Connect V1

Azure AD Connect was released several years ago. Since this time, several of the components that Azure AD Connect uses have been scheduled for deprecation and updated to newer versions.  To address this, we've bundled as many of these newer components into a new, single release, so you only have to update once. This release is Azure AD Connect V2. 

Azure AD Connect V1 has been retired as of August 31, 2022 and is no longer supported. Azure AD Connect V1 installations may stop working unexpectedly. 

On **October 1st 2023**, Azure AD Connect V1 will be full decommissioned.  After this date, it will not work or synchronize with Azure AD.  

If you are still using Azure AD Connect V1 you need to upgrade to Azure AD Connect V2 immediately.

>[!IMPORTANT]
>Azure AD Connect V1 will stop working on October 1st 2023.  You need to migrate to cloud sync or connect sync V2.

##  Migrate to cloud sync
Before moving to Azure AD Connect V2, you should see if cloud sync is right for you.  Cloud sync uses the light-weight provisioning agent and fully configurable via through the portal.  For more information, see [What is cloud sync?](cloud-sync/what-is-cloud-sync.md) and [What is the provisioning agent?](cloud-sync/what-is-provisioning-agent.md)

Based on your environment and needs, you may qualify for moving to cloud sync.  For a comparison of cloud sync and connect sync, see [Comparison between cloud sync and connect sync](cloud-sync/what-is-cloud-sync.md#comparison-between-azure-ad-connect-and-cloud-sync)

To make sure you're using the best sync tool for your org, select [Check sync tool.](https://setup.microsoft.com/azure/add-or-sync-users-to-azure-ad) Then use the wizard to determine whether cloud sync or connect sync is the right tool for you.

## Migrating to Azure AD Connect V2
If you aren't eligible to move to cloud sync, use the table for more information on migrating to V2.

|Title|Description|
|-----|-----|
|[Information on deprecation](connect/deprecated-azure-ad-connect.md)|Information on Azure AD Connect V1 deprecation|
|[What is Azure AD Connect V2?](connect/whatis-azure-ad-connect-v2.md)|Information on the latest version of Azure AD Connect|
|[Upgrading from a previous version](connect/how-to-upgrade-previous-version.md)|Information on moving from one version of Azure AD Connect to another


## Frequently asked questions



## Next steps

- [What is Azure AD Connect V2?](whatis-azure-ad-connect-v2.md)
- [Azure AD Cloud Sync](../cloud-sync/what-is-cloud-sync.md)
- [Azure AD Connect version history](reference-connect-version-history.md)