---
title: Analyze events from Azure Digital Twins setup | Microsoft Docs
description: Learn how to visualize and analyze events from your Azure Digital Twins spaces, with Azure Time Series Insights, using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 10/15/2018
ms.author: dkshir
---

# Tutorial: Visualize and analyze events from your Azure Digital Twins spaces using Time Series Insights

Once you have deployed your Azure Digital Twins instance, provisioned your spaces, and implemented custom function to monitor specific conditions, you can then visualize the events and data coming from your spaces to look for trends and anomalies. 

In [the first tutorial](tutorial-facilities-setup.md), you configured the spatial graph of an imaginary building, with a room containing sensors for motion, carbon dioxide, and temperature. In [the second tutorial](tutorial-facilities-udf.md), you provisioned your graph and a user-defined function. The function monitors these sensor values and triggers notifications for the right conditions, that is, the room is empty, and the temperature and carbon dioxide levels are normal. This tutorial shows you how you can integrate the notifications and data coming from your Digital Twins setup with Azure Time Series Insights. You can then visualize your sensor values over time, and look for trends such as, which room is getting the most use, which is the busiest times of the day, and so on. You can also detect anomalies such as, which rooms feel stuffier and hotter, or whether an area in your building is sending consistently high temperature values indicating a faulty air conditioning.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Stream data using Event Hubs
> * Analyze with Time Series Insights

## Prerequisites

