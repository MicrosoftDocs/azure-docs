---
title: Deploy Active Directory integrated Azure Arc-enabled PostgreSQL server using Azure CLI
description: Explains how to deploy Active Directory integrated Azure Arc-enabled PostgreSQL server using Azure CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
ms.custom: devx-track-azurecli
author: hasani-h
ms.author: hasaniholder
ms.reviewer: mikeray
ms.date: 02/10/2023
ms.topic: how-to
---

# Deploy Active Directory integrated Azure Arc-enabled PostgreSQL using Azure CLI

This article explains how to deploy Azure Arc-enabled PostgreSQL server with Active Directory (AD) authentication using Azure CLI.

See these articles for specific instructions:

- [Tutorial – Deploy AD connector in customer-managed keytab mode](deploy-customer-managed-keytab-active-directory-connector.md)

### Prerequisites

Before you proceed, install the following tools:

- The [Azure CLI (az)](/cli/azure/install-azure-cli)
- The [`arcdata` extension for Azure CLI](install-arcdata-extension.md)

To know more further details about how to set up OU and AD account, go to [Deploy Azure Arc-enabled data services in Active Directory authentication - prerequisites](active-directory-prerequisites.md)

> [!IMPORTANT]
> When using Active Directory, the default account must be named "postgres" in order for connections to succeed.

## Deploy and update Active Directory integrated Azure Arc-enabled PostgreSQL server

### Customer-managed keytab mode

#### Create an Azure Arc-enabled PostgreSQL server

To view available options for the create command for Azure Arc-enabled PostgreSQL server, use the following command:

```azurecli
az postgres server-arc create --help
```

To create a SQL Managed Instance, use `az postgres server-arc create`. See the following example:

```azurecli
az postgres server-arc create 
--name < PostgreSQL server name >  
--k8s-namespace < namespace > 
--ad-connector-name < your AD connector name > 
--keytab-secret < PostgreSQL server keytab secret name >  
--ad-account-name < PostgreSQL server AD user account >  
--dns-name < PostgreSQL server primary endpoint DNS name > 
--port < PostgreSQL server primary endpoint port number >
--use-k8s
```

Example:

```azurecli
az postgres server-arc create 
--name contosopg 
--k8s-namespace arc 
--ad-connector-name adarc 
--keytab-secret arcuser-keytab-secret
--ad-account-name arcuser 
--dns-name arcpg.contoso.local
--port 31432
--use-k8s
```

#### Update an Azure Arc-enabled PostgreSQL server

To update an Arc-enabled PostgreSQL server, use `az postgres server-arc update`. See the following example:

```azurecli
az postgres server-arc update 
--name < PostgreSQL server name >  
--k8s-namespace < namespace > 
--keytab-secret < PostgreSQL server keytab secret name >  
--use-k8s
```

Example:

```azurecli
az postgres server-arc update 
--name contosopg 
--k8s-namespace arc 
--keytab-secret arcuser-keytab-secret
--use-k8s
```

## Next steps
- **Try it out.** Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM. 
