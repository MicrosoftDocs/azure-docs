---
title: Understand how Azure AD provisioning works | Microsoft Docs
description: Understand how Azure AD provisioning works 
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 05/20/2020
ms.author: kenwith
ms.reviewer: arvinh
---

# How provisioning works

Automatic provisioning refers to creating user identities and roles in the cloud applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change. Before you start a deployment, you can review this article to learn how Azure AD provision works and get configuration recommendations. 

The **Azure AD Provisioning Service** provisions users to SaaS apps and other systems by connecting to a System for Cross-Domain Identity Management (SCIM) 2.0 user management API endpoint provided by the application vendor. This SCIM endpoint allows Azure AD to programmatically create, update, and remove users. For selected applications, the provisioning service can also create, update, and remove additional identity-related objects, such as groups and roles. The channel used for provisioning between Azure AD and the application is encrypted using HTTPS TLS 1.2 encryption.


![Azure AD Provisioning Service](./media/how-provisioning-works/provisioning0.PNG)
*Figure 1: The Azure AD Provisioning Service*

![Outbound user provisioning workflow](./media/how-provisioning-works/provisioning1.PNG)
*Figure 2: "Outbound" user provisioning workflow from Azure AD to popular SaaS applications*

![Inbound user provisioning workflow](./media/how-provisioning-works/provisioning2.PNG)
*Figure 3: "Inbound" user provisioning workflow from popular Human Capital Management (HCM) applications to Azure Active Directory and Windows Server Active Directory*

## Provisioning using SCIM 2.0

