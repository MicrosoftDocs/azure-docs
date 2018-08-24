---
title: Visualize Remote Monitoring Data with Azure Time Series Insights | Microsoft Docs
description: Learn how to configure your Time Series Insights environment to explore and analyze the time series data of your Remote Monitoring solution.
author: philmea
manager: timlt
ms.author: philmea
ms.date: 04/29/2018
ms.topic: conceptual
ms.service: iot-accelerators
services: iot-accelerators
---

# Integrate Azure Time Series Insights (TSI) with Remote Monitoring
Azure Time Series Insights is a fully managed analytics, storage, and visualization service for managing IoT-scale time-series data in the cloud. You can use Time Series Insights to store and manage terabytes of time-series data, explore, and visualize billions of events simultaneously, conduct root-cause analysis, and to compare multiple sites and assets.

An operator may want to further explore data in Remote Monitoring in the Azure Time Series Insights explorer. Our solution accelerator now provides automatic deployment and integration with TSI*. In this how-to you will learn how to configure TSI for an existing Remote Monitoring deployment that does not include TSI out of the box.

> [!NOTE]
> Azure Time Series Insights for Remote Monitoring is in Preview and only available in [select regions](https://azure.microsoft.com/en-us/global-infrastructure/services/).

## Prerequisites

To complete this how-to, you will need have already deployed a Remote Monitoring solution:

* [Deploy the Remote Monitoring preconfigured solution](quickstart-remote-monitoring-deploy.md)

## Deploy TSI
The first step is to deploy TSI as an additional resource into your Remote Monitoring solution.

1. Sign in to the [Azure portal](http://portal.azure.com/).

1. Select **Create a resource** > **Internet of Things** > **Time Series Insights**.

    ![New Time Series Insights](./media/iot-accelerators-time-series-insights/new-time-series-insights.png)

1. To create your Time Series Insights environment, use the values in the following table:

    | Setting | Value |
    | ------- | ----- |
    | Environment Name | The following screenshot uses the name **contorosrmtsi**. Choose your own unique name when you complete this step. |
    | Subscription | Select your Azure subscription in the drop-down. |
    | Resource group | **Use existing**. Select the name of your existing Remote Monitoring resource group. |
    | Location | We are using **East US**. Create your environment in the same region as your Remote Monitoring solution. |
    | Sku |**S1** |
    | Capacity | **1** |
    | Pin to dashboard | **Yes** |

    ![Create Time Series Insights](./media/iot-accelerators-time-series-insights/new-time-series-insights-create.png)

1. Click **Create**. It can take a moment for the environment to be created.

> [!NOTE]
> If you need to grant additional users access to the Time Series Insights explorer, you can use these steps to [grant data access](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-data-access#grant-data-access).

## Add the Remote Monitoring application as a user
To make sure all users who have access to your Remote Monitoring solution are able to explore data in the TSI explorer, you will need to add your application as a user under IAM in the Azure Portal. 

## Configure ASA Manager microservice
The next step is to configure the ASA Manager microservice to write messages to TSI. This step will duplicate the messages that are right now streamed to Cosmos DB.

## Pull the latest telemetry service update
Pull the latest telemetry service update (with config value for storage set to "tsi".

1. In the Azure portal, select the **Overview** tab.

1. Click **Go To Environment**, which will open the Time Series Insights explorer web app.

    ![Time Series Insights Explorer](./media/iot-accelerators-time-series-insights/time-series-insights-environment.png)

## *[Optional]* Disable Cosmos messages stream
To save on costs associated with Cosmos DB, you need to disable writing messages to Cosmos DB in the ASA manager. 

1. 

## *[Optional]* Migrate existing data to TSI
TSI can store data up to 400 days, which can help you analyze long term trends and patterns. If you would like to migrate your existing Remote Monitoring solution data to TSI, you will need to make the following modifications. However, we recommend starting fresh with your data if possible to avoid running into daily TSI throttling limits.

If you would like to work around these throttling limits you will need to temporarily increase the capacity of your TSI environment which will also temporarily increase your cost.

1. 

## *[Optional]* Configure the Web UI to link to the TSI explorer
To easily view your data in the TSI explorer, we recommend customizing the UI to easily link to the environment.

1. 

## Next Steps
* To learn about how to explore your data and diagnose an alert in the TSI explorer, see [Diagnosing an alert with TSI](/tutorials).

* To learn how to explore and query data in the Time Series Insights explorer, see [Azure Time Series Insights explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-explorer).
