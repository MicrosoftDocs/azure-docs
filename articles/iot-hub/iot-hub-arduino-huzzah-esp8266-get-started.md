---
title: ESP8266 to cloud - Connect Feather HUZZAH ESP8266 to Azure IoT Hub | Microsoft Docs
description: Learn how to setup and connect Adafruit Feather HUZZAH ESP8266 to Azure IoT Hub for it to send data to the Azure cloud platform in this tutorial.
author: wesmc7777
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.tgt_pltfrm: arduino
ms.date: 04/11/2018
ms.author: wesmc
---

# Connect Adafruit Feather HUZZAH ESP8266 to Azure IoT Hub in the cloud

[!INCLUDE [iot-hub-get-started-device-selector](../../includes/iot-hub-get-started-device-selector.md)]

![Connection between DHT22, Feather HUZZAH ESP8266, and IoT Hub](./media/iot-hub-arduino-huzzah-esp8266-get-started/1_connection-hdt22-feather-huzzah-iot-hub.png)

## What you do

Connect Adafruit Feather HUZZAH ESP8266 to an IoT hub that you create. Then you run a sample application on ESP8266 to collect the temperature and humidity data from a DHT22 sensor. Finally, you send the sensor data to your IoT hub.

> [!NOTE]
> If you're using other ESP8266 boards, you can still follow these steps to connect it to your IoT hub. Depending on the ESP8266 board you're using, you might need to reconfigure the `LED_PIN`. For example, if you're using ESP8266 from AI-Thinker, you might change it from `0` to `2`. Don't have a kit yet? Get it from the [Azure website](https://azure.com/iotstarterkits).

## What you learn

* How to create an IoT hub and register a device for Feather HUZZAH ESP8266
* How to connect Feather HUZZAH ESP8266 with the sensor and your computer
* How to collect sensor data by running a sample application on Feather HUZZAH ESP8266
* How to send the sensor data to your IoT hub

## What you need

![Parts needed for the tutorial](./media/iot-hub-arduino-huzzah-esp8266-get-started/2_parts-needed-for-the-tutorial.png)

To complete this operation, you need the following parts from your Feather HUZZAH ESP8266 Starter Kit:

* The Feather HUZZAH ESP8266 board
* A Micro USB to Type A USB cable

You also need the following things for your development environment:

* An active Azure subscription. If you don't have an Azure account, [create a free Azure trial account](https://azure.microsoft.com/free/) in just a few minutes.
* A Mac or PC that is running Windows or Ubuntu.
* A wireless network for Feather HUZZAH ESP8266 to connect to.
* An Internet connection to download the configuration tool.
* [Visual Studio Code extension for Arduino](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-arduino).

> [!Note]
> The Arduino IDE version used by Visual Studio Code extension for Arduino has to be version 1.6.8 or later. Earlier versions don't work with the AzureIoT library.

The following items are optional in case you don’t have a sensor. You also have the option of using simulated sensor data.

* An Adafruit DHT22 temperature and humidity sensor
* A breadboard
* M/M jumper wires

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a new device in the IoT hub

[!INCLUDE [iot-hub-include-create-device](../../includes/iot-hub-include-create-device.md)]

## Connect Feather HUZZAH ESP8266 with the sensor and your computer

In this section, you connect the sensors to your board. Then you plug in your device to your computer for further use.

### Connect a DHT22 temperature and humidity sensor to Feather HUZZAH ESP8266

Use the breadboard and jumper wires to make the connection as follows. If you don’t have a sensor, skip this section because you can use simulated sensor data instead.

![Connections reference](./media/iot-hub-arduino-huzzah-esp8266-get-started/17_connections_on_breadboard.png)

For sensor pins, use the following wiring:

| Start (Sensor)           | End (Board)            | Cable Color   |
| -----------------------  | ---------------------- | ------------  |
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

2. Add the user to the group by running the following command:

   ```bash
   sudo usermod -a -G <group-owner-name> <username>
   ```

   `<group-owner-name>` is the group owner name you obtained in the previous step. `<username>` is your Ubuntu user name.

3. Sign out of Ubuntu, and then sign in again for the change to appear.

## Collect sensor data and send it to your IoT hub

In this section, you deploy and run a sample application on Feather HUZZAH ESP8266. The sample application blinks the LED on Feather HUZZAH ESP8266, and sends the temperature and humidity data collected from the DHT22 sensor to your IoT hub.

### Get the sample application from GitHub

The sample application is hosted on GitHub. Clone the sample repository that contains the sample application from GitHub. To clone the sample repository, follow these steps:

1. Open a command prompt or a terminal window.

2. Go to a folder where you want the sample application to be stored.

3. Run the following command:

   ```bash
   git clone https://github.com/Azure-Samples/iot-hub-feather-huzzah-client-app.git
   ```

   Next, install the package for Feather HUZZAH ESP8266 in Visual Studio Code.

4. Open the folder where the sample application is stored.

5. Open the app.ino file in the app folder in the Visual Studio Code.

   ![Open the sample application in Visual Studio Code](media/iot-hub-arduino-huzzah-esp8266-get-started/10_vscode-open-sample-app.png)

6. In the Visual Studio Code, enter `F1`.

7. Type **Arduino** and select **Arduino: Board Manager**.

8. In the **Arduino Board Manager** tab, click **Additional URLs**.

   ![VS Code Arduino Board Manager](media/iot-hub-arduino-huzzah-esp8266-get-started/11_vscode-arduino-board-manager.png)

9. In the **User Settings** window, copy and paste the following at the end of the file

   ```json
   "arduino.additionalUrls": "https://arduino.esp8266.com/stable/package_esp8266com_index.json"
   ```

   ![Configure Arduino package URL in VS Code](media/iot-hub-arduino-huzzah-esp8266-get-started/12_vscode-package-url.png)

10. Save the file and close the **User Settings** tab.

11. Click **Refresh Package Indexes**. After the refresh finishes, search for **esp8266**.

12. Click **Install** button for esp8266.

    Boards Manager indicates that ESP8266 with a version of 2.2.0 or later is installed.

    ![The esp8266 package is installed](media/iot-hub-arduino-huzzah-esp8266-get-started/13_vscode-esp8266-installed.png)

13. Enter `F1`, then type **Arduino** and select **Arduino: Board Config**.

14. Click box for **Selected Board:** and type **esp8266**, then select **Adafruit HUZZAH ESP8266 (esp8266)**.

    ![Select esp8266 board](media/iot-hub-arduino-huzzah-esp8266-get-started/14_vscode-select-esp8266.png)

### Install necessary libraries

1. In the Visual Studio Code, enter `F1`, then type **Arduino** and select **Arduino: Library Manager**.

2. Search for the following library names one by one. For each library that you find, click **Install**.
   * `AzureIoTHub`
   * `AzureIoTUtility`
   * `AzureIoTProtocol_MQTT`
   * `ArduinoJson`
   * `DHT sensor library`
   * `Adafruit Unified Sensor`

### Don’t have a real DHT22 sensor?

The sample application can simulate temperature and humidity data in case you don’t have a real DHT22 sensor. To set up the sample application to use simulated data, follow these steps:

1. Open the `config.h` file in the `app` folder.

2. Locate the following line of code and change the value from `false` to `true`:

   ```c
   define SIMULATED_DATA true
   ```

   ![Configure the sample application to use simulated data](media/iot-hub-arduino-huzzah-esp8266-get-started/15_vscode-configure-app-use-simulated-data.png)

3. Save the file.

### Deploy the sample application to Feather HUZZAH ESP8266

1. In the Visual Studio Code, click **\<Select Serial Port>** on the status bar, and then click the serial port for Feather HUZZAH ESP8266.

2. Enter `F1`, then type **Arduino** and select **Arduino: Upload** to build and deploy the sample application to Feather HUZZAH ESP8266.

### Enter your credentials

After the upload completes successfully, follow these steps to enter your credentials:

1. Open Arduino IDE, click **Tools** > **Serial Monitor**.

2. In the serial monitor window, notice the two drop-down lists in the lower-right corner.

3. Select **No line ending** for the left drop-down list.

4. Select **115200 baud** for the right drop-down list.

5. In the input box located at the top of the serial monitor window, enter the following information if you are asked to provide them, and then click **Send**.

   * Wi-Fi SSID
   * Wi-Fi password
   * Device connection string

> [!Note]
> The credential information is stored in the EEPROM of Feather HUZZAH ESP8266. If you click the reset button on the Feather HUZZAH ESP8266 board, the sample application asks if you want to erase the information. Enter `Y` to have the information erased. You are asked to provide the information a second time.

### Verify the sample application is running successfully

If you see the following output from the serial monitor window and the blinking LED on Feather HUZZAH ESP8266, the sample application is running successfully.

![Final output in Arduino IDE](media/iot-hub-arduino-huzzah-esp8266-get-started/16_arduino-ide-final-output.png)

## Read the messages received by your hub

One way to monitor messages received by your IoT hub from your device is to use the Azure IoT Tools for Visual Studio Code. To learn more, see [Use Azure IoT Tools for Visual Studio Code to send and receive messages between your device and IoT Hub](iot-hub-vscode-iot-toolkit-cloud-device-messaging.md).

For more ways to process data sent by your device, continue on to the next section.

## Next steps

You have successfully connected a Feather HUZZAH ESP8266 to your IoT hub, and sent the captured sensor data to your IoT hub.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]