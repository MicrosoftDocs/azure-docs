---
title: Problem configuring user provisioning to a Microsoft Entra Gallery app
description: How to troubleshoot common issues faced when configuring user provisioning to an application already listed in the Microsoft Entra Application Gallery
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: asteen, arvinh
---

# Problem configuring user provisioning to a Microsoft Entra Gallery application

Configuring [automatic user provisioning](user-provisioning.md) for an app (where supported), requires that specific instructions be followed to prepare the application for automatic provisioning. Then you can use the Microsoft Entra admin center to configure the provisioning service to synchronize user accounts to the application.

You should always start by finding the setup tutorial specific to setting up provisioning for your application. Then follow those steps to configure both the app and Microsoft Entra ID to create the provisioning connection. A list of app tutorials can be found at [List of Tutorials on How to Integrate SaaS Apps with Microsoft Entra ID](../saas-apps/tutorial-list.md).

## How to see if provisioning is working 

Once the service is configured, most insights into the operation of the service can be drawn from two places:

-   **Provisioning logs (preview)** – The [provisioning logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context) record all the operations performed by the provisioning service, including querying Microsoft Entra ID for assigned users that are in scope for provisioning. Query the target app for the existence of those users, comparing the user objects between the system. Then add, update, or disable the user account in the target system based on the comparison. You can access the provisioning logs in the Microsoft Entra admin center by selecting **Identity** > **Applications** > **Enterprise applications** > **Provisioning logs** in the **Activity** section.

-   **Current status –** A summary of the last provisioning run for a given app can be seen in the **Identity** > **Applications** > **Enterprise applications** > \[Application Name\] > **Provisioning** section, at the bottom of the screen under the service settings. The Current Status section shows whether a provisioning cycle has started provisioning user accounts. You can watch the progress of the cycle, see how many users and groups have been provisioned, and see how many roles are created. If there are any errors, details can be found in the [Provisioning logs (../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context).

## General problem areas with provisioning to consider

Below is a list of the general problem areas that you can drill into if you have an idea of where to start.

* [Provisioning service does not appear to start](#provisioning-service-does-not-appear-to-start)
* Can’t save configuration due to app credentials not working
* [Provisioning logs say users are “skipped” and not provisioned, even though they are assigned](#provisioning-logs-say-users-are-skipped-and-not-provisioned-even-though-they-are-assigned)

## Provisioning service does not appear to start

If you set the **Provisioning Status** to be **On** in the **Identity** > **Applications** > **Enterprise applications** > [Application Name\] > **Provisioning** section of the Microsoft Entra admin center. However no other status details are shown on that page after subsequent reloads. It is likely that the service is running but has not completed an initial cycle yet. Check the **Provisioning logs** described above to determine what operations the service is performing, and if there are any errors.

>[!NOTE]
>An initial cycle can take anywhere from 20 minutes to several hours, depending on the size of the Microsoft Entra directory and the number of users in scope for provisioning. Subsequent syncs after the initial cycle be faster, as the provisioning service stores watermarks that represent the state of both systems after the initial cycle, improving performance of subsequent syncs.
>
>

## Can’t save configuration due to app credentials not working

In order for provisioning to work, Microsoft Entra ID requires valid credentials that allow it to connect to a user management API provided by that app. If these credentials don’t work, or you don’t know what they are, review the tutorial for setting up this app, described previously.

## Provisioning logs say users are skipped and not provisioned even though they are assigned

When a user shows up as “skipped” in the provisioning logs, it is very important to read the extended details in the log message to determine the reason. Below are common reasons and resolutions:

- **A scoping filter has been configured** **that is filtering the user out based on an attribute value**. For more information, see [Attribute-based application provisioning with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

- **The user is “not effectively entitled”.** If you see this specific error message, it is because there is a problem with the user assignment record stored in Microsoft Entra ID. To fix this issue, un-assign the user (or group) from the app, and re-assign it again. For more information, see [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

- **A required attribute is missing or not populated for a user.** An important thing to consider when setting up provisioning be to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Microsoft Entra ID to the application. This includes setting the “matching property” that be used to uniquely identify and match users/groups between the two systems. For more information on this important process, see [Customizing user provisioning attribute-mappings](../app-provisioning/customize-application-attributes.md).

  * **Attribute mappings for groups:** Provisioning of the group name and group details, in addition to the members, if supported for some applications. You can enable or disable this functionality by enabling or disabling the **Mapping** for group objects shown in the **Provisioning** tab. If provisioning groups is enabled, be sure to review the attribute mappings to ensure an appropriate field is being used for the “matching ID”. This can be the display name or email alias), as the group and its members not be provisioned if the matching property is empty or not populated for a group in Microsoft Entra ID.

## Next steps
[Automate User Provisioning and Deprovisioning to SaaS Applications with Microsoft Entra ID](user-provisioning.md)
