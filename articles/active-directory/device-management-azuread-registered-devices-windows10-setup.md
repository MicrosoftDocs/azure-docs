---
title: Set up Azure Active Directory-registered Windows 10 devices | Microsoft Docs
description: Learn how to set up Azure Active Directory-registered Windows 10 devices.
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
ms.date: 08/27/2017
ms.author: markvi
ms.reviewer: jairoc

---

# Set up Azure Active Directory-registered Windows 10 devices

Device management in Azure Active Directory (Azure AD) can help you ensure that users access your resources from devices that meet your security and compliance standards. For more information, see [Introduction to device management in Azure Active Directory](device-management-introduction.md).

To support a Bring Your Own Device (BYOD) scenario, you can accomplish your security goals by registering devices with Azure AD. In Azure AD, you can set up Azure AD-registered devices for Windows 10, iOS, Android, and macOS. In this article, we describe the steps to complete to register Windows 10 devices with Azure AD. 


## Before you begin

To register a Windows 10 device, the device registration service must be set up for registering devices. You also must have the required permissions to register devices in your Azure AD tenant. In addition, you can register only a number of devices that is smaller than the maximum specified in your Azure AD settings. For more information, see [Configure device settings](device-management-azure-portal.md#configure-device-settings).

## What you should know

When you register a device, note the following:

- Windows registers the device in the organization’s directory in Azure AD.
- You might be required to pass a multi-factor authentication challenge. Your IT admin can set up this challenge.
- Azure AD checks to determine whether the device requires mobile device management enrollment. It enrolls the device, if applicable.
- Windows redirects managed users to the desktop through the automatic sign-in.
- Federated users are redirected to a Windows sign-in page, on which the user enters their credentials.


## Register a device

To register your Windows 10 device with Azure AD, complete the following steps. If you have successfully registered your device with Azure AD, your **Access work or school** page indicates this with a **Work or school account** entry.

![Register](./media/device-management-azuread-registered-devices-windows10-setup/08.png)


To register your Windows 10 device:

1. On the **Start** menu, select **Settings**.

    ![Select Settings](./media/device-management-azuread-registered-devices-windows10-setup/01.png)

2. Select **Accounts**.

    ![Select Accounts](./media/device-management-azuread-registered-devices-windows10-setup/02.png)


3. Select **Access work or school**.

    ![Select Access work or school](./media/device-management-azuread-registered-devices-windows10-setup/03.png)

4. On the **Access work or school** page, select **Connect**.

    ![The Access work or school page](./media/device-management-azuread-registered-devices-windows10-setup/04.png)


5. On the  **Set up a work or school account** page, enter your account name (for example, someone@example.com), and then select **Next**.

    ![The Set up a work or school account page](./media/device-management-azuread-registered-devices-windows10-setup/06.png)


6. On the  **Enter password** page, enter your password, and then select **Next**.

    ![Enter password](./media/device-management-azuread-registered-devices-windows10-setup/05.png)


7. On the **You're all set** page, select **Done**.

    ![The You're all set page](./media/device-management-azuread-registered-devices-windows10-setup/07.png)

## Verification

To verify whether a device is joined to Azure AD, check the **Access work or school** page on your device.

![Work or school account status](./media/device-management-azuread-registered-devices-windows10-setup/08.png)

Or, you can view the device settings in the Azure AD portal.

![Azure AD registered devices](./media/device-management-azuread-registered-devices-windows10-setup/09.png)


## Next steps

- For more information, see the [introduction to device management in Azure Active Directory](device-management-introduction.md).

- For more information about managing devices in the Azure AD portal, see [Manage devices by using the Azure portal](device-management-azure-portal.md).




