---
title: Deploy Active Directory-integrated SQL Server Managed Instance enabled by Azure Arc
description: Learn how to deploy SQL Server Managed Instance enabled by Azure Arc with Active Directory authentication.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: mikhailalmeida
ms.author: mialmei
ms.reviewer: mikeray
ms.date: 10/11/2022
ms.topic: how-to
---

# Deploy Active Directory-integrated SQL Server Managed Instance enabled by Azure Arc

In this article, learn how to deploy Azure Arc-enabled Azure SQL Managed Instance with Active Directory authentication.

## Prerequisites

Before you begin your SQL Managed Instance deployment, make sure you have these prerequisites:

- An Active Directory domain
- A deployed Azure Arc data controller
- A deployed Active Directory connector with a [customer-managed keytab](deploy-customer-managed-keytab-active-directory-connector.md) or [system-managed keytab](deploy-system-managed-keytab-active-directory-connector.md)

## Connector requirements

The customer-managed keytab Active Directory connector and the system-managed keytab Active Directory connector are different deployment modes that have different requirements and steps. Each mode has specific requirements during deployment. Select the tab for the connector you use.

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

For an Active Directory customer-managed keytab deployment, you must provide:

- An Active Directory user account for SQL
- Service principal names (SPNs) under the user account
- DNS A (forward) record for the primary endpoint of SQL (and optionally, a secondary endpoint)

### [System-managed keytab mode](#tab/system-managed-keytab-mode)

For an Active Directory system-managed keytab deployment, you must provide:

- A unique name of an Active Directory user account for SQL
- DNS A (forward) record for the primary endpoint of SQL (and optionally, a secondary endpoint)

---

## Prepare for deployment

Depending on your deployment mode, complete the following steps to prepare to deploy SQL Managed Instance.

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

To prepare for deployment in customer-managed keytab mode:

1. **Identify a DNS name for the SQL endpoints**: Choose unique DNS names for the SQL endpoints that clients will connect to from outside the Kubernetes cluster.

   - The DNS names should be in the Active Directory domain or in its descendant domains.
   - The examples in this article use `sqlmi-primary.contoso.local` for the primary DNS name and `sqlmi-secondary.contoso.local` for the secondary DNS name.

1. **Identify the port numbers for the SQL endpoints**: Enter a port number for each of the SQL endpoints.

   - The port numbers must be in the acceptable range of port numbers for your Kubernetes cluster.
   - The examples in this article use `31433` for the primary port number and `31434` for the secondary port number.

1. **Create an Active Directory account for the managed instance**: Choose a name for the Active Directory account to represent your managed instance.

   - The name must be unique in the Active Directory domain.
   - The examples in this article use `sqlmi-account` for the Active Directory account name.

   To create the account:

   1. On the domain controller, open the Active Directory Users and Computers tool. Create an account to represent the managed instance.
   1. Enter an account password that complies with the Active Directory domain password policy. You'll use this password in some of the steps in the next sections.
   1. Ensure that the account is enabled. The account doesn't need any special permissions.  

1. **Create DNS records for the SQL endpoints in the Active Directory DNS servers**: In one of the Active Directory DNS servers, create A records (forward lookup records) for the DNS name you chose in step 1.

   - The DNS records should point to the IP address that the SQL endpoint will listen on for connections from outside the Kubernetes cluster.
   - You don't need to create reverse-lookup Pointer (PTR) records in association with the A records.

1. **Create SPNs**: For SQL to be able to accept Active Directory authentication against the SQL endpoints, you must register two SPNs in the account you created in the preceding step. Two SPNs must be registered for the primary endpoint. If you want Active Directory authentication for the secondary endpoint, the SPNs must also be registered for the secondary endpoint.

   To create and register SPNs:

   1. Use the following format to create the SPNs:

      ```output
      MSSQLSvc/<DNS name>
      MSSQLSvc/<DNS name>:<port>
      ```

   1. On one of the domain controllers, run the following commands to register the SPNs:

      ```console
      setspn -S MSSQLSvc/<DNS name> <account>
      setspn -S MSSQLSvc/<DNS name>:<port> <account>
      ```

      Your commands might look like the following example:

      ```console
      setspn -S MSSQLSvc/sqlmi-primary.contoso.local sqlmi-account
      setspn -S MSSQLSvc/sqlmi-primary.contoso.local:31433 sqlmi-account
      ```

   1. If you want Active Directory authentication on the secondary endpoint, run the same commands to add SPNs for the secondary endpoint:

      ```console
      setspn -S MSSQLSvc/<DNS name> <account>
      setspn -S MSSQLSvc/<DNS name>:<port> <account>
      ```
  
      Your commands might look like the following example:

      ```console
      setspn -S MSSQLSvc/sqlmi-secondary.contoso.local sqlmi-account
      setspn -S MSSQLSvc/sqlmi-secondary.contoso.local:31434 sqlmi-account
      ```

