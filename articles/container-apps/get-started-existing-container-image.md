---
title: 'Quickstart: Deploy an existing container image with the command line'
description: Deploy an existing container image to Azure Container Apps with the Azure CLI or PowerShell.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: quickstart
ms.date: 08/31/2022
ms.author: cshoe
zone_pivot_groups: container-apps-registry-types
---

# Quickstart: Deploy an existing container image with the command line

The Azure Container Apps service enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while you leave behind the concerns of manual cloud infrastructure configuration and complex container orchestrators.

This article demonstrates how to deploy an existing container to Azure Container Apps.

> [!NOTE]
> Private registry authorization is supported via registry username and password.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Access to a public or private container registry, such as the [Azure Container Registry](../container-registry/index.yml).

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

To create the environment, run the following command:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

# [Azure PowerShell](#tab/azure-powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to environment variables.

```azurepowershell-interactive
$WorkspaceArgs = @{
    Name = 'myworkspace'
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    PublicNetworkAccessForIngestion = 'Enabled'
    PublicNetworkAccessForQuery = 'Enabled'
}
New-AzOperationalInsightsWorkspace @WorkspaceArgs
$WorkspaceId = (Get-AzOperationalInsightsWorkspace -ResourceGroupName $ResourceGroupName -Name $WorkspaceArgs.Name).CustomerId
$WorkspaceSharedKey = (Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName $ResourceGroupName -Name $WorkspaceArgs.Name).PrimarySharedKey
```

To create the environment, run the following command:

```azurepowershell-interactive
$EnvArgs = @{
    EnvName = $ContainerAppsEnvironment
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    AppLogConfigurationDestination = 'log-analytics'
    LogAnalyticConfigurationCustomerId = $WorkspaceId
    LogAnalyticConfigurationSharedKey = $WorkspaceSharedKey
}

New-AzContainerAppManagedEnv @EnvArgs
```

---

## Create a container app

Now that you have an environment created, you can deploy your first container app. With the `containerapp create` command, deploy a container image to Azure Container Apps.

The example shown in this article demonstrates how to use a custom container image with common commands. Your container image might need more parameters for the following items:

- Set the revision mode
- Define secrets
- Define environment variables
- Set container CPU or memory requirements
- Enable and configure Dapr
- Enable external or internal ingress
- Provide minimum and maximum replica values or scale rules

::: zone pivot="container-apps-private-registry"

# [Azure CLI](#tab/azure-cli)

For details on how to provide values for any of these parameters to the `create` command, run `az containerapp create --help` or [visit the online reference](/cli/azure/containerapp#az-containerapp-create). To generate credentials for an Azure Container Registry, use [az acr credential show](/cli/azure/acr/credential#az-acr-credential-show).

```bash
CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
REGISTRY_SERVER=<REGISTRY_SERVER>
REGISTRY_USERNAME=<REGISTRY_USERNAME>
REGISTRY_PASSWORD=<REGISTRY_PASSWORD>
```

(Replace the \<placeholders\> with your values.)

```azurecli-interactive
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --image $CONTAINER_IMAGE_NAME \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$ContainerImageName = "<CONTAINER_IMAGE_NAME>"
$RegistryServer = "<REGISTRY_SERVER>"
$RegistryUsername = "<REGISTRY_USERNAME>"
$RegistryPassword = "<REGISTRY_PASSWORD>"
```

(Replace the \<placeholders\> with your values.)

```azurepowershell-interactive
$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).Id

$TemplateObj = New-AzContainerAppTemplateObject -Name my-container-app -Image $ContainerImageName

$RegistrySecretObj = New-AzContainerAppSecretObject -Name registry-secret -Value $RegistryPassword

$RegistryArgs = @{
    PasswordSecretRef = 'registry-secret'
    Server = $RegistryServer
    Username = $RegistryUsername
}

$RegistryObj = New-AzContainerAppRegistryCredentialObject @RegistryArgs

$ContainerAppArgs = @{
    Name = 'my-container-app'
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $TemplateObj
    ConfigurationRegistry = $RegistryObj
    ConfigurationSecret = $RegistrySecretObj
}

New-AzContainerApp @ContainerAppArgs
```

---

::: zone-end

::: zone pivot="container-apps-public-registry"

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az containerapp create \
  --image <REGISTRY_CONTAINER_NAME> \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT

If you have enabled ingress on your container app, you can add `--query properties.configuration.ingress.fqdn` to the `create` command to return the public URL for the application.

```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$TemplateObj = New-AzContainerAppTemplateObject -Name my-container-app  -Image "<REGISTRY_CONTAINER_NAME>"
```

(Replace the \<REGISTRY_CONTAINER_NAME\> with your value.)

```azurepowershell-interactive
$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).Id

$ContainerAppArgs = @{
    Name = "my-container-app"
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $TemplateObj
}
New-AzContainerApp @ContainerAppArgs
```

---

Before you run this command, replace `<REGISTRY_CONTAINER_NAME>` with the full name the public container registry location, including the registry path and tag. For example, a valid container name is `mcr.microsoft.com/k8se/quickstart:latest`.

::: zone-end

## Verify deployment

To verify a successful deployment, you can query the Log Analytics workspace. You might have to wait a few minutes after deployment for the analytics to arrive for the first time before you're able to query the logs.  This depends on the console logging implemented in your container app.

Use the following commands to view console log messages.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated" \
  --out table
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WorkspaceId -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated"
$queryResults.Results
```

---

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
