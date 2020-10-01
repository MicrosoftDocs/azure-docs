---
title: Log Analytics integration with PowerBI and Excel
description: Answers common questions related to log queries and gets you started in using them.
ms.subservice: logs
ms.topic: conceptual
author: rboucher
ms.author: robb
ms.date: 09/29/2020

---
# Log Analytics integration with PowerBI

This article focuses on ways to feed data from Log Analytics into Microsoft Power BI to create more visually appealing reports and dashboards. 

## Background 

Azure Monitor Logs is a platform that provides an end-to-end solution for ingesting logs. [Azure Monitor Log Analytics](../platform/data-platform.md#) is the interface to query these logs. For more information on the entire Azure Monitor data platform including Log Analytics, see [Azure Monitor data platform](../platform/data-platform.md). 

Microsoft Power BI is Microsoft’s data visualization platform. For more information on how to get started, see [Power BI’s homepage](https://powerbi.microsoft.com/). 


In general, you can use free Power BI features to integrate and create visually appealing reports and dashboards.

More advanced features may require purchasing a Power BI Pro or premium account. These features include 
 - sharing your work 
 - scheduled refreshes
 - Power BI apps 
 - dataflows and incremental refresh 

For more information, see [learn more about Power BI pricing and features] 
(https://powerbi.microsoft.com/en-us/pricing/) 

## Integrating queries  

Power BI uses the [M query language](/powerquery-m/power-query-m-language-specification/) as its main querying language. 

Log Analytics queries can be exported to M and used in Power BI directly. After running a successful query, select the **Export to Power BI (M query)** from the **Export** button in Log Analytics UI top action bar.

[!Export in the Log Analytics UI](TODO)

Log Analytics creates a .txt file containing the M code that can be used directly in Power BI.

## Connecting your logs to a dataset 

A Power BI dataset is a source of data ready for reporting and visualization. To connect a Log Analytics query to a dataset, simply copy the M code exported from Log Analytics into a blank query in Power BI. 


For more information, see [Understanding Power BI datasets](/power-bi/service-datasets-understand/). 

## Collect data with PowerBI dataflows 

Power BI dataflows also allow you to collect and store data. For more informaiton, see [PowerBI Dataflows](/power-bi/service-dataflows-overview).

A dataflow is a type of "cloud ETL" designed to help you collect and prep your data. A dataset is the "model" designed to help you connect different entities and model them for your needs.

Incremental refresh 

Both Power BI datasets and Power BI dataflow offer an incremental refresh option. 

Incremental refresh is a great way to run small queries and update smaller amounts of data per run. 

You should use incremental refresh when you want to update a small portion of the data with each run instead of ingesting all of the data again and again for each run. 

Using incremental refresh both Power BI dataflows and Power BI datasets allows an option to save large amounts of data, adding an increment of data every time, making them an ideal solution for longer running reports. 

Power BI incremental refresh relies on the existence of a datatime filed in the result set that Power BI can run increments on. 
Before configuring incremental refresh – make sure your Log Analytics query result set includes at least one datetime filed. 

To learn more about Power BI dataset incremental refresh and how to configure it click here <link: https://docs.microsoft.com/en-us/power-bi/service-premium-incremental-refresh> 

To learn more about Power BI dataflows incremental refresh and how to configure it click here <link: https://docs.microsoft.com/en-us/power-bi/service-dataflows-incremental-refresh> 

Please note that you will need a Power BI premium capacity for using Power BI incremental refresh  

Using Power BI 

After your data is ingested to Power BI you can continue using Power BI to create reports and dashboards. 

For a guide into how to create your first Power BI model and report click here <Link: https://docs.microsoft.com/en-us/learn/modules/build-your-first-power-bi-report/> 

Excel 

It is possible to use the same M integration used in Power BI to integrate with an Excel spreadsheet. 

To integrate with excel simple follow this guide : https://support.office.com/en-us/article/import-data-from-external-data-sources-power-query-be4330b3-5356-486c-a168-b68e9e616f5a and paste the M query exported from Log Analytics. 




## Next steps
