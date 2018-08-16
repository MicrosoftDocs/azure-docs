---
title: Register your personal device on your organization's network - Azure Active Directory | Microsoft Docs
description: Learn how to register your personal device on your organization's network so you can access your organization's protected resources.
services: active-directory
author: eross-msft
manager: mtillman

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.component: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 08/03/2018
ms.author: lizross
ms.reviewer: jairoc

---
# Register your personal device on your organization's network
Register your personal device, typically a phone or tablet, on your organization's network. After your device is registered, it will be able to access your organization's restricted resources.

>[!Note]
>This article uses a Windows device for demonstration purposes, but you can also register devices running iOS, Android, or macOS.

## What happens when you register your device
While you're registering your device on your organization's network, the following actions will happen:

- Windows registers your device on your organization's network.

- Optionally, based on your organization's choices, you might be asked to set up two-step verification through either [Multi-Factor Authentication](multi-factor-authentication-end-user-first-time.md) or [security info](user-help-security-info-overview.md).

- Optionally, based on your organization's choices, you might be automatically enrolled in mobile device management, such as Microsoft Intune. For more info about enrolling in Microsoft Intune, see [Enroll your device in Intune](https://docs.microsoft.com/intune-user-help/enroll-your-device-in-intune-all).

- You'll go through the sign-in process, using the username and password for your personal Microsoft account.

## To register your Windows device

Follow these steps to register your personal device on your network.

1. Open **Settings**, and then select **Accounts**.

    ![Accounts on the Settings screen](./media/user-help-register-device-on-network/register-device-settings-accounts.png)

2. Select **Email & accounts**, and then select **Join a Microsoft account**.

    ![Email & accounts and Add a Microsoft account links](./media/user-help-register-device-on-network/register-device-email-and-accounts.png)

3. On the **Add your Microsoft account** screen, type in your email address for your personal Microsoft account.

    ![Add your Microsoft account screen, with email](./media/user-help-register-device-on-network/register-device-add-accounts.png)

4. On the **Enter password** screen, type the password for your personal Microsoft account, and then select **Sign in**.

    ![Enter password screen](./media/user-help-register-device-on-network/register-device-enter-password.png)

5. Complete the rest of the registration process, including approving your identity verification request (if you use two-step verification) and setting up Windows Hello (if necessary).

## To make sure you're registered
You can make sure that you're registered by looking at your settings.

1. Open **Settings**, and then select **Accounts**.

    ![Accounts on the Settings screen](./media/user-help-register-device-on-network/register-device-settings-accounts.png)

2. Select **Email & accounts**, and make sure you see your personal Microsoft account.

    ![Access work or school screen with connected contoso account](./media/user-help-register-device-on-network/register-device-verify-account.png)

## Next steps
After you register your personal device to your organization's network, you should be able to access most of your resources.

- If your organization wants you to join your work device, see [Join your work device to your organization's network](user-help-join-device-on-network.md).



