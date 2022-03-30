---
title: Tutorial – Deploy AD-integrated SQL Managed Instance
description: Tutorial to deploy AD-integrated SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/10/2021
ms.topic: how-to
---


# Tutorial – Deploy AD-integrated SQL Managed Instance

This article explains how to deploy Azure Arc-enabled SQL Managed Instance with Active Directory (AD) authentication.
Before you proceed, you need to complete the steps explained in [Tutorial – Deploy Active Directory Connector](deploy-active-directory-connector.md).

## Prerequisites

Before you proceed, verify that you have:

* An Active Directory (AD) Domain
* An instance of Data Controller deployed
* An instance of Active Directory Connector deployed

These instructions expect that the users are able to generate the following in
the Active Directory domain and provide to the deployment.

* An Active Directory user account for the SQL Managed Instance
* Service Principal Names (SPNs) under the user account
* DNS record for the endpoint DNS name for SQL Managed Instance

## Steps Before the Deployment of SQL Managed Instance

1. Identify a DNS name for the SQL Managed Instance endpoint.

   The DNS name for the endpoint the SQL Managed Instance will listen on for connections coming from outside the Kubernetes cluster.

   This DNS name should be in the Active Directory domain or its descendant domains.

   The examples in these instructions use `sqlmi.contoso.local` for the DNS name .

2. Identify the port number for the SQL Managed Instance endpoint.

   You must decide a port number for the endpoint SQL Managed Instance will listen on for connections coming from outside the Kubernetes cluster.

   This port number must be in the acceptable range of port numbers to Kubernetes cluster.

   The examples in these instructions use `31433` for the port number.

3. Create an Active Directory account for the SQL Managed Instance.

    Choose a name for the Active Directory account that will represent your SQL Managed Instance. This name should be unique in the Active Directory domain.

   Use `Active Directory Users and Computers` on the Domain Controllers, create an account for the SQL Managed Instance name.

   Provide a complex password to this account that is acceptable to the Active Directory domain password policy. This password will be needed in some of the next steps.

   The account does not need any special permissions. Ensure that the account is enabled.

   The examples in these instructions use `sqlmi-account` for the AD account name.

4. Create a DNS record for the SQL Managed Instance endpoint in the Active Directory DNS servers.

   In one of the Active Directory DNS servers, create an A record (forward lookup record) for the DNS name chosen in step 1. This DNS record should point to the IP address that the SQL Managed Instance endpoint will listen on for connections from outside the Kubernetes cluster.

   You do not need to create a PTR record (reverse lookup record) in association with the A record.

5. Create Service Principal Names (SPNs)

   In order for SQL Managed Instance to be able to accept AD authentication against the SQL Managed Instance endpoint DNS name, we need to register two SPNs under the account generated in the previous step. These two SPNs should be of the following format:

   ```output
   MSSQLSvc/<DNS name>
   MSSQLSvc/<DNS name>:<port>
   ```

   To register the SPNs, run the following commands on one of the domain controllers.

   ```console
   setspn -S MSSQLSvc/<DNS name> <account>
   setspn -S MSSQLSvc/<DNS name>:<port> <account>
   ```

   With the chosen example DNS name, port number and the account name in this document, the commands should look like the following:

   ```console
   setspn -S MSSQLSvc/sqlmi.contoso.local sqlmi-account
   setspn -S MSSQLSvc/sqlmi.contoso.local:31433 sqlmi-account
   ```

