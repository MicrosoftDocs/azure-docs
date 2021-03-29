---
title: Confidential computing nodes on Azure Kubernetes Service (AKS)
description: Confidential computing nodes on AKS
services: virtual-machines
author: agowdamsft
ms.service: container-service
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 2/08/2021
ms.author: amgowda
 
---

# Confidential computing nodes on Azure Kubernetes Service

[Azure confidential computing](overview.md) allows you to protect your sensitive data while it's in use. The underlying confidential computing infrastructure protects this data from other applications, administrators, and cloud providers with a hardware backed trusted execution container environments. Adding confidential computing nodes allow you to target container application to run in an isolated, hardware protected and attestable environment.

## Overview

Azure Kubernetes Service (AKS) supports adding [DCsv2 confidential computing nodes](confidential-computing-enclaves.md) powered by Intel SGX. These nodes allow you to run sensitive workloads within a hardware-based trusted execution environment (TEE). TEE’s allow user-level code from containers to allocate private regions of memory to execute the code with CPU directly. These private memory regions that execute directly with CPU are called enclaves. Enclaves help protect the data confidentiality, data integrity and code integrity from other processes running on the same nodes. The Intel SGX execution model also removes the intermediate layers of Guest OS, Host OS and Hypervisor thus reducing the attack surface area. The *hardware based per container isolated execution* model in a node allows applications to directly execute with the CPU, while keeping the special block of memory encrypted per container. Confidential computing nodes with confidential containers are a great addition to your zero trust security planning and defense-in-depth container strategy.

![sgx node overview](./media/confidential-nodes-aks-overview/sgxaksnode.jpg)

## AKS Confidential Nodes Features

- Hardware based and process level container isolation through Intel SGX trusted execution environment (TEE) 
- Heterogenous node pool clusters (mix confidential and non-confidential node pools)
- Encrypted Page Cache (EPC) memory-based pod scheduling (requires add-on)
- Intel SGX DCAP driver pre-installed
- CPU consumption based horizontal pod autoscaling and cluster autoscaling
- Linux Containers support through Ubuntu 18.04 Gen 2 VM worker nodes

## Confidential Computing add-on for AKS
The add-on feature enables extra capability on AKS when running confidential computing node pools on the cluster. This add-on enables the features below.

#### Azure Device Plugin for Intel SGX <a id="sgx-plugin"></a>

The device plugin implements the Kubernetes device plugin interface for Encrypted Page Cache (EPC) memory and exposes the device drivers from the nodes. Effectively, this plugin makes EPC memory as an another resource type in Kubernetes. Users can specify limits on this resource just as other resources. Apart from the scheduling function, the device plugin helps assign Intel SGX device driver permissions to confidential workload containers. With this plugin developer can avoid mounting the Intel SGX driver volumes in the deployment files. A sample implementation of the EPC memory-based deployment (`kubernetes.azure.com/sgx_epc_mem_in_MiB`) sample is [here](https://github.com/Azure-Samples/confidential-computing/blob/main/containersamples/helloworld/helm/templates/helloworld.yaml)


## Programming models

### Confidential Containers

[Confidential containers](confidential-containers.md) help you run existing unmodified container applications of most **common programming languages** runtimes (Python, Node, Java etc.) confidentially. This packaging model does not need any source-code modifications or recompilation. This is the fastest method to confidentiality that could be achieved by packaging your standard docker containers with Open-Source Projects or Azure Partner Solutions. In this packaging and execution model all parts of the container application are loaded in the trusted boundary (enclave). This model works well for off the shelf container applications available in the market or custom apps currently running on general purpose nodes.

### Enclave aware containers
Confidential computing nodes on AKS also support containers that are programmed to run in an enclave to utilize **special instruction set** available from the CPU. This programming model allows tighter control of your execution flow and requires use of special SDKs and frameworks. This programming model provides most control of application flow with a lowest Trusted Computing Base (TCB). Enclave aware container development involves untrusted and trusted parts to the container application thus allowing you to manage the regular memory and Encrypted Page Cache (EPC) memory where enclave is executed. [Read more](enclave-aware-containers.md) on enclave aware containers.

## Next Steps

[Deploy AKS Cluster with confidential computing nodes](./confidential-nodes-aks-get-started.md)

[Quick starter confidential container samples](https://github.com/Azure-Samples/confidential-container-samples)

[DCsv2 SKU List](../virtual-machines/dcv2-series.md)

[Defense-in-depth with confidential containers webinar session](https://www.youtube.com/watch?reload=9&v=FYZxtHI_Or0&feature=youtu.be)

<!-- LINKS - external -->
[Azure Attestation]: ../attestation/index.yml


<!-- LINKS - internal -->
[DC Virtual Machine]: /confidential-computing/virtual-machine-solutions
