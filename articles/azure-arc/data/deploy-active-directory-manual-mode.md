---
title: Tutorial – Deploy AD-integrated Azure Arc-enabled data services in manual mode
description: End-to-end tutorial to deploy AD-integrated Azure Arc-enabled data services in manual mode
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/10/2021
ms.topic: how-to
---


# Tutorial – Deploy AD-integrated Azure Arc-enabled data services in manual mode

This article explains how to deploy Azure Arc-enabled SQL Managed Instance in Active Directory (AD) manual authentication mode. Before you proceed, you need to complete the requirements explained in [Plan Azure Arc-enabled SQL Managed Instances in Active Directory manual authentication mode](plan-active-directory-integrated-deployment.md).

To deploy an AD integrated arc data services, complete the following steps: 

1. Deploy data controller 
1. Deploy Active Directory(AD) connector 
1. Deploy SQL Managed Instances

## Prerequisites

Before you proceed, verify that you have:

* Validated Kubernetes distributions mentioned here
* Latest [Azure CLI](/cli/azure/install-azure-cli) with [Arcdata extension](install-arcdata-extension.md) 
* On-premises AD domain controller 
* An Active Directory (AD) user account and service principal names (SPNs) for the endpoint DNS names from the prerequisite article
* MSSQL keytab file created from the prerequisite article
* Azure CloudShell, Windows Terminal, WSL 2.0 or any Linux distribution terminal

## Deploy the data controller

From a domain-joined machine which meets all the prerequisites, use the following command to deploy a data controller: 

```azurecli
az arcdata dc create --path ./arc-k8s-custom  --k8s-namespace k8s-arc-ns --use-k8s --name <data controller name> --subscription <azure subscription> --resource-group my-resource-group --location <your-cloud-region> --connectivity-mode indirect --infrastructure onpremises
```

## Deploy Active Directory (AD) connector
The Active Directory (AD) connector is a Kubernetes native custom resource definition (CRD) that allows you to enable SQL Managed Instance in AD authentication mode, and you need to specify the domain hosted name, and server IP address. 

To deploy an AD connector, create a .yaml definition file called `ActiveDirectoryConnector.yaml`. The following example defines a domain controller host named `dc.contoso.local`: 

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
kind: ActiveDirectoryConnector
metadata:
  name: adarc
  namespace: <your-namespace>
spec:
  activeDirectory:
    realm: CONTOSO.LOCAL
    domainControllers:
      primaryDomainController:
        hostname: dc.contoso.local
  dns:
    replicas: 1
    preferK8sDnsForPtrLookups: false
    nameserverIPAddresses:
      - <your-server-ip-address>
```

The following command deploys the AD connector: 

```console
kubectl apply –f ActiveDirectoryConnector.yaml
```

## Create Kubernetes secret for MSSQL keytab

Create a Kubernetes secret definition file named `mssqlkeytab.yaml`. The following example describes a secret definition file. Use the same kubectl apply -f command to deploy it : 

```yaml
apiVersion: v1
kind: Secret
type: Opaque
  metadata:
  name: your-mssqlkeytab-secret
  namespace: <your-namespace>  
data:
  keytab: <your-MSSQL keytab>
```

Use the same kubectl apply -f command to deploy it : 

```console
kubectl apply –f mssqlkeytab.yaml
```

### Verify the deployment

After the deployment, use the following command to check out if your Kubernetes secret has been created successfully: 

```console
kubectl get secret -n < your namespace > 
```

## Deploy Azure Arc-enabled SQL MI instance

Prepare the following yaml specification to deploy a SQL Managed Instance, and bind the Kubernetes secret for the keytab in this file:

```yaml
apiVersion: sql.arcdata.microsoft.com/v2
kind: SqlManagedInstance
metadata:
  name: s1
  namespace: test
  resourceVersion: "1489372"
spec:
  backup:
    retentionPeriodInDays: 7
  dev: false
  forceHA: "true"
  licenseType: LicenseIncluded
  replicas: 1
  security:
    adminLoginSecret: my-login-secret
    activeDirectory:
      connector:
        name: ad1
        namespace: <your-namespace>
      accountName: arcuser
      keytabSecret: your-mssqlkeytab-secret
  services:
    primary:
      type: NodePort
      dnsName: dc.contoso.local
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
  tier: GeneralPurpose
```

## Next steps

* [Plan Azure Arc-enabled SQL Managed Instance in Active Directory (AD) Manual Authentication mode](plan-active-directory-integrated-deployment.md).
* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-ad-sql-mi.md).

