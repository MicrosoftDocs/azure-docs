---
title: Set up an Azure Time Series Insights Preview environment tutorial | Microsoft Docs
description: Learn how to set up your environment in Azure Time Series Insights Preview.
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: tutorial
ms.date: 11/26/2018
---

# Tutorial: Set up an Azure Time Series Insights Preview environment

This tutorial guides you through the process of creating an Azure Time Series Insights Preview environment that's populated with data from simulated devices. In this tutorial, you learn how to:

* Create a Time Series Insights Preview environment.
* Connect the Time Series Insights Preview environment to an event hub in Azure Event Hubs.
* Run a wind farm simulation to stream data into the Time Series Insights Preview environment.
* Perform basic analysis on the data.
* Define a Time Series Model type and hierarchy and associate it with your instances.

## Create a Time Series Insights Preview environment

This section describes how to create a Time Series Insights Preview environment by using the [Azure portal](https://portal.azure.com/).

1. Sign in to the Azure portal by using your subscription account.

1. Select **Create a resource**.

1. Select the **Internet of Things** category, and then select **Time Series Insights**.

  ![Select Create a resource, then select Internet of Things, and then select Time Series Insights][1]

1. On the **Basics** tab, enter the required parameters, and then select **Next: Event Source**

  ![The Time Series Insights environment Basics tab and the Next: Event Source button][2]

1. On the **Event Source** tab, enter the required parameters, and then select **Review + Create**.

  ![The Event Source tab and the Review + Create button][3]

1. On the **Summary** tab, review all the details, and then select **Create** to start provisioning your environment.

  ![The Summary tab and the Create button][4]

1. When deployment is successful, a notification appears.

  ![Deployment succeeded notification][5]

## Send events to your Time Series Insights environment

In this section, you use a windmill device simulator to send events to your Time Series Insights environment via an event hub.

  1. In the Azure portal, go to your event hub resource and connect it to your Time Series Insights environment. To learn how, see [Connect your resource to an existing event hub](./time-series-insights-how-to-add-an-event-source-eventhub.md).

  1. On the event hub resource page, go to **Shared Access Policies** > **RootManageSharedAccessKey**. Copy the value for **Connection string-primary key**.

      ![Copy the value for the primary key connection string][6]

  1. Go to [https://tsiclientsample.azurewebsites.net/windFarmGen.html]( https://tsiclientsample.azurewebsites.net/windFarmGen.html). This web app at the URL simulates windmill devices.

  1. In the **Event Hub Connection String** box on the webpage, paste the connection string that you copied in the preceding step.

      ![Paste the primary key connection string in the Event Hub Connection String box][7]

  1. Select **Click to start** to push events to your event hub. A file named *instances.json* is downloaded to your computer. Save this file to use later.

  1. Go back to your event hub in the Azure portal. On the event hub **Overview** page, new events that are being received by the event hub are shown.

     ![An event hub Overview page that shows metrics for the event hub][8]

## Analyze data in your environment

In this section, you perform basic analytics on your time series data by using the Time Series Insights update explorer.

  1. Go to your Time Series Insights update explorer by clicking on the URL from the resource page in the Azure portal.

      ![The Time Series Insights explorer URL][9]

  1. In the explorer, under **Physical Hierarchy**, select the **Unparented Instances** nodes to see all the time series instances in the environment.

     ![List of unparented instances in the Physical Hierarchy pane][10]

  1. In this tutorial, we analyze data that was sent over the past day. Select **Quick Times**, and then select **Last 24 Hours**.

     ![In the Quick Times drop-down box, select Last 24 Hours][11]

  1. Select **Sensor_0**, and then select **Show Avg Value** to visualize data being sent from this Time Series Insights instance.

     ![Select Show Avg Value for Sensor_0][12]

  1. Similarly, you can plot data that comes from other Time Series Insights instances to perform basic analytics.

     ![A Time Series Insights data plot][13]

## Define a type and hierarchy 

In this section, you author a type and hierarchy, and then associate the type and hierarchy with your Time Series Insights instances. You can read more about [Time Series Models](./time-series-insights-update-tsm.md).

  1. In the explorer, select the **Model** tab.

     ![The Model tab in the explorer menu][14]

  1. In the **Types** section, select **Add** to create a new Time Series Model type.

     ![The Add button on the Types page][15]

  1. In the type editor, enter values for **Name** and **Description**. Create variables for **Average**, **Min**, and **Max** values as shown in the following figures. Select **Create** to save the type.

     ![The Add a Type pane and the Create button][16]

     ![The Windmill sample types][17]

  1. In the **Hierarchies** section, select **Add** to create a new Time Series Model hierarchy.

     ![The Add button on the Hierarchies page][18]

  1. In the hierarchy editor, enter a value for **Name** and add hierarchy levels. Select **Create** to save the hierarchy.

     ![The Add a Hierarchy pane and the Create button][19]

     ![The Physical Hierarchy box][20]

  1. In the **Instances** section, select an instance, and then select **Edit** to associate a type and hierarchy with this instance.

     ![List of instances][21]

  1. In the instance editor, select the type and hierarchy that you defined in steps 3 and 5.

     ![The Edit an Instance pane][22]

  1. Alternatively, to select the type and hierarchy for all instances at once, you can edit the *instances.json* file that was downloaded earlier. In this file, replace all **typeId** and **hierarchyId** fields with the ID obtained in steps 3 and 5.

  1. In the **Instances** section, select **Upload JSON** and upload the edited *instances.json* file.

     ![The Upload JSON button][23]

  1. Select the **Analytics** tab and refresh your browser. All the instances associated with the type and hierarchy that you defined should appear.

     ![A Time Series Insights data plot][24]

## Next steps

In this tutorial, you learned how to:  

* Create a Time Series Insights Preview environment.
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