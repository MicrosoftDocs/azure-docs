---
title: Use a public load balancer in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to use a public load balancer with a Standard SKU to expose your services with Azure Kubernetes Service (AKS).
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 10/30/2023
ms.author: allensu
author: asudbring
#Customer intent: As a cluster operator or developer, I want to learn how to create a service in AKS that uses an Azure Load Balancer with a Standard SKU.
---

# Use a public standard load balancer in Azure Kubernetes Service (AKS)

The [Azure Load Balancer][az-lb] operates at layer 4 of the Open Systems Interconnection (OSI) model that supports both inbound and outbound scenarios. It distributes inbound flows that arrive at the load balancer's front end to the back end pool instances.

A **public** load balancer integrated with AKS serves two purposes:

1. To provide outbound connections to the cluster nodes inside the AKS virtual network by translating the private IP address to a public IP address part of its *Outbound Pool*.
2. To provide access to applications via Kubernetes services of type `LoadBalancer`, enabling you to easily scale your applications and create highly available services.

An **internal (or private)** load balancer is used when *only* private IPs are allowed as frontend. Internal load balancers are used to load balance traffic inside a virtual network. A load balancer frontend can also be accessed from an on-premises network in a hybrid scenario.

This article covers integration with a public load balancer on AKS. For internal load balancer integration, see [Use an internal load balancer in AKS](internal-lb.md).

## Before you begin

* Azure Load Balancer is available in two SKUs: *Basic* and *Standard*. The *Standard* SKU is used by default when you create an AKS cluster. The *Standard* SKU gives you access to added functionality, such as a larger backend pool, [multiple node pools](create-node-pools.md), [Availability Zones](availability-zones.md), and is [secure by default][azure-lb]. It's the recommended load balancer SKU for AKS. For more information on the *Basic* and *Standard* SKUs, see [Azure Load Balancer SKU comparison][azure-lb-comparison].
* For a full list of the supported annotations for Kubernetes services with type `LoadBalancer`, see [LoadBalancer annotations][lb-annotations].
* This article assumes you have an AKS cluster with the *Standard* SKU Azure Load Balancer. If you need an AKS cluster, you can create one [using Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or [the Azure portal][aks-quickstart-portal].
* AKS manages the lifecycle and operations of agent nodes. Modifying the IaaS resources associated with the agent nodes isn't supported. An example of an unsupported operation is making manual changes to the load balancer resource group.

> [!IMPORTANT]
> If you'd prefer to use your own gateway, firewall, or proxy to provide outbound connection, you can skip the creation of the load balancer outbound pool and respective frontend IP by using [**outbound type as UserDefinedRouting (UDR)**](egress-outboundtype.md). The outbound type defines the egress method for a cluster and defaults to type `LoadBalancer`.

## Use the public standard load balancer

After you create an AKS cluster with outbound type `LoadBalancer` (default), your cluster is ready to use the load balancer to expose services.

Create a service manifest named `public-svc.yaml`, which creates a public service of type `LoadBalancer`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: public-svc
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: public-app
```

### Specify the load balancer IP address

If you want to use a specific IP address with the load balancer, there are two ways:

> [!IMPORTANT]
> Adding the *LoadBalancerIP* property to the load balancer YAML manifest is deprecating following [upstream Kubernetes](https://github.com/kubernetes/kubernetes/pull/107235). While current usage remains the same and existing services are expected to work without modification, we **highly recommend setting service annotations** instead.

* **Set service annotations**: Use `service.beta.kubernetes.io/azure-load-balancer-ipv4` for an IPv4 address and `service.beta.kubernetes.io/azure-load-balancer-ipv6` for an IPv6 address.
* **Add the *LoadBalancerIP* property to the load balancer YAML manifest**: Add the *Service.Spec.LoadBalancerIP* property to the load balancer YAML manifest. This field is deprecating following [upstream Kubernetes](https://github.com/kubernetes/kubernetes/pull/107235), and it can't support dual-stack. Current usage remains the same and existing services are expected to work without modification.

### Deploy the service manifest

Deploy the public service manifest using [`kubectl apply`][kubectl-apply] and specify the name of your YAML manifest.

```azurecli-interactive
kubectl apply -f public-svc.yaml
```

The Azure Load Balancer is configured with a new public IP that fronts the new service. Since the Azure Load Balancer can have multiple frontend IPs, each new service that you deploy gets a new dedicated frontend IP to be uniquely accessed.

Confirm your service is created and the load balancer is configured using the following command.

```azurecli-interactive
kubectl get service public-svc
```

```console
NAMESPACE     NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)         AGE
default       public-svc    LoadBalancer   10.0.39.110    52.156.88.187   80:32068/TCP    52s
```

When you view the service details, the public IP address created for this service on the load balancer is shown in the *EXTERNAL-IP* column. It might take a few minutes for the IP address to change from *\<pending\>* to an actual public IP address.

For more detailed information about your service, use the following command.

```azurecli-interactive
kubectl describe service public-svc
```

The following example output is a condensed version of the output after you run `kubectl describe service`. *LoadBalancer Ingress* shows the external IP address exposed by your service. *IP* shows the internal addresses.

```console
Name:                        public-svc
Namespace:                   default
Labels:                      <none>
Annotations:                 <none>
Selector:                    app=public-app
...
IP:                          10.0.39.110
...
LoadBalancer Ingress:        52.156.88.187
...
TargetPort:                  80/TCP
NodePort:                    32068/TCP
...
Session Affinity:            None
External Traffic Policy:     Cluster
...
```

## Configure the public standard load balancer

You can customize different settings for your standard public load balancer at cluster creation time or by updating the cluster. These customization options allow you to create a load balancer that meets your workload needs. With the standard load balancer, you can:

* Set or scale the number of managed outbound IPs.
* Bring your own custom [outbound IPs or outbound IP prefix](#provide-your-own-outbound-public-ips-or-prefixes).
* Customize the number of allocated outbound ports to each node on the cluster.
* Configure the timeout setting for idle connections.

> [!IMPORTANT]
> Only one outbound IP option (managed IPs, bring your own IP, or IP prefix) can be used at a given time.

### Change the inbound pool type (PREVIEW)

AKS nodes can be referenced in the load balancer backend pools by either their IP configuration (Azure Virtual Machine Scale Sets based membership) or by their IP address only. Utilizing the IP address based backend pool membership provides higher efficiencies when updating services and provisioning load balancers, especially at high node counts. Provisioning new clusters with IP based backend pools and converting existing clusters is now supported. When combined with NAT Gateway or user-defined routing egress types, provisioning of new nodes and services are more performant.

Two different pool membership types are available:

- `nodeIPConfiguration` - legacy Virtual Machine Scale Sets IP configuration based pool membership type
- `nodeIP` - IP-based membership type

#### Requirements

* The `aks-preview` extension must be at least version 0.5.103.
* The AKS cluster must be version 1.23 or newer.
* The AKS cluster must be using standard load balancers and virtual machine scale sets.

#### Limitations

* Clusters using IP based backend pools are limited to 2500 nodes.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

#### Install the aks-preview CLI extension

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

#### Register the `IPBasedLoadBalancerPreview` preview feature

To create an AKS cluster with IP based backend pools, you must enable the `IPBasedLoadBalancerPreview` feature flag on your subscription.

Register the `IPBasedLoadBalancerPreview` feature flag by using the `az feature register` command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "IPBasedLoadBalancerPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the `az feature list` command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/IPBasedLoadBalancerPreview')].{Name:name,State:properties.state}"
```

