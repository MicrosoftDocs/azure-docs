---
title: Install the Open Service Mesh (OSM) add-on using Azure CLI
description: Use Azure CLI to install the Open Service Mesh (OSM) add-on on an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 06/27/2023
ms.author: pgibson
---

# Install the Open Service Mesh (OSM) add-on using Azure CLI

This article shows you how to install the Open Service Mesh (OSM) add-on on an Azure Kubernetes Service (AKS) cluster. The OSM add-on installs the OSM mesh on your cluster. The OSM mesh is a service mesh that provides traffic management, policy enforcement, and telemetry collection for your applications. For more information about the OSM mesh, see [Open Service Mesh](https://openservicemesh.io/).

> [!IMPORTANT]
> Based on the version of Kubernetes your cluster is running, the OSM add-on installs a different version of OSM.
>
> |Kubernetes version         | OSM version installed |
> |---------------------------|-----------------------|
> | 1.24.0 or greater         | 1.2.5                 |
> | Between 1.23.5 and 1.24.0 | 1.1.3                 |
> | Below 1.23.5              | 1.0.0                 |
>
> Older versions of OSM may not be available for install or be actively supported if the corresponding AKS version has reached end of life. You can check the [AKS Kubernetes release calendar](./supported-kubernetes-versions.md#aks-kubernetes-release-calendar) for information on AKS version support windows.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).

## Install the OSM add-on on your cluster

1. If you don't have one already, create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

2. Create a new AKS cluster with the OSM add-on installed using the [`az aks create`][az-aks-create] command and specify `open-service-mesh` for the `--enable-addons` parameter.

    ```azurecli-interactive
    az aks create \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --enable-addons open-service-mesh
    ```

> [!IMPORTANT]
> You can't enable the OSM add-on on an existing cluster if an OSM mesh is already on your cluster. Uninstall any existing OSM meshes on your cluster before enabling the OSM add-on.
>
> When installing on an existing clusters, use the [`az aks enable-addons`][az-aks-enable-addons] command. The following code shows an example:
>
> ```azurecli-interactive
> az aks enable-addons \
>  --resource-group myResourceGroup \
>  --name myAKSCluster \
>  --addons open-service-mesh
> ```

## Get the credentials for your cluster

- Get the credentials for your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Verify the OSM add-on is installed on your cluster

- Verify the OSM add-on is installed on your cluster using the [`az aks show`][az-aks-show] command with and specify `'addonProfiles.openServiceMesh.enabled'` for the `--query` parameter. In the output, under `addonProfiles`, the `enabled` value should show as `true` for `openServiceMesh`.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster  --query 'addonProfiles.openServiceMesh.enabled'
    ```

## Verify the OSM mesh is running on your cluster

1. Verify the version, status, and configuration of the OSM mesh running on your cluster using the `kubectl get deployment` command and display the image version of the *osm-controller* deployment.

    ```azurecli-interactive
    kubectl get deployment -n kube-system osm-controller -o=jsonpath='{$.spec.template.spec.containers[:1].image}'
    ```

    The following example output shows version *0.11.1* of the OSM mesh:

    ```output
    mcr.microsoft.com/oss/openservicemesh/osm-controller:v0.11.1
    ```

2. Verify the status of the OSM components running on your cluster using the following `kubectl` commands to show the status of the `app.kubernetes.io/name=openservicemesh.io` deployments, pods, and services.

    ```azurecli-interactive
    kubectl get deployments -n kube-system --selector app.kubernetes.io/name=openservicemesh.io
    kubectl get pods -n kube-system --selector app.kubernetes.io/name=openservicemesh.io
    kubectl get services -n kube-system --selector app.kubernetes.io/name=openservicemesh.io
    ```

    > [!IMPORTANT]
    > If any pods have a status other than `Running`, such as `Pending`, your cluster might not have enough resources to run OSM. Review the sizing for your cluster, such as the number of nodes and the virtual machine's SKU, before continuing to use OSM on your cluster.

3. Verify the configuration of your OSM mesh using the `kubectl get meshconfig` command.

    ```azurecli-interactive
    kubectl get meshconfig osm-mesh-config -n kube-system -o yaml
    ```

    The following example output shows the configuration of an OSM mesh:

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

    The example output shows `enablePermissiveTrafficPolicyMode: true`, which means OSM has permissive traffic policy mode enabled. With this mode enabled in your OSM mesh:

   - The [SMI][smi] traffic policy enforcement is bypassed.
   - OSM automatically discovers services that are a part of the service mesh.
   - OSM creates traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

## Delete your cluster

- When you no longer need the cluster, you can delete it using the [`az group delete`][az-group-delete] command, which removes the resource group, the cluster, and all related resources.

    ```azurecli-interactive
    az group delete --name myResourceGroup --yes --no-wait
    ```

> [!NOTE]
> Alternatively, you can uninstall the OSM add-on and the related resources from your cluster. For more information, see [Uninstall the Open Service Mesh add-on from your AKS cluster][osm-uninstall].

## Next steps

This article showed you how to install the OSM add-on on an AKS cluster and verify it's installed and running. With the OSM add-on installed on your cluster, you can [deploy a sample application][osm-deploy-sample-app] or [onboard an existing application][osm-onboard-app] to work with your OSM mesh.

<!-- LINKS -->
[osm-uninstall]: open-service-mesh-uninstall-add-on.md
[smi]: https://smi-spec.io/
[osm-deploy-sample-app]: https://release-v1-0.docs.openservicemesh.io/docs/getting_started/install_apps/
[osm-onboard-app]: https://release-v1-0.docs.openservicemesh.io/docs/guides/app_onboarding/
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-group-delete]: /cli/azure/group#az_group_delete
[az-aks-enable-addons]: /cli/azure/aks#az_aks_enable_addons
