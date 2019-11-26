---
title: Understand how Azure AD provisioning works | Microsoft Docs
description: Understand how Azure AD provisioning works 
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
ms.date: 11/25/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---
# How provisioning works

User account provisioning refers to creating, updating, or disabling user account records in an application’s local user profile store. Most cloud and SaaS applications store the user's role and permissions in the user's own local user profile store, and presence of such a user record in the user's local store is *required* for single sign-on and access to work. Many applications in the Azure AD gallery support automatic user provisioning, which means an Azure AD provisioning connector has been developed for them. 

The **Azure AD Provisioning Service** provisions users to SaaS apps and other systems by connecting to user management API endpoints provided by each application vendor. These user management API endpoints allow Azure AD to programmatically create, update, and remove users. For selected applications, the provisioning service can also create, update, and remove additional identity-related objects, such as groups and roles.

![Azure AD Provisioning Service](./media/user-provisioning/provisioning0.PNG)
*Figure 1: The Azure AD Provisioning Service*

![Outbound user provisioning workflow](./media/user-provisioning/provisioning1.PNG)
*Figure 2: "Outbound" user provisioning workflow from Azure AD to popular SaaS applications*

![Inbound user provisioning workflow](./media/user-provisioning/provisioning2.PNG)
*Figure 3: "Inbound" user provisioning workflow from popular Human Capital Management (HCM) applications to Azure Active Directory and Windows Server Active Directory*

You should start by finding the setup tutorial specific to setting up provisioning for your application, and following those steps to configure both the app and Azure AD to create the provisioning connection. App tutorials can be found at [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list).

> [!NOTE]
> If you would like to request an automatic Azure AD provisioning connector for an app that doesn't currently have one, you can fill out a request using the [Azure Active Directory Application Requests](https://aka.ms/aadapprequest).

## Authorization

Credentials are required for Azure AD to connect to the application's user management API. While you're configuring automatic user provisioning for an application, you'll need to enter valid credentials. You can find credential types and requirements for the application by referring to the app tutorial. In the Azure portal, you'll be able to test the credentials by having Azure AD attempt to connect to the app's provisioning app using the supplied credentials.

Note that if SAML-based single sign-on is also configured for the application,Azure AD's internal, per-application storage limit is 1024 bytes for all certificates, secret tokens, credentials, and related configuration data associated with a single instance of an application (also known as a service principal record in Azure AD). When SAML-based single sign-on is configured, the certificate used to sign the SAML tokens often consumes over 50% percent of the space. Any secret tokens, URIs, notification email addresses, user names, and passwords that are entered during setup of user provisioning can cause the storage limit to be exceeded.

## Mapping attributes 

When you enable user provisioning for a third-party SaaS application, the Azure portal controls its attribute values through attribute mappings. Mappings determine the user attributes that flow between Azure AD and the target application when user accounts are provisioned or updated.

There's a pre-configured set of attributes and attribute mappings between Azure AD user objects and each SaaS app’s user objects. Some apps manage other types of objects along with Users, such as Groups.

When setting up provisioning, it's important to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. This includes setting the matching property (**Match objects using this attribute**) that is used to uniquely identify and match users/groups between the two systems. 

You can customize the default attribute-mappings according to your business needs. So, you can change or delete existing attribute-mappings, or create new attribute-mappings. For details, see [Customizing user provisioning attribute-mappings for SaaS applications](customize-application-attributes.md).

When you configure provisioning to a SaaS application, one of the types of attribute mappings that you can specify is an expression mapping. For these, you must write a script-like expression that allows you to transform your users’ data into formats that are more acceptable for the SaaS application. For details, see [Writing expressions for attribute mappings](functions-for-customizing-application-data.md).

## Scoping 

Scoping filters allow the Azure Active Directory (Azure AD) provisioning service to include or exclude any users who have attributes that match specific values. For example, when provisioning users from Azure AD to a SaaS application used by a sales team, you can specify that only users with a "Department" attribute of "Sales" should be in scope for provisioning.

Scoping filters can be used differently depending on the type of provisioning connector:

* **Outbound provisioning from Azure AD to SaaS applications.** When Azure AD is the source system, user and group assignments are the most common method for determining which users are in scope for provisioning. These assignments also are used for enabling single sign-on and provide a single method to manage access and provisioning. Scoping filters can be used optionally, in addition to assignments or instead of them, to filter users based on attribute values.

  > [!TIP]
  > You can disable provisioning based on assignments for an enterprise application by changing settings in the Scope menu under the provisioning settings to Sync all users and groups. Using this option plus attribute-based scoping filters offers faster performance than using group-based assignments.
 
