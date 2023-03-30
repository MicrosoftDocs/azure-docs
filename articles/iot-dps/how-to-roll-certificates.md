---
title: Roll X.509 certificates in DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: How to update or replace X.509 certificates with your Azure IoT Hub Device Provisioning Service (DPS) instance
author: kgremban

ms.author: kgremban
ms.date: 03/13/2023
ms.topic: how-to
ms.service: iot-dps
---

# How to roll X.509 device certificates

During the lifecycle of your IoT solution, you'll need to roll certificates. Two of the main reasons for rolling certificates would be a security breach, and certificate expirations.

Rolling certificates is a security best practice to help secure your system in the event of a breach. As part of [Assume Breach Methodology](https://download.microsoft.com/download/C/1/9/C1990DBA-502F-4C2A-848D-392B93D9B9C3/Microsoft_Enterprise_Cloud_Red_Teaming.pdf), Microsoft advocates the need for having reactive security processes in place along with preventative measures. Rolling your device certificates should be included as part of these security processes. The frequency in which you roll your certificates will depend on the security needs of your solution. Customers with solutions involving highly sensitive data may roll certificate daily, while others roll their certificates every couple years.

Rolling device certificates will involve updating the certificate stored on the device and the IoT hub. Afterwards, the device can reprovision itself with the IoT hub using normal [provisioning](about-iot-dps.md#provisioning-process) with the Device Provisioning Service (DPS).

## Obtain new certificates

There are many ways to obtain new certificates for your IoT devices. These include obtaining certificates from the device factory, generating your own certificates, and having a third party manage certificate creation for you.

Certificates are signed by each other to form a chain of trust from a root CA certificate to a [leaf certificate](concepts-x509-attestation.md#end-entity-leaf-certificate). A signing certificate is the certificate used to sign the leaf certificate at the end of the chain of trust. A signing certificate can be a root CA certificate, or an intermediate certificate in chain of trust. For more information, see [X.509 certificates](concepts-x509-attestation.md#x509-certificates).

There are two different ways to obtain a signing certificate. The first way, which is recommended for production systems, is to purchase a signing certificate from a root certificate authority (CA). This way chains security down to a trusted source.

The second way is to create your own X.509 certificates using a tool like OpenSSL. This approach is great for testing X.509 certificates but provides few guarantees around security. We recommend you only use this approach for testing unless you prepared to act as your own CA provider.

## Roll the certificate on the device

Certificates on a device should always be stored in a safe place like a [hardware security module (HSM)](concepts-service.md#hardware-security-module). The way you roll device certificates will depend on how they were created and installed in the devices in the first place.

If you got your certificates from a third party, you must look into how they roll their certificates. The process may be included in your arrangement with them, or it may be a separate service they offer.

If you're managing your own device certificates, you'll have to build your own pipeline for updating certificates. Make sure both old and new leaf certificates have the same common name (CN). By having the same CN, the device can reprovision itself without creating a duplicate registration record.

The mechanics of installing a new certificate on a device will often involve one of the following approaches:

- You can trigger affected devices to send a new certificate signing request (CSR) to your PKI Certificate Authority (CA). In this case, each device will likely be able to download its new device certificate directly from the CA.

- You can retain a CSR from each device and use that to get a new device certificate from the PKI CA. In this case, you'll need to push the new certificate to each device in a firmware update using a secure OTA update service like [Device Update for IoT Hub](../iot-hub-device-update/index.yml).

## Roll the certificate in DPS

The device certificate can be manually added to an IoT hub. The certificate can also be automated using a Device Provisioning Service instance. In this article, we'll assume a Device Provisioning Service instance is being used to support auto-provisioning.

When a device is initially provisioned through auto-provisioning, it boots-up, and contacts the provisioning service. The provisioning service responds by performing an identity check before creating a device identity in an IoT hub using the device’s leaf certificate as the credential. The provisioning service then tells the device which IoT hub it's assigned to, and the device then uses its leaf certificate to authenticate and connect to the IoT hub.

Once a new leaf certificate has been rolled to the device, it can no longer connect to the IoT hub because it’s using a new certificate to connect. The IoT hub only recognizes the device with the old certificate. The result of the device's connection attempt will be an "unauthorized" connection error. To resolve this error, you must update the enrollment entry for the device to account for the device's new leaf certificate. Then the provisioning service can update the IoT Hub device registry information as needed when the device is reprovisioned.

One possible exception to this connection failure would be a scenario where you've created an [Enrollment Group](concepts-service.md#enrollment-group) for your device in the provisioning service. In this case, if you aren't rolling the root or intermediate certificates in the device's certificate chain of trust, then the device will be recognized if the new certificate is part of the chain of trust defined in the enrollment group. If this scenario arises as a reaction to a security breach, you should at least disallow the specific device certificates in the group that are considered to be breached. For more information, see [Disallow specific devices in an enrollment group](./how-to-revoke-device-access-portal.md#disallow-specific-devices-from-an-x509-enrollment-group)

How you handle updating the enrollment entry will depend on whether you're using individual enrollments, or group enrollments. Also the recommended procedures differ depending on whether you're rolling certificates because of a security breach, or certificate expiration. The following sections describe how to handle these updates.

### Roll certificates for individual enrollments

If you're rolling certificates in response to a security breach, you should delete any compromised certificates immediately.

If you're rolling certificates to handle certificate expirations, you should use the secondary certificate configuration to reduce downtime for devices attempting to provision. Later, when the secondary certificate nears expiration and needs to be rolled, you can rotate to using the primary configuration. Rotating between the primary and secondary certificates in this way reduces downtime for devices attempting to provision.

Updating enrollment entries for rolled certificates is accomplished on the **Manage enrollments** page. To access that page, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to the Device Provisioning Service instance that has the enrollment entry for your device.

1. Select **Manage enrollments**.

   :::image type="content" source="./media/how-to-roll-certificates/manage-enrollments-portal.png" alt-text="Screenshot that shows the Manage enrollments page in the Azure portal.":::

1. Select the **Individual enrollments** tab, and select the registration ID entry from the list.

1. Check the **Remove or replace primary/secondary certificate** checkboxes if you want to delete an existing certificate. Select the file folder icon to browse for and upload the new certificates.

   If any of your certificates were compromised, you should remove them as soon as possible.

   If one of your certificates is nearing its expiration, you can keep it in place as long as the second certificate will still be active after that date.

   :::image type="content" source="./media/how-to-roll-certificates/manage-individual-enrollments-portal.png" alt-text="Screenshot that shows how to remove a certificate and upload new ones.":::

1. Select **Save** when finished.

1. If you removed a compromised certificate from the provisioning service, the certificate can still be used to make device connections to the IoT hub as long as a device registration for it exists there. You can address this two ways:

    The first way would be to manually navigate to your IoT hub and immediately remove the device registration associated with the compromised certificate. Then when the device provisions again with an updated certificate, a new device registration will be created.

    The second way would be to use reprovisioning support to reprovision the device to the same IoT hub. This approach can be used to replace the certificate for the device registration on the IoT hub. For more information, see [How to reprovision devices](how-to-reprovision.md).

### Roll certificates for enrollment groups

To update a group enrollment in response to a security breach, you should delete the compromised root CA or intermediate certificate immediately.

If you are rolling certificates to handle certificate expirations, you should use the secondary certificate configuration to ensure no downtime for devices attempting to provision. Later, when the secondary certificate also nears expiration and needs to be rolled, you can rotate to using the primary configuration. Rotating between the primary and secondary certificates in this way ensures no downtime for devices attempting to provision.

#### Update root CA certificates

1. Select **Certificates** from the **Settings** section of the navigation menu for your Device Provisioning Service instance.

   :::image type="content" source="./media/how-to-roll-certificates/manage-certificates.png" alt-text="Screenshot that shows the certificates page.":::

1. Select the compromised or expired certificate from the list, and then select **Delete**. Confirm the delete by entering the certificate name and select **OK**.

1. Follow steps outlined in [Configure verified CA certificates](how-to-verify-certificates.md) to add and verify new root CA certificates.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu for your Device Provisioning Service instance, and select the **Enrollment groups** tab.

1. Select your enrollment group name from the list.

1. In the **X.509 certificate settings** section, and select your new root CA certificate to either replace the compromised or expired certificate, or to add as a secondary certificate.

   :::image type="content" source="./media/how-to-roll-certificates/select-new-root-cert.png" alt-text="Screenshot that shows selecting a new uploaded certificate for an enrollment group.":::

1. Select **Save**.

1. If you removed a compromised certificate from the provisioning service, the certificate can still be used to make device connections to the IoT hub as long as device registrations for it exists there. You can address this two ways:

   The first way would be to manually navigate to your IoT hub and immediately remove the device registrations associated with the compromised certificate. Then when your devices provision again with updated certificates, a new device registration will be created for each one.

   The second way would be to use reprovisioning support to reprovision your devices to the same IoT hub. This approach can be used to replace certificates for device registrations on the IoT hub. For more information, see [How to reprovision devices](how-to-reprovision.md).

#### Update intermediate certificates

1. Select **Manage enrollments** from the **Settings** section of the navigation menu for your Device Provisioning Service instance, and select the **Enrollment groups** tab.

1. Select the group name from the list.

1. Check the **Remove or replace primary/secondary certificate** checkboxes if you want to delete an existing certificate. Select the file folder icon to browse for and upload the new certificates.

   If any of your certificates were compromised, you should remove them as soon as possible.

   If one of your certificates is nearing its expiration, you can keep it in place as long as the second certificate will still be active after that date.

   Each intermediate certificate should be signed by a verified root CA certificate that has already been added to the provisioning service. For more information, see [X.509 certificates](concepts-x509-attestation.md#x509-certificates).

   :::image type="content" source="./media/how-to-roll-certificates/enrollment-group-delete-intermediate-cert.png" alt-text="Screenshot that shows replacing an intermediate certificate for an enrollment group.":::

1. If you removed a compromised certificate from the provisioning service, the certificate can still be used to make device connections to the IoT hub as long as device registrations for it exists there. You can address this two ways:

    The first way would be to manually navigate to your IoT hub and immediately remove the device registration associated with the compromised certificate. Then when your devices provision again with updated certificates, a new device registration will be created for each one.

    The second way would be to use reprovisioning support to reprovision your devices to the same IoT hub. This approach can be used to replace certificates for device registrations on the IoT hub. For more information, see [How to reprovision devices](how-to-reprovision.md).

## Reprovision the device

Once the certificate is rolled on both the device and the Device Provisioning Service, the device can reprovision itself by contacting the Device Provisioning Service.

One easy way of programming devices to reprovision is to program the device to contact the provisioning service to go through the provisioning flow if the device receives an “unauthorized” error from attempting to connect to the IoT hub.

Another way is for both the old and the new certificates to be valid for a short overlap, and use the IoT hub to send a command to devices to have them re-register via the provisioning service to update their IoT Hub connection information. Because each device can process commands differently, you have to program your device to know what to do when the command is invoked. There are several ways you can command your device via IoT Hub, and we recommend using [direct methods](../iot-hub/iot-hub-devguide-direct-methods.md) or [jobs](../iot-hub/iot-hub-devguide-jobs.md) to initiate the process.

Once reprovisioning is complete, devices are able to connect to IoT Hub using their new certificates.

## Disallow certificates

In response to a security breach, you may need to disallow a device certificate. To disallow a device certificate, disable the enrollment entry for the target device/certificate. For more information, see disallowing devices in the [Manage disenrollment](how-to-revoke-device-access-portal.md) article.

Once a certificate is included as part of a disabled enrollment entry, any attempts to register with an IoT hub using that certificates will fail even if it is enabled as part of another enrollment entry.

## Next steps

- To learn more about X.509 certificates in the Device Provisioning Service, see [X.509 certificate attestation](concepts-x509-attestation.md) 
- To learn about how to do proof-of-possession for X.509 CA certificates with the Azure IoT Hub Device Provisioning Service, see [How to verify certificates](how-to-verify-certificates.md)
- To learn about how to use the portal to create an enrollment group, see [Managing device enrollments with Azure portal](how-to-manage-enrollments.md).