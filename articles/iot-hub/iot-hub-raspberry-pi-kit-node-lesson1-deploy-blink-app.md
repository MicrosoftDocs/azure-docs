<properties
 pageTitle="Create and deploy the blink application | Microsoft Azure"
 description="Clone the sample Node.js application from Github, and gulp to deploy this application to your Raspberry Pi 3 board. This sample application blinks the LED connected to the board every two seconds."
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

# 1.3 Create and deploy the blink application

## 1.3.1 What you will do

Clone the sample Node.js application from Github, and use the gulp tool to deploy the sample application to your Raspberry Pi 3. The sample application blinks the LED connected to the board every two seconds. If you meet any problems, seek solutions in the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## 1.3.2 What you will learn

- How to use the `device-discover-cli` tool to retrieve networking information about your Pi.
- How to deploy and run the sample application on your Pi.
- How to deploy and debug applications running remotely on your Pi.

## 1.3.3 What you need

You must have successfully completed the follow sections in Lesson 1:

- [Configure your device](iot-hub-raspberry-pi-kit-node-lesson1-configure-your-device.md)
- [Get the tools](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-win32.md)

## 1.3.4 Obtain the IP address and host name of your Pi

Open a command prompt in Windows or a terminal window in macOS or Ubuntu, and then run the following command:

```bash
devdisco list --eth
```

You should see an output that is similar to the following:

![device discovery](media/iot-hub-raspberry-pi-lessons/lesson1/device_discovery.png)

Take note of the `IP address` and `hostname` of your Pi. You need this information later in this section.

> [AZURE.NOTE] Make sure that your Pi is connected to the same network as your computer. For example, if your computer is connected to a wireless network while your Pi is connected to a wired network, you may not see the IP address in the devdisco output.

## 1.3.5 Clone the sample application

To open the sample code, follow these steps:

1. Clone the sample repository from Github by running the following command:

    ```bash
    git clone https://github.com/Azure-Samples/iot-hub-node-raspberrypi-getting-started.git
    ```

2. Open the sample application in Visual Studio Code by running the following commands:

    ```bash
    cd iot-hub-node-raspberrypi-getting-started
    cd Lesson1
    code .
    ```

![Repo structure](media/iot-hub-raspberry-pi-lessons/lesson1/vscode-blink-mac.png)

The `app.js` file in the `app` subfolder is the key source file that contains the code to control the LED.

### 1.3.6 Install application dependencies

Install the libraries and other modules you need for the sample application by running the following command:

```bash
npm install
```

## 1.3.7 Configure the device connection

To configure the device connection, follow these steps:

1. Generate the device configuration file by running the following command:

    ```bash
    gulp init
    ```

    The configuration file `config-raspberrypi.json` contains the user credentials you use to log in your Pi. To avoid the leak of user credentials, the configuration file is generated in the subfolder `.iot-hub-getting-started` of the home folder on your computer.

2. Open the device configuration file in Visual Studio Code by running the following command:

    ```bash
    # For Windows command prompt
    code %USERPROFILE%\.iot-hub-getting-started\config-raspberrypi.json

    # For macOS or Ubuntu
    code ~/.iot-hub-getting-started/config-raspberrypi.json
    ```

3. Replace the placeholder `[device hostname or IP address]` with the IP address or the host name that you get in section 1.3.4.

    ![Config.json](media/iot-hub-raspberry-pi-lessons/lesson1/vscode-config-mac.png)

Congratulations! You've successfully created the first sample application for your Pi.

## 1.3.8 Deploy and run the sample application

### 1.3.8.1 Install Node.js and NPM on your Pi

Install Node.js and NPM on your Pi by running the following command:

```bash
gulp install-tools
```

It might take ten minutes to complete the first time you run this task.

### 1.3.8.2 Deploy and run the sample app

Deploy and run the sample application on by running the following command:

```bash
gulp deploy && gulp run
```

### 1.3.8.3 Verify the app works

You should now see the LED on your Pi blinking every two seconds.  If you don’t see the LED blinking, see the [troubleshooting guide](iot-hub-raspberry-pi-kit-node-troubleshooting.md) for solutions to common problems.
![LED blinking](media/iot-hub-raspberry-pi-lessons/lesson1/led_blinking.jpg)

> [AZURE.NOTE] Use `Ctrl + C` to terminate the application.

## 1.3.9 Summary

You've installed the required tools to work with your Pi and deployed a sample application to your Pi to blink the LED. You can now move on to the next lesson to create, deploy, and run another sample application that connects your Pi to Azure IoT Hub to send and receive messages.

## Next Steps

You are now ready to start Lesson 2 that begins with [Get the Azure tools](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-win32.md)
