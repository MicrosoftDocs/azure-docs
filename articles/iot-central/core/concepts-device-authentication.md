---
title: Device authentication in Azure IoT Central
description: This article introduces key IoT Central device authentication concepts such as enrollment groups, shared access signatures, and X.509 certificates.
author: dominicbetts
ms.author: dobett
ms.date: 10/28/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central

ms.custom:  [amqp, mqtt, device-developer]

# This article applies to operators and device developers.
---

# Device authentication concepts in IoT Central

This article describes how devices authenticate to an IoT Central application. To learn more about the overall connection process, see [Connect a device](overview-iot-central-developer.md#how-devices-connect).

Devices authenticate with the IoT Central application by using either a _shared access signature (SAS) token_ or an _X.509 certificate_. X.509 certificates are recommended in production environments.

You use _enrollment groups_ to manage the device authentication options in your IoT Central application.

This article describes the following device authentication options:

- [X.509 enrollment group](#x509-enrollment-group)
- [SAS enrollment group](#sas-enrollment-group)
- [Individual enrollment](#individual-enrollment)

## X.509 enrollment group

In a production environment, using X.509 certificates is the recommended device authentication mechanism for IoT Central. To learn more, see [Device Authentication using X.509 CA Certificates](../../iot-hub/iot-hub-x509ca-overview.md).

An X.509 enrollment group contains a root or intermediate X.509 certificate. Devices can authenticate if they have a valid leaf certificate that's derived from the root or intermediate certificate.

To connect a device with an X.509 certificate to your application:

1. Create an _enrollment group_ that uses the **Certificates (X.509)** attestation type.
1. Add and verify an intermediate or root X.509 certificate in the enrollment group.
1. Generate a leaf certificate from the root or intermediate certificate in the enrollment group. Install the leaf certificate on the device for it to use when it connects to your application.

Each enrollment group should use a unique X.509 certificate. IoT Central does not support using the same X.509 certificate across multiple enrollment groups.

To learn more, see [How to connect devices with X.509 certificates](how-to-connect-devices-x509.md)

### For testing purposes only

In a production environment, use certificates from your certificate provider. For testing only, you can use the following utilities to generate root, intermediate, and device certificates:

- [Tools for the Azure IoT Device Provisioning Device SDK](https://github.com/Azure/azure-iot-sdk-node/blob/main/provisioning/tools/readme.md): a collection of Node.js tools that you can use to generate and verify X.509 certificates and keys.
- [Manage test CA certificates for samples and tutorials](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md): a collection of PowerShell and Bash scripts to:
  - Create a certificate chain.
  - Save the certificates as .cer files to upload to your IoT Central application.
  - Use the verification code from the IoT Central application to generate the verification certificate.
  - Create leaf certificates for your devices using your device IDs as a parameter to the tool.

## SAS enrollment group

A SAS enrollment group contains group-level SAS keys. Devices can authenticate if they have a valid SAS token that's derived from a group-level SAS key.

To connect a device with device SAS token to your application:

1. Create an _enrollment group_ that uses the **Shared Access Signature (SAS)** attestation type.
1. Copy the group primary or secondary key from the enrollment group.
1. Use the Azure CLI to generate a device token from the group key:

    ```azurecli
    az iot central device compute-device-key --primary-key <enrollment group primary key> --device-id <device ID>
    ```

1. Use the generated device token when the device connects to your IoT Central application.

> [!NOTE]
> To use existing SAS keys in your enrollment groups, disable the **Auto generate keys** toggle and manually enter your SAS keys.

If you use the default **SAS-IoT-Devices** enrollment group, IoT Central generates the individual device keys for you. To access these keys, select **Connect** on the device details page. This page displays the **ID Scope**, **Device ID**, **Primary key**, and **Secondary key** that you use in your device code. This page also displays a QR code the contains the same data.

## Individual enrollment

Typically, devices connect by using credentials derived from an enrollment group X.509 certificate or SAS key. However, if your devices each have their own credentials, you can use individual enrollments. An individual enrollment is an entry for a single device that's allowed to connect. Individual enrollments can use either X.509 leaf certificates or SAS tokens (from a physical or virtual trusted platform module) as attestation mechanisms. For more information, see [DPS individual enrollment](../../iot-dps/concepts-service.md#individual-enrollment).

> [!NOTE]
> When you create an individual enrollment for a device, it takes precedence over the default enrollment group options in your IoT Central application.

### Create individual enrollments

IoT Central supports the following attestation mechanisms for individual enrollments:

- **Symmetric key attestation:** Symmetric key attestation is a simple approach to authenticating a device with the DPS instance. To create an individual enrollment that uses symmetric keys, open the **Device connection** page for the device, select **Individual enrollment** as the authentication type, and **Shared access signature (SAS)** as the authentication method. Enter the base64 encoded primary and secondary keys, and save your changes. Use the **ID scope**, **Device ID**, and either the primary or secondary key to connect your device.

    > [!TIP]
    > For testing, you can use **OpenSSL** to generate base64 encoded keys: `openssl rand -base64 64`

- **X.509 certificates:** To create an individual enrollment with X.509 certificates, open the **Device Connection** page, select **Individual enrollment** as the authentication type, and **Certificates (X.509)** as the authentication method. Device certificates used with an individual enrollment entry have a requirement that the issuer and subject CN are set to the device ID.

    > [!TIP]
    > For testing, you can use [Tools for the Azure IoT Device Provisioning Device SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/tools) to generate a self-signed certificate: `node create_test_cert.js device "mytestdevice"`

- **Trusted Platform Module (TPM) attestation:** A [TPM](../../iot-dps/concepts-tpm-attestation.md) is a type of hardware security module. Using a TPM is one of the most secure ways to connect a device. This article assumes you're using a discrete, firmware, or integrated TPM. Software emulated TPMs are well suited for prototyping or testing, but they don't provide the same level of security as discrete, firmware, or integrated TPMs. Don't use software TPMs in production. To create an individual enrollment that uses a TPM, open the **Device Connection** page, select **Individual enrollment** as the authentication type, and **TPM** as the authentication method. Enter the TPM endorsement key and save the device connection information.

## Automatically register devices

This scenario enables OEMs to mass manufacture devices that can connect without first being registered in an application. An OEM generates suitable device credentials, and configures the devices in the factory.

To automatically register devices that use X.509 certificates:

1. Generate the leaf-certificates for your devices using the root or intermediate certificate you added to your [X.509 enrollment group](#x509-enrollment-group). Use the device IDs as the `CNAME` in the leaf certificates. A device ID can contain letters, numbers, and the `-` character.

1. As an OEM, flash each device with a device ID, a generated X.509 leaf-certificate, and the application **ID scope** value. The device code should also send the model ID of the device model it implements.

1. When you switch on a device, it first connects to DPS to retrieve its IoT Central connection information.

1. The device uses the information from DPS to connect to, and register with, your IoT Central application.

1. The IoT Central application uses the model ID sent by the device to [assign the registered device to a device template](concepts-device-templates.md#assign-a-device-to-a-device-template).

To automatically register devices that use SAS tokens:

1. Copy the group primary key from the **SAS-IoT-Devices** enrollment group:

    :::image type="content" source="media/concepts-device-authentication/group-primary-key.png" alt-text="Screenshot that shows the group primary key from SAS IoT Devices enrollment group." lightbox="media/concepts-device-authentication/group-primary-key.png":::

1. Use the `az iot central device compute-device-key` command to generate the device SAS keys. Use the group primary key from the previous step. The device ID can contain letters, numbers, and the `-` character:

    ```azurecli
    az iot central device compute-device-key --primary-key <enrollment group primary key> --device-id <device ID>
    ```

1. As an OEM, flash each device with the device ID, the generated device SAS key, and the application **ID scope** value. The device code should also send the model ID of the device model it implements.

1. When you switch on a device, it first connects to DPS to retrieve its IoT Central registration information.

1. The device uses the information from DPS to connect to, and register with, your IoT Central application.

1. The IoT Central application uses the model ID sent by the device to [assign the registered device to a device template](concepts-device-templates.md#assign-a-device-to-a-device-template).

## Next steps

Some suggested next steps are to:

- Review [best practices](concepts-device-implementation.md#best-practices) for developing devices.
- Review some sample code that shows how to use SAS tokens in [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md)
- Learn how to [How to connect devices with X.509 certificates using Node.js device SDK for IoT Central Application](how-to-connect-devices-x509.md)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
- Read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md)
