---
title: Microsoft Power BI Embedded - Connecting to a data source
description: Power BI Embedded, connect to data sources
services: power-bi-embedded
documentationcenter: ''
author: guyinacube
manager: erikre
editor: ''
tags: ''

ms.assetid: 2a4caeb3-255d-4215-9554-0ca8e3568c13
ms.service: power-bi-embedded
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: powerbi
ms.date: 01/06/2017
ms.author: asaxton

---
# Connect to a data source
With **Power BI Embedded**, you can embed reports into your own app. When you embed a Power BI report into your app, the report connects to the underlying data by **importing** a copy of the data or by **connecting directly** to the data source using **DirectQuery**.

Here are the differences between using **Import** and **DirectQuery**.

| Import | DirectQuery |
| --- | --- |
| Tables, columns, *and data* are imported or copied into the report's dataset. To see changes that occurred to the underlying data, you must refresh, or import, a complete, current dataset again. |Only *tables and columns* are imported or copied into the report's dataset. You always view the most current data. |

With Power BI Embedded, you can use DirectQuery with cloud data sources but not on-premises data sources at this time.

> [!NOTE]
> The On-Premises Data Gateway is not supported with Power BI Embedded at this time. This means you cannot use DirectQuery with on-premises data sources.

## Supported data sources

**DirectQuery**
* Azure SQL database
* Azure SQL Data Warehouse

**Import**

You can import using all of the available data sources within Power BI Desktop. You will **not** be able to refresh that data within Power BI Embedded. You will have to upload changes to your PBIX file to Power BI Embedded. This is due to no available gateway. 

## Benefits of using DirectQuery
There are two primary benefits when using **DirectQuery**:

* **DirectQuery** lets you build visualizations over very large datasets, where it otherwise would be unfeasible to first import all of the data.
* Underlying data changes can require a refresh of data, and for some reports, the need to display current data can require large data transfers, making re-importing data unfeasible. By contrast, **DirectQuery** reports always use current data.

## Limitations of DirectQuery
   There are a few limitations to using **DirectQuery**:

* All tables must come from a single database.
* If the query is overly complex, an error will occur. To remedy the error you must refactor the query so it is less complex. If the query must be complex, you will need to import the data instead of using **DirectQuery**.
* Relationship filtering is limited to a single direction, rather than both directions.
* You cannot change the data type of a column.
* By default, limitations are placed on DAX expressions allowed in measures. See [DirectQuery and measures](#measures).

<a name="measures"/>

## DirectQuery and measures
To ensure queries sent to the underlying data source have acceptable performance, limitations are imposed on measures. When using **Power BI Desktop**, advanced users can choose to bypass this limitation by choosing **File > Options and settings > Options**. In the **Options** dialog, choose **DirectQuery**, and select the option **Allow unrestricted measures in DirectQuery mode**. When that option is selected, any DAX expression that is valid for a measure can be used. Users must be aware; however, that some expressions that perform very well when the data is imported may result in very slow queries to the backend source when in **DirectQuery** mode. 

## See Also
* [Get started with Microsoft Power BI Embedded](power-bi-embedded-get-started.md)
* [Power BI Desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-get-the-desktop/)

More questions? [Try the Power BI Community](http://community.powerbi.com/)

