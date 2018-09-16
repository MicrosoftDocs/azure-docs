---
title: Raspberry Pi to cloud (Python) - Connect Raspberry Pi to Azure IoT Hub | Microsoft Docs
description: Learn how to setup and connect Raspberry Pi to Azure IoT Hub for Raspberry Pi to send data to the Azure cloud platform in this tutorial.
author: rangv
manager: 
keywords: azure iot raspberry pi, raspberry pi iot hub, raspberry pi send data to cloud, raspberry pi to cloud
ms.service: iot-hub
services: iot-hub
ms.devlang: python
ms.topic: conceptual
ms.date: 04/11/2018
ms.author: rangv
---

# Connect Raspberry Pi to Azure IoT Hub (Python)

[!INCLUDE [iot-hub-get-started-device-selector](../../includes/iot-hub-get-started-device-selector.md)]

In this tutorial, you begin by learning the basics of working with Raspberry Pi that's running Raspbian. You then learn how to seamlessly connect your devices to the cloud by using [Azure IoT Hub](about-iot-hub.md). For Windows 10 IoT Core samples, go to the [Windows Dev Center](http://www.windowsondevices.com/).

Don't have a kit yet? Try [Raspberry Pi online simulator](iot-hub-raspberry-pi-web-simulator-get-started.md). Or buy a new kit [here](https://azure.microsoft.com/develop/iot/starter-kits).

## What you do

* Create an IoT hub.
* Register a device for Pi in your IoT hub.
* Setup Raspberry Pi.
* Run a sample application on Pi to send sensor data to your IoT hub.

Connect Raspberry Pi to an IoT hub that you create. Then you run a sample application on Pi to collect temperature and humidity data from a BME280 sensor. Finally, you send the sensor data to your IoT hub.

## What you learn

* How to create an Azure IoT hub and get your new device connection string.
* How to connect Pi with a BME280 sensor.
* How to collect sensor data by running a sample application on Pi.
* How to send sensor data to your IoT hub.

## What you need

![What you need](media/iot-hub-raspberry-pi-kit-c-get-started/0_starter_kit.jpg)

* The Raspberry Pi 2 or Raspberry Pi 3 board.
* An active Azure subscription. If you don't have an Azure account, [create a free Azure trial account](https://azure.microsoft.com/free/) in just a few minutes.
* A monitor, a USB keyboard, and mouse that connect to Pi.
* A Mac or a PC that is running Windows or Linux.
* An Internet connection.
* A 16 GB or above microSD card.
* A USB-SD adapter or microSD card to burn the operating system image onto the microSD card.
* A 5-volt 2-amp power supply with the 6-foot micro USB cable.

The following items are optional:

* An assembled Adafruit BME280 temperature, pressure, and humidity sensor.
* A breadboard.
* 6 F/M jumper wires.
* A diffused 10-mm LED.


> [!NOTE] 
These items are optional because the code sample support simulated sensor data.


[!INCLUDE [iot-hub-get-started-create-hub-and-device](../../includes/iot-hub-get-started-create-hub-and-device.md)]

## Set up Raspberry Pi

### Install the Raspbian operating system for Pi

Prepare the microSD card for installation of the Raspbian image.

