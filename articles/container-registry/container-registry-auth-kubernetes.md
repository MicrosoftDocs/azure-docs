---
title: Authenticate with an Azure container registry using a Kubernetes pull secret
description: Learn how to provide a Kubernetes cluster with access to images in your Azure container registry by creating a pull secret using a service principal
ms.topic: article
ms.custom: devx-track-azurecli
author: karolz-ms
ms.author: karolz
ms.date: 10/11/2022
---

# Pull images from an Azure container registry to a Kubernetes cluster using a pull secret

You can use an Azure container registry as a source of container images with any Kubernetes cluster, including "local" Kubernetes clusters such as [minikube](https://minikube.sigs.k8s.io/) and [kind](https://kind.sigs.k8s.io/). This article shows how to create a Kubernetes pull secret using credentials for an Azure container registry. Then, use the secret to pull images from an Azure container registry in a pod deployment.

This example creates a pull secret using Microsoft Entra [service principal credentials](container-registry-auth-service-principal.md). You can also configure a pull secret using other Azure container registry credentials, such as a [repository-scoped access token](container-registry-repository-scoped-permissions.md).

> [!NOTE]
> While pull secrets are commonly used, they bring additional management overhead. If you're using [Azure Kubernetes Service](../aks/intro-kubernetes.md), we recommend [other options](authenticate-kubernetes-options.md) such as using the cluster's managed identity or service principal to securely pull the image without an additional `imagePullSecrets` setting on each pod.

## Prerequisites

This article assumes you already created a private Azure container registry. You also need to have a Kubernetes cluster running and accessible via the `kubectl` command-line tool.

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

If you don't save or remember the service principal password, you can reset it with the [az ad sp credential reset][az-ad-sp-credential-reset] command:

```azurecli
az ad sp credential reset  --name http://<service-principal-name> --query password --output tsv
```

This command returns a new, valid password for your service principal.

## Create an image pull secret

Kubernetes uses an *image pull secret* to store information needed to authenticate to your registry. To create the pull secret for an Azure container registry, you provide the service principal ID, password, and the registry URL.

Create an image pull secret with the following `kubectl` command:

```console
kubectl create secret docker-registry <secret-name> \
    --namespace <namespace> \
    --docker-server=<container-registry-name>.azurecr.io \
    --docker-username=<service-principal-ID> \
    --docker-password=<service-principal-password>
```

where:

| Value | Description |
| :--- | :--- |
| `secret-name` | Name of the image pull secret, for example, *acr-secret* |
| `namespace` | Kubernetes namespace to put the secret into <br/> Only needed if you want to place the secret in a namespace other than the default namespace |
| `container-registry-name` | Name of your Azure container registry, for example, *myregistry*<br/><br/>The `--docker-server` is the fully qualified name of the registry login server  |
| `service-principal-ID` | ID of the service principal that will be used by Kubernetes to access your registry |
| `service-principal-password` | Service principal password |

## Use the image pull secret

Once you've created the image pull secret, you can use it to create Kubernetes pods and deployments. Provide the name of the secret under `imagePullSecrets` in the deployment file. For example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-awesome-app-pod
  namespace: awesomeapps
spec:
  containers:
    - name: main-app-container
      image: myregistry.azurecr.io/my-awesome-app:v1
      imagePullPolicy: IfNotPresent
  imagePullSecrets:
    - name: acr-secret
```

In the preceding example, `my-awesome-app:v1` is the name of the image to pull from the Azure container registry, and  `acr-secret` is the name of the pull secret you created to access the registry. When you deploy the pod, Kubernetes automatically pulls the image from your registry, if it is not already present on the cluster.

## Next steps

* For more about working with service principals and Azure Container Registry, see [Azure Container Registry authentication with service principals](container-registry-auth-service-principal.md)
* Learn more about image pull secrets in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)

<!-- IMAGES -->

<!-- LINKS - External -->
[acr-scripts-cli]: https://github.com/Azure/azure-docs-cli-python-samples/tree/master/container-registry/create-registry/create-registry-service-principal-assign-role.sh
[acr-scripts-psh]: https://github.com/Azure/azure-docs-powershell-samples/tree/master/container-registry

<!-- LINKS - Internal -->
[az-ad-sp-credential-reset]: /cli/azure/ad/sp/credential#az_ad_sp_credential_reset
