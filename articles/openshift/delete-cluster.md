---
title: Delete an Azure Red Hat OpenShift cluster
description: Learn how to delete an Azure Red Hat OpenShift cluster using the Azure CLI.
author: johnmarco
ms.custom: fasttrack-edit, devx-track-azurecli
ms.author: johnmarc
ms.topic: article
ms.service: azure-redhat-openshift
ms.date: 06/12/2024
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Delete an Azure Red Hat OpenShift 4 cluster

This article shows you how to delete an Azure Red Hat OpenShift cluster.


## Before you begin

This article requires Azure CLI version 2.6.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Sign in to Azure

If you're running the Azure CLI locally, run `az login` to sign in to Azure.

```azurecli
az login
```

If you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

## Delete the cluster

In previous articles for [creating](create-cluster.md) and [connecting](connect-cluster.md) a cluster, the following variable was set:

```bash
RESOURCEGROUP=yourresourcegroup
CLUSTER=clustername
```

Using these values, delete your cluster:

```azurecli
az aro delete --resource-group $RESOURCEGROUP --name $CLUSTER
```
You'll then be prompted to confirm if you are sure you want to perform this operation. After you confirm with `y`, it will take several minutes to delete the cluster. When the command finishes, the cluster will be deleted and all the managed objects.

> [!NOTE] 
> User-created objects such as virtual network and subnets must be manually deleted accordingly.

## Next steps

Learn more about using OpenShift with the official [Red Hat OpenShift documentation](https://docs.openshift.com/container-platform/4.14/welcome/index.html).
