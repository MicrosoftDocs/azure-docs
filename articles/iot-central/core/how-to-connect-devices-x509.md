---
title: Connect devices with X.509 certificates to your application
description: This article describes how devices can use X.509 certificates to authenticate to your application.
author: dominicbetts
ms.author: dobett
ms.date: 12/14/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: device-developer, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-ten

# - id: programming-languages-set-ten
#     title: Python
---

# How to connect devices with X.509 certificates to IoT Central Application

IoT Central supports both shared access signatures (SAS) and X.509 certificates to secure the communication between a device and your application. The [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial uses SAS. In this article, you learn how to modify the code sample to use X.509 certificates. X.509 certificates are recommended in production environments. For more information, see [Device authentication concepts](concepts-device-authentication.md).

This guide shows two ways to use X.509 certificates - [group enrollments](how-to-connect-devices-x509.md#use-group-enrollment) typically used in a production environment, and [individual enrollments](how-to-connect-devices-x509.md#use-individual-enrollment) useful for testing. The article also describes how to [roll device certificates](#roll-x509-device-certificates) to maintain connectivity when certificates expire.

This guide builds on the samples shown in the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial that use C#, Java, JavaScript, and Python. For an example that uses the C programming language, see the [Provision multiple X.509 devices using enrollment groups](../../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).

## Prerequisites

To complete the steps in this how-to guide, you should first complete the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

In this how-to guide, you generate some test X.509 certificates. To be able to generate these certificates, you need:

- A development machine with [Node.js](https://nodejs.org/) version 6 or later installed. You can run `node --version` in the command line to check your version. The instructions in this tutorial assume you're running the **node** command at the Windows command prompt. However, you can use Node.js on many other operating systems.
- A local copy of the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository that contains the scripts to generate the test X.509 certificates. Use this link to download a copy of the repository: [Download ZIP](https://github.com/Azure/azure-iot-sdk-node/archive/main.zip). Then unzip the file to a suitable location on your local machine.

## Use group enrollment

Use X.509 certificates with a group enrollment in a production environment. In a group enrollment, you add a root or intermediate X.509 certificate to your IoT Central application. Devices with leaf certificates derived from the root or intermediate certificate can connect to your application.

### Generate root and device certificates

In this section, you use an X.509 certificate to connect a device with a certificate derived from the IoT Central enrollment group's certificate.

> [!WARNING]
> This way of generating X.509 certs is for testing only. For a production environment you should use your official, secure mechanism for certificate generation.

1. Navigate to the certificate generator script in the Microsoft Azure IoT SDK for Node.js you downloaded. Install the required packages:

    ```cmd/sh
    cd azure-iot-sdk-node/provisioning/tools
    npm install
    ```

1. Create a root certificate and then derive a device certificate by running the script:

    ```cmd/sh
    node create_test_cert.js root mytestrootcert
    node create_test_cert.js device sample-device-01 mytestrootcert
    ```

    > [!TIP]
    > A device ID can contain letters, numbers, and the `-` character.

These commands produce the following root and the device certificate

| filename | contents |
| -------- | -------- |
| mytestrootcert_cert.pem | The public portion of the root X509 certificate |
| mytestrootcert_key.pem | The private key for the root X509 certificate |
| mytestrootcert_fullchain.pem | The entire keychain for the root X509 certificate. |
| mytestrootcert.pfx | The PFX file for the root X509 certificate. |
| sampleDevice01_cert.pem | The public portion of the device X509 certificate |
| sampleDevice01_key.pem | The private key for the device X509 certificate |
| sampleDevice01_fullchain.pem | The entire keychain for the device X509 certificate. |
| sampleDevice01.pfx | The PFX file for the device X509 certificate. |

Make a note of the location of these files. You need it later.

### Create a group enrollment

1. Open your IoT Central application and navigate to **Permissions**  in the left pane and select **Device connection groups**.

1. Select **+ New** to create a new enrollment group called _MyX509Group_ with an attestation type of **Certificates (X.509)**. You can create enrollment groups for either IoT devices or IoT Edge devices.

1. In the enrollment group you created, select **Manage primary**.

1. In the **Primary certificate** panel, select **Add certificate**.

1. Upload the root certificate file called _mytestrootcert_cert.pem_ that you generated previously.

1. If you're using an intermediate or root certificate authority that you trust and know you have full ownership of the certificate, you can self-attest that you've verified the certificate by setting certificate status verified on upload to **On**. Otherwise, set certificate status verified on upload to **Off**.

1. If you set certificate status verified on upload to **Off**, select **Generate verification code**.

1. Copy the verification code, copy it, and then create an X.509 verification certificate. For example, at the command prompt:

    ```cmd/sh
    node create_test_cert.js verification --ca mytestrootcert_cert.pem --key mytestrootcert_key.pem --nonce  {verification-code}
    ```

1. Select **Verify** to upload the signed verification certificate _verification_cert.pem_ to complete the verification.

1. The status of the primary certificate is now **Verified**:

    :::image type="content" source="media/how-to-connect-devices-x509/verified.png" alt-text="Screenshot that shows a verified X509 certificate." lightbox="media/how-to-connect-devices-x509/verified.png":::

You can now connect devices that have an X.509 certificate derived from this primary root certificate.

After you save the enrollment group, make a note of the ID scope.

### Run sample device code

:::zone pivot="programming-language-csharp"

If you're using Windows, the X.509 certificates must be in the Windows certificate store for the sample to work. In Windows Explorer, double-click on the PFX files you generated previously - `mytestrootcert.pfx` and `sampleDevice01.pfx`. In the **Certificate Import Wizard**, select **Current User** as the store location, enter `1234` as the password, and let the wizard choose the certificate store automatically. The wizard imports the certificates to the current user's personal store.

[!INCLUDE [iot-central-x509-csharp-code](../../../includes/iot-central-x509-csharp-code.md)]

To run the sample:

1. Add the following environment variables to the project:

    - `IOTHUB_DEVICE_X509_CERT`: `<full path to folder that contains PFX files>sampleDevice01.pfx`
    - `IOTHUB_DEVICE_X509_PASSWORD`: 1234.

1. Build and run the application. Verify the device provisions successfully.

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-central-x509-java-code](../../../includes/iot-central-x509-java-code.md)]

To run the sample:

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>sampleDevice01_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>sampleDevice01_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Build and run the application. Verify the device provisions successfully.

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-central-x509-javascript-code](../../../includes/iot-central-x509-javascript-code.md)]

