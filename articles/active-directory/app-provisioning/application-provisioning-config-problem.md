---
title: Problem configuring user provisioning to an Azure AD Gallery app
description: How to troubleshoot common issues faced when configuring user provisioning to an application already listed in the Azure AD Application Gallery
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/03/2019
ms.author: mimart
ms.reviewer: asteen

ms.collection: M365-identity-device-management
---

# Problem configuring user provisioning


* [My application is in quarantine](#my-application-is-in-quarantine)
* [General troubleshooting tips](#general-troubleshooting-tips)
* [Unable to authorize access to the application / credentials issue](#authorization-or-credentials-issue)
* [Provisioning service does not appear to start](#provisioning-service-does-not-appear-to-start)
* [Provisioning logs say users are “skipped” and not provisioned, even though they are assigned](#provisioning-logs-say-users-are-skipped-and-not-provisioned-even-though-they-are-assigned)

## General troubleshooting tips

Once the service is configured, most insights into the operation of the service can be drawn from two places:

-   **Provisioning logs (preview)** – The [provisioning logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context) record all the operations performed by the provisioning service, including querying Azure AD for assigned users that are in scope for provisioning. Query the target app for the existence of those users, comparing the user objects between the system. Then add, update, or disable the user account in the target system based on the comparison. You can access the provisioning logs in the Azure portal by selecting **Azure Active Directory** &gt; **Enterprise Apps** &gt; **Provisioning logs (preview)** in the **Activity** section.

-   **Current status –** A summary of the last provisioning run for a given app can be seen in the **Azure Active Directory &gt; Enterprise Apps &gt; \[Application Name\] &gt;Provisioning** section. The Current Status section shows whether a provisioning cycle has started provisioning user accounts. You can watch the progress of the cycle, see how many users and groups have been provisioned, and see how many roles are created. The summary also shows if your application is in [quarantine](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-quarantine-status) and the reas why it is in quarantine. If there are any errors, details can be found in the [Provisioning logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context).

## My application is in quarantine

## Provisioning service does not appear to start

1) Navigate to the **Azure Active Directory &gt; Enterprise Apps &gt; \[Application Name\] &gt;Provisioning** section of the Azure portal and check to ensure that provisioning has been started / turned on. 
2) Check the **Provisioning logs** described above to determine what operations the service is performing, and if there are any errors. Ensure that the there are no filters set that are causing logs to be hidden. 

>[!NOTE]
>An initial cycle can take anywhere from 20 minutes to several hours, depending on the size of the Azure AD directory and the number of users in scope for provisioning. Subsequent syncs after the initial cycle be faster, as the provisioning service stores watermarks that represent the state of both systems after the initial cycle, improving performance of subsequent syncs.
>
>

## Authorization or credentials issue

In order for provisioning to work, Azure AD requires valid credentials that allow it to connect to a user management API provided by that app. If you are having issues authorizing access to your application, follow the steps below:

1) Review the app tutorial
2) Try to test connection
3) Attempt to make a request to the target app
4) Contact the application developer


## Provisioning logs say users are skipped and not provisioned even though they are assigned

When a user shows up as “skipped” in the provisioning logs, it is very important to read the extended details in the log message to determine the reason. Below are common reasons and resolutions:

- **A scoping filter has been configured** **that is filtering the user out based on an attribute value**. For more information, see [Attribute-based application provisioning with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

- **The user is “not effectively entitled”.** If you see this specific error message, it is because there is a problem with the user assignment record stored in Azure AD. To fix this issue, un-assign the user (or group) from the app, and re-assign it again. For more information, see [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

- **A required attribute is missing or not populated for a user.** An important thing to consider when setting up provisioning be to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. This includes setting the “matching property” that be used to uniquely identify and match users/groups between the two systems. For more information on this important process, see [Customizing user provisioning attribute-mappings](../app-provisioning/customize-application-attributes.md).

  * **Attribute mappings for groups:** Provisioning of the group name and group details, in addition to the members, if supported for some applications. You can enable or disable this functionality by enabling or disabling the **Mapping** for group objects shown in the **Provisioning** tab. If provisioning groups is enabled, be sure to review the attribute mappings to ensure an appropriate field is being used for the “matching ID”. This can be the display name or email alias), as the group and its members not be provisioned if the matching property is empty or not populated for a group in Azure AD.

## Next steps
[Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](user-provisioning.md)
