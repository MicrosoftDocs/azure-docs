---
title: Analyze events from Azure Digital Twins setup | Microsoft Docs
description: Learn how to visualize and analyze events from your Azure Digital Twins spaces, with Azure Time Series Insights, using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 08/30/2018
ms.author: dkshir
---

# Tutorial: Visualize and analyze events from your building using Azure Digital Twins

This tutorial demonstrates how to visualize and analyze data received from the spaces and other resources provisioned in your Azure Digital Twins instance. After configuring your spatial graph in [the first tutorial](tutorial-facilities-setup.md), and provisioning and monitoring simulated sensor data in [the second tutorial](tutorial-facilities-udf.md), you can integrate the simulated device data with other services to visualize and analyze this data. In [the third tutorial](tutorial-facilities-events.md), you learned how to receive notifications for instantaneous events. This tutorial shows you how to analyze larger chunks of the sensor data at a slightly slower pace (or *warm path analytics*), using [Azure Time Series Insights or TSI](../time-series-insights/time-series-insights-overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Stream data using Event Hubs
> * Analyze with Time Series Insights

## Prerequisites

This tutorial assumes that you have completed the steps to [configure your Azure Digital Twins setup](tutorial-facilities-setup.md), as well as [provision and monitor your Azure Digital Twins setup](tutorial-facilities-udf.md). Before proceeding, make sure that you have:
- an [Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F),
- an instance of Digital Twins running, 
- the [Azure Digital Twins samples](https://github.com/Azure-Samples/digital-twins-samples-csharp) downloaded and extracted on your work machine,
- [.NET Core 2.1 or above SDK](https://www.microsoft.com/net/download) on your development machine to run the sample. 


## Stream data using Event Hubs
[Event Hubs](../event-hubs/event-hubs-about.md) allow you to create a pipeline to stream your data. This section shows you how to create your event hub as the connector between your Digital Twins and TSI instances.

### Create an event hub

1. Sign in to [Azure portal](https://portal.azure.com).
1. On the left navigation panel, select **Resource groups**, and search for the resource group you created or used for your Digital Twins instance. 

1. On the **Overview** pane of your resource group, click the **Add** button.

1. Search for and select **Event Hubs**. Click **Create**.

1. Enter a **Name** for your Event Hubs namespace, choose *Standard* **Pricing tier**, your **Subscription**, your existing **Resource group**, and the **Location**. Click **Create**. 

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

1. Open the *ManageSend* policy that you just created, and copy the values for **Connection string--primary key** and **Connection string--secondary key** to a temporary *Notepad* file. You will need these values to create an endpoint for the event hub in your Digital Twin instance in the next section.

### Create endpoint for the event hub

1. In a command window, navigate to the **_occupancy-quickstart\src** folder of the Digital Twins sample.

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

1. Replace the placeholders `Primary_connection_string_for_your_event_hub` with the value of the **Connection string--primary key** for the event hub. Make sure the format of this connection string is as following: **Endpoint=sb://nameOfYourEventHubNamespace.servicebus.windows.net/;SharedAccessKeyName=ManageSend;SharedAccessKey=yourShareAccessKey1GUID;EntityPath=nameOfYourEventHub**.

1. Replace the placeholders `Secondary_connection_string_for_your_event_hub` with the value of the **Connection string--secondary key** for the event hub. Make sure the format of this connection string is as following: **Endpoint=sb://nameOfYourEventHubNamespace.servicebus.windows.net/;SharedAccessKeyName=ManageSend;SharedAccessKey=yourShareAccessKey2GUID;EntityPath=nameOfYourEventHub**.

1. Replace the placeholders `Name_of_your_Event_Hubs_namespace` with the name of your Event Hubs namespace.

    > [!IMPORTANT]
    > Enter all values without any quotes. Make sure there is at least one space character after the colon in the *YAML* file. Make sure there are no trailing spaces or extra characters, since *YAML* is a sensitive file format.

1. Save and close the file. Run the following command in the command window, and sign in with your Azure account when prompted.

    ```cmd/sh
    dotnet run CreateEndpoints
    ```
   
   It creates two endpoints for your Event hub.

   ![Endpoints for Event Hubs](./media/tutorial-facilities-analyze/dotnet-create-endpoints.png)

## Analyze with Time Series Insights

1. In the left navigation pane of the [Azure portal](https://portal.azure.com), click **Resource groups**, and then select the resource group you created or used for your Digital Twins instance. 

1. Click **Add** button on top, and search and select a new **Time Series Insights** resource. Click **Create**.

1. Enter a **Name** for your Time Series Insights instance, and then select your **Subscription**, your **Resource group**, and **Location**. Click **Create**.

    ![Create TSI](./media/tutorial-facilities-analyze/create-tsi.png)

1. Once deployed open the Time Series Insights environment, and then open its **Event Sources** pane. Click **Add** button at the top to add a consumer group.

1. In the **New event source** pane, enter a **Name**, and make sure the other values are selected correctly. Select *ManageSend* as the **Event hub policy name**, and then select the *consumer group* we created in the previous section as the **Event hub consumer group**. Click **Create**.

    ![TSI event source](./media/tutorial-facilities-analyze/tsi-event-source.png)

1. Open the **Overview** pane for your Time Series Insights environment, and click the **Go to Environment** button at the top. If you get a *data access warning*, then open the **Data Access Policies** pane for your TSI instance, click **Add**, select **Contributor** as the role, and select the appropriate user.

1. The **Go to Environment** button opens the [Time Series Insights Explorer](../time-series-insights/time-series-insights-explorer.md). If it does not show any events, navigate to the **_device-connectivity_** project of your Digital Twins sample, and run `dotnet run` to generate simulated device events. 

1. After a few simulated events are generated, go back to the Time Series Insights explorer, and click the refresh button at the top. You should see analytical charts getting created for your simulated sensor data. 

    ![TSI explorer](./media/tutorial-facilities-analyze/tsi-explorer.png)


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the next article to learn more about the spatial intelligence graph and object model in Azure Digital Twins. 
> [!div class="nextstepaction"]
> [Understanding Digital Twins Object Models and Spatial Intelligence Grap](concepts-objectmodel-spatialgraph.md)

