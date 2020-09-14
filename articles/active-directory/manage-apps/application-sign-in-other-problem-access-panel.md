---
title: Troubleshoot problems signing in to an application from Azure AD My Apps
description: Troubleshoot problems signing in to an application from Azure AD My Apps
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 07/11/2017
ms.author: kenwith
ms.reviewer: japere
---

# Troubleshoot problems signing in to an application from Azure AD My Apps

My Apps is a web-based portal that enables a user with a work or school account in Azure Active Directory (Azure AD) to view and start cloud-based applications that the Azure AD administrator has granted them access to. 

To learn more about using Azure AD as an identity provider for an app, see the [What is Application Management in Azure AD](what-is-application-management.md). To get up to speed quickly, check out the [Quickstart Series on Application Management](view-applications-portal.md).

These applications are configured on behalf of the user in the Azure AD portal. The application must be configured properly and assigned to the user or a group the user is a member of to see the application in My Apps. 

The type of apps a user may be seeing fall in the following categories:
-   Microsoft 365 and Office 365 Applications
-   Microsoft and third-party applications configured with federation-based SSO
-   Password-based SSO applications
-   Applications with existing SSO solutions

Here are some things to check if an app is appearing or not appearing.
- Make sure the app is added to Azure AD and make sure the user is assigned. To learn more, see the [Quickstart Series on Application Management](view-applications-portal.md).
- If an app was recently added, have the user sign out and back in again. 
- If the app requires a license, such as Office, then make sure the user is assigned the appropriate license.
- The time it takes for licensing changes can vary depending on the size and complexity of the group.

## General issues to check first

-   Make sure the web browser meets the requirements, see [My Apps supported browsers](../user-help/my-apps-portal-end-user-access.md).
-   Make sure the user’s browser has added the URL of the application to its **trusted sites**.
-   Make sure to check the application is **configured** correctly.
-   Make sure the user’s account is **enabled** for sign-ins.
-   Make sure the user’s account is **not locked out.**
-   Make sure the user’s **password is not expired or forgotten.**
-   Make sure **Multi-Factor Authentication** is not blocking user access.
-   Make sure a **Conditional Access policy** or **Identity Protection** policy is not blocking user access.
-   Make sure that a user’s **authentication contact info** is up to date to allow Multi-Factor Authentication or Conditional Access policies to be enforced.
-   Make sure to also try clearing your browser’s cookies and trying to sign in again.

## Problems with the user’s account
Access to My Apps can be blocked due to a problem with the user’s account. Following are some ways you can troubleshoot and solve problems with users and their account settings:
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
2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4.  Select **Users and groups** in the navigation menu.
5.  Select **All users**.
6.  **Search** for the user you are interested in and **select the row** to select.
7.  Check the properties of the user object to be sure that they look as you expect and no data is missing.

### Check a user’s account status
To check a user’s account status, follow these steps:
1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4.  Select **Users and groups** in the navigation menu.
5.  Select **All users**.
6.  **Search** for the user you are interested in and **select the row** to select.
7.  Select **Profile**.
8.  Under **Settings** ensure that **Block sign in** is set to **No**.

### Reset a user’s password
To reset a user’s password, follow these steps:
1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4.  Select **Users and groups** in the navigation menu.
5.  Select **All users**.
6.  **Search** for the user you are interested in and **select the row** to select.
7.  Select the **Reset password** button at the top of the user pane.
8.  Select the **Reset password** button on the **Reset password** pane that appears.
9.  Copy the **temporary password** or **enter a new password** for the user.
10. Communicate this new password to the user, they be required to change this password during their next sign-in to Azure Active Directory.

### Enable self-service password reset
To enable self-service password reset, follow these deployment steps:
-   [Enable users to reset their Azure Active Directory passwords](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-getting-started)
-   [Enable users to reset or change their Active Directory on-premises passwords](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-getting-started)

### Check a user’s multi-factor authentication status
To check a user’s multi-factor authentication status, follow these steps:
1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2. Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4. Select **Users and groups** in the navigation menu.
5. Select **All users**.
6. Select the **Multi-Factor Authentication** button at the top of the pane.
7. Once the **Multi-Factor Authentication Administration Portal** loads, ensure you are on the **Users** tab.
8. Find the user in the list of users by searching, filtering, or sorting.
9. Select the user from the list of users and **Enable**, **Disable**, or **Enforce** multi-factor authentication as desired.
   >[!NOTE]
   >If a user is in an **Enforced** state, you may set them to **Disabled** temporarily to let them back into their account. Once they are back in, you can then change their state to **Enabled** again to require them to re-register their contact information during their next sign-in. Alternatively, you can follow the steps in the [Check a user’s authentication contact info](#check-a-users-authentication-contact-info) to verify or set this data for them.

### Check a user’s authentication contact info
To check a user’s authentication contact info used for Multi-factor authentication, Conditional Access, Identity Protection, and Password Reset, follow these steps:
1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4.  Select **Users and groups** in the navigation menu.
5.  Select **All users**.
6.  **Search** for the user you are interested in and **select the row** to select.
7.  Select **Profile**.
8.  Scroll down to **Authentication contact info**.
9.  **Review** the data registered for the user and update as needed.

### Check a user’s group memberships
To check a user’s group memberships, follow these steps:
1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4.  Select **Users and groups** in the navigation menu.
5.  Select **All users**.
6.  **Search** for the user you are interested in and **select the row** to select.
7.  Select **Groups** to see which groups the user is a member of.

### Check a user’s assigned licenses
To check a user’s assigned licenses, follow these steps:
1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4.  Select **Users and groups** in the navigation menu.
5.  Select **All users**.
6.  **Search** for the user you are interested in and **select the row** to select.
7.  Select **Licenses** to see which licenses the user currently has assigned.

### Assign a user a license 
To assign a license to a user, follow these steps:
1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**
2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4.  Select **Users and groups** in the navigation menu.
5.  Select **All users**.
6.  **Search** for the user you are interested in and **select the row** to select.
7.  Select **Licenses** to see which licenses the user currently has assigned.
8.  Select the **Assign** button.
9.  Select **one or more products** from the list of available products.
10. **Optional** select the **assignment options** item to granularly assign products. Select **Ok**.
11. Select the **Assign** button to assign these licenses to this user.

## Troubleshooting deep links
Deep links or User access URLs are links your users may use to access their password-SSO applications directly from their browsers URL bars. By navigating to this link, users are automatically signed into the application without having to go to My Apps first. The link is the same one that users use to access these applications from the Office 365 application launcher.

### Checking the deep link

To check if you have the correct deep link, follow these steps:
1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**
2. Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
4. Select **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.
5. Select **All Applications** to view a list of all your applications.
   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**
6. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**
7. Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
8. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.
9. Select **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.
10. Select **All Applications** to view a list of all your applications.
    * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**
11. Select the application you want the check the deep link for.
12. Find the label **User Access URL**. Your deep link should match this URL.

## Contact support
Open a support ticket with the following information if available:
-   Correlation error ID
-   UPN (user email address)
-   TenantID
-   Browser type
-   Time zone and time/timeframe during error occurs
-   Fiddler traces

## Next steps
- [Quickstart Series on Application Management](view-applications-portal.md)
