---
title: Deploy Active Directory integrated Azure Arc-enabled SQL Managed Instance using Azure CLI
description: Explains how to deploy Active Directory integrated Azure Arc-enabled SQL Managed Instance using Azure CLI
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

# Deploy Active Directory integrated Azure Arc-enabled SQL Managed Instance using Azure CLI

This article explains how to deploy Azure Arc-enabled SQL Managed Instance with Active Directory (AD) authentication using Azure CLI.

See these articles for specific instructions:

- [Tutorial – Deploy AD connector in customer-managed keytab mode](deploy-customer-managed-keytab-active-directory-connector.md)
- [Tutorial – Deploy AD connector in system-managed keytab mode](deploy-system-managed-keytab-active-directory-connector.md)

### Prerequisites

Before you proceed, install the following tools:

- The [Azure CLI (az)](/cli/azure/install-azure-cli)
- The [`arcdata` extension for Azure CLI](install-arcdata-extension.md)

To know more further details about how to set up OU and AD account, go to [Deploy Azure Arc-enabled data services in Active Directory authentication - prerequisites](active-directory-prerequisites.md)


## Deploy and update Active Directory integrated Azure Arc-enabled SQL Managed Instance

### [Customer-managed keytab mode](#tab/Customer-managed-keytab-mode)


#### Create an Azure Arc-enabled SQL Managed Instance

To view available options for create command for Azure Arc-enabled SQL Managed Instance, use the following command:

```azurecli
az sql mi-arc create --help
```

To create a SQL Managed Instance, use `az sql mi-arc create`. See the following examples for different connectivity modes:

#### Create - indirectly connected mode

```azurecli
az sql mi-arc create 
--name < SQL MI name >  
--k8s-namespace < namespace > 
--ad-connector-name < your AD connector name > 
--keytab-secret < SQL MI keytab secret name >  
--ad-account-name < SQL MI AD user account >  
--primary-dns-name < SQL MI primary endpoint DNS name > 
--primary-port-number < SQL MI primary endpoint port number > 
--secondary-dns-name < SQL MI secondary endpoint DNS name > 
--secondary-port-number < SQL MI secondary endpoint port number > 
--use-k8s
```

Example:

```azurecli
az sql mi-arc create 
--name contososqlmi 
--k8s-namespace arc 
--ad-connector-name adarc 
--keytab-secret arcuser-keytab-secret
--ad-account-name arcuser 
--primary-dns-name arcsqlmi.contoso.local
--primary-port-number 31433 
--secondary-dns-name arcsqlmi-2.contoso.local
--secondary-port-number 31434
--use-k8s
```

#### Create - directly connected mode

```azurecli
az sql mi-arc create 
--name < SQL MI name >  
--ad-connector-name < your AD connector name > 
--keytab-secret < SQL MI keytab secret name >  
--ad-account-name < SQL MI AD user account > 
--primary-dns-name < SQL MI primary endpoint DNS name > 
--primary-port-number < SQL MI primary endpoint port number > 
--secondary-dns-name < SQL MI secondary endpoint DNS name > 
--secondary-port-number < SQL MI secondary endpoint port number >
--custom-location < your custom location > 
--resource-group < resource-group >
```

Example:

```azurecli
az sql mi-arc create 
--name contososqlmi 
--ad-connector-name adarc 
--keytab-secret arcuser-keytab-secret
--ad-account-name arcuser 
--primary-dns-name arcsqlmi.contoso.local
--primary-port-number 31433 
--secondary-dns-name arcsqlmi-2.contoso.local
--secondary-port-number 31434
--custom-location private-location
--resource-group arc-rg
```

#### Update an Azure Arc-enabled SQL Managed Instance

To update a SQL Managed Instance, use `az sql mi-arc update`. See the following examples for different connectivity modes:

#### Update - indirectly connected mode

