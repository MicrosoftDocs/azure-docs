---
title: Deploying policies for governing access to applications integrated with Microsoft Entra ID| Microsoft Docs
description: Microsoft Entra ID Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  You can use entitlement management and other identity governance features to enforce the policies for access.
services: active-directory
documentationcenter: ''
author: owinfreyATL
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 12/19/2022
ms.author: owinfrey
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Deploying organizational policies for governing access to applications integrated with Microsoft Entra ID


In previous sections, you [defined your governance policies for an application](identity-governance-applications-define.md) and [integrated that application with Microsoft Entra ID](identity-governance-applications-integrate.md).  In this section, you configure the Microsoft Entra Conditional Access and entitlement management features to control ongoing access to your applications.  You establish
* Conditional Access policies, for how a user authenticates to Microsoft Entra ID for an application integrated with Microsoft Entra ID for single sign-on
* Entitlement management policies, for how a user obtains and keeps assignments to application roles and membership in groups
* Access review policies, for how often group memberships are reviewed

Once these policies are deployed, you can then monitor the ongoing behavior of Microsoft Entra ID as users request and are assigned access to the application.

## Deploy Conditional Access policies for SSO enforcement

In this section, you establish the Conditional Access policies that are in scope for determining whether an authorized user is able to sign into the app, based on factors like the user's authentication strength or device status.

Conditional Access is only possible for applications that rely upon Microsoft Entra ID for single sign-on (SSO).  If the application isn't able to be integrated for SSO, then continue in the next section.

1. **Upload the terms of use (TOU) document, if needed.** If you require users to accept a term of use (TOU) prior to accessing the application, then create and [upload the TOU document](../conditional-access/terms-of-use.md) so that it can be included in a Conditional Access policy.
1. **Verify users are ready for Microsoft Entra multifactor authentication.** We recommend requiring Microsoft Entra multifactor authentication for business critical applications integrated via federation. For these applications, there should be a policy that requires the user to have met a multifactor authentication requirement prior to Microsoft Entra ID permitting them to sign into the application.  Some organizations may also block access by locations, or [require the user to access from a registered device](../conditional-access/howto-conditional-access-policy-compliant-device.md).  If there's no suitable policy already that includes the necessary conditions for authentication, location, device and TOU, then [add a policy to your Conditional Access deployment](../conditional-access/plan-conditional-access.md).
1. **Bring the application web endpoint into scope of the appropriate Conditional Access policy**. If you have an existing Conditional Access policy that was created for another application subject to the same governance requirements, you could update that policy to have it apply to this application as well, to avoid having a large number of policies.  Once you have made the updates, check to ensure that the expected policies are being applied. You can see what policies would apply to a user with the [Conditional Access what if tool](../conditional-access/troubleshoot-conditional-access-what-if.md).
1. **Create a recurring access review if any users will need temporary policy exclusions**. In some cases, it may not be possible to immediately enforce Conditional Access policies for every authorized user.  For example, some users may not have an appropriate registered device. If it's necessary to exclude one or more users from the Conditional Access policy and allow them access, then configure an access review for the group of [users who are excluded from Conditional Access policies](../governance/conditional-access-exclusion.md).
1. **Document the token lifetime and application's session settings.** How long a user who has been denied continued access can continue to use a federated application depends upon the application's own session lifetime, and on the access token lifetime. The session lifetime for an application depends upon the application itself. To learn more about controlling the lifetime of access tokens, see [configurable token lifetimes](../develop/configurable-token-lifetimes.md).

## Deploy entitlement management policies for automating access assignment

In this section, you configure Microsoft Entra entitlement management so users can request access to your application's roles or to groups used by the application.  In order to perform these tasks, you need to be in the *Global Administrator*, *Identity Governance Administrator* role, or be [delegated as a catalog creator](entitlement-management-delegate-catalog.md) and the owner of the application.