When the feature has been registered, refresh the registration of the *Microsoft.ContainerService* resource provider by using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

#### Create a new AKS cluster with IP-based inbound pool membership

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-backend-pool-type=nodeIP
```

#### Update an existing AKS cluster to use IP-based inbound pool membership

> [!WARNING]
> This operation causes a temporary disruption to incoming service traffic in the cluster. The impact time increases with larger clusters that have many nodes.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-backend-pool-type=nodeIP
```

### Scale the number of managed outbound public IPs

Azure Load Balancer provides outbound and inbound connectivity from a virtual network. Outbound rules make it simple to configure network address translation for the public standard load balancer.

Outbound rules follow the same syntax as load balancing and inbound NAT rules:

***frontend IPs + parameters + backend pool***

An outbound rule configures outbound NAT for all virtual machines identified by the backend pool to be translated to the frontend. Parameters provide more control over the outbound NAT algorithm.

While you can use an outbound rule with a single public IP address, outbound rules are great for scaling outbound NAT because they ease the configuration burden. You can use multiple IP addresses to plan for large-scale scenarios and outbound rules to mitigate SNAT exhaustion prone patterns. Each IP address provided by a frontend provides 64k ephemeral ports for the load balancer to use as SNAT ports.

When using a *Standard* SKU load balancer with managed outbound public IPs (which are created by default), you can scale the number of managed outbound public IPs using the **`--load-balancer-managed-outbound-ip-count`** parameter.

Use the following command to update an existing cluster. You can also set this parameter to have multiple managed outbound public IPs.

