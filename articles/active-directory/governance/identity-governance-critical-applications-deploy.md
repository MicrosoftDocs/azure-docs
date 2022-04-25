---
title: Deploying policies for governing access to critical applications integrated with Azure AD| Microsoft Docs
description: Azure Active Directory Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  You can use entitlement management and other identity governance features to enforce the policies for access.
services: active-directory
documentationcenter: ''
author: ajburnle
manager: karenhoran
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 4/22/2022
ms.author: ajburnle
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Deploying policies for governing access to critical applications integrated with Azure AD

> [!div class="step-by-step"]
> [« Integrate the application with Azure AD](identity-governance-critical-applications-integrate.md)

## Deploy policies for automating access assignments

1. If you don't already have a catalog for your application governance scenario, [create a catalog](../governance/entitlement-management-catalog-create.md) in Azure AD entitlement management.
1. Add the application, as well as any Azure AD groups which the application relies upon, [as resources in that catalog](../governance/entitlement-management-catalog-create.md).

1. For each of the applications' roles or groups, [create an access package](../governance/entitlement-management-access-package-create.md) that includes that role or group as its resource. At this stage of configuring  that access package, configure the policy for direct assignment, so that only administrators can create assignments.  In that policy, set the access review requirements for existing users, if any, so that they don't retain access indefinitely.
1. If you have [separation of duties](entitlement-management-access-package-incompatible.md) requirements, then configure the incompatible access packages or existing groups for your access package.  If your scenario requires the ability to override a separation of duties check, then you can also [set up additional access packages for those override scenarios](entitlement-management-access-package-incompatible.md#configuring-multiple-access-packages-for-override-scenarios).
1. For each access package, assign existing users of the application in that role, or members of that group, to the access package.
1. In each access package, [create additional policies](..//governance/entitlement-management-access-package-request-policy.md#open-an-existing-access-package-and-add-a-new-policy-of-request-settings) for users to request access.  Configure the approval and recurring access review requirements in that policy.

## Monitor to adjust policies and access as needed

At regular intervals, such as weekly, monthly or quarterly, based on the volume of application access assignment changes for your application, use the Azure portal to ensure that access is being granted in accordance with the policies, and the identified users for approval and review are still the correct individuals for these tasks.

1. Use the `Application role assignment activity` in Azure Monitor to [monitor and report on any application role assignments that weren't made through entitlement management](../governance/entitlement-management-access-package-incompatible.md#monitor-and-report-on-access-assignments).

1. If the application has a local user account store, within the app, in a database or in an LDAP directory, and does not rely upon Azure AD for single sign-on, then check that users were only added to the application's local user store through Azure AD provisioning those users.

1. For each access package that you configured in the previous section, ensure policies continue to have the correct approvers and reviewers. Update policies if the approvers and reviewers that were previously configured are no longer present in the organization, or are in a different role.

1. Also, monitor recurring access reviews for those access packages, to ensure reviewers are participating and making decisions to approve or deny user's continued need for access.

<!-- TODO Should this link to an access review article that shows how you can alert on this? Mby this is something that could be done through Azure Monitor? -->

## Next steps

- [Access reviews deployment plan](deploy-access-reviews.md)

> [!div class="step-by-step"]
> [« Integrate the application with Azure AD](identity-governance-critical-applications-integrate.md)

