<properties
 pageTitle="Configure your Raspberry Pi 3 device | Microsoft Azure"
 description="Configure your Raspberry Pi 3 for first time use and install the Raspbian OS, a free operating system that is optimized for the Raspberry Pi hardware."
 services="iot-hub"
 documentationCenter=""
 authors="shizn"
 manager="timlt"
 tags=""
 keywords=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/28/2016" 
 ms.author="xshi"/>

# 1.1 Configure your device

## 1.1.1 What will you do
Configure your Pi for the first time use and install the Raspbian operating system, a free operating system that is optimized for the Raspberry Pi hardware.

> [AZURE.NOTE] For Windows 10 IoT Core samples, visit [windowsondevices.com](http://www.windowsondevices.com/)

## 1.1.2 What will you learn
In this section, you will learn:

- How to install Raspbian on your Pi
- How to power up your Pi using a USB cable
- How to connect your Pi to the network using an Ethernet cable or Wi-Fi
- How to add an LED to the breadboard and connect it to your Pi

## 1.1.3 What do you need
To complete this section, you need the following parts from your Raspberry Pi 3 Starter Kit:

- The Raspberry Pi 3 board
- The 16GB MicroSD card
- The 5V 2A power supply with the 6 feet micro USB cable
- The breadboard
- Connector wires
- An 560 Ohm resistor
- An diffused 10mm LED
- The Ethernet cable

![Things in your Starter Kit](media/iot-hub-raspberry-pi-lessons/lesson1/starter_kit.jpg)

You also need:

- A wired or wireless connection for your Pi to connect to
- A computer running Windows, Mac or Linux. The computer is used to install Raspbian on the MicroSD card.
- An Internet connection to download the necesary tools and software


## 1.1.4 Install Raspbian on the MicroSD card
Prepare the MicroSD card to write the Raspbian image to.

1. Download Raspbian
  1. [Download](https://downloads.raspberrypi.org/raspbian_latest) the zip file for Raspbian.
  2. Unzip the Raspbian image into a folder on your computer.
2. Install Raspbian to the MicroSD card
  1. [Download](https://www.etcher.io) and install the Etcher SD card burner utility.
  2. Run Etcher and select the Raspbian image you unzipped on your computer o.
- Select the SD card drive. Note that the software may have already selected the correct drive.
Finally, click Burn to transfer the Raspbian OS image to the SD card. Once complete, the utility automatically ejects/unmounts the SD card so it's safe to remove it from the computer.

You can now insert the SD card into your Raspberry Pi 3 board.

![Insert the SD card](media/iot-hub-raspberry-pi-lessons/lesson1/insert_sdcard.jpg)

## 1.1.5 Power on your Raspberry Pi
Power on your Raspberry Pi 3 device by using the provided Micro USB cable and power supply.

![Power on](media/iot-hub-raspberry-pi-lessons/lesson1/micro_usb_power_on.jpg)

> [AZURE.NOTE] It is important to use a power supply that is at least 2A rated to make sure that your Raspberry Pi 3 works correctly.

## 1.1.6 Connect your Raspberry Pi 3 to the network
The simplest way to connect your Raspberry Pi 3 device to the network is to use the provided Ethernet cable, but you can also connect using WiFi, if you prefer.

### 1.1.6.1 Connect using Ethernet cable
Use the provided Ethernet cable to connect your Raspberry Pi 3 to your LAN. Make sure that your Pi is connected to the same network (for example, connected to the same switch) as your computer. The two LEDs on your Pi turn on if the connection is established.

![Connect using Ethernet cable](media/iot-hub-raspberry-pi-lessons/lesson1/connect_ethernet.jpg)

### 1.1.6.2	Connect using WiFi

Follow the [instructions](https://www.raspberrypi.org/learning/software-guide/wifi/) available from the Raspberry Pi Foundation to connect your Raspberry Pi 3 to your WiFi network. This requires you to first connect a monitor and keyboard to your Pi.

## 1.1.7 Connect the LED to your Raspberry Pi
To complete this section, use the provided [breadboard](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard), connector wires, LED, and resistor. You will connect them to the [General-purpose input/output](https://www.raspberrypi.org/documentation/usage/gpio/) (GPIO) ports of your Raspberry Pi 3. 

![Breadboard, LED and Resistor](media/iot-hub-raspberry-pi-lessons/lesson1/breadboard_led_resistor.jpg)

1. Connect the shorter leg of the LED to **GPIO GND (Pin 6)**
2. Connect the longer leg of the LED to the resistor.
3. Connect the other end of the resistor to **GPIO 04 (Pin 7)** on the board.
4. Note that the polarity of the LED is important. (This configuration is commonly known as Active Low)

![Pinout](media/iot-hub-raspberry-pi-lessons/lesson1/pinout_breadboard.png)

## 1.1.8 Summary
You have configured your Raspberry Pi 3 board with Raspbian OS, connected it to the network and attached an LED to it. Note that the LED does not yet light up. In the next section you install the necessary tools and software in preparation for running a sample application on your Pi.

![Hardware is ready](media/iot-hub-raspberry-pi-lessons/lesson1/hardware_ready.jpg)

## Next Steps
[1.2 Get the tools](iot-hub-raspberrypikit-node-lesson1-get-the-tools-win32.md)



