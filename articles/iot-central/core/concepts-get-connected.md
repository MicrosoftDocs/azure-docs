---
title: Device connectivity in Azure IoT Central | Microsoft Docs
description: This article introduces key concepts relating to device connectivity in Azure IoT Central
author: dominicbetts
ms.author: dobett
ms.date: 1/15/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: philmea
ms.custom:  [amqp, mqtt, device-developer]

# This article applies to operators and device developers.
---

# Get connected to Azure IoT Central

This article describes how devices connect to an Azure IoT Central application. Before a device can exchange data with IoT Central, it must:

- *Authenticate*. Authentication with the IoT Central application uses either a _shared access signature (SAS) token_ or an _X.509 certificate_. X.509 certificates are recommended in production environments.
- *Register*. Devices must be registered with the IoT Central application. You can view registered devices on the **Devices** page in the application.
- *Associate with a device template*. In an IoT Central application, device templates define the UI that operators use to view and manage connected devices.

IoT Central supports the following two device registration scenarios:

- *Automatic registration*. The device is registered automatically when it first connects. This scenario enables OEMs to mass manufacture devices that can connect without first being registered. An OEM generates suitable device credentials, and configures the devices in the factory. Optionally, you can require an operator to approve the device before it starts sending data. This scenario requires you to configure an X.509 or SAS _group enrollment_ in your application.
- *Manual registration*. Operators either register individual devices on the **Devices** page, or [import a CSV file](howto-manage-devices-in-bulk.md#import-devices) to bulk register devices. In this scenario you can use X.509 or SAS _group enrollment_, or X.509 or SAS _individual enrollment_.

Devices that connect to IoT Central should follow the *IoT Plug and Play conventions*. One of these conventions is that a device should send the _model ID_ of the device model it implements when it connects. The model ID enables the IoT Central application to associate the device with the correct device template.

IoT Central uses the [Azure IoT Hub Device Provisioning service (DPS)](../../iot-dps/about-iot-dps.md) to manage the connection process. A device first connects to a DPS endpoint to retrieve the information it needs to connect to your application. Internally, your IoT Central application uses an IoT hub to handle device connectivity. Using DPS enables:

- IoT Central to support onboarding and connecting devices at scale.
- You to generate device credentials and configure the devices offline without registering the devices through IoT Central UI.
- You to use your own device IDs to register devices in IoT Central. Using your own device IDs simplifies integration with existing back-office systems.
- A single, consistent way to connect devices to IoT Central.

This article describes the following device connection steps:

- [X.509 group enrollment](#x509-group-enrollment)
- [SAS group enrollment](#sas-group-enrollment)
- [Individual enrollment](#individual-enrollment)
- [Device registration](#device-registration)
- [Associate a device with a device template](#associate-a-device-with-a-device-template)

## X.509 group enrollment

In a production environment, using X.509 certificates is the recommended device authentication mechanism for IoT Central. To learn more, see [Device Authentication using X.509 CA Certificates](../../iot-hub/iot-hub-x509ca-overview.md).

To connect a device with an X.509 certificate to your application:

1. Create an *enrollment group* that uses the **Certificates (X.509)** attestation type.
1. Add and verify an intermediate or root X.509 certificate in the enrollment group.
1. Generate a leaf certificate from the root or intermediate certificate in the enrollment group. Send the leaf certificate from the device when it connects to your application.

To learn more, see [How to connect devices with X.509 certificates](how-to-connect-devices-x509.md)

### For testing purposes only

For testing only, you can use the following utilities to generate root, intermediate, and device certificates:

- [Tools for the Azure IoT Device Provisioning Device SDK](https://github.com/Azure/azure-iot-sdk-node/blob/master/provisioning/tools/readme.md): a collection of Node.js tools that you can use to generate and verify X.509 certificates and keys.
- If you're using a DevKit device, this [command-line tool](https://aka.ms/iotcentral-docs-dicetool) generates a CA certificate that you can add to your IoT Central application to verify the certificates.
- [Manage test CA certificates for samples and tutorials](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md): a collection of PowerShell and Bash scripts to:
  - Create a certificate chain.
  - Save the certificates as .cer files to upload to your IoT Central application.
  - Use the verification code from the IoT Central application to generate the verification certificate.
  - Create leaf certificates for your devices using your device IDs as a parameter to the tool.

## SAS group enrollment

To connect a device with device SAS key to your application:

1. Create an *enrollment group* that uses the **Shared Access Signature (SAS)** attestation type.
1. Copy the group primary or secondary key from the enrollment group.
1. Use the Azure CLI to generate a device key from the group key:

    ```azurecli
    az iot central device compute-device-key --primary-key <enrollment group primary key> --device-id <device ID>
    ```

1. Use the generated device key when the device connects to your IoT Central application.

## Individual enrollment

Customers connecting devices that each have their own authentication credentials, use individual enrollments. An individual enrollment is an entry for a single device that's allowed to connect. Individual enrollments can use either X.509 leaf certificates or SAS tokens (from a physical or virtual trusted platform module) as attestation mechanisms. A device ID can contain letters, numbers, and the `-` character. For more information, see [DPS individual enrollment](../../iot-dps/concepts-service.md#individual-enrollment).

> [!NOTE]
> When you create an individual enrollment for a device, it takes precedence over the default group enrollment options in your IoT Central application.

### Create individual enrollments

IoT Central supports the following attestation mechanisms for individual enrollments:

- **Symmetric key attestation:** Symmetric key attestation is a simple approach to authenticating a device with the DPS instance. To create an individual enrollment that uses symmetric keys, open the **Device connection** page for the device, select **Individual enrollment** as the connection method, and **Shared access signature (SAS)** as the mechanism. Enter base64 encoded primary and secondary keys, and save your changes. Use the **ID scope**, **Device ID**, and either the primary or secondary key to connect your device.

    > [!TIP]
    > For testing, you can use **OpenSSL** to generate base64 encoded keys: `openssl rand -base64 64`

- **X.509 certificates:** To create an individual enrollment with X.509 certificates, open the **Device Connection** page, select **Individual enrollment** as the connection method, and **Certificates (X.509)** as the mechanism. Device certificates used with an individual enrollment entry have a requirement that the issuer and subject CN are set to the device ID.

    > [!TIP]
    > For testing, you can use [Tools for the Azure IoT Device Provisioning Device SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/tools) to generate a self-signed certificate: `node create_test_cert.js device "mytestdevice"`

- **Trusted Platform Module (TPM) attestation:** A [TPM](../../iot-dps/concepts-tpm-attestation.md) is a type of hardware security module. Using a TPM is one of the most secure ways to connect a device. This article assumes you're using a discrete, firmware, or integrated TPM. Software emulated TPMs are well suited for prototyping or testing, but they don't provide the same level of security as discrete, firmware, or integrated TPMs. Don't use software TPMs in production. To create an individual enrollment that uses a TPM, open the **Device Connection** page, select **Individual enrollment** as the connection method, and **TPM** as the mechanism. Enter the TPM endorsement key and save the device connection information.

## Device registration

Before a device can connect to an IoT Central application, it must be registered in the application:

- Devices can automatically register themselves when they first connect. To use this option, you must use either [X.509 group enrollment](#x509-group-enrollment) or [SAS group enrollment](#sas-group-enrollment).
- An operator can import a CSV file to bulk register a list of devices in the application.
- An operator can manually register an individual device on the **Devices** page in the application.

IoT Central enables OEMs to mass manufacture devices that can register themselves automatically. An OEM generates suitable device credentials, and configures the devices in the factory. When a customer turns on a device for the first time, it connects to DPS, which then automatically connects the device to the correct IoT Central application. Optionally, you can require an operator to approve the device before it starts sending data to the application.

> [!TIP]
> On the **Administration > Device connection** page, the **Auto approve** option controls whether an operator must manually approve the device before it can start sending data.

### Automatically register devices that use X.509 certificates

1. Generate the leaf-certificates for your devices using the root or intermediate certificate you added to your [X.509 enrollment group](#x509-group-enrollment). Use the device IDs as the `CNAME` in the leaf certificates. A device ID can contain letters, numbers, and the `-` character.

1. As an OEM, flash each device with a device ID, a generated X.509 leaf-certificate, and the application **ID scope** value. The device code should also send the model ID of the device model it implements.

1. When you switch on a device, it first connects to DPS to retrieve its IoT Central connection information.

1. The device uses the information from DPS to connect to, and register with, your IoT Central application.

The IoT Central application uses the model ID sent by the device to [associate the registered device with a device template](#associate-a-device-with-a-device-template).

### Automatically register devices that use SAS tokens

1. Copy the group primary key from the **SAS-IoT-Devices** enrollment group:

    :::image type="content" source="media/concepts-get-connected/group-primary-key.png" alt-text="Group primary key from SAS-IoT-Devices enrollment group":::

1. Use the `az iot central device compute-device-key` command to generate the device SAS keys. Use the group primary key from the previous step. The device ID can contain letters, numbers, and the `-` character:

    ```azurecli
    az iot central device compute-device-key --primary-key <enrollment group primary key> --device-id <device ID>
    ```

1. As an OEM, flash each device with the device ID, the generated device SAS key, and the application **ID scope** value. The device code should also send the model ID of the device model it implements.

1. When you switch on a device, it first connects to DPS to retrieve its IoT Central registration information.

1. The device uses the information from DPS to connect to, and register with, your IoT Central application.

The IoT Central application uses the model ID sent by the device to [associate the registered device with a device template](#associate-a-device-with-a-device-template).

### Bulk register devices in advance

To register a large number of devices with your IoT Central application, use a CSV file to [import device IDs and device names](howto-manage-devices-in-bulk.md#import-devices).

If your devices use SAS tokens to authenticate, [export a CSV file from your IoT Central application](howto-manage-devices-in-bulk.md#export-devices). The exported CSV file includes the device IDs and the SAS keys.

If your devices use X.509 certificates to authenticate, generate X.509 leaf certificates for your devices using the root or intermediate certificate in you uploaded to your X.509 enrollment group. Use the device IDs you imported as the `CNAME` value in the leaf certificates.

Devices must use the **ID Scope** value for your application and send a model ID when they connect.

> [!TIP]
> You can find the **ID Scope** value in **Administration > Device connection**.

### Register a single device in advance

This approach is useful when you're experimenting with IoT Central or testing devices. Select **+ New** on the **Devices** page to register an individual device. You can use the device connection SAS keys to connect the device to your IoT Central application. Copy the _device SAS key_ from the connection information for a registered device:

![SAS keys for an individual device](./media/concepts-get-connected/single-device-sas.png)

## Associate a device with a device template

IoT Central automatically associates a device with a device template when the device connects. A device sends a [model ID](../../iot-fundamentals/iot-glossary.md?toc=/azure/iot-central/toc.json&bc=/azure/iot-central/breadcrumb/toc.json#model-id) when it connects. IoT Central uses the model ID to identify the device template for that specific device model. The discovery process works as follows:

1. If the device template is already published in the IoT Central application, the device is associated with the device template.
1. If the device template isn't already published in the IoT Central application, IoT Central looks for the device model in the [public model repository](https://github.com/Azure/iot-plugandplay-models). If IoT Central finds the model, it uses it to generate a basic device template.
1. If IoT Central doesn't find the model in the public model repository, the device is marked as **Unassociated**. An operator can create a device template for the device and then migrate the unassociated device to the new device template.

The following screenshot shows you how to view the model ID of a device template in IoT Central. In a device template, select a component, and then select **Edit identity**:

:::image type="content" source="media/concepts-get-connected/model-id.png" alt-text="Screenshot showing model ID in thermostat device template.":::

You can view the [thermostat model](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/com/example/thermostat-1.json) in the public model repository. The model ID definition looks like:

```json
"@id": "dtmi:com:example:Thermostat;1"
```

## Device status values

When a real device connects to your IoT Central application, its device status changes as follows:

1. The device status is first **Registered**. This status means the device is created in IoT Central, and has a device ID. A device is registered when:
    - A new real device is added on the **Devices** page.
    - A set of devices is added using **Import** on the **Devices** page.

1. The device status changes to **Provisioned** when the device that connected to your IoT Central application with valid credentials completes the provisioning step. In this step, the device uses DPS to automatically retrieve a connection string from the IoT Hub used by your IoT Central application. The device can now connect to IoT Central and start sending data.

1. An operator can block a device. When a device is blocked, it can't send data to your IoT Central application. Blocked devices have a status of **Blocked**. An operator must reset the device before it can resume sending data. When an operator unblocks a device the status returns to its previous value, **Registered** or **Provisioned**.

1. If the device status is **Waiting for Approval**, it means the **Auto approve** option is disabled. An operator must explicitly approve a device before it starts sending data. Devices not registered manually on the **Devices** page, but connected with valid credentials will have the device status **Waiting for Approval**. Operators can approve these devices from the **Devices** page using the **Approve** button.

1. If the device status is **Unassociated**, it means the device connecting to IoT Central doesn't have an associated device template. This situation typically happens in the following scenarios:

    - A set of devices is added using **Import** on the **Devices** page without specifying the device template.
    - A device was registered manually on the **Devices** page without specifying the device template. The device then connected with valid credentials.  

    An operator can associate a device to a device template from the **Devices** page using the **Migrate** button.

## Device connection status

When a device or edge device connects using the MQTT protocol, _connected_ and _disconnected_ events for the device are generated. These events are not sent by the device, they are generated internally by IoT Central.

The following diagram shows how, when a device connects, the connection is registered at the end of a time window. If multiple connection and disconnection events occur, IoT Central registers the one that's closest to the end of the time window. For example, if a device disconnects and reconnects within the time window, IoT Central registers the connection event. Currently, the time window is approximately one minute.

:::image type="content" source="media/concepts-get-connected/device-connectivity-diagram.png" alt-text="Diagram that shows event window for connected and disconnected events." border="false":::

You can view the connected and disconnected events in the **Raw data** view for a device:
:::image type="content" source="media/concepts-get-connected/device-connectivity-events.png" alt-text="Screenshot showing raw data view filtered to show device connected events.":::

You can include connection and disconnection events in [exports from IoT Central](howto-export-data.md#set-up-data-export). To learn more, see [React to IoT Hub events > Limitations for device connected and device disconnected events](../../iot-hub/iot-hub-event-grid.md#limitations-for-device-connected-and-device-disconnected-events).

## SDK support

The Azure Device SDKs offer the easiest way for you implement your device code. The following device SDKs are available:

- [Azure IoT SDK for C](https://github.com/azure/azure-iot-sdk-c)
- [Azure IoT SDK for Python](https://github.com/azure/azure-iot-sdk-python)
- [Azure IoT SDK for Node.js](https://github.com/azure/azure-iot-sdk-node)
- [Azure IoT SDK for Java](https://github.com/azure/azure-iot-sdk-java)
- [Azure IoT SDK for .NET](https://github.com/azure/azure-iot-sdk-csharp)

### SDK features and IoT Hub connectivity

All device communication with IoT Hub uses the following IoT Hub connectivity options:

- [Device-to-cloud messaging](../../iot-hub/iot-hub-devguide-messages-d2c.md)
- [Cloud-to-device messaging](../../iot-hub/iot-hub-devguide-messages-c2d.md)
- [Device twins](../../iot-hub/iot-hub-devguide-device-twins.md)

The following table summarizes how Azure IoT Central device features map on to IoT Hub features:

| Azure IoT Central | Azure IoT Hub |
| ----------- | ------- |
| Telemetry | Device-to-cloud messaging |
| Offline commands | Cloud-to-device messaging |
| Property | Device twin reported properties |
| Property (writable) | Device twin desired and reported properties |
| Command | Direct methods |

### Protocols

The Device SDKs support the following network protocols for connecting to an IoT hub:

- MQTT
- AMQP
- HTTPS

For information about these difference protocols and guidance on choosing one, see [Choose a communication protocol](../../iot-hub/iot-hub-devguide-protocols.md).

If your device can't use any of the supported protocols, use Azure IoT Edge to do protocol conversion. IoT Edge supports other intelligence-on-the-edge scenarios to offload processing from the Azure IoT Central application.

## Security

All data exchanged between devices and your Azure IoT Central is encrypted. IoT Hub authenticates every request from a device that connects to any of the device-facing IoT Hub endpoints. To avoid exchanging credentials over the wire, a device uses signed tokens to authenticate. For more information, see, [Control access to IoT Hub](../../iot-hub/iot-hub-devguide-security.md).

## Next steps

Some suggested next steps are to:

- Review [best practices](concepts-best-practices.md) for developing devices.
- Review some sample code that shows how to use SAS tokens in [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md)
- Learn how to [How to connect devices with X.509 certificates using Node.js device SDK for IoT Central Application](how-to-connect-devices-x509.md)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
- Read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md)
