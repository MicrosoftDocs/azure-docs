---
title: "Azure Arc—enabled Kubernetes validation"
services: azure-arc
ms.service: azure-arc
ms.date: 03/03/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Describes Arc validation program for Kubernetes distributions"
keywords: "Kubernetes, Arc, Azure, K8s, validation"
---

# Azure Arc—enabled Kubernetes validation

Azure Arc—enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. The Azure Arc team has also worked with key industry Kubernetes offering providers to validate Azure Arc—enabled Kubernetes with their Kubernetes distributions. Future major and minor versions of Kubernetes distributions released by these providers will be validated for compatibility with Azure Arc—enabled Kubernetes.

## Validated distributions

The following Microsoft provided Kubernetes distributions and infrastructure providers have successfully passed the conformance tests for Azure Arc—enabled Kubernetes:

| Distribution and infrastructure provider | Version |
| ---------------------------------------- | ------- |
| Cluster API Provider on Azure            | Release version: [0.4.12](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v0.4.12); Kubernetes version: [1.18.2](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.2) |
| AKS on Azure Stack HCI                   | Release version: [December 2020 Update](https://github.com/Azure/aks-hci/releases/tag/AKS-HCI-2012); Kubernetes version: [1.18.8](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.8) |

The following providers and their corresponding Kubernetes distributions have successfully passed the conformance tests for Azure Arc—enabled Kubernetes:

| Provider name | Distribution name | Version |
| ------------ | ----------------- | ------- |
| RedHat       | [OpenShift Container Platform](https://www.openshift.com/products/container-platform) | [4.5.41+](https://docs.openshift.com/container-platform/4.5/release_notes/ocp-4-5-release-notes.html), [4.6.35+](https://docs.openshift.com/container-platform/4.6/release_notes/ocp-4-6-release-notes.html), [4.7.18+](https://docs.openshift.com/container-platform/4.7/release_notes/ocp-4-7-release-notes.html) |
| VMware       | [Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid) | Kubernetes version: v1.17.5 |
| Canonical    | [Charmed Kubernetes](https://ubuntu.com/kubernetes) | [1.19](https://ubuntu.com/kubernetes/docs/1.19/components) |
| SUSE Rancher      | [Rancher Kubernetes Engine](https://rancher.com/products/rke/) | RKE CLI version: [v1.2.4](https://github.com/rancher/rke/releases/tag/v1.2.4); Kubernetes versions: [1.19.6](https://github.com/kubernetes/kubernetes/releases/tag/v1.19.6)), [1.18.14](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.14)), [1.17.16](https://github.com/kubernetes/kubernetes/releases/tag/v1.17.16))  |
| Nutanix      | [Karbon](https://www.nutanix.com/products/karbon)    | Version 2.2.1 |

The Azure Arc team also ran the conformance tests and validated Azure Arc—enabled Kubernetes scenarios on the following public cloud providers:

| Public cloud provider name | Distribution name | Version |
| -------------------------- | ----------------- | ------- |
| Amazon Web Services        | Elastic Kubernetes Service (EKS) | v1.18.9  |
| Google Cloud Platform      | Google Kubernetes Engine (GKE) | v1.17.15 |

## Scenarios validated

The conformance tests run as part of the Azure Arc—enabled Kubernetes validation cover the following scenarios:

1. Connect Kubernetes clusters to Azure Arc: 
    * Deploy Azure Arc—enabled Kubernetes agent Helm chart on cluster.
    * Set up Managed System Identity (MSI) certificate on cluster.
    * Agents send cluster metadata to Azure.

2. Configuration: 
    * Create configuration on top of Azure Arc—enabled Kubernetes resource.
    * [Flux](https://docs.fluxcd.io/), needed for setting up GitOps workflow, is deployed on the cluster.
    * Flux pulls manifests and Helm charts from demo Git repo and deploys to cluster.

## Next steps

Learn how to connect a cluster to Azure Arc.
> [!div class="nextstepaction"]
> [Connect a cluster to Azure Arc](./quickstart-connect-cluster.md)
