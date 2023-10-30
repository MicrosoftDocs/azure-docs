---
title: Create and deploy workflows with Azure Arc-enabled Logic Apps
description: Create and deploy single-tenant based logic app workflows that run anywhere that Kubernetes can run.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2022
ms.custom: ignite-fall-2021, devx-track-azurecli
#Customer intent: As a developer, I want to learn how to create and deploy automated Logic Apps workflows that can run anywhere that Kubernetes can run.
---

# Create and deploy single-tenant based logic app workflows with Azure Arc-enabled Logic Apps (Preview)

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

With Azure Arc-enabled Logic Apps and the Azure portal, you can create and deploy single-tenant based logic app workflows to a Kubernetes infrastructure that you operate and manage. Your logic apps run in a *custom location* that's mapped to an Azure Arc-enabled Kubernetes cluster where you have installed and enabled the Azure App Service platform extensions bundle.

For example, this cluster can be Azure Kubernetes Service, bare-metal Kubernetes, or another setup. The extensions bundle enables you to run platform services such as Azure Logic Apps, Azure App Service, and Azure Functions on your Kubernetes cluster. 

For more information, review the following documentation:

- [What is Azure Arc-enabled Logic Apps?](azure-arc-enabled-logic-apps-overview.md)
- [Single-tenant versus multi-tenant and integration service environment](../logic-apps/single-tenant-overview-compare.md)
- [Azure Arc overview](../azure-arc/overview.md)
- [Azure Kubernetes Service overview](../aks/intro-kubernetes.md)
- [What is Azure Arc-enabled Kubernetes?](../azure-arc/kubernetes/overview.md)
- [Custom locations on Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/conceptual-custom-locations.md)
- [App Service, Functions, and Logic Apps on Azure Arc (Preview)](../app-service/overview-arc-integration.md)
- [Set up an Azure Arc-enabled Kubernetes cluster to run App Service, Functions, and Logic Apps (Preview)](../app-service/manage-create-arc-environment.md)

## Prerequisites