1. **Generate a keytab file that has entries for the account and SPNs**: For SQL to be able to authenticate itself to Active Directory and accept authentication from Active Directory users, provide a keytab file by using a Kubernetes secret.

   - The keytab file contains encrypted entries for the Active Directory account that's generated for the managed instance and the SPNs.
   - SQL Server uses this file as its credential against Active Directory.
   - You can choose from multiple tools to generate a keytab file:

     - `adutil`: Available for Linux (see [Introduction to adutil](/sql/linux/sql-server-linux-ad-auth-adutil-introduction))
     - `ktutil`: Available on Linux
     - `ktpass`: Available on Windows
     - Custom scripts
  
   To generate the keytab file specifically for the managed instance:

   1. Use one of these custom scripts:

      - Linux: [create-sql-keytab.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.sh)
      - Windows Server: [create-sql-keytab.ps1](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/create-sql-keytab.ps1)

      The scripts accept several parameters and generate a keytab file and a YAML specification file for the Kubernetes secret that contains the keytab.

   1. In your script, replace the parameter values with values for your managed instance deployment.

      For the input parameters, use the following values:

      - `--realm`: The Active Directory domain in uppercase. Example: `CONTOSO.LOCAL`
      - `--account`: The Active Directory account where the SPNs are registered. Example: `sqlmi-account`
      - `--port`: The primary SQL endpoint port number. Example: `31433`
      - `--dns-name`: The DNS name for the primary SQL endpoint.
      - `--keytab-file`: The path to the keytab file.
      - `--secret-name`: The name of the keytab secret to generate a specification for.
      - `--secret-namespace`: The Kubernetes namespace that contains the keytab secret.
      - `--secondary-port`: The secondary SQL endpoint port number (optional). Example: `31434`
      - `--secondary-dns-name`: The DNS name for the secondary SQL endpoint (optional).

      Choose a name for the Kubernetes secret that hosts the keytab. Use the namespace where the managed instance is deployed.

   1. Run the following command to create a keytab:

       ```console
      AD_PASSWORD=<password> ./create-sql-keytab.sh --realm <Active Directory domain in uppercase> --account <Active Directory account name> --port <endpoint port> --dns-name <endpoint DNS name> --keytab-file <keytab file name/path> --secret-name <keytab secret name> --secret-namespace <keytab secret namespace>
      ```  

       Your command might look like the following example:

      ```console
      AD_PASSWORD=<password> ./create-sql-keytab.sh --realm CONTOSO.LOCAL --account sqlmi-account --port 31433 --dns-name sqlmi.contoso.local --keytab-file sqlmi.keytab --secret-name sqlmi-keytab-secret --secret-namespace sqlmi-ns
      ```

   1. Run the following command to verify that the keytab is correct:

      ```console
      klist -kte <keytab file>
      ```

1. **Deploy the Kubernetes secret for the keytab**: Use the Kubernetes secret specification file you create in the preceding step to deploy the secret.

   The specification file looks similar to this example:

    ```yaml
    apiVersion: v1
    kind: Secret
    type: Opaque
    metadata:
      name: <secret name>
      namespace: <secret namespace>
    data:
      keytab: <keytab content in Base64>
    ```
  
    To deploy the Kubernetes secret, run this command:
  
    ```console
    kubectl apply -f <file>
    ```
  
   Your command might look like this example:
  
    ```console
    kubectl apply -f sqlmi-keytab-secret.yaml
    ```

### [System-managed keytab mode](#tab/system-managed-keytab-mode)

To prepare for deployment in system-managed keytab mode:

1. **Identify a DNS name for the SQL endpoints**: Choose unique DNS names for the SQL endpoints that clients will connect to from outside the Kubernetes cluster.

   - The DNS names should be in the Active Directory domain or its descendant domains.
   - The examples in this article use `sqlmi-primary.contoso.local` for the primary DNS name and `sqlmi-secondary.contoso.local` for the secondary DNS name.

1. **Identify the port numbers for the SQL endpoints**: Enter a port number for each of the SQL endpoints.

   - The port numbers must be in the acceptable range of port numbers for your Kubernetes cluster.
   - The examples in this article use `31433` for the primary port number and `31434` for the secondary port number.

1. **Choose an Active Directory account name for SQL**: Choose a name for the Active Directory account that will represent your managed instance.

   - This name should be unique in the Active Directory domain, and the account must *not* already exist in the domain. This account is automatically generated in the domain.
   - The examples in this article use `sqlmi-account` for the Active Directory account name.

1. **Create DNS records for the SQL endpoints in the Active Directory DNS servers**: In one of the Active Directory DNS servers, create A records (forward lookup records) for the DNS names chosen in step 1.

   - The DNS records should point to the IP address that the SQL endpoint will listen on for connections from outside the Kubernetes cluster.
   - You don't need to create reverse-lookup Pointer (PTR) records in association with the A records.

---

## Set properties for Active Directory authentication

To deploy SQL Managed Instance enabled by Azure Arc for Azure Arc Active Directory authentication, update your deployment specification file to reference the Active Directory connector instance to use. Referencing the Active Directory connector in the SQL specification file automatically sets up SQL for Active Directory authentication.

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

To support Active Directory authentication on SQL in customer-managed keytab mode, set the following properties in your deployment specification file. Some properties are required and some are optional.

