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

# How to revoke device access to your Device Provisioning Service instance in the Azure Portal

Proper certificate management is crucial for high-profile systems like IoT solutions. A best practice for such systems is to have a clear plan of how to revoke access for devices in cases where their certificates may be compromised. This article describes how to revoke device access at the provisioning step.

To learn about revoking device access to an IoT hub after the device has been provisioned. see [Disable Devices](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-identity-registry#disable-devices).

> [!NOTE] 
> Be aware of how devices that you revoke access for implement retry logic. For example, some devices might infinitely ping the provisioning service attempting to register, consuming service resources and possibly impacting performance.



## Blacklist devices with an individual enrollment

Individual enrollments may use either X.509 certificates or SAS tokens (in a real or virtual TPM) as attestation mechanisms. To blacklist individual devices, you can either disable or delete their individual enrollment entry: 

- To temporarily blacklist the device, you can disable its enrollment entry. 

    1. Log in to the Azure portal and click **All resources** from the left-hand menu.
    2. Click the Device Provisioning Service you want to blacklist your device from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Individual Enrollments** tab.
    4. Click the enrollment entry for the device you want to blacklist to open it. 
    5. Click **Disable** at the bottom of the enrollment list entry, then click **Save**.  

        ![Disable individual enrollment entry in the portal](./media/how-to-revoke-device-access-portal/disable-individual-enrollment.png)
    
- To permanently blacklist the device, you can delete its enrollment entry.

    1. Log in to the Azure portal and click **All resources** from the left-hand menu.
    2. Click the Device Provisioning Service you want to blacklist your device from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Individual Enrollments** tab.
    4. Check the box next to the enrollment entry for the device you want to blacklist. 
    5. Click **Delete** at the top of the window, then click **Yes** to confirm that you want to remove the enrollment. 

        ![Delete individual enrollment entry in the portal](./media/how-to-revoke-device-access-portal/delete-individual-enrollment.png)
    
    6. Once the action is completed, you will see your entry removed from the list of device enrollments.  

    

## Blacklist specific devices in an enrollment group

The Device Provisioning Service first looks for an individual enrollment matching a device's credentials before searching enrollment groups. The provisioning service stops searching when it finds the first match. If the service finds a disabled individual enrollment for the device, it prevents the device from connecting, even if an enabled enrollment group for the device's signing certificate exists. To blacklist an individual device in an enrollment group, follow these steps:

1. Log in to the Azure portal and click **All resources** from the left hand menu.
2. From the list of resources, click the Device Provisioning Service that contains the enrollment group for the device you want to blacklist.
3. In your provisioning service, click **Manage enrollments**, then select **Individual Enrollments** tab.
4. Click the **Add** button at the top. 
5. Select `**X.509** as the security mechanism for the device and upload the signed certificate used by the device.
6. Enter the **IoT Hub device ID** for the device. (This device ID should match the device ID used for the device in the enrollment group.)
7. To disable the enrollment entry, select **Disable** on the **Enable entry** switch. 
8. Click **Save**. On successful creation of your enrollment, you should see your device appear under the **Individual Enrollments** tab. 

    ![Disable individual enrollment entry in the portal](./media/how-to-revoke-device-access-portal/disable-individual-enrollment.png)

## Blacklist a signing certificate (enrollment group)

Using signing certificates to produce leaf (device) certificates is an excellent way to scale production and simplify device provisioning. An enrollment group is an entry for devices that share a common attestation mechanism of X.509 certificates signed by the same root certificate authority (CA), as well as the same initial configuration. To blacklist a signing certificate, you can either disable or delete its enrollment group:

- To temporarily blacklist the signing certificate, you can disable its enrollment group. 

    1. Log in to the Azure portal and click **All resources** from the left-hand menu.
    2. Click the Device Provisioning Service you want to blacklist the signing certificate from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Enrollment Groups** tab.
    4. Click the enrollment group for the certificate you want to blacklist to open it.
    5. Click **Edit group** at the top-left of the enrollment group entry.
    6. To disable the enrollment entry, select **Disable** on the **Enable entry** switch, then click **Save**.  

        ![Disable enrollment group entry in the portal](./media/how-to-revoke-device-access-portal/disable-enrollment-group.png)

    
- To permanently blacklist the signing certificate, you can delete its enrollment group.

    1. Log in to the Azure portal and click **All resources** from the left-hand menu.
    2. Click the Device Provisioning Service you want to blacklist your device from in the list of resources.
    3. In your provisioning service, click **Manage enrollments**, then select **Enrollment Groups** tab.
    4. Check the box next to the enrollment group for the certificate you want to blacklist. 
    5. Click **Delete** at the top of the window, then click **Yes** to confirm that you want to remove the enrollment group. 

        ![Delete enrollment group entry in the portal](./media/how-to-revoke-device-access-portal/delete-enrollment-group.png)

    6. Once the action is completed, you will see your entry removed from the list of enrollment groups.  


