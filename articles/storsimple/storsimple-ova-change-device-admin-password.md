<properties 
   pageTitle="Change the StorSimple virtual device admin password | Microsoft Azure"
   description="Describes how to use either the Azure classic portal or the StorSimple Virtual Array web UI to change the device administrator password."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="06/17/2016"
   ms.author="alkohli" />

# Change the StorSimple Virtual Array device administrator password

## Overview

When you use the Windows PowerShell interface to access the StorSimple virtual device, you are required to enter a device administrator password. When the StorSimple device is first provisioned and started, the default password is *Password1*. For the security of your data, the default password expires the first time that you sign in and you are required to change this password.

You can also use either the local web UI or the Azure classic portal to change the device administrator password at any time after the device is deployed in  your production environment. Each of these procedures is described in this article.

## Use the Azure classic portal to change the password

Perform the following steps to change the device administrator password through the Azure classic portal.

#### To change the device administrator password via the Azure classic portal

1. In the portal, click **Devices** > **Configuration** for your device.

2. Scroll down to the **Device Administrator Password** section. Provide an administrator password that contains from 8 to 15 characters. The password must be a combination of uppercase, lowercase, numeric, and special characters.

3. Confirm the password.

4. Click **Save** at the bottom of the page.

The device administrator password should now be updated. You can use this modified password to access the device locally.

## Use the StorSimple Virtual Array web UI to change the password

Perform the following steps to change the device administrator password through the local web UI.

#### To change the device administrator password via the local web UI

1. In the local web UI, click **Maintenance** > **Password change** for your device.

    ![change password1](./media/storsimple-ova-change-device-admin-password/image40.png)

2. Enter the **Current password**.

3. Provide a **New Password**. The password must be at least 8 characters long. It must contain 3 of 4 of the following: uppercase, lowercase, numeric, and special characters.

    Note that your password cannot be the same as the last 24 passwords.

3. Reenter the password to confirm it.

    ![change password2](./media/storsimple-ova-change-device-admin-password/image41.png)

4. At the bottom of the page, click **Apply**. The new password will then be applied. If the password change is not successful, you will see the following error.

    ![password error](./media/storsimple-ova-change-device-admin-password/image42.png)

    After the password is successfully updated, you will be notified. You can then use this modified password to access the device locally.

## Next steps

Learn more about [administering your StorSimple Virtual Array](storsimple-ova-web-ui-admin.md).
