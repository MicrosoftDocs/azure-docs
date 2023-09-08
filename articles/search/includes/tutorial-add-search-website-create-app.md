---
ms.topic: include
ms.date: 07/18/2023
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
---

Deploy the search-enabled website as an Azure Static Web Apps site. This deployment includes both the React app and the Function app.  

The static web app pulls the information and files for deployment from GitHub using your fork of the samples repository.  

## Create a Static Web App in Visual Studio Code

1. Select **Azure** from the Activity Bar, then open **Resources** from the Side bar. 

1. Right-click **Static Web Apps** and then select **Create Static Web App (Advanced)**.

    :::image type="content" source="../media/tutorial-javascript-create-load-index/visual-studio-code-create-static-web-app-resource-advanced.png" alt-text="Screenshot of Visual Studio Code, with the Azure Static Web Apps explorer showing the option to create an advanced static web app.":::

1. If you see a pop-up window in VS Code asking which branch you want to deploy from, select the default branch, usually **master** or **main**. 

    This setting means only changes you commit to that branch are deployed to your static web app. 

1. If you see a pop-up window asking you to commit your changes, don't do this. The secrets from the bulk import step shouldn't be committed to the repository. 

    To roll back the changes, in VS Code select the Source Control icon in the Activity bar, then select each changed file in the Changes list and select the **Discard changes** icon.

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |Select a resource group for new resources.|Use the resource group you created for this tutorial.|
    |Enter the name for the new Static Web App.|Create a unique name for your resource. For example, you can prepend your name to the repository name such as, `joansmith-azure-search-dotnet-samples`. |
    |Select a SKU| Select the free SKU for this tutorial.|
    |Select a location for new resources.|For Node.js: Select `West US 2` during the Azure Function programming model (PM) v4 preview. For C# and Python, select a region near you.|
    |Choose build preset to configure default project structure.|Select **Custom**|
    |Select the location of your application code|`search-website-functions-v4/client-v4`<br><br>This is the path, from the root of the repository, to your static web app. |
    |Select the location of your Azure Functions code|`search-website-functions-v4/api-v4`<br><br>This is the path, from the root of the repository, to your static web app. |
    |Enter the path of your build output...|`build`<br><br>This is the path, from your static web app, to your generated files.|

    If you get an error about an incorrect region, make sure the resource group and Static web app resource are in one of the supported regions listed in the error response. 

1. The resource is created and a notification window appears. 

     When the resource is created, it creates a GitHub action file on GitHub.

1. Select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo. 

    Wait until the _workflow_ completes before continuing. This may take a minute or two to finish. 

1. Pull the new GitHub action file to your local computer by synchronizing your local fork with your remote fork:

    ```bash
    git pull origin main
    ```

    * _origin_ refers to your forked repo. 
    * _main_ refers to the default branch.

1. In Visual Studio file explorer, find and open the workflow file in the `./.github/workflows/` directory. The file path and name looks _something_ `.github\workflows\azure-static-web-apps-lemon-mushroom-0e1bd060f.yml`.

    The _part_ of the YAML file relevant to the static web app is shown below:

    :::code language="yml" source="~/azure-search-javascript-samples/search-website-functions-v4/example-github-action-v4.yml":::

## Get Cognitive Search query key in Visual Studio Code

1. In Visual Studio Code, open a new terminal window.

1. Get the Query Key with this Azure CLI command:

    ```azurecli
    az search query-key list --resource-group cognitive-search-demo-rg --service-name my-cog-search-demo-svc
    ```

1. Keep this query key, you'll need to use it in the next section. The query key is able to query your Index. 

## Add configuration settings in Azure portal

The Azure Function app won't return Search data until the Search secrets are in settings. 

1. Select **Azure** from the Activity Bar. 
1. Right-click on your Static Web Apps resource then select **Open in Portal**.

    :::image type="content" source="../media/tutorial-javascript-static-web-app/open-static-web-app-in-azure-portal.png" alt-text="Screenshot of Visual Studio Code showing Azure Static Web Apps explorer with the Open in Portal option shown.":::

1. Select **Configuration** then select **+ Add**.

    :::image type="content" source="../media/tutorial-javascript-static-web-app/add-new-application-setting-to-static-web-app-in-portal.png" alt-text="Screenshot of Visual Studio Code showing the Azure Static Web Apps explorer with the Configuration option shown.":::

1. Add each of the following settings:

    |Setting|Your Search resource value|
    |--|--|
    |SearchApiKey|Your Search query key|
    |SearchServiceName|Your Search resource name|
    |SearchIndexName|`good-books`|
    |SearchFacets|`authors*,language_code`|

    Azure Cognitive Search requires different syntax for filtering collections than it does for strings. Add a `*` after a field name to denote that the field is of type `Collection(Edm.String)`. This allows the Azure Function to add filters correctly to queries.

1. Select **Save** to save the settings. 

    :::image type="content" source="../media/tutorial-javascript-static-web-app/save-new-application-setting-to-static-web-app-in-portal.png" alt-text="Screenshot of browser showing Azure portal with the button to save the settings for your app..":::

1. Return to VS Code. 
1. Refresh your static web app to see the application settings. 

    :::image type="content" source="../media/tutorial-javascript-static-web-app/visual-studio-code-extension-fresh-resource.png" alt-text="Screenshot of Visual Studio Code showing the Azure Static Web Apps explorer with the new application settings.":::

## Use search in your static web app

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon.
1. In the Side bar, **right-click on your Azure subscription** under the `Static Web Apps` area and find the static web app you created for this tutorial.
1. Right-click the static web app name and select **Browse site**.
    
    :::image type="content" source="../media/tutorial-javascript-create-load-index/visual-studio-code-browse-static-web-app.png" alt-text="Screenshot of Visual Studio Code showing the Azure Static Web Apps explorer showing the **Browse site** option.":::    

1. Select **Open** in the pop-up dialog.
1. In the website search bar, enter a search query such as `code`, so the suggest feature suggests book titles. Select a suggestion or continue entering your own query. Press enter when you've completed your search query. 
1. Review the results then select one of the books to see more details. 


## Troubleshooting

[!INCLUDE [tutorial-troubleshooting](tutorial-add-search-website-troubleshooting.md)]

## Clean up resources

To clean up the resources created in this tutorial, delete the resource group.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Resource Groups` area and find the resource group you created for this tutorial.
1. Right-click the resource group name then select **Delete**.
    This deletes both the Search and Static Web Apps resources.
1. If you no longer want the GitHub fork of the sample, remember to delete that on GitHub. Go to your fork's **Settings** then delete the fork. 
