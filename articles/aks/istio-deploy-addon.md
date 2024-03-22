---
title: Deploy Istio-based service mesh add-on for Azure Kubernetes Service
description: Deploy Istio-based service mesh add-on for Azure Kubernetes Service
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/09/2023
ms.author: shasb
author: shashankbarsin
---

# Deploy Istio-based service mesh add-on for Azure Kubernetes Service

This article shows you how to install the Istio-based service mesh add-on for Azure Kubernetes Service (AKS) cluster.

For more information on Istio and the service mesh add-on, see [Istio-based service mesh add-on for Azure Kubernetes Service][istio-about].

## Before you begin

### Set environment variables

```bash
export CLUSTER=<cluster-name>
export RESOURCE_GROUP=<resource-group-name>
export LOCATION=<location>
```


### Verify Azure CLI version

The add-on requires Azure CLI version 2.57.0 or later installed. You can run `az --version` to verify version. To install or upgrade, see [Install Azure CLI][azure-cli-install].

## Get available Istio add-on revisions
To find information about which Istio add-on revisions are available in a region and their compatibility with AKS cluster versions, use:

```azurecli-interactive
az aks mesh get-revisions --location <location> -o table
```


## Install Istio add-on
### Revision selection
If you enable the add-on without specifying a revision, a default supported revision is installed for you.

If you wish to specify the revision instead:
1. Use the `get-revisions` command in the [previous step](#get-available-istio-add-on-revisions) to check which revisions are available for different AKS cluster versions in a region.
1. Based on the available revisions, you can include the `--revision asm-X-Y` (ex: `--revision asm-1-20`) flag in the enable command you use for mesh installation.

### Install mesh during cluster creation

To install the Istio add-on when creating the cluster, use the `--enable-azure-service-mesh` or`--enable-asm` parameter.

```azurecli-interactive
az group create --name ${RESOURCE_GROUP} --location ${LOCATION}

az aks create \
--resource-group ${RESOURCE_GROUP} \
--name ${CLUSTER} \
--enable-asm
```

### Install mesh for existing cluster

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
istiod-asm-1-18-74f7f7c46c-xfdtl   1/1     Running   0          2m
```

## Enable sidecar injection

To automatically install sidecar to any new pods, you will need to annotate your namespaces with the revision label corresponding to the control plane revision currently installed. 

If you're unsure which revision is installed, use:
```bash
az aks show --resource-group ${RESOURCE_GROUP} --name ${CLUSTER}  --query 'serviceMeshProfile.istio.revisions'
```

Apply the revision label:
```bash
kubectl label namespace default istio.io/rev=asm-X-Y
```

> [!IMPORTANT]
>  The default `istio-injection=enabled` labeling doesn't work. Explicit versioning matching the control plane revision (ex: `istio.io/rev=asm-1-18`) is required. 

For manual injection of sidecar using `istioctl kube-inject`, you need to specify extra parameters for `istioNamespace` (`-i`) and `revision` (`-r`). For example:

```bash
kubectl apply -f <(istioctl kube-inject -f sample.yaml -i aks-istio-system -r asm-X-Y) -n foo
```

## Trigger sidecar injection
You can either deploy the sample application provided for testing, or trigger sidecar injection for existing workloads.

### Existing applications
If you have existing applications to be added to the mesh, ensure their namespaces are labeled as in the previous step, and then restart their deployments to trigger sidecar injection:
```bash
kubectl rollout restart -n <namespace> <deployment name>
```

Verify that sidecar injection succeeded by ensuring all containers are ready and looking for the `istio-proxy` container in the `kubectl describe` output, for example:
```bash
kubectl describe pod -n namespace <pod name>
```

The `istio-proxy` container is the Envoy sidecar. Your application is now part of the data plane.

### Deploy sample application

Use `kubectl apply` to deploy the sample application on the cluster:

```bash
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/bookinfo/platform/kube/bookinfo.yaml
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

```
NAME                              READY   STATUS    RESTARTS   AGE
details-v1-558b8b4b76-2llld       2/2     Running   0          2m41s
productpage-v1-6987489c74-lpkgl   2/2     Running   0          2m40s
ratings-v1-7dc98c7588-vzftc       2/2     Running   0          2m41s
reviews-v1-7f99cc4496-gdxfn       2/2     Running   0          2m41s
reviews-v2-7d79d5bd5d-8zzqd       2/2     Running   0          2m41s
reviews-v3-7dbcdcbc56-m8dph       2/2     Running   0          2m41s
```


Confirm that all the pods have status of `Running` with 2 containers in the `READY` column. The second container (`istio-proxy`) added to each pod is the Envoy sidecar injected by Istio, and the other is the application container.

To test this sample application against ingress, check out [next-steps](#next-steps).

## Delete resources

Use `kubectl delete` to delete the sample application:

```bash
kubectl delete -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/bookinfo/platform/kube/bookinfo.yaml
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
