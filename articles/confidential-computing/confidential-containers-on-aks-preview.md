---
title: Confidential containers on AKS
description: Learn about pod level isolation via confidential containers on AKS
services: container-service
author: angarg05
ms.topic: article
ms.date: 11/-2/2023
ms.author: ananyagarg
ms.service: virtual-machines 
ms.subservice: confidential-computing
ms.custom: ignite-fall-2023
---

# Confidential Containers on AKS
With the growth in cloud-native application development, there is an increased need to protect the workloads running in cloud environments as well. Containerizing the workload forms a key component for this programming model, and subsequently, protecting the container is paramount to running confidentially in the cloud. 
Confidential containers on AKS enable container level isolation in your Kubernetes workloads. It is an addition to Azure suite of confidential computing products, and leverages the AMD SEV-SNP memory encryption to protect your containers at runtime. 
Confidential containers are attractive for deployment scenarios that involve sensitive data (for instance, PII or any data with strong security needed for regulatory compliance).

## What makes a container confidential?
In alignment with the guidelines set by the Confidential Computing Consortium, that Microsoft is a founding member of, confidential containers need to fulfil the following – 
1.	Transparency: The confidential container environment where your sensitive application is shared, you can see and verify if it is safe. All components of the Trusted Computing Base (TCB) are to be open sourced. 
2.	Auditability: Customers shall have the ability to verify and see what version of the CoCo environment package including Linux Guest OS and all the components are current. Microsoft signs to the guest OS and container runtime environment for verifications through attestation, also releases a secure hash algorithm (SHA) of guest OS builds to build a string audibility and control story. 
3.	Full attestation: Anything that is part of the TEE shall be fully measured by the CPU with ability to verify remotely. The hardware report from AMD SEV-SNP processer shall reflect container layers and container runtime configuration hash through the attestation claims. Application can fetch the hardware report locally including the the report that reflects Guest OS image and container runtime. 
4.	Code integrity: Runtime enforcement is always available through customer defined policies for containers and container configuration, such as immutable policies and container signing. 
5.	Isolation from operator: Security designs that assume least privilege and highest isolation shielding from all untrusted parties including customer/tenant admins. This includes hardening existing Kubernetes control plane access (kubelet) to confidential pods. 
6.	Ease of use: Supporting all unmodified Linux containers with high Kubernetes feature conformance. Also supporting heterogenous node pools (GPU, general-purpose nodes) in a single cluster to optimize for cost.  

## What forms the tech stack for confidential containers on AKS?
### Kata CoCo
Keeping community at the base of this product, we have leverage (Kata CoCo)[ https://github.com/confidential-containers/confidential-containers] agent as the agent running in the node that hosts the pod running the confidential workload. With many TEE technologies requiring a boundary between the host and guest, (Kata Containers)[ https://katacontainers.io/] are the basis for the Kata CoCo initial work. The Kata Containers project focuses on reducing the concern of a guest attacking the host, in this case a breakout from containers within the pod attacking the Kubernetes Node.
### Mariner
Where is the container hosted? It is in a utility VM that resides within the Mariner AKS Container Host. Microsoft announced preview of Mariner as Linux container host on AKS in the fall of 2022. Mariner is Microsoft’s internal Linux distribution that is optimized to run on Azure and provides operational consistency with smaller/ leaner and security hardened image.

### Cloud Hypervisor
Next, we form the boundary between the host VM and the utility VM - (Cloud Hypervisor VMM (Virtual Machine Monitor) is the end-user facing/user space software that is used for creating and managing the lifetime of virtual machines. Microsoft will continue playing an active role stewarding in the project supporting and contributing to community efforts. 
 
Cloud Hypervisor brings fast boot times for the utility VM use cases (such as Kata Containers) with container-friendly optimizations, enables run time configurable VM resources, and implements a minimal set of drivers to enable container workloads on Azure.



### AMD SEV-SNP SKUs
Lastly, out AMD SEV-SNP virtual machines form the hardware root of trust. This is available in 2 series – DCA_CC for general memory workloads and ECA_CC for the memory optimized workloads. 
 

To get started and learn more about supported scenarios, please refer to our AKS documentation (here)[]. And read our announcement (here)[].
