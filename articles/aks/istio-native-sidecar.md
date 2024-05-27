---
title: Enable native sidecar mode for Istio-based service mesh add-on in Azure Kubernetes Service (AKS) (preview)
description: Enable native sidecar mode for Istio-based service mesh add-on in Azure Kubernetes Service (AKS) (preview).
ms.topic: article
ms.service: azure-kubernetes-service
ms.date: 05/07/2024
ms.author: fuyuanbie
author: biefy
---

# Enable native sidecar mode for Istio-based service mesh add-on in Azure Kubernetes Service (AKS) (preview)

Kubernetes native sidecar aims to provide a more robust and user-friendly way to incorporate sidecar patterns into Kubernetes applications, improving efficiency, reliability, and simplicity.

Native sidecar is a good fit for Istio. It offers several benefits, such as simplified sidecar management. Additionally, it improves reliability and coordination. It also optimizes resources and enhances operational efficiency.

Starting from Kubernetes version 1.29, [sidecar containers][k8s-native-sidecar-support] feature is turned on for AKS. With this change, [Istio native sidecar mode][istio-native-sidecar-support] can be used with the Istio add-on for AKS.

This article walks through how to enable native sidecar mode for Istio based service mesh on AKS.

## Before you begin

1. Register `IstioNativeSidecarModePreview` feature flag through [az feature register][az-feature-register].

    ```bash
    az feature register --namespace Microsoft.ContainerService --name IstioNativeSidecarModePreview
    ```

2. Verify the registration status through [az feature show][az-feature-show].

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

1. Check that the AKS cluster's Kubernetes control plane version is 1.29 or higher using [az aks show][az-aks-show].

   ```bash
   az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER -o json | jq ".kubernetesVersion"
   ```

   If the control plane version is too old, [upgrade Kubernetes control plane][upgrade-aks-cluster].

2. Make sure node pools runs `1.29` or newer version and power state is running.

   ```bash
   az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER -o json | jq ".agentPoolProfiles[] | { currentOrchestratorVersion, powerState}"
   ```

   > [!CAUTION]
   > Native sidecar mode requires both Kubernetes control plane and data plane on 1.29+. Make sure all your nodes have been upgraded to 1.29 before enabling native sidecar mode. Otherwise, sidecars will not work as expected.

   If any node pool version is too old, [upgrade-node-image][upgrade-node-image] to `1.29` or newer version.

3. Make sure Istio add-on is on `asm-1-20` or newer revision.

   ```bash
   az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER -o json | jq ".serviceMeshProfile.istio.revisions"
   ```

   If `istiod` is too old, upgrade to `asm-1-20` or newer by following the steps in [Istio upgrade][istio-upgrade].


### Check native sidecar feature status on Istio control plane

AKS cluster needs to be reconciled with [az aks update][az-aks-update] command.

```bash
az aks update --resource-group $RESOURCE_GROUP --name $CLUSTER
```

When native sidecar mode is enabled, environment variable `ENABLE_NATIVE_SIDECARS` appears with value `true` in Istio's control plane pod template. Use the following command to check `istiod` deployment.

```bash
kubectl get deployment -l app=istiod -n aks-istio-system -o json | jq '.items[].spec.template.spec.containers[].env[] | select(.name=="ENABLE_NATIVE_SIDECARS")'
```

### Restart workloads

Once Istio control plane is ready, do a rolling restart of workloads to let `istiod` inject native sidecars.

```bash
for ns in $(kubectl get ns -l istio.io/rev -o=jsonpath='{.items[0].metadata.name}'); do
  kubectl rollout restart deployments -n $ns
done
```

For deployments having istio sidecars injected with [istioctl kube-inject][istioctl-kube-inject], you need to reinject sidecars.

### Check sidecar injection

If native side mode is successfully enabled, `istio-proxy` container is shown as an init container. Use the following command to check sidecar injection:

```bash
kubectl get pods -o "custom-columns=NAME:.metadata.name,INIT:.spec.initContainers[*].name,CONTAINERS:.spec.containers[*].name"
```

`istio-proxy` container should be shown as an init container.

```bash
NAME                     INIT                     CONTAINERS
sleep-7656cf8794-5b5j4   istio-init,istio-proxy   sleep
```

## Create a new cluster

When creating a new AKS cluster with [az aks create][az-aks-create] command, choose a version `1.29` or newer, istio `asm-1-20` or newer. The new cluster should have native sidecar mode turned on automatically.

```bash
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $CLUSTER \
  --enable-asm \
  --kubernetes-version 1.29 \
  --revision asm-1-20
  ...
```

## Next steps

* [Deploy external or internal ingresses for Istio service mesh add-on][istio-deploy-ingress].

<!--- External Links --->
[istio-native-sidecar-support]: https://istio.io/latest/blog/2023/native-sidecars/
[istioctl-kube-inject]: https://istio.io/latest/docs/reference/commands/istioctl/#istioctl-kube-inject
[k8s-native-sidecar-support]: https://kubernetes.io/blog/2023/08/25/native-sidecar-containers/

<!--- Internal Links --->
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
[istio-deploy-ingress]: ./istio-deploy-ingress.md
[istio-upgrade]: ./istio-upgrade.md
[upgrade-aks-cluster]: ./upgrade-aks-cluster.md
[upgrade-node-image]: ./node-image-upgrade.md