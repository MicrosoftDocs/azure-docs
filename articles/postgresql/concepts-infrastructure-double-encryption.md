---
title: Infrastructure double encryption - Azure Database for PostgreSQL
description: Learn about using Infrastructure double encryption to add a second layer of encryption with a service-managed keys.
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 6/29/2020
---

# Azure Database for PostgreSQL Infrastructure double encryption

> [!NOTE]
> At this time, you must request access to use this capability. To do so, please contact AskAzureDBforPostgreSQL@service.microsoft.com.

Azure Database for PostgreSQL uses storage [encryption of data at-rest](concepts-security.md#at-rest) for data using Microsoft's managed keys. Data, including backups, are encrypted on disk and this encryption is always on and can't be disabled. The encryption uses FIPS 140-2 validated cryptographic module and an AES 256-bit cipher for the Azure storage encryption.

Infrastructure double encryption adds a second layer of encryption using service-managed keys. It uses FIPS 140-2 validated cryptographic module but a different encryption algorithm, which gives additional layer of protection for your data at rest. The key used in Infrastructure Double encryption is also managed by service. Infrastructure double encryption is not On by default since it will have performance impact due to the additional layer of encryption.

> [!NOTE]
> This feature is available in all Azure regions where Azure Database for PostgreSQL supports "General Purpose" and "Memory Optimized" pricing tiers.

Infrastructure Layer encryption has the benefit of being implemented at the layer closest to the storage device or network wires. Azure database for PostgreSQL implements the two layers of encryption using service-managed keys. Although still technically in the Service layer, it is very close to hardware for that stores the data at rest. Customer still can enable data encryption at rest using customer-managed key for the provisioned PostgreSQL server.  

Implementation at the infrastructure layers also supports a diversity of keys. Infrastructure must be aware of different clusters of machine and networks. As such, different keys are used to minimize the blast radius of infrastructure attacks and a variety of hardware and network failures. 

> [!NOTE]
> Using Infrastructure double encryption will have performance impact on the Azure Database for PostgreSQL server due to the additional encryption being done.

## Benefits

Infrastructure double encryption for Azure Database for PostgreSQL provides the following benefits:

1. **Addition diversity of crypto implementation** - The planned move to hardware-based encryption will further diversify the implementations by providing a hardware-based implementation in addition to the software-based implementation.
2. **Implementation errors** - By having two layers of encryption at infrastructure layer it protects against any errors in caching or memory management in higher layers that exposes plaintext data. Additionally, by having two layers for encryption it also ensures against errors in the implementation of the encryption in general. 

The combination of these different protections provides strong protections against common threats and weaknesses used to attack cryptography.

## Supported scenarios with infrastructure double encryption

The encryption capabilities that are provided by Azure Database for PostgreSQL can be used together as well. here is a summary of the various scenarios that can be used by the customers.

|  ##   | Default encryption | Infrastructure double encryption | Data encryption using Customer-managed keys  |
|:------|:------------------:|:--------------------------------:|:--------------------------------------------:|
| 1     | *Yes*              | *No*                             | *No*                                         |
| 2     | *Yes*              | *Yes*                            | *No*                                         |
| 3     | *Yes*              | *No*                             | *Yes*                                        |
| 4     | *Yes*              | *Yes*                            | *Yes*                                        |
|       |                    |                                  |                                              |

> [!Important]
> - Scenario 2 and 4 will have performance impact on the Azure Database for PostgreSQL server due to the additional layer of infrastructure encryption.
> - Configuring Infrastructure double encryption for Azure Database for PostgreSQL is only allowed during server create. Once the server is provisioned, you cannot change the storage encryption. However, you can still enable Data encryption for the server created with/without infrastructure double encryption.

## Limitations

For Azure Database for PostgreSQL, the support for infrastructure double encryption using service-managed key has few limitations -

* Support for this functionality is limited to **General Purpose** and **Memory Optimized** pricing tiers.
* This functionality is still not available globally. 
* This feature is only supported in regions and servers, which support storage up to 16 TB. For the list of Azure regions supporting storage up to 16 TB, refer to the storage section in documentation [here](concepts-pricing-tiers.md#storage)

    > [!NOTE]
    > - All new PostgreSQL servers created in the regions listed above, support for encryption with customer manager keys is **available**. Point In Time Restored (PITR) server or read replica will not qualify though in theory they are ‘new’.
    > - To validate if your provisioned server supports up to 16 TB, you can go to the pricing tier blade in the portal and see the max storage size supported by your provisioned server. If you can move the slider up to 4TB, your server may not support encryption with customer managed keys. However, the data is encrypted using service-managed keys at all times. Please reach out to AskAzureDBforPostgreSQL@service.microsoft.com if you have any questions.

## Next steps

Learn how to [set up Infrastructure double encryption for Azure database for PostgreSQL](howto-double-encryption.md).