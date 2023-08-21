---
title: Migrate from HTTPS application routing to the application routing add-on
description: Learn how to migrate from the deprecated HTTP application routing feature to the application routing add-on.
ms.topic: how-to
ms.author: nickoman
author: nickomang
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 08/18/2023
---

# Migrate from HTTP application routing to the application routing add-on

In this article, you'll learn how to migrate your Azure Kubernetes Service (AKS) cluster from HTTP application routing feature to the [application routing add-on](./app-routing.md). The HTTP application routing add-on has been retired and won't work on any cluster Kubernetes version currently in support, so we recommend migrating as soon as possible to maintain a supported configuration.

## Prerequisites

Azure CLI version `2.49.0` or later. If you haven't yet, follow the instructions to [Install Azure CLI][install-azure-cli]. Run `az --version` to find the version, and run `az upgrade` to upgrade the version if not already on the latest.

## Update your cluster's add-ons, ingresses, and IP usage

1. Enable the application routing add-on.

    ```azurecli-interactive
    az aks enable-addons -g <ResourceGroupName> -n <ClusterName> --addons web_application_routing
    ```

2. Update your ingresses, setting `ingressClassName` to `nginx`. Removing the `kubernetes.io/ingress.class` annotation, and add `approuting.kubernetes.azure.com/resources` with a value of `nginx`. You'll also need to update the host to one that you own, as the application routing add-on doesn't have a managed cluster DNS zone.

    Initially, your ingress configuration will look something like this:

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
    name: aks-helloworld
    annotations:
        kubernetes.io/ingress.class: addon-http-application-routing  # Remove this
    spec:
    rules:
    - host: aks-helloworld.<CLUSTER_SPECIFIC_DNS_ZONE>
        http:
        paths:
        - path: /
            pathType: Prefix
            backend:
            service: 
                name: aks-helloworld
                port: 
                number: 80
    ```

    After you've properly updated, the same configuration will look like the following:

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
    name: aks-helloworld
    annotations:
        approuting.kubernetes.azure.com/resources: nginx
    spec:
    ingressClassName: nginx
    rules:
    - host: aks-helloworld.<CLUSTER_SPECIFIC_DNS_ZONE> # Replace with your own value
        http:
        paths:
        - path: /
            pathType: Prefix
            backend:
            service: 
                name: aks-helloworld
                port: 
                number: 80
    ```

3. Update any downstream usage of the ingress controller's IP (mainly, DNS records) with the new nginx ingress controller IP.

4. Disable the HTTP application routing add-on.

    ```azurecli-interactive
    az aks disable-addons -g <ResourceGroupName> -n <ClusterName> --addons http_application_routing
    ```

## Remove and delete all HTTP application routing resources

1. After the HTTP application routing add-on is disabled, some related Kubernetes resources may remain in your cluster. These resources include *configmaps* and *secrets* that are created in the *kube-system* namespace. To maintain a clean cluster, you may want to remove these resources. Look for *addon-http-application-routing* resources using the following [`kubectl get`][kubectl-get] commands:

    ```bash
    kubectl get deployments --namespace kube-system
    kubectl get services --namespace kube-system
    kubectl get configmaps --namespace kube-system
    kubectl get secrets --namespace kube-system
    ```

    The following example output shows *configmaps* that should be deleted:

    ```output
    NAMESPACE     NAME                                                       DATA   AGE
    kube-system   addon-http-application-routing-nginx-configuration         0      9m7s
    kube-system   addon-http-application-routing-tcp-services                0      9m7s
    kube-system   addon-http-application-routing-udp-services                0      9m7s
    ```

1. Delete remaining resources using the [`kubectl delete`][kubectl-delete] command. Make sure to specify the resource type, resource name, and namespace. The following example deletes one of the previous configmaps:

    ```bash
    kubectl delete configmaps addon-http-application-routing-nginx-configuration --namespace kube-system
    ```

1. Repeat the previous `kubectl delete` step for all *addon-http-application-routing* resources remaining in your cluster.

## Next steps

After migrating to the application routing add-on, learn how to [monitor ingress controller metrics with Prometheus and Grafana](./app-routing-nginx-prometheus.md).

<!-- INTERNAL LINKS -->
[install-azure-cli]: /cli/azure/install-azure-cli
[ingress-https]: ./ingress-tls.md

<!-- EXTERNAL LINKS -->
[dns-pricing]: https://azure.microsoft.com/pricing/details/dns/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete