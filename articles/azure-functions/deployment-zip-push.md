---
title: Package-based deployment for Azure Functions
description: Learn how to create and deploy a package file and run your Azure Functions directly from the package.
ms.topic: concept-article
ms.date: 08/31/2026
zone_pivot_groups: functions-hosting-plan
ms.custom:
  - devx-track-azurecli
  - devx-track-bicep
  - devx-track-arm-template
  - sfi-image-nochange
---

# Package-based deployment for Azure Functions

This article describes how to create a ready-to-run .zip deployment package, deploy the package to Azure, and configure your function app to run directly from the package. You can deploy by using Azure Functions Core Tools, Azure CLI, or the deployment REST APIs.

Package-based deployment is the default for function apps that run from code. The deployment technology and package configuration depend on the hosting plan. Select your hosting plan at the top of this article.

Azure Functions has the full range of continuous deployment and integration options that Azure App Service provides. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

## Package deployment by hosting plan

The following table summarizes the deployment process and package configuration for each hosting plan:

| Hosting plan | Deployment process | Package configuration |
| --- | --- | --- |
| Flex Consumption plan | Managed package deployment | Runs from the deployed package by default. Don't set `WEBSITE_RUN_FROM_PACKAGE`. |
| Premium plan | ZIP deployment | Set `WEBSITE_RUN_FROM_PACKAGE` to `1` to run from the deployed package. |
| Dedicated (App Service) plan | ZIP deployment | Set `WEBSITE_RUN_FROM_PACKAGE` to `1` to run from the deployed package. |
| Consumption plan on Windows | ZIP deployment | Set `WEBSITE_RUN_FROM_PACKAGE` to `1` to run from the deployed package. |
| Consumption plan on Linux | Remote build or external package URL | Use an external package URL for a locally built package. |
| Azure Container Apps | Container image deployment | Package-based code deployment doesn't apply. |

::: zone pivot="container-apps"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

Function apps hosted on Azure Container Apps are deployed as container images, not .zip packages. To create and deploy an image-based function app, see [Create a function app on Azure Container Apps using code](../container-apps/functions-container-apps.md).

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan,consumption-plan"

## Create a deployment package

In most cases, you don't need to create the deployment package yourself. These tool-based deployment methods create the package as part of the publishing process:

- The Azure Functions Core Tools [`func azure functionapp publish`](functions-core-tools-reference.md#func-azure-functionapp-publish) command.
- [Visual Studio Code publishing](functions-develop-vs-code.md#republish-project-files).
- [Visual Studio publishing](functions-develop-vs.md#publish-to-azure).
- [GitHub Actions deployment](functions-how-to-github-actions.md), which packages the configured project path.

For [Azure Pipelines deployment](functions-how-to-azure-devops.md), the pipeline build steps create the .zip archive and pass it to the `AzureFunctionApp` deployment task.

When you need to work directly with a ready-to-run deployment package, [create the package by using `func pack`](functions-run-local.md#create-a-deployment-package). For example, create the package yourself when you deploy by using an [external package URL](functions-deployment-technologies.md#external-package-url).

You can also create the .zip archive manually. When you create the archive manually, follow these package structure requirements.

### Deployment package requirements

[!INCLUDE [functions-deployment-zip-structure](../../includes/functions-deployment-zip-structure.md)]

A zip deployment process extracts the .zip archive's files and folders in the `wwwroot` directory. If you include the parent directory when creating the archive, the system doesn't find the files it expects to see in `wwwroot`.

::: zone-end

::: zone pivot="flex-consumption-plan"

## Deploy a package

Flex Consumption uses [package deployment](functions-deployment-technologies.md#flex-consumption-package-deployment) to store a ready-to-run package in the app's deployment storage container. The app runs directly from this package. Don't set the `WEBSITE_RUN_FROM_PACKAGE` app setting.

Deploy the package by using [Core Tools](functions-run-local.md#project-file-deployment), [Visual Studio Code](functions-develop-vs-code.md#publish-to-azure), or Azure CLI. These tools automatically select the correct package deployment behavior for a Flex Consumption app.

These tools perform a push deployment by sending the package to the app's deployment endpoint. For Flex Consumption, these clients send the package to `/api/publish` on the app's `scm` host. When the deployment endpoint is reachable only over a private endpoint, the computer, runner, or agent that performs the deployment must have network connectivity to and DNS resolution for the private deployment endpoint. The deployment service stores the processed package in the configured deployment container; directly uploading a package to this container doesn't deploy it. To deploy without pushing from the initiating client to the deployment endpoint, use a [Bicep or ARM template deployment](#deploy-by-using-bicep-or-an-azure-resource-manager-template) with a package URL that the deployment service can access.

### Deploy by using Azure CLI

Use the [`az functionapp deployment source config-zip`](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) command to deploy a package:

```azurecli-interactive
az functionapp deployment source config-zip --resource-group <RESOURCE_GROUP> \
  --name <APP_NAME> --src <ZIP_FILE_PATH>
```

Add `--build-remote true` when the source project requires a remote build. Don't request a remote build for a package that `func pack` already built into a ready-to-run state, such as a Go deployment package.

To configure deployment storage or recover an earlier deployment, see [Create and manage function apps in the Flex Consumption plan](flex-consumption-how-to.md#deploy-your-code-project).

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

## Deploy a package

Premium, Dedicated, and Consumption plan apps use the zip deployment API. The deployment service performs these actions:

- Delete files that remain from earlier deployments.
- Run deployment scripts and other deployment customizations.
- Write deployment logs.
- Sync function triggers.

> [!IMPORTANT]
> In a zip deployment, files from the previous deployment are deleted or updated when they were part of that deployment. The deployment process retains other files and directories in your function app that weren't part of the previous deployment. For implementation details, see the [zip deployment reference](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

### Deploy by using Azure CLI

Use Azure CLI to trigger a push deployment. Push deploy a .zip file to your function app by using the [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) command. To use this command, you must use Azure CLI version 2.0.21 or later. To see what Azure CLI version you're using, use the `az --version` command.

In the following command, replace the `<zip_file_path>` placeholder with the path to the location of your .zip file. Also, replace `<app_name>` with the unique name of your function app and replace `<resource_group>` with the name of your resource group.

```azurecli-interactive
az functionapp deployment source config-zip -g <resource_group> -n \
<app_name> --src <zip_file_path>
```

This command deploys project files from the .zip file to your function app in Azure and restarts the app.

When you're using Azure CLI on your local computer, `<zip_file_path>` is the path to the .zip file on your computer. You can also run Azure CLI in [Azure Cloud Shell](../cloud-shell/overview.md). When you use Cloud Shell, you must first upload your deployment .zip file to the Azure Files account that's associated with your Cloud Shell. In that case, `<zip_file_path>` is the storage location that your Cloud Shell account uses. For more information, see [Persist files in Azure Cloud Shell](../cloud-shell/persisting-shell-storage.md).

[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]

::: zone-end

::: zone pivot="flex-consumption-plan"

## Deploy by using Bicep or an Azure Resource Manager template

You can deploy a package to a Flex Consumption app as part of a Bicep or Azure Resource Manager (ARM) template deployment. Define a `Microsoft.Web/sites/extensions` resource that uses the `/onedeploy` extension and provides the remote package URL in the `packageUri` property.

You must name the package file *released-package.zip*. The Functions host must be able to access both the remote package URL and the deployment storage container. Directly uploading the package to the deployment container doesn't deploy it.

For Bicep and ARM template examples, see [Define the Flex Consumption deployment package](functions-infrastructure-as-code.md#deployment-package).

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

## Deploy by using an Azure Resource Manager template

You can use the [Azure Resource Manager (ARM) template ZipDeploy extension](https://github.com/projectkudu/kudu/wiki/MSDeploy-VS.-ZipDeploy#zipdeploy) to push your .zip file to your function app.

### Example ZipDeploy ARM template

This template includes both a production and staging slot and deploys to one or the other. Typically, you use this template to deploy to the staging slot and then swap to get your new zip package running on the production slot.  

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

For the initial deployment, you deploy directly to the production slot. For more information, see [Slot deployments](functions-infrastructure-as-code.md#slot-deployments).

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan,consumption-plan"

## Run functions from the deployment package

Running directly from the deployment package skips copying files into the `wwwroot` directory. Instead, the Functions runtime mounts the package as a read-only `wwwroot` directory. This approach:

- Reduces file copy locking issues.
- Verifies the files that are running in your app.
- Improves Azure Resource Manager deployment performance.
- Can reduce cold-start time, particularly for JavaScript apps with large npm package trees.

::: zone-end

::: zone pivot="flex-consumption-plan"

### Flex Consumption package configuration

Flex Consumption apps run from a package by default. Don't add the `WEBSITE_RUN_FROM_PACKAGE` app setting. Deployment settings, including the storage container and its authentication method, are properties of the function app resource. For more information, see [Deployment](flex-consumption-plan.md#deployment).

::: zone-end

::: zone pivot="premium-plan,dedicated-plan"

### Premium and Dedicated package configuration

Set `WEBSITE_RUN_FROM_PACKAGE` to `1` to run directly from the locally deployed package. The runtime stores the package in the `c:\home\data\SitePackages` folder on Windows or `/home/data/SitePackages` folder on Linux.

::: zone-end

::: zone pivot="consumption-plan"

### Consumption package configuration

The supported `WEBSITE_RUN_FROM_PACKAGE` value depends on the operating system:

| Operating system | Value | Behavior |
| --- | --- | --- |
| Windows | `1` | The app runs from a package in the `c:\home\data\SitePackages` folder. |
| Linux | `<URL>` | The app runs from the package at the specified URL. Use a private Azure Blob Storage container accessed by using a managed identity. |

[!INCLUDE [functions-linux-consumption-retirement](../../includes/functions-linux-consumption-retirement.md)]

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

### Package deployment considerations

Keep these requirements and limitations in mind when you deploy and run your function app from a package:

- The package must use .zip format. Tar and gzip formats aren't supported.
- The maximum package size is 1 GB. The deployment uses temporary storage when it unpacks project files, so the app must also have enough temporary storage. The Consumption plan provides [500 MB of temporary storage per plan](functions-scale.md#service-limits).
- When you run from a package, files in `wwwroot` are read-only, including in the Azure portal.
- You can't use the local cache when running from a package.
- Don't set `WEBSITE_RUN_FROM_PACKAGE` when you request a remote build. Instead, set `SCM_DO_BUILD_DURING_DEPLOYMENT=true`. On Linux, also set `ENABLE_ORYX_BUILD=true`.
- `WEBSITE_RUN_FROM_PACKAGE` doesn't work with MSDeploy. Use zip deployment instead.

### Add the WEBSITE_RUN_FROM_PACKAGE setting

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

### Run from a package uploaded by zip deployment

Set `WEBSITE_RUN_FROM_PACKAGE` to `1` before you deploy the package. The zip deployment API copies the package to the `SitePackages` folder instead of extracting its contents to `wwwroot`. The deployment also creates a *packagename.txt* file that identifies the package to mount. After the app restarts, the package mounts as the read-only `wwwroot` directory. Linux Consumption apps don't support this setting value and must instead [run from an external package URL](#run-from-an-external-package-url).

When deployment restarts the app, currently running function executions terminate. For information about writing functions that handle restarts safely, see [Write functions to be stateless](performance-reliability.md#write-functions-to-be-stateless).

### Run from an external package URL

Use an external package URL when you need to manage package storage yourself. You need this option to run a locally built package on a Linux Consumption app. It's not supported on Flex Consumption.

> [!NOTE]
> You can't change an existing function app that uses `WEBSITE_RUN_FROM_PACKAGE=1` to run from an external package URL. To use an external package URL, create a new function app and set `WEBSITE_RUN_FROM_PACKAGE` to the package URL.

Use a private Blob Storage container and grant the function app's managed identity access to the package. Use managed identity because SAS tokens expire and require maintenance. Whenever you publish an updated package, you must [manually sync triggers](functions-deployment-technologies.md#trigger-syncing). If you update the package in place without changing its URL, restart the function app before you sync triggers.

### Manually upload a package to Azure Blob Storage

1. Create a .zip deployment package.

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

1. Under **Data storage**, select **Containers**, and then create or select a private container.

1. Upload the package to the container.

1. Select the uploaded blob and copy its URL. If you don't use a managed identity, generate a SAS URL instead.

1. In your function app, expand **Settings**, select **Environment variables**, and then select **Add** on the **App settings** tab.

1. Add a setting named `WEBSITE_RUN_FROM_PACKAGE` with the package URL as its value.

1. Apply the changes, restart the app, and [manually sync triggers](functions-deployment-technologies.md#trigger-syncing).

### Fetch a package from Azure Blob Storage by using a managed identity

[!INCLUDE [Run from package via Identity](../../includes/app-service-run-from-package-via-identity.md)]

[!INCLUDE [app-service-deploy-zip-push-custom](../../includes/app-service-deploy-zip-push-custom.md)]

::: zone-end

::: zone pivot="flex-consumption-plan"

## Download your function app files

If you need the exact package that your app currently runs, download it from the Blob Storage container configured for your app's deployments:

1. In your function app page in the [Azure portal](https://portal.azure.com), expand **Settings**, and then select **Deployment settings**.

1. Under **Application package location**, note the storage account and container used for deployments.

1. Go to that storage account, expand **Data storage**, and then select **Containers**.

1. Select the deployment container, select the current package, and then select **Download**.

The downloaded package contains the built app content that you deployed, which might differ from your source project. Each deployment overwrites the current package, and the deployment container doesn't provide deployment history.

For apps deployed by using CI/CD, keep the source project in source control and retain ready-to-run build artifacts according to your release retention policy. Use a retained artifact to redeploy a specific release. Use the package in the deployment container when you need the exact package that the app currently runs or when the original artifact is no longer available.

::: zone-end

::: zone pivot="premium-plan,dedicated-plan,consumption-plan"

## Download your function app files

If you created your functions by using the editor in the Azure portal, you can download your existing function app project as a .zip file in one of these ways:

### [Azure portal](#tab/portal)

  1. Sign in to the [Azure portal](https://portal.azure.com), and then go to your function app.

  2. On the **Overview** tab, select **Download app content**. Select your download options, and then select **Download**.

  :::image type="content" source="./media/deployment-zip-push/download-project.png" alt-text="Screenshot shows the Azure portal page to download the function app project.":::

  The downloaded .zip file is in the correct format to be republished to your function app by using .zip push deployment. The portal download can also add the files needed to open your function app directly in Visual Studio.

### [REST APIs](#tab/rest)

  Use the following deployment GET API to download the files from your `<FUNCTION_APP>` project:

  ```http
  https://<FUNCTION_APP>.scm.azurewebsites.net/api/zip/site/wwwroot/
  ```

  Including `/site/wwwroot/` ensures your zip file includes only the function app project files and not the entire site. If you're not already signed in to Azure, you're prompted to do so.

---

For apps deployed by using CI/CD, keep the source project in source control and retain ready-to-run build artifacts according to your release retention policy. A source archive downloaded from a repository isn't a deployment package. Use your deployment workflow to build and deploy the project.

::: zone-end

## Related content

- [Deployment technologies in Azure Functions](functions-deployment-technologies.md)
- [Continuous deployment for Azure Functions](functions-continuous-deployment.md)
- [Automate resource deployment for your function app](functions-infrastructure-as-code.md)