1. Download Raspbian.
   1. [Download Raspbian Jessie with Desktop](https://www.raspberrypi.org/downloads/raspbian/) (the .zip file).
   1. Extract the Raspbian image to a folder on your computer.
1. Install Raspbian to the microSD card.
   1. [Download and install the Etcher SD card burner utility](https://etcher.io/).
   1. Run Etcher and select the Raspbian image that you extracted in step 1.
   1. Select the microSD card drive. Note that Etcher may have already selected the correct drive.
   1. Click Flash to install Raspbian to the microSD card.
   1. Remove the microSD card from your computer when installation is complete. It's safe to remove the microSD card directly because Etcher automatically ejects or unmounts the microSD card upon completion.
   1. Insert the microSD card into Pi.

### Enable SSH and I2C

1. Connect Pi to the monitor, keyboard and mouse, start Pi and then log in Raspbian by using `pi` as the user name and `raspberry` as the password.
1. Click the Raspberry icon > **Preferences** > **Raspberry Pi Configuration**.

   ![The Raspbian Preferences menu](media/iot-hub-raspberry-pi-kit-c-get-started/1_raspbian-preferences-menu.png)

1. On the **Interfaces** tab, set **I2C** and **SSH** to **Enable**, and then click **OK**. If you don't have physical sensors and want to use simulated sensor data, this step is optional.

   ![Enable I2C and SSH on Raspberry Pi](media/iot-hub-raspberry-pi-kit-c-get-started/2_enable-spi-ssh-on-raspberry-pi.png)

> [!NOTE] 
To enable SSH and I2C, you can find more reference documents on [raspberrypi.org](https://www.raspberrypi.org/documentation/remote-access/ssh/) and [RASPI-CONFIG](https://www.raspberrypi.org/documentation/configuration/raspi-config.md).

### Connect the sensor to Pi

Use the breadboard and jumper wires to connect an LED and a BME280 to Pi as follows. If you don’t have the sensor, [skip this section](#connect-pi-to-the-network).

![The Raspberry Pi and sensor connection](media/iot-hub-raspberry-pi-kit-node-get-started/3_raspberry-pi-sensor-connection.png)

The BME280 sensor can collect temperature and humidity data. And the LED will blink if there is a communication between device and the cloud. 

For sensor pins, use the following wiring:

| Start (Sensor & LED)     | End (Board)            | Cable Color   |
| -----------------------  | ---------------------- | ------------: |
| VDD (Pin 5G)             | 3.3V PWR (Pin 1)       | White cable   |
| GND (Pin 7G)             | GND (Pin 6)            | Brown cable   |
| SDI (Pin 10G)            | I2C1 SDA (Pin 3)       | Red cable     |
| SCK (Pin 8G)             | I2C1 SCL (Pin 5)       | Orange cable  |
| LED VDD (Pin 18F)        | GPIO 24 (Pin 18)       | White cable   |
| LED GND (Pin 17F)        | GND (Pin 20)           | Black cable   |

Click to view [Raspberry Pi 2 & 3 Pin mappings](https://developer.microsoft.com/windows/iot/docs/pinmappingsrpi) for your reference.

After you've successfully connected BME280 to your Raspberry Pi, it should be like below image.

![Connected Pi and BME280](media/iot-hub-raspberry-pi-kit-node-get-started/4_connected-pi.jpg)

### Connect Pi to the network

Turn on Pi by using the micro USB cable and the power supply. Use the Ethernet cable to connect Pi to your wired network or follow the [instructions from the Raspberry Pi Foundation](https://www.raspberrypi.org/learning/software-guide/wifi/) to connect Pi to your wireless network. After your Pi has been successfully connected to the network, you need to take a note of the [IP address of your Pi](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup/finding-your-pis-ip-address).

![Connected to wired network](media/iot-hub-raspberry-pi-kit-node-get-started/5_power-on-pi.jpg)

> [!NOTE]
> Make sure that Pi is connected to the same network as your computer. For example, if your computer is connected to a wireless network while Pi is connected to a wired network, you might not see the IP address in the devdisco output.

## Run a sample application on Pi

### Install the prerequisite packages

Use one of the following SSH clients from your host computer to connect to your Raspberry Pi.
   
   **Windows Users**
   1. Download and install [PuTTY](http://www.putty.org/) for Windows. 
   1. Copy the IP address of your Pi into the Host name (or IP address) section and select SSH as the connection type.
   
   
   **Mac and Ubuntu Users**
   
   Use the built-in SSH client on Ubuntu or macOS. You might need to run `ssh pi@<ip address of pi>` to connect Pi via SSH.
   > [!NOTE] 
   The default username is `pi` , and the password is `raspberry`.


### Configure the sample application

1. Clone the sample application by running the following command:

   ```bash
   cd ~
   git clone https://github.com/Azure-Samples/iot-hub-python-raspberrypi-client-app.git
   ```
1. Open the config file by running the following commands:

   ```bash
   cd iot-hub-python-raspberrypi-client-app
   nano config.py
   ```

   There are 5 macros in this file you can configurate. The first one is `MESSAGE_TIMESPAN`, which defines the time interval (in milliseconds) between two messages that send to cloud. The second one `SIMULATED_DATA`, which is a Boolean value for whether to use simulated sensor data or not. `I2C_ADDRESS` is the I2C address which your BME280 sensor is connected. `GPIO_PIN_ADDRESS` is the GPIO address for your LED. The last one is `BLINK_TIMESPAN`, which defined the timespan when your LED is turned on in milliseconds.

   If you **don't have the sensor**, set the `SIMULATED_DATA` value to `True` to make the sample application create and use simulated sensor data.

1. Save and exit by pressing Control-O > Enter > Control-X.

### Build and run the sample application

1. Build the sample application by running the following command. Because the Azure IoT SDKs for Python are wrappers on top of the Azure IoT Device C SDK, you will need to compile the C libraries if you want or need to generate the Python libraries from source code.

   ```bash
   sudo chmod u+x setup.sh
   sudo ./setup.sh
   ```
   > [!NOTE] 
   You can also specify the version you want by running `sudo ./setup.sh [--python-version|-p] [2.7|3.4|3.5]`. If you run script without parameter, the script will automatically detect the version of python installed (Search sequence 2.7->3.4->3.5). Make sure your Python version keeps consistent during building and running. 
   
   > [!NOTE] 
   On building the Python client library (iothub_client.so) on Linux devices that have less than 1GB RAM, you may see build getting stuck at 98% while building iothub_client_python.cpp as shown below `[ 98%] Building CXX object python/src/CMakeFiles/iothub_client_python.dir/iothub_client_python.cpp.o`. If you run into this issue, check the memory consumption of the device using `free -m command` in another terminal window during that time. If you are running out of memory while compiling iothub_client_python.cpp file, you may have to temporarily increase the swap space to get more available memory to successfully build the Python client-side device SDK library.
   
1. Run the sample application by running the following command:

   ```bash
   python app.py '<your Azure IoT hub device connection string>'
   ```

   > [!NOTE] 
   Make sure you copy-paste the device connection string into the single quotes. And if you use the python 3, then you can use the command `python3 app.py '<your Azure IoT hub device connection string>'`.


   You should see the following output that shows the sensor data and the messages that are sent to your IoT hub.

   ![Output - sensor data sent from Raspberry Pi to your IoT hub](media/iot-hub-raspberry-pi-kit-c-get-started/success.png
)

## Next steps

You’ve run a sample application to collect sensor data and send it to your IoT hub. To see the messages that your Raspberry Pi has sent to your IoT hub or send messages to your Raspberry Pi, see the [Use Azure IoT Toolkit extension for Visual Studio Code to send and receive messages between your device and IoT Hub](iot-hub-vscode-iot-toolkit-cloud-device-messaging.md).

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
