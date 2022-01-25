---
title: 'Tutorial: Deploy a Dapr application to Azure Container Apps using an ARM or Bicep template'
description: Deploy a Dapr application to Azure Container Apps using an ARM or Bicep template.
services: container-apps
author: asw101
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aawislan
ms.custom: ignite-fall-2021
zone_pivot_groups: container-apps
---

# Tutorial: Deploy a Dapr application to Azure Container Apps using an ARM or Bicep template

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps you build resilient stateless and stateful microservices. In this tutorial, a sample Dapr application is deployed to Azure Container Apps.

You learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment for your container apps
> * Create an Azure Blob Storage state store for the container app
> * Deploy two apps that a produce and consume messages and persist them using the state store
> * Verify the interaction between the two microservices.

Azure Container Apps offers a fully managed version of the Dapr APIs when building microservices. When you use Dapr in Azure Container Apps, you can enable sidecars to run next to your microservices that provide a rich set of capabilities. Available Dapr APIs include [Service to Service calls](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/), [Pub/Sub](https://docs.dapr.io/developing-applications/building-blocks/pubsub/), [Event Bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/), [State Stores](https://docs.dapr.io/developing-applications/building-blocks/state-management/), and [Actors](https://docs.dapr.io/developing-applications/building-blocks/actors/).

In this tutorial, you deploy the same applications from the Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/hello-kubernetes) quickstart. The quickstart consists of a client (Python) app that generates messages, and a service (Node) app that consumes and persists those messages in a configured state store. The following architecture diagram illustrates the components that make up this tutorial:

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

## Prerequisites

* [Azure CLI](/cli/azure/install-azure-cli)

::: zone pivot="container-apps-bicep"

* [Bicep](../azure-resource-manager/bicep/install.md)

::: zone-end

* An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Before you begin

This guide makes use of the following environment variables:

# [Bash](#tab/bash)

```bash
RESOURCE_GROUP="my-containerapps"
LOCATION="canadacentral"
CONTAINERAPPS_ENVIRONMENT="containerapps-env"
LOG_ANALYTICS_WORKSPACE="containerapps-logs"
STORAGE_ACCOUNT_CONTAINER="mycontainer"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="my-containerapps"
$LOCATION="canadacentral"
$CONTAINERAPPS_ENVIRONMENT="containerapps-env"
$LOG_ANALYTICS_WORKSPACE="containerapps-logs"
$STORAGE_ACCOUNT_CONTAINER="mycontainer"
```

---

The above snippet can be used to set the environment variables using bash, zsh, or PowerShell.

# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT="<storage account name>"
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT="<storage account name>"
```

---

Choose a name for `STORAGE_ACCOUNT`. It will be created in a following step. Storage account names must be *unique within Azure*.  It must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.

## Setup

Begin by signing in to Azure.

Run the following command, and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzAccount
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [PowerShell](#tab/powershell)

```azurecli
az upgrade
```

---

Next, install the Azure Container Apps extension to the CLI.

# [Bash](#tab/bash)

```azurecli
az extension add \
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.0-py2.py3-none-any.whl 
```

# [PowerShell](#tab/powershell)

```azurecli
az extension add `
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.0-py2.py3-none-any.whl 
```

---

Now that the extension is installed, register the `Microsoft.Web` namespace.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.Web
```

# [PowerShell](#tab/powershell)

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Web
```

---

Create a resource group to organize the services related to your new container app.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroup -Name $RESOURCE_GROUP -Location $LOCATION
```

---

With the CLI upgraded and a new resource group available, you can create a Container Apps environment and deploy your container app.

## Create an environment

Azure Container Apps environments act as isolation boundaries between a group of container apps. Container Apps deployed to the same environment share the same virtual network and write logs to the same Log Analytics workspace.

Azure Log Analytics is used to monitor your container app and is required when creating a Container Apps environment.

Create a new Log Analytics workspace with the following command:

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics workspace create \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $LOG_ANALYTICS_WORKSPACE
```

# [PowerShell](#tab/powershell)

```powershell
New-AzOperationalInsightsWorkspace `
  -Location $LOCATION `
  -Name $LOG_ANALYTICS_WORKSPACE `
  -ResourceGroupName $RESOURCE_GROUP
```

---

Next, retrieve the Log Analytics Client ID and client secret.

# [Bash](#tab/bash)

Make sure to run each query separately to give enough time for the request to complete.

```bash
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE -o tsv | tr -d '[:space:]'`
```

