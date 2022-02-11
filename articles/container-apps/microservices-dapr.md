---
title: 'Tutorial: Deploy a Dapr application to Azure Container Apps using the Azure CLI'
description: Deploy a Dapr application to Azure Container Apps using the Azure CLI.
services: container-apps
author: asw101
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aawislan
ms.custom: ignite-fall-2021
---

# Tutorial: Deploy a Dapr application to Azure Container Apps using the Azure CLI

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps build resilient, stateless, and stateful microservices. In this tutorial, a sample Dapr application is deployed to Azure Container Apps.

You learn how to:

> [!div class="checklist"]

> * Create a Container Apps environment for your container apps
> * Create an Azure Blob Storage state store for the container app
> * Deploy two apps that produce and consume messages and persist them in the state store
> * Verify the interaction between the two microservices.

With Azure Container Apps, you get a fully managed version of the Dapr APIs when building microservices. When you use Dapr in Azure Container Apps, you can enable sidecars to run next to your microservices that provide a rich set of capabilities. Available Dapr APIs include [Service to Service calls](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/), [Pub/Sub](https://docs.dapr.io/developing-applications/building-blocks/pubsub/), [Event Bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/), [State Stores](https://docs.dapr.io/developing-applications/building-blocks/state-management/), and [Actors](https://docs.dapr.io/developing-applications/building-blocks/actors/).

In this tutorial, you deploy the same applications from the Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/hello-kubernetes) quickstart. 

The application consists of:

* a client (Python) app that generates messages 
* a service (Node) app that consumes and persists those messages in a configured state store

The following architecture diagram illustrates the components that make up this tutorial:

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

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


Choose a name for `STORAGE_ACCOUNT`. Storage account names must be *unique within Azure*, from 3 to 24 characters in length and must contain numbers and lowercase letters only.


# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT="<storage account name>"
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT="<storage account name>"
```

---

Set the `STORAGE_ACCOUNT_CONTAINER` name.

# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT_CONTAINER="mycontainer"
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT_CONTAINER="mycontainer"
```

---

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

Once your Azure Blob Storage account is created, the following values are needed for subsequent steps in this tutorial.

* `storage_account_name` is the value of the `STORAGE_ACCOUNT` variable that you set previously.

* `storage_container_name` is the value of the `STORAGE_ACCOUNT_CONTAINER` variable. Dapr creates a container with this name when it doesn't already exist in your Azure Storage account.

Get the storage account key with the following command:

# [Bash](#tab/bash)

```bash
STORAGE_ACCOUNT_KEY=`az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --query '[0].value' --out tsv`
```

# [PowerShell](#tab/powershell)

```powershell
$STORAGE_ACCOUNT_KEY=(Get-AzStorageAccountKey -ResourceGroupName $RESOURCE_GROUP -AccountName $STORAGE_ACCOUNT)| Where-Object -Property KeyName -Contains 'key1' | Select-Object -ExpandProperty Value
```


---

### Configure the state store component

Create a config file named *components.yaml* with the properties that you sourced from the previous steps. This file helps enable your Dapr app to access your state store. The following example shows how your *components.yaml* file should look when configured for your Azure Blob Storage account:

```yaml
# components.yaml for Azure Blob storage component
- name: statestore
  type: state.azure.blobstorage
  version: v1
  metadata:
  # Note that in a production scenario, account keys and secrets 
  # should be securely stored. For more information, see
  # https://docs.dapr.io/operations/components/component-secrets
  - name: accountName
    secretRef: storage-account-name
  - name: accountKey
    secretRef: storage-account-key
  - name: containerName
    value: mycontainer
```

To use this file, make sure to replace the value of `containerName` with your own value if you have changed `STORAGE_ACCOUNT_CONTAINER` variable from its original value, `mycontainer`.

> [!NOTE]
> Container Apps does not currently support the native [Dapr components schema](https://docs.dapr.io/operations/components/component-schema/). The above example uses the supported schema.


## Deploy the service application (HTTP web server)

Navigate to the directory in which you stored the *components.yaml* file and run the following command to deploy the service container app.

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name nodeapp \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image dapriosamples/hello-k8s-node:latest \
  --target-port 3000 \
  --ingress 'external' \
  --min-replicas 1 \
  --max-replicas 1 \
  --enable-dapr \
  --dapr-app-port 3000 \
  --dapr-app-id nodeapp \
  --secrets "storage-account-name=${STORAGE_ACCOUNT},storage-account-key=${STORAGE_ACCOUNT_KEY}" \
  --dapr-components ./components.yaml
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name nodeapp `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENVIRONMENT `
  --image dapriosamples/hello-k8s-node:latest `
  --target-port 3000 `
  --ingress 'external' `
  --min-replicas 1 `
  --max-replicas 1 `
  --enable-dapr `
  --dapr-app-port 3000 `
  --dapr-app-id nodeapp `
  --secrets "storage-account-name=${STORAGE_ACCOUNT},storage-account-key=${STORAGE_ACCOUNT_KEY}" `
  --dapr-components ./components.yaml
```

---

This command deploys:

* the service (Node) app server on `--target-port 3000` (the app port) 
* its accompanying Dapr sidecar configured with `--dapr-app-id nodeapp` and `--dapr-app-port 3000` for service discovery and invocation

Your state store is configured using `--dapr-components ./components.yaml`, which enables the sidecar to persist state.


## Deploy the client application (headless client)

Run the following command to deploy the client container app.

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

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name pythonapp `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENVIRONMENT `
  --image dapriosamples/hello-k8s-python:latest `
  --min-replicas 1 `
  --max-replicas 1 `
  --enable-dapr `
  --dapr-app-id pythonapp
```

---

This command deploys `pythonapp` that also runs with a Dapr sidecar that is used to look up and securely call the Dapr sidecar for `nodeapp`. As this app is headless there is no `--target-port` to start a server, nor is there a need to enable ingress.

## Verify the result

### Confirm successful state persistence

You can confirm that the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser and navigate to your storage account.

1. Select **Containers** left side menu.

1. Select **mycontainer**.

1. Verify that you can see the file named `order` in the container.

1. Select on the file.

1. Select the **Edit** tab.

1. Select the **Refresh** button to observe how the data automatically updates.

### View Logs

Data logged via a container app are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or with the CLI. Wait a few minutes for the analytics to arrive for the first time before you are able to query the logged data.

Use the following CLI command to view logs on the command line.

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

The following output demonstrates the type of response to expect from the CLI command.

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

Once you are done, run the following command to delete your resource group along with all the resources you created in this tutorial.

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

This command deletes the resource group that includes all of the resources created in this tutorial.

> [!NOTE]
> Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
