---
title: Develop on Azure Kubernetes Service (AKS) with Draft
description: Use Draft with AKS and Azure Container Registry
services: container-service
author: zr-msft
ms.service: container-service
ms.topic: article
ms.date: 06/20/2019
ms.author: zarhoads
---

# Quickstart: Develop on Azure Kubernetes Service (AKS) with Draft

Draft is an open-source tool that helps package and run application containers in a Kubernetes cluster. With Draft, you can quickly redeploy an application to Kubernetes as code changes occur without having to commit your changes to version control. For more information on Draft, see the [Draft documentation on GitHub][draft-documentation].

This article shows you how to use Draft to package and run an application on AKS.


## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli?view=azure-cli-latest).
* Docker installed and configured. Docker provides packages that configure Docker on a [Mac][docker-for-mac], [Windows][docker-for-windows], or [Linux][docker-for-linux] system.
* [Helm v2 installed][helm-install].
* [Draft installed][draft-documentation].

## Create an Azure Kubernetes Service cluster

Create an AKS cluster. The below commands create a resource group called MyResourceGroup and an AKS cluster called MyAKS.

```azurecli
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus --node-vm-size Standard_DS2_v2 --node-count 1 --generate-ssh-keys
```

## Create an Azure Container Registry
To use Draft to run your application in your AKS cluster, you need an Azure Container Registry to store your container images. The below example uses [az acr create][az-acr-create] to create an ACR named *MyDraftACR* in the *MyResourceGroup* resource group with the *Basic* SKU. You should provide your own unique registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

```azurecli
az acr create --resource-group MyResourceGroup --name MyDraftACR --sku Basic
```

The output is similar to the following example. Make a note of the *loginServer* value for your ACR since it will be used in a later step. In the below example, *mydraftacr.azurecr.io* is the *loginServer* for *MyDraftACR*.

```console
{
  "adminUserEnabled": false,
  "creationDate": "2019-06-11T13:35:17.998425+00:00",
  "id": "/subscriptions/<ID>/resourceGroups/MyResourceGroup/providers/Microsoft.ContainerRegistry/registries/MyDraftACR",
  "location": "eastus",
  "loginServer": "mydraftacr.azurecr.io",
  "name": "MyDraftACR",
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


For Draft to use the ACR instance, you must first sign in. Use the [az acr login][az-acr-login] command to sign in. The below example will sign in to an ACR named *MyDraftACR*.

```azurecli
az acr login --name MyDraftACR
```

The command returns a *Login Succeeded* message once completed.

## Create trust between AKS cluster and ACR

Your AKS cluster also needs access to your ACR to pull the container images and run them. You allow access to the ACR from AKS by establishing a trust. To establish trust between an AKS cluster and an ACR registry, grant permissions for the Azure Active Directory service principal used by the AKS cluster to access the ACR registry. The following commands grant permissions to the service principal of the *MyAKS* cluster in the *MyResourceGroup* to the *MyDraftACR* ACR in the *MyResourceGroup*.

```azurecli
# Get the service principal ID of your AKS cluster
AKS_SP_ID=$(az aks show --resource-group MyResourceGroup --name MyAKS --query "servicePrincipalProfile.clientId" -o tsv)

# Get the resource ID of your ACR instance
ACR_RESOURCE_ID=$(az acr show --resource-group MyResourceGroup --name MyDraftACR --query "id" -o tsv)

# Create a role assignment for your AKS cluster to access the ACR instance
az role assignment create --assignee $AKS_SP_ID --scope $ACR_RESOURCE_ID --role contributor
```

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

## Create a service account for Helm

Before you can deploy Helm in an RBAC-enabled AKS cluster, you need a service account and role binding for the Tiller service. For more information on securing Helm / Tiller in an RBAC enabled cluster, see [Tiller, Namespaces, and RBAC][tiller-rbac]. If your AKS cluster isn't RBAC enabled, skip this step.

Create a file named `helm-rbac.yaml` and copy in the following YAML:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

Create the service account and role binding with the `kubectl apply` command:

```console
kubectl apply -f helm-rbac.yaml
```

## Configure Helm
To deploy a basic Tiller into an AKS cluster, use the [helm init][helm-init] command. If your cluster isn't RBAC enabled, remove the `--service-account` argument and value.

```console
helm init --service-account tiller --node-selectors "beta.kubernetes.io/os"="linux"
```

## Configure Draft

If you haven't configured Draft on your local machine, run `draft init`:

```console
$ draft init
Installing default plugins...
Installation of default plugins complete
Installing default pack repositories...
...
Happy Sailing!
```

You also need to configure Draft to use the *loginServer* of your ACR. The following command uses `draft config set` to use `mydraftacr.azurecr.io` as a registry.

```console
draft config set registry mydraftacr.azurecr.io
```

You've configured Draft to use your ACR, and Draft can push container images to your ACR. When Draft runs your application in your AKS cluster, no passwords or secrets are required to push to or pull from the ACR registry. Since a trust was created between your AKS cluster and your ACR, authentication happens at the Azure Resource Manager level, using Azure Active Directory.

## Download the sample application

This quickstart uses [an example Java application from the Draft GitHub repository][example-java]. Clone the application from GitHub and navigate to the `draft/examples/example-java/` directory.

```console
git clone https://github.com/Azure/draft
cd draft/examples/example-java/
```

## Run the sample application with Draft

Use the `draft create` command to prepare the application.

```console
draft create
```

This command creates the artifacts that are used to run the application in a Kubernetes cluster. These items include a Dockerfile, a Helm chart, and a *draft.toml* file, which is the Draft configuration file.

```console
$ draft create

