---
title: Problem configuring user provisioning to an Azure AD Gallery application | Microsoft Docs
description: How to troubleshoot common issues faced when configuring user provisioning to an application already listed in the Azure AD Application Gallery
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
ms.date: 07/11/2017
ms.author: mimart
ms.reviewer: asteen

ms.collection: M365-identity-device-management
---

# Problem configuring user provisioning to an Azure AD Gallery application

Configuring [automatic user provisioning](https://docs.microsoft.com/azure/active-directory/active-directory-saas-app-provisioning) for an app (where supported), requires that specific instructions be followed to prepare the application for automatic provisioning. Then you can use the Azure portal to configure the provisioning service to synchronize user accounts to the application.

You should always start by finding the setup tutorial specific to setting up provisioning for your application. Then follow those steps to configure both the app and Azure AD to create the provisioning connection. A list of app tutorials can be found at [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list).

## How to see if provisioning is working 

Once the service is configured, most insights into the operation of the service can be drawn from two places:

-   **Audit logs** – The provisioning audit logs record all the operations performed by the provisioning service, including querying Azure AD for assigned users that are in scope for provisioning. Query the target app for the existence of those users, comparing the user objects between the system. Then add, update, or disable the user account in the target system based on the comparison. The provisioning audit logs can be accessed in the Azure portal, in the **Azure Active Directory &gt; Enterprise Apps &gt; \[Application Name\] &gt; Audit Logs** tab. Filter the logs on the **Account Provisioning** category to only see the provisioning events for that app.

-   **Provisioning status –** A summary of the last provisioning run for a given app can be seen in the **Azure Active Directory &gt; Enterprise Apps &gt; \[Application Name\] &gt;Provisioning** section, at the bottom of the screen under the service settings. This section summarizes how many users (and/or groups) are currently being synchronized between the two systems, and if there are any errors. Error details be in the audit logs. Note that the provisioning status not be populated until one full initial synchronization has been completed between Azure AD and the app.

## General problem areas with provisioning to consider

Below is a list of the general problem areas that you can drill into if you have an idea of where to start.

* [Provisioning service does not appear to start](#provisioning-service-does-not-appear-to-start)
* Can’t save configuration due to app credentials not working
* [Audit logs say users are “skipped” and not provisioned, even though they are assigned](#audit-logs-say-users-are-skipped-and-not-provisioned-even-though-they-are-assigned)

## Provisioning service does not appear to start

If you set the **Provisioning Status** to be **On** in the **Azure Active Directory &gt; Enterprise Apps &gt; \[Application Name\] &gt;Provisioning** section of the Azure portal. However no other status details are shown on that page after subsequent reloads. It is likely that the service is running but has not completed an initial synchronization yet. Check the **Audit logs** described above to determine what operations the service is performing, and if there are any errors.

>[!NOTE]
>An initial sync can take anywhere from 20 minutes to several hours, depending on the size of the Azure AD directory and the number of users in scope for provisioning. Subsequent syncs after the initial sync be faster, as the provisioning service stores watermarks that represent the state of both systems after the initial sync, improving performance of subsequent syncs.
>
>

## Can’t save configuration due to app credentials not working

In order for provisioning to work, Azure AD requires valid credentials that allow it to connect to a user management API provided by that app. If these credentials don’t work, or you don’t know what they are, review the tutorial for setting up this app, described previously.

## Audit logs say users are skipped and not provisioned even though they are assigned

When a user shows up as “skipped” in the audit logs, it is very important to read the extended details in the log message to determine the reason. Below are common reasons and resolutions:

- **A scoping filter has been configured** **that is filtering the user out based on an attribute value**. For more information on scoping filters, see <https://docs.microsoft.com/azure/active-directory/active-directory-saas-scoping-filters>.

- **The user is “not effectively entitled”.** If you see this specific error message, it is because there is a problem with the user assignment record stored in Azure AD. To fix this issue, un-assign the user (or group) from the app, and re-assign it again. For more information on assignment, see <https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal>.

- **A required attribute is missing or not populated for a user.** An important thing to consider when setting up provisioning be to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. This includes setting the “matching property” that be used to uniquely identify and match users/groups between the two systems. For more information on this important process, see <https://docs.microsoft.com/azure/active-directory/active-directory-saas-customizing-attribute-mappings>.

  * **Attribute mappings for groups:** Provisioning of the group name and group details, in addition to the members, if supported for some applications. You can enable or disable this functionality by enabling or disabling the **Mapping** for group objects shown in the **Provisioning** tab. If provisioning groups is enabled, be sure to review the attribute mappings to ensure an appropriate field is being used for the “matching ID”. This can be the display name or email alias), as the group and its members not be provisioned if the matching property is empty or not populated for a group in Azure AD.

## Next steps
[Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](user-provisioning.md)
