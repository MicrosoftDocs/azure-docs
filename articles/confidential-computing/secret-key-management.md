---
title: Secret and Key Management in Azure Confidential Computing
description: This article helps you to understand how confidential computing handles secrets and keys.
author: vinfnet
ms.author: sgallagher
ms.service: azure
ms.topic: concept-article
ms.date: 06/09/2023
ms.custom: template-concept
ms.subservice: confidential-computing
# Customer intent: As a security architect, I want to understand how confidential computing manages secrets and keys, so that I can implement robust security measures for applications using sensitive data.
---
# Secrets and key management

Confidential computing provides advanced capabilities for protecting secrets and keys while they're in use to enhance the security posture of an application.

Confidential computing-enabled services use keys managed by the [hardware root of trust](trusted-compute-base.md#hardware-root-of-trust) to inform [attestation](attestation.md) services and encrypt and decrypt data inside the Trusted Execution Environment ([TEE](trusted-execution-environment.md)).

Keys are an important part of protection for confidential virtual machines (CVMs) and many other services built on CVMs like [confidential node pools on Azure Kubernetes Service](confidential-node-pool-aks.md) or data services that support confidential products like Azure Data Explorer.

For example, you can configure systems so that keys are released only after the code proves (via attestation) that it's executing inside a TEE. This behavior is known as [secure key release](concept-skr-attestation.md). This powerful feature is useful for applications that need to read encrypted data from Azure Blob Storage into a TEE where it can be securely decrypted and processed in the clear.

CVMs rely on virtual Trusted Platform Modules (vTPMs). You can read more about this technology in [Virtual TPMs in Azure](virtual-tpms-in-azure-confidential-vm.md).

The [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview) offering is [built on confidential computing technologies](/azure/key-vault/managed-hsm/managed-hsm-technical-details). You can use it to enhance access control of the secrets and keys for an application.