--> Draft detected Java (92.205567%)
--> Ready to sail
```

To run the sample application in your AKS cluster, use the `draft up` command.

```console
draft up
```

This command builds the Dockerfile to create a container image, pushes the image to your ACR, and installs the Helm chart to start the application in AKS. The first time you run this command, pushing and pulling the container image may take some time. Once the base layers are cached, the time taken to deploy the application is dramatically reduced.

```
$ draft up

Draft Up Started: 'example-java': 01CMZAR1F4T1TJZ8SWJQ70HCNH
example-java: Building Docker Image: SUCCESS ⚓  (73.0720s)
example-java: Pushing Docker Image: SUCCESS ⚓  (19.5727s)
example-java: Releasing Application: SUCCESS ⚓  (4.6979s)
Inspect the logs with `draft logs 01CMZAR1F4T1TJZ8SWJQ70HCNH`
```

## Connect to the running sample application from your local machine

To test the application, use the `draft connect` command.

```console
draft connect
```

This command proxies a secure connection to the Kubernetes pod. When complete, the application can be accessed on the provided URL.

```console
$ draft connect

Connect to java:4567 on localhost:49804
[java]: SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
[java]: SLF4J: Defaulting to no-operation (NOP) logger implementation
[java]: SLF4J: See https://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
[java]: == Spark has ignited ...
[java]: >> Listening on 0.0.0.0:4567
```

Navigate to the application in a browser using the `localhost` URL to see the sample application. In the above example, the URL is `http://localhost:49804`. Stop the connection using `Ctrl+c`.

## Access the application on the internet

The previous step created a proxy connection to the application pod in your AKS cluster. As you develop and test your application, you may want to make the application available on the internet. To expose an application on the internet, you can create a Kubernetes service with a type of [LoadBalancer][kubernetes-service-loadbalancer].

Update `charts/example-java/values.yaml` to create a *LoadBalancer* service. Change the value of *service.type* from *ClusterIP* to *LoadBalancer*.

```yaml
...
service:
  name: java
  type: LoadBalancer
  externalPort: 80
  internalPort: 4567
...
```

Save your changes, close the file, and run `draft up` to rerun the application.

```console
draft up
```

It takes a few minutes for the service to return a public IP address. To monitor the progress, use the `kubectl get service` command with the *watch* parameter:

```console
$ kubectl get service --watch

NAME                TYPE          CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
example-java-java   LoadBalancer  10.0.141.72   <pending>     80:32150/TCP   2m
...
example-java-java   LoadBalancer   10.0.141.72   52.175.224.118  80:32150/TCP   7m
```

Navigate to the load balancer of your application in a browser using the *EXTERNAL-IP* to see the sample application. In the above example, the IP is `52.175.224.118`.

## Iterate on the application

You can iterate your application by making changes locally and rerunning `draft up`.

Update the message returned on [line 7 of src/main/java/helloworld/Hello.java][example-java-hello-l7]

```java
    public static void main(String[] args) {
        get("/", (req, res) -> "Hello World, I'm Java in AKS!");
    }
```

Run the `draft up` command to redeploy the application:

```console
$ draft up

Draft Up Started: 'example-java': 01CMZC9RF0TZT7XPWGFCJE15X4
example-java: Building Docker Image: SUCCESS ⚓  (25.0202s)
example-java: Pushing Docker Image: SUCCESS ⚓  (7.1457s)
example-java: Releasing Application: SUCCESS ⚓  (3.5773s)
Inspect the logs with `draft logs 01CMZC9RF0TZT7XPWGFCJE15X4`
```

To see the updated application, navigate to the IP address of your load balancer again and verify your changes appear.

## Delete the cluster

When the cluster is no longer needed, use the [az group delete][az-group-delete] command to remove the resource group, the AKS cluster, the container registry, the container images stored there, and all related resources.

```azurecli-interactive
az group delete --name MyResourceGroup --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete].

## Next steps

For more information about using Draft, see the Draft documentation on GitHub.

> [!div class="nextstepaction"]
> [Draft documentation][draft-documentation]


[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-create]: /cli/azure/acr#az-acr-login
[az-group-delete]: /cli/azure/group#az-group-delete
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[kubernetes-ingress]: ./ingress-basic.md

[docker-for-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-for-mac]: https://docs.docker.com/docker-for-mac/
[docker-for-windows]: https://docs.docker.com/docker-for-windows/
[draft-documentation]: https://github.com/Azure/draft/tree/master/docs
[example-java]: https://github.com/Azure/draft/tree/master/examples/example-java
[example-java-hello-l7]: https://github.com/Azure/draft/blob/master/examples/example-java/src/main/java/helloworld/Hello.java#L7
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubernetes-service-loadbalancer]: https://kubernetes.io/docs/concepts/services-networking/service/#type-loadbalancer
[helm-init]: https://v2.helm.sh/docs/helm/#helm-init
[helm-install]: https://v2.helm.sh/docs/using_helm/#installing-helm
[sp-delete]: kubernetes-service-principal.md#additional-considerations
[tiller-rbac]: https://v2.helm.sh/docs/using_helm/#tiller-namespaces-and-rbac
