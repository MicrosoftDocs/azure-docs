---
title: Infrastructure double encryption - Azure Database for MySQL
description: Learn about using Infrastructure double encryption to add a second layer of encryption with a service managed keys.
ms.service: mysql
ms.subservice: single-server
author: mksuni
ms.author: sumuth
ms.topic: conceptual
ms.date: 06/20/2022
---

# Azure Database for MySQL Infrastructure double encryption

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL uses storage [encryption of data at-rest](concepts-security.md#at-rest) for data using Microsoft's managed keys. Data, including backups, are encrypted on disk and this encryption is always on and can't be disabled. The encryption uses FIPS 140-2 validated cryptographic module and an AES 256-bit cipher for the Azure storage encryption.

Infrastructure double encryption adds a second layer of encryption using service-managed keys. It uses FIPS 140-2 validated cryptographic module, but with a different encryption algorithm. This provides an additional layer of protection for your data at rest. The key used in Infrastructure double encryption is also managed by the Azure Database for MySQL service. Infrastructure double encryption is not enabled by default since the additional layer of encryption can have a performance impact.

> [!NOTE]
> Like data encryption at rest, this feature is supported only on "General Purpose storage v2 (support up to 16TB)" storage available in General Purpose and Memory Optimized pricing tiers. Refer [Storage concepts](concepts-pricing-tiers.md#storage) for more details. For other limitations, refer to the [limitation](concepts-infrastructure-double-encryption.md#limitations) section.

Infrastructure Layer encryption has the benefit of being implemented at the layer closest to the storage device or network wires. Azure Database for MySQL implements the two layers of encryption using service-managed keys. Although still technically in the service layer, it is very close to hardware that stores the data at rest. You can still optionally enable data encryption at rest using [customer managed key](concepts-data-encryption-mysql.md) for the provisioned MySQL server. 

Implementation at the infrastructure layers also supports a diversity of keys. Infrastructure must be aware of different clusters of machine and networks. As such, different keys are used to minimize the blast radius of infrastructure attacks and a variety of hardware and network failures. 

> [!NOTE]
> Using Infrastructure double encryption will have 5-10% impact on the throughput of your Azure Database for MySQL server due to the additional encryption process.

## Benefits

Infrastructure double encryption for Azure Database for MySQL provides the following benefits:

1. **Additional diversity of crypto implementation** - The planned move to hardware-based encryption will further diversify the implementations by providing a hardware-based implementation in addition to the software-based implementation.
2. **Implementation errors** - Two layers of encryption at infrastructure layer protects against any errors in caching or memory management in higher layers that exposes plaintext data. Additionally, the two layers also ensures against errors in the implementation of the encryption in general.

The combination of these provides strong protection against common threats and weaknesses used to attack cryptography.

## Supported scenarios with infrastructure double encryption

The encryption capabilities that are provided by Azure Database for MySQL can be used together. Below is a summary of the various scenarios that you can use:

|  ##   | Default encryption | Infrastructure double encryption | Data encryption using Customer-managed keys  |
|:------|:------------------:|:--------------------------------:|:--------------------------------------------:|
| 1     | *Yes*              | *No*                             | *No*                                         |
| 2     | *Yes*              | *Yes*                            | *No*                                         |
| 3     | *Yes*              | *No*                             | *Yes*                                        |
| 4     | *Yes*              | *Yes*                            | *Yes*                                        |
|       |                    |                                  |                                              |

> [!Important]
> - Scenario 2 and 4 can introduce 5-10 percent drop in throughput based on the workload type for Azure Database for MySQL server due to the additional layer of infrastructure encryption.
> - Configuring Infrastructure double encryption for Azure Database for MySQL is only allowed during server create. Once the server is provisioned, you cannot change the storage encryption. However, you can still enable Data encryption using customer-managed keys for the server created with/without infrastructure double encryption.

## Limitations

For Azure Database for MySQL, the support for infrastruction double encryption has few limitations -

* Support for this functionality is limited to **General Purpose** and **Memory Optimized** pricing tiers.
* This feature is only supported in regions and servers, which support general purpose storage v2 (up to 16 TB). For the list of Azure regions supporting storage up to 16 TB, refer to the storage section in documentation [here](concepts-pricing-tiers.md#storage)

    > [!NOTE]
    > - All new MySQL servers created in the [Azure regions](concepts-pricing-tiers.md#storage) supporting general purpose storage v2, support for encryption with customer manager keys is **available**. Point In Time Restored (PITR) server or read replica will not qualify though in theory they are ‘new’.
    > - To validate if your provisioned server general purpose storage v2, you can go to the pricing tier blade in the portal and see the max storage size supported by your provisioned server. If you can move the slider up to 4TB, your server is on general purpose storage v1 and will not support encryption with customer managed keys. However, the data is encrypted using service managed keys at all times. Please reach out to AskAzureDBforMySQL@service.microsoft.com if you have any questions.



## Next steps

Learn how to [set up Infrastructure double encryption for Azure database for MySQL](how-to-double-encryption.md).
