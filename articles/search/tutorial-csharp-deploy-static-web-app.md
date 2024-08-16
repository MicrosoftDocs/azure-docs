---
title:  "Deploy search app (.NET tutorial)"
titleSuffix: Azure AI Search
description: Deploy search-enabled website with .NET APIs to Azure Static web app.
manager: nitinme
author: diberry
ms.author: diberry
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 08/16/2024
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - ignite-2023
ms.devlang: csharp
---

# Step 3 - Deploy the search-enabled .NET website

Deploy the search-enabled website as an Azure Static Web Apps site. This deployment includes both the React app for the web pages, and the Function app for search operations.  

The static web app pulls the information and files for deployment from GitHub using your fork of the azure-search-static-web-app repository.  

## Create a Static Web App in Visual Studio Code

1. In Visual Studio Code, make sure you're at the repository root, and not the bulk-insert folder (for example, `azure-search-static-web-app`).

1. Select **Azure** from the Activity Bar, then open **Resources** from the side bar. 

1. Right-click **Static Web Apps** and then select **Create Static Web App (Advanced)**. If you don't see this option, verify that you have the Azure Functions extension for Visual Studio Code.

    :::image type="content" source="media/tutorial-csharp-create-load-index/visual-studio-code-create-static-web-app-resource-advanced.png" alt-text="Screenshot of Visual Studio Code, with the Azure Static Web Apps explorer showing the option to create an advanced static web app.":::

1. If you see a pop-up window asking you to commit your changes, don't do this. The secrets from the bulk import step shouldn't be committed to the repository. 

    To roll back the changes, in Visual Studio Code select the Source Control icon in the Activity bar, then select each changed file in the Changes list and select the **Discard changes** icon.

1. Follow the prompts to create the static web app:

    |Prompt|Enter|
    |--|--|
    |Select a resource group for new resources. | Create a new resource group for the static app.|
    |Enter the name for the new Static Web App. | Give your static app a name, such as `my-demo-static-web-app`. |
    |Select a SKU | Select the free SKU for this tutorial.|
    |Select a location for new resources. | Choose a region near you. |
    |Choose build preset to configure default project structure. |Select **Custom**. |
    |Select the location of your client application code | `client`<br><br>This is the path, from the root of the repository, to your static web app. |
    |Enter the path of your build output... | `build`<br><br>This is the path, from your static web app, to your generated files.|

    If you get an error about an incorrect region, make sure the resource group and static web app resource are in one of the supported regions listed in the error response. 

1. When the static web app is created, a GitHub workflow YML file is also created locally and on GitHub in your fork. This workflow executes in your fork, building and deploying the static web app and functions.

   Check the status of static web app deployment using any of these approaches:

   * Select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo.
   * Select the **Actions** tab in your forked repository. You should see a list of all workflows on your fork.
   * Select the **Azure: Activity Log** in Visual Code. You should see a message similar to the following screenshot.

     :::image type="content" source="media/tutorial-csharp-static-web-app/visual-studio-code-azure-activity-log.png" alt-text="Screenshot of the Activity Log in Visual Studio Code." border="true":::

## Get the Azure AI Search query key in Visual Studio Code

While you might be tempted to reuse your search admin key for query purposes that isn't following the principle of least privilege. The Azure Function should use the query key to conform to least privilege.

1. In Visual Studio Code, open a new terminal window.

1. Get the query API key with this Azure CLI command:

    ```azurecli
    az search query-key list --resource-group YOUR-SEARCH-SERVICE-RESOURCE-GROUP --service-name YOUR-SEARCH-SERVICE-NAME
    ```

1. Keep this query key to use in the next section. The query key authorizes read access to a search index. 

## Add environment variables in Azure portal

The Azure Function app won't return search data until the search secrets are in settings. 

1. Select **Azure** from the Activity Bar. 

