<properties
 pageTitle="Configure your Raspberry Pi 3 device"
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

## 1.1.1 What you will do
Configure your Raspberry Pi 3 for first time use and install the Raspbian OS, a free operating system that is optimized for the Raspberry Pi hardware.

## 1.1.2 What you will learn
In this section, you will learn:
-	How to install Raspbian OS on your Raspberry Pi 3
-	How to power up your Pi using USB cable
-	How to connect your Pi to the network using Ethernet cable or WiFi
-	How to add an LED to the breadboard and connect it to your Pi

## 1.1.3 What you need
To complete this section, you need the following parts from your Raspberry Pi Starter Kit:
- Raspberry Pi 3 board
- 16GB SD/MicroSD Memory Card
- 5V 2A Switching Power Supply with 6' Micro USB Cable
- Breadboard
- Connector wires
- 1x 560 Ohm Resistor
- 1x Diffused 10mm LED
- Ethernet Cable

![Things in your Starter Kit](media/iot-hub-raspberry-pi-lessons/lesson1/starter_kit.jpg)

You also need:
- Access to a wired or wireless connection for the Pi to connect to
- A desktop machine (Windows, Mac, or Linux) to prepare an SD card with the Raspbian OS
- An internet connection to download the tools and software


## 1.1.4 Download Raspbian OS
Prepare your Raspberry Pi 3 SD card to use the Raspbian OS.

- [Download](https://www.sdcard.org/downloads/formatter_4/index.html) the SD Card Formatter utility and follow the instructions to format your SD card
- [Download](https://downloads.raspberrypi.org/raspbian_latest) the zip file for Raspbian OS and unzip into a folder on your computer or laptop 
- Visit [etcher.io](https://www.etcher.io) and download and install the Etcher SD card image utility
- Run Etcher and select the Raspbian image you unzipped on your computer or laptop
- Select the SD card drive. Note that the software may have already selected the correct drive.
Finally, click Burn to transfer the Raspbian OS image to the SD card. Once complete, the utility automatically ejects/unmounts the SD card so it's safe to remove it from the computer

You can now insert the SD card into your Raspberry Pi 3 board.

![Insert the SD card](media/iot-hub-raspberry-pi-lessons/lesson1/insert_sdcard.jpg)

## 1.1.5 Power on your Raspberry Pi 3 device
Power on your Raspberry Pi 3 device by using the provided Micro USB cable and power supply.

![Power on](media/iot-hub-raspberry-pi-lessons/lesson1/micro_usb_power_on.jpg)

    > [AZURE.NOTE] It is important to use a power supply that is at least 2A rated to make sure that your Raspberry Pi 3 works correctly.

## 1.1.6 Connect your Raspberry Pi 3 device to the network
The simplest way to connect your Raspberry Pi 3 device to the network is to use the provided Ethernet cable, but you can also connect using WiFi, if you prefer.

### 1.1.6.1 Connect using Ethernet cable
Use the provided Ethernet cable to connect your Raspberry Pi 3 to your LAN. Make sure that your Pi is connected to the same network (for example, connected to the same switch) as your computer. The two LEDs on your Pi turn on if the connection is established.

![Connect using Ethernet cable](media/iot-hub-raspberry-pi-lessons/lesson1/connect_ethernet.jpg)

### 1.1.6.2	Connect using WiFi

Follow the [instructions](https://www.raspberrypi.org/learning/software-guide/wifi/) available from the Raspberry Pi Foundation to connect your Raspberry Pi 3 to your WiFi network. This requires you to first connect a monitor and keyboard to your Pi.

## 1.1.7 Connect the LED to your Raspberry Pi 3 device
To complete this section, use the provided breadboard, connector wires, LED, and resistor. You will connect them to the [General-purpose input/output](https://www.raspberrypi.org/documentation/usage/gpio/) (GPIO) ports of your Raspberry Pi 3. 

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
[1.2 Get the tools](iot-hub-raspberry-pi-node-lesson1-get-the-tools-win32.md)



