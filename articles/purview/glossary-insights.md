---
title: Glossary report on your data using Purview Insights
description: This how-to guide describes how to view and use Purview Insights glossary reporting on your data. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/20/2020

---

# Glossary insights on your data in Azure Purview

This how-to guide describes how to access, view, and filter Purview Glossary insight reports for your data.

In this how-to guide, you'll learn how to:

> - Go to Insights from your Purview account
> - Get a bird's eye view of your data

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites

Before getting started with Purview insights, make sure that you've completed the following steps:

- Set up your Azure resources and populate the account with data

- Set up and complete a scan on the source type

- Set up a glossary and attach assets to glossary terms

For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md) 

## Use Purview Asset Insights

In Azure Purview, you can create glossary terms and attach them to assets. Later, you can view the glossary distribution in Glossary Insights. This tells you the state of your glossary by terms attached to assets. It also tells you terms by status and distribution of roles by number of users.

**To view Glossary Insights:**

1. Go to the **Azure Purview** [instance screen in the Azure portal](https://aka.ms/babylonportal) and select your Purview account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

   :::image type="content" source="./media/insights/portal-access.png" alt-text="Launch Purview from the Azure portal":::

1. On the Purview **Home** page, select the **View insights** tile to access your **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area.

   :::image type="content" source="./media/insights/view-insights.png" alt-text="View your insights in the Azure portal":::

1. In the **Insights** :::image type="icon" source="media/insights/ico-insights.png" border="false"::: area, select **Glossary** to display the Purview **Glossary insights** report.

   :::image type="content" source="./media/insights/select-classification-labeling.png" alt-text="Classification insights report":::

   The **Glossary Insights** page displays the following areas:
- **High level KPI's to show glossary terms and catalog users**

- **Top glossary terms and count of assets** 

- View the tops 5 glossary terms with assets attached to them. All other assets are accounted in "Other" category in the graph.
 
- **Glossary terms by term status**

- View distribution of glossary terms by status such as "Draft", "Approved", "Alert" and "Expired". Hover or click on the slice of the graph with a status and note the count of terms with that status.

- **Distribution of roles by number of users**

- View distribution of roles by number of users per role in Purview.

## Next steps

Learn more about Azure Purview insight reports
> [!div class="nextstepaction"]
> [Asset Insights](./asset-insights.md)

> [!div class="nextstepaction"]
> [Scan Insights](scan-insights.md)