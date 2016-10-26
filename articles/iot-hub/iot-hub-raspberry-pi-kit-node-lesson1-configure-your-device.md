<properties
 pageTitle="Configure your device | Microsoft Azure"
 description="Configure your Raspberry Pi 3 for first-time use and install the Raspbian OS, a free operating system that is optimized for the Raspberry Pi hardware."
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
 ms.date="10/21/2016"
 ms.author="xshi"/>

# Configure your device

## What you will do

Configure your Pi for first-time use and install the Raspbian operating system, a free operating system that is optimized for the Raspberry Pi hardware. If you have any problems, you can seek solutions on the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## What you will learn

In this section, you will learn:

- How to install Raspbian on your Pi.
- How to power up your Pi by using a USB cable.
- How to connect your Pi to the network by using an Ethernet cable or wireless network.
- How to add an LED to the breadboard and connect it to your Pi.

## What you will need

To complete this section, you need the following parts from your Raspberry Pi 3 Starter Kit:

- The Raspberry Pi 3 board
- The 16-GB microSD card
- The 5-volt 2-amp power supply with the 6-foot micro USB cable
- The breadboard
- Connector wires
- A 560-ohm resistor
- A diffused 10-mm LED
- The Ethernet cable

![Things in your Starter Kit](media/iot-hub-raspberry-pi-lessons/lesson1/starter_kit.jpg)

You also need:

- A wired or wireless connection for your Pi to connect to.
- A USB-SD adapter or miniSD card to burn the OS image onto the microSD card.
- A computer running Windows, Mac, or Linux. The computer is used to install Raspbian on the microSD card.
- An Internet connection to download the necessary tools and software.

## Install Raspbian on the microSD card

Prepare the microSD card for installation of the Raspbian image.

1. Download Raspbian.
  1. [Download](https://www.raspberrypi.org/downloads/raspbian/) the .zip file for Raspbian Jessie with Pixel.
  2. Extract the Raspbian image to a folder on your computer.
2. Install Raspbian to the microSD card.
  1. [Download](https://www.etcher.io) and install the Etcher SD card burner utility.
  2. Run Etcher and select the Raspbian image that you extracted in Step 1.
  3. Select the microSD card drive.
    Note: Etcher may have already selected the correct drive.
  4. Click **Flash** to install Raspbian to the microSD card.
  5. Remove the microSD card from your computer when installation is complete.
    Note: It is safe to remove the microSD card directly because Etcher automatically ejects or unmounts the microSD card upon completion.
  6. Insert the microSD card into your Pi.

![Insert the SD card](media/iot-hub-raspberry-pi-lessons/lesson1/insert_sdcard.jpg)

## Turn on your Pi

Turn on your Pi by using the micro USB cable and the power supply.

![Turn on](media/iot-hub-raspberry-pi-lessons/lesson1/micro_usb_power_on.jpg)

> [AZURE.NOTE] It is important to use the power supply in the kit that is at least 2A to make sure that your Raspberry has enough power to work correctly.

## Connect your Raspberry Pi 3 to the network

You can connect your Pi to a wired network or to a wireless network. Make sure that your Pi is connected to the same network as your computer. For example, you can connect your Pi to the same switch that your computer is connected to.

### Connect to a wired network

Use the Ethernet cable to connect your Pi to your wired network. The two LEDs on your Pi turn on if the connection is established.

![Connect by using an Ethernet cable](media/iot-hub-raspberry-pi-lessons/lesson1/connect_ethernet.jpg)

### Connect to a wireless network

Follow the [instructions](https://www.raspberrypi.org/learning/software-guide/wifi/) from the Raspberry Pi Foundation to connect your Pi to your wireless network. These instructions require you to first connect a monitor and a keyboard to your Pi.

## Connect the LED to your Pi

To complete this task, use the [breadboard](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard), the connector wires, the LED, and the resistor. Connect them to the [general-purpose input/output](https://www.raspberrypi.org/documentation/usage/gpio/) (GPIO) ports of your Pi.

![Breadboard, LED, and Resistor](media/iot-hub-raspberry-pi-lessons/lesson1/breadboard_led_resistor.jpg)

1. Connect the shorter leg of the LED to **GPIO GND (Pin 6)**.
2. Connect the longer leg of the LED to one leg of the resistor.
3. Connect the other leg of the resistor to **GPIO 4 (Pin 7)**.

Note that the LED polarity is important. This polarity setting is commonly known as Active Low.

![Pinout](media/iot-hub-raspberry-pi-lessons/lesson1/pinout_breadboard.png)

Congratulations! You've successfully configured your Pi.

## Summary

In this section, you’ve learned how to configure your Pi by installing Raspbian, connecting your Pi to a network, and connecting an LED to your Pi. Note that the LED doesn't yet light up. In the next section, you install the necessary tools and software in preparation for running a sample application on your Pi.

![Hardware is ready](media/iot-hub-raspberry-pi-lessons/lesson1/hardware_ready.jpg)

## Next steps

[Get the tools](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-win32.md)
