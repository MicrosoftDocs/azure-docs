---
title: Tutorial – Deploy Active Directory connector using Azure CLI
description: Tutorial to deploy an Active Directory connector using Azure CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: devx-track-azurecli
author: mikhailalmeida
ms.author: mialmei
ms.reviewer: mikeray
ms.date: 10/11/2022
ms.topic: how-to
---


# Tutorial – Deploy Active Directory connector using Azure CLI

This article explains how to deploy an Active Directory (AD) connector using Azure CLI. The AD connector is a key component to enable Active Directory authentication on SQL Managed Instance enabled by Azure Arc.

## Prerequisites

### Install tools

Before you can proceed with the tasks in this article, install the following tools:

- The [Azure CLI (az)](/cli/azure/install-azure-cli)
- The [`arcdata` extension for Azure CLI](install-arcdata-extension.md)

To know further details about how to set up OU and AD account, go to [Deploy Azure Arc-enabled data services in Active Directory authentication - prerequisites](active-directory-prerequisites.md)


## Deploy Active Directory connector in customer-managed keytab mode 

### [Customer-managed keytab mode](#tab/customer-managed-keytab-mode)

#### Create an AD connector instance

> [!NOTE]
> Make sure to wrap your password for the domain service AD account with single quote `'` to avoid the expansion of special characters such as `!`.
> 

To view available options for create command for AD connector instance, use the following command:

```azurecli
az arcdata ad-connector create --help
```

To create an AD connector instance, use `az arcdata ad-connector create`. See the following examples for different connectivity modes:


##### Indirectly connected mode

```azurecli
az arcdata ad-connector create
--name < name >
--k8s-namespace < Kubernetes namespace >
--realm < AD Domain name >
--nameserver-addresses < DNS server IP addresses >
--account-provisioning < account provisioning mode : manual or automatic > 
--prefer-k8s-dns < whether Kubernetes DNS or AD DNS Server for IP address lookup >
--use-k8s
```

Example:

```azurecli
az arcdata ad-connector create 
--name arcadc 
--k8s-namespace arc 
--realm CONTOSO.LOCAL 
--nameserver-addresses 10.10.10.11
--account-provisioning manual
--prefer-k8s-dns false
--use-k8s
```

```azurecli
# Setting environment variables needed for automatic account provisioning
DOMAIN_SERVICE_ACCOUNT_USERNAME='sqlmi'
DOMAIN_SERVICE_ACCOUNT_PASSWORD='arc@123!!'

# Deploying active directory connector with automatic account provisioning
az arcdata ad-connector create 
--name arcadc 
--k8s-namespace arc 
--realm CONTOSO.LOCAL 
--nameserver-addresses 10.10.10.11
--account-provisioning automatic
--prefer-k8s-dns false
--use-k8s
```

##### Directly connected mode

```azurecli
az arcdata ad-connector create 
--name < name >
--dns-domain-name < The DNS name of AD domain > 
--realm < AD Domain name >  
--nameserver-addresses < DNS server IP addresses >
--account-provisioning < account provisioning mode : manual or automatic >
--prefer-k8s-dns < whether Kubernetes DNS or AD DNS Server for IP address lookup >
--data-controller-name < Arc Data Controller Name >
--resource-group < resource-group >
```

Example:

```azurecli
az arcdata ad-connector create 
--name arcadc 
--realm CONTOSO.LOCAL 
--dns-domain-name contoso.local 
--nameserver-addresses 10.10.10.11
--account-provisioning manual
--prefer-k8s-dns false
--data-controller-name arcdc
--resource-group arc-rg
```

```azurecli
# Setting environment variables needed for automatic account provisioning
DOMAIN_SERVICE_ACCOUNT_USERNAME='sqlmi'
DOMAIN_SERVICE_ACCOUNT_PASSWORD='arc@123!!'

# Deploying active directory connector with automatic account provisioning
az arcdata ad-connector create 
--name arcadc 
--realm CONTOSO.LOCAL 
--dns-domain-name contoso.local 
--nameserver-addresses 10.10.10.11
--account-provisioning automatic
--prefer-k8s-dns false
--data-controller-name arcdc
--resource-group arc-rg
```

### Update an AD connector instance

To view available options for update command for AD connector instance, use the following command:

```azurecli
az arcdata ad-connector update --help
```

To update an AD connector instance, use `az arcdata ad-connector update`. See the following examples for different connectivity modes:

#### Indirectly connected mode

```azurecli
az arcdata ad-connector update 
--name < name >
--k8s-namespace < Kubernetes namespace > 
--nameserver-addresses < DNS server IP addresses >
--use-k8s
```

Example:

```azurecli
az arcdata ad-connector update 
--name arcadc 
--k8s-namespace arc 
--nameserver-addresses 10.10.10.11
--use-k8s
```

#### Directly connected mode

