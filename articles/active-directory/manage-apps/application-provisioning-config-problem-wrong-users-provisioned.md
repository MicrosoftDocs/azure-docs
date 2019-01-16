---
title: Wrong set of users are being provisioned to an Azure AD Gallery application | Microsoft Docs
description: Learn how to find out why a different set of users are being provisioned to an application than those you expected
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/20/2018
ms.author: barbkess
ms.reviewer: asteen

---

# Wrong set of users are being provisioned to an Azure AD Gallery application

Which users are provisioned to the app is primarily driven by which users and groups have been **assigned** to the application.

Use the following resources to learn how to check which users and groups have been assigned to an application within Azure Active Directory.

## Assign a user directly as an administrator

To assign one or more users to an application directly, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to assign a user to from the list.

7.  Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8.  To open the **Add Assignment** pane, click the **Add** button on top of the **Users and Groups** list.

9.  click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full name** or **email address** of the user you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **user** in the list to reveal a **checkbox**. Click the checkbox next to the user’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one user**, type in another **full name** or **email address** into the **Search by name or email address** search box, and click the checkbox to add this user to the **Selected** list.

13. When you are finished selecting users, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the users you have selected.

15. Click the **Assign** button to assign the application to the selected users.

If provisioning is configured and already running for an app, new users should be provisioned to an application in approximately 10 minutes. Check the **Audit Logs** for details.

## Assign a group directly to an application as an administrator

To assign one or more groups to an application directly, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to assign a user to from the list.

7.  Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8.  To open the **Add Assignment** pane, click the **Add** button on top of the **Users and Groups** list.

9.  click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full group name** of the group you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **group** in the list to reveal a **checkbox**. Click the checkbox next to the group’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one group**, type in another **full group name** into the **Search by name or email address** search box, and click the checkbox to add this group to the **Selected** list.

13. When you are finished selecting groups, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the groups you have selected.

15. Click the **Assign** button to assign the application to the selected groups.

If provisioning is configured and already running for an app, new users contained within the group should be provisioned to an application in approximately 10 minutes. Check the **Audit Logs** for details.

>[!IMPORTANT]
>Provisioning of the group name and group details, in addition to the members, if supported for some applications. You can enable or disable this functionality by enabling or disabling the **Mapping** for group objects shown in the **Provisioning** tab. 
>
>

If provisioning groups is enabled, be sure to review the attribute mappings to ensure an appropriate field is being used for the “matching ID”. This matching ID can be the display name or email alias. The group and its members are not provisioned if the matching property is empty or not populated for a group in Azure AD.

## Next steps
[Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](user-provisioning.md)
