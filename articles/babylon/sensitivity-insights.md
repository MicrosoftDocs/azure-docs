---
title: Sensitivity label reporting on your data in Azure Blob Storage 
description: This how-to guide describes how to view and use Babylon sensitivity label reporting on your data in Azure Blob Storage. 
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/02/2020
# Customer intent: As a security officer, I need to understand how to use Babylon Insights to learn about sensitive data identified and classified and labeled during scanning.
---

# Sensitivity label insights about your data in Azure Babylon

This how-to guide describes how to access, view, and filter security insights provided by sensitivity labels applied to your data, in Azure Blob Storage, Azure files, ADLS GEN1, and ADLS GEN 2.

In this how-to guide, you'll learn how to:

> [!div class="checklist"]
> - Launch your Babylon account from Azure.
> - View insights on your data.
> - View and filter sensitivity labels.
> - Learn how to review and search sensitivity labeling of your data estate.

> [!NOTE]
> If you're blocked at any point in this process, send an email to BabylonDiscussion@microsoft.com for support.

## Prerequisites

Before getting started with Babylon insights, make sure that you've completed the following steps:

- Followed explanations about setting up Azure resources and populating the relevant accounts with your test data

- Set up and completed a scan on the test data in each data source.
 
For more information, see [Use the portal to scan Azure data sources (preview)](portal-scan-azure-data-sources.md).

After making sure your Azure Blob Storage is created, contains test data, and scanning test data succeeded, let's get started.  

## Babylon insights

### Use Babylon insights

In Babylon, classifications are similar to subject tags, and are used to mark and identify content of a specific type that's found within your data estate during scanning.

Sensitivity labels are used to identify classification type categories within your organizational data, as well as the group the policies you want to apply to each category.

Babylon uses the same sensitive information types as Microsoft 365, allowing you to stretch your existing security policies and protection across your entire content and data estate.

**To view classification insights:**

1. Go to the **Babylon** [instance screen in the Azure portal](https://aka.ms/babylonportal). Select your Babylon account.

1. On the **Overview** page, in the **Get Started** section, select the **Launch Babylon** account tile.

   :::image type="content" source="./media/insights/portal-access.png" alt-text="Launch Babylon from the Azure portal":::

1. With Babylon open, select the **View insights** tile to access your insights area.

   :::image type="content" source="./media/insights/view-insights.png" alt-text="View sensitivity labeling insights":::

1. Within insights, select the **Classification and labeling** tab.

   :::image type="content" source="./media/insights/select-classification-labeling.png" alt-text="Classification and labeling blade":::

### Sensitivity labels

Once you've learned about the classifications that Babylon has identified in your scanned data, review the sensitivity labels applied to your data estate.

**To view sensitivity labels**:

1. From the main classification and labeling menu, select the **View all labels** link at the bottom of the **Top labels** tile.

   :::image type="content" source="./media/insights/view-labels.png" alt-text="View all discovered labels":::

1. The visual sensitivity label report tiles show **top labels** found during the chosen time span, **labels found over time**, and **labels detected by file type**.

   :::image type="content" source="./media/insights/label-report.png" alt-text="Sensitivity label report":::

1. From the label list at the bottom of the report, select a label type, such a **Secret**, to review all data scanned with that label in the time period selected.

1. In the data source drilldown page, select to filter a label or multiple labels to change your results.

   :::image type="content" source="./media/insights/label-results-filtering.png" alt-text="Sensitivity label results filtering":::

**To view source data file from a label search:**

After filtering labels to find the data of interest, you can filter the data further by using the **Quick filter** option to get to the source data file.

1. In the search menu of the data source drilldown page,  enter the name of a data source to perform a **Quick filter** for relevant labels. In the following example, we used the quick filter to look at a data source with the **Secret** label.

   :::image type="content" source="./media/insights/use-quick-filter.png" alt-text="Use a Quick filter":::

1. In the search results page, you see the filters you chose applied in the **Quick filter** option, and the data file results of your search in the main window.

   :::image type="content" source="./media/insights/quick-filter-results.png" alt-text="Search results":::

1. Selecting one of the search results shows the labels and all classifications related to that data source. A hierarchy of the file in your data storage structure is also provided to assist with data estate management and ownership determination.

   :::image type="content" source="./media/insights/quick-filter-search-results-details.png" alt-text="Search result details":::

## Sensitivity label integration with Microsoft 365 compliance

Close integration with information protection offered in Microsoft 365 means Babylon offers easy and direct ways to scan your entire data estate, receive classification and labeling of your content as well as integrated content protection based on those labels and classifications.

> [!NOTE]
> For sensitivity labels to be active in Babylon, you'll need published global labels, and **auto-classification** in Microsoft 365 must be enabled.

**Review sensitivity labels**:

Sensitivity labels are used to classify emails, documents, site and more. When sensitivity labels are applied to content (whether manually or automatically, such as the labels applied with Babylon scanning) the content is then protected based on the settings you have chosen for each sensitivity label.

Sensitivity labels can be used to encrypt files, add content marking, control, and prevent user access and much more.

To review your sensitivity labels and their policies:

1. Open the [Microsoft 365 compliance site](https://compliance.microsoft.com) and select the **Information protection** tab.

1. In the list of labels, select the label to review. For the purpose of this how-to article, select the **Secret** label.

   :::image type="content" source="./media/insights/review-specific-label.png" alt-text="Review a specific label":::

1. The sensitivity label editing wizard takes you through the label basics of label **Name**, **description**, **Encryption level**, and **Content marking** you wish to apply, as well as the option to **Auto-label for Office apps**.

   In the example shown, **auto-labeling** is enabled as required, and content that matches the credit card information description selected will be automatically labeled as specified.

   :::image type="content" source="./media/insights/enable-auto-labeling.png" alt-text="Enable auto-labeling":::

## Next steps

Learn more from Babylon reports
> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [File extension insights](file-extension-insights.md)