1. Right-click on your Static Web Apps resource then select **Open in Portal**.

    :::image type="content" source="media/tutorial-csharp-static-web-app/open-static-web-app-in-azure-portal.png" alt-text="Screenshot of Visual Studio Code showing Azure Static Web Apps explorer with the Open in Portal option shown.":::

1. Select **Environment variables** then select **+ Add application setting**.

    :::image type="content" source="media/tutorial-csharp-static-web-app/add-new-application-setting-to-static-web-app-in-portal.png" alt-text="Screenshot of the static web app's environment variables page in the Azure portal.":::

1. Add each of the following settings:

    |Setting|Your Search resource value|
    |--|--|
    |SearchApiKey|Your search query key|
    |SearchServiceName|Your search resource name|
    |SearchIndexName|`good-books`|
    |SearchFacets|`authors*,language_code`|

    Azure AI Search requires different syntax for filtering collections than it does for strings. Add a `*` after a field name to denote that the field is of type `Collection(Edm.String)`. This allows the Azure Function to add filters correctly to queries.

1. Check your settings to make sure they look like the following screenshot.

    :::image type="content" source="media/tutorial-csharp-static-web-app/save-new-application-setting-to-static-web-app-in-portal.png" alt-text="Screenshot of browser showing Azure portal with the button to save the settings for your app.":::

1. Return to Visual Studio Code. 

1. Refresh your static web app to see the application settings and functions.

    :::image type="content" source="media/tutorial-csharp-static-web-app/visual-studio-code-extension-fresh-resource-2.png" alt-text="Screenshot of Visual Studio Code showing the Azure Static Web Apps explorer with the new application settings." border="true":::

If you don't see the application settings, revisit the steps for updating and relaunching the GitHub workflow.

## Use search in your static web app

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon.

1. In the Side bar, **right-click on your Azure subscription** under the `Static Web Apps` area and find the static web app you created for this tutorial.

1. Right-click the static web app name and select **Browse site**.

    :::image type="content" source="media/tutorial-csharp-static-web-app/visual-studio-code-browse-static-web-app.png" alt-text="Screenshot of Visual Studio Code showing the Azure Static Web Apps explorer showing the **Browse site** option.":::

1. Select **Open** in the pop-up dialog.

1. In the website search bar, enter a search query such as `code`, so the suggest feature suggests book titles. Select a suggestion or continue entering your own query. Press enter when you've completed your search query. 

1. Review the results then select one of the books to see more details. 

## Troubleshooting

If the web app didn't deploy or work, use the following list to determine and fix the issue:

* **Did the deployment succeed?** 

    In order to determine if your deployment succeeded, you need to go to _your_ fork of the sample repo and review the success or failure of the GitHub action. There should be only one action and it should have static web app settings for the  `app_location`, `api_location`, and `output_location`. If the action didn't deploy successfully, dive into the action logs and look for the last failure. 

* **Does the client (front-end) application work?**

    You should be able to get to your web app and it should successfully display. If the deployment succeeded but the website doesn't display, this might be an issue with how the static web app is configured for rebuilding the app, once it is on Azure. 

* **Does the API (serverless back-end) application work?**

    You should be able to interact with the client app, searching for books and filtering. If the form doesn't return any values, open the browser's developer tools, and determine if the HTTP calls to the API were successful. If the calls weren't successful, the most likely reason if the static web app configurations for the API endpoint name and search query key are incorrect.

    If the path to the Azure function code (`api_location`) isn't correct in the YML file, the application loads but won't call any of the functions that provide integration with Azure AI Search. Revisit the deployment section to make sure paths are correct.

## Clean up resources

To clean up the resources created in this tutorial, delete the resource group or individual resources.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Static Web Apps` area and find the app you created for this tutorial.

1. Right-click the app name then select **Delete**.

1. If you no longer want the GitHub fork of the sample, remember to delete that on GitHub. Go to your fork's **Settings** then delete the repository.

1. To delete Azure AI Search, [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) and select **Delete** at the top of the page.

## Next steps

* [Understand Search integration for the search-enabled website](tutorial-csharp-search-query-integration.md)
