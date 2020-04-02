---
title: "Configure your Azure Dev Spaces cluster to use Helm 3 (preview)"
services: azure-dev-spaces
ms.date: 02/28/2020
ms.topic: "conceptual"
description: "Learn how to configure your Dev Spaces cluster to use Helm 3"
keywords: "Azure Dev Spaces, Dev Spaces, Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
---

# Configure your Azure Dev Spaces cluster to use Helm 3 (preview)

Azure Dev Spaces uses Helm 2 by default to install user services in dev spaces on your AKS cluster. You can enable Azure Dev Spaces to use Helm 3 instead of Helm 2 installing user services in dev spaces. Regardless of the version of Helm Azure Dev Spaces uses to install user services, you can continue to use the Helm 2 or 3 client to manage your own releases on the same cluster.

When you enable Helm 3, Azure Dev Spaces behaves differently when installing user services in dev spaces in the following ways:

* Tiller is no longer deployed to your cluster in the *azds* namespace.
* Helm stores release information in the namespace where a service is installed instead of the *azds* namespace.
* Helm 3 release information remains in the namespace where a service is installed after a controller is deleted.
* You can directly interact with any release managed by Azure Dev Spaces on your cluster using the Helm 3 client.

In this guide, you will learn how to enable Helm 3 for Azure Dev Spaces to install user services in dev spaces.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

## Before you begin

### Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed][azure-cli].

### Register the Helm3Preview preview feature

To enable Azure Dev Spaces to use Helm 3 for installing user services in dev spaces, first enable the *Helm3Preview* feature flag on your subscription using the *az feature register* command:

> [!WARNING]
> Any AKS cluster you enable Azure Dev Spaces on with the *Helm3Preview* feature flag will use this preview experience. To continue to enable fully-supported Azure Dev Spaces on AKS clusters, don't enable preview features on production subscriptions. Use a separate test or development Azure subscription for testing preview features.

```azure-cli
az feature register --namespace Microsoft.DevSpaces --name Helm3Preview
```

It takes a few minutes for the registration to complete. Check on the registration status using the *az feature show* command:

```azure-cli
az feature show --namespace Microsoft.DevSpaces --name Helm3Preview
```

When the *state* is *Registered*, refresh the registration of *Microsoft.DevSpaces* using *az provider register*:

```azure-cli
az provider register --namespace Microsoft.DevSpaces
```

### Limitations

The following limitations apply while this feature is in preview:

* You can't use this feature on AKS clusters with existing workloads. You must create a new AKS cluster.

## Create your cluster

Create a new AKS cluster in a region that has this preview feature. The below commands create a resource group named *MyResourceGroup* and a new AKS cluster named *MyAKS*:

```azure-cli
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus --generate-ssh-keys
```

## Enable Azure Dev Spaces

Use the *use-dev-spaces* command to enable Dev Spaces on your AKS cluster and follow the prompts. The below command enables Dev Spaces on the *MyAKS* cluster in the *MyResourceGroup* group and creates a default dev space.

```cmd
az aks use-dev-spaces -g MyResourceGroup -n MyAKS
```

## Verify Dev Spaces is running Helm 3

Verify the tiller is not running by listing the deployments in the *azds* namespace:

```cmd
kubectl get deployment -n azds
```

Confirm *tiller-deploy* is not running in the azds namespace. For example:

```console
$ kubectl get deployments -n azds
NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
azds-webhook-deployment   2/2     2            2           39m
traefik                   1/1     1            1           39m
```

## Next steps

Learn how Azure Dev Spaces helps you develop more complex applications across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces.

> [!div class="nextstepaction"]
> [Team development in Azure Dev Spaces][team-quickstart]


[azure-cli]: /cli/azure/install-azure-cli?view=azure-cli-latest
[team-quickstart]: ../quickstart-team-development.md