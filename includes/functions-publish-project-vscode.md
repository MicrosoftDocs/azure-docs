

## Publish the project to Azure

Visual Studio Code lets you publish your functions project directly to Azure. In the process, you create a function app and related resources in your Azure subscription. The function app provides an execution context for your functions. The project is packaged and deployed to the new function app in your Azure subscription. 

This article assumes that you are creating a new function app. Publishing to an existing function app overwrites the content of that app in Azure.

1. In the **Azure: Functions** area, select the Deploy to Function App icon.

    ![Function app settings](./media/functions-publish-project-vscode/function-app-publish-project.png)

1. Choose the project folder, which is your current workspace.

1. If you have more than one subscription, choose the one you want to host your function app, then choose **+ Create New Function App**.

1. Type a globally unique name that identifies your function app and press Enter. Valid characters for a function app name are `a-z`, `0-9`, and `-`.

1. Choose **+ Create New Resource Group**, type a resource group name, like `myResourceGroup`, and press enter. You can also use an existing resource group.

1. Choose **+ Create New Storage Account**, type a globally unique name of the new storage account used by your function app and press Enter. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. You can also use an existing account.

1. Choose a location in a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access.

    Function app creation starts after you choose your location. A notification is displayed after your function app is created and the deployment package is applied.

1. Select **View Output** in the notifications to view the creation and deployment results, including the Azure resources that you created.

    ![Function app creation output](./media/functions-publish-project-vscode/function-create-notifications.png)

1. Make a note of the URL of the new function app in Azure. You use this to test your function after the project is published to Azure.

    ![Function app creation output](./media/functions-publish-project-vscode/function-create-output.png)

1. Back in the **Azure: Functions** area, you see the new function app displayed under your subscription. When you expand this node, you see the functions in the function app, as well as application settings and function proxies.

    ![Function app settings](./media/functions-publish-project-vscode/function-app-project-settings.png)

    From your function app node, type Ctrl and click (right-click) to choose to perform various management and configuration tasks against the function app in Azure. You can also choose to view the function app in the Azure portal.
