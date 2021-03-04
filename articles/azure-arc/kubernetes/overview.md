---
title: "Overview of Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 02/17/2021
ms.topic: overview
author: mlearned
ms.author: mlearned
description: "This article provides an overview of Azure Arc enabled Kubernetes."
keywords: "Kubernetes, Arc, Azure, containers"
ms.custom: references_regions
---

# What is Azure Arc enabled Kubernetes?

With Azure Arc enabled Kubernetes, you can attach and configure Kubernetes clusters located either inside or outside of Azure. When you connect a Kubernetes cluster to Azure Arc, it will:
* Appear in the Azure portal with an Azure Resource Manager ID and a managed identity. 
* Be attached to standard Azure subscriptions.
* Be placed in a resource group.
* Receive tags just like any other Azure resource. 

To connect a Kubernetes cluster to Azure, the cluster administrator needs to deploy agents. These agents:
* Run in the `azure-arc` Kubernetes namespace as standard Kubernetes deployments.
* Handle connectivity to Azure.
* Collect Azure Arc logs and metrics.
* Watch for configuration requests. 

Azure Arc enabled Kubernetes supports industry-standard SSL to secure data in transit. This data is stored encrypted and at rest in an Azure Cosmos DB database to ensure data confidentiality.
 
## Supported Kubernetes distributions

Azure Arc enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes cluster, such as:
* AKS-engine on Azure
* AKS-engine on Azure Stack Hub
* GKE
* EKS
* VMware vSphere

Azure Arc enabled Kubernetes features have been tested by the Arc team on the following distributions:
* RedHat OpenShift 4.3
* Rancher RKE 1.0.8
* Canonical Charmed Kubernetes 1.18
* AKS Engine
* AKS Engine on Azure Stack Hub
* AKS on Azure Stack HCI
* Cluster API Provider Azure

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

## Next steps

* [Connect a cluster](./connect-cluster.md)
