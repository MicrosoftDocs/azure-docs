---
title: Deploy Active Directory integrated Azure Arc-enabled SQL Managed Instance
description: Explains how to deploy Active Directory integrated Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: mikhailalmeida
ms.author: mialmei
ms.reviewer: mikeray
ms.date: 10/11/2022
ms.topic: how-to
---

# Deploy Active Directory integrated Azure Arc-enabled SQL Managed Instance

This article explains how to deploy Azure Arc-enabled SQL Managed Instance with Active Directory (AD) authentication.

Before you proceed, complete the steps explained in [Customer-managed keytab Active Directory (AD) connector](deploy-customer-managed-keytab-active-directory-connector.md) or [Deploy a system-managed keytab AD connector](deploy-system-managed-keytab-active-directory-connector.md)

## Prerequisites

Before you proceed, verify that you have:

* An Active Directory (AD) Domain
* An instance of data controller deployed
* An instance of Active Directory connector deployed

### Specific requirements for different modes

#### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

The following instructions expect that the users can bring in the Active Directory domain and provide to the AD customer-managed keytab deployment.

* An Active Directory user account for SQL
* Service Principal Names (SPNs) under the user account
* DNS A (forward) record for the primary (and optionally, secondary) endpoint of SQL

#### [System-managed keytab mode](#tab/system-managed-keytab-mode)

The following instructions expect that the users can bring in the Active Directory domain and provide to the AD system-managed keytab deployment.

* A unique name of an Active Directory user account for SQL
* DNS A (forward) record for the primary (and optionally, secondary) endpoint of SQL

--- 

## Before you deploy SQL Managed Instance

1. Identify a DNS name for the SQL endpoints.

   Choose unique DNS names for the SQL endpoints that clients will connect to from outside the Kubernetes cluster.

   These DNS names should be in the Active Directory domain or its descendant domains.

   The examples in these instructions use `sqlmi-primary.contoso.local` for the primary DNS name and `sqlmi-secondary.contoso.local` for the secondary DNS name.

2. Identify the port numbers for the SQL endpoints.

   You provide a port number for each of the SQL endpoints.

   These port numbers must be in the acceptable range of port numbers for Kubernetes cluster.

   The examples in these instructions use `31433` for the primary port number and `31434` for the secondary port number.

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

3. Create an Active Directory account for the SQL managed instance.

    Choose a name for the Active Directory account that will represent your SQL. This name should be unique in the Active Directory domain.

   Open `Active Directory Users and Computers` tool on the Domain Controller and create an account that will represent this SQL Managed Instance.

   Provide a complex password to this account that is acceptable to the Active Directory domain password policy. This password will be needed in some of the next steps.

   The account does not need any special permissions. Ensure that the account is enabled.

   The examples in these instructions use `sqlmi-account` for the AD account name.

### [System-managed keytab mode](#tab/system-managed-keytab-mode)

3. Choose an Active Directory account name for SQL.

    Choose a name for the Active Directory account that will represent your SQL. This name should be unique in the Active Directory domain and the account must NOT pre-exist in the domain. The system will generate this account in the domain.

   The examples in these instructions use `sqlmi-account` for the AD account name.

---

4. Create DNS records for the SQL endpoints in the Active Directory DNS servers.

   In one of the Active Directory DNS servers, create A records (forward lookup records) for the DNS names chosen in step 1. These DNS records should point to the IP address that the SQL endpoint will listen on for connections from outside the Kubernetes cluster.

   You do not need to create PTR records (reverse lookup records) in association with the A records.

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

5. Create Service Principal Names (SPNs)

   In order for SQL to be able to accept AD authentication against the SQL endpoints, we need to register two SPNs under the account generated in the previous step. SPNs must be registered for the primary endpoint and optionally for the secondary endpoint if AD authentication is desired on the secondary endpoint. The SPNs should be of the following format:

   ```output
   MSSQLSvc/<DNS name>
   MSSQLSvc/<DNS name>:<port>
   ```

   To register the SPNs, run the following commands on one of the domain controllers.

   ```console
   setspn -S MSSQLSvc/<DNS name> <account>
   setspn -S MSSQLSvc/<DNS name>:<port> <account>
   ```

   With the chosen example primary endpoint DNS name, port number and the account name in this document, the commands should look like the following:

   ```console
   setspn -S MSSQLSvc/sqlmi-primary.contoso.local sqlmi-account
   setspn -S MSSQLSvc/sqlmi-primary.contoso.local:31433 sqlmi-account
   ```

   Additionally, if AD authentication is needed on the secondary endpoint, the following commands will add SPNs for the secondary endpoint using the chosen example DNS name and port number:

   ```console
   setspn -S MSSQLSvc/sqlmi-secondary.contoso.local sqlmi-account
   setspn -S MSSQLSvc/sqlmi-secondary.contoso.local:31434 sqlmi-account
   ```

