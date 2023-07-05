---
title: Deploy Istio-based service mesh add-on for Azure Kubernetes Service (preview)
description: Deploy Istio-based service mesh add-on for Azure Kubernetes Service (preview)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/09/2023
ms.author: shasb
---

# Deploy Istio-based service mesh add-on for Azure Kubernetes Service (preview)

This article shows you how to install the Istio-based service mesh add-on for Azure Kubernetes Service (AKS) cluster.

For more information on Istio and the service mesh add-on, see [Istio-based service mesh add-on for Azure Kubernetes Service][istio-about].

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Before you begin

### Set environment variables

```bash
export CLUSTER=<cluster-name>
export RESOURCE_GROUP=<resource-group-name>
export LOCATION=<location>
```

### Verify Azure CLI and aks-preview extension versions
The add-on requires:
* Azure CLI version 2.44.0 or later installed. To install or upgrade, see [Install Azure CLI][install-azure-cli].
* `aks-preview` Azure CLI extension of version 0.5.133 or later installed

You can run `az --version` to verify above versions.

To install the aks-preview extension, run the following command:

```azurecli-interactive
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name aks-preview
```

### Register the _AzureServiceMeshPreview_ feature flag

Register the `AzureServiceMeshPreview` feature flag by using the [az feature register][az-feature-register] command:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AzureServiceMeshPreview"
```

It takes a few minutes for the feature to register. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "AzureServiceMeshPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Install Istio add-on at the time of cluster creation

To install the Istio add-on when creating the cluster, use the `--enable-azure-service-mesh` or`--enable-asm` parameter.

```azurecli-interactive
az group create --name ${RESOURCE_GROUP} --location ${LOCATION}

az aks create \
--resource-group ${RESOURCE_GROUP} \
--name ${CLUSTER} \
--enable-asm
```

## Install Istio add-on for existing cluster

The following example enables Istio add-on for an existing AKS cluster:

> [!IMPORTANT]
> You can't enable the Istio add-on on an existing cluster if an OSM add-on is already on your cluster. Uninstall the OSM add-on before installing the Istio add-on.
> For more information, see [uninstall the OSM add-on from your AKS cluster][uninstall-osm-addon].
> Istio add-on can only be enabled on AKS clusters of version >= 1.23.

```azurecli-interactive
az aks mesh enable --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}
```

## Verify successful installation

To verify the Istio add-on is installed on your cluster, run the following command:

```azurecli-interactive
az aks show --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}  --query 'serviceMeshProfile.mode'
```

Confirm the output shows `Istio`.

Use `az aks get-credentials` to the credentials for your AKS cluster:

```azurecli-interactive
az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}
```

Use `kubectl` to verify that `istiod` (Istio control plane) pods are running successfully:

```bash
kubectl get pods -n aks-istio-system
```

Confirm the `istiod` pod has a status of `Running`. For example:

```
NAME                               READY   STATUS    RESTARTS   AGE
istiod-asm-1-17-74f7f7c46c-xfdtl   1/1     Running   0          2m
```

## Enable sidecar injection

To automatically install sidecar to any new pods, annotate your namespaces:

```bash
kubectl label namespace default istio.io/rev=asm-1-17
```

> [!IMPORTANT]
>  The default `istio-injection=enabled` labeling doesn't work. Explicit versioning (`istio.io/rev=asm-1-17`) is required.


For manual injection of sidecar using `istioctl kube-inject`, you need to specify extra parameters for `istioNamespace` (`-i`) and `revision` (`-r`). Example:

```bash
kubectl apply -f <(istioctl kube-inject -f sample.yaml -i aks-istio-system -r asm-1-17) -n foo
```

## Deploy sample application

Use `kubectl apply` to deploy the sample application on the cluster:

```bash
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.17/samples/bookinfo/platform/kube/bookinfo.yaml
```

Confirm several deployments and services are created on your cluster. For example:

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

Use `kubectl get services` to verify that the services were created successfully:

```bash
kubectl get services
```

Confirm the following services were deployed:

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

Confirm that all the pods have status of `Running`.

```
NAME          TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
details-v1-558b8b4b76-2llld       2/2     Running   0          2m41s
productpage-v1-6987489c74-lpkgl   2/2     Running   0          2m40s
ratings-v1-7dc98c7588-vzftc       2/2     Running   0          2m41s
reviews-v1-7f99cc4496-gdxfn       2/2     Running   0          2m41s
reviews-v2-7d79d5bd5d-8zzqd       2/2     Running   0          2m41s
reviews-v3-7dbcdcbc56-m8dph       2/2     Running   0          2m41s
```

> [!NOTE]
> Each pod has two containers, one of which is the Envoy sidecar injected by Istio and the other is the application container.

To test this sample application against ingress, check out [next-steps](#next-steps).

## Delete resources

Use `kubectl delete` to delete the sample application:

```bash
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.17/samples/bookinfo/platform/kube/bookinfo.yaml
```

If you don't intend to enable Istio ingress on your cluster and want to disable the Istio add-on, run the following command:

```azurecli-interactive
az aks mesh disable --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}
```

> [!CAUTION]
> Disabling the service mesh addon will completely remove the Istio control plane from the cluster.

Istio `CustomResourceDefintion`s (CRDs) aren't be deleted by default. To clean them up, use:

```bash
kubectl delete crd $(kubectl get crd -A | grep "istio.io" | awk '{print $1}')
```

Use `az group delete` to delete your cluster and the associated resources:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP} --yes --no-wait
```

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