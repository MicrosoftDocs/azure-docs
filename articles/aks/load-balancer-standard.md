---
title: Use a Public Load Balancer
titleSuffix: Azure Kubernetes Service
description: Learn how to use a public load balancer with a Standard SKU to expose your services with Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 11/14/2020
ms.author: jpalma
author: palma21

#Customer intent: As a cluster operator or developer, I want to learn how to create a service in AKS that uses an Azure Load Balancer with a Standard SKU.
---

# Use a public standard load balancer in Azure Kubernetes Service (AKS)

The [Azure Load Balancer][az-lb] operates at layer 4 of the Open Systems Interconnection (OSI) model that supports both inbound and outbound scenarios. It distributes inbound flows that arrive at the load balancer's front end to the back end pool instances.

A **public** load balancer integrated with AKS serves two purposes:

1. To provide outbound connections to the cluster nodes inside the AKS virtual network. To do this, it translates the private IP address to a public IP address that is part of its *Outbound Pool*.
2. To provide access to applications via Kubernetes services of type `LoadBalancer`. With it, you can easily scale your applications and create highly available services.

An **internal (or private)** load balancer is used where only private IPs are allowed as frontend. Internal load balancers are used to load balance traffic inside a virtual network. A load balancer frontend can also be accessed from an on-premises network in a hybrid scenario.

This document covers integration with public load balancer. For internal load balancer integration, see the [AKS internal load balancer documentation](internal-lb.md).

## Before you begin

Azure Load Balancer is available in two SKUs: *Basic* and *Standard*. By default, *Standard* SKU is used when you create an AKS cluster. The *Standard* SKU gives you access to added functionality, such as a larger backend pool, [multiple node pools](use-multiple-node-pools.md), [Availability Zones](availability-zones.md), and is [secure by default][azure-lb]. It's the recommended load balancer SKU for AKS.

For more information on the *Basic* and *Standard* SKUs, see [Azure load balancer SKU comparison][azure-lb-comparison].

