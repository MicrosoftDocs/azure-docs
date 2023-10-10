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
ms.date: 08/03/2023
ms.subservice: hybrid
ms.author: billmath
---

# Microsoft Entra ID Governance licensing fundamentals

The following tables show the licensing requirements for Microsoft Entra ID Governance features.

## Types of licenses
The following licenses are available for use with Microsoft Entra ID Governance in the commercial cloud.  The choice of licenses you need in a tenant depends on the features you're using in that tenant.

- **Free** - Included with Microsoft cloud subscriptions such as Microsoft Azure, Microsoft 365, and others.
- **Microsoft Entra ID P1** - Microsoft Entra ID P1 is available as a standalone product or included with Microsoft 365 E3 for enterprise customers and Microsoft 365 Business Premium for small to medium businesses. 
- **Microsoft Entra ID P2** - Microsoft Entra ID P2 is available as a standalone product or included with Microsoft 365 E5 for enterprise customers.
- **Microsoft Entra ID Governance** - Microsoft Entra ID Governance is an advanced set of identity governance capabilities available for Microsoft Entra ID P1 and P2 customers, as two products **Microsoft Entra ID Governance** and **Microsoft Entra ID Governance Step Up for Microsoft Entra ID P2**.  These products contain the basic identity governance capabilities that were in Microsoft Entra ID P2, and additional advanced identity governance capabilities. 

>[!NOTE]
>Microsoft Entra ID Governance scenarios may depends upon other features that aren't covered by Microsoft Entra ID Governance.  These features may have additional licensing requirements.  See [Governance capabilities in other Microsoft Entra features](identity-governance-overview.md#governance-capabilities-in-other-microsoft-entra-features) for more information on governance scenarios that rely on additional features.

Microsoft Entra ID Governance products are not yet available in the US government or US national clouds.

### Governance products and prerequisites

The Microsoft Entra ID Governance capabilities are currently available in two products in the commercial cloud. These two products provide the same identity governance capabilities. The difference between the two products is that they have different prerequisites.

- A subscription to **Microsoft Entra ID Governance** requires that the tenant also have an active subscription to another product, one that contains the `AAD_PREMIUM` or `AAD_PREMIUM_P2` service plan. Examples of products meeting this prerequisite include **Microsoft Entra ID P1** or **Microsoft 365 E3**.
- A subscription to **Microsoft Entra ID Governance Step Up for Microsoft Entra ID P2** requires that the tenant also have an active subscription to another product, one that contains the `AAD_PREMIUM_P2` service plan.  Examples of products meeting this prerequisite include **Microsoft Entra ID P2** or **Microsoft 365 E5**.

The [product names and service plan identifiers for licensing](../enterprise-users/licensing-service-plan-reference.md) lists additional products that include the prerequisite service plans.

>[!NOTE]
>A subscription to a prerequisite for a Microsoft Entra ID Governance product must be active in the tenant. If a prerequisite is not present, or the subscription expires, then Microsoft Entra ID Governance scenarios may not function as expected.  

To check if the prerequisite products for a Microsoft Entra ID Governance product are present in a tenant, you can use the Microsoft Entra admin center or the Microsoft 365 admin center to view the list of products.

1. Sign into the [Microsoft Entra admin center](https://entra.microsoft.com) as a global administrator.

1. In the **Identity** menu, expand **Billing** and select **Licenses**.

1. In the **Manage** menu, select **Licensed features**.  The information bar will indicate the current Microsoft Entra ID license plan.

1. To view the existing products in the tenant, in the **Manage** menu, select **All products**.

## Starting a trial

A global administrator in a tenant that has an appropriate prerequisite product, such as Microsoft Entra ID P1, already purchased, and is not already using or has previously trialed Microsoft Entra ID Governance, may request a trial of Microsoft Entra ID Governance in their tenant.

1. Sign in to the [Microsoft 365 admin center](https://admin.microsoft.com/AdminPortal/Home) as a global administrator.

1. In the **Billing** menu, select **Purchase services**.

1. In the **Search all product categories** box, type `"Microsoft Entra ID Governance"`.

1. Select **Details** below **Microsoft Entra ID Governance** to view the trial and purchase information for the product.  If your tenant has Microsoft Entra ID P2, then select  **Details** below **Microsoft Entra ID Governance Step-Up for Microsoft Entra ID P2**.

1. In the product details page, click **Start free trial**.


## Features by license
The following table shows what features are available with each license.  Note that not all features are available in all clouds; see [Microsoft Entra feature availability](../authentication/feature-availability.md) for Azure Government.

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
|Access reviews - Inactive Users reviews||||x|
|Access Reviews - Inactive Users recommendations|||x|x|
|Access reviews - Machine learning assisted access certifications and reviews||||x| 
|Lifecycle Workflows (LCW)||||x|
|LCW + Custom Extensions (Logic Apps)||||x|   
|Identity governance dashboard - Public Preview||x|x|x|
|Insights and reporting - Inactive guest accounts (Preview)||||x| 


## Entitlement Management

### Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| An Identity Governance Administrator at Woodgrove Bank creates initial catalogs. One of the policies specifies that **All employees** (2,000 employees) can request a specific set of access packages. 150 employees request the access packages. | 2,000 employees who **can** request the access packages | 2,000 |
| An Identity Governance Administrator at Woodgrove Bank creates initial catalogs. One of the policies specifies that **All employees** (2,000 employees) can request a specific set of access packages. 150 employees request the access packages. | 2,000 employees need licenses. | 2,000 |
| An Identity Governance Administrator at Woodgrove Bank creates initial catalogs. They create an auto-assignment policy that grants **All members of the Sales department** (350 employees) access to a specific set of access packages. 350 employees are auto-assigned to the access packages. | 350 employees need licenses. | 351 |

## Access reviews

### Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| An administrator creates an access review of Group A with 75 users and 1 group owner, and assigns the group owner as the reviewer. | 1 license for the group owner as reviewer, and 75 licenses for the 75 users. | 76 |
| An administrator creates an access review of Group B with 500 users and 3 group owners, and assigns the 3 group owners as reviewers. | 500 licenses for users, and 3 licenses for each group owner as reviewers. | 503 |
| An administrator creates an access review of Group B with 500 users. Makes it a self-review. | 500 licenses for each user as self-reviewers  | 500 |
| An administrator creates an access review of Group C with 50 member users. Makes it a self-review. | 50 licenses for each user as self-reviewers.* | 50 |
| An administrator creates an access review of Group D with 6 member users. Makes it a self-review. | 6 licenses for each user as self-reviewers. No additional licenses are required. *  | 6 |

## Lifecycle Workflows

With Microsoft Entra ID Governance licenses for Lifecycle Workflows, you can:

- Create, manage, and delete workflows up to the total limit of 50 workflows.
- Trigger on-demand and scheduled workflow execution.
- Manage and configure existing tasks to create workflows that are specific to your needs.
- Create up to 100 custom task extensions to be used in your workflows.

### Example license scenarios

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| A Lifecycle Workflows Administrator creates a workflow to add new hires in the Marketing department to the Marketing teams group. 250 new hires are assigned to the Marketing teams group via this workflow. | 1 license for the Lifecycle Workflows Administrator, and 250 licenses for the users. | 251 |
| A Lifecycle Workflows Administrator creates a workflow to pre-offboard a group of employees before their last day of employment. The scope of users who will be pre-offboarded are 40 users. | 40 licenses for users, and 1 license for the Lifecycle Workflows Administrator. | 41 |

## Privileged Identity Management

### Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| Woodgrove Bank has 10 administrators for different departments and 2 Identity Governance Administrators that configure and manage PIM. They make five administrators eligible. | Five licenses for the administrators who are eligible | 5 |
| Graphic Design Institute has 25 administrators of which 14 are managed through PIM. Role activation requires approval and there are three different users in the organization who can approve activations. | 14 licenses for the eligible roles + three approvers | 17 |
| Contoso has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are five different users in the organization who can approve activations. Contoso also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which six aren't in administrator roles managed by PIM. | 42 licenses for the eligible roles + five approvers + six reviewers | 53 |

## Licensing FAQs

### Do licenses need to be assigned to users to use Identity Governance features?

Users do not need to be assigned an Identity Governance license, but there needs to be as many licenses in the tenant to include all users in scope of, or who configures, the Identity Governance features.

## Next steps
- [What is Microsoft Entra ID Governance?](identity-governance-overview.md)
