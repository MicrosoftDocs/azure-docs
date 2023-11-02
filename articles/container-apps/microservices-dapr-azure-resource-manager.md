---
title: "Tutorial: Deploy a Dapr application to Azure Container Apps with an Azure Resource Manager or Bicep template"
description: Deploy a Dapr application to Azure Container Apps with an Azure Resource Manager or Bicep template.
services: container-apps
author: asw101
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/29/2022
ms.author: cshoe
ms.custom: ignite-2022, devx-track-bicep, devx-track-arm-template, devx-track-azurepowershell
zone_pivot_groups: container-apps
---

# Tutorial: Deploy a Dapr application to Azure Container Apps with an Azure Resource Manager or Bicep template

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps you build resilient stateless and stateful microservices. In this tutorial, a sample Dapr solution is deployed to Azure Container Apps via an Azure Resource Manager (ARM) or Bicep template.

You learn how to:

> [!div class="checklist"]
>
> - Create an Azure Blob Storage for use as a Dapr state store
> - Deploy a Container Apps environment to host container apps
> - Deploy two dapr-enabled container apps: one that produces orders and one that consumes orders and stores them
> - Assign a user-assigned identity to a container app and supply it with the appropiate role assignment to authenticate to the Dapr state store
> - Verify the interaction between the two microservices.

With Azure Container Apps, you get a [fully managed version of the Dapr APIs](./dapr-overview.md) when building microservices. When you use Dapr in Azure Container Apps, you can enable sidecars to run next to your microservices that provide a rich set of capabilities.

In this tutorial, you deploy the solution from the Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/tutorials/hello-world) quickstart.

The application consists of:

- A client (Python) container app to generate messages.
- A service (Node) container app to consume and persist those messages in a state store

The following architecture diagram illustrates the components that make up this tutorial:

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

## Prerequisites

