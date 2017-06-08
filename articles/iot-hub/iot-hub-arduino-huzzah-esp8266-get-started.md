---
title: ESP8266 to cloud - Connect Feather HUZZAH ESP8266 to Azure IoT Hub | Microsoft Docs
description: Explains how to connect an Arduino device, called Adafruit Feather HUZZAH ESP8266, to Azure IoT Hub, which is a Microsoft cloud service that helps manage your IoT assets.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: ''

ms.assetid: c505aacf-89a8-40ed-a853-493b75bec524
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/28/2017
ms.author: xshi

---
# Connect Adafruit Feather HUZZAH ESP8266 to Azure IoT Hub in the cloud

[!INCLUDE [iot-hub-get-started-device-selector](../../includes/iot-hub-get-started-device-selector.md)]

![Connection between DHT22, Feather HUZZAH ESP8266, and IoT Hub](media/iot-hub-arduino-huzzah-esp8266-get-started/1_connection-hdt22-feather-huzzah-iot-hub.png)

## What you do


Connect Adafruit Feather HUZZAH ESP8266 to an IoT hub that you create. Then you run a sample application on ESP8266 to collect the temperature and humidity data from a DHT22 sensor. Finally, you send the sensor data to your IoT hub.

> [!NOTE]
> If you're using other ESP8266 boards, you can still follow these steps to connect it to your IoT hub. Depending on the ESP8266 board you're using, you might need to reconfigure the `LED_PIN`. For example, if you're using ESP8266 from AI-Thinker, you might change it from `0` to `2`. Don't have a kit yet? Get it from the [Azure website](http://azure.com/iotstarterkits).




## What you learn

* How to create an IoT hub and register a device for Feather HUZZAH ESP8266
* How to connect Feather HUZZAH ESP8266 with the sensor and your computer
* How to collect sensor data by running a sample application on Feather HUZZAH ESP8266
* How to send the sensor data to your IoT hub

## What you need

![Parts needed for the tutorial](media/iot-hub-arduino-huzzah-esp8266-get-started/2_parts-needed-for-the-tutorial.png)

To complete this operation, you need the following parts from your Feather HUZZAH ESP8266 Starter Kit:

* The Feather HUZZAH ESP8266 board
* A Micro USB to Type A USB cable

You also need the following things for your development environment:

* Mac or PC that is running Windows or Ubuntu.
* Wireless network for Feather HUZZAH ESP8266 to connect to.
* Internet connection to download the configuration tool.
* [Arduino IDE](https://www.arduino.cc/en/main/software) version 1.6.8 or later. Earlier versions don't work with the AzureIoT library.





The following items are optional in case you don’t have a sensor. You also have the option of using simulated sensor data.

* An Adafruit DHT22 temperature and humidity sensor
* A breadboard
* M/M jumper wires

## Create an IoT hub and register a device for Feather HUZZAH ESP8266

### To create your IoT hub in the Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Click **New** > **Internet of Things** > **IoT Hub**.

   ![Create IoT hub](media/iot-hub-arduino-huzzah-esp8266-get-started/3_iot-hub-creation.png)

1. In the **IoT hub** pane, enter the necessary information for your IoT hub:

   ![Basic information for IoT hub creation](media/iot-hub-arduino-huzzah-esp8266-get-started/4_iot-hub-provide-basic-info.png)

   * **Name**: The name for your IoT hub. If the name you enter is valid, a green check mark appears.
   * **Pricing and scale tier**: Select the free F1 tier for this demo. See [pricing and scale tier](https://azure.microsoft.com/pricing/details/iot-hub/).
   * **Resource group**: Create a resource group to host the IoT hub, or use an existing one. See [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-portal.md).
   * **Location**: Select the closest location to you where the IoT hub is created.
   * **Pin to dashboard**: Select this option for easy access to your IoT hub from the dashboard.

1. Click **Create**. It could take a few minutes for your IoT hub to be created. You can see progress in the **Notifications** pane.

   ![Monitor the IoT hub creation progress in the notification pane](media/iot-hub-arduino-huzzah-esp8266-get-started/5_iot-hub-monitor-creation-progress-notification-pane.png)

1. After your IoT hub is created, click it from the dashboard. Make a note of the **Hostname** value that is used later in this article, and then click **Shared access policies**.

   ![Get the Hostname of your IoT hub](media/iot-hub-arduino-huzzah-esp8266-get-started/6_iot-hub-get-hostname.png)

1. In the **Shared access policies** pane, click the **iothubowner** policy, and then copy and save the **Connection string** value for your IoT hub. You use this value later in this article. For more information, see [Control access to IoT Hub](iot-hub-devguide-security.md).

   ![Get IoT hub connection string](media/iot-hub-arduino-huzzah-esp8266-get-started/7_iot-hub-get-connection-string.png)

You've now created your IoT hub. Ensure that you save the **Hostname** and **Connection string** values. They're used later in this article.


### Register a device for Feather HUZZAH ESP8266 in your IoT hub

Every IoT hub has an identity registry that stores information about the devices that are permitted to connect to the IoT hub. Before a device can connect to an IoT hub, there must be an entry for that device in the identity registry for that IoT hub.


In this section, you use a CLI tool called *iothub explorer*. Use this tool to register a device for Feather HUZZAH ESP8266 in the identity registry of your IoT hub.



> [!NOTE]
> iothub explorer requires Node.js 4.x or later to work properly.

To register a device for Feather HUZZAH ESP8266, follow these steps:

1. [Download](https://nodejs.org/en/download/) and install the latest LTS version of Node.js, NPM included.
1. Install iothub explorer by using NPM.

   * Windows 7 or later:

     Start a command prompt as an administrator. Install iothub explorer by running the following command:

     ```bash
     npm install -g iothub-explorer
     ```

   * Ubuntu 16.04 or later:

     Open a terminal by using the keyboard shortcut Ctrl+Alt+T, and then run the following command:

     ```bash
     sudo npm install -g iothub-explorer
     ```

   * MacOS 10.1 or later:

     Open a terminal, and then run the following command:

     ```bash
     npm install -g iothub-explorer
     ```

3. Log in to your IoT hub by running the following command:

   ```bash
   iothub-explorer login [your IoT hub connection string]
   ```

4. Register a new device. In the next example, `deviceID` is `new-device`. Get its connection string by running the following command.

   ```bash
   iothub-explorer create new-device --connection-string
   ```

Make a note of the connection string of the registered device. It's used later.


> [!NOTE]
> To view the connection string of registered devices, run the `iothub-explorer list` command.


## Connect Feather HUZZAH ESP8266 with the sensor and your computer
In this section, you connect the sensors to your board. Then you plug in your device to your computer for further use.
### Connect a DHT22 temperature and humidity sensor to Feather HUZZAH ESP8266

Use the breadboard and jumper wires to make the connection as follows. If you don’t have a sensor, skip this section because you can use simulated sensor data instead.

![Connections reference](media/iot-hub-arduino-huzzah-esp8266-get-started/15_connections_on_breadboard.png)


For sensor pins, use the following wiring:


| Start (Sensor)           | End (Board)           | Cable Color   |
| -----------------------  | ---------------------- | ------------: |
| VDD (Pin 31F)            | 3V (Pin 58H)           | Red cable     |
| DATA (Pin 32F)           | GPIO 2 (Pin 46A)       | Blue cable    |
| GND (Pin 34F)            | GND (PIn 56I)          | Black cable   |

For more information, see [Adafruit DHT22 sensor setup](https://learn.adafruit.com/dht/connecting-to-a-dhtxx-sensor) and [Adafruit Feather HUZZAH Esp8266 Pinouts](https://learn.adafruit.com/adafruit-feather-huzzah-esp8266/using-arduino-ide?view=all#pinouts).





Now your Feather Huzzah ESP8266 should be connected with a working sensor.

![Connect DHT22 with Feather Huzzah](media/iot-hub-arduino-huzzah-esp8266-get-started/8_connect-dht22-feather-huzzah.png)

### Connect Feather HUZZAH ESP8266 to your computer

As shown next, use the Micro USB to Type A USB cable to connect Feather HUZZAH ESP8266 to your computer.

![Connect Feather Huzzah to your computer](media/iot-hub-arduino-huzzah-esp8266-get-started/9_connect-feather-huzzah-computer.png)

### Add serial port permissions (Ubuntu only)


If you use Ubuntu, make sure you have the permissions to operate on the USB port of Feather HUZZAH ESP8266. To add serial port permissions, follow these steps:


1. Run the following commands at a terminal:

   ```bash
   ls -l /dev/ttyUSB*
   ls -l /dev/ttyACM*
   ```

   You get one of the following outputs:

   * crw-rw---- 1 root uucp xxxxxxxx
   * crw-rw---- 1 root dialout xxxxxxxx

   In the output, notice that `uucp` or `dialout` is the group owner name of the USB port.

1. Add the user to the group by running the following command:

   ```bash
   sudo usermod -a -G <group-owner-name> <username>
   ```

   `<group-owner-name>` is the group owner name you obtained in the previous step. `<username>` is your Ubuntu user name.

1. Sign out of Ubuntu, and then sign in again for the change to appear.

## Collect sensor data and send it to your IoT hub

In this section, you deploy and run a sample application on Feather HUZZAH ESP8266. The sample application blinks the LED on Feather HUZZAH ESP8266, and sends the temperature and humidity data collected from the DHT22 sensor to your IoT hub.

### Get the sample application from GitHub

The sample application is hosted on GitHub. Clone the sample repository that contains the sample application from GitHub. To clone the sample repository, follow these steps:

1. Open a command prompt or a terminal window.
1. Go to a folder where you want the sample application to be stored.
1. Run the following command:

   ```bash
   git clone https://github.com/Azure-Samples/iot-hub-feather-huzzah-client-app.git
   ```

Install the package for Feather HUZZAH ESP8266 in the Arduino IDE:

1. Open the folder where the sample application is stored.
1. Open the app.ino file in the app folder in the Arduino IDE.

   ![Open the sample application in Arduino IDE](media/iot-hub-arduino-huzzah-esp8266-get-started/10_arduino-ide-open-sample-app.png)

1. In the Arduino IDE, click **File** > **Preferences**.
1. In the **Preferences** dialog box, click the icon next to the **Additional Boards Manager URLs** box.
1. In the pop-up window, enter the following URL, and then click **OK**.

   `http://arduino.esp8266.com/stable/package_esp8266com_index.json`

   ![Point to a package url in Arduino IDE](media/iot-hub-arduino-huzzah-esp8266-get-started/11_arduino-ide-package-url.png)

1. In the **Preference** dialog box, click **OK**.
1. Click **Tools** > **Board** > **Boards Manager**, and then search for esp8266.

   Boards Manager indicates that ESP8266 with a version of 2.2.0 or later is installed.

   ![The esp8266 package is installed](media/iot-hub-arduino-huzzah-esp8266-get-started/12_arduino-ide-esp8266-installed.png)

1. Click **Tools** > **Board** > **Adafruit HUZZAH ESP8266**.

### Install necessary libraries

1. In the Arduino IDE, click **Sketch** > **Include Library** > **Manage Libraries**.
1. Search for the following library names one by one. For each  library that you find, click **Install**.
   * `AzureIoTHub`
   * `AzureIoTUtility`
   * `AzureIoTProtocol_MQTT`
   * `ArduinoJson`
   * `DHT sensor library`
   * `Adafruit Unified Sensor`

### Don’t have a real DHT22 sensor?

The sample application can simulate temperature and humidity data in case you don’t have a real DHT22 sensor. To set up the sample application to use simulated data, follow these steps:

1. Open the `config.h` file in the `app` folder.
1. Locate the following line of code and change the value from `false` to `true`:
   ```c
   define SIMULATED_DATA true
   ```
   ![Configure the sample application to use simulated data](media/iot-hub-arduino-huzzah-esp8266-get-started/13_arduino-ide-configure-app-use-simulated-data.png)

1. Save the file with `Control-s`.

### Deploy the sample application to Feather HUZZAH ESP8266

1. In the Arduino IDE, click **Tool** > **Port**, and then click the serial port for Feather HUZZAH ESP8266.
1. Click **Sketch** > **Upload** to build and deploy the sample application to Feather HUZZAH ESP8266.

### Enter your credentials

After the upload completes successfully, follow these steps to enter your credentials:

1. In the Arduino IDE, click **Tools** > **Serial Monitor**.
1. In the serial monitor window, notice the two drop-down lists in the lower-right corner.
1. Select **No line ending** for the left drop-down list.
1. Select **115200 baud** for the right drop-down list.
1. In the input box located at the top of the serial monitor window, enter the following information if you are asked to provide them, and then click **Send**.
   * Wi-Fi SSID
   * Wi-Fi password
   * Device connection string

> [!Note]
> The credential information is stored in the EEPROM of Feather HUZZAH ESP8266. If you click the reset button on the Feather HUZZAH ESP8266 board, the sample application asks if you want to erase the information. Enter `Y` to have the information erased. You are asked to provide the information a second time.

### Verify the sample application is running successfully

If you see the following output from the serial monitor window and the blinking LED on Feather HUZZAH ESP8266, the sample application is running successfully.

![Final output in Arduino IDE](media/iot-hub-arduino-huzzah-esp8266-get-started/14_arduino-ide-final-output.png)

## Next steps

You have successfully connected a Feather HUZZAH ESP8266 to your IoT hub, and sent the captured sensor data to your IoT hub. 

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]

