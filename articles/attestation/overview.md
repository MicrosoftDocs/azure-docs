---
title: Azure Attestation overview
description: An overview of Microsoft Azure Attestation, a solution for attesting Trusted Execution Environments (TEEs)
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin
ms.custom: references_regions

---
# Microsoft Azure Attestation 

Microsoft Azure Attestation is a unified solution for remotely verifying the trustworthiness of a platform and integrity of the binaries running inside it. The service supports attestation of the platforms backed by Trusted Platform Modules (TPMs) alongside the ability to attest to the state of Trusted Execution Environments (TEEs) such as [Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) (SGX) enclaves, [Virtualization-based Security](/windows-hardware/design/device-experiences/oem-vbs) (VBS) enclaves, [Trusted Platform Modules (TPMs)](/windows/security/information-protection/tpm/trusted-platform-module-overview),  [Trusted launch for Azure VMs](../virtual-machines/trusted-launch.md) and [Azure confidential VMs](../confidential-computing/confidential-vm-overview.md).

Attestation is a process for demonstrating that software binaries were properly instantiated on a trusted platform. Remote relying parties can then gain confidence that only such intended software is running on trusted hardware. Azure Attestation is a unified customer-facing service and framework for attestation.

Azure Attestation enables cutting-edge security paradigms such as [Azure Confidential computing](../confidential-computing/overview.md) and Intelligent Edge protection. Customers have been requesting the ability to independently verify the location of a machine, the posture of a virtual machine (VM) on that machine, and the environment within which enclaves are running on that VM. Azure Attestation will empower these and many additional customer requests.

Azure Attestation receives evidence from compute entities, turns them into a set of claims, validates them against configurable policies, and produces cryptographic proofs for claims-based applications (for example, relying parties and auditing authorities).

## Use cases

Azure Attestation provides comprehensive attestation services for multiple environments and distinctive use cases.

### SGX enclave attestation

[Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) (SGX) refers to hardware-grade isolation, which is supported on certain Intel CPU models. SGX enables code to run in sanitized compartments known as SGX enclaves. Access and memory permissions are then managed by hardware to ensure a minimal attack surface with proper isolation.

Client applications can be designed to take advantage of SGX enclaves by delegating security-sensitive tasks to take place inside those enclaves. Such applications can then make use of Azure Attestation to routinely establish trust in the enclave and its ability to access sensitive data.

