---
title: Confidential containers on Azure Kubernetes Service
description: Learn about pod level isolation via confidential containers on Azure Kubernetes Service
services: container-service
author: angarg05
ms.topic: article
ms.date: 11/7/2023
ms.author: ananyagarg
ms.service: azure-kubernetes-service
ms.custom:
  - ignite-fall-2023
  - ignite-2023
---

# Confidential containers on Azure Kubernetes Service
With the growth in cloud-native application development, there's an increased need to protect the workloads running in cloud environments as well. Containerizing the workload forms a key component for this programming model, and then, protecting the container is paramount to running confidentially in the cloud. 

:::image type="content" source="media/confidential-containers/attack-vectors-conf-containers.png" alt-text="Diagram of various attack vectors that make your cKubernetes container vulnerable.":::


Confidential containers on Azure Kubernetes Service (AKS) enable container level isolation in your Kubernetes workloads. It's an addition to Azure suite of confidential computing products, and uses the AMD SEV-SNP memory encryption to protect your containers at runtime.
Confidential containers are attractive for deployment scenarios that involve sensitive data (for instance, personal data or any data with strong security needed for regulatory compliance).

## What makes a container confidential?
In alignment with the guidelines set by the [Confidential Computing Consortium](https://confidentialcomputing.io/), that Microsoft is a founding member of, confidential containers need to fulfill the following – 
*	Transparency: The confidential container environment where your sensitive application is shared, you can see and verify if it's safe. All components of the Trusted Computing Base (TCB) are to be open sourced. 
*	Auditability: Customers shall have the ability to verify and see what version of the CoCo environment package including Linux Guest OS and all the components are current. Microsoft signs to the guest OS and container runtime environment for verifications through attestation. It also releases a secure hash algorithm (SHA) of guest OS builds to build a string audibility and control story. 
*	Full attestation: Anything that is part of the TEE shall be fully measured by the CPU with ability to verify remotely. The hardware report from AMD SEV-SNP processor shall reflect container layers and container runtime configuration hash through the attestation claims. Application can fetch the hardware report locally including the report that reflects Guest OS image and container runtime. 
*	Code integrity: Runtime enforcement is always available through customer defined policies for containers and container configuration, such as immutable policies and container signing. 
*	Isolation from operator: Security designs that assume least privilege and highest isolation shielding from all untrusted parties including customer/tenant admins. It includes hardening existing Kubernetes control plane access (kubelet) to confidential pods. 

But with these features of confidentiality, the product maintains its ease of use: it supports all unmodified Linux containers with high Kubernetes feature conformance. Additionally, it supports  heterogenous node pools (GPU, general-purpose nodes) in a single cluster to optimize for cost.  

## What forms confidential containers on AKS?
Aligning with Microsoft’s commitment to the open-source community, the underlying stack for confidential containers uses the [Kata CoCo](https://github.com/confidential-containers/confidential-containers) agent as the agent running in the node that hosts the pod running the confidential workload. With many TEE technologies requiring a boundary between the host and guest, [Kata Containers](https://katacontainers.io/) are the basis for the Kata CoCo initial work. Microsoft  also contributed back to the Kata Coco community to power containers  running inside a confidential utility VM.

The Kata confidential container resides within the Azure Linux AKS Container Host. [Azure Linux](https://techcommunity.microsoft.com/t5/azure-infrastructure-blog/announcing-preview-availability-of-the-mariner-aks-container/ba-p/3649154) and the Cloud Hypervisor VMM (Virtual Machine Monitor) is the end-user facing/user space software that is used for creating and managing the lifetime of virtual machines. 

## Container level isolation in AKS
In default, AKS all workloads share the same kernel and the same cluster admin. With the preview of Pod Sandboxing on AKS, the isolation grew a notch higher with the ability to provide kernel isolation for workloads on the same AKS node. You can read more about the product [here](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/preview-support-for-kata-vm-isolated-containers-on-aks-for-pod/ba-p/3751557). Confidential containers are the next step of this isolation and it uses the memory encryption capabilities of the underlying AMD SEV-SNP virtual machine sizes. These virtual machines are the [DCa_cc](../../articles/virtual-machines/dcasccv5-dcadsccv5-series.md) and [ECa_cc](../../articles/virtual-machines/ecasccv5-ecadsccv5-series.md) sizes with the capability of surfacing the hardware’s root of trust to the pods deployed on it. 

:::image type="content" source="media/confidential-containers/architechture-aks-conf-pods.png" alt-text="Diagram of various layers of the architechture forming confidential containers":::


## Get started
To get started and learn more about supported scenarios, please refer to our AKS documentation [here](https://aka.ms/conf-containers-aks-documentation).



## Next step

> To learn more about this announcement, checkout our blog [here](https://aka.ms/coco-aks-preview). 
> We also have a demo of a confidential container running an end-to-end encrypted messaging system on Kafka [here](https://aka.ms/Ignite2023-ConfContainers-AKS-Preview).
