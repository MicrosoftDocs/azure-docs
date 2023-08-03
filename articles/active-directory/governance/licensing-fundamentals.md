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

## Next steps
- [What is Microsoft Entra ID Governance?](identity-governance-overview.md)