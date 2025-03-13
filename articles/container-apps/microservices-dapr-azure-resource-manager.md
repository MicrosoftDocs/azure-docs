---
title: "Quickstart: Deploy a Dapr application to Azure Container Apps with an Azure Resource Manager or Bicep template"
description: Deploy a Dapr application to Azure Container Apps with an Azure Resource Manager or Bicep template.
services: container-apps
author: hhunter-ms
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 02/03/2025
ms.author: cshoe
ms.custom: devx-track-bicep, devx-track-arm-template, devx-track-azurepowershell
zone_pivot_groups: container-apps
---

# Quickstart: Deploy a Dapr application to Azure Container Apps with an Azure Resource Manager or Bicep template

[Dapr](./dapr-overview.md) (Distributed Application Runtime) helps developers build resilient, reliable microservices. In this quickstart, you enable Dapr sidecars to run alongside two container apps that produce and consume messages, stored in an Azure Blob Storage state store. Using either Azure Resource Manager or Bicep templates,  you'll:

> [!div class="checklist"]
>
> - Pass Azure CLI commands to [deploy a template](https://github.com/Azure-Samples/Tutorial-Deploy-Dapr-Microservices-ACA) that launches everything you need to run microservices.  
> - Verify the interaction between the two microservices in the Azure portal.

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

This quickstart mirrors the applications you deploy in the open-source Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/tutorials/hello-world) quickstart.

## Prerequisites

- Install [Azure CLI](/cli/azure/install-azure-cli)
- Install [Git](https://git-scm.com/downloads)

::: zone pivot="container-apps-bicep"

- [Bicep](../azure-resource-manager/bicep/install.md)

::: zone-end

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub Account. If you don't already have one, sign up for [free](https://github.com/join).

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

[!INCLUDE [container-apps-set-environment-variables.md](../../includes/container-apps-set-environment-variables.md)]

[!INCLUDE [container-apps-create-resource-group.md](../../includes/container-apps-create-resource-group.md)]

## Prepare the GitHub repository

Go to the repository holding the ARM and Bicep templates that's used to deploy the solution.

Select the **Fork** button at the top of the [repository](https://github.com/Azure-Samples/Tutorial-Deploy-Dapr-Microservices-ACA) to fork the repo to your account.

Now you can clone your fork to work with it locally.

Use the following git command to clone your forked repo into the _acadapr-templates_ directory.

```git
git clone https://github.com/$GITHUB_USERNAME/Tutorial-Deploy-Dapr-Microservices-ACA.git acadapr-templates
```

## Deploy

Navigate to the _acadapr-templates_ directory and run the following command:

::: zone pivot="container-apps-arm"

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file ./azuredeploy.json \
  --parameters environment_name="$CONTAINERAPPS_ENVIRONMENT"
```

# [PowerShell](#tab/powershell)

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

# [PowerShell](#tab/powershell)

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

- The Container Apps environment and associated Log Analytics workspace for hosting the hello world Dapr solution.
- An Application Insights instance for Dapr distributed tracing.
- The `nodeapp` app server running on `targetPort: 3000` with Dapr enabled and configured using: 
   - `"appId": "nodeapp"`
   - `"appPort": 3000`
   - A user-assigned identity with access to the Azure Blob storage via a Storage Data Contributor role assignment
- A Dapr component of `"type": "state.azure.blobstorage"` scoped for use by the `nodeapp` for storing state.
- The Dapr-enabled, headless `pythonapp` that invokes the `nodeapp` service using Dapr service invocation.
- A Microsoft Entra ID role assignment for the Node.js app used by the Dapr component to establish a connection to Blob storage.

## Verify the result

### Confirm successful state persistence

You can confirm that the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser.

1. Go to the newly created storage account in your resource group.

1. Select **Data Storage** > **Containers** from the menu on the left side.

1. Select the created container.

1. Verify that you can see the file named `order` in the container.

1. Select the file.

1. Select the **Edit** tab.

1. Select the **Refresh** button to observe updates.

### View Logs

Logs from container apps are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or via the CLI. There may be a small delay initially for the table to appear in the workspace.

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

# [PowerShell](#tab/powershell)

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

Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it's important to complete these cleanup steps to avoid ongoing billable operations.

If you'd like to delete the resources created as a part of this walkthrough, run the following command.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Dapr components in Azure Container Apps](dapr-components.md)