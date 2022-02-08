---
title: Install the Open Service Mesh (OSM) add-on using Azure CLI
description: Install Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on using Azure CLI
services: container-service
ms.topic: article
ms.date: 11/10/2021
ms.author: pgibson
---

# Install the Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on using Azure CLI

This article shows you how to install the OSM add-on on an AKS cluster and verify it is installed and running.

> [!IMPORTANT]
> The OSM add-on installs version *0.11.1* of OSM on your cluster.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli).

## Install the OSM AKS add-on on your cluster

To install the OSM AKS add-on, use `--enable-addons open-service-mesh` when creating or updating a cluster.

The following example creates a *myResourceGroup* resource group. Then creates a *myAKSCluster* cluster with a three nodes and the OSM add-on.

```azurecli-interactive
az group create --name myResourceGroup --location eastus

az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-addons open-service-mesh
```

For existing clusters, use `az aks enable-addons`. For example:

> [!IMPORTANT]
> You can't enable the OSM add-on on an existing cluster if an OSM mesh is already on your cluster. Uninstall any existing OSM meshes on your cluster before enabling the OSM add-on.

```azurecli-interactive
az aks enable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons open-service-mesh
```

## Get the credentials for your cluster

Get the credentials for your AKS cluster using the `az aks get-credentials` command. The following example command gets the credentials for the *myAKSCluster* in the *myResourceGroup* resource group.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Verify the OSM add-on is installed on your cluster

To see if the OSM add-on is enabled on your cluster, verify the *enabled* value shows a *true* for *openServiceMesh* under *addonProfiles*. The following example shows the status of the OSM add-on for the *myAKSCluster* in *myResourceGroup*.

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster  --query 'addonProfiles.openServiceMesh.enabled'
```

## Verify the OSM mesh is running on your cluster

In addition to verifying the OSM add-on has been enabled on you cluster, you can also verify the version, status, and configuration of the OSM mesh running on your cluster.

To verify the version of the OSM mesh running on your cluster, use `kubectl` to display the image version of the *osm-controller* deployment. For example:

```azurecli-interactive
kubectl get deployment -n kube-system osm-controller -o=jsonpath='{$.spec.template.spec.containers[:1].image}'
```

The following example output shows version *0.11.1* of the OSM mesh:

```output
$ kubectl get deployment -n kube-system osm-controller -o=jsonpath='{$.spec.template.spec.containers[:1].image}'
mcr.microsoft.com/oss/openservicemesh/osm-controller:v0.11.1
```

To verify the status of the OSM components running on your cluster, use `kubectl` to show the status of the *app.kubernetes.io/name=openservicemesh.io* deployments, pods, and services. For example:

```azurecli-interactive
kubectl get deployments -n kube-system --selector app.kubernetes.io/name=openservicemesh.io
kubectl get pods -n kube-system --selector app.kubernetes.io/name=openservicemesh.io
kubectl get services -n kube-system --selector app.kubernetes.io/name=openservicemesh.io
```

> [!IMPORTANT]
> If any pods have a status other than *Running*, such as *Pending*, your cluster may not have enough resources to run OSM. Review the sizing for your cluster, such as the number of nodes and the VM SKU, before continuing to use OSM on your cluster.

To verify the configuration of your OSM mesh, use `kubectl get meshconfig`. For example:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o yaml
```

The following sample output shows the configuration of an OSM mesh:

```yaml
apiVersion: config.openservicemesh.io/v1alpha1
kind: MeshConfig
metadata:
  creationTimestamp: "0000-00-00A00:00:00A"
  generation: 1
  name: osm-mesh-config
  namespace: kube-system
  resourceVersion: "2494"
  uid: 6c4d67f3-c241-4aeb-bf4f-b029b08faa31
spec:
  certificate:
    serviceCertValidityDuration: 24h
  featureFlags:
    enableEgressPolicy: true
    enableMulticlusterMode: false
    enableWASMStats: true
  observability:
    enableDebugServer: true
    osmLogLevel: info
    tracing:
      address: jaeger.osm-system.svc.cluster.local
      enable: false
      endpoint: /api/v2/spans
      port: 9411
  sidecar:
    configResyncInterval: 0s
    enablePrivilegedInitContainer: false
    envoyImage: mcr.microsoft.com/oss/envoyproxy/envoy:v1.18.3
    initContainerImage: mcr.microsoft.com/oss/openservicemesh/init:v0.9.1
    logLevel: error
    maxDataPlaneConnections: 0
    resources: {}
  traffic:
    enableEgress: true
    enablePermissiveTrafficPolicyMode: true
    inboundExternalAuthorization:
      enable: false
      failureModeAllow: false
      statPrefix: inboundExtAuthz
      timeout: 1s
    useHTTPSIngress: false
```

The above example output shows `enablePermissiveTrafficPolicyMode: true`, which means OSM has a permissive traffic policy mode enabled. With permissive traffic mode enabled in your OSM mesh:

* The [SMI][smi] traffic policy enforcement is bypassed.
* OSM automatically discovers services that are a part of the service mesh.
* OSM creates traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.



## Delete your cluster

When the cluster is no longer needed, use the `az group delete` command to remove the resource group, cluster, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

Alternatively, you can uninstall the OSM add-on and the related resources from your cluster. For more information, see [Uninstall the Open Service Mesh (OSM) add-on from your AKS cluster][osm-uninstall].

## Next steps

This article showed you how to install the OSM add-on on an AKS cluster and verify it is installed an running. With the the OSM add-on on your cluster you can [Deploy a sample application][osm-deploy-sample-app] or [Onboard an existing application][osm-onboard-app] to work with your OSM mesh.

[aks-ephemeral]: cluster-configuration.md#ephemeral-os
[osm-sample]: open-service-mesh-deploy-new-application.md
[osm-uninstall]: open-service-mesh-uninstall-add-on.md
[smi]: https://smi-spec.io/
[osm-deploy-sample-app]: https://release-v1-0.docs.openservicemesh.io/docs/getting_started/install_apps/
[osm-onboard-app]: https://release-v1-0.docs.openservicemesh.io/docs/guides/app_onboarding/