Intel® Xeon® Scalable processors only support [ECDSA-based attestation solutions](https://software.intel.com/content/www/us/en/develop/topics/software-guard-extensions/attestation-services.html#Elliptic%20Curve%20Digital%20Signature%20Algorithm%20(ECDSA)%20Attestation) for remotely attesting SGX enclaves. Utilizing ECDSA based attestation model, Azure Attestation supports validation of Intel® Xeon® E3 processors and Intel® Xeon® Scalable processor-based server platforms.

> [!NOTE]
> To perform attestation of Intel® Xeon® Scalable processor-based server platforms using Azure Attestation, users are expected to install [Azure DCAP version 1.10.0](https://github.com/microsoft/Azure-DCAP-Client) or higher.

### Open Enclave attestation
[Open Enclave](https://openenclave.io/sdk/) (OE) is a collection of libraries targeted at creating a single unified enclaving abstraction for developers to build TEE-based applications. It offers a universal secure app model that minimizes platform specificities. Microsoft views it as an essential stepping-stone toward democratizing hardware-based enclave technologies such as SGX and increasing their uptake on Azure.

OE standardizes specific requirements for verification of an enclave evidence. This qualifies OE as a highly fitting attestation consumer of Azure Attestation.

### TPM attestation 

[Trusted Platform Modules (TPM)](/windows/security/information-protection/tpm/trusted-platform-module-overview) based attestation is critical to provide proof of a platform's state. A TPM acts as the root of trust and the security coprocessor to provide cryptographic validity to the measurements (evidence). Devices with a TPM can rely on attestation to prove that boot integrity is not compromised and use the claims to detect feature state enablement during boot. 

Client applications can be designed to take advantage of TPM attestation by delegating security-sensitive tasks to only take place after a platform has been validated to be secure. Such applications can then make use of Azure Attestation to routinely establish trust in the platform and its ability to access sensitive data.

### AMD SEV-SNP attestation 

Azure [Confidential VM](../confidential-computing/confidential-vm-overview.md) (CVM) is based on [AMD processors with SEV-SNP technology](../confidential-computing/virtual-machine-solutions-amd.md). CVM offers VM OS disk encryption option with platform-managed keys or customer-managed keys and binds the disk encryption keys to the virtual machine's TPM. When a CVM boots up, SNP report containing the guest VM firmware measurements will be sent to Azure Attestation. The service validates the measurements and issues an attestation token that is used to release keys from [Managed-HSM](../key-vault/managed-hsm/overview.md) or [Azure Key Vault](../key-vault/general/basic-concepts.md). These keys are used to decrypt the vTPM state of the guest VM, unlock the OS disk and start the CVM. The attestation and key release process is performed automatically on each CVM boot, and the process ensures the CVM boots up only upon successful attestation of the hardware.

### Trusted Launch attestation 

Azure customers can [prevent bootkit and rootkit infections](https://www.youtube.com/watch?v=CQqu_rTSi0Q) by enabling [trusted launch](../virtual-machines/trusted-launch.md) for their virtual machines (VMs). When the VM is Secure Boot and vTPM enabled with guest attestation extension installed, vTPM measurements get submitted to Azure Attestation periodically for monitoring boot integrity. An attestation failure indicates potential malware, which is surfaced to customers via Microsoft Defender for Cloud, through Alerts and Recommendations.

## Azure Attestation runs in a TEE

Azure Attestation is critical to Confidential Computing scenarios, as it performs the following actions:

- Verifies if the enclave evidence is valid.
- Evaluates the enclave evidence against a customer-defined policy.
- Manages and stores tenant-specific policies.
- Generates and signs a token that is used by relying parties to interact with the enclave.

To keep Microsoft operationally out of trusted computing base (TCB), critical operations of Azure Attestation like quote validation, token generation, policy evaluation and token signing are moved into an SGX enclave.

## Why use Azure Attestation

Azure Attestation is the preferred choice for attesting TEEs as it offers the following benefits: 

- Unified framework for attesting multiple environments such as TPMs, SGX enclaves and VBS enclaves 
- Allows creation of custom attestation providers and configuration of policies to restrict token generation
- Offers [regional shared providers](basic-concepts.md#regional-shared-provider) which can attest with no configuration from users
- Protects its data while-in use with implementation in an SGX enclave
- Highly available service 

## Business Continuity and Disaster Recovery (BCDR) support

[Business Continuity and Disaster Recovery](../availability-zones/cross-region-replication-azure.md) (BCDR) for Azure Attestation enables to mitigate service disruptions resulting from significant availability issues or disaster events in a region.

Clusters deployed in two regions will operate independently under normal circumstances. In the case of a fault or outage of one region, the following takes place:

- Azure Attestation BCDR will provide seamless failover in which customers do not need to take any extra step to recover
- The [Azure Traffic Manager](../traffic-manager/index.yml) for the region will detect that the health probe is degraded and switches the endpoint to paired region
- Existing connections will not work and will receive internal server error or timeout issues
- All control plane operations will be blocked. Customers will not be able to create attestation providers in the primary region
- All data plane operations, including attest calls and policy configuration, will be served by secondary region. Customers can continue to work on data plane operations with the original URI corresponding to primary region

## Next steps
- Learn about [Azure Attestation basic concepts](basic-concepts.md)
- [How to author and sign an attestation policy](author-sign-policy.md)
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)
