---
title: "Enable Intel SGX for Always Encrypted"
description: "Learn how to enable Intel SGX for Always Encrypted with secure enclaves in Azure SQL Database by selecting an SGX-enabled hardware generation."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.devlang: 
ms.topic: conceptual
author: jaszymas
ms.author: jaszymas
ms.reviwer: vanto
ms.date: 07/14/2021 
---
# Enable Intel SGX for Always Encrypted for your Azure SQL Database 

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]


[Always Encrypted with secure enclaves](/sql/relational-databases/security/encryption/always-encrypted-enclaves) in Azure SQL Database uses [Intel Software Guard Extensions (Intel SGX)](https://itpeernetwork.intel.com/microsoft-azure-confidential-computing/) enclaves. For Intel SGX to be available, the database must use the [vCore model](service-tiers-vcore.md) and the [DC-series](service-tiers-sql-database-vcore.md#dc-series) hardware generation.

Configuring the DC-series hardware generation to enable Intel SGX enclaves is the responsibility of the Azure SQL Database administrator. See [Roles and responsibilities when configuring SGX enclaves and attestation](always-encrypted-enclaves-plan.md#roles-and-responsibilities-when-configuring-sgx-enclaves-and-attestation).

> [!NOTE]
> Intel SGX is not available in hardware generations other than DC-series. For example, Intel SGX is not available for Gen5 hardware, and it is not available for databases using the [DTU model](service-tiers-dtu.md).

> [!IMPORTANT]
> Before you configure the DC-series hardware generation for your database, check the regional availability of DC-series and make sure you understand its performance limitations. For more information, see [DC-series](service-tiers-sql-database-vcore.md#dc-series).

For detailed instructions for how to configure a new or existing database to use a specific hardware generation, see [Selecting a hardware generation](service-tiers-sql-database-vcore.md#selecting-a-hardware-generation).
   
## Next steps

- [Configure Azure Attestation for your Azure SQL database server](always-encrypted-enclaves-configure-attestation.md)

## See also

- [Tutorial: Getting started with Always Encrypted with secure enclaves in Azure SQL Database](always-encrypted-enclaves-getting-started.md)