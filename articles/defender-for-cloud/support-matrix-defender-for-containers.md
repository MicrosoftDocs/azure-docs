---
title: Containers support matrix in Defender for Cloud
description: Review support requirements for container capabilities in Microsoft Defender for Cloud.
ms.topic: limits-and-quotas
author: dcurwin
ms.author: dacurwin
ms.date: 09/06/2023
ms.custom: references_regions, ignite-2022
---

# Containers support matrix in Defender for Cloud

This article summarizes support information for Container capabilities in Microsoft Defender for Cloud.

> [!NOTE]
> Specific features are in preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azure (AKS)

| Domain | Feature | Supported Resources | Linux release state | Windows release state   | Agentless/Agent-based | Plans | Azure clouds availability |
|--|--|--|--|--|--|--|--|
| Security posture management  | [Agentless discovery for Kubernetes](defender-for-containers-introduction.md#security-posture-management) | AKS | GA | GA | Agentless  | Defender for Containers **OR** Defender CSPM | Azure commercial clouds |
| Security posture management  | Comprehensive inventory capabilities | ACR, AKS | GA | GA | Agentless| Defender for Containers **OR** Defender CSPM | Azure commercial clouds |
| Security posture management  | Attack path analysis | ACR, AKS | GA | - | Agentless | Defender CSPM | Azure commercial clouds |
| Security posture management  | Enhanced risk-hunting | ACR, AKS | GA | - | Agentless | Defender for Containers **OR** Defender CSPM | Azure commercial clouds |
| Security posture management  | [Control plane hardening](defender-for-containers-architecture.md) | ACR, AKS | GA | Preview | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Security posture management  | [Kubernetes data plane hardening](kubernetes-workload-protections.md) |AKS | GA | - | Azure Policy | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Security posture management | Docker CIS | VM, Virtual Machine Scale Set | GA | - | Log Analytics agent | Defender for Servers Plan 2 | Commercial clouds<br><br> National clouds: Azure Government, Microsoft Azure operated by 21Vianet  |
| [Vulnerability assessment](defender-for-containers-vulnerability-assessment-azure.md) | Agentless registry scan (powered by Qualys) <BR> [Supported OS packages](#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-qualys) | ACR, Private ACR | GA | Preview | Agentless | Defender for Containers  | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| [Vulnerability assessment](defender-for-containers-vulnerability-assessment-azure.md) | Agentless registry scan (powered by Qualys) <BR> [Supported language packages](#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-qualys) | ACR, Private ACR | Preview | - | Agentless | Defender for Containers  | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| [Vulnerability assessment](defender-for-containers-vulnerability-assessment-azure.md) | Agentless/agent-based runtime scan(powered by Qualys)] [OS packages](#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-qualys) | AKS | GA | Preview | Defender agent | Defender for Containers | Commercial clouds |
| [Vulnerability assessment](agentless-container-registry-vulnerability-assessment.md) | Agentless registry scan (powered by MDVM) [supported packages](#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-mdvm)| ACR, Private ACR | GA | - | Agentless | Defender for Containers or Defender CSPM | Commercial clouds |
| [Vulnerability assessment](agentless-container-registry-vulnerability-assessment.md) | Agentless/agent-based runtime (powered by MDVM) [supported packages](#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-mdvm)| AKS | GA | - | Defender agent | Defender for Containers or Defender CSPM | Commercial clouds |
| Runtime threat protection | [Control plane](defender-for-containers-introduction.md#run-time-protection-for-kubernetes-nodes-and-clusters) | AKS | GA | GA | Agentless | Defender for Containers | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Runtime threat protection | Workload | AKS | GA | - | Defender agent | Defender for Containers | Commercial clouds |
| Deployment & monitoring | Discovery of unprotected clusters | AKS | GA | GA | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Deployment & monitoring | Defender agent auto provisioning | AKS | GA | - | Agentless | Defender for Containers | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |
| Deployment & monitoring | Azure Policy for Kubernetes auto provisioning | AKS | GA | - | Agentless | Free | Commercial clouds<br><br> National clouds: Azure Government, Azure operated by 21Vianet |

### Registries and images support for Azure - vulnerability assessment powered by Qualys

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • [ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md) (Private registries requires access to Trusted Services) <br> • Windows images using Windows OS version 1709 and above (Preview). This is free while it's in preview, and will incur charges (based on the Defender for Containers plan) when it becomes generally available.<br><br>**Unsupported**<br> • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> • "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br> • Images with [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md) <br> • Providing image tag information for [multi-architecture images](https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/) is currently unsupported|
| OS Packages | **Supported** <br> • Alpine Linux 3.12-3.16 <br> • Red Hat Enterprise Linux 6, 7, 8 <br> • CentOS 6, 7 <br> • Oracle Linux 6, 7, 8 <br> • Amazon Linux 1, 2 <br> • openSUSE Leap 42, 15 <br> • SUSE Enterprise Linux 11, 12, 15 <br> • Debian GNU/Linux wheezy, jessie, stretch, buster, bullseye <br> • Ubuntu 10.10-22.04 <br> • FreeBSD 11.1-13.1  <br> • Fedora 32, 33, 34, 35|
| Language specific packages (Preview) <br><br> (**Only supported for Linux images**) | **Supported** <br> • Python <br> • Node.js <br> • .NET <br> • JAVA <br> • Go |

### Registries and images support for Azure - Vulnerability assessment powered by MDVM

[!INCLUDE [Registries and images support powered by MDVM](./includes/registries-images-mdvm.md)]

### Kubernetes distributions and configurations for Azure - Runtime threat protection

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported**<br> • [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) with [Kubernetes RBAC](../aks/concepts-identity.md#kubernetes-rbac) <br><br> **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br> • [Azure Kubernetes Service hybrid](/azure/aks/hybrid/aks-hybrid-options-overview)<br> • [Kubernetes](https://kubernetes.io/docs/home/)<br> • [AKS Engine](https://github.com/Azure/aks-engine)<br> • [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)|

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested on Azure.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

### Private link restrictions 

Defender for Containers relies on the [Defender agent](defender-for-cloud-glossary.md#defender-agent) for several features. The Defender agent doesn't support  the ability to ingest data through Private Link. You can disable public access for ingestion, so that only machines that are configured to send traffic through Azure Monitor Private Link can send data to that workstation. You can configure a private link by navigating to **`your workspace`** > **Network Isolation** and setting the Virtual networks access configurations to **No**.

:::image type="content" source="media/supported-machines-endpoint-solutions-cloud-containers/network-access.png" alt-text="Screenshot that shows where to go to turn off data ingestion.":::

Allowing data ingestion to occur only through Private Link Scope on your workspace Network Isolation settings, can result in communication failures and partial converge of the Defender for Containers feature set.

Learn how to [use Azure Private Link to connect networks to Azure Monitor](../azure-monitor/logs/private-link-security.md).

## AWS (EKS)

| Domain | Feature | Supported Resources | Linux release state  | Windows release state   | Agentless/Agent-based | Pricing tier |
|--|--| -- | -- | -- | -- | --|
| Security posture management | Docker CIS | EC2 | Preview | - | Log Analytics agent | Defender for Servers Plan 2 |
| Security posture management | Control plane hardening | - | - | - | - | - |
| Security posture management | Kubernetes data plane hardening | EKS | GA| - | Azure Policy for Kubernetes | Defender for Containers |
| Vulnerability Assessment | Registry scan | ECR | Preview | - | Agentless | Defender for Containers |
| Vulnerability Assessment | View vulnerabilities for running images | - | - | - | - | - |
| Runtime protection| Control plane | EKS | Preview | Preview | Agentless | Defender for Containers |
| Runtime protection| Workload | EKS | Preview | - | Defender agent | Defender for Containers |
| Deployment & monitoring | Discovery of unprotected clusters | EKS | Preview | - | Agentless | Free |
| Deployment & monitoring | Auto provisioning of Defender agent | - | - | - | - | - |
| Deployment & monitoring | Auto provisioning of Azure Policy for Kubernetes | - | - | - | - | - |

### Images support - AWS

| Aspect | Details |
|--|--|
| Registries and images | **Unsupported** <br>• Images that have at least one layer over 2 GB<br> • Public repositories and manifest lists <br>• Images in the AWS management account aren't scanned so that we don't create resources in the management account. |

### Kubernetes distributions/configurations support - AWS

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported**<br>•  [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/)<br><br> **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br> • [Kubernetes](https://kubernetes.io/docs/home/)|

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

### Outbound proxy support

Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

## GCP (GKE)

| Domain | Feature | Supported Resources | Linux release state  | Windows release state  | Agentless/Agent-based | Pricing tier |
|--|--| -- | -- | -- | -- | --|
| Security posture management | Docker CIS | GCP VMs | Preview | - | Log Analytics agent | Defender for Servers Plan 2 |
| Security posture management | Control plane hardening | GKE | GA | GA | Agentless | Free |
| Security posture management | Kubernetes data plane hardening | GKE | GA| - | Azure Policy for Kubernetes | Defender for Containers |
| Vulnerability Assessment | Registry scan | - | - | - | - | - |
| Vulnerability Assessment | View vulnerabilities for running images | - | - | - | - | - |
| Runtime protection| Control plane | GKE | Preview | Preview | Agentless | Defender for Containers |
| Runtime protection| Workload | GKE | Preview | - | Defender agent | Defender for Containers |
| Deployment & monitoring | Discovery of unprotected clusters | GKE | Preview | - | Agentless | Free |
| Deployment & monitoring | Auto provisioning of Defender agent | GKE | Preview | - | Agentless | Defender for Containers |
| Deployment & monitoring | Auto provisioning of Azure Policy for Kubernetes | GKE | Preview | - | Agentless | Defender for Containers |

### Kubernetes distributions/configurations support - GCP

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported**<br>  • [Google Kubernetes Engine (GKE) Standard](https://cloud.google.com/kubernetes-engine/) <br><br> **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br> • [Kubernetes](https://kubernetes.io/docs/home/)<br><br />**Unsupported**<br /> • Private network clusters<br /> • GKE autopilot<br /> • GKE AuthorizedNetworksConfig |

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

### Outbound proxy support

Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

## On-premises, Arc-enabled Kubernetes clusters

| Domain | Feature | Supported Resources | Linux release state  | Windows release state   | Agentless/Agent-based | Pricing tier |
|--|--| -- | -- | -- | -- | --|
| Security posture management | Docker CIS | Arc enabled VMs | Preview | - | Log Analytics agent | Defender for Servers Plan 2 |
| Security posture management | Control plane hardening | - | - | - | - | - |
| Security posture management | Kubernetes data plane hardening | Arc enabled K8s clusters | GA| - | Azure Policy for Kubernetes | Defender for Containers |
| Vulnerability Assessment  | Registry scan - [OS packages](#registries-and-images-support---on-premises) | ACR, Private ACR | GA | Preview | Agentless | Defender for Containers |
| Vulnerability Assessment | Registry scan - [language specific packages](#registries-and-images-support---on-premises) | ACR, Private ACR | Preview | - | Agentless | Defender for Containers |
| Vulnerability Assessment  | View vulnerabilities for running images | - | - | - | - | - |
| Runtime protection| Threat protection (control plane)| Arc enabled K8s clusters | Preview | Preview | Defender agent | Defender for Containers |
| Runtime protection | Threat protection (workload)| Arc enabled K8s clusters | Preview | - | Defender agent | Defender for Containers |
| Deployment & monitoring | Discovery of unprotected clusters | Arc enabled K8s clusters | Preview | - | Agentless | Free |
| Deployment & monitoring | Auto provisioning of Defender agent | Arc enabled K8s clusters | Preview | Preview | Agentless | Defender for Containers |
| Deployment & monitoring | Auto provisioning of Azure Policy for Kubernetes | Arc enabled K8s clusters | Preview | - | Agentless | Defender for Containers |

### Registries and images support - on-premises

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • [ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md) (Private registries requires access to Trusted Services) <br> • Windows images using Windows OS version 1709 and above (Preview). This is free while it's in preview, and will incur charges (based on the Defender for Containers plan) when it becomes generally available.<br><br>**Unsupported**<br> • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> • "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br> • Images with [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md) <br> • Providing image tag information for [multi-architecture images](https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/) is currently unsupported |
| OS Packages | **Supported** <br> • Alpine Linux 3.12-3.15 <br> • Red Hat Enterprise Linux 6, 7, 8 <br> • CentOS 6, 7 <br> • Oracle Linux 6, 7, 8 <br> • Amazon Linux 1, 2 <br> • openSUSE Leap 42, 15 <br> • SUSE Enterprise Linux 11, 12, 15 <br> • Debian GNU/Linux wheezy, jessie, stretch, buster, bullseye <br> • Ubuntu 10.10-22.04 <br> • FreeBSD 11.1-13.1  <br> • Fedora 32, 33, 34, 35|
| Language specific packages (Preview) <br><br> (**Only supported for Linux images**) | **Supported** <br> • Python <br> • Node.js <br> • .NET <br> • JAVA <br> • Go |

#### Kubernetes distributions and configurations

| Aspect | Details |
|--|--|
| Kubernetes distributions and configurations | **Supported via Arc enabled Kubernetes** <sup>[1](#footnote1)</sup> <sup>[2](#footnote2)</sup><br>• [Azure Kubernetes Service hybrid](/azure/aks/hybrid/aks-hybrid-options-overview)<br> • [Kubernetes](https://kubernetes.io/docs/home/)<br> • [AKS Engine](https://github.com/Azure/aks-engine)<br> • [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)<br> • [Red Hat OpenShift](https://www.openshift.com/learn/topics/kubernetes/) (version 4.6 or newer)<br> • [VMware Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid)<br> • [Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/)<br> |

<sup><a name="footnote1"></a>1</sup> Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters should be supported, but only the specified clusters have been tested.

<sup><a name="footnote2"></a>2</sup> To get [Microsoft Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md) protection for your environments, you need to onboard [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and enable Defender for Containers as an Arc extension.

> [!NOTE]
> For additional requirements for Kubernetes workload protection, see [existing limitations](../governance/policy/concepts/policy-for-kubernetes.md#limitations).

#### Supported host operating systems

Defender for Containers relies on the **Defender agent** for several features. The Defender agent is supported on the following host operating systems:

- Amazon Linux 2
- CentOS 8
- Debian 10
- Debian 11
- Google Container-Optimized OS
- Mariner 1.0
- Mariner 2.0
- Red Hat Enterprise Linux 8
- Ubuntu 16.04
- Ubuntu 18.04
- Ubuntu 20.04
- Ubuntu 22.04

Ensure your Kubernetes node is running on one of the verified supported operating systems. Clusters with different host operating systems, only get partial coverage.

#### Defender agent limitations

The Defender agent is currently not supported on ARM64 nodes.

#### Network restrictions

##### Private link

Defender for Containers relies on the Defender agent for several features. The Defender agent doesn't support  the ability to ingest data through Private Link. You can disable public access for ingestion, so that only machines that are configured to send traffic through Azure Monitor Private Link can send data to that workstation. You can configure a private link by navigating to **`your workspace`** > **Network Isolation** and setting the Virtual networks access configurations to **No**.

:::image type="content" source="media/supported-machines-endpoint-solutions-cloud-containers/network-access.png" alt-text="Screenshot that shows where to go to turn off data ingestion.":::

Allowing data ingestion to occur only through Private Link Scope on your workspace Network Isolation settings, can result in communication failures and partial converge of the Defender for Containers feature set.

Learn how to [use Azure Private Link to connect networks to Azure Monitor](../azure-monitor/logs/private-link-security.md).

##### Outbound proxy support

Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

## Next steps

- Learn how [Defender for Cloud collects data using the Log Analytics Agent](monitoring-components.md).
- Learn how [Defender for Cloud manages and safeguards data](data-security.md).
- Review the [platforms that support Defender for Cloud](security-center-os-coverage.md).
