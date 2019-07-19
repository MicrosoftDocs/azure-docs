---
title: Find out when a specific user will be able to access an application | Microsoft Docs
description: How to find out when a critically important user be able to access an application you have configured for user provisioning with Azure AD
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/12/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---

# Check the status of user provisioning

The Azure AD provisioning service runs an initial provisioning cycle against the source system and target system, followed by periodic incremental cycles. When you configure provisioning for an app, you can check the current status of the provisioning service and see when a user will be able to access an app.

## View the provisioning progress bar (preview)

 On the **Provisioning** page for an app, you can view the status of the Azure AD provisioning service. The **Current Status** section at the bottom of the page shows whether a provisioning cycle has started provisioning user accounts. You can watch the progress of the cycle, see how many users and groups have been provisioned, and see how many roles are created.

When you first configure automatic provisioning, the **Current Status** section at the bottom of the page shows the status of the initial provisioning cycle. This section updates each time an incremental cycle runs. The following details are shown:
- The type of provisioning cycle (initial or incremental) that is currently running or was last completed.
- A **progress bar** showing the percentage of the provisioning cycle that has completed. The percentage reflects the count of pages provisioned. Note that each page could contain multiple users or groups, so the percentage doesn't directly correlate to the number of users, groups, or roles provisioned.
- A **Refresh** button you can use to keep the view updated.
- The number of **Users** and **Groups** provisioned, and the number of roles created. During the initial cycle, the **Users** number counts up by 1 when a user is created or updated, and it counts down by 1 when a user is deleted. During an incremental cycle, user updates don’t affect the **Users** count; the number changes only when users are created or deleted.
- A **View Audit Logs** link, which opens the Azure AD audit logs for details about all operations run by the user provisioning service, including provisioning status for individual users (see the [Use audit logs](#use-audit-logs-to-check-a-users-provisioning-status) section below).

After a provisioning cycle is complete, the **Statistics to date** section shows the cumulative numbers of users and groups that have been provisioned to date, along with the completion date and duration of the last cycle. The **Activity ID** uniquely identifies the most recent provisioning cycle. The **Job ID** is a unique identifier for the provisioning job, and is specific to the app in your tenant.

The provisioning progress can viewed in the Azure portal, in the **Azure Active Directory &gt; Enterprise Apps &gt; \[application name\] &gt; Provisioning** tab.

![Provisioning page progress bar](media/application-provisioning-when-will-provisioning-finish-specific-user/provisioning-progress-bar-section.png)

## Use audit logs to check a user's provisioning status

To see the provisioning status for a selected user, consult the Audit logs in Azure AD. All operations run by the user provisioning service are recorded in the Azure AD audit logs. This includes all read and write operations made to the source and target systems, and the user data that was read or written during each operation.

The provisioning audit logs can be accessed in the Azure portal, in the **Azure Active Directory &gt; Enterprise Apps &gt; \[application name\] &gt; Audit Logs** tab. Filter the logs on the **Account Provisioning** category to only see the provisioning events for that app. You can search for users based on the “matching ID” that was configured for them in the attribute mappings. 

For example, if you configured the “user principal name” or “email address” as the matching attribute on the Azure AD side, and the user not being provisioning has a value of “audrey@contoso.com”, then search the audit logs for “audrey@contoso.com” and review then entries returned.

The provisioning audit logs record all the operations performed by the provisioning service, including:

* Querying Azure AD for assigned users that are in scope for provisioning
* Querying the target app for the existence of those users
* Comparing the user objects between the system
* Adding, updating, or disabling the user account in the target system based on the comparison

For more information on how to read the audit logs in the Azure portal, see the [provisioning reporting guide](check-status-user-account-provisioning.md).

## How long will it take to provision users?
When using automatic user provisioning with an application, Azure AD automatically provisions and updates user accounts in an app based on things like [user and group assignment](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal) at a regularly scheduled time interval, typically every 10 minutes.

The time it takes for a given user to be provisioned depends mainly on whether your provisioning job is running an initial sync or an incremental sync.

- For **initial syncs**, the job time depends on many factors, including the number of users and groups in scope for provisioning, and the total number of users and group in the source system. The first sync between Azure AD and an app can take anywhere from 20 minutes to several hours, depending on the size of the Azure AD directory and the number of users in scope for provisioning. A comprehensive list of factors that affect initial sync performance are summarized later in this section.

- For **incremental syncs** after the initial sync, job times tend to be faster (e.g. within 10 minutes), as the provisioning service stores watermarks that represent the state of both systems after the initial sync, improving performance of subsequent syncs. The job time depends on the number of changes detected in that provisioning cycle. If there are fewer than 5,000 user or group membership changes, the job can finish within a single incremental provisioning cycle. 

The following table summarizes synchronization times for common provisioning scenarios. In these scenarios, the source system is Azure AD and the target system is a SaaS application. The sync times are derived from a statistical analysis of sync jobs for the SaaS applications ServiceNow, Workplace, Salesforce, and G Suite.


| Scope configuration | Users, groups, and members in scope | Initial sync time | Incremental sync time |
| -------- | -------- | -------- | -------- |
| Sync assigned users and groups only |  < 1,000 |  < 30 minutes | < 30 minutes |
| Sync assigned users and groups only |  1,000 - 10,000 | 142 - 708 minutes | < 30 minutes |
| Sync assigned users and groups only |   10,000 - 100,000 | 1,170 - 2,340 minutes | < 30 minutes |
| Sync all users and groups in Azure AD |  < 1,000 | < 30 minutes  | < 30 minutes |
| Sync all users and groups in Azure AD |  1,000 - 10,000 | < 30 - 120 minutes | < 30 minutes |
| Sync all users and groups in Azure AD |  10,000 - 100,000  | 713 - 1,425 minutes | < 30 minutes |
| Sync all users in Azure AD|  < 1,000  | < 30 minutes | < 30 minutes |
| Sync all users in Azure AD | 1,000 - 10,000  | 43 - 86 minutes | < 30 minutes |


For the configuration **Sync assigned user and groups only**, you can use the following formulas to determine the approximate minimum and maximum expected **initial sync** times:

	Minimum minutes =  0.01 x [Number of assigned users, groups, and group members]
	Maximum minutes = 0.08 x [Number of assigned users, groups, and group members] 
	
Summary of factors that influence the time it takes to complete an **initial sync**:

- The total number of users and groups in scope for provisioning.

- The total number of users, groups, and group members present in the source system (Azure AD).

- Whether users in scope for provisioning are matched to existing users in the target application, or need to be created for the first time. Sync jobs for which all users are created for the first time take about *twice as long* as sync jobs for which all users are matched to existing users.

- Number of errors in the [audit logs](check-status-user-account-provisioning.md). Performance is slower if there are many errors and the provisioning service has gone into a quarantine state.	

- Request rate limits and throttling implemented by the target system. Some target systems implement request rate limits and throttling, which can impact performance during large sync operations. Under these conditions, an app that receives too many requests too fast might slow its response rate or close the connection. To improve performance, the connector needs to adjust by not sending the app requests faster than the app can process them. Provisioning connectors built by Microsoft make this adjustment. 

- The number and sizes of assigned groups. Syncing assigned groups takes longer than syncing users. Both the number and the sizes of the assigned groups impact performance. If an application has [mappings enabled for group object sync](customize-application-attributes.md#editing-group-attribute-mappings), group properties such as group names and memberships are synced in addition to users. These additional syncs will take longer than only syncing user objects.

## Next steps
[Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-app-provisioning)
