---
title: 'Azure AD Connect sync: Enable AD recycle bin | Microsoft Docs'
description: This topic recommends the use of AD Recycle Bin feature with Azure AD Connect.
services: active-directory
keywords: AD Recycle Bin, accidental deletion, source anchor
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.assetid: afec4207-74f7-4cdd-b13a-574af5223a90
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/21/2022
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect sync: Enable Active Directory recycle bin
We recommend that you enable the Active Directory Recycle Bin feature for your on-premises instances of Active Directory (AD) that are synchronized to Azure AD. 

If you accidentally deleted an on-premises AD user object and restore it using the feature, Azure AD restores the corresponding Azure AD user object. For information about restoring Active Directory objects, see [Scenario overview for restoring deleted Active Directory objects](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd379542(v=ws.10)).

To learn how to enable the Active Directory Recycle Bin feature, see [Active Directory Administrative Center enhancements](/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#ad_recycle_bin_mgmt).

## Benefits of enabling the AD recycle bin
This feature helps with restoring Azure AD user objects by doing the following:

* If you accidentally deleted an on-premises AD user object, the corresponding Azure AD user object will be deleted in the next sync cycle. By default, Azure AD keeps the deleted Azure AD user object in soft-deleted state for 30 days.

* If you have on-premises AD Recycle Bin feature enabled, you can restore the deleted on-premises AD user object without changing its Source Anchor value. When the recovered on-premises AD user object is synchronized to Azure AD, Azure AD will restore the corresponding soft-deleted Azure AD user object. For information about Source Anchor attribute, refer to article [Azure AD Connect: Design concepts](./plan-connect-design-concepts.md#sourceanchor).

* If you do not have on-premises AD Recycle Bin feature enabled, you may be required to create an AD user object to replace the deleted object. If Azure AD Connect Synchronization Service is configured to use system-generated AD attribute (such as ObjectGuid) for the Source Anchor attribute, the newly created AD user object will not have the same Source Anchor value as the deleted AD user object. When the newly created AD user object is synchronized to Azure AD, Azure AD creates a new Azure AD user object instead of restoring the soft-deleted Azure AD user object.

> [!NOTE]
> By default, Azure AD keeps deleted Azure AD user objects in soft-deleted state for 30 days before they are permanently deleted. However, administrators can accelerate the deletion of such objects. Once the objects are permanently deleted, they can no longer be recovered, even if on-premises AD Recycle Bin feature is enabled.

## Next steps
**Overview topics**

* [Azure AD Connect sync: Understand and customize synchronization](how-to-connect-sync-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)
