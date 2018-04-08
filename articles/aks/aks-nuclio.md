---
title: Use Nuclio with Azure Container Service (AKS)
description: Deploy and use Nuclio with Azure Container Service (AKS)
services: container-service
author: ityer
manager: limorl

ms.service: container-service
ms.topic: article
ms.date: 08/04/2018
ms.author: ityer
---

# Getting Started with nuclio on Azure Container Service (AKS)

nuclio is a new "serverless" project, derived from iguazio's elastic data life-cycle management service for high-performance events and data processing. You can use nuclio as a standalone binary (for example, for IoT devices), package it within a Docker container, or integrate it with a container orchestrator like [Kubernetes](https://kubernetes.io).

nuclio is extremely fast. A single function instance can process hundreds of thousands of HTTP requests or data records per second. This is 10-100 times faster than some other frameworks. To learn more about how nuclio works, see the nuclio [architecture](https://github.com/nuclio/nuclio/blob/master/docs/concepts/architecture.md) documentation and watch the [technical CNCF nuclio presentation and demo](https://www.youtube.com/watch?v=xlOp9BR5xcs) (slides can be found [here](https://www.slideshare.net/iguazio/nuclio-overview-october-2017-80356865)).

Microsoft's [Azure Container Service (AKS)](https://azure.microsoft.com/services/container-service/) manages your hosted Kubernetes environment, making it quick and easy to deploy and manage containerized applications without container orchestration expertise. It also eliminates the burden of ongoing operations and maintenance by provisioning, upgrading, and scaling resources on demand, without taking your applications offline. For more information, see the [AKS documentation](https://docs.microsoft.com/azure/aks/).

Follow this step-by-step guide to set up a nuclio development environment that uses Azure Container Service (AKS).

## In this document

- [Prerequisites](#prerequisites)
- [Set up your AKS cluster](#set-up-your-aks-cluster)
- [Create a container registry using the Azure CLI](#create-a-container-registry-using-the-azure-cli)
- [Grant Kubernetes and nuclio access to the ACR](#grant-kubernetes-and-nuclio-access-to-the-acr)
- [Install nuclio](#install-nuclio)
- [Deploy a function with the nuclio playground](#deploy-a-function-with-the-nuclio-playground)
- [What's next](#whats-next)

## Prerequisites

Before setting up a nuclio ACR environment, ensure that the following prerequisites are met:

- You have an Azure account. If you don't have an account, you can [create one for free](https://azure.microsoft.com/free/).
- The Azure CLI, [`az`](https://docs.microsoft.com/cli/azure/), is installed. See the [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Set up your AKS cluster

**Create a resource group** by running the following `az` command (see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/group#az_group_create)):

```sh
az group create --name <resource-group-name> --location <location>
```

The following example creates a resource group named "my-nuclio-k8s-rg" that is located in western Europe (location "westeurope"):
```sh
az group create --name my-nuclio-k8s-rg --location westeurope
```

**Create a Kubernetes cluster** by running the following `az` command (see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/aks#az_aks_create)):

```sh
az aks create --resource-group <resource-group-name> --name <cluster-name> --node-count <number>
```

The following example creates a cluster named "myNuclioCluster" in the "my-nuclio-k8s-rg" resource group that was created in the example in the previous step:
```sh
az aks create --resource-group my-nuclio-k8s-rg --name myNuclioCluster --node-count 2 --generate-ssh-keys
```

After several minutes, the deployment completes and returns information about the AKS deployment, in JSON format.

**Install the kubectl CLI**, unless you already have it installed (in which case you can skip to the next step). The [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl-overview/) Kubernetes command-line application enables you to connect to the Kubernetes cluster from your client computer. To install `kubectl` locally, run the following `az` command (see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/aks#az_aks_install_cli)):

```sh
az aks install-cli
```

**Connect to the cluster with kubectl** by running the following `az` command, which configures the `kubectl` CLI to connect to your Kubernetes cluster (see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/aks#az_aks_get_credentials)):

```sh
az aks get-credentials --resource-group=<resource-group-name> --name=<cluster-name>
```

For example, the following command gets the credentials of a cluster named "myNuclioCluster" in the "my-nuclio-k8s-rg" resource group that was created in the examples in the previous steps:
```sh
az aks get-credentials --resource-group=my-nuclio-k8s-rg --name=myNuclioCluster
```

**Verify the connection to your cluster** by running the following `kubectl` command (see the [Kubernetes documentation](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get)):

```sh
kubectl get nodes
```

The output is expected to resemble the following example:
```sh
NAME                             STATUS    AGE       VERSION
k8s-myNuclioCluster-36346190-0   Ready     49m       v1.7.7
```

## Create a container registry using the Azure CLI

[Azure Container Registry (ACR)](https://azure.microsoft.com/services/container-registry/) is a managed Docker container registry service that's used for storing private Docker container images. For more information, see the [ACR documentation](https://docs.microsoft.com/azure/container-registry/).
Microsoft's [Create a container registry using the Azure CLI](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-azure-cli) guide explains how to use the `az` CLI to create a container registry.

The nuclio playground builds and pushes functions to a Docker registry. For the nuclio ACR setup, ACR serves as the Docker registry. Create an ACR instance by using the `az acr create` command (see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/acr#az_acr_create)):
> Note: The name of the registry (`<registry-name>`) must be unique.
```sh
az acr create --resource-group <resource-group-name> --name <registry-name> --sku Basic
```

The following example creates a registry named "mynuclioacr" in the "my-nuclio-k8s-rg" resource group:
```sh
az acr create --resource-group my-nuclio-k8s-rg --sku Basic --name mynuclioacr
```

## Grant Kubernetes and nuclio access to the ACR

To grant the AKS Kubernetes cluster and the nuclio playground access to the Azure Container Registry (ACR), as part of the [nuclio installation](#install-nuclio) you'll need to create a secret that stores the registry credentials. You can select between the following two methods for authenticating with the ACR:

- [Service principal](#service-principal)
- [Admin account](#admin-account)

> Note: The admin-account method has some security concerns, including no option to assign roles. Therefore, it's considered better practice to create a service principal.

### Service principal

You can assign a [service principal](https://docs.microsoft.com/azure/active-directory/develop/active-directory-application-objects) to your registry, and use it from your application or service to implement headless authentication.

You can use the following command to create a service principal:

```sh
az ad sp create-for-rbac --scopes /subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.ContainerRegistry/registries/<registry-name> --role Contributor --name <service-prinicpal-name>
```

For example, the following command creates a service principal for a container registry named "mynuclioacr" in the "my-nuclio-k8s-rg" resource group:
```sh
az ad sp create-for-rbac --role Contributor --scopes /subscriptions/$(az account show --query id -o tsv)/resourcegroups/my-nuclio-k8s-rg/providers/Microsoft.ContainerRegistry/registries/mynuclioacr --name mynuclioacr-sp
```

Make a note of the username (the service principal's `clientID`) and the password, as you'll need them when you install nuclio.

### Admin account

Each container registry includes an admin user account, which is disabled by default. You can enable the admin user and manage its credentials in the [Azure portal](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-portal#create-a-container-registry) or by using the Azure CLI.

## Install nuclio

At this stage you should have a functioning Kubernetes cluster, a Docker registry, and a working Kubernetes CLI (`kubectl`), and you can proceed to install the nuclio services on the cluster (i.e., deploy nuclio).

**Create a nuclio namespace** by running the following command:

> Note: All nuclio resources go into the "nuclio" namespace, and role-based access control (RBAC) is configured accordingly.

```sh
kubectl create namespace nuclio
```

**Create [a secret](#grant-kubernetes-and-nuclio-access-to-the-acr)** for authenticating Kubernetes and nuclio with the ACR:

```sh
read -s mypassword
<enter your password>

kubectl create secret docker-registry registry-credentials --namespace nuclio \
    --docker-username <username> \
    --docker-password $mypassword \
    --docker-server <registry-name>.azurecr.io \
    --docker-email ignored@nuclio.io

unset mypassword
```

**Create the RBAC roles** that are required for using nuclio:
> Note: You are encouraged to look at the [**nuclio-rbac.yaml**](https://github.com/nuclio/nuclio/blob/master/hack/k8s/resources/nuclio-rbac.yaml) file that's used in the following command before applying it, so that you don't get into the habit of blindly running things on your cluster (akin to running scripts off the internet as root).

```sh
kubectl apply -f https://raw.githubusercontent.com/nuclio/nuclio/master/hack/k8s/resources/nuclio-rbac.yaml
```

**Deploy nuclio to the cluster:** the following command deploys the nuclio controller and playground and the [Træfik](https://docs.traefik.io/) ingress controller, among other resources:

```sh
kubectl apply -f https://raw.githubusercontent.com/nuclio/nuclio/master/hack/aks/resources/nuclio.yaml
```

Use the command `kubectl get pods --namespace nuclio` to verify both the controller and playground are running.

**Forward the nuclio playground port:** the nuclio playground publishes a service at port 8070. To use the playground, you first need to forward this port to your local IP address:
```sh
kubectl port-forward -n nuclio $(kubectl get pods -n nuclio -l nuclio.io/app=playground -o jsonpath='{.items[0].metadata.name}') 8070:8070
```

**Forward the Træfik port:** to use Træfik as an ingress, you'll need to forward its port as well:
```sh
kubectl port-forward -n kube-system $(kubectl get pod -n kube-system -l k8s-app=traefik-ingress-lb -o jsonpath='{.items[0].metadata.name}') 8080:80
```

## Deploy a function with the nuclio playground

Browse to `http://localhost:8070` (after having forwarded this port as part of the nuclio installation). You should see the [nuclio playground](https://github.com/nuclio/nuclio/blob/master/README.md#playground) UI. Choose one of the built-in examples and click **Deploy**. The first build will populate the local Docker cache with base images and other files, so it might take a while, depending on your network. When the function deployment is completed, you can click **Invoke** to invoke the function with a body.

## What's next?

See the following resources to make the best of your new nuclio environment:

- [Deploying functions](https://github.com/nuclio/nuclio/blob/master/docs/tasks/deploying-functions.md)
- [Invoking functions by name with an ingress](https://github.com/nuclio/nuclio/blob/master/docs/concepts/k8s/function-ingress.md)
- [More function examples](https://github.com/nuclio/nuclio/blob/master/hack/examples/README.md)