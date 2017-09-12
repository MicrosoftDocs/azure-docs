---
title: Set up Azure Active Directory joined devices | Microsoft Docs
description: Learn how to set up Azure Active Directory joined devices.
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
ms.date: 08/29/2017
ms.author: markvi
ms.reviewer: jairoc

---
# Set up Azure Active Directory joined devices

With device management in Azure Active Directory (Azure AD), you can ensure that your users are accessing your resources from devices that meet your standards for security and compliance. For more information, see [Introduction to device management in Azure Active Directory](device-management-introduction.md).

If you want to bring work-owned Windows 10 devices under the control of Azure AD, you can accomplish this by configuring Azure AD joined devices. This topic provides you with the related steps. 


## Prerequisites

To join a Windows 10 device, the device registration service must be configured to enable you to register devices. In addition to having permission to joining devices in your Azure AD tenant, you must have fewer devices registered than the configured maximum. For more information, see [configure device settings](device-management-azure-portal.md#configure-device-settings).



## What you should know


- Windows joins the device in the organization’s directory in Azure AD.

- You might be required to go through multi-factor authentication challenge. This challenge is configurable by your IT administrator.

- Azure AD checks whether the device requires mobile device management enrollment and enrolls it if applicable.

- If you are a managed user, Windows takes you to the desktop through the automatic sign-in.

- If you are a federated user, you have to sign-in using your credentials.


## Joining a device

This section provides you with the steps to join your Windows 10 device to your Azure AD. If you have successfully joined your device to Azure AD, your **Access work or school** dialog indicates this with a **Connected to \<your Azure AD\>** entry.

![Connected](./media/device-management-azuread-joined-devices-setup/13.png)


**To join your Windows 10 device:**

1. In the **Start** menu, click **Settings**.

    ![Settings](./media/device-management-azuread-joined-devices-setup/01.png)

2. Click **Accounts**.

    ![Accounts](./media/device-management-azuread-joined-devices-setup/02.png)


3. Click **Access work or school**.

    ![Access work or school](./media/device-management-azuread-joined-devices-setup/03.png)

4. On the **Access work or school** dialog, click **Connect**.

    ![Connect](./media/device-management-azuread-joined-devices-setup/04.png)


5. On the  **Setup a work or school account** dialog, click **Join this device to Azure Active Directory**.

    ![Connect](./media/device-management-azuread-joined-devices-setup/08.png)


6. On the **Let's get you signed in** dialog, enter your account name (for example, someone@example.com), and then click **Next**.

    ![Let's get you signed in](./media/device-management-azuread-joined-devices-setup/10.png)


6. On the  **Enter password** dialog, enter your password, and then click **Sign in**.

    ![Enter password](./media/device-management-azuread-joined-devices-setup/05.png)


7. On the  **Make sure this is your organization** dialog, click **Join**.

    ![Make sure this is your organization](./media/device-management-azuread-joined-devices-setup/11.png)


8. On the **You're all set** dialog, click **Done**.

    ![You're all set](./media/device-management-azuread-joined-devices-setup/12.png)

## Verification

To verify whether a device is joined to an Azure AD, you can review the **Access work or school** dialog on your device.

![Connected](./media/device-management-azuread-joined-devices-setup/13.png)

Alternatively, you can run the following command: `dsregcmd /status`  
On a successfully joined device, **AzureAdJoined** is **Yes**.

![Connected](./media/device-management-azuread-joined-devices-setup/14.png)

You can also review device settings on the Azure AD portal.

![Connected](./media/device-management-azuread-joined-devices-setup/15.png)

For more information, see [locate devices](device-management-azure-portal.md#locate-devices).


## Next steps

For more information, see: 

- The [introduction to device management in Azure Active Directory](device-management-introduction.md)
- [Managing devices using the Azure portal](device-management-azure-portal.md)
- 



