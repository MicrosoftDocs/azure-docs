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
ms.date: 04/01/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---
# How provisioning works

User account provisioning is the act of creating, updating, and/or disabling user account records in an application’s local user profile store. Most cloud and SaaS applications store the users role and permissions in the user's own local user profile store, and presence of such a user record in the user's local store is *required* for single sign-on and access to work.

The **Azure AD Provisioning Service** provisions users to SaaS apps and other systems by connecting to user management API endpoints provided by each application vendor. These user management API endpoints allow Azure AD to programmatically create, update, and remove users. For selected applications, the provisioning service can also create, update, and remove additional identity-related objects, such as groups and roles.

![Azure AD Provisioning Service](./media/user-provisioning/provisioning0.PNG)
*Figure 1: The Azure AD Provisioning Service*

![Outbound user provisioning workflow](./media/user-provisioning/provisioning1.PNG)
*Figure 2: "Outbound" user provisioning workflow from Azure AD to popular SaaS applications*

![Inbound user provisioning workflow](./media/user-provisioning/provisioning2.PNG)
*Figure 3: "Inbound" user provisioning workflow from popular Human Capital Management (HCM) applications to Azure Active Directory and Windows Server Active Directory*

### Configuring an application for Manual Provisioning

*Manual* provisioning means that user accounts must be created manually using methods provided by the app. This could mean logging into an administrative portal for that app and adding users using a web-based user interface. Or it could be uploading a spreadsheet with user account detail, using a mechanism provided by that application. Consult the documentation provided by the app, or contact the app developer to determine what mechanisms are available.

If *Manual* is the only mode shown for a given application, it means that there is no automatic Azure AD provisioning connector for the app yet. Or it means the app does not support the pre-requisites for Microsoft's user management API, which is used to build an automated provisioning connector.

If you would like to request support for automatic provisioning for a given app, you can fill out a request using the [Azure Active Directory Application Requests](https://aka.ms/aadapprequest).

### Configuring an application for Automatic Provisioning

*Automatic* means that an Azure AD provisioning connector has been developed for this application. For more information on the Azure AD provisioning service and how it works, see [Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-app-provisioning).

For more information on how to provision specific users and groups to an application, see [Managing user account provisioning for enterprise apps](https://docs.microsoft.com/azure/active-directory/active-directory-enterprise-apps-manage-provisioning).

The actual steps required to enable and configure automatic provisioning varies depending on the application.

> [!NOTE]
> You should start by finding the setup tutorial specific to setting up provisioning for your application, and following those steps to configure both the app and Azure AD to create the provisioning connection. 

App tutorials can be found at [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list).

An important thing to consider when setting up provisioning is to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. This includes setting the “matching property” that is used to uniquely identify and match users/groups between the two systems. See the link in *Next Steps* for more information on attribute mappings.

## Authorization

Expand Admin Credentials to enter the credentials required for Azure AD to connect to the application's user management API. The input required varies depending on the application. To learn about the credential types and requirements for specific applications, see the configuration tutorial for that specific application.
Select Test Connection to test the credentials by having Azure AD attempt to connect to the app's provisioning app using the supplied credentials.

When using the Azure portal to configure automatic user provisioning for an enterprise application, you may encounter a situation where:
The Admin Credentials entered for the application are valid, and the Test Connection button works. However, the credentials cannot be saved, and the Azure portal returns a generic error message.
If SAML-based single sign-on is also configured for the same application, the most likely cause of the error is that Azure AD's internal, per-application storage limit for certificates and credentials has been exceeded.
Azure AD currently has a maximum storage capacity of 1024 bytes for all certificates, secret tokens, credentials, and related configuration data associated with a single instance of an application (also known as a service principal record in Azure AD).
When SAML-based single sign-on is configured, the certificate used to sign the SAML tokens is stored here, and often consumes over 50% percent of the space.
Any secret tokens, URIs, notification email addresses, user names, and passwords that get entered during setup of user provisioning can cause the storage limit to be exceeded.

## Mapping attributes 

When you enable user provisioning for a third-party SaaS application, the Azure portal controls its attribute values through attribute-mappings. Mappings determine the user attributes that flow between Azure AD and the target application when user accounts are provisioned or updated.

There's a pre-configured set of attributes and attribute-mappings between Azure AD user objects and each SaaS app’s user objects. Some apps manage other types of objects along with Users, such as Groups.

When setting up provisioning, it's important to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. This includes setting the matching property (**Match objects using this attribute**) that is used to uniquely identify and match users/groups between the two systems. 

You can customize the default attribute-mappings according to your business needs. So, you can change or delete existing attribute-mappings, or create new attribute-mappings. For details, see [Customizing user provisioning attribute-mappings for SaaS applications](customize-application-attributes.md).

When you configure provisioning to a SaaS application, one of the types of attribute mappings that you can specify is an expression mapping. For these, you must write a script-like expression that allows you to transform your users’ data into formats that are more acceptable for the SaaS application. 

For details, see [Writing expressions for attribute mappings](functions-for-customizing-application-data.md).

## Scoping 

A scoping filter allows the Azure Active Directory (Azure AD) provisioning service to include or exclude any users who have an attribute that matches a specific value. For example, when provisioning users from Azure AD to a SaaS application used by a sales team, you can specify that only users with a "Department" attribute of "Sales" should be in scope for provisioning.
Scoping filters can be used differently depending on the type of provisioning connector:
Outbound provisioning from Azure AD to SaaS applications. When Azure AD is the source system, user and group assignments are the most common method for determining which users are in scope for provisioning. These assignments also are used for enabling single sign-on and provide a single method to manage access and provisioning. Scoping filters can be used optionally, in addition to assignments or instead of them, to filter users based on attribute values.
 Tip
You can disable provisioning based on assignments for an enterprise application by changing settings in the Scope menu under the provisioning settings to Sync all users and groups. Using this option plus attribute-based scoping filters offers faster performance than using group-based assignments.
Inbound provisioning from HCM applications to Azure AD and Active Directory. When an HCM application such as Workday is the source system, scoping filters are the primary method for determining which users should be provisioned from the HCM application to Active Directory or Azure AD.
By default, Azure AD provisioning connectors do not have any attribute-based scoping filters configured.

For details, see [Attribute-based application provisioning with scoping filters](define-conditional-rules-for-provisioning-user-accounts.md)

## Provisioning cycles: Initial and incremental

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

### How long will it take to provision users?

Performance depends on whether your provisioning job is running an initial provisioning cycle or an incremental cycle. For details about how long provisioning takes and how to monitor the status of the provisioning service, see [Check the status of user provisioning](application-provisioning-when-will-provisioning-finish-specific-user.md).

### How can I tell if users are being provisioned properly?

All operations run by the user provisioning service are recorded in the Azure AD [Provisioning logs (preview)](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context). This includes all read and write operations made to the source and target systems, and the user data that was read or written during each operation.

For information on how to read the provisioning logs in the Azure portal, see the [provisioning reporting guide](check-status-user-account-provisioning.md).


# Summary of terminology
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




