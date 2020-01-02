---
title: Connect to Azure Kubernetes Service - Azure Database for PostgreSQL - Single Server
description: Learn about connecting Azure Kubernetes Service (AKS) with Azure Database for PostgreSQL - Single Server
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.date: 5/6/2019
ms.topic: conceptual
---

# Connecting Azure Kubernetes Service and Azure Database for PostgreSQL - Single Server

Azure Kubernetes Service (AKS) provides a managed Kubernetes cluster you can use in Azure. Below are some options to consider when using AKS and Azure Database for PostgreSQL together to create an application.


## Accelerated networking
Use accelerated networking-enabled underlying VMs in your AKS cluster. When accelerated networking is enabled on a VM, there is lower latency, reduced jitter, and decreased CPU utilization on the VM. Learn more about how accelerated networking works, the supported OS versions, and supported VM instances for [Linux](../virtual-network/create-vm-accelerated-networking-cli.md).

From November 2018, AKS supports accelerated networking on those supported VM instances. Accelerated networking is enabled by default on new AKS clusters that use those VMs.

You can confirm whether your AKS cluster has accelerated networking:
1. Go to the Azure portal and select your AKS cluster.
2. Select the Properties tab.
3. Copy the name of the **Infrastructure Resource Group**.
4. Use the portal search bar to locate and open the infrastructure resource group.
5. Select a VM in that resource group.
6. Go to the VM's **Networking** tab.
7. Confirm whether **Accelerated networking** is 'Enabled.'

Or through the Azure CLI using the following two commands:
```azurecli
az aks show --resource-group myResourceGroup --name myAKSCluster --query "nodeResourceGroup"
```
The output will be the generated resource group that AKS creates containing the network interface. Take the "nodeResourceGroup" name and use it in the next command. **EnableAcceleratedNetworking** will either be true or false:
```azurecli
az network nic list --resource-group nodeResourceGroup -o table
```

## Open Service Broker for Azure 
[Open Service Broker for Azure](https://github.com/Azure/open-service-broker-azure/blob/master/README.md) (OSBA) lets you provision Azure services directly from Kubernetes or Cloud Foundry. It is an [Open Service Broker API](https://www.openservicebrokerapi.org/) implementation for Azure.

With OSBA, you can create an Azure Database for PostgreSQL server and bind it to your AKS cluster using Kubernetes' native language. Learn about how to use OSBA and Azure Database for PostgreSQL together on the [OSBA GitHub page](https://github.com/Azure/open-service-broker-azure/blob/master/docs/modules/postgresql.md). 


## Connection pooling
A connection pooler minimizes the cost and time associated with creating and closing new connections to the database. The pool is a collection of connections that can be reused. 

There are multiple connection poolers you can use with PostgreSQL. One of these is [PgBouncer](https://pgbouncer.github.io/). In the Microsoft Container Registry, we provide a lightweight containerized PgBouncer that can be used in a sidecar to pool connections from AKS to Azure Database for PostgreSQL. Visit the [docker hub page](https://hub.docker.com/r/microsoft/azureossdb-tools-pgbouncer/) to learn how to access and use this image. 


## Next steps
-  [Create an Azure Kubernetes Service cluster](../aks/kubernetes-walkthrough.md)
