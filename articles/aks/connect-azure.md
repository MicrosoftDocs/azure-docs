---
title: Connect to Azure services | Microsoft Docs
description: Connect to Azure services
services: container-service
documentationcenter: ''
author: sozercan
manager: ritazh
editor: ''
tags: aks, azure-container-service
keywords: Kubernetes, Docker, Containers, Microservices, Azure, Open Service Broker

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/30/2017
ms.author: seozerca
ms.custom: mvc

---
# Connect your app with Azure managed services using Open Service Broker for Azure

## Introduction

[Open Service Broker API](https://www.openservicebrokerapi.org) allows developers to utilize cloud managed services in cloud native platforms such as Pivotal Cloud Foundry, Kubernetes and Red Hat OpenShift. In this guide, we will focus on deploying Kubernetes Service Catalog, Open Service Broker for Azure (OSBA) and applications that use Azure managed sservices using Kubernetes.

## Creating a cluster

Let's get started by deploying an AKS cluster. You can follow the [Create an AKS cluster](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough) quickstart.

## Installing Service Catalog

Next step is to install service catalog using Helm chart. Please refer to [Install Helm CLI](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm#install-helm-cli) for Helm installation.

Let's make sure we have the latest version of Helm components installed in our cluster with:

```azurecli-interactive
helm init --upgrade
```

Adding the service catalog chart Helm repository:

```azurecli-interactive
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com
```

Installing service catalog from Helm chart:

```azurecli-interactive
helm install svc-cat/catalog \
    --name catalog --namespace catalog
```

After, you install the Helm chart, you should see service catalog in:

```azurecli-interactive
kubectl get apiservice
```

Here is a quick demo of this process:
![Installing Service Catalog](media/container-service-connect-azure/osbademo-0.gif)

# Installing Open Service Broker for Azure

Next part is to install [Open Service Broker for Azure](https://github.com/Azure/open-service-broker-azure) which includes the catalog for the Azure managed services. At the time of writing this, these are the available Azure services:

*   Azure Database for PostgreSQL
*   Azure Redis Cache
*   Azure Database for MySQL
*   Azure Event Hubs
*   Azure Service Bus
*   Azure Cosmos DB
*   Azure Container Instances
*   Azure Key Vault
*   Azure SQL Database

Let's start by adding Open Service Broker for Azure Helm repository:

```azurecli-interactive
helm repo add azure https://kubernetescharts.blob.core.windows.net/azure
```

Setting environment variables for our Azure subscription:

```azurecli-interactive
AZURE_SUBSCRIPTION_ID=[your Azure subscription ID]
AZURE_TENANT_ID=[your Azure tenant ID]
AZURE_CLIENT_ID=[your Azure client ID]
AZURE_CLIENT_SECRET=[your Azure client secret]
```

Installing Open Service Broker for Azure:

```azurecli-interactive
helm install azure/open-service-broker-azure --name osba --namespace osba \
    --set azure.subscriptionId=$AZURE_SUBSCRIPTION_ID \
    --set azure.tenantId=$AZURE_TENANT_ID \
    --set azure.clientId=$AZURE_CLIENT_ID \
    --set azure.clientSecret=$AZURE_CLIENT_SECRET
```

Here are a few commands to verify Open Service Broker for Azure and installed services with plans:

Show installed broker:
```azurecli-interactive
kubectl get clusterservicebroker -o yaml
```

Show installed service classes:
```azurecli-interactive
kubectl get clusterserviceclasses -o=custom-columns=NAME:.metadata.name,EXTERNAL \
    NAME:.spec.externalName
```

Show installed service plans:
```azurecli-interactive
kubectl get clusterserviceplans -o=custom-columns=NAME:.metadata.name,EXTERNAL \
    NAME:.spec.externalName,SERVICE \
    CLASS:.spec.clusterServiceClassRef.name \
    --sort-by=.spec.clusterServiceClassRef.name
```

Here is a quick demo of this process:
![Installing Open Service Broker for Azure](media/container-service-connect-azure/osbademo-1.gif)

# Installing WordPress from Helm chart using Azure Database for MySQL

```azurecli-interactive
helm install azure/wordpress --name wordpress --namespace wordpress
```

Here is a quick demo of this process:
![Installing WordPress](media/container-service-connect-azure/osbademo-2.gif)

To verify the installation has provisioned the right resources for us:

Show installed service instance and bindings:
```azurecli-interactive
kubectl get serviceinstance -n wordpress -o yaml
kubectl get servicebinding -n wordpress -o yaml

Show installed secrets:
```azurecli-interactive
kubectl get secrets -n wordpress -o yaml
```

Here is a quick demo of this process:
![Installing WordPress](media/container-service-connect-azure/osbademo-3.gif)

If you are interested in more charts to deploy using Open Service Broker for Azure, check out [Azure/helm-charts](https://github.com/Azure/helm-charts) repository.

# Summary

In this guide, we showed how to install Service Catalog to our Kubernetes cluster and how to deploy Open Service Broker for Azure and deploy an application, such as WordPress, that is using Azure managed services, in this case Azure Database for MySQL.