```bash
LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=`az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE -o tsv | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

Make sure to run each query separately to give enough time for the request to complete.

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_ID=(Get-AzOperationalInsightsWorkspace -ResourceGroupName $RESOURCE_GROUP -Name $LOG_ANALYTICS_WORKSPACE).CustomerId
```

<!--- This was taken out because of a breaking changes warning.  We should put it back after it's fixed. Until then we'll go with the az command
$LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=(Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName $RESOURCE_GROUP -Name $LOG_ANALYTICS_WORKSPACE).PrimarySharedKey
--->

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=(az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE --out tsv)
```

---

Individual container apps are deployed to an Azure Container Apps environment. To create the environment, run the following command:

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET \
  --location "$LOCATION"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $CONTAINERAPPS_ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID `
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET `
  --location "$LOCATION"
```

---

## Set up a state store

### Create an Azure Blob Storage account

Use the following command to create a new Azure Storage account.

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
New-AzStorageAccount -ResourceGroupName $RESOURCE_GROUP `
  -Name $STORAGE_ACCOUNT `
  -Location $LOCATION `
  -SkuName Standard_RAGRS
```

---

Once your Azure Blob Storage account is created, the following values are needed for subsequent steps in this tutorial.

* `storage_account_name` is the value of the `STORAGE_ACCOUNT` variable you chose above.

* `storage_container_name` is the value of `STORAGE_ACCOUNT_CONTAINER` defined above (for example, `mycontainer`). Dapr creates a container with this name if it doesn't already exist in your Azure Storage account.

Get the storage account key with the following command.

# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT_KEY=`az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --query '[0].value' --out tsv`
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT_KEY=(Get-AzStorageAccountKey -ResourceGroupName $RESOURCE_GROUP -AccountName $STORAGE_ACCOUNT)| Where-Object -Property KeyName -Contains 'key1' | Select-Object -ExpandProperty Value
```

---

::: zone pivot="container-apps-arm"

### Create Azure Resource Manager (ARM) templates

Create two Azure Resource Manager (ARM) templates.

The ARM template has the Container App definition and a Dapr component definition.

The following example shows how your ARM template should look when configured for your Azure Blob Storage account.

