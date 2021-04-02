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

# Deploy data controller - direct connect mode (prerequisites)

This article describes how to prepare to deploy a data controller for Azure Arc enabled data services in direct connect mode.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

At a high level summary, the prerequisites include:

1. Install tools
1. Add extensions
1. Create the service principal and configure roles for metrics
1. Connect Kubernetes cluster to Azure using Azure Arc enabled Kubernetes

After you have completed these prerequisites, you can [Deploy Azure Arc data controller | Direct connect mode](deploy-data-controller-direct-mode.md).

The remaining sections of this article identify the prerequisites.

## Install tools

- Helm version 3.3+ ([install](https://helm.sh/docs/intro/install/))
- Azure CLI ([install](/sql/azdata/install/deploy-install-azdata))

## Add extensions for Azure CLI

Additionally, the following az extensions are also required:
- Azure CLI `k8s-extension` extension (0.2.0)
- Azure CLI `customlocation` (0.1.0)

Sample `az` and its CLI extensions would be:

```console
$ az version
{
  "azure-cli": "2.19.1",
  "azure-cli-core": "2.19.1",
  "azure-cli-telemetry": "1.0.6",
  "extensions": {
    "connectedk8s": "1.1.0",
    "customlocation": "0.1.0",
    "k8s-configuration": "1.0.0",
    "k8s-extension": "0.2.0"
  }
}
```

## Create service principal and configure roles for metrics

Follow the steps detailed in the [Upload metrics](upload-metrics-and-logs-to-azure-monitor.md) article and create a Service Principal and grant the roles as described the article. 

The SPN ClientID, TenantID, and Client Secret information will be required when you [deploy Azure Arc data controller](deploy-data-controller-direct-mode.md). 

## Connect Kubernetes cluster to Azure using Azure Arc enabled Kubernetes

To complete this task, follow the steps in [Connect an existing Kubernetes cluster to Azure arc](../kubernetes/quickstart-connect-cluster.md).

## Next steps

After you have completed these prerequisites, you can [Deploy Azure Arc data controller | Direct connect mode](deploy-data-controller-direct-mode.md).
