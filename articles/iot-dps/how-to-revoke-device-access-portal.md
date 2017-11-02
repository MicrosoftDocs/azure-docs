---
title: How to manage certificate access for Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: How to revoke device access to your DPS service in the Azure Portal
services: iot-dps
keywords: 
author: JimacoMS
ms.author: v-jamebr
ms.date: 11/01/2017
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# How to manage certificate access in the Azure IoT Hub Device Provisioning Service

No matter how hard we try, we should always assume that systems can be compromised (link to STRIKE resource if applicable). This article describes how to revoke access at provisioning time to devices.

Click here to read more about revoking access at the IoT Hub level (LINK that probably doesn't exist...)

> [!NOTE] Be aware of how devices that you revoke access for do retry logic. Depending on the implementation, devices might infinitely ping the provisioning service attempting to register, consuming service resources and possibly impacting performance.



## Blacklisting individual devices with individual enrollments

Individual enrollments may use either x509 certificates or SAS tokens (in a real or virtual TPM) as attestation mechanisms. To blacklist individual devices you can either disable or delete their individual enrollment entry: 

1. To temporarily blacklist the device, you can disable its enrollment entry. 

    1. Log in to the Azure portal and click **All resources** from the left hand menu.
    2. Click the Device Provisioning service you want to blacklist your device from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Individual Enrollments** tab.
    4. Click the **Registration ID** of the enrollment entry for the device you want to blacklist to open its enrollment list entry. 
    5. Click **Disable** at the bottom of the enrollment list entry, then click **Save**.  

        ![Disable individual enrollment entry in the portal](./media/how-to-revoke-device-access-portal/disable-individual-enrollment.png)
    
2. To permanently blacklist the device, you can delete its enrollment entry.

    1. Log in to the Azure portal and click **All resources** from the left hand menu.
    2. Click the Device Provisioning service you want to blacklist your device from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Individual Enrollments** tab.
    4. Check the box next to the enrollment entry for the device you want to blacklist. 
    5. Click **Delete** at the top of the window, then click **Yes** to confirm that you want to remove the enrollment. 

        ![Delete individual enrollment entry in the portal](./media/how-to-revoke-device-access-portal/delete-individual-enrollment.png)
    
    6. Once the action is completed, you will see your entry removed from the list of device enrollments.  

    

## Blacklisting individual devices in an enrollment group

DPS first looks for an individual enrollment matching a device's credentials before searching enrollment groups. DPS stops searching when it finds the first match and applies that enrollment entry. To blacklist an individual device in an enrollment group, you must create an individual enrollment entry for the device and disable it. DPS will find the disabled entry and not allow the device to connect. 

1. Follow the steps to create an **Individual Enrollment** for your device in [Create a device enrollment](./how-to-manage-enrollments.md##create-a-device-enrollment).
2. Follow the steps to disable the enrollment entry for your device in the [Blacklisting individual devices with individual enrollments](#blacklisting-individual-devices-with-individual-enrollments) section above.

## Blacklisting a signing certificate

An **Enrollment group** is an entry for a group of devices that share a common attestation mechanism of X.509 certificates, signed by the same root CA. To blacklist a signing certificate, you can either disable or delete its enrollment group:

1. To temporarily blacklist the signing certificate, you can disable its enrollment group. 

    1. Log in to the Azure portal and click **All resources** from the left hand menu.
    2. Click the Device Provisioning service you want to blacklist the signing certificate from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Enrollment Groups** tab.
    4. Click the **Registration ID** of the enrollment group for the certificate you want to blacklist to open its enrollment list entry. 
    5. Click **Disable** at the bottom of the enrollment list entry, then click **Save**.  

        ![Disable enrollment group entry in the portal](./media/how-to-revoke-device-access-portal/disable-individual-enrollment.png)

    
2. To permanently blacklist the signing certificate, you can delete its enrollment group.

    1. Log in to the Azure portal and click **All resources** from the left hand menu.
    2. Click the Device Provisioning service you want to blacklist your device from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Enrollment Groups** tab.
    4. Check the box next to the the enrollment group for the certificate you want to blacklist. 
    5. Click **Delete** at the top of the window, then click **Yes** to confirm that you want to remove the enrollment group. 

        ![Delete enrollment group entry in the portal](./media/how-to-revoke-device-access-portal/delete-individual-enrollment.png)

    6. Once the action is completed, you will see your entry removed from the list of enrollment groups.  


