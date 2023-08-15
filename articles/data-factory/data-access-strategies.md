---
title: Data access strategies
description: Azure Data Factory now supports Static IP address ranges.
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.date: 07/13/2023
---

# Data access strategies

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

A vital security goal of an organization is to protect their data stores from random access over the internet, may it be an on-premises or a Cloud/ SaaS data store.

Typically a cloud data store controls access using the below mechanisms:
* Private Link from a Virtual Network to Private Endpoint enabled data sources
* Firewall rules that limit connectivity by IP address
* Authentication mechanisms that require users to prove their identity
* Authorization mechanisms that restrict users to specific actions and data

> [!TIP]
> With the [introduction of Static IP address range](./azure-integration-runtime-ip-addresses.md), you can now allow list IP ranges for the particular Azure integration runtime region to ensure you don’t have to allow all Azure IP addresses in your cloud data stores. This way, you can restrict the IP addresses that are permitted to access the data stores.

> [!NOTE]
> The IP address ranges are blocked for Azure Integration Runtime and is currently only used for Data Movement, pipeline and external activities. Dataflows and Azure Integration Runtime that enable Managed Virtual Network now do not use these IP ranges.

This should work in many scenarios, and we do understand that a unique Static IP address per integration runtime would be desirable, but this wouldn't be possible using Azure Integration Runtime currently, which is serverless. If necessary, you can always set up a Self-hosted Integration Runtime and use your Static IP with it.

## Data access strategies through Azure Data Factory

* **[Private Link](../private-link/private-link-overview.md)** - You can create an Azure Integration Runtime within Azure Data Factory Managed Virtual Network and it will leverage private endpoints to securely connect to supported data stores. Traffic between Managed Virtual Network and data sources travels the Microsoft backbone network and is not exposed to the public network.
* **[Trusted Service](../storage/common/storage-network-security.md#exceptions)** - Azure Storage (Blob, ADLS Gen2) supports firewall configuration that enables select trusted Azure platform services to access the storage account securely. Trusted Services enforces Managed Identity authentication, which ensures no other data factory can connect to this storage unless approved to do so using it's managed identity. You can find more details in **[this blog](https://techcommunity.microsoft.com/t5/azure-data-factory/data-factory-is-now-a-trusted-service-in-azure-storage-and-azure/ba-p/964993)**. Hence, this is extremely secure and recommended.
* **Unique Static IP** - You will need to set up a self-hosted integration runtime to get a Static IP for Data Factory connectors. This mechanism ensures you can block access from all other IP addresses.
* **[Static IP range](./azure-integration-runtime-ip-addresses.md)** - You can use Azure Integration Runtime's IP addresses to allow list it in your storage (say S3, Salesforce, etc.). It certainly restricts IP addresses that can connect to the data stores but also relies on Authentication/ Authorization rules.
* **[Service Tag](../virtual-network/service-tags-overview.md)** - A service tag represents a group of IP address prefixes from a given Azure service (like Azure Data Factory). Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. It is useful when filtering data access on IaaS hosted data stores in Virtual Network.
* **Allow Azure Services** - Some services lets you allow all Azure services to connect to it in case you choose this option.

For more information about supported network security mechanisms on data stores in Azure Integration Runtime and Self-hosted Integration Runtime, see below two tables.
* **Azure Integration Runtime**

   | Data Stores                  | Supported Network Security Mechanism on Data Stores | Private Link     | Trusted Service     | Static IP range | Service Tags | Allow Azure Services |
    |------------------------------|-------------------------------------------------------------|---------------------|-----------------|--------------|----------------------|-----------------|
    | Azure PaaS Data stores       | Azure Cosmos DB                                     | Yes              | -                   | Yes             | -            | Yes                  |
    |                              | Azure Data Explorer                                 | -                | -                   | Yes*            | Yes*         | -                    |
    |                              | Azure Data Lake Gen1                                | -                | -                   | Yes             | -            | Yes                  |
    |                              | Azure Database for MariaDB, MySQL, PostgreSQL       | -                | -                   | Yes             | -            | Yes                  |
    |                              | Azure Files                                  | Yes              | -                   | Yes             | -            | .                    |
    |                              | Azure Blob storage and ADLS Gen2                     | Yes              | Yes (MSI auth only) | Yes             | -            | .                    |
    |                              | Azure SQL DB,  Azure Synapse Analytics), SQL   Ml  | Yes (only Azure SQL DB/DW)        | -                   | Yes             | -            | Yes                  |
    |                              | Azure Key Vault (for fetching secrets/   connection string) | yes      | Yes                 | Yes             | -            | -                    |
    | Other PaaS/ SaaS Data stores | AWS   S3, SalesForce, Google Cloud Storage, etc.    | -                | -                   | Yes             | -            | -                    |
    |                               | Snowflake                                         |   Yes             |   -                 | Yes             | -         | -                         |
    | Azure IaaS                   | SQL Server, Oracle,   etc.                          | -                | -                   | Yes             | Yes          | -                    |
    | On-premises IaaS              | SQL Server, Oracle,   etc.                          | -                | -                   | Yes             | -            | - 
    
    
    **Applicable only when Azure Data Explorer is virtual network injected, and IP range can be applied on NSG/ Firewall.*

* **Self-hosted Integration Runtime (in VNet/on-premises)**

    | Data   Stores                  | Supported Network   Security Mechanism on Data Stores         | Static IP | Trusted   Services  |
    |--------------------------------|---------------------------------------------------------------|-----------|---------------------|
    | Azure PaaS   Data stores       | Azure Cosmos DB                                               | Yes       | -                   |
    |                                | Azure Data Explorer                                           | -         | -                   |
    |                                | Azure Data Lake Gen1                                          | Yes       | -                   |
    |                                | Azure Database for   MariaDB, MySQL, PostgreSQL               | Yes       | -                   |
    |                                | Azure Files                                            | Yes       | -                   |
    |                                | Azure Blob storage and ADLS Gen2                             | Yes       | Yes (MSI auth only) |
    |                                | Azure SQL DB, Azure Synapse Analytics), SQL   Ml          | Yes       | -                   |
    |                                | Azure Key Vault (for   fetching secrets/   connection string) | Yes       | Yes                 |
    | Other PaaS/   SaaS Data stores | AWS   S3, SalesForce, Google Cloud Storage, etc.              | Yes       | -                   |
    | Azure laaS                     | SQL Server,   Oracle,   etc.                                  | Yes       | -                   |
    | On-premise   laaS              | SQL Server,   Oracle,   etc.                                  | Yes       | -                   |

## Next steps

For more information, see the following related articles:
* [Supported data stores](./copy-activity-overview.md#supported-data-stores-and-formats)
* [Azure Key Vault ‘Trusted Services’](../key-vault/general/overview-vnet-service-endpoints.md#trusted-services)
* [Azure Storage ‘Trusted Microsoft Services’](../storage/common/storage-network-security.md#trusted-microsoft-services)
* [Managed identity for Data Factory](./data-factory-service-identity.md)
