---
title: JavaScript tutorial deploy search-enabled website
titleSuffix: Azure Cognitive Search
description: Deploy search-enabled website to Azure Static web app.
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
1. Right-click on the subscription name then select **Create Static Web App (Advanced)**.    

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-create-static-web-app-resource-advanced.png" alt-text="Right-click on the subscription name then select **Create Static Web App (Advanced)**.":::

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |How do you want to create a static web app?|Use existing GitHub repository|
    |Choose organization|Select your _own_ GitHub alias as the organization.|
    |Choose repository|Select **azure-search-javascript-samples** from the list. |
    |Choose branch of repository|Select **master** from the list. |
    |Enter the name for the new static web app.|Create a unique name for your resource. For example, you can prepend your name to the repository name such as, `joansmith-azure-search-javascript-samples`. |
    |Select a resource group for new resources.|Select the same resource group where you created your Search resource.|
    |Choose build preset to configure default project structure.|Select **Custom**|
    |Select the location of your application code|`search-website`|
    |Select the location of your Azure Function code|`search-website/api`|
    |Enter the path of your build output...|build|
    |Select a location for new resources.|Select a region close to you.|

1. The resource is created, select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo. 

    The list of actions indicates your web app, both client and functions, were successfully pushed to your Azure static web app. 

    Wait until the build and deployment complete before continuing. This may take a minute or two to finish.

## Get Cognitive Search query key in Visual Studio Code

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**. 

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-copy-query-key.png" alt-text="In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**.":::

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

## Test Search in your Static web app


## Clean up resources

To clean up the resources created in this tutorial, delete the resource group.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Delete**. 


## Next steps

* [Understand Search integration for the search-enabled website](tutorial-javascript-search-query-integration.md)
