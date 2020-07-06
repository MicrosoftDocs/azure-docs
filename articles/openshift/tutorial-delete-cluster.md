---
title: Tutorial - Delete an Azure Red Hat OpenShift cluster
description: In this tutorial, learn how to delete an Azure Red Hat OpenShift cluster using the Azure CLI
author: sakthi-vetrivel
ms.author: suvetriv
ms.topic: tutorial
ms.service: container-service
ms.date: 04/24/2020
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Delete an Azure Red Hat OpenShift 4 cluster

In this tutorial, part three of three, an Azure Red Hat OpenShift cluster running OpenShift 4 is deleted. You learn how to:

> [!div class="checklist"]
> * Delete an Azure Red Hat OpenShift cluster


## Before you begin

In previous tutorials, an Azure Red Hat OpenShift cluster was created and connected to using the OpenShift web console. If you have not done these steps, and would like to follow along, start with [Tutorial 1 - Create an Azure Red Hat Openshift 4 Cluster.](tutorial-create-cluster.md)

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.75 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Sign in to Azure

If you're running the Azure CLI locally, run `az login` to sign in to Azure.

```bash
az login
```

If you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

## Delete the cluster

In previous tutorials, the following variables were set. 

```bash
CLUSTER=yourclustername
RESOURCE_GROUP=yourresourcegroup
```

Using these values, delete your cluster:

```bash
az aro delete --resource-group $RESOURCEGROUP --name $CLUSTER
```

You'll then be prompted to confirm if you want to delete the cluster. After you confirm with `y`, it will take several minutes to delete the cluster. When the command finishes, the entire resource group and all resources inside it—including the cluster—will be deleted.

## Next steps

In this part of the tutorial, you learned how to:
> [!div class="checklist"]
> * Delete an Azure Red Hat OpenShift 4 cluster

Learn more about using OpenShift with the official [Red Hat OpenShift documentation](https://www.openshift.com/try)
