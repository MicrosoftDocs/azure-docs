---
title: Azure Time Series Insights (preview) tutorial | Microsoft Docs
description: Learn about Azure Time Series Insights (preview
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: tutorial
ms.date: 11/26/2018
---

# Azure Time Series Insights (Preview) tutorial

This tutorial will guide you through the process of creating an Azure Time Series Insights (TSI) Preview environment, populated with data from simulated devices. In this tutorial, you learn how to:

* Create a TSI (Preview)environment.
* Connect the TSI (Preview) environment to an Event Hub.
* Run a wind farm simulation to stream data into the TSI Preview environment.
* Perform basic analysis on the data.
* Define a Time Series Model type and hierarchy and associate it with your instances.

## Create a Time Series Insights (Preview) environment

This section describes how to create an Azure TSI (Preview) environment using the [Azure Portal](https://portal.azure.com/).

1. Sign into Azure Portal using your subscription account
1. Select **+ Create a resource** in the upper left.
1. Select the **Internet of Things** category, then select **Time Series Insights**.

  ![tutorial-one][1]

1. On the Time Series Insights environment page, fill in the required parameters and click on **Next: Event Source**

  ![tutorial-two][2]

1. On the **Event source** page, fill in the required parameters and click on **Review + Create**.

  ![tutorial-three][3]

1. Review all the details and click **Create** to start provisioning your environment.

  ![tutorial-four][4]

1. You will receive a notification once the deployment has completed successfully.

  ![tutorial-five][5]

## Send events to your TSI environment

In this section, you will use a windmill device simulator to send events to your TSI environment via an Event Hub.

  1. In the Azure Portal, navigate to your event hub resource and connect it to your TSI environment. Learn [how to connect your resource to an existing Event Hub](./time-series-insights-how-to-add-an-event-source-eventhub.md).

  1. On the Event Hub resource page, go to **Shared Access Policies** and then **RootManageSharedAccessKey**. Copy the **Connection string-primary key** displayed here.

      ![tutorial-six][6]

  1. Go to [https://tsiclientsample.azurewebsites.net/windFarmGen.html]( https://tsiclientsample.azurewebsites.net/windFarmGen.html). This web app simulates windmill devices.
  1. Paste the connection string copied from step 3 in the **Event Hub Connection String**

      ![tutorial-seven][7]

  1. Click on **Click to Start** pushing events to your Event Hub. At this stage, a file named `instances.json` will be downloaded to your machine. Save this file as we will need this later.

  1. Go back to your event hub. You should now see the new events being received by the hub.d

     ![tutorial-eight][8]

## Analyze data in your environment

In this section, you will perform basic analytics on your time series data using the Time Series Insights update explorer.

  1. Navigate to your Time Series Insights update explorer by clicking on the URL from the resource page on the Azure Portal.

      ![tutorial-nine][9]

  1. In the explorer, click on the **Unparented Instances** nodes to see all the Time Series instances in the environment.

     ![tutorial-ten][10]

  1. In this tutorial, we’re going to analyze data sent within the last day. To do so, click on **Quick Times** and select the **Last 24 Hours** option.

     ![tutorial-eleven][11]

  1. Select **Sensor_0** and choose **Show Avg Value** to visualize data being sent from this time series instance.

     ![tutorial-twelve][12]

  1. Similarly, you can plot data coming from other time series instances to perform basic analytics.

     ![tutorial-thirteen][13]

## Define a Type & Hierarchy 

In this section, you will author a type, hierarchy, and associate them with your time series instances. Read more about [Time Series Models](./time-series-insights-update-tsm.md).

  1. In the explorer, click on the **Model** tab in the app bar.

     ![tutorial-fourteen][14]

  1. In the Types section, click on **+ Add**. This will let you create a new Time Series Model Type.

     ![tutorial-fifteen][15]

  1. In the type editor, enter a **Name**, **Description**, and create variables for **Average**, **Min**, and **Max** values as shown below. Click on **Create** to save the type.

     ![tutorial-sixteen][16]

     ![tutorial-seventeen][17]

  1. In the **Hierarchies** section, click on **+ Add**. This will let you create a new Time Series Model Hierarchy.

     ![tutorial-eighteen][18]

  1. In the hierarchy editor, enter a **Name** and add hierarchy levels as shown below. Click on **Create** to save the hierarchy.

     ![tutorial-nineteen][19]

     ![tutorial-twenty][20]

  1. In the **Instances** section, select an instance and click on **Edit**. This will let you associate a type and hierarchy with this instance.

     ![tutorial-twenty-one][21]

  1. In the instance editor, choose the type and hierarchy defined in steps 3, 5 above as shown.

     ![tutorial-twenty-two][22]

  1. Alternatively, to do this for all instances at once, you can edit the `instances.json` file that was downloaded earlier. In this file, replace all **typeId** and **hierarchyId** fields with the ID obtained from steps 3, 5 above.

  1. In the **Instances** section, click on **Upload JSON** and upload the edited `instances.json` file as shown below.

     ![tutorial-twenty-three][23]

  1. Navigate to the **Analytics** tab and refresh your browser. You should now see all the instances associated with the type and hierarchy defined above.

     ![tutorial-twenty-four][24]

## Next steps

In this tutorial, you learned how to:  

* Create a TSI (Preview) environment.
* Connect the TSI (Preview) environment to an Event Hub.
* Run a wind farm simulation to stream data into the TSI (Preview) environment.
* Perform basic analysis on the data.
* Define a Time Series Model type, hierarchy, and associate it with your instances.

Now that you know how to create your own TSI update environment, learn more about the key concepts in TSI.

Read about TSI storage configuration:

> [!div class="nextstepaction"]
> [Azure TSI (Preview) storage and ingress](./time-series-insights-update-storage-ingress.md)

Learn more about Time Series Models:

> [!div class="nextstepaction"]
> [Azure TSI (Preview) Data modeling](./time-series-insights-update-tsm.md)

<!-- Images -->
[1]: media/v2-update-provision/tutorial-one.png
[2]: media/v2-update-provision/tutorial-two.png
[3]: media/v2-update-provision/tutorial-three.png
[4]: media/v2-update-provision/tutorial-four.png
[5]: media/v2-update-provision/tutorial-five.png
[6]: media/v2-update-provision/tutorial-six.png
[7]: media/v2-update-provision/tutorial-seven.png
[8]: media/v2-update-provision/tutorial-eight.png
[9]: media/v2-update-provision/tutorial-nine.png
[10]: media/v2-update-provision/tutorial-ten.png
[11]: media/v2-update-provision/tutorial-eleven.png
[12]: media/v2-update-provision/tutorial-twelve.png
[13]: media/v2-update-provision/tutorial-thirteen.png
[14]: media/v2-update-provision/tutorial-fourteen.png
[15]: media/v2-update-provision/tutorial-fifteen.png
[16]: media/v2-update-provision/tutorial-sixteen.png
[17]: media/v2-update-provision/tutorial-seventeen.png
[18]: media/v2-update-provision/tutorial-eighteen.png
[19]: media/v2-update-provision/tutorial-nineteen.png
[20]: media/v2-update-provision/tutorial-twenty.png
[21]: media/v2-update-provision/tutorial-twenty-one.png
[22]: media/v2-update-provision/tutorial-twenty-two.png
[23]: media/v2-update-provision/tutorial-twenty-three.png
[24]: media/v2-update-provision/tutorial-twenty-four.png