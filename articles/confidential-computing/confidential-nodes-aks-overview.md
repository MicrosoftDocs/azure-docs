---
 title: Confidential Computing Nodes on Azure Kubernetes Service (AKS) public preview
 description: Confidential Computing nodes on AKS
 services: virtual-machines
 author: agowdamsft
 ms.service: virtual-machines
 ms.subservice: workloads
 ms.topic: overview
 ms.date: 9/14/2020
 ms.author: amgowda

---

# Confidential Computing nodes on Azure Kubernetes Service (public preview)

Azure confidential computing allows you to protect your sensitive data while it's in use from other applications,administrators and cloud providers. AKS supports adding DCSv2 confidential computing nodes on AKS to run the sensitive workloads within a hardware based Trusted Execution Environment (TEE). The confidential worker nodes run on Intel SGX-based CPUs to create isolated execution between each container to the CPU leverage directly. The SGX execution model removes the intermediate layers of Guest OS and Hypervisor to directly execute your program with CPU while encrypting the memory. Read more about confidential computing and its security [here](https://docs.microsoft.com/azure/virtual-machines/dcv2-series)


![sgx node overview](./media/confidential-nodes-aks-overview/sgxaksnode.jpg)

## Features

1. Hardware based and process level container isolation through SGX trusted execution environment (TEE) 
1. Heterogenous node pool clusters (mix confidential and non-confidential node pools)
1. Encrypted Page Cache (EPC) memory-based pod scheduling
1. SGX DCAP driver pre-installed
1. Intel FSGS Patch pre-installed
1. Supports CPU consumption based horizontal pod autoscaling and cluster autoscaling
1. Intel Platform Software management daemon sets to help with attestation needs
1. Linux Containers support with Gen 2 VM Ubuntu 18.04 worker nodes
1. Supports GA'ed regions of DCSv2  


## AKS Provided Daemon Sets

#### SGX Device Plugin <a id="sgx-device"></a>
SGX Device Plugin daemon set mounts the SGX drivers on-behalf to make Kubernetes clusters aware of Intel SGX hardware per node. Device plugin also helps facilitate proper scheduling of SGX-dependent containers by advertising `kubernetes.azure.com/sgx_epc_mem_in_MiB` as a deployable resource to Kubernetes. This EPC memory keeps track of the deployments to better allocate memory per deployment. View the deployment details of the SGX Device Plugin [here](https://github.com/Azure/aks-engine/blob/master/docs/topics/sgx/device-plugin.yaml)

#### SGX Quote Helper Service <a id="sgx-quote"></a>

Enclave application that performs remote attestation requires to generate quote which provides a cryptographically proof of the identity and the state of the application as well as the environment the enclave is running. The generation of the QUOTE requires trusted software components from Intel, which are part of the Platform Software Components (PSW/DCAP). This PSW is packaged as a daemon set that runs per node and can be leveraged when requesting attestation quote from enclave apps. Using the AKS provided service will help better manage the attestation failures due to driver, microcode and PSW incompatibility. [Read more](platform-software-management.md) on its usage and feature details.


### Confidential Computing Node Configuration
[SGX DCAP Driver version 1.33](https://01.org/intel-softwareguard-extensions/downloads/intel-sgx-dcap-linux-1.3-release)
[Intel FSGS Kernel Patch](https://lkml.org/lkml/2019/10/4/725)
Azure Ubuntu Gen2 18.04

## Programming & application models

### Enclave aware containers

AKS supports applications that are programmed to run on confidential nodes and utilize special instruction set made available through the SDKs and frameworks. This application model provides most control to your applications with a lowest Trusted Computing Base (TCB). Read more on enclave aware containers and samples [here](enclave-aware-containers.md)


### Confidential Containers

Confidential containers run existing programs and most programming language runtime, along with their existing library dependencies, without any source-code modification or recompilation. This model is the fastest model to confidentiality enabled through Open Source Projects & Azure Partners. The container images that are made ready created to run in the secure enclaves are termed as confidential containers. [Read more](confidential-containers.md)

## Getting Started

[Provision Confidential Nodes (DCsv2-Series) on AKS](./confidential-nodes-aks-getstarted.md)

[Quick starter samples confidential containers](https://github.com/Azure-Samples/confidential-container-samples)

[DCsv2 SKU List](https://docs.microsoft.com/azure/virtual-machines/dcv2-series)

<!-- LINKS - external -->
[Azure Attestation]: https://docs.microsoft.com/en-us/azure/attestation/


<!-- LINKS - internal -->
[DC Virtual Machine]: /confidential-computing/virtual-machine-solutions