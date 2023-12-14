---
title: Upgrade Istio-based service mesh add-on for Azure Kubernetes Service (preview)
description: Upgrade Istio-based service mesh add-on for Azure Kubernetes Service (preview)
ms.topic: conceptual
ms.date: 05/04/2023

---

# Upgrade Istio-based service mesh add-on for Azure Kubernetes Service (preview)

This article addresses upgrade experiences for Istio-based service mesh add-on for Azure Kubernetes Service (preview)

## How Istio components are upgraded

**Minor version:** Istio addon only allows upgrading the minor version using [canary upgrade process][istio-canary-upstream]. When an upgrade is initiated, the control plane of the new revision is deployed alongside the old revision's control plane. The user can then manually roll over data plane workload while using their monitoring tools to track the health of their workloads during this process. If they are satisfied that everything is working as expected with their workloads, they may complete the upgrade so that only the new revision remains on the cluster. Else they may rollback to the previous revision.

The following example illustrates how to upgrade from revision `asm-1-17` to `asm-1-18`. The steps are the same for upgrades between any two successive revisions:

1. Use the upgrade discovery command to check which revisions are available for the cluster as upgrade targets:

    ```bash
    az aks mesh get-upgrades --resource-group $RESOURCE_GROUP --name $CLUSTER
    ```

1. Initiate canary upgrade from revision `asm-1-17` to `asm-1-18`:

    ```bash
    az aks mesh upgrade start --resource-group $RESOURCE_GROUP --name $CLUSTER --revision asm-1-18
    ```

    Canary upgrade means the 1.18 control plane will come up alongside the 1.17 control plane. They will continue to coexist until you either complete or roll back the upgrade.

1. Verify control plane pods corresponding to both asm-1-17 and asm-1-18 exist:

    * Verify `istiod` pods:

        ```bash
        kubectl get pods -n aks-istio-system
        ```

        Example output:

        ```
        NAME                                        READY   STATUS    RESTARTS   AGE
        istiod-asm-1-17-55fccf84c8-dbzlt            1/1     Running   0          58m
        istiod-asm-1-17-55fccf84c8-fg8zh            1/1     Running   0          58m
        istiod-asm-1-18-f85f46bf5-7rwg4             1/1     Running   0          51m
        istiod-asm-1-18-f85f46bf5-8p9qx             1/1     Running   0          51m
        ```

    * Verify ingress pods:

        ```bash
        kubectl get pods -n aks-istio-ingress
        ```


        Example output:

        ```
        NAME                                                          READY   STATUS    RESTARTS   AGE
        aks-istio-ingressgateway-external-asm-1-17-58f889f99d-qkvq2   1/1     Running   0          59m
        aks-istio-ingressgateway-external-asm-1-17-58f889f99d-vhtd5   1/1     Running   0          58m
        aks-istio-ingressgateway-external-asm-1-18-7466f77bb9-ft9c8   1/1     Running   0          51m
        aks-istio-ingressgateway-external-asm-1-18-7466f77bb9-wcb6s   1/1     Running   0          51m
        aks-istio-ingressgateway-internal-asm-1-17-579c5d8d4b-4cc2l   1/1     Running   0          58m
        aks-istio-ingressgateway-internal-asm-1-17-579c5d8d4b-jjc7m   1/1     Running   0          59m
        aks-istio-ingressgateway-internal-asm-1-18-757d9b5545-g89s4   1/1     Running   0          51m
        aks-istio-ingressgateway-internal-asm-1-18-757d9b5545-krq9w   1/1     Running   0          51m
        ```

1. Relabel the namespace so that any new pods coming up get the Istio sidecar associated witht the new revision and its control plane:

    ```bash
    kubectl label namespace default istio.io/rev=asm-1-18 --overwrite
    ```

1. Individually roll over each of your application workloads by restarting them. For example:

    ```bash
    kubectl rollout restart deployment <deployment name>
    ```

1. Check your monitoring tools and dashboards to see if you are satisfied that the workloads are all running in a healthy state after they were restarted. Based  you have two options - 

    * **Complete the canary upgrade**: If you are satisfied that the workloads are all running in a healthy state as expected, run the following command to complete the canary upgrade:

      ```bash
      az aks mesh upgrade complete --resource-group $RESOURCE_GROUP --name $CLUSTER
      ```

    * **Rollback the canary upgrade**: If you are not satisfied with the workload health and want to rollback to the prevision revision of Istio:

      * Relabel the namespace to the older revision

      ```bash
      kubectl label namespace default istio.io/rev=asm-1-17 --overwrite
      ```

      * Roll back the workloads to use the sidecar corresponding to the older Istio revision by restarting these workloads again:

      ```bash
      kubectl rollout restart deployment <deployment name>
      ```

      * Roll back the workloads to use the sidecar corresponding to the older Istio revision by restarting these workloads again:

      ```
      az aks mesh upgrade rollback --resource-group $RESOURCE_GROUP --name $CLUSTER
      ```

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
[istio-canary-upstream]: https://istio.io/latest/docs/setup/upgrade/canary/