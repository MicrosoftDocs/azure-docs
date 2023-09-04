---
title: Develop application enclaves with open-source solutions in Azure Confidential Computing
description: Learn how to use tools to develop Intel SGX applications for Azure confidential computing.
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 11/01/2021
ms.author: mamccrea #, raginjup, ananyagarg
ms.custom: ignite-fall-2021, Inspire 2022
---


# Open Source Solutions to Build Enclave Applications

This article goes over open-source solutions for building applications that use application enclaves. Before reading, make sure you read the [enclave applications](application-development.md) conceptual page. 

## Intel SGX-Compatible Tools
Azure offers application enclaves via  [confidential virtual machines with Intel Software Guard Extensions (SGX) enabled](quick-create-portal.md). After deploying an Intel SGX virtual machine, you'll need specialized tools to make your application "enclave aware". This way, you can build applications that have both trusted and untrusted portions of code. 

For example, you can use these open-source frameworks: 

- [The Open Enclave (OE) Software Development Kit (SDK)](#oe-sdk)
- [The EGo SDK](#ego)
- [The Intel SGX SDK](#intel-sdk)
- [The Confidential Consortium Framework (CCF)](#ccf)
- [Intel® Cloud Optimization Modules for Kubeflow](#intel-kubeflow)

If you're not looking to write new application code, you can wrap a containerized application using [confidential container enablers](confidential-containers.md)

### Open Enclave Software Development Kit (OE SDK) <a id="oe-sdk"></a>

Use a library or framework supported by your provider if you want to write code that runs in an enclave. The [Open Enclave SDK](https://github.com/openenclave/openenclave) (OE SDK) is an open-source SDK that allows abstraction over different confidential computing-enabled hardware. 

The OE SDK is built to be a single abstraction layer over any hardware on any CSP. The OE SDK can be used on top of Azure confidential computing virtual machines to create and run applications on top of enclaves. The Open Enclave repository is maintained by Microsoft.

### EGo Software Development Kit <a id="ego"></a>

[EGo](https://ego.dev/) is an open-source SDK that enables you to run applications written in the Go programming language inside enclaves. EGo builds on top of the OE SDK and comes with an in-enclave Go library for attestation and sealing. Many existing Go applications run on EGo without modifications.  

### Intel SGX Software Development Kit <a id="intel-sdk"></a>
The [Intel SGX SDK](https://01.org/intel-softwareguard-extensions) is developed and maintained by the SGX team at Intel. The SDK is a collection tools allowing software developers to create and debug Intel SGX enabled applications in C/C++.

### Confidential Consortium Framework (CCF) <a id="ccf"></a>

The [Confidential Consortium Framework](https://www.microsoft.com/research/project/confidential-consortium-framework/) ([CCF](https://www.microsoft.com/research/project/confidential-consortium-framework/)) is an example of a distributed blockchain framework. The CCF is built on top of Azure confidential computing. Spearheaded by Microsoft Research, this framework uses the power of trusted execution environments (TEEs) to create a network of remote enclaves for attestation. Nodes can run on top of Azure Intel SGX virtual machines and take advantage of the enclave infrastructure. Through attestation protocols, users of the blockchain can verify the integrity of one CCF node, and effective verify the entire network.

In the CCF, the decentralized ledger is made up of recorded changes to a Key-Value store that is replicated across all the network nodes. Each of these nodes runs a transaction engine that can be triggered by users of the blockchain over TLS. When you trigger an endpoint, you mutate the Key-Value store. Before the encrypted change is recorded to the decentralized ledger, it must be agreed upon by more than one node to reach agreement.

### Intel® Cloud Optimization Modules for Kubeflow <a id="intel-kubeflow"></a>

The [Intel® Cloud Optimization Modules for Kubeflow](https://github.com/intel/kubeflow-intel-azure/tree/main) provide an optimized machine learning Kubeflow Pipeline using XGBoost to predict the probability of a loan default. The reference architecture leverages the secure and confidential [Intel® Software Guard Extensions](../../articles/confidential-computing/confidential-computing-enclaves.md) virtual machines on an [Azure Kubernetes Services (AKS) cluster](../../articles/confidential-computing/confidential-containers-enclaves.md). It also enables the use of [Intel® optimizations for XGBoost](https://www.intel.com/content/www/us/en/developer/tools/oneapi/optimization-for-xgboost.html) and [Intel® daal4py](https://www.intel.com/content/www/us/en/developer/articles/guide/a-daal4py-introduction-and-getting-started-guide.html) to accelerate model training and inference in a full end-to-end machine learning pipeline.


## Next steps

- [Attesting application enclaves](attestation.md)
