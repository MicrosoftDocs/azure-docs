---
title: Validated Azure Arc-enabled Kubernetes distributions
description: Learn about details required for the Azure Arc validation process to conform to the Arc-enabled Kubernetes, Data Services, and cluster extensions.
ms.date: 07/19/2021
ms.topic: overview
---

# Azure Arc validated Kubernetes distributions

Azure Arc enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. The Azure Arc team has also worked with key industry Kubernetes offering providers to validate Azure Arc enabled Kubernetes with their Kubernetes distributions. Future major and minor versions of Kubernetes distributions released by these providers will be validated for compatibility with Azure Arc-enabled Kubernetes.

The following Microsoft provided Kubernetes distributions and infrastructure providers have successfully passed the conformance tests for Azure Arc enabled Kubernetes.

|**Distribution and**<br> **infrastructure providers** |**Version** |
|---------------|---------------|
|Cluster API Provider on Azure |Release version [0.4.12](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v0.4.12)<br> Kubernetes version [1.18.2](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.2) |
|AKS on Azure Stack HCI |Release version [December 2020 Update](https://github.com/Azure/aks-hci/releases/tag/AKS-HCI-2012)<br> Kubernetes version [1.18.8](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.8) |

The following providers and their corresponding Kubernetes distributions have successfully passed the conformance tests for Azure Arc-enabled Kubernetes.

|**Provider**<br> **name** |**Distribution**<br> **name** |**Version** |**Arc-enabled Kubernetes**<br> **version** |
|----------|----------|----------|----------|
|Red Hat |[OpenShift Container Platform](https://www.openshift.com/products/container-platform) |[4.5](https://docs.openshift.com/container-platform/4.5/release_notes/ocp-4-5-release-notes.html) |**N** - No<br> **N-1** - Yes<br> **N-2** - Yes |
|||[4.6](https://docs.openshift.com/container-platform/4.6/release_notes/ocp-4-67-release-notes.html |**N** - Yes<br> **N-1** - Yes<br> **N-2** - Yes |
|||[4.7](https://docs.openshift.com/container-platform/4.7/release_notes/ocp-4-7-release-notes.html) |**N** - Yes<br> **N-1** - Yes<br> **N-2** - Yes |
|VMWare |[Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid) |TKGm 1.1 |**N** - No<br> **N-1** - Yes<br> **N-2** - Yes |
|||TKGm 1.2 |**N** - Yes<br> **N-1** - Yes<br> **N-2** - Yes |
|||TKGm 1.3 |**N** - Yes<br> **N-1** - Yes<br> **N-2** - No |
|Canonical |[Charmed Kubernetes](https://ubuntu.com/kubernetes) |[1.18](https://ubuntu.com/kubernetes/docs/1.18/components)|**N** - No<br> **N-1** - Yes<br> **N-2** - Yes |
|||[1.19](https://ubuntu.com/kubernetes/docs/1.19/components) |**N** - Yes<br> **N-1** - Yes<br> **N-2** - Yes |
|||[1.20](https://ubuntu.com/kubernetes/docs/1.20/components) |**N** - Yes<br> **N-1** - Yes<br> **N-2** - No|
|SUSE Rancher |[Rancher Kubernetes Engine](https://rancher.com/products/rke/) |1.17.16 |**N** - No<br> **N-1** - Yes<br> **N-2** - Yes |
|||1.18.14 |**N** - Yes<br> **N-1** - Yes<br> **N-2** - Yes |
|||1.19.4 |**N** - Yes<br> **N-1** - Yes<br> **N-2** - No |
|Nutanix |[Karbon](https://www.nutanix.com/products/karbon) |2.0 |**N** - No<br> **N-1** - Yes<br> **N-2** - Yes |
|||2.1 |**N** - Yes<br> **N-1** - Yes<br> **N-2** - Yes |
|||2.2 |**N** - Yes<br> **N-1** - Yes<br> **N-2** - No |

The following cloud providers and their corresponding Kubernetes distributions have successfully passed the conformance tests for Azure Arc-enabled Kubernetes.

|**Public Cloud provider** |**Distribution** |
|-----------|-----------|
|Amazon Web Services |[Elastic Kubernetes Service (Amazon EKS)](https://aws.amazon.com/eks) |
|Google Cloud Platform |[Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) |

## Next steps