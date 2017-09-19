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
ms.date: 09/14/2017
ms.author: markvi
ms.reviewer: jairoc

---

# Set up Azure Active Directory-registered Windows 10 devices

Device management in Azure Active Directory (Azure AD) can help you ensure that users access your resources from devices that meet your security and compliance standards. For more information, see [Introduction to device management in Azure Active Directory](device-management-introduction.md).

With [Azure AD registered devices](device-management-introduction.md#azure-ad-registered-devices), you can enable the the **Bring Your Own Device (BYOD)** scenario, which permits your users to access your organization's resources using personally owned devices.  

In Azure AD, you can set up Azure AD-registered devices for:

- Windows 10
- iOS
- Android
- macOS.  

This topic provides you with instructions on how to register Windows 10 devices with Azure AD. 


## Prerequisites

Before you begin, you should verify that:

- The permissions to register devices 

    ![Register](./media/device-management-azuread-registered-devices-windows10-setup/21.png)

- You have not yet exceeded yet the maximum number of devices per user 

    ![Register](./media/device-management-azuread-registered-devices-windows10-setup/22.png)

For more information, see [Configure device settings](device-management-azure-portal.md#configure-device-settings).

## What you should know

When you register a device, note the following:

- Windows registers the device in the organization’s directory in Azure AD.

- You might be required to pass a multi-factor authentication challenge. Your IT admin can set up this challenge.

- Azure AD checks whether a device requires mobile device management enrollment. It enrolls the device, if applicable.

- Windows redirects managed users to the desktop through the automatic sign-in.

- Federated users are redirected to a Windows sign-in page to enter credentials.


## Register a device

To register your Windows 10 device with Azure AD, complete the following steps. If you have successfully registered your device with Azure AD, your **Access work or school** page indicates this with a **Work or school account** entry.

![Register](./media/device-management-azuread-registered-devices-windows10-setup/08.png)


To register your Windows 10 device:

1. On the **Start** menu, click **Settings**.

    ![Select Settings](./media/device-management-azuread-registered-devices-windows10-setup/01.png)

2. Click **Accounts**.

    ![Select Accounts](./media/device-management-azuread-registered-devices-windows10-setup/02.png)


3. Click **Access work or school**.

    ![Select Access work or school](./media/device-management-azuread-registered-devices-windows10-setup/03.png)

4. On the **Access work or school** page, click **Connect**.

    ![The Access work or school page](./media/device-management-azuread-registered-devices-windows10-setup/04.png)


5. On the  **Set up a work or school account** page, enter your account name (for example, someone@example.com), and then click **Next**.

    ![The Set up a work or school account page](./media/device-management-azuread-registered-devices-windows10-setup/06.png)


6. On the  **Enter password** page, enter your password, and then click **Next**.

    ![Enter password](./media/device-management-azuread-registered-devices-windows10-setup/05.png)


7. On the **You're all set** page, click **Done**.

    ![The You're all set page](./media/device-management-azuread-registered-devices-windows10-setup/07.png)

## Verification

To verify whether a device is joined to Azure AD, check the **Access work or school** page on your device.

![Work or school account status](./media/device-management-azuread-registered-devices-windows10-setup/08.png)

Or, you can review the device settings in the Azure AD portal.

![Azure AD registered devices](./media/device-management-azuread-registered-devices-windows10-setup/09.png)


## Next steps

For more information, see: 

- The [introduction to device management in Azure Active Directory](device-management-introduction.md)

- [Managing devices using the Azure portal](device-management-azure-portal.md)




