---
title: Create a function app that uses identity-based Azure service connections
description: Learn how to use identity-based connections with Azure Functions without having the handle service-specific connection strings.
ms.topic: tutorial
ms.date: 7/26/2021
#Customer intent: As a function developer, I want to learn how to use managed identities so that I can avoid having to handle connection strings in my application settings.
---

# Tutorial: Create a function app that uses identity-based Azure service connections

This tutorial shows you how to configure a function app using identity-based connections instead of connection strings. To learn more about identity-based connections, see [configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

While the procedures shown work generally for all languages, this tutorial currently supports C# class library functions specifically. 

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> * Create a function app in Azure using an ARM template.
> * Enable managed identity on the function app.
> * Create a timer triggered function project and build a deployment package.
> * Upload a deployment package to Blob Storage.
> * Use managed identity for the default storage account.
<!--- >* Update your extension bundle (non-C# languages). --->

## Prerequisites

Before you begin, you must have the following:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download)

+ The [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.


## Create a function app without Azure Files

Azure Files currently doesn't support managed identity for SMB file shares. This means that the function app you create can't use Azure Files, which is used by default for Windows deployments on Premium and Consumption plans. 

Because the Azure portal doesn't support creating function apps without Azure Files, you instead need to generate and edit an ARM template, which you then use to create your function app in Azure. To learn more, see [Create an app without Azure Files](storage-considerations.md#create-an-app-without-azure-files).

> [!IMPORTANT]
> Don't create the function app until after you edit the ARM template.

1. In the [Azure portal](https://portal.azure.com), choose **Create a resource (+)**.

1. On the **New** page, select **Compute** > **Function App**.

1. On the **Basics** page, use the following table to configure the function app.

    | Option      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | Subscription under which this new function app is created. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  myResourceGroup | Name for the new resource group where you'll create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Publish**| Code | Choose to publish code files or a Docker container. |
    | **Runtime stack** | .NET | This tutorial uses .NET. |
    |**Region**| Preferred region | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services that your functions access. |

1. Select **Review + create**. Your app uses the default values on the **Hosting** and **Monitoring** page. You're welcome to review the default options, and they'll be included in the ARM template that you generate. 

1. Instead of creating your function app here, choose **Download a template for automation**, which is to the right of the **Next** button.

1. In the template page, select **Deploy**, then in the Custom deployment page, select **Edit template**.
    :::image type="content" source="./media/managed-identity-tutorial/1-function-create-deploy.png" alt-text="Screenshot of where to find the deploy button for creating a Function.":::

1. In the editor, search for and remove the JSON objects that define the `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` and `WEBSITE_CONTENTSHARE` application settings, which looks like the following example:

    ```json
    {
        "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
        "value": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageAccountName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2019-06-01').keys[0].value,';EndpointSuffix=','core.windows.net')]"
    },
    {
        "name": "WEBSITE_CONTENTSHARE",
        "value": "[concat(toLower(parameters('name')), 'b847')]"
    }
    ```

    Remember to remove any preceding comma, which might cause invalid JSON. This prevents these two Azure Files-related settings from being created. 
 
1. Select **Save** to save the updated ARM template.

1. Make sure that your create options, including **Resource Group**, are still correct and select **Review + create**.

1. After your template validates, make a note of your **Storage Account Name**, since you'll use this account later. Finally, select **Create** to provision and deploy the function app. 

1. After deployment completes, select **Go to resource group** and then select the new function app. 

    > [!NOTE]
    > Because you've created a function app in a Consumption plan, you'll get a warning about Storage not being configured properly. This is expected, and you'll fix it later in this tutorial.

Congratulations! You've successfully created your function app without the Azure Files dependency.  
Next, you'll enable managed identities so that your function app works without having to store connection string values in application settings.

## Enable managed identity

 This tutorial uses a system-assigned identity, which is used to access blob content in its storage account without using a key. For more information, see [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md). 

1. In your new function app, under **Settings**, select **Identity** > **System assigned**.

    :::image type="content" source="./media/managed-identity-tutorial/4-add-system-assigned-id.png" alt-text="Screenshot how to add a system assigned identity.":::

1. Switch the **Status** to **On**, and select **Save**. If promp                                                                                                                                ted to **enable system assigned managed identity**, select **Yes**.

1. Select **Azure role assignments** and then **Azure role assignment (Preview)**.

1. In the to open the **Add role assignment** page and use options as shown in the table below.

    :::image type="content" source="./media/managed-identity-tutorial/5-role-assignment.png" alt-text="Screenshot of how to role assignments for storage":::

    | Option      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Scope** |  Storage |  Scope is a set of resources that the role assignment applies to. Scope has levels that are inherited at lower levels. For example, if you select a subscription scope, the role assignment applies to all resource groups and resources in the subscription. |
    |**Subscription**| Your subscription | Subscription under which this new function app is created. |
    |**Resource**| Your storage account | The storage account for your function app. |
    | **Role** | Storage Blob Data Owner | A role is a collection of permissions. Grants full access to manage all resources, including the ability to assign roles in Azure RBAC. |

1. Select **Save**. It might take a minute or two for the role to show up when you refresh the Azure role assignments list. 

Congratulations! You've created a system-assigned Storage Blob Data Owner role. Now your app can use managed identity to pull packages from Blob Storage. This means that when you configure your functions to run from the deployment package, you won't need to use a shared access signature (SAS) key to access the package from your storage account. 

Next, you'll deploy a timer triggered function to confirm things are configured correctly. A timer trigger is used because it doesn't require you to have a configured storage account and the `AzureWebJobsStorage` app setting.

## Deploy packaged project files to the function app

To deploy a zipped package without a connected storage account, you must manually create a .zip compressed deployment package and upload it to a Blob Storage container. 

1. From a command prompt in your local computer, run the following Azure Functions Core Tools commands to create a new C# class library function project in the current folder, add a timer triggered function, and run the project:

    ```console
    func init --worker-runtime dotnet
    func new --name TimerTrigger --template timer trigger
    ```

1. Run the following command to start the project and verify that it runs without errors:

    ```console
    func start
    ```
    
    After the Function host successfully loads the function, press Ctrl-C to stop the host. 

1. Run the following command to locally generate the files needed for the deployment package:
 
    ```console
    dotnet publish --configuration Release
    ```

1. Browse to the `\bin\Release\netcoreapp3.1\publish` subfolder and create a .zip file of this folder, which contains the **host** file and both the **bin** and **TimerTrigger** folders.

1. Back in the [Azure portal](https://portal.azure.com), search for your storage account name or browse for it in storage accounts.
 
1. In the storage account, select **Containers** under **Data storage**.

    :::image type="content" source="./media/managed-identity-tutorial/7-new-store-container.png" alt-text="Screenshot of how to create a new storage container.":::

1. Select **+ Container** to create a new Blob Storage container in your account.

1. In the **New container** page, provide a **Name**, make sure the **Public access level** is **Private**, and select **Create**.

1. Select the container you created, select **Upload**, browse to the location of the .zip file you created with your project, and select **Upload**.

    :::image type="content" source="./media/managed-identity-tutorial/8-upload-zip.png" alt-text="Screenshot of how to go to upload a package.":::

1. After the upload completes, choose your uploaded blob file, and copy the URL.

    :::image type="content" source="./media/managed-identity-tutorial/9-copy-url.png" alt-text="Screenshot of how to get the zipped blob url.":::

1. Search for your new function app or browse for it in the **Function App** page. 

1. In your function app, select **Configurations** under **Settings**.

    :::image type="content" source="./media/managed-identity-tutorial/10-web-run-from-package.png" alt-text="Screenshot of how to add the run from package app setting.":::

1. In the **Application Settings** tab, select **New application setting**

1. Enter the value `WEBSITE_RUN_FROM_PACKAGE` for the **Name**, and paste the URL of your package in Blob Storage as the **Value**.

1. Select **OK**. Then select  **Save** > **Continue** to save the setting and restart the app.

Now you can run your timer trigger in Azure to verify that deployment has succeeded using the deployment package .zip file.

## Verify your function app configuration

1. In your function app, select **Functions** under **Functions**, and then select **TimerTrigger**.

    :::image type="content" source="./media/managed-identity-tutorial/11-timer-test.png" alt-text="Screenshot of how to open the test a timer trigger view.":::

1. Under **Developer**, select **Code+Test** > **Test/Run**, and select **Run** to start the timer trigger.
 
    :::image type="content" source="./media/managed-identity-tutorial/12-test-run.png" alt-text="Screenshot of how to test the timer trigger.":::

    You should see a success message in the output. 

Congratulations! You've successfully run your timer trigger in Azure. Now, you can switch the `AzureWebJobsStorage` setting to be secretless. This works because the function app already has the Storage Blob Data Owner role created. You just need to update an application setting. 

## Use managed identity for AzureWebJobsStorage

1. In your function app under **Settings**, select **Configuration**.

    :::image type="content" source="./media/managed-identity-tutorial/13-update-azurewebjobsstorage.png" alt-text="Screenshot of how to update the AzureWebJobsStorage app setting.":::

1. Select the **Edit** button next to the **AzureWebJobsStorage** application setting, and change it based on the following values.

    | Option      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Name** |  AzureWebJobsStorage__accountName | Update the name from **AzureWebJobsStorage** to the exact name `AzureWebJobsStorage__accountName`. This tells the host to use the identity instead of looking for a stored secret. Please be aware that the new setting uses a double underscore (`__`), which is a special character in application settings.  |
    | **Value** | Your account name | Update the name from the connection string to just your **AccountName** to use the identity instead of secrets. Ex. `DefaultEndpointsProtocol=https;AccountName=identityappstore;AccountKey=...` would become `identityappstore`|

1. Select **OK** and then **Save** > **Continue** to save your changes. 

1. Go back to the **Functions** page and again start your timer trigger to make sure everything is still working correctly.

Congratulations! You've successfully removed all secrets in your function app by configuring it without Azure Files and using managed identity to load the application content from Blob Storage using the `WEBSITE_RUN_FROM_PACKAGE` setting. 

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps 

This tutorial showed how to create and deploy a basic function app with a simple timer trigger using identity-based connections.  

To learn more, see [Configure an identity-based connection](functions-reference.md#configure-an-identity-based-connection).
