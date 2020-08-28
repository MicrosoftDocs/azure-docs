---
title: Azure Attestation overview
description: An overview of Microsoft Azure Attestation, a solution for attesting Trusted Execution Environments (TEEs)
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 07/20/2020
ms.author: mbaldwin


---
# Microsoft Azure Attestation (preview)

Microsoft Azure Attestation is a solution for attesting Trusted Execution Environments (TEEs) such as [Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html) (SGX) enclaves and [Virtualization-based Security](/windows-hardware/design/device-experiences/oem-vbs) (VBS) enclaves. Enclave attestation is a process for verifying that an enclave is secure and trustworthy.

Attestation is a process for demonstrating that software binaries were properly instantiated on a trusted platform. Remote relying parties can then gain confidence that only such intended software is running on trusted hardware. Azure Attestation is a unified customer-facing service and framework for attestation. 

Azure Attestation enables cutting-edge security paradigms such as [Azure Confidential computing](../confidential-computing/overview.md) and Intelligent Edge protection. Customers have been requesting the ability to independently verify the location of a machine, the posture of a virtual machine (VM) on that machine, and the environment within which enclaves are running on that VM. Azure Attestation will empower these and many additional customer requests. 

Azure Attestation receives evidence from compute entities, turns them into a set of claims, validates them against configurable policies, and produces cryptographic proofs for claims-based applications (for example, relying parties and auditing authorities ).

## Use cases
Azure Attestation provides comprehensive attestation services for multiple environments and distinctive use cases.

### SGX attestation
SGX refers to hardware grade isolation, which is supported on certain Intel CPUs models. SGX enables code to run in sanitized compartments known as SGX enclaves. Access and memory permissions are then managed by hardware to ensure a minimal attack surface with proper isolation.

Client applications can be designed to take advantage of SGX enclaves by delegating security-sensitive tasks to take place inside those enclaves. Such applications can then make use of Azure Attestation to routinely establish trust in the enclave and its ability to access sensitive data.

### VBS attestation
VBS is a software-based architecture for an enclave memory protection based on Hyper-V. It prevents host admin code, as well as local and cloud service administrators from accessing the data in a VBS enclave or affecting its execution.

In a similar fashion to SGX technology, Azure Attestation supports validating VBS enlcaves against configured policies and issuing a certification statement as proof of validity.

### Open Enclave
[Open Enclave](https://openenclave.io/sdk/) (OE) is a collection of libraries targeted at creating a single unified enclaving abstraction for developer to build TEEs based applications. It offers a universal secure app model that minimizes platform specificities. Microsoft views it as an essential stepping-stone toward democratizing hardware based enclave technologies such as SGX and increasing their uptake on Azure.

OE standardizes specific requirements for verification of an enclave evidence. This qualifies OE as a highly fitting attestation consumer of Azure Attestation.

## Azure Attestation can run in a TEE

Azure Attestation is critical to Confidential Computing scenarios, as it performs the following actions:
- Verifies if the enclave evidence is valid 
- Evaluates the enclave evidence against a customer-defined policy 
- Manages and stores tenant specific policies
- Generates and signs a token that is used by relying parties to interact with the enclave

Azure Attestation is built to run in two types of environments:
- Azure Attestation running in an SGX enabled TEE
- Azure Attestation running in a non TEE

Azure Attestation customers have expressed a requirement for Microsoft to be operationally out of trusted computing base (TCB). This is to prevent Microsoft entities such as VM admins, host admins and Microsoft developers from modifying attestation requests, policies and Azure Attestation-issued tokens. With a goal to meet the needs of these customers, Azure Attestation is also built in a way to run in TEE where features of Azure Attestation like quote validation, token generation and token signing are moved into an SGX enclave.

## Why use Azure Attestation

Azure Attestation is the preferred choice for attesting TEEs as it offers the following benefits: 
- Azure Attestation is a free service and will offer Service Level Agreement (SLA) from General Availability
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
| East US| TEE | SGX enclave attestation | Live |
| Canada Central | TEE | SGX enclave attestation | Live |
| Canada East | TEE | SGX enclave attestation | Expected soon |
| West US | TEE | SGX enclave attestation | Expected soon |
| West Europe | TEE | SGX enclave attestation | Expected soon |
| North Europe | TEE | SGX enclave attestation | Expected soon |
| UK West | TEE | SGX enclave attestation | Expected soon |

## BCDR support

[Business Continuity and Disaster Recovery](/azure/best-practices-availability-paired-regions) (BCDR) for Azure Attestation enables to mitigate service disruptions resulting from significant availability issues or disaster events in a region. 

Below are the regions that are currently supported by BCDR
- East US 2 => Paired with Central US 
- Central US => Paired with East US 2 

Clusters deployed in two regions will serve completely independently under normal circumstances. In case of fault/outage of one region, below will be the workflow: 
- Azure Attestation BCDR will provide seamless failover in which customers do not need to take any extra step to recover
- [Azure Traffic Manager](../traffic-manager/index.yml) for the region will detect the health probe is degraded and switch the endpoint to paired region
- Existing connections will not work and will receive internal server error or timeout issues
- All control plane operations will be blocked. Customers will not be able to create attestation providers and update policies in the primary region
- All data plane operations which includes attest calls will continue to work in primary region

## Next steps
- Learn about [Azure Attestation basic concepts](basic-concepts.md)
- [How to author and sign an attestation policy](author-sign-policy.md)
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)

