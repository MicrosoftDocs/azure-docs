---
title: 'Tutorial: Deploy your first container app'
description: Deploy your first application to Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: tutorial
ms.date: 03/21/2022
ms.author: cshoe
ms.custom: ignite-fall-2021, mode-api, devx-track-azurecli, event-tier1-build-2022, devx-track-azurepowershell
ms.devlang: azurecli
---

# Tutorial: Deploy your first container app

The Azure Container Apps service enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while you leave behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this tutorial, you create a secure Container Apps environment and deploy your first container app.

> [!NOTE]
> You can also deploy this app using the [az containerapp up](/cli/azure/containerapp#az_containerapp_up) by following the instructions in the [Quickstart: Deploy your first container app with containerapp up](get-started.md) article.  The `az containerapp up` command is a fast and convenient way to build and deploy your app to Azure Container Apps using a single command.  However, it doesn't provide the same level of customization for your container app.


## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

# [Bash](#tab/bash)

To create the environment, run the following command:

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

# [Azure PowerShell](#tab/azure-powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to  variables.

```azurepowershell
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

```azurepowershell
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

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn
```

> [!NOTE]
> Make sure the value for the `--image` parameter is in lower case.

By setting `--ingress` to `external`, you make the container app available to public requests.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$ImageParams = @{
    Name = 'my-container-app'
    Image = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
}
$TemplateObj = New-AzContainerAppTemplateObject @ImageParams
$EnvId = (Get-AzContainerAppManagedEnv -EnvName $ContainerAppsEnvironment -ResourceGroupName $ResourceGroupName).Id

$AppArgs = @{
    Name = 'my-container-app'
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ManagedEnvironmentId = $EnvId
    IdentityType = 'SystemAssigned'
    TemplateContainer = $TemplateObj
    IngressTargetPort = 80
    IngressExternal = $true

}
New-AzContainerApp @AppArgs
```

> [!NOTE]
> Make sure the value for the `Image` parameter is in lower case.

By setting `IngressExternal` to `$true`, you make the container app available to public requests.

---

## Verify deployment

# [Bash](#tab/bash)

The `create` command returns the fully qualified domain name for the container app. Copy this location to a web browser.

# [Azure PowerShell](#tab/azure-powershell)

Get the fully qualified domain name for the container app.

```azurepowershell
(Get-AzContainerApp -Name $AppArgs.Name -ResourceGroupName $ResourceGroupName).IngressFqdn
```

Copy this location to a web browser.

---

 The following message is displayed when the container app is deployed:

:::image type="content" source="media/get-started/azure-container-apps-quickstart.png" alt-text="Screenshot of container app web page.":::

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this tutorial.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
