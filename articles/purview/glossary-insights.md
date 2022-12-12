---
title: Glossary report on your data using Microsoft Purview Data Estate Insights
description: This guide describes how to view and use Microsoft Purview Data Estate Insights glossary reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/16/2022
---

# Insights for your business glossary in Microsoft Purview

This guide describes how to access, view, and filter Microsoft Purview glossary insight reports for your data.

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Find Data Estate Insights from your Microsoft Purview account
> - Get a bird's eye view of your data.

## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights glossary insights, make sure that you've completed the following steps:

* Set up a storage resource and populated the account with data.

* [Set up and complete a scan your storage source](manage-data-sources.md).

* Set up at least one [business glossary term](how-to-create-manage-glossary-term.md) and attach it to an asset.

## Use Microsoft Purview glossary insights

In Microsoft Purview, you can [create glossary terms and attach them to assets](how-to-create-manage-glossary-term.md). As you make use of these terms in your data map, you can view the glossary distribution in glossary insights. These insights will give you the state of your glossary based on:
* Number of terms attached to assets
* Status of terms
* Distribution of roles by users

**To view Glossary Insights:**

1. Go to the **Microsoft Purview** [account screen in the Azure portal](https://aka.ms/purviewportal) and select your Microsoft Purview account.

1. On the **Overview** page, in the **Get Started** section, select **Open Microsoft Purview governance portal** account tile.

   :::image type="content" source="./media/glossary-insights/portal-access.png" alt-text="Screenshot showing the Open Microsoft Purview governance portal button on the account page.":::

1. On the Microsoft Purview **Home** page, select **Data Estate Insights** on the left menu.

   :::image type="content" source="./media/glossary-insights/view-insights.png" alt-text="Screenshot showing Data Estate Insights in left menu of the Microsoft Purview governance portal.":::

1. In the **Data Estate Insights** area, select **Glossary** to display the Microsoft Purview **glossary insights** report.

1. The report starts with **High-level KPIs** that shows ***Total terms*** in your Microsoft Purview account, ***Approved terms without assets*** and ***Expired terms with assets***. Each of these values will help you understand the current health of your Glossary.

   :::image type="content" source="./media/glossary-insights/glossary-kpi.png" alt-text="Screenshot showing glossary KPI charts."::: 


1. The **Snapshot of terms** section (displayed above) shows the term status as ***Draft***, ***Approved***, ***Alert***, and ***Expired*** for terms with assets and terms without assets.

1. Select **View details** to see the term names with various status and more details about ***Stewards*** and ***Experts***. 

   :::image type="content" source="./media/glossary-insights/glossary-view-more.png" alt-text="Screenshot of terms with and without assets.":::  

1. When you select "View more" for ***Approved terms with assets***, Data Estate Insights allow you to navigate to the **Glossary** term detail page, from where you can further navigate to the list of assets with the attached terms. 

   :::image type="content" source="./media/glossary-insights/navigate-to-glossary-detail.png" alt-text="Screenshot of Data Estate Insights to glossary."::: 

1. In Glossary insights page, view a distribution of **Incomplete terms** by type of information missing. The graph shows count of terms with ***Missing definition***, ***Missing expert***, ***Missing steward*** and ***Missing multiple*** fields.

1. Select ***View more*** from **Incomplete terms**, to view the terms that have missing information. You can navigate to Glossary term detail page to input the missing information and ensure the glossary term is complete.

## Next steps

Learn more about how to create a glossary term through the [glossary documentation.](./how-to-create-manage-glossary-term.md)
