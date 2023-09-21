---
title: Microsoft Entra Connect Health - Diagnose duplicated attribute synchronization errors
description: This document describes the diagnosis process of duplicated attribute synchronization errors and a potential fix of the orphaned object scenarios directly from the [Microsoft Entra admin center](https://entra.microsoft.com).
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: billmath
ms.service: active-directory
ms.subservice: hybrid
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Diagnose and remediate duplicated attribute sync errors

## Overview
Taking one step farther to highlight sync errors, Microsoft Entra Connect Health introduces self-service remediation. It troubleshoots duplicated attribute sync errors and fixes objects that are orphaned from Microsoft Entra ID.
The diagnosis feature has these benefits:
- It provides a diagnostic procedure that narrows down duplicated attribute sync errors. And it gives specific fixes.
- It applies a fix for dedicated scenarios from Microsoft Entra ID to resolve the error in a single step.
- No upgrade or configuration is required to enable this feature.
For more information about Microsoft Entra ID, see [Identity synchronization and duplicate attribute resiliency](how-to-connect-syncservice-duplicate-attribute-resiliency.md).

## Problems
### A common scenario
When **QuarantinedAttributeValueMustBeUnique** and **AttributeValueMustBeUnique** sync errors happen, it's common to see a **UserPrincipalName** or **Proxy Addresses** conflict in Microsoft Entra ID. You might solve the sync errors by updating the conflicting source object from the on-premises side. The sync error will be resolved after the next sync. 
For example, this image indicates that two users have a conflict of their **UserPrincipalName**. Both are **Joe.J\@contoso.com**. The conflicting objects are quarantined in Microsoft Entra ID.

![Diagnose sync error common scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixCommonCase.png)

### Orphaned object scenario
Occasionally, you might find that an existing user loses the **Source Anchor**. The deletion of the source object happened in on-premises Active Directory. But the change of deletion signal never got synchronized to Microsoft Entra ID. This loss happens for reasons like sync engine issues or domain migration. When the same object gets restored or recreated, logically, an existing user should be the user to sync from the **Source Anchor**. 

When an existing user is a cloud-only object, you can also see the conflicting user synchronized to Microsoft Entra ID. The user can't be matched in sync to the existing object. There's no direct way to remap the **Source Anchor**. See more about the [existing knowledge base](https://support.microsoft.com/help/2647098). 

As an example, the existing object in Microsoft Entra ID preserves the license of Joe. A newly synchronized object with a different **Source Anchor** occurs in a duplicated attribute state in Microsoft Entra ID. Changes for Joe in on-premises Active Directory won't be applied to Joe’s original user (existing object) in Microsoft Entra ID.  

![Diagnose sync error orphaned object scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixOrphanedCase.png)

## Diagnostic and troubleshooting steps in Connect Health 
The diagnose feature supports user objects with the following duplicated attributes:

| Attribute name | Synchronization error types|
| ------------------ | -----------------|
| UserPrincipalName | QuarantinedAttributeValueMustBeUnique or AttributeValueMustBeUnique | 
| ProxyAddresses | QuarantinedAttributeValueMustBeUnique or AttributeValueMustBeUnique | 
| SipProxyAddress | AttributeValueMustBeUnique | 
| OnPremiseSecurityIdentifier |  AttributeValueMustBeUnique |

>[!IMPORTANT]
> To access this feature, **Global Administrator** permission, or **Contributor** permission from Azure RBAC, is required.
>

Follow the steps from the [Microsoft Entra admin center](https://entra.microsoft.com) to narrow down the sync error details and provide more specific solutions:

![Sync error diagnosis steps](./media/how-to-connect-health-diagnose-sync-errors/IIdFixSteps.png)

From the [Microsoft Entra admin center](https://entra.microsoft.com), take a few steps to identify specific fixable scenarios:  
1. Check the **Diagnose status** column. The status shows if there's a possible way to fix a sync error directly from Microsoft Entra ID. In other words, a troubleshooting flow exists that can narrow down the error case and potentially fix it.

| Status | What does it mean? |
| ------------------ | -----------------|
| Not Started | You haven't visited this diagnosis process. Depending on the diagnostic result, there's a potential way to fix the sync error directly from the portal. |
| Manual Fix Required | The error doesn't fit the criteria of available fixes from the portal. Either conflicting object types aren't users, or you already went through the diagnostic steps, and no fix resolution was available from the portal. In the latter case, a fix from the on-premises side is still one of the solutions. [Read more about on-premises fixes](https://support.microsoft.com/help/2647098). | 
| Pending Sync | A fix was applied. The portal is waiting for the next sync cycle to clear the error. |

  >[!IMPORTANT]
  > The diagnostic status column will reset after each sync cycle. 
  >

1. Select the **Diagnose** button under the error details. You'll answer a few questions and identify the sync error details. Answers to the questions help identify an orphaned object case.

1. If a **Close** button appears at the end of the diagnostics, there's no quick fix available from the portal based on your answers. Refer to the solution shown in the last step. Fixes from on-premises are still the solutions. Select the **Close** button. The status of the current sync error switches to **Manual fix required**. The status stays during the current sync cycle.

1. After an orphaned object case is identified, you can fix the duplicated attributes sync errors directly from the portal. To trigger the process, select the **Apply Fix** button. The status of the current sync error updates to **Pending sync**.

1. After the next sync cycle, the error should be removed from the list.

## How to answer the diagnosis questions 
### Does the user exist in your on-premises Active Directory?

This question tries to identify the source object of the existing user from on-premises Active Directory.  
1. Check if Microsoft Entra ID has an object with the provided **UserPrincipalName**. If not, answer **No**.
2. If it does, check whether the object is still in scope for syncing.  
   - Search in the Microsoft Entra connector space by using the DN.
   - If the object is found in the **Pending Add** state, answer **No**. Microsoft Entra Connect can't connect the object to the right Microsoft Entra object.
   - If the object isn't found, answer **Yes**.

In these examples, the question tries to identify whether **Joe Jackson** still exists in on-premises Active Directory.
For the **common scenario**, both users **Joe Johnson** and **Joe Jackson** are present in on-premises Active Directory. The quarantined objects are two different users.

![Diagnose sync error common scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixCommonCase.png)

For the **orphaned object scenario**, only the single user **Joe Johnson** is present in on-premises Active Directory:

![Diagnose sync error orphaned object *does user exist* scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixOrphanedCase.png)

### Do both of these accounts belong to the same user?
This question checks an incoming conflicting user and the existing user object in Microsoft Entra ID to see if they belong to the same user.  
1. The conflicting object is newly synced to Microsoft Entra ID. Compare the objects' attributes:  
   - Display Name
   - UserPrincipalName or SignInName
   - ObjectID
2. If Microsoft Entra ID fails to compare them, check whether Active Directory has objects with the provided **UserPrincipalNames**. Answer **No** if you find both.

In the following example, the two objects belong to the same user **Joe Johnson**.

![Diagnose sync error orphaned object *same user* scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixOrphanedCase.png)


## What happens after the fix is applied in the orphaned object scenario
Based on the answers to the preceding questions, you'll see the **Apply Fix** button when there's a fix available from Microsoft Entra ID. In this case, the on-premises object is syncing with an unexpected Microsoft Entra object. The two objects are mapped by using the **Source Anchor**. The **Apply Fix** change takes these or similar steps:
1. Updates the **Source Anchor** to the correct object in Microsoft Entra ID.
2. Deletes the conflicting object in Microsoft Entra ID if it's present.

![Diagnose sync error after the fix](./media/how-to-connect-health-diagnose-sync-errors/IIdFixAfterFix.png)

>[!IMPORTANT]
> The **Apply Fix** change applies only to orphaned object cases.
>

After the preceding steps, the user can access the original resource, which is a link to an existing object. 
The **Diagnose status** value in the list view updates to **Pending Sync**.
The sync error will be resolved after the next sync. Connect Health will no longer show the resolved sync error in the list view.

## Failures and error messages
**User with conflicting attribute is soft deleted in the Microsoft Entra ID. Ensure the user is hard deleted before retry.**  
The user with conflicting attribute in Microsoft Entra ID should be cleaned before you can apply fix. Check out [how to delete the user permanently in Microsoft Entra ID](../../fundamentals/users-restore.md) before retrying the fix. The user will also be automatically deleted permanently after 30 days in soft deleted state. 

**Updating source anchor to cloud-based user in your tenant is not supported.**  
Cloud-based user in Microsoft Entra ID should not have source anchor. Updating source anchor is not supported in this case. Manual fix is required from on premises. 

**The fix process failed to update the values.**
The specific settings such as [UserWriteback in Microsoft Entra Connect](./how-to-connect-preview.md#user-writeback) is not supported. Please disable in the settings. 

## FAQ
**Q.** What happens if execution of the **Apply Fix** fails?  
**A.** If execution fails, it's possible that Microsoft Entra Connect is running an export error. Refresh the portal page and retry after the next sync. The default sync cycle is 30 minutes. 


**Q.** What if the **existing object** should be the object to be deleted?  
**A.** If the **existing object** should be deleted, the process doesn't involve a change of **Source Anchor**. Usually, you can fix it from on-premises Active Directory. 


**Q.** What permission does a user need to apply the fix?  
**A.** **Global Administrator**, or **Contributor** from Azure RBAC, has permission to access the diagnostic and troubleshooting process.


**Q.** Do I have to configure Microsoft Entra Connect or update the Microsoft Entra Connect Health agent for this feature?  
**A.** No, the diagnosis process is a complete cloud-based feature.


**Q.** If the existing object is soft deleted, will the diagnosis process make the object active again?  
**A.** No, the fix won't update object attributes other than **Source Anchor**.
