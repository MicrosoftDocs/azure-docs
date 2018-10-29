---
title: Create an Azure Time Series Insights environment
description: Learn how to create a Time Series Insights environment, populated with data from simulated devices.
services: time-series-insights
author: ashannon7
ms.service: time-series-insights
ms.topic: tutorial
ms.date: 06/04/2018
ms.author: anshan
manager: cshankar
# Customer intent: As a data analyst or developer, I want learn how to create a TSI environment, so I can use TSI queries to understand device behavior.
---

# Tutorial: Create an Azure Time Series Insights environment

This tutorial will guide you through the process of creating a Time Series Insight (TSI) environment, populated with data from simulated devices. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a TSI environment 
> * Create a device simulation solution containing an IoT Hub
> * Connect the TSI environment to the IoT hub
> * Run a device simulation to stream data into the TSI environment
> * Verify the simulated telemetry data

## Video: 

### In this video, we show you how to use an Azure IoT Solution Accelerator to generate data that can be used to get started with Time Series Insights.</br>

> [!VIDEO https://www.youtube.com/embed/6ehNf6AJkFo]

## Prerequisites

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 

Your Azure sign-in account also needs to be a member of the subscription's Owner role. For details, see [Manage access using RBAC and the Azure portal](/azure/role-based-access-control/role-assignments-portal)

## Overview

The TSI environment is where device data is collected and stored. Once stored in the TSI environment, you can use the [TSI Explorer](time-series-quickstart.md) and [TSI Query API](/rest/api/time-series-insights/time-series-insights-reference-queryapi) to query and analyze the data.

Like all devices, simulated or physical, IoT Hub is the connection point used by devices to securely connect and transmit data to the Azure cloud. As discussed in the [TSI Overview](time-series-insights-overview.md), IoT Hub also serves as an event source, for streaming data into the TSI environment. 

This tutorial also uses an [IoT solution accelerator](/azure/iot-accelerators/), to generate and stream sample telemetry data to IoT Hub. IoT solution accelerators provide enterprise-grade preconfigured solutions, that enable you to accelerate the development of custom IoT solutions. 

## Create a TSI environment

First, create a TSI environment in your Azure subscription:

1. Sign in to the [Azure portal](https://portal.azure.com) using your Azure subscription account.  
2. Select **+ Create a resource** in the upper left.  
3. Select the **Internet of Things** category, then select **Time Series Insights**.  
   
   [![Select the Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi.png)](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi.png#lightbox)

4. On the **Time Series Insights environment** page, fill in the required parameters:
   
   Parameter|Description
   ---|---
   **Environment name** | Choose a unique name for the TSI environment. The name is used by TSI Explorer and the Query API.
   **Subscription** | Subscriptions are containers for Azure resources. Choose the subscription where you want to create the TSI environment.
   **Resource group** | A resource group is a container for Azure resources. Choose an existing resource group, or create a new one, for the TSI environment resource.
   **Location** | Choose a data center region for your TSI environment. To avoid added bandwidth costs and latency, it's best to keep the TSI environment in the same region as other IoT resources.
   **Pricing SKU** | Choose the throughput needed. For lowest cost and starter capacity, select S1.
   **Capacity** | Capacity is the multiplier applied to the ingress rate, storage capacity, and cost associated with the selected SKU.  You can change capacity of an environment after creation. For lowest cost, select a capacity of 1. 

   When finished, click **Create** to begin the provisioning process.

   ![Create a Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi-params.png)

5. You can check the **Notifications** panel to monitor deployment completion, which should take less than a minute:  

   ![Time Series Insights environment deployment succeeded](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi-deployment-succeeded.png)

## Create a device simulation

Next, create the device simulation solution, which will generate test data to populate your TSI environment:

1. In a separate window/tab, go to https://www.azureiotsolutions.com, sign in using the same Azure subscription account, and select the "Device Simulation" accelerator:

   ![Run the Device Simulation accelerator](media/tutorial-create-populate-tsi-environment/sa-main.png)

2. Enter the required parameters on the **Create Device Simulation solution** page:

   Parameter|Description
   ---|---
   **Solution name** | A unique value, used for creation of a new resource group. The listed Azure resources are created and assigned to the resource group.
   **Subscription** | Specify the same subscription used for creation of your TSI environment, in the previous section.
   **Region** | Specify the same region used for creation of your TSI environment, in the previous section. 
   **Deploy optional Azure Resources** | Leave **IoT Hub** checked, as the simulated devices will use it to connect/stream data.

   When finished, click **Create solution** to provision the solution's Azure resources, which will take approximately 6-7 minutes to complete:

   ![Provision the device simulation solution](media/tutorial-create-populate-tsi-environment/sa-create-device-sim-solution.png)

3. Once provisioning has finished, the text above your new solution will change from "Provisioning..." to "Ready":

   >[!IMPORTANT]
   > Don't click the **Launch** button yet! But keep this web page open as you will return to it later.

   ![Device simulation solution provisioning complete](media/tutorial-create-populate-tsi-environment/sa-create-device-sim-solution-dashboard-ready.png)

4. Now go back to the Azure portal and inspect the newly created resources in your subscription. In the portal **Resource groups** page, you'll notice a new resource group was created using the **Solution name** provided in the last step. Also notice all of the resources created to support the device simulation solution:

   [![Device simulation solution resources](media/tutorial-create-populate-tsi-environment/ap-device-sim-solution-resources.png)](media/tutorial-create-populate-tsi-environment/ap-device-sim-solution-resources.png#lightbox)

## Connect the TSI environment to the IoT hub 

At this point, you've learned how to create two sets of resources, each in their own resource group: 
- An empty TSI environment 
- Device simulation solution resources, including an IoT hub, generated by a solution accelerator

Recall that the simulated devices need to connect to an IoT hub to stream device data. To flow the data into the TSI environment, you need to make configuration changes to both your IoT hub and TSI environment. 

### IoT hub configuration: define a consumer group

IoT hub provides various endpoints to share functionality to other actors. The "Events" endpoint provides a way for other applications to consume data, as it's streamed to an IoT hub instance. Specifically, "consumer groups" provide a mechanism for applications to listen and pull data from the IoT Hub. 

Next you define a new "consumer group" property, on the device simulation solution's IoT hub "Events" endpoint. 

1. In the Azure portal, go to the **Overview** page of the resource group you created for the device simulation solution, then select the IoT Hub resource:

   [![Device simulation solution resource group](media/tutorial-create-populate-tsi-environment/ap-add-iot-hub-consumer-group-view-rg.png)](media/tutorial-create-populate-tsi-environment/ap-add-iot-hub-consumer-group-view-rg.png#lightbox)

   Also make note of the **Name** of the IoT Hub resource generated for the solution, as you'll refer to it later.

2. Scroll down and select the **Endpoints** page, then select the **Events** endpoint. On the endpoint **Properties** page, enter a unique name for your endpoint under the "$Default" consumer group, then click **Save**:

   [![Device simulation solution IoT hub endpoints](media/tutorial-create-populate-tsi-environment/ap-add-iot-hub-consumer-group-create.png)](media/tutorial-create-populate-tsi-environment/ap-add-iot-hub-consumer-group-create.png#lightbox)

### TSI environment configuration: define an event source

Now connect the new IoT hub "consumer group" event endpoint, to the TSI environment, as an "event source."

1. Go to the **Overview** page of the resource group you created for the TSI environment, then select the TSI environment:

   [![TSI environment resource group and environment](media/tutorial-create-populate-tsi-environment/ap-add-env-event-source-view-rg.png)](media/tutorial-create-populate-tsi-environment/ap-add-env-event-source-view-rg.png#lightbox)

2. On the TSI environment page, select **Event Sources**, then click **+ Add**:

   ![TSI environment overview](media/tutorial-create-populate-tsi-environment/ap-add-env-event-source-add.png)

3. Enter the required parameters on the **New event source** page: 

   Parameter|Description
   ---|---
   **Event source name** | Requires a unique value, which is used to name the event source.
   **Source** | Select "IoT Hub."
   **Import option** | Use the defaulted "Use IoT hub from available subscriptions." This option will cause the next drop-down list to be populated with the available subscriptions.
   **Subscription** | Select the same subscription in which you created the TSI environment and Device Simulation resources.
   **Iot hub name** | Should be defaulted to the name of the IoT hub that you noted earlier. If not, select the correct IoT hub.
   **Iot hub policy name** | Leave as the defaulted value of "iothubowner."
   **Iot hub consumer group** | Should be defaulted to the name of the IoT hub consumer group you created earlier. If not, select the correct consumer group name. 
   **Event serialization format** | Leave as the defaulted value of "JSON."
   **Timestamp property name** | Specify as "timestamp."

   When finished, click **Create** to add the event source. When you return to the resource group **Overview** page, along with your TSI environment resource, you see a new "Time Series Insights event source" resource.

   ![TSI environment new event source](media/tutorial-create-populate-tsi-environment/ap-add-env-event-source-add-event-source.png)

## Run a device simulation to stream data into the TSI environment

Now that all of the configuration work is complete, it's time to populate the TSI environment with sample data from the simulated devices.

You may recall from the [Create a device simulation section](#create-a-device-simulation), several Azure resources were created by the accelerator to support the solution. Along with the IoT hub discussed previously, an Azure App Service web application was generated to create and transmit simulated device telemetry.

1. Go back to your [Solution accelerators dashboard](https://www.azureiotsolutions.com/Accelerators#dashboard). Sign in again if necessary, using the same Azure account you've been using in this tutorial. Now you can click the **Launch** button under your "Device Simulation" solution:

     ![Solution accelerators dashboard](media/tutorial-create-populate-tsi-environment/sa-create-device-sim-solution-dashboard.png)

2. The device simulation web app will start at this point, and may take several seconds upon initial load. You're also prompted for consent, to grant the web application the "Sign you in and read your profile" permission. This permission allows the application to retrieve the user profile information necessary to support the functioning of the application:

     ![Device simulation web application consent](media/tutorial-create-populate-tsi-environment/sawa-signin-consent.png)

3. Once the **Simulation setup** page loads, enter the required parameters: 

   Parameter|Description
   ---|---
   **Target IoT Hub** | Select "Use pre-provisioned IoT Hub."
   **Device model** | Select "Chiller."
   **Number of devices**  | Enter 1000 under **Amount**.
   **Telemetry frequency** | Enter 10 seconds.
   **Simulation duration** | Select **End in:** and enter 5 minutes.

   When finished, click **Start Simulation**. The simulation will run for a total of 5 minutes, generating data from 1000 simulated devices, every 10 seconds.  

   ![Device simulation setup](media/tutorial-create-populate-tsi-environment/sawa-simulation-setup.png)

4. While the simulation runs, you'll notice the **Total messages** and **Messages per second** fields update, approximately every 10 seconds. The simulation will end after approximately 5 minutes, and return you to **Simulation setup**.

   ![Device simulation running](media/tutorial-create-populate-tsi-environment/sawa-simulation-running.png)

## Verify the telemetry data

In this final section, you verify that the telemetry data was generated and stored in the TSI environment. To verify the data, you use the Time Series Insights explorer, which is used to query and analyze telemetry data.

1. Go back to the TSI environment's resource group **Overview** page, then select the TSI environment again:

   [![TSI environment resource group and environment](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-rg.png)](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-rg.png#lightbox)

2. On the TSI environment **Overview** page, click the **Time Series Insights explorer URL** to open the TSI explorer:

   [![TSI explorer](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-explorer-url.png)](media/tutorial-create-populate-tsi-environment/ap-view-tsi-env-explorer-url.png#lightbox)

3. TSI explorer will load and authenticate using your Azure portal account. Upon initial view, you can see in the chart area that the TSI environment was indeed populated with simulated telemetry data. To filter a narrower range of time, select the drop-down in the upper left. Then enter a time range large enough to span the duration of the device simulation. Then click the search magnifying class:

   [![TSI explorer time range filter](media/tutorial-create-populate-tsi-environment/tsie-filter-time-range.png)](media/tutorial-create-populate-tsi-environment/tsie-filter-time-range.png#lightbox)

4. Narrowing the time range allows the chart to zoom in to the distinct bursts of data transfer, to the IoT hub and TSI environment. Also notice the **Streaming complete** text in the upper right, which shows the total number of events found. You can also drag the **Interval size** slider to control the plot granularity on the chart:

   [![TSI explorer time range filtered view](media/tutorial-create-populate-tsi-environment/tsie-view-time-range.png)](media/tutorial-create-populate-tsi-environment/tsie-view-time-range.png#lightbox)

5. Lastly, you can also left-click a region to filter a range, then right-click and use **Explore events** to show event details in the tabular **Events** view:

   [![TSI explorer time range filtered view and events](media/tutorial-create-populate-tsi-environment/tsie-view-time-range-events.png)](media/tutorial-create-populate-tsi-environment/tsie-view-time-range-events.png#lightbox)

## Clean up resources

This tutorial creates several running Azure services, to support the TSI environment and device simulation solution. If you wish to abandon and/or delay completion of this tutorial series, we recommend deleting all resources to avoid incurring unnecessary costs. 

From the left-hand menu in the Azure portal:

1. Click the **Resource groups** icon, then select the resource group you created for the TSI Environment. At the top of the page, click **Delete resource group**, enter the name of the resource group, then click **Delete**. 
2. Click the **Resource groups** icon, then select the resource group that was created by the device simulation solution accelerator. At the top of the page, click **Delete resource group**, enter the name of the resource group, then click **Delete**. 

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a TSI environment 
> * Create a device simulation solution containing an IoT Hub
> * Connect the TSI environment to the IoT hub
> * Run a device simulation to stream data into the TSI environment
> * Verify the simulated telemetry data

Now that you know how to create your own TSI environment, learn how to build a web application that consumes data from a TSI environment:

> [!div class="nextstepaction"]
> [Create an Azure Time Series Insights single-page web app](tutorial-create-tsi-sample-spa.md)


