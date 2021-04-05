---
title: "Plan for Intel SGX enclaves and attestation in Azure SQL Database"
description: "Plan the deployment of Always Encrypted with secure enclaves in Azure SQL Database."
keywords: encrypt data, sql encryption, database encryption, sensitive data, Always Encrypted, secure enclaves, SGX, attestation
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.devlang: 
ms.topic: conceptual
author: jaszymas
ms.author: jaszymas
ms.reviwer: vanto
ms.date: 01/15/2021
--- 
# Plan for Intel SGX enclaves and attestation in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Always Encrypted with secure enclaves for Azure SQL Database is currently in **public preview**.

[Always Encrypted with secure enclaves](/sql/relational-databases/security/encryption/always-encrypted-enclaves) in Azure SQL Database uses [Intel Software Guard Extensions (Intel SGX)](https://itpeernetwork.intel.com/microsoft-azure-confidential-computing/) enclaves and requires [Microsoft Azure Attestation](/sql/relational-databases/security/encryption/always-encrypted-enclaves#secure-enclave-attestation).

## Plan for Intel SGX in Azure SQL Database

Intel SGX is a hardware-based trusted execution environment technology. Intel SGX is available for databases that use the [vCore model](service-tiers-vcore.md) and the [DC-series](service-tiers-vcore.md?#dc-series) hardware generation. Therefore, to ensure you can use Always Encrypted with secure enclaves in your database, you need to either select the DC-series hardware generation when you create the database, or you can update your existing database to use the DC-series hardware generation.

> [!NOTE]
> Intel SGX is not available in hardware generations other than DC-series. For example, Intel SGX is not available for Gen5 hardware, and it is not available for databases using the [DTU model](service-tiers-dtu.md).

> [!IMPORTANT]
> Before you configure the DC-series hardware generation for your database, check the regional availability of DC-series and make sure you understand its performance limitations. For details, see [DC-series](service-tiers-vcore.md#dc-series).

## Plan for attestation in Azure SQL Database

[Microsoft Azure Attestation](../../attestation/overview.md) (preview) is a solution for attesting Trusted Execution Environments (TEEs), including Intel SGX enclaves in Azure SQL databases using the DC-series hardware generation.

To use Azure Attestation for attesting Intel SGX enclaves in Azure SQL Database, you need to:

1. Create an [attestation provider](../../attestation/basic-concepts.md#attestation-provider) and configure it with an attestation policy. 

2. Grant your Azure SQL logical server access to the created attestation provider.

## Roles and responsibilities when configuring SGX enclaves and attestation

Configuring your environment to support Intel SGX enclaves and attestation for Always Encrypted in Azure SQL Database involves setting up components of different types: Microsoft Azure Attestation, Azure SQL Database, and applications that trigger enclave attestation. Configuring components of each type is performed by users assuming one of the below distinct roles:

- Attestation administrator - creates an attestation provider in Microsoft Azure Attestation, authors the attestation policy, grants Azure SQL logical server access to the attestation provider, and shares the attestation URL that points to the policy to application administrators.
- Azure SQL Database administrator - enables SGX enclaves in databases by selecting the DC-series hardware generation, and provides the attestation administrator with the identity of the Azure SQL logical server that needs to access the attestation provider.
- Application administrator - configures applications with the attestation URL obtained from the attestation administrator.

In production environments (handling real sensitive data), it is important your organization adheres to role separation when configuring attestation, where each distinct role is assumed by different people. In particular, if the goal of deploying Always Encrypted in your organization is to reduce the attack surface area by ensuring Azure SQL Database administrators cannot access sensitive data, Azure SQL Database administrators should not control attestation policies.

## Next steps

- [Enable Intel SGX for your Azure SQL database](always-encrypted-enclaves-enable-sgx.md)

## See also

- [Tutorial: Getting started with Always Encrypted with secure enclaves in Azure SQL Database](always-encrypted-enclaves-getting-started.md)