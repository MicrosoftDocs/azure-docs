---
title: No users are being provisioned to an Azure AD Gallery application | Microsoft Docs
description: How to troubleshoot common issues faced when you don't see users appearing in an an Azure AD Gallery Application you have configured for user provisioning with Azure AD
services: active-directory
documentationcenter: ''
author: ajamess
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: asteen

---


# No users are being provisioned to an Azure AD Gallery application

Once automatic provisioning has been configured for an application (including verifying that the app credentials provided to Azure AD to connect to the app are valid). Then users and/or groups are provisioned to the app and is determined by the following things:

-   Which users and groups have been **assigned** to the application. For more information on assignment, see [Assign a user or group to an enterprise app in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal).

-   Whether or not **attribute mappings** are enabled, and configured to sync valid attributes from Azure AD to the app. For more information on attribute mappings, see [Customizing User Provisioning Attribute Mappings for SaaS Applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-customizing-attribute-mappings).

-   Whether or not there is a **scoping filter** present that is filtering users based on specific attribute values. For more information on scoping filters, see [Attribute-based application provisioning with scoping filters](https://docs.microsoft.com/azure/active-directory/active-directory-saas-scoping-filters).

When observing that users are not being provisioned, consult the Audit logs in Azure AD and search for log entries for a specific user.

The provisioning audit logs can be accessed in the Azure portal, in the **Azure Active Directory &gt; Enterprise Apps &gt; \[Application Name\] &gt; Audit Logs** tab. Filter the logs on the **Account Provisioning** category to only see the provisioning events for that app. You can search for users based on the “matching ID” that was configured for them in the attribute mappings. For example, if you configured the “user principal name” or “email address” as the matching attribute on the Azure AD side, and the user not being provisioning has a value of “audrey@contoso.com”. Then search the audit logs for “audrey@contoso.com” and review then entries returned.

The provisioning audit logs record all the operations performed by the provisioning service, including querying Azure AD for assigned users that are in scope for provisioning, querying the target app for the existence of those users, comparing the user objects between the system. Then add, update, or disable the user account in the target system based on the comparison.

## General Problem Areas with Provisioning to consider

Below is a list of the general problem areas that you can drill into if you have an idea of where to start.

* [Provisioning service does not appear to start](#provisioning-service-does-not-appear-to-start)
* [Audit logs say users are skipped and not provisioned, even though they are assigned](#audit-logs-say-users-are-skipped-and-not-provisioned-even-though-they-are-assigned)

## Provisioning service does not appear to start

If you set the **Provisioning Status** to be **On** in the **Azure Active Directory &gt; Enterprise Apps &gt; \[Application Name\] &gt;Provisioning** section of the Azure portal. However no other status details are shown on that page after subsequent reloads, it is likely that the service is running but has not completed an initial synchronization yet. Check the **Audit logs** described above to determine what operations the service is performing, and if there are any errors.

>[!NOTE]
>An initial sync can take anywhere from 20 minutes to several hours, depending on the size of the Azure AD directory and the number of users in scope for provisioning. Subsequent syncs after the initial sync are faster, as the provisioning service stores watermarks that represent the state of both systems after the initial sync. This improves performance of subsequent syncs.
>
>

## Audit logs say users are skipped and not provisioned even though they are assigned

When a user shows up as “skipped” in the audit logs, it is very important to read the extended details in the log message to determine the reason. Below are common reasons and resolutions:

-   **A scoping filter has been configured** **that is filtering the user out based on an attribute value**. For more information on scoping filters, see <https://docs.microsoft.com/azure/active-directory/active-directory-saas-scoping-filters>.

-   **The user is “not effectively entitled”.** If you see this specific error message, it is because there is a problem with the user assignment record stored in Azure AD. To fix this issue, un-assign the user (or group) from the app, and re-assign it again. For more information on assignment, see  <https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal>.

-   **A required attribute is missing or not populated for a user.** An important thing to consider when setting up provisioning be to review and configure the attribute mappings and workflows that define which user (or group) properties flow from Azure AD to the application. This includes setting the “matching property” that be used to uniquely identify and match users/groups between the two systems. For more information on this important process, see [Customizing User Provisioning Attribute Mappings for SaaS Applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-customizing-attribute-mappings).

  * **Attribute mappings for groups:** Provisioning of the group name and group details, in addition to the members, if supported for some applications. You can enable or disable this functionality by enabling or disabling the **Mapping** for group objects shown in the **Provisioning** tab. If provisioning groups is enabled, be sure to review the attribute mappings to ensure an appropriate field is being used for the “matching ID”. This can be the display name or email alias), as the group and its members not be provisioned if the matching property is empty or not populated for a group in Azure AD.

## Next steps
[Azure AD Connect sync: Understanding Declarative Provisioning](active-directory-aadconnectsync-understanding-declarative-provisioning.md)

