---
title: Configure app passwords for Azure Multi-Factor Authentication - Azure Active Directory
description: Learn how to configure and use app passwords for legacy applications in Azure Multi-Factor Authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 05/11/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
## App passwords

Some applications, like Office 2010 or earlier and Apple Mail before iOS 11, don't support two-step verification. The apps aren't configured to accept a second verification. To use these applications, take advantage of the _app passwords_ feature. You can use an app password in place of your traditional password to allow an app to bypass two-step verification and continue working.

Modern authentication is supported for the Microsoft Office 2013 clients and later. Office 2013 clients including Outlook, support modern authentication protocols and can be enabled to work with two-step verification. After the client is enabled, app passwords aren't required for the client.

>[!NOTE]
>App passwords do not work with Conditional Access based multi-factor authentication policies and modern authentication.

### Considerations about app passwords

When using app passwords, consider the following important points:

* App passwords are only entered once per application. Users don't have to keep track of the passwords or enter them every time.
* The actual password is automatically generated and is not supplied by the user. The automatically generated password is harder for an attacker to guess and is more secure.
* There is a limit of 40 passwords per user.
* Applications that cache passwords and use them in on-premises scenarios can start to fail because the app password isn't known outside the work or school account. An example of this scenario is Exchange emails that are on-premises, but the archived mail is in the cloud. In this scenario, the same password doesn't work.
* After Multi-Factor Authentication is enabled on a user's account, app passwords can be used with most non-browser clients like Outlook and Microsoft Skype for Business. Administrative actions can't be performed by using app passwords through non-browser applications, such as Windows PowerShell. The actions can't be performed even when the user has an administrative account. To run PowerShell scripts, create a service account with a strong password and don't enable the account for two-step verification.

>[!WARNING]
>App passwords don't work in hybrid environments where clients communicate with both on-premises and cloud auto-discover endpoints. Domain passwords are required to authenticate on-premises. App passwords are required to authenticate with the cloud.

### Guidance for app password names

App password names should reflect the device on which they're used. If you have a laptop that has non-browser applications like Outlook, Word, and Excel, create one app password named **Laptop** for these apps. Create another app password named **Desktop** for the same applications that run on your desktop computer.

>[!NOTE]
>We recommend that you create one app password per device, rather than one app password per application.

### Federated or single sign-on app passwords

Azure AD supports federation, or single sign-on (SSO), with on-premises Windows Server Active Directory Domain Services (AD DS). If your organization is federated with Azure AD and you're using Azure Multi-Factor Authentication, consider the following points about app passwords.

>[!NOTE]
>The following points apply only to federated (SSO) customers.

* App passwords are verified by Azure AD, and therefore, bypass federation. Federation is actively used only when setting up app passwords.
* The Identity Provider (IdP) is not contacted for federated (SSO) users, unlike the passive flow. The app passwords are stored in the work or school account. If a user leaves the company, the user's information flows to the work or school account by using **DirSync** in real time. The disable/deletion of the account can take up to three hours to synchronize, which can delay the disable/deletion of the app password in Azure AD.
* On-premises client Access Control settings aren't honored by the app passwords feature.
* No on-premises authentication logging/auditing capability is available for use with the app passwords feature.
* Some advanced architectures require a combination of credentials for two-step verification with clients. These credentials can include a work or school account username and passwords, and app passwords. The requirements depend on how the authentication is performed. For clients that authenticate against an on-premises infrastructure, a work or school account username and password a required. For clients that authenticate against Azure AD, an app password is required.

  For example, suppose you have the following architecture:

  * Your on-premises instance of Active Directory is federated with Azure AD.
  * You're using Exchange online.
  * You're using Skype for Business on-premises.
  * You're using Azure Multi-Factor Authentication.

  In this scenario, you use the following credentials:

  * To sign in to Skype for Business, use your work or school account username and password.
  * To access the address book from an Outlook client that connects to Exchange online, use an app password.

### Allow users to create app passwords

By default, users can't create app passwords. The app passwords feature must be enabled. To give users the ability to create app passwords, use the following procedure:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, select **Azure Active Directory** > **Users**.
3. Select **Multi-Factor Authentication**.
4. Under Multi-Factor Authentication, select **service settings**.
5. On the **Service Settings** page, select the **Allow users to create app passwords to sign in to non-browser apps** option.

### Create app passwords

Users can create app passwords during their initial registration. The user has the option to create app passwords at the end of the registration process.

Users can also create app passwords after registration. For more information and detailed steps for your users, see [What are app passwords in Azure Multi-Factor Authentication?](../user-help/multi-factor-authentication-end-user-app-passwords.md)
