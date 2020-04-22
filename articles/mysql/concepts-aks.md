---
title: Connect to Azure Kubernetes Service - Azure Database for MySQL
description: Learn about connecting Azure Kubernetes Service with Azure Database for MySQL
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 3/18/2020
---


# Connecting Azure Kubernetes Service and Azure Database for MySQL

Azure Kubernetes Service (AKS) provides a managed Kubernetes cluster you can use in Azure. Below are some options to consider when using AKS and Azure Database for MySQL together to create an application.


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

With OSBA, you can create an Azure Database for MySQL server and bind it to your AKS cluster using Kubernetes' native language. Learn about how to use OSBA and Azure Database for MySQL together on the [OSBA GitHub page](https://github.com/Azure/open-service-broker-azure/blob/master/docs/modules/mysql.md). 



## Next steps
- [Create an Azure Kubernetes Service cluster](../aks/kubernetes-walkthrough.md)
- Learn how to [Install WordPress from a Helm chart using OSBA and Azure Database for MySQL](../aks/integrate-azure.md)