This tutorial assumes that you have [configured](tutorial-facilities-setup.md) and [provisioned](tutorial-facilities-udf.md) your Azure Digital Twins setup. Before proceeding, make sure that you have:
- An [Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An instance of Digital Twins running.
- The [Digital Twins C# samples](https://github.com/Azure-Samples/digital-twins-samples-csharp) downloaded and extracted on your work machine.
- [.NET Core SDK version 2.1.403 or above](https://www.microsoft.com/net/download) on your development machine to run the sample. Run `dotnet --version` to verify if the right version is installed. 


## Stream data using Event Hubs
The [Event Hubs](../event-hubs/event-hubs-about.md) service allows you to create a pipeline to stream your data. This section shows you how to create your event hub as the connector between your Digital Twins and TSI instances.

### Create an event hub

1. Sign in to [Azure portal](https://portal.azure.com).

1. On the left navigation panel, click **Create a resource**. 

1. Search for and select **Event Hubs**. Click **Create**.

1. Enter a **Name** for your Event Hubs namespace, choose *Standard* **Pricing tier**, your **Subscription**, the **Resource group** you used for your Digital Twins instance, and the **Location**. Click **Create**. 

1. Once deployed, navigate to the Event Hubs namespace *deployment*, and click on the namespace under **RESOURCE**.

    ![Event Hub namespace](./media/tutorial-facilities-analyze/open-event-hub-ns.png)


1. In the Event Hubs namespace **Overview** pane, click on the **Event Hub** button at the top. 
    ![Event Hub](./media/tutorial-facilities-analyze/create-event-hub.png)

1. Enter a **Name** for your event hub, and click **Create**. Once deployed, it will appear in the **Event Hubs** pane of the Event Hubs namespace with an *Active* **STATUS**. Click on this event hub to open its **Overview** pane.

1. Click **Consumer group** button at the top, and enter a name such as *tsievents* for the consumer group. Click **Create**.
    ![Event Hub consumer group](./media/tutorial-facilities-analyze/event-hub-consumer-group.png)

   Once created, the consumer group will appear in the list at the bottom of the event hub's **Overview** pane. 

1. Open the **Shared access policies** pane for your event hub, and click **Add** button. **Create** a policy named *ManageSend*, and make sure all the checkboxes are checked. 

    ![Event Hub connection strings](./media/tutorial-facilities-analyze/event-hub-connection-strings.png)

1. Open the *ManageSend* policy that you created, and copy the values for **Connection string--primary key** and **Connection string--secondary key** to a temporary file. You will need these values to create an endpoint for the event hub in the next section.

### Create endpoint for the event hub

1. In the command window, make sure you are in the **_occupancy-quickstart\src** folder of the Digital Twins sample.

1. Open the file **_actions\createEndpoints.yaml_** in your editor. Replace the contents with the following:

    ```yaml
    - type: EventHub
      eventTypes:
      - SensorChange
      - SpaceChange
      - TopologyOperation
      - UdfCustom
      connectionString: Primary_connection_string_for_your_event_hub
      secondaryConnectionString: Secondary_connection_string_for_your_event_hub
      path: Name_of_your_Event_Hubs_namespace
    - type: EventHub
      eventTypes:
      - DeviceMessage
      connectionString: Primary_connection_string_for_your_event_hub
      secondaryConnectionString: Secondary_connection_string_for_your_event_hub
      path: Name_of_your_Event_Hubs_namespace
    ```

1. Replace the placeholders `Primary_connection_string_for_your_event_hub` with the value of the **Connection string--primary key** for the event hub. Make sure the format of this connection string is as following:
```
Endpoint=sb://nameOfYourEventHubNamespace.servicebus.windows.net/;SharedAccessKeyName=ManageSend;SharedAccessKey=yourShareAccessKey1GUID;EntityPath=nameOfYourEventHub
```

1. Replace the placeholders `Secondary_connection_string_for_your_event_hub` with the value of the **Connection string--secondary key** for the event hub. Make sure the format of this connection string is as following: 
```
Endpoint=sb://nameOfYourEventHubNamespace.servicebus.windows.net/;SharedAccessKeyName=ManageSend;SharedAccessKey=yourShareAccessKey2GUID;EntityPath=nameOfYourEventHub
```

1. Replace the placeholders `Name_of_your_Event_Hubs_namespace` with the name of your Event Hubs namespace.

    > [!IMPORTANT]
    > Enter all values without any quotes. Make sure there is at least one space character after the colons in the *YAML* file. You may also validate your *YAML* file contents using any online YAML validator such as [this tool](https://onlineyamltools.com/validate-yaml).


1. Save and close the file. Run the following command in the command window, and sign in with your Azure account when prompted.

    ```cmd/sh
    dotnet run CreateEndpoints
    ```
   
   It creates two endpoints for your Event hub.

   ![Endpoints for Event Hubs](./media/tutorial-facilities-analyze/dotnet-create-endpoints.png)

## Analyze with Time Series Insights

1. In the left navigation pane of the [Azure portal](https://portal.azure.com), click **Create a resource**. 

1. Search for and select a new **Time Series Insights** resource. Click **Create**.

1. Enter a **Name** for your Time Series Insights instance, and then select your **Subscription**. Select the **Resource group** you used for your Digital Twins instance, and your **Location**. Click **Create**.

    ![Create TSI](./media/tutorial-facilities-analyze/create-tsi.png)

1. Once deployed open the Time Series Insights environment, and then open its **Event Sources** pane. Click **Add** button at the top to add a consumer group.

1. In the **New event source** pane, enter a **Name**, and make sure the other values are selected correctly. Select *ManageSend* as the **Event hub policy name**, and then select the *consumer group* you created in the previous section as the **Event hub consumer group**. Click **Create**.

    ![TSI event source](./media/tutorial-facilities-analyze/tsi-event-source.png)

1. Open the **Overview** pane for your Time Series Insights environment, and click the **Go to Environment** button at the top. If you get a *data access warning*, then open the **Data Access Policies** pane for your TSI instance, click **Add**, select **Contributor** as the role, and select the appropriate user.

1. The **Go to Environment** button opens the [Time Series Insights Explorer](../time-series-insights/time-series-insights-explorer.md). If it does not show any events, simulate device events by navigating to the **_device-connectivity_** project of your Digital Twins sample, and running `dotnet run`.

1. After a few simulated events are generated, go back to the Time Series Insights explorer, and click the refresh button at the top. You should see analytical charts getting created for your simulated sensor data. 

    ![TSI explorer](./media/tutorial-facilities-analyze/tsi-explorer.png)

1. In the Time Series Explorer, you can then generate charts and heatmaps for different events and data from your rooms, sensors, and other resources. On the left-hand side, click the drop-down boxes named **MEASURE** and **SPLIT BY** to create your own visualizations. For example, select *Events* as the **MEASURE** and *DigitalTwins-SensorHardwareId* to **SPLIT BY**, to generate a heatmap for each of your sensors, similar to the following image:

    ![TSI explorer](./media/tutorial-facilities-analyze/tsi-explorer-heatmap.png)

## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select your Digital Twins resource group, and **Delete** it.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the next article to learn more about spatial intelligence graphs and object models in Azure Digital Twins. 
> [!div class="nextstepaction"]
> [Understanding Digital Twins object models and spatial intelligence graph](concepts-objectmodel-spatialgraph.md)

