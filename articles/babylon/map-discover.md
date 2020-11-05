---
title: Use map and discover insights for your data
titleSuffix: Azure Purview
description: Describes map and discover insights reports for scan status, asset distribution, and catalog usage. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/12/2020
---

# Use map and discover insights for your data

Map and discover insights lets you know the data sources that Azure Purview manages, your scan status over time, and catalog usage. The catalog usage information includes such information as usage count and roles, and glossary access.

Azure Purview is Azure's data governance product, which helps you know what you have in your data map and manage the data map using policies. To accomplish these goals, Azure Purview starts by scanning your data estate to learn about its metadata structure. It uses classification techniques to identify what find of data exists in these data sources. You can also set your own glossary and assign assets to glossary terms to know more about the business use of the data.

After you've scanned your data sources and classified the assets, map and discover insights provides a consolidated view and relevant insights into your assets, scans, and glossary terms in Azure Purview.

## Get started

To access the map and discover insights report, follow these steps:

1. Select **Launch Babylon account** from your Azure Bablyon account page to access your catalog from the Azure Purview portal.

1. From the **Home** page of your Azure Purview catalog, select **View insights**.

   :::image type="content" source="./media/map-discover/select-view-insights.png" alt-text="Screenshot showing how to select View insights from the Home page." lightbox="./media/map-discover/select-view-insights.png":::

## The Map and discover report

After you select **View insights**, you land on the **Map and discover** report page. The report starts with a time filter, which has a default of **1 month**, indicating insights from last 30 days of activity in
the Azure Purview environment. You can change the filter to **1 week**, indicating insights from the last seven days of activity.

The map and discover report has the following sections:

- [Asset information](#asset-information)
- [Scan information](#scan-information)
- [Catalog information](#catalog-information)

### Asset information

The first section is called **Asset information** and its first item is a key performance indicator (KPI) called **Discovered assets in catalog**. These discovered assets are assets that belong to data sources that are mapped to Azure Purview, either through the Azure Purview site or through Atlas API integration of a data source, such as a Hadoop on-premises data store.

#### Understand your data estate

The **Managed data sources by asset count** graph shows the count of assets across your data sources that have been mapped to Azure Purview. The tree map includes data sources that were mapped through Atlas API.

:::image type="content" source="./media/map-discover/data-by-asset-count.png" alt-text="Screenshot showing the Managed data sources by asset count graph.":::

The graph has a drill-down experience that allows you to look into the asset hierarchical structure for that data source. After you're in the expanded view of the asset hierarchy, select **Back** on the top-right corner of the graph to return to the original view

:::image type="content" source="./media/map-discover/data-by-asset-count-drill-down.png" alt-text="Screenshot showing an expanded section of the Managed data sources by asset count graph.":::

### Identify trends and behaviors of your data sources and file extensions

The **Asset type count over time** and **File extension types over time** graphs help you recognize patterns in your data sources so you can manage them better through policies.

> [!NOTE]
> The asset count of a data source or file extension is dependent on scan frequency.

The **Asset type count over time** graph shows trends in your asset count.

:::image type="content" source="./media/map-discover/asset-type-count.png" alt-text="Screenshot showing the Asset type count over time graph.":::

In both graphs, all of the data sources or extensions are selected by default. Deselect the data sources or extensions you don't want to see by toggling them in the legend at the bottom. For example:

:::image type="content" source="./media/map-discover/asset-type-count-sources-deselected.png" alt-text="Screenshot showing deselected data sources on the Asset type count over time graph.":::

### Scan information

Learn about your scan status in the **Scan information** section. The top section displays high-level KPIs indicating asset scan counts by status. The **Scan distribution by status** graph lets you view by week or by day, and how many scans succeeded, failed, or were canceled.

Scanning is limited to assets that are registered through the Azure Purview site. Scan activity does not take place when customers ingest a data source through Atlas API.

:::image type="content" source="./media/map-discover/scan-distribution-by-status.png" alt-text="Screenshot showing the Scan distribution by status graph.":::

### Catalog information

The **Catalog information** section enables you to learn about your catalog by understanding your organization's glossary usage and user breakdown.

The **Top glossary terms and count of assets** graph shows you the top glossary terms that your organization uses.

:::image type="content" source="./media/map-discover/glossary-terms-asset-count.png" alt-text="Screenshot showing the Top glossary terms and count of assets graph.":::

The **Glossary terms by term status** graph helps data stewards to manage glossary term lifecycles efficiently.

:::image type="content" source="./media/map-discover/glossary-terms-by-term-status.png" alt-text="Screenshot showing the Glossary terms by term status graph.":::

The final graph, useful for administration purposes, is **Top roles and count of users**.

:::image type="content" source="./media/map-discover/top-roles-user-count.png" alt-text="Screenshot showing the Top roles and count of users graph.":::

## Next steps

To get started with Azure Purview accounts, see [Quickstart: Create an Azure Purview account](create-catalog-portal.md).
