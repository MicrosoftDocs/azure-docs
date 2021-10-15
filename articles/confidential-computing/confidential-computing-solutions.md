---
title: Building Azure confidential solutions
description: Learn how to build solutions on Azure confidential computing
author: JBCook
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 11/01/2021
ms.author: JenCook
---

# Building confidential computing solutions

Azure confidential computing offers various options for building confidential solutions. The spectrum of option ranges from enabling &quot;lift &amp; shift&quot; scenarios of existing applications, to a full control of various features of security. These features include control on the level of access. This means you set host provider or guest operator access levels to data and code. You can also control other rootkit or malware access that may compromise the integrity of workloads running in the cloud.

Technologies such as secure enclaves or confidential virtual machines allow for customers to choose the approach that they want to take in building confidential solutions.

- Existing applications with no access to source code may benefit from confidential VMs based on AMD SEV-SNP technology for easy onboarding to the Azure confidential computing platform.
- Sophisticated workloads that include proprietary code to protect from any trust vector, may benefit of secure application enclave technology. Azure current offers application enclaves in VMs based on Intel SGX. Intel SGX provides protection of data and code running in a hardware-encrypted memory space. These applications typically require communication with an attested secure enclave, which is obtained by using open-source frameworks.
- Containerized solutions running on [confidential containers](confidential-containers.md) enabled in Azure Kubernetes Service may fit customers looking for a balanced approach to confidentiality. In these scenarios, existing apps can be packaged and deployed in containers with limited changes, but still offering full security isolation from the cloud service provider and administrators.

![confidential computing spectrum](media/confidential-computing-solutions/spectrum.png)

_The Azure confidential computing spectrum._

## Application development on Intel SGX

This section  discusses concepts related to application development for Azure confidential computing Intel SGX virtual machines. Before reading this section,it&#39;s recommended to read the [introduction of Intel SGX virtual machines and enclaves](confidential-computing-enclaves.md).

To leverage the power of enclaves and isolated environments, you&#39;ll need to use tools that support confidential computing. There are various tools that support enclave application development. For example, you can use these open-source frameworks:

- [The Open Enclave Software Development Kit (OE SDK)](enclave-development-oss.md#oe-sdk)
- [The Intel SGX SDK](enclave-development-oss.md#intel-sdk)
- [The EGo Software Development Kit](enclave-development-oss.md#ego)
- [The Confidential Consortium Framework (CCF)](enclave-development-oss.md#ccf)

An application built with enclaves is partitioned in two ways:

1. An &quot;untrusted&quot; component (the host)
2. A &quot;trusted&quot; component (the enclave)

The host is where your enclave application is running on top of and is an untrusted environment. The enclave code deployed on the host can&#39;t be accessed by the host.

The enclave is where the application code and its cached data/memory runs. Secure computations should occur in the enclaves to ensure secrets and sensitive data, stay protected.

During application design, it&#39;s important to identify and determine what part of the application needs to run in the enclaves. The code that you choose to put into the trusted component is isolated from the rest of your application. Once the enclave is initialized and the code is loaded to memory, that code can&#39;t be read or changed from the untrusted components.

## Open Enclave Software Development Kit (OE SDK)

Use a library or framework supported by your provider if you want to write code that runs in an enclave. The [Open Enclave SDK](https://github.com/openenclave/openenclave) (OE SDK) is an open-source SDK that allows abstraction over different confidential computing-enabled hardware.

The OE SDK is built to be a single abstraction layer over any hardware on any cloud service provider. The OE SDK can be used in Azure confidential computing virtual machines to create and run applications running inside secure enclaves.

## EGo Software Development Kit

[EGo](https://ego.dev/) is an open-source SDK that enables you to run applications written in the Go programming language inside enclaves. EGo builds on top of the OE SDK and comes with an in-enclave Go library for attestation and sealing. Many existing Go applications run on EGo without modifications.

## Intel SGX Software Development Kit

The [Intel SGX SDK](https://01.org/intel-softwareguard-extensions) is developed and maintained by the SGX team at Intel. The SDK is a collection tools allowing software developers to create and debug Intel SGX enabled applications in C/C++.

## Gramine

[Gramine](https://grapheneproject.io/) (formerly known as Graphene) is a lightweight guest OS, designed to run a single Linux application with minimal host requirements. Gramine can run applications in an isolated environment with benefits comparable to running a complete OS and has good tooling support for converting existing docker container application to Gramine Shielded Containers (GSC).

Get started with a sample application and deployment on AKS [here](https://graphene.readthedocs.io/en/latest/cloud-deployment.html#azure-kubernetes-service-aks).

## Occlum

[Occlum](https://occlum.io/) is a memory-safe, multi-process library OS (LibOS) for Intel SGX. It enables legacy applications to run on SGX with little to no modifications to source code. Occlum transparently protects the confidentiality of user workloads while allowing an easy lift and shift to existing docker applications.

Occlum supports AKS deployments. Follow the deployment instructions with various sample apps [here](https://github.com/occlum/occlum/blob/master/docs/azure_aks_deployment_guide.md).

## Marblerun

[Marblerun](https://marblerun.sh/) is an orchestration framework for confidential containers. It makes it easy to run and scale confidential services on SGX-enabled Kubernetes. Marblerun takes care of boilerplate tasks like verifying the services in your cluster, managing secrets for them, and establishing enclave-to-enclave mTLS connections between them. Marblerun also ensures that your cluster of confidential containers adheres to a manifest defined in simple JSON. The manifest can be verified by external clients via remote attestation.

In a nutshell, Marblerun extends the confidentiality, integrity, and verifiability properties of a single enclave to a Kubernetes cluster.

Marblerun supports confidential containers created with Graphene, Occlum, and EGo. Examples for each SDK are given [here](https://docs.edgeless.systems/marblerun/#/examples?id=examples). Marblerun is built to run on Kubernetes and alongside your existing cloud-native tooling. It comes with an easy-to-use CLI and helm charts. It has first-class support for confidential computing nodes on AKS. Information on how to deploy Marblerun on AKS can be found [here](https://docs.edgeless.systems/marblerun/#/deployment/cloud?id=cloud-deployment).

## Confidential Consortium Framework

The [Confidential Consortium Framework](https://www.microsoft.com/research/project/confidential-consortium-framework/) ([CCF](https://www.microsoft.com/research/project/confidential-consortium-framework/)) is an example of a distributed blockchain framework built on top of Azure confidential computing. Spearheaded by Microsoft Research, this framework leverages the power of trusted execution environments (TEEs) to create a network of remote enclaves for attestation. Nodes can run on top of Azure virtual machines ([DCsv2-Series](confidential-computing-enclaves.md) and take advantage of the enclave infrastructure. Through attestation protocols, users of the blockchain can verify the integrity of one CCF node, and effective verify the entire network.

In the CCF, the decentralized ledger is made up of recorded changes to a Key-Value store that is replicated across all the network nodes. Each of these nodes runs a transaction engine that can be triggered by users of the blockchain over TLS. When you trigger an endpoint, you mutate the Key-Value store. Before the encrypted change is recorded to the decentralized ledger, it must be agreed upon by more than one node to reach consensus.

## Next Steps
