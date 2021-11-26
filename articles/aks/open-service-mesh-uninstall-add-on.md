---
title: Uninstall the Open Service Mesh (OSM) add-on
description: Deploy Open Service Mesh on Azure Kubernetes Service (AKS) using Azure CLI
services: container-service
ms.topic: article
ms.date: 11/10/2021
ms.author: pgibson
---

# Uninstall the Open Service Mesh (OSM) add-on from your Azure Kubernetes Service (AKS) cluster

This article shows you how to uninstall the OMS add-on and related resources from you AKS cluster.

## Disable the OSM add-on from your cluster

Disable the OSM add-on in your cluster using `az aks disable-addon`. For example:

```azurecli-interactive
az aks disable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons open-service-mesh
```

The above example removes the OSM add-on from the *myAKSCluster* in *myResourceGroup*.

## Remove additional OSM resources

After the OSM add-on is disabled, the following resources remain on the cluster:

1. OSM meshconfig custom resource
2. OSM control plane secrets
3. OSM mutating webhook configuration
4. OSM validating webhook configuration
5. OSM CRDs

> [!IMPORTANT]
> You must remove these additional resources after you disable the OSM add-on. Leaving these resources on your cluster may cause issues if you enable the OSM add-on again in the future.

To remove these remaining resources:

1. Delete the meshconfig config resource
```azurecli-interactive
kubectl delete --ignore-not-found meshconfig -n kube-system osm-mesh-config
```

2. Delete the OSM control plane secrets
```azurecli-interactive
kubectl delete --ignore-not-found secret -n kube-system osm-ca-bundle mutating-webhook-cert-secret validating-webhook-cert-secret crd-converter-cert-secret
```

3. Delete the OSM mutating webhook configuration
```azurecli-interactive
kubectl delete mutatingwebhookconfiguration -l app.kubernetes.io/name=openservicemesh.io,app.kubernetes.io/instance=osm,app=osm-injector --ignore-not-found
```

4. Delete the OSM validating webhook configuration
```azurecli-interactive
kubectl delete validatingwebhookconfiguration -l app.kubernetes.io/name=openservicemesh.io,app.kubernetes.io/instance=osm,app=osm-controller --ignore-not-found
```

5. Delete the OSM CRDs: For guidance on OSM's CRDs and how to delete them, refer to [this documentation](https://docs.openservicemesh.io/docs/getting_started/uninstall/#removal-of-osm-cluster-wide-resources).
