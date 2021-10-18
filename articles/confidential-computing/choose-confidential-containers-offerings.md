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

Confidential capability offerings in this space allows your apps to achieve:

- data integrity 
- data confidentiality
- code integrity
- container code protection through encryption
- hardware-based assurances
- create hardware root of trust
- lower your attach surface area for your containers

## Enclave Confidential Containers <a id="Enclave-Confidential-Containers"></a>

Containers deployed in this mode have a tightest security and compute isolation with a lower Trusted Computing Base (TCB). Intel SGX based confidential containers running in the hardware based Trusted Execution Environment (TEE) support both a lift and shift of existing container apps or allow building custom apps with enclave awareness.

There are two programming and deployment models on Azure Kubernetes Service (AKS) 

1. Unmodified containers support for higher programming languages on Intel SGX through Azure Partner ecosystem of OSS projects. [Read more on the deployment flow and samples](./confidential-containers.md).  
1. Enclave aware containers through custom Intel SGX programming model. [Read more on the deployment flow and samples](./enclave-aware-containers.md). 

Below are the isolation and security boundaries of enclave confidential containers on Intel SGX.

![Enclave Confidential Container with Intel SGX](./media/confidential-containers/confidential-container-intel-sgx.png)


## Learn more

[ Intel SGX Confidential Virtual Machines on Azure](./virtual-machine-solutions-sgx.md)

<!-- LINKS - internal -->

[Confidential Containers on Azure](./confidential-containers.md)


