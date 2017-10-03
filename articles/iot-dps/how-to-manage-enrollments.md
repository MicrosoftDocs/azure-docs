---
title: How to manage device enrollments for Azure IoT Hub | Microsoft Docs
description: How to manage device enrollments for your DPS service in the Azure Portal
services: iot-dps
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 09/05/2017
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# How to manage device enrollments in the IoT Hub Device Provisioning Service

A *device enrollment* creates a record of a single device or a group of devices that may at some point register with the Azure IoT Hub Device Provisioning Service. The enrollment record contains the initial desired configuration for the device(s) as part of that enrollment, including the desired IoT hub. This article shows you how to manage device enrollments for your provisioning service.


## Create a device enrollment

There are two ways you can enroll your devices with the provisioning service:

1. An **Enrollment group** is an entry for a group of devices that share a common attestation mechanism of X.509 certificates, signed by the same root CA. We recommend using an enrollment group for a large number of devices which share a desired initial configuration, or for devices all going to the same tenant. Note that you can only enroll devices that use the X.509 attestation mechanism as *enrollment groups*. 

    You can create an enrollment group in the portal for a group of devices using the following steps.

    1. Log in to the Azure portal and click **All resources** from the left hand menu.
    2. Click the Device Provisioning service you want to enroll your device to from the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Enrollment Groups** tab.
    4. Click the **Add** button at the top, and enter the information required for the enrollment list entry. Upload the root certificate for the group of devices. 
    5. Click **Save**. On successful creation of your enrollment group, you should see the group name appear under the **Enrollment Groups** tab. 

        ![Enrollment group in the portal](./media/how-to-manage-enrollments/group-enrollment.png)

    
2. An **Individual enrollment** is an entry for a single device that may register. Individual enrollments may use either x509 certificates or SAS tokens (in a real or virtual TPM) as attestation mechanisms. We recommend using individual enrollments for devices which require unique initial configurations, or for devices which can only use SAS tokens via TPM or virtual TPM as the attestation mechanism. Individual enrollments may have the desired IoT hub device ID specified.

    You can create an individual enrollment in the portal using the following steps. 

    1. Log in to the Azure portal and click **All resources** from the left hand menu.
    2. Click the Device Provisioning service you want to enroll your device to from the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Individual Enrollments** tab.
    4. Click the **Add** button at the top. 
    5. Select the security mechanism for the device, and enter the information required for the enrollment list entry. Upload a signed certificate if your device implements X.509. 
    6. Click **Save**. On successful creation of your enrollment group, you should see your device appear under the **Individual Enrollments** tab. 

        ![Individual enrollment in the portal](./media/how-to-manage-enrollments/individual-enrollment.png)


## Update an enrollment entry
You can update an existing enrollment entry in the portal using the following steps.

1. Open your Device Provisioning service in the Azure portal and click **Manage Enrollments**. 
2. Navigate to the enrollment entry you want to modify. Click the entry, which opens a summary information about your device enrollment. 
3. On this page, you can modify items other than the security type and credentials, such as the IoT hub the device should be linked to, as well as the device ID. You may also modify the initial device twin state. 
4. Once completed, click **Save** to update your device enrollment. 

    ![Update enrollment in the portal](./media/how-to-manage-enrollments/update-enrollment.png)


## Remove a device enrollment
In cases where your device(s) do not need to be provisioned to any IoT hub, you can remove the related enrollment entry in the portal using the following steps.

1. Open your Device Provisioning service in the Azure portal and click **Manage Enrollments**. 
2. Navigate to and select the enrollment entry you want to remove. 
3. Click the **Delete** button at the top and then select **Yes** when prompted to confirm. 
5. Once the action is completed, you will see your entry removed from the list of device enrollments. 
 
    ![Remove enrollment in the portal](./media/how-to-manage-enrollments/remove-enrollment.png)



