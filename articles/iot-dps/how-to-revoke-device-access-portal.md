---
title: Disenroll or revoke device from Azure IoT Hub Device Provisioning Service 
description: How to disenroll a device to prevent provisioning through Azure IoT Hub Device Provisioning Service (DPS)
author: kgremban
ms.author: kgremban
ms.date: 01/24/2022
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
---

# How to disenroll or revoke a device from Azure IoT Hub Device Provisioning Service

Proper management of device credentials is crucial for high-profile systems like IoT solutions. A best practice for such systems is to have a clear plan of how to revoke access for devices when their credentials, whether a shared access signatures (SAS) token or an X.509 certificate, might be compromised.

Enrollment in the Device Provisioning Service enables a device to be [provisioned](about-iot-dps.md#provisioning-process). A provisioned device is one that has been registered with IoT Hub, allowing it to receive its initial [device twin](~/articles/iot-hub/iot-hub-devguide-device-twins.md) state and begin reporting telemetry data. This article describes how to revoke a device from your provisioning service instance, preventing it from being provisioned or reprovisioned again in the future. To learn how to deprovision a device that has already been provisioned to an IoT hub, see [Manage deprovisioning](how-to-unprovision-devices.md).

## Temporarily revoke a device from provisioning and reprovisioning

To disallow a device from being provisioned through Device Provisioning Service, you can change the provisioning status of an enrollment to prevent the device from provisioning and reprovisioning without deletion. You can leverage this capability if the device is behaving outside its normal parameters or is assumed to be compromised, or as a way to test out provisioning retry mechanism of your devices.

1. Sign in to the Azure portal and select **All resources** from the left menu.
2. In the list of resources, select the provisioning service that you want to disallow your device from.
3. In your provisioning service, select **Manage enrollments**, and then select the **Individual Enrollments** tab.
4. Select the enrollment entry for the device that you want to disallow.

    ![Select your individual enrollment](./media/how-to-revoke-device-access-portal/select-individual-enrollment.png)

5. On your enrollment page, scroll to the bottom, and select **Disable** for the **Enable entry** switch, and then select **Save**.  

   ![Disable individual enrollment entry in the portal](./media/how-to-revoke-device-access-portal/disable-individual-enrollment.png)
   
> [!NOTE] 
> Be aware of the retry policy of devices that you revoke access for. For example, a device that has an infinite retry policy might continuously try to register with the provisioning service. That situation consumes service resources such as service operation quotas and possibly affects performance.

## Permanently disenroll the device by deleting its enrollment

If an IoT device is at the end of its device lifecycle and should no longer be allowed to provision to the IoT solution, the device enrollment should be removed from the Device Provisioning Service:

1. Sign in to the Azure portal and select **All resources** from the left menu.
2. In the list of resources, select the provisioning service that you want to disallow your device from.
3. In your provisioning service, select **Manage enrollments**, and then select the **Individual Enrollments** tab.
4. Select the check box next to the enrollment entry for the device that you want to disallow.
5. Select **Delete** at the top of the window, and then select **Yes** to confirm that you want to remove the enrollment.

   ![Delete individual enrollment entry in the portal](./media/how-to-revoke-device-access-portal/delete-individual-enrollment.png)



## Disallow an X.509 intermediate or root CA certificate by using an enrollment group

X.509 certificates are typically arranged in a certificate chain of trust. If a certificate at any stage in a chain becomes compromised, trust is broken. The certificate must be disallowed to prevent Device Provisioning Service from provisioning devices downstream in any chain that contains that certificate. To learn more about X.509 certificates and how they are used with the provisioning service, see [X.509 certificates](./concepts-x509-attestation.md#x509-certificates).

An enrollment group is an entry for devices that share a common attestation mechanism of X.509 certificates signed by the same intermediate or root CA. The enrollment group entry is configured with the X.509 certificate associated with the intermediate or root CA. The entry is also configured with any configuration values, such as twin state and IoT hub connection, that are shared by devices with that certificate in their certificate chain. To disallow the certificate, you can either disable or delete its enrollment group.

To temporarily disallow the certificate by disabling its enrollment group:

1. Sign in to the Azure portal and select **All resources** from the left menu.
2. In the list of resources, select the provisioning service that you want to disallow the signing certificate from.
3. In your provisioning service, select **Manage enrollments**, and then select the **Enrollment Groups** tab.
4. Select the enrollment group using the certificate that you want to disallow.
5. Select **Disable** on the **Enable entry** switch, and then select **Save**.  

   ![Disable enrollment group entry in the portal](./media/how-to-revoke-device-access-portal/disable-enrollment-group.png)

To permanently disallow the certificate by deleting its enrollment group:

1. Sign in to the Azure portal and select **All resources** from the left menu.
2. In the list of resources, select the provisioning service that you want to disallow your device from.
3. In your provisioning service, select **Manage enrollments**, and then select the **Enrollment Groups** tab.
4. Select the check box next to the enrollment group for the certificate that you want to disallow.
5. Select **Delete** at the top of the window, and then select **Yes** to confirm that you want to remove the enrollment group.

   ![Delete enrollment group entry in the portal](./media/how-to-revoke-device-access-portal/delete-enrollment-group.png)

After you finish the procedure, you should see your entry removed from the list of enrollment groups.  

> [!NOTE]
> If you delete an enrollment group for a certificate, devices that have the certificate in their certificate chain might still be able to enroll if an enabled enrollment group for the root certificate or another intermediate certificate higher up in their certificate chain exists.

> [!NOTE]
> Deleting an enrollment group doesn't delete the registration records for devices in the group. DPS uses the registration records to determine whether the maximum number of registrations has been reached for the DPS instance. Orphaned registration records still count against this quota. For the current maximum number of registrations supported for a DPS instance, see [Quotas and limits](about-iot-dps.md#quotas-and-limits).
>
>You may want to delete the registration records for the enrollment group before deleting the enrollment group itself. You can see and manage the registration records for an enrollment group manually on the **Registration Records** tab for the group in Azure portal. You can retrieve and manage the registration records programmatically using the [Device Registration State REST APIs](/rest/api/iot-dps/service/device-registration-state) or equivalent APIs in the [DPS service SDKs](libraries-sdks.md), or using the [az iot dps enrollment-group registration Azure CLI commands](/cli/azure/iot/dps/enrollment-group/registration).

## Disallow specific devices in an enrollment group

Devices that implement the X.509 attestation mechanism use the device's certificate chain and private key to authenticate. When a device connects and authenticates with Device Provisioning Service, the service first looks for an individual enrollment with a registration ID that matches the common name (CN) of the device (end-entity) certificate. The service then searches enrollment groups to determine whether the device can be provisioned. If the service finds a disabled individual enrollment for the device, it prevents the device from connecting. The service prevents the connection even if an enabled enrollment group for an intermediate or root CA in the device's certificate chain exists.

To disallow an individual device in an enrollment group, follow these steps:

1. Sign in to the Azure portal and select **All resources** from the left menu.
2. From the list of resources, select the provisioning service that contains the enrollment group for the device that you want to disallow.
3. In your provisioning service, select **Manage enrollments**, and then select the **Individual Enrollments** tab.
4. Select the **Add individual enrollment** button at the top.
5. Follow the appropriate step depending on whether you have the device (end-entity) certificate.

    - If you have the device certificate, on the **Add Enrollment** page select:

      **Mechanism**: X.509

      **Primary .pem or .cer file**: Upload the device certificate. For the certificate, use the signed end-entity certificate installed on the device. The device uses the signed end-entity certificate for authentication.

      **IoT Hub Device ID**: Leave this blank. For devices provisioned through X.509 enrollment groups, the device ID is set by the device certificate CN and is the same as the registration ID.

      :::image type="content" source="./media/how-to-revoke-device-access-portal/add-enrollment-x509.png" alt-text="Screenshot of properties for the disallowed device in an X.509 enrollment entry.":::

    - If you don't have the device certificate, on the **Add Enrollment** page select:

      **Mechanism**: Symmetric Key

      **Auto-generate keys**: Make sure this is selected. The keys don't matter for this scenario.

      **Registration ID**: If the device has already been provisioned, use its IoT Hub device ID. You can find this in the registration records of the enrollment group, or in the IoT hub that the device was provisioned to. If the device has not yet been provisioned, enter the device certificate CN. (In this latter case, you don't need the device certificate, but you will need to know the CN.)

      **IoT Hub Device ID**: Leave this blank. For devices provisioned through X.509 enrollment groups, the device ID is set by the device certificate CN and is the same as the registration ID.

      :::image type="content" source="./media/how-to-revoke-device-access-portal/add-enrollment-symmetric-key.png" alt-text="Screenshot of properties for the disallowed device in a symmetric key enrollment entry.":::

6. Scroll to the bottom of the **Add Enrollment** page and select **Disable** on the **Enable entry** switch, and then select **Save**.

      :::image type="content" source="./media/how-to-revoke-device-access-portal/select-disable-on-indivdual-entry.png" alt-text="Screenshot of disabled individual enrollment entry to disable device from group enrollment in the portal.":::

When you successfully create your enrollment, you should see your disabled device enrollment listed on the **Individual Enrollments** tab.

## Next steps

Disenrollment is also part of the larger deprovisioning process. Deprovisioning a device includes both disenrollment from the provisioning service, and deregistering from IoT hub. To learn about the full process, see [How to deprovision devices that were previously provisioned](how-to-unprovision-devices.md)
