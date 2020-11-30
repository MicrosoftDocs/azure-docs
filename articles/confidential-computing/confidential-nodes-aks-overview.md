---
 title: Confidential computing nodes on Azure Kubernetes Service (AKS) public preview
 description: Confidential computing nodes on AKS
 services: virtual-machines
 author: agowdamsft
 ms.service: container-service
 ms.topic: overview
 ms.date: 9/22/2020
 ms.author: amgowda
---

# Confidential computing nodes on Azure Kubernetes Service (public preview)

[Azure confidential computing](overview.md) allows you to protect your sensitive data while it's in use. The underlying infrastructures protect this data from other applications, administrators, and cloud providers. 

## Overview

Azure Kubernetes Service (AKS) supports adding [DCsv2 confidential computing nodes](confidential-computing-enclaves.md) on Intel SGX. These nodes run sensitive workloads within a hardware-based trusted execution environment (TEE) by allowing user-level code to allocate private regions of memory. These private memory regions are called enclaves. Enclaves are designed protect code and data from processes running at higher privilege. The SGX execution model removes the intermediate layers of Guest OS and Hypervisor. This allows you to execute container applications directly on top of the CPU, while keeping the special block of memory encrypted. 


![sgx node overview](./media/confidential-nodes-aks-overview/sgxaksnode.jpg)

## AKS Confidential Nodes Features

- Hardware based and process level container isolation through SGX trusted execution environment (TEE) 
- Heterogenous node pool clusters (mix confidential and non-confidential node pools)
- Encrypted Page Cache (EPC) memory-based pod scheduling
- SGX DCAP driver pre-installed
- Intel FSGS Patch pre-installed
- Supports CPU consumption based horizontal pod autoscaling and cluster autoscaling
- Out of proc attestation helper through AKS daemonset
- Linux Containers support through Ubuntu 18.04 Gen 2 VM worker nodes

## AKS Provided Daemon Sets

#### SGX Device Plugin <a id="sgx-plugin"></a>

The SGX Device Plugin implements the Kubernetes device plugin interface for EPC memory. Effectively, this plugin makes EPC memory an additional resource type in Kubernetes. Users can specify limits on this resource just as other resources. Apart from the scheduling function, the device plugin helps assign SGX device driver permissions to confidential workload containers. A sample implementation of the EPC memory-based deployment (`kubernetes.azure.com/sgx_epc_mem_in_MiB`) sample is [here](https://github.com/Azure-Samples/confidential-computing/blob/main/containersamples/helloworld/helm/templates/helloworld.yaml)

#### SGX Quote Helper Service <a id="sgx-quote"></a>

Enclave applications that perform remote attestation need to generate a QUOTE. The QUOTE provides cryptographic proof of the identity and the state of the application, and the environment the enclave is running in. QUOTE generation relies on certain trusted software components from Intel, which are part of the SGX Platform Software Components (PSW/DCAP). This PSW is packaged as a daemon set that runs per node. It can leveraged when requesting attestation QUOTE from enclave apps. Using the AKS provided service will help better maintain the compatibility between the PSW and other SW components in the host. [Read more](confidential-nodes-out-of-proc-attestation.md) on its usage and feature details.

## Programming & application models

### Confidential Containers

[Confidential containers](confidential-containers.md) run existing programs and most **common programming language** runtime (Python, Node, Java etc.), along with their existing library dependencies, without any source-code modification or recompilation. This model is the fastest model to confidentiality enabled through Open Source Projects & Azure Partners. The container images that are made ready created to run in the secure enclaves are termed as confidential containers.

### Enclave aware containers

AKS supports applications that are programmed to run on confidential nodes and utilize **special instruction set** made available through the SDKs and frameworks. This application model provides most control to your applications with a lowest Trusted Computing Base (TCB). [Read more](enclave-aware-containers.md) on enclave aware containers.

## Next Steps

[Deploy AKS Cluster with confidential computing nodes](./confidential-nodes-aks-get-started.md)

[Quick starter confidential container samples](https://github.com/Azure-Samples/confidential-container-samples)

[DCsv2 SKU List](https://docs.microsoft.com/azure/virtual-machines/dcv2-series)

<!-- LINKS - external -->
[Azure Attestation]: https://docs.microsoft.com/en-us/azure/attestation/


<!-- LINKS - internal -->
[DC Virtual Machine]: /confidential-computing/virtual-machine-solutions