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

> [!div class="checklist"]
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

**Glossary Insights** provides you as a business user, valuable information to maintain a well-defined glossary for your organization.

1. The report starts with **High-level KPIs** that shows ***Total terms*** in your Purview account, ***Approved terms without assets*** and ***Expired terms with assets***. Each of these values will help you identify the health of your Glossary.

   :::image type="content" source="./media/glossary-insights/glossary-kpi.png" alt-text="View glossary insights KPI"::: 


2. **Snapshot of terms** section (displayed above) shows you term status as ***Draft***, ***Approved***, ***Alert***, and ***Expired*** for terms with assets and terms without assets.

3. Click on **View more** to see the term names with various status and more details about ***Stewards*** and ***Experts***. 

   :::image type="content" source="./media/glossary-insights/glossary-view-more.png" alt-text="Snapshot of terms with and without assets":::  

4. When you click "View more" for ***Approved terms with assets***, Insights allow you to navigate to the **Glossary** term detail page, from where you can further navigate to the list of assets with the attached terms. 

   :::image type="content" source="./media/glossary-insights/navigate-to-glossary-detail.png" alt-text="Insights to glossary"::: 

4. In Glossary insights page, view a distribution of **Incomplete terms** by type of information missing. The graph shows count of terms with ***Missing definition***, ***Missing expert***, ***Missing steward*** and ***Missing multiple*** fields.

1. Click on ***View more*** from **Incomplete terms**, to view the terms that have missing information. You can navigate to Glossary term detail page to input the missing information and ensure the glossary term is complete.

## Next steps

Learn more about how to create a glossary term through [Glossary](./how-to-create-import-export-glossary.md)