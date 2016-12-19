---
title: Service principal for Azure Kubernetes cluster | Microsoft Docs
description: Create and manage an Azure Active Directory service principal in an Azure Container Service cluster with Kubernetes
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
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/16/2016
ms.author: danlep

---

# About the Azure Active Directory service principal for a Kubernetes cluster in Azure Container Service



In Azure Container Service, Kubernetes requires an [Azure Active Directory service principal](../active-directory/active-directory-application-objects.md) as a service account to interact with Azure APIs. The service principal is needed to dynamically manage
resources such as
[user-defined routes](../virtual-network/virtual-networks-udr-overview.md)
and the Layer 4 [Azure Load Balancer](../load-balancer/load-balancer-overview.md).

This article gives you more information about the service principal for a Kubernetes cluster, and the different options to create one if you haven't already done so. For example, if you installed and set up the [Azure CLI 2.0 (Preview)](https://docs.microsoft.com/cli/azure/install-az-cli2), you can run the [`az acs create`](https://docs.microsoft.com/en-us/cli/azure/acs#create) command to create the Kubernetes cluster and the service principal at the same time.


## Requirements for the service principal

Following are requirements for the Azure Active Directory service principal in a Kubernetes cluster in Azure Container Service. 

* Scope: the Azure subscription in which the cluster is deployed

* Role: **Contributor**

* Client secret: must be a password. At this time, you can't use a service principal set up for certificate authentication.

> [!NOTE] When you create a service principal, you associate it with an Azure Active Directory application. The service principal for a Kubernetes cluster can be associated with any valid Azure Active Directory application name.
> 
>

## Service principal options for a Kubernetes cluster

### Option 1: Pass the service principal client ID and client secret

Provide the **client ID** and **client secret** (password) of an existing service principal as parameters when you create the Kubernetes cluster. If you need to create a service principal in Azure Active Directory, see [Create a service principal](#create-a-service-principal-in-azure-active-directory) later in this article.

You can specify these parameters when [deploying the Kubernetes cluster](./container-service-deployment.md) using the portal, the Azure Command-Line Interface (CLI), or Azure PowerShell.

For example, the following example shows how to pass the parameters explicitly with the [Azure CLI](../xplat-cli-install.md) in [Resource Manager mode](../xplat-cli-connect.md):

```Azure CLI
azure group deployment create -n myClusterName -g myResourceGroup --templateuri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-acs-kubernetes/azuredeploy.json" {"servicePrincipalClientID":"myClientID", "servicePrincipalClientSecret":"myClientSecret"}
```

### Option 2: Generate the service principal when creating the cluster with the Azure CLI 2.0 Preview

If you have installed and set up the [Azure CLI 2.0 (Preview)](https://docs.microsoft.com/cli/azure/install-az-cli2), you can run the [`az acs create`](https://docs.microsoft.com/en-us/cli/azure/acs#create) command to [create the cluster](./container-service-create-acs-cluster-cli.md).

As with other Kubernetes cluster creation options, you can pass the credentials of an existing service principal on the command line. However, when you omit these parameters, Azure Container Service generates the service principal automatically. This takes place transparently during the deployment. 

For example:

```console
az acs create -n myClusterName -d myDNSPrefix -g myResourceGroup --generate-ssh-keys --orchestrator-type kubernetes
```

## Create a service principal in Azure Active Directory

If you want to create a service principal in Azure Active Directory for use in your Kubernetes cluster, Azure provides several methods. 

The following example commands show you how to do this with the [Azure CLI 2.0 (Preview)](https://docs.microsoft.com/cli/azure/install-az-cli2). You can alternatively create a service principal using the [Azure Command-Line Interface](../azure-resource-manager/resource-group-authenticate-service-principal-cli.md), [Azure PowerShell](../azure-resource-manager/resource-group-authenticate-service-principal.md), or the [classic portal](../azure-resource-manager/resource-group-create-service-principal-portal.md).

> [!IMPORTANT]
> Make sure you review the requirements for the service principal earlier in this article.
>

```console
az login

az account set --subscription="mySubscriptionID"

az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/mySubscriptionID"
```

This returns output similar to the following (shown here redacted):

![Create a service principal](./media/container-service-kubernetes-service-principal/service-principal-creds.png)

Highlighted are the **client ID** (`appId`) and the **client secret** (`password`) that you need when you specify service principal parameters for cluster deployment.


Confirm your service principal by opening a new shell and run the following commands, substituting in `appId`, `password`, and `tenant`:

```console 
az login --service-principal -u yourClientID -p yourClientSecret --tenant yourTenant

az vm list-sizes --location westus
```

## Additional considerations


* When specifying the service principal **Client ID**, you can use the value of the `appId` (as shown in this article) or the service principal `name`.

* If you use the `az acs create` command to generate the service principal automatically, the service principal credentials are written to the file ~/.azure/acsServicePrincipal.json on the machine used to run the command.

* On the master and node VMs in the Kubernetes cluster, the service principal credentials are stored in the file /etc/kubernetes/azure.json.
