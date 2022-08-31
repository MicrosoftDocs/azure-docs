---
title:  "Python tutorial: Deploy search-enabled website"
titleSuffix: Azure Cognitive Search
description: Deploy search-enabled Python website to Azure Static web app.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 08/30/2022
ms.custom: devx-track-python
ms.devlang: python
---

# 3 - Deploy the search-enabled Python website

Deploy the search-enabled website as an Azure Static web app. This deployment includes both the React app and the Function app.  

The Static Web app pulls the information and files for deployment from GitHub using your fork of the samples repository.  

## Create a Static Web App in Visual Studio Code

1. Select **Azure** from the Activity Bar, then open **Resources** from the Side bar. 

1. Right-click **Static Web Apps** and then select **Create Static Web App (Advanced)**.

    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-create-static-web-app-resource-advanced.png" alt-text="Right-click **Static Web Apps** and then select **Create Static Web App (Advanced)**":::

1. Follow the 8 prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |Enter the name for the new Static Web App.|Create a unique name for your resource. For example, you can prepend your name to the repository name such as, `joansmith-azure-search-javascript-samples`. |
    |Select a resource group for new resources.|Use the resource group you created for this tutorial.|
    |Select a SKU| Select the free SKU for this tutorial.|
    |Choose build preset to configure default project structure.|Select **Custom**|
    |Select the location of your application code|`search-website`<br><br>This is the path, from the root of the repository, to your Azure Static web app. |
    |Select the location of your Azure Function code|`search-website/api`<br><br>This is the path, from the root of the repository, to your Azure Function app. |
    |Enter the path of your build output...|`build`<br><br>This is the path, from your Azure Static web app, to your generated files.|
    |Select a location for new resources.|Select a region close to you.|

1. The resource is created, select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo. 

    The list of actions indicates your web app, both client and functions, were successfully pushed to your Azure Static Web App. 

    Wait until the build and deployment complete before continuing. This may take a minute or two to finish.

## Get Cognitive Search query key in VS Code

1. In VS Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**. 

    :::image type="content" source="./media/tutorial-javascript-create-load-index/visual-studio-code-copy-query-key.png" alt-text="In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**.":::

1. Keep this query key, you will need to use it in the next section. The query key is able to query your index. 

## Add configuration settings in Azure portal

The Azure Function app won't return search data until the search secrets are in settings. 

1. Select **Azure** from the Activity Bar. 
1. Right-click on your Static web app resource then select **Open in Portal**.

    :::image type="content" source="media/tutorial-javascript-static-web-app/open-static-web-app-in-azure-portal.png" alt-text="Right-click on your Python Static web app resource then select Open in Portal.":::

1. Select **Configuration** then select **+ Add**.

    :::image type="content" source="media/tutorial-javascript-static-web-app/add-new-application-setting-to-static-web-app-in-portal.png" alt-text="Select Configuration then select Add for your Python app.":::

1. Add each of the following settings:

    |Setting|Your Search resource value|
    |--|--|
    |SearchApiKey|Your search query key|
    |SearchServiceName|Your search resource name|
    |SearchIndexName|`good-books`|
    |SearchFacets|`authors*,language_code`|

    Azure Cognitive Search requires different syntax for filtering collections than it does for strings. For the authors* facet, adding a * after a field name denotes that the field is of type Collection(Edm.String). This allows the Azure Function to add filters correctly to queries.

1. Select **Save** to save the settings. 

    :::image type="content" source="media/tutorial-javascript-static-web-app/save-new-application-setting-to-static-web-app-in-portal.png" alt-text="Select Save to save the settings.":::

1. Return to VS Code. 
1. Refresh your static web app to see the static web app's application settings. 

    :::image type="content" source="media/tutorial-javascript-static-web-app/visual-studio-code-extension-fresh-resource.png" alt-text="Refresh your Static web app to see the Static web app's application settings.":::

## Use search in your Static web app

1. In VS Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon.
1. In the Side Bar, **right-click on your Azure subscription** under the `Static web apps` area and find the static web app you created for this tutorial.
1. Right-click your static web app name and select **Browse site**.
    
    :::image type="content" source="media/tutorial-javascript-create-load-index/visual-studio-code-browse-static-web-app.png" alt-text="Right-click the Static Web App name and select **Browse site**.":::    

1. Select **Open** in the pop-up dialog.
1. In the website search bar, enter a search query such as `code`, _slowly_ so the suggest feature suggests book titles. Select a suggestion or continue entering your own query. Press enter when you've completed your search query. 
1. Review the results then select one of the books to see more details. 

## Clean up resources

To clean up the resources created in this tutorial, delete the resource group.

1. In VS Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Resource Groups` area and find the resource group you created for this tutorial.
1. Right-click the resource group name then select **Delete**.
    This deletes both the Search and Static web app resources.
1. If you no longer want the GitHub fork of the sample, remember to delete that on GitHub. Go to your fork's **Settings** then delete the fork. 


## Next steps

* [Understand Search integration for the search-enabled website](tutorial-python-search-query-integration.md)
