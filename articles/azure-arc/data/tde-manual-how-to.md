---
title: Turn on Transparent Data Encryption (TDE) manually in Azure Arc-enabled SQL Managed Instance
description: How-to guide to turn on Transparent Data Encryption (TDE) in an Azure Arc-enabled SQL Managed Instance
author: patelr3
ms.author: ravpate
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.reviewer: mikeray
ms.topic: how-to
ms.date: 05/22/2022
ms.custom: template-how-to
---

# Enable TDE on an Azure Arc-enabled SQL Managed Instance

This article described how to enable Transparent Data Encryption on a database created in an Azure Arc-enabled SQL Managed Instance.

# Prerequisites

Before you proceed with this article, you must have an Azure Arc-enabled SQL Managed Instance resource created and have connected to it.

- [An Azure Arc-enabled SQL Managed Instance created](./create-sql-managed-instance.md)
- [Connect to Azure Arc-enabled SQL Managed Instance](./connect-managed-instance.md)

## Turn on TDE on a Database in Azure Arc-enabled SQL Managed Instance

Turning on TDE in Azure Arc-enabled SQL Managed Instance follows the same steps as Azure SQL Managed Instance. Follow the steps described in [Azure SQL Managed Instance's Transparent Data Encryption guide](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver15#enable-tde).

After creating the necessary credentials, it is highly recommended to backup any newly created credentials.

## Backup a TDE Credential from Azure Arc-enabled SQL Managed Instance

When backing up from Azure Arc-enabled SQL Managed Instance, the credentials should be stored on one of the volume mounts paths within the container. The mount path for the data volume within the container is `/var/opt/mssql/data`, so this would be an appropriate location to place these credentials. Below is an example of backing up a certificate from Azure Arc-enabled SQL Managed Instance.

1. Backup the certificate from the container to `/var/opt/mssql/data`.

```sql
BACKUP CERTIFICATE MyServerCert TO FILE = '/var/opt/mssql/data/servercert.crt'
WITH PRIVATE KEY ( FILE = '/var/opt/mssql/data/servercert.key',
ENCRYPTION BY PASSWORD = '<UseStrongPasswordHere>')
```

2. Copy the certificate from the container to your file system.

```bash
kubectl cp -n arc-ns -c arc-sqlmi sql-0:/var/opt/mssql/data/servercert.crt $HOME/sqlcerts/servercert.crt
```

3. Copy the private key from the container to your file system.

```bash
kubectl cp -n arc-ns -c arc-sqlmi sql-0:/var/opt/mssql/data/servercert.key $HOME/sqlcerts/servercert.key
```

## Restore a TDE Credential to Azure Arc-enabled SQL Managed Instance

Similar to above, restore the credentials by copying them into the container and running the corresponding T-SQL afterwards.

1. Copy the certificate from your file system to the container.

```bash
kubectl cp -n onprem-indirect -c arc-sqlmi $HOME/sqlcerts/servercert.crt sql-0:/var/opt/mssql/data/servercert.crt
```

2. Copy the private key from your file system to the container.

```bash
kubectl cp -n onprem-indirect -c arc-sqlmi $HOME/sqlcerts/servercert.key sql-0:/var/opt/mssql/data/servercert.key
```

3. Create the certificate using file paths from `/var/opt/mssql/data`

```sql
CREATE CERTIFICATE MyServerCertRestored
FROM FILE = '/var/opt/mssql/data/servercert.crt'
WITH PRIVATE KEY ( FILE = '/var/opt/mssql/data/servercert.key',
    DECRYPTION BY PASSWORD = '<UseStrongPasswordHere>' )
```
