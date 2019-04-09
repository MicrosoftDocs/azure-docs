---
title: Delete an Azure OpenShift cluster | Microsoft Docs
description: In this tutorial, learn how to delete an Azure Red Hat OpenShift cluster using the Azure CLI
services: container-service
author: tylermsft
ms.author: twhitney
manager: jeconnoc
ms.topic: tutorial
ms.service: openshift
ms.date: 05/06/2019
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Delete an Azure Red Hat OpenShift cluster

This is the end of the tutorial. When you are done with the resources you have created, delete your cluster and associated resources so that you are not charged for resources you're no longer using.

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

If you have access to multiple subscriptions, run `az account set -s
SUBSCRIPTION_ID` to default to the correct subscription.

## Step 2: Delete the cluster

Using the CLI command `az openshift delete <cluster name>` to delete the cluster.

## Step 3: Delete resources associated with the cluster

To clean up all resources associated with the cluster, you must delete the resource group that you specified when you created the cluster.  Which will also delete all of the other related resources that get created when you build an Azure Red Hat OpenShift cluster.

Currently, the `Microsoft.ContainerService/openShiftManagedClusters` resource that is created when you create the cluster is hidden in the Azure portal. In the `Resource group` view, check `Show hidden types` to view the resource group.

![Screenshot of the hidden type checkbox](./media/aro-portal-hidden-type.png)

Or, you can run `az openshift list` to output the resource groups. Note the name of the resource group that you specified when you created the Azure Red Hat OpenShift cluster.

Delete the resource group with `az group delete --name <Azure Red Hat OpenShift cluster resource group name>`  The process will take a few minutes, and at the end the entire Resource Group and all resources inside it will be deleted.

## Next steps

In this part of the tutorial, you learned how to:
> [!div class="checklist"]
> * Delete an Azure Red Hat OpenShiftRO cluster
> * Delete the related resources that go with it.

Now that you have completed the tutorial series, learn more about Red Hat OpenShift at [Red Hat OpenShift dedicated documentation](https://access.redhat.com/documentation/openshift_dedicated/3/)