<properties
   pageTitle="Connecting your device to the preconfigured solution"
   description="Connecting your device to the preconfigured solution"
   services="Azure IoT Suite"
   documentationCenter="dev-center-name"
   authors="hegate"
   manager="jaosborn"
   editor=""/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="hegate;semicolon separates two or more"/>


# Connecting your device to an Azure IoT Suite Remote Monitoring solution

This document describes how to connect a real device to the remote monitoring preconfigured solution featured on Azure IoT Suite. For the purposes of this document, We are providing examples on node.js and C although you could implement it in any of the languages supported by the Azure IoT Device SDK.

#### Scenario overview

For this example, we will generate temperature and humidity data internally from the device. We are doing this for simplicity purposes, although you will be able to connect your favorite sensor and send real date. Please visit the resources linked on the Extending your solution section for more information.

### Preliminary steps

- Run Device SDK libraries on your device: if you've never used our Device SDK before, check out of sample tutorials on how to connect your device to Azure IoT Suite and IoT Hub [here](http://www.azure.com/iotdev) and click on Connect your device.

- Provision your IoT Suite: if you haven't provisioned your remote monitoring preconfiugured solution yet, you can provision it [here](www.internetofyourthigns.com).



## Sending telemetry to the preconfigured solution

### Getting your device information

In order to get your device connected to the preconfigured solution, you need to get the device credentials from the dashboard. This will be then used in your client application so that your device can be identified. Follow this steps:

1.  On the lower left corner of the dashboard, click on "Add a device". (SCREENSHOT NEEDED)
2.  On Custom Device, click on the "Add new" button.
3.  Choose your own Device ID by entering a name such as realdevice1, and click on Check ID to make sure that name hasn't been used yet.
4. Click on Create.(SCREENSHOT NEEDED)
5. Please take note of the credentials provided (Device ID, IoT Hub Hostname and Device Key). You will need them later in your client application to connect your device to the solution.
6. Ensure your device is displayed correctly on the devices section. The status will be "Pending". This is expected until the device to cloud connection is established. (SCREENSHOT NEEDED)

Now choose which language would you like to use to continue your sample:

### Use C in my client application

### Use Node.js in my client application

This tutorial assumes that you have completed the first tutorial, where we explained how to run a simple sample using our Node client libraries. If you haven't, please do so by following this [link](https://github.com/Azure/azure-iot-suite-sdks/blob/develop/node/device/doc/run_sample.md).  

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

6. On the provisioning portal, click on the devices section to ensure that the Status of your device has changed to "Running" and that you can see all the manufacturer data. SCREENSHOT NEEDED

7. Click on the dashboard and select your device on "Device to View". You should now see your telemetry data being monitored on the Remote Monitoring solution.SCREENSHOT NEEDED



## Extending your solution

There's multiple ways to extend the functionality of this sample: connect real sensor to your device to send real date, implement command and control functionality, etc. Please use our guide on how to extend the remote monitoring solution to learn more about this.

## Links and resources

- Preconfigured solution guide
- Azure IoT Suite and Hub sample galleries
