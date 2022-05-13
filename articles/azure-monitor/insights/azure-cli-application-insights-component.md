---
title: Manage Application Insights components in Azure CLI
description: Use this sample code to manage components in Application Insights. This feature is part of Azure Monitor.
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 09/10/2012
ms.custom: devx-track-azurecli

---

# Manage Application Insights components by using Azure CLI

In Azure Monitor, components are independently deployable parts of your distributed or microservices application. Use these Azure CLI commands to manage components in Application Insights.

The examples in this article do the following management tasks:

- Create a component.
- Connect a component to a webapp.
- Link a component to a storage account with a component.
- Create a continuous export configuration for a component.

[!INCLUDE [Prepare your Azure CLI environment](../../../includes/azure-cli-prepare-your-environment.md)]

## Create a component

If you don't already have a resource group and workspace, create them by using [az group create](/cli/azure/group#az-group-create) and [az monitor log-analytics workspace create](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-create):

```azurecli
az group create --name ContosoAppInsightRG --location eastus2
az monitor log-analytics workspace create --resource-group ContosoAppInsightRG \
   --workspace-name AppInWorkspace
```

To create a component, run the [az monitor app-insights component create](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-create) command. The [az monitor app-insights component show](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-show) command displays the component.

```azurecli
az monitor app-insights component create --resource-group ContosoAppInsightRG \
   --app ContosoApp --location eastus2 --kind web --application-type web \
   --retention-time 120
az monitor app-insights component show --resource-group ContosoAppInsightRG --app ContosoApp
```

## Connect a webapp

