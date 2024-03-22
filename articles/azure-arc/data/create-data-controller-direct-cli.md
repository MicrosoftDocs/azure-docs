---

title: Create Azure Arc data controller | Direct connect mode
description: Explains how to create the data controller in direct connect mode. 
author: AbdullahMSFT
ms.author: amamun
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
ms.date: 05/27/2022
ms.topic: overview
---

#  Create Azure Arc data controller in direct connectivity mode using CLI

This article describes how to create the Azure Arc data controller in direct connectivity mode using Azure CLI. 

## Complete prerequisites

Before you begin, verify that you have completed the prerequisites in [Deploy data controller - direct connect mode - prerequisites](create-data-controller-direct-prerequisites.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Deploy Arc data controller

Creating an Azure Arc data controller in direct connectivity mode involves the following steps:

1. Create an Azure Arc-enabled data services extension.
1. Create a custom location.
1. Create the data controller.

Create the Arc data controller extension, custom location, and Arc data controller all in one command as follows: 

##### [Linux](#tab/linux)

```console
## variables for Azure subscription, resource group, cluster name, location, extension, and namespace.
export resourceGroup=<Your resource group>
export clusterName=<name of your connected Kubernetes cluster>
export customLocationName=<name of your custom location>

## variables for logs and metrics dashboard credentials
export AZDATA_LOGSUI_USERNAME=<username for Kibana dashboard>
export AZDATA_LOGSUI_PASSWORD=<password for Kibana dashboard>
export AZDATA_METRICSUI_USERNAME=<username for Grafana dashboard>
export AZDATA_METRICSUI_PASSWORD=<password for Grafana dashboard>
```

##### [Windows (PowerShell)](#tab/windows)

``` PowerShell
## variables for Azure location, extension and namespace
$ENV:resourceGroup="<Your resource group>"
$ENV:clusterName="<name of your connected Kubernetes cluster>"
$ENV:customLocationName="<name of your custom location>" 

## variables for Metrics and Monitoring dashboard credentials
$ENV:AZDATA_LOGSUI_USERNAME="<username for Kibana dashboard>"
$ENV:AZDATA_LOGSUI_PASSWORD="<password for Kibana dashboard>"
$ENV:AZDATA_METRICSUI_USERNAME="<username for Grafana dashboard>"
$ENV:AZDATA_METRICSUI_PASSWORD="<password for Grafana dashboard>"
```

--- 

Deploy the Azure Arc data controller using released profile
##### [Linux](#tab/linux)

```azurecli
az arcdata dc create --name <name> -g ${resourceGroup} --custom-location ${customLocationName} --cluster-name ${clusterName} --connectivity-mode direct --profile-name <the-deployment-profile> --auto-upload-metrics true --auto-upload-logs true --storage-class <storageclass>

# Example
az arcdata dc create --name arc-dc1 --resource-group my-resource-group ----custom-location cl-name --connectivity-mode direct --profile-name azure-arc-aks-premium-storage  --auto-upload-metrics true --auto-upload-logs true --storage-class mystorageclass
```

##### [Windows (PowerShell)](#tab/windows)

```azurecli
az arcdata dc create --name <name> -g $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --profile-name <the-deployment-profile> --auto-upload-metrics true --auto-upload-logs true --storage-class <storageclass>

# Example
az arcdata dc create --name arc-dc1 --g $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --profile-name azure-arc-aks-premium-storage  --auto-upload-metrics true --auto-upload-logs true --storage-class mystorageclass

```

---
If you want to create the Azure Arc data controller using a custom configuration template, follow the steps described in [Create custom configuration profile](create-custom-configuration-template.md) and provide the path to the file as follows:
##### [Linux](#tab/linux)

```azurecli
az arcdata dc create --name  -g ${resourceGroup} --custom-location ${customLocationName} --cluster-name ${clusterName} --connectivity-mode direct --path ./azure-arc-custom --auto-upload-metrics true --auto-upload-logs true

# Example
az arcdata dc create --name arc-dc1 --resource-group my-resource-group ----custom-location cl-name --connectivity-mode direct --path ./azure-arc-custom  --auto-upload-metrics true --auto-upload-logs true
```

##### [Windows (PowerShell)](#tab/windows)

```azurecli
az arcdata dc create --name <name> -g $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --path ./azure-arc-custom  --auto-upload-metrics true --auto-upload-logs true --storage-class <storageclass>

# Example
az arcdata dc create --name arc-dc1 --resource-group $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --path ./azure-arc-custom --auto-upload-metrics true --auto-upload-logs true --storage-class mystorageclass

```

---

## Monitor the status of Azure Arc data controller deployment

The deployment status of the Arc data controller on the cluster can be monitored as follows:

```console
kubectl get datacontrollers --namespace arc
```

## Related content

[Create an Azure Arc-enabled PostgreSQL server](create-postgresql-server.md)

[Create a SQL Managed Instance enabled by Azure Arc](create-sql-managed-instance.md)
