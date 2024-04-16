---
ms.topic: include
ms.date: 10/29/2021
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

## Create a DPS enrollment

Use your generated certificates and keys to create an enrollment in DPS for one or more IoT Edge devices.

If you are looking to provision a single IoT Edge device, create an **individual enrollment**. If you need multiple devices provisioned, follow the steps for creating a DPS **group enrollment**.

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](../how-to-deploy-at-scale.md).

For more information about enrollments in the device provisioning service, see [How to manage device enrollments](/azure/iot-dps/how-to-manage-enrollments).

# [Individual enrollment](#tab/individual-enrollment)

### Create a DPS individual enrollment

Individual enrollments take the public portion of a device's identity certificate and match that to the certificate on the device.

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create individual enrollments using the Azure CLI. For more information, see [az iot dps enrollment](/cli/azure/iot/dps/enrollment). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for an IoT Edge device.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub device provisioning service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment** then complete the following steps to configure the enrollment:  

   * **Mechanism**: Select **X.509**.

   * **Primary Certificate .pem or .cer file**: Upload the public file from the device identity certificate. If you used the scripts to generate a test certificate, choose the following file:

      `<WRKDIR>\certs\iot-edge-device-identity-<name>.cert.pem`

   * **IoT Hub Device ID**: Provide an ID for your device if you'd like. You can use device IDs to target an individual device for module deployment. If you don't provide a device ID, the common name (CN) in the X.509 certificate is used.

   * **IoT Edge device**: Select **True** to declare that the enrollment is for an IoT Edge device.

   * **Select the IoT hubs this device can be assigned to**: Choose the linked IoT hub that you want to connect your device to. You can choose multiple hubs, and the device will be assigned to one of them according to the selected allocation policy.

   * **Initial Device Twin State**: Add a tag value to be added to the device twin if you'd like. You can use tags to target groups of devices for automatic deployment. For example:

      ```json
      {
         "tags": {
            "environment": "test"
         },
         "properties": {
            "desired": {}
         }
      }
      ```

1. Select **Save**.

Under **Manage Enrollments**, you can see the **Registration ID** for the enrollment you just created. Make note of it, as it can be used when you provision your device.

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation.

# [Group enrollment](#tab/group-enrollment)

### Create a DPS group enrollment

Group enrollments use an intermediate or root CA certificate from the certificate chain of trust used to generate the individual device identity certificates.

#### Verify your root certificate

When you create an enrollment group, you have the option of using a verified certificate. You can verify a certificate with DPS by proving that you have ownership of the root certificate. For more information, see [How to do proof-of-possession for X.509 CA certificates](/azure/iot-dps/how-to-verify-certificates).

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub device provisioning service.

1. Select **Certificates** from the left-hand menu.

1. Select **Add** to add a new certificate.

1. Enter a friendly name for your certificate, then browse to the .cer or .pem file that represents the public part of your X.509 certificate.

   If you're using the demo certificates, upload the `<wrkdir>\certs\azure-iot-test-only.root.ca.cert.pem` certificate.

1. Select **Save**.

1. Your certificate should now be listed on the **Certificates** page. Select it to open the certificate details.

1. Select **Generate Verification Code** then copy the generated code.

1. Whether you brought your own CA certificate or are using the demo certificates, you can use the verification tool provided in the IoT Edge repository to verify proof of possession. The verification tool uses your CA certificate to sign a new certificate that has the provided verification code as the subject name.

   ```powershell
   New-CACertsVerificationCert "<verification code>"
   ```

1. In the same certificate details page in the Azure portal, upload the newly generated verification certificate.

1. Select **Verify**.

#### Create enrollment group

For more information about enrollments in the device provisioning service, see [How to manage device enrollments](/azure/iot-dps/how-to-manage-enrollments).

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create group enrollments using the Azure CLI. For more information, see [az iot dps enrollment-group](/cli/azure/iot/dps/enrollment-group). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for IoT Edge devices. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub device provisioning service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add enrollment group** then complete the following steps to configure the enrollment:

   * **Group name**: Provide a memorable name for this group enrollment.

   * **Attestation Type**: Select **Certificate**.

   * **IoT Edge device**: Select **True**. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

   * **Certificate Type**: Select **CA Certificate**.

   * **Primary certificate**: Choose your certificate from the dropdown list.

   * **Select the IoT hubs this device can be assigned to**: Choose the linked IoT hub that you want to connect your device to. You can choose multiple hubs, and the device will be assigned to one of them according to the selected allocation policy.

   * **Initial Device Twin State**: Add a tag value to be added to the device twin if you'd like. You can use tags to target groups of devices for automatic deployment. For example:

      ```json
      {
         "tags": {
            "environment": "test"
         },
         "properties": {
            "desired": {}
         }
      }
      ```

1. Select **Save**.

Under **Manage Enrollments**, you can see the **Registration ID** for the enrollment you just created. Make note of it, as it can be used when you provision your devices.

Now that an enrollment exists for these devices, the IoT Edge runtime can automatically provision the devices during installation.

---
