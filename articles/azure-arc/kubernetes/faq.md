---
title: "Frequently Asked Questions"
services: azure-arc
ms.service: azure-arc
ms.date: 02/08/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article contains a list of frequently asked questions related to Azure Arc enabled Kubernetes"
keywords: "Kubernetes, Arc, Azure, containers, configuration, GitOps, faq"
---

# Frequently Asked Questions

## Azure Arc enabled Kubernetes or Azure Kubernetes Service? Which one to use?
* What is the difference between Azure Arc enabled Kubernetes and Azure Kubernetes Service (AKS)?

    Azure Kubernetes Service (AKS) is the managed Kubernetes offering by Azure. AKS makes it simple to deploy a managed Kubernetes cluster in Azure. AKS reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure. The Kubernetes masters are managed by Azure. You only manage and maintain the agent nodes.

    Azure Arc enabled Kubernetes allows you to connect Kubernetes clusters to Azure for extending Azure's management capabilities like Azure Monitor and Azure Policy. The maintenance of the underlying Kubernetes cluster itself is done by you.

* Do I need to connect my Azure Kubernetes Service clusters running on Azure to Azure Arc?

    No. All features of Azure Arc enabled Kubernetes like Azure Monitor, Azure Policy (Gatekeeper) are natively available with AKS, which already has a resource representation in Azure.
    
* Should I connect my AKS cluster on Azure Stack HCI to Azure Arc? What about Kubernetes clusters running on Azure Stack Hub or Azure Stack Edge?

    Yes, connecting these clusters to Azure Arc does have benefits. It provides a resource representation for these Kubernetes clusters in Azure Resource Manager. Using this resource representation, capabilities like Cluster Configuration, Azure Monitor, Azure Policy (Gatekeeper) can be extended to these Kubernetes clusters


## Configuration and GitOps
* I am already using CI/CD pipelines like Azure Pipelines and GitHub Actions to deploy workloads to my Kubernetes cluster. Can I still use Azure Arc enabled Kubernetes and configurations (GitOps) on this Kubernetes cluster?

    Yes, you can use configurations on a cluster being deployed to by a CI/CD pipeline. Configurations feature 2 more additional benefits when compared to traditional CI/CD pipelines:
    
    1. **Drift reconciliation:** Unlike CI/CD pipelines whose scope of deployment only extends to the duration of the pipeline run, the GitOps operator on the cluster continuously polls the Git repository to fetch the desired state of Kubernetes resources on the cluster. If it finds the desired state of resources to be different from the actual state of resources on the cluster, this drift is reconciled
    1. **At-scale enforcement:** CI/CD pipelines don't provide any easy way to enforce configurations at-scale on your entire inventory of Kubernetes clusters in one go. On the other hand, the Azure Resource Manager representation of configurations as an extension resource to Arc enabled Kubernetes resource allows for use of Azure Policy to automate application of the desired configuration on all Kubernetes clusters under a subscription or resource group in one go. This policy is evaluated and the configurations are enforced automatically for even Azure Arc enabled Kubernetes resources created after the time of policy assignment. This makes the configurations feature ideal for declaring baseline configurations like network policies, role bindings, pod security policies that need to be enforced across the entire inventory of Kubernetes clusters for compliance and governance requirements.
