---
title: Upgrade indirectly connected Azure Arc data controller using the CLI
description: Article describes how to upgrade an indirectly connected Azure Arc data controller using the CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/07/2022
ms.topic: how-to
---

# Upgrade an indirectly connected Azure Arc data controller using the CLI

This article describes how to upgrade an indirectly connected Azure Arc-enabled data controller using the Azure CLI (`az`).

During a data controller upgrade, portions of the data control plane such as Custom Resource Definitions (CRDs) and containers may be upgraded. An upgrade of the data controller won't cause downtime for the data services (SQL Managed Instance or PostgreSQL server).

## Prerequisites

You'll need an indirectly connected data controller with the imageTag v1.0.0_2021-07-30 or later.

To check the version, run:

```console
kubectl get datacontrollers -n <namespace> -o custom-columns=BUILD:.spec.docker.imageTag
```

## Install tools

Before you can proceed with the tasks in this article, you need to install:

- The [Azure CLI (`az`)](/cli/azure/install-azure-cli)
- The [`arcdata` extension for Azure CLI](install-arcdata-extension.md)

[!INCLUDE [azure-arc-angle-bracket-example](../../../includes/azure-arc-angle-bracket-example.md)]

The `arcdata` extension version and the image version are related. Check that you have the correct `arcdata` extension version that corresponds to the image version you want to upgrade to in the [Version log](version-log.md).

## View available images and chose a version

Pull the list of available images for the data controller with the following command:

   ```azurecli
   az arcdata dc list-upgrades --k8s-namespace <namespace>
   ```

The command above returns output like the following example:

```output
Found 2 valid versions.  The current datacontroller version is v1.0.0_2021-07-30.
v1.1.0_2021-11-02
v1.0.0_2021-07-30
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

You'll need to connect and authenticate to a Kubernetes cluster and have an existing Kubernetes context selected prior to beginning the upgrade of the Azure Arc data controller.

You can perform a dry run first. The dry run validates the registry exists, the version schema, and the private repository authorization token (if used). To perform a dry run, use the `--dry-run` parameter in the `az arcdata dc upgrade` command. For example:

```azurecli
az arcdata dc upgrade --desired-version <version> --k8s-namespace <namespace> --dry-run --use-k8s
```

The output for the preceding command is:

```output
Preparing to upgrade dc arcdc in namespace arc to version <version-tag>.
Preparing to upgrade dc arcdc in namespace arc to version <version-tag>.
****Dry Run****
Arcdata Control Plane would be upgraded to: <version-tag>
```

To upgrade the data controller, run the `az arcdata dc upgrade` command, specifying the image tag with `--desired-version`.

```azurecli
az arcdata dc upgrade --name <data controller name> --desired-version <image tag> --k8s-namespace <namespace> --use-k8s
```

Example:

```azurecli
az arcdata dc upgrade --name arcdc --desired-version v1.7.0_2022-05-24 --k8s-namespace arc --use-k8s
```

The output for the preceding command shows the status of the steps:

```output
Preparing to upgrade dc arcdc in namespace arc to version <version-tag>.
Preparing to upgrade dc arcdc in namespace arc to version <version-tag>.
Creating service account: arc:cr-upgrade-worker
Creating cluster role: arc:cr-upgrade-worker
Creating cluster role binding: arc:crb-upgrade-worker
Cluster role binding: arc:crb-upgrade-worker created successfully.
Cluster role: arc:cr-upgrade-worker created successfully.
Service account arc:cr-upgrade-worker has been created successfully.
Creating privileged job arc-elevated-bootstrapper-job
```

## Monitor the upgrade status

The upgrade is a two-part process. First the controller is upgraded, then the monitoring stack is upgraded. You can monitor the progress of the upgrade with CLI.

### CLI

```azurecli
 az arcdata dc status show --name <data controller name> --k8s-namespace <namespace> --use-k8s
```

When the upgrade is complete, the output will be:

```output
Ready
```

[!INCLUDE [upgrade-rollback](includes/upgrade-rollback.md)]
