---
title: Encrypt a database with transparent data encryption manually in Azure Arc-enabled SQL Managed Instance
description: How-to guide to turn on transparent data encryption in an Azure Arc-enabled SQL Managed Instance
author: patelr3
ms.author: ravpate
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.reviewer: mikeray
ms.topic: how-to
ms.date: 05/22/2022
ms.custom: template-how-to, event-tier1-build-2022
---

# Encrypt a database with transparent data encryption on Azure Arc-enabled SQL Managed Instance

This article describes how to enable transparent data encryption on a database created in an Azure Arc-enabled SQL Managed Instance. In this article, the term *managed instance* refers to a deployment of Azure Arc-enabled SQL Managed Instance.

## Prerequisites

Before you proceed with this article, you must have an Azure Arc-enabled SQL Managed Instance resource created and connect to it.

- [Create an Azure Arc-enabled SQL Managed Instance](./create-sql-managed-instance.md)
- [Connect to Azure Arc-enabled SQL Managed Instance](./connect-managed-instance.md)

## Turn on transparent data encryption on a database in the managed instance

Turning on transparent data encryption in the managed instance follows the same steps as SQL Server on-premises. Follow the steps described in [SQL Server's transparent data encryption guide](/sql/relational-databases/security/encryption/transparent-data-encryption#enable-tde).

After you create the necessary credentials, back up any newly created credentials.

## Back up a transparent data encryption credential

When you back up credentials from the managed instance, the credentials are stored within the container. To store credentials on a persistent volume, specify the mount path in the container. For example, `var/opt/mssql/data`. The following example backs up a certificate from the managed instance:

> [!NOTE]
> If the `kubectl cp` command is run from Windows, the command may fail when using absolute Windows paths. Use relative paths or the commands specified below.

1. Back up the certificate from the container to `/var/opt/mssql/data`.

   ```sql
   USE master;
   GO

   BACKUP CERTIFICATE <cert-name> TO FILE = '<cert-path>'
   WITH PRIVATE KEY ( FILE = '<private-key-path>',
   ENCRYPTION BY PASSWORD = '<UseStrongPasswordHere>');
   ```

   Example:

   ```sql
   USE master;
   GO

   BACKUP CERTIFICATE MyServerCert TO FILE = '/var/opt/mssql/data/servercert.crt'
   WITH PRIVATE KEY ( FILE = '/var/opt/mssql/data/servercert.key',
   ENCRYPTION BY PASSWORD = '<UseStrongPasswordHere>');
   ```

2. Copy the certificate from the container to your file system.

### [Windows](#tab/windows)

   ```console
   kubectl exec -n <namespace> -c arc-sqlmi <pod-name> -- cat <pod-certificate-path> > <local-certificate-path>
   ```

   Example:

   ```console
   kubectl exec -n arc-ns -c arc-sqlmi sql-0 -- cat /var/opt/mssql/data/servercert.crt > $HOME\sqlcerts\servercert.crt
   ```

### [Linux](#tab/linux)
   ```console
   kubectl cp --namespace <namespace> --container arc-sqlmi <pod-name>:<pod-certificate-path> <local-certificate-path>
   ```

   Example:

   ```console
   kubectl cp --namespace arc-ns --container arc-sqlmi sql-0:/var/opt/mssql/data/servercert.crt $HOME/sqlcerts/servercert.crt
   ```

---

3. Copy the private key from the container to your file system.

### [Windows](#tab/windows)
   ```console
    kubectl exec -n <namespace> -c arc-sqlmi <pod-name> -- cat <pod-private-key-path> > <local-private-key-path>
   ```

   Example:

   ```console
   kubectl exec -n arc-ns -c arc-sqlmi sql-0 -- cat /var/opt/mssql/data/servercert.key > $HOME\sqlcerts\servercert.key
   ```

### [Linux](#tab/linux)
   ```console
   kubectl cp --namespace <namespace> --container arc-sqlmi <pod-name>:<pod-private-key-path> <local-private-key-path>
   ```

   Example:

   ```console
   kubectl cp --namespace arc-ns --container arc-sqlmi sql-0:/var/opt/mssql/data/servercert.key $HOME/sqlcerts/servercert.key
   ```

---

4. Delete the certificate and private key from the container.

   ```console
   kubectl exec -it --namespace <namespace> --container arc-sqlmi <pod-name> -- bash -c "rm <certificate-path> <private-key-path>
   ```

   Example:

   ```console
   kubectl exec -it --namespace arc-ns --container arc-sqlmi sql-0 -- bash -c "rm /var/opt/mssql/data/servercert.crt /var/opt/mssql/data/servercert.key"
   ```

## Restore a transparent data encryption credential to a managed instance

Similar to above, to restore the credentials, copy them into the container and run the corresponding T-SQL afterwards.

> [!NOTE]
> If the `kubectl cp` command is run from Windows, the command may fail when using absolute Windows paths. Use relative paths or the commands specified below.

1. Copy the certificate from your file system to the container.
### [Windows](#tab/windows)
   ```console
   type <local-certificate-path> | kubectl exec -i -n <namespace> -c arc-sqlmi <pod-name> -- tee <pod-certificate-path>
   ```

   Example:

   ```console
   type $HOME\sqlcerts\servercert.crt | kubectl exec -i -n arc-ns -c arc-sqlmi sql-0 -- tee /var/opt/mssql/data/servercert.crt
   ```

### [Linux](#tab/linux)
   ```console
   kubectl cp --namespace <namespace> --container arc-sqlmi <local-certificate-path> <pod-name>:<pod-certificate-path>
   ```

   Example:

   ```console
   kubectl cp --namespace arc-ns --container arc-sqlmi $HOME/sqlcerts/servercert.crt sql-0:/var/opt/mssql/data/servercert.crt
   ```

---

2. Copy the private key from your file system to the container.
### [Windows](#tab/windows)
   ```console
   type <local-private-key-path> | kubectl exec -i -n <namespace> -c arc-sqlmi <pod-name> -- tee <pod-private-key-path>
   ```

   Example:

   ```console
   type $HOME\sqlcerts\servercert.key | kubectl exec -i -n arc-ns -c arc-sqlmi sql-0 -- tee /var/opt/mssql/data/servercert.key
   ```

### [Linux](#tab/linux)
   ```console
   kubectl cp --namespace <namespace> --container arc-sqlmi <local-private-key-path> <pod-name>:<pod-private-key-path>
   ```

   Example:

   ```console
   kubectl cp --namespace arc-ns --container arc-sqlmi $HOME/sqlcerts/servercert.key sql-0:/var/opt/mssql/data/servercert.key
   ```

---

3. Create the certificate using file paths from `/var/opt/mssql/data`.

   ```sql
   USE master;
   GO

   CREATE CERTIFICATE <certicate-name>
   FROM FILE = '<certificate-path>'
   WITH PRIVATE KEY ( FILE = '<private-key-path>',
       DECRYPTION BY PASSWORD = '<UseStrongPasswordHere>' );
   ```

   Example:

   ```sql
   USE master;
   GO

   CREATE CERTIFICATE MyServerCertRestored
   FROM FILE = '/var/opt/mssql/data/servercert.crt'
   WITH PRIVATE KEY ( FILE = '/var/opt/mssql/data/servercert.key',
       DECRYPTION BY PASSWORD = '<UseStrongPasswordHere>' );
   ```

4. Delete the certificate and private key from the container.

   ```console
   kubectl exec -it --namespace <namespace> --container arc-sqlmi <pod-name> -- bash -c "rm <certificate-path> <private-key-path>
   ```

   Example:

   ```console
   kubectl exec -it --namespace arc-ns --container arc-sqlmi sql-0 -- bash -c "rm /var/opt/mssql/data/servercert.crt /var/opt/mssql/data/servercert.key"
   ```

## Next steps

[Transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption)
