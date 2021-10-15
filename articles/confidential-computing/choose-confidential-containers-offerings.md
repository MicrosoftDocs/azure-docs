---
title: Choosing container offerings with confidential computing 
description: Choosing the right confidential container offerings to meet your security, isolation and developer needs.
author: agowdamsft
ms.service: container-service
ms.topic: conceptual
ms.date: 11/1/2021
ms.author: amgowda
---

# Container related confidential offerings on Azure

In Azure we have two deployment models to help meet your security, confidentiality and compliance needs

1. [Enclave Confidential Containers](#Enclave-Confidential-Containers)
1. [Containers in a Confidential VM](#Containers-in-a-Confidential-VM)

Confidential capability of the offerings in this space allows your apps to achieve:

- data integrity 
- data confidentiality
- code integrity
- container code protection through encryption
- hardware-based assurances
- create hardware root of trust

## Enclave Confidential Containers <a id="Enclave-Confidential-Containers"></a>##  

Containers deployed in this mode have a tightest security and compute isolation with a lower Trusted Computing Base (TCB). Intel SGX based confidential containers running in the hardware based Trusted Execution Environment (TEE) support both a lift and shift of existing container apps or allow building custom apps with enclave awareness.

There are two programmings & deployment model on Azure Kubernetes Service (AKS) 

1. Unmodified containers support for higher programming languages on Intel SGX through Azure Partner ecosystem of OSS projects. [Read more on the deployment flow and samples](./confidential-containers-intelsgx.md).  
1. Enclave aware containers through custom Intel SGX programming model. [Read more on the deployment flow and samples](./enclave-aware-containers.md). 

Below is the isolation and security boundaries of enclave confidential containers on Intel SGX.

![Enclave Confidential Container with Intel SGX](./media/confidential-containers/confidential-container-intelsgx.png)


## Containers in a Confidential VM <a id="Containers-in-a-Confidential-VM"></a>

> [!NOTE]
> Confidential VM's with AMD SEV-SNP is coming soon on AKS. [Please get added to the notification list for this capability on Azure Kubernetes Service](virtual-machine-solutions.md).

Combining the security features of trusted launch and full node in-memory encryption enabled through AMD’s SEV-SNP confidential computing technology. The in-memory encryption keys are not accessible by Azure. SEV-SNP enabled VM nodes on AKS will also allow you to lift & shift the current sensitive workloads making it a straight forward process for developers or operations. The added integrity assurances of SEV-SNP will continuously protect data corruption, replay, memory aliasing, and memory remapping​ that can help meet your security requirements. Summarizing the features: 

- Protection of memory and code from physical attacks.
- Supporting both Linux and Windows nodes
- VM or node level confidentiality through AMD SEV-SNP with full kernel support.
- Supporting full linux kernel support to support an easy full container app support.
- Microsoft has no access to memory encryption keys. 
- Each VM in a node pool gets its own memory encryption key 
- Container Code and data-in-use are protected and isolated from anyone outside of the VM like the hypervisor admin and Host OS admin.


## Learn more

[ Intel SGX Confidential Virtual Machines on Azure](./virtual-machine-solutions-sgx.md)

<!-- LINKS - internal -->

[Confidential Containers on Azure](./confidential-containers.md)


