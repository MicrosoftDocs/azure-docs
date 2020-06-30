---
title: Azure Attestation 
description: XXX
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Azure Attestation

Microsoft Azure Attestation is a new solution for attesting Trusted Execution Environments (TEEs) such as Software Guard Extensions (SGX) enclaves and Virtualization-based Security (VBS) enclaves. Enclave attestation is a process for verifying that an enclave is secure and trustworthy.

Attestation, the central tenet of Azure Attestation, is a process for demonstrating that software binaries were properly instantiated on a trusted platform. Remote relying parties can then gain confidence that only such intended software is running on trusted hardware. Azure Attestation is a unified customer-facing service and framework for attestation. 

Azure Attestation enables cutting-edge security paradigms such as Confidential Computing and Intelligent Edge protection. These innovative approaches take cloud security to a new level by introducing data encryption while in-use (in memory). Such capabilities allow customers to pave their path to the Azure cloud. As a result, customers can tap into disruptive business models which hitherto required highly scalable compute resources and uncompromising trust, an often-impossible combination. Concretely, customers have been requesting the ability to independently verify the location of a machine, the posture of a virtual machine (VM) on that machine, and the environment within which enclaves are running on that VM. Azure Attestation will empower these and many additional customer requests. 

Azure Attestation receives evidence from compute entities, turns them into a set of claims, validates them against configurable policies, and produces cryptographic proofs for claims-based applications (for example, relying parties and auditing authorities ).

## Confidential Computing and TEEs

[Azure confidential computing](https://azure.microsoft.com/solutions/confidential-compute/) (ACC) protects confidentiality and integrity of customer’s data and code while in use in the Azure public cloud. ACC is aimed to protect data from the following threats:
- Malicious insiders (tenant employees or Microsoft employees) with administrative privilege or direct access to hardware on which data is being processed
- Hackers and malware that exploit bugs in the operating system, application, or hypervisor
- Third parties accessing the data without customer’s consent
ACC ensures that the data is protected inside a Trusted Execution environment (TEE – also known as enclave). Only authorized code is permitted to run and to access data inside a TEE, so data is protected against viewing and modification from the outside of the TEE .

Protection of data using ACC is accomplished in two ways:

- Hardware: Azure can offer hardware-protected virtual machines that run on Intel® Software Guard Extensions (SGX) technology. Intel® SGX is a set of extensions to the Intel® CPU architecture that aims to provide integrity and confidentiality guarantees to sensitive computations performed on a computer, where all the privileged software (kernel, hypervisor and so on) is assumed to be untrusted.
- Hypervisor: Virtualization-based security (VBS) enclaves are a software-¬based TEE that’s implemented by Hyper-V in Windows Server 2016 and beyond. Hyper-V prevents administrator code from running on the Azure server, as well as local administrators and cloud service administrators from viewing the contents of the enclave or modifying its execution.

## Azure Attestation can run in a TEE

Azure Attestation is critical to Confidential Computing scenarios, as Azure Attestation performs the following actions:
- Verifies if the enclave evidence is valid 
- Evaluates the enclave evidence against a customer-defined policy 
- Manages and stores tenant specific policies
- Generates and signs a token that is used by relying parties to interact with the enclave

Azure Attestation is built to run in two types of environments:
- Azure Attestation running in an SGX enabled TEE
- Azure Attestation running in a non TEE which is currently supported with Business continuity and disaster recovery (BCDR) capability

Azure Attestation customers have expressed a requirement for Microsoft to be operationally out of trusted computing base (TCB). This is to prevent Microsoft entities such as VM admins, Host admins and Microsoft developers from modifying attestation requests, policies and Azure Attestation-issued tokens. To meet the needs of these customers, Azure Attestation is also built in a way to run in TEE where features of Azure Attestation like quote validation, token generation, token signing and policy management are moved into a SGX enclave

## Why use Azure Attestation

Azure Attestation is the preferred choice for attesting TEEs as it offers the following benefits: 
- Azure Attestation is an Azure service and will offer Service Level Agreement (SLA)
- Azure Attestation leverages Azure Active Directory for authenticating client requests. This enables Azure Attestation to perform attestation based on identity and ownership
- Azure Attestation supports policies which allow tenant owners to restrict token generation
- Azure Attestation implementation in an SGX enclave offers protection of its data while in use
In the future, the tokens generated by Azure Attestation can be leveraged by other Azure services to facilitate supervised and policy-enforced release of collateral into attested and authorized enclaves.

## Regional availability

The below table describes Azure Attestation rollout plan in different regions.

| Region | Environment type | Supported services in Azure | Availability status |
|--|--|--|--|
| UK South | TEE | SGX enclave attestation | Live |
| US East 2 | Non TEE | SGX & VBS enclave attestation | Live 
| Central US | Non TEE | SGX & VBS enclave attestation | Live
| Canada Central | | | Expected soon |
| US East  – AZ1 | | | Expected soon |
| US East – AZ2 | | | Expected soon |
| US East  – AZ3 | | | Expected soon |
| Europe West – Availability Zone1 (AZ1) | | | Expected soon |
| Europe West – AZ2 | | | Expected soon |
| Europe West – AZ3 | | | Expected soon |
| Canada East | | | Expected soon |

## BCDR support

Business Continuity and Disaster Recovery (BCDR) for Azure Attestation enables to mitigate service disruptions resulting from significant availability issues or disaster events in a region. 

Below are the regions that are supported by BCDR
- East US 2 => Paired with Central US 
- Central US => Paired with East US 2 

Service fabric clusters are deployed in two regions and will serve completely independently under normal circumstances. In case of fault/outage of one region, below will be the workflow: 
- Azure Attestation BCDR will provide seamless failover in which customers do not need to take any extra step to recover
- Azure Traffic Manager for the region will detect the health probe is degraded and switch the endpoint to paired region
- Existing connections will not work and will receive internal server error or timeout issues
- All control plane operations will be blocked. Customers will not be able to create attestation providers and update policies in the primary region
- All data plane operations which includes attest calls will continue to work in primary region

## Next steps

