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

This tutorial demonstrates how to use the Digital Twins to manage your facilities for efficient space utilization. Once you have provisioned the spatial graph and user-defined function using the steps in the previous tutorials, you can integrate simulated device events with other services to visualize and analyze the data. In the third tutorial, you understood how to receive *hot data* (or instantaneous) events. This tutorial shows you steps to perform *warm path analytics* to visualize and store the sensor telemetry data at a slightly slower pace/storage, using [Azure Time Series Insights or TSI](../time-series-insights/time-series-insights-overview.md). You will use Azure Time Series Insights to create detailed visualizations and analyses of the telemetry data from your simulated device sensors.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Stream data using Event Hub
> * Analyze events using Time Series Insights

If you don’t have an Azure, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

This tutorial assumes that you have completed the steps to [Provision your Azure Digital Twins setup](tutorial-facilities-setup.md), as well as [Custom monitor your Azure Digital Twins setup](tutorial-facilities-udf.md). Before proceeding, make sure that you have:
- an instance of Digital Twins running, and 
- the [Azure Digital Twins sample application](https://github.com/Azure-Samples/digital-twins-samples-csharp) downloaded or cloned on your work machine.


## Stream data using Event Hub
[Event Hubs](../event-hubs/event-hubs-about.md) allow you to create a pipeline to stream your data. This section shows you how to create your Event hub as the connector between your Digital Twins and TSI instances.

### Create an Event Hub

1. Sign in to [Azure portal](https://portal.azure.com).
1. On the left navigation panel, select **Resource groups**, and search for the resource group you created or used for your Digital Twins instance. 

1. On the **Overview** pane of your resource group, click the **Add** button.

1. Search for and select **Event Hubs**. Click **Create**.

1. Enter a **Name** for your Event Hub namespace, choose *Standard* **Pricing tier**, your **Subscription**, your existing **Resource group**, and the **Location**. Click **Create**. 

1. Once deployed, navigate to the Event Hub namespace *deployment*, and click on the namespace under **RESOURCE**.

    ![Event Hub namespace](./media/tutorial-facilities-analyze/open-event-hub-ns.png)


1. In the Event Hub namespace **Overview** pane, click on the **Event Hub** button at the top. 
    ![Event Hub](./media/tutorial-facilities-analyze/create-event-hub.png)

1. Enter a **Name** for your Event Hub resource, and click **Create**. Once deployed, it will appear in the **Event Hubs** pane of the Event Hub namespace with an *Active* **STATUS**. Click on the Event Hub instance to open its **Overview** pane.

1. Click **Consumer group** button at the top, and enter a name such as *tsievents* for the consumer group. Click **Create**.
    ![Event Hub consumer group](./media/tutorial-facilities-analyze/event-hub-consumer-group.png)

   Once created, the consumer group will appear in the list at the bottom of the Event hub's **Overview** pane. 

1. Open the **Shared access policies** pane for your Event hub, and click **Add** button. **Create** a policy named *ManageSend*, and make sure all the checkboxes are checked. 

    ![Event Hub connection strings](./media/tutorial-facilities-analyze/event-hub-connection-strings.png)

1. Open the *ManageSend* policy that you just created, and copy to clipboard the values for **Connection string--primary key** and **Connection string--secondary key**. You will need these values to create an endpoint for Event Hub in your Digital Twin instance in the next section.

### Create endpoint for the Event hub

1. In a command window, navigate to the Digital Twins sample, and then run `cd occupancy-quickstart\src`.
1. Open the file *actions\createEndpoints.yaml* in your editor. Replace the contents with the following:
```yaml
- type: EventHub
  eventTypes:
  - SensorChange
  - SpaceChange
  - TopologyOperation
  - UdfCustom
  connectionString: <Primary connection string for your Event hub>
  secondaryConnectionString: <Secondary connection string for your Event hub>
  path: <Name of your Event Hub namespace>
- type: EventHub
  eventTypes:
  - DeviceMessage
  connectionString: <Primary connection string for your Event hub>
  secondaryConnectionString: <Secondary connection string for your Event hub>
  path: <Name of your Event Hub namespace>
```
1. Enter the value for **Connection string--primary key** for the Event hub for `connectionString`, and the value for **Connection string--secondary key** for the `secondaryConnectionString`. Enter the name of your Event Hub namespace as `path`.
1. Save and close the file. Run `dotnet run CreateEndpoints` in the command window. Sign in with your Azure account when prompted. It creates two endpoints for your Event hub.

    ![Endpoints for Event Hub](./media/tutorial-facilities-analyze/dotnet-create-endpoints.png)

## Analyze events using Time Series Insights

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left navigation pane, click **Resource groups**, and then select the resource group you created or used for your Digital Twins instance. 
1. Click **Add** button on top, and search and select a new **Time Series Insights** resource. Click **Create**.
1. Enter a **Name** for your Time Series Insights instance, and then select your **Subscription**, your **Resource group**, and **Location**. Click **Create**.

    ![Create TSI](./media/tutorial-facilities-analyze/create-tsi.png)

1. Open the TSI instance once deployed, and then open the **Event Sources** pane. Click **Add** button at the top to add a consumer group.
1. In the **New event source** pane, enter a **Name**, and make sure the other values are selected correctly. Select *ManageSend* as the **Event hub policy name**, and then select the *consumer group* we created in the previous section as the **Event hub consumer group**. Click **Create**.
    ![TSI event source](./media/tutorial-facilities-analyze/tsi-event-source.png)

1. Open the **Overview** pane for your Time Series Insights instance, and click **Go to Environment**. If you get a *data access warning*, then open the **Data Access Policies** pane for your TSI instance, click **Add**, select **Contributor** as the role, and select the appropriate user.

1. The **Go to Environment** button opens the [Time Series Insights Explorer](../time-series-insights/time-series-insights-explorer.md). If it does not show any events, navigate to your Digital Twins sample, and then to the *device-connectivity* project. Run `dotnet run` to generate simulated device events. In the TSI explorer in the portal, click the icon to **Refresh environment information**. You should see analyses and perspectives getting created for your simulated telemetry data.

    ![TSI explorer](./media/tutorial-facilities-analyze/tsi-explorer.png)


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the next article to learn more about the spatial intelligence graph and object model in Azure Digital Twins. 
> [!div class="nextstepaction"]
> [Next steps button](concepts-objectmodel-spatialgraph.md)