This section describes the common prerequisites across all the approaches and tools that you can use to create and deploy your logic app workflows. Tool-specific prerequisites appear along with their corresponding steps.

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Kubernetes environment with an Azure Arc-enabled Kubernetes cluster and *custom location* where you can host and run Azure Logic Apps, Azure App Service, and Azure Functions.

  > [!IMPORTANT]
  > Make sure that you use the same resource location for your Kubernetes environment, custom location, and logic app.

  When you create the App Service bundle extension on your Kubernetes cluster, you can [change the default scaling behavior](#change-scaling) for running your logic app workflows. When you create the extension by using the Azure CLI command, [**`az k8s-extension create`**](/cli/azure/k8s-extension), make sure to include the configuration setting, `keda.enabled=true`:

  `az k8s-extension create {other-command-options} --configuration-settings "keda.enabled=true"`

  For more information, review the following documentation:

  - [App Service, Functions, and Logic Apps on Azure Arc (Preview)](../app-service/overview-arc-integration.md)
  - [Cluster extensions on Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/conceptual-extensions.md)
  - [Set up an Azure Arc-enabled Kubernetes cluster to run App Service, Functions, and Logic Apps (Preview)](../app-service/manage-create-arc-environment.md)
  - [Change the default scaling behavior](#change-scaling)

- Your own Microsoft Entra identity

  If your workflows need to use any Azure-hosted connections, such as Office 365 Outlook or Azure Storage, your logic app must use a Microsoft Entra identity for authentication. Azure Arc-enabled Logic Apps can run on any infrastructure but requires an identity that has permissions to use Azure-hosted connections. To set up this identity, create an app registration in Microsoft Entra ID that your logic app uses as the required identity.

  > [!NOTE]
  > Managed identity support is currently unavailable for Azure Arc-enabled Logic Apps.

  To create a Microsoft Entra app registration using the Azure CLI, follow these steps:

  1. Create an app registration by using the [`az ad sp create`](/cli/azure/ad/sp#az-ad-sp-create) command.

  1. To review all the details, run the [`az ad sp show`](/cli/azure/ad/sp#az-ad-sp-show) command.

  1. From the output of both commands, find and save the client ID, object ID, tenant ID, and client secret values, which you need to keep for later use.

  To create a Microsoft Entra app registration using the Azure portal, follow these steps:

  1. Create a new Microsoft Entra app registration by using the [Azure portal](../active-directory/develop/quickstart-register-app.md).

  1. After creation finishes, find the new app registration in the portal.

  1. On the registration menu, select **Overview**, and save the client ID, tenant ID, and client secret values.

  1. To find the object ID, next to the **Managed application in local directory** field, select the name for your app registration. From the properties view, copy the object ID.

## Create and deploy logic apps

Based on whether you want to use Azure CLI, Visual Studio Code, or the Azure portal, select the matching tab to review the specific prerequisites and steps.

### [Azure CLI](#tab/azure-cli)

Before you start, you need to have the following items:

- The latest Azure CLI extension installed on your local computer.

  - If you don't have this extension, review the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

  - If you're not sure that you have the latest version, follow the [steps to check your environment and CLI version](#check-environment-cli-version).

- The *preview* Azure Logic Apps (Standard) extension for Azure CLI.

  Although single-tenant Azure Logic Apps is generally available, the Azure Logic Apps extension is still in preview.

- An [Azure resource group](#create-resource-group) for where to create your logic app.

  If you don't have this resource group, follow the [steps to create the resource group](#create-resource-group).

- An Azure storage account to use with your logic app for data and run history retention.

  If you don't have this storage account, you can create this account when you create your logic app, or you can follow the [steps to create a storage account](/cli/azure/storage/account#az-storage-account-create).

<a name="check-environment-cli-version"></a>

#### Check environment and CLI version

1. Sign in to the Azure portal. Check that your subscription is active by running the following command:

   ```azurecli-interactive
   az login
   ```

1. Check your version of the Azure CLI in a terminal or command window by running the following command:

   ```azurecli-interactive
   az --version
   ```

   For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).

1. If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

<a name="install-logic-apps-cli-extension"></a>

##### Install Azure Logic Apps (Standard) extension for Azure CLI

Install the *preview* single-tenant Azure Logic Apps (Standard) extension for Azure CLI by running the following command:

```azurecli-interactive
az extension add --yes --source "https://aka.ms/logicapp-latest-py2.py3-none-any.whl"
```

<a name="create-resource-group"></a>

#### Create resource group

If you don't already have a resource group for your logic app, create the group by running the command, `az group create`. Unless you already set a default subscription for your Azure account, make sure to use the `--subscription` parameter with your subscription name or identifier. Otherwise, you don't have to use the `--subscription` parameter.

> [!TIP]
> To set a default subscription, run the following command, and replace `MySubscription` with your subscription name or identifier.
>
> `az account set --subscription MySubscription`

For example, the following command creates a resource group named `MyResourceGroupName` using the Azure subscription named `MySubscription` in the location `eastus`:

```azurecli
az group create --name MyResourceGroupName 
   --subscription MySubscription 
   --location eastus
```

If your resource group is successfully created, the output shows the `provisioningState` as `Succeeded`:

```output
<...>
   "name": "testResourceGroup",
   "properties": {
      "provisioningState": "Succeeded"
    },
<...>
```

#### Create logic app

To create an Azure Arc-enabled logic app, run the command, `az logicapp create`, with the following required parameters. The resource locations for your logic app, custom location, and Kubernetes environment must all be the same.

| Parameters | Description |
|------------|-------------|
| `--name -n` | A unique name for your logic app |
| `--resource-group -g` | The name of the [resource group](../azure-resource-manager/management/manage-resource-groups-cli.md) where you want to create your logic app. If you don't have one to use, [create a resource group](#create-resource-group). |
| `--storage-account -s` | The [storage account](/cli/azure/storage/account) to use with your logic app. For storage accounts in the same resource group, use a string value. For storage accounts in a different resource group, use a resource ID. |
|||

```azurecli
az logicapp create --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --storage-account MyStorageAccount --custom-location MyCustomLocation
```

To create an Azure Arc-enabled logic app using a private Azure Container Registry (ACR) image, run the command, `az logicapp create`, with the following required parameters:

```azurecli
az logicapp create --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --storage-account MyStorageAccount --custom-location MyCustomLocation 
   --deployment-container-image-name myacr.azurecr.io/myimage:tag
   --docker-registry-server-password MyPassword 
   --docker-registry-server-user MyUsername
```

#### Show logic app details

To show details about your Azure Arc-enabled logic app, run the command, `az logicapp show`, with the following required parameters:

```azurecli
az logicapp show --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
```

#### Deploy logic app

To deploy your Azure Arc-enabled logic app using [Azure App Service's Kudu zip deployment](../app-service/resources-kudu.md), run the command, `az logicapp deployment source config-zip`, with the following required parameters:

> [!IMPORTANT]
> Make sure that your zip file contains your project's artifacts at the root level. These artifacts include all workflow folders, 
> configuration files such as host.json, connections.json, and any other related files. Don't add any extra folders nor put any artifacts 
> into folders that don't already exist in your project structure. For example, this list shows an example MyBuildArtifacts.zip file structure:
>
> ```output
> MyStatefulWorkflow1-Folder
> MyStatefulWorkflow2-Folder
> connections.json
> host.json
> ```

```azurecli
az logicapp deployment source config-zip --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --src MyBuildArtifact.zip
```

#### Start logic app

To start your Azure Arc-enabled logic app, run the command, `az logicapp start`, with the following required parameters:

```azurecli
az logicapp start --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
```

#### Stop logic app

To stop your Azure Arc-enabled logic app, run the command, `az logicapp stop`, with the following required parameters:

```azurecli
az logicapp stop --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
```

#### Restart logic app

To restart your Azure Arc-enabled logic app, run the command, `az logicapp restart`, with the following required parameters:

```azurecli
az logicapp restart --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
```

#### Delete logic app

To delete your Azure Arc-enabled logic app, run the command, `az logicapp delete`, with the following required parameters:

```azurecli
az logicapp delete --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
```

### [Visual Studio Code](#tab/visual-studio-code)

You can create, deploy, and monitor your logic app workflows from end to end in Visual Studio Code. There is no change or difference in the designer experience between developing logic app workflows that run in single-tenant Azure Logic Apps versus Azure Arc-enabled Logic Apps.

1. To create a logic app project, follow the prerequisites and steps in the [Create integration workflows in single-tenant Azure Logic Apps with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md) documentation.

1. When you're ready to deploy to Azure, use the **Deploy to Logic App** experience to create your logic app resource in your previously created custom location and deploying your workflows to the same location.

   1. From a blank area in your logic app project's window, open the shortcut menu, and select **Deploy to Logic App**.

   1. Select the Azure subscription that's associated with your custom location.

   1. To create a new Azure Arc-enabled Logic Apps resource, select **Create new Logic App in Azure (Advanced)**. Or, you can select an existing logic app resource from the list and skip the next steps.

   1. Provide a globally unique name for your logic app.

   1. Select the custom location for the Azure Arc-enabled Kubernetes environment to where you want to deploy. If you select a generic Azure region instead, you create a non-Azure Arc-enabled logic app resource that runs in single-tenant Azure Logic Apps.

   1. Select or create a new resource group to where you want to deploy the logic app.

   1. Select or create a new storage account for saving your logic app's state and metadata.

   1. Select or create a new Application Insights resource for storing application logs for your logic app.

   1. If you haven't done so, set up your Microsoft Entra identity so that your logic app can authenticate managed API connections. For more information, see the top-level [Prerequisites](#prerequisites).

   1. Enter the client ID, tenant ID, object ID, and client secret for your Microsoft Entra identity.

      > [!NOTE]
      > You only have to complete this step once. Visual Studio Code updates your project's 
      > connections.json file and your managed API connections' access policies for you.

1. When you're done, your logic app is live and running in your Azure Arc-enabled Kubernetes cluster, ready for you to test.

### [Azure portal](#tab/azure-portal)

The portal-based designer's editing capability is currently under development for Azure Arc-enabled Logic Apps. You can create, deploy, and view your logic apps using the portal-based designer, but you can't edit them in the portal after deployment. For now, you can create and edit a logic app project locally in Visual Studio Code, and then deploy using Visual Studio Code, Azure CLI, or automated deployments.

1. In the Azure portal, [create a **Logic App (Standard)** resource](create-single-tenant-workflows-azure-portal.md). However, for the **Publish** destination, select **Docker Container**. For **Region**, select your previously created custom location as your app's location.

   By default, the **Logic App (Standard)** resource runs in single-tenant Azure Logic Apps. However, for Azure Arc-enabled Logic Apps, your logic app resource runs in the custom location that you created for your Kubernetes environment. Also, you don't need to create an App Service plan, which is created for you.

   > [!IMPORTANT]
   > The resource locations for your logic app, custom location, and Kubernetes environment must all be the same.

1. [Edit and deploy the logic app using Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

1. After you build and deploy your logic app, you can monitor and view your workflows as usual by using the portal or Application Insights.

   The portal experience for deployed logic apps is currently available in read-only mode, which means you can't change your workflows or app settings. However, you can still view run history, trigger history, and other information about your apps. For now, to update your logic apps, you can use the Azure CLI, Visual Studio Code, or automated deployments.

---

## Set up connection authentication

Currently, Azure Arc-enabled Kubernetes clusters don't support using a logic app's managed identity to authenticate managed API connections. You create these Azure-hosted and managed connections when you use managed connectors in your workflows.

Instead, you have to create your own app registration in Microsoft Entra ID. You can then use this app registration as an identity for logic apps deployed and running in Azure Arc-enabled Logic Apps. For more information, review the [top-level prerequisites](#prerequisites).

From your app registration, you need the client ID, object ID, tenant ID, and client secret. If you use Visual Studio Code to deploy, you have a built-in experience for setting up your logic app with a Microsoft Entra identity. For more information, review [Create and deploy logic app workflows - Visual Studio Code](#create-and-deploy-logic-apps).

However, if you use Visual Studio Code for development, but you use Azure CLI or automated pipelines to deploy, follow these steps.

### Configure connection and app settings in your project

1. In your logic app project's **connections.json** file, find the managed connection's `authentication` object. Replace this object's contents with your app registration information, which you previously generated in the [top-level prerequisites](#prerequisites):

   ```json
   "authentication": {
      "type": "ActiveDirectoryOAuth",
      "audience": "https://management.core.windows.net/",
      "credentialType": "Secret",
      "clientId": "@appsetting('WORKFLOWAPP_AAD_CLIENTID')",
      "tenant": "@appsetting('WORKFLOWAPP_AAD_TENANTID')",
      "secret": "@appsetting('WORKFLOWAPP_AAD_CLIENTSECRET')"
   } 
   ```

1. In your logic app project's **local.settings.json** file, add your client ID, object ID, tenant ID, and client secret. After deployment, these settings become your logic app settings.

   ```json
   {
      "IsEncrypted": false,
      "Values": {
         <...>
         "WORKFLOWAPP_AAD_CLIENTID":"<my-client-ID>",
         "WORKFLOWAPP_AAD_OBJECTID":"<my-object-ID",
         "WORKFLOWAPP_AAD_TENANTID":"<my-tenant-ID>",
         "WORKFLOWAPP_AAD_CLIENTSECRET":"<my-client-secret>"
      }
   }
   ```

> [!IMPORTANT]
> For production scenarios or environments, make sure that you protect and secure 
> such secrets and sensitive information, for example, by using a [key vault](../app-service/app-service-key-vault-references.md).

### Add access policies

In single-tenant Azure Logic Apps, each logic app has an identity that is granted permissions by access policies to use Azure-hosted and managed connections. You can set up these access policies by using the Azure portal or infrastructure deployments.

#### ARM template

In your Azure Resource Manager template (ARM template), include the following resource definition for *each* managed API connection and provide the following information:

| Parameter | Description |
|-----------|-------------|
| <*connection-name*> | The name for your managed API connection, for example `office365` |
| <*object-ID*> | The object ID for your Microsoft Entra identity, previously saved from your app registration |
| <*tenant-ID*> | The tenant ID for your Microsoft Entra identity, previously saved from your app registration |
|||

```json
{
   "type": "Microsoft.Web/connections/accessPolicies",
   "apiVersion": "2016-06-01",
   "name": "[concat('<connection-name>'),'/','<object-ID>')]",
   "location": "<location>",
   "dependsOn": [
      "[resourceId('Microsoft.Web/connections', parameters('connection_name'))]"
   ],
   "properties": {
      "principal": {
         "type": "ActiveDirectory",
         "identity": {
            "objectId": "<object-ID>",
            "tenantId": "<tenant-ID>"
         }
      }
   }
}
```

For more information, review the [Microsoft.Web/connections/accesspolicies (ARM template)](/azure/templates/microsoft.web/connections?tabs=json) documentation.

#### Azure portal

For this task, use your previously saved client ID as the *application ID*.

1. In the Azure portal, find and open your logic app. On your logic app's menu, under **Workflows**, select **Connections**, which lists all the connections in your logic app's workflows.

1. Under **API Connections**, select a connection, which is `office365` in this example.

1. On the connection's menu, under **Settings**, select **Access policies** > **Add**.

1. In the **Add access policy** pane, in the search box, find and select your previously saved client ID.

1. When you're done, select **Add**.

1. Repeat these steps for each Azure-hosted connection in your logic app.

## Automate DevOps deployment

To build and deploy your Azure Arc-enabled logic apps, you can use the same pipelines and processes as for [single-tenant based logic apps](single-tenant-overview-compare.md). To automate infrastructure deployments using pipelines for DevOps, make the following changes at the infrastructure level for both non-container and container deployments.

### Standard deployment (non-container)

If you use zip deploy for logic app deployment, you don't need to set up a Docker registry for hosting container images. Although logic apps on Kubernetes technically run on containers, Azure Arc-enabled Logic Apps manages these containers for you. For this scenario, complete the following tasks when you set up your infrastructure:

- Notify the resource provider that you are creating a logic app on Kubernetes.
- Include an App Service plan with your deployment. For more information, review [Include App Service plan with deployment](#include-app-service-plan).

In your [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md) include the following values:

| Item | JSON property | Description |
|------|---------------|-------------|
| Location | `location` | Make sure to use the same resource location (Azure region) as your custom location and Kubernetes environment. The resource locations for your logic app, custom location, and Kubernetes environment must all be the same. <p><p>**Note**: This value is not the same as the *name* for your custom location. |
| App kind | `kind` | The type of app that you're deploying so the Azure platform can identify your app. For Azure Logic Apps, this information looks like the following example: `kubernetes,functionapp,workflowapp,linux` |
| Extended Location | `extendedLocation` | This object requires the `"name"` of your *custom location* for your Kubernetes environment and must have the `"type"` set to `"CustomLocation"`. |
| Hosting plan resource ID | `serverFarmId` | The resource ID of the associated App Service plan, formatted as follows: <p><p>`"/subscriptions/{subscriptionID}/resourceGroups/{groupName}/providers/Microsoft.Web/serverfarms/{appServicePlanName}"` |
| Storage connection string | `AzureWebJobsStorage` | The connection string for your storage account <p><p>**Important**: You need to provide the connection string for your storage account in your ARM template. For production scenarios or environments, make sure that you protect and secure such secrets and sensitive information, for example, by using a key vault. |
||||

#### ARM template

The following example describes a sample Azure Arc-enabled Logic Apps resource definition that you can use in your ARM template. For more information, review the [Microsoft.Web/sites template format (JSON)](/azure/templates/microsoft.web/sites?tabs=json) documentation.

```json
{
   "type": "Microsoft.Web/sites",
   "apiVersion": "2020-12-01",
   "name": "[parameters('name')]",
   "location": "[parameters('location')]",
   "kind": "kubernetes,functionapp,workflowapp,linux",
   "extendedLocation": {
      "name": "[parameters('customLocationId')]",
      "type": "CustomLocation"
    },
   "properties": {
      "clientAffinityEnabled": false,
      "name": "[parameters('name')]",
      "serverFarmId": "<hosting-plan-ID>",
      "siteConfig": {
         "appSettings": [
            {
               "name": "FUNCTIONS_EXTENSION_VERSION",
               "value": "~3"
            },
            {
               "name": "FUNCTIONS_WORKER_RUNTIME",
               "value": "node"
            },
            {
               "name": "AzureWebJobsStorage",
               "value": "<storage-connection-string>"
            },
            {
               "name": "AzureFunctionsJobHost__extensionBundle__id",
               "value": "Microsoft.Azure.Functions.ExtensionBundle.Workflows"
            },
            {
               "name": "AzureFunctionsJobHost__extensionBundle__version",
               "value": "[1.*, 2.0.0)"
            },
            {
               "name": "APP_KIND",
               "value": "workflowapp"
            }
         ],
         "use32BitWorkerProcess": "[parameters('use32BitWorkerProcess')]",
         "linuxFxVersion": "Node|12"
      }
   }
}
```

### Container deployment

If you prefer to use container tools and deployment processes, you can containerize your logic apps and deploy them to Azure Arc-enabled Logic Apps. For this scenario, complete the following high-level tasks when you set up your infrastructure:

- Set up a Docker registry for hosting your container images.

- To containerize your logic app, add the following Dockerfile to your logic app project's root folder, and follow the steps for building and publishing an image to your Docker registry, for example, review [Tutorial: Build and deploy container images in the cloud with Azure Container Registry Tasks](../container-registry/container-registry-tutorial-quick-task.md).

  > [!NOTE]
  > If you [use SQL as your storage provider](set-up-sql-db-storage-single-tenant-standard-workflows.md), make sure that you use an Azure Functions image version 3.3.1 or later.

  ```text
  FROM mcr.microsoft.com/azure-functions/node:3.3.1
  ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
  AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
  FUNCTIONS_V2_COMPATIBILITY_MODE=true
  COPY . /home/site/wwwroot
  RUN cd /home/site/wwwroot
  ```

- Notify the resource provider that you are creating a logic app on Kubernetes.

- In your deployment template, point to the Docker registry and container image where you plan to deploy. Single-tenant Azure Logic Apps uses this information to get the container image from your Docker registry.

- Include an App Service plan with your deployment. For more information, review [Include App Service plan with deployment](#include-app-service-plan).

In your [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md), include the following values:

| Item | JSON property | Description |
|------|---------------|-------------|
| Location | `location` | Make sure to use the same resource location (Azure region) as your custom location and Kubernetes environment. The resource locations for your logic app, custom location, and Kubernetes environment must all be the same. <p><p>**Note**: This value is *not the same* as the *name* for your custom location. |
| App kind | `kind` | The type of app that you're deploying so the Azure platform can identify your app. For Azure Logic Apps, this information looks like the following example: `kubernetes,functionapp,workflowapp,container` |
| Extended Location | `extendedLocation` | This object requires the `"name"` of your *custom location* for your Kubernetes environment and must have `"type"` set to `"CustomLocation"`. |
| Container name | `linuxFxVersion` | The name for your container, formatted as follows: `DOCKER\|<container-name>` |
| Hosting plan resource ID | `serverFarmId` | The resource ID of the associated App Service plan, formatted as follows: <p><p>`"/subscriptions/{subscriptionID}/resourceGroups/{groupName}/providers/Microsoft.Web/serverfarms/{appServicePlanName}"` |
| Storage connection string | `AzureWebJobsStorage` | The connection string for your storage account <p><p>**Important**: When you deploy to a Docker container, you need to provide the connection string for your storage account in your ARM template. For production scenarios or environments, make sure that you protect and secure such secrets and sensitive information, for example, by using a key vault. |
||||

To reference your Docker registry and container image, include these values in your template:

| Item | JSON property | Description |
|------|---------------|-------------|
| Docker registry server URL | `DOCKER_REGISTRY_SERVER_URL` | The URL for the Docker registry server |
| Docker registry server | `DOCKER_REGISTRY_SERVER_USERNAME` | The username to access the Docker registry server |
| Docker registry server password | `DOCKER_REGISTRY_SERVER_PASSWORD` | The password to access the Docker registry server |
||||

#### ARM template

The following example describes a sample Azure Arc-enabled Logic Apps resource definition that you can use in your ARM template. For more information, review the [Microsoft.Web/sites template format (ARM template)](/azure/templates/microsoft.web/sites?tabs=json) documentation.

```json
{
   "type": "Microsoft.Web/sites",
   "apiVersion": "2020-12-01",
   "name": "[parameters('name')]",
   "location": "[parameters('location')]",
   "kind": " kubernetes,functionapp,workflowapp,container",
   "extendedLocation": {
      "name": "[parameters('customLocationId')]",
      "type": "CustomLocation"
    },
   "properties": {
      "name": "[parameters('name')]",
      "clientAffinityEnabled": false,
      "serverFarmId": "<hosting-plan-ID>",
      "siteConfig": {
         "appSettings": [
            {
               "name": "FUNCTIONS_EXTENSION_VERSION",
               "value": "~3"
            },
            {
               "name": "FUNCTIONS_WORKER_RUNTIME",
               "value": "node"
            },
            {
               "name": "AzureWebJobsStorage",
               "value": "<storage-connection-string>"
            },
            {
               "name": "AzureFunctionsJobHost__extensionBundle__id",
               "value": "Microsoft.Azure.Functions.ExtensionBundle.Workflows"
            },
            {
               "name": "AzureFunctionsJobHost__extensionBundle__version",
               "value": "[1.*, 2.0.0)"
            },
            {
               "name": "APP_KIND",
               "value": "workflowapp"
            }, 
            {
               "name": "DOCKER_REGISTRY_SERVER_URL",
               "value": "<docker-registry-server-URL>"
            },
            { 
               "name": "DOCKER_REGISTRY_SERVER_USERNAME",
               "value": "<docker-registry-server-username>"
            },
            {
               "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
               "value": "<docker-registry-server-password>"
            }
         ],
         "use32BitWorkerProcess": "[parameters('use32BitWorkerProcess')]",
         "linuxFxVersion": "DOCKER|<container-name>"
      }
   }
}
```

<a name="include-app-service-plan"></a>

### Include App Service plan with deployment

Whether you have a standard or container deployment, you have to include an App Service plan with your deployment. Although this plan becomes less relevant with a Kubernetes environment, both the standard and container deployments still require an App Service plan.

While other create options usually handle provisioning the Azure resource for this plan, if your deployments use "infrastructure-as-code" templates, you have to explicitly create the Azure resource for the plan. The hosting plan resource doesn't change, only the `sku` information.

In your [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md), include the following values:

| Item | JSON property | Description |
|------|---------------|-------------|
| Location | `location` | Make sure to use the same resource location (Azure region) as your custom location and Kubernetes environment. The resource locations for your logic app, custom location, and Kubernetes environment must all be the same. <p><p>**Note**: This value is not the same as the *name* for your custom location. |
| Kind | `kind` | The kind of app service plan being deployed which needs to be `kubernetes,linux` |
| Extended Location | `extendedLocation` | This object requires the `"name"` of your *custom location* for your Kubernetes environment and must have `"type"` set to `"CustomLocation"`. |
| Hosting plan name | `name` | The name for the App Service plan |
| Plan tier | `sku: tier` | The App Service plan tier, which is `K1` |
| Plan name | `sku: name` | The App Service plan name, which is `Kubernetes` |
||||

#### ARM template

The following example describes a sample App Service plan resource definition that you can use with your app deployment. For more information, review the [Microsoft.Web/serverfarms template format (ARM template)](/azure/templates/microsoft.web/serverfarms?tabs=json) documentation.

```json
{
   "type": "Microsoft.Web/serverfarms",
   "apiVersion": "2020-12-01",
   "location": "<location>",
   "name": "<hosting-plan-name>",
   "kind": "kubernetes,linux",
   "extendedLocation": {
      "name": "[parameters('customLocationId')]",
      "type": "CustomLocation"
   },
   "sku": {
      "tier": "Kubernetes",
      "name": "K1", 
      "capacity": 1
   },
   "properties": {
      "kubeEnvironmentProfile": {
         "id": "[parameters('kubeEnvironmentId')]"
      }
   }
}
```

<a name="change-scaling"></a>

## Change default scaling behavior

Azure Arc-enabled Logic Apps automatically manages scaling for your logic apps based on the number of *jobs* in the backend storage queue. However, you can change the default scaling behavior.

In a logic app, the workflow definition specifies the sequence of actions to run. Whenever a workflow run is triggered, the Azure Logic Apps runtime creates a *job* for each action type in the workflow definition. The runtime then organizes these jobs into a *job sequencer*. This sequencer orchestrates running the jobs for the workflow definition, but the underlying Azure Logic Apps job orchestration engine runs each job.

For stateful workflows, the job orchestration engine uses storage queue messages to schedule jobs in the job sequencers. Behind the scenes, *job dispatchers* (or *dispatcher worker instances*) monitor these job queues. The orchestration engine uses a default minimum and maximum number of worker instances to monitor the job queues. For stateless workflows, the orchestration engine completely keeps action states in memory.

To change the default scaling behavior, you specify different minimum and maximum numbers of worker instances that monitor the job queues.

### Prerequisites to change scaling

On your Azure Arc-enabled Kubernetes cluster, your previously created App Service bundle extension must have the `keda.enabled` property set to `true`. For more information, review the [top-level prerequisites](#prerequisites).

### Change scaling threshold

In Azure Arc-enabled Logic Apps, the length of the job queue triggers a scale event and sets a threshold for how often scaling happens for your logic app. You can change the queue length, which has the default value set to `20` jobs. To scale less often, increase the queue length. To scale more often, decrease the queue length. This process might require some trial and error.

To change the queue length, in your logic app project's root-level **host.json** file, set the `Runtime.ScaleMonitor.KEDA.TargetQueueLength` property, for example:

```json
"extensions": {
   "workflow": {
      "settings": {
         "Runtime.ScaleMonitor.KEDA.TargetQueueLength": "10"
      }
   }
}
```

### Change throughput maximum

On an existing logic app resource, you can change the maximum number of worker instances, which has the default value set to `2`. This value controls the upper limit on how many worker instances can monitor the job queues.

To change this maximum, use the Azure CLI (logic app create only) and Azure portal.

#### Azure CLI

To create a new logic app, run the command, `az logicapp create`, with the following parameters:

```azurecli
az logicapp create --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --storage-account MyStorageAccount --custom-location MyCustomLocation 
   [--plan MyHostingPlan] [--min-worker-count 1] [--max-worker-count 4]
```

To configure your maximum instance count, use the `--settings` parameter:

```azurecli
az logicapp config appsettings set --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
   --settings "K8SE_APP_MAX_INSTANCE_COUNT=10"
```

#### Azure portal

In your single-tenant based logic app's settings, add or edit the `K8SE_APP_MAX_INSTANCE_COUNT` setting value by following these steps:

1. In the Azure portal, find and open your single-tenant based logic app.

1. On the logic app menu, under **Settings**, select **Configuration**.

1. In the **Configuration** pane, under **Application settings**, either add a new application setting or edit the existing value, if already added.

   1. Select **New application setting**, and add the `K8SE_APP_MAX_INSTANCE_COUNT` setting with the maximum value you want.

   1. Edit the existing value for the `K8SE_APP_MAX_INSTANCE_COUNT` setting.

1. When you're done, save your changes.

### Change throughput minimum

On an existing logic app resource, you can change the minimum number of worker instances, which has the default value set to `1`. This value controls the lower limit on how many worker instances can monitor the job queues. For high availability or performance, increase this value.

To change this minimum, use the Azure CLI or the Azure portal.

#### Azure CLI

For a existing logic app resource, run the command, `az logicapp scale`, with the following parameters:

```azurecli
az logicapp scale --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --instance-count 5 
```

To create a new logic app, run the command, `az logicapp create`, with the following parameters:

```azurecli
az logicapp create --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --storage-account MyStorageAccount --custom-location MyCustomLocation 
   [--plan MyHostingPlan] [--min-worker-count 2] [--max-worker-count 4]
```

#### Azure portal

In your single-tenant based logic app's settings, change the **Scale out** property value by following these steps:

1. In the Azure portal, find and open your single-tenant based logic app.

1. On the logic app menu, under **Settings**, select **Scale out**.

1. On the **Scale out** pane, drag the minimum instances slider to the value that you want.

1. When you're done, save your changes.

## Troubleshoot problems

To get more information about your deployed logic apps, try the following options:

### Access app settings and configuration

To access your app settings, run the command, `az logicapp config appsettings`, with the following parameters:

```azurecli
az logicapp config appsettings list --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
```

To configure an app setting, run the command, `az logicapp config appsettings set`, with the following parameters. Make sure to use the `--settings` parameter with your setting's name and value.

```azurecli
az logicapp config appsettings set --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription 
   --settings "MySetting=1"
```

To delete an app setting, run the command, `az logicapp config appsettings delete`, with the following parameters. Make sure to use the `--setting-names` parameter with the name of the setting you want to delete.

```azurecli
az logicapp config appsettings delete --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
   --setting-names MySetting
```

### View logic app properties

To view your app's information and properties, run the command, `az logicapp show`, with the following parameters:

```azurecli
az logicapp show --name MyLogicAppName 
   --resource-group MyResourceGroupName --subscription MySubscription
```

### Monitor workflow activity

To view the activity for a workflow in your logic app, follow these steps: 

1. In the Azure portal, find and open your deployed logic app.

1. On the logic app menu, select **Workflows**, and then select your workflow. 

1. On the workflow menu, select **Monitor**.

### Collect logs

To get logged data about your logic app, enable Application Insights on your logic app if not already enabled.

## Next steps

- [About Azure Arc-enabled Logic Apps](azure-arc-enabled-logic-apps-overview.md)
