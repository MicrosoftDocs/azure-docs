---
title: 'Microsoft Entra Connect Sync: Enable AD recycle bin'
description: This topic recommends the use of AD Recycle Bin feature with Microsoft Entra Connect.
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
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect Sync: Enable Active Directory recycle bin
We recommend that you enable the Active Directory Recycle Bin feature for your on-premises instances of Active Directory (AD) that are synchronized to Microsoft Entra ID. 

If you accidentally deleted an on-premises AD user object and restore it using the feature, Microsoft Entra ID restores the corresponding Microsoft Entra user object. For information about restoring Active Directory objects, see [Scenario overview for restoring deleted Active Directory objects](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd379542(v=ws.10)).

To learn how to enable the Active Directory Recycle Bin feature, see [Active Directory Administrative Center enhancements](/windows-server/identity/ad-ds/get-started/adac/introduction-to-active-directory-administrative-center-enhancements--level-100-#ad_recycle_bin_mgmt).

## Benefits of enabling the AD recycle bin
This feature helps with restoring Microsoft Entra user objects by doing the following:

* If you accidentally deleted an on-premises AD user object, the corresponding Microsoft Entra user object will be deleted in the next sync cycle. By default, Microsoft Entra ID keeps the deleted Microsoft Entra user object in soft-deleted state for 30 days.

* If you have on-premises AD Recycle Bin feature enabled, you can restore the deleted on-premises AD user object without changing its Source Anchor value. When the recovered on-premises AD user object is synchronized to Microsoft Entra ID, Microsoft Entra ID will restore the corresponding soft-deleted Microsoft Entra user object. For information about Source Anchor attribute, refer to article [Microsoft Entra Connect: Design concepts](./plan-connect-design-concepts.md#sourceanchor).

* If you do not have on-premises AD Recycle Bin feature enabled, you may be required to create an AD user object to replace the deleted object. If Microsoft Entra Connect Synchronization Service is configured to use system-generated AD attribute (such as ObjectGuid) for the Source Anchor attribute, the newly created AD user object will not have the same Source Anchor value as the deleted AD user object. When the newly created AD user object is synchronized to Microsoft Entra ID, Microsoft Entra ID creates a new Microsoft Entra user object instead of restoring the soft-deleted Microsoft Entra user object.

> [!NOTE]
> By default, Microsoft Entra ID keeps deleted Microsoft Entra user objects in soft-deleted state for 30 days before they are permanently deleted. However, administrators can accelerate the deletion of such objects. Once the objects are permanently deleted, they can no longer be recovered, even if on-premises AD Recycle Bin feature is enabled.

## Next steps
**Overview topics**

* [Microsoft Entra Connect Sync: Understand and customize synchronization](how-to-connect-sync-whatis.md)

* [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md)
