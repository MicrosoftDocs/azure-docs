---
title: Azure Functions on Kubernetes with KEDA
description: Understand how to run Azure Functions in Kubernetes in the cloud or on-premises using KEDA, Kubernetes-based event driven autoscaling.
author: eamonoreilly
ms.topic: conceptual
ms.custom: build-2023, build-2024
ms.date: 08/19/2024
ms.author: eamono
---

# Azure Functions on Kubernetes with KEDA

The Azure Functions runtime provides flexibility in hosting where and how you want. [KEDA](https://keda.sh) (Kubernetes-based Event Driven Autoscaling) pairs seamlessly with the Azure Functions runtime and tooling to provide event driven scale in Kubernetes.

> [!IMPORTANT]
> Running your containerized function apps on Kubernetes, either by using KEDA or by direct deployment, is an open-source effort that you can use free of cost. Best-effort support is provided by contributors and from the community by using [GitHub issues in the Azure Functions repository](https://github.com/Azure/Azure-Functions/issues). Please use these issues to report bugs and raise feature requests.
> 
> For fully-supported Kubernetes deployments, instead consider [Azure Container Apps hosting of Azure Functions](functions-container-apps-hosting.md).

## How Kubernetes-based functions work

The Azure Functions service is made up of two key components: a runtime and a scale controller. The Functions runtime runs and executes your code. The runtime includes logic on how to trigger, log, and manage function executions. The Azure Functions runtime can run *anywhere*. The other component is a scale controller. The scale controller monitors the rate of events that are targeting your function, and proactively scales the number of instances running your app. To learn more, see [Azure Functions scale and hosting](functions-scale.md).

Kubernetes-based Functions provides the Functions runtime in a [Docker container](functions-create-container-registry.md) with event-driven scaling through KEDA. KEDA can scale in to zero instances (when no events are occurring) and out to *n* instances. It does this by exposing custom metrics for the Kubernetes autoscaler (Horizontal Pod Autoscaler). Using Functions containers with KEDA makes it possible to replicate serverless function capabilities in any Kubernetes cluster. These functions can also be deployed using [Azure Kubernetes Services (AKS) virtual nodes](/azure/aks/virtual-nodes-cli) feature for serverless infrastructure.

## Managing KEDA and functions in Kubernetes

To run Functions on your Kubernetes cluster, you must install the KEDA component. You can install this component in one of the following ways:

+ Azure Functions Core Tools: using the [`func kubernetes install` command](functions-core-tools-reference.md#func-kubernetes-install).

+ Helm: there are various ways to install KEDA in any Kubernetes cluster, including Helm. Deployment options are documented on the [KEDA site](https://keda.sh/docs/deploy/).

## Deploying a function app to Kubernetes

You can deploy any function app to a Kubernetes cluster running KEDA. Since your functions run in a Docker container, your project needs a Dockerfile. You can create a Dockerfile by using the [`--docker` option][func init] when calling `func init` to create the project. If you forgot to create your Dockerfile, you can always call `func init` again from the root of your code project.

1. (Optional) If you need to create your Dockerfile, use the [`func init`][func init] command with the `--docker-only` option: 

    ```command
    func init --docker-only
    ```

    To learn more about Dockerfile generation, see the [`func init`][func init] reference. 

1. Use the [`func kubernetes deploy`](functions-core-tools-reference.md#func-kubernetes-deploy) command to build your image and deploy your containerized function app to Kubernetes:

    ```command
    func kubernetes deploy --name <name-of-function-deployment> --registry <container-registry-username>
    ```

    In this example, replace `<name-of-function-deployment>` with the name of your function app. The deploy command performs these tasks:

    + The Dockerfile created earlier is used to build a local image for your containerized function app.
    + The local image is tagged and pushed to the container registry where the user is logged in.
    + A manifest is created and applied to the cluster that defines a Kubernetes `Deployment` resource, a `ScaledObject` resource, and `Secrets`, which includes environment variables imported from your `local.settings.json` file.

### Deploying a function app from a private registry

The previous deployment steps work for private registries as well. If you're pulling your container image from a private registry, include the `--pull-secret` flag that references the Kubernetes secret holding the private registry credentials when running `func kubernetes deploy`.

## Removing a function app from Kubernetes

After deploying you can remove a function by removing the associated `Deployment`, `ScaledObject`, an `Secrets` created.

```command
kubectl delete deploy <name-of-function-deployment>
kubectl delete ScaledObject <name-of-function-deployment>
kubectl delete secret <name-of-function-deployment>
```

## Uninstalling KEDA from Kubernetes

You can remove KEDA from your cluster in one of the following ways:

+ Azure Functions Core Tools: using the [`func kubernetes remove` command](functions-core-tools-reference.md#func-kubernetes-remove).

+ Helm: see the uninstall steps [on the KEDA site](https://keda.sh/docs/deploy/).

## Supported triggers in KEDA

KEDA has support for the following Azure Function triggers:

* [Azure Storage Queues](functions-bindings-storage-queue.md)
* [Azure Service Bus](functions-bindings-service-bus.md)
* [Azure Event / IoT Hubs](functions-bindings-event-hubs.md)
* [Apache Kafka](https://github.com/azure/azure-functions-kafka-extension)
* [RabbitMQ Queue](https://github.com/azure/azure-functions-rabbitmq-extension)

### HTTP Trigger support

You can use Azure Functions that expose HTTP triggers, but KEDA doesn't directly manage them. You can use the KEDA prometheus trigger to [scale HTTP Azure Functions from one to `n` instances](https://dev.to/anirudhgarg_99/scale-up-and-down-a-http-triggered-function-app-in-kubernetes-using-keda-4m42).

## Next Steps
For more information, see the following resources:

* [Working with containers and Azure Functions](./functions-how-to-custom-container.md) 
* [Code and test Azure Functions locally](functions-develop-local.md)
* [How the Azure Function Consumption plan works](functions-scale.md)

[func init]: functions-core-tools-reference.md#func-init
