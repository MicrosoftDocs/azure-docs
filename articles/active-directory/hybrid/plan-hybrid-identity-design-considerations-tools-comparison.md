---
title: 'Hybrid Identity: Directory integration tools comparison | Microsoft Docs'
description: This is page provides a comprehensive table that compares the various directory integration tools that can be used for directory integration.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
ms.assetid: 1e62a4bd-4d55-4609-895e-70131dedbf52
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/07/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Hybrid Identity directory integration tools comparison
Over the years the directory integration tools have grown and evolved.  


- [FIM](https://docs.microsoft.com/previous-versions/windows/desktop/forefront-2010/ff182370%28v%3dvs.100%29) and [MIM](https://docs.microsoft.com/microsoft-identity-manager/microsoft-identity-manager-2016) are still supported and primarily enable synchronization between on-premises systems.   The [FIM Windows Azure AD Connector](https://docs.microsoft.com/previous-versions/mim/dn511001(v=ws.10)?redirectedfrom=MSDN) is supported in both FIM and MIM, but not recommended for new deployments - customers with on-premises sources such as Notes or SAP HCM should use MIM to populate Active Directory Domain Services (AD DS) and then also use either Azure AD Connect sync or Azure AD Connect cloud provisioning to synchronize from AD DS to Azure AD.
- [Azure AD Connect sync](how-to-connect-sync-whatis.md) incorporates the components and functionality previously released in DirSync and Azure AD Sync, for synchronizing between AD DS forests and Azure AD.  
- [Azure AD Connect cloud provisioning](../cloud-provisioning/what-is-cloud-provisioning.md) is a new Microsoft agent for synching from AD DS to Azure AD, useful for scenarios such as merger and acquisition where the acquired company's AD forests are isolated from the parent company's AD forests.

To learn more about the differences between Azure AD Connect sync and Azure AD Connect cloud provisioning, see the article [What is Azure AD Connect cloud provisioning?](../cloud-provisioning/what-is-cloud-provisioning.md)

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).

