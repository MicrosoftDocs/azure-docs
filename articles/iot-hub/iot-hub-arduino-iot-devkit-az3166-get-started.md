---
title: Connect IoT DevKit AZ3166 to an Azure IoT Hub
description: In this tutorial, learn how to set up and connect IoT DevKit AZ3166 to Azure IoT Hub so it can send data to the Azure cloud platform.
author: wesmc7777
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.tgt_pltfrm: arduino
ms.date: 04/29/2021
ms.author: wesmc
ms.custom:  [mqtt, 'Role: Cloud Development', devx-track-azurecli]
---

# Connect IoT DevKit AZ3166 to Azure IoT Hub

[!INCLUDE [iot-hub-get-started-device-selector](../../includes/iot-hub-get-started-device-selector.md)]

You can use the [MXChip IoT DevKit](https://microsoft.github.io/azure-iot-developer-kit/) to develop and prototype Internet of Things (IoT) solutions that take advantage of Microsoft Azure services. The kit includes an Arduino-compatible board with rich peripherals and sensors, an open-source board package, and a rich [sample gallery](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/).

## What you learn

* How to create an IoT hub and register a device for the MXChip IoT DevKit.
* How to connect the IoT DevKit to Wi-Fi and configure the IoT Hub connection string.
* How to send the DevKit sensor telemetry data to your IoT hub.
* How to prepare the development environment and develop application for the IoT DevKit.

Don't have a DevKit yet? Try the [DevKit simulator](https://azure-samples.github.io/iot-devkit-web-simulator/) or [purchase a DevKit](https://aka.ms/iot-devkit-purchase).

You can find the source code for all DevKit tutorials from [code samples gallery](/samples/browse/?term=mxchip).

## What you need

- A MXChip IoT DevKit board with a Micro-USB cable. [Get it now](https://aka.ms/iot-devkit-purchase).
- A computer running Windows 10, macOS 10.10+ or Ubuntu 18.04+.
- An active Azure subscription. [Activate a free 30-day trial Microsoft Azure account](https://azureinfo.microsoft.com/us-freetrial.html).
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]
 
## Prepare the development environment

Follow these steps to prepare the development environment for the DevKit:

#### Install Visual Studio Code with Azure IoT Tools extension package

1. Install [Arduino IDE](https://www.arduino.cc/en/Main/Software). It provides the necessary toolchain for compiling and uploading Arduino code.
    * **Windows**: Use Windows Installer version. Do not install from the App Store.
    * **macOS**: Drag and drop the extracted **Arduino.app** into `/Applications` folder.
    * **Ubuntu**: Unzip it into folder such as `$HOME/Downloads/arduino-1.8.8`

2. Install [Visual Studio Code](https://code.visualstudio.com/), a cross platform source code editor with powerful intellisense, code completion, and debugging support as well as rich extensions can be installed from marketplace.

3. Launch VS Code, look for **Arduino** in the extension marketplace and install it. This extension provides enhanced experiences for developing on Arduino platform.

    ![Install Arduino](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/install-arduino.png)

4. Look for [Azure IoT Tools](https://aka.ms/azure-iot-tools) in the extension marketplace and install it.

    ![Screenshot that shows Azure IoT Tools in the extension marketplace.](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/install-azure-iot-tools.png)

    Or copy and paste this URL into a browser window: `vscode:extension/vsciot-vscode.azure-iot-tools`

    > [!NOTE]
    > The Azure IoT Tools extension pack contains the [Azure IoT Device Workbench](https://aka.ms/iot-workbench) which is used to develop and debug on various IoT devkit devices. The [Azure IoT Hub extension](https://aka.ms/iot-toolkit), also included with the Azure IoT Tools extension pack, is used to manage and interact with Azure IoT Hubs.

5. Configure VS Code with Arduino settings.

    In Visual Studio Code, click **File > Preferences > Settings** (on macOS, **Code > Preferences > Settings**). Then click the **Open Settings (JSON)** icon in the upper-right corner of the *Settings* page.

    ![Install Azure IoT Tools](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/user-settings-arduino.png)

    The correct path to your Arduino installation must be configured in VS Code. Add following lines to configure Arduino depending on your platform and the directory path where you installed the Arduino IDE: 

    * **Windows**:

        ```json
        "arduino.path": "C:\\Program Files (x86)\\Arduino",
        "arduino.additionalUrls": "https://raw.githubusercontent.com/VSChina/azureiotdevkit_tools/master/package_azureboard_index.json"
        ```

    * **macOS**:

        ```json
        "arduino.path": "/Applications",
        "arduino.additionalUrls": "https://raw.githubusercontent.com/VSChina/azureiotdevkit_tools/master/package_azureboard_index.json"
        ```

    * **Ubuntu**:

        Replace the **{username}** placeholder below with your username.

        ```json
        "arduino.path": "/home/{username}/Downloads/arduino-1.8.13",
        "arduino.additionalUrls": "https://raw.githubusercontent.com/VSChina/azureiotdevkit_tools/master/package_azureboard_index.json"
        ```

6. Click `F1` to open the command palette, type and select **Arduino: Board Manager**. Search for **AZ3166** and install the latest version.

    ![Install DevKit SDK](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/install-az3166-sdk.png)

#### Install ST-Link drivers

[ST-Link/V2](https://www.st.com/en/development-tools/st-link-v2.html) is the USB interface that IoT DevKit uses to communicate with your development machine. You need to install it on Windows to flash the compiled device code to the DevKit. Follow the OS-specific steps to allow the machine access to your device.

* **Windows**: Download and install USB driver from [STMicroelectronics website](https://www.st.com/en/development-tools/stsw-link009.html).
* **macOS**: No driver is required for macOS.
* **Ubuntu**: Run the commands in terminal and sign out and sign in for the group change to take effect:

    ```bash
    # Copy the default rules. This grants permission to the group 'plugdev'
    sudo cp ~/.arduino15/packages/AZ3166/tools/openocd/0.10.0/linux/contrib/60-openocd.rules /etc/udev/rules.d/
    sudo udevadm control --reload-rules

    # Add yourself to the group 'plugdev'
    # Logout and log back in for the group to take effect
    sudo usermod -a -G plugdev $(whoami)
    ```

Now you are all set with preparing and configuring your development environment.

## Prepare Azure resources

For this article, you will need to have an IoT Hub created and a device registered to use the hub. The following subsections show how to create the resources with the Azure CLI.  

You can also create an IoT Hub and register a device within Visual Studio code using the Azure IoT Tools extensions. For more information on creating the hub and device within VS Code, see [Use Azure IoT Tools for VS Code](iot-hub-create-use-iot-toolkit.md).

#### Create an IoT hub

If you haven't already created a IoT Hub, follow the steps in [Create an IoT Hub using Azure CLI](iot-hub-create-using-cli.md).

#### Register a device

A device must be registered for the IoT DevKit in your IoT hub before it can connect. Use the steps below for the Azure Cloud Shell to register a new device.

1. Run the following command in Azure Cloud Shell to create the device identity.

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

   **AZ3166Device**: The name of the device you're registering. Use **AZ3166Device** as shown for the example in this article. If you choose a different name for your device, you need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name YourIoTHubName --device-id AZ3166Device
    ```

   > [!NOTE]
   > If you get an error running `device-identity`, install the [Azure IoT Extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension/blob/dev/README.md).
   > Run the following command to add the Microsoft Azure IoT Extension for Azure CLI to your Cloud Shell instance. The IoT Extension adds commands that are specific to IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) to Azure CLI.
   > 
   > ```azurecli-interactive
   > az extension add --name azure-iot
   >  ```
   >
  
1. Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity connection-string show --hub-name YourIoTHubName --device-id AZ3166Device --output table
    ```

    Make a note of the device connection string, which looks like:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=AZ3166Device;SharedAccessKey={YourSharedAccessKey}`

    You use this value later.


## Prepare your hardware

Hook up the following hardware to your computer:

* DevKit board
* Micro-USB cable

![Required hardware](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/hardware.jpg)

To connect the DevKit to your computer, follow these steps:

1. Connect the USB end to your computer.

2. Connect the Micro-USB end to the DevKit.

3. The green LED for power confirms the connection.

   ![Hardware connections](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/connect.jpg)

#### Update firmware

The DevKit Get Started firmware (`devkit-getstarted-*.*.*.bin`) connects to a device-specific endpoint on your IoT hub and sends temperature and humidity telemetry. 

1. Download the latest version of [GetStarted firmware (devkit-getstarted-*.*.*.bin)](https://github.com/microsoft/devkit-sdk/releases/) for IoT DevKit. At the time of this update, the latest filename is **devkit-getstarted-2.0.0.bin**.

1. Make sure IoT DevKit connect to your computer via USB. Open File Explorer there is a USB mass storage device called **AZ3166**.

    ![Open Windows Explorer](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/az3166-usb.png)

1. Drag and drop the firmware just downloaded into the mass storage device and it will flash automatically.

    ![Copy firmware](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/copy-firmware.png)

1. On the DevKit, Hold down the **B** button, and keep it pressed down. Push and release the **Reset** button. Afterwards, release button **B**. Your DevKit enters AP mode. To confirm, the screen displays the service set identifier (SSID) of the DevKit and the configuration portal IP address.

    ![Reset button, button B, and SSID](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/wifi-ap.jpg)

    ![Set AP Mode](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/set-ap-mode.gif)

1. Use a Web browser on a different Wi-Fi enabled device (computer or mobile phone) to connect to the IoT DevKit SSID displayed in the previous step. If it asks for a password, leave it empty.

    ![Connect SSID](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/connect-ssid.png)

1. Open **192.168.0.1** in the browser. Select the Wi-Fi that you want the IoT DevKit to connect to, type the Wi-Fi password, then paste the device connection string you made note of previously. Then click **Configure Device**.

    ![Configuration UI](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/configuration-ui.png)

    > [!NOTE]
    > The IoT DevKit only supports 2.4GHz network. Check [FAQ](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/#wi-fi-configuration) for more details.

1. The WiFi information and device connection string will be stored into the IoT DevKit when you see the result page.

    ![Configuration result](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/configuration-ui-result.png)

    > [!NOTE]
    > After Wi-Fi is configured, your credentials will persist on the device for that connection, even if the device is unplugged.

1. The IoT DevKit reboots in a few seconds. On the DevKit screen, you see the IP address for the DevKit follows by the telemetry data including temperature and humidity value with message count send to Azure IoT Hub.

    ![WiFi IP](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/wifi-ip.jpg)

    ![Sending data](media/iot-hub-arduino-devkit-az3166-get-started/quickstarts/sending-data.jpg)

1. To verify the telemetry data sent to Azure, run the following command in Azure Cloud Shell:

    ```azurecli
    az iot hub monitor-events --hub-name YourIoTHubName --output table
    ```

    This command monitors device-to-cloud (D2C) messages sent to your IoT Hub

## Build your first project

#### Open sample code from sample gallery

The IoT DevKit contains a rich gallery of samples that you can use to learn connect the DevKit to various Azure services.

1. Make sure your IoT DevKit is **not connected** to your computer. Start VS Code first, and then connect the DevKit to your computer.

1. Click `F1` to open the command palette, type and select **Azure IoT Device Workbench: Open Examples...**. Then select **MXChip IoT DevKit** as board.

1. In the IoT Workbench Examples page, find **Get Started** and click **Open Sample**. Then select the default path to download the sample code.

    ![Open sample](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/open-sample.png)


#### Review the code

The `GetStarted.ino` is the main Arduino sketch file.

![D2C message](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/code.png)

To see how device telemetry is sent to the Azure IoT Hub, open the `utility.cpp` file in the same folder. View [API Reference](https://microsoft.github.io/azure-iot-developer-kit/docs/apis/arduino-language-reference/) to learn how to use sensors and peripherals on IoT DevKit.

The `DevKitMQTTClient` used is a wrapper of the **iothub_client** from the [Microsoft Azure IoT SDKs and libraries for C](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client) to interact with Azure IoT Hub.


#### Configure and compile device code

1. In the bottom-right status bar, check the **MXCHIP AZ3166** is shown as selected board and serial port with **STMicroelectronics** is used.

    ![Select board and COM](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/select-com.png)

1. Click `F1` to open the command palette, type and select **Azure IoT Device Workbench: Configure Device Settings...**, select **Config Device Connection String**. Then paste the connection string for your IoT device.  

1. On DevKit, hold down **button A**, push and release the **reset** button, and then release **button A**. Your DevKit enters configuration mode and saves the connection string.

    ![Connection string](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/connection-string.png)

1. Click `F1` again, type and select **Azure IoT Device Workbench: Upload Device Code**. It starts compile and upload the code to DevKit.

    ![Arduino upload](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/arduino-upload.png)

The DevKit reboots and starts running the code. The DevKit will start sending telemetry to the hub.

> [!NOTE]
> If there is any errors or interruptions, you can always recover by running the command again.


## Use the Serial Monitor

The Serial Monitor in VS Code is useful to view logging information sent from the code. This logging information is generated using the `LogInfo()` API.  This is useful for debugging purposes. 

1. Click the power plug icon on the status bar to open the Serial Monitor:

    ![Serial monitor](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/serial-monitor.png)

2. The sample application is running successfully when you see the following results:

    * The Serial Monitor displays the message sent to the IoT Hub.
    * The LED on the MXChip IoT DevKit is blinking.
    
    ![Serial monitor output](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/result-serial-output.png)
    
    > [!NOTE]
    > You might encounter an error during testing in which the LED isn't blinking, the Azure portal doesn't show incoming data from the device, but the device OLED screen shows as **Running...**. To resolve the issue, in the Azure portal, go to the device in the IoT hub and send a message to the device. If you see the following response in the serial monitor in VS Code, it's possible that direct communication from the device is blocked at the router level. Check firewall and router rules that are configured for the connecting devices. Also, ensure that outbound port 1833 is open.
    > 
    > ERROR: mqtt_client.c (ln 454): Error: failure opening connection to endpoint  
    > INFO: >>>Connection status: disconnected  
    > ERROR: tlsio_mbedtls.c (ln 604): Underlying IO open failed  
    > ERROR: mqtt_client.c (ln 1042): Error: io_open failed  
    > ERROR: iothubtransport_mqtt_common.c (ln 2283): failure connecting to address atcsliothub.azure-devices.net.  
    > INFO: >>>Re-connect.  
    > INFO: IoThub Version: 1.3.6  

3. On DevKit, hold down button **A**, push and release the **Reset** button, and then release button **A**. Your DevKit stops sending telemetry and enters configuration mode. A full command list for configuration mode is shown in the Serial Monitor output window in VS Code.

    ```output
    ************************************************
    ** MXChip - Microsoft IoT Developer Kit **
    ************************************************
    Configuration console:
     - help: Help document.
     - version: System version.
     - exit: Exit and reboot.
     - scan: Scan Wi-Fi AP.
     - set_wifissid: Set Wi-Fi SSID.
     - set_wifipwd: Set Wi-Fi password.
     - set_az_iothub: Set IoT Hub device connection string.
     - set_dps_uds: Set DPS Unique Device Secret (UDS) for X.509 certificates..
     - set_az_iotdps: Set DPS Symmetric Key. Format: "DPSEndpoint=global.azure-devices-provisioning.net;IdScope=XXX;DeviceId=XXX;SymmetricKey=XXX".
     - enable_secure: Enable secure channel between AZ3166 and secure chip.
     ```

    This mode supports commands like changing the IoT Hub device connection string you want to use. You can send text commands in the Serial Monitor by pressing `F1` and choosing **Arduino: Send Text to Serial Port**.

4. On DevKit, press and release the **Reset** button. This reboots the device so it can start sending telemetry again.
    
## Use VS Code to view hub telemetry

At the end of the [Prepare your hardware](#prepare-your-hardware) section, you used the Azure CLI to monitor device-to-cloud (D2C) messages in your IoT Hub. You can also monitor device-to-cloud (D2C) messages in VS Code using the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).

1. Sign in [Azure portal](https://portal.azure.com/), find the IoT Hub you created.

    ![Azure portal](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/azure-iot-hub-portal.png)

1. In the **Shared access policies** pane, click the **iothubowner** policy, and copy the connection string of your IoT hub.

    ![Azure IoT Hub connection string](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/azure-portal-conn-string.png)

1. In VS Code, click `F1`, type and select **Azure IoT Hub: Set IoT Hub Connection String**. Paste your IoT Hub connection string into the field.

    ![Set Azure IoT Hub connection string](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/set-iothub-connection-string.png)

1. Expand the **AZURE IOT HUB** pane on the left, right click on the device name you created and select **Start Monitoring Built-in Event Endpoint**.

    ![Monitor D2C Message](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/monitor-d2c.png)

    If you are prompted for a built-in endpoint, use the **Event Hub-compatible endpoint** shown by clicking **Built-in endpoints** for your IoT Hub in the Azure portal. 

1. In **OUTPUT** pane, you can see the incoming D2C messages to the IoT Hub. 

    Make sure the output is filtered correctly by selecting **Azure IoT Hub**. This filtering can be used to switch between hub monitoring and the Serial Monitor output.

    ![Screenshot that shows the incoming D2C messages to the IoT Hub.](media/iot-hub-arduino-devkit-az3166-get-started/getting-started/d2c-output.png)


## Problems and feedback

If you encounter problems, you can check for a solution in the [IoT DevKit FAQ](https://microsoft.github.io/azure-iot-developer-kit/docs/faq/) or reach out to us from [Gitter](https://gitter.im/Microsoft/azure-iot-developer-kit). You can also give us feedback by leaving a comment on this page.

## Next steps

You have successfully connected an MXChip IoT DevKit to your IoT hub, and you have sent the captured sensor data to your IoT hub.

[!INCLUDE [iot-hub-get-started-az3166-next-steps](../../includes/iot-hub-get-started-az3166-next-steps.md)]
