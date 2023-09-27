---
title: Create an internal load balancer
titleSuffix: Azure Kubernetes Service
description: Learn how to create and use an internal load balancer to expose your services with Azure Kubernetes Service (AKS).
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 02/22/2023


#Customer intent: As a cluster operator or developer, I want to learn how to create a service in AKS that uses an internal Azure load balancer for enhanced security and without an external endpoint.
---

# Use an internal load balancer with Azure Kubernetes Service (AKS)

You can create and use an internal load balancer to restrict access to your applications in Azure Kubernetes Service (AKS). An internal load balancer doesn't have a public IP and makes a Kubernetes service accessible only to applications that can reach the private IP. These applications can be within the same VNET or in another VNET through VNET peering. This article shows you how to create and use an internal load balancer with AKS.

> [!NOTE]
> Azure Load Balancer is available in two SKUs: *Basic* and *Standard*. The *Standard* SKU is used by default when you create an AKS cluster. When you create a *LoadBalancer* service type, you'll get the same load balancer type as when you provisioned the cluster. For more information, see [Azure Load Balancer SKU comparison][azure-lb-comparison].

## Before you begin

* This article assumes that you have an existing AKS cluster. If you need an AKS cluster, you can create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or the [Azure portal][aks-quickstart-portal].
* You need the Azure CLI version 2.0.59 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* If you want to use an existing subnet or resource group, the AKS cluster identity needs permission to manage network resources. For information, see [Use kubenet networking with your own IP address ranges in AKS][use-kubenet] or [Configure Azure CNI networking in AKS][advanced-networking]. If you're configuring your load balancer to use an [IP address in a different subnet][different-subnet], ensure the AKS cluster identity also has read access to that subnet.
  * For more information on permissions, see [Delegate AKS access to other Azure resources][aks-sp].

## Create an internal load balancer

1. Create a service manifest named `internal-lb.yaml` with the service type `LoadBalancer` and the `azure-load-balancer-internal` annotation.

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: internal-app
      annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: internal-app
    ```

2. Deploy the internal load balancer using the [`kubectl apply`][kubectl-apply] command. This command creates an Azure load balancer in the node resource group connected to the same virtual network as your AKS cluster.

    ```azurecli-interactive
    kubectl apply -f internal-lb.yaml
    ```

3. View the service details using the `kubectl get service` command.

    ```azurecli-interactive
    kubectl get service internal-app
    ```

    The IP address of the internal load balancer is shown in the `EXTERNAL-IP` column, as shown in the following example output. In this context, *External* refers to the external interface of the load balancer. It doesn't mean that it receives a public, external IP address. This IP address is dynamically assigned from the same subnet as the AKS cluster.

    ```output
    NAME           TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
    internal-app   LoadBalancer   10.0.248.59   10.240.0.7    80:30555/TCP   2m
    ```

## Specify an IP address

When you specify an IP address for the load balancer, the specified IP address must reside in the same subnet as the AKS cluster, but it can't already be assigned to a resource. For example, you shouldn't use an IP address in the range designated for the Kubernetes subnet within the AKS cluster.

You can use the [`az network vnet subnet list`][az-network-vnet-subnet-list] Azure CLI command or the [`Get-AzVirtualNetworkSubnetConfig`][get-azvirtualnetworksubnetconfig] PowerShell cmdlet to get the subnets in your virtual network.

For more information on subnets, see [Add a node pool with a unique subnet][unique-subnet].

If you want to use a specific IP address with the load balancer, you have two options: **set service annotations** or **add the *LoadBalancerIP* property to the load balancer YAML manifest**.

> [!IMPORTANT]
> Adding the *LoadBalancerIP* property to the load balancer YAML manifest is deprecating following [upstream Kubernetes](https://github.com/kubernetes/kubernetes/pull/107235). While current usage remains the same and existing services are expected to work without modification, we **highly recommend setting service annotations** instead.

### [Set service annotations](#tab/set-service-annotations)

1. Set service annotations using `service.beta.kubernetes.io/azure-load-balancer-ipv4` for an IPv4 address and `service.beta.kubernetes.io/azure-load-balancer-ipv6` for an IPv6 address.
  
    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: internal-app
      annotations:
        service.beta.kubernetes.io/azure-load-balancer-ipv4: 10.240.0.25
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: internal-app
    ```

### [Add the *LoadBalancerIP* property to the load balancer YAML manifest](#tab/add-load-balancer-ip-property)

