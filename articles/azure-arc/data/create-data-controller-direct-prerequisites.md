---
title: Prerequisites | Direct connect mode
description: Prerequisites to deploy the data controller in direct connect mode. 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/31/2021
ms.topic: overview
---

# Prerequisites to deploy the data controller in direct connectivity mode

This article describes how to prepare to deploy a data controller for Azure Arc enabled data services in direct connect mode. Deploying Azure Arc data controller requires additional understanding and concepts as described in [Plan to deploy Azure Arc enabled data services](plan-azure-arc-data-services.md).

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

At a high level, the prerequisites for creating Azure Arc data controller in **direct** connectivity mode include:

1. Connect Kubernetes cluster to Azure using Azure Arc enabled Kubernetes
2. Create the service principal and configure roles for metrics

## Connect Kubernetes cluster to Azure using Azure Arc enabled Kubernetes

Connecting your kubernetes cluster to Azure can be done by using the ```az``` CLI, with the following extensions as well as Helm.

#### Install tools

- Helm version 3.3+ ([install](https://helm.sh/docs/intro/install/))
- Install or upgrade to the latest version of Azure CLI ([install](/sql/azdata/install/deploy-install-azdata))

#### Add extensions for Azure CLI

Install the latest versions of the following az extensions:
- ```k8s-extension```
- ```connectedk8s```
- ```k8s-configuration```
- `customlocation`

```azurecli
az extension add --name k8s-extension
az extension add --name connectedk8s
az extension add --name k8s-configuration
az extension add --name customlocation
```

If you've previously installed the ```k8s-extension```, ```connectedk8s```, ```k8s-configuration```, `customlocation` extensions, update to the latest version using the following command:

```azurecli
az extension update --name k8s-extension
az extension update --name connectedk8s
az extension update --name k8s-configuration
az extension update --name customlocation
```

In order to deploy the Azure Arc data controller in **direct** connectivity mode, the kubernetes cluster needs to be Arc-enabled. To complete this task, follow the steps in [Connect an existing Kubernetes cluster to Azure arc](../kubernetes/quickstart-connect-cluster.md).





## Create service principal and configure roles for metrics

Follow the steps detailed in the [Upload metrics](upload-metrics-and-logs-to-azure-monitor.md) article and create a Service Principal and grant the roles as described the article. 

The SPN ClientID, TenantID, and Client Secret information will be required when you [deploy Azure Arc data controller](create-data-controller-direct-azure-portal.md). 




## Next steps

After you have completed these prerequisites, you can [Deploy Azure Arc data controller | Direct connect mode](create-data-controller-direct-azure-portal.md).
