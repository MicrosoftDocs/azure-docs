---
title: Secret and key management in Azure confidential computing
description: Understanding how confidential computing handles secrets and keys
author: vinfnet
ms.author: sgallagher
ms.service: confidential-computing
ms.topic: conceptual
ms.date: 06/09/2023
ms.custom: template-concept
---
# Secrets and Key Management

Confidential computing provides advanced capabilities for protecting secrets and keys whilst they are in-use to enhance the security posture of an application.

Confidential computing enabled services use keys managed by the [hardware root of trust](trusted-compute-base.md#hardware-root-of-trust) to inform [Attestation](attestation.md) services and encrypt and decrypt data inside the Trusted Execution Environment ([TEE](trusted-execution-environment.md)).

This is a key part of protection for Confidential virtual machines (CVM) and many other services built upon CVMs like [confidential node pools on AKS](confidential-node-pool-aks.md) or data services that support confidential SKUs like Azure Data Explorer.

For example, systems can be configured so that keys are only released once code has proven (via Attestation) that it is executing inside a TEE - this is known as [Secure Key Release (SKR)](concept-skr-attestation.md) - this powerful feature is useful for applications that need to read encrypted data from Azure blob storage into a TEE where it can be securely decrypted and processed in the clear.

CVMs rely on virtual Trusted Platform Modules (vTPM) you can read more about this in [Virtual TPMs in Azure](virtual-tpms-in-azure-confidential-vm.md)

The [Azure Managed HSM](../key-vault/managed-hsm/overview.md) offering is [built on Confidential Computing technologies] (managed-hsm/managed-hsm-technical-details.md) and can be used to enhance access control of secrets & keys for an application.
