---
title: Turn on transparent data encryption (TDE) manually in Azure Arc-enabled SQL Managed Instance
description: How-to guide to turn on transparent data encryption (TDE) in an Azure Arc-enabled SQL Managed Instance
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

# Enable transparent data encryption (TDE) on Azure Arc-enabled SQL Managed Instance

This article described how to enable (TDE) on a database created in an Azure Arc-enabled SQL Managed Instance.

## Prerequisites

Before you proceed with this article, you must have an Azure Arc-enabled SQL Managed Instance resource created and have connected to it.

- [An Azure Arc-enabled SQL Managed Instance created](./create-sql-managed-instance.md)
- [Connect to Azure Arc-enabled SQL Managed Instance](./connect-managed-instance.md)

## Turn on TDE on a Database in Azure Arc-enabled SQL Managed Instance

Turning on TDE in Azure Arc-enabled SQL Managed Instance follows the same steps as Azure SQL Managed Instance. Follow the steps described in [Azure SQL Managed Instance's transparent data encryption guide](/sql/relational-databases/security/encryption/transparent-data-encryption#enable-tde).

After creating the necessary credentials, it's highly recommended to back up any newly created credentials.

## Back up a TDE Credential from Azure Arc-enabled SQL Managed Instance

When backing up from Azure Arc-enabled SQL Managed Instance, the credentials will be stored within the container. It isn't necessary to store the credentials on a persistent volume, but you may use the mount path for the data volume within the container if you'd like: `/var/opt/mssql/data`. Otherwise, the credentials will be stored in-memory in the container.  Below is an example of backing up a certificate from Azure Arc-enabled SQL Managed Instance.

1. Back up the certificate from the container to `/var/opt/mssql/data`.

   ```sql
   BACKUP CERTIFICATE MyServerCert TO FILE = '/var/opt/mssql/data/servercert.crt'
   WITH PRIVATE KEY ( FILE = '/var/opt/mssql/data/servercert.key',
   ENCRYPTION BY PASSWORD = '<UseStrongPasswordHere>')
   ```

2. Copy the certificate from the container to your file system.

   ```console
   kubectl cp -n arc-ns -c arc-sqlmi sql-0:/var/opt/mssql/data/servercert.crt $HOME/sqlcerts/servercert.crt
   ```

3. Copy the private key from the container to your file system.

   ```console
   kubectl cp -n arc-ns -c arc-sqlmi sql-0:/var/opt/mssql/data/servercert.key $HOME/sqlcerts/servercert.key
   ```

4. Delete the certificate and private key from the container.

   ```console
   kubectl exec -it -n arc-ns -c arc-sqlmi sql-0 -- bash -c "rm /var/opt/mssql/data/servercert.crt /var/opt/mssql/data/servercert.key"
   ```

## Restore a TDE Credential to Azure Arc-enabled SQL Managed Instance

Similar to above, restore the credentials by copying them into the container and running the corresponding T-SQL afterwards.

1. Copy the certificate from your file system to the container.

   ```console
   kubectl cp -n arc-ns -c arc-sqlmi $HOME/sqlcerts/servercert.crt sql-0:/var/opt/mssql/data/servercert.crt
   ```

2. Copy the private key from your file system to the container.

   ```console
   kubectl cp -n arc-ns -c arc-sqlmi $HOME/sqlcerts/servercert.key sql-0:/var/opt/mssql/data/servercert.key
   ```

3. Create the certificate using file paths from `/var/opt/mssql/data`.

   ```sql
   CREATE CERTIFICATE MyServerCertRestored
   FROM FILE = '/var/opt/mssql/data/servercert.crt'
   WITH PRIVATE KEY ( FILE = '/var/opt/mssql/data/servercert.key',
       DECRYPTION BY PASSWORD = '<UseStrongPasswordHere>' )
   ```

4. Delete the certificate and private key from the container.

   ```console
   kubectl exec -it -n arc-ns -c arc-sqlmi sql-0 -- bash -c "rm /var/opt/mssql/data/servercert.crt /var/opt/mssql/data/servercert.key"
   ```
## Next steps

[Transparent data encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption)