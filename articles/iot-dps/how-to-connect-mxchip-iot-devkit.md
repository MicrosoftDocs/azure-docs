---
title: How to use the MXChip IoT DevKit to connect to the Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: How to use the MXChip IoT DevKit to connect to the Azure IoT Hub Device Provisioning Service
services: iot-dps
keywords: 
author: liydu
ms.author: liydu
ms.date: 02/20/2018
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# Connect the MXChip IoT DevKit to the Azure IoT Hub Device Provisioning Service

This article describes how to configure the MXChip IoT DevKit to make it automatically register with Azure IoT Hub by using the Azure IoT Device Provisioning Service. In this tutorial, you learn how to:

* Configure the global endpoint of the device provisioning service on a device.
* Use a unique device secret (UDS) to generate an X.509 certificate.
* Enroll an individual device.
* Verify that the device is registered.

The [MXChip IoT DevKit](https://aka.ms/iot-devkit) is an all-in-one Arduino-compatible board with rich peripherals and sensors. You can develop for it by using the [Visual Studio Code extension for Arduino](https://aka.ms/arduino). The DevKit comes with a growing [projects catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/) to guide your prototype Internet of Things (IoT) solutions that take advantage of Azure services.

## Before you begin

To complete the steps in this tutorial, first do the following tasks:

* Prepare your DevKit by following the steps in [Connect IoT DevKit AZ3166 to Azure IoT Hub in the cloud](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started).
* Upgrade to the latest firmware (1.3.0 or later) with the [Update DevKit firmware](https://microsoft.github.io/azure-iot-developer-kit/docs/firmware-upgrading/) tutorial.
* Create and link an IoT Hub with a device provisioning service instance by following the steps in [Set up the IoT Hub Device Provisioning Service with the Azure portal](https://docs.microsoft.com/en-us/azure/iot-dps/quick-setup-auto-provision).

## Set up the device provisioning service configuration on the device

To connect the DevKit to the device provisioning service instance that you created:

1. In the Azure portal, select the **Overview** pane of your device provisioning service and note down the **Global device endpoint** and **ID Scope** values.
  ![DPS Global Endpoint and ID Scope](./media/how-to-connect-mxchip-iot-devkit/dps-global-endpoint.png)

2. Make sure you have `git` installed on your machine and that it's added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) to have the latest version installed.

3. Open a command prompt. Clone the GitHub repo for the device provisioning service sample code:
  ```bash
  git clone https://github.com/DevKitExamples/DevKitDPS.git
  ```

4. Open Visual Studio Code and connect DevKit to your computer, and then open the folder that contains the code you cloned.

5. Open **DevKitDPS.ino**. Find and replace `[Global Device Endpoint]` and `[ID Scope]` with the values you just noted down.
  ![DPS Endpoint](./media/how-to-connect-mxchip-iot-devkit/endpoint.png)
  You can leave the **registrationId** blank. The application generates one for you based on the MAC address and firmware version. If you want to customize the Registration ID, you must use only alphanumeric, lowercase, and hyphen combinations with a maximum of 128 characters. For more information, see [Manage device enrollments with Azure portal](https://docs.microsoft.com/en-us/azure/iot-dps/how-to-manage-enrollments).

6. Use Quick Open in VS Code (Windows: `Ctrl+P`, macOS: `Cmd+P`) and type *task device-upload* to build and upload the code to the DevKit.

7. The output window shows whether the task was successful.

## Save a unique device secret on an STSAFE security chip

The device provisioning service can be configured on a device based on its [Hardware Security Module](https://azure.microsoft.com/en-us/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/). The MXChip IoT DevKit uses the [Device Identity Composition Engine](https://trustedcomputinggroup.org/wp-content/uploads/Foundational-Trust-for-IOT-and-Resource-Constrained-Devices.pdf) from the [Trusted Computing Group](https://trustedcomputinggroup.org). A *unique device secret* (UDS) saved in an STSAFE security chip on the DevKit is used to generate the device's unique [X.509](https://docs.microsoft.com/en-us/azure/iot-dps/tutorial-set-up-device#select-a-hardware-security-module) certificate. The certificate can be used later for the enrollment process in the device provisioning service.

A typical unique device secret is a 64-character string, as seen in the following sample:

```
19e25a259d0c2be03a02d416c05c48ccd0cc7d1743458aae1cb488b074993eae
```

Each of two characters is used as the Hex value in the security calculation. The preceding sample UDS is resolved to: `0x19`, `0xe2`, `0x5a`, `0x25`, `0x9d`, `0x0c`, `0x2b`, `0xe0`, `0x3a`, `0x02`, `0xd4`, `0x16`, `0xc0`, `0x5c`, `0x48`, `0xcc`, `0xd0`, `0xcc`, `0x7d`, `0x17`, `0x43`, `0x45`, `0x8a`, `0xae`, `0x1c`, `0xb4`, `0x88`, `0xb0`, `0x74`, `0x99`, `0x3e`, `0xae`.

To save a unique device secret on the DevKit:

1. Open the serial monitor by using a tool such as Putty. See [Use configuration mode](https://microsoft.github.io/azure-iot-developer-kit/docs/use-configuration-mode/) for details.

2. With the DevKit connected to your computer, hold down the **A** button, and then press and release the **Reset** button to enter configuration mode. The screen shows the DevKit ID and Configuration.

3. Take the sample UDS string and change one or more characters to other values between `0` and `f` for your own UDS.

4. In the serial monitor window, type *set_dps_uds [your_own_uds_value]* and select Enter.
  > [!NOTE]
  > For example, if you set your own UDS by changing the last two characters to `f`, you need to enter the command like this: set_dps_uds 19e25a259d0c2be03a02d416c05c48ccd0cc7d1743458aae1cb488b074993eff.

5. Without closing the serial monitor window, press the **Reset** button on the DevKit.

6. Note down the **DevKit MAC Address** and **DevKit Firmware Version** values.
  ![Firmware version](./media/how-to-connect-mxchip-iot-devkit/firmware-version.png)

## Generate an X.509 certificate

### Windows

1. Open File Explorer and go to the folder that contains the device provisioning service sample code that you cloned earlier. In the **.build** folder, find and copy **DPS.ino.bin** and **DPS.ino.map** into the folder that contains the code.
  ![Generated files](./media/how-to-connect-mxchip-iot-devkit/generated-files.png)
  > [!NOTE]
  > If you changed the `built.path` configuration for Arduino to another folder, you need to find those files in the folder you configured.

2. Paste these two files into the **tools** folder on the same level with the **.build** folder.

3. Run **dps_cert_gen.exe**. Follow the prompts to enter your **UDS**, the **MAC address** for the DevKit, and the **firmware version** to generate the X.509 certificate.
  ![Run dps-cert-gen.exe](./media/how-to-connect-mxchip-iot-devkit/dps-cert-gen.png)

4. After the X.509 certificate is generated, a **.pem** certificate is saved to the same folder.

## Create a device enrollment entry in the device provisioning service

1. In the Azure portal, go to your provisioning service. Select **Manage enrollments**, and then select the **Individual Enrollments** tab.
  ![Individual enrollments](./media/how-to-connect-mxchip-iot-devkit/individual-enrollments.png)

2. Select **Add**.

3. In **Mechanism**, select **X.509**.
  ![Upload certificate](./media/how-to-connect-mxchip-iot-devkit/upload-cert.png)

4. In **Certificate .pem or .cer file**, upload the **.pem** certificate you just generated.

5. Leave the rest as default and select **Save**.

## Start the DevKit

1. Open VS Code and the serial monitor.

2. Press the **Reset** button on your DevKit.

You see the DevKit start the registration with your device provisioning service.

![VS Code output](./media/how-to-connect-mxchip-iot-devkit/vscode-output.png)

## Verify that the DevKit is registered with Azure IoT Hub

After the device boots, the following actions take place:

1. The device sends a registration request to your device provisioning service.
2. The device provisioning service sends back a registration challenge to which your device responds.
3. On successful registration, the device provisioning service sends the IoT Hub URI, device ID, and the encrypted key back to the device.
4. The IoT Hub client application on the device connects to your hub.
5. On successful connection to the hub, you see the device appear in the IoT Hub Device Explorer.
  ![Device registered](./media/how-to-connect-mxchip-iot-devkit/device-registered.png)

## Change the device ID

The default device ID registered with Azure IoT Hub is *AZ3166*. If you want to modify the ID, follow the instructions in [Customize device ID](https://microsoft.github.io/azure-iot-developer-kit/docs/customize-device-id/).

## Problems and feedback

If you encounter problems, refer to the Iot DevKit [FAQs](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/), or reach out to the following channels for support:

* [Gitter.im](http://gitter.im/Microsoft/azure-iot-developer-kit)
* [Stackoverflow](https://stackoverflow.com/questions/tagged/iot-devkit)

## Next steps

In this tutorial, you learned to enroll a device securely to the device provisioning service by using the Device Identity Composition Engine, so that the device can automatically register with Azure IoT Hub. 

In summary, you learned how to:

> [!div class="checklist"]
> * Configure the global endpoint of the device provisioning service on a device.
> * Use a unique device secret to generate an X.509 certificate.
> * Enroll an individual device.
> * Verify that the device is registered.

Learn how to [Create and provision a simulated device](./quick-create-simulated-device.md).

