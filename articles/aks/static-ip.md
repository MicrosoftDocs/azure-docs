---
title: Use a static IP with a load balancer in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to create and use a static IP address with the Azure Kubernetes Service (AKS) load balancer.
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 02/27/2023

#Customer intent: As a cluster operator or developer, I want to create and manage static IP address resources in Azure that I can use beyond the lifecycle of an individual Kubernetes service deployed in an AKS cluster.
---

# Use a static public IP address and DNS label with the Azure Kubernetes Service (AKS) load balancer

When you create a load balancer resource in an Azure Kubernetes Service (AKS) cluster, the public IP address assigned to it is only valid for the lifespan of that resource. If you delete the Kubernetes service, the associated load balancer and IP address are also deleted. If you want to assign a specific IP address or retain an IP address for redeployed Kubernetes services, you can create and use a static public IP address.

This article shows you how to create a static public IP address and assign it to your Kubernetes service.

## Before you begin

* This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].
* You need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* This article covers using a *Standard* SKU IP with a *Standard* SKU load balancer. For more information, see [IP address types and allocation methods in Azure][ip-sku].

## Create a static IP address

1. Create a resource group for your IP address

    ```azurecli-interactive
    az group create --name myNetworkResourceGroup
    ```

2. Use the [`az network public ip create`][az-network-public-ip-create] command to create a static public IP address. The following example creates a static IP resource named *myAKSPublicIP* in the *myNetworkResourceGroup* resource group.

    ```azurecli-interactive
    az network public-ip create \
        --resource-group myNetworkResourceGroup \
        --name myAKSPublicIP \
        --sku Standard \
        --allocation-method static
    ```

    > [!NOTE]
    > If you're using a *Basic* SKU load balancer in your AKS cluster, use *Basic* for the `--sku` parameter when defining a public IP. Only *Basic* SKU IPs work with the *Basic* SKU load balancer and only *Standard* SKU IPs work with *Standard* SKU load balancers.

3. After you create the static public IP address, use the [`az network public-ip list`][az-network-public-ip-list] command to get the IP address. Specify the name of the node resource group and public IP address you created, and query for the *ipAddress*.

    ```azurecli-interactive
    az network public-ip show --resource-group myNetworkResourceGroup --name myAKSPublicIP --query ipAddress --output tsv
    ```

## Create a service using the static IP address

1. Before creating a service, use the [`az role assignment create`][az-role-assignment-create] command to ensure the cluster identity used by the AKS cluster has delegated permissions to the node resource group.

    ```azurecli-interactive
    CLIENT_ID=$(az aks show --name <cluster name> --resource-group <cluster resource group> --query identity.principalId -o tsv)
    RG_SCOPE=$(az group show --name myNetworkResourceGroup --query id -o tsv)
    az role assignment create \
        --assignee ${CLIENT_ID} \
        --role "Network Contributor" \
        --scope ${RG_SCOPE}
    ```

    > [!IMPORTANT]
    > If you customized your outbound IP, make sure your cluster identity has permissions to both the outbound public IP and the inbound public IP.

2. Create a file named `load-balancer-service.yaml` and copy in the contents of the following YAML file, providing your own public IP address created in the previous step and the node resource group name.

    > [!IMPORTANT]
    > Adding the `loadBalancerIP` property to the load balancer YAML manifest is deprecating following [upstream Kubernetes](https://github.com/kubernetes/kubernetes/pull/107235). While current usage remains the same and existing services are expected to work without modification, we **highly recommend setting service annotations** instead. To set service annotations, you can use `service.beta.kubernetes.io/azure-load-balancer-ipv4` for an IPv4 address and `service.beta.kubernetes.io/azure-load-balancer-ipv6` for an IPv6 address.

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      annotations:
        service.beta.kubernetes.io/azure-load-balancer-resource-group: myNetworkResourceGroup
      name: azure-load-balancer
    spec:
      loadBalancerIP: 40.121.183.52
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: azure-load-balancer
    ```

3. Use the `kubectl apply` command to create the service and deployment.

    ```console
    kubectl apply -f load-balancer-service.yaml
    ```

## Apply a DNS label to the service

If your service uses a dynamic or static public IP address, you can use the `service.beta.kubernetes.io/azure-dns-label-name` service annotation to set a public-facing DNS label. This publishes a fully qualified domain name (FQDN) for your service using Azure's public DNS servers and top-level domain. The annotation value must be unique within the Azure location, so it's recommended to use a sufficiently qualified label. Azure automatically appends a default suffix in the location you selected, such as `<location>.cloudapp.azure.com`, to the name you provide, creating the FQDN.

```yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/azure-dns-label-name: myserviceuniquelabel
  name: azure-load-balancer
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-load-balancer
```

To see the DNS label for your load balancer, run the following command:

```console
kubectl describe service azure-load-balancer
```

The DNS label will be listed under the `Annotations`, as shown in the following condensed example output:

```console
Name:                    azure-load-balancer
Namespace:               default
Labels:                  <none>
Annotations:             service.beta.kuberenetes.io/azure-dns-label-name: myserviceuniquelabel
...
```

> [!NOTE]
> To publish the service on your own domain, see [Azure DNS][azure-dns-zone] and the [external-dns][external-dns] project.

## Troubleshoot

If the static IP address defined in the *loadBalancerIP* property of the Kubernetes service manifest doesn't exist or hasn't been created in the node resource group and there are no additional delegations configured, the load balancer service creation fails. To troubleshoot, review the service creation events using the [`kubectl describe`][kubectl-describe] command. Provide the name of the service specified in the YAML manifest, as shown in the following example:

```console
kubectl describe service azure-load-balancer
```

The output will show you information about the Kubernetes service resource. The following example output shows a `Warning` in the `Events`: "`user supplied IP address was not found`." In this scenario, make sure you've created the static public IP address in the node resource group and that the IP address specified in the Kubernetes service manifest is correct.

```console
Name:                     azure-load-balancer
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=azure-load-balancer
Type:                     LoadBalancer
IP:                       10.0.18.125
IP:                       40.121.183.52
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  32582/TCP
Endpoints:                <none>
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type     Reason                      Age               From                Message
  ----     ------                      ----              ----                -------
  Normal   CreatingLoadBalancer        7s (x2 over 22s)  service-controller  Creating load balancer
  Warning  CreatingLoadBalancerFailed  6s (x2 over 12s)  service-controller  Error creating load balancer (will retry): Failed to create load balancer for service default/azure-load-balancer: user supplied IP Address 40.121.183.52 was not found
```

## Next steps

For additional control over the network traffic to your applications, you may want to [create an ingress controller][aks-ingress-basic]. You can also [create an ingress controller with a static public IP address][aks-static-ingress].

<!-- LINKS - External -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[azure-dns-zone]: https://azure.microsoft.com/services/dns/
[external-dns]: https://github.com/kubernetes-sigs/external-dns

<!-- LINKS - Internal -->
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[az-network-public-ip-list]: /cli/azure/network/public-ip#az_network_public_ip_list
[aks-ingress-basic]: ingress-basic.md
[aks-static-ingress]: ingress-static-ip.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[install-azure-cli]: /cli/azure/install-azure-cli
[ip-sku]: ../virtual-network/ip-services/public-ip-addresses.md#sku
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-aks-show]: /cli/azure/aks#az-aks-show
