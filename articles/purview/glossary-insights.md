---
title: Glossary report on your data using Microsoft Purview Data Estate Insights
description: This how-to guide describes how to view and use Microsoft Purview Data Estate Insights glossary reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-insights
ms.topic: how-to
ms.date: 09/27/2021

---

# Glossary insights on your data in Microsoft Purview

This how-to guide describes how to access, view, and filter Microsoft Purview Glossary insight reports for your data.

> [!IMPORTANT]
> Microsoft Purview Data Estate Insights are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Go to Data Estate Insights from your Microsoft Purview account
> - Get a bird's eye view of your data

## Prerequisites

Before getting started with Microsoft Purview Data Estate Insights, make sure that you've completed the following steps:

- Set up your Azure resources and populate the account with data

- Set up and complete a scan on the source type

- Set up a glossary and attach assets to glossary terms

For more information, see [Manage data sources in Microsoft Purview](manage-data-sources.md).

## Use Microsoft Purview Glossary Insights

In Microsoft Purview, you can create glossary terms and attach them to assets. Later, you can view the glossary distribution in Glossary Insights. This tells you the state of your glossary by terms attached to assets. It also tells you terms by status and distribution of roles by number of users.

**To view Glossary Insights:**

1. Go to the **Microsoft Purview** [instance screen in the Azure portal](https://aka.ms/purviewportal) and select your Microsoft Purview account.

1. On the **Overview** page, in the **Get Started** section, select **Open Microsoft Purview governance portal** account tile.

   :::image type="content" source="./media/glossary-insights/portal-access.png" alt-text="Launch Microsoft Purview from the Azure portal":::

1. On the Microsoft Purview **Home** page, select **Data Estate Insights** on the left menu.

   :::image type="content" source="./media/glossary-insights/view-insights.png" alt-text="View your data estate insights in the Azure portal":::

1. In the **Data Estate Insights** area, select **Glossary** to display the Microsoft Purview **Glossary insights** report.

**Glossary Insights** provides you as a business user, valuable information to maintain a well-defined glossary for your organization.

1. The report starts with **High-level KPIs** that shows ***Total terms*** in your Microsoft Purview account, ***Approved terms without assets*** and ***Expired terms with assets***. Each of these values will help you identify the health of your Glossary.

   :::image type="content" source="./media/glossary-insights/glossary-kpi.png" alt-text="View glossary insights KPI"::: 


2. **Snapshot of terms** section (displayed above) shows you term status as ***Draft***, ***Approved***, ***Alert***, and ***Expired*** for terms with assets and terms without assets.

3. Select **View more** to see the term names with various status and more details about ***Stewards*** and ***Experts***. 

   :::image type="content" source="./media/glossary-insights/glossary-view-more.png" alt-text="Snapshot of terms with and without assets":::  

4. When you select "View more" for ***Approved terms with assets***, Data Estate Insights allow you to navigate to the **Glossary** term detail page, from where you can further navigate to the list of assets with the attached terms. 

   :::image type="content" source="./media/glossary-insights/navigate-to-glossary-detail.png" alt-text="Data Estate Insights to glossary"::: 

4. In Glossary insights page, view a distribution of **Incomplete terms** by type of information missing. The graph shows count of terms with ***Missing definition***, ***Missing expert***, ***Missing steward*** and ***Missing multiple*** fields.

1. Select ***View more*** from **Incomplete terms**, to view the terms that have missing information. You can navigate to Glossary term detail page to input the missing information and ensure the glossary term is complete.

## Next steps

Learn more about how to create a glossary term through [Glossary](./how-to-create-import-export-glossary.md)
