---
title: Access from Kubernetes
description: Learn how to provide pull access to images in your private container registry from Kubernetes by using a pull secret based on an Azure AD service principal.
ms.topic: article
ms.date: 02/10/2020
---

# Pull images to a Kubernetes cluster from an Azure container registry 

You can use an Azure container registry as a source of container images with any Kubernetes cluster, including "local" Kubernetes clusters such as [minikube](https://minikube.sigs.k8s.io/) and [kind](https://kind.sigs.k8s.io/). This article shows how to create a Kubernetes pull secret based on an Azure Active Directory service principal to pull images from an Azure container registry.

> [!TIP]
> If you are using Azure Kubernetes Service, you can take advantage of a custom Azure feature to integrate your cluster with a target Azure container registry for image pulls. For details, see [Authenticate with Azure Container Registry from Azure Kubernetes Service](../aks/cluster-container-registry-integration.md?toc=/azure/container-registry/toc.json&bc=/azure/container-registry/breadcrumb/toc.json).

This article assumes you already have created a private Azure container registry. You also need to have a Kubernetes cluster running and accessible via `kubectl` command-line tool.

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

If you don't save or remember the service principal password, you can reset the password with the [az ad sp credential reset][az-ad-sp-credential-reset] command:

```azurecli
az ad sp credential reset  --name http://<service-principal-name> --query password --output tsv
```

This command returns a new, valid password for your service principal.

## Create an image pull secret

Kubernetes uses an *image pull secret* to store information needed to authenticate to your registry. The pull secret for an Azure container registry uses the service principal ID, password, and the registry URL. 

Create an image pull secret with the following `kubectl` command:

```console
kubectl create secret docker-registry <secret-name> \
  --namespace <namespace> \
  --docker-server=https://<container-registry-name>.azurecr.io \
  --docker-username=<service-principal-ID> --docker-password=<service-principal-password>
```
where:

| Parameter | Description |
| :--- | :--- |
| `secret-name` | The name of the image pull secret, for example, *acr-secret* |
| `namespace` | The Kubernetes namespace to put the secret into <br/> Only needed if you want to place the secret in a namespace other than the default namespace |
| `container-registry-name` | The name of your Azure container registry |
| `service-principal-ID` | The ID of the service principal that will be used by Kubernetes to access your registry |
| `service-principal-password` | The service principal password |

## Use the image pull secret

Once you have created the image pull secret, you can use it to create Kubernetes pods and deployments. Specify `imagePullSecrets` in the deployment file as shown in the following example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: your-awesome-app-pod
  namespace: awesomeapps
spec:
  containers:
    - name: main-app-container
      image: your-awesome-app:v1
      imagePullPolicy: IfNotPresent
  imagePullSecrets:
    - name: acr-secret
```

In the preceding example above `your-awesome-app:v1` is the name of the image to pull from the Azure container registry, and  `acr-secret` is the name of the image pull secret you created for Kubernetes to access your registry. When you create the pod, Kubernetes automatically pulls the image from your registry, if it is not already present on the cluster.


## Next steps

* For details on working with service principals and Azure Container Registry, see [Azure Container Registry authentication with service principals](container-registry-auth-service-principal.md)
* Learn more about image pull secrets in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)


<!-- IMAGES -->

<!-- LINKS - External -->
[acr-scripts-cli]: https://github.com/Azure/azure-docs-cli-python-samples/tree/master/container-registry
[acr-scripts-psh]: https://github.com/Azure/azure-docs-powershell-samples/tree/master/container-registry

<!-- LINKS - Internal -->
[az-ad-sp-credential-reset]: /cli/azure/ad/sp/credential#az-ad-sp-credential-reset