---
title: Tutorial - Delete an Azure Red Hat OpenShift cluster
description: In this tutorial, learn how to delete an Azure Red Hat OpenShift cluster using the Azure CLI
author: jimzim
ms.author: jzim
ms.topic: tutorial
ms.service: container-service
ms.date: 05/06/2019
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Delete an Azure Red Hat OpenShift cluster

This is the end of the tutorial. When you're finished testing the sample cluster, here's how to delete it and its associated resources so you don't get charged for what you're not using.

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Delete an Azure Red Hat OpenShift cluster

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md)
> * [Scale an Azure Red Hat OpenShift cluster](tutorial-scale-cluster.md)
> * Delete an Azure Red Hat OpenShift cluster

## Prerequisites

Before you begin this tutorial:

* Create a cluster by following the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

## Step 1: Sign in to Azure

If you're running the Azure CLI locally, run `az login` to sign in to Azure.

```bash
az login
```

If you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

## Step 2: Delete the cluster

Open a Bash terminal and set the variable CLUSTER_NAME to the name of your cluster:

```bash
CLUSTER_NAME=yourclustername
```

Now delete your cluster:

```bash
az openshift delete --resource-group $CLUSTER_NAME --name $CLUSTER_NAME
```

You'll be prompted whether you want to delete the cluster. After you confirm with `y`, it will take several minutes to delete the cluster. When the command finishes, the entire Resource Group and all resources inside it, including the cluster, will be deleted.

## Deleting a cluster using the Azure portal

Alternately, you can delete the associated resource group of your cluster through the online Azure portal. The name of the resource group is the same as your cluster name.

Currently, the `Microsoft.ContainerService/openShiftManagedClusters` resource that is created when you create the cluster is hidden in the Azure portal. In the `Resource group` view, check `Show hidden types` to view the resource group.

![Screenshot of the hidden type checkbox](./media/aro-portal-hidden-type.png)

Deleting the resource group will delete all of the related resources that get created when you build an Azure Red Hat OpenShift cluster.

## Next steps

In this part of the tutorial, you learned how to:
> [!div class="checklist"]
> * Delete an Azure Red Hat OpenShift cluster

Learn more about using OpenShift with the official [Red Hat OpenShift documentation](https://docs.openshift.com/aro/welcome/index.html)
