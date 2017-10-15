---
title: Service principal for Azure Kubernetes cluster | Microsoft Docs
description: Create and manage an Azure Active Directory service principal for a Kubernetes cluster in Azure Container Service
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: nepeters
ms.custom: mvc

---

# Set up an Azure AD service principal for an AKS cluster

An AKS cluster requires an [Azure Active Directory service principal](../active-directory/develop/active-directory-application-objects.md) to interact with Azure APIs. The service principal is needed to dynamically manage esources such as [user-defined routes](../virtual-network/virtual-networks-udr-overview.md) and the [Layer 4 Azure Load Balancer](../load-balancer/load-balancer-overview.md).

This article shows different options for setting up a service principal for your AKS cluster.

## Before you begin

The steps detailed in this document assume that you have created an AKS Kubernetes cluster and have established a kubectl connection with the cluster. If you need these items see, the [AKS Kubernetes quickstart](./kubernetes-walkthrough.md).

You also need the Azure CLI version 2.0.4 or later installed and configured. Run az --version to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Exsisting service principal

You can use an existing service principal that meets the following requirements:

**Scope**: the subscription used to deploy the cluster.
**Role**: **Contributor**
**Client secret**: must be a password. Currently, you can't use a service principal set up for certificate authentication.

## Create SP with AKS cluster

To create a service principal, you must have permissions to register an application with your Azure AD tenant, and to assign the application to a role in your subscription.

When deploying an AKS cluster with the `az aks create` command, you have the option to generate a service principal automatically.

As with other Kubernetes cluster creation options, you can specify parameters for an existing service principal when you run `az aks create`. However, when you omit these parameters, the Azure CLI creates one automatically for use with Container Service. This takes place transparently during the deployment.

The following command creates a Kubernetes cluster and generates both SSH keys and service principal credentials:

```console
az aks create -n myClusterName -d myDNSPrefix -g myResourceGroup --generate-ssh-keys
```

## Manually create the SP

An existing Azure AD service principle can be used or pre-created for use with an AKS cluster. This is helpful when deploying a cluster form the Azure portal where you are required to provide the service principle information. 

To create the service principle with the Azure CLI, use the [az ad sp create-for-rbac]() command. 

```azurecli
id=$(az account show --query id --output tsv)
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$id"
```

Output is similar to the following. Take note of the `appId` and `password`. These values are used when creating an AKS cluster.

```console
{
  "appId": "000000-0000-0000-0000-000000000000",
  "displayName": "azure-cli-2017-10-15-02-20-15",
  "name": "http://azure-cli-2017-10-15-02-20-15",
  "password": "77851d2c-ad18-46c3-8ca6-cb3ebc97975a",
  "tenant": "00000000-0000-0000-0000-000000000000"
}
```

When using a pre-created service principle, provide the `appId` and `password` as argument values to the `az aks create` command. 

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myK8SCluster --service-princal <appId> ----client-secret <password>
```

If deploying an AKS cluster from the Azure portal, enter these values in the AKS cluster configuration form. 

![Image of browsing to Azure Vote](media/container-service-kubernetes-service-principal/sp-portal.png)

## Additional considerations

When working with AKS and Azure AD service principles, keep the following in mind.

* If you don't have permissions to create a service principal in your subscription, you might need to ask your Azure AD or subscription administrator to assign the necessary permissions, or ask them for a service principal to use with Azure Container Service
* The service principal for Kubernetes is a part of the cluster configuration. However, don't use the identity to deploy the cluster.
* Every service principal is associated with an Azure AD application. The service principal for a Kubernetes cluster can be associated with any valid Azure AD application name (for example: `https://www.contoso.org/example`). The URL for the application doesn't have to be a real endpoint.
* When specifying the service principal **Client ID**, you can use the value of the `appId` (as shown in this article) or the corresponding service principal `name` (for example,`https://www.contoso.org/example`).
* On the master and agent VMs in the Kubernetes cluster, the service principal credentials are stored in the file /etc/kubernetes/azure.json.
* When you use the `az aks create` command to generate the service principal automatically, the service principal credentials are written to the file ~/.azure/acsServicePrincipal.json on the machine used to run the command.
* When you use the `az aks create` command to generate the service principal automatically, the service principal can also authenticate with an [Azure container registry](../container-registry/container-registry-intro.md) created in the same subscription.

## Next steps

For more information about Azure Active Directory service principles, see the Azure AD applications documentation.

> [!div class="nextstepaction"]
> [Application and service principal objects](../active-directory/develop/active-directory-application-objects.md)