---
title: Troubleshooting for Azure Active Directory access issues | Microsoft Docs
description: Learn steps that you can take to resolve access issues with your organization's online resources.
services: active-directory
keywords: device-based conditional access, device registration, enable device registration, device registration and MDM
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 8ad0156c-0812-4855-8563-6fbff6194174
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 11/11/2016
ms.author: markvi

---
# Troubleshooting for Azure Active Directory access issues
You try to access your organization's SharePoint Online intranet, and you get an "access denied" error message. What do you do?


This article covers remediation steps that can help you resolve access issues with your organization's online resources.

For help resolving Azure Active Directory (Azure AD) access issues, go to the section in the article that covers your device platform:

* Windows device
* iOS device (Check back soon for assistance with iPhones and iPads.)
* Android device (Check back soon for assistance with Android phones and tablets.)

## Access from a Windows device
If your device runs one of the following platforms, look in the next sections for the error message that is shown when you try to access an application or service:

* Windows 10
* Windows 8.1
* Windows 8
* Windows 7
* Windows Server 2016
* Windows Server 2012 R2
* Windows Server 2012
* Windows Server 2008 R2

### Device is not registered
If your device is not registered with Azure AD and the application is protected with a device-based policy, you might see a page that shows one of these error messages:

!["You can't get there from here" messages for unregistered devices](./media/active-directory-conditional-access-device-remediation/01.png "Scenario")

If your device is domain-joined to Active Directory in your organization, try this:

1. Make sure that you sign in to Windows by using your work account (your Active Directory account).
2. Connect to your corporate network via a virtual private network (VPN) or DirectAccess.
3. After you are connected, press the Windows logo key + the L key to lock your Windows session.
4. Enter your work account credentials to unlock your Windows session.
5. Wait for a minute, and then try again to access the application or service.
6. If you see the same page, click the **More details** link, and then contact your administrator with the details.

If your device is not domain-joined and runs Windows 10, you have two options:

* Run Azure AD Join
* Add your work or school account to Windows

For information about how these options are different, see [Using Windows 10 devices in your workplace](active-directory-azureadjoin-windows10-devices.md).

To run Azure AD Join, do the following steps for the platform your device runs on. (Azure AD Join is not available on Windows phones.)

**Windows 10 Anniversary Update**

1. Open the **Settings** app.
2. Click **Accounts** > **Access work or school**.
3. Click **Connect**.
4. Click **Join this device to Azure AD**.
5. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
6. Sign out, and then sign in with your work account.
7. Try again to access the application.

**Windows 10 November 2015 Update**

1. Open the **Settings** app.
2. Click **System** > **About**.
3. Click **Join Azure AD**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Sign out, and then sign in with your work account (your Azure AD account).
6. Try again to access the application.

To add your work or school account, do the following steps:

**Windows 10 Anniversary Update**

1. Open the **Settings** app.
2. Click **Accounts** > **Access work or school**.
3. Click **Connect**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Try again to access the application.

**Windows 10 November 2015 Update**

1. Open the **Settings** app.
2. Click **Accounts** > **Your accounts**.
3. Click **Add work or school account**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Try again to access the application.

If your device is not domain-joined and runs Windows 8.1, to do a Workplace Join and enroll in Microsoft Intune, do the following steps:

1. Open **PC Settings**.
2. Click **Network** > **Workplace**.
3. Click **Join**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Click **Turn on**.
6. Try again to access the application.

### Browser is not supported
You might be denied access if you are trying to access an application or service by using one of the following browsers:

* Chrome, Firefox, or any other browser other than Microsoft Edge or Microsoft Internet Explorer in Windows 10 or Windows Server 2016
* Firefox in Windows 8.1, Windows 7, Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2

You'll see an error page that looks like this:

!["You can't get there from here" message for unsupported browsers](./media/active-directory-conditional-access-device-remediation/02.png "Scenario")

The only remediation is to use a browser that the application supports for your device platform.

## Next steps
[Azure Active Directory conditional access](active-directory-conditional-access.md)

