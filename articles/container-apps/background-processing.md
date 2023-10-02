---
title: 'Tutorial: Deploy a background processing application with Azure Container Apps'
description: Learn to create an application that continuously runs in the background with Azure Container Apps
services: container-apps
author: jorgearteiro
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: joarteir
ms.custom: devx-track-azurecli, event-tier1-build-2022, devx-track-azurepowershell, build-2023, devx-track-linux
---

# Tutorial: Deploy a background processing application with Azure Container Apps

Using Azure Container Apps allows you to deploy applications without requiring the exposure of public endpoints. By using Container Apps scale rules, the application can scale out and in based on the Azure Storage queue length. When there are no messages on the queue, the container app scales in to zero.

You learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your container apps
> * Create an Azure Storage Queue to send messages to the container app
> * Deploy your background processing application as a container app
> * Verify that the queue messages are processed by the container app

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

---

Individual container apps are deployed to an Azure Container Apps environment. To create the environment, run the following command:

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [Azure PowerShell](#tab/azure-powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to environment variables.


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

## Set up a storage queue

Begin by defining a name for the storage account. Storage account names must be *unique within Azure* and be from 3 to 24 characters in length containing numbers and lowercase letters only.

# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT_NAME="<STORAGE_ACCOUNT_NAME>"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$StorageAcctName = "<StorageAccountName>"
```

---

Create an Azure Storage account.

# [Bash](#tab/bash)

```azurecli
az storage account create \
  --name $STORAGE_ACCOUNT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --sku Standard_RAGRS \
  --kind StorageV2
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$StorageAcctArgs = @{
    Name = $StorageAcctName
    ResourceGroupName = $ResourceGroupName
    Location = $location
    SkuName = 'Standard_RAGRS'
    Kind = 'StorageV2'
}
$StorageAcct = New-AzStorageAccount @StorageAcctArgs
```

---

Next, get the connection string for the queue.

# [Bash](#tab/bash)

```azurecli
QUEUE_CONNECTION_STRING=`az storage account show-connection-string -g $RESOURCE_GROUP --name $STORAGE_ACCOUNT_NAME --query connectionString --out json | tr -d '"'`
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
 $QueueConnectionString = (Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAcctName).Context.ConnectionString
```

---

Now you can create the message queue.

# [Bash](#tab/bash)

```azurecli
az storage queue create \
  --name "myqueue" \
  --account-name $STORAGE_ACCOUNT_NAME \
  --connection-string $QUEUE_CONNECTION_STRING
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$Queue = New-AzStorageQueue -Name 'myqueue' -Context $StorageAcct.Context
```

---

Finally, you can send a message to the queue.

# [Bash](#tab/bash)

```azurecli
az storage message put \
  --content "Hello Queue Reader App" \
  --queue-name "myqueue" \
  --connection-string $QUEUE_CONNECTION_STRING
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$QueueMessage = [Microsoft.Azure.Storage.Queue.CloudQueueMessage]::new("Hello Queue Reader App")
$Queue.CloudQueue.AddMessageAsync($QueueMessage).GetAwaiter().GetResult()
```

A result of `Microsoft.Azure.Storage.Core.NullType` is returned when the message is added to the queue.

---

## Deploy the background application

Create a file named *queue.json* and paste the following configuration code into the file.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "defaultValue": "canadacentral",
            "type": "String"
        },
        "environment_name": {
            "type": "String"
        },
        "queueconnection": {
            "type": "secureString"
        }
    },
    "variables": {},
    "resources": [
    {
        "name": "queuereader",
        "type": "Microsoft.App/containerApps",
        "apiVersion": "2022-03-01",
        "kind": "containerapp",
        "location": "[parameters('location')]",
        "properties": {
            "managedEnvironmentId": "[resourceId('Microsoft.App/managedEnvironments', parameters('environment_name'))]",
            "configuration": {
                "activeRevisionsMode": "single",
                "secrets": [
                {
                    "name": "queueconnection",
                    "value": "[parameters('queueconnection')]"
                }]
            },
            "template": {
                "containers": [
                    {
                        "image": "mcr.microsoft.com/azuredocs/containerapps-queuereader",
                        "name": "queuereader",
                        "env": [
                            {
                                "name": "QueueName",
                                "value": "myqueue"
                            },
                            {
                                "name": "QueueConnectionString",
                                "secretRef": "queueconnection"
                            }
                        ]
                    }
                ],
                "scale": {
                    "minReplicas": 1,
                    "maxReplicas": 10,
                    "rules": [
                        {
                            "name": "myqueuerule",
                            "azureQueue": {
                                "queueName": "myqueue",
                                "queueLength": 100,
                                "auth": [
                                    {
                                        "secretRef": "queueconnection",
                                        "triggerParameter": "connection"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    }]
}

```

Now you can create and deploy your container app.

# [Bash](#tab/bash)

```azurecli
az deployment group create --resource-group "$RESOURCE_GROUP" \
  --template-file ./queue.json \
  --parameters \
    environment_name="$CONTAINERAPPS_ENVIRONMENT" \
    queueconnection="$QUEUE_CONNECTION_STRING" \
    location="$LOCATION"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$Params = @{
    environment_name = $ContainerAppsEnvironment
    location = $Location
    queueconnection = $QueueConnectionString 
}

$DeploymentArgs = @{
     ResourceGroupName = $ResourceGroupName
     TemplateParameterObject = $Params
     TemplateFile = './queue.json'
     SkipTemplateParameterPrompt = $true
}
New-AzResourceGroupDeployment  @DeploymentArgs
```

---

This command deploys the demo application from the public container image called `mcr.microsoft.com/azuredocs/containerapps-queuereader` and sets secrets and environments variables used by the application.

The application scales out to 10 replicas based on the queue length as defined in the `scale` section of the ARM template.

## Verify the result

The container app runs as a background process. As messages arrive from the Azure Storage Queue, the application creates log entries in Log analytics. You must wait a few minutes for the analytics to arrive for the first time before you're able to query the logged data.

Run the following command to see logged messages. This command requires the Log analytics extension, so accept the prompt to install extension when requested.

# [Bash](#tab/bash)

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'queuereader' and Log_s contains 'Message ID' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s | take 5" \
  --out table
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WorkspaceId  -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'queuereader' and Log_s contains 'Message ID' | project Time=TimeGenerated, AppName=ContainerAppName_s, Revision=RevisionName_s, Container=ContainerName_s, Message=Log_s | take 5"
$queryResults.Results
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Clean up resources

Once you're done, run the following command to delete the resource group that contains your Container Apps resources.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---
