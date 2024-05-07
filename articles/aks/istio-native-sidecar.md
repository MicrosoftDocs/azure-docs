---
title: Enable native sidecar mode for Istio-based service mesh addon in Azure Kubernetes Service (AKS) (preview)
description: Enable native sidecar mode for Istio-based service mesh addon in Azure Kubernetes Service (AKS) (preview)
ms.topic: conceptual
ms.date: 05/07/2024
ms.author: fuyuanbie
---

# Enable native sidecar mode for Istio-based service mesh addon in Azure Kubernetes Service (AKS) (preview)

Starting from Kubernetes `1.29`, [SidecarContainers][k8s-native-sidecar-support] feature is turned on for AKS. With this change, [Istio native sidecar mode][istio-native-sidecar-support] becomes a supported mode.

This article walks through how to enable native sidecar mode for Istio based service mesh on AKS.

## Before you begin

  At preview phase, turning on the native sidecar mode requires explicit opt-in by registering a feature flag to your subscription.

1. Register `IstioNativeSidecarModePreview` feature flag through [az feature register][az-feature-register].

    ```bash
    az feature register --namespace Microsoft.ContainerService --name IstioNativeSidecarModePreview
    ```

2. Verfiy the registion status through [az feature show][az-feature-show].

    ```bash
    az feature show --namespace Microsoft.ContainerService --name IstioNativeSidecarModePreview
    ```

    It takes a few minutes for the status to show `Registered`.

3. When the status reflects Registered, refresh the registration of the `Microsoft.ContainerService` resource provider through [az provider register][az-provider-register].

    ```bash
    az provider register --namespace Microsoft.ContainerService
    ```

## On an existing cluster

### Check versions

1. Make sure control plane has been upgraded to `1.29` or newer version with [az aks show][az-aks-show].

   ```bash
   az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER -o json | jq ".kubernetesVersion"
   ```

   If the control plane version is too old, upgrade Kubernetes control plane.

2. Make sure agent pools have been upgraded to `1.29` or newer version and power state is running.

   ```bash
   az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER -o json | jq ".agentPoolProfiles[] | { currentOrchestratorVersion, powerState}"
   ```

   > [!CAUTION]
   > Native sidecar mode requires both Kubernetes control plane and data plane on 1.29+. Make sure all your nodes have been upgraded to 1.29 before enabling native sidecar mode. Otherwise, your sidecar will not work as expected.

   If any agent pool version is too old, upgrade it `1.29` or newer version.

3. Make sure Istio addon is on `asm-1-20` or newer revision.

   ```bash
   az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER -o json | jq ".serviceMeshProfile.istio.revisions"
   ```

   If istiod is too old, upgrade to `asm-1-20` or newer following [Istio upgrade][istio-upgrade].


### Check Istiod for injecting native sidecars

Run the following command to check istiod deployment. 

```bash
kubectl get deployment -l app=istiod -n aks-istio-system -o json | jq '.items[].spec.template.spec.containers[].env[] | select(.name=="ENABLE_NATIVE_SIDECARS")'
```

Make sure environment variable `ENABLE_NATIVE_SIDECARS` appears with value `true` in the pod template.

It make take a while for AKS infrastructure to reconciliate all necessary artifacts.  If you don't want to wait, run [az aks update][az-aks-update] to force a reconciliation.

```bash
az aks update --resource-group $RESOURCE_GROUP --name $CLUSTER
```

### Restart workloads

Once Istio control plane is ready, do a rolling restart of workloads to let Istiod inject native sidecars.

```bash
kubectl get pod -o "custom-columns=NAME:.metadata.name,INIT:.spec.initContainers[*].name,CONTAINERS:.spec.containers[*].name"
```

If native side mode is successfully enabled, `istio-proxy` container is shown as an init container.

```bash
NAME                     INIT                     CONTAINERS
sleep-7656cf8794-5b5j4   istio-init,istio-proxy   sleep
```

## Create a new cluster

For new AKS cluster with [az aks create][az-aks-create], choose a version `1.29` or newer, istio `asm-1-20` or newer. The new cluster should have native sidecar mode turned on automatically.

```bash
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER \
  --enable-asm \
  --revision asm-1-21
  ...
```

[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
[istio-native-sidecar-support]: https://istio.io/latest/blog/2023/native-sidecars/
[k8s-native-sidecar-support]: https://kubernetes.io/blog/2023/08/25/native-sidecar-containers/
