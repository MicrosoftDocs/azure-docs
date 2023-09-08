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

The following tables show the licensing requirements for Microsoft Entra ID Governance features

## Types of licenses
The following licenses are available for use with Microsoft Entra ID Governance.  The choice of licenses you need in a tenant will depend on the features you're using in that tenant.

- **Free** - Included with Microsoft cloud subscriptions such as Microsoft Azure, Microsoft 365, and others.
- **Microsoft Azure AD P1** - Azure Active Directory Premium P1 (becoming Microsoft Entra ID P1) is available as a standalone product or included with Microsoft 365 E3 for enterprise customers and Microsoft 365 Business Premium for small to medium businesses. 
- **Microsoft Azure AD P2** - Azure Active Directory Premium P2 (becoming Microsoft Entra ID P2) is available as a standalone product or included with Microsoft 365 E5 for enterprise customers.
- **Microsoft Entra ID Governance** - Entra ID Governance is an advanced set of identity governance capabilities available for Microsoft Entra ID P1 and P2 customers, as two products **Microsoft Entra ID Governance** and **Microsoft Entra ID Governance Step Up for Microsoft Entra ID P2**.

>[!NOTE]
>Microsoft Entra ID Governance scenarios may depends upon other features that aren't covered by Microsoft Entra ID Governance.  These features may have additional licensing requirements.  See [Governance capabilities in other Microsoft Entra features](identity-governance-overview.md#governance-capabilities-in-other-microsoft-entra-features) for more information on governance scenarios that rely on additional features.


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


## Entitlement Management

To use Entitlement Management in Azure Active Directory (Azure AD), part of Microsoft Entra, a tenant must have the valid license. Licenses must also be assigned to the administrators and relevant users.

### How many licenses must you have?

Ensure that your directory has at least as many Microsoft Entra Premium P2 or Microsoft Entra ID Governance licenses as you have:

- Member users who *can* request an access package.
- Member users who *request* an access package.
- Member users who *approve requests* for an access package.
- Member users who *review assignments* for an access package.
- Member users who have a *direct assignment* or an *automatic assignment* to an access package.

For guest users, licensing needs will depend on the [licensing model](../external-identities/external-identities-pricing.md) you’re using. However, the below guest users’ activities are considered Microsoft Azure AD Premium P2 or Microsoft Entra ID Governance usage:
- Guest users who *request* an access package.
- Guest users who *approve requests* for an access package.
- Guest users who *review assignments* for an access package.
- Guest users who have a *direct assignment* to an access package.

Microsoft Azure AD Entra P2 or Microsoft Entra ID Governance licenses are **not** required for the following tasks:

- No licenses are required for users with the Global Administrator role who set up the initial catalogs, access packages, and policies, and delegate administrative tasks to other users.
- No licenses are required for users who have been delegated administrative tasks, such as catalog creator, catalog owner, and access package manager.
- No licenses are required for guests who have **a privilege to request access packages** but they **do not choose** to request them.

For more information about licenses, see [Assign or remove licenses using the Azure portal](../fundamentals/license-users-groups.md).

### Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| A Global Administrator at Woodgrove Bank creates initial catalogs and delegates administrative tasks to six other users. One of the policies specifies that **All employees** (2,000 employees) can request a specific set of access packages. 150 employees request the access packages. | 2,000 employees who **can** request the access packages | 2,000 |
| A Global Administrator at Woodgrove Bank creates initial catalogs and delegates administrative tasks to six other users. One of the policies specifies that **All employees** (2,000 employees) can request a specific set of access packages. Another policy specifies that some users from **Users from partner Contoso** (guests) can request the same access packages subject to approval. Contoso has 30,000 users. 150 employees request the access packages and 10,500 users from Contoso request access. | 2,000 employees need licenses, guest users are billed on a monthly active user basis and no additional licenses are required for them. * | 2,000 |

\* Azure AD External Identities (guest user) pricing is based on monthly active users (MAU), which is the count of unique users with authentication activity within a calendar month. This model replaces the 1:5 ratio billing model, which allowed up to five guest users for each Azure AD Premium license in your tenant. When your tenant is linked to a subscription and you use External Identities features to collaborate with guest users, you'll be automatically billed using the MAU-based billing model. For more information, see [Billing model for Azure AD External Identities](../external-identities/external-identities-pricing.md).


## Access reviews

To use Access reviews in Azure Active Directory (Azure AD), part of Microsoft Entra, a tenant must have the valid license. Licenses must also be assigned to the administrators and relevant users.

### How many licenses must you have?

Your directory needs at least as many Microsoft Entra Premium P2 licenses as the number of employees who will be performing the following tasks:

-	Member users who are assigned as reviewers
-	Member users who perform a self-review
-	Member users as group owners who perform an access review
-	Member users as application owners who perform an access review

For guest users, licensing needs will depend on the licensing model you’re using. However, the below guest users’ activities are considered Microsoft Entra Premium P2 usage:

-	Guest users who are assigned as reviewers
-	Guest users who perform a self-review
-	Guest users as group owners who perform an access review
-	Guest users as application owners who perform an access review


Microsoft Entra P2 licenses are **not** required for users with the Global Administrator or User Administrator roles who set up access reviews, configure settings, or apply the decisions from the reviews.

Azure AD guest user access is based on a monthly active users (MAU) billing model, which replaces the 1:5 ratio billing model. For more information, see [Azure AD External Identities pricing](../external-identities/external-identities-pricing.md).

For more information about licenses, see [Assign or remove licenses using the Azure portal](../fundamentals/license-users-groups.md).

### Example license scenarios

Here are some example license scenarios to help you determine the number of licenses you must have.

| Scenario | Calculation | Number of licenses |
| --- | --- | --- |
| An administrator creates an access review of Group A with 75 users and 1 group owner, and assigns the group owner as the reviewer. | 1 license for the group owner as reviewer | 1 |
| An administrator creates an access review of Group B with 500 users and 3 group owners, and assigns the 3 group owners as reviewers. | 3 licenses for each group owner as reviewers | 3 |
| An administrator creates an access review of Group B with 500 users. Makes it a self-review. | 500 licenses for each user as self-reviewers | 500 |
| An administrator creates an access review of Group C with 50 member users and 25 guest users. Makes it a self-review. | 50 licenses for each user as self-reviewers.* | 50 |
| An administrator creates an access review of Group D with 6 member users and 108 guest users. Makes it a self-review. | 6 licenses for each user as self-reviewers. Guest users are billed on a monthly active user (MAU) basis. No additional licenses are required. *  | 6 |

\* Azure AD External Identities (guest user) pricing is based on monthly active users (MAU), which is the count of unique users with authentication activity within a calendar month. This model replaces the 1:5 ratio billing model, which allowed up to five guest users for each Microsoft Entra Premium license in your tenant. When your tenant is linked to a subscription and you use External Identities features to collaborate with guest users, you'll be automatically billed using the MAU-based billing model. For more information, see [Billing model for Azure AD External Identities](../external-identities/external-identities-pricing.md).

> [!NOTE]
> Access reviews for Service Principals requires an Entra Workload Identities Premium plan in addition to Microsoft Entra Premium P2 license. You can view and acquire licenses on the [Workload Identities blade](https://portal.azure.com/#view/Microsoft_Azure_ManagedServiceIdentity/WorkloadIdentitiesBlade) in the Azure portal.

## Lifecycle Workflows

With Entra Governance licenses for Lifecycle Workflows, you can:

- Create, manage, and delete workflows up to the total limit of 50 workflows.
- Trigger on-demand and scheduled workflow execution.
- Manage and configure existing tasks to create workflows that are specific to your needs.
- Create up to 100 custom task extensions to be used in your workflows.

## Privileged Identity Management

To use Privileged Identity Management (PIM) in Azure Active Directory (Azure AD), part of Microsoft Entra, a tenant must have a valid license. Licenses must also be assigned to the administrators and relevant users. This article describes the license requirements to use Privileged Identity Management.  To use Privileged Identity Management, you must have one of the following licenses:


### Valid licenses for PIM

You'll need either Microsoft Entra ID Governance licenses or Azure AD Premium P2 licenses to use PIM and all of its settings. Currently, you can scope an access review to service principals with access to Azure AD and Azure resource roles with a Microsoft Entra Premium P2 or Microsoft Entra ID Governance edition active in your tenant. The licensing model for service principals will be finalized for general availability of this feature and additional licenses may be required. 

### Licenses you must have for PIM
Ensure that your directory has Microsoft Entra Premium P2 or Microsoft Entra ID Governance licenses for the following categories of users:

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
| Contoso has 50 administrators of which 42 are managed through PIM. Role activation requires approval and there are five different users in the organization who can approve activations. Contoso also does monthly reviews of users assigned to administrator roles and reviewers are the users’ managers of which six aren't in administrator roles managed by PIM. | 42 licenses for the eligible roles + five approvers + six reviewers | 53 |

### When a license expires for PIM

If a Microsoft Azure AD Premium P2, Microsoft Entra ID Governance, or trial license expires, Privileged Identity Management features will no longer be available in your directory:

- Permanent role assignments to Azure AD roles will be unaffected.
- The Privileged Identity Management service in the Azure portal, as well as the Graph API cmdlets and PowerShell interfaces of Privileged Identity Management, will no longer be available for users to activate privileged roles, manage privileged access, or perform access reviews of privileged roles.
- Eligible role assignments of Azure AD roles will be removed, as users will no longer be able to activate privileged roles.
- Any ongoing access reviews of Azure AD roles will end, and Privileged Identity Management configuration settings will be removed.
- Privileged Identity Management will no longer send emails on role assignment changes.

## Next steps
- [What is Microsoft Entra ID Governance?](identity-governance-overview.md)