> [!IMPORTANT]
> We don't recommend using the Azure portal to make any outbound rule changes. When making these changes, you should go through the AKS cluster and not directly on the Load Balancer resource.
>
> Outbound rule changes made directly on the Load Balancer resource are removed whenever the cluster is reconciled, such as when it's stopped, started, upgraded, or scaled.
>
> Use the Azure CLI, as shown in the examples. Outbound rule changes made using `az aks` CLI commands are permanent across cluster downtime.
>
> For more information, see [Azure Load Balancer outbound rules][alb-outbound-rules].

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 2
```

The above example sets the number of managed outbound public IPs to *2* for the *myAKSCluster* cluster in *myResourceGroup*.

At cluster creation time, you can also set the initial number of managed outbound public IPs by appending the **`--load-balancer-managed-outbound-ip-count`** parameter and setting it to your desired value. The default number of managed outbound public IPs is *1*.

### Provide your own outbound public IPs or prefixes

When you use a *Standard* SKU load balancer, the AKS cluster automatically creates a public IP in the AKS-managed infrastructure resource group and assigns it to the load balancer outbound pool by default.

A public IP created by AKS is an AKS-managed resource, meaning AKS manages the lifecycle of that public IP and doesn't require user action directly on the public IP resource. Alternatively, you can assign your own custom public IP or public IP prefix at cluster creation time. Your custom IPs can also be updated on an existing cluster's load balancer properties.

Requirements for using your own public IP or prefix include:

* Users must create and own custom public IP addresses. Managed public IP addresses created by AKS can't be reused as a "bring your own custom IP" as it can cause management conflicts.
* You must ensure the AKS cluster identity (Service Principal or Managed Identity) has permissions to access the outbound IP, as per the [required public IP permissions list](kubernetes-service-principal.md#networking).
* Make sure you meet the [prerequisites and constraints](../virtual-network/ip-services/public-ip-address-prefix.md#limitations) necessary to configure outbound IPs or outbound IP prefixes.

#### Update the cluster with your own outbound public IP

Use the [`az network public-ip show`][az-network-public-ip-show] command to list the IDs of your public IPs.

```azurecli-interactive
az network public-ip show --resource-group myResourceGroup --name myPublicIP --query id -o tsv
```

The above command shows the ID for the *myPublicIP* public IP in the *myResourceGroup* resource group.

Use the `az aks update` command with the **`load-balancer-outbound-ips`** parameter to update your cluster with your public IPs.

The following example uses the `load-balancer-outbound-ips` parameter with the IDs from the previous command.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2>
```

#### Update the cluster with your own outbound public IP prefix

You can also use public IP prefixes for egress with your *Standard* SKU load balancer. The following example uses the [az network public-ip prefix show][az-network-public-ip-prefix-show] command to list the IDs of your public IP prefixes.

```azurecli-interactive
az network public-ip prefix show --resource-group myResourceGroup --name myPublicIPPrefix --query id -o tsv
```

The above command shows the ID for the *myPublicIPPrefix* public IP prefix in the *myResourceGroup* resource group.

The following example uses the *load-balancer-outbound-ip-prefixes* parameter with the IDs from the previous command.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ip-prefixes <publicIpPrefixId1>,<publicIpPrefixId2>
```

#### Create the cluster with your own public IP or prefixes

When you create your cluster, you can bring your own IP addresses or IP prefixes for egress to support scenarios like adding egress endpoints to an allowlist. To define your own public IPs and IP prefixes at cluster creation time, you append the same parameters shown in the previous command.

Use the `az aks create` command with the `load-balancer-outbound-ips` parameter to create a new cluster with your own public IPs.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2>
```

