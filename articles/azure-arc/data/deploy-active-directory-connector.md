---
title: Tutorial – Deploy Active Directory Connector
description: Tutorial to deploy Active Directory Connector
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/10/2021
ms.topic: how-to
---


# Tutorial – Deploy Active Directory Connector

This article explains how to deploy Active Directory Connector Custom Resource.

## What is an Active Directory (AD) connector?

The Active Directory (AD) connector is a Kubernetes native custom resource definition (CRD) that allows you to provide 
SQL Managed Instances running on the same Data Controller an ability to perform Active Directory Authentication.

An Active Directory Connector instance deploys a DNS proxy service that proxies the DNS requests
coming from the SQL Managed Instance to either of the two upstream DNS services:
* Active Directory DNS Servers
* Kubernetes DNS Servers

## Prerequisites

Before you proceed, you must have:

* An instance of Data Controller deployed on a supported version of Kubernetes
* An Active Directory domain

## Input for deploying Active Directory (AD) Connector

To deploy an instance of Active Directory Connector, several inputs are needed from the Active Directory domain environment.
These inputs are provided in a YAML spec of AD Connector instance.

Following metadata about the AD domain must be available before deploying an instance of AD Connector:
* Name of the Active Directory domain
* List of the domain controllers (fully-qualified domain names)
* List of the DNS server IP addresses

Following input fields are exposed to the users in the Active Directory Connector spec:

#### 1. spec.activeDirectory.realm:
**Required field**

Name of the Active Directory domain in uppercase. This is the AD domain that this instance of AD Connector will be associated with.

#### 2. spec.activeDirectory.netbiosDomainName:
**Optional field**

NETBIOS name of the Active Directory domain. This is the short domain name that represents the Active Directory domain.
This is often used to qualify accounts in the AD domain. e.g. if the accounts in the domain are referred to as CONTOSO\admin, then CONTOSO is the NETBIOS domain name.
This field is optional. When not provided, it defaults to the first label of the `spec.activeDirectory.realm` field.
In most domain environments, this is set to the default value but some domain environments may have a non-default value.

#### 3. spec.activeDirectory.domainControllers.primaryDomainController.hostname:
**Required field**

Fully-qualified domain name of the Primary Domain Controller (PDC) in the AD domain.
If you do not know which domain controller in the domain is primary, you can find out by running this command on any Windows machine joined to the AD domain: `netdom query fsmo`.

#### 4. spec.activeDirectory.domainControllers.secondaryDomainControllers[*].hostname: 
**Optional field**

List of the fully-qualified domain names of the secondary domain controllers in the AD domain.

If your domain is served by multiple domain controllers, it is a good practice to provide some of their fully-qualified domain names in this list. This allows high-availability for Kerberos operations.
This field is optional and not needed if your domain is served by only one domain controller.

#### 5. spec.activeDirectory.dns.domainName: 
**Optional field**

DNS domain name for which DNS lookups should be forwarded to the Active Directory DNS servers.
A DNS lookup for any name belonging to this domain or its descendant domains will get forwarded to Active Directory.
This field is optional. When not provided, it defaults to the value provided for `spec.activeDirectory.realm` converted to lowercase.

#### 6. spec.activeDirectory.dns.nameserverIpAddresses:
**Required field**

List of Active Directory DNS server IP addresses. DNS proxy service will forward DNS queries in the provided domain name to these servers.

#### 7. spec.activeDirectory.dns.replicas: 
**Optional field**

Replica count for DNS proxy service. This field is optional and defaults to 1 when not provided.

#### 8. spec.activeDirectory.dns.preferK8sDnsForPtrLookups:
**Optional field**

Flag indicating whether to prefer Kubernetes DNS server response over AD DNS server response for IP address lookups.
DNS proxy service relies on this field to determine which upstream group of DNS servers to prefer for IP address lookups.
This field is optional. When not provided, it defaults to true i.e. the DNS lookups of IP addresses will be first forwarded to Kubernetes DNS servers.
If Kubernetes DNS servers fail to answer the lookup, the query is then forwarded to AD DNS servers.


## Deploy Active Directory (AD) connector
To deploy an AD connector, create a YAML spec file called `active-directory-connector.yaml`.
The following example uses an AD domain of name `CONTOSO.LOCAL`. Ensure to replace the values with the ones for your AD domain.

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

* [Deploy SQL Managed Instance with Active Directory Authentication](deploy-active-directory-sqlmi.md).
* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sqlmi.md).

