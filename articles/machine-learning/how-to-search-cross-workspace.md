---
title: Search for machine learning assets across workspaces
titleSuffix: Azure Machine Learning
description: Learn about global search in Azure Machine Learning.
services: machine-learning
author: saachigopal
ms.author: sagopal
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 1/19/2022
---

# Search for Azure Machine Learning assets across multiple workspaces (Public Preview)

## Overview 

Azure ML users can now search for machine learning assets such as jobs, models, and components across all workspaces, resource groups, and subscriptions in their organization through a unified global view. 

## Get started 

### Global homepage 

From this centralized global view, select from recently visited workspaces or browse documentation and tutorial resources.

![global view](./media/how-to-search-cross-workspace/global_home.png)

### Search

Type search text into the global search bar and hit enter to trigger a 'contains' search.
The search will scan across all metadata fields for the given asset. Results are sorted by relevance as determined by the index service relevancy weightings for the asset columns. 

![search bar](./media/how-to-search-cross-workspace/search_bar.png)

Use the asset quick links to navigate to search results for jobs, models, and components created by you. 

Change the scope of applicable subscriptions and workspaces by clicking the 'Change' link. 

![scope change](./media/settings.jpg)

## Structured search 

Click on any number of filters to create more specific search queries.  The following filters are supported:
* Job: 
* Model:
* Component:
* Tags:
* SubmittedBy: 

If an asset filter (job, model, component) is present, results will be scoped to those tabs. Other filters will apply to all assets unless an asset filter is also present in the query. Similarly, free text search can be provided alongside filters but will be scoped to the tabs chosen by asset filters if present. 

Note: 
* Filters search for exact matches of text. Use free text queries for 'contains' search.
* Quotations are required around values that include spaces or other special characters.  
* If duplicate filters are provided, only the first will be recognized in search results. 
* While filter strings must match the provided options (ex. job:), input text of any language is supported. 
* The tags filter can accept multiple key:value pairs separated by a comma (ex. tags:"key1:value1, key2:value2")


### Results

Explore the Jobs, Models, and Components tabs to see all search matches. Click on an asset to be directed to the details page in the context of the relevant workspace. Results from workspaces a user does not have access to will not be displayed, click on the 'details' button to view a list of workspaces.

![search results](./media/results.jpg)

## Filters

To add more specificity to the search results, use the column filters sidebar. 


### Custom views

Customize the display of columns in the search results table. These views can be saved and shared as well. 

![custom column views](./media/how-to-search-cross-workspace/custom_views.jpg)

## Known Issues

If you have previously used this feature, a search result error may occur. Reselect your preferred workspaces in the Directory + Subscription + Workspace tab.
