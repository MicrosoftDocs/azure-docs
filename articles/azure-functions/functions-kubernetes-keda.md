---
title: Azure Functions on Kubernetes with KEDA
description: Understand how to run Azure Functions in Kubernetes in the cloud or on-premises using KEDA, Kubernetes-based event driven autoscaling.
author: jeffhollan

ms.topic: conceptual
ms.date: 11/18/2019
ms.author: jehollan
---

# Azure Functions on Kubernetes with KEDA

The Azure Functions runtime provides flexibility in hosting where and how you want.  [KEDA](https://keda.sh) (Kubernetes-based Event Driven Autoscaling) pairs seamlessly with the Azure Functions runtime and tooling to provide event driven scale in Kubernetes.

## How Kubernetes-based functions work

The Azure Functions service is made up of two key components: a runtime and a scale controller.  The Functions runtime runs and executes your code.  The runtime includes logic on how to trigger, log, and manage function executions.  The Azure Functions runtime can run *anywhere*.  The other component is a scale controller.  The scale controller monitors the rate of events that are targeting your function, and proactively scales the number of instances running your app.  To learn more, see [Azure Functions scale and hosting](functions-scale.md).

Kubernetes-based Functions provides the Functions runtime in a [Docker container](functions-create-function-linux-custom-image.md) with event-driven scaling through KEDA.  KEDA can scale in to 0 instances (when no events are occurring) and out to *n* instances. It does this by exposing custom metrics for the Kubernetes autoscaler (Horizontal Pod Autoscaler).  Using Functions containers with KEDA makes it possible to replicate serverless function capabilities in any Kubernetes cluster.  These functions can also be deployed using [Azure Kubernetes Services (AKS) virtual nodes](../aks/virtual-nodes-cli.md) feature for serverless infrastructure.

## Managing KEDA and functions in Kubernetes

To run Functions on your Kubernetes cluster, you must install the KEDA component. You can install this component using [Azure Functions Core Tools](functions-run-local.md).

### Installing with Helm

There are various ways to install KEDA in any Kubernetes cluster including Helm.  Deployment options are documented on the [KEDA site](https://keda.sh/docs/1.4/deploy/).

## Deploying a function app to Kubernetes

You can deploy any function app to a Kubernetes cluster running KEDA.  Since your functions run in a Docker container, your project needs a `Dockerfile`.  If it doesn't already have one, you can add a Dockerfile by running the following command at the root of your Functions project:

```cli
func init --docker-only
```

To build an image and deploy your functions to Kubernetes, run the following command:

> [!NOTE]
> The Core Tools will leverage the docker CLI to build and publish the image. Be sure to have docker installed already and connected to your account with `docker login`.

```cli
func kubernetes deploy --name <name-of-function-deployment> --registry <container-registry-username>
```

> Replace `<name-of-function-deployment>` with the name of your function app.

This creates a Kubernetes `Deployment` resource, a `ScaledObject` resource, and `Secrets`, which includes environment variables imported from your `local.settings.json` file.

### Deploying a function app from a private registry

The above flow works for private registries as well.  If you are pulling your container image from a private registry, include the `--pull-secret` flag that references the Kubernetes secret holding the private registry credentials when running `func kubernetes deploy`.

## Removing a function app from Kubernetes

After deploying you can remove a function by removing the associated `Deployment`, `ScaledObject`, an `Secrets` created.

```cli
kubectl delete deploy <name-of-function-deployment>
kubectl delete ScaledObject <name-of-function-deployment>
kubectl delete secret <name-of-function-deployment>
```

## Uninstalling KEDA from Kubernetes

Steps to uninstall KEDA are documented [on the KEDA site](https://keda.sh/docs/1.4/deploy/).

## Supported triggers in KEDA

KEDA has support for the following Azure Function triggers:

* [Azure Storage Queues](functions-bindings-storage-queue.md)
* [Azure Service Bus Queues](functions-bindings-service-bus.md)
* [Azure Event / IoT Hubs](functions-bindings-event-hubs.md)
* [Apache Kafka](https://github.com/azure/azure-functions-kafka-extension)
* [RabbitMQ Queue](https://github.com/azure/azure-functions-rabbitmq-extension)

### HTTP Trigger support

You can use Azure Functions that expose HTTP triggers, but KEDA doesn't directly manage them.  You can leverage the KEDA prometheus trigger to [scale HTTP Azure Functions from 1 to *n* instances](https://dev.to/anirudhgarg_99/scale-up-and-down-a-http-triggered-function-app-in-kubernetes-using-keda-4m42).

## Next Steps
For more information, see the following resources:

* [Create a function using a custom image](functions-create-function-linux-custom-image.md)
* [Code and test Azure Functions locally](functions-develop-local.md)
* [How the Azure Function Consumption plan works](functions-scale.md)