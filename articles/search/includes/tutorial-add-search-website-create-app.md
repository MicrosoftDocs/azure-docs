---
ms.topic: include
ms.date: 10/26/2022
---

Deploy the search-enabled website as an Azure Static web app. This deployment includes both the React app and the Function app.  

The Static Web app pulls the information and files for deployment from GitHub using your fork of the samples repository.  

## Create a Static Web App in Visual Studio Code

1. Select **Azure** from the Activity Bar, then open **Resources** from the Side bar. 

1. Right-click **Static Web Apps** and then select **Create Static Web App (Advanced)**.

    :::image type="content" source="../media/tutorial-javascript-create-load-index/visual-studio-code-create-static-web-app-resource-advanced.png" alt-text="Right-click **Static Web Apps** and then select **Create Static Web App (Advanced)**":::

1. If you see a pop-up window in VS Code asking which branch you want to deploy from, select the default branch, usually **master** or **main**. 

    This setting means only changes you commit to that branch are deployed to your static web app. 

1. If you see a pop-up window asking you to commit your changes, do not do this. The secrets from the bulk import step should not be committed to the repository. 

    To rollback the changes, in VS Code select the Source Control icon in the Activity bar, then select each changed file in the Changes list and select the **Discard changes** icon.

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |Select a resource group for new resources.|Use the resource group you created for this tutorial.|
    |Enter the name for the new Static Web App.|Create a unique name for your resource. For example, you can prepend your name to the repository name such as, `joansmith-azure-search-dotnet-samples`. |
    |Select a location for new resources.|Select a region close to you.|
    |Select a SKU| Select the free SKU for this tutorial.|
    |Choose build preset to configure default project structure.|Select **Custom**|
    |Select the location of your application code|`search-website-functions-v4/client`<br><br>This is the path, from the root of the repository, to your Azure Static web app. |
    |Select the location of your Azure Function code|`search-website-functions-v4/api`<br><br>This is the path, from the root of the repository, to your Azure Function app. If the step shows `search-website-functions-v4/api`, accept it and change it after the creation process completes. Those steps are provided at the end of this section.|
    |Enter the path of your build output...|`build`<br><br>This is the path, from your Azure Static web app, to your generated files.|

1. The resource is created and a notification window appears. Select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo. 

    Wait until the _workflow_ completes before continuing. This may take a minute or two to finish. 

1. When the resource is created, it creates a GitHub action file on GitHub but doesn't pull that file down to your local computer. To continue working on this project, you need to sync your local fork with your remote fork. Use Git in the Visual Studio Code integrated terminal to sync your local forked repository:

    ```bash
    git pull origin main
    ```

    * _origin_ refers to your forked repo. 
    * _main_ refers to the default branch.

    The GitHub action file is in the local directory at the `./.github/workflows` directory. 

1. In Visual Studio file explorer, open up your GitHub deployment action file. The file path and name _something_ looks `.github\workflows\azure-static-web-apps-lemon-mushroom-0e1bd060f.yml`.
1. The _part_ of the YAML file relevant to the Static web app is shown below:

    :::code language="yml" source="tutorial-add-search-website-github-action.yml" highlight="17-22":::

1. If your action file doesn't contain the correct settings (including the location of the `api`), update those value, then commit that change and push back to your GitHub fork. 

    Add action file changes.

    ```bash
    git add *.yml 
    ```

    Commit changes to local repository.

    ```bash
    git commit -m "update action for Static web app" 
    ```

    Push changes to GitHub.

    ```bash
    git push origin main 
    ```

    The updated action in your fork creates a new build and deploy to your Static web app. Wait until the _workflow_ completes before continuing. This may take a minute or two to finish. 

## Get Cognitive Search query key in Visual Studio Code

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**. 

    :::image type="content" source="../media/tutorial-javascript-create-load-index/visual-studio-code-copy-query-key.png" alt-text="In the Side bar, select your Azure subscription under the **Azure: Cognitive Search** area, then right-click on your Search resource and select **Copy Query Key**.":::

1. Keep this query key, you will need to use it in the next section. The query key is able to query your Index. 

## Add configuration settings in Azure portal

The Azure Function app won't return Search data until the Search secrets are in settings. 

1. Select **Azure** from the Activity Bar. 
1. Right-click on your Static web app resource then select **Open in Portal**.

    :::image type="content" source="../media/tutorial-javascript-static-web-app/open-static-web-app-in-azure-portal.png" alt-text="Right-click on your JavaScript Static web app resource then select Open in Portal.":::

1. Select **Configuration** then select **+ Add**.

    :::image type="content" source="../media/tutorial-javascript-static-web-app/add-new-application-setting-to-static-web-app-in-portal.png" alt-text="Select Configuration then select Add for your JavaScript app.":::

1. Add each of the following settings:

    |Setting|Your Search resource value|
    |--|--|
    |SearchApiKey|Your Search query key|
    |SearchServiceName|Your Search resource name|
    |SearchIndexName|`good-books`|
    |SearchFacets|`authors*,language_code`|

    Azure Cognitive Search requires different syntax for filtering collections than it does for strings. Add a `*` after a field name to denote that the field is of type `Collection(Edm.String)`. This allows the Azure Function to add filters correctly to queries.

1. Select **Save** to save the settings. 

    :::image type="content" source="../media/tutorial-javascript-static-web-app/save-new-application-setting-to-static-web-app-in-portal.png" alt-text="Select Save to save the settings for your JavaScript app..":::

1. Return to VS Code. 
1. Refresh your Static web app to see the Static web app's application settings. 

    :::image type="content" source="../media/tutorial-javascript-static-web-app/visual-studio-code-extension-fresh-resource.png" alt-text="Refresh your JavaScript Static web app to see the Static web app's application settings.":::

## Use search in your Static web app

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon.
1. In the Side bar, **right-click on your Azure subscription** under the `Static web apps` area and find the Static web app you created for this tutorial.
1. Right-click the Static Web App name and select **Browse site**.
    
    :::image type="content" source="../media/tutorial-javascript-create-load-index/visual-studio-code-browse-static-web-app.png" alt-text="Right-click the Static Web App name and select **Browse site**.":::    

1. Select **Open** in the pop-up dialog.
1. In the website search bar, enter a search query such as `code`, _slowly_ so the suggest feature suggests book titles. Select a suggestion or continue entering your own query. Press enter when you've completed your search query. 
1. Review the results then select one of the books to see more details. 


## Troubleshooting

[!INCLUDE [tutorial-troubleshooting](tutorial-add-search-website-troubleshooting.md)]

## Clean up resources

To clean up the resources created in this tutorial, delete the resource group.

1. In Visual Studio Code, open the [Activity bar](https://code.visualstudio.com/docs/getstarted/userinterface), and select the Azure icon. 

1. In the Side bar, **right-click on your Azure subscription** under the `Resource Groups` area and find the resource group you created for this tutorial.
1. Right-click the resource group name then select **Delete**.
    This deletes both the Search and Static web app resources.
1. If you no longer want the GitHub fork of the sample, remember to delete that on GitHub. Go to your fork's **Settings** then delete the fork. 