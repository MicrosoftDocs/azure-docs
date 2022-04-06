---
title: Tutorial – Deploy AD-integrated Azure Arc-enabled SQL Managed Instance
description: Tutorial to deploy AD-integrated Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 04/05/2022
ms.topic: how-to
---

# Tutorial – deploy AD-integrated Azure Arc-enabled SQL Managed Instance

This article explains how to deploy Azure Arc-enabled SQL Managed Instance with Active Directory (AD) authentication.

Before you proceed, complete the steps explained in [Deploy bring your own keytab (BYOK) Active Directory (AD) connector](deploy-byok-active-directory-connector.md) or [Tutorial – deploy an automatic AD connector](deploy-automatic-active-directory-connector.md)

## Prerequisites

Before you proceed, verify that you have:

* An Active Directory (AD) Domain
* An instance of data controller deployed
* An instance of Active Directory Connector deployed

## Azure Arc-enabled SQL Managed Instance specification for Active Directory Authentication

To deploy an Azure Arc-enabled SQL Managed Instance for Azure Arc Active Directory Authentication, the deployment specification needs to reference the Active Directory Connector instance it wants to use. Referencing the Active Directory Connector in managed instance specification will automatically set up the needed environment in the managed instance container for the instance to perform Active Directory authentication. 

To support Active Directory authentication on managed instance, the deployment specification uses the following fields:

- **Required** (For AD authentication)
   - `spec.security.activeDirectory.connector.name` 
      Name of the pre-existing Active Directory Connector custom resource to join for AD authentication. When provided, system will assume that AD authentication is desired.
   - `spec.security.activeDirectory.accountName`
      Name of the Active Directory (AD) account that was automatically generated for this instance. 
  - `spec.security.activeDirectory.keytabSecret`
     Name of the Kubernetes secret hosting the pre-created keytab file by users. This secret must be in the same namespace as the managed instance. This parameter is only required for the AD deployment in bring your own keytab AD integration mode. 
  - `spec.services.primary.dnsName`
     DNS name for the primary endpoint, this is the primary for the managed instance endpoint 
  - `spec.services.primary.port`
     Port number for the primary endpoint, this is port number for the managed instance endpoint 

- **Optional**
  - `spec.security.activeDirectory.connector.namespace`
     Kubernetes namespace of the pre-existing Active Directory Connector instance to join for AD authentication. When not provided, system will assume the same namespace as the managed instance.

### Prepare deployment specification for SQL Managed Instance for Azure Arc

Prepare the following .yaml specification to deploy a managed instance. Set the fields described in the spec.

> [!NOTE]
> The *admin-login-secret* in the yaml example is used for basic authentication. You can use it to login into the SQL managed instance, and then create SQL logins for AD users and groups. Check out [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md) for further details. 


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

### Deploy a managed instance

To deploy a managed instance using the prepared specification:

1. Save the file. The example uses the name `sqlmi.yaml`. Use any name.
1. Run the following command to deploy the instance according to the specification:

```console
kubectl apply -f sqlmi.yaml
```

## Next steps

* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md).

