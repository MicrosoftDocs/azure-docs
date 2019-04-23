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
ms.topic: reference
ms.date: 05/04/2019
ms.author: jehollan
---

# Azure Functions on Kubernetes with KEDA

The Azure Functions runtime provides flexibility in hosting where and how you want.  [KEDA](https://github.com/kedacore/kore) provides Kubernetes-based event driven autoscaling, and pairs seamlessly with the Azure Functions runtime and tooling to provide event driven scale in Kubernetes.

## How Kubernetes-based functions work

The Azure Functions service is made up of two key components: the Azure Functions runtime and the Azure Functions scale controller.  The runtime runs and executes your code.  The runtime includes logic on how to trigger, log, and manage the function executions.  The other component is the scale controller.  The scale controller monitors the rate of events that are targeting your function, and pro-actively scales the number of instances running your app.  You can learn more about how the Azure Functions service behaves in [Azure Functions scale and hosting](functions-scale.md).

Kubernetes-based functions allow you to bring both the Azure Functions runtime in a [Docker container](functions-create-function-linux-custom-image.md), and the event driven scaling through KEDA.  KEDA offers both scaling down to 0 on no events, and scaling to *n* instances by exposing custom metrics for the Kubernetes autoscaler (Horizontal Pod Autoscaler).  Both of these components replicate serverless function capabilities in any Kubernetes cluster.  These functions can also be deployed in conjunction with [Azure Kubernetes Services (AKS) virtual nodes](../aks/virtual-nodes-cli.md) feature for serverless infrastructure.

## Managing KEDA and functions in Kubernetes

Your Kubernetes cluster requires a one-time installation of the KEDA component to scale based on the number of events targeting your functions.

### Installing with the Azure Functions Core Tools

Using the [Azure Functions Core Tools](functions-run-local.md)] you can install KEDA by running the install command.  By default, the core tools will install both KEDA and Osiris components for event-driven and HTTP scaling respectively.  It will use the `kubectl` current context to install.

```cli
func kubernetes install --namespace keda
```

## Deploying a function to Kubernetes

You can deploy any function to a Kubernetes cluster running KEDA.  Since your functions will be running in a Docker container, your project will need a `Dockerfile`.  If your project doesn't already have a `Dockerfile`, you can add one by running the following command at the root of your project:

```cli
func init --docker-only
```

To build an image and deploy your function to Kubernetes, run the following core tools command:

```cli
func kubernetes deploy --name <name-of-function-deployment> --registry <container-registry-username>
```

This will create a Kubernetes `Deployment` resource, a `ScaledObject` resource, and `Secrets` which include environment variables from `local.settings.json`.

## Removing a function from Kubernetes

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

KEDA is currently in beta with support for the following triggers:

* Azure Queues
* Azure Service Bus Queues
* HTTP
* Apache Kafka ([preview Azure Function trigger](https://github.com/azure/azure-functions-kafka-extension))
* RabbitMQ (no Azure Function trigger)