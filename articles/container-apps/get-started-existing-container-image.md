---
title: 'Quickstart: Deploy an existing container image with the Azure CLI'
description: Deploy an existing container image to Azure Container Apps with the Azure CLI.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: quickstart
ms.date: 03/21/2022
ms.author: cshoe
zone_pivot_groups: container-apps-registry-types
---

# Quickstart: Deploy an existing container image with the Azure CLI

The Azure Container Apps service enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while you leave behind the concerns of manual cloud infrastructure configuration and complex container orchestrators.

This article demonstrates how to deploy an existing container to Azure Container Apps.

> [!NOTE]
> Private registry authorization is supported via registry username and password.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Access to a public or private container registry.

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

To create the environment, run the following command:

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

# [PowerShell](#tab/powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to  variables.

```powershell
New-AzOperationalInsightsWorkspace -ResourceGroupName $RESOURCE_GROUP -Name MyWorkspace -Location $Location -PublicNetworkAccessForIngestion "Enabled" -PublicNetworkAccessForQuery "Enabled"
$WORKSPACE_ID = (Get-AzOperationalInsightsWorkspace -ResourceGroupName $RESOURCE_GROUP -Name MyWorkspace).CustomerId
$WORKSPACE_SHARED_KEY = (Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName $RESOURCE_GROUP -Name MyWorkspace).PrimarySharedKey
```

To create the environment, run the following command:

```powershell

New-AzContainerAppManagedEnv -EnvName $CONTAINERAPPS_ENVIRONMENT `
  -ResourceGroupName $RESOURCE_GROUP `
  -AppLogConfigurationDestination "log-analytics" `
  -Location $LOCATION `
  -LogAnalyticConfigurationCustomerId $WORKSPACE_ID `
  -LogAnalyticConfigurationSharedKey $WORKSPACE_SHARED_KEY
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


# [Bash](#tab/bash)

For details on how to provide values for any of these parameters to the `create` command, run `az containerapp create --help`.

```bash
CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
REGISTRY_SERVER=<REGISTRY_SERVER>
REGISTRY_USERNAME=<REGISTRY_USERNAME>
REGISTRY_PASSWORD=<REGISTRY_PASSWORD>
```

(Replace the \<placeholders\> with your values.)

```azurecli
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --image $CONTAINER_IMAGE_NAME \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD
```

# [PowerShell](#tab/powershell)

```powershell
$CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
$REGISTRY_SERVER=<REGISTRY_SERVER>
$REGISTRY_USERNAME=<REGISTRY_USERNAME>
$REGISTRY_PASSWORD=<REGISTRY_PASSWORD>
```

(Replace the \<placeholders\> with your values.)

```powershell
$ENV_ID = (Get-AzContainerAppManagedEnv -ResourceGroupName $RESOURCE_GROUP -EnvName $CONTAINERAPPS_ENVIRONMENT).Id

$TEMPLATE_OBJ = New-AzContainerAppTemplateObject `
  -Name my-container-app `
  -Image $CONTAINER_IMAGE_NAME

$REGISTRY_SECRET_OBJ = New-AzContainerAppSecretObject `
  -Name registry-secret `
  -Value $REGISTRY_PASSWORD

$REGISTRY_OBJ = New-AzContainerAppRegistryCredentialObject `
  -PasswordSecretRef registry-secret `
  -Server $REGISTRY_SERVER `
  -Username $REGISTRY_USERNAME

New-AzContainerApp -Name my-container-app `
  -Location $LOCATION `
  -ResourceGroupName $RESOURCE_GROUP `
  -ManagedEnvironmentId $ENV_ID `
  -ConfigurationRegistry $REGISTRY_OBJ `
  -ConfigurationSecret $REGISTRY_SECRET_OBJ `
  -TemplateContainer $TEMPLATE_OBJ 
```

---

::: zone-end

::: zone pivot="container-apps-public-registry"

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --image <REGISTRY_CONTAINER_NAME> \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT
```

# [PowerShell](#tab/powershell)

If you have logged in to ACR, you can omit the `--registry-username` and `--registry-password` parameters in the `az containerapp create` command.

```powershell
$IMAGE_OBJ = New-AzContainerAppTemplateObject `
  -Name my-container-app `
  -Image <REGISTRY_CONTAINER_NAME> 

$ENV_ID = (Get-AzContainerAppManagedEnv -ResourceGroupName $RESOURCE_GROUP -EnvName $CONTAINERAPPS_ENVIRONMENT).Id

New-AzContainerApp `
  -Name my-container-app `
  -Location $LOCATION `
  -ResourceGroupName $RESOURCE_GROUP `
  -ManagedEnvironmentId $ENV_ID `
  -TemplateContainer $IMAGE_OBJ
 ```

---

(Replace the \<placeholders\> with your values.)

Before you run this command, replace `<REGISTRY_CONTAINER_NAME>` with the full name the public container registry location, including the registry path and tag. For example, a valid container name is `mcr.microsoft.com/azuredocs/containerapps-helloworld:latest`.

::: zone-end

If you have enabled ingress on your container app, you can add `--query properties.configuration.ingress.fqdn` to the `create` command to return the public URL for the application.

## Verify deployment

To verify a successful deployment, you can query the Log Analytics workspace. You might have to wait 5–10 minutes after deployment for the analytics to arrive for the first time before you are able to query the logs.

After about 5-10 minutes has passed, use the following steps to view logged messages.

# [Bash](#tab/bash)

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated" \
  --out table
```

# [PowerShell](#tab/powershell)

```powershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WORKSPACE_ID -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated"
$queryResults.Results
```

---

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell

Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
