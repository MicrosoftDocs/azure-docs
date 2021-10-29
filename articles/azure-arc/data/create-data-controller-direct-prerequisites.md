---
title: Prerequisites | Direct connect mode
description: Prerequisites to deploy the data controller in direct connect mode. 
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/31/2021
ms.topic: overview
---

# Prerequisites to deploy the data controller in direct connectivity mode

This article describes how to prepare to deploy a data controller for Azure Arc-enabled data services in direct connect mode. Deploying Azure Arc data controller requires additional understanding and concepts as described in [Plan to deploy Azure Arc-enabled data services](plan-azure-arc-data-services.md).


At a high level, the prerequisites for creating Azure Arc data controller in **direct** connectivity mode include:

1. Connect Kubernetes cluster to Azure using Azure Arc-enabled Kubernetes
2. Create Azure Arc-enabled data services data controller. This step involves creating
    - Azure Arc data services extension
    - Custom location
    - Azure Arc data controller
3. If automatic upload of logs to Azure Log Analytics is desired, then the Log Analytics Workspace ID and the Shared Access key are needed as part of deployment.

## 1. Connect Kubernetes cluster to Azure using Azure Arc-enabled Kubernetes

Connecting your kubernetes cluster to Azure can be done by using the ```az``` CLI, with the following extensions as well as Helm.

#### Install tools

- Install or upgrade to the latest version of Azure CLI ([install](/sql/azdata/install/deploy-install-azdata)) 

#### Add extensions for Azure CLI

Install the latest versions of the following az extensions:
- ```k8s-extension```
- ```connectedk8s```
- ```k8s-configuration```
- `customlocation`

Run the following commands to install the az CLI extensions:

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
#### Connect your cluster to Azure

To complete this task, follow the steps in [Connect an existing Kubernetes cluster to Azure arc](../kubernetes/quickstart-connect-cluster.md).

After you connect your cluster to Azure, continue to create a Service Principal. 

## 2. Optionally, keep the Log Analytics workspace ID and Shared access key ready

During deployment of Azure Arc data controller, automaic upload of metrics and logs can be enabled as part of initial setup. Metrics upload will use the system assigned managed identity. However, uploading logs requires a Workspace ID and the access key for the workspace. 

Note that automatic upload of metrics and logs can also be enabled or disabled post deployment of Azure Arc data controller. 

## 3. Create Azure Arc data services

After you have completed these prerequisites, you can [Deploy Azure Arc data controller | Direct connect mode](create-data-controller-direct-azure-portal.md).