The Azure AD provisioning service uses the [SCIM 2.0 protocol](https://techcommunity.microsoft.com/t5/Identity-Standards-Blog/bg-p/IdentityStandards) for automatic provisioning. The service connects to the SCIM endpoint for the application, and uses SCIM user object schema and REST APIs to automate the provisioning and de-provisioning of users and groups. A SCIM-based provisioning connector is provided for most applications in the Azure AD gallery. When building apps for Azure AD, developers can use the SCIM 2.0 user management API to build a SCIM endpoint that integrates Azure AD for provisioning. For details, see [Build a SCIM endpoint and configure user provisioning](../app-provisioning/use-scim-to-provision-users-and-groups.md).

To request an automatic Azure AD provisioning connector for an app that doesn't currently have one, fill out an [Azure Active Directory Application Request](https://aka.ms/aadapprequest).

## Authorization

Credentials are required for Azure AD to connect to the application's user management API. While you're configuring automatic user provisioning for an application, you'll need to enter valid credentials. You can find credential types and requirements for the application by referring to the app tutorial. In the Azure portal, you'll be able to test the credentials by having Azure AD attempt to connect to the app's provisioning app using the supplied credentials.

If SAML-based single sign-on is also configured for the application, Azure AD's internal, per-application storage limit is 1024 bytes. This limit includes all certificates, secret tokens, credentials, and related configuration data associated with a single instance of an application (also known as a service principal record in Azure AD). When SAML-based single sign-on is configured, the certificate used to sign the SAML tokens often consumes over 50% percent of the space. Any additional items (secret tokens, URIs, notification email addresses, user names, and passwords) that you enter during user provisioning setup could exceed the storage limit. For more information, see [Problem saving administrator credentials while configuring user provisioning](../manage-apps/application-provisioning-config-problem-storage-limit.md).

## Mapping attributes

When you enable user provisioning for a third-party SaaS application, the Azure portal controls its attribute values through attribute mappings. Mappings determine the user attributes that flow between Azure AD and the target application when user accounts are provisioned or updated.

There's a pre-configured set of attributes and attribute mappings between Azure AD user objects and each SaaS app’s user objects. Some apps manage other types of objects along with Users, such as Groups.

When setting up provisioning, it's important to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. Review and configure the matching property (**Match objects using this attribute**) that is used to uniquely identify and match users/groups between the two systems.

You can customize the default attribute-mappings according to your business needs. So, you can change or delete existing attribute-mappings, or create new attribute-mappings. For details, see [Customizing user provisioning attribute-mappings for SaaS applications](../manage-apps/customize-application-attributes.md).

When you configure provisioning to a SaaS application, one of the types of attribute mappings that you can specify is an expression mapping. For these mappings, you must write a script-like expression that allows you to transform your users’ data into formats that are more acceptable for the SaaS application. For details, see [Writing expressions for attribute mappings](functions-for-customizing-application-data.md).

## Scoping 
### Assignment-based scoping

For outbound provisioning from Azure AD to a SaaS application, relying on [user or group assignments](../manage-apps/assign-user-or-group-access-portal.md) is the most common way to determine which users are in scope for provisioning. Because user assignments are also used for enabling single sign-on, the same method can be used for managing both access and provisioning. Assignment-based scoping doesn't apply to inbound provisioning scenarios such as Workday and Successfactors.

* **Groups.** With an Azure AD Premium license plan, you can use groups to assign access to a SaaS application. Then, when the provisioning scope is set to **Sync only assigned users and groups**, the Azure AD provisioning service will provision or de-provision users based on whether they're members of a group that's assigned to the application. The group object itself isn't provisioned unless the application supports group objects. Ensure that groups assigned to your application have the property "SecurityEnabled" set to "True".

* **Dynamic groups.** The Azure AD user provisioning service can read and provision users in [dynamic groups](../users-groups-roles/groups-create-rule.md). Keep these caveats and recommendations in mind:

  * Dynamic groups can impact the performance of end-to-end provisioning from Azure AD to SaaS applications.

  * How fast a user in a dynamic group is provisioned or de-provisioned in a SaaS application depends on how fast the dynamic group can evaluate membership changes. For information about how to check the processing status of a dynamic group, see [Check processing status for a membership rule](../users-groups-roles/groups-create-rule.md).

  * When a user loses membership in the dynamic group, it's considered a de-provisioning event. Consider this scenario when creating rules for dynamic groups.

* **Nested groups.** The Azure AD user provisioning service can't read or provision users in nested groups. The service can only read and provision users that are immediate members of an explicitly assigned group. This limitation of "group-based assignments to applications" also affects single sign-on (see [Using a group to manage access to SaaS applications](../users-groups-roles/groups-saasapps.md)). Instead, directly assign or otherwise [scope in](define-conditional-rules-for-provisioning-user-accounts.md) the groups that contain the users who need to be provisioned.

### Attribute-based scoping 

You can use scoping filters to define attribute-based rules that determine which users are provisioned to an application. This method is commonly used for inbound provisioning from HCM applications to Azure AD and Active Directory. Scoping filters are configured as part of the attribute mappings for each Azure AD user provisioning connector. For details about configuring attribute-based scoping filters, see [Attribute-based application provisioning with scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

### B2B (guest) users

It's possible to use the Azure AD user provisioning service to provision B2B (or guest) users in Azure AD to SaaS applications. 
However, for B2B users to sign in to the SaaS application using Azure AD, the SaaS application must have its SAML-based single sign-on capability configured in a specific way. For more information on how to configure SaaS applications to support sign-ins from B2B users, see [Configure SaaS apps for B2B collaboration](../b2b/configure-saas-apps.md).

Note that the userPrincipalName for a guest user is often stored as "alias#EXT#@domain.com". when the userPrincipalName is included in your attribute mappings as a source attribute, the #EXT# is stripped from the userPrincipalName. If you require the #EXT# to be present, replace userPrincipalName with originalUserPrincipalName as the source attribute. 

## Provisioning cycles: Initial and incremental

When Azure AD is the source system, the provisioning service uses the [Use delta query to track changes in Microsoft Graph data](https://docs.microsoft.com/graph/delta-query-overview) to monitor users and groups. The provisioning service runs an initial cycle against the source system and target system, followed by periodic incremental cycles.

### Initial cycle

When the provisioning service is started, the first cycle will:

1. Query all users and groups from the source system, retrieving all attributes defined in the [attribute mappings](customize-application-attributes.md).

2. Filter the users and groups returned, using any configured [assignments](../manage-apps/assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

3. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties). Example: If the userPrincipal name in the source system is the matching attribute and maps to userName in the target system, then the provisioning service queries the target system for userNames that match the userPrincipal name values in the source system.

4. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user. This ID is used to run all future operations on that user.

5. If a matching user is found, it's updated using the attributes provided by the source system. After the user account is matched, the provisioning service detects and caches the target system's ID for the new user. This ID is used to run all future operations on that user.

6. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.

7. Persist a watermark at the end of the initial cycle, which provides the starting point for the later incremental cycles.

Some applications such as ServiceNow, G Suite, and Box support not only provisioning users, but also provisioning groups and their members. In those cases, if group provisioning is enabled in the [mappings](customize-application-attributes.md), the provisioning service synchronizes the users and the groups, and then later synchronizes the group memberships.

### Incremental cycles

After the initial cycle, all other cycles will:

1. Query the source system for any users and groups that were updated since the last watermark was stored.

2. Filter the users and groups returned, using any configured [assignments](../manage-apps/assign-user-or-group-access-portal.md) or [attribute-based scoping filters](define-conditional-rules-for-provisioning-user-accounts.md).

3. When a user is assigned or in scope for provisioning, the service queries the target system for a matching user using the specified [matching attributes](customize-application-attributes.md#understanding-attribute-mapping-properties).

4. If a matching user isn't found in the target system, it's created using the attributes returned from the source system. After the user account is created, the provisioning service detects and caches the target system's ID for the new user. This ID is used to run all future operations on that user.

5. If a matching user is found, it's updated using the attributes provided by the source system. If it's a newly assigned account that is matched, the provisioning service detects and caches the target system's ID for the new user. This ID is used to run all future operations on that user.

6. If the attribute mappings contain "reference" attributes, the service does additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.

7. If a user that was previously in scope for provisioning is removed from scope, including being unassigned, the service disables the user in the target system via an update.

8. If a user that was previously in scope for provisioning is disabled or soft-deleted in the source system, the service disables the user in the target system via an update.

9. If a user that was previously in scope for provisioning is hard-deleted in the source system, the service deletes the user in the target system. In Azure AD, users are hard-deleted 30 days after they're soft-deleted.

10. Persist a new watermark at the end of the incremental cycle, which provides the starting point for the later incremental cycles.

> [!NOTE]
> You can optionally disable the **Create**, **Update**, or **Delete** operations by using the **Target object actions** check boxes in the [Mappings](customize-application-attributes.md) section. The logic to disable a user during an update is also controlled via an attribute mapping from a field such as "accountEnabled".

The provisioning service continues running back-to-back incremental cycles indefinitely, at intervals defined in the [tutorial specific to each application](../saas-apps/tutorial-list.md). Incremental cycles continue until one of the following events occurs:

- The service is manually stopped using the Azure portal, or using the appropriate Microsoft Graph API command.
- A new initial cycle is triggered using the **Clear state and restart** option in the Azure portal, or using the appropriate Microsoft Graph API command. This action clears any stored watermark and causes all source objects to be evaluated again.
- A new initial cycle is triggered because of a change in attribute mappings or scoping filters. This action also clears any stored watermark and causes all source objects to be evaluated again.
- The provisioning process goes into quarantine (see below) because of a high error rate, and stays in quarantine for more than four weeks. In this event, the service will be automatically disabled.

### Errors and retries

If an error in the target system prevents an individual user from being added, updated, or deleted in the target system, the operation is retried in the next sync cycle. If the user continues to fail, then the retries will begin to occur at a reduced frequency, gradually scaling back to just one attempt per day. To resolve the failure, administrators must check the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context) to determine the root cause and take the appropriate action. Common failures can include:

- Users not having an attribute populated in the source system that is required in the target system
- Users having an attribute value in the source system for which there's a unique constraint in the target system, and the same value is present in another user record

Resolve these failures by adjusting the attribute values for the affected user in the source system, or by adjusting the attribute mappings so they don't cause conflicts.

### Quarantine

If most or all of the calls that are made against the target system consistently fail because of an error (for example invalid admin credentials) the provisioning job goes into a "quarantine" state. This state is indicated in the [provisioning summary report](../manage-apps/check-status-user-account-provisioning.md) and via email if email notifications were configured in the Azure portal.

When in quarantine, the frequency of incremental cycles is gradually reduced to once per day.

The provisioning job exits quarantine after all of the offending errors are fixed and the next sync cycle starts. If the provisioning job stays in quarantine for more than four weeks, the provisioning job is disabled. Learn more here about quarantine status [here](../manage-apps/application-provisioning-quarantine-status.md).

### How long provisioning takes

Performance depends on whether your provisioning job is running an initial provisioning cycle or an incremental cycle. For details about how long provisioning takes and how to monitor the status of the provisioning service, see [Check the status of user provisioning](../manage-apps/application-provisioning-when-will-provisioning-finish-specific-user.md).

### How to tell if users are being provisioned properly

All operations run by the user provisioning service are recorded in the Azure AD [Provisioning logs (preview)](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context). The logs include all read and write operations made to the source and target systems, and the user data that was read or written during each operation. For information on how to read the provisioning logs in the Azure portal, see the [provisioning reporting guide](../manage-apps/check-status-user-account-provisioning.md).

## De-provisioning

The Azure AD provisioning service keeps source and target systems in sync by de-provisioning accounts when users should not have access anymore. 

The Azure AD provisioning service will soft delete a user in an application when the application supports soft deletes (update request with active = false) and any of the following events occur:

* The user account is deleted in Azure AD
*	The user is unassigned from the application
*	The user no longer meets a scoping filter and goes out of scope
    * By default, the Azure AD provisioning service soft deletes or disables users that go out of scope. If you want to override this default behavior, you can set a flag to [skip out-of-scope deletions](../app-provisioning/skip-out-of-scope-deletions.md).
*	The AccountEnabled property is set to False

If one of the above four events occurs and the target application does not support soft deletes, the provisioning service will send a DELETE request to permanently delete the user from the app. 

30 days after a user is deleted in Azure AD, they will be permanently deleted from the tenant. At this point, the provisioning service will send a DELETE request to permanently delete the user in the application. At any time during the 30-day window, you can [manually delete a user permanently](../fundamentals/active-directory-users-restore.md), which sends a delete request to the application.

If you see an attribute IsSoftDeleted in your attribute mappings, it is used to determine the state of the user and whether to send an update request with active = false to soft delete the user. 

## Next Steps

[Plan an automatic user provisioning deployment](../app-provisioning/plan-auto-user-provisioning.md)

[Configure provisioning for a gallery app](../manage-apps/configure-automatic-user-provisioning-portal.md)

[Build a SCIM endpoint and configure provisioning when creating your own app](../app-provisioning/use-scim-to-provision-users-and-groups.md)

[Troubleshoot problems with configuring and provisioning users to an application](../manage-apps/application-provisioning-config-problem.md).
