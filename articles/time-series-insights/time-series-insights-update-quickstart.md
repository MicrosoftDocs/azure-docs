---
title: Explore the Azure Time Series Insights (preview) demo environment | Microsoft Docs
description: Understand the Azure Time Series Insights (preview) demo environment
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

# Explore the Azure Time Series Insights (Preview) demo environment

This quickstart shows you how to get started with Azure Time Series Insights (preview) explorer in a free demonstration environment. You learn how to use your web browser to visualize large volumes of historical industrial IoT data and tour the key features of the Time Series Insights (preview) explorer.

Azure Time Series Insights provides an end-to-end Platform-As-A-Service offering to ingest, process, store, and query highly contextualized, time-series-optimized IoT-scale data for ad-hoc data exploration as well as operational analysis. Time Series Insights is a differentiated offering tailored to the unique needs of industrial IoT deployments.

The demo environment shows an electricity generation company, Contoso, using Time Series Insights to find actionable insights in their data and conduct a short root-cause analysis. Contoso operates two wind turbine farms, each with 10 turbines, and each turbine has 20 sensors reporting data every minute to Azure IoT Hub. Sensors gather information on weather conditions, blade pitch & yaw position, generator performance, gearbox behavior, and safety monitors.

The Time Series Insights (preview) is used to analyze the ever-growing data set from the last two years – currently at 40 GB – to better understand and predict both critical failures and slow-moving maintenance issues.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Explore Time Series Insights explorer in a demo environment

1. In your browser, navigate to [insights.timeseries.azure.com/preview/samples](https://insights.timeseries.azure.com/preview/samples).  

1. If prompted, sign in to the Time Series Insights explorer using your Azure account credentials.

### Demo step one

1. Let’s take a look at **wind turbine #7 in farm #1**. It’s been performing well.  

    * Action: Update the view range to `1/1/17 20:00 – 3/10/17 20:00 (UTC)` and add the `Farm 1 > W7 > Generator > GeneratorSpeed` sensor.

       ![Quickstart one][1]

1. Recently, **Contoso found a fire in turbine #7**. Let’s drill in here. We can see the fire alert sensor activated during the period of the fire.

    * Action: Update the view range to `3/9/17 20:00 – 3/10/17 20:00 (UTC)` and add the `Safety > FireAlert` sensor.

      ![Quickstart two][2]

1. Let’s see what else happened around the time of the fire. Both oil pressure and active warnings spiked just before the fire but by that point it was too late to avert the issue.

    * Action: Add the `Pitch > HydraulicOilPressure` sensor and the `Pitch > ActiveWarning` sensor.

      ![Quickstart three][3]

1. If we zoom out, we can see there were signs leading up to the fire. Both sensors fluctuated. So has this happened before?

    * Action: Update the view range to `2/24/17 20:00 – 3/10/17 20:00 (UTC)`.

      ![Quickstart four][4]

1. If we examine the whole two years of data, we can see a previous fire event with the same signs. With this data, we build systems to catch issues like this early.

    * Action: Update the view range to `1/1/16 – 12/31/17` (all data).

       ![Quickstart five][5]

### Demo step two

1. Other issues are more subtle and harder to diagnose. Time Series Insights provides a range of capabilities to help us track down difficult issues. Here we can see a warning sensor outage on `turbine #6` on `6/25`. But what’s actually happening?

    * Action: Remove the current sensors. Then update the view range to `6/1/17 20:00 – 7/1/17 20:00 (UTC)` and add the `Farm 1 > W6 > Safety > VoltageActuatorSwitchWarning`.

       ![Quickstart six][6]

1. The warning indicates an issue with the voltage being output by the generator. But what’s the cause? The overall power output of the generator looks fine at a granular interval. But by aggregating the data, we can see a definitive drop off.

    * Action: Remote the `VoltageActuatorSwitchWarning` and add `Generator > ActivePower` and update interval to `3d`.

       ![Quickstart seven][7]

1. If we navigate forward in the dataset, we can see this isn’t just a transient issue. The problem is continuing.

    * Action: Press the right arrow to advance the view.

       ![Quickstart eight][8]

1. Let’s drill further. We can other sensor data points to view voltage by phase. But they all look comparable. Let’s drop a marker to see the actual values. It looks like three is a problem with the phase 3 output.

    * Action: `Add Generator > GridVoltagePhase1, 2, & 3`. Drop a marker on the last datapoint in the visible area.

       ![Quickstart eight][8]

1. If we view all three on the same scale, it makes the phase 3 drop off even more obvious. At this point, we’re ready to refer this issue to our maintenance team with a good lead on the cause of the warning.  

    * Action: Update the display to overlay all sensors on the same chart scale.

       ![Quickstart nine][9]

## Next steps

You are ready to create your own Azure Time Series Insights (preview) environment:

> [!div class="nextstepaction"]
> [Plan your Azure Time Series Insights (preview) environment](time-series-insights-update-plan.md)

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