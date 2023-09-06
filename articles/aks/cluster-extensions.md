---
title: Cluster extensions for Azure Kubernetes Service (AKS)
description: Learn how to deploy and manage the lifecycle of extensions on Azure Kubernetes Service (AKS)
ms.custom: event-tier1-build-2022
ms.date: 06/30/2023
ms.topic: article
author: nickomang
ms.author: nickoman
---

# Deploy and manage cluster extensions for Azure Kubernetes Service (AKS)

Cluster extensions provide an Azure Resource Manager driven experience for installation and lifecycle management of services like Azure Machine Learning or Kubernetes applications on an AKS cluster. This feature enables:

* Azure Resource Manager-based deployment of extensions, including at-scale deployments across AKS clusters.
* Lifecycle management of the extension (Update, Delete) from Azure Resource Manager

## Cluster extension requirements

Cluster extensions can be used on AKS clusters in the regions listed in [Azure Arc enabled Kubernetes region support][arc-k8s-regions].

For supported Kubernetes versions, refer to the corresponding documentation for each extension.

> [!IMPORTANT]
> Ensure that your AKS cluster is created with a managed identity, as cluster extensions won't work with service principal-based clusters.
>
> For new clusters created with `az aks create`, managed identity is configured by default. For existing service principal-based clusters that need to be switched over to managed identity, it can be enabled by running `az aks update` with the `--enable-managed-identity` flag. For more information, see [Use managed identity][use-managed-identity].

> [!NOTE]
> If you have enabled [Azure AD pod-managed identity][use-azure-ad-pod-identity] on your AKS cluster or are considering implementing it,
> we recommend you first review [Workload identity overview][workload-identity-overview] to understand our
> recommendations and options to set up your cluster to use an Azure AD workload identity (preview).
> This authentication method replaces pod-managed identity (preview), which integrates with the Kubernetes native capabilities
> to federate with any external identity providers.
>
> The open source Azure AD pod-managed identity (preview) in Azure Kubernetes Service has been deprecated as of 10/24/2022.

## Currently available extensions

| Extension | Description |
| --------- | ----------- |
| [Dapr][dapr-overview] | Dapr is a portable, event-driven runtime that makes it easy for any developer to build resilient, stateless and stateful applications that run on cloud and edge. |
| [Azure Machine Learning][azure-ml-overview] | Use Azure Kubernetes Service clusters to train, inference, and manage machine learning models in Azure Machine Learning. |
| [Flux (GitOps)][gitops-overview] | Use GitOps with Flux to manage cluster configuration and application deployment. See also [supported versions of Flux (GitOps)][gitops-support] and [Tutorial: Deploy applications using GitOps with Flux v2][gitops-tutorial].|
| [Azure Container Storage](../storage/container-storage/container-storage-introduction.md) | Use Azure Container Storage to manage block storage on AKS clusters to store data in persistent volumes. |
| [Azure Backup for AKS](../backup/azure-kubernetes-service-backup-overview.md) | Use Azure Backup for AKS to protect your containerized applications and data stored in Persistent Volumes deployed in the AKS clusters. |

You can also [select and deploy Kubernetes applications available through Marketplace](deploy-marketplace.md).

> [!NOTE]
> Cluster extensions provides a platform for different extensions to be installed and managed on an AKS cluster. If you are facing issues while using any of these extensions, please open a support ticket with the respective service.

## Next steps

* Learn how to [deploy cluster extensions by using Azure CLI](deploy-extensions-az-cli.md).
* Read about [cluster extensions for Azure Arc-enabled Kubernetes clusters][arc-k8s-extensions].

<!-- LINKS -->
<!-- INTERNAL -->
[arc-k8s-extensions]: ../azure-arc/kubernetes/conceptual-extensions.md
[azure-ml-overview]: ../machine-learning/how-to-attach-kubernetes-anywhere.md
[dapr-overview]: ./dapr.md
[gitops-overview]: ../azure-arc/kubernetes/conceptual-gitops-flux2.md
[gitops-support]: ../azure-arc/kubernetes/extensions-release.md#flux-gitops
[gitops-tutorial]: ../azure-arc/kubernetes/tutorial-use-gitops-flux2.md
[k8s-extension-reference]: /cli/azure/k8s-extension
[use-managed-identity]: ./use-managed-identity.md
[workload-identity-overview]: workload-identity-overview.md
[use-azure-ad-pod-identity]: use-azure-ad-pod-identity.md

<!-- EXTERNAL -->
[arc-k8s-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc&regions=all
