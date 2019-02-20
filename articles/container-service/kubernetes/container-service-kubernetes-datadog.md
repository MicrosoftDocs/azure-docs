---
title: (DEPRECATED) Monitor Azure Kubernetes cluster with Datadog
description: Monitoring Kubernetes cluster in Azure Container Service using Datadog
services: container-service
author: bburns
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 12/09/2016
ms.author: bburns
ms.custom: mvc
---

# (DEPRECATED) Monitor an Azure Container Service cluster with DataDog

[!INCLUDE [ACS deprecation](../../../includes/container-service-kubernetes-deprecation.md)]

## Prerequisites
This walkthrough assumes that you have [created a Kubernetes cluster using Azure Container Service](container-service-kubernetes-walkthrough.md).

It also assumes that you have the `az` Azure cli and `kubectl` tools installed.

You can test if you have the `az` tool installed by running:

```console
$ az --version
```

If you don't have the `az` tool installed, there are instructions [here](https://github.com/azure/azure-cli#installation).

You can test if you have the `kubectl` tool installed by running:

```console
$ kubectl version
```

If you don't have `kubectl` installed, you can run:

```console
$ az acs kubernetes install-cli
```

## DataDog
Datadog is a monitoring service that gathers monitoring data from your containers within your Azure Container Service cluster. Datadog has a Docker Integration Dashboard where you can see specific metrics within your containers. Metrics gathered from your containers are organized by CPU, Memory, Network and I/O. Datadog splits metrics into containers and images.

You first need to [create an account](https://www.datadoghq.com/lpg/)

## Installing the Datadog Agent with a DaemonSet
DaemonSets are used by Kubernetes to run a single instance of a container on each host in the cluster.
They're perfect for running monitoring agents.

Once you have logged into Datadog, you can follow the [Datadog instructions](https://app.datadoghq.com/account/settings#agent/kubernetes)
to install Datadog agents on your cluster using a DaemonSet.

## Conclusion
That's it! Once the agents are up and running you should see data in the console in a few minutes. You can visit
the integrated [kubernetes dashboard](https://app.datadoghq.com/screen/integration/kubernetes) to see a
summary of your cluster.
