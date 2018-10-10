---
title: Potential reasons for the "You can't get there from here" error message in Azure Active Directory| Microsoft Docs
description: Troubleshoot the potential reasons you're getting the "You can't get there from here" error message.
services: active-directory
author: eross-msft 
manager: mtillman

ms.assetid: 8ad0156c-0812-4855-8563-6fbff6194174
ms.service: active-directory
ms.component: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: lizross
ms.reviewer: jairoc

---
# Potential reasons for the "You can't get there from here" error message
While accessing your organization's internal web apps or sites, you might receive an error message that says, **You can't get there from here**. This message appears when your organization has put a policy in place that's conditionally preventing access to your organization's resources. While it might be necessary to contact your Helpdesk to fix this problem, there are a few things you can try first.

## Make sure you're using a supported browser
If you get the **You can't get there from here** message saying that your trying to access your organization's sites from an unsupported browser, you should check to see which browser you're running.

![Error message related to browser support](media/active-directory-conditional-access-device-remediation/02.png)

To fix this problem, you must install and run a supported browser, based on your operating system. If you're using Windows 10, the supported browsers include Microsoft Edge, Internet Explorer, and Google Chrome. If you're using a different operating system, you can check the complete list of [supported browsers](../../conditional-access/technical-reference#supported-browsers.md).

## Make sure you're using a supported version of the operating system
You must make sure that you're running a supported version of the operating system, including:

- **Windows Client.** Windows 7 or later.

- **Windows Server.** Windows Server 2008 R2 or later.

- **macOS.** macOS X or later

- **Android and iOS.** Latest version of Android and iOS mobile operating systems

## Make sure your device is joined to your organization's network
If you get the **You can't get there from here** message saying that your device is out-of-compliance with your organization's access policy, you must make sure your device is joined to your on-premises network or your cloud network.

![Error message related to browser support](media/active-directory-conditional-access-device-remediation/01.png)

### To make sure your device is joined to your on-premises network






### Is your device joined to an on-premises Active Directory?

**If your device is joined to an on-premises Active Directory in your organization:**

1. Make sure that you sign in to Windows by using your work account (your Active Directory account).
2. Connect to your corporate network via a virtual private network (VPN) or DirectAccess.
3. After you are connected, press the Windows logo key + the L key to lock your Windows session.
4. Unlock your Windows session by entering your work account credentials.
5. Wait for a minute, and then try again to access the application or service.
6. If you see the same page, click the **More details** link, and then contact your administrator with the details.


### Is your device not joined to an on-premises Active Directory?

If your device is not joined to an on-premises Active Directory and runs Windows 10, you have two options:

* Run Azure AD Join
* Add your work or school account to Windows

For information about how these options are different, see [Using Windows 10 devices in your workplace](active-directory-azureadjoin-windows10-devices.md).  
If your device:

- Belongs to your organization, you should run Azure AD Join.
- Is a personal device or a Windows phone, you should add your work or school account to Windows 



#### Azure AD Join on Windows 10

The steps to join your device to Azure AD are tied the version of Windows 10 you are running on it. To determine the version of your Windows 10 operating system, run the **winver** command: 

![Windows version](./media/active-directory-conditional-access-device-remediation/03.png )


**Windows 10 Anniversary Update (Version 1607):**

1. Open the **Settings** app.
2. Click **Accounts** > **Access work or school**.
3. Click **Connect**.
4. Click **Join this device to Azure AD**.
5. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
6. Sign out, and then sign in with your work account.
7. Try again to access the application.

**Windows 10 November 2015 Update (Version 1511):**

1. Open the **Settings** app.
2. Click **System** > **About**.
3. Click **Join Azure AD**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Sign out, and then sign in with your work account (your Azure AD account).
6. Try again to access the application.


#### Workplace Join on Windows 8.1

If your device is not domain-joined and runs Windows 8.1, to do a Workplace Join and enroll in Microsoft Intune, do the following steps:

1. Open **PC Settings**.
2. Click **Network** > **Workplace**.
3. Click **Join**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Click **Turn on**.
6. Try again to access the application.



#### Add your work or school account to Windows 


**Windows 10 Anniversary Update (Version 1607):**

1. Open the **Settings** app.
2. Click **Accounts** > **Access work or school**.
3. Click **Connect**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Try again to access the application.


**Windows 10 November 2015 Update (Version 1511):**
1. Open the **Settings** app.
2. Click **Accounts** > **Your accounts**.
3. Click **Add work or school account**.
4. Authenticate to your organization, provide multi-factor authentication if prompted, and then follow the steps that are shown.
5. Try again to access the application.

## Next steps
[Azure Active Directory conditional access](active-directory-conditional-access-azure-portal.md)