1. **Access packages for governed applications should be in a designated catalog.** If you don't already have a catalog for your application governance scenario, [create a catalog](../governance/entitlement-management-catalog-create.md) in Microsoft Entra entitlement management.
1. **Populate the catalog with necessary resources.** Add the application, and any Microsoft Entra groups that the application relies upon, [as resources in that catalog](../governance/entitlement-management-catalog-create.md).
1. **Create an access package for each role or group which users can request.** For each of the applications, and for each of their application roles or groups, [create an access package](../governance/entitlement-management-access-package-create.md) that includes that role or group as its resource. At this stage of configuring  that access package, configure the access package assignment policy for direct assignment, so that only administrators can create assignments.  In that policy, set the access review requirements for existing users, if any, so that they don't keep access indefinitely.
1. **Configure access packages to enforce separation of duties requirements.** If you have [separation of duties](entitlement-management-access-package-incompatible.md) requirements, then configure the incompatible access packages or existing groups for your access package.  If your scenario requires the ability to override a separation of duties check, then you can also [set up additional access packages for those override scenarios](entitlement-management-access-package-incompatible.md#configuring-multiple-access-packages-for-override-scenarios).
1. **Add assignments of existing users, who already have access to the application, to the access packages.** For each access package, assign existing users of the application in that role, or members of that group, to the access package. You can [directly assign a user](entitlement-management-access-package-assignments.md) to an access package using the Microsoft Entra admin center, or in bulk via Graph or PowerShell.
1. **Create policies for users to request access.** In each access package, [create additional access package assignment policies](../governance/entitlement-management-access-package-request-policy.md#open-an-existing-access-package-and-add-a-new-policy-with-different-request-settings) for users to request access.  Configure the approval and recurring access review requirements in that policy.
1. **Create recurring access reviews for other groups used by the application.** If there are groups that are used by the application but aren't resource roles for an access package, then [create access reviews](create-access-review.md) for the membership of those groups.

## View reports on access

Microsoft Entra ID with Azure Monitor provides several reports to help you understand who has access to an application and if they're using that access.

* An administrator, or a catalog owner, can [retrieve the list of users who have access package assignments](entitlement-management-access-package-assignments.md), via the Microsoft Entra admin center, Graph or PowerShell.
* You can also send the audit logs to Azure Monitor and view a history of [changes to the access package](entitlement-management-logs-and-reporting.md#view-events-for-an-access-package), in the Microsoft Entra admin center, or via PowerShell.
* You can view the last 30 days of sign-ins to an application in the [sign-ins report](../reports-monitoring/reference-basic-info-sign-in-logs.md) in the Microsoft Entra admin center, or via [Graph](/graph/api/signin-list?view=graph-rest-1.0&tabs=http&preserve-view=true).
* You can also send the [sign in logs to Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md) to archive sign in activity for up to two years.

## Monitor to adjust entitlement management policies and access as needed

At regular intervals, such as weekly, monthly or quarterly, based on the volume of application access assignment changes for your application, use the Microsoft Entra admin center to ensure that access is being granted in accordance with the policies. You can also ensure that the identified users for approval and review are still the correct individuals for these tasks.

* **Watch for application role assignments and group membership changes.** If you have Microsoft Entra ID configured to send its audit log to Azure Monitor, use the `Application role assignment activity` in Azure Monitor to [monitor and report on any application role assignments that weren't made through entitlement management](../governance/entitlement-management-access-package-incompatible.md#monitor-and-report-on-access-assignments).  If there are role assignments that were created by an application owner directly, you should contact that application owner to determine if that assignment was authorized.  In addition, if the application relies upon Microsoft Entra security groups, also monitor for changes to those groups as well.

* **Also watch for users granted access directly within the application.** If the following conditions are met, then it's possible for a user to obtain access to an application without being part of Microsoft Entra ID, or without being added to the applications' user account store by Microsoft Entra ID:

  * The application has a local user account store within the app
  * The user account store is in a database or in an LDAP directory 
  * The application doesn't rely solely upon Microsoft Entra ID for single sign-on.

  For an application with the properties in the previous list, you should regularly check that users were only added to the application's local user store through Microsoft Entra provisioning.  If users that were created directly in the application, contact the application owner to determine if that assignment was authorized.

* **Ensure approvers and reviewers are kept up to date.** For each access package that you configured in the previous section, ensure the access package assignment policies continue to have the correct approvers and reviewers. Update those policies if the approvers and reviewers that were previously configured are no longer present in the organization, or are in a different role.

* **Validate that reviewers are making decisions during a review.** Monitor that [recurring access reviews for those access packages](entitlement-management-access-package-lifecycle-policy.md) are completing successfully, to ensure reviewers are participating and making decisions to approve or deny user's continued need for access.

* **Check that provisioning and deprovisioning are working as expected.** If you had previously configured provisioning of users to the application, then when the results of a review are applied, or a user's assignment to an access package expires, Microsoft Entra ID begins deprovisioning denied users from the application. You can [monitor the process of deprovisioning users](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). If provisioning indicates an error with the application, you can [download the provisioning log](../reports-monitoring/concept-provisioning-logs.md) to investigate if there was a problem with the application.

* **Update the Microsoft Entra configuration with any role or group changes in the application.**  If the application adds new application roles in its manifest, updates existing roles, or relies upon additional groups, then you need to update the access packages and access reviews to account for those new roles or groups.

## Next steps

- [Access reviews deployment plan](deploy-access-reviews.md)
