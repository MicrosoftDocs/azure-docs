---
title: Tutorial - Scale an Azure Red Hat OpenShift cluster
description: Learn how to scale a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI
author: jimzim
ms.author: jzim
ms.topic: tutorial
ms.service: container-service
ms.date: 05/06/2019
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Scale an Azure Red Hat OpenShift cluster

This tutorial is part two of a series. You'll learn how to create a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI, scale it, then delete it to clean up resources.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Scale a Red Hat OpenShift cluster

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md)
> * Scale an Azure Red Hat OpenShift cluster
> * [Delete an Azure Red Hat OpenShift cluster](tutorial-delete-cluster.md)

## Prerequisites

Before you begin this tutorial:

* Create a cluster by following the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

## Step 1: Sign in to Azure

If you're running the Azure CLI locally, run `az login` to sign in to Azure.

```bash
az login
```

If you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

## Step 2: Scale the cluster with additional nodes

From a Bash terminal, set the variable CLUSTER_NAME to the name of your cluster:

```bash
CLUSTER_NAME=yourclustername
```

Now let's scale the cluster to five nodes using the Azure CLI:

```bash
az openshift scale --resource-group $CLUSTER_NAME --name $CLUSTER_NAME --compute-count 5
```

After a few minutes, `az openshift scale` will complete successfully and return a JSON document containing the scaled cluster details.

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Scale an Azure Red Hat OpenShift cluster

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Delete an Azure Red Hat OpenShift cluster](tutorial-delete-cluster.md)
