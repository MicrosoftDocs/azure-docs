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

No. All Azure Arc enabled Kubernetes features, including Azure Monitor and Azure Policy (Gatekeeper), are available on AKS (a native resource in Azure Resource Manager).
    
## Should I connect my AKS cluster on Azure Stack HCI to Azure Arc? What about Kubernetes clusters running on Azure Stack Hub or Azure Stack Edge?

Yes, connecting your AKS or Kubernetes clusters to Azure Arc provides clusters with resource representation in Azure Resource Manager. This resource representation extends capabilities like Cluster Configuration, Azure Monitor, and Azure Policy (Gatekeeper) to the Kubernetes clusters you connect.

## How to address expired Azure Arc enabled Kubernetes resources?

The Managed service identity (MSI) certificate associated with your Azure Arc enabled Kuberenetes has an expiration window of 90 days. Once this certificate expires, the resource is considered `Expired` and all features such as configuration, monitoring and policy stop working on this cluster. Follow these steps to get your Kubernetes cluster working with Azure Arc again:

1. Delete Azure Arc enabled Kubernetes resource and agents on the cluster 

    ```console
    az connectedk8s delete -n <name> -g <resource-group>
    ```

1. Recreate the Azure Arc enabled Kubernetes resource by deploying agents on the cluster again.
    
    ```console
    az connectedk8s connect -n <name> -g <resource-group>
    ```

> [!NOTE]
> `az connectedk8s delete` will also delete configurations on top of the cluster. After running `az connectedk8s connect`, create the configurations on the cluster again, either manually or using Azure Policy.

## If I am already using CI/CD pipelines like Azure Pipelines and GitHub Actions to deploy workloads to my Kubernetes cluster, can I still use Azure Arc enabled Kubernetes and configurations (GitOps)?

Yes, you can still use configurations on a cluster receiving deployments via a CI/CD pipeline. Compared to traditional CI/CD pipelines, configurations feature two extra benefits:
    
**Drift reconciliation** 

The CI/CD pipeline scope of deployment only extends to the duration of the pipeline run. However, the GitOps operator on the cluster continuously polls the Git repository to fetch the desired state of Kubernetes resources on the cluster. If the GitOps operator finds the desired state of resources to be different from the actual state of resources on the cluster, this drift is reconciled.

**At-scale enforcement** 

CI/CD pipelines are good for event driven deployments to your Kubernetes cluster, where the event could be a push to a Git repository. However, deployment of the same configuration to all your Kubernetes clusters requires the CI/CD pipeline to be configured with credentials of each of these Kubernetes clusters manually. On the other hand, in the case of Azure Arc enabled Kubernetes, since Azure Resource Manager manages your configurations, you can use Azure Policy to automate the application of the desired configuration on all Kubernetes clusters under a subscription or resource group scope in one go. This capability is even applicable to Azure Arc enabled Kubernetes resources created after the policy assignment.

The configurations feature is used to apply baseline configurations like network policies, role bindings, and pod security policies across the entire inventory of Kubernetes clusters for compliance and governance requirements.
