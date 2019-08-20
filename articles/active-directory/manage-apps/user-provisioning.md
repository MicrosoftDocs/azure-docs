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
ms.date: 06/12/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---
# Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory

Azure Active Directory (Azure AD) lets you automate the creation, maintenance, and removal of user identities in cloud ([SaaS](https://azure.microsoft.com/overview/what-is-saas/)) applications such as Dropbox, Salesforce, ServiceNow, and more. This is known as automated user provisioning for SaaS apps.

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

## Why use automated provisioning?

Some common motivations for using this feature include:

- Avoiding the costs, inefficiencies, and human error associated with manual provisioning processes.
- Avoiding the costs associated with hosting and maintaining custom-developed provisioning solutions and scripts.
- Securing your organization by instantly removing users' identities from key SaaS apps when they leave the organization.
- Easily importing a large number of users into a particular SaaS application or system.
- Having a single set of policies to determine who is provisioned and who can sign in to an app.

## How does automatic provisioning work?

The **Azure AD Provisioning Service** provisions users to SaaS apps and other systems by connecting to user management API endpoints provided by each application vendor. These user management API endpoints allow Azure AD to programmatically create, update, and remove users. For selected applications, the provisioning service can also create, update, and remove additional identity-related objects, such as groups and roles.

![Azure AD Provisioning Service](./media/user-provisioning/provisioning0.PNG)
*Figure 1: The Azure AD Provisioning Service*

![Outbound user provisioning workflow](./media/user-provisioning/provisioning1.PNG)
*Figure 2: "Outbound" user provisioning workflow from Azure AD to popular SaaS applications*

![Inbound user provisioning workflow](./media/user-provisioning/provisioning2.PNG)
*Figure 3: "Inbound" user provisioning workflow from popular Human Capital Management (HCM) applications to Azure Active Directory and Windows Server Active Directory*

## What applications and systems can I use with Azure AD automatic user provisioning?

Azure AD features pre-integrated support for many popular SaaS apps and human resources systems, and generic support for apps that implement specific parts of the SCIM 2.0 standard.

### Pre-integrated applications

For a list of all applications for which Azure AD supports a pre-integrated provisioning connector, see the [list of application tutorials for user provisioning](../saas-apps/tutorial-list.md).

To contact the Azure AD engineering team to request provisioning support for additional applications, submit a message through the [Azure Active Directory feedback forum](https://feedback.azure.com/forums/374982-azure-active-directory-application-requests/filters/new?category_id=172035).

> [!NOTE]
> In order for an application to support automated user provisioning, it must first provide the necessary user management APIs that allow for external programs to automate the creation, maintenance, and removal of users. Therefore, not all SaaS apps are compatible with this feature. For apps that do support user management APIs, the Azure AD engineering team can then build a provisioning connector to those apps, and this work is prioritized by the needs of current and prospective customers.

### Connecting applications that support SCIM 2.0

For information on how to generically connect applications that implement SCIM 2.0 -based user management APIs, see [Using SCIM to automatically provision users and groups from Azure Active Directory to applications](use-scim-to-provision-users-and-groups.md).

## How do I set up automatic provisioning to an application?

> [!VIDEO https://www.youtube.com/embed/pKzyts6kfrw]

Use the Azure Active Directory portal to configure the Azure AD provisioning service for a selected application.

1. Open the **[Azure Active Directory portal](https://aad.portal.azure.com)**.
1. Select **Enterprise applications** from the left pane. A list of all configured apps is show.
1. Choose **+ New application** to add an application. Add either of the following depending on your scenario:

   - The **Add your own app** option supports custom-developed SCIM integrations.
   - All applications in the **Add from the gallery** > **Featured applications** section support automatic provisioning. See the [list of application tutorials for user provisioning](../saas-apps/tutorial-list.md) for additional ones.

1. Provide any details and select **Add**. The new app is added to the list of enterprise applications and opens to its application management screen.
1. Select **Provisioning** to manage user account provisioning settings for the app.

   ![Shows the Provisioning settings screen](./media/user-provisioning/provisioning_settings0.PNG)

1. Select the Automatic option for the **Provisioning Mode** to specify settings for admin credentials, mappings, starting and stopping, and synchronization.

   - Expand **Admin credentials** to enter the credentials required for Azure AD to connect to the application's user management API. This section also lets you enable email notifications if the credentials fail, or the provisioning job goes into [quarantine](#quarantine).
   - Expand **Mappings** to view and edit the user attributes that flow between Azure AD and the target application when user accounts are provisioned or updated. If the target application supports it, this section lets you optionally configure provisioning of groups and user accounts. Select a mapping in the table to open the mapping editor to the right, where you can view and customize user attributes.

     **Scoping filters** tell the provisioning service which users and groups in the source system should be provisioned or deprovisioned to the target system. In the **Attribute mapping** pane, select **Source Object Scope** to filter on specific attribute values. For example, you can specify that only users with a "Department" attribute of "Sales" should be in scope for provisioning. For more information, see [Using scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

     For more information, see [Customizing Attribute Mappings](customize-application-attributes.md).

   - **Settings** control the operation of the provisioning service for an application, including whether it's currently running. The **Scope** menu lets you specify whether only assigned users and groups should be in scope for provisioning, or if all users in the Azure AD directory should be provisioned. For information on "assigning" users and groups, see [Assign a user or group to an enterprise app in Azure Active Directory](assign-user-or-group-access-portal.md).

In the app management screen, select **Audit logs** to view records of every operation run by the Azure AD provisioning service. For more information, see the [provisioning reporting guide](check-status-user-account-provisioning.md).

![Example - Audit logs screen for an app](./media/user-provisioning/audit_logs.PNG)

> [!NOTE]
> The Azure AD user provisioning service can also be configured and managed using the [Microsoft Graph API](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/synchronization-overview).

## What happens during provisioning?

When Azure AD is the source system, the provisioning service uses the [Differential Query feature of the Azure AD Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-differential-query) to monitor users and groups. The provisioning service runs an initial sync against the source system and target system, followed by periodic incremental syncs.

### Initial sync

When the provisioning service is started, the first sync ever run will:

1. Query all users and groups from the source system, retrieving all attributes defined in the [attribute mappings](customize-application-attributes.md).
1. Filter the users and groups returned, using any configured [assignments](assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).
1. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties). Example: If the userPrincipal name in the source system is the matching attribute and maps to userName in the target system, then the provisioning service queries the target system for userNames that match the userPrincipal name values in the source system.
1. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If a matching user is found, it's updated using the attributes provided by the source system. After the user account is matched, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.
1. Persist a watermark at the end of the initial sync, which provides the starting point for the later incremental syncs.

Some applications such as ServiceNow, G Suite, and Box support not only provisioning users, but also provisioning groups and their members. In those cases, if group provisioning is enabled in the [mappings](customize-application-attributes.md), the provisioning service synchronizes the users and the groups, and then later synchronizes the group memberships.

### Incremental syncs

After the initial sync, all other syncs will:

1. Query the source system for any users and groups that were updated since the last watermark was stored.
1. Filter the users and groups returned, using any configured [assignments](assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).
1. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties).
1. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If a matching user is found, it's updated using the attributes provided by the source system. If it's a newly assigned account that is matched, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.
1. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.
1. If a user that was previously in scope for provisioning is removed from scope (including being unassigned), the service disables the user in the target system via an update.
1. If a user that was previously in scope for provisioning is disabled or soft-deleted in the source system, the service disables the user in the target system via an update.
1. If a user that was previously in scope for provisioning is hard-deleted in the source system, the service deletes the user in the target system. In Azure AD, users are hard-deleted 30 days after they're soft-deleted.
1. Persist a new watermark at the end of the incremental sync, which provides the starting point for the later incremental syncs.

> [!NOTE]
> You can optionally disable the **Create**, **Update**, or **Delete** operations by using the **Target object actions** check boxes in the [Mappings](customize-application-attributes.md) section. The logic to disable a user during an update is also controlled via an attribute mapping from a field such as "accountEnabled".

The provisioning service continues running back-to-back incremental syncs indefinitely, at intervals defined in the [tutorial specific to each application](../saas-apps/tutorial-list.md), until one of the following events occurs:

- The service is manually stopped using the Azure portal, or using the appropriate Graph API command 
- A new initial sync is triggered using the **Clear state and restart** option in the Azure portal, or using the appropriate Graph API command. This action clears any stored watermark and causes all source objects to be evaluated again.
- A new initial sync is triggered because of a change in attribute mappings or scoping filters. This action also clears any stored watermark and causes all source objects to be evaluated again.
- The provisioning process goes into quarantine (see below) because of a high error rate, and stays in quarantine for more than four weeks. In this event, the service will be automatically disabled.

### Errors and retries

If an individual user can't be added, updated, or deleted in the target system because of an error in the target system, then the operation is retried in the next sync cycle. If the user continues to fail, then the retries will begin to occur at a reduced frequency, gradually scaling back to just one attempt per day. To resolve the failure, administrators must check the [audit logs](check-status-user-account-provisioning.md) for "process escrow" events to determine the root cause and take the appropriate action. Common failures can include:

- Users not having an attribute populated in the source system that is required in the target system
- Users having an attribute value in the source system for which there's a unique constraint in the target system, and the same value is present in another user record

These failures can be resolved by adjusting the attribute values for the affected user in the source system, or by adjusting the attribute mappings to not cause conflicts.

### Quarantine

If most or all of the calls made against the target system consistently fail because of an error (such as for invalid admin credentials), then the provisioning job goes into a "quarantine" state. This state is indicated in the [provisioning summary report](check-status-user-account-provisioning.md) and via email if email notifications were configured in the Azure portal.

When in quarantine, the frequency of incremental syncs is gradually reduced to once per day.

The provisioning job will be removed from quarantine after all of the offending errors are fixed and the next sync cycle starts. If the provisioning job stays in quarantine for more than four weeks, the provisioning job is disabled.

## How long will it take to provision users?

Performance depends on whether your provisioning job is running an initial provisioning cycle or an incremental cycle. For details about how long provisioning takes and how to monitor the status of the provisioning service, see [Check the status of user provisioning](application-provisioning-when-will-provisioning-finish-specific-user.md).

## How can I tell if users are being provisioned properly?

All operations run by the user provisioning service are recorded in the Azure AD audit logs. This includes all read and write operations made to the source and target systems, and the user data that was read or written during each operation.

For information on how to read the audit logs in the Azure portal, see the [provisioning reporting guide](check-status-user-account-provisioning.md).

## How do I troubleshoot issues with user provisioning?

For scenario-based guidance on how to troubleshoot automatic user provisioning, see [Problems configuring and provisioning users to an application](application-provisioning-config-problem.md).

## What are the best practices for rolling out automatic user provisioning?

> [!VIDEO https://www.youtube.com/embed/MAy8s5WSe3A]

For an example step-by-step deployment plan for outbound user provisioning to an application, see the [Identity Deployment Guide for User Provisioning](https://aka.ms/userprovisioningdeploymentplan).

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
