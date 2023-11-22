---
title: Connect to Azure Kubernetes Service - Azure Database for MySQL flexible server
description: Learn about connecting Azure Kubernetes Service with Azure Database for MySQL flexible server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Best practices for Azure Kubernetes Service and Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Kubernetes Service (AKS) provides a managed Kubernetes cluster you can use in Azure. Consider the following options when using AKS and Azure Database for MySQL flexible server together to create an application.

## Create the database before creating the AKS cluster

Azure Database for MySQL has two deployment options:

- Single Server
- Flexible Server

Single Server supports a single availability zone and Flexible Server supports multiple availability zones. AKS on the other hand also supports enabling single or multiple availability zones.  Creating the database server first to see the availability zone the server is in and creating the AKS clusters in the same availability zone can improve application performance by reducing networking latency.

## Use Accelerated networking

Use accelerated networking-enabled underlying VMs in your AKS cluster. When accelerated networking is enabled on a VM, there's lower latency, reduced jitter, and decreased CPU utilization on the VM. Learn more about how accelerated networking works, the supported OS versions, and supported VM instances for [Linux](../../virtual-network/create-vm-accelerated-networking-cli.md).

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

The output is the generated resource group that AKS creates containing the network interface. Take the "nodeResourceGroup" name and use it in the next command. **EnableAcceleratedNetworking** is either true or false.

```azurecli
az network nic list --resource-group nodeResourceGroup -o table
```

## Use Azure premium fileshare

 Use [Azure premium fileshare](../../storage/files/storage-how-to-create-file-share.md?tabs=azure-portal) for persistent storage that can be used by one or many pods, and can be dynamically or statically provisioned. Azure premium fileshare gives you best performance for your application if you expect large number of I/O operations on the file storage. To learn more, see [How to enable Azure Files](../../aks/azure-files-dynamic-pv.md).

## Next steps

Create an AKS cluster by [using the Azure CLI](../../aks/learn/quick-kubernetes-deploy-cli.md), [using Azure PowerShell](../../aks/learn/quick-kubernetes-deploy-powershell.md), or [using the Azure portal](../../aks/learn/quick-kubernetes-deploy-portal.md).