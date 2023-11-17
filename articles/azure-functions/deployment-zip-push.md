---
title: Zip push deployment for Azure Functions 
description: Use the .zip file deployment facilities of the Kudu deployment service to publish your Azure Functions.

ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 08/12/2018
---

# Zip deployment for Azure Functions

This article describes how to deploy your function app project files to Azure from a .zip (compressed) file. You learn how to do a push deployment, both by using Azure CLI and by using the REST APIs. [Azure Functions Core Tools](functions-run-local.md) also uses these deployment APIs when publishing a local project to Azure. 

Zip deployment is also an easy way to run your functions from the deployment package. To learn more, see [Run your functions from a package file in Azure](run-functions-from-deployment-package.md).

Azure Functions has the full range of continuous deployment and integration options that are provided by Azure App Service. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

To speed up development, you might find it easier to deploy your function app project files directly from a .zip file. The .zip deployment API takes the contents of a .zip file and extracts the contents into the `wwwroot` folder of your function app. This .zip file deployment uses the same Kudu service that powers continuous integration-based deployments, including:

+ Deletion of files that were left over from earlier deployments.
+ Deployment customization, including running deployment scripts.
+ Deployment logs.
+ Syncing function triggers in a [Consumption plan](functions-scale.md) function app.

For more information, see the [.zip deployment reference](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file).

## Deployment .zip file requirements

The .zip file that you use for push deployment must contain all of the files needed to run your function.

>[!IMPORTANT]
> When you use .zip deployment, any files from an existing deployment that aren't found in the .zip file are deleted from your function app.  

[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

A function app includes all of the files and folders in the `wwwroot` directory. A .zip file deployment includes the contents of the `wwwroot` directory, but not the directory itself. When deploying a C# class library project, you must include the compiled library files and dependencies in a `bin` subfolder in your .zip package.

When you are developing on a local computer, you can manually create a .zip file of the function app project folder using built-in .zip compression functionality or third-party tools.

## <a name="cli"></a>Deploy by using Azure CLI

You can use Azure CLI to trigger a push deployment. Push deploy a .zip file to your function app by using the [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) command. To use this command, you must use Azure CLI version 2.0.21 or later. To see what Azure CLI version you are using, use the `az --version` command.

In the following command, replace the `<zip_file_path>` placeholder with the path to the location of your .zip file. Also, replace `<app_name>` with the unique name of your function app and replace `<resource_group>` with the name of your resource group.

```azurecli-interactive
az functionapp deployment source config-zip -g <resource_group> -n \
<app_name> --src <zip_file_path>
```

This command deploys project files from the downloaded .zip file to your function app in Azure. It then restarts the app. To view the list of deployments for this function app, you must use the REST APIs.

When you're using Azure CLI on your local computer, `<zip_file_path>` is the path to the .zip file on your computer. You can also run Azure CLI in [Azure Cloud Shell](../cloud-shell/overview.md). When you use Cloud Shell, you must first upload your deployment .zip file to the Azure Files account that's associated with your Cloud Shell. In that case, `<zip_file_path>` is the storage location that your Cloud Shell account uses. For more information, see [Persist files in Azure Cloud Shell](../cloud-shell/persisting-shell-storage.md).

[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]

## <a name="arm"></a>Deploy by using ARM Template

You can use [ZipDeploy ARM template extension](https://github.com/projectkudu/kudu/wiki/MSDeploy-VS.-ZipDeploy#zipdeploy) to push your .zip file to your function app.

### Example ZipDeploy ARM Template

This template includes both a production and staging slot and deploys to one or the other. Typically, you would use this template to deploy to the staging slot and then swap to get your new zip package running on the production slot.  

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "appServiceName": {
      "type": "string"
    },
    "deployToProduction": {
      "type": "bool",
      "defaultValue": false
    },
    "slot": {
      "type": "string",
      "defaultValue": "staging"
    },
    "packageUri": {
      "type": "secureString"
    }
  },
  "resources": [
    {
      "condition": "[parameters('deployToProduction')]",
      "type": "Microsoft.Web/sites/extensions",
      "apiVersion": "2021-02-01",
      "name": "[format('{0}/ZipDeploy', parameters('appServiceName'))]",
      "properties": {
        "packageUri": "[parameters('packageUri')]",
        "appOffline": true
      }
    },
    {
      "condition": "[not(parameters('deployToProduction'))]",
      "type": "Microsoft.Web/sites/slots/extensions",
      "apiVersion": "2021-02-01",
      "name": "[format('{0}/{1}/ZipDeploy', parameters('appServiceName'), parameters('slot'))]",
      "properties": {
        "packageUri": "[parameters('packageUri')]",
        "appOffline": true
      }
    }
  ]
}
```

For the initial deployment, you would deploy directly to the production slot. For more information, see [Slot deployments](functions-infrastructure-as-code.md#slot-deployments).

## Run functions from the deployment package

You can also choose to run your functions directly from the deployment package file. This method skips the deployment step of copying files from the package to the `wwwroot` directory of your function app. Instead, the package file is mounted by the Functions runtime, and the contents of the `wwwroot` directory become read-only.  

Zip deployment integrates with this feature, which you can enable by setting the function app setting `WEBSITE_RUN_FROM_PACKAGE` to a value of `1`. For more information, see [Run your functions from a deployment package file](run-functions-from-deployment-package.md).

[!INCLUDE [app-service-deploy-zip-push-custom](../../includes/app-service-deploy-zip-push-custom.md)]

## Download your function app files

If you created your functions by using the editor in the Azure portal, you can download your existing function app project as a .zip file in one of these ways:

+ **From the Azure portal:**

  1. Sign in to the [Azure portal](https://portal.azure.com), and then go to your function app.

  2. On the **Overview** tab, select **Download app content**. Select your download options, and then select **Download**.

      ![Download the function app project](./media/deployment-zip-push/download-project.png)

     The downloaded .zip file is in the correct format to be republished to your function app by using .zip push deployment. The portal download can also add the files needed to open your function app directly in Visual Studio.

+ **Using REST APIs:**

    Use the following deployment GET API to download the files from your `<function_app>` project: 

    ```http
    https://<function_app>.scm.azurewebsites.net/api/zip/site/wwwroot/
    ```

    Including `/site/wwwroot/` makes sure your zip file includes only the function app project files and not the entire site. If you are not already signed in to Azure, you will be asked to do so.  

You can also download a .zip file from a GitHub repository. When you download a GitHub repository as a .zip file, GitHub adds an extra folder level for the branch. This extra folder level means that you can't deploy the .zip file directly as you downloaded it from GitHub. If you're using a GitHub repository to maintain your function app, you should use [continuous integration](functions-continuous-deployment.md) to deploy your app.  

## Next steps

> [!div class="nextstepaction"]
> [Run your functions from a package file in Azure](run-functions-from-deployment-package.md)

[.zip push deployment reference topic]: https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file
