---
title: "Tutorial: Deploy a Dapr application to Azure Container Apps using the Azure CLI"
description: Deploy a Dapr application to Azure Container Apps using the Azure CLI.
services: container-apps
author: asw101
ms.service: container-apps
ms.topic: conceptual
ms.date: 09/29/2022
ms.author: aawislan
ms.custom: devx-track-azurecli, ignite-2022, devx-track-azurepowershell, devx-track-linux
ms.devlang: azurecli
---

# Tutorial: Deploy a Dapr application to Azure Container Apps using the Azure CLI

[Dapr](https://dapr.io/) (Distributed Application Runtime) helps developers build resilient, reliable microservices. In this tutorial, a sample Dapr application is deployed to Azure Container Apps.

You learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment for your container apps
> * Create an Azure Blob Storage state store for the container app
> * Deploy two apps that produce and consume messages and persist them in the state store
> * Verify the interaction between the two microservices.

With Azure Container Apps, you get a [fully managed version of the Dapr APIs](./dapr-overview.md) when building microservices. When you use Dapr in Azure Container Apps, you can enable sidecars to run next to your microservices that provide a rich set of capabilities. Available Dapr APIs include [Service to Service calls](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/), [Pub/Sub](https://docs.dapr.io/developing-applications/building-blocks/pubsub/), [Event Bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/), [State Stores](https://docs.dapr.io/developing-applications/building-blocks/state-management/), and [Actors](https://docs.dapr.io/developing-applications/building-blocks/actors/).

In this tutorial, you deploy the same applications from the Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/tutorials/hello-kubernetes) quickstart. 

The application consists of:

- A client (Python) container app to generate messages.
- A service (Node) container app to consume and persist those messages in a state store

The following architecture diagram illustrates the components that make up this tutorial:

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

---

# [Azure CLI](#tab/azure-cli)

Individual container apps are deployed to an Azure Container Apps environment. To create the environment, run the following command:

```azurecli-interactive
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [Azure PowerShell](#tab/azure-powershell)

Individual container apps are deployed to an Azure Container Apps environment. A Log Analytics workspace is deployed as the logging backend before the environment is deployed. The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to environment variables.

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

## Set up a state store

### Create an Azure Blob Storage account

With the environment deployed, the next step is to deploy an Azure Blob Storage account that is used by one of the microservices to store data. Before deploying the service, you need to choose a name for the storage account. Storage account names must be _unique within Azure_, from 3 to 24 characters in length and must contain numbers and lowercase letters only.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
STORAGE_ACCOUNT_NAME="<storage account name>"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$StorageAcctName = '<storage account name>'
```

---

Use the following command to create the Azure Storage account.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az storage account create \
  --name $STORAGE_ACCOUNT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --sku Standard_RAGRS \
  --kind StorageV2
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Install-Module Az.Storage

$StorageAcctArgs = @{
    Name = $StorageAcctName
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    SkuName = 'Standard_RAGRS'
    Kind = 'StorageV2'
}
$StorageAccount = New-AzStorageAccount @StorageAcctArgs
```

---

## Configure a user-assigned identity for the node app

While Container Apps supports both user-assigned and system-assigned managed identity, a user-assigned identity provides the Dapr-enabled node app with permissions to access the blob storage account.

1. Create a user-assigned identity.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az identity create --resource-group $RESOURCE_GROUP --name "nodeAppIdentity" --output json
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Install-Module -Name AZ.ManagedServiceIdentity

New-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName -Name 'nodeAppIdentity' -Location $Location

```

---

Retrieve the `principalId` and `id` properties and store in variables.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
PRINCIPAL_ID=$(az identity show -n "nodeAppIdentity" --resource-group $RESOURCE_GROUP --query principalId | tr -d \")
IDENTITY_ID=$(az identity show -n "nodeAppIdentity" --resource-group $RESOURCE_GROUP --query id | tr -d \")
CLIENT_ID=$(az identity show -n "nodeAppIdentity" --resource-group $RESOURCE_GROUP --query clientId | tr -d \")
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$PrincipalId = (Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName -Name 'nodeAppIdentity').PrincipalId
$IdentityId = (Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName -Name 'nodeAppIdentity').Id
$ClientId = (Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName -Name 'nodeAppIdentity').ClientId
```

---

2. Assign the `Storage Blob Data Contributor` role to the user-assigned identity

Retrieve the subscription ID for your current subscription.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$SubscriptionId=$(Get-AzContext).Subscription.id
```

---

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az role assignment create --assignee $PRINCIPAL_ID  \
--role "Storage Blob Data Contributor" \
--scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT_NAME"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Install-Module Az.Resources

New-AzRoleAssignment -ObjectId $PrincipalId -RoleDefinitionName 'Storage Blob Data Contributor' -Scope "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Storage/storageAccounts/$StorageAcctName"
```

---

### Configure the state store component

There are multiple ways to authenticate to external resources via Dapr. This example doesn't use the Dapr Secrets API at runtime, but uses an Azure-based state store. Therefore, you can forgo creating a secret store component and instead provide direct access from the node app to the blob store using Managed Identity. If you want to use a non-Azure state store or the Dapr Secrets API at runtime, you could create a secret store component. This component would load runtime secrets so you can reference them at runtime.

Open a text editor and create a config file named *statestore.yaml* with the properties that you sourced from the previous steps. This file helps enable your Dapr app to access your state store. The following example shows how your *statestore.yaml* file should look when configured for your Azure Blob Storage account:

```yaml
# statestore.yaml for Azure Blob storage component
componentType: state.azure.blobstorage
version: v1
metadata:
  - name: accountName
    value: "<STORAGE_ACCOUNT_NAME>"
  - name: containerName
    value: mycontainer
  - name: azureClientId
    value: "<MANAGED_IDENTITY_CLIENT_ID>"
scopes:
  - nodeapp
```

To use this file, update the placeholders:

- Replace `<STORAGE_ACCOUNT_NAME>` with the value of the `STORAGE_ACCOUNT_NAME` variable you defined. To obtain its value, run the following command:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
echo $STORAGE_ACCOUNT_NAME
```
- Replace `<MANAGED_IDENTITY_CLIENT_ID>` with the value of the `CLIENT_ID` variable you defined. To obtain its value, run the following command:

```azurecli-interactive
echo $CLIENT_ID
```

Navigate to the directory in which you stored the component yaml file and run the following command to configure the Dapr component in the Container Apps environment. For more information about configuring Dapr components, see [Configure Dapr components](dapr-overview.md).

```azurecli-interactive
az containerapp env dapr-component set \
    --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP \
    --dapr-component-name statestore \
    --yaml statestore.yaml
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive

$AcctName = New-AzContainerAppDaprMetadataObject -Name "accountName" -Value $StorageAcctName

$ContainerName = New-AzContainerAppDaprMetadataObject -Name "containerName" -Value 'mycontainer'

$ClientId = New-AzContainerAppDaprMetadataObject -Name "azureClientId" -Value $ClientId

$DaprArgs = @{
    EnvName = $ContainerAppsEnvironment
    ResourceGroupName = $ResourceGroupName
    DaprName = 'statestore'
    Metadata = $AcctName, $ContainerName, $ClientId
    Scope = 'nodeapp'
    Version = 'v1'
    ComponentType = 'state.azure.blobstorage'
}

New-AzContainerAppManagedEnvDapr @DaprArgs
```

---

## Deploy the service application (HTTP web server)

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az containerapp create \
  --name nodeapp \
  --resource-group $RESOURCE_GROUP \
  --user-assigned $IDENTITY_ID \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image dapriosamples/hello-k8s-node:latest \
  --min-replicas 1 \
  --max-replicas 1 \
  --enable-dapr \
  --dapr-app-id nodeapp \
  --dapr-app-port 3000 \
  --env-vars 'APP_PORT=3000'
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName $ResourceGroupName -EnvName $ContainerAppsEnvironment).Id

$EnvVars = New-AzContainerAppEnvironmentVarObject -Name APP_PORT -Value 3000

$TemplateArgs = @{
  Name = 'nodeapp'
  Image = 'dapriosamples/hello-k8s-node:latest'
  Env = $EnvVars
}
$ServiceTemplateObj = New-AzContainerAppTemplateObject @TemplateArgs

$ServiceArgs = @{
    Name = 'nodeapp'
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $ServiceTemplateObj
    ScaleMinReplica = 1
    ScaleMaxReplica = 1
    DaprEnabled = $true
    DaprAppId = 'nodeapp'
    DaprAppPort = 3000
    IdentityType = 'UserAssigned'
    IdentityUserAssignedIdentity = @{
        $IdentityId = @{}
    }
}
New-AzContainerApp @ServiceArgs
```

---

By default, the image is pulled from [Docker Hub](https://hub.docker.com/r/dapriosamples/hello-k8s-node).

## Deploy the client application (headless client)

Run the following command to deploy the client container app.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az containerapp create \
  --name pythonapp \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image dapriosamples/hello-k8s-python:latest \
  --min-replicas 1 \
  --max-replicas 1 \
  --enable-dapr \
  --dapr-app-id pythonapp
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive

$TemplateArgs = @{
  Name = 'pythonapp'
  Image = 'dapriosamples/hello-k8s-python:latest'
}

$ClientTemplateObj = New-AzContainerAppTemplateObject @TemplateArgs


$ClientArgs = @{
    Name = 'pythonapp'
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $ClientTemplateObj
    ScaleMinReplica = 1
    ScaleMaxReplica = 1
    DaprEnabled = $true
    DaprAppId = 'pythonapp'
}
New-AzContainerApp @ClientArgs
```

---

## Verify the results

### Confirm successful state persistence

You can confirm that the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser and navigate to your storage account.

1. Select **Containers** left side menu.

1. Select **mycontainer**.

1. Verify that you can see the file named `order` in the container.

1. Select the file.

1. Select the **Edit** tab.

1. Select the **Refresh** button to observe how the data automatically updates.

### View Logs

Logs from container apps are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or via the CLI. There may be a small delay initially for the table to appear in the workspace.

Use the following CLI command to view logs using the command line.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'nodeapp' and (Log_s contains 'persisted' or Log_s contains 'order') | project ContainerAppName_s, Log_s, TimeGenerated | sort by TimeGenerated | take 5" \
  --out table
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive

$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WorkspaceId  -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'nodeapp' and (Log_s contains 'persisted' or Log_s contains 'order') | project ContainerAppName_s, Log_s, TimeGenerated | take 5 "
$queryResults.Results

```

---

The following output demonstrates the type of response to expect from the CLI command.

```bash
ContainerAppName_s    Log_s                            TableName      TimeGenerated
--------------------  -------------------------------  -------------  ------------------------
nodeapp               Got a new order! Order ID: 61    PrimaryResult  2021-10-22T21:31:46.184Z
nodeapp               Successfully persisted state.    PrimaryResult  2021-10-22T21:31:46.184Z
nodeapp               Got a new order! Order ID: 62    PrimaryResult  2021-10-22T22:01:57.174Z
nodeapp               Successfully persisted state.    PrimaryResult  2021-10-22T22:01:57.174Z
nodeapp               Got a new order! Order ID: 63    PrimaryResult  2021-10-22T22:45:44.618Z
```

## Clean up resources

Congratulations! You've completed this tutorial. If you'd like to delete the resources created as a part of this walkthrough, run the following command.

> [!CAUTION]
> This command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --resource-group $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

> [!NOTE]
> Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
