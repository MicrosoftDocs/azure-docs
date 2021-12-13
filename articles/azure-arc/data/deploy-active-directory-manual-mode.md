---
title: Tutorial – Deploy AD-integrated Arc-enabled data services in manual mode
description: End-to-end tutorial to deploy AD-integrated Arc-enabled data services in manual mode
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: melqin
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/10/2021
ms.topic: how-to
---


# Tutorial – Deploy AD-integrated Arc-enabled data services in manual mode

This article explains how to deploy Arc-enabled SQL Managed instance in Active Directory (AD) Manual Authentication mode. Before you proceed, you need to complete the requirements explained in [Plan Arc-enabled SQL Managed instances in Active Directorymanual authentication mode](plan-active-directory-integrated-deployment.md).

To deploy an AD integrated arc data services contains the following steps: 
* Deploy data controller 
* Deploy Active Directory(AD) connector 
* Deploy SQL Managed instances

## Prerequisites
* Validated Kubernetes distributions mentioned here
* Latest [Azure CLI](../cli/azure/install-azure-cli.md) with [Arcdata extension](install-arcdata-extension.md) 
* On-premises AD domain controller 
* An Active Directory (AD) user account and SPNs for the endpoint DNS names from the prerequisite article
* MSSQL keytab file created from the prerequisite article
* Azure CloudShell, Windows Terminal, WSL 2.0 or Any Linux distro terminal

## Deploy the data controller
From a domain-joined machine which meets all the prerequisites, you can use the following command to start a data controller deployment 

```azurecli
az arcdata dc create --path ./arc-k8s-custom  --k8s-namespace k8s-arc-ns --use-k8s --name arc --subscription my-azure-subscription --resource-group my-resource-group --location <your-cloud-region> --connectivity-mode indirect --infrastructure onpremises
```

## Deploy Active Directory (AD) connector
The Active Directory (AD) connector is a Kubernetes native custom resource (CRD) that allows you to enabled SQL Managed instance in AD authentication mode, and you need to specify the domain hosted name, and server IP address. 
Deploy an AD connector by creating a yaml definition file called  ActiveDirectoryConnector. yaml, the following is an example would look like for a domain controller hostnamed dc.contoso.local : 

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

The following command to deploy the AD connector: 
```console
kubectl apply –f ActiveDirectoryConnector.yaml
```

## Create Kubernetes secret for MSSQL keytab

Create a Kubernetes secret definition file named mssqlkeytab.yaml as the following and use the same kubectl apply -f command to deploy it : 

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

After the deployment,  you can use the following command to check out if your Kubernetes secret has been created successfully: 
```console
kubectl get secret -n < your namespace > 
```

## Deploy Arc-enabled SQL MI instance
Prepare the following yaml specification to deploy a SQL MI instance, and binding the Kubernetes secret for the keytab in this file as follows:

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

* [Plan Arc-enabled SQL Managed instance in Active Directory (AD) Manual Authentication mode](plan-active-directory-integrated-deployment.md).
* [Connect to AD-integrated Arc-enabled SQL Managed instance](connect-ad-sql-mi.md).

