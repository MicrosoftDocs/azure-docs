---
title: Deploying policies for governing access to applications integrated with Azure AD| Microsoft Docs
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

# Deploying organizational policies for governing access to applications integrated with Azure AD

> [!div class="step-by-step"]
> [« Integrate an application with Azure AD](identity-governance-applications-integrate.md)

In this section, you'll configure the Azure AD conditional access and entitlement management features to control ongoing access to your applications.  This includes both
* Conditional access policies
* Entitlement management policies

You can then monitor the ongoing behavior of Azure AD as users request and are assigned access to the application.

## Deploy conditional access policies for SSO enforcement

In this section, you'll establish the Conditional Access policies that are in scope for determining whether an authorized user is able to sign into the app, based on factors like the user's authentication strength or device status.

Conditional access is only possible for applications which rely upon Azure AD for single sign on (SSO).  If the application is not integrated for SSO, then continue in the next section.

1. If you require users to accept a terms of use (TOU) prior to accessing the application, then create and [upload the TOU document](../conditional-access/terms-of-use.md) so that it can be included in a conditional access policy.
1. We recommend requiring MFA for business critical applications. For most applications integrated via federation, there should be a policy that requires the user to have met a multi-factor authentication requirement prior to Azure AD permitting them to sign into the application.  Some organizations may also block access by locations, or [require the user to access from a registered device](../conditional-access/howto-conditional-access-policy-compliant-device.md).  If there is not a suitable policy already that includes the necessary conditions for MFA, location, device and TOU, then [add a policy to your conditional access deployment](../conditional-access/plan-conditional-access.md).
1. Bring the application into scope of that policy.  You can see what policies would apply for a user, with the [Conditional Access what if tool](../conditional-access/troubleshoot-conditional-access-what-if.md).
1. If it's necessary to exclude one or more users from the CA policy and allow them access, then configure an access review for the [users who are excluded from Conditional Access policies](../governance/conditional-access-exclusion.md).
1. How long a user who has been denied continued access is able to continue to use a federated application will depend upon the application's own session lifetime, and on the access token lifetime.  To learn more about controlling the lifetime of access tokens, see [configurable token lifetimes](../develop/active-directory-configurable-token-lifetimes.md).

## Deploy entitlement management policies for automating access assignment

In this section, you'll configure Azure AD entitlement management for users to be able to request access to your application's roles, or to groups used by the application.  In order to perform these tasks, you'll need to be in either the `Global Administrator` or `Identity Governance Administrator` role, or be [delegated as a catalog creator](entitlement-management-delegate-catalog.md) and owner of the application.

1. If you don't already have a catalog for your application governance scenario, [create a catalog](../governance/entitlement-management-catalog-create.md) in Azure AD entitlement management.
1. Add the application, as well as any Azure AD groups that the application relies upon, [as resources in that catalog](../governance/entitlement-management-catalog-create.md).

1. For each of the applications' roles or groups, [create an access package](../governance/entitlement-management-access-package-create.md) that includes that role or group as its resource. At this stage of configuring  that access package, configure the access package assignment policy for direct assignment, so that only administrators can create assignments.  In that policy, set the access review requirements for existing users, if any, so that they don't retain access indefinitely.
1. If you have [separation of duties](entitlement-management-access-package-incompatible.md) requirements, then configure the incompatible access packages or existing groups for your access package.  If your scenario requires the ability to override a separation of duties check, then you can also [set up additional access packages for those override scenarios](entitlement-management-access-package-incompatible.md#configuring-multiple-access-packages-for-override-scenarios).
1. For each access package, assign existing users of the application in that role, or members of that group, to the access package. You can [directly assign a user](entitlement-management-access-package-assignments.md) to an access package using the Azure portal, or in bulk via Graph or PowerShell.
1. In each access package, [create additional access package assignment policies](../governance/entitlement-management-access-package-request-policy.md#open-an-existing-access-package-and-add-a-new-policy-of-request-settings) for users to request access.  Configure the approval and recurring access review requirements in that policy.

## View reports on access

Azure AD, in conjunction with Azure Monitor, provides several reports to help you understand who has access to an application and if they are using that access.

* An administrator, or a catalog owner, can [retrieve the list of users who have access package assignments](entitlement-management-access-package-assignments.md), via the Azure portal, Graph or PowerShell.
* You can also send the audit logs to Azure Monitor and view a history of [changes to the access package](entitlement-management-logs-and-reporting.md#view-events-for-an-access-package), in the Azure portal, or via PowerShell.
* You can view the last 30 days of sign ins to an application in the [sign ins report](../reports-monitoring/howto-find-activity-reports.md#sign-ins-report) in the Azure Portal, or via [Graph](/graph/api/signin-list?view=graph-rest-1.0&tabs=http).
* You can also send the [sign in logs to Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md) to archive sign in activity for up to 2 years.

## Monitor to adjust entitlement management policies and access as needed

At regular intervals, such as weekly, monthly or quarterly, based on the volume of application access assignment changes for your application, use the Azure portal to ensure that access is being granted in accordance with the policies, and the identified users for approval and review are still the correct individuals for these tasks.

1. If you have Azure AD configured to sends its audit log to Azure Monitor, use the `Application role assignment activity` in Azure Monitor to [monitor and report on any application role assignments that weren't made through entitlement management](../governance/entitlement-management-access-package-incompatible.md#monitor-and-report-on-access-assignments).  If there are role assignments that were created by an application owner directly, you may wish contact that application owner to determine if that assignment was authorized.

1. If the application has a local user account store, within the app, in a database or in an LDAP directory, and does not rely upon Azure AD for single sign-on, then check that users were only added to the application's local user store through Azure AD provisioning.  If users that were created directly in the application, contact the application owner to determine if that assignment was authorized.

1. For each access package that you configured in the previous section, ensure the access package assignment policies continue to have the correct approvers and reviewers. Update those policies if the approvers and reviewers that were previously configured are no longer present in the organization, or are in a different role.

1. Monitor that recurring access reviews for those access packages are completing successfully, to ensure reviewers are participating and making decisions to approve or deny user's continued need for access.

1. If you had previously configured provisioning of users to the application, then when the results of a review are applied, or a user's assignment to an access package expires, Azure AD will begin deprovisioning denied users from the application. You can [monitor the process of deprovisioning users](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). If provisioning indicates an error with the application, you can [download the provisioning log](../reports-monitoring/concept-provisioning-logs.md) to investigate if there was a problem with the application.

## Next steps

- [Access reviews deployment plan](deploy-access-reviews.md)

> [!div class="step-by-step"]
> [« Integrate an application with Azure AD](identity-governance-applications-integrate.md)

