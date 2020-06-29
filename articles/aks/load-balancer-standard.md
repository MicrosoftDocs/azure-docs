---
title: Use a Public Load Balancer
titleSuffix: Azure Kubernetes Service
description: Learn how to use a public load balancer with a Standard SKU to expose your services with Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 06/14/2020
ms.author: jpalma
author: jpalma

#Customer intent: As a cluster operator or developer, I want to learn how to create a service in AKS that uses an Azure Load Balancer with a Standard SKU.
---

# Use a public Standard Load Balancer in Azure Kubernetes Service (AKS)

The Azure Load Balancer is an L4 of the Open Systems Interconnection (OSI) model that supports both inbound and outbound scenarios. It distributes inbound flows that arrive at the load balancer's front end to the backend pool instances.

A **public** Load Balancer when integrated with AKS serves two purposes:

1. To provide outbound connections to the cluster nodes inside the AKS virtual network. It achieves this objective by translating the nodes private IP address to a public IP address that is part of its *Outbound Pool*.
2. To provide access to applications via Kubernetes services of type `LoadBalancer`. With it, you can easily scale your applications and create highly available services.

An **internal (or private)** load balancer is used where only private IPs are allowed as frontend. Internal load balancers are used to load balance traffic inside a virtual network. A load balancer frontend can also be accessed from an on-premises network in a hybrid scenario.

This document covers the integration with Public Load balancer. For internal Load Balancer integration, see the [AKS Internal Load balancer documentation](internal-lb.md).

## Before you begin

Azure Load Balancer is available in two SKUs - *Basic* and *Standard*. By default, *Standard* SKU is used when you create an AKS cluster. Use the *Standard* SKU to have access to added functionality, such as a larger backend pool, [**multiple node pools**](use-multiple-node-pools.md), and [**Availability Zones**](availability-zones.md). It's the recommended Load Balancer SKU for AKS.

For more information on the *Basic* and *Standard* SKUs, see [Azure load balancer SKU comparison][azure-lb-comparison].

This article assumes you have an AKS cluster with the *Standard* SKU Azure Load Balancer and walks through how to use and configure some of the capabilities and features of the load balancer. 
If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

> [!IMPORTANT]
> If you prefer not to leverage the Azure Load Balancer to provide outbound connection and instead have your own gateway, firewall or proxy for that purpose you can skip the creation of the load balancer outbound pool and respective frontend IP by using [**Outbound type as UserDefinedRouting (UDR)**](egress-outboundtype.md). The Outbound type defines the egress method for a cluster and it defaults to type: load balancer.

## Use the public standard load balancer

After creating an AKS cluster with Outbound Type: Load Balancer (default), the cluster is ready to use the load balancer to expose services as well.

For that you can create a public Service of type `LoadBalancer` as shown in the following example. Start by creating a service manifest named `public-svc.yaml`:

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

Deploy the public service manifest by using [kubectl apply][kubectl-apply] and specify the name of your YAML manifest:

```azurecli-interactive
kubectl apply -f public-svc.yaml
```

The Azure Load Balancer will be configured with a new public IP that will front this new service. Since the Azure Load Balancer can have multiple Frontend IPs, each new service deployed will get a new dedicated frontend IP to be uniquely accessed.

You can confirm your service is created and the load balancer is configured by running for example:

```azurecli-interactive
kubectl get service public-svc
```

```console
NAMESPACE     NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)         AGE
default       public-svc    LoadBalancer   10.0.39.110    52.156.88.187   80:32068/TCP    52s
```

When you view the service details, the public IP address created for this service on the load balancer is shown in the *EXTERNAL-IP* column. It may take a minute or two for the IP address to change from *\<pending\>* to an actual public IP address, as shown in the above example.

## Configure the public standard load balancer

When using the Standard SKU public load balancer, there's a set of options that can be customized at creation time or by updating the cluster. These options allow you to customize the Load Balancer to meet your workloads needs and should be reviewed accordingly. With the Standard load balancer you can:

