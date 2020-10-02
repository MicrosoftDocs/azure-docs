---
title: 'Map and Discover Insights'
titleSuffix: Babylon
description: This how to guide describes details of the Map and Discover insights report. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: How to guide
ms.date: 04/27/2020
---
# Map and discover insights for your assets, scans, and glossary terms in Babylon
**Map and Discover** Insights lets you know the data sources being managed
by Babylon, your various scan status over time and catalog information
that includes Babylon usage and Glossary summary.

Babylon is Azure's data governance product, that
helps you know what you have in your data map and manage the data
map using policies. To accomplish these goals, Babylon starts with
scanning your data estate to learn about its metadata structure. It uses
classification technique to identify what find of data exists in these
data sources. You can also set your own glossary and assign assets to
glossary terms to know more about the business use of the data.

Once you have scanned your data source(s) and classified the assets Map
and Discover insights provides a consolidated view and relevant insights
into your assets, scans, and glossary terms in Babylon.

## Lets get started

Here we take you through the step by step process of using **Map and
Discover** Insights, including, deep dive of some graphs.

### Step 1 - Getting to Insights page

From the Babylon site, you can see the **Insights** icon on the left
navigation window, that will take you to all the
reports you have access to.

![Navigating to Insights](../docs/media/map-discover/media/image1.png)

### Step 2 - Looking at Map and Discover Insights page

Once you click on the Insights icon, you will land on **Map and Discover**
Insights page. The report starts with a time filter, that is defaulted
at **1 month**, indicating insights from last 30 days of activity in
Babylon environment. You can also filter to **1 week**, indicating insights from last 7 days of activity.

The first section is called Asset information. That starts with two KPIs
 called **Registered assets in catalog** and **scanned assets in catalog**.

> **Registered assets in catalog** are assets that belong to data
> sources which are mapped to Babylon, either through
> Babylon site or through Atlas API integration of a data source, such
> as Hadoop on prem data store.
>
> **Scanned assets in catalog** are assets that were scanned by the
> Babylon scanner. 
[!Note] Scanning is limited to assets that were
> registered through Babylon site, as scan activity does not take place
> when customers ingest a data source through Atlas API.
>
> ![Navigating to Insights](../docs/media/map-discover/media/image2.png)

### Step 3 - Understanding your data estate

**Managed data sources by asset count** shows count of assets across your data sources, that have been
mapped to Babylon. The tree map includes data sources that were mapped
through Atlas API.

![Navigating to Insights](../docs/media/map-discover/media/image1.1.png)

The graph has a drill down experience that allows you to drill down into the asset hierarchical structure for that data source. Once you are in the drilldown view of the asset hierarchy, you click on the *back* button on the top right corner of the
graph, to go back to the original view of the graph.

![Navigating to Insights](../docs/media/map-discover/media/image1.2.png)

### Step 4 -- Identifying trends and behaviors of your data sources and files extensions

**Asset type count over time** and **File extension types over time**,
help you recognize patterns in your data sources so you can manage
them better through policies. 
[!Note] 
Asset count of a data source or file extension is dependent on scan frequency.

![Trend chart of asset count across data sources](../docs/media/map-discover/media/image5.1.PNG)


![Deselect data sources you dont want to see](../docs/media/map-discover/media/image5.2.PNG)

### Step 5 -- Learning about your scan status 

This section of the report shows high level KPIs showing indicating scan counts by status. **Scan
distribution by status** graph helps you see by week or by day, how many scans were
successful, versus cancelled or failed.

![Navigating to Insights](../docs/media/map-discover/media/image6.png)

### Step 6 -- Learning about your catalog

This section helps you understand your organization's glossary usage
summary and Babylon usage summary.

The **Top glossary terms and count of assets** graph shows you the top terms that
are used across your organization. 

![Navigating to Insights](../docs/media/map-discover/media/image7.1.png)

You can view breakdown of **Glossary terms by status**, helping data stewards to manage glossary term life
cycle efficiently.

![Navigating to Insights](../docs/media/map-discover/media/image7.2.png)

Finally for administration purposes, the report shows **Top roles and count of users**.

![Navigating to Insights](../docs/media/map-discover/media/image7.3.png)

## Next steps

To get started with Data Catalog, see [Quickstart: Create an Azure Data Catalog](create-catalog-portal.md).
