---
title: 'Tutorial: Deploy a background processing application with Azure Container Apps'
description: Learn to create an application that continuously runs in the background with Azure Container Apps
services: container-apps
author: jorgearteiro
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: joarteir
ms.custom: ignite-fall-2021, devx-track-azurecli
---

# Tutorial: Deploy a background processing application with Azure Container Apps

Using Azure Container Apps allows you to deploy applications without requiring the exposure of public endpoints. By using Container Apps scale rules, the application can scale up and down based on the Azure Storage queue length. When there are no messages on the queue, the container app scales down to zero.

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

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $CONTAINERAPPS_ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION
```

---

## Set up a storage queue

Choose a name for `STORAGE_ACCOUNT`. Storage account names must be *unique within Azure* and be from 3 to 24 characters in length containing numbers and lowercase letters only.

# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT="<storage account name>"
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT="<storage account name>"
```

---

Create an Azure Storage account.

# [Bash](#tab/bash)

```azurecli
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --sku Standard_RAGRS \
  --kind StorageV2
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT = New-AzStorageAccount `
  -Name $STORAGE_ACCOUNT_NAME `
  -ResourceGroupName $RESOURCE_GROUP `
  -Location $LOCATION `
  -SkuName Standard_RAGRS `
  -Kind StorageV2
```

---

Next, get the connection string for the queue.

# [Bash](#tab/bash)

```azurecli
QUEUE_CONNECTION_STRING=`az storage account show-connection-string -g $RESOURCE_GROUP --name $STORAGE_ACCOUNT --query connectionString --out json | tr -d '"'`
```

# [PowerShell](#tab/powershell)

```azurecli
 $QUEUE_CONNECTION_STRING=(az storage account show-connection-string -g $RESOURCE_GROUP --name $STORAGE_ACCOUNT_NAME --query connectionString --out json)  -replace '"',''
```

---

Now you can create the message queue.

# [Bash](#tab/bash)

```azurecli
az storage queue create \
  --name "myqueue" \
  --account-name $STORAGE_ACCOUNT \
  --connection-string $QUEUE_CONNECTION_STRING
```

# [PowerShell](#tab/powershell)

```powershell
$queue = New-AzStorageQueue –Name "myqueue" `
  -Context $STORAGE_ACCOUNT.Context
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

# [PowerShell](#tab/powershell)

```azurecli
$queueMessage = [Microsoft.Azure.Storage.Queue.CloudQueueMessage]::new("Hello Queue Reader App")
$queue.CloudQueue.AddMessageAsync($QueueMessage)
```

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
            "defaultValue": "",
            "type": "String"
        },
        "queueconnection": {
            "defaultValue": "",
            "type": "String"
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
                                "secretref": "queueconnection"
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

# [PowerShell](#tab/powershell)

```powershell
$params = @{
  environment_name = $CONTAINERAPPS_ENVIRONMENT
  location = $LOCATION
  queueconnection=$QUEUE_CONNECTION_STRING 
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $RESOURCE_GROUP `
  -TemplateParameterObject $params `
  -TemplateFile ./queue.json `
  -SkipTemplateParameterPrompt 
```

---

This command deploys the demo application from the public container image called `mcr.microsoft.com/azuredocs/containerapps-queuereader` and sets secrets and environments variables used by the application.

The application scales up to 10 replicas based on the queue length as defined in the `scale` section of the ARM template.

## Verify the result

The container app runs as a background process. As messages arrive from the Azure Storage Queue, the application creates log entries in Log analytics. You must wait a few minutes for the analytics to arrive for the first time before you are able to query the logged data.

Run the following command to see logged messages. This command requires the Log analytics extension, so accept the prompt to install extension when requested.

# [Bash](#tab/bash)

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'queuereader' and Log_s contains 'Message ID'" \
  --out table
```

# [PowerShell](#tab/powershell)

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_ID=(az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv)

$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $LOG_ANALYTICS_WORKSPACE_CLIENT_ID -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'queuereader' and Log_s contains 'Message ID'"
$queryResults.Results
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Clean up resources

Once you are done, run the following command to delete the resource group that contains your Container Apps resources.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

This command deletes the entire resource group including the Container Apps instance, storage account, Log Analytics workspace, and any other resources in the resource group.
