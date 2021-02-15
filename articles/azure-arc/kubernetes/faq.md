---
title: "Azure Arc enabled Kuberneetes Frequently Asked Questions"
services: azure-arc
ms.service: azure-arc
ms.date: 02/15/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article contains a list of frequently asked questions related to Azure Arc enabled Kubernetes"
keywords: "Kubernetes, Arc, Azure, containers, configuration, GitOps, faq"
---

# Frequently Asked Questions - Azure Arc enabled Kubernetes

## What is the difference between Azure Arc enabled Kubernetes and Azure Kubernetes Service (AKS)?

AKS is the managed Kubernetes offering by Azure. AKS simplifies deploying a managed Kubernetes cluster in Azure by offloading much of the complexity and operational overhead to Azure. Since the Kubernetes masters are managed by Azure, you only manage and maintain the agent nodes.

Azure Arc enabled Kubernetes allows you to extend Azure’s management capabilities (like Azure Monitor and Azure Policy) by connecting Kubernetes clusters to Azure. You maintain the underlying Kubernetes cluster itself.

## Do I need to connect my AKS clusters running on Azure to Azure Arc?

No. All Azure Arc enabled Kubernetes features, including Azure Monitor and Azure Policy (Gatekeeper), are natively available with AKS, which already has resource representation in Azure.
    
## Should I connect my AKS cluster on Azure Stack HCI to Azure Arc? What about Kubernetes clusters running on Azure Stack Hub or Azure Stack Edge?

Yes, connecting your AKS or Kubernetes clusters to Azure Arc provides clusters with resource representation in Azure Resource Manager. This resource representation extends capabilities like Cluster Configuration, Azure Monitor, and Azure Policy (Gatekeeper) to the Kubernetes clusters you connect.


## If I am already using CI/CD pipelines like Azure Pipelines and GitHub Actions to deploy workloads to my Kubernetes cluster, can I still use Azure Arc enabled Kubernetes and configurations (GitOps)?

Yes, you can still use configurations on a cluster receiving deployments via a CI/CD pipeline. Compared to traditional CI/CD pipelines, configurations feature two extra benefits:
    
**Drift reconciliation** 

The CI/CD pipeline scope of deployment only extends to the duration of the pipeline run. However, the GitOps operator on the cluster continuously polls the Git repository to fetch the desired state of Kubernetes resources on the cluster. If the GitOps operator finds the desired state of resources to be different from the actual state of resources on the cluster, this drift is reconciled.
**At-scale enforcement** 

CI/CD pipelines don't offer a convenient way to enforce configurations at-scale on your entire inventory of Kubernetes clusters. But with Azure Resource Manager representation of configurations as an extension to Azure Arc enabled Kubernetes resources, you can automate the application of the desired configuration on all Kubernetes clusters under a subscription or resource group using Azure Policy. This capability applies even to Azure Arc enabled Kubernetes resources created after policy assignment.

The configurations feature is ideal for declaring baseline configurations like network policies, role bindings, and pod security policies across the entire inventory of Kubernetes clusters for compliance and governance requirements.
