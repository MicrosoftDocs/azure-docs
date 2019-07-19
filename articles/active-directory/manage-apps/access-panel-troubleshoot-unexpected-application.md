---
title: How applications appear on the access panel | Microsoft Docs
description: Troubleshoot why an application is appearing in the Access Panel
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
ms.topic: article
ms.date: 07/11/2017
ms.author: mimart
ms.reviewr: japere
ms.collection: M365-identity-device-management
---

# How applications appear on the access panel

The Access Panel is a web-based portal, which enables a user with a work or school account in Azure Active Directory (Azure AD) to view and start cloud-based applications that the Azure AD administrator has granted them access to. These applications are configured on behalf of the user in the Azure AD portal. The admin can provision the application to the user directly or to a group a user is part of resulting in the application appearing on the user’s Access Panel.

## General issues to check first

-   If an application was removed from a user or group the user is a member of, try to sign in and out again into the user’s Access Panel after a few minutes to see if the application is removed.

-   If a license was removed from a user or group the user is a member of this may take a long time, depending on the size and complexity of the group for changes to be made. Allow for extra time before signing into the Access Panel.

## Problems related to assigning applications to users

A user may be seeing an application on their Access Panel because they had been previously assigned to it. Following are some ways to check:

-   [Check if a user is assigned to the application](#check-if-a-user-is-assigned-to-the-application)

-   [Check if a user is under a license related to the application](#check-if-a-user-is-under-a-license-related-to-the-application)


### Check if a user is assigned to the application

To check if a user is assigned to the application, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

6. **Search** for the name of the application in question.

7. click **Users and groups**.

8. Check to see if your user is assigned to the application.

   * If you want to remove the user from the application, **click the row** of the user and select **delete**.

### Check if a user is under a license related to the application

To check a user’s assigned licenses, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Users and groups** in the navigation menu.

5. click **All users**.

6. **Search** for the user you are interested in and **click the row** to select.

7. click **Licenses** to see which licenses the user currently has assigned.

   * If the user is assigned to an Office license, this enables First Party Office applications to appear on the user’s Access Panel.

## Problems related to assigning applications to groups

A user may be seeing an application on their Access Panel because they are part of a group that has been assigned the application. Following are some ways to check:

-   [Check a user’s group memberships](#check-a-users-group-memberships)

-   [Check if a user is a member of a group assigned to a license](#check-if-a-user-is-a-member-of-a-group-assigned-to-a-license)

### Check a user’s group memberships

To check a group’s membership, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Users and groups** in the navigation menu.

5. click **All users**.

6. **Search** for the user you are interested in and **click the row** to select.

7. click **Groups.**

8. Check to see if your user is part of a Group assigned to the application.

   * If you want to remove the user from the group, **click the row** of the group and select delete.

### Check if a user is a member of a group assigned to a license

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Users and groups** in the navigation menu.

5. click **All users**.

6. **Search** for the user you are interested in and **click the row** to select.

7. click **Groups.**

8. click the row of a specific group.

9. click **Licenses** to see which licenses the group has assigned to it.

   * If the group is assigned to an Office license, this may enable certain First Party Office applications to appear on the user’s Access Panel.


## If these troubleshooting steps do not the resolve the issue

open a support ticket with the following information if available:

-   Correlation error ID

-   UPN (user email address)

-   Tenant ID

-   Browser type

-   Time zone and time/timeframe during error occurs

-   Fiddler traces

## Next steps
[Managing Applications with Azure Active Directory](what-is-application-management.md)
