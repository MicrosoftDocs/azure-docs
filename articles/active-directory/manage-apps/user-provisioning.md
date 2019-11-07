---
title: Automated SaaS app user provisioning in Azure AD | Microsoft Docs
description: An introduction to how you can use Azure AD to automatically provision, de-provision, and continuously update user accounts across multiple third-party SaaS applications.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/6/2019
ms.author: mimart

ms.collection: M365-identity-device-management
---
# Automate user provisioning and deprovisioning to applications with Azure Active Directory

In Azure Active Directory (Azure AD), the term **app provisioning** refers to automatically creating user identities and roles in the cloud ([SaaS](https://azure.microsoft.com/overview/what-is-saas/)) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change. Common scenarios include provisioning an Azure AD user into applications like [Dropbox](https://docs.microsoft.com/azure/active-directory/saas-apps/dropboxforbusiness-provisioning-tutorial), [Salesforce](https://docs.microsoft.com/azure/active-directory/saas-apps/salesforce-provisioning-tutorial), [ServiceNow](https://docs.microsoft.com/azure/active-directory/saas-apps/servicenow-provisioning-tutorial), and more.

> [!VIDEO https://www.youtube.com/embed/_ZjARPpI6NI]

This feature lets you:

- Automatically create new accounts in the right systems for new people when they join your team or organization.
- Automatically deactivate accounts in the right systems when people leave the team or organization.
- Ensure that the identities in your apps and systems are kept up-to-date based on changes in the directory, or your human resources system.
- Provision non-user objects, such as groups, to applications that support them.

Automated user provisioning also includes this functionality:

- Ability to match existing identities between source and target systems.
- Customizable attribute mappings that define what user data should flow from the source system to the target system.
- Optional email alerts for provisioning errors.
- Reporting and activity logs to help with monitoring and troubleshooting.

## Why use automatic provisioning?

As the number of applications used in modern organizations continues to grow, IT admins are tasked with access management at scale. Standards such as Security Assertions Markup Language (SAML) or Open ID Connect (OIDC) allow admins to quickly set up single sign-on (SSO), but access also requires users to be provisioned into the app. To many admins, provisioning means manually creating every user account or uploading CSV files each week, but these processes are time-consuming, expensive, and error-prone. 

Some common motivations for using this feature include:

- Avoiding the costs, inefficiencies, and human error associated with manual provisioning processes.
- Avoiding the costs associated with hosting and maintaining custom-developed provisioning solutions and scripts.
- Securing your organization by instantly removing users' identities from key SaaS apps when they leave the organization.
- Easily importing a large number of users into a particular SaaS application or system.
- Having a single set of policies to determine who is provisioned and who can sign in to an app.

## What applications and systems can I use with Azure AD automatic user provisioning?

Azure AD features pre-integrated support for many popular SaaS apps and human resources systems, and generic support for apps that implement specific parts of the [SCIM 2.0 standard](https://techcommunity.microsoft.com/t5/Identity-Standards-Blog/Provisioning-with-SCIM-getting-started/ba-p/880010).

### Pre-integrated applications

For a list of all applications for which Azure AD supports a pre-integrated provisioning connector, see the [list of application tutorials for user provisioning](../saas-apps/tutorial-list.md).

To contact the Azure AD engineering team to request provisioning support for additional applications, submit a message through the [Azure Active Directory feedback forum](https://feedback.azure.com/forums/374982-azure-active-directory-application-requests/filters/new?category_id=172035).

> [!NOTE]
> In order for an application to support automated user provisioning, it must first provide the necessary user management APIs that allow for external programs to automate the creation, maintenance, and removal of users. Therefore, not all SaaS apps are compatible with this feature. For apps that do support user management APIs, the Azure AD engineering team can then build a provisioning connector to those apps, and this work is prioritized by the needs of current and prospective customers.

### Connecting applications that support SCIM 2.0

For information on how to generically connect applications that implement SCIM 2.0 -based user management APIs, see [Using SCIM to automatically provision users and groups from Azure Active Directory to applications](use-scim-to-provision-users-and-groups.md).

## Why use SCIM 2.0 for provisioning and deprovisioning?

Solutions such as SAML just-in-time (JIT) have been adopted to automate provisioning, but enterprises also need a solution to deprovision users when they leave the organization or no longer require access to certain apps based on role change.

To help automate provisioning and deprovisioning, apps expose proprietary user and group APIs. However, anyone who’s tried to manage users in more than one app will tell you that every app tries to perform the same simple actions, such as creating or updating users, adding users to groups, or deprovisioning users. Yet, all these simple actions are implemented just a little bit differently, using different endpoint paths, different methods to specify user information, and a different schema to represent each element of information.

To address these challenges, the SCIM specification provides a common user schema to help users move into, out of, and around apps. SCIM is becoming the de facto standard for provisioning and, when used in conjunction with federation standards like SAML or OpenID Connect, provides administrators an end-to-end standards-based solution for access management.

SCIM is a standardized definition of two endpoints – a /Users endpoint and a /Groups endpoint. Using common REST verbs to create, update, and delete objects, and a pre-defined schema for common attributes like group name, username, first name, last name and email, apps that offer a SCIM 2.0 REST API can reduce or eliminate the pain of working with a proprietary user management API. For example, any compliant SCIM client knows how to make an HTTP POST of a JSON object to the /Users endpoint to create a new user entry. This means that, instead of every app creating a slightly different API that does the same basic thing but requires proprietary code to call, apps can conform to the SCIM standard and instantly take advantage of pre-existing clients, tools and code.

The standard user object schema and rest APIs for management defined in SCIM 2.0 (RFC 7642, 7643, 7644) allow identity providers and apps to more easily integrate with each other. Application developers that build an SCIM endpoint can integrate with any SCIM-compliant client without having to do custom work. 

## How does automatic provisioning work?

The **Azure AD Provisioning Service** provisions users to SaaS apps and other systems by connecting to user management API endpoints provided by each application vendor. These user management API endpoints allow Azure AD to programmatically create, update, and remove users. For selected applications, the provisioning service can also create, update, and remove additional identity-related objects, such as groups and roles.

![Azure AD Provisioning Service](./media/user-provisioning/provisioning0.PNG)
*Figure 1: The Azure AD Provisioning Service*

![Outbound user provisioning workflow](./media/user-provisioning/provisioning1.PNG)
*Figure 2: "Outbound" user provisioning workflow from Azure AD to popular SaaS applications*

![Inbound user provisioning workflow](./media/user-provisioning/provisioning2.PNG)
*Figure 3: "Inbound" user provisioning workflow from popular Human Capital Management (HCM) applications to Azure Active Directory and Windows Server Active Directory*

## How do I set up automatic provisioning to an application?

For pre-integrated applications listed in the gallery, step-by-step guidance is available for setting up automatic provisioning. See the [list of tutorials for integrated gallery apps](https://docs.microsoft.com/en-us/azure/active-directory/saas-apps/). The following video demonstrates how to set up automatic user provisioning for SalesForce.

> [!VIDEO https://www.youtube.com/embed/pKzyts6kfrw]

For other applications that support SCIM 2.0, follow the steps in the article [SCIM user provisioning with Azure Active Directory](use-scim-to-provision-users-and-groups.md).

## What happens during provisioning?

When Azure AD is the source system, the provisioning service uses the [Differential Query feature of the Azure AD Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-differential-query) to monitor users and groups. The provisioning service runs an initial cycle against the source system and target system, followed by periodic incremental cycles.

### Initial cycle

When the provisioning service is started, the first sync ever run will:

1. Query all users and groups from the source system, retrieving all attributes defined in the [attribute mappings](customize-application-attributes.md).
1. Filter the users and groups returned, using any configured [assignments](assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).
1. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties). Example: If the userPrincipal name in the source system is the matching attribute and maps to userName in the target system, then the provisioning service queries the target system for userNames that match the userPrincipal name values in the source system.
1. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If a matching user is found, it's updated using the attributes provided by the source system. After the user account is matched, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.
1. Persist a watermark at the end of the initial cycle, which provides the starting point for the later incremental cycles.

Some applications such as ServiceNow, G Suite, and Box support not only provisioning users, but also provisioning groups and their members. In those cases, if group provisioning is enabled in the [mappings](customize-application-attributes.md), the provisioning service synchronizes the users and the groups, and then later synchronizes the group memberships.

### Incremental cycles

After the initial cycle, all other cycles will:

1. Query the source system for any users and groups that were updated since the last watermark was stored.
1. Filter the users and groups returned, using any configured [assignments](assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).
1. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties).
1. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If a matching user is found, it's updated using the attributes provided by the source system. If it's a newly assigned account that is matched, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.
1. If a user that was previously in scope for provisioning is removed from scope (including being unassigned), the service disables the user in the target system via an update.
1. If a user that was previously in scope for provisioning is disabled or soft-deleted in the source system, the service disables the user in the target system via an update.
1. If a user that was previously in scope for provisioning is hard-deleted in the source system, the service deletes the user in the target system. In Azure AD, users are hard-deleted 30 days after they're soft-deleted.
1. Persist a new watermark at the end of the incremental cycle, which provides the starting point for the later incremental cycles.

> [!NOTE]
> You can optionally disable the **Create**, **Update**, or **Delete** operations by using the **Target object actions** check boxes in the [Mappings](customize-application-attributes.md) section. The logic to disable a user during an update is also controlled via an attribute mapping from a field such as "accountEnabled".

The provisioning service continues running back-to-back incremental cycles indefinitely, at intervals defined in the [tutorial specific to each application](../saas-apps/tutorial-list.md), until one of the following events occurs:

- The service is manually stopped using the Azure portal, or using the appropriate Graph API command 
- A new initial cycle is triggered using the **Clear state and restart** option in the Azure portal, or using the appropriate Graph API command. This action clears any stored watermark and causes all source objects to be evaluated again.
- A new initial cycle is triggered because of a change in attribute mappings or scoping filters. This action also clears any stored watermark and causes all source objects to be evaluated again.
- The provisioning process goes into quarantine (see below) because of a high error rate, and stays in quarantine for more than four weeks. In this event, the service will be automatically disabled.

### Errors and retries

If an individual user can't be added, updated, or deleted in the target system because of an error in the target system, then the operation is retried in the next sync cycle. If the user continues to fail, then the retries will begin to occur at a reduced frequency, gradually scaling back to just one attempt per day. To resolve the failure, administrators must check the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context) to determine the root cause and take the appropriate action. Common failures can include:

- Users not having an attribute populated in the source system that is required in the target system
- Users having an attribute value in the source system for which there's a unique constraint in the target system, and the same value is present in another user record

These failures can be resolved by adjusting the attribute values for the affected user in the source system, or by adjusting the attribute mappings to not cause conflicts.

### Quarantine

If most or all of the calls made against the target system consistently fail because of an error (such as for invalid admin credentials), then the provisioning job goes into a "quarantine" state. This state is indicated in the [provisioning summary report](check-status-user-account-provisioning.md) and via email if email notifications were configured in the Azure portal.

When in quarantine, the frequency of incremental cycles is gradually reduced to once per day.

The provisioning job will be removed from quarantine after all of the offending errors are fixed and the next sync cycle starts. If the provisioning job stays in quarantine for more than four weeks, the provisioning job is disabled. Learn more here about quarantine status [here](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-quarantine-status).

## How long will it take to provision users?

Performance depends on whether your provisioning job is running an initial provisioning cycle or an incremental cycle. For details about how long provisioning takes and how to monitor the status of the provisioning service, see [Check the status of user provisioning](application-provisioning-when-will-provisioning-finish-specific-user.md).

## How can I tell if users are being provisioned properly?

All operations run by the user provisioning service are recorded in the Azure AD [Provisioning logs (preview)](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context). This includes all read and write operations made to the source and target systems, and the user data that was read or written during each operation.

For information on how to read the provisioning logs in the Azure portal, see the [provisioning reporting guide](check-status-user-account-provisioning.md).

## How do I troubleshoot issues with user provisioning?

For scenario-based guidance on how to troubleshoot automatic user provisioning, see [Problems configuring and provisioning users to an application](application-provisioning-config-problem.md).

## What are the best practices for rolling out automatic user provisioning?

> [!VIDEO https://www.youtube.com/embed/MAy8s5WSe3A]

For an example step-by-step deployment plan for outbound user provisioning to an application, see the [Identity Deployment Guide for User Provisioning](https://aka.ms/deploymentplans/userprovisioning).

## Frequently asked questions

### Does automatic user provisioning to SaaS apps work with B2B users in Azure AD?

Yes, it's possible to use the Azure AD user provisioning service to provision B2B (or guest) users in Azure AD to SaaS applications.

However, for B2B users to sign in to the SaaS application using Azure AD, the SaaS application must have its SAML-based single sign-on capability configured in a specific way. For more information on how to configure SaaS applications to support sign-ins from B2B users, see [Configure SaaS apps for B2B collaboration]( https://docs.microsoft.com/azure/active-directory/b2b/configure-saas-apps).

### Does automatic user provisioning to SaaS apps work with dynamic groups in Azure AD?

Yes. When configured to "sync only assigned users and groups", the Azure AD user provisioning service can provision or de-provision users in a SaaS application based on whether they're members of a [dynamic group](../users-groups-roles/groups-create-rule.md). Dynamic groups also work with the "sync all users and groups" option.

However, usage of dynamic groups can impact the overall performance of end-to-end user provisioning from the Azure AD to SaaS applications. When using dynamic groups, keep these caveats and recommendations in mind:

- How fast a user in a dynamic group is provisioned or deprovisioned in a SaaS application depends on how fast the dynamic group can evaluate membership changes. For information on how to check the processing status of a dynamic group, see [Check processing status for a membership rule](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-create-rule).

- When using dynamic groups, the rules must be carefully considered with user provisioning and de-provisioning in mind, as a loss of membership results in a deprovisioning event.

### Does automatic user provisioning to SaaS apps work with nested groups in Azure AD?

No. When configured to "sync only assigned users and groups", the Azure AD user provisioning service isn't able to read or provision users that are in nested groups. It's only able to read and provision users that are immediate members of the explicitly assigned group.

This is a limitation of "group-based assignments to applications", which also affects single sign-on and is described in [Using a group to manage access to SaaS applications](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-saasapps ).

As a workaround, you should explicitly assign (or otherwise [scope in](https://docs.microsoft.com/azure/active-directory/manage-apps/define-conditional-rules-for-provisioning-user-accounts)) the groups that contain the users who need to be provisioned.

### Is provisioning between Azure AD and a target application using an encrypted channel?

Yes. We use HTTPS SSL encryption for the server target.

## Related articles

- [List of tutorials on how to integrate SaaS apps](../saas-apps/tutorial-list.md)
- [Customizing attribute mappings for user provisioning](customize-application-attributes.md)
- [Writing expressions for attribute mappings](functions-for-customizing-application-data.md)
- [Scoping filters for user provisioning](define-conditional-rules-for-provisioning-user-accounts.md)
- [Using SCIM to enable automatic provisioning of users and groups from Azure AD to applications](use-scim-to-provision-users-and-groups.md)
- [Azure AD synchronization API overview](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/synchronization-overview)
