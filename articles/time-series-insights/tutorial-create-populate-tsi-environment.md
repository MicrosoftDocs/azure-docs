---
title: 'Tutorial: Create an environment - Azure Time Series Insights | Microsoft Docs'
description: Learn how to create an Azure Time Series Insights environment that's populated with data from simulated devices.
services: time-series-insights
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.reviewer: orspodek
ms.service: time-series-insights
ms.topic: tutorial
ms.date: 10/01/2020
ms.custom: seodec18
# Customer intent: As a data analyst or developer, I want to learn how to create an Azure Time Series Insights environment so that I can use Azure Time Series Insights queries to understand device behavior.
---

# Tutorial: Create an Azure Time Series Insights Gen1 environment

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

> [!CAUTION]
> This is a Gen1 article.

This tutorial guides you through the process of creating an Azure Time Series Insights environment that's populated with data from simulated devices. In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create an Azure Time Series Insights environment.
> * Create a device simulation solution that contains an IoT hub.
> * Connect the Azure Time Series Insights environment to the IoT hub.
> * Run a device simulation to stream data into the Azure Time Series Insights environment.
> * Verify the simulated telemetry data.

> [!IMPORTANT]
> Sign up for a [free Azure subscription](https://azure.microsoft.com/free/) if you don't already have one.

## Prerequisites

* Your Azure sign-in account also must be a member of the subscription's **Owner** role. For more information, read [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Review video

Learn how to use an Azure IoT solution accelerator to generate data and get started with Azure Time Series Insights.

> [!VIDEO https://www.youtube.com/embed/6ehNf6AJkFo]

## Overview

The Azure Time Series Insights environment is where device data is collected and stored. Once stored, the [Azure Time Series Insights Explorer](time-series-quickstart.md) and [Azure Time Series Insights Query API](/rest/api/time-series-insights/gen1-query-api) can be used to query and analyze the data.

Azure IoT Hub is the event source that's used by all devices (simulated or physical) in the tutorial to securely connect and transmit data to your Azure cloud.

This tutorial also uses an [IoT solution accelerator](https://www.azureiotsolutions.com) to generate and stream sample telemetry data to IoT Hub.

>[!TIP]
> [IoT solution accelerators](https://www.azureiotsolutions.com) provide enterprise-grade preconfigured solutions that you can use to accelerate the development of custom IoT solutions.

## Create a device simulation

First, create the device simulation solution, which generates test data to populate your Azure Time Series Insights environment.

1. In a separate window or tab, go to [azureiotsolutions.com](https://www.azureiotsolutions.com). Sign in by using the same Azure subscription account, and select the **Device Simulation** accelerator.

   [![Run the Device Simulation accelerator](media/tutorial-create-populate-tsi-environment/iot-solution-accelerators-landing-page.png)](media/tutorial-create-populate-tsi-environment/iot-solution-accelerators-landing-page.png#lightbox)

1. Select **Try Now**. Then, enter the required parameters on the **Create Device Simulation solution** page.

   Parameter|Description
   ---|---
   **Deployment name** | This unique value is used to create a new resource group. The listed Azure resources are created and assigned to the resource group.
   **Azure subscription** | Specify the same subscription that was used to create your Azure Time Series Insights environment in the previous section.
   **Deployment options** | Select **Provision new IoT Hub** to create a new IoT hub specific to this tutorial.
   **Azure location** | Specify the same region that was used to create your Azure Time Series Insights environment in the previous section.

   When you're finished, select **Create** to provision the solution's Azure resources. It may take up to 20 minutes to complete this process.

   [![Provision the device simulation solution](media/tutorial-create-populate-tsi-environment/iot-solution-accelerators-configuration.png)](media/tutorial-create-populate-tsi-environment/iot-solution-accelerators-configuration.png#lightbox)

1. After provisioning has finished, two updates will display notifying you that the deployment state has moved from **Provisioning** to **Ready**.

   >[!IMPORTANT]
   > Don't enter your solution accelerator yet! Keep this web page open because you'll return to it later.

   [![Device simulation solution provisioning complete](media/tutorial-create-populate-tsi-environment/iot-solution-accelerator-ready.png)](media/tutorial-create-populate-tsi-environment/iot-solution-accelerator-ready.png#lightbox)

1. Now, inspect the newly created resources in the Azure portal. On the **Resource groups** page, notice that a new resource group was created by using the **Solution name** provided in the last step. Make note of the resources that were created for the device simulation.

   [![Device simulation resources](media/tutorial-create-populate-tsi-environment/tsi-device-sim-solution-resources.png)](media/tutorial-create-populate-tsi-environment/tsi-device-sim-solution-resources.png#lightbox)

## Create an environment

Second, create an Azure Time Series Insights environment in your Azure subscription.

1. Sign in to the [Azure portal](https://portal.azure.com) by using your Azure subscription account.
1. Select **+ Create a resource** in the upper left.
1. Select the **Internet of Things** category, and then select **Time Series Insights**.

   [![Select the Azure Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/tsi-create-new-environment.png)](media/tutorial-create-populate-tsi-environment/tsi-create-new-environment.png#lightbox)

1. On the **Time Series Insights environment** page, fill in the required parameters.

   Parameter|Description
   ---|---
   **Environment name** | Choose a unique name for the Azure Time Series Insights environment. The names are used by the Azure Time Series Insights Explorer and the [Query APIs](/rest/api/time-series-insights/gen1-query).
   **Subscription** | Subscriptions are containers for Azure resources. Choose a subscription to create the Azure Time Series Insights environment.
   **Resource group** | A resource group is a container for Azure resources. Choose an existing resource group or create a new one for the Azure Time Series Insights environment resource.
   **Location** | Choose a data center region for your Azure Time Series Insights environment. To avoid additional latency, create the Azure Time Series Insights environment in the same region as other IoT resources.
   **Tier** | Choose the throughput needed. Select **S1**.
   **Capacity** | Capacity is the multiplier applied to the ingress rate and storage capacity associated with the selected SKU. You can change the capacity after creation. Select a capacity of **1**.

   When finished, select **Next: Event Source** to proceed to the next step.

   [![Create an Azure Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/tsi-create-resource-tsi-params.png)](media/tutorial-create-populate-tsi-environment/tsi-create-resource-tsi-params.png#lightbox)

1. Now, connect the Azure Time Series Insights environment to the IoT hub created by the Solution Accelerator. Set **Select a hub** to `Select existing`. Then, choose the IoT hub created by the Solution Accelerator when setting **IoT Hub name**.

   [![Connect the Azure Time Series Insights environment to the created IoT hub](media/tutorial-create-populate-tsi-environment/tsi-create-resource-iot-hub.png)](media/tutorial-create-populate-tsi-environment/tsi-create-resource-iot-hub.png#lightbox)

   Lastly, select **Review + create**.

1. Check the **Notifications** panel to monitor deployment completion.

   [![Azure Time Series Insights environment deployment succeeded](media/tutorial-create-populate-tsi-environment/create-resource-tsi-deployment-succeeded.png)](media/tutorial-create-populate-tsi-environment/create-resource-tsi-deployment-succeeded.png#lightbox)

## Run device simulation

Now that the deployment and initial configuration's complete, populate the Azure Time Series Insights environment with sample data from [simulated devices created by the accelerator](#create-a-device-simulation).

Along with the IoT hub, an Azure App Service web application was generated to create and transmit simulated device telemetry.

1. Go back to your [Solution accelerators dashboard](https://www.azureiotsolutions.com/Accelerators#dashboard). Sign in again, if necessary, by using the same Azure account you've been using in this tutorial. Select your "Device Solution" and then **Go to your solution accelerator** to launch your deployed solution.

   [![Solution accelerators dashboard](media/tutorial-create-populate-tsi-environment/iot-solution-accelerator-ready.png)](media/tutorial-create-populate-tsi-environment/iot-solution-accelerator-ready.png#lightbox)

1. The device simulation web app begins by prompting you to grant the web application the **Sign you in and read your profile** permission. This permission allows the application to retrieve the user profile information necessary to support the functioning of the application.

   [![Device simulation web application consent](media/tutorial-create-populate-tsi-environment/sawa-signin-consent.png)](media/tutorial-create-populate-tsi-environment/sawa-signin-consent.png#lightbox)

1. Select **+ New simulation**. After the **Simulation setup** page loads, enter the required parameters.

   Parameter|Description
   ---|---
   **Target IoT Hub** | Select **Use pre-provisioned IoT Hub**.
   **Device model** | Select **Chiller**.
   **Number of devices**  | Enter `10` under **Amount**.
   **Telemetry frequency** | Enter `10` seconds.
   **Simulation duration** | Select **End in:** and enter `5` minutes.

   When you're finished, select **Start Simulation**. The simulation runs for a total of 5 minutes. It generates data from 1,000 simulated devices every 10 seconds.

   [![Device simulation setup](media/tutorial-create-populate-tsi-environment/sawa-simulation-setup.png)](media/tutorial-create-populate-tsi-environment/sawa-simulation-setup.png#lightbox)

1. While the simulation runs, notice that the **Total messages** and **Messages per second** fields update, approximately every 10 seconds. The simulation ends after approximately 5 minutes and returns you to **Simulation setup**.

   [![Device simulation running](media/tutorial-create-populate-tsi-environment/sawa-simulation-running.png)](media/tutorial-create-populate-tsi-environment/sawa-simulation-running.png#lightbox)

## Verify the telemetry data

In this final section, you verify that the telemetry data was generated and stored in the Azure Time Series Insights environment. To verify the data, you use the Azure Time Series Insights Explorer, which is used to query and analyze telemetry data.

1. Return to the Azure Time Series Insights environment's resource group **Overview** page. Select the Azure Time Series Insights environment.

   [![Azure Time Series Insights environment resource group and environment](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-rg.png)](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-rg.png#lightbox)

1. On the Azure Time Series Insights environment **Overview** page, select the **Time Series Insights Explorer URL** to open the Azure Time Series Insights Explorer.

   [![Azure Time Series Insights Explorer](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-explorer-url.png)](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-explorer-url.png#lightbox)

1. The Azure Time Series Insights Explorer loads and authenticates by using your Azure portal account. Initially, the chart area that the Azure Time Series Insights environment was populated with along with its simulated telemetry data will appear. To filter a narrower range of time, select the drop-down in the upper-left corner. Enter a time range large enough to span the duration of the device simulation. Then select the search magnifying glass.

   [![Azure Time Series Insights Explorer time range filter](media/tutorial-create-populate-tsi-environment/tsie-filter-time-range.png)](media/tutorial-create-populate-tsi-environment/tsie-filter-time-range.png#lightbox)

1. Narrowing the time range allows the chart to zoom in to the distinct bursts of data transfer to the IoT hub and the Azure Time Series Insights environment. Also notice the **Streaming complete** text in the upper-right corner, which shows the total number of events found. You can also drag the **Interval size** slider to control the plot granularity on the chart.

   [![Azure Time Series Insights Explorer time range filtered view](media/tutorial-create-populate-tsi-environment/tsie-view-time-range.png)](media/tutorial-create-populate-tsi-environment/tsie-view-time-range.png#lightbox)

1. Lastly, you can also left-click a region to filter a range. Then right-click and use **Explore events** to show event details in the tabular **Events** view.

   [![Azure Time Series Insights Explorer time range filtered view and events](media/tutorial-create-populate-tsi-environment/tsie-view-time-range-events.png)](media/tutorial-create-populate-tsi-environment/tsie-view-time-range-events.png#lightbox)

## Clean up resources

This tutorial creates several running Azure services to support the Azure Time Series Insights environment and device simulation solution. To remove them, navigate back to the Azure portal.

From the menu on the left in the Azure portal:

1. Select the **Resource groups** icon. Then select the resource group you created for the Azure Time Series Insights environment. At the top of the page, select **Delete resource group**, enter the name of the resource group, and select **Delete**.

1. Select the **Resource groups** icon. Then select the resource group that was created by the device simulation solution accelerator. At the top of the page, select **Delete resource group**, enter the name of the resource group, and select **Delete**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Create an Azure Time Series Insights environment.
> * Create a device simulation solution that contains an IoT hub.
> * Connect the Azure Time Series Insights environment to the IoT hub.
> * Run a device simulation to stream data into the Azure Time Series Insights environment.
> * Verify the simulated telemetry data.

Now that you know how to create your own Azure Time Series Insights environment, learn how to build a web application that consumes data from an Azure Time Series Insights environment:

> [!div class="nextstepaction"]
> [Read hosted client SDK visualization samples](https://tsiclientsample.azurewebsites.net/)