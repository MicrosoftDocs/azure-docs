---
title: Develop on Azure Kubernetes Service (AKS) with Helm
description: Use Helm with AKS and Azure Container Registry to package and run application containers in a cluster.
services: container-service
author: zr-msft
ms.topic: article
ms.date: 04/20/2020
ms.author: zarhoads
---

# Quickstart: Develop on Azure Kubernetes Service (AKS) with Helm

[Helm][helm] is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers such as *APT* and *Yum*, Helm is used to manage Kubernetes charts, which are packages of preconfigured Kubernetes resources.

This article shows you how to use Helm to package and run an application on AKS. For more details on installing an existing application using Helm, see [Install existing applications with Helm in AKS][helm-existing].

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli?view=azure-cli-latest).
* Docker installed and configured. Docker provides packages that configure Docker on a [Mac][docker-for-mac], [Windows][docker-for-windows], or [Linux][docker-for-linux] system.
* [Helm v3 installed][helm-install].

## Create an Azure Container Registry
To use Helm to run your application in your AKS cluster, you need an Azure Container Registry to store your container images. The below example uses [az acr create][az-acr-create] to create an ACR named *MyHelmACR* in the *MyResourceGroup* resource group with the *Basic* SKU. You should provide your own unique registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

```azurecli
az group create --name MyResourceGroup --location eastus
az acr create --resource-group MyResourceGroup --name MyHelmACR --sku Basic
```

The output is similar to the following example. Make a note of the *loginServer* value for your ACR since it will be used in a later step. In the below example, *myhelmacr.azurecr.io* is the *loginServer* for *MyHelmACR*.

```console
{
  "adminUserEnabled": false,
  "creationDate": "2019-06-11T13:35:17.998425+00:00",
  "id": "/subscriptions/<ID>/resourceGroups/MyResourceGroup/providers/Microsoft.ContainerRegistry/registries/MyHelmACR",
  "location": "eastus",
  "loginServer": "myhelmacr.azurecr.io",
  "name": "MyHelmACR",
  "networkRuleSet": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "MyResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

To use the ACR instance, you must first sign in. Use the [az acr login][az-acr-login] command to sign in. The below example will sign in to an ACR named *MyHelmACR*.

```azurecli
az acr login --name MyHelmACR
```

The command returns a *Login Succeeded* message once completed.

## Create an Azure Kubernetes Service cluster

Create an AKS cluster. The below command creates an AKS cluster called MyAKS and attaches MyHelmACR.

```azurecli
az aks create -g MyResourceGroup -n MyAKS --location eastus  --attach-acr MyHelmACR --generate-ssh-keys
```

Your AKS cluster needs access to your ACR to pull the container images and run them. The above command also grants the *MyAKS* cluster access to your *MyHelmACR* ACR.

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [az aks install-cli][] command:

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials][] command. The following example gets credentials for the AKS cluster named *MyAKS* in the *MyResourceGroup*:

```azurecli
az aks get-credentials --resource-group MyResourceGroup --name MyAKS
```

## Download the sample application

This quickstart uses [an example Node.js application from the Azure Dev Spaces sample repository][example-nodejs]. Clone the application from GitHub and navigate to the `dev-spaces/samples/nodejs/getting-started/webfrontend` directory.

```console
git clone https://github.com/Azure/dev-spaces
cd dev-spaces/samples/nodejs/getting-started/webfrontend
```

## Create a Dockerfile

Create a new *Dockerfile* file using the following:

```dockerfile
FROM node:latest

WORKDIR /webfrontend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 80
CMD ["node","server.js"]
```

## Build and push the sample application to the ACR

Get the login server address using the [az acr list][az-acr-list] command and querying for the *loginServer*:

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Use Docker to build, tag, and push your sample application container to the ACR:

```console
docker build -t webfrontend:latest .
docker tag webfrontend <acrLoginServer>/webfrontend:v1
docker push <acrLoginServer>/webfrontend:v1
```

## Create your Helm chart

Generate your Helm chart using the `helm create` command.

```console
helm create webfrontend
```

Make the following updates to *webfrontend/values.yaml*:

* Change `image.repository` to `<acrLoginServer>/webfrontend`
* Change `service.type` to `LoadBalancer`

For example:

```yml
# Default values for webfrontend.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1

image:
  repository: <acrLoginServer>/webfrontend
  pullPolicy: IfNotPresent
...
service:
  type: LoadBalancer
  port: 80
...
```

Update `appVersion` to `v1` in *webfrontend/Chart.yaml*. For example

```yml
apiVersion: v2
name: webfrontend
...
# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application.
appVersion: v1
```

## Run your Helm chart

Use the `helm install` command to install your application using your Helm chart.

```console
helm install webfrontend webfrontend/
```

It takes a few minutes for the service to return a public IP address. To monitor the progress, use the `kubectl get service` command with the *watch* parameter:

```console
$ kubectl get service --watch

NAME                TYPE          CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
webfrontend         LoadBalancer  10.0.141.72   <pending>     80:32150/TCP   2m
...
webfrontend         LoadBalancer  10.0.141.72   <EXTERNAL-IP> 80:32150/TCP   7m
```

Navigate to the load balancer of your application in a browser using the `<EXTERNAL-IP>` to see the sample application.

## Delete the cluster

When the cluster is no longer needed, use the [az group delete][az-group-delete] command to remove the resource group, the AKS cluster, the container registry, the container images stored there, and all related resources.

```azurecli-interactive
az group delete --name MyResourceGroup --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete]. If you used a managed identity, the identity is managed by the platform and does not require removal.

## Next steps

For more information about using Helm, see the Helm documentation.

> [!div class="nextstepaction"]
> [Helm documentation][helm-documentation]

[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-create]: /cli/azure/acr#az-acr-create
[az-acr-list]: /cli/azure/acr#az-acr-list
[az-group-delete]: /cli/azure/group#az-group-delete
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli

[docker-for-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-for-mac]: https://docs.docker.com/docker-for-mac/
[docker-for-windows]: https://docs.docker.com/docker-for-windows/
[example-nodejs]: https://github.com/Azure/dev-spaces/tree/master/samples/nodejs/getting-started/webfrontend
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[helm]: https://helm.sh/
[helm-documentation]: https://helm.sh/docs/
[helm-existing]: kubernetes-helm.md
[helm-install]: https://helm.sh/docs/intro/install/
[sp-delete]: kubernetes-service-principal.md#additional-considerations
