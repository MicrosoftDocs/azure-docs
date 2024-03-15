---
title: Search for assets 
titleSuffix: Azure Machine Learning
description: Find your Azure Machine Learning assets with search
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: sgilley
author: sdgilley
ms.reviewer: sgilley
ms.date: 1/12/2023
ms.topic: how-to
---

# Search for Azure Machine Learning assets

Use the search bar to find machine learning assets across all workspaces, resource groups, and subscriptions in your organization. Your search text will be used to find assets such as:

* Jobs
* Models
* Components
* Environments
* Data

## Free text search

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).  
1. In the top studio titlebar, if a workspace is open, select **This workspace** or **All workspaces** to set the search context.

    :::image type="content" source="media/how-to-search-assets/search-bar.png" alt-text="Screenshot: Shows search in titlebar.":::

1. Type your text and hit enter to trigger a 'contains' search.
A contains search scans across all metadata fields for the given asset and sorts results by relevancy score which is determined by weightings for different column properties.


## Structured search

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).  
1. In the top studio titlebar, select **All workspaces**.
1. Click inside the search field to display filters to create more specific search queries.

:::image type="content" source="media/how-to-search-assets/search-filters.gif" alt-text="Screenshot: Display search filters.":::

The following filters are supported:

* Job
* Model
* Component
* Tags
* SubmittedBy
* Environment
* Data

If an asset filter (job, model, component, environment, data) is present, results are scoped to those tabs. Other filters apply to all assets unless an asset filter is also present in the query. Similarly, free text search can be provided alongside filters, but are scoped to the tabs chosen by asset filters, if present.

> [!TIP]
> * Filters search for exact matches of text. Use free text queries for a contains search.
> * Quotations are required around values that include spaces or other special characters.  
> * If duplicate filters are provided, only the first will be recognized in search results.
> * Input text of any language is supported but filter strings must match the provided options (ex. submittedBy:).
> * The tags filter can accept multiple key:value pairs separated by a comma (ex. tags:"key1:value1, key2:value2").

## View search results

You can view your search results in the individual **Jobs**, **Models**, **Components**, **Environments**, and **Data** tabs. Select an asset to open its **Details** page in the context of the relevant workspace. Results from workspaces you don't have permissions to view aren't displayed.

:::image type="content" source="./media/how-to-search-assets/results.png" alt-text="Results displayed after search":::

If you've used this feature in a previous update, a search result error may occur. Reselect your preferred workspaces in the Directory + Subscription + Workspace tab.

> [!IMPORTANT]	
> Search results may be unexpected for multiword terms in other languages (ex. Chinese characters).

## Customize search results

You can create, save and share different views for your search results.  

1.  On the search results page, select **Edit view**.

    :::image type="content" source="media/how-to-search-assets/edit-view.png" alt-text="Screenshot: Edit view for search results.":::

Use the menu to customize and create new views:

|Item  |Description  |
|---------|---------|
|Edit columns     |   Add, delete, and re-order columns in the current view's search results table      |
|Reset     |   Add all hidden columns back into the view |
|Share     |  Displays a URL you can copy to share this view     |
|New...     |  Create a new view       |
|Clone     |   Clone the current view as a new view      |

Since each tab displays different columns, you customize views separately for each tab.

## Next steps

* [What is an Azure Machine Learning workspace?](concept-workspace.md)
* [Data in Azure Machine Learning](concept-data.md)
