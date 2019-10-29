---
title: Azure AD Connect Health - Diagnose duplicated attribute synchronization errors | Microsoft Docs
description: This document describes the diagnosis process of duplicated attribute synchronization errors and a potential fix of the orphaned object scenarios directly from the Azure portal.
services: active-directory
documentationcenter: ''
author: zhiweiwangmsft
manager: maheshu
editor: billmath
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/11/2018
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Diagnose and remediate duplicated attribute sync errors

## Overview
Taking one step farther to highlight sync errors, Azure Active Directory (Azure AD) Connect Health introduces self-service remediation. It troubleshoots duplicated attribute sync errors and fixes objects that are orphaned from Azure AD.
The diagnosis feature has these benefits:
- It provides a diagnostic procedure that narrows down duplicated attribute sync errors. And it gives specific fixes.
- It applies a fix for dedicated scenarios from Azure AD to resolve the error in a single step.
- No upgrade or configuration is required to enable this feature.
For more information about Azure AD, see [Identity synchronization and duplicate attribute resiliency](how-to-connect-syncservice-duplicate-attribute-resiliency.md).

## Problems
### A common scenario
When **QuarantinedAttributeValueMustBeUnique** and **AttributeValueMustBeUnique** sync errors happen, it's common to see a **UserPrincipalName** or **Proxy Addresses** conflict in Azure AD. You might solve the sync errors by updating the conflicting source object from the on-premises side. The sync error will be resolved after the next sync. 
For example, this image indicates that two users have a conflict of their **UserPrincipalName**. Both are **Joe.J\@contoso.com**. The conflicting objects are quarantined in Azure AD.

![Diagnose sync error common scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixCommonCase.png)

### Orphaned object scenario
Occasionally, you might find that an existing user loses the **Source Anchor**. The deletion of the source object happened in on-premises Active Directory. But the change of deletion signal never got synchronized to Azure AD. This loss happens for reasons like sync engine issues or domain migration. When the same object gets restored or recreated, logically, an existing user should be the user to sync from the **Source Anchor**. 

When an existing user is a cloud-only object, you can also see the conflicting user synchronized to Azure AD. The user can't be matched in sync to the existing object. There's no direct way to remap the **Source Anchor**. See more about the [existing knowledge base](https://support.microsoft.com/help/2647098). 

As an example, the existing object in Azure AD preserves the license of Joe. A newly synchronized object with a different **Source Anchor** occurs in a duplicated attribute state in Azure AD. Changes for Joe in on-premises Active Directory won't be applied to Joe’s original user (existing object) in Azure AD.  

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
> To access this feature, **Global Admin** permission, or **Contributor** permission from the RBAC settings, is required.
>

Follow the steps from the Azure portal to narrow down the sync error details and provide more specific solutions:

![Sync error diagnosis steps](./media/how-to-connect-health-diagnose-sync-errors/IIdFixSteps.png)

From the Azure portal, take a few steps to identify specific fixable scenarios:  
1.	Check the **Diagnose status** column. The status shows if there's a possible way to fix a sync error directly from Azure Active Directory. In other words, a troubleshooting flow exists that can narrow down the error case and potentially fix it.

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
1. Check if Azure Active Directory has an object with the provided **UserPrincipalName**. If not, answer **No**.
2. If it does, check whether the object is still in scope for syncing.  
   - Search in the Azure AD connector space by using the DN.
   - If the object is found in the **Pending Add** state, answer **No**. Azure AD Connect can't connect the object to the right Azure AD object.
   - If the object isn't found, answer **Yes**.

In these examples, the question tries to identify whether **Joe Jackson** still exists in on-premises Active Directory.
For the **common scenario**, both users **Joe Johnson** and **Joe Jackson** are present in on-premises Active Directory. The quarantined objects are two different users.

![Diagnose sync error common scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixCommonCase.png)

For the **orphaned object scenario**, only the single user **Joe Johnson** is present in on-premises Active Directory:

![Diagnose sync error orphaned object *does user exist* scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixOrphanedCase.png)

### Do both of these accounts belong to the same user?
This question checks an incoming conflicting user and the existing user object in Azure AD to see if they belong to the same user.  
1. The conflicting object is newly synced to Azure Active Directory. Compare the objects' attributes:  
   - Display Name
   - User Principal Name
   - Object ID
2. If Azure AD fails to compare them, check whether Active Directory has objects with the provided **UserPrincipalNames**. Answer **No** if you find both.

In the following example, the two objects belong to the same user **Joe Johnson**.

![Diagnose sync error orphaned object *same user* scenario](./media/how-to-connect-health-diagnose-sync-errors/IIdFixOrphanedCase.png)


## What happens after the fix is applied in the orphaned object scenario
Based on the answers to the preceding questions, you'll see the **Apply Fix** button when there's a fix available from Azure AD. In this case, the on-premises object is syncing with an unexpected Azure AD object. The two objects are mapped by using the **Source Anchor**. The **Apply Fix** change takes these or similar steps:
1. Updates the **Source Anchor** to the correct object in Azure AD.
2. Deletes the conflicting object in Azure AD if it's present.

![Diagnose sync error after the fix](./media/how-to-connect-health-diagnose-sync-errors/IIdFixAfterFix.png)

>[!IMPORTANT]
> The **Apply Fix** change applies only to orphaned object cases.
>

After the preceding steps, the user can access the original resource, which is a link to an existing object. 
The **Diagnose status** value in the list view updates to **Pending Sync**.
The sync error will be resolved after the next sync. Connect Health will no longer show the resolved sync error in the list view.

## Failures and error messages
**User with conflicting attribute is soft deleted in the Azure Active Directory. Ensure the user is hard deleted before retry.**  
The user with conflicting attribute in Azure AD should be cleaned before you can apply fix. Check out [how to delete the user permanently in Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-restore) before retrying the fix. The user will also be automatically deleted permanently after 30 days in soft deleted state. 

**Updating source anchor to cloud-based user in your tenant is not supported.**  
Cloud-based user in Azure AD should not have source anchor. Updating source anchor is not supported in this case. Manual fix is required from on premises. 

## FAQ
**Q.** What happens if execution of the **Apply Fix** fails?  
**A.** If execution fails, it's possible that Azure AD Connect is running an export error. Refresh the portal page and retry after the next sync. The default sync cycle is 30 minutes. 


**Q.** What if the **existing object** should be the object to be deleted?  
**A.** If the **existing object** should be deleted, the process doesn't involve a change of **Source Anchor**. Usually, you can fix it from on-premises Active Directory. 


**Q.** What permission does a user need to apply the fix?  
**A.** **Global Admin**, or **Contributor** from the RBAC settings, has permission to access the diagnostic and troubleshooting process.


**Q.** Do I have to configure Azure AD Connect or update the Azure AD Connect Health agent for this feature?  
**A.** No, the diagnosis process is a complete cloud-based feature.


**Q.** If the existing object is soft deleted, will the diagnosis process make the object active again?  
**A.** No, the fix won't update object attributes other than **Source Anchor**.
