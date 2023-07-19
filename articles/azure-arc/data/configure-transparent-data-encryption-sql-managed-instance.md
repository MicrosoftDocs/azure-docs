---
title: Turn on transparent data encryption in Azure Arc-enabled SQL Managed Instance (preview)
description: How-to guide to turn on transparent data encryption in an Azure Arc-enabled SQL Managed Instance (preview)
author: MikeRayMSFT
ms.author: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.reviewer: mikeray
ms.topic: how-to
ms.date: 06/06/2023
ms.custom: template-how-to, event-tier1-build-2022, devx-track-azurecli
---

# Enable transparent data encryption on Azure Arc-enabled SQL Managed Instance (preview)

This article describes how to enable and disable transparent data encryption (TDE) at-rest on an Azure Arc-enabled SQL Managed Instance. In this article, the term *managed instance* refers to a deployment of Azure Arc-enabled SQL Managed Instance and enabling/disabling TDE will apply to all databases running on a managed instance.

For more info on TDE, please refer to [Transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption).

Turning on the TDE feature does the following:

- All existing databases will now be automatically encrypted.
- All newly created databases will get automatically encrypted.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

Before you proceed with this article, you must have an Azure Arc-enabled SQL Managed Instance resource created and connect to it.

- [Create an Azure Arc-enabled SQL Managed Instance](./create-sql-managed-instance.md)
- [Connect to Azure Arc-enabled SQL Managed Instance](./connect-managed-instance.md)

## Limitations

The following limitations apply when you enable automatic TDE:

- Only General Purpose Tier is supported.
- Failover groups aren't supported.


## Create a managed instance with TDE enabled (Azure CLI)

The following example creates an Azure Arc-enabled SQL managed instance with one replica, TDE enabled:

```azurecli
az sql mi-arc create --name sqlmi-tde --k8s-namespace arc --tde-mode ServiceManaged --use-k8s
```

## Turn on TDE on the managed instance

When TDE is enabled on Arc-enabled SQL Managed Instance, the data service automatically does the following tasks:

1. Adds the service-managed database master key in the `master` database.
2. Adds the service-managed certificate protector.
3. Adds the associated Database Encryption Keys (DEK) on all databases on the managed instance.
4. Enables encryption on all databases on the managed instance.

You can set Azure Arc-enabled SQL Managed Instance TDE in one of two modes:

- Service-managed
- Customer-managed

In service-managed mode, TDE requires the managed instance to use a service-managed database master key as well as the service-managed server certificate. These credentials are automatically created when service-managed TDE is enabled. 

In customer-managed mode, TDE uses a service-managed database master key and uses keys you provide for the server certificate. To configure customer-managed mode:

1. Create a certificate.
1. Store the certificate as a secret in the same Kubernetes namespace as the instance.

> [!NOTE]
> If you need to change from one mode to the other, you must disable TDE from the current mode before you apply the new mode. To disable, before you proceed, follow the instructions at [Turn off TDE on the managed instance](#turn-off-tde-on-the-managed-instance).

### Enable

# [Service-managed](#tab/service-managed)

The following section explains how to enable TDE in service-managed mode.

# [Customer-managed](#tab/customer-managed)

The following section explains how to enable TDE in customer-managed mode.

---

# [Azure CLI](#tab/azure-cli/service-managed)

To enable TDE in service managed mode, run the following command:

```azurecli
az sql mi-arc update --tde-mode ServiceManaged
```

# [Kubernetes native tools](#tab/kubernetes-native/service-managed)

To enable TDE in service-managed mode, run kubectl patch to enable service-managed TDE:

```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{ "spec": { "security": { "transparentDataEncryption": { "mode": "ServiceManaged" } } } }'
```

Example:

```console
kubectl patch sqlmi sqlmi-tde --namespace arc --type merge --patch '{ "spec": { "security": { "transparentDataEncryption": { "mode": "ServiceManaged" } } } }'
```

# [Azure CLI](#tab/azure-cli/customer-managed)

To enable TDE in customer-managed mode with Azure CLI:

1. Create a certificate. 

   ```console
   openssl req -x509 -newkey rsa:2048 -nodes -keyout <key-file> -days 365 -out <cert-file>
   ```

1. Create a secret for the certificate.

   > [!IMPORTANT]
   > Store the secret in the same namespace as the managed instance

   ```console
   kubectl create secret generic <tde-secret-name> --from-literal=privatekey.pem="$(cat <key-file>)" --from-literal=certificate.pem="$(cat <cert-file>) --namespace <namespace>"
   ```

1. Update and run the following example to enable customer-managed TDE:

   ```azurecli
   az sql mi-arc update --tde-mode CustomerManaged --tde-protector-private-key-file <key-file> --tde-protector-public-key-file <cert-file>
   ```

# [Kubernetes native tools](#tab/kubernetes-native/customer-managed)

To enable TDE in customer-managed mode:

1. Create a certificate. 

   ```console
   openssl req -x509 -newkey rsa:2048 -nodes -keyout <key-file> -days 365 -out <cert-file>
   ```

1. Create a secret for the certificate.

   > [!IMPORTANT]
   > Store the secret in the same namespace as the managed instance

   ```console
   kubectl create secret generic <tde-secret-name> --from-literal=privatekey.pem="$(cat <key-file>)" --from-literal=certificate.pem="$(cat <cert-file>) --namespace <namespace>"
   ```

1. Run `kubectl patch ...` to enable customer-managed TDE

   ```console
   kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{ "spec": { "security": { "transparentDataEncryption": { "mode": "CustomerManaged", "protectorSecret": "<tde-secret-name>" } } } }'
   ```

   Example:

   ```console
   kubectl patch sqlmi sqlmi-tde --namespace arc --type merge --patch '{ "spec": { "security": { "transparentDataEncryption": { "mode": "CustomerManaged", "protectorSecret": "sqlmi-tde-protector-cert-secret" } } } }'
   ```

---

## Turn off TDE on the managed instance

When TDE is disabled on Arc-enabled SQL Managed Instance, the data service automatically does the following tasks:

1. Disables encryption on all databases on the managed instance.
2. Drops the associated DEKs on all databases on the managed instance.
3. Drops the service-managed certificate protector.
4. Drops the service-managed database master key in the `master` database.

# [Azure CLI](#tab/azure-cli)

To disable TDE:

```azurecli
az sql mi-arc update --tde-mode Disabled
```

# [Kubernetes native tools](#tab/kubernetes-native)

Run kubectl patch to disable service-managed TDE.

```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{ "spec": { "security": { "transparentDataEncryption": { "mode": "Disabled" } } } }'
```

Example:
```console
kubectl patch sqlmi sqlmi-tde --namespace arc --type merge --patch '{ "spec": { "security": { "transparentDataEncryption": { "mode": "Disabled" } } } }'
```

---

## Back up a TDE credential

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

## Restore a TDE credential to a managed instance

Similar to above, to restore the credentials, copy them into the container and run the corresponding T-SQL afterwards.


> [!NOTE]
> If the `kubectl cp` command is run from Windows, the command may fail when using absolute Windows paths. Use relative paths or the commands specified below.
> To restore database backups that have been taken before enabling TDE, you would need to disable TDE on the SQL Managed Instance, restore the database backup and enable TDE again.

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

   # [Windows](#tab/windows)
   
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
