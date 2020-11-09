---
title: "Plan for Intel SGX enclaves and attestation in Azure SQL Database"
description: "Plan the deployment of Always Encrypted with secure enclaves in Azure SQL Database."
keywords: encrypt data, sql encryption, database encryption, sensitive data, Always Encrypted, secure enclaves, SGX, attestation
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: how-to
author: jaszymas
ms.author: vanto
ms.reviwer: 
ms.date: 12/09/2020
--- 
# Plan for Intel SGX enclaves and attestation in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

[Always Encrypted with secure enclaves](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-enclaves)] in Azure SQL Database uses [Intel Software Guard Extensions (Intel SGX)](https://itpeernetwork.intel.com/microsoft-azure-confidential-computing/) enclaves and requires [Microsoft Azure Attestation](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-enclaves#secure-enclave-attestation).

## Plan for Intel SGX for in Azure SQL Database

Intel SGX is a hardware-based trusted execution environment technology. Intel SGX is available for databases that use the [vCore model](service-tiers-vcore.md) and one specific [hardware generation](service-tiers-vcore.md#hardware-generations) - [DC-series](service-tiers-vcore.md?#dc-series). Therefore, to ensure you can use Always Encrypted with secure enclaves in your database, you need to either select the DC-series hardware generation when you create the database, or you can update your existing database to use the DC-series hardware generation.

> [!NOTE]
> Intel SGX is not available in hardware generations other than DC-series, for example, Gen5, and it is not available for databases using the [DTU model](service-tiers-dtu.md).

> [!IMPORTANT]
> Before you configure the DC-series hardware generation for your database, check the regional availability of DC-series and make sure you understand its performance limitations. For details, see [DC-series](service-tiers-vcore.md#dc-series).

For detailed instructions for how to configure a new or existing database to use a specific hardware generation, see [Selecting a hardware generation](service-tiers-vcore.md#selecting-a-hardware-generation).


## Plan for attestation in Azure SQL Database

[Microsoft Azure Attestation](../../attestation/overview.md) (preview) is a solution for attesting Trusted Execution Environments (TEEs), including Intel SGX enclaves in Azure SQL databases using the DC-series hardware configuration.

To use Azure Attestation for attesting Intel SGX enclaves in Azure SQL Database, you need to:

1. Create an [attestation provider](../../attestation/basic-concepts.md#attestation-provider) and configure it with an attestation policy. 

2. Grant your Azure SQL database server access to the created attestation provider.

## Next steps

- [Enable Intel SGX for your Azure SQL database](./always-encrypted-enclaves-enable-sgx.md)

## See also

- [Tutorial: Getting started with Always Encrypted with secure enclaves in Azure SQL Database](always-encrypted-enclaves-getting-started.md)