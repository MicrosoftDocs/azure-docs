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

This article describes how to configure the MXChip IoT DevKit to make it automatically register to IoT Hub using the Azure IoT Device Provisioning Service. In this tutorial, you learn how to:

* Configure the global endpoint of DPS on a device.
* Use a Unique Device Secret (UDS) to generate an X.509 certificate.
* Enroll an individual device.
* Verify that  the device is registered.

The [MXChip IoT DevKit](https://aka.ms/iot-devkit) is an all-in-one Arduino compatible board with rich peripherals and sensors. You can develop for it using [Visual Studio Code extension for Arduino](https://aka.ms/arduino). It comes with a growing [projects catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/) to guide your prototype Internet of Things (IoT) solutions that take advantage of Microsoft Azure services.

## Before you begin

To complete the steps in this tutorial, you need to do the following:

* Prepare your DevKit with [Getting Started Guide](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started).
* Upgrade to latest firmware (>= 1.3.0) with [Firmware Upgrading](https://microsoft.github.io/azure-iot-developer-kit/docs/firmware-upgrading/) tutorial.
* Create and link IoT Hub with Device Provisioning Service instance with [Set up auto provisioning](https://docs.microsoft.com/en-us/azure/iot-dps/quick-setup-auto-provision).

## Set up the Device Provisioning Service configuration on the device

To enable the DevKit to connect to the Device Provisioning Service instance you created:

1. In the Azure portal, select the **Overview** of your Device Provisioning Service and note down the **Global device endpoint** and **ID Scope** values.
  ![DPS Global Endpoint and ID Scope](./media/how-to-connect-mxchip-iot-devkit/dps-global-endpoint.png)

2. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) to have the latest version installed.

3. Open a command prompt. Clone the GitHub repo for DPS sample code:
  ```bash
  git clone https://github.com/DevKitExamples/DevKitDPS.git
  ```

4. Open VS Code and connect DevKit to your computer. Then open the folder that contains the code you cloned.

5. Open **DevKitDPS.ino**. Find and replace `[Global Device Endpoint]` and `[ID Scope]` with the values you just noted.
  ![DPS Endpoint](./media/how-to-connect-mxchip-iot-devkit/endpoint.png)
  You can leave the **registrationId** blank. The application generates one for you based on the MAC address and firmware version. If you want to customize it, the Registration ID has to use only alphanumeric, lowercase, and hyphen combinations with a maximum of 128 characters. For more information, see [Manage device enrollments with Azure portal](https://docs.microsoft.com/en-us/azure/iot-dps/how-to-manage-enrollments).

6. Use **Quick Open** in VS Code (Windows: `Ctrl+P`, macOS: `Cmd+P`) and type **task device-upload** to build and upload the code to the DevKit.

7. The success of the task appears in the output window.

## Save Unique Device Secret on STSAFE security chip

Device Provisioning Service can be configured on a device based on its [Hardware Security Module (HSM)](https://azure.microsoft.com/en-us/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/). DevKit uses [Device Identity Composition Engine (DICE)](https://trustedcomputinggroup.org/wp-content/uploads/Foundational-Trust-for-IOT-and-Resource-Constrained-Devices.pdf) from the [Trusted Computing Group (TCG)](https://trustedcomputinggroup.org). A **Unique Device Secret (UDS)** saved in STSAFE security chip on the DevKit is used to generate the device's unique [X.509](https://docs.microsoft.com/en-us/azure/iot-dps/tutorial-set-up-device#select-a-hardware-security-module) certificate. The certificate can be later used for the enrollment process in the Device Provisioning Service.

A typical **Unique Device Secret (UDS)** is a 64-character string. See the following sample UDS:

```
19e25a259d0c2be03a02d416c05c48ccd0cc7d1743458aae1cb488b074993eae
```

Each of two characters is used as Hex value in the security calculation. The preceding sample UDS is resolved to: "`0x19`, `0xe2`, `0x5a`, `0x25`, `0x9d`, `0x0c`, `0x2b`, `0xe0`, `0x3a`, `0x02`, `0xd4`, `0x16`, `0xc0`, `0x5c`, `0x48`, `0xcc`, `0xd0`, `0xcc`, `0x7d`, `0x17`, `0x43`, `0x45`, `0x8a`, `0xae`, `0x1c`, `0xb4`, `0x88`, `0xb0`, `0x74`, `0x99`, `0x3e`, `0xae`".

To save Unique Device Secret on the DevKit:

1. Open the serial monitor by using a tool like Putty. See [Use Configuration Mode](https://microsoft.github.io/azure-iot-developer-kit/docs/use-configuration-mode/) for details.

2. With the DevKit connected to your computer, hold down the A button, and then push and release the reset button to enter configuration mode. The screen shows the DevKit ID and **'Configuration'**.

3. Take the sample UDS string above and change one or many characters to other values between `0` and `f`. This is used as your own UDS.

4. In the serial monitor window, type **set_dps_uds [your_own_uds_value]** and select Enter.
  > [!NOTE]
  > For example, if you set your own UDS by changing the last two characters to `f`, you need to enter the command like **set_dps_uds 19e25a259d0c2be03a02d416c05c48ccd0cc7d1743458aae1cb488b074993eff**.

5. Without closing the serial monitor window, press the reset button on the DevKit.

6. Note down the **DevKit MAC Address** and **DevKit Firmware Version** values.
  ![Firmware version](./media/how-to-connect-mxchip-iot-devkit/firmware-version.png)

## Generate X.509 certificate

### Windows

1. Open File Explorer and go to the folder that contains the DSP sample code you cloned. In the **.build** folder, find and copy **DPS.ino.bin** and **DPS.ino.map** in it.
  ![Generated files](./media/how-to-connect-mxchip-iot-devkit/generated-files.png)
  > [!NOTE]
  > If you have changed the `built.path` configuration for Arduino to another folder, you need to find those files in the folder you configured.

2. Paste these two files into the **tools** folder on the same level with the **.build** folder.

3. Run **dps_cert_gen.exe**, follow the prompts to enter your **UDS**, the **MAC address** for the DevKit, and the **firmware version** to generate the X.509 certificate.
  ![Run dps-cert-gen.exe](./media/how-to-connect-mxchip-iot-devkit/dps-cert-gen.png)

4. After the X.509 certificate is generated, a **.pem** certificate is saved in the same folder.

## Create a device enrollment entry in the Device Provisioning Service

1. In the Azure portal, go to your provisioning service. Select **Manage enrollments**, and then select the **Individual Enrollments** tab.
  ![Individual enrollments](./media/how-to-connect-mxchip-iot-devkit/individual-enrollments.png)

2. Select **Add**.

3. In **Mechanism**, choose **X.509**.
  ![Upload cert](./media/how-to-connect-mxchip-iot-devkit/upload-cert.png)

4. In **Certificate .pem or .cer file**, upload the **.pem** certificate you just generated.

5. Leave the rest as default and select **Save**.

## Start the DevKit

1. Open VS Code and the serial monitor.

2. Select the **Reset** button on your DevKit.

You should see the DevKit start the registration with your Device Provisioning Service.

![VS Code output](./media/how-to-connect-mxchip-iot-devkit/vscode-output.png)

## Verify the DevKit is registered on IoT Hub

After your device boots, the following actions should take place:

1. The device sends a registration request to your Device Provisioning Service.
2. The Device Provisioning Service sends back a registration challenge to which your device responds.
3. On successful registration, the Device Provisioning Service sends the IoT hub URI, device ID, and the encrypted key back to the device.
4. The IoT Hub client application on the device then connects to your hub.
5. On successful connection to the hub, you should see the device appear in the IoT hub's Device Explorer.
  ![Device registered](./media/how-to-connect-mxchip-iot-devkit/device-registered.png)

## Change device ID

The default device ID registered in Azure IoT Hub is **AZ3166**. If you want to modify it, follow [instructions here](https://microsoft.github.io/azure-iot-developer-kit/docs/customize-device-id/).

## Problems and feedback

If you encounter problems, refer to [FAQs](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/) or reach out to us from the following channels:

* [Gitter.im](http://gitter.im/Microsoft/azure-iot-developer-kit)
* [Stackoverflow](https://stackoverflow.com/questions/tagged/iot-devkit)

## Next steps

Now that you have learned to prepare the DevKit to enroll a device securely to DPS using DICE, so that it can automatically register to IoT Hub with zero-touch. In this tutorial, you learned how to:

> [!div class="checklist"]
> * Configure the global endpoint of DPS on a device
> * Use Unique Device Secret (UDS) to generate a X.509 certificate
> * Enroll an individual device
> * Verify that the device is registered

Advance to the other tutorials to learn:

> [!div class="nextstepaction"]
> [Create and provision a simulated device](./quick-create-simulated-device.md)

