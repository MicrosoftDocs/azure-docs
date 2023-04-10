---
title: Deploy Istio based service mesh add-on for Azure Kubernetes Service (preview)
description: Deploy Istio based service mesh add-on for Azure Kubernetes Service (preview)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/09/2023
ms.author: shasb
---

# Deploy Istio based service mesh add-on for Azure Kubernetes Service (preview)

This article shows you how to install the Istio based service mesh add-on for Azure Kubernetes Service (AKS) cluster.

A conceptual overview of Istio and the service mesh add-on is available [here][istio-about].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] and the CLI extension `aks-preview` of version >= 0.5.135 are installed.

    * If `aks-preview` isn't already installed, run the following command:

        ```azurecli
        az extension add --name aks-preview
        ```

    * If `aks-preview` is already installed, run the following command to update it to the latest version:

        ```azurecli
        az extension update --name aks-preview
        ```

* Register the `AzureServiceMeshPreview` feature flag by using the [az feature register][az-feature-register] command:

    ```azurecli
    az feature register --namespace "Microsoft.ContainerService" --name "AzureServiceMeshPreview"
    ```

    It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

    ```azurecli
    az feature show --namespace "Microsoft.ContainerService" --name "AzureServiceMeshPreview"
    ```

    When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

* Set environment variables:

    ```bash
    export CLUSTER=<cluster-name>
    export RESOURCE_GROUP=<resource-group-name>
    export LOCATION=<location>
    ```

## Install the Istio add-on on your cluster

**Install add-on at the time of cluster creation:**
To install the Istio add-on when creating the cluster, use `--enable-asm` or `--enable-azure-service-mesh` parameters.

```azurecli-interactive
az group create --name ${RESOURCE_GROUP} --location ${LOCATION}

az aks create \
--resource-group ${RESOURCE_GROUP} \
--name ${CLUSTER} \
--enable-asm
```

**Install add-on for existing cluster:**

The following example enables Istio add-on for an existing AKS cluster:

```azurecli-interactive
az aks mesh enable --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}
```

> [!IMPORTANT]
> You can't enable the Istio add-on on an existing cluster if an OSM add-on is already on your cluster. [Uninstall OSM add-on on your cluster][uninstall-osm-addon] before enabling the Istio add-on.
> You can't enable the Istio add-on on an existing cluster if Istio was already installed outside the add-on installation. [Uninstall non-add-on Istio][uninstall-istio-oss] before enabling the Istio add-on.
> Istio add-on can only be enabled on AKS clusters of version >= 1.23


## Verify add-on was installed successfully

1. To see if the Istio add-on is installed on your cluster, run the following command:

    ```azurecli-interactive
    az aks show --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}  --query 'serviceMeshProfile.mode'
    ```

    **Expected response:**

    ```
    Istio
    ```

1. Get the credentials for your AKS cluster:

    ```azurecli-interactive
    az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}
    ```

1. Verify that `istiod` (Istio control plane) pods are running successfully:

    ```bash
    kubectl get pods -n aks-istio-system
    ```

    **Expected response:**

    ```
    NAME                               READY   STATUS    RESTARTS   AGE
    istiod-asm-1-17-74f7f7c46c-xfdtl   1/1     Running   0          2m
    ```

## Enable sidecar injection

To automatically install sidecar to any new pods, annotate your namespaces:

```bash
kubectl label namespace default istio.io/rev=asm-1-17
```

## Deploy sample application

1. Deploy sample application on the cluster:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.17/samples/bookinfo/platform/kube/bookinfo.yaml
    ```

    **Expected response:**

    ```
    service/details created
    serviceaccount/bookinfo-details created
    deployment.apps/details-v1 created
    service/ratings created
    serviceaccount/bookinfo-ratings created
    deployment.apps/ratings-v1 created
    service/reviews created
    serviceaccount/bookinfo-reviews created
    deployment.apps/reviews-v1 created
    deployment.apps/reviews-v2 created
    deployment.apps/reviews-v3 created
    service/productpage created
    serviceaccount/bookinfo-productpage created
    deployment.apps/productpage-v1 created
    ```

1. Verify that the pods and services were created successfully:

    ```bash
    kubectl get services
    ```

    **Expected response:**

    ```
    NAME          TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
    details       ClusterIP   10.0.180.193   <none>        9080/TCP   87s
    kubernetes    ClusterIP   10.0.0.1       <none>        443/TCP    15m
    productpage   ClusterIP   10.0.112.238   <none>        9080/TCP   86s
    ratings       ClusterIP   10.0.15.201    <none>        9080/TCP   86s
    reviews       ClusterIP   10.0.73.95     <none>        9080/TCP   86s
    ```

    ```bash
    kubectl get pods
    ```

    **Expected response:**

    ```
    NAME          TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
    details-v1-558b8b4b76-2llld       2/2     Running   0          2m41s
    productpage-v1-6987489c74-lpkgl   2/2     Running   0          2m40s
    ratings-v1-7dc98c7588-vzftc       2/2     Running   0          2m41s
    reviews-v1-7f99cc4496-gdxfn       2/2     Running   0          2m41s
    reviews-v2-7d79d5bd5d-8zzqd       2/2     Running   0          2m41s
    reviews-v3-7dbcdcbc56-m8dph       2/2     Running   0          2m41s
    ```

    Expect to see each pod ready with two containers, one of which is the envoy sidecar injected by Istio.

## Next steps

* [Deploy external or internal ingresses for Istio service mesh add-on][istio-deploy-ingress]

[istio-about]: istio-about.md

[azure-cli-install]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register

[uninstall-osm-addon]: open-service-mesh-uninstall-add-on.md
[uninstall-istio-oss]: https://istio.io/latest/docs/setup/install/istioctl/#uninstall-istio

[istio-deploy-ingress]: istio-deploy-ingress.md