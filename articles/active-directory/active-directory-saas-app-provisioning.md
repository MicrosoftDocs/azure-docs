---
title: Automated SaaS app user provisioning in Azure AD | Microsoft Docs
description: An introduction to how you can use Azure AD to automatically provision, de-provision, and continuously update user accounts across multiple third-party SaaS applications.
services: active-directory
documentationcenter: ''
author: asmalser-msft
manager: mtillman
editor: ''

ms.assetid: 58c5fa2d-bb33-4fba-8742-4441adf2cb62
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/15/2017
ms.author: asmalser

---
# Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory
## What is automated user provisioning for SaaS apps?
Azure Active Directory (Azure AD) allows you to automate the creation, maintenance, and removal of user identities in cloud ([SaaS](https://azure.microsoft.com/overview/what-is-saas/)) applications such as Dropbox, Salesforce, ServiceNow, and more.

**Below are some examples of what this feature allows you to do:**

* Automatically create new accounts in the right systems for new people when they join your team or organization.
* Automatically deactivate accounts in the right systems when people leave the team or organization.
* Ensure that the identities in your apps and systems are kept up-to-date based on changes in the directory, or your human resources system.
* Provision non-user objects, such as groups, to applications that support them.

**Automated user provisioning also includes the following functionality:**

* The ability to match existing identities between source and target systems.
* Customizable attribute mappings that define what user data should flow from the source system to the target system.
* Optional email alerts for provisioning errors
* Reporting and activity logs to help with monitoring and troubleshooting.

## Why use automated provisioning?
Some common motivations for using this feature include:

* Avoiding the costs, inefficiencies, and human error associated with manual provisioning processes.
* Avoiding the costs associated with hosting and maintaining custom-developed provisioning solutions and scripts
* To secure your organization by instantly removing users' identities from key SaaS apps when they leave the organization.
* To easily import a large numbers of users into a particular SaaS application or system.
* To enjoy having a single set of policies to determine who is provisioned and who can sign in to an app.


## How does automatic provisioning work?
	
The **Azure AD Provisioning Service** provisions users to SaaS apps and other systems, by connecting to user management API endpoints provided by each application vendor. These user management API endpoints allow Azure AD to programmatically create, update, and remove users. For selected applications the provisioning service can also create, update, and remove additional identity-related objects, such as groups and roles. 

![Provisioning](./media/active-directory-saas-app-provisioning/provisioning0.PNG)
*Figure 1: The Azure AD Provisioning Service*

![Outbound Provisioning](./media/active-directory-saas-app-provisioning/provisioning1.PNG)
*Figure 2: "Outbound" user provisioning workflow from Azure AD to popular SaaS applications*

![Inbound Provisioning](./media/active-directory-saas-app-provisioning/provisioning2.PNG)
*Figure 3: "Inbound" user provisioning workflow from popular Human Capital Management (HCM) applications to Azure Active Directory and Windows Server Active Directory*


## What applications and systems can I use with Azure AD automatic user provisioning?

Azure AD features pre-integrated support for a variety of popular SaaS apps and human resources systems, as well as generic support for apps that implement specific parts of the SCIM 2.0 standard.

For a list of all applications for which Azure AD supports a pre-integrated provisioning connector, see the [list of application tutorials for user provisioning](active-directory-saas-tutorial-list.md).

For information on how to add support for Azure AD user provisioning to an application, see [Using SCIM to automatically provision users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md).

To contact the Azure AD engineering team to request provisioning support for additional applications, submit a message through the [Azure Active Directory feedback forum](https://feedback.azure.com/forums/374982-azure-active-directory-application-requests/filters/new?category_id=172035).	

> [!NOTE]
> In order for an application to support automated user provisioning, it must first provide the necessary user management APIs that allow for external programs to automate the creation, maintenance, and removal of users. Therefore, not all SaaS apps are compatible with this feature. For apps that do support user management APIs, the Azure AD engineering team will then be able to build a provisioning connector to those apps, and this work is prioritized by the needs of current and prospective customers. 
	
	
## How do I set up automatic provisioning to an application?

Configuration of the Azure AD provisioning service for a selected application starts in the **[Azure portal](https://portal.azure.com)**. In the **Azure Active Directory > Enterprise Applications** section, select **Add**, then **All**, and then add either of the following depending on your scenario:

* All applications in the **Featured applications** section support automatic provisioning. See the [list of application tutorials for user provisioning]active-directory-saas-tutorial-list.md) for additional ones.

* Use the “non-gallery application” option for custom-developed SCIM integrations

![Gallery](./media/active-directory-saas-app-provisioning/gallery.png)

In the application management screen, provisioning is configured in the **Provisioning** tab.

![Settings](./media/active-directory-saas-app-provisioning/provisioning_settings0.PNG)


* **Admin credentials** must be provided to the Azure AD provisioning service that will allow it to connect to the user management API provided by the application. This section also allows you to enable email notifications if the credentials fail, or the provisioning job goes into [quarantine](#quarantine).

* **Attribute mappings** can be configured that specify which fields in the source system (example: Azure AD) will have their contents synchronized to which fields in the target system (example: ServiceNow). If the target application supports it, this section will allow you to optionally configure provisioning of groups in addition to user accounts. "Matching properties" allow you to select which fields are used to match accounts between the systems. "[Expressions](active-directory-saas-writing-expressions-for-attribute-mappings.md)" allow you to modify and transform the values retrieved from the source system before they are written to the target system. For more information, see [Customizing Attribute Mappings](active-directory-saas-customizing-attribute-mappings.md).

![Settings](./media/active-directory-saas-app-provisioning/provisioning_settings1.PNG)

* **Scoping filters** tell the provisioning service which users and group in the source system should be provisioned and/or deprovisioned to the target system. There are two aspects to scoping filters that are evaluated together that determine who is in scope for provisioning:

    * **Filter on attribute values** - The "Source Object Scope" menu in the attribute mappings allows filtering on specific attribute values. For example, you can specify that only users with a "Department" attribute of "Sales" should be in scope for provisioning. For more information, see [Using scoping filters](active-directory-saas-scoping-filters.md).

    * **Filter on assignments** - The "Scope" menu in the Provisioning > Settings section of the portal allows you to specify whether only "assigned" users and groups should be in scope for provisioning, or if all users in the Azure AD directory should be provisioned. For information on "assigning" users and groups, see [Assign a user or group to an enterprise app in Azure Active Directory](active-directory-coreapps-assign-user-azure-portal.md).
	
* **Settings** control the operation of the provisioning service for an application, including whether it is currently running or not.

* **Audit logs** provide records of every operation performed by the Azure AD provisioning service. For more details, see the [provisioning reporting guide](active-directory-saas-provisioning-reporting.md).

![Settings](./media/active-directory-saas-app-provisioning/audit_logs.PNG)

> [!NOTE]
> The Azure AD user provisioning service can also be configured and managed using the [Microsoft Graph API](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/synchronization-overview).


## What happens during provisioning?

When Azure AD is the source system, the provisioning service uses the [Differential Query feature of the Azure AD Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-differential-query) to monitor users and groups. The provisioning service runs an initial sync against the source system and target system, followed by periodic incremental syncs. 

### Initial sync
When the provisioning service is started, the first sync ever performed will:

1. Query all users and groups from the source system, retrieving all attributes defined in the [attribute mappings](active-directory-saas-customizing-attribute-mappings.md).
2. Filter the users and groups returned, using any configured [assignments](active-directory-coreapps-assign-user-azure-portal.md) or [attribute-based scoping filters](active-directory-saas-scoping-filters.md).
3. When a user is found to be assigned or in scope for provisioning, the service queries the target system for a matching user using the designated [matching attributes](active-directory-saas-customizing-attribute-mappings.md#understanding-attribute-mapping-properties). Example: If the userPrincipal name in the source system is the matching attribute and maps to userName in the target system, then the provisioning service queries the target system for userNames that match the userPrincipal name values in the source system.
4. If a matching user is not found in the target system, it is created using the attributes returned from the source system.
5. If a matching user is found, it is updated using the attributes provided by the source system.
6. If the attribute mappings contain "reference" attributes, the service performs additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.
7. Persist a watermark at the end of the initial sync, which provides the starting point for the subsequent incremental syncs.

Some applications such as ServiceNow, Google Apps, and Box support not only provisioning users, but also provisioning groups and their members. In those cases, if group provisioning is enabled in the [mappings](active-directory-saas-customizing-attribute-mappings.md), the provisioning service synchronizes the users and the groups, and then subsequently synchronizes the group memberships. 

### Incremental syncs
After the initial sync, all subsequent syncs will:

1. Query the source system for any users and groups that were updated since the last watermark was stored.
2. Filter the users and groups returned, using any configured [assignments](active-directory-coreapps-assign-user-azure-portal.md) or [attribute-based scoping filters](active-directory-saas-scoping-filters.md).
3. When a user is found to be assigned or in scope for provisioning, the service queries the target system for a matching user using the designated [matching attributes](active-directory-saas-customizing-attribute-mappings.md#understanding-attribute-mapping-properties).
4. If a matching user is not found in the target system, it is created using the attributes returned from the source system.
5. If a matching user is found, it is updated using the attributes provided by the source system.
6. If the attribute mappings contain "reference" attributes, the service performs additional updates on the target system to create and link the referenced objects. For example, a user may have a "Manager" attribute in the target system, which is linked to another user created in the target system.
7. If a user that was previously in scope for provisioning is removed from scope (including being unassigned), the service disables the user in the target system via an update.
8. If a user that was previously in scope for provisioning is disabled or soft-deleted in the source system, the service disables the user in the target system via an update.
9. If a user that was previously in scope for provisioning is hard-deleted in the source system, the service deletes the user in the target system. In Azure AD, users are hard-deleted 30 days after they are soft-deleted.
10. Persist a new watermark at the end of the incremental sync, which provides the starting point for the subsequent incremental syncs.

>[!NOTE]
> You can optionally disable the create, update, or delete operations by using the **Target object actions** check boxes in the [Attribute Mappings](active-directory-saas-customizing-attribute-mappings.md) section. The logic to disable a user during an update is also controlled via an attribute mapping from a field such as "accountEnabled".

The provisioning service will continue to run back-to-back incremental syncs indefinitely, at intervals defined in the [tutorial specific to each application](active-directory-saas-tutorial-list.md), until one of the following events occurs:

* The service is manually stopped using the Azure portal, or using the appropriate Graph API command 
* A new initial sync is triggered using the **Clear state and restart** option in the Azure portal, or using the appropriate Graph API command. This clears any stored watermark and causes all source objects to be evaluated again.
* A new initial sync is triggered due to a change in attribute mappings or scoping filters. This also clears any stored watermark and causes all source objects to be evaluated again.
* The provisioning process goes into quarantine (see below) due to a high error rate, and stays in quarantine for more than four weeks. In this event, the service will be automatically disabled.

### Errors and retries 
If an individual user can't be added, updated, or deleted in the target system due to an error in the target system, then the operation will be retried in the next sync cycle. If the user continues to fail, then the retries will begin to occur at a reduced frequency, gradually scaling back to just one attempt per day. To resolve the failure, administrators will need to check the [audit logs](active-directory-saas-provisioning-reporting.md) for "process escrow" events to determine the root cause and take the appropriate action. Common failures can include:

* Users not having an attribute populated in the source system that is required in the target system
* Users having an attribute value in the source system for which there is a unique constraint in the target system, and the same value is present in another user record

These failures can be resolved by adjusting the attribute values for the affected user in the source system, or by adjusting the attribute mappings to not cause conflicts.   

### Quarantine
If most or all of the calls made against the target system consistently fail due to an error (such as in the case of invalid admin credentials), then the provisioning job goes into a "quarantine" state. This is indicated in the [provisioning summary report](active-directory-saas-provisioning-reporting.md), and via email if email notifications were configured in the Azure portal. 

When in quarantine, the frequency of incremental syncs is gradually reduced to once per day. 

The provisioning job will be removed from quarantine after all of the offending errors being fixed, and the next sync cycle starts. If the provisioning job stays in quarantine for more than four weeks, the provisioning job is disabled.


## Frequently asked questions

**How long will it take to provision my users?**

Performance will be different depending on whether your provisioning job is performing an initial sync, or an incremental sync.

For initial syncs, the time it takes to complete will be directly dependent on how many users, groups, and group members are present in the source system. Very small source systems with hundreds of objects can complete initial syncs in a matter of minutes. However, source systems with hundreds of thousands or millions of combined objects can take a very long time.

For incremental syncs, the time it takes depends on the number changes detected in that sync cycle. If there are less than 5,000 user or group membership changes detected, these can often be synced within a 40 minute cycle. 

Note that overall performance is dependent on both the source and target systems. Some target systems implement request rate limits and throttling that can impact performance during large sync operations, and the pre-built Azure AD provisioning connectors for those systems take this into account.

Performance is also slower if there are many errors (recorded in the [audit logs](active-directory-saas-provisioning-reporting.md)) and the provisioning service has gone into a "quarantine" state.

**How can I improve the performance of synchronization?**

Most performance problems occur during initial syncs of systems that have a large number of groups and group members.

If sync of groups or group memberships is not required, sync performance can be greatly improved by:

1. Setting the **Provisioning > Settings > Scope** menu to **Sync all**, instead of syncing assigned users and groups.
2. Use [scoping filters](active-directory-saas-scoping-filters.md) instead of assignments to filter the list of users provisioned.

> [!NOTE]
> For applications that support provisioning of group names and group properties (such as ServiceNow and Google Apps), disabling this also reduces the time it takes for an initial sync to complete. If you do not want to provision group names and group memberships to your application, you can disable this in the [attribute mappings](active-directory-saas-customizing-attribute-mappings.md) of your provisioning configuration.

**How can I track the progress of the current provisioning job?**

See the [provisioning reporting guide](active-directory-saas-provisioning-reporting.md).

**How will I know if users fail to get provisioned properly?**

All failures are recorded in the Azure AD audit logs. For more information, see the [provisioning reporting guide](active-directory-saas-provisioning-reporting.md).

**How can I build an application that works with the provisioning service?**

See [Using SCIM to automatically provision users and groups from Azure Active Directory to applications](https://docs.microsoft.com/azure/active-directory/active-directory-scim-provisioning).

**How can I submit feedback to the engineering team?**

Contact us through the [Azure Active Directory feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory/).


## Related articles
* [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)
* [Customizing Attribute Mappings for User Provisioning](active-directory-saas-customizing-attribute-mappings.md)
* [Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md)
* [Scoping Filters for User Provisioning](active-directory-saas-scoping-filters.md)
* [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md)
* [Azure AD synchronization API overview](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/synchronization-overview)
* [Step-by-step deployment plan for outbound user provisioning of an application](https://aka.ms/userprovisioningdeploymentplan)

