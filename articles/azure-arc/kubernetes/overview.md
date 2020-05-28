---
title: "Azure Arc-enabled Kubernetes overview"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: overview
author: mlearned
ms.author: mlearned
description: ""
keywords: "Kubernetes, Arc, Azure, containers"
---

# What is Azure Arc-enabled Kubernetes (Preview)

You can attach and configure Kubernetes clusters inside or outside of Azure with Azure Arc enabled Kubernetes (Preview). When a Kubernetes cluster is attached to Azure Arc, it will appear in the Azure Portal, have an Azure Resource Manager ID, and a Managed Identity. Clusters are attached to standard Azure subscriptions, live in a resource group, and can receive tags just like any other Azure resource.

Connecting a Kubernetes cluster to Azure requires a cluster administrator to deploy agents. These agents run in a Kubernetes namespace named `azure-arc` and are standard Kubernetes deployments. The agents are responsible for connectivity to Azure, collecting Azure Arc logs and metrics, and watching for configuration requests.

Azure Arc enabled Kubernetes supports industry-standard SSL to secure data in transit. Also, data is stored encrypted at rest in CosmosDB database to ensure data confidentiality.

 > [!NOTE]
> Azure Arc enabled Kubernetes is in preview and is not recommended for production workloads.


## Supported Scenarios

Azure Arc enabled Kubernetes supports the following scenarios:

* Connecting Kubernetes running outside of Azure for inventory, grouping, and tagging

* Deploy applications and apply configuration using GitOps-based configuration management

* Use Azure Monitor for containers to view and monitor your clusters

* Apply policies using Azure Policy for Kubernetes


## Supported Regions

Azure Arc enabled Kubernetes is currently supported in the following regions:

* East US
* West Europe


## Next steps

* [Connect a cluster](./connect-cluster.md)