```azurecli
az arcdata ad-connector update 
--name < name >
--nameserver-addresses < DNS server IP addresses > 
--data-controller-name < Arc Data Controller Name >
--resource-group < resource-group >
```

Example:

```azurecli
az arcdata ad-connector update 
--name arcadc 
--nameserver-addresses 10.10.10.11
--data-controller-name arcdc
--resource-group arc-rg
```


### [system-managed keytab mode](#tab/system-managed-keytab-mode)
To create an AD connector instance, use `az arcdata ad-connector create`. See the following examples for different connectivity modes:


#### Indirectly connected mode

```azurecli
az arcdata ad-connector create 
--name < name >
--k8s-namespace < Kubernetes namespace > 
--dns-domain-name < The DNS name of AD domain > 
--realm < AD Domain name >  
--nameserver-addresses < DNS server IP addresses >
--account-provisioning < account provisioning mode > 
--ou-distinguished-name < AD Organizational Unit distinguished name >
--prefer-k8s-dns < whether Kubernetes DNS or AD DNS Server for IP address lookup >
--use-k8s
```

Example:

```azurecli
az arcdata ad-connector create 
--name arcadc 
--k8s-namespace arc 
--realm CONTOSO.LOCAL 
--netbios-domain-name CONTOSO 
--dns-domain-name contoso.local 
--nameserver-addresses 10.10.10.11
--account-provisioning automatic 
--ou-distinguished-name “OU=arcou,DC=contoso,DC=local” 
--prefer-k8s-dns false
--use-k8s
```

#### Directly connected mode

```azurecli
az arcdata ad-connector create 
--name < name >
--dns-domain-name < The DNS name of AD domain > 
--realm < AD Domain name >  
--netbios-domain-name < AD domain NETBOIS name > 
--nameserver-addresses < DNS server IP addresses >
--account-provisioning < account provisioning mode > 
--ou-distinguished-name < AD domain organizational distinguished name >
--prefer-k8s-dns < whether Kubernetes DNS or AD DNS Server for IP address lookup >
--data-controller-name < Arc Data Controller Name >
--resource-group < resource-group >
```

Example:

```azurecli
az arcdata ad-connector create 
--name arcadc 
--realm CONTOSO.LOCAL 
--netbios-domain-name CONTOSO 
--dns-domain-name contoso.local 
--nameserver-addresses 10.10.10.11
--account-provisioning automatic 
--ou-distinguished-name “OU=arcou,DC=contoso,DC=local” 
--prefer-k8s-dns false
--data-controller-name arcdc
--resource-group arc-rg
```

### Update an AD connector instance

To view available options for update command for AD connector instance, use the following command:

```azurecli
az arcdata ad-connector update --help
```
To update an AD connector instance, use `az arcdata ad-connector update`. See the following examples for different connectivity modes:

### Indirectly connected mode

```azurecli
az arcdata ad-connector update 
--name < name >
--k8s-namespace < Kubernetes namespace > 
--nameserver-addresses < DNS server IP addresses >
--use-k8s
```

Example:

```azurecli
az arcdata ad-connector update 
--name arcadc 
--k8s-namespace arc 
--nameserver-addresses 10.10.10.11
--use-k8s
```

#### Directly connected mode

```azurecli
az arcdata ad-connector update 
--name < name >
--nameserver-addresses < DNS server IP addresses > 
--data-controller-name < Arc Data Controller Name>
--resource-group <resource-group>
```

Example:

```azurecli
az arcdata ad-connector update 
--name arcadc 
--nameserver-addresses 10.10.10.11
--data-controller-name arcdc
--resource-group arc-rg
```

---

## Delete an AD connector instance

To delete an AD connector instance, use `az arcdata ad-connector delete`. See the following examples for both connectivity modes:

### [Indirectly connected mode](#tab/indirectly-connected-mode)

```azurecli
az arcdata ad-connector delete --name < AD Connector name >  --k8s-namespace < namespace > --use-k8s
```

Example:

```azurecli
az arcdata ad-connector delete --name arcadc --k8s-namespace arc --use-k8s
```

### [Directly connected mode](#tab/directly-connected-mode)
```azurecli
az arcdata ad-connector delete --name < AD Connector name >  --data-controller-name < data controller name > --resource-group < resource group > 
```

Example:

```azurecli
az arcdata ad-connector delete --name arcadc --data-controller-name arcdc --resource-group arc-rg
```

---

## Related content
* [Tutorial – Deploy AD connector in customer-managed keytab mode](deploy-customer-managed-keytab-active-directory-connector.md)
* [Tutorial – Deploy AD connector in system-managed keytab mode](deploy-system-managed-keytab-active-directory-connector.md)
* [Deploy Arc-enabled SQL Managed Instance with Active Directory Authentication](deploy-active-directory-sql-managed-instance.md).
