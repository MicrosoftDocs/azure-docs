---
ms.topic: include
ms.date: 09/21/2023
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
---

Deploy the search-enabled website as an Azure Static Web Apps site. This deployment includes both the React app and the Function app.  

The static web app pulls the information and files for deployment from GitHub using your fork of the samples repository.  

## Create a Static Web App in Visual Studio Code

1. In Visual Studio Code, open a folder at the repository root (for example, `azure-search-javascript-samples`).

1. Select **Azure** from the Activity Bar, then open **Resources** from the side bar. 

1. Right-click **Static Web Apps** and then select **Create Static Web App (Advanced)**. If you don't see this option, verify that you have the Azure Functions extension for Visual Studio Code.

    :::image type="content" source="../media/tutorial-javascript-create-load-index/visual-studio-code-create-static-web-app-resource-advanced.png" alt-text="Screenshot of Visual Studio Code, with the Azure Static Web Apps explorer showing the option to create an advanced static web app.":::

1. If you see a pop-up window in Visual Studio Code asking which branch you want to deploy from, select the default branch, usually **main**. 

    This setting means only changes you commit to that branch are deployed to your static web app. 

1. If you see a pop-up window asking you to commit your changes, don't do this. The secrets from the bulk import step shouldn't be committed to the repository. 

    To roll back the changes, in Visual Studio Code select the Source Control icon in the Activity bar, then select each changed file in the Changes list and select the **Discard changes** icon.

1. Follow the prompts to create the static web app:

    |Prompt|Enter|
    |--|--|
    |Select a resource group for new resources. | Use the resource group you created for this tutorial.|
    |Enter the name for the new Static Web App. | Create a unique name for your resource. For example, you can prepend your name to the repository name such as, `my-demo-static-web-app`. |
    |Select a SKU | Select the free SKU for this tutorial.|
    |Select a location for new resources. | For Node.js: Select `West US 2` during the Azure Function programming model (PM) v4 preview. For C# and Python, select a region near you. |
    |Choose build preset to configure default project structure. |Select **Custom**. |
    |Select the location of your client application code | `search-website-functions-v4/client`<br><br>This is the path, from the root of the repository, to your static web app. |
    |Select the location of your Azure Functions code | `search-website-functions-v4/api`<br><br>This is the path, from the root of the repository, to your static web app. If there are no other functions in the repository, you won't be prompted for the function code location. Currently, you'll need to perform extra steps to ensure the function code location is correct. These steps are performed after the resource is created and are documented in this article. |
    |Enter the path of your build output... | `build`<br><br>This is the path, from your static web app, to your generated files.|

    If you get an error about an incorrect region, make sure the resource group and static web app resource are in one of the supported regions listed in the error response. 

1. When the static web app is created, a GitHub workflow YML file is also created locally and on GitHub in your fork. This workflow executes in your fork, building and deploying the static web app and functions.

   Check the status of static web app deployment using any of these approaches:

   * Select **Open Actions in GitHub** from the Notifications. This opens a browser window pointed to your forked repo.
   * Select the **Actions** tab in your forked repository. You should see a list of all workflows on your fork.
   * Select the **Azure: Activity Log** in Visual Code. You should see a message similar to the following screenshot.

     :::image type="content" source="../media/tutorial-javascript-static-web-app/visual-studio-code-azure-activity-log.png" alt-text="Screenshot of the Activity Log in Visual Studio Code." border="true":::

1. Currently, the YML file is created with erroneous path syntax for the Azure function code. Use this workaround to correct the syntax. You can perform this step as soon as the YML file is created. A new workflow will launch as soon as you push the updates:

   1. In Visual Studio Code explorer, open the `./.github/workflows/` directory.

   1. Open the YML file.

   1. Scroll to the `api-location` path (on or near line 31).

   1. Change the path syntax to use a forward slash (only `api_location` needs editing, other locations are here for context):

      ```yml
      app_location: "search-website-functions-v4/client" # App source code path
      api_location: "search-website-functions-v4/api" # Api source code path - optional
      output_location: "build" # Built app content directory - optional
      ```

   1. Save the file.

   1. Open an integrated terminal and issue the following GitHub commands to send the updated YML to your fork:

      ```bash
      git add -A
      git commit -m "fix path"
      git push origin main
      ```

     :::image type="content" source="../media/tutorial-javascript-static-web-app/git-yml-path-workaround.png" alt-text="Screenshot of the GitHub commands in Visual Studio Code." border="true":::

    Wait until the workflow execution completes before continuing. This may take a minute or two to finish. 

<!-- 1. Pull the new GitHub action file to your local computer by synchronizing your local fork with your remote fork:

    ```bash
    git pull origin main
    ```

    * _origin_ refers to your forked repo. 
    * _main_ refers to the default branch.
 -->

<!-- 1. In Visual Studio file explorer, find and open the workflow file in the `./.github/workflows/` directory. The file path and name looks _something_ `.github\workflows\azure-static-web-apps-lemon-mushroom-0e1bd060f.yml`.

    The _part_ of the YAML file relevant to the static web app is shown below:

    :::code language="yml" source="~/azure-search-javascript-samples/search-website-functions-v4/example-github-action-v4.yml"::: -->

## Get the Azure AI Search query key in Visual Studio Code

1. In Visual Studio Code, open a new terminal window.

1. Get the query API key with this Azure CLI command:

    ```azurecli
    az search query-key list --resource-group cognitive-search-demo-rg --service-name my-cog-search-demo-svc
    ```

1. Keep this query key to use in the next section. The query key authorizes read access to a search index. 

## Add configuration settings in Azure portal

The Azure Function app won't return search data until the search secrets are in settings. 

1. Select **Azure** from the Activity Bar. 
1. Right-click on your Static Web Apps resource then select **Open in Portal**.

    :::image type="content" source="../media/tutorial-javascript-static-web-app/open-static-web-app-in-azure-portal.png" alt-text="Screenshot of Visual Studio Code showing Azure Static Web Apps explorer with the Open in Portal option shown.":::

1. Select **Configuration** then select **+ Add**.

    :::image type="content" source="../media/tutorial-javascript-static-web-app/add-new-application-setting-to-static-web-app-in-portal.png" alt-text="Screenshot of Visual Studio Code showing the Azure Static Web Apps explorer with the Configuration option shown.":::

1. Add each of the following settings:

    |Setting|Your Search resource value|
    |--|--|
    |SearchApiKey|Your search query key|
    |SearchServiceName|Your search resource name|
    |SearchIndexName|`good-books`|
    |SearchFacets|`authors*,language_code`|

    Azure AI Search requires different syntax for filtering collections than it does for strings. Add a `*` after a field name to denote that the field is of type `Collection(Edm.String)`. This allows the Azure Function to add filters correctly to queries.

1. Select **Save** to save the settings. 

    :::image type="content" source="../media/tutorial-javascript-static-web-app/save-new-application-setting-to-static-web-app-in-portal.png" alt-text="Screenshot of browser showing Azure portal with the button to save the settings for your app.":::

1. Return to Visual Studio Code. 

1. Refresh your static web app to see the application settings and functions.

    :::image type="content" source="../media/tutorial-javascript-static-web-app/visual-studio-code-extension-fresh-resource-2.png" alt-text="Screenshot of Visual Studio Code showing the Azure Static Web Apps explorer with the new application settings." border="true":::

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
