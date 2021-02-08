---
 title: Confidential computing nodes on Azure Kubernetes Service (AKS)
 description: Confidential computing nodes on AKS
 services: virtual-machines
 author: agowdamsft
 ms.service: container-service
 ms.topic: overview
 ms.date: 2/08/2021
 ms.author: amgowda
 
---

# Confidential computing nodes on Azure Kubernetes Service

[Azure confidential computing](overview.md) allows you to protect your sensitive data while it's in use. The underlying infrastructures protect this data from other applications, administrators, and cloud providers with a hardware backed trusted execution container environments.

## Overview

Azure Kubernetes Service (AKS) supports adding [DCsv2 confidential computing nodes](confidential-computing-enclaves.md) powered by Intel SGX. These nodes run can run sensitive workloads within a hardware-based trusted execution environment (TEE) by allowing user-level code to allocate private regions of memory. These private memory regions are called enclaves. Enclaves are designed protect code and data from processes running at higher privilege. The SGX execution model removes the intermediate layers of Guest OS, Host OS and Hypervisor. The *hardware based per container isolated execution* model allows applications to directly execute with the CPU, while keeping the special block of memory encrypted. Confidential computing nodes help with the overall security posture of container applications on AKS and a great addition to defense-in-depth container strategy. 

![sgx node overview](./media/confidential-nodes-aks-overview/sgxaksnode.jpg)

## AKS Confidential Nodes Features

- Hardware based and process level container isolation through SGX trusted execution environment (TEE) 
- Heterogenous node pool clusters (mix confidential and non-confidential node pools)
- Encrypted Page Cache (EPC) memory-based pod scheduling (required addon)
- SGX DCAP driver pre-installed
- CPU consumption based horizontal pod autoscaling and cluster autoscaling
- Linux Containers support through Ubuntu 18.04 Gen 2 VM worker nodes

## AKS Provided Daemon Set (addon)

#### SGX Device Plugin <a id="sgx-plugin"></a>

The SGX Device Plugin implements the Kubernetes device plugin interface for EPC memory. Effectively, this plugin makes EPC memory an additional resource type in Kubernetes. Users can specify limits on this resource just as other resources. Apart from the scheduling function, the device plugin helps assign SGX device driver permissions to confidential workload containers. A sample implementation of the EPC memory-based deployment (`kubernetes.azure.com/sgx_epc_mem_in_MiB`) sample is [here](https://github.com/Azure-Samples/confidential-computing/blob/main/containersamples/helloworld/helm/templates/helloworld.yaml)


## Programming & application models

### Confidential Containers

[Confidential containers](confidential-containers.md) help you run existing unmodified container applications for most **common programming language** runtime (Python, Node, Java etc.) without any source-code modification or recompilation. This is the easiest model to confidentiality currently supported on AKS through Open Source Projects & Azure Partners. In this execution model all parts of the container/application is loaded in the trusted boundary (enclave)
### Enclave aware containers

AKS supports applications that are programmed to run on confidential nodes and utilize **special instruction set** made available through the SDKs and frameworks. This application model provides most control to your applications with a lowest Trusted Computing Base (TCB). This programming model involves untrusted and trusted parts to the container application that are loaded individually. [Read more](enclave-aware-containers.md) on enclave aware containers.

## Next Steps

[Deploy AKS Cluster with confidential computing nodes](./confidential-nodes-aks-get-started.md)

[Quick starter confidential container samples](https://github.com/Azure-Samples/confidential-container-samples)

[DCsv2 SKU List](../virtual-machines/dcv2-series.md)

<!-- LINKS - external -->
[Azure Attestation]: ../attestation/index.yml


<!-- LINKS - internal -->
[DC Virtual Machine]: /confidential-computing/virtual-machine-solutions
