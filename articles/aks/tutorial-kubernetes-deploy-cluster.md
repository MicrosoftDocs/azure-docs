---
title: Kubernetes on Azure tutorial  - Deploy Cluster
description: AKS tutorial - Deploy Cluster
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: tutorial
ms.date: 06/29/2018
ms.author: iainfou
ms.custom: mvc
---

# Tutorial: Deploy an Azure Kubernetes Service (AKS) cluster

Kubernetes provides a distributed platform for containerized applications. With AKS, you can quickly provision a production ready Kubernetes cluster. In this tutorial, part three of seven, a Kubernetes cluster is deployed in AKS. Steps completed include:

> [!div class="checklist"]
> * Creating a service principal for resource interactions
> * Deploying a Kubernetes AKS cluster
> * Installation of the Kubernetes CLI (kubectl)
> * Configuration of kubectl

In subsequent tutorials, the Azure Vote application is deployed to the cluster, scaled, and updated.

## Before you begin

In previous tutorials, a container image was created and uploaded to an Azure Container Registry instance. If you have not done these steps, and would like to follow along, return to [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

## Create a service principal

To allow an AKS cluster to interact with other Azure resources, an Azure Active Directory service principal is used. This service principal can be automatically created by the Azure CLI or portal, or you can pre-create one and assign additional permissions. In this tutorial, you create a service principal, grant access to the Azure Container Registry (ACR) instance created in the previous tutorial, then create an AKS cluster.

Create a service principal with [az ad sp create-for-rbac][]. The `--skip-assignment` parameter limits any additional permissions from being assigned.

```azurecli
az ad sp create-for-rbac --skip-assignment
```

The output is similar to the following example:

```
{
  "appId": "e7596ae3-6864-4cb8-94fc-20164b1588a9",
  "displayName": "azure-cli-2018-06-29-19-14-37",
  "name": "http://azure-cli-2018-06-29-19-14-37",
  "password": "52c95f25-bd1e-4314-bd31-d8112b293521",
  "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db48"
}
```

Make a note of the *appId* and *password*. These values are used in the following steps.

## Configure ACR authentication

To access images stored in ACR, you must grant the AKS service principal the correct rights to pull images from ACR.

First, get the ACR resource ID with [az acr show][]. Update the `<acrName>` registry name to that of your ACR instance and the resource group where the ACR instance is located.

```azurecli
az acr show --name <acrName> --resource-group myResourceGroup --query "id" --output tsv
```

To grant the correct access for the AKS cluster to use images stored in ACR, create a role assignment with [az role assignment create][]. Replace `<appId`> and `<acrId>` with the values gathered in the previous two steps.

```azurecli
az role assignment create --assignee <appId> --role Reader --scope <acrId>
```

## Create Kubernetes cluster

Now create an AKS cluster with [az aks create][]. The following example creates a cluster named *myAKSCluster* in a resource group named *myResourceGroup*. This resource group was created in the [previous tutorial][aks-tutorial-prepare-acr]. Provide your own `<appId>` and `<password>` from the previous step where you created the service principal.

```azurecli
az aks create \
    --name myAKSCluster \
    --resource-group myResourceGroup \
    --node-count 1 \
    --generate-ssh-keys \
    --service-principal <appId> \
    --client-secret <password>
```

After several minutes, the deployment completes, and returns JSON-formatted information about the AKS deployment.

## Install the kubectl CLI

To connect to the Kubernetes cluster from your client computer, use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, kubectl is already installed. You can also install it locally with [az aks install-cli][]:

```azurecli
az aks install-cli
```

## Connect with kubectl

To configure kubectl to connect to your Kubernetes cluster, use [az aks get-credentials][]. The following example gets credentials for the AKS cluster name *myAKSCluster* in the *myResourceGroup*:

```azurecli
az aks get-credentials --name myAKSCluster --resource-group myResourceGroup
```

To verify the connection to your cluster, run the [kubectl get nodes][kubectl-get] command.

```azurecli
kubectl get nodes
```

Output:

```
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-66427764-0   Ready     agent     9m        v1.9.6
```

## Next steps

In this tutorial, a Kubernetes cluster was deployed in AKS. The following steps were completed:

> [!div class="checklist"]
> * Created a service principal for resource interactions
> * Deployed a Kubernetes AKS cluster
> * Installed the Kubernetes CLI (kubectl)
> * Configured kubectl

Advance to the next tutorial to learn about running application on the cluster.

> [!div class="nextstepaction"]
> [Deploy application in Kubernetes][aks-tutorial-deploy-app]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[aks-tutorial-deploy-app]: ./tutorial-kubernetes-deploy-application.md
[aks-tutorial-prepare-acr]: ./tutorial-kubernetes-prepare-acr.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az ad sp create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az acr show]: /cli/azure/acr#az-acr-show
[az role assignment create]: /cli/azure/role/assignment#az-role-assignment-create
[az aks create]: /cli/azure/aks#az-aks-create
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
