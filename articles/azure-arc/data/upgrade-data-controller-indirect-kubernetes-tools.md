---
title: Upgrade indirectly connected Azure Arc data controller using Kubernetes tools
description: Article describes how to upgrade an indirectly connected Azure Arc data controller using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 12/09/2021
ms.topic: how-to
---

# Upgrade an indirectly connected Azure Arc data controller using Kubernetes tools

This article explains how to upgrade an indirectly connected Azure Arc-enabled data controller with Kubernetes tools.

During a data controller upgrade, portions of the data control plane such as Custom Resource Definitions (CRDs) and containers may be upgraded. An upgrade of the data controller will not cause downtime for the data services (SQL Managed Instance or PostgreSQL Hyperscale server).

In this article, you will apply a .yaml file to:

1. Specify a service account.
1. Set the cluster roles.
1. Set the cluster role bindings.
1. Set the job.

> [!NOTE]
> Some of the data services tiers and modes are generally available and some are in preview.
> If you install GA and preview services on the same data controller, you can't upgrade in place.
> To upgrade, delete all non-GA database instances. You can find the list of generally available 
> and preview services in the [Release Notes](./release-notes.md).

## Prerequisites

Prior to beginning the upgrade of the Azure Arc data controller, you will need:

- To connect and authenticate to a Kubernetes cluster
- An existing Kubernetes context selected

You need an indirectly connected data controller with the `imageTag: v1.0.0_2021-07-30` or greater.

### Install tools

To upgrade the Azure Arc data controller using Kubernetes tools you need to have the Kubernetes tools installed.

The examples in this article use kubectl, but similar approaches could be used with other Kubernetes tools
such as the Kubernetes dashboard, oc, or helm if you are familiar with those tools and Kubernetes yaml/json.

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

## Create or download .yaml file

To upgrade the data controller, you will apply a yaml file to the Kubernetes cluster. The example file for the upgrade is available in GitHub at <https://github.com/microsoft/azure_arc/tree/main/arc_data_services/upgrade/yaml>.

You can download the file - and other Azure Arc related demonstration files - by cloning the repository. For example:

```azurecli
git clone https://github.com/microsoft/azure-arc
```

For more information, see [Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) in the GitHub docs.

The following steps use files from the repository.

In the yaml file, you will replace ```{{namespace}}``` with your namespace.

### Specify the service account

The upgrade requires an elevated service account for the upgrade job.

To specify the service account:

1. Describe the service account in a .yaml file. The following example sets a name for `ServiceAccount` as `sa-arc-upgrade-worker`:

   :::code language="yaml" source="~/azure_arc_sample/arc_data_services/upgrade/yaml/upgrade-indirect-k8s.yaml" range="2-4":::

1. Edit the file as needed.

### Set the cluster roles

A cluster role (`ClusterRole`) grants the service account permission to perform the upgrade. 

1. Describe the cluster role and rules in a .yaml file. The following example defines a cluster role for `arc:cr-upgrade-worker` and allows all API groups, resources, and verbs. 

   :::code language="yaml" source="~/azure_arc_sample/arc_data_services/upgrade/yaml/upgrade-indirect-k8s.yaml" range="7-9":::

1. Edit the file as needed. 

### Set the cluster role binding

A cluster role binding (`ClusterRoleBinding`) links the service account and the cluster role.

1. Describe the cluster role binding in a .yaml file. The following example describes a cluster role binding for the service account.

   :::code language="yaml" source="~/azure_arc_sample/arc_data_services/upgrade/yaml/upgrade-indirect-k8s.yaml" range="20-21":::

1. Edit the file as needed. 

### Specify the job

A job creates a pod to execute the upgrade.

1. Describe the job in a .yaml file. The following example creates a job called `arc-bootstrapper-upgrade-job`.

   :::code language="yaml" source="~/azure_arc_sample/arc_data_services/upgrade/yaml/upgrade-indirect-k8s.yaml" range="31-48":::

1. Edit the file for your environment.

### Apply the resources

Run the following kubectl command to apply the resources to your cluster.

``` bash
kubectl apply -n <namespace> -f upgrade-indirect-k8s.yaml
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

## Troubleshoot upgrade problems

If you encounter any troubles with upgrading, see the [troubleshooting guide](troubleshoot-guide.md).