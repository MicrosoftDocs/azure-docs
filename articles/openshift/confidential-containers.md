---
title: Use confidential containers to protect sensitive data
description: Discover how to utilize confidential containers to protect senstive data.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 10/09/2024
---
# Use confidential containers to protect sensitive data

Confidential Containers offer a robust solution to protect sensitive data within cloud environments. By leveraging hardware-based trusted execution environments (TEEs), these containers provide a secure enclave within the host system, isolating applications and their data from potential threats. This isolation ensures that even if the host system is compromised, the confidential data remains protected.

This articles describes the benefits of using confidential containers to safeguard senstive data and explains how confidential containers function within Azure Red Hat OpenShift.


## Benefits of Using Confidential Containers

Confidential Containers offer several key benefits:

- Enhanced Data Security: By isolating applications and their data within a secure enclave, Confidential Containers protect sensitive information from unauthorized access, even if the host system is compromised.

- Regulatory Compliance: Industries such as healthcare, finance, and government are subject to stringent data privacy regulations. Confidential Containers can help organizations meet these compliance requirements by providing a robust mechanism for protecting sensitive data.

- Improved Trust and Confidence: Confidential Containers can foster trust between cloud service providers and their customers by demonstrating a commitment to data security and privacy.

- Reduced Risk of Data Breaches: The use of Confidential Containers can significantly reduce the risk of data breaches, which can have devastating consequences for organizations.

- Increased Efficiency: Confidential Containers can streamline the development and deployment of applications by providing a secure and efficient environment for running sensitive workloads.

## How Confidential Containers work

At the core of Confidential Containers lies the Confidential Virtual Machine (CVM). This specialized virtual machine, operating within a Trusted Execution Environment (TEE), establishes a secure enclave for applications and their associated data. TEEs, hardware-based isolated environments fortified with enhanced security features, ensure that even if the host system is compromised, the data residing within the CVM remains protected.

Azure Red Hat OpenShift serves as the orchestrator, overseeing the sandboxing of workloads (pods) through the utilization of virtual machines. When employing CVMs, Azure Red Hat OpenShift empowers confidential container capabilities for your workloads. This signifies that upon creating a Confidential Containers workload, Azure Red Hat OpenShift deploys it within a CVM executing within the TEE, thereby providing a secure and isolated environment for your sensitive data.

### Attestation

Attestation constitutes a fundamental component of Confidential Containers, particularly within the context of zero-trust security. Prior to deploying a workload as a Confidential Containers workload, it is imperative to verify the trustworthiness of the TEE where the workload will be executed. Attestation ensures that the TEE is indeed secure and possesses the capability to safeguard your confidential data.

### The Trustee Project

The Trustee project provides the attestation capabilities essential for Confidential Containers. It executes attestation operations and delivers secrets to the TEE following successful verification. Key components of Trustee encompass:

- Trustee agents: These components operate within the CVM, including the Attestation Agent (AA) responsible for transmitting evidence to substantiate the environment's trustworthiness.

- Key Broker Service (KBS): This service functions as an entrypoint for remote attestation, forwarding evidence to the Attestation Service (AS) for verification.

- Attestation Service (AS): This service validates the TEE evidence.

### The Confidential Compute Attestation Operator
The confidential compute attestation operator, an integral component of the Azure Red Hat OpenShift Confidential Containers solution, facilitates the deployment and management of Trustee services within an Azure Red Hat OpenShift cluster. It streamlines the configuration of Trustee services and the management of secrets for Confidential Containers workloads.


### A Unified Perspective

A typical Confidential Containers deployment involves Azure Red Hat OpenShift working in conjunction with the confidential compute attestation operator deployed in a separate, trusted environment. The workload is executed within a CVM operating inside a TEE, benefiting from the encrypted memory and integrity guarantees provided by the TEE. Trustee agents residing within the CVM perform attestation and acquire requisite secrets, thereby safeguarding the security and confidentiality of your data.

## Next steps

Now that you've considered the use cases for confidential containers, check out [Deploy confidential containers in an Azure Red Hat OpenShift (ARO) cluster](howto-confidential-containers.md).