```azurecli
az sql mi-arc update 
--name < SQL MI name >  
--k8s-namespace < namespace > 
--keytab-secret < SQL MI keytab secret name >  
--use-k8s
```

Example:

```azurecli
az sql mi-arc update 
--name contososqlmi 
--k8s-namespace arc 
--keytab-secret arcuser-keytab-secret
--use-k8s
```

#### Update - directly connected mode

> [!NOTE]
> Note that the **resource group** is a mandatory parameter but this is not changeable. 

```azurecli
az sql mi-arc update 
--name < SQL MI name >  
--keytab-secret < SQL MI keytab secret name >  
--resource-group < resource-group >
```

Example:

```azurecli
az sql mi-arc update 
--name contososqlmi 
--keytab-secret arcuser-keytab-secret
--resource-group arc-rg
```

### [System-managed keytab mode](#tab/system-managed-keytab-mode)


#### Create an Azure Arc-enabled SQL Managed Instance

To view available options for create command for Azure Arc-enabled SQL Managed Instance, use the following command:

```azurecli
az sql mi-arc create --help
```

To create a SQL Managed Instance, use `az sql mi-arc create`. See the following examples for different connectivity modes:


##### Create - indirectly connected mode

```azurecli
az sql mi-arc create 
--name < SQL MI name >  
--k8s-namespace < namespace > 
--ad-connector-name < your AD connector name > 
--ad-account-name < SQL MI AD user account >  
--primary-dns-name < SQL MI primary endpoint DNS name > 
--primary-port-number < SQL MI primary endpoint port number > 
--secondary-dns-name < SQL MI secondary endpoint DNS name > 
--secondary-port-number < SQL MI secondary endpoint port number >
--use-k8s
```

Example:

```azurecli
az sql mi-arc create 
--name contososqlmi 
--k8s-namespace arc 
--ad-connector-name adarc 
--ad-account-name arcuser 
--primary-dns-name arcsqlmi.contoso.local
--primary-port-number 31433 
--secondary-dns-name arcsqlmi-2.contoso.local
--secondary-port-number 31434
--use-k8s
```

##### Create - directly connected mode

```azurecli
az sql mi-arc create 
--name < SQL MI name >  
--ad-connector-name < your AD connector name >  
--ad-account-name < SQL MI AD user account >  
--primary-dns-name < SQL MI primary endpoint DNS name > 
--primary-port-number < SQL MI primary endpoint port number > 
--secondary-dns-name < SQL MI secondary endpoint DNS name > 
--secondary-port-number < SQL MI secondary endpoint port number >
--custom-location < your custom location > 
--resource-group <resource-group>
```

Example:

```azurecli
az sql mi-arc create 
--name contososqlmi 
--ad-connector-name adarc 
--ad-account-name arcuser 
--primary-dns-name arcsqlmi.contoso.local
--primary-port-number 31433 
--secondary-dns-name arcsqlmi-2.contoso.local
--secondary-port-number 31434
--custom-location private-location
--resource-group arc-rg
```


---


## Delete an Azure Arc-enabled SQL Managed Instance in directly connected mode

To delete a SQL Managed Instance, use `az sql mi-arc delete`. See the following examples for both connectivity modes:


### [Indirectly connected mode](#tab/indirectly-connected-mode)

```azurecli
az sql mi-arc delete --name < SQL MI name >  --k8s-namespace < namespace > --use-k8s
```

Example:

```azurecli
az sql mi-arc delete --name contososqlmi --k8s-namespace arc --use-k8s
```

### [Directly connected mode](#tab/directly-connected-mode)

```azurecli
az sql mi-arc delete --name < SQL MI name > --resource-group < resource group > 
```

Example:

```azurecli
az sql mi-arc delete --name contososqlmi  --resource-group arc-rg
```




## Next steps
* [Deploy Arc-enabled SQL Managed Instance with Active Directory Authentication](deploy-active-directory-sql-managed-instance.md).
* [Connect to Active Directory integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md).