Save the following file as *serviceapp.json*:

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
        "storage_account_name": {
            "type": "String"
        },
        "storage_account_key": {
            "type": "String"
        },
        "storage_container_name": {
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "name": "nodeapp",
            "type": "Microsoft.Web/containerApps",
            "apiVersion": "2021-03-01",
            "kind": "containerapp",
            "location": "[parameters('location')]",
            "properties": {
                "kubeEnvironmentId": "[resourceId('Microsoft.Web/kubeEnvironments', parameters('environment_name'))]",
                "configuration": {
                    "ingress": {
                        "external": true,
                        "targetPort": 3000
                    },
                    "secrets": [
                        {
                            "name": "storage-key",
                            "value": "[parameters('storage_account_key')]"
                        }
                    ]
                },
                "template": {
                    "containers": [
                        {
                            "image": "dapriosamples/hello-k8s-node:latest",
                            "name": "hello-k8s-node",
                            "resources": {
                                "cpu": 0.5,
                                "memory": "1Gi"
                            }
                        }
                    ],
                    "scale": {
                        "minReplicas": 1,
                        "maxReplicas": 1
                    },
                    "dapr": {
                        "enabled": true,
                        "appPort": 3000,
                        "appId": "nodeapp",
                        "components": [
                            {
                                "name": "statestore",
                                "type": "state.azure.blobstorage",
                                "version": "v1",
                                "metadata": [
                                    {
                                        "name": "accountName",
                                        "value": "[parameters('storage_account_name')]"
                                    },
                                    {
                                        "name": "accountKey",
                                        "secretRef": "storage-key"
                                    },
                                    {
                                        "name": "containerName",
                                        "value": "[parameters('storage_container_name')]"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    ]
}
```

::: zone-end

::: zone pivot="container-apps-bicep"

### Create Azure Bicep templates

Create two Bicep templates.

The Bicep template has the Container App definition and a Dapr component definition.

The following example shows how your Bicep template should look when configured for your Azure Blob Storage account.

Save the following file as *serviceapp.bicep*:

```bicep
param location string = 'canadacentral'
param environment_name string
param storage_account_name string
param storage_account_key string
param storage_container_name string

resource nodeapp 'Microsoft.Web/containerapps@2021-03-01' = {
  name: 'nodeapp'
  kind: 'containerapp'
  location: location
  properties: {
    kubeEnvironmentId: resourceId('Microsoft.Web/kubeEnvironments', environment_name)
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
      }
      secrets: [
        {
          name: 'storage-key'
          value: storage_account_key
        }
      ]
    }
    template: {
      containers: [
        {
          image: 'dapriosamples/hello-k8s-node:latest'
          name: 'hello-k8s-node'
          resources: {
            cpu: '0.5'
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
      dapr: {
        enabled: true
        appPort: 3000
        appId: 'nodeapp'
        components: [
          {
            name: 'statestore'
            type: 'state.azure.blobstorage'
            version: 'v1'
            metadata: [
              {
                name: 'accountName'
                value: storage_account_name
              }
              {
                name: 'accountKey'
                secretRef: 'storage-key'
              }
              {
                name: 'containerName'
                value: storage_container_name
              }
            ]
          }
        ]
      }
    }
  }
}

```

::: zone-end

> [!NOTE]
> Container Apps does not currently support the native [Dapr components schema](https://docs.dapr.io/operations/components/component-schema/). The above example uses the supported schema.
>
> In a production-grade application, follow [secret management](https://docs.dapr.io/operations/components/component-secrets) instructions to securely manage your secrets.

::: zone pivot="container-apps-arm"

Save the following file as *clientapp.json*:

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
        }
    },
    "variables": {},
    "resources": [
        {
            "name": "pythonapp",
            "type": "Microsoft.Web/containerApps",
            "apiVersion": "2021-03-01",
            "kind": "containerapp",
            "location": "[parameters('location')]",
            "properties": {
                "kubeEnvironmentId": "[resourceId('Microsoft.Web/kubeEnvironments', parameters('environment_name'))]",
                "configuration": {},
                "template": {
                    "containers": [
                        {
                            "image": "dapriosamples/hello-k8s-python:latest",
                            "name": "hello-k8s-python",
                            "resources": {
                                "cpu": 0.5,
                                "memory": "1Gi"
                            }
                        }
                    ],
                    "scale": {
                        "minReplicas": 1,
                        "maxReplicas": 1
                    },
                    "dapr": {
                        "enabled": true,
                        "appId": "pythonapp"
                    }
                }
            }
        }
    ]
}
```

::: zone-end

::: zone pivot="container-apps-bicep"

Save the following file as *clientapp.bicep*:

```bicep
param location string = 'canadacentral'
param environment_name string

resource pythonapp 'Microsoft.Web/containerApps@2021-03-01' = {
  name: 'pythonapp'
  kind: 'containerapp'
  location: location
  properties: {
    kubeEnvironmentId: resourceId('Microsoft.Web/kubeEnvironments', environment_name)
    configuration: {}
    template: {
      containers: [
        {
          image: 'dapriosamples/hello-k8s-python:latest'
          name: 'hello-k8s-python'
          resources: {
            cpu: '0.5'
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
      dapr: {
        enabled: true
        appId: 'pythonapp'
      }
    }
  }
}
    
```

::: zone-end

## Deploy the service application (HTTP web server)

::: zone pivot="container-apps-arm"

Now let's deploy the service Container App.  Navigate to the directory in which you stored the ARM template file and run the command below.

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file ./serviceapp.json \
  --parameters \
      environment_name="$CONTAINERAPPS_ENVIRONMENT" \
      location="$LOCATION" \
      storage_account_name="$STORAGE_ACCOUNT" \
      storage_account_key="$STORAGE_ACCOUNT_KEY" \
      storage_container_name="$STORAGE_ACCOUNT_CONTAINER"
```

# [PowerShell](#tab/powershell)

```powershell
$params = @{
  environment_name = $CONTAINERAPPS_ENVIRONMENT
  location = $LOCATION
  storage_account_name =  $STORAGE_ACCOUNT
  storage_account_key = $STORAGE_ACCOUNT_KEY
  storage_container_name = $STORAGE_ACCOUNT_CONTAINER
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $RESOURCE_GROUP `
  -TemplateParameterObject $params `
  -TemplateFile ./serviceapp.json `
  -SkipTemplateParameterPrompt 
```

::: zone-end

::: zone pivot="container-apps-bicep"

Now let's deploy the service Container App.  Navigate to the directory in which you stored the Bicep template file and run the command below.

A warning (BCP081) may be displayed. This warning will have no effect on successfully deploying the Container App.

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file ./serviceapp.bicep \
  --parameters \
      environment_name="$CONTAINERAPPS_ENVIRONMENT" \
      location="$LOCATION" \
      storage_account_name="$STORAGE_ACCOUNT" \
      storage_account_key="$STORAGE_ACCOUNT_KEY" \
      storage_container_name="$STORAGE_ACCOUNT_CONTAINER"
```

# [PowerShell](#tab/powershell)

```powershell
$params = @{
  environment_name = $CONTAINERAPPS_ENVIRONMENT
  location = $LOCATION
  storage_account_name =  $STORAGE_ACCOUNT
  storage_account_key = $STORAGE_ACCOUNT_KEY
  storage_container_name = $STORAGE_ACCOUNT_CONTAINER
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $RESOURCE_GROUP `
  -TemplateParameterObject $params `
  -TemplateFile ./serviceapp.bicep `
  -SkipTemplateParameterPrompt 
```



::: zone-end

---

This command deploys the service (Node) app server on `targetPort: 3000` (the app's port) along with its accompanying Dapr sidecar configured with `"appId": "nodeapp",` and dapr `"appPort": 3000,` for service discovery and invocation. Your state store is configured using the `components` object of `"type": "state.azure.blobstorage"`, which enables the sidecar to persist state.

## Deploy the client application (headless client)

Run the command below to deploy the client container app.

::: zone pivot="container-apps-arm"

# [Bash](#tab/bash)

```azurecli
az deployment group create --resource-group "$RESOURCE_GROUP" \
  --template-file ./clientapp.json \
  --parameters \
      environment_name="$CONTAINERAPPS_ENVIRONMENT" \
      location="$LOCATION"
```

# [PowerShell](#tab/powershell)

```powershell
$params = @{
  environment_name = $CONTAINERAPPS_ENVIRONMENT
  location = $LOCATION
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $RESOURCE_GROUP `
  -TemplateParameterObject $params `
  -TemplateFile ./clientapp.json `
  -SkipTemplateParameterPrompt 
```

::: zone-end

::: zone pivot="container-apps-bicep"

A warning (BCP081) may be displayed. This warning will have no effect on successfully deploying the Container App.

# [Bash](#tab/bash)

```azurecli
az deployment group create --resource-group "$RESOURCE_GROUP" \
  --template-file ./clientapp.bicep \
  --parameters \
      environment_name="$CONTAINERAPPS_ENVIRONMENT" \
      location="$LOCATION"
```

# [PowerShell](#tab/powershell)

```powershell
$params = @{
  environment_name = $CONTAINERAPPS_ENVIRONMENT
  location = $LOCATION
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $RESOURCE_GROUP `
  -TemplateParameterObject $params `
  -TemplateFile ./clientapp.bicep `
  -SkipTemplateParameterPrompt 
```

::: zone-end

---

This command deploys `pythonapp` that also runs with a Dapr sidecar that is used to look up and securely call the Dapr sidecar for `nodeapp`. As this app is headless there's no `targetPort` to start a server, nor is there a need to enable ingress.

## Verify the result

### Confirm successful state persistence

You can confirm the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser and navigate to your storage account.

1. Select **Containers** on the left.

1. Select **mycontainer**.

1. Verify that you can see the file named `order` in the container.

1. Click on the file.

1. Click the **Edit** tab.

1. Click the **Refresh** button to observe updates.

### View Logs

Data logged via a container app are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or from the command line. You may need to wait a few minutes for the analytics to arrive for the first time before you can query the logged data.

Use the following command to view logs in bash or PowerShell.

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'nodeapp' and (Log_s contains 'persisted' or Log_s contains 'order') | project ContainerAppName_s, Log_s, TimeGenerated | take 5" \
  --out table
```

# [PowerShell](#tab/powershell)

```powershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $LOG_ANALYTICS_WORKSPACE_CLIENT_ID -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'nodeapp' and (Log_s contains 'persisted' or Log_s contains 'order') | project ContainerAppName_s, Log_s, TimeGenerated | take 5"
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

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Clean up resources

Once you're done, clean up your Container App resources by running the following command to delete your resource group.

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

This command deletes both container apps, the storage account, the container apps environment, and any other resources in the resource group.

> [!NOTE]
> Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)