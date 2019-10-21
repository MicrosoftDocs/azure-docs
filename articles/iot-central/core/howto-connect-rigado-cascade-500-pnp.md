---
title: Connect a Rigado Cascade 500 in Azure IoT Central | Microsoft Docs
description: Learn how to connect a Rigado Cascade 500 gateway device to your IoT Central application. 
services: iot-central
ms.service: iot-central
ms.topic: conceptual
ms.custom: [iot-storeAnalytics-conditionMonitor, iot-p0-scenario]
ms.author: avneets
author: avneets
ms.date: 10/19/2019
---
# Connect a Rigado Cascade 500 to your Azure IoT Central application

This article describes how, as a solution builder, to connect a Rigado Cascade 500 device to your Microsoft Azure IoT Central application. 

## Before you begin
To step through this how-to guide, you need the following resources:

* A Rigado Cascade 500 device. For more information, please visit [Rigado](https://www.rigado.com/).
* An Azure IoT Central application created from one of the preview application templates. For more information, see the [create a new application](https://docs.microsoft.com/en-us/azure/iot-central/quick-deploy-iot-central-pnp?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

## What is Cascade 500?

Cascade 500 IoT gateway is a hardware offering from Rigado that is included as part of their Cascade Edge-as-a-Service solution. It provides commercial IoT project and product teams with flexible edge computing power, a robust containerized application environment, and a wide variety of wireless device connectivity options, including Bluetooth 5, LTE, & Wi-Fi.

Cascade 500 is pre-certified for Azure IoT Plug and Play (PnP) allowing our solution builders to easily onboard the device into their end to end solutions. The Cascade gateway allows you to wirelessly connect to a variety of condition monitoring sensors that are in proximity to the gateway device. These sensors can be onboarded into IoT Central via the gateway device.

## Add Cascade 500 device template to your IoT Central application

In order to onboard a Cascade 500 gateway device into your Azure IoT Central application instance, you will need to configure a corresponding device template within your application.

Please follow the steps below:

1. Navigate to the ***Device Templates*** tab in the left pane, select **+ New**: 
![Create new device template](./media/howto-connect-rigado-cascade500-pnp/DeviceTemplate-New.png)
1. The page gives you an option to ***Create a custom template*** or ***Use a preconfigured device template***
1. Please select the C500 device template from the list of preconfigured device templates as shown below:
![Select C500 device template](./media/howto-connect-rigado-cascade500-pnp/DeviceTemplate-Preconfiguredpng.png)
1. Select ***Next: Customize*** to continue to the next step. 
1. On the next screen, please select ***Create*** to onboard the C500 device template into your IoT Central application.

## Get your application connection details

You will now need to retrieve the **Scope ID** and **Primary key** for your Azure IoT Central application in order to connect the Cascade 500 device. 

1. Navigate to **Administration**  in the left pane and click on **Device connection**. 
2. Make a note of the **Scope ID** for your IoT Central application.
![App Scope ID](./media/howto-connect-rigado-cascade500-pnp/AppScopeID.png)
3. Now click on **View Keys** and make a note of the **Primary key**
![Primary Key](./media/howto-connect-rigado-cascade500-pnp/PrimaryKey-SAS.png)  

## Set up the Cascade 500 device by contacting Rigado  

In order to connect the Cascade 500 device to your IoT Central application, you will need to contact Rigado and provide them with the application connection details from the above steps. 

Once the device is connected to the internet, Rigado will be able to push down a configuration update down to the Cascade 500 gateway device through a secure channel. 

This update will apply the IoT Central connection details on the Cascade 500 device and it will appear in your devices list. 

![Primary Key](./media/howto-connect-rigado-cascade500-pnp/DevicesList-C500.png)  

You are now ready to use your C500 device in your IoT Central application!

## Next Steps

Now that you've learned how to connect a Rigado Cascade 500 to your Azure IoT Central application, the suggested next step is to learn how to [customize your IoT Central application](../retail/tutorial-condition-monitor-customize-dashboard-pnp.md) to build an end to end solution. 