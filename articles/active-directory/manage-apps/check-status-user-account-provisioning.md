---
title: 'Reporting on Azure Active Directory automatic user account provisioning to SaaS applications | Microsoft Docs'
description: 'Learn how to check the status of automatic user account provisioning jobs, and how to troubleshoot the provisioning of individual users.'
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: app-mgmt
ms.devlang: na
ms.topic: conceptual
ms.date: 09/09/2018
ms.author: barbkess
ms.reviewer: asmalser
---

# Tutorial: Reporting on automatic user account provisioning


Azure Active Directory includes a [user account provisioning service](user-provisioning.md) that helps automate the provisioning de-provisioning of user accounts in SaaS apps and other systems, for the purpose of end-to-end identity lifecycle management. Azure AD supports pre-integrated user provisioning connectors for all of the applications and systems in the "Featured" section of the [Azure AD application gallery](https://azuremarketplace.microsoft.com/marketplace/apps/category/azure-active-directory-apps?page=1&subcategories=featured).

This article describes how to check the status of provisioning jobs after they have been set up, and how to troubleshoot the provisioning of individual users and groups.

## Overview

Provisioning connectors are set up and configured using the [Azure portal](https://portal.azure.com), by following the [provided documentation](../saas-apps/tutorial-list.md) for the supported application. Once configured and running, provisioning jobs can be reported on using one of two methods:

* **Azure management portal** - This article primarily describes retrieving report information from the [Azure portal](https://portal.azure.com), which provides both a provisioning summary report as well as detailed provisioning audit logs for a given application.

* **Audit API** - Azure Active Directory also provides an Audit API that enables programmatic retrieval of the detailed provisioning audit logs. See [Azure Active Directory audit API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/directoryaudit) for documentation specific to using this API. While this article does not specifically cover how to use the API, it does detail the types of provisioning events that are recorded in the audit log.

### Definitions

This article uses the following terms, defined below:

* **Source System** - The repository of users that the Azure AD provisioning service synchronizes from. Azure Active Directory is the source system for the majority of pre-integrated provisioning connectors, however there are some exceptions (example: Workday Inbound Synchronization).

* **Target System** - The repository of users that the Azure AD provisioning service synchronizes to. This is typically a SaaS application (examples: Salesforce, ServiceNow, Google Apps, Dropbox for Business), but in some cases can be an on-premises system such as Active Directory (example: Workday Inbound Synchronization to Active Directory).


## Getting provisioning reports from the Azure management portal

To get provisioning report information for a given application, start by launching the [Azure management portal](https://portal.azure.com) and browsing to the Enterprise Application for which provisioning is configured. For example, if you are provisioning users to LinkedIn Elevate, the navigation path to the application details is:

**Azure Active Directory > Enterprise Applications > All applications > LinkedIn Elevate**

From here, you can access both the Provisioning summary report, and the provisioning audit logs, both described below.


## Provisioning summary report

The provisioning summary report is visible in the **Provisioning** tab for given application. It is located in the **Synchronization Details** section underneath **Settings**, and provides the following information:

* The total number of users and/groups that have been synchronized and are currently in scope for provisioning between the source system and the target system

* The last time the synchronization was run. Synchronizations typically occur every 20-40 minutes, after an [initial synchronization](user-provisioning.md#what-happens-during-provisioning) has completed.

* Whether or not an [initial synchronization](user-provisioning.md#what-happens-during-provisioning) has been completed

* Whether or not the provisioning process has been placed in quarantine, and what the reason for the quarantine status is (for example, failure to communicate with target system due to invalid admin credentials)

The provisioning summary report should be the first place admins look to check on the operational health of the provisioning job.

 ![Summary report](./media/check-status-user-account-provisioning/summary_report.PNG)

## Provisioning audit logs
All activities performed by the provisioning service are recorded in the Azure AD audit logs, which can be viewed in the **Audit logs** tab under the **Account Provisioning** category. Logged activity event types include:

* **Import events** - An "import" event is recorded each time the Azure AD provisioning service retrieves information about an individual user or group from a source system or target system. During synchronization, users are retrieved from the source system first, with the results recorded as "import" events. The matching IDs of the retrieved users are then queried against the target system to check if they exist, with the results also recorded as "import" events. These events record all mapped user attributes and their values that were seen by the Azure AD provisioning service at the time of the event. 

* **Synchronization rule events** - These events report on the results of the attribute-mapping rules and any configured scoping filters, after user data has been imported and evaluated from the source and target systems. For example, if a user in a source system is deemed to be in scope for provisioning, and deemed to not exist in the target system, then this event records that the user will be provisioned in the target system. 

* **Export events** - An "export" event is recorded each time the Azure AD provisioning service writes a user account or group object to a target system. These events record all user attributes and their values that were written by the Azure AD provisioning service at the time of the event. If there was an error while writing the user account or group object to the target system, it will be displayed here.

* **Process escrow events** - Process escrows occur when the provisioning service encounters a failure while attempting an operation, and begins to retry the operation on a back-off interval of time. An "escrow" event is recorded each time a provisioning operation was retired.

When looking at provisioning events for an individual user, the events normally occur in this order:

1. Import event: User is retrieved from the source system.

2. Import event: Target system is queried to check for the existence of the retrieved user.

3. Synchronization rule event: User data from source and target systems are evaluated against the configured attribute-mapping rules and scoping filters to determine what action, if any, should be performed.

4. Export event: If the synchronization rule event dictated that an action should be performed (Add, Update, Delete), then the results of the action are recorded in an Export event.

![Creating an Azure AD test user](./media/check-status-user-account-provisioning/audit_logs.PNG)


### Looking up provisioning events for a specific user

The most common use case for the provisioning audit logs is to check the provisioning status of an individual user account. To look up the last provisioning events for a specific user:

1. Go to the **Audit logs** section.

2. From the **Category** menu, select **Account Provisioning**.

3. In the **Date Range** menu, select the date range you want to search,

4. In the **Search** bar, enter the user ID of the user you wish to search for. The format of ID value should match whatever you selected as the primary matching ID in the attribute-mapping configuration (for example, userPrincipalName or employee ID number). The ID value required will be visible in the Target(s) column.

5. Press Enter to search. The most recent provisioning events will be returned first.

6. If events are returned, note the activity types and whether they succeeded or failed. If no results are returned, then it means the user either does not exist, or has not yet been detected by the provisioning process if a full sync has not yet completed.

7. Click on individual events to view extended details, including all user properties that were retrieved, evaluated, or written as part of the event.

For a demonstration on how to use the audit logs, see the video below. The audit logs are presented around the 5:30 mark:

> [!VIDEO https://www.youtube.com/embed/pKzyts6kfrw]

### Tips for viewing the provisioning audit logs

For best readability in the Azure portal, select the **Columns** button and choose these columns:

* **Date** - Shows the date the event occurred.
* **Target(s)** - Shows the app name and user ID that are the subjects of the event.
* **Activity** - The activity type, as described previously.
* **Status** - Whether the event succeeded or not.
* **Status Reason** - A summary of what happened in the provisioning event.


## Troubleshooting

The provisioning summary report and audit logs play a key role helping admins troubleshoot various user account provisioning issues.

For scenario-based guidance on how to troubleshoot automatic user provisioning, see [Problems configuring and provisioning users to an application](application-provisioning-config-problem.md).


## Additional Resources

* [Managing user account provisioning for Enterprise Apps](configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](what-is-single-sign-on.md)
