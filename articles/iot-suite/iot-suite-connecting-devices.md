<properties
   pageTitle="Connecting your device to the preconfigured solution"
   description="Connecting your device to the preconfigured solution"
   services="Azure IoT Suite"
   documentationCenter="dev-center-name"
   authors="hegate"
   manager="jamesosb"
   editor=""/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="hegate;semicolon separates two or more"/>


# Connecting your device to the Azure IoT Suite remote monitoring solution


## Table of Contents
-   [1. Scenario overview ](#Introduction)
-   [2. Prerequisites](#)
-   [3. Sending data to the remote monitoring solution using C](#)
    -   [3.1 Running on Linux](#)
    -   [3.2 Running on Windows](#)
    -   [3.3 Running on mbedOS](#)
-   [4. Sending data to the remote monitoring using Node.js](#e)
-   [5. Command and control your device from the dashboard](#e)
-   [6. Extending the solution](#S)
-   [7. Links and resources](#St)


## Scenario overview

In this example, we will generate external and internal temperature from the device, to match with the business scenario of our preconfigured solution. We are not using real sensors for simplicity purposes, but we encourage you as a next step to connect your favorite sensor and send real date. Please visit the resources linked on the Extending your solution section for more information.

## Prerequisites

##### Provision your IoT Suite

If you haven't provisioned your remote monitoring preconfigured solution yet, you can provision it [here](www.internetofyourthigns.com).


##### Provision your device in the remote monitoring solution

To get your device connected to the preconfigured solution, you need to get the device credentials from the dashboard. This will be then used in your client application so that your device can be identified. Follow this steps (note: if you have already provisioned a device on your solution, you can skip this step):

1.  On the lower left corner of the dashboard, click on "Add a device".
    ![][1]
2.  On Custom Device, click on the "Add new" button.

    ![][2]
3.  Choose your own Device ID by entering a name such as realdevice1, and click on Check ID to make sure that name hasn't been used yet.
	![][3]

5. Please take note of the credentials provided (Device ID, IoT Hub Hostname and Device Key). You will need them later in your client application to connect your device to the solution.
	![][4]
6. Ensure your device is displayed correctly on the devices section. The status will be "Pending". This is expected until the device to cloud connection is established.

    ![][5]

[1]: ./media/iot-suite-connecting-devices/suite0.png
[2]: ./media/iot-suite-connecting-devices/suite1.png
[3]: ./media/iot-suite-connecting-devices/suite2.png
[4]: ./media/iot-suite-connecting-devices/suite3.png
[5]: ./media/iot-suite-connecting-devices/suite5.png



Now choose which language would you like to use to continue your sample. In this tutorial, we've created sample code for C and node.js but you could also implement it in C Sharp and Java.

## Sending data to the remote monitoring solution using C


### Running your device on Linux

1. Setup your environment: if you've never used our Device SDK before,  learn  how to set up your environment on Linux [here](https://github.com/Azure/azure-iot-sdks/blob/develop/c/doc/devbox_setup.md#linux).

1. Open the file **c/serializer/samples/serializer/remote_monitoring.c** in a text editor.

2. Locate the following code in the file:
    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```
3. Replace "[Device Id]", "[Device Key], with the data your device data.

4. Use the IoT Hub Hostname device data to fill in IoTHub name and IoTHub Suffix. To do this, you need to split it in to like this:

    If your IoT Hub Hostname is Contoso.azure-devices.net, Contoso will be your IoTHub name and everything after it will the the Suffix. It should look like this:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "Contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```


5. Save your changes and build the samples.  To build your sample you can run the the build.sh script in the **c/build_all/linux** directory.

6. Run the **c/serializer/samples/remote_monitoring/linux/remote_monitoring** sample application.

7. Go back to your remote monitoring solution dashboard. You should see data flowing to it. The sample is configured to send XXX internal temperature and YYY external temperature

8. Now go to the Command and control section (LINK) to learn how to change the temperature on your device from the remote monitoring solution.


### Running your device on Windows


1. Setup your environment: if you've never used our Device SDK before,  learn  how to set up your environment on Windows [here](https://github.com/Azure/azure-iot-sdks/blob/develop/c/doc/devbox_setup.md#windows).

1. Start a new instance of Visual Studio 2015. Open the **remote_monitoring .sln** solution in the **c\\serializer\\build\\windows** folder in your local copy of the repository.

2. In Visual Studio, in **Solution Explorer**, navigate to the samples folder. In the **remote_monitoring** project, open the **remote_monitoring.c** file.

2. Locate the following code in the file:
    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```
3. Replace "[Device Id]", "[Device Key], with the data your device data.

4. Use the IoT Hub Hostname device data to fill in IoTHub name and IoTHub Suffix. To do this, you need to split it in to like this:

    If your IoT Hub Hostname is Contoso.azure-devices.net, Contoso will be your IoTHub name and everything after it will the the Suffix. It should look like this:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "Contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```

6. In **Solution Explorer**, right-click the **remote_monitoring** project, click **Debug**, and then click **Start new instance** to build and run the sample. The console displays messages as the application sends device-to-cloud messages to IoT Hub.

7. Go back to your remote monitoring solution dashboard. You should see data flowing to it. The sample is configured to send XXX internal temperature and YYY external temperature

8. Now go to the Command and control section (LINK) to learn how to change the temperature on your device from the remote monitoring solution.

### Running your device on mbedOS

The following instructions describe the steps for connecting an [mbed-enabled Freescale FRDM-K64F](https://developer.mbed.org/platforms/FRDM-K64F/) device to Azure IoT Hub.


#### Requirements

- Required hardware: [mbed-enabled Freescale K64F](https://developer.mbed.org/platforms/FRDM-K64F/) or similar.

#### Connect the device

- Connect the board to your network using an Ethernet cable. This step is required, as the sample depends on internet access.

- Plug the device into your computer using a micro-USB cable. Be sure to attach the cable to the correct USB port on the device, as pictured [here](https://developer.mbed.org/platforms/IBMEthernetKit/), in the "Getting started" section.

- Follow the [instructions on the mbed handbook](https://developer.mbed.org/handbook/SerialPC) to setup the serial connection with your device from your development machine. If you are on Windows, install the Windows serial port drivers located [here](http://developer.mbed.org/handbook/Windows-serial-configuration#1-download-the-mbed-windows-serial-port).

#### Create mbed project and import the sample code

- In your web browser, go to the mbed.org [developer site](https://developer.mbed.org/). If you haven't signed up, you will see an option to create a new account (it's free). Otherwise, log in with your account credentials. Then click on **Compiler** in the upper right-hand corner of the page. This should bring you to the Workspace Management interface.

- Make sure the hardware platform you're using appears in the upper right-hand corner of the window, or click the icon in the right-hand corner to select your hardware platform.

- Click **Import** on the main menu. Then click the **Click here** to import from URL link next to the mbed globe logo.

	![][6]

- In the popup window, enter the link for the sample code https://developer.mbed.org/users/AzureIoTClient/code/remote_monitoring/

	![][7]

- You can see in the mbed compiler that importing this project imported various libraries. Some are provided and maintained by the Azure IoT team ([azureiot_common](https://developer.mbed.org/users/AzureIoTClient/code/azureiot_common/), [iothub_client](https://developer.mbed.org/users/AzureIoTClient/code/iothub_client/), [iothub_amqp_transport](https://developer.mbed.org/users/AzureIoTClient/code/iothub_amqp_transport/), [iothub_http_transport](https://developer.mbed.org/users/AzureIoTClient/code/iothub_http_transport/), [proton-c-mbed](https://developer.mbed.org/users/AzureIoTClient/code/proton-c-mbed/)), while others are third party libraries available in the mbed libraries catalog.

	![][8]

- Open remote_monitoring\remote_monitoring.c, locate the following code in the file:
    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```
3. Replace "[Device Id]", "[Device Key], with the data your device data.

4. Use the IoT Hub Hostname device data to fill in IoTHub name and IoTHub Suffix. To do this, you need to split it in to like this:

    If your IoT Hub Hostname is Contoso.azure-devices.net, Contoso will be your IoTHub name and everything after it will the the Suffix. It should look like this:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "Contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```
    ![][9]
#### Build and run the program

- Click **Compile** to build the program. You can safely ignore any warnings, but if the build generates errors, fix them before proceeding.

- If the build is successful, a .bin file with the name of your project is generated. Copy the .bin file to the device. Saving the .bin file to the device causes the current terminal session to the device to reset. When it reconnects, reset the terminal again manually, or start a new terminal. This enables the mbed device to reset and start executing the program.

- Connect to the device using an SSH client application, such as PuTTY. You can determine which serial port your device uses by checking the Windows Device Manager:

	![][10]

- In PuTTY, click the **Serial** connection type. The device most likely connects at 115200, so enter that value in the **Speed** box. Then click **Open**:

	![][11]

The program starts executing. You may have to reset the board (press CTRL+Break or press on the board's reset button) if the program does not start automatically when you connect.

#### Visualize your device and incoming data
6. On the preconfigured solution portal, click on the devices section to ensure that the Status of your device has changed to "Running" and that you can see all the manufacturer data. SCREENSHOT NEEDED

7. Click on the dashboard and select your device on "Device to View". You should now see your telemetry data being monitored on the Remote Monitoring solution.SCREENSHOT NEEDED



[6]: ./media/iot-suite-connecting-devices/mbed1.png
[7]: ./media/iot-suite-connecting-devices/mbed2a.png
[8]: ./media/iot-suite-connecting-devices/mbed3a.png
[9]: ./media/iot-suite-connecting-devices/mbed4a.png
[10]: ./media/iot-suite-connecting-devices/mbed5a.png
[11]: ./media/iot-suite-connecting-devices/mbed6.png
[12]: ./media/iot-suite-connecting-devices/mbed7.png

To learn how to do command and control, please continue in the following section (LINK TO COMMAND AND CONTROL)

## Sending device data to the remote monitoring solution using node.js

This tutorial assumes that you have completed the first tutorial, where we explained how to run a simple sample using our Node client libraries. If you haven't, please do so by following this [link](https://github.com/Azure/azure-iot-sdks/blob/develop/node/device/doc/run_sample.md).  

1.  Open the file **node\\samples\\simple_sample_remotemonitoring.js** in a text editor.

2.  Locate the following code in the file:

    ```
    var deviceID = '[Device ID]';
    var IoTHubName = '[IoT Hub Hostname]';
    var DeviceKey = '[Device Key]';
    ```

3.  Replace each of the variables with the information you gathered in the previous step. Save the changes.


4. Open a shell (Linux) or Node.js command prompt (Windows) and navigate to the **node\\samples** folder. Then run the sample application using the following command:

    ```
    node simple_sample_remotemonitoring.js
    ```

#### Visualize your device and incoming data

6. On the preconfigured solution portal, click on the devices section to ensure that the Status of your device has changed to "Running" and that you can see all the manufacturer data. SCREENSHOT NEEDED

7. Click on the dashboard and select your device on "Device to View". You should now see your telemetry data being monitored on the Remote Monitoring solution.SCREENSHOT NEEDED


## Command and control your device from the dashboard

Now that your device is connected and sending self-generated temperature data from your device, you can command and control your device remotely from IoT Hub. You can implement multiple types of commands that fit your business application. In this case, we've implemented a change in temperature, as if there was a need to control it from the solution. To send the commmand, you should:

-  Click on your device ID on the Devices list (you can find the device section on the left side menu).

![][13]

- On the right menu where device details are shown, click on "Send command"

![][14]
- Select the command you want to run: In this case, we choose "Set temperature", since we want to change the temperature the device is set at. Select that command and choose the temperature value. Click on Send Command and the new temperature will be pushed to the device. Note: you will see that in the command history the result of the command is "Pending". This is because, for simplicity purposes, this samples hasn't implemented any logic in the device to respond to IoT Hub. You can do this extending the solution.

![][15]
- Go back to the dashboard and ensure that the updated data is coming through. You should see updated statistics on temperature and the new data being displayed in the telemetry history.
![][16]



[13]: ./media/iot-suite-connecting-devices/suite4.png
[14]: ./media/iot-suite-connecting-devices/mbed2a.png (placeholder for more screenshots)
[15]: ./media/iot-suite-connecting-devices/mbed3a.png (placeholder for more screenshots)
[16]: ./media/iot-suite-connecting-devices/mbed4a.png (placeholder for more screenshots)
[17]: ./media/iot-suite-connecting-devices/mbed5a.png (placeholder for more screenshots)


## Extending your solution

There are multiple ways to extend the functionality of this sample: connect real sensor to your device to send real date, implement command and control functionality, etc. Please use our guide on how to extend the remote monitoring solution to learn more about this.

## Links and resources
- Preconfigured solution guide
- Azure IoT Suite and Hub sample galleries