Use the `az aks create` command with the `load-balancer-outbound-ip-prefixes` parameter to create a new cluster with your own public IP prefixes.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --load-balancer-outbound-ip-prefixes <publicIpPrefixId1>,<publicIpPrefixId2>
```

### Configure the allocated outbound ports

> [!IMPORTANT]
>
> If you have applications on your cluster that can establish a large number of connections to small set of destinations, like many instances of a frontend application connecting to a database, you might have a scenario susceptible to encounter SNAT port exhaustion. SNAT port exhaustion happens when an application runs out of outbound ports to use to establish a connection to another application or host. If you have a scenario susceptible to encounter SNAT port exhaustion, we highly recommended you increase the allocated outbound ports and outbound frontend IPs on the load balancer.
>
> For more information on SNAT, see [Use SNAT for outbound connections](../load-balancer/load-balancer-outbound-connections.md).

By default, AKS sets *AllocatedOutboundPorts* on its load balancer to `0`, which enables [automatic outbound port assignment based on backend pool size][azure-lb-outbound-preallocatedports] when creating a cluster. For example, if a cluster has 50 or fewer nodes, 1024 ports are allocated to each node. As the number of nodes in the cluster increases, fewer ports are available per node. 

> [!IMPORTANT]
> There is a hard limit of 1024 ports regardless of whether front-end IPs are added when the node size is less than or equal to 50 (1-50).

To show the *AllocatedOutboundPorts* value for the AKS cluster load balancer, use `az network lb outbound-rule list`.

```azurecli-interactive
NODE_RG=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
az network lb outbound-rule list --resource-group $NODE_RG --lb-name kubernetes -o table
```

The following example output shows that automatic outbound port assignment based on backend pool size is enabled for the cluster.

```console
AllocatedOutboundPorts    EnableTcpReset    IdleTimeoutInMinutes    Name             Protocol    ProvisioningState    ResourceGroup
------------------------  ----------------  ----------------------  ---------------  ----------  -------------------  -------------
0                         True              30                      aksOutboundRule  All         Succeeded            MC_myResourceGroup_myAKSCluster_eastus  
```

To configure a specific value for *AllocatedOutboundPorts* and outbound IP address when creating or updating a cluster, use `load-balancer-outbound-ports` and either `load-balancer-managed-outbound-ip-count`, `load-balancer-outbound-ips`, or `load-balancer-outbound-ip-prefixes`. Before setting a specific value or increasing an existing value for either outbound ports or outbound IP addresses, you must calculate the appropriate number of outbound ports and IP addresses. Use the following equation for this calculation rounded to the nearest integer: `64,000 ports per IP / <outbound ports per node> * <number of outbound IPs> = <maximum number of nodes in the cluster>`.

When calculating the number of outbound ports and IPs and setting the values, keep the following information in mind:

* The number of outbound ports per node is fixed based on the value you set.
* The value for outbound ports must be a multiple of 8.
* Adding more IPs doesn't add more ports to any node, but it provides capacity for more nodes in the cluster.
* You must account for nodes that might be added as part of upgrades, including the count of nodes specified via [maxSurge values][maxsurge].

The following examples show how the values you set affect the number of outbound ports and IP addresses:

* If the default values are used and the cluster has 48 nodes, each node has 1024 ports available.
* If the default values are used and the cluster scales from 48 to 52 nodes, each node is updated from 1024 ports available to 512 ports available.
* If the number of outbound ports is set to 1,000 and the outbound IP count is set to 2, then the cluster can support a maximum of 128 nodes: `64,000 ports per IP / 1,000 ports per node * 2 IPs = 128 nodes`.
* If the number of outbound ports is set to 1,000 and the outbound IP count is set to 7, then the cluster can support a maximum of 448 nodes: `64,000 ports per IP / 1,000 ports per node * 7 IPs = 448 nodes`.
* If the number of outbound ports is set to 4,000 and the outbound IP count is set to 2, then the cluster can support a maximum of 32 nodes: `64,000 ports per IP / 4,000 ports per node * 2 IPs = 32 nodes`.
* If the number of outbound ports is set to 4,000 and the outbound IP count is set to 7, then the cluster can support a maximum of 112 nodes: `64,000 ports per IP / 4,000 ports per node * 7 IPs = 112 nodes`.

> [!IMPORTANT]
> After calculating the number outbound ports and IPs, verify you have additional outbound port capacity to handle node surge during upgrades. It's critical to allocate sufficient excess ports for additional nodes needed for upgrade and other operations. AKS defaults to one buffer node for upgrade operations. If using [maxSurge values][maxsurge], multiply the outbound ports per node by your maxSurge value to determine the number of ports required. For example, if you calculate that you need 4000 ports per node with 7 IP address on a cluster with a maximum of 100 nodes and a max surge of 2:
>
> * 2 surge nodes * 4000 ports per node = 8000 ports needed for node surge during upgrades.
> * 100 nodes * 4000 ports per node = 400,000 ports required for your cluster.
> * 7 IPs * 64000 ports per IP = 448,000 ports available for your cluster.
>
> The above example shows the cluster has an excess capacity of 48,000 ports, which is sufficient to handle the 8000 ports needed for node surge during upgrades.

Once the values have been calculated and verified, you can apply those values using `load-balancer-outbound-ports` and either `load-balancer-managed-outbound-ip-count`, `load-balancer-outbound-ips`, or `load-balancer-outbound-ip-prefixes` when creating or updating a cluster.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 7 \
    --load-balancer-outbound-ports 4000
```

### Configure the load balancer idle timeout

When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load balancer reclaims SNAT ports when the flow closes, and the AKS-configured load balancer uses a 30-minute idle timeout for reclaiming SNAT ports from idle flows.

You can also use transport (for example, **`TCP keepalives`** or **`application-layer keepalives`**) to refresh an idle flow and reset this idle timeout if necessary. You can configure this timeout following the below example.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-idle-timeout 4
```

If you expect to have numerous short-lived connections and no long-lived connections that might have long times of idle, like using `kubectl proxy` or `kubectl port-forward`, consider using a low timeout value such as *4 minutes*. When using TCP keepalives, it's sufficient to enable them on one side of the connection. For example, it's sufficient to enable them on the server side only to reset the idle timer of the flow. It's not necessary for both sides to start TCP keepalives. Similar concepts exist for application layer, including database client-server configurations. Check the server side for what options exist for application-specific keepalives.

> [!IMPORTANT]
>
> AKS enables *TCP Reset* on idle by default. We recommend you keep this configuration and leverage it for more predictable application behavior on your scenarios.
>
> TCP RST is only sent during TCP connection in ESTABLISHED state. Read more about it [here](../load-balancer/load-balancer-tcp-reset.md).

When setting *IdleTimeoutInMinutes* to a different value than the default of 30 minutes, consider how long your workloads need an outbound connection. Also consider that the default timeout value for a *Standard* SKU load balancer used outside of AKS is 4 minutes. An *IdleTimeoutInMinutes* value that more accurately reflects your specific AKS workload can help decrease SNAT exhaustion caused by tying up connections no longer being used.

> [!WARNING]
> Altering the values for *AllocatedOutboundPorts* and *IdleTimeoutInMinutes* might significantly change the behavior of the outbound rule for your load balancer and shouldn't be done lightly. Check the [SNAT Troubleshooting section][troubleshoot-snat] and review the [Load Balancer outbound rules][azure-lb-outbound-rules-overview] and [outbound connections in Azure][azure-lb-outbound-connections] before updating these values to fully understand the impact of your changes.

## Restrict inbound traffic to specific IP ranges

The following manifest uses *loadBalancerSourceRanges* to specify a new IP range for inbound external traffic.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-vote-front
  loadBalancerSourceRanges:
  - MY_EXTERNAL_IP_RANGE
```

