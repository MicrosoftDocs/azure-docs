---
title: Azure Time Series Insights Preview set up - Set up an Azure Time Series Insights Preview environment tutorial | Microsoft Docs
description: Learn how to set up your environment in Azure Time Series Insights Preview.
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: tutorial
ms.date: 12/11/2018
ms.custom: seodec18
---

# Tutorial: Set up an Azure Time Series Insights Preview environment

This tutorial guides you through the process of creating an Azure Time Series Insights pay-as-you-go (PAYG) Preview environment. In this tutorial, you learn how to:

* Create a Time Series Insights Preview environment.
* Connect the Time Series Insights Preview environment to an event hub in Azure Event Hubs.
* Run a wind farm simulation to stream data into the Time Series Insights Preview environment.
* Perform basic analysis on the data.
* Define a Time Series Model type and hierarchy and associate it with your instances.

# Create a device simulation

In this section, you will create three simulated devices will send data to an IoT Hub.

1. Go to the [Azure IoT solution accelerators home page](https://www.azureiotsolutions.com/Accelerators). The Azure IoT solution accelerators home page displays several pre-built examples. Sign in using your Azure account. Then, select **Device Simulation**.

   ![Azure IoT solution accelerators home page][1]

   Lastly, click **Try Now**.

1. Enter the required parameters on the **Create Device Simulation** solution page:

   | Parameter | Description |
   | --- | --- |
   | Solution name |	A unique value, used for creation of a new resource group. The listed Azure resources are | created and assigned to the resource group. |
   | Subscription |	Specify the same subscription used for creation of your TSI environment |
   | Region |	Specify the same region used for creation of your TSI. |
   | Deploy optional Azure Resources	| Leave IoT Hub checked, as the simulated devices will use it to connect/stream data. |

   After entering the required parameters, click on **Create Solution**. Wait for approximately 10-15 minutes for your solution to be deployed.

   ![Create device simulation solution][2]

1. In your **Solution Accelerator Dashboard**, click the **Launch** button:

   ![Launch the device simulation solution][3]

1. You will be redirected to the **Microsoft Azure IoT Device Simulation** page. Click **+ New simulation** located in the upper right of the screen.

   ![Azure IoT simulation page][4]

1.	Fill out the required parameters as follows:

    ![Parameters to fill out][5]

    |||
    | --- | --- |
    | **Name** | Enter a unique name for a simulator |
    | **Description** | Enter a definition |
    | **Simulation Duration** | Set to `Run indefinitely` |
    | **Device Model** | **Name**: Enter `Chiller` **Amount**: Enter `3` |
    | **Target IoT Hub** | Set to `Use pre-provisioned IoT Hub` |

    After filling the required parameters, click on ***Start Simulation**.

1. In the device simulation dashboard, see the **Active devices** and **Messages per second**.

    ![Azure IoT simulation dashboard][6]

## List device simulation properties

Before you create an Azure Time Series Insights environment, you will need the names of your IoT Hub, subscription, and resource group name.

1. Go to the **Solution Accelerator Dashboard** and sign in using the same Azure subscription account. Find the device simulation that you created in the previous steps.

1. Click on your device simulator and click **Launch**. Click on the **Azure Management Portal** link is displayed on the right-hand side.

    ![Simulator listings][7]

1. Take note of the IoT Hub, subscription, and resource group names.

    ![Azure portl][8]

## Create a Time Series Insights Preview PAYG environment

This section describes how to create a Time Series Insights Preview environment by using the [Azure portal](https://portal.azure.com/).

1. Sign in to the Azure portal by using your subscription account.

1. Select **Create a resource**.

1. Select the **Internet of Things** category, and then select **Time Series Insights**.

   ![Select Create a resource, then select Internet of Things, and then select Time Series Insights][9]

1. Fill the fields on the page as follows:

   | | |
   | --- | ---|
   | **Environment name** | Choose a unique name for the Azure Time Series Insights Preview environment. |
   | **Subscription** | Enter your subscription where you want to create the Azure Time Series Insights Preview environment. It is a best practice to use the same subscription as the rest of your IoT resources created by the device simulator. |
   | **Resource Group** | A resource group is a container for Azure resources. Choose an existing resource group, or create a new one, for the Azure Time Series Insights Preview environment resource. It is a best practice to use the same resource group as the rest of your IoT resources created by the device simulator. |
   | **Location** | Choose a data center region for your Azure Time Series Insights Preview environment. To avoid added bandwidth costs and latency, it's best to keep the Azure Time Series Insights Preview environment in the same region as other IoT resources. |
   | **Tier** |  Select `PAYG` which stands for pay-as-you-go. This is the SKU for Azure Time Series Insights Preview product. |
   | **Property ID** | Property Id uniquely identifies your time series. Please not that this field is immutable and cannot be changed later. For this tutorial set the field to `iothub-connection-device-id`. To learn more about Time Series ID, read [How to choose a Time Series ID](./time-series-insights-update-how-to-id.md). |
   | **Storage Account Name** | Enter a global unique name for a new storage account to be created. |

   After filling in the fields above, click **Next: Event Source**.

   ![Click Next: Event Source][10]

1. On the page, fill the fields as follows:

   | | |
   | --- | --- |
   | **Create an Event Source?** | Enter `Yes`|
   | **Name** | Requires a unique value, which is used to name the event source.|
   | **Source Type** | Enter `IoT Hub` |
   | **Select a Hub?** | Enter `Select Existing` |
   | **Subscription** | Enter the subscription that you used for device simulator. |
   | **IoT Hub name** | Enter the IoT hub name that you created for device simulator. |
   | **IoT Hub access policy** | Enter `iothubowner` |
   | **Iot Hub consumer group** | You need a unique consumer group for an Azure Time Series Insights Preview. |
   | **Timestamp** | This field is used to identify the timestamp property in your incoming telemetry data. For this tutorial, do not fill the field. This simulator uses the incoming timestamp from IoT Hub which Time Series Insights defaults to.|

   To create create a unique consumer group:

   1. Click **New** next to the **IoT Hub consumer group** field:

      ![Click Next: Event Source][11]

   1. Give the consumer group a unique name and click **Add**:

      ![Click Add][12]

   After filling out the fields above, click **Review + Create**.

      ![Review and create][13]

1. Review all fields in the review page and click on **Create**.

   ![Create][14]

1. You can see the status of your deployment.

   ![Deployment complete][15]

1. You should receive access to your time series environment if you own the tenant. To make sure that you have access:

   * Navigate to your newly created Azure Time Series Insights Preview environment. You can do so by searching for your resource group. Then, click on your time series environment:

      ![Deployment complete][16]

   * On the Azure Time Series Insights Preview page, navigate to **Data Access Policies**

     ![Data access policies][17]

   * Verify that your credentials are listed.

     ![Verify your credentials][18]

   If your credentials are not listed, you will have to give yourself permission to access the environment. Read [Grant Data Access](./time-series-insights-data-access.md) to learn more about setting permissions.

## Analyze data in your environment

In this section, you perform basic analytics on your time series data by using the Time Series Insights update explorer.

1. Go to your Azure Time Series Insights Preview explorer by clicking on the URL from the resource page in the Azure portal.

   ![The Time Series Insights explorer URL][19]

1. In the explorer, select the **Unparented Instances** nodes to see all the Azure Time Series Insights Preview in the environment.

   ![List of unparented instances][20]

1. In the time series shown, click on the first instance. Then, click on **Show Avg Pressure**.

   ![Show average pressure][21]

1. A time series chart should appear on the right:

   ![Time series chart][22]

1. Repeat **step 3** with the other two time series. All time series can then be viewed as shown below:

   ![All time series chart][23]

1. Modify the **time range** to see time series trends over the last hour. Select the **From** option box as shown below:

   ![Select the From option][24]

1. Change the time within the **From** option box to display events from the last hour:

   ![Select the From option][25]

1. You can then compare pressure across all three devices over the last hour:

   ![Select the From option][26]


## Next steps

In this tutorial, you learned how to:  

* Create and use a device simulation accelerator.
* Create an Azure Time Series Insights Preview PAYG environment.
* Connect the Time Series Insights Preview environment to an event hub.
* Run a wind farm simulation to stream data to the Time Series Insights Preview environment.
* Perform a basic analysis of the data.
* Define a Time Series Model type and hierarchy and associate them with your instances.

Now that you know how to create your own Time Series Insights update environment, learn more about the key concepts in Time Series Insights.

Read about Time Series Insights storage configuration:

> [!div class="nextstepaction"]
> [Azure Time Series Insights Preview storage and ingress](./time-series-insights-update-storage-ingress.md)

Learn more about Time Series Models:

> [!div class="nextstepaction"]
> [Azure Time Series Insights Preview data modeling](./time-series-insights-update-tsm.md)

<!-- Images -->
[1]: media/v2-update-provision/device-one-accelerator.png
[2]: media/v2-update-provision/device-two-create.png
[3]: media/v2-update-provision/device-three-launch.png
[4]: media/v2-update-provision/device-four-iot-sim-page.png
[5]: media/v2-update-provision/device-five-params.png
[6]: media/v2-update-provision/device-six-dashboard.png
[7]: media/v2-update-provision/device-seven-listings.png
[8]: media/v2-update-provision/device-eight-portal.png

[9]: media/v2-update-provision/payg-one-azure.png
[10]: media/v2-update-provision/payg-two-create.png
[11]: media/v2-update-provision/payg-three-new.png
[12]: media/v2-update-provision/payg-four-add.png
[13]: media/v2-update-provision/payg-five-event-source.png
[14]: media/v2-update-provision/payg-six-review.png
[15]: media/v2-update-provision/payg-seven-deploy.png
[16]: media/v2-update-provision/payg-eight-environment.png
[17]: media/v2-update-provision/payg-nine-data-access.png
[18]: media/v2-update-provision/payg-ten-verify.png

[19]: media/v2-update-provision/analyze-one-portal.png
[20]: media/v2-update-provision/analyze-two-unparented.png
[21]: media/v2-update-provision/analyze-three-show-pressure.png
[22]: media/v2-update-provision/analyze-four-chart.png
[23]: media/v2-update-provision/analyze-five-chart.png
[24]: media/v2-update-provision/analyze-six-from.png
[25]: media/v2-update-provision/analyze-seven-change-from.png
[26]: media/v2-update-provision/analyze-eight-all.png