---
title: "Azure Arc enabled Kubernetes frequently asked questions"
services: azure-arc
ms.service: azure-arc
ms.date: 02/19/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article contains a list of frequently asked questions related to Azure Arc enabled Kubernetes"
keywords: "Kubernetes, Arc, Azure, containers, configuration, GitOps, faq"
---

# Frequently Asked Questions - Azure Arc enabled Kubernetes

This article addresses frequently asked questions about Azure Arc enabled Kubernetes.

## What is the difference between Azure Arc enabled Kubernetes and Azure Kubernetes Service (AKS)?

AKS is the managed Kubernetes offering by Azure. AKS simplifies deploying a managed Kubernetes cluster in Azure by offloading much of the complexity and operational overhead to Azure. Since the Kubernetes masters are managed by Azure, you only manage and maintain the agent nodes.

Azure Arc enabled Kubernetes allows you to extend Azure’s management capabilities (like Azure Monitor and Azure Policy) by connecting Kubernetes clusters to Azure. You maintain the underlying Kubernetes cluster itself.

## Do I need to connect my AKS clusters running on Azure to Azure Arc?

No. All Azure Arc enabled Kubernetes features, including Azure Monitor and Azure Policy (Gatekeeper), are available on AKS (a native resource in Azure Resource Manager).
    
## Should I connect my AKS-HCI cluster and Kubernetes clusters on Azure Stack Hub and Azure Stack Edge to Azure Arc?

Yes, connecting your AKS-HCI cluster or Kubernetes clusters on Azure Stack Edge or Azure Stack Hub to Azure Arc provides clusters with resource representation in Azure Resource Manager. This resource representation extends capabilities like Cluster Configuration, Azure Monitor, and Azure Policy (Gatekeeper) to connected Kubernetes clusters.

If the Azure Arc enabled Kubernetes cluster is on Azure Stack Edge, AKS on Azure Stack HCI (>= April 2021 update), or AKS on Windows Server 2019 Datacenter (>= April 2021 update), then the Kubernetes configuration is included at no charge.

## How to address expired Azure Arc enabled Kubernetes resources?

The Managed Service Identity (MSI) certificate associated with your Azure Arc enabled Kubernetes has an expiration window of 90 days. Once this certificate expires, the resource is considered `Expired` and all features (such as configuration, monitoring, and policy) stop working on this cluster. To get your Kubernetes cluster working with Azure Arc again:

1. Delete Azure Arc enabled Kubernetes resource and agents on the cluster. 

    ```console
    az connectedk8s delete -n <name> -g <resource-group>
    ```

1. Recreate the Azure Arc enabled Kubernetes resource by deploying agents on the cluster.
    
    ```console
    az connectedk8s connect -n <name> -g <resource-group>
    ```

> [!NOTE]
> `az connectedk8s delete` will also delete configurations on top of the cluster. After running `az connectedk8s connect`, recreate the configurations on the cluster, either manually or using Azure Policy.

## If I am already using CI/CD pipelines, can I still use Azure Arc enabled Kubernetes and configurations?

Yes, you can still use configurations on a cluster receiving deployments via a CI/CD pipeline. Compared to traditional CI/CD pipelines, configurations feature two extra benefits:

**Drift reconciliation**

The CI/CD pipeline applies changes only once during pipeline run. However, the GitOps operator on the cluster continuously polls the Git repository to fetch the desired state of Kubernetes resources on the cluster. If the GitOps operator finds the desired state of resources to be different from the actual state of resources on the cluster, this drift is reconciled.

**Apply GitOps at scale**

CI/CD pipelines are useful for event-driven deployments to your Kubernetes cluster (for example, a push to a Git repository). However, if you want to deploy the same configuration to all of your Kubernetes clusters, you would need to manually configure each Kubernetes cluster's credentials to the CI/CD pipeline. 

For Azure Arc enabled Kubernetes, since Azure Resource Manager manages your configurations, you can automate creating the same configuration across all Azure Arc enabled Kubernetes resources using Azure Policy, within scope of a subscription or a resource group. This capability is even applicable to Azure Arc enabled Kubernetes resources created after the policy assignment.

This feature applies baseline configurations (like network policies, role bindings, and pod security policies) across the entire Kubernetes cluster inventory to meet compliance and governance requirements.

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./connect-cluster.md).
* Already have a Kubernetes cluster connected Azure Arc? [Create configurations on your Arc enabled Kubernetes cluster](./use-gitops-connected-cluster.md).
* Learn how to [use Azure Policy to apply configurations at scale](./use-azure-policy.md).