This example connects your component to a webapp. You can create a webapp by using the [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create) and [az webapp create](/cli/azure/webapp#az-webapp-create) commands:

```azurecli
az appservice plan create --resource-group ContosoAppInsightRG --name ContosoAppService
az webapp create --resource-group ContosoAppInsightRG --name ContosoApp \
   --plan ContosoAppService --name ContosoApp8765
```

Run the [az monitor app-insights component connect-webapp](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-connect-webapp) command to connect your component to the webapp:

```azurecli
az monitor app-insights component connect-webapp --resource-group ContosoAppInsightRG \
   --app ContosoApp --web-app ContosoApp8765 --enable-debugger false --enable-profiler false
```

You can instead connect to an Azure function by using the [az monitor app-insights component connect-function](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-connect-function) command.

## Link a component to storage

You can link a component to a storage account. To create a storage account, use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command:

```azurecli
az storage account create --resource-group ContosoAppInsightRG \
   --name contosolinkedstorage --location eastus2 --sku Standard_LRS
```

To link your component to the storage account, run the [az monitor app-insights component linked-storage link](/cli/azure/monitor/app-insights/component/linked-storage#az-monitor-app-insights-component-linked-storage-link) command. You can see the existing links by using the [az monitor app-insights component linked-storage show](/cli/azure/monitor/app-insights/component/linked-storage#az-monitor-app-insights-component-linked-storage-show) command:


```azurecli
az monitor app-insights component linked-storage link  --resource-group ContosoAppInsightRG \
   --app ContosoApp --storage-account contosolinkedstorage
az monitor app-insights component linked-storage show --resource-group ContosoAppInsightRG \
   --app ContosoApp
```

To unlink the storage, run the [az monitor app-insights component linked-storage unlink](/cli/azure/monitor/app-insights/component/linked-storage#az-monitor-app-insights-component-linked-storage-unlink) command:

```AzureCLI
az monitor app-insights component linked-storage unlink  \
   --resource-group ContosoAppInsightRG --app ContosoApp
```

## Set up continuous export

Continuous export saves events from Application Insights portal in a storage container in JSON format.

> [!NOTE]
> Continuous export is only supported for classic Application Insights resources. [Workspace-based Application Insights resources](../app/create-workspace-resource.md) must use [diagnostic settings](../app/create-workspace-resource.md#export-telemetry).
>

To create a storage container, run the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command. 

```azurecli
az storage container create --name contosostoragecontainer --account-name contosolinkedstorage \
   --public-access blob 
```

You need access for the container to be write only. Run the [az storage container policy create](/cli/azure/storage/container/policy#az-storage-container-policy-create) cmdlet:

```azurecli
az storage container policy create --container-name contosostoragecontainer \
   --account-name contosolinkedstorage --name WAccessPolicy --permissions w
```

Create an SAS key by using the [az storage container generate-sas](/cli/azure/storage/container#az-storage-container-generate-sas) command. Be sure to use the `--output tsv` parameter value to save the key without unwanted formatting like quotation marks. For more information, see [Use Azure CLI effectively](/cli/azure/use-cli-effectively).

```azurecli
containersas=$(az storage container generate-sas --name contosostoragecontainer \
   --account-name contosolinkedstorage --permissions w --output tsv)
```

To create a continuous export, run the [az monitor app-insights component continues-export create](/cli/azure/monitor/app-insights/component/continues-export#az-monitor-app-insights-component-continues-export-create) command:

```azurecli
az monitor app-insights component continues-export create --resource-group ContosoAppInsightRG \
   --app ContosoApp --record-types Event --dest-account contosolinkedstorage \
   --dest-container contosostoragecontainer --dest-sub-id 00000000-0000-0000-0000-000000000000 \
   --dest-sas $containersas
```

You can delete a configured continuous export by using the [az monitor app-insights component continues-export delete](/cli/azure/monitor/app-insights/component/continues-export#az-monitor-app-insights-component-continues-export-delete) command: 

```azurecli
az monitor app-insights component continues-export list \
   --resource-group ContosoAppInsightRG --app ContosoApp
az monitor app-insights component continues-export delete \
   --resource-group ContosoAppInsightRG --app ContosoApp --id abcdefghijklmnopqrstuvwxyz=
```

## Clean up deployment

If you created a resource group to test these commands, you can remove the resource group and all its contents by using the [az group delete](/cli/azure/group#az-group-delete) command:

```azurecli
az group delete --name ContosoAppInsightRG 
```

## Azure CLI commands used in this article

- [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create)
- [az group create](/cli/azure/group#az-group-create)
- [az group delete](/cli/azure/group#az-group-delete)
- [az monitor app-insights component connect-webapp](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-connect-webapp)
- [az monitor app-insights component continues-export create](/cli/azure/monitor/app-insights/component/continues-export#az-monitor-app-insights-component-continues-export-create)
- [az monitor app-insights component continues-export delete](/cli/azure/monitor/app-insights/component/continues-export#az-monitor-app-insights-component-continues-export-delete)
- [az monitor app-insights component continues-export list](/cli/azure/monitor/app-insights/component/continues-export#az-monitor-app-insights-component-continues-export-list)
- [az monitor app-insights component create](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-create)
- [az monitor app-insights component linked-storage link](/cli/azure/monitor/app-insights/component/linked-storage#az-monitor-app-insights-component-linked-storage-link)
- [az monitor app-insights component linked-storage unlink](/cli/azure/monitor/app-insights/component/linked-storage#az-monitor-app-insights-component-linked-storage-unlink)
- [az monitor app-insights component show](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-show)
- [az monitor log-analytics workspace create](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-create)
- [az storage account create](/cli/azure/storage/account#az-storage-account-create)
- [az storage container create](/cli/azure/storage/container#az-storage-container-create)
- [az storage container generate-sas](/cli/azure/storage/container#az-storage-container-generate-sas)
- [az storage container policy create](/cli/azure/storage/container/policy#az-storage-container-policy-create)
- [az webapp create](/cli/azure/webapp#az-webapp-create)

## Next steps

[Azure Monitor CLI samples](../cli-samples.md)

[Find and diagnose performance issues](../app/tutorial-performance.md)

[Monitor and alert on application health](../app/tutorial-alert.md)
