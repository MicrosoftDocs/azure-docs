---
title: "Overview of Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 03/03/2021
ms.topic: overview
author: mlearned
ms.author: mlearned
description: "This article provides an overview of Azure Arc enabled Kubernetes."
keywords: "Kubernetes, Arc, Azure, containers"
ms.custom: references_regions
---

# What is Azure Arc enabled Kubernetes?

With Azure Arc enabled Kubernetes, you can attach and configure Kubernetes clusters located either inside or outside Azure. When you connect a Kubernetes cluster to Azure Arc, it will:
* Appear in the Azure portal with an Azure Resource Manager ID and a managed identity. 
* Are placed in an Azure subscription and resource group.
* Receive tags just like any other Azure resource. 

To connect a Kubernetes cluster to Azure, the cluster administrator needs to deploy agents. These agents:
* Run in the `azure-arc` Kubernetes namespace as standard Kubernetes deployments.
* Handle connectivity to Azure.
* Collect Azure Arc logs and metrics.
* Watch for configuration requests. 

Azure Arc enabled Kubernetes supports industry-standard SSL to secure data in transit. Also, data is stored encrypted at rest in an Azure Cosmos DB database to ensure data confidentiality.

## Supported Kubernetes distributions

Azure Arc enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. The Azure Arc team has worked with [key industry partners to validate conformance](./validation-program.md) of their Kubernetes distributions with Azure Arc enabled Kubernetes.

## Supported scenarios 

Azure Arc enabled Kubernetes supports the following scenarios: 

* Connect Kubernetes running outside of Azure for inventory, grouping, and tagging.

* Deploy applications and apply configuration using GitOps-based configuration management. 

* View and monitor your clusters using Azure Monitor for containers. 

* Apply policies using Azure Policy for Kubernetes. 

[!INCLUDE [azure-lighthouse-supported-service](../../../includes/azure-lighthouse-supported-service.md)]

## Supported regions 

Azure Arc enabled Kubernetes is currently supported in these regions: 

* East US
* West Europe
* West Central US
* South Central US
* Southeast Asia
* UK South
* West US 2
* Australia East
* East US 2
* North Europe

## Next steps

Learn how to connect a cluster to Azure Arc.
> [!div class="nextstepaction"]
> [Connect a cluster to Azure Arc](./quickstart-connect-cluster.md)
