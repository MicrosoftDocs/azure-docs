---
title: "Quickstart: Deploy a Dapr application to Azure Container Apps using the Azure CLI"
description: Deploy a Dapr application to Azure Container Apps using the Azure CLI.
services: container-apps
author: hhunter-ms
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 02/03/2025
ms.author: hannahhunter
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli
---

# Quickstart: Deploy a Dapr application to Azure Container Apps using the Azure CLI

[Dapr](./dapr-overview.md) (Distributed Application Runtime) helps developers build resilient, reliable microservices. In this quickstart, you learn how to enable Dapr sidecars to run alongside your microservices container apps. You'll:

> [!div class="checklist"]
> * Create a Container Apps environment and Azure Blog Storage state store for your container apps.
> * Deploy a Python container app that publishes messages. 
> * Deploy a Node.js container app that subscribes to messages and persists them in a state store. 
> * Verify the interaction between the two microservices using the Azure portal.

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

This quickstart mirrors the applications you deploy in the open-source Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/tutorials/hello-world) quickstart.

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

[!INCLUDE [container-apps-set-environment-variables.md](../../includes/container-apps-set-environment-variables.md)]

[!INCLUDE [container-apps-create-resource-group.md](../../includes/container-apps-create-resource-group.md)]

[!INCLUDE [container-apps-create-environment.md](../../includes/container-apps-create-environment.md)]

## Set up a state store

### Create an Azure Blob Storage account

With the environment deployed, deploy an Azure Blob Storage account that is used by the Node.js container app to store data. Before deploying the service, choose a name for the storage account. Storage account names must be _unique within Azure_, from 3 to 24 characters in length and must contain numbers and lowercase letters only.

# [Bash](#tab/bash)

```azurecli
STORAGE_ACCOUNT_NAME="<storage account name>"
```

# [PowerShell](#tab/powershell)

```azurepowershell
$StorageAcctName = '<storage account name>'
```

---

Use the following command to create the Azure Storage account.

# [Bash](#tab/bash)

```azurecli
az storage account create \
  --name $STORAGE_ACCOUNT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --sku Standard_RAGRS \
  --kind StorageV2
```

# [PowerShell](#tab/powershell)

```azurepowershell
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

While Container Apps supports both user-assigned and system-assigned managed identity, a user-assigned identity provides the Dapr-enabled Node.js app with permissions to access the blob storage account.

1. Create a user-assigned identity.

    # [Bash](#tab/bash)
    
    ```azurecli
    az identity create --resource-group $RESOURCE_GROUP --name "nodeAppIdentity"     --output json
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurepowershell
    Install-Module -Name AZ.ManagedServiceIdentity
    
    New-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName -Name     'nodeAppIdentity' -Location $Location
    
    ```
    
    ---

1. Retrieve the `principalId` and `id` properties and store in variables.

    # [Bash](#tab/bash)
    
    ```azurecli
    PRINCIPAL_ID=$(az identity show -n "nodeAppIdentity" --resource-group     $RESOURCE_GROUP --query principalId | tr -d \")
    IDENTITY_ID=$(az identity show -n "nodeAppIdentity" --resource-group     $RESOURCE_GROUP --query id | tr -d \")
    CLIENT_ID=$(az identity show -n "nodeAppIdentity" --resource-group $RESOURCE_GROUP     --query clientId | tr -d \")
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurepowershell
    $PrincipalId = (Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName     -Name 'nodeAppIdentity').PrincipalId
    $IdentityId = (Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName     -Name 'nodeAppIdentity').Id
    $ClientId = (Get-AzUserAssignedIdentity -ResourceGroupName $ResourceGroupName -Name     'nodeAppIdentity').ClientId
    ```
    
    ---
    
1. Retrieve the subscription ID for your current subscription.

    # [Bash](#tab/bash)
    
    ```azurecli
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurepowershell
    $SubscriptionId=$(Get-AzContext).Subscription.id
    ```
    
    ---

1. Assign the `Storage Blob Data Contributor` role to the user-assigned identity. 

    # [Bash](#tab/bash)
    
    ```azurecli
    az role assignment create --assignee $PRINCIPAL_ID  \
    --role "Storage Blob Data Contributor" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/    Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT_NAME"
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurepowershell
    Install-Module Az.Resources
    
    New-AzRoleAssignment -ObjectId $PrincipalId -RoleDefinitionName 'Storage Blob Data     Contributor' -Scope "/subscriptions/$SubscriptionId/resourceGroups/    $ResourceGroupName/providers/Microsoft.Storage/storageAccounts/$StorageAcctName"
    ```
    
    ---

### Configure the state store component

While you have multiple options for authenticating to external resources via Dapr. This example uses an Azure-based state store, so you can provide direct access from the Node.js app to the Blob store using Managed Identity. 

1. In a text editor, create a file named *statestore.yaml* with the properties that you sourced from the previous steps. 

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

    This file helps enable your Dapr app to access your state store. 

1. Navigate to the directory in which you stored the yaml file and run the following command to configure the Dapr component in the Container Apps environment. 

    # [Bash](#tab/bash)
    
    ```azurecli
    az containerapp env dapr-component set \
        --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP \
        --dapr-component-name statestore \
        --yaml statestore.yaml
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```azurepowershell
    
    $AcctName = New-AzContainerAppDaprMetadataObject -Name "accountName" -Value     $StorageAcctName
    
    $ContainerName = New-AzContainerAppDaprMetadataObject -Name "containerName" -Value     'mycontainer'
    
    $ClientId = New-AzContainerAppDaprMetadataObject -Name "azureClientId" -Value     $ClientId
    
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

## Deploy the Node.js application

# [Bash](#tab/bash)

```azurecli
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

If you're using an Azure Container Registry, include the `--registry-server <REGISTRY_NAME>.azurecr.io` flag in the command.

# [PowerShell](#tab/powershell)

```azurepowershell
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

If you're using an Azure Container Registry, include the `RegistryServer = '<REGISTRY_NAME>.azurecr.io'` flag in the command.

---

By default, the image is pulled from [Docker Hub](https://hub.docker.com/r/dapriosamples/hello-k8s-node).

## Deploy the Python application

# [Bash](#tab/bash)

```azurecli
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

If you're using an Azure Container Registry, include the `--registry-server <REGISTRY_NAME>.azurecr.io` flag in the command.

# [PowerShell](#tab/powershell)

```azurepowershell

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

If you're using an Azure Container Registry, include the `RegistryServer = '<REGISTRY_NAME>.azurecr.io'` flag in the command.

---

## Verify the results

### Confirm successful state persistence

You can confirm that the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser and navigate to your storage account.

1. Select **Data Storage** > **Containers** in the left side menu.

1. Select the container app.

1. Verify that you can see the file named `order` in the container.

1. Select the file.

1. Select the **Edit** tab.

1. Select the **Refresh** button to observe how the data automatically updates.

### View Logs

Logs from container apps are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or via the CLI. There may be a small delay initially for the table to appear in the workspace.

View logs using the command line using the following CLI command.

# [Bash](#tab/bash)

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'nodeapp' and (Log_s contains 'persisted' or Log_s contains 'order') | project ContainerAppName_s, Log_s, TimeGenerated | sort by TimeGenerated | take 5" \
  --out table
```

# [PowerShell](#tab/powershell)

```azurepowershell

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

Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.

If you'd like to delete the resources created as a part of this walkthrough, run the following command.

> [!CAUTION]
> This command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---


> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Dapr components in Azure Container Apps](dapr-components.md)