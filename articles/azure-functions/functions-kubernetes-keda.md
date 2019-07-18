---
title: Azure Functions on Kubernetes with KEDA
description: Understand how to run Azure Functions in Kubernetes in the cloud or on-premises using KEDA, Kubernetes-based event driven autoscaling.
services: functions
documentationcenter: na
author: jeffhollan
manager: jeconnoc
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture, kubernetes

ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: jehollan
---

# Azure Functions on Kubernetes with KEDA

The Azure Functions runtime provides flexibility in hosting where and how you want.  [KEDA](https://github.com/kedacore/kore) (Kubernetes-based Event Driven Autoscaling) pairs seamlessly with the Azure Functions runtime and tooling to provide event driven scale in Kubernetes.

## How Kubernetes-based functions work

The Azure Functions service is made up of two key components: a runtime and a scale controller.  The Functions runtime runs and executes your code.  The runtime includes logic on how to trigger, log, and manage function executions.  The other component is a scale controller.  The scale controller monitors the rate of events that are targeting your function, and proactively scales the number of instances running your app.  To learn more, see [Azure Functions scale and hosting](functions-scale.md).

Kubernetes-based Functions provides the Functions runtime in a [Docker container](functions-create-function-linux-custom-image.md) with event-driven scaling through KEDA.  KEDA can scale down to 0 instances (when no events are occurring) and up to *n* instances. It does this by exposing custom metrics for the Kubernetes autoscaler (Horizontal Pod Autoscaler).  Using Functions containers with KEDA makes it possible to replicate serverless function capabilities in any Kubernetes cluster.  These functions can also be deployed using [Azure Kubernetes Services (AKS) virtual nodes](../aks/virtual-nodes-cli.md) feature for serverless infrastructure.

## Managing KEDA and functions in Kubernetes

To run Functions on your Kubernetes cluster, you must install the KEDA component. You can install this component using [Azure Functions Core Tools](functions-run-local.md).

### Installing with the Azure Functions Core Tools

By default, Core Tools installs both KEDA and Osiris components, which support event-driven and HTTP scaling, respectively.  The installation uses `kubectl` running in the current context.

Install KEDA in your cluster by running the following install command:

```cli
func kubernetes install --namespace keda
```

## Deploying a function app to Kubernetes

You can deploy any function app to a Kubernetes cluster running KEDA.  Since your functions run in a Docker container, your project needs a `Dockerfile`.  If it doesn't already have one, you can add a Dockerfile by running the following command at the root of your Functions project:

```cli
func init --docker-only
```

To build an image and deploy your functions to Kubernetes, run the following command:

```cli
func kubernetes deploy --name <name-of-function-deployment> --registry <container-registry-username>
```

> Replace `<name-of-function-deployment>` with the name of your function app.

This creates a Kubernetes `Deployment` resource, a `ScaledObject` resource, and `Secrets`, which includes environment variables imported from your `local.settings.json` file.

## Removing a function app from Kubernetes

After deploying you can remove a function by removing the associated `Deployment`, `ScaledObject`, an `Secrets` created.

```cli
kubectl delete deploy <name-of-function-deployment>
kubectl delete ScaledObject <name-of-function-deployment>
kubectl delete secret <name-of-function-deployment>
```

## Uninstalling KEDA from Kubernetes

You can run the following core tools command to remove KEDA from a Kubernetes cluster:

```cli
func kubernetes remove --namespace keda
```

## Supported triggers in KEDA

KEDA is currently in beta with support for the following Azure Function triggers:

* [Azure Storage Queues](functions-bindings-storage-queue.md)
* [Azure Service Bus Queues](functions-bindings-service-bus.md)
* [HTTP](functions-bindings-http-webhook.md)
* [Apache Kafka](https://github.com/azure/azure-functions-kafka-extension)

## Next Steps
For more information, see the following resources:

* [Create a function using a custom image](functions-create-function-linux-custom-image.md)
* [Code and test Azure Functions locally](functions-develop-local.md)
* [How the Azure Function consumption plan works](functions-scale.md)