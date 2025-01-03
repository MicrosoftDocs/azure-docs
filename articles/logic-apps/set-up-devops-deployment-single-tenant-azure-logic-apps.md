---
title: Set up DevOps for Standard logic apps
description: How to set up DevOps deployment for Standard logic apps in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 10/24/2024
# Customer intent: As a developer, I want to automate deployment for Standard logic apps hosted in single-tenant Azure Logic Apps by using DevOps tools and processes.
---

# Set up DevOps deployment for Standard logic apps in single-tenant Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

This guide primarily shows how to set up deployment for a Standard logic app project in Visual Studio Code to your infrastructure using DevOps tools and processes. If your Standard logic app exists in the Azure portal instead, you can download your logic app's artifact files for use with DevOps deployment. Based on whether you want to use GitHub or Azure DevOps, you then choose the path and tools that work best for your deployment scenario.

If you don't have a Standard logic app, you can still follow this guide using the linked sample Standard logic app projects plus examples for deployment to Azure through GitHub or Azure DevOps. For more information, review [DevOps deployment overview for single-tenant Azure Logic Apps](devops-deployment-single-tenant-azure-logic-apps.md).

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Visual Studio Code, which is free, the Azure Logic Apps (Standard) extension for Visual Studio Code, and other related prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

- The Standard logic app to use with your DevOps tools and processes.

  You can either download the artifact files for your Standard logic app resource from the Azure portal, or you can use a Standard logic app project created with [Visual Studio Code and the Azure Logic Apps (Standard) extension for Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

  - **Portal**: The downloaded zip file contains Standard logic app artifact files, such as **workflow.json**, **connections.json**, **host.json**, and **local.settings.json**. See [Download Standard logic app artifact files from portal](#download-artifacts).
 
  - **Visual Studio Code**: You need an empty Standard logic app resource in the Azure portal for your deployment destination. To quickly create an empty Standard logic app resource, review [Create single-tenant based logic app workflows - Portal](create-single-tenant-workflows-azure-portal.md).

  If you don't have an existing logic app or infrastructure, you can use the linked sample Standard logic app projects to deploy an example logic app and infrastructure, based whether you want to use GitHub or Azure DevOps. For more information about the included sample projects and resources to run the example logic app, review [Deploy infrastructure resources](#deploy-infrastructure).

<a name="deploy-infrastructure"></a>

## Deploy infrastructure resources

To try the DevOps deployment experience without prior Standard logic app or infrastructure setup, use the following sample projects so you can set up deployment for an example Standard logic app and infrastructure, based whether you want to use GitHub or Azure DevOps:

- [GitHub sample for single-tenant Azure Logic Apps](https://github.com/Azure/logicapps/tree/master/github-sample)

  This sample includes an example Standard logic app project plus examples for Azure deployment and GitHub Actions.

- [Azure DevOps sample for single-tenant Azure Logic Apps](https://github.com/Azure/logicapps/tree/master/azure-devops-sample)

  This sample includes an example Standard logic app project plus examples for Azure deployment and Azure Pipelines.

Both samples include the following resources that a Standard logic app uses to run:

| Resource name | Required | Description |
|---------------|----------|-------------|
| Standard logic app | Yes | This Azure resource contains the workflows that run in single-tenant Azure Logic Apps. <br><br>**Important**: In your logic app project, each workflow has a **workflow.json** file that contains the workflow definition, which includes the trigger and action definitions. |
| API connections | Yes, if API connections exist | These Azure resources define any managed API connections that your workflows use to run managed connector operations, such as Office 365, SharePoint, and so on. <br><br>**Important**: In your logic app project, the **connections.json** file contains metadata, endpoints, and keys for any managed API connections and Azure functions that your workflows use. To use different connections and functions in each environment, make sure that you parameterize the **connections.json** file and update the endpoints. <br><br>For more information, review [API connection resources and access policies](#api-connection-resources). |
| Functions Premium or App Service hosting plan | Yes | This Azure resource specifies the hosting resources to use for running your logic app, such as compute, processing, storage, networking, and so on. <br><br>**Important**: In the current experience, the Standard logic app resource requires the [**Workflow Standard** hosting plan](logic-apps-pricing.md#standard-pricing), which is based on the Azure Functions Premium hosting plan. |
| Azure storage account | Yes, for both stateful and stateless workflows | This Azure resource stores the metadata, keys for access control, state, inputs, outputs, run history, and other information about your workflows. |
| Application Insights | Optional | This Azure resource provides monitoring capabilities for your workflows. |
| Azure Resource Manager (ARM) template | Optional | This Azure resource defines a baseline infrastructure deployment that you can reuse or [export](../azure-resource-manager/templates/template-tutorial-export-template.md). |

<a name="api-connection-resources"></a>

## API connection resources and access policies

In single-tenant Azure Logic Apps, every managed API connection resource in your workflow requires an associated access policy. This policy needs your logic app's identity to provide the correct permissions for accessing the managed connector infrastructure. The included sample projects include an ARM template that includes all the necessary infrastructure resources, including these access policies.

For example, the following diagram shows the dependencies between a Standard logic app project and infrastructure resources:

![Conceptual diagram shows infrastructure dependencies for Standard logic app project in the single-tenant Azure Logic Apps model.](./media/set-up-devops-deployment-single-tenant-azure-logic-apps/infrastructure-dependencies.png)

<a name="download-artifacts"></a>

## Download Standard logic app artifacts from portal

If your Standard logic app is in the Azure portal, you can download a zip file that contains your logic app's artifact files, including **workflow.json**, **connections.json**, **host.json**, and **local.settings.json**. 

1. In the [Azure portal](https://portal.azure.com), find and open your Standard logic app resource.

1. On the logic app menu, select **Overview**.

1. On the **Overview** toolbar, select **Download app content**. In the confirmation box that appears, select **Download**.

1. When the prompt appears, select **Save as**, browse to the local folder that you want, and select **Save** to save the zip file.

1. Extract the zip file.

1. In Visual Studio Code, open the folder that contains the unzipped files.

   When you open the folder, Visual Studio Code automatically creates a [workspace](https://code.visualstudio.com/docs/editor/workspaces).

1. Edit the folder's contents to include only the folders and files required for deployment using DevOps.

1. When you finish, save your changes.

<a name="deploy-logic-app-resources"></a>  

## Build and deploy logic app (zip deploy)

You can set up build and release pipelines either inside or outside Azure that deploy Standard logic apps to your infrastructure.

### Build your project

1. Push your Standard logic app project and artifact files to your source repository, for example, either GitHub or Azure DevOps.

1. Set up a build pipeline based on your logic app project type by completing the following corresponding actions:

   | Project type | Description and steps |
   |--------------|-----------------------|
   | Nuget-based | The NuGet-based project structure is based on the .NET Framework. To build these projects, make sure to follow the build steps for .NET Standard. For more information, review the documentation for [Create a NuGet package using MSBuild](/nuget/create-packages/creating-a-package-msbuild). |
   | Bundle-based | The extension bundle-based project isn't language-specific and doesn't require any language-specific build steps. |

1. Zip your project files using any method that you want.

   > [!IMPORTANT]
   >
   > Make sure that your zip file contains your project's actual build artifacts at the root level, 
   > including all workflow folders, configuration files such as **host.json**, **connections.json**, 
   > **local.settings.json**, and any other related files. Don't add any extra folders nor put any 
   > artifacts into folders that don't already exist in your project structure. 
   >
   > For example, the following list shows an example **MyBuildArtifacts.zip** file structure:
   >
   > ```
   > MyStatefulWorkflow1-Folder
   > MyStatefulWorkflow2-Folder
   > connections.json
   > host.json
   > local.settings.json
   > ```

### Before you release to Azure

The managed API connections inside your logic app project's **connections.json** file are created specifically for local use in Visual Studio Code. Before you can release your project artifacts from Visual Studio Code to Azure, you have to update these artifacts. To use the managed API connections in Azure, you have to update their authentication methods so that they're in the correct format to use in Azure.

#### Update authentication type

For each managed API connection that uses authentication, you have to update the **`authentication`** object from the local format in Visual Studio Code to the Azure portal format, as shown by the first and second code examples, respectively:

**Visual Studio Code format**

```json
{
   "managedApiConnections": {
      "sql": {
         "api": {
            "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Web/locations/westus/managedApis/sql"
         },
         "connection": {
            "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/ase/providers/Microsoft.Web/connections/sql-2"
         },
         "connectionRuntimeUrl": "https://xxxxxxxxxxxxxx.01.common.logic-westus.azure-apihub.net/apim/sql/xxxxxxxxxxxxxxxxxxxxxxxxx/",
         "authentication": {
            "type": "Raw",
            "scheme": "Key",
            "parameter": "@appsetting('sql-connectionKey')"
         }
      }
   }
}
```

**Azure portal format**

```json
{
   "managedApiConnections": {
      "sql": {
         "api": {
            "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Web/locations/westus/managedApis/sql"
         },
         "connection": {
            "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/ase/providers/Microsoft.Web/connections/sql-2"
         },
         "connectionRuntimeUrl": "https://xxxxxxxxxxxxxx.01.common.logic-westus.azure-apihub.net/apim/sql/xxxxxxxxxxxxxxxxxxxxxxxxx/",
         "authentication": {
            "type": "ManagedServiceIdentity"
         }
      }
   }
}
```

#### Create API connections as needed

If you're deploying your Standard logic app to an Azure region or subscription different from your local development environment, you must also make sure to create these managed API connections before deployment. Azure Resource Manager template (ARM template) deployment is the easiest way to create managed API connections.
  
The following example shows a SQL managed API connection resource definition in an ARM template:

```json
{
   "type": "Microsoft.Web/connections",
   "apiVersion": "2016–06–01",
   "location": "[parameters('location')]",
   "name": "[parameters('connectionName')]",
   "properties": {
      "displayName": "sqltestconnector",
      "api": {
         "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Web/locations/{Azure-region-location}/managedApis/sql"
      },
      "parameterValues": {
         "authType": "windows", 
         "database": "TestDB",
         "password": "TestPassword",
         "server": "TestServer",
         "username": "TestUserName"
      }
   }
}
```

To find the required values for the **`properties`** object so that you can complete the connection resource definition, use the following API for a specific connector:

`GET https://management.azure.com/subscriptions/{Azure-subscription-ID}/providers/Microsoft.Web/locations/{Azure-region-location}/managedApis/{connector-name}?api-version=2016-06-01`

In the response, find the **`connectionParameters`** object, which contains the necessary information to complete the resource definition for that specific connector. The following example shows an example resource definition for a SQL managed connection:

```json
{
   "type": "Microsoft.Web/connections",
   "apiVersion": "2016–06–01",
   "location": "[parameters('location')]",
   "name": "[parameters('connectionName')]",
   "properties": {
      "displayName": "sqltestconnector",
      "api": {
         "id": "/subscriptions/{Azure-subscription-ID}/providers/Microsoft.Web/locations/{Azure-region-location}/managedApis/sql"
      },
      "parameterValues": {
         "authType": "windows",
         "database": "TestDB",
         "password": "TestPassword",
         "server": "TestServer",
         "username": "TestUserName"
      }
   }
}
```

As an alternative, you can capture and review the network trace for when you create a connection using the workflow designer in Azure Logic Apps. Find the **`PUT`** call that is sent to the managed connector's API as previously described, and review the request body for all the necessary information.

#### On-premises data gateway resource definition

If your connection uses an on-premises data gateway resource, this resource definition exists separately from the connector resource definition. To view the data gateway's resource definition, see [Automate deployment for Azure Logic Apps by using Azure Resource Manager templates](logic-apps-azure-resource-manager-templates-overview.md#data-gateway-resource-definitions) and [Microsoft.Web connectionGateways](/azure/templates/microsoft.web/connectiongateways?pivots=deployment-language-arm-template#connectiongatewayreference-1).

### Release to Azure

To set up a release pipeline that deploys to Azure, follow the associated steps for GitHub, Azure DevOps, or Azure CLI.

#### [GitHub](#tab/github)

For GitHub deployments, you can deploy your logic app by using [GitHub Actions](https://docs.github.com/actions), for example, the GitHub Actions in Azure Functions. This action requires that you pass through the following information:

- The logic app name to use for deployment
- The zip file that contains your actual build artifacts, including all workflow folders, configuration files such as **host.json**, **connections.json**, **local.settings.json**, and any other related files.
- Your [publish profile](../azure-functions/functions-how-to-github-actions.md#generate-deployment-credentials), which is used for authentication

```yaml
- name: 'Run Azure Functions Action'
  uses: Azure/functions-action@v1
  id: fa
  with:
   app-name: 'MyLogicAppName'
   package: 'MyBuildArtifact.zip'
   publish-profile: 'MyLogicAppPublishProfile'
```

For more information, review [Continuous delivery by using GitHub Action](../azure-functions/functions-how-to-github-actions.md).

### [Azure DevOps](#tab/azure-devops)

For Azure DevOps deployments, you can deploy your logic app by using the [Azure Function App Deploy task](/azure/devops/pipelines/tasks/deploy/azure-function-app?view=azure-devops&preserve-view=true) in Azure Pipelines. This action requires that you pass through the following information:

- The logic app name to use for deployment
- The zip file that contains your actual build artifacts, including all workflow folders, configuration files such as **host.json**, **connections.json**, **local.settings.json**, and any other related files.
- Your [publish profile](../azure-functions/functions-how-to-github-actions.md#generate-deployment-credentials), which is used for authentication

```yaml
- task: AzureFunctionApp@1
  displayName: 'Deploy logic app workflows'
  inputs:
     azureSubscription: 'MyServiceConnection'
     appType: 'functionAppLinux' ## Default: functionApp 
     appName: 'MyLogicAppName'
     package: 'MyBuildArtifact.zip'
     deploymentMethod: 'zipDeploy'
```

For more information, review [Deploy an Azure Function using Azure Pipelines](/azure/devops/pipelines/targets/azure-functions-windows).

#### [Azure CLI](#tab/azure-cli)

If you use other deployment tools, you can deploy your Standard logic app by using the Azure CLI. Before you start, you need the following items:

- The latest Azure CLI extension installed on your local computer.

  - If you're not sure that you have the latest version, [check your environment and CLI version](#check-environment-cli-version).

  - If you don't have the Azure CLI extension, [install the extension by following the installation guide for your operating system or platform](/cli/azure/install-azure-cli).

    > [!NOTE]
    > 
    > If you get a **pip** error when you try to install the Azure CLI, make sure that you 
    > have the standard package installer for Python (PIP). This package manager is written 
    > in Python and is used to install software packages. For more information, see 
    > [Check "pip" installation and version](#check-pip-version).

- The *preview* single-tenant **Azure Logic Apps (Standard)** extension for Azure CLI.

  If you don't have this extension, [install the extension](#install-logic-apps-cli-extension). Although the single-tenant Azure Logic Apps service is already generally available, the single-tenant Azure Logic Apps extension for Azure CLI is still in preview.

- An Azure resource group to use for deploying your logic app project to Azure.

  If you don't have this resource group, [create the resource group](#create-resource-group).

- An Azure storage account to use with your logic app for data and run history retention.

  If you don't have this storage account, [create a storage account](/cli/azure/storage/account#az-storage-account-create).

<a name="check-pip-version"></a>

##### Check pip installation

1. On a Windows or Mac operating system, open a command prompt, and enter the following command:

   `python -m pip --version`

   - If you get a **pip** version, then **pip** is installed. Make sure that you have the most recent version by using the following command:

     `python -m pip install --upgrade pip`

   - If you get errors instead, then **pip** isn't installed or added to your **PATH** environment.

1. To install **pip**, [follow the **pip** installation steps for your operating system](https://pip.pypa.io/en/latest/installation/).

<a name="check-environment-cli-version"></a>

##### Check environment and CLI version

1. Sign in to the [Azure portal](https://portal.azure.com). In a terminal or command window, confirm that your subscription is active by running the command, [**`az login`**](/cli/azure/authenticate-azure-cli):

   ```azurecli
   az login
   ```

1. In the terminal or command window, check your version of the Azure CLI version by running the command, **`az`**, with the following required parameter:

   ```azurecli
   az --version
   ```

1. If you don't have the latest Azure CLI version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

   For more information about the latest version, review the [most recent release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli). For troubleshooting guidance, see the following resources:

   - [Azure CLI GitHub issues](https://github.com/Azure/azure-cli/issues)
   - [Azure CLI documentation](/cli/azure/)

<a name="install-logic-apps-cli-extension"></a>

##### Install Azure Logic Apps (Standard) extension for Azure CLI

Currently, only the *preview* version for this extension is available. If you didn't install this extension yet, run the command, **`az extension add`**, with the following required parameters:

```azurecli
az extension add --yes --source "https://aka.ms/logicapp-latest-py2.py3-none-any.whl"
```

To get the latest extension, which is version 0.1.2, run these commands to remove the existing extension and then install the latest version from the source:

```azurecli
az extension remove --name logicapp
az extension add --yes --source "https://aka.ms/logicapp-latest-py2.py3-none-any.whl"
```

> [!NOTE]
>
> If a new extension version is available, the current and later versions show a message. 
> While this extension is in preview, you can use the following command to upgrade to the 
> latest version without manually removing and installing again:
>
> `az logicapp upgrade`

<a name="create-resource-group"></a>

##### Create resource group

If you don't have an existing Azure resource group to use for deployment, create the group by running the command, **`az group create`**. Unless you already set a default subscription for your Azure account, make sure to use the **`--subscription`** parameter with your subscription name or identifier. Otherwise, you don't have to use the **`--subscription`** parameter.

> [!TIP]
>
> To set a default subscription, run the following command, and replace 
> **`MySubscription`** with your subscription name or identifier.
>
> `az account set --subscription MySubscription`

For example, the following command creates a resource group named **`MyResourceGroupName`** using the Azure subscription named **`MySubscription`** in the location **`eastus`**:

```azurecli
az group create --name MyResourceGroupName 
   --subscription MySubscription 
   --location eastus
```

If your resource group is successfully created, the output shows the **`provisioningState`** as **`Succeeded`**:

```output
<...>
   "name": "testResourceGroup",
   "properties": {
      "provisioningState": "Succeeded"
    },
<...>
```

<a name="deploy-logic-app"></a>

##### Deploy logic app

Now, you can deploy your zipped artifacts to the Azure resource group that you created.

Run the command, **`az logicapp deployment`**, with the following required parameters:

```azurecli
az logicapp deployment source config-zip --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --src MyBuildArtifact.zip
```

---

## After deployment to Azure

Each API connection has access policies. After the zip deployment completes, you must open your Standard logic app resource in the Azure portal, and create access policies for each API connection to set up permissions for the deployed logic app. The zip deployment doesn't create app settings for you. After deployment, you must create these app settings based on the **local.settings.json** file in your logic app project.

## Related content

- [DevOps deployment for single-tenant Azure Logic Apps](devops-deployment-single-tenant-azure-logic-apps.md)

We'd like to hear about your experiences with the single-tenant Azure Logic Apps!

- For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
- For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/logicappsdevops).
