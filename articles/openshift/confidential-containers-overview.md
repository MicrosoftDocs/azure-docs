---
title: Confidential Containers with Azure Red Hat OpenShift (Preview)
description: Discover how to utilize Confidential Containers with Azure Red Hat OpenShift to protect sensitive data.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 11/04/2024
---
# Confidential Containers with Azure Red Hat OpenShift (Preview)

Confidential Containers offer a robust solution to protect sensitive data within cloud environments. By using hardware-based trusted execution environments (TEEs), Confidential Containers provide a secure enclave within the host system, isolating applications and their data from potential threats. This isolation ensures that even if the host system is compromised, the confidential data remains protected.

This article describes the benefits of using Confidential Containers to safeguard sensitive data and explains how Confidential Containers function within Azure Red Hat OpenShift.


## Benefits of Using Confidential Containers

Confidential Containers offer several key benefits:

- Enhanced Data Security: By isolating applications and their data within a secure enclave, Confidential Containers protect sensitive information from unauthorized access, even if the host system is compromised.

- Regulatory Compliance: Industries such as healthcare, finance, and government are subject to stringent data privacy regulations. Confidential Containers can help organizations meet these compliance requirements by providing a robust mechanism for protecting sensitive data.

- Improved Trust and Confidence: Confidential Containers can foster trust between cloud service providers and their customers by demonstrating commitment to data security and privacy.

- Reduced Risk of Data Breaches: The use of Confidential Containers can significantly reduce the risk of data breaches, which can have devastating consequences for organizations.

- Increased Efficiency: Confidential Containers can streamline the development and deployment of applications by providing a secure and efficient environment for running sensitive workloads.

## Typical use cases

The following table describes the most common use cases for deploying Confidential Containers.

|Use case  |Industry  |Example  |
|---------|---------|---------|
|**Regulator compliance**<br>Meeting strict data protection and privacy regulations. |Government, Finance, Healthcare |A healthcare provider using Confidential containers to process and store patient data in compliance with HIPAA regulations. |
|**Multi-tenancy environments**<br>Hosting multiple clients' applications and data with strong isolation. |SaaS providers, Cloud service providers |A cloud service provider offering isolated environments for different clients within the same infrastructure. |
|**Secure AI/ML model training**<br>Training AI models on sensitive data without exposing the data. |AI/ML, Any industry using sensitive data for AI |A financial institution training fraud detection models on customer transaction data. |

## How Confidential Containers work

Confidential Containers is a feature of Red Hat OpenShift sandboxed containers, which provide an isolated environment for running containerized applications. The core of Confidential Containers is the Confidential Virtual Machine (CVM). This specialized virtual machine, operating within a Trusted Execution Environment (TEE), establishes a secure enclave for applications and their associated data. TEEs, hardware-based isolated environments fortified with enhanced security features, ensure that even if the host system is compromised, the data residing within the CVM remains protected.

Azure Red Hat OpenShift serves as the orchestrator, overseeing the sandboxing of workloads (pods) through the utilization of virtual machines. When employing CVMs, Azure Red Hat OpenShift empowers Confidential Container capabilities for your workloads. Once a Confidential Containers workload is created, Azure Red Hat OpenShift deploys it within a CVM executing within the TEE, providing a secure and isolated environment for your sensitive data.

:::image type="content" source="media/confidential-containers-overview/confidential-containers-arch.png" alt-text="Architecture diagram of ARC confidential containers." lightbox="media/confidential-containers-overview/confidential-containers-arch.png":::

The diagram shows the three main steps for using Confidential Containers on an ARO cluster:
1. The OpenShift Sandboxed Containers Operator is deployed on the ARO cluster.
1. Kata Runtime container on an ARO worker node uses the cloud-api-adapter to create a peer pod on a confidential VM.
1. The remote attestation agent on the peer pod initiates the attestation of the container image before the kata-agent deploys it, ensuring the integrity of the image.

### Attestation

Attestation constitutes a fundamental component of Confidential Containers, particularly within the context of zero-trust security. Prior to deploying a workload as a Confidential Containers workload, it's imperative to verify the trustworthiness of the TEE where the workload is executed. Attestation ensures that the TEE is indeed secure and possesses the capability to safeguard your confidential data.

### The Trustee Project

The Trustee project provides the attestation capabilities essential for Confidential Containers. It executes attestation operations and delivers secrets to the TEE following successful verification. Key components of Trustee encompass:

- Trustee agents: These components operate within the CVM, including the Attestation Agent (AA) responsible for transmitting evidence to substantiate the environment's trustworthiness.

- Key Broker Service (KBS): This service functions as an entrypoint for remote attestation, forwarding evidence to the Attestation Service (AS) for verification.

- Attestation Service (AS): This service validates the TEE evidence.

### The Confidential Compute Attestation Operator
The Confidential Compute Attestation Operator, an integral component of the Azure Red Hat OpenShift Confidential Containers solution, facilitates the deployment and management of Trustee services within an Azure Red Hat OpenShift cluster. It streamlines the configuration of Trustee services and the management of secrets for Confidential Containers workloads.

### A Unified perspective

A typical Confidential Containers deployment involves Azure Red Hat OpenShift working with the Confidential Compute Attestation Operator deployed in a separate, trusted environment. The workload is executed within a CVM operating inside a TEE, benefiting from the encrypted memory and integrity guarantees provided by the TEE. Trustee agents residing within the CVM perform attestation and acquire requisite secrets, safeguarding the security and confidentiality of your data.

## Next steps

Now that you know the benefits and various use cases for Confidential Containers, check out [Deploy confidential containers in an Azure Red Hat OpenShift (ARO) cluster](confidential-containers-deploy.md).