This example updates the rule to allow inbound external traffic only from the `MY_EXTERNAL_IP_RANGE` range. If you replace `MY_EXTERNAL_IP_RANGE` with the internal subnet IP address, traffic is restricted to only cluster internal IPs. If traffic is restricted to cluster internal IPs, clients outside your Kubernetes cluster are unable to access the load balancer.

> [!NOTE]
> * Inbound, external traffic flows from the load balancer to the virtual network for your AKS cluster. The virtual network has a network security group (NSG) which allows all inbound traffic from the load balancer. This NSG uses a [service tag][service-tags] of type *LoadBalancer* to allow traffic from the load balancer.
> * Pod CIDR should be added to loadBalancerSourceRanges if there are Pods needing to access the service's LoadBalancer IP for clusters with version v1.25 or above.

## Maintain the client's IP on inbound connections

By default, a service of type `LoadBalancer` [in Kubernetes](https://kubernetes.io/docs/tutorials/services/source-ip/#source-ip-for-services-with-type-loadbalancer) and in AKS doesn't persist the client's IP address on the connection to the pod. The source IP on the packet that's delivered to the pod becomes the private IP of the node. To maintain the client’s IP address, you must set `service.spec.externalTrafficPolicy` to `local` in the service definition. The following manifest shows an example.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
spec:
  type: LoadBalancer
  externalTrafficPolicy: Local
  ports:
  - port: 80
  selector:
    app: azure-vote-front
```

## Customizations via Kubernetes Annotations

The following annotations are supported for Kubernetes services with type `LoadBalancer`, and they only apply to **INBOUND** flows.

| Annotation                                                         | Value                               | Description                                                                                                                                                                                                  |
|--------------------------------------------------------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `service.beta.kubernetes.io/azure-load-balancer-internal`          | `true` or `false`                   | Specify whether the load balancer should be internal. If not set, it defaults to public.                                                                                                                     |
| `service.beta.kubernetes.io/azure-load-balancer-internal-subnet`   | Name of the subnet                  | Specify which subnet the internal load balancer should be bound to. If not set, it defaults to the subnet configured in cloud config file.                                                                   |
| `service.beta.kubernetes.io/azure-dns-label-name`                  | Name of the DNS label on Public IPs | Specify the DNS label name for the **public** service. If it's set to an empty string, the DNS entry in the Public IP isn't used.                                                                            |
| `service.beta.kubernetes.io/azure-shared-securityrule`             | `true` or `false`                   | Specify exposing the service through a potentially shared Azure security rule to increase service exposure, utilizing Azure [Augmented Security Rules][augmented-security-rules] in Network Security groups. |
| `service.beta.kubernetes.io/azure-load-balancer-resource-group`    | Name of the resource group          | Specify the resource group of load balancer public IPs that aren't in the same resource group as the cluster infrastructure (node resource group).                                                           |
| `service.beta.kubernetes.io/azure-allowed-service-tags`            | List of allowed service tags        | Specify a list of allowed [service tags][service-tags] separated by commas.                                                                                                                                  |
| `service.beta.kubernetes.io/azure-load-balancer-tcp-idle-timeout`  | TCP idle timeouts in minutes        | Specify the time in minutes for TCP connection idle timeouts to occur on the load balancer. The default and minimum value is 4. The maximum value is 30. The value must be an integer.                       |
| `service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset` | `true` or `false`                   | Specify whether the load balancer should disable TCP reset on idle timeout.                                                                                                                                  |
| `service.beta.kubernetes.io/azure-load-balancer-ipv4`              | IPv4 address                        | Specify the IPv4 address to assign to the load balancer.                                                                                                                                                     |
| `service.beta.kubernetes.io/azure-load-balancer-ipv6`              | IPv6 address                        | Specify the IPv6 address to assign to the load balancer.                                                                                                                                                     |

### Customize the load balancer health probe
| Annotation                                                                 | Value                                                     | Description                                                                                                                                                                                                           |
|----------------------------------------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `service.beta.kubernetes.io/azure-load-balancer-health-probe-interval`     | Health probe interval                                     |                                                                                                                                                                                                                       |
| `service.beta.kubernetes.io/azure-load-balancer-health-probe-num-of-probe` | The minimum number of unhealthy responses of health probe |                                                                                                                                                                                                                       |
| `service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path` | Request path of the health probe                          |                                                                                                                                                                                                                       |
| `service.beta.kubernetes.io/port_{port}_no_lb_rule`                        | true/false                                                | {port} is service port number. When set to true, no lb rule or health probe rule for this port is generated. Health check service should not be exposed to the public internet(e.g. istio/envoy health check service) |
| `service.beta.kubernetes.io/port_{port}_no_probe_rule`                     | true/false                                                | {port} is service port number. When set to true, no health probe rule for this port is generated.                                                                                                                     |
| `service.beta.kubernetes.io/port_{port}_health-probe_protocol`             | Health probe protocol                                     | {port} is service port number. Explicit protocol for the health probe for the service port {port}, overriding port.appProtocol if set.                                                                                |
| `service.beta.kubernetes.io/port_{port}_health-probe_port`                 | port number or port name in service manifest              | {port} is service port number. Explicit port for the health probe for the service port {port}, overriding the default value.                                                                                          |
| `service.beta.kubernetes.io/port_{port}_health-probe_interval`             | Health probe interval                                     | {port} is service port number.                                                                                                                                                                                        |
| `service.beta.kubernetes.io/port_{port}_health-probe_num-of-probe`         | The minimum number of unhealthy responses of health probe | {port} is service port number.                                                                                                                                                                                        |
| `service.beta.kubernetes.io/port_{port}_health-probe_request-path`         | Request path of the health probe                          | {port} is service port number.                                                                                                                                                                                        |

As documented [here](../load-balancer/load-balancer-custom-probe-overview.md), Tcp, Http and Https are three protocols supported by load balancer service.

Currently, the default protocol of the health probe varies among services with different transport protocols, app protocols, annotations and external traffic policies.

1. for local services, HTTP and /healthz would be used. The health probe will query NodeHealthPort rather than actual backend service
1. for cluster TCP services, TCP would be used.
1. for cluster UDP services, no health probes.

> [!NOTE]
> For local services with PLS integration and PLS proxy protocol enabled, the default HTTP+/healthz health probe does not work. Thus health probe can be customized the same way as cluster services to support this scenario.

Since v1.20, service annotation `service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path` is introduced to determine the health probe behavior.

* For clusters <=1.23, `spec.ports.appProtocol` would only be used as probe protocol when `service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path` is also set.
* For clusters >1.24,  `spec.ports.appProtocol` would be used as probe protocol and `/` would be used as default probe request path (`service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path` could be used to change to a different request path).

Note that the request path would be ignored when using TCP or the `spec.ports.appProtocol` is empty. More specifically:

| loadbalancer sku | `externalTrafficPolicy` | spec.ports.Protocol | spec.ports.AppProtocol | `service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path` | LB Probe Protocol                 | LB Probe Request Path       |
|------------------|-------------------------|---------------------|------------------------|----------------------------------------------------------------------------|-----------------------------------|-----------------------------|
| standard         | local                   | any                 | any                    | any                                                                        | http                              | `/healthz`                  |
| standard         | cluster                 | udp                 | any                    | any                                                                        | null                              | null                        |
| standard         | cluster                 | tcp                 |                        | (ignored)                                                                  | tcp                               | null                        |
| standard         | cluster                 | tcp                 | tcp                    | (ignored)                                                                  | tcp                               | null                        |
| standard         | cluster                 | tcp                 | http/https             |                                                                            | TCP(<=1.23) or http/https(>=1.24) | null(<=1.23) or `/`(>=1.24) |
| standard         | cluster                 | tcp                 | http/https             | `/custom-path`                                                             | http/https                        | `/custom-path`              |
| standard         | cluster                 | tcp                 | unsupported protocol   | `/custom-path`                                                             | tcp                               | null                        |
| basic            | local                   | any                 | any                    | any                                                                        | http                              | `/healthz`                  |
| basic            | cluster                 | tcp                 |                        | (ignored)                                                                  | tcp                               | null                        |
| basic            | cluster                 | tcp                 | tcp                    | (ignored)                                                                  | tcp                               | null                        |
| basic            | cluster                 | tcp                 | http                   |                                                                            | TCP(<=1.23) or http/https(>=1.24) | null(<=1.23) or `/`(>=1.24) |
| basic            | cluster                 | tcp                 | http                   | `/custom-path`                                                             | http                              | `/custom-path`              |
| basic            | cluster                 | tcp                 | unsupported protocol   | `/custom-path`                                                             | tcp                               | null                        |

Since v1.21, two service annotations `service.beta.kubernetes.io/azure-load-balancer-health-probe-interval` and `load-balancer-health-probe-num-of-probe` are introduced, which customize the configuration of health probe. If `service.beta.kubernetes.io/azure-load-balancer-health-probe-interval` is not set, Default value of 5 is applied. If `load-balancer-health-probe-num-of-probe` is not set, Default value of 2 is applied. And total probe should be less than 120 seconds.


### Custom Load Balancer health probe for port
Different ports in a service can require different health probe configurations. This could be because of service design (such as a single health endpoint controlling multiple ports), or Kubernetes features like the [MixedProtocolLBService](https://kubernetes.io/docs/concepts/services-networking/service/#load-balancers-with-mixed-protocol-types).

The following annotations can be used to customize probe configuration per service port.

| port specific annotation                                         | global probe annotation                                                  | Usage                                                                        |
|------------------------------------------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------------------------|
| service.beta.kubernetes.io/port_{port}_no_lb_rule                | N/A (no equivalent globally)                                             | if set true, no lb rules and probe rules will be generated                   |
| service.beta.kubernetes.io/port_{port}_no_probe_rule             | N/A (no equivalent globally)                                             | if set true, no probe rules will be generated                                |
| service.beta.kubernetes.io/port_{port}_health-probe_protocol     | N/A (no equivalent globally)                                             | Set the health probe protocol for this service port (e.g. Http, Https, Tcp)  |
| service.beta.kubernetes.io/port_{port}_health-probe_port         | N/A (no equivalent globally)                                             | Sets the health probe port for this service port (e.g. 15021)                |
| service.beta.kubernetes.io/port_{port}_health-probe_request-path | service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path | For Http or Https, sets the health probe request path. Defaults to /         |
| service.beta.kubernetes.io/port_{port}_health-probe_num-of-probe | service.beta.kubernetes.io/azure-load-balancer-health-probe-num-of-probe | Number of consecutive probe failures before the port is considered unhealthy |
| service.beta.kubernetes.io/port_{port}_health-probe_interval     | service.beta.kubernetes.io/azure-load-balancer-health-probe-interval     | The amount of time between probe attempts                                    |

For following manifest, probe rule for port httpsserver is different from the one for httpserver because annotations for port httpsserver are specified.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: appservice
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-health-probe-num-of-probe: "5"
    service.beta.kubernetes.io/port_443_health-probe_num-of-probe: "4"
spec:
  type: LoadBalancer
  selector:
    app: server
  ports:
    - name: httpserver
      protocol: TCP
      port: 80
      targetPort: 30102
    - name: httpsserver
      protocol: TCP
      appProtocol: HTTPS
      port: 443
      targetPort: 30104
```

In this manifest, the https ports use a different node port, an HTTP readiness check at port 10256 on /healthz(healthz endpoint of kube-proxy).
```yaml
apiVersion: v1
kind: Service
metadata:
  name: istio
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    service.beta.kubernetes.io/port_443_health-probe_protocol: "http"
    service.beta.kubernetes.io/port_443_health-probe_port: "10256"
    service.beta.kubernetes.io/port_443_health-probe_request-path: "/healthz"
spec:
  ports:
    - name: https
      protocol: TCP
      port: 443
      targetPort: 8443
      nodePort: 30104
      appProtocol: https
  selector:
    app: istio-ingressgateway
    gateway: istio-ingressgateway
    istio: ingressgateway
  type: LoadBalancer
  sessionAffinity: None
  externalTrafficPolicy: Local
  ipFamilies:
    - IPv4
  ipFamilyPolicy: SingleStack
  allocateLoadBalancerNodePorts: true
  internalTrafficPolicy: Cluster
```

In this manifest, the https ports use a different health probe endpoint, an HTTP readiness check at port 30000 on /healthz/ready.
```yaml
apiVersion: v1
kind: Service
metadata:
  name: istio
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    service.beta.kubernetes.io/port_443_health-probe_protocol: "http"
    service.beta.kubernetes.io/port_443_health-probe_port: "30000"
    service.beta.kubernetes.io/port_443_health-probe_request-path: "/healthz/ready"
spec:
  ports:
    - name: https
      protocol: TCP
      port: 443
      targetPort: 8443
      appProtocol: https
  selector:
    app: istio-ingressgateway
    gateway: istio-ingressgateway
    istio: ingressgateway
  type: LoadBalancer
  sessionAffinity: None
  externalTrafficPolicy: Local
  ipFamilies:
    - IPv4
  ipFamilyPolicy: SingleStack
  allocateLoadBalancerNodePorts: true
  internalTrafficPolicy: Cluster
```

## Troubleshooting SNAT

If you know that you're starting many outbound TCP or UDP connections to the same destination IP address and port, and you observe failing outbound connections or support notifies you that you're exhausting SNAT ports (preallocated ephemeral ports used by PAT), you have several general mitigation options. Review these options and decide what's best for your scenario. It's possible that one or more can help manage your scenario. For detailed information, review the [outbound connections troubleshooting guide](../load-balancer/troubleshoot-outbound-connection.md).

The root cause of SNAT exhaustion is frequently an anti-pattern for how outbound connectivity is established, managed, or configurable timers changed from their default values. Review this section carefully.

### Steps

1. Check if your connections remain idle for a long time and rely on the default idle timeout for releasing that port. If so, the default timeout of 30 minutes might need to be reduced for your scenario.
2. Investigate how your application creates outbound connectivity (for example, code review or packet capture).
3. Determine if this activity is expected behavior or whether the application is misbehaving. Use [metrics](../load-balancer/load-balancer-standard-diagnostics.md) and [logs](../load-balancer/monitor-load-balancer.md) in Azure Monitor to substantiate your findings. For example, use the "Failed" category for SNAT connections metric.
4. Evaluate if appropriate [patterns](#design-patterns) are followed.
5. Evaluate if SNAT port exhaustion should be mitigated with [more outbound IP addresses + more allocated outbound ports](#configure-the-allocated-outbound-ports).

### Design patterns

Take advantage of connection reuse and connection pooling whenever possible. These patterns help you avoid resource exhaustion problems and result in predictable behavior. Primitives for these patterns can be found in many development libraries and frameworks.

* Atomic requests (one request per connection) generally aren't a good design choice. Such anti-patterns limit scale, reduce performance, and decrease reliability. Instead, reuse HTTP/S connections to reduce the numbers of connections and associated SNAT ports. The application scale increases and performance improves because of reduced handshakes, overhead, and cryptographic operation cost when using TLS.
* If you're using out of cluster/custom DNS, or custom upstream servers on coreDNS, keep in mind that DNS can introduce many individual flows at volume when the client isn't caching the DNS resolvers result. Make sure to customize coreDNS first instead of using custom DNS servers and to define a good caching value.
* UDP flows (for example, DNS lookups) allocate SNAT ports during the idle timeout. The longer the idle timeout, the higher the pressure on SNAT ports. Use short idle timeout (for example, 4 minutes).
* Use connection pools to shape your connection volume.
* Never silently abandon a TCP flow and rely on TCP timers to clean up flow. If you don't let TCP explicitly close the connection, state remains allocated at intermediate systems and endpoints, and it makes SNAT ports unavailable for other connections. This pattern can trigger application failures and SNAT exhaustion.
* Don't change OS-level TCP close related timer values without expert knowledge of impact. While the TCP stack recovers, your application performance can be negatively affected when the endpoints of a connection have mismatched expectations. Wishing to change timers is usually a sign of an underlying design problem. Review following recommendations.

## Moving from a *Basic* SKU load balancer to *Standard* SKU

If you have an existing cluster with the *Basic* SKU load balancer, there are important behavioral differences to note when migrating to the *Standard* SKU load balancer.

For example, making blue/green deployments to migrate clusters is a common practice given the `load-balancer-sku` type of a cluster and can only be defined at cluster create time. However, *Basic* SKU load balancers use *Basic* SKU IP addresses, which aren't compatible with *Standard* SKU load balancers. *Standard* SKU load balancers require *Standard* SKU IP addresses. When migrating clusters to upgrade load balancer SKUs, a new IP address with a compatible IP address SKU is required.

For more considerations on how to migrate clusters, visit [our documentation on migration considerations](aks-migration.md).

## Limitations

The following limitations apply when you create and manage AKS clusters that support a load balancer with the *Standard* SKU:

* At least one public IP or IP prefix is required for allowing egress traffic from the AKS cluster. The public IP or IP prefix is required to maintain connectivity between the control plane and agent nodes and to maintain compatibility with previous versions of AKS. You have the following options for specifying public IPs or IP prefixes with a *Standard* SKU load balancer:
  * Provide your own public IPs.
  * Provide your own public IP prefixes.
  * Specify a number up to 100 to allow the AKS cluster to create that many *Standard* SKU public IPs in the same resource group as the AKS cluster. This resource group is usually named with *MC_* at the beginning. AKS assigns the public IP to the *Standard* SKU load balancer. By default, one public IP is automatically created in the same resource group as the AKS cluster if no public IP, public IP prefix, or number of IPs is specified. You also must allow public addresses and avoid creating any Azure policies that ban IP creation.
* A public IP created by AKS can't be reused as a custom bring your own public IP address. Users must create and manage all custom IP addresses.
* Defining the load balancer SKU can only be done when you create an AKS cluster. You can't change the load balancer SKU after an AKS cluster has been created.
* You can only use one type of load balancer SKU (*Basic* or *Standard*) in a single cluster.
* *Standard* SKU load balancers only support *Standard* SKU IP addresses.

## Next steps

To learn more about Kubernetes services, see the [Kubernetes services documentation][kubernetes-services].

To learn more about using internal load balancer for inbound traffic, see the [AKS internal load balancer documentation](internal-lb.md).

<!-- LINKS - External -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/
[lb-annotations]: https://cloud-provider-azure.sigs.k8s.io/topics/loadbalancer/#loadbalancer-annotations

<!-- LINKS - Internal -->
[advanced-networking]: configure-azure-cni.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-sp]: kubernetes-service-principal.md#delegate-access-to-other-azure-resources
[augmented-security-rules]: ../virtual-network/network-security-groups-overview.md#augmented-security-rules
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-group-create]: /cli/azure/group#az_group_create
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-network-lb-outbound-rule-list]: /cli/azure/network/lb/outbound-rule#az_network_lb_outbound_rule_list
[az-network-public-ip-show]: /cli/azure/network/public-ip#az_network_public_ip_show
[az-network-public-ip-prefix-show]: /cli/azure/network/public-ip/prefix#az_network_public_ip_prefix_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[azure-lb]: ../load-balancer/load-balancer-overview.md#securebydefault
[azure-lb-comparison]: ../load-balancer/skus.md
[azure-lb-outbound-rules]: ../load-balancer/load-balancer-outbound-connections.md#outboundrules
[azure-lb-outbound-connections]: ../load-balancer/load-balancer-outbound-connections.md
[azure-lb-outbound-preallocatedports]: ../load-balancer/load-balancer-outbound-connections.md#preallocatedports
[azure-lb-outbound-rules-overview]: ../load-balancer/load-balancer-outbound-connections.md#outboundrules
[install-azure-cli]: /cli/azure/install-azure-cli
[internal-lb-yaml]: internal-lb.md#create-an-internal-load-balancer
[kubernetes-concepts]: concepts-clusters-workloads.md
[use-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[use-multiple-node-pools]: use-multiple-node-pools.md
[troubleshoot-snat]: #troubleshooting-snat
[service-tags]: ../virtual-network/network-security-groups-overview.md#service-tags
[maxsurge]: ./upgrade-aks-cluster.md#customize-node-surge-upgrade
[az-lb]: ../load-balancer/load-balancer-overview.md
[alb-outbound-rules]: ../load-balancer/outbound-rules.md
