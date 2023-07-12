---
title: Upgrade Istio-based service mesh add-on for Azure Kubernetes Service (preview)
description: Upgrade Istio-based service mesh add-on for Azure Kubernetes Service (preview)
ms.topic: conceptual
ms.date: 05/04/2023

---

# Upgrade Istio-based service mesh add-on for Azure Kubernetes Service (preview)

This article addresses upgrade experiences for Istio-based service mesh add-on for Azure Kubernetes Service (preview)

## How Istio components are upgraded

**Minor version:** Currently the Istio add-on only has minor version 1.17 available. Minor version upgrade experiences are planned for when newer versions of Istio (1.18) are introduced.

**Patch version:**

* Istio add-on patch version availability information is published in [AKS weekly release notes][aks-release-notes].
* Patches are rolled out automatically for istiod and ingress pods as part of these AKS weekly releases.
* User needs to initiate patches to Istio proxy in their workloads by restarting the pods for reinjection:
  * Check the version of the Istio proxy intended for new or restarted pods. This version is the same as the version of the istiod and Istio ingress pods after they were patched:

    ```bash
    kubectl get cm -n aks-istio-system -o yaml | grep "mcr.microsoft.com\/oss\/istio\/proxyv2"
    ```

    Example output:

    ```bash
    "image": "mcr.microsoft.com/oss/istio/proxyv2:1.17.2-distroless",
    "image": "mcr.microsoft.com/oss/istio/proxyv2:1.17.2-distroless"
    ```

  * Check the Istio proxy image version for all pods in a namespace:

    ```bash
    kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
    sort |\
    grep "mcr.microsoft.com\/oss\/istio\/proxyv2"
    ```

    Example output:

    ```bash
    productpage-v1-979d4d9fc-p4764:	docker.io/istio/examples-bookinfo-productpage-v1:1.17.0, mcr.microsoft.com/oss/istio/proxyv2:1.17.1-distroless
    ```

  * Restart the workloads to trigger reinjection. For example:

    ```bash
    kubectl rollout restart deployments/productpage-v1 -n default
    ```

  * To verify that they're now on the newer versions, check the Istio proxy image version again for all pods in the namespace:

    ```bash
    kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
    sort |\
    grep "mcr.microsoft.com\/oss\/istio\/proxyv2"
    ```

    Example output:

    ```bash
    productpage-v1-979d4d9fc-p4764:	docker.io/istio/examples-bookinfo-productpage-v1:1.17.0, mcr.microsoft.com/oss/istio/proxyv2:1.17.2-distroless
    ```

[aks-release-notes]: https://github.com/Azure/AKS/releases