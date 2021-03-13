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

    The list of actions indicates your web app, both client and functions, were successfully pushed to your Azure static web app. 

## Get Cognitive Search query key in Visual Studio Code

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**. 

    :::image type="content" source="./media/tutorial-javascript-overview/visual-studio-code-create-resource.png" alt-text="In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**.":::

1. Keep this query key, you will need to use it in the next section. The query key is able to query your Index. 

## Add configuration settings in Visual Studio Code

The Azure Function app won't return Search data until the Search secrets are in settings. 

1. Select **Azure** from the Activity Bar, then select **Static Web Apps** from the Side bar. 
1. Expand your new Static Web App until the **Application Settings** display.
1. Right-click on **Application Settings**, then select **Add New Setting**.

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-static-web-app-configure-settings.png" alt-text="Right-click on **Application Settings**, then select **Add New Setting**.":::

1. Add the following settings:

    |Setting|Your Search resource value|
    |--|--|--|
    |SearchApiKey|Your query key|
    |SearchServiceName|Your resource name|
    |SearchIndexName|`good-books`|
    |SearchFacets|authors*,language_code|authors*,language_code|

## Next steps

* [Understand Search integration for the search-enabled website](tutorial-javascript-search-query-integration.md)
