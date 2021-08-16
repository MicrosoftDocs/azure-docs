---
title: Develop on Azure Kubernetes Service (AKS) with Helm
description: Use Helm with AKS and Azure Container Registry to package and run application containers in a cluster.
services: container-service
author: zr-msft
ms.topic: article
ms.date: 07/15/2021
ms.author: zarhoads
---

# Quickstart: Develop on Azure Kubernetes Service (AKS) with Helm

[Helm][helm] is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers like *APT* and *Yum*, Helm manages Kubernetes charts, which are packages of pre-configured Kubernetes resources.

In this quickstart, you'll use Helm to package and run an application on AKS. For more details on installing an existing application using Helm, see the [Install existing applications with Helm in AKS][helm-existing] how-to guide.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli).
* [Helm v3 installed][helm-install].

## Create an Azure Container Registry
You'll need to store your container images in an Azure Container Registry (ACR) to run your application in your AKS cluster using Helm. Provide your own registry name unique within Azure and containing 5-50 alphanumeric characters. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

The below example uses [az acr create][az-acr-create] to create an ACR named *MyHelmACR* in *MyResourceGroup* with the *Basic* SKU.

```azurecli
az group create --name MyResourceGroup --location eastus
az acr create --resource-group MyResourceGroup --name MyHelmACR --sku Basic
```

Output will be similar to the following example. Take note of your *loginServer* value for your ACR since you'll use it in a later step. In the below example, *myhelmacr.azurecr.io* is the *loginServer* for *MyHelmACR*.

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

## Create an AKS cluster

Your new AKS cluster needs access to your ACR to pull the container images and run them. Use the following command to:
* Create an AKS cluster called *MyAKS* and attach *MyHelmACR*.
* Grant the *MyAKS* cluster access to your *MyHelmACR* ACR.


```azurecli
az aks create -g MyResourceGroup -n MyAKS --location eastus  --attach-acr MyHelmACR --generate-ssh-keys
```

## Connect to your AKS cluster

To connect a Kubernetes cluster locally, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell. 

1. Install `kubectl` locally using the `az aks install-cli` command:

    ```azurecli
    az aks install-cli
    ```

2. Configure `kubectl` to connect to your Kubernetes cluster using the `az aks get-credentials` command. The following command example gets credentials for the AKS cluster named *MyAKS* in the *MyResourceGroup*:  

    ```azurecli
    az aks get-credentials --resource-group MyResourceGroup --name MyAKS
    ```

## Download the sample application

This quickstart uses the [Azure Vote application][azure-vote-app]. Clone the application from GitHub and navigate to the `azure-vote` directory.

```console
git clone https://github.com/Azure-Samples/azure-voting-app-redis.git
cd azure-voting-app-redis/azure-vote/
```

## Build and push the sample application to the ACR

Using the preceding Dockerfile, run the [az acr build][az-acr-build] command to build and push an image to the registry. The `.` at the end of the command sets the location of the Dockerfile (in this case, the current directory).

```azurecli
az acr build --image azure-vote-front:v1 \
  --registry MyHelmACR \
  --file Dockerfile .
```

> [!NOTE]
> In addition to importing container images into your ACR, you can also import Helm charts into your ACR. For more information, see [Push and pull Helm charts to an Azure container registry][acr-helm].

## Create your Helm chart

Generate your Helm chart using the `helm create` command.

```console
helm create azure-vote-front
```

Update *azure-vote-front/Chart.yaml* to add a dependency for the *redis* chart from the `https://charts.bitnami.com/bitnami` chart repository and update `appVersion` to `v1`. For example:

```yml
apiVersion: v2
name: azure-vote-front
description: A Helm chart for Kubernetes

dependencies:
  - name: redis
    version: 14.7.1
    repository: https://charts.bitnami.com/bitnami

...
# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application.
appVersion: v1
```

Update your helm chart dependencies using `helm dependency update`:

```console
helm dependency update azure-vote-front
```

Update *azure-vote-front/values.yaml*:
* Add a *redis* section to set the image details, container port, and deployment name.
* Add a *backendName* for connecting the frontend portion to the *redis* deployment.
* Change *image.repository* to `<loginServer>/azure-vote-front`.
* Change *image.tag* to `v1`.
* Change *service.type* to *LoadBalancer*.

For example:

```yml
# Default values for azure-vote-front.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1
backendName: azure-vote-backend-master
redis:
  image:
    registry: mcr.microsoft.com
    repository: oss/bitnami/redis
    tag: 6.0.8
  fullnameOverride: azure-vote-backend
  auth:
    enabled: false

image:
  repository: myhelmacr.azurecr.io/azure-vote-front
  pullPolicy: IfNotPresent
  tag: "v1"
...
service:
  type: LoadBalancer
  port: 80
...
```

Add an `env` section to *azure-vote-front/templates/deployment.yaml* for passing the name of the *redis* deployment.

```yml
...
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
          - name: REDIS
            value: {{ .Values.backendName }}
...
```

## Run your Helm chart

Install your application using your Helm chart using the `helm install` command.

```console
helm install azure-vote-front azure-vote-front/
```

It takes a few minutes for the service to return a public IP address. Monitor progress using the `kubectl get service` command with the `--watch` argument.

```console
$ kubectl get service azure-vote-front --watch
NAME               TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.18.228   <pending>       80:32021/TCP   6s
...
azure-vote-front   LoadBalancer   10.0.18.228   52.188.140.81   80:32021/TCP   2m6s
```

Navigate to your application's load balancer in a browser using the `<EXTERNAL-IP>` to see the sample application.

## Delete the cluster

Use the [az group delete][az-group-delete] command to remove the resource group, the AKS cluster, the container registry, the container images stored in the ACR, and all related resources.

```azurecli-interactive
az group delete --name MyResourceGroup --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete].
> 
> If you used a managed identity, the identity is managed by the platform and does not require removal.

## Next steps

For more information about using Helm, see the Helm documentation.

> [!div class="nextstepaction"]
> [Helm documentation][helm-documentation]

[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-build]: /cli/azure/acr#az_acr_build
[az-group-delete]: /cli/azure/group#az_group_delete
[az aks get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az aks install-cli]: /cli/azure/aks#az_aks_install_cli
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[helm]: https://helm.sh/
[helm-documentation]: https://helm.sh/docs/
[helm-existing]: kubernetes-helm.md
[helm-install]: https://helm.sh/docs/intro/install/
[sp-delete]: kubernetes-service-principal.md#additional-considerations
[acr-helm]: ../container-registry/container-registry-helm-repos.md