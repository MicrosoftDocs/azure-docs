<properties 
	pageTitle="Vehicle telemetry analytics solution playbook | Microsoft Azure" 
	description="Use the capabilities of Cortana Intelligence to gain real-time and predictive insights on vehicle health and driving habits." 
	services="machine-learning" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/27/2016" 
	ms.author="bradsev" />


# Vehicle telemetry analytics solution playbook

This **menu** links to the chapters in this playbook. 

[AZURE.INCLUDE [cap-vehicle-telemetry-playbook-selector](../../includes/cap-vehicle-telemetry-playbook-selector.md)]

## Overview
Super computers have moved out of the lab and are now parked in our garage! These cutting-edge automobiles contain a myriad of sensors, giving them the ability to track and monitor millions of events every second. We expect that by 2020, most of these cars will be connected to the internet. Imagine tapping into this wealth of data to provide best in class safety, reliability and driving experience. Microsoft has made this imagination a reality via Cortana Intelligence.

Microsoft’s Cortana Intelligence is a fully managed big data and advanced analytics suite that enables you to transform your data into intelligent action. We want to introduce you to the Cortana Intelligence Vehicle Telemetry Analytics Solution Template. This solution demonstrates how car dealerships, automobile manufacturers and insurance companies can use the capabilities of Cortana Intelligence to gain real-time and predictive insights on vehicle health and driving habits. 

The solution is implemented as a [lambda architecture pattern](https://en.wikipedia.org/wiki/Lambda_architecture) showing the full potential of the Cortana Intelligence platform for real-time and batch processing. It includes a Vehicle Telematics simulator, leverages Event Hubs for ingesting millions of simulated vehicle telemetry events into Azure, then uses Stream Analytics for gaining real-time insights on vehicle health and persists that data into long-term storage for richer batch analytics. It takes advantage of Machine Learning for anomaly detection in real-time and batch processing to gain predictive insights. HDInsight is leveraged to transform data at scale, and Data Factory handles orchestration, scheduling, resource management and monitoring of the batch processing pipeline. Finally, Power BI gives this solution a rich dashboard for real-time data and predictive analytics visualizations. 

## Architecture

![](./media/cortana-analytics-playbook-vehicle-telemetry/fig1-vehicle-telemetry-annalytics-solution-architecture.png)
*Figure 1 – Vehicle Telemetry Analytics Solution Architecture*

This solution includes the following **Cortana Intelligence components** and showcases their end to end integration


- **Event Hubs** for ingesting millions of vehicle telemetry events into Azure.
- **Stream Analytics** for gaining real-time insights on vehicle health and persists that data into long-term storage for richer batch analytics.
- **Machine Learning** for anomaly detection in real-time and batch processing to gain predictive insights.
- **HDInsight** is leveraged to transform data at scale
- **Data Factory** handles orchestration, scheduling, resource management and monitoring of the batch processing pipeline.
- **Power BI** gives this solution a rich dashboard for real-time data and predictive analytics visualizations.

This solution accesses two different **data sources**: 

- **Simulated vehicle signals and diagnostics**: A vehicle telematics simulator emits diagnostic information and signals that correspond to the state of the vehicle and the driving pattern at a given point in time. 
- **Vehicle catalog**: A reference dataset containing a VIN to model mapping.