6. Generate a keytab file containing entries for the account and SPNs

   For SQL Managed Instance to be able to authenticate itself to Active Directory and accept authentication from Active Directory users, provide a keytab file using a Kubernetes secret.

   The keytab file contains encrypted entries for the Active Directory account generated for SQL Managed Instance and the SPNs.

   SQL Server will use this file as its credential against Active Directory.

   There are multiple tools available to generate a keytab file.
   - **`ktutil`**: This tool is available on Linux
   - **`ktpass`**: This tool is available on Windows
   - **`adutil`**: This tool is available for Linux. See [Introduction to `adutil` - Active Directory utility](/sql/linux/sql-server-linux-ad-auth-adutil-introduction).

   To generate the keytab file specifically for SQL Managed Instance, use a bash shell script we have published. It wraps `ktutil` and `adutil` together. It is for use on Linux.

   The script can be found here: [create-sql-keytab.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.sh).

   This script accepts several parameters and will output a keytab file and a yaml spec file for the Kubernetes secret containing the keytab.

   Use the following command to run the script after replacing the parameter values with the ones for your SQL Managed Instance deployment.

   ```console
   AD_PASSWORD=<password> ./create-sql-keytab.sh --realm <AD domain in uppercase> --account <AD account name> --port <endpoint port> --dns-name <endpoint DNS name> --keytab-file <keytab file name/path> --secret-name <keytab secret name> --secret-namespace <keytab secret namespace>
   ```

   The input parameters are expecting the following values : 
   * **--realm** expects the uppercase of the AD domain, such as CONTOSO.LOCAL
   * **--account** expects the AD account under where the SPNs are registered, such sqlmi-account
   * **--port** expects the SQL endpoint port number 31433
   * **--dns-name** expects the DNS name for the SQL endpoint
   * **--keytab-file** expects the path to the keytab file
   * **--secret-name** expects the name of the keytab secret to generate a spec for
   * **--secret-namespace** expects the Kubernetes namespace containing the keytab secret

   Using the examples chosen in this document, the command should look like the following.

   Choose a name for the Kubernetes secret hosting the keytab. The namespace should be the same as what the SQL Managed Instance will be deployed in.

   ```console
   AD_PASSWORD=<password> ./create-sql-keytab.sh --realm CONTOSO.LOCAL --account sqlmi-account --port 31433 --dns-name sqlmi.contoso.local --keytab-file sqlmi.keytab --secret-name sqlmi-keytab-secret --secret-namespace sqlmi-ns
   ```

   To verify that the keytab is correct, you may run the following command:

   ```console
   klist -kte <keytab file>
   ```

## Deploy Kubernetes secret for the keytab

Use the Kubernetes secret spec file generated in the previous step to deploy the secret.
The spec file should look like the following:

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

## SQL Managed Instance Spec for Active Directory Authentication

To support Active Directory authentication on SQL Managed Instance, new spec fields are introduced as follows.

- **Required** (For AD authentication)
   - **spec.security.activeDirectory.connector.name** 
      Name of the pre-existing Active Directory Connector custom resource to join for AD authentication. When provided, system will assume that AD authentication is desired.
   - **spec.security.activeDirectory.accountName** 
      Name of the Active Directory account pre-created for this SQL Managed Instance.
  - **spec.security.activeDirectory.keytabSecret**
     Name of the Kubernetes secret hosting the pre-created keytab file by users. This secret must be in the same namespace as the SQL Managed Instance.
  - **spec.services.primary.dnsName**
     DNS name for the primary endpoint.
  - **spec.services.primary.port**
     Port number for the primary endpoint.

- **Optional**
  - **spec.security.activeDirectory.connector.namespace**
     Kubernetes namespace of the pre-existing Active Directory Connector instance to join for AD authentication. When not provided, system will assume the same namespace as the SQL Managed Instance.

### Prepare SQL Managed Instance spec

Prepare the following yaml specification to deploy a SQL Managed Instance. The fields described above should be specified in the spec.

```yaml
apiVersion: v1
data:
  password: <your base64 encoded password>
  username: <your base64 encoded username>
kind: Secret
metadata:
  name: my-login-secret
type: Opaque
---
apiVersion: sql.arcdata.microsoft.com/v2
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
    adminLoginSecret: my-login-secret
    activeDirectory:
      connector:
        name: <AD connector name>
        namespace: <AD connector namespace>
      accountName: <AD account name>
      keytabSecret: <Keytab secret name>
  services:
    primary:
      type: LoadBalancer
      dnsName: <Endpoint DNS name>
      port: <Endpoint port number>
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

### Deploy SQL Managed Instance

To deploy the SQL Managed Instance using the prepared spec, save the spec file as sqlmi.yaml or any name of your choice.
Run the following command to deploy the spec in the file:

```console
kubectl apply -f sqlmi.yaml
```

## Next steps

* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md).

