---
title: Service principal for Kubernetes cluster | Microsoft Docs
description: Create an Azure Active Directory service principal in an Azure Container Service cluster with Kubernetes
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/15/2016
ms.author: danlep

---

# Create an Azure Active Directory service principal for a Kubernetes cluster in Azure Container Service



Service accounts in Azure are tied to [Azure Active Directory service principals](../active-directory/active-directory-application-objects.md). 

Kubernetes uses a service principal to talk to Azure APIs to dynamically manage
resources such as
[user-defined routes](../virtual-network/virtual-networks-udr-overview.md)
and the Layer 4 [Azure Load Balancer](../load-balancer/load-balancer-overview.md). 

When [deploying a Kubernetes cluster with Azure container service](./container-service-deployment.md), you need to supply the following service principal parameters: the client ID (`client_id`) and the client password (`client_secret`).

## Create a service principal


There are several ways to create a service principal in Azure Active Directory. The following commands show you how to do this with the [Azure CLI 2.0 Preview](https://github.com/Azure/azure-cli) (see [installation instructions](https://github.com/azure/azure-cli)).

   ```shell
   az login
   az account set --subscription="${SUBSCRIPTION_ID}"
   az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTION_ID}"
   ```

This will output your `client_id`, `client_secret` (password), `sp_name`, and `tenant`.  The `sp_name` or `client_id` may be used for the `servicePrincipalProfile.servicePrincipalClientId` and the `client_secret` is used for `servicePrincipalProfile.servicePrincipalClientSecret`.

Confirm your service principal by opening a new shell and run the following commands substituting in `sp_name`, `client_secret`, and `tenant`:

   ```shell
   az login --service-principal -u SPNAME -p CLIENTSECRET --tenant TENANT
   az vm list-sizes --location westus
   ```
You can alternatively create a service principal using the [Azure Command-Line Interface](../azure-resource-manager/resource-group-authenticate-service-principal-cli.md), [Azure PowerShell](../azure-resource-manager/resource-group-authenticate-service-principal.md), or the [classic portal](../azure-resource-manager/resource-group-create-service-principal-portal.md).