* **Inbound provisioning from HCM applications to Azure AD and Active Directory.** When an HCM application such as Workday is the source system, scoping filters are the primary method for determining which users should be provisioned from the HCM application to Active Directory or Azure AD.

By default, Azure AD provisioning connectors do not have any attribute-based scoping filters configured. For details, see [Attribute-based application provisioning with scoping filters](define-conditional-rules-for-provisioning-user-accounts.md)

## Provisioning cycles: Initial and incremental

When Azure AD is the source system, the provisioning service uses the [Differential Query feature of the Azure AD Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-differential-query) to monitor users and groups. The provisioning service runs an initial cycle against the source system and target system, followed by periodic incremental cycles.

### Initial cycle

When the provisioning service is started, the first sync ever run will:

1. Query all users and groups from the source system, retrieving all attributes defined in the [attribute mappings](customize-application-attributes.md).

2. Filter the users and groups returned, using any configured [assignments](assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

3. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties). Example: If the userPrincipal name in the source system is the matching attribute and maps to userName in the target system, then the provisioning service queries the target system for userNames that match the userPrincipal name values in the source system.

4. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.

5. If a matching user is found, it's updated using the attributes provided by the source system. After the user account is matched, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.

6. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.

7. Persist a watermark at the end of the initial cycle, which provides the starting point for the later incremental cycles.

Some applications such as ServiceNow, G Suite, and Box support not only provisioning users, but also provisioning groups and their members. In those cases, if group provisioning is enabled in the [mappings](customize-application-attributes.md), the provisioning service synchronizes the users and the groups, and then later synchronizes the group memberships.

### Incremental cycles

After the initial cycle, all other cycles will:

1. Query the source system for any users and groups that were updated since the last watermark was stored.

2. Filter the users and groups returned, using any configured [assignments](assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

3. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties).

4. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.

5. If a matching user is found, it's updated using the attributes provided by the source system. If it's a newly assigned account that is matched, the provisioning service detects and caches the target system's ID for the new user, which is used to run all future operations on that user.

6. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.

7. If a user that was previously in scope for provisioning is removed from scope (including being unassigned), the service disables the user in the target system via an update.

8. If a user that was previously in scope for provisioning is disabled or soft-deleted in the source system, the service disables the user in the target system via an update.

9. If a user that was previously in scope for provisioning is hard-deleted in the source system, the service deletes the user in the target system. In Azure AD, users are hard-deleted 30 days after they're soft-deleted.

10. Persist a new watermark at the end of the incremental cycle, which provides the starting point for the later incremental cycles.

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

### How long will it take to provision users?

Performance depends on whether your provisioning job is running an initial provisioning cycle or an incremental cycle. For details about how long provisioning takes and how to monitor the status of the provisioning service, see [Check the status of user provisioning](application-provisioning-when-will-provisioning-finish-specific-user.md).

### How can I tell if users are being provisioned properly?

All operations run by the user provisioning service are recorded in the Azure AD [Provisioning logs (preview)](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context). This includes all read and write operations made to the source and target systems, and the user data that was read or written during each operation.

For information on how to read the provisioning logs in the Azure portal, see the [provisioning reporting guide](check-status-user-account-provisioning.md).

## Frequently asked questions


### How do I troubleshoot issues with user provisioning?

For scenario-based guidance on how to troubleshoot automatic user provisioning, see [Problems configuring and provisioning users to an application](application-provisioning-config-problem.md).

### What are the best practices for rolling out automatic user provisioning?

> [!VIDEO https://www.youtube.com/embed/MAy8s5WSe3A]

For an example step-by-step deployment plan for outbound user provisioning to an application, see the [Identity Deployment Guide for User Provisioning](https://aka.ms/deploymentplans/userprovisioning).

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

## Summary of terminology
| Term | Description |
| --- | --- |
| Provisioning | |
| Source system| |
| Target system| |
| Source anchor| |
| Target anchor| |
| Matching attribute| |
| Scope| |
| Initial cycle| |
| Incremental cycle| |
| Quarantine| |
| Attribute mappings| |
| Matching attribute| |
| SCIM | |

## Next Steps

[Configure provisioning for a gallery app](configure-automatic-user-provisioning-portal.md)

[Build a SCIM endpoint and configure provisioning when creating your own app](use-scim-to-provision-users-and-groups.md)