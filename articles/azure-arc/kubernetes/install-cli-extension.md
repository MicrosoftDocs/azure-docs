---
title: "Install CLI extensions for Arc"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Install CLI extensions for Arc"
keywords: "Kubernetes, Arc, Azure, K8s, containers"
---

# CLI extensions

Azure Arc enabled Kubernetes consists of two CLI extensions, one to register and unregister a Kubernetes cluster, and a second extension to apply, update, and remove configurations.

## Installing extensions

Required extension versions:

* **`connectedk8s`**: 0.1.3
* **`k8sconfiguration`**: 0.1.7


First, install the `connectedk8s` extension, which helps you connect Kubernetes clusters to Azure:

```console
az extension add --name connectedk8s
```

Next, install the `k8sconfiguration` extension:

```console
az extension add --name k8sconfiguration
```

If you experience any issues installing, please file an issue in this repository.

## Check the installed extensions

Ensure that the extensions are at the current recommended versions

```console
az extension list -o table
```

**Output:**

```console
ExtensionType    Name                     Version
---------------  -----------------------  ---------
whl              connectedk8s             0.1.3
whl              k8sconfiguration         0.1.7
```

## Update extensions

Run the following commands to update the extensions to the latest versions.

```console
az extension update --name connectedk8s
az extension update --name k8sconfiguration
```

## Next steps

* [Connect your first cluster](./connect-a-cluster.md)
