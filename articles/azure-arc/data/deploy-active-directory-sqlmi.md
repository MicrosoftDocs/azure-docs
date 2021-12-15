---
title: Tutorial – Deploy AD-integrated SQL Managed Instance (Bring Your Own Keytab)
description: Tutorial to deploy AD-integrated SQL Managed Instance (Bring Your Own Keytab)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/10/2021
ms.topic: how-to
---


# Tutorial – Deploy AD-integrated SQL Managed Instance (Bring Your Own Keytab)

This article explains how to deploy Azure Arc-enabled SQL Managed Instance with Active Directory (AD) authentication using Bring Your Own Keytab (BYOK) mode.
Before you proceed, you need to complete the steps explained in [Tutorial – Deploy Active Directory Connector](deploy-active-directory-connector.md).

## Prerequisites

Before you proceed, verify that you have:

* An Active Directory (AD) Domain
* An instance of Data Controller deployed
* An instance of Active Directory Connector deployed

These instructions are for Bring Your Own Keytab (BYOK) mode of deployment. Hence the instructions expect that the users are able to generate the following in
the Active Directory domain and provide to the deployment.

* An Active Directory user account for the SQL Managed Instance
* Service Principal Names (SPNs) under the user account
* DNS record for the endpoint DNS name for SQL Managed Instance


## Steps Before the Deployment of SQL Managed Instance

### 1. Decide a DNS name for the SQL Managed Instance endpoint.

You must pre-decide a DNS name for the endpoint SQL Managed Instance will listen on for connections coming from outside the Kubernetes cluster.
This DNS name should be in the Active Directory domain or its descendant domains.

The examples in these instructions will assume the DNS name `sqlmi.contoso.local`.

### 2. Decide a port number for the SQL Managed Instance endpoint.

You must pre-decide a port number for the endpoint SQL Managed Instance will listen on for connections coming from outside the Kubernetes cluster.
This port number must be in the acceptable range of port numbers to Kubernetes cluster.

The examples in these instructions will assume the port number `31433`.

### 3. Create a DNS record for the SQL Managed Instance endpoint in the Active Directory DNS servers.

In one of the Active Directory DNS servers, create an A record (forward lookup record) for the DNS name chosen in step 1. This DNS record should point to the IP address
that the SQL Managed Instance endpoint will listen on for connections from outside the Kubernetes cluster.

You do NOT need to create a PTR record (reverse lookup record) in association with the A record.

### 4. Create an Active Directory account for the SQL Managed Instance.

Choose a name for the Active Directory account that will represent your SQL Managed Instance. This name should be unique in the Active Directory domain.
Using `Active Directory Users and Computers` tool on the Domain Controllers, create an account for this chosen name.
Provide a complex password to this account that is acceptable to the Active Directory domain's password policy. This password will be needed in some of the next steps.
The account does not need any special permissions. Ensure that the account is enabled.

The examples in these instructions will assume the AD account name `sqlmi-account`.

### 5. Create Service Principal Names (SPNs)

In order for SQL Managed Instance to be able to accept AD authentication against the SQL Managed Instance endpoint DNS name, we need to register
two SPNs under the account generated in the previous step. These two SPNs should be of the following format:

```
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

### 6. Generate a keytab file containing entries for the account and SPNs

For SQL Managed Instance to be able to authenticate itself to Active Directory and accept authetication from Active Directory users, a keytab file must be provided
using a Kubernetes secret.
The keytab file contains encrypted entries for the Active Directory account generated for SQL Managed Instance and the SPNs.
SQL Server will use this file as its credential against Active Directory.

There are multiple tools available to generate a keytab file.
1. **ktutil**: This tool is available on Linux
2. **ktpass**: This tool is available on Windows
3. **adutil**: This tool is available for Linux. Installation instructions are [here](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-ad-auth-adutil-introduction?view=sql-server-ver15&tabs=ubuntu).

To generate the keytab file specifically for SQL Managed Instance, you may use a bash shell script we have published. It wraps ktutil and adutil on Linux.
The script can be found here: [create-sql-keytab.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.sh).

This script accepts several parameters and will output a keytab file and a yaml spec file for the Kubernetes secret containing the keytab.
Use the following command to run the script after replacing the parameter values with the ones for your SQL Managed Instance deployment.

```console
AD_PASSWORD=<password> ./create-sql-keytab.sh --realm <AD domain in uppercase> --account <AD account name> --port <endpoint port> --dns-name <endpoint DNS name> --keytab-file <keytab file name/path> --secret-name <keytab secret name> --secret-namespace <keytab secret namespace>
```

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

#### Verify the deployment of Keytab secret

After the deployment, use the following command to check if your Kubernetes secret has been created successfully: 

```console
kubectl get secret -n <secret namespace>
```

## SQL Managed instance Spec for Active Directory Authentication

To support Active Directory authentication on SQL Managed Instance, new spec fields are introduced as follows.

#### 1. spec.security.activeDirectory.connector.name:
**Required field when AD authentication is desired**

Name of the pre-existing Active Directory Connector instance to join for AD authentication. When provided, system will assume that AD authentication is desired.

#### 2. spec.security.activeDirectory.connector.namespace:
**Optional field**

Kubernetes namespace of the pre-existing Active Directory Connector instance to join for AD authentication. When not provided, system will assume the same namespace as the SQL Managed Instance.

#### 3. spec.security.activeDirectory.accountName:
**Required field when AD authentication is desired**

Name of the Active Directory account pre-created for this SQL Managed Instance.

#### 4. spec.security.activeDirectory.keytabSecret:
**Required field when AD authentication is desired**

Name of the Kubernetes secret hosting the pre-created keytab file by users. This secret must be in the same namespace as the SQL Managed Instance.

#### 5. spec.services.primary.dnsName: 
**Required field when AD authentication is desired**

Pre-decided DNS name for the primary endpoint.

#### 6. spec.services.primary.port: 
**Required field when AD authentication is desired**

Pre-decided port number for the primary endpoint.

### Prepare SQL Managed Instance spec

Prepare the following yaml specification to deploy a SQL Managed Instance. The fields described above should be specified in the spec.

```yaml
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
      type: NodePort
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

* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sqlmi.md).

