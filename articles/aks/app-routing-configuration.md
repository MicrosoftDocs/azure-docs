---
title: Customize configuration on the NGINX ingress controller
description: Understand the advanced configuration options that are supported with the application routing add-on with the NGINX ingress controller for Azure Kubernetes Service. 
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/21/2023
---

#  Set up advanced NGINX ingress controller configurations with the application routing add-on

This article shows you how to do advanced NGINX ingress controller configuration such as creating multiple NGINX ingress controllers. You can also configure things such as private load balancers and static IP addresses by setting [load balancer annotations](https://learn.microsoft.com/azure/aks/load-balancer-standard) on the NGINX ingress controller's service.

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

1. Create the NGINX ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

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

1. Create the NGINX ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f nginx-internal-controller.yaml
    ```

    The following example output shows the created resource:

    ```output
    nginxingresscontroller.approuting.kubernetes.azure.com/nginx-internal created
    ```

## Create an NGINX ingress controller with a static IP address

To create an NGINX ingress controller with a static IP address on the Azure Load Balancer:

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myNetworkResourceGroup --location eastus
    ```

1. Create a static public IP address using the [`az network public ip create`][az-network-public-ip-create] command.

    ```azurecli-interactive
    az network public-ip create \
        --resource-group myNetworkResourceGroup \
        --name myIngressPublicIP \
        --sku Standard \
        --allocation-method static
    ```

    > [!NOTE]
    > If you're using a *Basic* SKU load balancer in your AKS cluster, use *Basic* for the `--sku` parameter when defining a public IP. Only *Basic* SKU IPs work with the *Basic* SKU load balancer and only *Standard* SKU IPs work with *Standard* SKU load balancers.

1. Ensure the cluster identity used by the AKS cluster has delegated permissions to the public IP's resource group using the [`az role assignment create`][az-role-assignment-create] command.

    > [!NOTE]
    > Update *`<ClusterName>`* and *`<ClusterResourceGroup>`* with your AKS cluster's name and resource group name.

    ```azurecli-interactive
    CLIENT_ID=$(az aks show --name <ClusterName> --resource-group <ClusterResourceGroup> --query identity.principalId -o tsv)
    RG_SCOPE=$(az group show --name myNetworkResourceGroup --query id -o tsv)
    az role assignment create \
        --assignee ${CLIENT_ID} \
        --role "Network Contributor" \
        --scope ${RG_SCOPE}
    ```

1. Copy the following YAML manifest into a new file named **nginx-staticip-controller.yaml** and save the file to your local computer.

    > [!NOTE]
    > You can either use `service.beta.kubernetes.io/azure-pip-name` for public IP name, or use `service.beta.kubernetes.io/azure-load-balancer-ipv4` for an IPv4 address and `service.beta.kubernetes.io/azure-load-balancer-ipv6` for an IPv6 address, as shown in the example YAML. Adding the `service.beta.kubernetes.io/azure-pip-name` annotation ensures the most efficient LoadBalancer creation and is highly recommended to avoid potential throttling. 

    ```yml
    apiVersion: approuting.kubernetes.azure.com/v1alpha1
    kind: NginxIngressController
    metadata:
      name: nginx-static
    spec:
      ingressClassName: nginx-static
      controllerNamePrefix: nginx-static
      loadBalancerAnnotations: 
        service.beta.kubernetes.io/azure-pip-name: "myIngressPublicIP"
        service.beta.kubernetes.io/azure-load-balancer-resource-group: "myNetworkResourceGroup"
    ```

1. Create the NGINX ingress controller resources using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f nginx-staticip-controller.yaml
    ```

    The following example output shows the created resource:

    ```output
    nginxingresscontroller.approuting.kubernetes.azure.com/nginx-static created
    ```

## Verify the ingress controller was created

You can verify the status of the NGINX ingress controller using the [`kubectl get nginxingresscontroller`][kubectl-get] command.

> [!NOTE]
> Update *`<IngressControllerName>`* with name you used when creating the `NginxIngressController``.

```bash
kubectl get nginxingresscontroller -n <IngressControllerName>
```

The following example output shows the created resource. It may take a few minutes for the controller to be available:

```output
NAME           INGRESSCLASS   CONTROLLERNAMEPREFIX   AVAILABLE
nginx-public   nginx-public   nginx                  True
```

You can also view the conditions to troubleshoot any issues:

```bash
kubectl get nginxingresscontroller -n <IngressControllerName> -o jsonpath='{range .items[*].status.conditions[*]}{.lastTransitionTime}{"\t"}{.status}{"\t"}{.type}{"\t"}{.message}{"\n"}{end}'
```

The following example output shows the conditions of a healthy ingress controller:

```output
2023-11-29T19:59:24Z    True    IngressClassReady       Ingress Class is up-to-date
2023-11-29T19:59:50Z    True    Available               Controller Deployment has minimum availability and IngressClass is up-to-date
2023-11-29T19:59:50Z    True    ControllerAvailable     Controller Deployment is available
2023-11-29T19:59:25Z    True    Progressing             Controller Deployment has successfully progressed
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

## Clean up

You can remove the NGINX ingress controller using the [`kubectl delete nginxingresscontroller`][kubectl-delete] command.

> [!NOTE]
> Update *`<IngressControllerName>`* with name you used when creating the `NginxIngressController``.

```bash
kubectl delete nginxingresscontroller -n <IngressControllerName>
```

## Next steps

Learn about monitoring the ingress-nginx controller metrics included with the application routing add-on with [with Prometheus in Grafana][prometheus-in-grafana] as part of analyzing the performance and usage of your application.

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete

<!-- LINKS - internal -->
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[az-network-public-ip-list]: /cli/azure/network/public-ip#az_network_public_ip_list
[az-group-create]: /cli/azure/group#az-group-create
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
