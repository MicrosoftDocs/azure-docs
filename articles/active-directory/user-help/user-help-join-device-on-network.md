---
title: Join your work device to your organization's network - Azure Active Directory | Microsoft Docs
description: Learn how to join your work device to your organization's network.
services: active-directory
author: eross-msft
manager: mtillman

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.component: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 01/15/2018
ms.author: lizross
ms.reviewer: jairoc

---
# Join your work device to your organization's network
Join your work-owned Windows 10 device to your organization's network so you can access potentially restricted resources.

## What happens when you join your device
While you're joining your Windows 10 device to your organization's network, the following will happen:

- Windows joins your device to your organization's network.

- You might be asked to set up two-step verification through either [multi-factor authentication](multi-factor-authentication-end-user-first-time.md) or [security info](user-help-security-info-overview.md), depending on what your organization has set up.

- You'll be automatically enrolled in mobile device management, such as Microsoft Intune, if it's required. For more info about enrolling in Microsoft Intune, see [Enroll your device in Intune](https://docs.microsoft.com/en-us/intune-user-help/enroll-your-device-in-intune-all).

- You'll go through the sign-in process, using either automatic sign-in (if your organization manages your device) or by using your work or school account user name and password (if you manage your own device).

## To join a brand-new Windows 10 device
If your device is brand-new and hasn't been set up yet, you can go through the Windows Out of Box Experience (OOBE) process to join your device to the network.

1. Start up your new device and begin the OOBE process.

2. On the **Sign in with Microsoft** screen, type your work or school email address.

    ![Sign-in screen with email address](./media/user-help-join-device-on-network/join-device-oobe-signin.png)

3. On the **Enter your password** screen, type your password.

    ![Enter your password screen](./media/user-help-join-device-on-network/join-device-oobe-password.png)

4. On your mobile device, approve your device to access your account. 

    ![Mobile notification screen](./media/user-help-join-device-on-network/join-device-oobe-mobile.png)

5. Complete the OOBE process, including setting your privacy settings and setting up Windows Hello (if required).

Your device is now joined to your organization's network.

## To make sure you're joined
You can make sure that you're joined by looking at your Windows Settings.

1. Open **Settings**, and then select **Accounts**.

2. Select **Access work or school**, and make sure you see text that says something like, **Connected to *<your_organization>* Azure AD**.

    ![Access work or school screen with contoso account](./media/user-help-join-device-on-network/join-device-oobe-verify.png)


## To join an existing Windows 10 device
If you've had your device for a while and it's already been set up, you can follow these steps to join your device to the network.

1. Open **Settings**, and then select **Accounts**.

    ![Accounts on the Settings screen](./media/user-help-join-device-on-network/02.png)

2. Select **Access work or school**, and then select **Connect**.

    ![Access work or school and Connect links](./media/user-help-join-device-on-network/03.png)

3. On the **Set up a work or school account** screen, select **Join this device to Azure Active Directory**.

    ![Set up a work or school account screen](./media/user-help-join-device-on-network/04.png)

4. On the **Let's get you signed in** screen, type your email address (for example, alain@contoso.com), and then select **Next**.

    ![Let's get you signed in screen](./media/user-help-join-device-on-network/10.png)





6. On the  **Enter password** dialog, enter your password, and then click **Sign in**.

    ![Enter password](./media/user-help-join-device-on-network/05.png)


7. On the  **Make sure this is your organization** dialog, click **Join**.

    ![Make sure this is your organization](./media/user-help-join-device-on-network/11.png)


8. On the **You're all set** dialog, click **Done**.

    ![You're all set](./media/user-help-join-device-on-network/12.png)

## Make sure you're joined

To verify whether a device is joined to an Azure AD, you can review the **Access work or school** dialog on your device.

![Connected](./media/user-help-join-device-on-network/13.png)

Alternatively, you can run the following command: `dsregcmd /status`  
On a successfully joined device, **AzureAdJoined** is **Yes**.

![Connected](./media/user-help-join-device-on-network/14.png)

You can also review device settings on the Azure AD portal.

![Connected](./media/user-help-join-device-on-network/15.png)

For more information, see [locate devices](../devices/device-management-azure-portal.md#locate-devices).


## Next steps

For more information, see: 

- The [introduction to device management in Azure Active Directory](../devices/overview.md)
- [Managing devices using the Azure portal](../devices/device-management-azure-portal.md)