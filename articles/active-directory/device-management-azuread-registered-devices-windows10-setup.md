---
title: How to configure Azure Active Directory registered devices | Microsoft Docs
description: Learn how to configure Azure Active Directory registered devices.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/15/2017
ms.author: markvi
ms.reviewer: jairoc

---
# How to configure Azure Active Directory registered Windows 10 devices

With device management in Azure Active Directory (Azure AD), you can ensure that your users are accessing your resources from devices that meet your standards for security and compliance. For more details, see [Introduction to device management in Azure Active Directory](device-management-introduction.md).

If you want to enable the **Bring Your Own Device (BYOD)** scenario, you can accomplish this by configuring Azure AD registered devices. In Azure AD, you can configure Azure AD registered devices for Windows 10, iOS, Android and macOS. This topic provides you with the related steps for Windows 10 devices. 


## Before you begin

To register a Windows 10 device, the device registration service must be configured to enable you to register devices. In addition to having permission to registering devices in your Azure AD tenant, you must have fewer devices registered than the configured maximum. 

## What you should know

When registering a device, you should keep the following in mind:

- Windows registers the device in the organization’s directory in Azure AD

- You might be required to go through multi-factor authentication challenge. This challenge is configurable by your IT administrator.

- Azure AD checks whether the device requires mobile device management enrollment and enrolls it if applicable.

- If you are a managed user, Windows takes you to the desktop through the automatic sign-in.

- If you are a federated user, you will be taken to a Windows sign-in screen to enter your credentials.


## Registering a device

This section provides you with the steps to register your Windows 10 device to your Azure AD.

![Register](./media/device-management-azuread-registered-devices-windows10-setup/08.png)


**To register your Windows 10 device:**

1. In the **Start** menu, click **Settings**.

    ![Settings](./media/device-management-azuread-registered-devices-windows10-setup/01.png)

2. Click **Accounts**.

    ![Accounts](./media/device-management-azuread-registered-devices-windows10-setup/02.png)


3. Click **Access work or school**.

    ![Access work or school](./media/device-management-azuread-registered-devices-windows10-setup/03.png)

4. On the **Access work or school** dialog, click **Connect**.

    ![Connect](./media/device-management-azuread-registered-devices-windows10-setup/04.png)


5. On the  **Set up a work or school account** dialog, enter your account name (e.g.: someone@example.com), and then click **Next**.

    ![Connect](./media/device-management-azuread-registered-devices-windows10-setup/06.png)


6. On the  **Enter password** dialog, enter your password, and then click **Next**.

    ![Connect](./media/device-management-azuread-registered-devices-windows10-setup/05.png)


7. On the **You're all set** dialog, click **Done**.

    ![Connect](./media/device-management-azuread-registered-devices-windows10-setup/07.png)









## Next steps

* [Introduction to device management in Azure Active Directory](device-management-introduction.md)



