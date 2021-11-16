---
title: Prerequisites | Direct connect mode
description: Prerequisites to deploy the data controller in direct connect mode. 
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 11/03/2021
ms.topic: overview
---

# Prerequisites to deploy the data controller in direct connectivity mode

This article describes how to prepare to deploy a data controller for Azure Arc-enabled data services in direct connect mode. Before you deploy an Azure Arc data controller understand the concepts described in [Plan to deploy Azure Arc-enabled data services](plan-azure-arc-data-services.md).

At a high level, the prerequisites for creating Azure Arc data controller in **direct** connectivity mode include:

1. Connect Kubernetes cluster to Azure using Azure Arc-enabled Kubernetes
2. Create Azure Arc-enabled data services data controller. This step involves creating
    - Azure Arc data services extension
    - Custom location
    - Azure Arc data controller
3. If automatic upload of logs to Azure Log Analytics is desired, then the Log Analytics Workspace ID and the Shared Access key are needed as part of deployment.

## 1. Connect Kubernetes cluster to Azure using Azure Arc-enabled Kubernetes

To connect your kubernetes cluster to Azure, use Azure CLI `az` with the following extensions or Helm.

### Install tools

- Helm version 3.3+ ([install](https://helm.sh/docs/intro/install/))
- Install or upgrade to the latest version of Azure CLI ([install](https://aka.ms/installazurecliwindows))

### Add extensions for Azure CLI

Install the latest versions of the following az extensions:
- `k8s-extension`
- `connectedk8s`
- `k8s-configuration`
- `customlocation`

Run the following commands to install the az CLI extensions:

```azurecli
az extension add --name k8s-extension
az extension add --name connectedk8s
az extension add --name k8s-configuration
az extension add --name customlocation
```

If you've previously installed the `k8s-extension`, `connectedk8s`, `k8s-configuration`, `customlocation` extensions, update to the latest version using the following command:

```azurecli
az extension update --name k8s-extension
az extension update --name connectedk8s
az extension update --name k8s-configuration
az extension update --name customlocation
```

### Connect your cluster to Azure

To complete this task, follow the steps in [Connect an existing Kubernetes cluster to Azure arc](../kubernetes/quickstart-connect-cluster.md).

## 2. Optionally, keep the Log Analytics workspace ID and Shared access key ready

When you deploy Azure Arc-enabled data controller, you can enable automatic upload of metrics and logs during setup. Metrics upload uses the system assigned managed identity. However, uploading logs requires a Workspace ID and the access key for the workspace. 

You can also enable or disable automatic upload of metrics and logs after you deploy the data controller. 

## 3. Create Azure Arc data services

After you have completed these prerequisites, you can [Deploy Azure Arc data controller | Direct connect mode](create-data-controller-direct-azure-portal.md).
