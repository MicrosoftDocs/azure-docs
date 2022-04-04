---
title: Tutorial – Deploy a manual Active Directory (AD) Connector
description: Tutorial to deploy a Manual Active Directory (AD) Connector
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 04/05/2022
ms.topic: how-to
---

# Tutorial – Deploy a Manual Active Directory (AD) Connector

This article explains how to deploy a manual Active Directory (AD) Connector Custom Resource. It is a key component to enable the Arc-enabled SQL Managed instance in both manual and automatic Active Directory (AD) authentification mode.

## Prerequisites

Before you proceed, you must have:

* An instance of Data Controller deployed on a supported version of Kubernetes
* An Active Directory (AD) domain

The following instructions expect that the users are able to generate the following in the Active Directory domain and provide to the AD manual deployment.

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

   A bash script works on Linux-based OS can be found here: [create-sql-keytab.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.sh).
   A PowerShell script works on Windows server based OS can be found here: [create-sql-keytab.ps1](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.ps1).

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

## Active directory (AD ) in Manual or Bring Your Own Keytab (BYOK) mode

The following are the steps for user to set up:
1. Creating and providing an Active Directory account for each SQL Managed Instance that must accept AD authentication.
1. Providing a DNS name belonging to the Active Directory DNS domain for the SQL Managed Instance endpoint.
1. Creating a DNS record in Active Directory for the SQL endpoint.
1. Providing a port number for the SQL Managed Instance endpoint.
1. Registering Service Principal Names (SPNs) under the AD account in Active Directory domain for the SQL endpoint.
1. Creating and providing a keytab file for SQL Managed Instance containing entries for the AD account and SPNs.

The following diagram Active Directory Connector and SQL Managed Instance describes how the manual mode works : 

![Actice Directory Connector](media/active-directory-deployment/active-directory-connector-byok.png)

## Input for deploying Active Directory (AD) Connector

To deploy an instance of Active Directory Connector, several inputs are needed from the Active Directory domain environment.
These inputs are provided in a YAML spec of AD Connector instance.

Following metadata about the AD domain must be available before deploying an instance of AD Connector:
* Name of the Active Directory domain
* List of the domain controllers (fully-qualified domain names)
* List of the DNS server IP addresses

Following input fields are exposed to the users in the Active Directory Connector spec:

- **Required**

   - **spec.activeDirectory.realm**
     Name of the Active Directory domain in uppercase. This is the AD domain that this instance of AD Connector will be associated with.

   - **spec.activeDirectory.domainControllers.primaryDomainController.hostname**
      Fully-qualified domain name of the Primary Domain Controller (PDC) in the AD domain.

      If you do not know which domain controller in the domain is primary, you can find out by running this command on any Windows machine joined to the AD domain: `netdom query fsmo`.
   
   - **spec.activeDirectory.dns.nameserverIpAddresses**
      List of Active Directory DNS server IP addresses. DNS proxy service will forward DNS queries in the provided domain name to these servers.


- **Optional**

   - **spec.activeDirectory.netbiosDomainName**
      NETBIOS name of the Active Directory domain. This is the short domain name that represents the Active Directory domain.

      This is often used to qualify accounts in the AD domain. e.g. if the accounts in the domain are referred to as CONTOSO\admin, then CONTOSO is the NETBIOS domain name.
      
      This field is optional. When not provided, it defaults to the first label of the `spec.activeDirectory.realm` field.

      In most domain environments, this is set to the default value but some domain environments may have a non-default value.

  - **spec.activeDirectory.domainControllers.secondaryDomainControllers[*].hostname** 
      List of the fully-qualified domain names of the secondary domain controllers in the AD domain.

      If your domain is served by multiple domain controllers, it is a good practice to provide some of their fully-qualified domain names in this list. This allows high-availability for Kerberos operations.

      This field is optional and not needed if your domain is served by only one domain controller.

  - **spec.activeDirectory.dns.domainName** 
      DNS domain name for which DNS lookups should be forwarded to the Active Directory DNS servers.

      A DNS lookup for any name belonging to this domain or its descendant domains will get forwarded to Active Directory.

      This field is optional. When not provided, it defaults to the value provided for `spec.activeDirectory.realm` converted to lowercase.

  - **spec.activeDirectory.dns.replicas** 
      Replica count for DNS proxy service. This field is optional and defaults to 1 when not provided.

  - **spec.activeDirectory.dns.preferK8sDnsForPtrLookups**
      Flag indicating whether to prefer Kubernetes DNS server response over AD DNS server response for IP address lookups.

      DNS proxy service relies on this field to determine which upstream group of DNS servers to prefer for IP address lookups.

      This field is optional. When not provided, it defaults to true i.e. the DNS lookups of IP addresses will be first forwarded to Kubernetes DNS servers.

      If Kubernetes DNS servers fail to answer the lookup, the query is then forwarded to AD DNS servers.


## Deploy a Manual Active Directory (AD) connector
To deploy an AD connector, create a YAML spec file called `active-directory-connector.yaml`.

The following example is an example of a manual AD connector uses an AD domain of name `CONTOSO.LOCAL`. Ensure to replace the values with the ones for your AD domain.

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
kind: ActiveDirectoryConnector
metadata:
  name: adarc
  namespace: <namespace>
spec:
  activeDirectory:
    realm: CONTOSO.LOCAL
    domainControllers:
      primaryDomainController:
        hostname: dc1.contoso.local
      secondaryDomainControllers:
      - hostname: dc2.contoso.local
      - hostname: dc3.contoso.local
  dns:
    preferK8sDnsForPtrLookups: false
    nameserverIPAddresses:
      - <DNS Server 1 IP address>
      - <DNS Server 2 IP address>
```

The following command deploys the AD connector instance. Currently, only kube-native approach of deploying is supported.

```console
kubectl apply –f active-directory-connector.yaml
```

After submitting the deployment of AD Connector instance, you may check the status of the deployment using the following command.

```console
kubectl get adc -n <namespace>
```

## Next steps

* [Deploy SQL Managed Instance with Active Directory Authentication](deploy-active-directory-sql-managed-instance.md).
* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md).

