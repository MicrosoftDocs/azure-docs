---
title: Report automatic user account provisioning to SaaS applications
description: 'Learn how to check the status of automatic user account provisioning jobs, and how to troubleshoot the provisioning of individual users.'
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: how-to
ms.date: 09/09/2018
ms.author: kenwith
ms.reviewer: arvinh
---

# Tutorial: Reporting on automatic user account provisioning

Azure Active Directory (Azure AD) includes a [user account provisioning service](user-provisioning.md) that helps automate the provisioning de-provisioning of user accounts in SaaS apps and other systems, for the purpose of end-to-end identity lifecycle management. Azure AD supports pre-integrated user provisioning connectors for all of the applications and systems with user provisioning tutorials [here](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list).

This article describes how to check the status of provisioning jobs after they have been set up, and how to troubleshoot the provisioning of individual users and groups.

## Overview

Provisioning connectors are set up and configured using the [Azure portal](https://portal.azure.com), by following the [provided documentation](../saas-apps/tutorial-list.md) for the supported application. Once configured and running, provisioning jobs can be reported on using one of two methods:

* **Azure portal** - This article primarily describes retrieving report information from the [Azure portal](https://portal.azure.com), which provides both a provisioning summary report as well as detailed provisioning audit logs for a given application.
* **Audit API** - Azure Active Directory also provides an Audit API that enables programmatic retrieval of the detailed provisioning audit logs. See [Azure Active Directory audit API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/directoryaudit) for documentation specific to using this API. While this article does not specifically cover how to use the API, it does detail the types of provisioning events that are recorded in the audit log.

### Definitions

This article uses the following terms, defined below:

* **Source System** - The repository of users that the Azure AD provisioning service synchronizes from. Azure Active Directory is the source system for the majority of pre-integrated provisioning connectors, however there are some exceptions (example: Workday Inbound Synchronization).
* **Target System** - The repository of users that the Azure AD provisioning service synchronizes to. This is typically a SaaS application (examples: Salesforce, ServiceNow, G Suite, Dropbox for Business), but in some cases can be an on-premises system such as Active Directory (example: Workday Inbound Synchronization to Active Directory).

## Getting provisioning reports from the Azure portal

To get provisioning report information for a given application, start by launching the [Azure portal](https://portal.azure.com) and **Azure Active Directory** &gt; **Enterprise Apps** &gt; **Provisioning logs (preview)** in the **Activity** section. You can also browse to the Enterprise Application for which provisioning is configured. For example, if you are provisioning users to LinkedIn Elevate, the navigation path to the application details is:

**Azure Active Directory > Enterprise Applications > All applications > LinkedIn Elevate**

From here, you can access both the provisioning progress bar and the provisioning logs, described below.

## Provisioning progress bar

The [provisioning progress bar](application-provisioning-when-will-provisioning-finish-specific-user.md#view-the-provisioning-progress-bar) is visible in the **Provisioning** tab for given application. It is located in the **Current Status** section underneath **Settings**, and shows the status of the current initial or incremental cycle. This section also shows:

* The total number of users and/groups that have been synchronized and are currently in scope for provisioning between the source system and the target system.
* The last time the synchronization was run. Synchronizations typically occur every 20-40 minutes, after an [initial cycle](../app-provisioning/how-provisioning-works.md#provisioning-cycles-initial-and-incremental) has completed.
* Whether or not an [initial cycle](../app-provisioning/how-provisioning-works.md#provisioning-cycles-initial-and-incremental) has been completed.
* Whether or not the provisioning process has been placed in quarantine, and what the reason for the quarantine status is (for example, failure to communicate with target system due to invalid admin credentials).

The **Current Status** should be the first place admins look to check on the operational health of the provisioning job.

 ![Summary report](./media/check-status-user-account-provisioning/provisioning-progress-bar-section.png)

## Provisioning logs (preview)

All activities performed by the provisioning service are recorded in the Azure AD [provisioning logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context). You can access the provisioning logs in the Azure portal by selecting **Azure Active Directory** &gt; **Enterprise Apps** &gt; **Provisioning logs (preview)** in the **Activity** section. You can search the provisioning data based on the name of the user or the identifier in either the source system or the target system. For details, see [Provisioning logs (preview)](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context). 
Logged activity event types include:

## Troubleshooting

The provisioning summary report and provisioning logs play a key role helping admins troubleshoot various user account provisioning issues.

For scenario-based guidance on how to troubleshoot automatic user provisioning, see [Problems configuring and provisioning users to an application](../app-provisioning/application-provisioning-config-problem.md).

## Additional Resources

* [Managing user account provisioning for Enterprise Apps](configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