- Install [Azure CLI](/cli/azure/install-azure-cli)
- Install [Git](https://git-scm.com/downloads)

::: zone pivot="container-apps-bicep"

- [Bicep](../azure-resource-manager/bicep/install.md)

::: zone-end

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub Account. If you don't already have one, sign up for [free](https://github.com/join).

## Setup

First, sign in to Azure.

# [Bash](#tab/bash)

```azurecli
az login
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

---

# [Bash](#tab/bash)

Ensure you're running the latest version of the CLI via the upgrade command and then install the Azure Container Apps extension for the Azure CLI.

```azurecli
az upgrade

az extension add --name containerapp --upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

You must have the latest `az` module installed. Ignore any warnings about modules currently in use.

```azurepowershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
```

Now install the Az.App module.

```azurepowershell
Install-Module -Name Az.App
```

---

Now that the current extension or module is installed, register the `Microsoft.App` namespace.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.App
```

---

Next, set the following environment variables:

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="centralus"
CONTAINERAPPS_ENVIRONMENT="my-environment"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$ResourceGroupName = 'my-container-apps'
$Location = 'centralus'
$ContainerAppsEnvironment = 'my-environment'
```

---

With these variables defined, you can create a resource group to organize the services needed for this tutorial.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroupName
```

---

## Prepare the GitHub repository

Go to the repository holding the ARM and Bicep templates that's used to deploy the solution.

Select the **Fork** button at the top of the [repository](https://github.com/Azure-Samples/Tutorial-Deploy-Dapr-Microservices-ACA) to fork the repo to your account.

Now you can clone your fork to work with it locally.

Use the following git command to clone your forked repo into the _acadapr-templates_ directory.

```git
git clone https://github.com/$GITHUB_USERNAME/Tutorial-Deploy-Dapr-Microservices-ACA.git acadapr-templates
```

## Deploy

The template deploys:

- a Container Apps environment
- a Log Analytics workspace associated with the Container Apps environment
- an Application Insights resource for distributed tracing
- a blob storage account and a default storage container
- a Dapr component for the blob storage account
- the node, Dapr-enabled container app with a user-assigned managed identity: [hello-k8s-node](https://hub.docker.com/r/dapriosamples/hello-k8s-node)
- the python, Dapr-enabled container app: [hello-k8s-python](https://hub.docker.com/r/dapriosamples/hello-k8s-python)
- an Active Directory role assignment for the node app used by the Dapr component to establish a connection to blob storage

Navigate to the _acadapr-templates_ directory and run the following command:

::: zone pivot="container-apps-arm"

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file ./azuredeploy.json \
  --parameters environment_name="$CONTAINERAPPS_ENVIRONMENT"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$params = @{
  environment_name = $ContainerAppsEnvironment

}

New-AzResourceGroupDeployment `
  -ResourceGroupName $ResourceGroupName `
  -TemplateParameterObject $params `
  -TemplateFile ./azuredeploy.json `
  -SkipTemplateParameterPrompt
```

::: zone-end

::: zone pivot="container-apps-bicep"

A warning (BCP081) might be displayed. This warning has no effect on the successful deployment of the application.

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file ./azuredeploy.bicep \
  --parameters environment_name="$CONTAINERAPPS_ENVIRONMENT"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$params = @{
  environment_name = $ContainerAppsEnvironment

}

New-AzResourceGroupDeployment `
  -ResourceGroupName $ResourceGroupName `
  -TemplateParameterObject $params `
  -TemplateFile ./azuredeploy.bicep `
  -SkipTemplateParameterPrompt
```

::: zone-end

---

This command deploys:

- the Container Apps environment and associated Log Analytics workspace for hosting the hello world Dapr solution
- an Application Insights instance for Dapr distributed tracing
- the `nodeapp` app server running on `targetPort: 3000` with Dapr enabled and configured using: `"appId": "nodeapp"` and `"appPort": 3000`, and a user-assigned identity with access to the Azure Blob storage via a Storage Data Contributor role assignment
- A Dapr component of `"type": "state.azure.blobstorage"` scoped for use by the `nodeapp` for storing state
- the Dapr-enabled, headless `pythonapp` that invokes the `nodeapp` service using Dapr service invocation

## Verify the result

### Confirm successful state persistence

You can confirm that the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser.

1. Go to the newly created storage account in your resource group.

1. Select **Containers** from the menu on the left side.

1. Select the created container.

1. Verify that you can see the file named `order` in the container.

1. Select the file.

1. Select the **Edit** tab.

1. Select the **Refresh** button to observe updates.

### View Logs

Data logged via a container app are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or from the command line. Wait a few minutes for the analytics to arrive for the first time before you query the logged data.

Use the following command to view logs in bash or PowerShell.

# [Bash](#tab/bash)

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`
```

```azurecli
az monitor log-analytics query \
  --workspace "$LOG_ANALYTICS_WORKSPACE_CLIENT_ID" \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'nodeapp' and (Log_s contains 'persisted' or Log_s contains 'order') | project ContainerAppName_s, Log_s, TimeGenerated | take 5" \
  --out table
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$WorkspaceId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).LogAnalyticConfigurationCustomerId
```

```azurepowershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WorkspaceId -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'nodeapp' and (Log_s contains 'persisted' or Log_s contains 'order') | project ContainerAppName_s, Log_s, TimeGenerated | take 5"
$queryResults.Results
```

---

The following output demonstrates the type of response to expect from the command.

```console
ContainerAppName_s    Log_s                            TableName      TimeGenerated
--------------------  -------------------------------  -------------  ------------------------
nodeapp               Got a new order! Order ID: 61    PrimaryResult  2021-10-22T21:31:46.184Z
nodeapp               Successfully persisted state.    PrimaryResult  2021-10-22T21:31:46.184Z
nodeapp               Got a new order! Order ID: 62    PrimaryResult  2021-10-22T22:01:57.174Z
nodeapp               Successfully persisted state.    PrimaryResult  2021-10-22T22:01:57.174Z
nodeapp               Got a new order! Order ID: 63    PrimaryResult  2021-10-22T22:45:44.618Z
```

## Clean up resources

Once you're done, run the following command to delete your resource group along with all the resources you created in this tutorial.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

> [!NOTE]
> Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
