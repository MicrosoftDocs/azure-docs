---
title: Enable Transparent Data Encryption for Stretch Database
description: Enable Transparent Data Encryption (TDE) for SQL Server Stretch Database on Azure
services: sql-server-stretch-database
documentationcenter: ''
ms.assetid: a44ed8f5-b416-4c41-9b1e-b7271f10bdc3
ms.service: sql-server-stretch-database
ms.workload: data-management
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 06/14/2016
author: blazem-msft
ms.author: blazem
ms.reviewer: jroth
manager: jroth
ms.custom: "seo-lt-2019"
---
# Enable Transparent Data Encryption (TDE) for Stretch Database on Azure
> [!div class="op_single_selector"]
> * [Azure portal](sql-server-stretch-database-encryption-tde.md)
> * [TSQL](sql-server-stretch-database-tde-tsql.md)
>
>

Transparent Data Encryption (TDE) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.

TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key. The database encryption key is protected by a built-in server certificate. The built-in server certificate is unique for each Azure server. Microsoft automatically rotates these certificates at least every 90 days. For a general description of TDE, see [Transparent Data Encryption (TDE)].

## Enabling Encryption
To enable TDE for an Azure database that's storing the data migrated from a Stretch-enabled SQL Server database, do the following things:

1. Open the database in the [Azure portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
   ![Screenshot of the Azure portal, with the Settings blade visible. In the General section, Transparent data encryption is highlighted.][1]
4. Select the **On** setting, and then select **Save**
   ![Screenshot of the Azure portal, with the Transparent data encryption blade visible. Data encryption is turned on, and the Save button is highlighted.][2]

## Disabling Encryption
To disable TDE for an Azure database that's storing the data migrated from a Stretch-enabled SQL Server database, do the following things:

1. Open the database in the [Azure portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
4. Select the **Off** setting, and then select **Save**

<!--Anchors-->
[Transparent Data Encryption (TDE)]: /sql/relational-databases/security/encryption/transparent-data-encryption


<!--Image references-->
[1]: ./media/sql-server-stretch-database-encryption-tde/stretchtde1.png
[2]: ./media/sql-server-stretch-database-encryption-tde/stretchtde2.png


<!--Link references-->