#### Required

- `spec.security.activeDirectory.connector.name`: The name of the preexisting Active Directory connector custom resource to join for Active Directory authentication. If you enter a value for this property, Active Directory authentication is implemented.
- `spec.security.activeDirectory.accountName`: The name of the Active Directory account for the managed instance.
- `spec.security.activeDirectory.keytabSecret`: The name of the Kubernetes secret that hosts the pre-created keytab file for users. This secret must be in the same namespace as the managed instance. This parameter is required only for the Active Directory deployment in customer-managed keytab mode.
- `spec.services.primary.dnsName`: Enter a DNS name for the primary SQL endpoint.
- `spec.services.primary.port`: Enter a port number for the primary SQL endpoint.

#### Optional

- `spec.security.activeDirectory.connector.namespace`: The Kubernetes namespace of the preexisting Active Directory connector to join for Active Directory authentication. If you don't enter a value, the SQL namespace is used.
- `spec.services.readableSecondaries.dnsName`: Enter a DNS name for the secondary SQL endpoint.
- `spec.services.readableSecondaries.port`: Enter a port number for the secondary SQL endpoint.

### [System-managed keytab mode](#tab/system-managed-keytab-mode)

To support Active Directory authentication on SQL in system-managed keytab mode, set the following properties in your deployment specification file. Some properties are required and some are optional.

#### Required

- `spec.security.activeDirectory.connector.name`: The name of the preexisting Active Directory connector custom resource to join for Active Directory authentication. If you enter a value for this property, Active Directory authentication is implemented.
- `spec.security.activeDirectory.accountName`: The name of the Active Directory account for the managed instance. This account is automatically generated for this managed instance and must not exist in the domain before you deploy SQL.
- `spec.services.primary.dnsName`: Enter a DNS name for the primary SQL endpoint.
- `spec.services.primary.port`: Enter a port number for the primary SQL endpoint.

#### Optional

- `spec.security.activeDirectory.connector.namespace`: The Kubernetes namespace of the preexisting Active Directory connector to join for Active Directory authentication. If you don't enter a value, the SQL namespace is used.
- `spec.security.activeDirectory.encryptionTypes`: A list of Kerberos encryption types to allow for the automatically generated Active Directory account provided in `spec.security.activeDirectory.accountName`. Accepted values are `RC4`, `AES128`, and `AES256`. If you don't enter an encryption type, all encryption types are allowed. You can disable RC4 by entering only `AES128` and `AES256` as encryption types.
- `spec.services.readableSecondaries.dnsName`: Enter a DNS name for the secondary SQL endpoint.
- `spec.services.readableSecondaries.port`: Enter a port number for the secondary SQL endpoint.

---

## Prepare your deployment specification file

Next, prepare a YAML specification file to deploy SQL Managed Instance. For the mode you use, enter your deployment values in the specification file.

> [!NOTE]
> In the specification file for both modes, the `admin-login-secret` value in the YAML example provides basic authentication. You can use the parameter value to log in to the managed instance, and then create logins for Active Directory users and groups. For more information, see [Connect to Active Directory-integrated SQL Managed Instance enabled by Azure Arc](connect-active-directory-sql-managed-instance.md).

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

The following example shows a specification file for customer-managed keytab mode:

```yaml
apiVersion: v1
data:
  password: <your Base64-encoded password>
  username: <your Base64-encoded username>
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
        name: <Active Directory connector name>
        namespace: <Active Directory connector namespace>
      accountName: <Active Directory account name>
      keytabSecret: <keytab secret name>
  services:
    primary:
      type: LoadBalancer
      dnsName: <primary endpoint DNS name>
      port: <primary endpoint port number>
    readableSecondaries:
      type: LoadBalancer
      dnsName: <secondary endpoint DNS name>
      port: <secondary endpoint port number>
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

The following example shows a specification file for system-managed keytab mode:

```yaml
apiVersion: v1
data:
  password: <your Base64-encoded password>
  username: <your Base64-encoded username>
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
        name: <Active Directory connector name>
        namespace: <Active Directory connector namespace>
      accountName: <Active Directory account name>
  services:
    primary:
      type: LoadBalancer
      dnsName: <primary endpoint DNS name>
      port: <primary endpoint port number>
    readableSecondaries:
      type: LoadBalancer
      dnsName: <secondary endpoint DNS name>
      port: <secondary endpoint port number>
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

## Deploy the managed instance

For both customer-managed keytab mode and system-managed keytab mode, deploy the managed instance by using the prepared specification YAML file:

1. Save the file. The example in the next step uses *sqlmi.yaml* for the specification file name, but you can choose any file name.

1. Run the following command to deploy the instance by using the specification:

    ```console
    kubectl apply -f <specification file name>
    ```

    Your command might look like the following example:

    ```console
    kubectl apply -f sqlmi.yaml
    ```

## Related content

- [Connect to Active Directory-integrated SQL Managed Instance enabled by Azure Arc](connect-active-directory-sql-managed-instance.md)
- [Upgrade your Active Directory connector](upgrade-active-directory-connector.md)
