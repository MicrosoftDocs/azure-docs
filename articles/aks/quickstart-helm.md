---
title: Develop on Azure Kubernetes Service (AKS) with Helm
description: Use Helm with AKS and Azure Container Registry to package and run application containers in a cluster.
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 03/03/2023
---

# Quickstart: Develop on Azure Kubernetes Service (AKS) with Helm

[Helm][helm] is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers like *APT* and *Yum*, Helm manages Kubernetes charts, which are packages of pre-configured Kubernetes resources.

In this quickstart, you'll use Helm to package and run an application on AKS. For more details on installing an existing application using Helm, see [Install existing applications with Helm in AKS][helm-existing].

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install] installed.
* [Helm v3 installed][helm-install].

## Create an Azure Container Registry

You'll need to store your container images in an Azure Container Registry (ACR) to run your application in your AKS cluster using Helm. Provide your own registry name unique within Azure and containing 5-50 alphanumeric characters. Only lowercase characters are allowed. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

### [Azure CLI](#tab/azure-cli)

The below example uses the [`az acr create`][az-acr-create] command to create an ACR named *myhelmacr* in *myResourceGroup* with the *Basic* SKU.

> [!NOTE]
> The ACR name that you choose must be unique across the `azurecr.io` domain. If you specify an existing ACR name, an error is returned and the ACR is not created.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
az acr create --resource-group MyResourceGroup --name myhelmacr --sku Basic
```

Your output will be similar to the following example output. Take note of your *loginServer* value for your ACR since you'll use it in a later step.

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

### [Azure PowerShell](#tab/azure-powershell)

The below example uses the [`New-AzContainerRegistry`][new-azcontainerregistry] cmdlet to create an ACR named *myhelmacr* in *myResourceGroup* with the *Basic* SKU.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location eastus
New-AzContainerRegistry -ResourceGroupName myResourceGroup -Name myhelmacr -Sku Basic
```

Your output will be similar to the following example output. Take note of your *LoginServer* value for your ACR since you'll use it in a later step.

```output
Registry Name    Sku        LoginServer              CreationDate               Provisioni AdminUserE StorageAccountName
                                                                                  ngState    nabled
-------------    ---        -----------              ------------               ---------- ---------- ------------------
myhelmacr        Basic      myhelmacr.azurecr.io     5/30/2022 9:16:14 PM       Succeeded  False      
```

---

## Create an AKS cluster

Your new AKS cluster needs access to your ACR to pull the container images and run them.

### [Azure CLI](#tab/azure-cli)

Use the [`az aks create`][az-aks-create] command to create an AKS cluster called *myAKSCluster* and the `--attach-acr` parameter to grant the cluster access to the *myhelmacr* ACR.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --location eastus --attach-acr myhelmacr --generate-ssh-keys
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [`New-AzAksCluster`][new-azakscluster] cmdlet to create an AKS cluster called *myAKSCluster* and the `-AcrNameToAttach` parameter to grant the cluster access to the *myhelmacr* ACR.

```azurepowershell-interactive
New-AzAksCluster -ResourceGroupName MyResourceGroup -Name myAKSCluster -Location eastus -AcrNameToAttach myhelmacr -GenerateSshKey 
```

---

## Connect to your AKS cluster

To connect a Kubernetes cluster locally, use the Kubernetes command-line client, [kubectl][kubectl]. `kubectl` is already installed if you use Azure Cloud Shell.

### [Azure CLI](#tab/azure-cli)

1. Install `kubectl` locally using the [`az aks install-cli`][az-aks-install-cli] command.

    ```azurecli
    az aks install-cli
    ```

2. Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command. The following command gets credentials for the AKS cluster named *myAKSCluster* in *myResourceGroup*:  

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Install `kubectl` locally using the [`Install-AzAksKubectl`][install-azakskubectl] cmdlet.

    ```azurepowershell
    Install-AzAksKubectl
    ```

2. Configure `kubectl` to connect to your Kubernetes cluster using the [`Import-AzAksCredential`][import-azakscredential] cmdlet. The following command gets credentials for the AKS cluster named *myAKSCluste* in *myResourceGroup*:  

    ```azurepowershell-interactive
    Import-AzAksCredential -ResourceGroupName myResourceGroup -Name myAKSCluster
    ```

---

## Download the sample application

This quickstart uses the [Azure Vote application][azure-vote-app]. Clone the application from GitHub and navigate to the `azure-vote` directory using the following commands:

```console
git clone https://github.com/Azure-Samples/azure-voting-app-redis.git
cd azure-voting-app-redis/azure-vote/
```