6. Generate a keytab file containing entries for the account and SPNs

   For SQL to be able to authenticate itself to Active Directory and accept authentication from Active Directory users, provide a keytab file using a Kubernetes secret.

   The keytab file contains encrypted entries for the Active Directory account generated for the managed instance and the SPNs.

   SQL Server will use this file as its credential against Active Directory.

   There are multiple tools available to generate a keytab file.

   - `adutil`: This tool is available for Linux. See [Introduction to `adutil` - Active Directory utility](/sql/linux/sql-server-linux-ad-auth-adutil-introduction).
   - `ktutil`: This tool is available on Linux
   - `ktpass`: This tool is available on Windows
  
   To generate the keytab file specifically for the managed instance, use a bash shell script we have published. It wraps `ktutil` and `adutil` together. It is for use on Linux.

   A bash script works on Linux-based OS can be found here: [create-sql-keytab.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.sh).
   A PowerShell script works on Windows server based OS can be found here: [create-sql-keytab.ps1](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.ps1).

   This script accepts several parameters and will output a keytab file and a yaml specification file for the Kubernetes secret containing the keytab.

   Use the following command to run the script after replacing the parameter values with the ones for your managed instance deployment.

   ```console
   AD_PASSWORD=<password> ./create-sql-keytab.sh --realm <AD domain in uppercase> --account <AD account name> --port <endpoint port> --dns-name <endpoint DNS name> --keytab-file <keytab file name/path> --secret-name <keytab secret name> --secret-namespace <keytab secret namespace>
   ```

   The input parameters are expecting the following values: 
   * `--realm` expects the uppercase of the AD domain, such as CONTOSO.LOCAL
   * `--account` expects the AD account under where the SPNs are registered, such as sqlmi-account
   * `--port` expects the primary SQL endpoint port number, such as 31433
   * `--dns-name` expects the DNS name for the primary SQL endpoint
   * `--keytab-file` expects the path to the keytab file
   * `--secret-name` expects the name of the keytab secret to generate a specification for
   * `--secret-namespace` expects the Kubernetes namespace containing the keytab secret
   * `--secondary-port` expects the secondary SQL endpoint port number, such as 31434 (optional)
   * `--secondary-dns-name` expects the DNS name for the secondary SQL endpoint (optional)

   Choose a name for the Kubernetes secret hosting the keytab. The namespace should be the same as what SQL will be deployed in.

   The following command creates a keytab. It uses values that this article describes:

   ```console
   AD_PASSWORD=<password> ./create-sql-keytab.sh --realm CONTOSO.LOCAL --account sqlmi-account --port 31433 --dns-name sqlmi.contoso.local --keytab-file sqlmi.keytab --secret-name sqlmi-keytab-secret --secret-namespace sqlmi-ns
   ```

   To verify that the keytab is correct, you may run the following command:

   ```console
   klist -kte <keytab file>
   ```

## Deploy Kubernetes secret for the keytab

Use the Kubernetes secret specification file generated in the previous step to deploy the secret.
The specification file should look like the following:

```yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: <secret name>
  namespace: <secret namespace>
data:
  keytab: <keytab content in base64>
```

Deploy the Kubernetes secret with `kubectl apply -f <file>`. For example: 

```console
kubectl apply –f sqlmi-keytab-secret.yaml
```
### [System-managed keytab mode](#tab/system-managed-keytab-mode)

These steps do not apply to the system-managed keytab mode.

---

## Azure Arc-enabled SQL Managed Instance specification for Active Directory Authentication

To deploy an Azure Arc-enabled SQL Managed Instance for Azure Arc Active Directory Authentication, the deployment specification needs to reference the Active Directory connector instance it wants to use. Referencing the Active Directory connector in SQL specification will automatically set up SQL to perform Active Directory authentication. 

To support Active Directory authentication on SQL, the deployment specification uses the following fields:

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

- **Required** (For AD authentication)
   - `spec.security.activeDirectory.connector.name` 
      Name of the pre-existing Active Directory connector custom resource to join for AD authentication. When provided, system will assume that AD authentication is desired.
   - `spec.security.activeDirectory.accountName`
      Name of the Active Directory account for this managed instance. 
   - `spec.security.activeDirectory.keytabSecret`
     Name of the Kubernetes secret hosting the pre-created keytab file by users. This secret must be in the same namespace as the managed instance. This parameter is only required for the AD deployment in customer-managed keytab mode. 
   - `spec.services.primary.dnsName`
      You provide a DNS name for the primary SQL endpoint.
   - `spec.services.primary.port`
      You provide a port number for the primary SQL endpoint.

- **Optional**
  - `spec.security.activeDirectory.connector.namespace`
     Kubernetes namespace of the pre-existing Active Directory connector to join for AD authentication. When not provided, system will assume the same namespace as SQL.
  - `spec.services.readableSecondaries.dnsName`
     You provide a DNS name for the secondary SQL endpoint.
  - `spec.services.readableSecondaries.port`
     You provide a port number for the secondary SQL endpoint.