To run the sample:

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>sampleDevice01_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>sampleDevice01_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Execute the script and verify the device provisions successfully:

    ```cmd/sh
    node pnp_temperature_controller.js
    ```

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-central-x509-python-code](../../../includes/iot-central-x509-python-code.md)]

To run the sample:

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>sampleDevice01_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>sampleDevice01_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Execute the script and verify the device provisions successfully:

    ```cmd/sh
    python temp_controller_with_thermostats.py
    ```

:::zone-end

Verify that telemetry appears on the device view in your IoT Central application:

:::image type="content" source="media/how-to-connect-devices-x509/telemetry.png" alt-text="Screenshot showing telemetry from a device that connected using X.509." lightbox="media/how-to-connect-devices-x509/telemetry.png":::

## Use individual enrollment

Use X.509 certificates with an individual enrollment to test your device and solution. In an individual enrollment, there's no root or intermediate X.509 certificate in your IoT Central application. Devices use a self-signed X.509 certificate to connect to your application.

### Generate self-signed device certificate

In this section, you use a self-signed X.509 certificate to connect devices for individual enrollment, which are used to enroll a single device. Self-signed certificates are for testing only.

> [!WARNING]
> This way of generating X.509 certs is for testing only. For a production environment you should use your official, secure mechanism for certificate generation.

Create a self-signed X.509 device certificate by running the following commands:

```cmd/sh
  cd azure-iot-sdk-node/provisioning/tools
  node create_test_cert.js device mytestselfcertprimary
  node create_test_cert.js device mytestselfcertsecondary 
```

> [!TIP]
> A device ID can contain letters, numbers, and the `-` character.

These commands produce the following device certificates:

| filename | contents |
| -------- | -------- |
| mytestselfcertprimary_cert.pem | The public portion of the primary device X509 certificate |
| mytestselfcertprimary_key.pem | The private key for the primary device X509 certificate |
| mytestselfcertprimary_fullchain.pem | The entire keychain for the primary device X509 certificate. |
| mytestselfcertprimary.pfx | The PFX file for the primary device X509 certificate. |
| mytestselfcertsecondary_cert.pem | The public portion of the secondary device X509 certificate |
| mytestselfcertsecondary_key.pem | The private key for the secondary device X509 certificate |
| mytestselfcertsecondary_fullchain.pem | The entire keychain for the secondary device X509 certificate. |
| mytestselfcertsecondary.pfx | The PFX file for the secondary device X509 certificate. |

### Create individual enrollment

1. In the Azure IoT Central application, select **Devices**, and create a new device with **Device ID** as _mytestselfcertprimary_ from the thermostat device template. Make a note of the **ID scope**, you use it later.

1. Open the device you created and select **Connect**.

1. Select **Individual enrollment** as the **Authentication type** and **Certificates (X.509)** as the **Authentication method**.

1. Upload the _mytestselfcertprimary_cert.pem_ file that you generated previously as the primary certificate.

1. Upload the _mytestselfcertsecondary_cert.pem_ file that you generated previously as the secondary certificate. Then select **Save**.

1. The device now has an individual enrollment with X.509 certificates.

    :::image type="content" source="media/how-to-connect-devices-x509/individual-enrollment.png" alt-text="Screenshot that shows how to connect a device using an X.509 individual enrollment." lightbox="media/how-to-connect-devices-x509/individual-enrollment.png":::

### Run a sample individual enrollment device

:::zone pivot="programming-language-csharp"

If you're using Windows, the X.509 certificates must be in the Windows certificate store for the sample to work. In Windows Explorer, double-click on the PFX files you generated previously - `mytestselfcertprimary.pfx` and `mytestselfcertsecondary.pfx`. In the **Certificate Import Wizard**, select **Current User** as the store location, enter `1234` as the password, and let the wizard choose the certificate store automatically. The wizard imports the certificates to the current user's personal store.

[!INCLUDE [iot-central-x509-csharp-code](../../../includes/iot-central-x509-csharp-code.md)]

To run the sample:

1. Add the following environment variables to the project:

    - `IOTHUB_DEVICE_DPS_DEVICE_ID`: mytestselfcertprimary
    - `IOTHUB_DEVICE_X509_CERT`: `<full path to folder that contains PFX files>mytestselfcertprimary.pfx`
    - `IOTHUB_DEVICE_X509_PASSWORD`: 1234.

1. Build and run the application. Verify the device provisions successfully.

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-central-x509-java-code](../../../includes/iot-central-x509-java-code.md)]

To run the sample:

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_DPS_DEVICE_ID=mytestselfcertprimary
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>mytestselfcertprimary_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>mytestselfcertprimary_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Build and run the application. Verify the device provisions successfully.

You can repeat the above steps for _mytestselfcertsecondary_ certificate as well.

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-central-x509-javascript-code](../../../includes/iot-central-x509-javascript-code.md)]

To run the sample:

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_DPS_DEVICE_ID=mytestselfcertprimary
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>mytestselfcertprimary_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>mytestselfcertprimary_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Execute the script and verify the device provisions successfully:

    ```cmd/sh
    node pnp_temperature_controller.js
    ```

You can repeat the above steps for _mytestselfcertsecondary_ certificate as well.

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-central-x509-python-code](../../../includes/iot-central-x509-python-code.md)]

To run the sample:

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_DPS_DEVICE_ID=mytestselfcertprimary
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>mytestselfcertprimary_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>mytestselfcertprimary_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Execute the script and verify the device provisions successfully:

    ```cmd/sh
    python temp_controller_with_thermostats.py
    ```

You can repeat the above steps for _mytestselfcertsecondary_ certificate as well.

:::zone-end

## Connect an IoT Edge device

This section assumes you're using a group enrollment to connect your IoT Edge device. Follow the steps in the previous sections to:

