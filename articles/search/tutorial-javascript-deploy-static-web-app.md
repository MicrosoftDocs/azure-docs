---
title: JavaScript tutorial deploys search-enabled website
titleSuffix: Azure Cognitive Search
description: Deploy the search-enabled website as an Azure Static web app.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 03/09/2021
ms.custom: devx-track-js
---

# 2. Deploy the search-enabled website

Deploy the search-enabled website as an Azure Static web app. This means both the React app and the Function app are deployed 

## Create a Static Web App in Visual Studio Code

1. Select **Azure** from the Activity Bar, then select **Static Web Apps** from the Side bar. 
1. Select the **+** to create a new Static Web App.
1. Enter a unique name for your Static Web App such as `azure-search-react` with your email name prepended, such as `joansmith-azure-search-react`. 
1. Select **React** from the list of build presets.

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-create-static-web-app.png" alt-text="Select **React** from the list of build presets.":::

1. Select a location close to you.
1. The resource is created, select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo. 

## Add configuration settings in Visual Studio Code

Set the Search settings for the Static Web App. 

1. Select **Azure** from the Activity Bar, then select **Static Web Apps** from the Side bar. 
1. Expand your new Static Web App until the **Application Settings** display.
1. Right-click on **Application Settings**, then select **Add New Setting**.

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-static-web-app-configure-settings.png" alt-text="Right-click on **Application Settings**, then select **Add New Setting**.":::

1. Add the following settings:

    |Setting|Sample Value|Your own custom Search Index|
    |--|--|--|
    |SearchApiKey|954AF98D40C4DFBD072194F70E949940|Returned from [Azure CLI command]()|
    |SearchServiceName|diberry-cog-search-js|YOUR-RESOURCE-NAME|
    |SearchIndexName|good-books|good-books|
    |SearchFacets|authors*,language_code|

## Next steps

* [Understand Search integration for the search-enabled website](tutorial-javascript-search-query-integration.md)
