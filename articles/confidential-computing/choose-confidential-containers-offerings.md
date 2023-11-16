---
title: Choose container offerings for confidential computing
description: How to choose the right confidential container offerings to meet your security, isolation and developer needs.
author: angarg05
ms.service: container-service
ms.topic: conceptual
ms.date: 11/01/2021
ms.author: ananyagarg
ms.custom:
  - ignite-fall-2021
  - ignite-2023
---

# Preread Recommendations

This document is designed to help you guide through the process of selecting a container offering on Azure Confidential Computing that best suits your workload requirements and security posture. To make the most of the guide, we recommend the following prereads.

## Azure Compute Decision Matrix

Familiarize yourself with the overall [Azure Compute offerings](/azure/architecture/guide/technology-choices/compute-decision-tree) to understand the broader context in which Azure Confidential Computing operates.

## Introduction to Azure Confidential Computing

Azure Confidential Computing offers solutions to enable isolation of your sensitive data while it's being processed in the cloud. You can read more about confidential computing [Azure confidential computing](./overview.md).

## Attestation

Attestation is a process that provides assurances regarding the integrity and identity of the hardware and software environments in which applications run. In Confidential Computing, attestation allows you to verify that your applications are running on trusted hardware and in a trusted execution environment. 

Learn more about attestation and Microsoft Azure Attestation service at [Attestation in Azure](../attestation/basic-concepts.md)

## Definition of memory isolation

In confidential computing, memory isolation is a critical feature that safeguards data during processing. The Confidential Computing Consortium defines memory isolation as:

> "Memory isolation is the ability to prevent unauthorized access to data in memory, even if the attacker has compromised the operating system or other privileged software. This is achieved by using hardware-based features to create a secure and isolated environment for confidential workload."

## Choosing a Container offering on Azure Confidential Computing

Azure Confidential Computing offers various solutions for container deployment and management, each tailored for different levels of isolation and attestation capabilities.

Your current setup and operational needs dictate the most relevant path through this document. If you're already utilizing Azure Kubernetes Service (AKS) or have dependencies on Kubernetes APIs, we recommend following the AKS paths. On the other hand, if you're transitioning from a Virtual Machine setup and are interested in exploring serverless containers, the ACI (Azure Container Instances) path should be of interest.

## Azure Kubernetes Service (AKS)

### Confidential VM Worker Nodes

- **Guest Attestation**: Ability to verify that you're operating on a confidential virtual machine provided by Azure.
- **Memory Isolation**: VM level isolation with unique memory encryption key per VM.
- **Programming model**: Zero to minimal changes for containerized applications. Support is limited to containers that are Linux based (containers using a Linux base image for the container).

You can find more information on [Getting started with CVM worker nodes with a lift and shift workload to CVM node pool.](../aks/use-cvm.md)

### Confidential Containers on AKS

- **Full Guest Attestation**: Enables attestation of the full confidential computing environment including the workload.
- **Memory Isolation**: Node level isolation with a unique memory encryption key per VM.
- **Programming model**: Zero to minimal changes for containerized applications (containers using a Linux base image for the container).
- **Ideal Workloads**: Applications with sensitive data processing, multi-party computations, and regulatory compliance requirements.

You can find more information on [Getting started with CVM worker nodes with a lift and shift workload to CVM node pool.](../aks/use-cvm.md)

### Confidential Computing Nodes with Intel SGX

- **Application enclave Attestation**: Enables attestation of the container running, in scenarios where the VM isn't trusted, but only the application is trusted, ensuring a heightened level of security and trust in the application's execution environment.
- **Isolation**: Process level isolation.
- **Programming model**: Requires the use of open-source library OS or vendor solutions to run existing containerized applications. Support is limited to containers that are Linux based (containers using a Linux base image for the container).
- **Ideal Workloads**: High-security applications such as key management systems.

You can find more information about the offering and our partner solutions [here](./confidential-containers.md).

## Serverless

### Confidential Containers on Azure Container Instances (ACI)

- **Full Guest Attestation**: Enables attestation of the full confidential computing environment including the workload.
- **Isolation**: Container group level isolation with a unique memory encryption key per container group.
- **Programming model**: Zero to minimal changes for containerized applications. Support is limited to containers that are Linux based (containers using a Linux base image for the container).
- **Ideal Workloads**: Rapid development and deployment of simple containerized workloads without orchestration. Support for bursting from AKS using Virtual Nodes.

You can find more details at [Getting started with Confidential Containers on ACI](../container-instances/container-instances-confidential-overview.md).

## Learn more

> [Intel SGX Confidential Virtual Machines on Azure](./virtual-machine-solutions-sgx.md)
> [Confidential Containers on Azure](./confidential-containers.md)
