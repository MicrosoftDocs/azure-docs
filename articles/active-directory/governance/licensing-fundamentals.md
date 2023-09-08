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
The following licenses are available for use with Microsoft Entra ID Governance.  The choice of licenses you need in a tenant will depend on the features you're using in that tenant.

- **Free** - Included with Microsoft cloud subscriptions such as Microsoft Azure, Microsoft 365, and others.
- **Microsoft Azure AD P1** - Azure Active Directory Premium P1 (becoming Microsoft Entra ID P1) is available as a standalone product or included with Microsoft 365 E3 for enterprise customers and Microsoft 365 Business Premium for small to medium businesses. 
- **Microsoft Azure AD P2** - Azure Active Directory Premium P2 (becoming Microsoft Entra ID P2) is available as a standalone product or included with Microsoft 365 E5 for enterprise customers.
- **Microsoft Entra ID Governance** - Entra ID Governance is an advanced set of identity governance capabilities available for Microsoft Entra ID P1 and P2 customers, as two products **Microsoft Entra ID Governance** and **Microsoft Entra ID Governance Step Up for Microsoft Entra ID P2**.

>[!NOTE]
>Microsoft Entra ID Governance scenarios may depends upon other features that are not covered by Microsoft Entra ID Governance.  These features may have additional licensing requirements.  See [Governance capabilities in other Microsoft Entra features](identity-governance-overview.md#governance-capabilities-in-other-microsoft-entra-features) for more information on governance scenarios that rely on additional features.


### Prerequisites

The Microsoft Entra ID Governance capabilities are currently available in two products. These two products provide the same identity governance capabilities. The difference between the two products is that they have different prerequisites.

- A subscription to **Microsoft Entra ID Governance** requires that the tenant also have an active subscription to another product, one that contains the `AAD_PREMIUM` or `AAD_PREMIUM_P2` service plan. Examples of products meeting this prerequisite include **Microsoft Azure Active Directory Premium P1** or **Microsoft 365 E3**.
- A subscription to **Microsoft Entra ID Governance Step Up for Microsoft Entra ID P2** requires that the tenant also have an active subscription to another product, one that contains the `AAD_PREMIUM_P2` service plan.  Examples of products meeting this prerequisite include **Microsoft Azure Active Directory Premium P2** or **Microsoft 365 E5**.

The [product names and service plan identifiers for licensing](../enterprise-users/licensing-service-plan-reference.md) lists additional products that include the prerequisite service plans.

>[!NOTE]
>A subscription to a prerequisite for an Microsoft Entra ID Governance product must be active in the tenant. If a prerequisite is not present, or the subscription expires, then Microsoft Entra ID Governance scenarios may not function as expected.  

To check if the prerequisite products for a Microsoft Entra ID Governance product are present in a tenant, you can use the Microsoft Entra admin center or the Microsoft 365 admin center to view the list of products.

1. Sign into the [Microsoft Entra admin center](https://entra.microsoft.com) as a global administrator.

1. In the **Identity** menu, expand **Billing** and select **Licenses**.

1. In the **Manage** menu, select **Licensed features**.  The information bar will indicate the current Azure AD license plan.

1. To view the existing products in the tenant, in the **Manage** menu, select **All products**.

## Starting a trial

A global administrator in a tenant that has an appropriate prerequisite product, such as Microsoft Azure AD Premium P1, already purchased, and is not already using or has previously trialed Microsoft Entra ID Governance, may request a trial of Microsoft Entra ID Governance in their tenant.

1. Sign in to the [Microsoft 365 admin center](https://admin.microsoft.com/AdminPortal/Home) as a global administrator.

1. In the **Billing** menu, select **Purchase services**.

1. In the **Search all product categories** box, type `"Microsoft Entra ID Governance"`.

1. Select **Details** below **Microsoft Entra ID Governance** to view the trial and purchase information for the product.  If your tenant has Azure AD Premium P2, then select  **Details** below **Microsoft Entra ID Governance Step-Up for Microsoft Entra ID P2**.

1. In the product details page, click **Start free trial**.


## Features by license
The following table shows what features are available with each license.  Note that not all features are available in all clouds; see [Azure Active Directory feature availability](../authentication/feature-availability.md) for Azure Government.

|Feature|Free|Microsoft Entra ID P1|Microsoft Entra ID P2|Microsoft Entra ID Governance|
|-----|:-----:|:-----:|:-----:|:-----:| 
|HR-driven Provisioning||x|x|x|
|Automated user provisioning to SaaS apps|x|x|x|x|	 
|Automated group provisioning to SaaS apps||x|x|x|	 
|Automated provisioning to on-premises apps||x|x|x|
|Conditional Access - Terms of use attestation||x|x|x| 
|Entitlement management - Basic entitlement management|||x|x|  
|Entitlement management - Conditional Access Scoping|||x|x| 
|Entitlement management MyAccess Search|||x|x|  
|Entitlement management with Verified ID||||x|  
|Entitlement management + Custom Extensions (Logic Apps)||||x|  
|Entitlement management + Auto Assignment Policies||||x|   
|Entitlement management - Invite+Assign Any||||x| 
|Entitlement management - Guest Conversion API||||x| 
|Entitlement management - Grace Period - Public Preview|||x|x|  
|Entitlement management - Sponsors Policy - Public Preview||||x| 
|Privileged Identity Management (PIM)|||x|x| 
|PIM For Groups|||x|x| 
|PIM CA Controls|||x|x| 
|Access Reviews - Basic access certifications and reviews|||x|x| 
|Access reviews - PIM For Groups - Public Preview||||x| 
|Access reviews - Inactive Users||||x| 
|Access reviews - Machine learning assisted access certifications and reviews||||x| 
|Lifecycle Workflows (LCW) J/M/L||||x|
|LCW + Custom Extensions (Logic Apps)||||x|   
|Identity governance dashboard - Public Preview||x|x|x|
|Insights and reporting - Inactive guest accounts (Preview)||||x| 

## Next steps
- [What is Microsoft Entra ID Governance?](identity-governance-overview.md)