- [Generate root and device certificates](#generate-root-and-device-certificates)
- [Create a group enrollment](#create-a-group-enrollment)

To connect the IoT Edge device to IoT Central using the X.509 device certificate:

- Copy the device certificate and key files onto your IoT Edge device. In the previous group enrollment example, these files were called **sampleDevice01_key.pem** and **sampleDevice01_cert.pem**.
- On the IoT Edge device, edit `provisioning` section in the **/etc/aziot/config.toml** configuration file as follows:

    ```toml
    # DPS X.509 provisioning configuration
    provisioning:
      source: "dps"
      global_endpoint: "https://global.azure-devices-provisioning.net"
      scope_id: "<SCOPE_ID>"
      attestation:
        method: "x509"
    #   registration_id: "<OPTIONAL REGISTRATION ID. LEAVE COMMENTED OUT TO REGISTER WITH CN OF identity_cert>"
        identity_cert: "file:///<path>/sampleDevice01_cert.pem"
        identity_pk: "file:///<path>/sampleDevice01_key.pem"
    #  always_reprovision_on_startup: true
    #  dynamic_reprovisioning: false

    [provisioning]
    source = "dps"
    global_endpoint = "https://global.azure-devices-provisioning.net"
    id_scope = "<SCOPE_ID>"
    
    [provisioning.attestation]
    method = "x509"
    registration_id = "env-sens-001"
    identity_pk = "file:///<path>/envSens001_key.pem"
    identity_cert = "file:///<path>/envSens001_cert.pem"
    ```

    > [!TIP]
    > You don't need to add a value for the `registration_id`. IoT Edge can use the **CN** value from the X.509 certificate.

- Run the following command to restart the IoT Edge runtime:

    ```bash
    sudo iotedge config apply
    ```

To learn more, see [Create and provision IoT Edge devices at scale on Linux using X.509 certificates](../../iot-edge/how-to-provision-devices-at-scale-linux-x509.md).

## Connect a downstream device to IoT Edge

IoT Edge uses X.509 certificates to secure the connection between downstream devices and an IoT Edge device acting as a transparent gateway. To learn more about configuring this scenario, see [Connect a downstream device to an Azure IoT Edge gateway](../../iot-edge/how-to-connect-downstream-device.md).

## Roll X.509 device certificates

During the lifecycle of your IoT Central application, you'll need to roll your x.509 certificates. For example:

- If you have a security breach, rolling certificates is a security best practice to help secure your system.
- x.509 certificates have expiry dates. The frequency in which you roll your certificates depends on the security needs of your solution. Customers with solutions involving highly sensitive data may roll certificates daily, while others roll their certificates every couple years.

For uninterrupted connectivity, IoT Central lets you configure primary and secondary X.509 certificates. If the primary and secondary certificates have different expiry dates, you can roll the expired certificate while devices continue to connect with the other certificate.

To learn more, see [Assume Breach Methodology](https://download.microsoft.com/download/C/1/9/C1990DBA-502F-4C2A-848D-392B93D9B9C3/Microsoft_Enterprise_Cloud_Red_Teaming.pdf).

This section describes how to roll the certificates in IoT Central. When you roll a certificate in IoT Central, you also need to copy the new device certificate to your devices.

### Obtain new X.509 certificates

Obtain new X.509 certificates from your certificate provider. You can create your own X.509 certificates using a tool like OpenSSL. This approach is useful for testing X.509 certificates but provides few security guarantees. Only use this approach for testing unless you're prepared to act as your own CA provider.

### Enrollment groups and security breaches

To update a group enrollment in response to a security breach, you should use the following approach to update the current certificate immediately. Complete these steps for the primary and secondary certificates if both are compromised:

1. Navigate to **Permissions**  in the left pane and select **Device connection groups**.

2. Select the group name in the list under Enrollment groups.

3. For certificate update, select **Manage primary** or **Manage Secondary**.

4. Add and verify root X.509 certificate in the enrollment group.

### Individual enrollments and security breaches

If you're rolling certificates in response to a security breach, use the following approach to update the current certificate immediately. Complete these steps for the primary and secondary certificates, if both are compromised:

1. Select **Devices**, and select the device.

1. Select **Connect**, and select connect method as **Individual Enrollment**

1. Select **Certificates (X.509)** as mechanism.

1. For certificate update, select the folder icon to select the new certificate to be uploaded for the enrollment entry. Select **Save**.

### Enrollment groups and certificate expiration

To handle certificate expirations, use the following approach to update the current certificate immediately:

1. Navigate to **Permissions**  in the left pane and select **Device connection groups**.

2. Select the group name in the list under Enrollment groups.

3. For certificate update, select **Manage Primary**.

4. Add and verify root X.509 certificate in the enrollment group.

5. Later when the secondary certificate has expired, come back and update the secondary certificate.

### Individual enrollments and certificate expiration

If you're rolling certificates to handle certificate expirations, you should use the secondary certificate configuration as follows to reduce downtime for devices attempting to provision in your application.

When the secondary certificate nears expiration, and needs to be rolled, you can rotate to using the primary configuration. Rotating between the primary and secondary certificates in this way reduces downtime for devices attempting to provision in your application.

1. Select **Devices**, and select the device.

2. Select **Connect**, and select connect method as **Individual Enrollment**

3. Select **Certificates (X.509)** as mechanism.

4. For secondary certificate update, select the folder icon to select the new certificate to be uploaded for the enrollment entry. Select **Save**.

5. Later when the primary certificate has expired, come back and update the primary certificate.

## Next steps

Now that you've learned how to connect devices using  X.509 certificates, the suggested next step is to learn how to [Monitor device connectivity using Azure CLI](howto-monitor-devices-azure-cli.md).
