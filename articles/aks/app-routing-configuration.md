---
title: Customize configuration on the NGINX ingress controller
description: Understand the advanced configuration options that are supported with the application routing add-on with the NGINX ingress controller for Azure Kubernetes Service. 
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/21/2023
---

#  Set up advanced NGINX ingress controller configurations with the application routing add-on

This article shows you how to set up an advanced NGINX ingress controller configuration such as creating multiple NGINX ingress controllers and configuring private load balancers.

## Application routing add-on with NGINX features

The application routing add-on with NGINX creates an ingress controller configured with a public facing Azure load balancer. That ingress controller uses a class name of `webapprouting.kubernetes.azure.com`. To configure additional ingress controllers or modify existing configuration such as load balancer visibility, you can utilize the `NginxIngressController` custom resource definition (CRD).

## Prerequisites

- An AKS cluster with the [application routing add-on][app-routing-add-on-basic-configuration].

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local computer, you use `kubectl`, the Kubernetes command-line client. You can install it locally using the [az aks install-cli][az-aks-install-cli] command. If you use the Azure Cloud Shell, `kubectl` is already installed.

Configure kubectl to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

```azurecli-interactive
az aks get-credentials -g <ResourceGroupName> -n <ClusterName>
```

## Create a public facing NGINX ingress controller

To create an NGINX ingress controller with a public facing Azure Load Balancer:

1. Copy the following YAML manifest into a new file named **nginx-public-controller.yaml** and save the file to your local computer.

    ```yml
    apiVersion: approuting.kubernetes.azure.com/v1alpha1
    kind: NginxIngressController
    metadata:
      name: nginx-public
    spec:
      ingressClassName: nginx-public
      controllerNamePrefix: nginx-public
    ```

1. Create the ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f nginx-public-controller.yaml
    ```

    The following example output shows the created resource:

    ```output
    nginxingresscontroller.approuting.kubernetes.azure.com/nginx-public created
    ```

## Create an internal NGINX ingress controller

To create an NGINX ingress controller with an internal facing Azure Load Balancer:

1. Copy the following YAML manifest into a new file named **nginx-internal-controller.yaml** and save the file to your local computer.

    ```yml
    apiVersion: approuting.kubernetes.azure.com/v1alpha1
    kind: NginxIngressController
    metadata:
      name: nginx-internal
    spec:
      ingressClassName: nginx-internal
      controllerNamePrefix: nginx-internal
      loadBalancerAnnotations: 
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    ```

1. Create the ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f nginx-internal-controller.yaml
    ```

    The following example output shows the created resource:

    ```output
    nginxingresscontroller.approuting.kubernetes.azure.com/nginx-internal created
    ```

## Use the ingress controller in an ingress

1. Copy the following YAML manifest into a new file named **ingress.yaml** and save the file to your local computer.

    > [!NOTE]
    > Update *`<Hostname>`* with your DNS host name.
    > The *`<IngressClassName>`* is the one you defined when creating the `NginxIngressController`.

    ```yml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: aks-helloworld
      namespace: hello-web-app-routing
    spec:
      ingressClassName: <IngressClassName>
      rules:
      - host: <Hostname>
        http:
          paths:
          - backend:
              service:
                name: aks-helloworld
                port:
                  number: 80
            path: /
            pathType: Prefix
    ```

3. Create the cluster resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f ingress.yaml -n hello-web-app-routing
    ```

    The following example output shows the created resource:

    ```output
    ingress.networking.k8s.io/aks-helloworld created
    ```

## Verify the managed Ingress was created

You can verify the managed Ingress was created using the [`kubectl get ingress`][kubectl-get] command.

```bash
kubectl get ingress -n hello-web-app-routing
```

## Next steps

Learn about monitoring the ingress-nginx controller metrics included with the application routing add-on with [with Prometheus in Grafana][prometheus-in-grafana] as part of analyzing the performance and usage of your application.

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[summary-msi]: use-managed-identity.md#summary-of-managed-identities
[rbac-owner]: ../role-based-access-control/built-in-roles.md#owner
[rbac-classic]: ../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles
[app-routing-add-on-basic-configuration]: app-routing.md
[csi-secrets-store-autorotation]: csi-secrets-store-configuration-options.md#enable-and-disable-auto-rotation
[azure-key-vault-overview]: ../key-vault/general/overview.md
[az-aks-approuting-update]: /cli/azure/aks/approuting#az-aks-approuting-update
[az-aks-approuting-zone]: /cli/azure/aks/approuting/zone
[az-network-dns-zone-show]: /cli/azure/network/dns/zone#az-network-dns-zone-show
[az-network-dns-zone-create]: /cli/azure/network/dns/zone#az-network-dns-zone-create
[az-keyvault-certificate-import]: /cli/azure/keyvault/certificate#az-keyvault-certificate-import
[az-keyvault-create]: /cli/azure/keyvault#az-keyvault-create
[authorization-systems]: ../key-vault/general/rbac-access-policy.md
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[create-and-export-a-self-signed-ssl-certificate]: #create-and-export-a-self-signed-ssl-certificate
[create-an-azure-dns-zone]: #create-a-global-azure-dns-zone
[azure-dns-overview]: ../dns/dns-overview.md
[az-keyvault-certificate-show]: /cli/azure/keyvault/certificate#az-keyvault-certificate-show
[prometheus-in-grafana]: app-routing-nginx-prometheus.md
