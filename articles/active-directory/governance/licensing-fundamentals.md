---
title: 'Microsoft Entra ID Governance licensing fundamentals'
description: This article describes shows the licensing requirements for Microsoft Entra ID Governance features.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/28/2023
ms.subservice: hybrid
ms.author: billmath
---

# Microsoft Entra ID Governance licensing fundamentals

The following tables show the licensing requirements for Microsoft Entra ID Governance features

## Types of licenses
The following licenses are available for use with Microsoft Entra ID Governance.  The type of licenses you need will depend on the features you're using.

- **Free** - Included with Microsoft cloud subscriptions such as Microsoft Azure, Microsoft 365, and others.1
- **Microsoft Azure AD P1** - Azure Active Directory P1 (becoming Microsoft Entra ID P1) is available as a standalone or included with Microsoft 365 E3 for enterprise customers and Microsoft 365 Business Premium for small to medium businesses. 
- **Microsoft Azure AD P2** - Azure Active Directory P2 (becoming Microsoft Entra ID P2) is available as a standalone or included with Microsoft 365 E5 for enterprise customers.
- **Microsoft Entra ID Governance** - Entra ID Governance is an advanced set of identity governance capabilities available for Microsoft Entra ID P1 and P2 customers.

>[!NOTE]
>Microsoft Entra ID Governance scenarios may depends upon other features that are not covered by Microsoft Entra ID Governance.  These features may have additional licensing requirements.  See [Governance capabilities in other Microsoft Entra features](identity-governance-overview.md#governance-capabilities-in-other-microsoft-entra-features) for more information on governance scenarios that rely on additional features.


## Features by license type
The following table shows what features are available with each license type.

|Feature|Free|Microsoft Entra ID P1|Microsoft Entra ID P2|Microsoft Entra ID Governance|
|-----|:-----:|:-----:|:-----:|:-----:| 
|HR-driven Provisioning||x|x|x|
|Automated user provisioning to SaaS apps|x|x|x|x|	 
|Automated group provisioning to SaaS apps||x|x|x|	 
|Automated provisioning to on-premises apps||x|x|x|
|CA - Terms of use attestation||x|x|x| 
|Entitlement Management (EM) - Basic entitlement management|||x|x|  
|EM CA Scoping|||x|x| 
|EM MyAccess Search|||x|x|  
|EM with Verified ID||||x|  
|EM + Custom Extensions (Logic Apps)||||x|  
|EM + Auto Assignment Policies||||x|   
|EM - Invite+Assign Any||||x| 
|EM - Guest Conversion API||||x| 
|EM - Grace Period - Public Preview|||x|x|  
|EM - Sponsors Policy - Public Preview||||x| 
|Privileged Identity Management (PIM)|||x|x| 
|PIM For Groups|||x|x| 
|PIM CA Controls|||x|x| 
|Access Reviews (AR) - Basic access certifications and reviews|||x|x| 
|AR - PIM For Groups - Public Preview||||x| 
|AR - Inactive Users||||x| 
|AR - Machine learning assisted access certifications and reviews||||x| 
|Lifecycle Workflows (LCW) J/M/L||||x|
|LCW + Custom Extensions (Logic Apps)||||x|   
|Identity governance dashboard - Public Preview||x|x|x|
|Insights and reporting - Inactive guest accounts (Preview)||||x| 


## Privileged Identity Management

To use Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra, a tenant must have a valid license. Licenses must also be assigned to the administrators and relevant users. This article describes the license requirements to use Privileged Identity Management.  To use Privileged Identity Management, you must have one of the following licenses:


### Valid licenses for PIM

You will need either Microsoft Entra ID Governance licenses or Azure AD Premium P2 licenses to use PIM and all of its settings. Currently, you can scope an access review to service principals with access to Azure AD and Azure resource roles with an Microsoft Entra Premuim P2 or Microsoft Entra ID Governance edition active in your tenant. The licensing model for service principals will be finalized for general availability of this feature and additional licenses may be required. 

### Licenses you must have for PIM
Ensure that your directory has Microsoft Entra Premuim P2 or Microsoft Entra ID Governance licenses for the following categories of users:

- Users with eligible and/or time-bound assignments to Azure AD or Azure roles managed using PIM
- Users with eligible and/or time-bound assignments as members or owners of PIM for Groups
- Users able to approve or reject activation requests in PIM
- Users assigned to an access review
- Users who perform access reviews


### Example license scenarios for PIM

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| Woodgrove Bank has 10 administrators for different departments and 2 Global Administrators that configure and manage PIM. They make five administrators eligible. | Five licenses for the administrators who are eligible | 5 |
| Graphic Design Institute has 25 administrators of which 14 are managed through PIM. Role activation requires approval and there are three different users in the organization who can approve activations. | 14 licenses for the eligible roles + three approvers | 17 |
| Contoso has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are five different users in the organization who can approve activations. Contoso also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which six are not in administrator roles managed by PIM. | 42 licenses for the eligible roles + five approvers + six reviewers | 53 |

### When a license expires for PIM

If a Microsoft Azure AD Premuim P2, Microsoft Entra ID Governance, or trial license expires, Privileged Identity Management features will no longer be available in your directory:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Privileged Identity Management service in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of Privileged Identity Management, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Privileged Identity Management configuration settings will be removed.
- Privileged Identity Management will no longer send emails on role assignment changes.

## Next steps
- [What is Microsoft Entra ID Governance?](identity-governance-overview.md)