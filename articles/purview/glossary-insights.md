---
title: Glossary report on your data using Purview Insights
description: This how-to guide describes how to view and use Purview Insights glossary reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/20/2020

---

# Glossary insights on your data in Azure Purview

This how-to guide describes how to access, view, and filter Purview Glossary insight reports for your data.

In this how-to guide, you'll learn how to:

> - Go to Insights from your Purview account
> - Get a bird's eye view of your data

## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populate the account with data

- Set up and complete a scan on the source type

- Set up a glossary and attach assets to glossary terms

For more information, see [Manage data sources in Azure Purview (Preview)](manage-data-sources.md).

## Use Purview Glossary Insights

In Azure Purview, you can create glossary terms and attach them to assets. Later, you can view the glossary distribution in Glossary Insights. This tells you the state of your glossary by terms attached to assets. It also tells you terms by status and distribution of roles by number of users.

**To view Glossary Insights:**

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/purviewportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Purview** account tile.

   :::image type="content" source="./media/glossary-insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/glossary-insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/glossary-insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** :::image type="icon" source="media/glossary-insights/ico-insights.png" border="false"::: area, select **Glossary** to display the Purview **Glossary insights** report.

The **Glossary Insights** page displays the following areas:
1. **High level KPIs** to show glossary terms and catalog users

2. **Top glossary terms and count of assets** shows the tops 5 glossary terms with assets attached to them. All other assets are accounted in "Other" category in the graph.

3. **Glossary terms by term status** shows distribution of glossary terms by status such as "Draft", "Approved", "Alert" and "Expired". 

1. Hover or click on the slice of the graph with a status and note the count of terms with that status.

1. **Distribution of roles by number of users** shows distribution of roles by number of users per role in Purview.

   :::image type="content" source="./media/glossary-insights/glossary-insights1.png" alt-text="View glossary insights":::

## Next steps

Learn more about Azure Purview insight reports through [Asset Insights](./asset-insights.md)