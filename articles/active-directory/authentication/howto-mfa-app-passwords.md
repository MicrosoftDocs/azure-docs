---
title: Configure app passwords for Azure Multi-Factor Authentication - Azure Active Directory
description: Learn how to configure and use app passwords for legacy applications in Azure Multi-Factor Authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/05/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Enable and use Azure Multi-Factor Authentication with legacy applications using app passwords

Some applications, like Office 2010 or earlier and Apple Mail before iOS 11, don't support multi-factor authentication. The apps aren't configured to accept a secondary form of authentication or prompt. To use these applications in a secure way with Azure Multi-Factor Authentication enabled for user accounts, you can use app passwords. These app passwords replaced your traditional password to allow an app to bypass multi-factor authentication and work correctly.

Modern authentication is supported for the Microsoft Office 2013 clients and later. Office 2013 clients, including Outlook, support modern authentication protocols and can be enabled to work with two-step verification. After the client is enabled, app passwords aren't required for the client.

This article shows you how to enable and use app passwords for legacy applications that don't support multi-factor authentication prompts.

>[!NOTE]
> App passwords don't work with Conditional Access based multi-factor authentication policies and modern authentication.

## Overview and considerations

When a user account is enabled for Azure Multi-Factor Authentication, the regular sign-in prompt is interrupted by a request for additional verification. Some older applications don't understand this break in the sign-in process, so authentication fails. To maintain user account security and leave Azure Multi-Factor Authentication enabled, app passwords can be used instead of the user's regular username and password. When an app password used during sign-in, there's no additional verification prompt, so authentication is successful.

App passwords are automatically generated, not specified by the user. This automatically generated password makes it harder for an attacker to guess, so is more secure. Users don't have to keep track of the passwords or enter them every time as app passwords are only entered once per application.

When you use app passwords, the following considerations apply:

* There's a limit of 40 app passwords per user.
* Applications that cache passwords and use them in on-premises scenarios can fail because the app password isn't known outside the work or school account. An example of this scenario is Exchange emails that are on-premises, but the archived mail is in the cloud. In this scenario, the same password doesn't work.
* After Azure Multi-Factor Authentication is enabled on a user's account, app passwords can be used with most non-browser clients like Outlook and Microsoft Skype for Business. However, administrative actions can't be performed by using app passwords through non-browser applications, such as Windows PowerShell. The actions can't be performed even when the user has an administrative account.
    * To run PowerShell scripts, create a service account with a strong password and don't enable the account for two-step verification.

>[!WARNING]
> App passwords don't work in hybrid environments where clients communicate with both on-premises and cloud auto-discover endpoints. Domain passwords are required to authenticate on-premises. App passwords are required to authenticate with the cloud.

### App password names

App password names should reflect the device on which they're used. If you have a laptop that has non-browser applications like Outlook, Word, and Excel, create one app password named **Laptop** for these apps. Create another app password named **Desktop** for the same applications that run on your desktop computer.

It's recommended to create one app password per device, rather than one app password per application.

## Federated or single sign-on app passwords

Azure AD supports federation, or single sign-on (SSO), with on-premises Active Directory Domain Services (AD DS). If your organization is federated with Azure AD and you're using Azure Multi-Factor Authentication, the following app password considerations apply:

>[!NOTE]
> The following points apply only to federated (SSO) customers.

* App passwords are verified by Azure AD, and therefore, bypass federation. Federation is actively used only when setting up app passwords.
* The Identity Provider (IdP) is not contacted for federated (SSO) users, unlike the passive flow. The app passwords are stored in the work or school account. If a user leaves the company, the user's information flows to the work or school account by using **DirSync** in real time. The disable / deletion of the account can take up to three hours to synchronize, which can delay the disable / deletion of the app password in Azure AD.
* On-premises client Access Control settings aren't honored by the app passwords feature.
* No on-premises authentication logging or auditing capability is available with the app passwords feature.

Some advanced architectures require a combination of credentials for multi-factor authentication with clients. These credentials can include a work or school account username and passwords, and app passwords. The requirements depend on how the authentication is performed. For clients that authenticate against an on-premises infrastructure, a work or school account username and password a required. For clients that authenticate against Azure AD, an app password is required.

For example, suppose you have the following architecture:

* Your on-premises instance of Active Directory is federated with Azure AD.
* You use Exchange online.
* You use Skype for Business on-premises.
* You use Azure Multi-Factor Authentication.

In this scenario, you use the following credentials:

* To sign in to Skype for Business, use your work or school account username and password.
* To access the address book from an Outlook client that connects to Exchange online, use an app password.

## Allow users to create app passwords

By default, users can't create app passwords. The app passwords feature must be enabled before users can use them. To give users the ability to create app passwords, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for and select **Azure Active Directory**, then choose **Users**.
3. Select **Multi-Factor Authentication** from the navigation bar across the top of the *Users* window.
4. Under Multi-Factor Authentication, select **service settings**.
5. On the **Service Settings** page, select the **Allow users to create app passwords to sign in to non-browser apps** option.

    ![Screenshot of the Azure portal that shows the service settings for multi-factor authentication to allow the user of app passwords](media/concept-authentication-methods/app-password-authentication-method.png)

## Create an app password

When users complete their initial registration for Azure Multi-Factor Authentication, there's an option to create app passwords at the end of the registration process.

Users can also create app passwords after registration. For more information and detailed steps for your users, see [What are app passwords in Azure Multi-Factor Authentication?](../user-help/multi-factor-authentication-end-user-app-passwords.md)

## Next steps

For more information on how to allow users to quickly register for Azure Multi-Factor Authentication, see [Combined security information registration overview](concept-registration-mfa-sspr-combined.md).
