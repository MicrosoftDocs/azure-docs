---
title: Frequently asked questions for Istio-based service mesh add-on for Azure Kubernetes Service (preview)
description: Find answers to some of the common questions about Istio-based service mesh add-on for Azure Kubernetes Service (preview).
ms.topic: conceptual
ms.date: 05/04/2023

---

# Frequently asked questions about Istio-based service mesh add-on for Azure Kubernetes Service (preview)

This article addresses frequent questions about Istio-based service mesh add-on for Azure Kubernetes Service (preview).

## How are upgrades done for the Istio components

**Minor version:** Currently the Istio addon only has one version 1.17. So minor versions aren't yet available. Minor version upgrade experiences are planned for when newer versions of Istio (1.18) are introduced.

**Patch version:**

* Istio patch version availability information is published to [AKS weekly release notes][aks-release-notes].
* Patches are done automatically for istiod and ingress pods as part of these AKS weekly releases.
* User needs to initiate patches to istio proxy in their workloads by restarting the pods for reinjection:
  * Check the version of the Istio proxy intended for new or restarted pods. This version is the same as the version of the istiod and istio ingress pods after they were patched:

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