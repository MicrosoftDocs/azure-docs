---
title: How to configure retention in your Azure Time Series Insights environment | Microsoft Docs
description: This article describes how to configure retention in your Azure Time Series Insights environment. 
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: jasonh, kfile, anshan
ms.workload: big-data
ms.topic: conceptual
ms.date: 02/09/2018
---

# Configuring retention in Time Series Insights
This article describes how to configure **Data retention time** and **Storage limit exceeded behavior** in Azure Time Series Insights.

Each Time Series Insights (TSI) environment has a setting to configure **Data retention time**. The value spans from 1 to 400 days. The data is deleted based on the environment storage capacity or retention duration (1-400), whichever comes first.

Each TSI environment has an additional setting **Storage limit exceeded behavior**. This setting controls ingress and purge behavior when the max capacity of an environment is reached. There are two behaviors to choose from:
- **Purge old data** (default)  
- **Pause ingress**

For detailed information to better understand these settings, review [Understanding retention in Time Series Insights](time-series-insights-concepts-retention.md).  

## Configure data retention

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Locate your existing Time Series Insights environment. Select **All resources** in the menu on the left side of the Azure portal. Select your Time Series Insights environment.

3. Under the **SETTINGS** heading, select **Configure**.

4. Select the **Data retention time** to configure the retention using the slider bar or type a number in text box.

5. Note the **Capacity** setting, since this configuration impacts the maximum amount of data events and total storage capacity for storing data. 

6. Toggle the **Storage limit exceeded behavior** setting. Select **Purge old data** or **Pause ingress** behavior.

7. Select **Save** to configure the changes.

## Next steps
For more information, review [Understanding retention in Time Series Insights](time-series-insights-concepts-retention.md).
