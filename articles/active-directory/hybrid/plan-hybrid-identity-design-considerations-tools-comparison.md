---
title: 'Hybrid Identity: Directory integration tools comparison | Microsoft Docs'
description: This is page provides a comprehensive table that compares the various directory integration tools that can be used for directory integration.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: 1e62a4bd-4d55-4609-895e-70131dedbf52
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 04/18/2022
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Hybrid Identity directory integration tools comparison
Over the years the directory integration tools have grown and evolved.  


- [MIM](/microsoft-identity-manager/microsoft-identity-manager-2016) is still supported, and primarily enables synchronization from or between on-premises systems.  The [FIM Windows Azure AD Connector](/previous-versions/mim/dn511001(v=ws.10)) is deprecated. Customers with on-premises sources such as Notes or SAP HCM should use MIM in one of two topologies.
    - If users and groups are needed in Active Directory Domain Services (AD DS), then use MIM to populate users and groups into AD DS, and use either Azure AD Connect sync or Azure AD Connect cloud provisioning to synchronize those users and groups from AD DS to Azure AD.
    - If users and groups are not needed in AD DS, then use MIM to populate users and groups into Azure AD through the [MIM Graph connector](/microsoft-identity-manager/microsoft-identity-manager-2016-connector-graph).
- [Azure AD Connect sync](how-to-connect-sync-whatis.md) incorporates the components and functionality previously released in DirSync and Azure AD Sync, for synchronizing between AD DS forests and Azure AD.  
- [Azure AD Connect cloud provisioning](../cloud-sync/what-is-cloud-sync.md) is a new Microsoft agent for synching from AD DS to Azure AD, useful for scenarios such as merger and acquisition where the acquired company's AD forests are isolated from the parent company's AD forests.

To learn more about the differences between Azure AD Connect sync and Azure AD Connect cloud provisioning, see the article [What is Azure AD Connect cloud provisioning?](../cloud-sync/what-is-cloud-sync.md).  For more information on deployment options with multiple HR sources or directories, then see the article [parallel and combined identity infrastructure options](../fundamentals/azure-active-directory-parallel-identity-options.md).

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