1. Add the *Service.Spec.LoadBalancerIP* property to the load balancer YAML manifest. This field is deprecating following [upstream Kubernetes](https://github.com/kubernetes/kubernetes/pull/107235), and it can't support dual-stack. Current usage remains the same and existing services are expected to work without modification.

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: internal-app
      annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    spec:
      type: LoadBalancer
      loadBalancerIP: 10.240.0.25
      ports:
      - port: 80
      selector:
        app: internal-app
    ```

---

2. View the service details using the `kubectl get service` command.

    ```azurecli-interactive
    kubectl get service internal-app
    ```

    The IP address in the `EXTERNAL-IP` column should reflect your specified IP address, as shown in the following example output:

    ```output
    NAME           TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
    internal-app   LoadBalancer   10.0.184.168   10.240.0.25   80:30225/TCP   4m
    ```

For more information on configuring your load balancer in a different subnet, see [Specify a different subnet][different-subnet]

## Connect Azure Private Link service to internal load balancer

### Before you begin

* You need Kubernetes version 1.22.x or later.
* You need an existing resource group with a VNet and subnet. This resource group is where you [create the private endpoint](#create-a-private-endpoint-to-the-private-link-service). If you don't have these resources, see [Create a virtual network and subnet][aks-vnet-subnet].

### Create a Private Link service connection

1. Create a service manifest named `internal-lb-pls.yaml` with the service type `LoadBalancer` and the `azure-load-balancer-internal` and `azure-pls-create` annotations. For more options, refer to the [Azure Private Link Service Integration](https://kubernetes-sigs.github.io/cloud-provider-azure/topics/pls-integration/) design document.

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: internal-app
      annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
        service.beta.kubernetes.io/azure-pls-create: "true"
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: internal-app
    ```

2. Deploy the internal load balancer using the [`kubectl apply`][kubectl-apply] command. This command creates an Azure load balancer in the node resource group connected to the same virtual network as your AKS cluster. It also creates a Private Link Service object that connects to the frontend IP configuration of the load balancer associated with the Kubernetes service.

    ```azurecli-interactive
    kubectl apply -f internal-lb-pls.yaml
    ```

3. View the service details using the `kubectl get service` command.

    ```azurecli-interactive
    kubectl get service internal-app
    ```

    The IP address of the internal load balancer is shown in the `EXTERNAL-IP` column, as shown in the following example output. In this context, *External* refers to the external interface of the load balancer. It doesn't mean that it receives a public, external IP address.

    ```output
    NAME           TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
    internal-app   LoadBalancer   10.125.17.53  10.125.0.66   80:30430/TCP   64m
    ```

4. View the details of the Private Link Service object using the [`az network private-link-service list`][az-network-private-link-service-list] command.

    ```azurecli-interactive
    # Create a variable for the node resource group
    
    AKS_MC_RG=$(az aks show -g myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
    
    # View the details of the Private Link Service object
    
    az network private-link-service list -g $AKS_MC_RG --query "[].{Name:name,Alias:alias}" -o table
    ```

    Your output should look similar to the following example output:

    ```output
    Name      Alias
    --------  -------------------------------------------------------------------------
    pls-xyz   pls-xyz.abc123-defg-4hij-56kl-789mnop.eastus2.azure.privatelinkservice
    ```

### Create a Private Endpoint to the Private Link service

A Private Endpoint allows you to privately connect to your Kubernetes service object via the Private Link Service you created.

* Create the private endpoint using the [`az network private-endpoint create`][az-network-private-endpoint-create] command.

    ```azurecli-interactive
    # Create a variable for the private link service
    
    AKS_PLS_ID=$(az network private-link-service list -g $AKS_MC_RG --query "[].id" -o tsv)
    
    # Create the private endpoint
    
    $ az network private-endpoint create \
        -g myOtherResourceGroup \
        --name myAKSServicePE \
        --vnet-name myOtherVNET \
        --subnet pe-subnet \
        --private-connection-resource-id $AKS_PLS_ID \
        --connection-name connectToMyK8sService
    ```

## Use private networks

When you create your AKS cluster, you can specify advanced networking settings. These settings allow you to deploy the cluster into an existing Azure virtual network and subnets. For example, you can deploy your AKS cluster into a private network connected to your on-premises environment and run services that are only accessible internally.

For more information, see [configure your own virtual network subnets with Kubenet][use-kubenet] or [with Azure CNI][advanced-networking].

You don't need to make any changes to the previous steps to deploy an internal load balancer that uses a private network in an AKS cluster. The load balancer is created in the same resource group as your AKS cluster, but it's instead connected to your private virtual network and subnet, as shown in the following example:

```azurecli-interactive
$ kubectl get service internal-app

NAME           TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
internal-app   LoadBalancer   10.1.15.188   10.0.0.35     80:31669/TCP   1m
```

> [!NOTE]
> You may need to assign a minimum of *Microsoft.Network/virtualNetworks/subnets/read* and *Microsoft.Network/virtualNetworks/subnets/join/action* permission to AKS MSI on the Azure Virtual Network resources. You can view the cluster identity with [az aks show][az-aks-show], such as `az aks show --resource-group myResourceGroup --name myAKSCluster --query "identity"`. To create a role assignment, use the [`az role assignment create`][az-role-assignment-create] command.

### Specify a different subnet

* Add the `azure-load-balancer-internal-subnet` annotation to your service to specify a subnet for your load balancer. The subnet specified must be in the same virtual network as your AKS cluster. When deployed, the load balancer `EXTERNAL-IP` address is part of the specified subnet.

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: internal-app
      annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
        service.beta.kubernetes.io/azure-load-balancer-internal-subnet: "apps-subnet"
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: internal-app
    ```

## Delete the load balancer

The load balancer is deleted when all of its services are deleted.

As with any Kubernetes resource, you can directly delete a service, such as `kubectl delete service internal-app`, which also deletes the underlying Azure load balancer.

## Next steps

To learn more about Kubernetes services, see the [Kubernetes services documentation][kubernetes-services].

<!-- LINKS - External -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/

<!-- LINKS - Internal -->
[advanced-networking]: configure-azure-cni.md
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[azure-lb-comparison]: ../load-balancer/skus.md
[use-kubenet]: configure-kubenet.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-sp]: kubernetes-service-principal.md#delegate-access-to-other-azure-resources
[different-subnet]: #specify-a-different-subnet
[aks-vnet-subnet]: configure-kubenet.md#create-a-virtual-network-and-subnet
[unique-subnet]: create-node-pools.md#add-a-node-pool-with-a-unique-subnet
[az-network-vnet-subnet-list]: /cli/azure/network/vnet/subnet#az-network-vnet-subnet-list
[get-azvirtualnetworksubnetconfig]: /powershell/module/az.network/get-azvirtualnetworksubnetconfig
[az-network-private-link-service-list]: /cli/azure/network/private-link-service#az_network_private_link_service_list
[az-network-private-endpoint-create]: /cli/azure/network/private-endpoint#az_network_private_endpoint_create