* Set or scale the number of Managed Outbound IPs
* Bring your own custom [Outbound IPs or Outbound IP Prefix](#provide-your-own-outbound-public-ips-or-prefixes)
* Customize the number of allocated outbound ports to each node of the cluster
* Configure the timeout setting for idle connections

### Scale the number of managed outbound public IPs

Azure Load Balancer provides outbound connectivity from a virtual network in addition to inbound. Outbound rules make it simple to configure public Standard Load Balancer's outbound network address translation.

Like all Load Balancer rules, outbound rules follow the same familiar syntax as load balancing and inbound NAT rules:

***frontend IPs + parameters + backend pool***

An outbound rule configures outbound NAT for all virtual machines identified by the backend pool to be translated to the frontend. And parameters provide additional fine grained control over the outbound NAT algorithm.

While an outbound rule can be used with just a single public IP address, outbound rules ease the configuration burden for scaling outbound NAT. You can use multiple IP addresses to plan for large-scale scenarios and you can use outbound rules to mitigate SNAT exhaustion prone patterns. Each additional IP address provided by a frontend provides 64k ephemeral ports for Load Balancer to use as SNAT ports. 

When using a *Standard* SKU load balancer with managed outbound public IPs, which are created by default, you can scale the number of managed outbound public IPs using the **`load-balancer-managed-ip-count`** parameter.

To update an existing cluster, run the following command. This parameter can also be set at cluster create-time to have multiple managed outbound public IPs.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 2
```

The above example sets the number of managed outbound public IPs to *2* for the *myAKSCluster* cluster in *myResourceGroup*. 

You can also use the **`load-balancer-managed-ip-count`** parameter to set the initial number of managed outbound public IPs when creating your cluster by appending the **`--load-balancer-managed-outbound-ip-count`** parameter and setting it to your desired value. The default number of managed outbound public IPs is 1.

### Provide your own outbound public IPs or prefixes

When you use a *Standard* SKU load balancer, by default the AKS cluster automatically creates a public IP in the AKS-managed infrastructure resource group and assigns it to the load balancer outbound pool.

A public IP created by AKS is considered an AKS managed resource. This means the lifecycle of that public IP is intended to be managed by AKS and requires no user action directly on the public IP resource. Alternatively, you can assign your own custom public IP or public IP prefix at cluster creation time. Your custom IPs can also be updated on an existing cluster's load balancer properties.

> [!NOTE]
> Custom public IP addresses must be created and owned by the user. Managed public IP addresses created by AKS cannot be reused as a bring your own custom IP as it can cause management conflicts.

Before you do this operation, make sure you meet the [pre-requisites and constraints](../virtual-network/public-ip-address-prefix.md#constraints) necessary to configure Outbound IPs or Outbound IP prefixes.

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

You can also use public IP prefixes for egress with your *Standard* SKU load balancer. The following example uses the [az network public-ip prefix show][az-network-public-ip-prefix-show] command to list the IDs of your public IP prefixes:

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

You may wish to bring your own IP addresses or IP prefixes for egress at cluster creation time to support scenarios like whitelisting egress endpoints. Append the same parameters shown above to your cluster creation step to define your own public IPs and IP prefixes at the start of a cluster's lifecycle.

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
> If you have applications on your cluster which are expected to establish a large number of connection to small set of destinations, eg. many frontend instances connecting to an SQL DB, you have a scenario very susceptible to encounter SNAT Port exhaustion (run out of ports to connect from). For these scenarios it's highly recommended to increase the allocated outbound ports and outbound frontend IPs on the load balancer. The increase should consider that one (1) additional IP address adds 64k additional ports to distribute across all cluster nodes.


Unless otherwise specified, AKS will use the default value of Allocated Outbound Ports that Standard Load Balancer defines when configuring it. This value is **null** on the AKS API or **0** on the SLB API as shown by the below command:

```azurecli-interactive
NODE_RG=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
az network lb outbound-rule list --resource-group $NODE_RG --lb-name kubernetes -o table
```

The previous commands will list the outbound rule for your load balancer, for example:

```console
AllocatedOutboundPorts    EnableTcpReset    IdleTimeoutInMinutes    Name             Protocol    ProvisioningState    ResourceGroup
------------------------  ----------------  ----------------------  ---------------  ----------  -------------------  -------------
0                         True              30                      aksOutboundRule  All         Succeeded            MC_myResourceGroup_myAKSCluster_eastus  
```

This output does not mean that you have 0 ports but instead that you are leveraging the [automatic outbound port assignment based on backend pool size][azure-lb-outbound-preallocatedports], so for example if a cluster has 50 or less nodes, 1024 ports for each node are allocated, as you increase the number of nodes from there you'll gradually get fewer ports per node.


To define or increase the number of Allocated Outbound ports, you can follow the below example:


```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 7 \
    --load-balancer-outbound-ports 4000
```

This example would give you 4000 Allocated Outbound Ports for each node in my cluster, and with 7 IPs you would have *4000 ports per node * 100 nodes = 400k total ports <  = 448k total ports = 7 IPs * 64k ports per IP*. This would allow you to safely scale to 100 nodes and have a default upgrade operation. It is critical to allocate sufficient ports for additional nodes needed for upgrade and other operations. AKS defaults to one buffer node for upgrade, in this example this requires 4000 free ports at any given point in time. If using [maxSurge values](upgrade-cluster.md#customize-node-surge-upgrade-preview), multiply the outbound ports per node by your maxSurge value.

To safely go above 100 nodes, you'd have to add more IPs.


> [!IMPORTANT]
> You must [calculate your required quota and check the requirements][requirements] before customizing *allocatedOutboundPorts* to avoid connectivity or scaling issues.

You can also use the **`load-balancer-outbound-ports`** parameters when creating a cluster, but you must also specify either **`load-balancer-managed-outbound-ip-count`**, **`load-balancer-outbound-ips`**, or **`load-balancer-outbound-ip-prefixes`** as well.  For example:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-sku standard \
    --load-balancer-managed-outbound-ip-count 2 \
    --load-balancer-outbound-ports 1024 
```

### Configure the load balancer idle timeout

When SNAT port resources are exhausted, outbound flows fail until existing flows release SNAT ports. Load Balancer reclaims SNAT ports when the flow closes and the AKS-configured load balancer uses a 30-minute idle timeout for reclaiming SNAT ports from idle flows.
You can also use transport (for example, **`TCP keepalives`**) or **`application-layer keepalives`** to refresh an idle flow and reset this idle timeout if necessary. You can configure this timeout following the below example: 


```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-idle-timeout 4
```

If you expect to have numerous short lived connections, and no connections that are long lived and might have long times of idle, like leveraging `kubectl proxy` or `kubectl port-forward` consider using a low timeout value such as 4 minutes. Also, when using TCP keepalives, it's sufficient to enable them on one side of the connection. For example, it's sufficient to enable them on the server side only to reset the idle timer of the flow and it's not necessary for both sides to start TCP keepalives. Similar concepts exist for application layer, including database client-server configurations. Check the server side for what options exist for application-specific keepalives.

> [!IMPORTANT]
> AKS enables TCP Reset on idle by default and recommends you keep this configuration on and leverage it for more predictable application behavior on your scenarios.
> TCP RST is only sent during TCP connection in ESTABLISHED state. Read more about it [here](../load-balancer/load-balancer-tcp-reset.md).

### Requirements for customizing allocated outbound ports and idle timeout

- The value you specify for *allocatedOutboundPorts* must also be a multiple of 8.
- You must have enough outbound IP capacity based on the number of your node VMs and required allocated outbound ports. To validate you have enough outbound IP capacity, use the following formula: 
 
*outboundIPs* \* 64,000 \> *nodeVMs* \* *desiredAllocatedOutboundPorts*.
 
For example, if you have 3 *nodeVMs*, and 50,000 *desiredAllocatedOutboundPorts*, you need to have at least 3 *outboundIPs*. It is recommended that you incorporate additional outbound IP capacity beyond what you need. Additionally, you must account for the cluster autoscaler and the possibility of node pool upgrades when calculating outbound IP capacity. For the cluster autoscaler, review the current node count and the maximum node count and use the higher value. For upgrading, account for an additional node VM for every node pool that allows upgrading.
 
- When setting *IdleTimeoutInMinutes* to a different value than the default of 30 minutes, consider how long your workloads will need an outbound connection. Also consider the default timeout value for a *Standard* SKU load balancer used outside of AKS is 4 minutes. An *IdleTimeoutInMinutes* value that more accurately reflects your specific AKS workload can help decrease SNAT exhaustion caused by tying up connections no longer being used.

> [!WARNING]
> Altering the values for *AllocatedOutboundPorts* and *IdleTimeoutInMinutes* may significantly change the behavior of the outbound rule for your load balancer and should not be done lightly, without understanding the tradeoffs and your application's connection patterns, check the [SNAT Troubleshooting section below][troubleshoot-snat] and review the [Load Balancer outbound rules][azure-lb-outbound-rules-overview] and [outbound connections in Azure][azure-lb-outbound-connections] before updating these values to fully understand the impact of your changes.


## Restrict inbound traffic to specific IP ranges

The Network Security Group (NSG) associated with the virtual network for the load balancer, by default, has a rule to allow all inbound external traffic. You can update this rule to only allow specific IP ranges for inbound traffic. The following manifest uses *loadBalancerSourceRanges* to specify a new IP range for inbound external traffic:

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

## Additional customizations via Kubernetes Annotations

Below is a list of annotations supported for Kubernetes services with type `LoadBalancer`, these annotations only apply to **INBOUND** flows:

| Annotation | Value | Description
| ----------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------ 
| `service.beta.kubernetes.io/azure-load-balancer-internal`         | `true` or `false`                     | Specify whether the load balancer should be internal. It’s defaulting to public if not set.
| `service.beta.kubernetes.io/azure-load-balancer-internal-subnet`  | Name of the subnet                    | Specify which subnet the internal load balancer should be bound to. It’s defaulting to the subnet configured in cloud config file if not set.
| `service.beta.kubernetes.io/azure-dns-label-name`                 | Name of the DNS label on Public IPs   | Specify the DNS label name for the **public** service. If it is set to empty string, the DNS entry in the Public IP will not be used.
| `service.beta.kubernetes.io/azure-shared-securityrule`            | `true` or `false`                     | Specify that the service should be exposed using an Azure security rule that may be shared with another service, trading specificity of rules for an increase in the number of services that can be exposed. This annotation relies on the Azure [Augmented Security Rules](../virtual-network/security-overview.md#augmented-security-rules) feature of Network Security groups. 
| `service.beta.kubernetes.io/azure-load-balancer-resource-group`   | Name of the resource group            | Specify the resource group of load balancer public IPs that aren't in the same resource group as the cluster infrastructure (node resource group).
| `service.beta.kubernetes.io/azure-allowed-service-tags`           | List of allowed service tags          | Specify a list of allowed [service tags](../virtual-network/security-overview.md#service-tags) separated by comma.
| `service.beta.kubernetes.io/azure-load-balancer-tcp-idle-timeout` | TCP idle timeouts in minutes          | Specify the time, in minutes, for TCP connection idle timeouts to occur on the load balancer. Default and minimum value is 4. Maximum value is 30. Must be an integer.
|`service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset` | `true`                                | Disable `enableTcpReset` for SLB


## Troubleshooting SNAT

If you know that you're starting many outbound TCP or UDP connections to the same destination IP address and port, and you observe failing outbound connections or are advised by support that you're exhausting SNAT ports (preallocated ephemeral ports used by PAT), you have several general mitigation options. Review these options and decide what is available and best for your scenario. It's possible that one or more can help manage this scenario. For detailed information, review the [Outbound Connections Troubleshooting Guide](../load-balancer/troubleshoot-outbound-connection.md#snatexhaust).

Frequently the root cause of SNAT exhaustion is an anti-pattern for how outbound connectivity is established, managed, or configurable timers changed from their default values. Review this section carefully.

### Steps
1. Check if your connections remain idle for a long time and rely on the default idle timeout for releasing that port. If so the default timeout of 30 min might need to be reduced for your scenario.
2. Investigate how your application is creating outbound connectivity (for example, code review or packet capture).
3. Determine if this activity is expected behavior or whether the application is misbehaving. Use [metrics](../load-balancer/load-balancer-standard-diagnostics.md) and [logs](../load-balancer/load-balancer-monitor-log.md) in Azure Monitor to substantiate your findings. Use "Failed" category for SNAT Connections metric for example.
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


The above example updates the rule to only allow inbound external traffic from the *MY_EXTERNAL_IP_RANGE* range. More information about using this method to restrict access to the load balancer service is available in the [Kubernetes documentation][kubernetes-cloud-provider-firewall].


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
[kubernetes-cloud-provider-firewall]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/#restrict-access-for-loadbalancer-service
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/
[aks-engine]: https://github.com/Azure/aks-engine

<!-- LINKS - Internal -->
[advanced-networking]: configure-azure-cni.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[aks-sp]: kubernetes-service-principal.md#delegate-access-to-other-azure-resources
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-aks-install-cli]: /cli/azure/aks?view=azure-cli-latest#az-aks-install-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-group-create]: /cli/azure/group#az-group-create
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-network-lb-outbound-rule-list]: /cli/azure/network/lb/outbound-rule?view=azure-cli-latest#az-network-lb-outbound-rule-list
[az-network-public-ip-show]: /cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-show
[az-network-public-ip-prefix-show]: /cli/azure/network/public-ip/prefix?view=azure-cli-latest#az-network-public-ip-prefix-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[azure-lb]: ../load-balancer/load-balancer-overview.md
[azure-lb-comparison]: ../load-balancer/skus.md
[azure-lb-outbound-rules]: ../load-balancer/load-balancer-outbound-rules-overview.md#snatports
[azure-lb-outbound-connections]: ../load-balancer/load-balancer-outbound-connections.md#snat
[azure-lb-outbound-preallocatedports]: ../load-balancer/load-balancer-outbound-connections.md#preallocatedports
[azure-lb-outbound-rules-overview]: ../load-balancer/load-balancer-outbound-rules-overview.md
[install-azure-cli]: /cli/azure/install-azure-cli
[internal-lb-yaml]: internal-lb.md#create-an-internal-load-balancer
[kubernetes-concepts]: concepts-clusters-workloads.md
[use-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[requirements]: #requirements-for-customizing-allocated-outbound-ports-and-idle-timeout
[use-multiple-node-pools]: use-multiple-node-pools.md
[troubleshoot-snat]: #troubleshooting-snat
