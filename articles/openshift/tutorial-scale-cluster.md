---
title: Tutorial - Scale a Microsoft Azure Red Hat OpenShift cluster on Azure
description: In this tutorial, learn how to scale a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI
services: container-service
author: tylermsft
ms.author: twhitney
manager: jeconnoc
ms.topic: tutorial
ms.service: openshift
ms.date: 05/06/2019
#Customer intent: As a developer, I want learn how to create a Microsoft Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Scale a Microsoft Azure Red Hat OpenShift cluster

This tutorial is part two of a series. You'll learn how to create a Microsoft Red Hat OpenShift cluster on Azure using the Azure CLI, scale it, and clean up unused Azure resources so that you are not charged for what you aren't using.

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

## Step 1: Log in to Azure

If you are running the Azure CLI locally, run `az login` to sign in to Azure.

```bash
az login
```

Whether you are running the Azure CLI locally, or are using the Azure cloud shell, if you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

## Step 2: Scale the cluster up to 5 compute nodes

Open a Bash terminal and set the variable CLUSTER_NAME to the name of your cluster:

```bash
CLUSTER_NAME=yourclustername
```

Then scale the cluster to five nodes:

```bash
az openshift scale --resource-group $CLUSTER_NAME --name $CLUSTER_NAME --compute-count 5
```

After a few minutes, `az openshift scale` will complete successfully and return a JSON document containing the scaled cluster details.

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Scale an Azure Red Hat OpenShift cluster

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Delete an Azure Red Hat OpenShift cluster](tutorial-delete-cluster.md)