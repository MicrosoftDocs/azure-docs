---
title: "Tutorial: Deploy a Dapr application to Azure Container Apps with an ARM or Bicep template"
description: Deploy a Dapr application to Azure Container Apps with an ARM or Bicep template.
services: container-apps
author: asw101
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/23/2022
ms.author: keroden
ms.custom: ignite-fall-2021, devx-track-azurecli, event-tier1-build-2022
zone_pivot_groups: container-apps
---

# Tutorial: Deploy a Dapr application to Azure Container Apps with an Azure Resource Manager or Bicep template

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps you build resilient stateless and stateful microservices. In this tutorial, a sample Dapr application is deployed to Azure Container Apps via an Azure Resource Manager (ARM) or Bicep template.

You learn how to:

> [!div class="checklist"]
> * Create an Azure Blob Storage for use as a Dapr state store
> * Deploy a Container Apps environment to host container apps
> * Deploy two dapr-enabled container apps: one that produces orders and one that consumes orders and stores them
> * Verify the interaction between the two microservices.

With Azure Container Apps, you get a [fully managed version of the Dapr APIs](./dapr-overview.md) when building microservices. When you use Dapr in Azure Container Apps, you can enable sidecars to run next to your microservices that provide a rich set of capabilities. Available Dapr APIs include [Service to Service calls](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/), [Pub/Sub](https://docs.dapr.io/developing-applications/building-blocks/pubsub/), [Event Bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/), [State Stores](https://docs.dapr.io/developing-applications/building-blocks/state-management/), and [Actors](https://docs.dapr.io/developing-applications/building-blocks/actors/).

In this tutorial, you deploy the same applications from the Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/tutorials/hello-world) quickstart.

The application consists of:

- A client (Python) container app to generate messages.
- A service (Node) container app to consume and persist those messages in a state store

The following architecture diagram illustrates the components that make up this tutorial:

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

## Prerequisites

- Install [Azure CLI](/cli/azure/install-azure-cli)

::: zone pivot="container-apps-bicep"

- [Bicep](../azure-resource-manager/bicep/install.md)

::: zone-end

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Before you begin

This guide uses the following environment variables:

# [Bash](#tab/bash)

```bash
RESOURCE_GROUP="my-containerapps"
LOCATION="canadacentral"
CONTAINERAPPS_ENVIRONMENT="containerapps-env"
STORAGE_ACCOUNT_CONTAINER="mycontainer"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="my-containerapps"
$LOCATION="canadacentral"
$CONTAINERAPPS_ENVIRONMENT="containerapps-env"
$STORAGE_ACCOUNT_CONTAINER="mycontainer"
```

---

# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT="<storage account name>"
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT="<storage account name>"
```

---

Choose a name for `STORAGE_ACCOUNT`. Storage account names must be _unique within Azure_. Be from 3 to 24 characters in length and contain numbers and lowercase letters only.

## Setup

First, sign in to Azure.

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

Next, install the Azure Container Apps extension for the Azure CLI.

# [Bash](#tab/bash)

```azurecli
az extension add --name containerapp --upgrade
```

# [PowerShell](#tab/powershell)

```azurecli
az extension add --name containerapp --upgrade
```

---

Now that the extension is installed, register the `Microsoft.App` namespace.

> [!NOTE]
> Azure Container Apps resources have migrated from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. Refer to [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109) for more details.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

# [PowerShell](#tab/powershell)

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.App
```

---

Create a resource group to organize the services related to your container apps.

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

## Set up a state store

### Create an Azure Blob Storage account

Use the following command to create an Azure Storage account.

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

Once your Azure Blob Storage account is created, you'll create a template where these storage parameters will use environment variable values.  The values are passed in via the `parameters` argument when you deploy your apps with the `az deployment group create` command.

- `storage_account_name` uses the value of the `STORAGE_ACCOUNT` variable.

- `storage_container_name` uses the value of the `STORAGE_ACCOUNT_CONTAINER` variable.  Dapr creates a container with this name when it doesn't already exist in your Azure Storage account.

::: zone pivot="container-apps-arm"

### Create Azure Resource Manager (ARM) template

Create an ARM template to deploy a Container Apps environment that includes:

