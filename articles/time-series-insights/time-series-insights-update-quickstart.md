---
title: 'Quickstart: Explore the Azure Time Series Insights Preview demo environment | Microsoft Docs'
description: Understand the Azure Time Series Insights Preview demo environment
ms.service: time-series-insights 
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: anshan
ms.topic: quickstart
ms.workload: big-data
ms.custom: mvc
ms.date: 12/03/2018
---

# Quickstart: Explore the Azure Time Series Insights Preview demo environment

This quickstart shows you how to use the Azure Time Series Insight Preview explorer in a free demonstration environment. You learn how to use your web browser to visualize large volumes of historical industrial IoT data, and you tour the key features of the Time Series Insights Preview explorer.

Time Series Insights provides an end-to-end platform as a service (PaaS) offering. It can ingest, process, store, and query highly contextualized, time-series-optimized IoT-scale data for improvised data exploration. It also provides operational analysis. Time Series Insights is a differentiated offering that's tailored to the unique needs of industrial IoT deployments.

The demo environment shows an electricity generation company, Contoso. In the environment, you use Time Series Insights to find actionable insights in Contoso data and conduct a short root-cause analysis. Contoso operates two wind turbine farms, each with 10 turbines. Each turbine has 20 sensors that report data every minute to Azure IoT Hub. The sensors gather information about weather conditions, blade pitch and yaw position, generator performance, gearbox behavior, and safety monitors.

You use Time Series Insights Preview to analyze Contoso's ever-growing dataset from the last two years, which is currently at 40 GB. It can help you to better understand and predict both critical failures and slow-moving maintenance issues.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Explore the Time Series Insights explorer in a demo environment

1. In your browser, go to the [Contoso Wind Farm environment](https://insights.timeseries.azure.com/preview/samples).  

1. If you're prompted, sign in to the Time Series Insights explorer with your Azure account credentials.

### Demo step 1

1. Let’s take a look at wind turbine **W7** in **Contoso Plant 1**.  

    * **Action**: Update the view range to **1/1/17 20:00 to 3/10/17 20:00 (UTC)**, add the **Contoso Plant 1** > **W7** > **Generator System** > **GeneratorSpeed** sensor, and then display the resulting values.

       ![Quickstart one][1]

1. Recently, Contoso found a fire in wind turbine **W7**. Let’s drill in here. We can see that the fire alert sensor was activated during the fire.

    * **Action**: Update the view range to **3/9/17 20:00 to 3/10/17 20:00 (UTC)**, and add the **Safety System** > **FireAlert** sensor.

      ![Quickstart two][2]

1. Let’s see what else happened around the time of the fire. Both oil pressure and active warnings spiked just before the fire but by that time it was too late to prevent the issue.

    * **Action**: Add the **Pitch System** > **HydraulicOilPressure** sensor and the **Pitch System** > **ActiveWarning** sensor.

      ![Quickstart three][3]

1. If we zoom out, we can see there were signs leading up to the fire. Both sensors fluctuated. So, has this issue happened before?

    * **Action**: Update the view range to **2/24/17 20:00 to 3/10/17 20:00 (UTC)**.

      ![Quickstart four][4]

1. If we examine the whole two years of data, we can see a previous fire event with the same signs. With this data, we can build systems to catch issues like this one early.

    * **Action**: Update the view range to **1/1/16 to 12/31/17** (all data).

       ![Quickstart five][5]

### Demo step 2

1. Other issues are more subtle and harder to diagnose. Time Series Insights provides a range of ways to help us track down difficult issues. Here we can see a warning sensor outage on **W6** on **6/25**. But what’s actually happening?

    * **Action**: Remove the current sensors, update the view range to **6/1/17 20:00 to 7/1/17 20:00 (UTC)**, and then add the **Contoso Plant 1** > **W6** > **Safety System** > **VoltageActuatorSwitchWarning** sensor.

       ![Quickstart six][6]

1. The warning indicates an issue with the voltage being output by the generator. But what’s the cause? The overall power output of the generator looks fine at a granular interval. But by aggregating the data, we can see a definitive drop-off.

    * **Action**: Remove the **VoltageActuatorSwitchWarning** sensor, add the **Generator System** > **ActivePower** sensor, and update the interval to **3d**.

       ![Quickstart seven][7]

1. If we navigate forward in the dataset, we can see that this issue isn’t transient. It is continuing.

    * **Action**: Extend the time span to the right.

       ![Quickstart eight][8]

1. Let’s drill further. We can add other sensor data points to view voltage by phase. But the data points all look comparable. Let’s drop a marker to see the actual values. It looks like there's a problem with the phase 3 output.

    * **Action**: Add **Generator System** > **GridVoltagePhase1**, **GridVoltagePhase2**, and **GridVoltagePhase3** sensors. Drop a marker on the last data point in the visible area.

       ![Quickstart eight][8]

1. If we view all three data points on the same scale, the phase 3 drop-off appears even more obvious. At this point, we’re ready to refer the issue to our maintenance team with a good lead on the cause of the warning.  

    * **Action**: Update the display to overlay all sensors on the same chart scale.

       ![Quickstart nine][9]

## Next steps

You're ready to create your own Time Series Insights Preview environment:

> [!div class="nextstepaction"]
> [Plan your Time Series Insights Preview environment](time-series-insights-update-plan.md)

<!-- Images -->
[1]: media/v2-update-quickstart/quickstart-one.png
[2]: media/v2-update-quickstart/quickstart-two.png
[3]: media/v2-update-quickstart/quickstart-three.png
[4]: media/v2-update-quickstart/quickstart-four.png
[5]: media/v2-update-quickstart/quickstart-five.png
[6]: media/v2-update-quickstart/quickstart-six.png
[7]: media/v2-update-quickstart/quickstart-seven.png
[8]: media/v2-update-quickstart/quickstart-eight.png
[9]: media/v2-update-quickstart/quickstart-nine.png