### [System-managed keytab mode](#tab/system-managed-keytab-mode)

- **Required** (For AD authentication)
   - `spec.security.activeDirectory.connector.name` 
      Name of the pre-existing Active Directory connector custom resource to join for AD authentication. When provided, system will assume that AD authentication is desired.
   - `spec.security.activeDirectory.accountName`
      Name of the Active Directory (AD) account for this SQL. This account will be automatically generated for this SQL by the system and must not exist in the domain before deploying SQL. 
  - `spec.services.primary.dnsName`
      You provide a DNS name for the primary SQL endpoint.
  - `spec.services.primary.port`
      You provide a port number for the primary SQL endpoint.

- **Optional**
  - `spec.security.activeDirectory.connector.namespace`
     Kubernetes namespace of the pre-existing Active Directory connector to join for AD authentication. When not provided, system will assume the same namespace as SQL.
  - `spec.security.activeDirectory.encryptionTypes`
     List of Kerberos encryption types to allow for the automatically generated AD account provided in `spec.security.activeDirectory.accountName`. Accepted values are RC4, AES128 and AES256. It defaults to allow all encryption types when there is no value provided. You can disable RC4 by providing only AES128 and AES256 as encryption types.
  - `spec.services.readableSecondaries.dnsName`
     You provide a DNS name for the secondary SQL endpoint.
  - `spec.services.readableSecondaries.port`
     You provide a port number for the secondary SQL endpoint.

---

### Prepare deployment specification for SQL Managed Instance for Azure Arc

Prepare the following .yaml specification to deploy SQL. Set the fields described in the spec.

> [!NOTE]
> The *admin-login-secret* in the yaml example is used for basic authentication. You can use it to login into the SQL managed instance, and then create logins for AD users and groups. Check out [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md) for further details. 

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

```yaml
apiVersion: v1
data:
  password: <your base64 encoded password>
  username: <your base64 encoded username>
kind: Secret
metadata:
  name: admin-login-secret
type: Opaque
---
apiVersion: sql.arcdata.microsoft.com/v3
kind: SqlManagedInstance
metadata:
  name: <name>
  namespace: <namespace>
spec:
  backup:
    retentionPeriodInDays: 7
  dev: false
  tier: GeneralPurpose
  forceHA: "true"
  licenseType: LicenseIncluded
  replicas: 1
  security:
    adminLoginSecret: admin-login-secret
    activeDirectory:
      connector:
        name: <AD connector name>
        namespace: <AD connector namespace>
      accountName: <AD account name>
      keytabSecret: <Keytab secret name>
  services:
    primary:
      type: LoadBalancer
      dnsName: <Primary Endpoint DNS name>
      port: <Primary Endpoint port number>
    readableSecondaries:
      type: LoadBalancer
      dnsName: <Secondary Endpoint DNS name>
      port: <Secondary Endpoint port number>
  storage:
    data:
      volumes:
      - accessMode: ReadWriteOnce
        className: local-storage
        size: 5Gi
    logs:
      volumes:
      - accessMode: ReadWriteOnce
        className: local-storage
        size: 5Gi
```

### [System-managed keytab mode](#tab/system-managed-keytab-mode)

```yaml
apiVersion: v1
data:
  password: <your base64 encoded password>
  username: <your base64 encoded username>
kind: Secret
metadata:
  name: admin-login-secret
type: Opaque
---
apiVersion: sql.arcdata.microsoft.com/v3
kind: SqlManagedInstance
metadata:
  name: <name>
  namespace: <namespace>
spec:
  backup:
    retentionPeriodInDays: 7
  dev: false
  tier: GeneralPurpose
  forceHA: "true"
  licenseType: LicenseIncluded
  replicas: 1
  security:
    adminLoginSecret: admin-login-secret
    activeDirectory:
      connector:
        name: <AD connector name>
        namespace: <AD connector namespace>
      accountName: <AD account name>
  services:
    primary:
      type: LoadBalancer
      dnsName: <Primary Endpoint DNS name>
      port: <Primary Endpoint port number>
    readableSecondaries:
      type: LoadBalancer
      dnsName: <Secondary Endpoint DNS name>
      port: <Secondary Endpoint port number>
  storage:
    data:
      volumes:
      - accessMode: ReadWriteOnce
        className: local-storage
        size: 5Gi
    logs:
      volumes:
      - accessMode: ReadWriteOnce
        className: local-storage
        size: 5Gi
```

---

### Deploy a managed instance

To deploy a managed instance using the prepared specification:

1. Save the file. The example uses the name `sqlmi.yaml`. Use any name.
1. Run the following command to deploy the instance according to the specification:

```console
kubectl apply -f sqlmi.yaml
```

## Next steps

* [Connect to Active Directory integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md).

