---
title: Tutorial – Deploy an automatic Active Directory (AD) Connector
description: Tutorial to deploy an automatic Active Directory (AD) Connector
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 04/05/2022
ms.topic: how-to
---


# Tutorial – Deploy an Automatic Active Directory (AD) Connector

This article explains how to deploy an automatic Active Directory (AD) Connector Custom Resource. It is a key component to enable the Arc-enabled SQL Managed instance in both Bring your own keytab (BYOK) and automatic Active Directory (AD) authentication mode.

## Prerequisites

Before you proceed, you must have:

* An instance of Data Controller deployed on a supported version of Kubernetes
* An Active Directory (AD) domain
* A pre-created organizational unit (OU) in the Active Directory
* An Domain service AD account which has  necessary permissions to create users, groups, and machine accounts automatically inside the provided organizational unit (OU) in the active directory. 

## Input for deploying an Automatic Active Directory (AD) Connector

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

  - **spec.activeDirectory.serviceAccountProvisioning** This is an optional field defines your AD connector deployment mode with possible value Bring your own keytab (BYOK) or automatic. This field indicating whether the service account provisioning including SPN and keytab generation should be automatic or Bring your own keytab (BYOK). Once it sets to automatic, the service AD account is automatically generated and set SPNs on that account, and a keytab file is generated then transport to SQL Managed instance. In case it sets to Bring your own keytab (BYOK) which is the default value, the system will not take care of AD service account generation, SPN registration and keytab generation. 

  - **spec.activeDirectory.ouDistinguishedName** This is an optional field. Though it becomes conditionally mandatory when the value of **serviceAccountProvisioning** is set to automatic. This field accepts the Distinguished Name (DN) of an Organizational Unit (OU) that the users must create in Active Directory domain before deploying AD Connector. It stores the system-generated AD accounts in active directory for AD LDAP server. The example of the value would look as follows : "OU=arcou,DC=contoso,DC=local"

  - **spec.activeDirectory.domainServiceAccountSecret** This is an optional field. it becomes conditionally mandatory when the value of **serviceAccountProvisioning** is set to automatic. This field accepts a name of the Kubernetes secret that contains the username and password of the service Domain Service Account that was created prior to the AD deployment, the Security Support Service will use it to generate other AD users in the OU and perform actions on those AD accounts.

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


## Deploy an Automatic Active Directory (AD) connector
To deploy an AD connector, create a YAML spec file called `active-directory-connector.yaml`.

The following example is an example of an Automatic AD connector uses an AD domain of name `CONTOSO.LOCAL`. Ensure to replace the values with the ones for your AD domain. The `adarc-dsa-secret` contains the AD domain service account that was created prior to the AD deployment. 

> [!NOTE]
Make sure the password of provided domain service AD acccount here  doesn't contain '!' as special characaters. 
> 

```yaml
apiVersion: v1 
kind: Secret 
type: Opaque 
metadata: 
  name: adarc-dsa-secret
  namespace: <namespace>
data: 
  password: <your base64 encoded password>
  username: <your base64 encoded username>
---
apiVersion: arcdata.microsoft.com/v1beta2
kind: ActiveDirectoryConnector
metadata:
  name: adarc
  namespace: <namespace>
spec:
  activeDirectory:
    realm: CONTOSO.LOCAL
    serviceAccountProvisioning: automatic
    ouDistinguishedName: "OU=arcou,DC=contoso,DC=local"
    domainServiceAccountSecret: adarc-dsa-secret
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
* [Deploy an Bring your own keytab (BYOK) Active Directory (AD) connector](deploy-byok-active-directory-connector.md)
* [Deploy SQL Managed Instance with Active Directory Authentication](deploy-active-directory-sql-managed-instance.md).
* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md).

