---
title: "Overview of Azure Arc-enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: overview
author: mlearned
ms.author: mlearned
description: "This article provides an overview of Azure Arc-enabled Kubernetes."
keywords: "Kubernetes, Arc, Azure, containers"
ms.custom: references_regions
---

# What is Azure Arc-enabled Kubernetes Preview?

You can attach and configure Kubernetes clusters inside or outside of Azure by using Azure Arc-enabled Kubernetes Preview. When a Kubernetes cluster is attached to Azure Arc, it will appear in the Azure portal. It will have an Azure Resource Manager ID and a managed identity. Clusters are attached to standard Azure subscriptions, are located in a resource group, and can receive tags just like any other Azure resource. 

To connect a Kubernetes cluster to Azure, the cluster administrator needs to deploy agents. These agents run in a Kubernetes namespace named `azure-arc` and are standard Kubernetes deployments. The agents are responsible for connectivity to Azure, collecting Azure Arc logs and metrics, and watching for configuration requests. 

Azure Arc-enabled Kubernetes supports industry-standard SSL to secure data in transit. Also, data is stored encrypted at rest in an Azure Cosmos DB database to ensure data confidentiality.
 
 > [!NOTE]
> Azure Arc-enabled Kubernetes is in preview. We don't recommend it for production workloads. 


## Supported scenarios 

Azure Arc-enabled Kubernetes supports these scenarios: 

* Connect Kubernetes running outside of Azure for inventory, grouping, and tagging.

* Deploy applications and apply configuration by using GitOps-based configuration management. 

* Use Azure Monitor for containers to view and monitor your clusters. 

* Apply policies by using Azure Policy for Kubernetes. 

 
## Supported regions 

Azure Arc-enabled Kubernetes is currently supported in these regions: 

* East US 
* West Europe 

## Next steps

* [Connect a cluster](./connect-cluster.md)
