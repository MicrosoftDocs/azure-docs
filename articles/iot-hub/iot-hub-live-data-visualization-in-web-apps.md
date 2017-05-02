---
title: Real-time data visualization of sensor data from Azure IoT Hub – Web Apps | Microsoft Docs
description: Use Azure Web Apps to visualize temperature and humidity data that is collected from the sensor and sent to your Azure IoT hub.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'real time data visualization, live data visualization, sensor data visualization'

ms.assetid: e42b07a8-ddd4-476e-9bfb-903d6b033e91
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/29/2017
ms.author: xshi

---
# Visualize real-time sensor data from Azure IoT Hub using Azure Web Apps

![End-to-end diagram](media/iot-hub-get-started-e2e-diagram/5.png)

[!INCLUDE [iot-hub-get-started-note](../../includes/iot-hub-get-started-note.md)]

## What you learn

In this lesson, you learn how to visualize real-time sensor data that your Azure IoT hub receives by running a web application that is hosted on an Azure web app. If you want to try visualize the data in your IoT hub with Power BI, please see [Use Power BI to visualize real-time sensor data from Azure IoT Hub](iot-hub-live-data-visualization-in-power-bi.md).

## What you do

- Create an Azure web app in the Azure Portal.
- Get your IoT hub ready for data access by adding a consumer group.
- Configure the web app to read sensor data from your IoT hub.
- Upload a web application to be hosted by the web app.
- Open the web app to see real-time temperature and humidity data from your IoT hub.

## What you need

- Tutorial [Setup your device](iot-hub-raspberry-pi-kit-node-get-started.md) completed which covers the following requirements:
  - An active Azure subscription.
  - An Azure IoT hub under your subscription.
  - A client application that sends messages to your Azure IoT hub.
- Git. ([Download Git](https://www.git-scm.com/downloads)).

## Create an Azure web app

1. In the [Azure portal](https://ms.portal.azure.com/), click **New** > **Web + Mobile** > **Web App**.
1. Enter a unique job name, verify the subscription, specify a resource group and a location, select **Pin to dashboard**, and then click **Create**.

   We recommend you select the same location where your resource group is located. This assists with processing speed and reduced costs for data transfer.

   ![Create a Azure web app](media/iot-hub-live-data-visualization-in-web-apps/2_create-web-app-azure.png)

[!INCLUDE [iot-hub-get-started-create-consumer-group](../../includes/iot-hub-get-started-create-consumer-group.md)]

## Configure the web app to read data from your IoT hub

1. Open the Web app you’ve just provisioned.
1. Click **Application settings**, and then add the following key/value pairs under **App settings**:

   | Key                                   | Value                                                        |
   |---------------------------------------|--------------------------------------------------------------|
   | Azure.IoT.IoTHub.ConnectionString     | Obtained from iothub-explorer                                |
   | Azure.IoT.IoTHub.DeviceId             | Obtained from iothub-explorer                                |
   | Azure.IoT.IoTHub.ConsumerGroup        | The name of the consumer group that you add to your IoT hub  |

   ![Add settings to Azure web app with key value pairs](media/iot-hub-live-data-visualization-in-web-apps/4_web-app-settings-key-value-azure.png)

## Upload a web application to be hosted by the web app

We made available a web application on GitHub which displays real-time sensor data from your IoT hub. All you need to do is to configure the web app to work with a Git repository, download the web application from GitHub and upload it to Azure for the web app to host.

1. In the web app, click **Deployment Options** > **Choose Source** > **Local Git Repository**.

   ![Configure your Azure web app deployment to use local git repository](media/iot-hub-live-data-visualization-in-web-apps/5_configure-web-app-deployment-local-git-repository-azure.png)

1. Click **Setup connection**, create a user name and password that will be used to connect to the Git repository in Azure, and then click **OK**.

   ![Set user name and password for the git repository in Azure for your web app](media/iot-hub-live-data-visualization-in-web-apps/6_web-app-set-user-password-git-repo-azure.png)

1. Click **OK** to finish the configuration.
1. Click **Overview** and make a note of the value of **Git clone url**.

   ![Get the git clone URL of your Azure web app](media/iot-hub-live-data-visualization-in-web-apps/7_web-app-git-clone-url-azure.png)

1. Open a command or terminal window on your local computer.
1. Download the web application from GitHub and upload it Azure for the web app to host. To do this, run the following commands:

   ```bash
   git clone https://github.com/Azure-Samples/web-apps-node-iot-hub-data-visualization.git
   git remote add webapp <Git clone URL>
   git push webapp master:master
   ```

   > [!Note]
   > \<Git clone URL\> is the URL of the Git repository found on the **Overview** page of the web app.

## Open the web app to see real-time temperature and humidity data from your IoT hub

On the **Overview** page of your web app, click the URL to open the web app.

![Get the URL of your Azure web app](media/iot-hub-live-data-visualization-in-web-apps/8_web-app-url-azure.png)

You should see the real-time temperature and humidity data from your IoT hub.

![Azure web app page showing real-time temperature and humidity](media/iot-hub-live-data-visualization-in-web-apps/9_web-app-page-show-real-time-temperature-humidity-azure.png)

## Next steps
You’ve successfully used an Azure web app to visualize real-time sensor data from your Azure IoT hub.

There is an alternate way to visualize data from Azure IoT Hub. See [Use Power BI to visualize real-time sensor data from Azure IoT Hub](iot-hub-live-data-visualization-in-power-bi.md).

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]