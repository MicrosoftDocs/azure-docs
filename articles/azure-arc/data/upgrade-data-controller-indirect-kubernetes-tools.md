---
title: Upgrade indirectly connected data controller for Azure Arc using Kubernetes tools
description: Article describes how to upgrade an indirectly connected data controller for Azure Arc using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/07/2022
ms.topic: how-to
---

# Upgrade an indirectly connected Azure Arc-enabled data controller using Kubernetes tools

This article explains how to upgrade an indirectly connected Azure Arc-enabled data controller with Kubernetes tools.

During a data controller upgrade, portions of the data control plane such as Custom Resource Definitions (CRDs) and containers may be upgraded. An upgrade of the data controller will not cause downtime for the data services (SQL Managed Instance or PostgreSQL server).

In this article, you'll apply a .yaml file to:

1. Create the service account for running upgrade.
1. Upgrade the bootstrapper.
1. Upgrade the data controller.

> [!NOTE]
> Some of the data services tiers and modes are generally available and some are in preview.
> If you install GA and preview services on the same data controller, you can't upgrade in place.
> To upgrade, delete all non-GA database instances. You can find the list of generally available 
> and preview services in the [Release Notes](./release-notes.md).

## Prerequisites

Prior to beginning the upgrade of the data controller, you'll need:

- To connect and authenticate to a Kubernetes cluster
- An existing Kubernetes context selected

You need an indirectly connected data controller with the `imageTag: v1.0.0_2021-07-30` or greater.

## Install tools

To upgrade the data controller using Kubernetes tools, you need to have the Kubernetes tools installed.

The examples in this article use `kubectl`, but similar approaches could be used with other Kubernetes tools
such as the Kubernetes dashboard, `oc`, or helm if you're familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/)

## View available images and chose a version

Pull the list of available images for the data controller with the following command:

```azurecli
az arcdata dc list-upgrades --k8s-namespace <namespace>
 ```

The command above returns output like the following example:

```output
Found 2 valid versions.  The current datacontroller version is <current-version>.
<available-version>
...
```

## Upgrade data controller

This section shows how to upgrade an indirectly connected data controller.

> [!NOTE]
> Some of the data services tiers and modes are generally available and some are in preview.
> If you install GA and preview services on the same data controller, you can't upgrade in place.
> To upgrade, delete all non-GA database instances. You can find the list of generally available 
> and preview services in the [Release Notes](./release-notes.md).

For supported upgrade paths, see [Upgrade Azure Arc-enabled data services](upgrade-overview.md).


### Upgrade

You'll need to connect and authenticate to a Kubernetes cluster and have an existing Kubernetes context selected prior to beginning the upgrade of the data controller.


### Create the service account for running upgrade

   > [!IMPORTANT]
   > Requires Kubernetes permissions for creating service account, role binding, cluster role, cluster role binding, and all the RBAC permissions being granted to the service account.

Save a copy of [arcdata-deployer.yaml](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/arcdata-deployer.yaml), and replace the placeholder `{{NAMESPACE}}` in the file with the namespace of the data controller, for example: `arc`. Run the following command to create the deployer service account with the edited file.

```console
kubectl apply --namespace arc -f arcdata-deployer.yaml
```


### Upgrade the bootstrapper

The following command creates a job for upgrading the bootstrapper and related Kubernetes objects.

   > [!IMPORTANT]
   > The yaml file in the following command defaults to mcr.microsoft.com/arcdata. Please save a copy of the yaml file and update it to a use a different registry/repository if necessary.

```console
kubectl apply --namespace arc -f https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/upgrade/yaml/bootstrapper-upgrade-job.yaml
```

### Upgrade the data controller

The following command patches the image tag to upgrade the data controller.

```console
kubectl apply --namespace arc -f https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/upgrade/yaml/data-controller-upgrade.yaml
```


## Monitor the upgrade status

You can monitor the progress of the upgrade with kubectl.

### kubectl

```console
kubectl get datacontrollers --namespace <namespace> -w
kubectl get monitors --namespace <namespace> -w
```

The upgrade is a two-part process. First the controller is upgraded, then the monitoring stack is upgraded. During the upgrade, use ```kubectl get monitors -n <namespace> -w``` to view the status. The output will be:

```output
NAME           STATUS     AGE
monitorstack   Updating   36m
monitorstack   Updating   36m
monitorstack   Updating   39m
monitorstack   Updating   39m
monitorstack   Updating   41m
monitorstack   Ready      41m
```

[!INCLUDE [upgrade-rollback](includes/upgrade-rollback.md)]