## Build and push the sample application to the ACR

Using the preceding Dockerfile, run the [`az acr build`][az-acr-build] command to build and push an image to the registry. The `.` at the end of the command provides the location of the source code directory path (in this case, the current directory). The `--file` parameter takes in the path of the Dockerfile relative to this source code directory path.

```azurecli-interactive
az acr build --image azure-vote-front:v1 --registry myhelmacr --file Dockerfile .
```

> [!NOTE]
> In addition to importing container images into your ACR, you can also import Helm charts into your ACR. For more information, see [Push and pull Helm charts to an Azure container registry][acr-helm].

## Create your Helm chart

1. Generate your Helm chart using the `helm create` command.

  ```console
  helm create azure-vote-front
  ```

2. Update *azure-vote-front/Chart.yaml* to add a dependency for the *redis* chart from the `https://charts.bitnami.com/bitnami` chart repository and update `appVersion` to `v1`. For example:

  > [!NOTE]
  > The container image versions shown in this guide have been tested to work with this example but may not be the latest version available.

  ```yaml
  apiVersion: v2
  name: azure-vote-front
  description: A Helm chart for Kubernetes

  dependencies:
    - name: redis
      version: 17.3.17
      repository: https://charts.bitnami.com/bitnami

  ...
  # This is the version number of the application being deployed. This version number should be
  # incremented each time you make changes to the application.
  appVersion: v1
  ```

3. Update your helm chart dependencies using the `helm dependency update` command.

  ```console
  helm dependency update azure-vote-front
  ```

4. Update *azure-vote-front/values.yaml* with the following changes:

  * Add a *redis* section to set the image details, container port, and deployment name.
  * Add a *backendName* for connecting the frontend portion to the *redis* deployment.
  * Change *image.repository* to `<loginServer>/azure-vote-front`.
  * Change *image.tag* to `v1`.
  * Change *service.type* to *LoadBalancer*.

  For example:

  ```yaml
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

5. Add an `env` section to *azure-vote-front/templates/deployment.yaml* for passing the name of the *redis* deployment.

  ```yaml
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

1. Install your application using your Helm chart using the `helm install` command.

  ```console
  helm install azure-vote-front azure-vote-front/
  ```

2. It takes a few minutes for the service to return a public IP address. Monitor progress using the `kubectl get service` command with the `--watch` argument.

  ```console
  $ kubectl get service azure-vote-front --watch
  NAME               TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
  azure-vote-front   LoadBalancer   10.0.18.228   <pending>       80:32021/TCP   6s
  ...
  azure-vote-front   LoadBalancer   10.0.18.228   52.188.140.81   80:32021/TCP   2m6s
  ```

3. Navigate to your application's load balancer in a browser using the `<EXTERNAL-IP>` to see the sample application.

## Delete the cluster

### [Azure CLI](#tab/azure-cli)

Use the [`az group delete`][az-group-delete] command to remove the resource group, the AKS cluster, the container registry, the container images stored in the ACR, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [`Remove-AzResourceGroup`][remove-azresourcegroup] cmdlet to remove the resource group, the AKS cluster, the container registry, the container images stored in the ACR, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

---

> [!NOTE]
> If the AKS cluster was created with system-assigned managed identity (default identity option used in this quickstart), the identity is managed by the platform and doesn't require removal.
>
> If the AKS cluster was created with service principal as the identity option instead, the service principal used by the AKS cluster isn't removed when you delete the cluster. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete].

## Next steps

For more information about using Helm, see the [Helm documentation][helm-documentation].

[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[az-acr-create]: /cli/azure/acr#az_acr_create
[new-azcontainerregistry]: /powershell/module/az.containerregistry/new-azcontainerregistry
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[az-acr-build]: /cli/azure/acr#az_acr_build
[az-group-delete]: /cli/azure/group#az_group_delete
[remove-azresourcegroup]: /powershell/module/az.resources/remove-azresourcegroup
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-create]: /cli/azure/aks#az_aks_create
[import-azakscredential]: /powershell/module/az.aks/import-azakscredential
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[install-azakskubectl]: /powershell/module/az.aks/install-azaksclitool
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[helm]: https://helm.sh/
[helm-documentation]: https://helm.sh/docs/
[helm-existing]: kubernetes-helm.md
[helm-install]: https://helm.sh/docs/intro/install/
[sp-delete]: kubernetes-service-principal.md#other-considerations
[acr-helm]: ../container-registry/container-registry-helm-repos.md
