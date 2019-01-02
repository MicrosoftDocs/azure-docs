---
title: Problem signing in to the access panel website | Microsoft Docs
description: Guidance to troubleshoot issues you may encounter while trying to sign in to use the Access Panel
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
ms.topic: article
ms.date: 07/11/2017
ms.author: barbkess
ms.reviwer: japere,asteen
---

# Problem signing in to the access panel website

The Access Panel is a web-based portal that enables a user who has a work or school account in Azure Active Directory (Azure AD) to view and launch cloud-based applications that the Azure AD administrator has granted them access to. A user who has Azure AD editions can also use self-service group and app management capabilities through the Access Panel. The Access Panel is separate from the Azure portal and does not require users to have an Azure subscription.

Users can sign in to the Access Panel if they have a work or school account in Azure AD.

-   Users can be authenticated by Azure AD directly.

-   Users can be authenticated by using Active Directory Federation Services (AD FS).

-   Users can be authenticated by Windows Server Active Directory.

If a user has a subscription for Azure or Office 365 and has been using the Azure portal or an Office 365 application, they'll be able to use the Access Panel seamlessly without needing to sign in again. Users who are not authenticated are prompted to sign in by using the username and password for their account in Azure AD. If the organization has configured federation, typing the username is sufficient.

## General issues to check first 

-   Make sure the user is signing in to the **correct URL**: <https://myapps.microsoft.com>

-   Make sure the user’s browser has added the URL to its **trusted sites**

-   Make sure the user’s account is **enabled** for sign-ins.

-   Make sure the user’s account is **not locked out.**

-   Make sure the user’s **password is not expired or forgotten.**

-   Make sure **Multi-Factor Authentication** is not blocking user access.

-   Make sure a **Conditional Access policy** or **Identity Protection** policy is not blocking user access.

-   Make sure that a user’s **authentication contact info** is up-to-date to allow Multi-Factor Authentication or Conditional Access policies to be enforced.

-   Make sure to also try clearing your browser’s cookies and trying to sign in again.

## Meeting browser requirements for the Access Panel

The Access Panel requires a browser that supports JavaScript and has CSS enabled. To use password-based single sign-on (SSO) in the Access Panel, the Access Panel extension must be installed in the user’s browser. This extension is downloaded automatically when a user selects an application that is configured for password-based SSO.

For password-based SSO, the end user’s browsers can be:

-   Internet Explorer 8, 9, 10, 11 -- on Windows 7 or later

-   Edge on Windows 10 Anniversary Edition or later 

-   Chrome -- on Windows 7 or later, and on MacOS X or later

-   Firefox 26.0 or later -- on Windows XP SP2 or later, and on Mac OS X 10.6 or later


## Problems with the user’s account

Access to the Access Panel can be blocked due to a problem with the user’s account. Following are some ways you can troubleshoot and solve problems with users and their account settings:

-   [Check if a user account exists in Azure Active Directory](#check-if-a-user-account-exists-in-azure-active-directory)

-   [Check a user’s account status](#check-a-users-account-status)

-   [Reset a user’s password](#reset-a-users-password)

-   [Enable self-service password reset](#enable-self-service-password-reset)

-   [Check a user’s multi-factor authentication status](#check-a-users-multi-factor-authentication-status)

-   [Check a user’s authentication contact info](#check-a-users-authentication-contact-info)

-   [Check a user’s group memberships](#check-a-users-group-memberships)

-   [Check a user’s assigned licenses](#check-a-users-assigned-licenses)

-   [Assign a user a license](#assign-a-user-a-license)

### Check if a user account exists in Azure Active Directory

To check if a user’s account is present, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  Check the properties of the user object to be sure that they look as you expect and no data is missing.

### Check a user’s account status

To check a user’s account status, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  click **Profile**.

8.  Under **Settings** ensure that **Block sign in** is set to **No**.

### Reset a user’s password

To reset a user’s password, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  click the **Reset password** button at the top of the user pane.

8.  click the **Reset password** button on the **Reset password** pane that appears.

9.  Copy the **temporary password** or **enter a new password** for the user.

10. Communicate this new password to the user, they be required to change this password during their next sign-in to Azure Active Directory.

### Enable self-service password reset

To enable self-service password reset, follow these deployment steps:

-   [Enable users to reset their Azure Active Directory passwords](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-getting-started#enable-users-to-reset-their-azure-ad-passwords)

-   [Enable users to reset or change their Active Directory on-premises passwords](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-getting-started#enable-users-to-reset-or-change-their-ad-passwords)

### Check a user’s multi-factor authentication status

To check a user’s multi-factor authentication status, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  click the **Multi-Factor Authentication** button at the top of the pane.

7.  Once the **Multi-Factor Authentication Administration Portal** loads, ensure you are on the **Users** tab.

8.  Find the user in the list of users by searching, filtering, or sorting.

9.  Select the user from the list of users and **Enable**, **Disable**, or **Enforce** multi-factor authentication as desired.

   >[!NOTE]
   >If a user is in an **Enforced** state, you may set them to **Disabled** temporarily to let them back into their account. Once they are back in, you can then change their state to **Enabled** again to require them to re-register their contact information during their next sign-in. Alternatively, you can follow the steps in the [Check a user’s authentication contact info](#check-a-users-authentication-contact-info) to verify or set this data for them.
   >
   >

### Check a user’s authentication contact info

To check a user’s authentication contact info used for Multi-factor authentication, Conditional Access, Identity Protection, and Password Reset, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  click **Profile**.

8.  Scroll down to **Authentication contact info**.

9.  **Review** the data registered for the user and update as needed.

### Check a user’s group memberships

To check a user’s group memberships, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  click **Groups** to see which groups the user is a member of.

### Check a user’s assigned licenses

To check a user’s assigned licenses, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  click **Licenses** to see which licenses the user currently has assigned.

### Assign a user a license 

To assign a license to a user, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  click **Licenses** to see which licenses the user currently has assigned.

8.  click the **Assign** button.

9.  Select **one or more products** from the list of available products.

10. **Optional** click the **assignment options** item to granularly assign products. Click **Ok** when this is completed.

11. Click the **Assign** button to assign these licenses to this user.

## If these troubleshooting steps do not resolve the issue

open a support ticket with the following information if available:

-   Correlation error ID

-   UPN (user email address)

-   Tenant ID

-   Browser type

-   Time zone and time/timeframe during error occurs

-   Fiddler traces

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)