This article assumes you have an AKS cluster with the *Standard* SKU Azure Load Balancer. If you need an AKS cluster, create one [using the Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or [the Azure portal][aks-quickstart-portal].

> [!IMPORTANT]
> If you prefer not to leverage the Azure Load Balancer to provide outbound connection and instead have your own gateway, firewall, or proxy for that purpose, you can skip the creation of the load balancer outbound pool and respective frontend IP by using [**outbound type as UserDefinedRouting (UDR)**](egress-outboundtype.md). The outbound type defines the egress method for a cluster and defaults to type `loadBalancer`.

## Use the public standard load balancer

After creating an AKS cluster with outbound type `LoadBalancer` (default), the cluster is ready to use the load balancer to expose services.

To do this, you can create a public service of type `LoadBalancer`. Start by creating a service manifest named `public-svc.yaml`.

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

Deploy the public service manifest by using [kubectl apply][kubectl-apply] and specify the name of your YAML manifest.

```azurecli-interactive
kubectl apply -f public-svc.yaml
```

The Azure Load Balancer will be configured with a new public IP that will front this new service. Since the Azure Load Balancer can have multiple frontend IPs, each new service deployed will get a new dedicated frontend IP to be uniquely accessed.

You can use the following command to confirm your service is created and the load balancer is configured.

```azurecli-interactive
kubectl get service public-svc
```

```console
NAMESPACE     NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)         AGE
default       public-svc    LoadBalancer   10.0.39.110    52.156.88.187   80:32068/TCP    52s
```

When you view the service details, the public IP address created for this service on the load balancer is shown in the *EXTERNAL-IP* column. It may take a few minutes for the IP address to change from *\<pending\>* to an actual public IP address.

## Configure the public standard load balancer

When using the standard public load balancer, there's a set of options you can customize at creation time or by updating the cluster. These options allow you to customize the load balancer to meet your workloads needs and should be reviewed accordingly. With the standard load balancer, you can:

* Set or scale the number of managed outbound IPs
* Bring your own custom [outbound IPs or outbound IP prefix](#provide-your-own-outbound-public-ips-or-prefixes)
* Customize the number of allocated outbound ports to each node of the cluster
* Configure the timeout setting for idle connections

> [!IMPORTANT]
> Only one outbound IP option (managed IPs, bring your own IP, or IP prefix) can be used at a given time.

### Scale the number of managed outbound public IPs

Azure Load Balancer provides outbound connectivity from a virtual network in addition to inbound. Outbound rules make it simple to configure network address translation for the public standard load balancer.

Like all load balancer rules, outbound rules follow the same syntax as load balancing and inbound NAT rules:

***frontend IPs + parameters + backend pool***

An outbound rule configures outbound NAT for all virtual machines identified by the backend pool to be translated to the frontend. Parameters provide additional control over the outbound NAT algorithm.

While an outbound rule can be used with a single public IP address, outbound rules ease the configuration burden for scaling outbound NAT. You can use multiple IP addresses to plan for large-scale scenarios, and you can use outbound rules to mitigate SNAT exhaustion prone patterns. Each additional IP address provided by a frontend provides 64k ephemeral ports for the load balancer to use as SNAT ports.

When using a *Standard* SKU load balancer with managed outbound public IPs, which are created by default, you can scale the number of managed outbound public IPs using the **`load-balancer-managed-ip-count`** parameter.

To update an existing cluster, run the following command. This parameter can also be set at cluster creation time to have multiple managed outbound public IPs.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 2
```

The above example sets the number of managed outbound public IPs to *2* for the *myAKSCluster* cluster in *myResourceGroup*.

You can also use the **`load-balancer-managed-ip-count`** parameter to set the initial number of managed outbound public IPs when creating your cluster by appending the **`--load-balancer-managed-outbound-ip-count`** parameter and setting it to your desired value. The default number of managed outbound public IPs is *1*.

### Provide your own outbound public IPs or prefixes

When you use a *Standard* SKU load balancer, the AKS cluster automatically creates a public IP in the AKS-managed infrastructure resource group and assigns it to the load balancer outbound pool by default.

A public IP created by AKS is considered an AKS-managed resource. This means the lifecycle of that public IP is intended to be managed by AKS and requires no user action directly on the public IP resource. Alternatively, you can assign your own custom public IP or public IP prefix at cluster creation time. Your custom IPs can also be updated on an existing cluster's load balancer properties.

Requirements for using your own public IP or prefix:

* Custom public IP addresses must be created and owned by the user. Managed public IP addresses created by AKS cannot be reused as a bring your own custom IP as it can cause management conflicts.
* You must ensure the AKS cluster identity (Service Principal or Managed Identity) has permissions to access the outbound IP, as per the [required public IP permissions list](kubernetes-service-principal.md#networking).
* Make sure you meet the [pre-requisites and constraints](../virtual-network/ip-services/public-ip-address-prefix.md#limitations) necessary to configure outbound IPs or outbound IP prefixes.

#### Update the cluster with your own outbound public IP

Use the [az network public-ip show][az-network-public-ip-show] command to list the IDs of your public IPs.

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

You can bring your own IP addresses or IP prefixes for egress at cluster creation time to support scenarios like adding egress endpoints to an allowlist. Append the same parameters shown above to your cluster creation step to define your own public IPs and IP prefixes at the start of a cluster's lifecycle.

Use the *az aks create* command with the *load-balancer-outbound-ips* parameter to create a new cluster with your public IPs at the start.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2>
```

Use the *az aks create* command with the *load-balancer-outbound-ip-prefixes* parameter to create a new cluster with your public IP prefixes at the start.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --load-balancer-outbound-ip-prefixes <publicIpPrefixId1>,<publicIpPrefixId2>
```

### Configure the allocated outbound ports

> [!IMPORTANT]
> If you have applications on your cluster that can establish a large number of connections to small set of destinations, such as many instances of a frontend application connecting to a database, you may have a scenario very susceptible to encounter SNAT port exhaustion. SNAT port exhaustion happens when an application runs out of outbound ports to use to establish a connection to another application or host. If you have a scenario where you may encounter SNAT port exhaustion, we highly recommended that you increase the allocated outbound ports and outbound frontend IPs on the load balancer to prevent SNAT port exhaustion. See below for information on how to properly calculate outbound ports and outbound frontend IP values.

By default, AKS sets *AllocatedOutboundPorts* on its load balancer to `0`, which enables [automatic outbound port assignment based on backend pool size][azure-lb-outbound-preallocatedports] when creating a cluster. For example, if a cluster has 50 or fewer nodes, 1024 ports are allocated to each node. As the number of nodes in the cluster is increased, fewer ports will be available per node. To show the *AllocatedOutboundPorts* value for the AKS cluster load balancer, use `az network lb outbound-rule list`. 

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

To configure a specific value for *AllocatedOutboundPorts* and outbound IP address when creating or updating a cluster, use `load-balancer-outbound-ports` and either `load-balancer-managed-outbound-ip-count`, `load-balancer-outbound-ips`, or `load-balancer-outbound-ip-prefixes`. Before setting a specific value or increasing an existing value for either for outbound ports and outbound IP address, you must calculate the appropriate number of outbound ports and IP addresses. Use the following equation for this calculation rounded to the nearest integer: `64,000 ports per IP / <outbound ports per node> * <number of outbound IPs> = <maximum number of nodes in the cluster>`.

When calculating the number of outbound ports and IPs and setting the values, remember:

* The number of outbound ports is fixed per node based on the value you set.
* The value for outbound ports must be a multiple of 8.
* Adding more IPs does not add more ports to any node. It provides capacity for more nodes in the cluster.
* You must account for nodes that may be added as part of upgrades, including the count of nodes specified via [maxSurge values][maxsurge].

The following examples show how the number of outbound ports and IP addresses are affected by the values you set:

* If the default values are used and the cluster has 48 nodes, each node will have 1024 ports available.
* If the default values are used and the cluster scales from 48 to 52 nodes, each node will be updated from 1024 ports available to 512 ports available.
* If outbound ports is set to 1,000 and outbound IP count is set to 2, then the cluster can support a maximum of 128 nodes: `64,000 ports per IP / 1,000 ports per node * 2 IPs = 128 nodes`.
* If outbound ports is set to 1,000 and outbound IP count is set to 7, then the cluster can support a maximum of 448 nodes: `64,000 ports per IP / 1,000 ports per node * 7 IPs = 448 nodes`.
* If outbound ports is set to 4,000 and outbound IP count is set to 2, then the cluster can support a maximum of 32 nodes: `64,000 ports per IP / 4,000 ports per node * 2 IPs = 32 nodes`.
* If outbound ports is set to 4,000 and outbound IP count is set to 7, then the cluster can support a maximum of 112 nodes: `64,000 ports per IP / 4,000 ports per node * 7 IPs = 112 nodes`.

> [!IMPORTANT]
> After calculating the number outbound ports and IPs, verify you have additional outbound port capacity to handle node surge during upgrades. It is critical to allocate sufficient excess ports for additional nodes needed for upgrade and other operations. AKS defaults to one buffer node for upgrade operations. If using [maxSurge values][maxsurge], multiply the outbound ports per node by your maxSurge value to determine the number of ports required. For example, if you calculated you needed 4000 ports per node with 7 IP address on a cluster with a maximum of 100 nodes and a max surge of 2:
>
> * 2 surge nodes * 4000 ports per node = 8000 ports needed for node surge during upgrades.
> * 100 nodes * 4000 ports per node = 400,000 ports required for your cluster.
> * 7 IPs * 64000 ports per IP = 448,000 ports available for your cluster.
>
> The above example shows the cluster has an excess capacity of 48,000 ports, which is sufficient to handle the 8000 ports needed for node surge during upgrades.

Once the values have been calculated and verified, you can apply those values using `load-balancer-outbound-ports` and either `load-balancer-managed-outbound-ip-count`, `load-balancer-outbound-ips`, or `load-balancer-outbound-ip-prefixes` when creating or updating a cluster. For example:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 7 \
    --load-balancer-outbound-ports 4000
```

### Configure the load balancer idle timeout

When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load balancer reclaims SNAT ports when the flow closes and the AKS-configured load balancer uses a 30-minute idle timeout for reclaiming SNAT ports from idle flows.

You can also use transport (for example, **`TCP keepalives`** or **`application-layer keepalives`**) to refresh an idle flow and reset this idle timeout if necessary. You can configure this timeout following the below example.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-idle-timeout 4
```

If you expect to have numerous short-lived connections and no connections that are long lived and might have long times of idle, like leveraging `kubectl proxy` or `kubectl port-forward` consider using a low timeout value such as 4 minutes. Also, when using TCP keepalives, it's sufficient to enable them on one side of the connection. For example, it's sufficient to enable them on the server side only to reset the idle timer of the flow and it's not necessary for both sides to start TCP keepalives. Similar concepts exist for application layer, including database client-server configurations. Check the server side for what options exist for application-specific keepalives.

> [!IMPORTANT]
> AKS enables TCP Reset on idle by default and recommends you keep this configuration on and leverage it for more predictable application behavior on your scenarios.
> TCP RST is only sent during TCP connection in ESTABLISHED state. Read more about it [here](../load-balancer/load-balancer-tcp-reset.md).

When setting *IdleTimeoutInMinutes* to a different value than the default of 30 minutes, consider how long your workloads will need an outbound connection. Also consider the default timeout value for a *Standard* SKU load balancer used outside of AKS is 4 minutes. An *IdleTimeoutInMinutes* value that more accurately reflects your specific AKS workload can help decrease SNAT exhaustion caused by tying up connections no longer being used.

> [!WARNING]
> Altering the values for *AllocatedOutboundPorts* and *IdleTimeoutInMinutes* may significantly change the behavior of the outbound rule for your load balancer and should not be done lightly, without understanding the tradeoffs and your application's connection patterns, check the [SNAT Troubleshooting section below][troubleshoot-snat] and review the [Load Balancer outbound rules][azure-lb-outbound-rules-overview] and [outbound connections in Azure][azure-lb-outbound-connections] before updating these values to fully understand the impact of your changes.

## Restrict inbound traffic to specific IP ranges

The following manifest uses *loadBalancerSourceRanges* to specify a new IP range for inbound external traffic:

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

This example updates the rule to allow inbound external traffic only from the `MY_EXTERNAL_IP_RANGE` range. If you replace `MY_EXTERNAL_IP_RANGE` with the internal subnet IP address, traffic is restricted to only cluster internal IPs. If traffic is restricted to cluster internal IPs, clients outside your Kubernetes cluster won't be able to access the load balancer.

> [!NOTE]
> Inbound, external traffic flows from the load balancer to the virtual network for your AKS cluster. The virtual network has a Network Security Group (NSG) which allows all inbound traffic from the load balancer. This NSG uses a [service tag][service-tags] of type *LoadBalancer* to allow traffic from the load balancer.

## Maintain the client's IP on inbound connections

By default, a service of type `LoadBalancer` [in Kubernetes](https://kubernetes.io/docs/tutorials/services/source-ip/#source-ip-for-services-with-type-loadbalancer) and in AKS won't persist the client's IP address on the connection to the pod. The source IP on the packet that's delivered to the pod will be the private IP of the node. To maintain the client’s IP address, you must set `service.spec.externalTrafficPolicy` to `local` in the service definition. The following manifest shows an example:

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

## Additional customizations via Kubernetes Annotations

Below is a list of annotations supported for Kubernetes services with type `LoadBalancer`, these annotations only apply to **INBOUND** flows:

| Annotation | Value | Description
| ----------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------ 
| `service.beta.kubernetes.io/azure-load-balancer-internal`         | `true` or `false`                     | Specify whether the load balancer should be internal. It’s defaulting to public if not set.
| `service.beta.kubernetes.io/azure-load-balancer-internal-subnet`  | Name of the subnet                    | Specify which subnet the internal load balancer should be bound to. It’s defaulting to the subnet configured in cloud config file if not set.
| `service.beta.kubernetes.io/azure-dns-label-name`                 | Name of the DNS label on Public IPs   | Specify the DNS label name for the **public** service. If it is set to empty string, the DNS entry in the Public IP will not be used.
| `service.beta.kubernetes.io/azure-shared-securityrule`            | `true` or `false`                     | Specify that the service should be exposed using an Azure security rule that may be shared with another service, trading specificity of rules for an increase in the number of services that can be exposed. This annotation relies on the Azure [Augmented Security Rules](../virtual-network/network-security-groups-overview.md#augmented-security-rules) feature of Network Security groups. 
| `service.beta.kubernetes.io/azure-load-balancer-resource-group`   | Name of the resource group            | Specify the resource group of load balancer public IPs that aren't in the same resource group as the cluster infrastructure (node resource group).
| `service.beta.kubernetes.io/azure-allowed-service-tags`           | List of allowed service tags          | Specify a list of allowed [service tags][service-tags] separated by comma.
| `service.beta.kubernetes.io/azure-load-balancer-tcp-idle-timeout` | TCP idle timeouts in minutes          | Specify the time, in minutes, for TCP connection idle timeouts to occur on the load balancer. Default and minimum value is 4. Maximum value is 30. Must be an integer.
|`service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset` | `true`                                | Disable `enableTcpReset` for SLB. Deprecated in Kubernetes 1.18 and removed in 1.20. 


## Troubleshooting SNAT

If you know that you're starting many outbound TCP or UDP connections to the same destination IP address and port, and you observe failing outbound connections or are advised by support that you're exhausting SNAT ports (preallocated ephemeral ports used by PAT), you have several general mitigation options. Review these options and decide what is available and best for your scenario. It's possible that one or more can help manage this scenario. For detailed information, review the [Outbound Connections Troubleshooting Guide](../load-balancer/troubleshoot-outbound-connection.md).

Frequently the root cause of SNAT exhaustion is an anti-pattern for how outbound connectivity is established, managed, or configurable timers changed from their default values. Review this section carefully.

### Steps
1. Check if your connections remain idle for a long time and rely on the default idle timeout for releasing that port. If so the default timeout of 30 min might need to be reduced for your scenario.
2. Investigate how your application is creating outbound connectivity (for example, code review or packet capture).
3. Determine if this activity is expected behavior or whether the application is misbehaving. Use [metrics](../load-balancer/load-balancer-standard-diagnostics.md) and [logs](../load-balancer/monitor-load-balancer.md) in Azure Monitor to substantiate your findings. Use "Failed" category for SNAT Connections metric for example.
4. Evaluate if appropriate [patterns](#design-patterns) are followed.
5. Evaluate if SNAT port exhaustion should be mitigated with [additional Outbound IP addresses + additional Allocated Outbound Ports](#configure-the-allocated-outbound-ports) .

### Design patterns
Always take advantage of connection reuse and connection pooling whenever possible. These patterns will avoid resource exhaustion problems and result in predictable behavior. Primitives for these patterns can be found in many development libraries and frameworks.

- Atomic requests (one request per connection) are generally not a good design choice. Such anti-pattern limits scale, reduces performance, and decreases reliability. Instead, reuse HTTP/S connections to reduce the numbers of connections and associated SNAT ports. The application scale will increase and performance improve because of reduced handshakes, overhead, and cryptographic operation cost when using TLS.
- If you're using out of cluster/custom DNS, or custom upstream servers on coreDNS have in mind that DNS can introduce many individual flows at volume when the client isn't caching the DNS resolvers result. Make sure to customize coreDNS first instead of using custom DNS servers, and define a good caching value.
- UDP flows (for example DNS lookups) allocate SNAT ports for the duration of the idle timeout. The longer the idle timeout, the higher the pressure on SNAT ports. Use short idle timeout (for example 4 minutes).
Use connection pools to shape your connection volume.
- Never silently abandon a TCP flow and rely on TCP timers to clean up flow. If you don't let TCP explicitly close the connection, state remains allocated at intermediate systems and endpoints and makes SNAT ports unavailable for other connections. This pattern can trigger application failures and SNAT exhaustion.
- Don't change OS-level TCP close related timer values without expert knowledge of impact. While the TCP stack will recover, your application performance can be negatively affected when the endpoints of a connection have mismatched expectations. Wishing to change timers is usually a sign of an underlying design problem. Review following recommendations.

## Moving from a basic SKU load balancer to standard SKU

If you have an existing cluster with the Basic SKU Load Balancer, there are important behavioral differences to note when migrating to use a cluster with the Standard SKU Load Balancer.

For example, making blue/green deployments to migrate clusters is a common practice given the `load-balancer-sku` type of a cluster can only be defined at cluster create time. However, *Basic SKU* Load Balancers use *Basic SKU* IP Addresses, which aren't compatible with *Standard SKU* Load Balancers as they require *Standard SKU* IP Addresses. When migrating clusters to upgrade Load Balancer SKUs, a new IP address with a compatible IP Address SKU will be required.

For more considerations on how to migrate clusters, visit [our documentation on migration considerations](aks-migration.md) to view a list of important topics to consider when migrating. The below limitations are also important behavioral differences to note when using Standard SKU Load Balancers in AKS.

## Limitations

The following limitations apply when you create and manage AKS clusters that support a load balancer with the *Standard* SKU:

* At least one public IP or IP prefix is required for allowing egress traffic from the AKS cluster. The public IP or IP prefix is also required to maintain connectivity between the control plane and agent nodes and to maintain compatibility with previous versions of AKS. You have the following options for specifying public IPs or IP prefixes with a *Standard* SKU load balancer:
    * Provide your own public IPs.
    * Provide your own public IP prefixes.
    * Specify a number up to 100 to allow the AKS cluster to create that many *Standard* SKU public IPs in the same resource group created as the AKS cluster, which is usually named with *MC_* at the beginning. AKS assigns the public IP to the *Standard* SKU load balancer. By default, one public IP will automatically be created in the same resource group as the AKS cluster, if no public IP, public IP prefix, or number of IPs is specified. You also must allow public addresses and avoid creating any Azure Policy that bans IP creation.
* A public IP created by AKS cannot be reused as a custom bring your own public IP address. All custom IP addresses must be created and managed by the user.
* Defining the load balancer SKU can only be done when you create an AKS cluster. You can't change the load balancer SKU after an AKS cluster has been created.
* You can only use one type of load balancer SKU (Basic or Standard) in a single cluster.
* *Standard* SKU Load Balancers only support *Standard* SKU IP Addresses.

## Next steps

Learn more about Kubernetes services at the [Kubernetes services documentation][kubernetes-services].

Learn more about using Internal Load Balancer for Inbound traffic at the [AKS Internal Load Balancer documentation](internal-lb.md).

<!-- LINKS - External -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/

<!-- LINKS - Internal -->
[advanced-networking]: configure-azure-cni.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-sp]: kubernetes-service-principal.md#delegate-access-to-other-azure-resources
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
[maxsurge]: upgrade-cluster.md#customize-node-surge-upgrade
[az-lb]: ../load-balancer/load-balancer-overview.md