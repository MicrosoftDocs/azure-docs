---
title: Configure Data Retention in Azure Time Series Insights | Microsoft Docs
description: This article describes how to configure data retention in Azure Time Series Insights
keywords: 
services: time-series-insights
documentationcenter: 
author: kfile
manager: jhubbard
editor: 

ms.assetid: 
ms.service: tsi
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-data
ms.date: 10/31/2017
ms.author: kfile
---

# Configure data retention in Time Series Insights

Time Series Insights can store data for up to 400 days and TSI enables two modes for managing ingress and data purge settings when the capacity of an environment is reached.  These two modes are **continue ingress and purge old data** and **pause ingress**.  The default setting, and the only option available when creating a new environment, is **continue ingress and purge old data**.  From experience and customer interaction, we expect most will want to use this setting, which optimizes for the freshest data.  However, you can toggle between these modes in the configuration blade of an existing environment. 

## Continue ingress and purge old data

This is the default mode for TSI environments and exhibits the same behavior TSI environments did in public preview.  **Continue ingress** is for users that want to always see their most recent data in their TSI environment and who are comfortable with data being purged once the environment’s limits (size, count or time whichever comes first) are reached.  Retention is set to 30 days by default.

Time Series Insights purges the oldest ingested data first (FIFO approach).

To illustrate **continue ingress** behavior, examine an environment that has provisioned a single unit of S1 and pushs 500MB each day.  If retention is set to 400 days, this environment will only see 60 days worth of data, as it hits its maximum capacity after 60 days (1 S1 unit contains 30GB of total capacity.  500MB x 60 = 30GB).  One the 61st day, the environment will show fresh data, but will purge data older than 60 days to make room for the new data streaming in.  If the user wishes to retain data longer, they can increase the size of the environment by adding additional units or can push less data.  

As an alternative example, examine an environment that is configured to retain data for 180 days with one S1 unit.  To store data for 180 days, that environment cannot exceed daily ingress of .166 GB (166 MB) per day.  If the environment’s daily ingress rate exceeds .166GB per day, data will not be stored for 180 days.  If for example, the environment’s ingress rate averaged.189 GB per day, it would realize just over 158 days of retention (30GB/.189 = 158.73 days of retention).  

## Pause ingress

This mode is for users who need to ensure their data is not purged if the size and count limits are reached prior to their retention period.  It provides additional time for the users to increase the capacity of their environment before data is purged due to breaching of retention period.  Enabling this mode will help protect from data loss. Once an environment’s maximum capacity is reached, the environment will pause data ingress until either:
- The environment’s maximum capacity is increased (by adding more units.  More on that here).
- The retention period is reached and data is purged, thus bringing the environment below its maximum capacity.
 
 To illustrate **pause ingress** behavior, examine an environment which has provisioned as 3 units of S1, pushes 2GB each day, and where the retention period is configured to 60 days.  This environment  pauses ingress when the maximum capacity is reached,  and will only show the same data set until ingress resumes or **continue ingress** is enabled (which purges older data to make room for new data).  
When ingress resumes:
- Data flows in the order it was received by event source
- The events will index based on their timestamp, unless you have exceeded retention policies on your event source.  For more information on event source retention configuration, see [Event Hubs frequently asked questions](https://docs.microsoft.com/rest/api/time-series-insights/time-series-insights-reference-query-syntax).

> [!IMPORTANT]
> It is very important to set alerts to avoid ingress being paused. Because the default retention is 24 hours for Azure event sources, you can and likely will lose fresher data if you do not increase capacity or switch to continue ingress and purge mode.  

![Retention](media/configure-retention/retention1.png)

- If you do not configure properties on the event source (timeStampPropertyName), Time Series Insights default to the timestamp of arrival at event hub as the x-axis.  If **timeStampPropertyName** is configured to be something different, the environment will look for the configured **timeStampPropertyName** in the data packet when Time Series Insights parses events.
 
Device-to-cloud messages are durable and retained in an IoT Hub's default messages/events endpoint for up to seven days. For more information, see [Send device-to-cloud messages to IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c).

## Next steps

*  [Diagnose and solve problems in your Time Series Insights environment](time-series-insights-diagnose-and-solve-problems.md)