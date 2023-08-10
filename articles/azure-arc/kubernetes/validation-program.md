---
title: "Azure Arc-enabled Kubernetes validation"
ms.date: 07/21/2023
ms.topic: how-to
description: "Describes Arc validation program for Kubernetes distributions"
---

# Azure Arc-enabled Kubernetes validation

The Azure Arc team works with key industry Kubernetes offering providers to validate Azure Arc-enabled Kubernetes with their Kubernetes distributions. Future major and minor versions of Kubernetes distributions released by these providers will be validated for compatibility with Azure Arc-enabled Kubernetes.

> [!IMPORTANT]
> Azure Arc-enabled Kubernetes works with any Kubernetes clusters that are certified by the Cloud Native Computing Foundation (CNCF), even if they haven't been validated through conformance tests and are not listed on this page.

## Validated distributions

The following Microsoft-provided Kubernetes distributions and infrastructure providers have successfully passed the conformance tests for Azure Arc-enabled Kubernetes:

| Distribution and infrastructure provider | Version |
| ---------------------------------------- | ------- |
| Cluster API Provider on Azure            | Release version: [0.4.12](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v0.4.12); Kubernetes version: [1.18.2](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.2) |
| AKS on Azure Stack HCI                   | Release version: [December 2020 Update](https://github.com/Azure/aks-hci/releases/tag/AKS-HCI-2012); Kubernetes version: [1.18.8](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.8) |
| K8s on Azure Stack Edge                  | Release version: Azure Stack Edge 2207 (2.2.2037.5375); Kubernetes version: [1.22.6](https://github.com/kubernetes/kubernetes/releases/tag/v1.22.6) |
| AKS Edge Essentials                  | Release version [1.0.406.0]( https://github.com/Azure/AKS-Edge/releases/tag/1.0.406.0); Kubernetes version [1.24.3](https://github.com/kubernetes/kubernetes/releases/tag/v1.24.3) |

The following providers and their corresponding Kubernetes distributions have successfully passed the conformance tests for Azure Arc-enabled Kubernetes:

| Provider name | Distribution name | Version |
| ------------ | ----------------- | ------- |
| RedHat       | [OpenShift Container Platform](https://www.openshift.com/products/container-platform) | [4.9.43](https://docs.openshift.com/container-platform/4.9/release_notes/ocp-4-9-release-notes.html), [4.10.23](https://docs.openshift.com/container-platform/4.10/release_notes/ocp-4-10-release-notes.html), 4.11.0-rc.6, [4.13.4](https://docs.openshift.com/container-platform/4.13/release_notes/ocp-4-13-release-notes.html) |
| VMware       | [Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid) |TKGm 2.2; upstream K8s v1.25.7+vmware.2 <br>TKGm 2.1.0; upstream K8s v1.24.9+vmware.1 <br>TKGm 1.6.0; upstream K8s v1.23.8+vmware.2 <br>TKGm 1.5.3; upstream K8s v1.22.8+vmware.1 <br>TKGm 1.4.0; upstream K8s v1.21.2+vmware.1 <br>TKGm 1.3.1; upstream K8s v1.20.5+vmware.2 <br>TKGm 1.2.1; upstream K8s v1.19.3+vmware.1 |
| Canonical    | [Charmed Kubernetes](https://ubuntu.com/kubernetes) | [1.24](https://ubuntu.com/kubernetes/docs/1.24/components) |
| SUSE Rancher      | [Rancher Kubernetes Engine](https://rancher.com/products/rke/) | RKE CLI version: [v1.3.13](https://github.com/rancher/rke/releases/tag/v1.3.13); Kubernetes versions: 1.24.2, 1.23.8  |
| Nutanix      | [Nutanix Kubernetes Engine](https://www.nutanix.com/products/kubernetes-engine)    | Version [2.5](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Kubernetes-Engine-v2_5:Nutanix-Kubernetes-Engine-v2_5); upstream K8s v1.23.11 |
| Kublr	| [Kublr Managed K8s](https://kublr.com/managed-kubernetes/) Distribution |[Kublr 1.26.0](https://docs.kublr.com/releasenotes/1.26/release-1.26.0/); Upstream K8s Versions: 1.21.3, 1.22.10, 1.22.17, 1.23.17, 1.24.13, 1.25.6, 1.26.4 |
| Mirantis | [Mirantis Kubernetes Engine](https://www.mirantis.com/software/mirantis-kubernetes-engine/) | MKE Version [3.6.0](https://docs.mirantis.com/mke/3.6/release-notes/3-6-0.html) <br> MKE Version [3.5.5](https://docs.mirantis.com/mke/3.5/release-notes/3-5-5.html) <br> MKE Version [3.4.7](https://docs.mirantis.com/mke/3.4/release-notes/3-4-7.html) |
| Wind River | [Wind River Cloud Platform](https://www.windriver.com/studio/operator/cloud-platform) |Wind River Cloud Platform 22.12; Upstream K8s version: 1.24.4 <br>Wind River Cloud Platform 22.06; Upstream K8s version: 1.23.1 <br>Wind River Cloud Platform 21.12; Upstream K8s version: 1.21.8 <br>Wind River Cloud Platform 21.05; Upstream K8s version: 1.18.1 |

The Azure Arc team also ran the conformance tests and validated Azure Arc-enabled Kubernetes scenarios on the following public cloud providers:

| Public cloud provider name | Distribution name | Version |
| -------------------------- | ----------------- | ------- |
| Amazon Web Services        | Elastic Kubernetes Service (EKS) | v1.18.9  |
| Google Cloud Platform      | Google Kubernetes Engine (GKE) | v1.17.15 |

## Scenarios validated

The conformance tests run as part of the Azure Arc-enabled Kubernetes validation cover the following scenarios:

1. Connect Kubernetes clusters to Azure Arc:
    * Deploy Azure Arc-enabled Kubernetes agent Helm chart on cluster.
    * Agents send cluster metadata to Azure.

2. Configuration:
    * Create configuration on top of Azure Arc-enabled Kubernetes resource.
    * [Flux](https://docs.fluxcd.io/), needed for setting up [GitOps workflow](tutorial-use-gitops-flux2.md), is deployed on the cluster.
    * Flux pulls manifests and Helm charts from demo Git repo and deploys to cluster.

## Next steps

* [Learn how to connect an existing Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md)
* Learn about the [Azure Arc agents](conceptual-agent-overview.md) deployed on Kubernetes clusters when connecting them to Azure Arc.

