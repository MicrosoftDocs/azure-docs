---
title: Confidential computing application enclave nodes on Azure Kubernetes Service (AKS)
description: Intel SGX based confidential computing VM nodes with application enclave support
services: virtual-machines
author: agowdamsft
ms.service: confidential-computing
ms.topic: overview
ms.date: 07/15/2022
ms.author: amgowda
ms.custom: ignite-fall-2021
---

# Application enclave support with Intel SGX based confidential computing nodes on Azure Kubernetes Service

[Azure confidential computing](overview.md) allows you to protect your sensitive data while it's in use. Intel SGX based enclaves allows running application packaged as a container within AKS. Containers run within a Trusted Execution Environment(TEE) brings isolation from other containers, the node kernel in a hardware protected, integrity protected attestable environment.

## Overview

Azure Kubernetes Service (AKS) supports adding [Intel SGX confidential computing VM nodes](confidential-computing-enclaves.md) as agent pools in a cluster. These nodes allow you to run sensitive workloads within a hardware-based TEE. TEEs allow user-level code from containers to allocate private regions of memory to execute the code with CPU directly. These private memory regions that execute directly with CPU are called enclaves. Enclaves help protect the data confidentiality, data integrity and code integrity from other processes running on the same nodes, as well as Azure operator. The Intel SGX execution model also removes the intermediate layers of Guest OS, Host OS and Hypervisor thus reducing the attack surface area. The *hardware based per container isolated execution* model in a node allows applications to directly execute with the CPU, while keeping the special block of memory encrypted per container. Confidential computing nodes with confidential containers are a great addition to your zero-trust, security planning and defense-in-depth container strategy.

:::image type="content" source="./media/confidential-nodes-aks-overview/sgx-aks-node.png" alt-text="Graphic of AKS Confidential Compute Node, showing confidential containers with code and data secured inside.":::

## Intel SGX confidential computing nodes feature

- Hardware based, process level container isolation through Intel SGX trusted execution environment (TEE)
- Heterogenous node pool clusters (mix confidential and non-confidential node pools)
- Encrypted Page Cache (EPC) memory-based pod scheduling through "confcom" AKS addon
- Intel SGX DCAP driver pre-installed and kernel dependency installed
- CPU consumption based horizontal pod autoscaling and cluster autoscaling
- Linux Containers support through Ubuntu 18.04 Gen 2 VM worker nodes

## Confidential Computing add-on for AKS
The add-on feature enables extra capability on AKS when running confidential computing Intel SGX capable node pools on the cluster. "confcom" add-on on AKS enables the features below.

#### Azure Device Plugin for Intel SGX <a id="sgx-plugin"></a>

The device plugin implements the Kubernetes device plugin interface for Encrypted Page Cache (EPC) memory and exposes the device drivers from the nodes. Effectively, this plugin makes EPC memory as another resource type in Kubernetes. Users can specify limits on this resource just as other resources. Apart from the scheduling function, the device plugin helps assign Intel SGX device driver permissions to confidential container deployments. With this plugin developer can avoid mounting the Intel SGX driver volumes in the deployment files. This add-on on AKS clusters run as a daemonset per VM node that is of Intel SGX capable. A sample implementation of the EPC memory-based deployment (`kubernetes.azure.com/sgx_epc_mem_in_MiB`) sample is [here](https://github.com/Azure-Samples/confidential-computing/blob/main/containersamples/helloworld/helm/templates/helloworld.yaml)

#### Intel SGX Quote Helper with Platform Software Components <a id="sgx-plugin"></a>

As part of the plugin another daemonset is deployed  per VM node that are of Intel SGX capable on the AKS cluster. This daemonset helps your confidential container apps when a remote out-of-proc attestation request is invoked. 

Enclave applications that do remote attestation need to generate a quote. The quote provides cryptographic proof of the identity and the state of the application, along with the enclave's host environment. Quote generation relies on certain trusted software components from Intel, which are part of the SGX Platform Software Components (PSW/DCAP). This PSW is packaged as a daemon set that runs per node. You can use the PSW when requesting attestation quote from enclave apps. Using the AKS provided service helps better maintain the compatibility between the PSW and other SW components in the host with Intel SGX drivers that are part of the AKS VM nodes. Read more on how your apps can use this daemonset without having to package the attestation primitives as part of your container deployments [More here](confidential-nodes-aks-addon.md#psw-with-sgx-quote-helper)

## Programming models

### Confidential containers through partners and OSS

[Confidential containers](confidential-containers.md) help you run existing unmodified container applications of most **common programming languages** runtimes (Python, Node, Java etc.) confidentially. This packaging model does not need any source-code modifications or recompilation and is the fastest method to run in an Intel SGX enclaves achieved by packaging your standard docker containers with Open-Source Projects or Azure Partner Solutions. In this packaging and execution model all parts of the container application are loaded in the trusted boundary (enclave). This model works well for off the shelf container applications available in the market or custom apps currently running on general purpose nodes. Learn more on the prep and deployment process [here](confidential-containers-enclaves.md)

### Enclave aware containers
Confidential computing nodes on AKS also support containers that are programmed to run in an enclave to utilize **special instruction set** available from the CPU. This programming model allows tighter control of your execution flow and requires use of special SDKs and frameworks. This programming model provides most control of application flow with a lowest Trusted Computing Base (TCB). Enclave aware container development involves untrusted and trusted parts to the container application thus allowing you to manage the regular memory and Encrypted Page Cache (EPC) memory where enclave is executed. [Read more](enclave-aware-containers.md) on enclave aware containers.

## Frequently asked questions (FAQ)
Find answers to some of the common questions about Azure Kubernetes Service (AKS) node pool support for Intel SGX based confidential computing nodes [here](confidential-nodes-aks-faq.yml)

## Next Steps

[Deploy AKS Cluster with confidential computing nodes](./confidential-enclave-nodes-aks-get-started.md)

[Quick starter confidential container samples](https://github.com/Azure-Samples/confidential-container-samples)

[Intel SGX Confidential VMs - DCsv2 SKU List](../virtual-machines/dcv2-series.md)

[Intel SGX Confidential VMs - DCsv3 SKU List](../virtual-machines/dcv3-series.md)

[Defense-in-depth with confidential containers webinar session](https://www.youtube.com/watch?reload=9&v=FYZxtHI_Or0&feature=youtu.be)

<!-- LINKS - external -->
[Azure Attestation]: ../attestation/index.yml

<!-- LINKS - internal -->
[DC Virtual Machine]: /confidential-computing/virtual-machine-solutions-sgx.md