* the associated Log Analytics workspace
* the Application Insights resource for distributed tracing
* a dapr component for the state store
* the two dapr-enabled container apps: [hello-k8s-node](https://hub.docker.com/r/dapriosamples/hello-k8s-node) and [hello-k8s-python](https://hub.docker.com/r/dapriosamples/hello-k8s-python)
  

Save the following file as _hello-world.json_:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environment_name": {
      "type": "string"
    },
    "location": {
      "defaultValue": "canadacentral",
      "type": "string"
    },
    "storage_account_name": {
      "type": "string"
    },
    "storage_container_name": {
      "type": "string"
    }
  },
  "variables": {
    "logAnalyticsWorkspaceName": "[concat('logs-', parameters('environment_name'))]",
    "appInsightsName": "[concat('appins-', parameters('environment_name'))]"
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-06-01",
      "name": "[variables('logAnalyticsWorkspaceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "retentionInDays": 30,
        "features": {
          "searchVersion": 1
        },
        "sku": {
          "name": "PerGB2018"
        }
      }
    },
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2020-02-02",
      "name": "[variables('appInsightsName')]",
      "location": "[parameters('location')]",
      "kind": "web",
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces/', variables('logAnalyticsWorkspaceName'))]"
      ],
      "properties": {
        "Application_Type": "web",
        "WorkspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', variables('logAnalyticsWorkspaceName'))]"
      }
    },
    {
      "type": "Microsoft.App/managedEnvironments",
      "apiVersion": "2022-03-01",
      "name": "[parameters('environment_name')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.Insights/components/', variables('appInsightsName'))]"
      ],
      "properties": {
        "daprAIInstrumentationKey": "[reference(resourceId('Microsoft.Insights/components/', variables('appInsightsName')), '2020-02-02').InstrumentationKey]",
        "appLogsConfiguration": {
          "destination": "log-analytics",
          "logAnalyticsConfiguration": {
            "customerId": "[reference(resourceId('Microsoft.OperationalInsights/workspaces/', variables('logAnalyticsWorkspaceName')), '2021-06-01').customerId]",
            "sharedKey": "[listKeys(resourceId('Microsoft.OperationalInsights/workspaces/', variables('logAnalyticsWorkspaceName')), '2021-06-01').primarySharedKey]"
          }
        }
      },
      "resources": [
        {
          "type": "daprComponents",
          "name": "statestore",
          "apiVersion": "2022-03-01",
          "dependsOn": [
            "[resourceId('Microsoft.App/managedEnvironments/', parameters('environment_name'))]"
          ],
          "properties": {
            "componentType": "state.azure.blobstorage",
            "version": "v1",
            "ignoreErrors": false,
            "initTimeout": "5s",
            "secrets": [
              {
                "name": "storageaccountkey",
                "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts/', parameters('storage_account_name')), '2021-09-01').keys[0].value]"
              }
            ],
            "metadata": [
              {
                "name": "accountName",
                "value": "[parameters('storage_account_name')]"
              },
              {
                "name": "containerName",
                "value": "[parameters('storage_container_name')]"
              },
              {
                "name": "accountKey",
                "secretRef": "storageaccountkey"
              }
            ],
            "scopes": ["nodeapp"]
          }
        }
      ]
    },
    {
      "type": "Microsoft.App/containerApps",
      "apiVersion": "2022-03-01",
      "name": "nodeapp",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.App/managedEnvironments/', parameters('environment_name'))]"
      ],
      "properties": {
        "managedEnvironmentId": "[resourceId('Microsoft.App/managedEnvironments/', parameters('environment_name'))]",
        "configuration": {
          "ingress": {
            "external": false,
            "targetPort": 3000
          },
          "dapr": {
            "enabled": true,
            "appId": "nodeapp",
            "appProcotol": "http",
            "appPort": 3000
          }
        },
        "template": {
          "containers": [
            {
              "image": "dapriosamples/hello-k8s-node:latest",
              "name": "hello-k8s-node",
              "env": [
                { 
                   "name": "APP_PORT",
                   "value": "3000"
                }
              ],  
              "resources": {
                "cpu": 0.5,
                "memory": "1.0Gi"
              }
            }
          ],
          "scale": {
            "minReplicas": 1,
            "maxReplicas": 1
          }
        }
      }
    },
    {
      "type": "Microsoft.App/containerApps",
      "apiVersion": "2022-03-01",
      "name": "pythonapp",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.App/managedEnvironments/', parameters('environment_name'))]",
        "[resourceId('Microsoft.App/containerApps/', 'nodeapp')]"
      ],
      "properties": {
        "managedEnvironmentId": "[resourceId('Microsoft.App/managedEnvironments/', parameters('environment_name'))]",
        "configuration": {
          "dapr": {
            "enabled": true,
            "appId": "pythonapp"
          }
        },
        "template": {
          "containers": [
            {
              "image": "dapriosamples/hello-k8s-python:latest",
              "name": "hello-k8s-python",
              "resources": {
                "cpu": 0.5,
                "memory": "1.0Gi"
              }
            }
          ],
          "scale": {
            "minReplicas": 1,
            "maxReplicas": 1
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

Create a bicep template to deploy a Container Apps environment that includes:

* the associated Log Analytics workspace
* the Application Insights resource for distributed tracing
* a dapr component for the state store
* the two dapr-enabled container apps: [hello-k8s-node](https://hub.docker.com/r/dapriosamples/hello-k8s-node) and [hello-k8s-python](https://hub.docker.com/r/dapriosamples/hello-k8s-python)

Save the following file as _hello-world.bicep_:

```bicep
param environment_name string
param location string = 'canadacentral'
param storage_account_name string
param storage_container_name string

var logAnalyticsWorkspaceName = 'logs-${environment_name}'
var appInsightsName = 'appins-${environment_name}'

resource logAnalyticsWorkspace'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: any({
    retentionInDays: 30
    features: {
      searchVersion: 1
    }
    sku: {
      name: 'PerGB2018'
    }
  })
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

resource environment 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: environment_name
  location: location
  properties: {
    daprAIInstrumentationKey: reference(appInsights.id, '2020-02-02').InstrumentationKey
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: reference(logAnalyticsWorkspace.id, '2021-06-01').customerId
        sharedKey: listKeys(logAnalyticsWorkspace.id, '2021-06-01').primarySharedKey
      }
    }
  }
  resource daprComponent 'daprComponents@2022-03-01' = {
    name: 'statestore'
    properties: {
      componentType: 'state.azure.blobstorage'
      version: 'v1'
      ignoreErrors: false
      initTimeout: '5s'
      secrets: [
        {
          name: 'storageaccountkey'
          value: listKeys(resourceId('Microsoft.Storage/storageAccounts/', storage_account_name), '2021-09-01').keys[0].value
        }
      ]
      metadata: [
        {
          name: 'accountName'
          value: storage_account_name
        }
        {
          name: 'containerName'
          value: storage_container_name
        }
        {
          name: 'accountKey'
          secretRef: 'storageaccountkey'
        }
      ]
      scopes: [
        'nodeapp'
      ]
    }
  }
}

resource nodeapp 'Microsoft.App/containerApps@2022-03-01' = {
  name: 'nodeapp'
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      ingress: {
        external: false
        targetPort: 3000
      }
      dapr: {
        enabled: true
        appId: 'nodeapp'
        appProtocol: 'http'
        appPort: 3000
      }
    }
    template: {
      containers: [
        {
          image: 'dapriosamples/hello-k8s-node:latest'
          name: 'hello-k8s-node'
          env: [
            {
              name: 'APP_PORT'
              value: '3000'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

resource pythonapp 'Microsoft.App/containerApps@2022-03-01' = {
  name: 'pythonapp'
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      dapr: {
        enabled: true
        appId: 'pythonapp'
      }
    }
    template: {
      containers: [
        {
          image: 'dapriosamples/hello-k8s-python:latest'
          name: 'hello-k8s-python'
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
  dependsOn: [
    nodeapp
  ]
}
```

::: zone-end

> [!NOTE]
> Container Apps does not currently support the native [Dapr components schema](https://docs.dapr.io/operations/components/component-schema/). The above example uses the supported schema.

## Deploy

::: zone pivot="container-apps-arm"

Navigate to the directory in which you stored the ARM template file and run the following command:

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file ./hello-world.json \
  --parameters \
      environment_name="$CONTAINERAPPS_ENVIRONMENT" \
      location="$LOCATION" \
      storage_account_name="$STORAGE_ACCOUNT" \
      storage_container_name="$STORAGE_ACCOUNT_CONTAINER"
```

# [PowerShell](#tab/powershell)

```powershell
$params = @{
  environment_name = $CONTAINERAPPS_ENVIRONMENT
  location = $LOCATION
  storage_account_name =  $STORAGE_ACCOUNT
  storage_container_name = $STORAGE_ACCOUNT_CONTAINER
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $RESOURCE_GROUP `
  -TemplateParameterObject $params `
  -TemplateFile ./hello-world.json `
  -SkipTemplateParameterPrompt
```

::: zone-end

::: zone pivot="container-apps-bicep"

Navigate to the directory in which you stored the Bicep template file and run the following command:

A warning (BCP081) might be displayed. This warning has no effect on the successful deployment of the application.

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file ./hello-world.bicep \
  --parameters \
      environment_name="$CONTAINERAPPS_ENVIRONMENT" \
      location="$LOCATION" \
      storage_account_name="$STORAGE_ACCOUNT" \
      storage_container_name="$STORAGE_ACCOUNT_CONTAINER"
```

# [PowerShell](#tab/powershell)

```powershell
$params = @{
  environment_name = $CONTAINERAPPS_ENVIRONMENT
  location = $LOCATION
  storage_account_name =  $STORAGE_ACCOUNT
  storage_container_name = $STORAGE_ACCOUNT_CONTAINER
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $RESOURCE_GROUP `
  -TemplateParameterObject $params `
  -TemplateFile ./hello-world.bicep `
  -SkipTemplateParameterPrompt
```

::: zone-end

---

This command deploys:

- the Container Apps environment and associated Log Analytics workspace for hosting the hello world dapr solution
- an Application Insights instance for Dapr distributed tracing
- the `nodeapp` app server running on `targetPort: 3000` with dapr enabled and configured using: `"appId": "nodeapp"` and `"appPort": 3000`
- the `daprComponents` object of `"type": "state.azure.blobstorage"` scoped for use by the `nodeapp` for storing state
- the headless `pythonapp` with no ingress and dapr enabled that calls the `nodeapp` service via dapr service-to-service communication

## Verify the result

### Confirm successful state persistence

You can confirm that the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser.

1. Navigate to your storage account.

1. Select **Containers** from the menu on the left side.

1. Select **mycontainer**.

1. Verify that you can see the file named `order` in the container.

1. Select on the file.

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

# [PowerShell](#tab/powershell)

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_ID=(az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv)
```

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

## Clean up resources

Once you're done, run the following command to delete your resource group along with all the resources you created in this tutorial.

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

> [!NOTE]
> Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
