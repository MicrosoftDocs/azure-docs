---
title: Use instance-level public IPs in Azure Kubernetes Service (AKS)
description: Learn how to manage instance-level public IPs Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 1/12/2023
ms.author: pahealy
author: phealy
---

# Use instance-level public IPs in Azure Kubernetes Service (AKS)

AKS nodes don't require their own public IP addresses for communication. However, scenarios may require nodes in a node pool to receive their own dedicated public IP addresses. A common scenario is for gaming workloads, where a console needs to make a direct connection to a cloud virtual machine to minimize hops. This scenario can be achieved on AKS by using Node Public IP.

First, create a new resource group.

```azurecli-interactive
az group create --name myResourceGroup2 --location eastus
```

Create a new AKS cluster and attach a public IP for your nodes. Each of the nodes in the node pool receives a unique public IP. You can verify this by looking at the Virtual Machine Scale Set instances.

```azurecli-interactive
az aks create -g MyResourceGroup2 -n MyManagedCluster -l eastus  --enable-node-public-ip
```

For existing AKS clusters, you can also add a new node pool, and attach a public IP for your nodes.

```azurecli-interactive
az aks nodepool add -g MyResourceGroup2 --cluster-name MyManagedCluster -n nodepool2 --enable-node-public-ip
```

## Use a public IP prefix

There are a number of [benefits to using a public IP prefix][public-ip-prefix-benefits]. AKS supports using addresses from an existing public IP prefix for your nodes by passing the resource ID with the flag `node-public-ip-prefix` when creating a new cluster or adding a node pool.

First, create a public IP prefix using [az network public-ip prefix create][az-public-ip-prefix-create]:

```azurecli-interactive
az network public-ip prefix create --length 28 --location eastus --name MyPublicIPPrefix --resource-group MyResourceGroup3
```

View the output, and take note of the `id` for the prefix:

```output
{
  ...
  "id": "/subscriptions/<subscription-id>/resourceGroups/myResourceGroup3/providers/Microsoft.Network/publicIPPrefixes/MyPublicIPPrefix",
  ...
}
```

Finally, when creating a new cluster or adding a new node pool, use the flag `node-public-ip-prefix` and pass in the prefix's resource ID:

```azurecli-interactive
az aks create -g MyResourceGroup3 -n MyManagedCluster -l eastus --enable-node-public-ip --node-public-ip-prefix /subscriptions/<subscription-id>/resourcegroups/MyResourceGroup3/providers/Microsoft.Network/publicIPPrefixes/MyPublicIPPrefix
```

## Locate public IPs for nodes

You can locate the public IPs for your nodes in various ways:

* Use the Azure CLI command [`az vmss list-instance-public-ips`][az-list-ips].
* Use [PowerShell or Bash commands][vmss-commands]. 
* You can also view the public IPs in the Azure portal by viewing the instances in the Virtual Machine Scale Set.

> [!Important]
> The [node resource group][node-resource-group] contains the nodes and their public IPs. Use the node resource group when executing commands to find the public IPs for your nodes.

```azurecli
az vmss list-instance-public-ips -g MC_MyResourceGroup2_MyManagedCluster_eastus -n YourVirtualMachineScaleSetName
```

## Use public IP tags on node public IPs (PREVIEW)

Public IP tags can be utilized on node public IPs to utilize the [Azure Routing Preference](../virtual-network/ip-services/routing-preference-overview.md) feature.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

### Requirements

* AKS version 1.24 or greater is required.
* Version 0.5.115 of the aks-preview extension is required.

### Install the aks-preview Azure CLI extension

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

### Register the 'NodePublicIPTagsPreview' feature flag

Register the `NodePublicIPTagsPreview` feature flag by using the [`az feature register`][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "NodePublicIPTagsPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [`az feature show`][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "NodePublicIPTagsPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [`az provider register`][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Create a new cluster using routing preference internet

```azurecli-interactive
az aks create -n <clusterName> -l <location> -g <resourceGroup> \
  --enable-node-public-ip \
  --node-public-ip-tags RoutingPreference=Internet
```

### Add a node pool with routing preference internet

```azurecli-interactive
az aks nodepool add --cluster-name <clusterName> -n <nodepoolName> -l <location> -g <resourceGroup> \
  --enable-node-public-ip \
  --node-public-ip-tags RoutingPreference=Internet
```

## Allow host port connections and add node pools to application security groups (PREVIEW)

AKS nodes utilizing node public IPs that host services on their host address need to have an NSG rule added to allow the traffic. Adding the desired ports in the node pool configuration will create the appropriate allow rules in the cluster network security group.

If a network security group is in place on the subnet with a cluster using bring-your-own virtual network, an allow rule must be added to that network security group. This can be limited to the nodes in a given node pool by adding the node pool to an [application security group](../virtual-network/network-security-groups-overview.md#application-security-groups) (ASG). A managed ASG will be created by default in the managed resource group if allowed host ports are specified. Nodes can also be added to one or more custom ASGs by specifying the resource ID of the NSG(s) in the node pool parameters.

### Host port specification format

When specifying the list of ports to allow, use a comma-separate list with entries in the format of `port/protocol` or `startPort-endPort/protocol`.

Examples:

- 80/tcp
- 80/tcp,443/tcp
- 53/udp,80/tcp
- 50000-60000/tcp

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

### Requirements

* AKS version 1.24 or greater is required.
* Version 0.5.110 of the aks-preview extension is required.

### Install the aks-preview Azure CLI extension

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

### Register the 'NodePublicIPNSGControlPreview' feature flag

Register the `NodePublicIPNSGControlPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "NodePublicIPNSGControlPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "NodePublicIPNSGControlPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Create a new cluster with allowed ports and application security groups

```azurecli-interactive
az aks create \
  --resource-group <resourceGroup> \
  --name <clusterName> \
  --nodepool-name <nodepoolName> \
  --nodepool-allowed-host-ports 80/tcp,443/tcp,53/udp,40000-60000/tcp,40000-50000/udp\
  --nodepool-asg-ids "<asgId>,<asgId>"
```

### Add a new node pool with allowed ports and application security groups

```az aks nodepool add \
  --resource-group <resourceGroup> \
  --cluster-name <clusterName> \
  --name <nodepoolName> \
  --allowed-host-ports 80/tcp,443/tcp,53/udp,40000-60000/tcp,40000-50000/udp \
  --asg-ids "<asgId>,<asgId>"
```

### Update the allowed ports and application security groups for a node pool

```az aks nodepool update \
  --resource-group <resourceGroup> \
  --cluster-name <clusterName> \
  --name <nodepoolName> \
  --allowed-host-ports 80/tcp,443/tcp,53/udp,40000-60000/tcp,40000-50000/udp \
  --asg-ids "<asgId>,<asgId>"
```

## Automatically assign host ports for pod workloads (PREVIEW)

When public IPs are configured on nodes, host ports can be utilized to allow pods to directly receive traffic without having to configure a load balancer service. This is especially useful in scenarios like gaming, where the ephemeral nature of the node IP and port is not a problem because a matchmaker service at a well-known hostname can provide the correct host and port to use at connection time. However, because only one process on a host can be listening on the same port, using applications with host ports can lead to problems with scheduling. To avoid this issue, AKS provides the ability to have the system dynamically assign an available port at scheduling time, preventing conflicts.

> [!WARNING]
> Pod host port traffic will be blocked by the default NSG rules in place on the cluster. This feature should be combined with allowing host ports on the node pool to allow traffic to flow.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

### Requirements

* AKS version 1.24 or greater is required.

### Register the 'PodHostPortAutoAssignPreview' feature flag

Register the `PodHostPortAutoAssignPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "PodHostPortAutoAssignPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "PodHostPortAutoAssignPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Automatically assign a host port to a pod

Triggering host port auto assignment is done by deploying a workload without any host ports and applying the `kubernetes.azure.com/assign-hostports-for-containerports` annotation with the list of ports that need host port assignments. The value of the annotation should be specified as a comma-separated list of entries like `port/protocol`, where the port is an individual port number that is defined in the Pod spec and the protocol is `tcp` or `udp`.

Ports will be assigned from the range `40000-59999` and will be unique across the cluster. The assigned ports will also be added to environment variables inside the pod so that the application can determine what ports were assigned. The environment variable name will be in the following format (example below): `<deployment name>_PORT_<port number>_<protocol>_HOSTPORT`, so an example would be `mydeployment_PORT_8080_TCP_HOSTPORT: 41932`.

Here is an example `echoserver` deployment, showing the mapping of host ports for ports 8080 and 8443:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: echoserver-hostport
  labels:
    app: echoserver-hostport
spec:
  replicas: 3
  selector:
    matchLabels:
      app: echoserver-hostport
  template:
    metadata:
      annotations:
        kubernetes.azure.com/assign-hostports-for-containerports: 8080/tcp,8443/tcp
      labels:
        app: echoserver-hostport
    spec:
      nodeSelector:
        kubernetes.io/os: linux
      containers:
        - name: echoserver-hostport
          image: k8s.gcr.io/echoserver:1.10
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
            - name: https
              containerPort: 8443
              protocol: TCP
```

When the deployment is applied, the `hostPort` entries will be in the YAML of the individual pods:

```shell
$ kubectl describe pod echoserver-hostport-75dc8d8855-4gjfc
<cut for brevity>
Containers:
  echoserver-hostport:
    Container ID:   containerd://d0b75198afe0612091f412ee7cf7473f26c80660143a96b459b3e699ebaee54c
    Image:          k8s.gcr.io/echoserver:1.10
    Image ID:       k8s.gcr.io/echoserver@sha256:cb5c1bddd1b5665e1867a7fa1b5fa843a47ee433bbb75d4293888b71def53229                                                                                                      Ports:          8080/TCP, 8443/TCP
    Host Ports:     46645/TCP, 49482/TCP
    State:          Running
      Started:      Thu, 12 Jan 2023 18:02:50 +0000
    Ready:          True
    Restart Count:  0
    Environment:
      echoserver-hostport_PORT_8443_TCP_HOSTPORT:  49482
      echoserver-hostport_PORT_8080_TCP_HOSTPORT:  46645
```

## Next steps

* Learn about [using multiple node pools in AKS](create-node-pools.md).

* Learn about [using standard load balancers in AKS](load-balancer-standard.md)

<!-- EXTERNAL LINKS -->

[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-taint]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#taint
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubernetes-labels]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
[kubernetes-label-syntax]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set
[capacity-reservation-groups]:/azure/virtual-machines/capacity-reservation-associate-virtual-machine-scale-set

<!-- INTERNAL LINKS -->
[arm-sku-vm1]: ../virtual-machines/dpsv5-dpdsv5-series.md
[arm-sku-vm2]: ../virtual-machines/dplsv5-dpldsv5-series.md
[arm-sku-vm3]: ../virtual-machines/epsv5-epdsv5-series.md
[aks-quickstart-windows-cli]: ./learn/quick-windows-container-deploy-cli.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az_aks_nodepool_list
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az_aks_nodepool_update
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az_aks_nodepool_upgrade
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool#az_aks_nodepool_scale
[az-aks-nodepool-delete]: /cli/azure/aks/nodepool#az_aks_nodepool_delete
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[az-deployment-group-create]: /cli/azure/deployment/group#az_deployment_group_create
[az-aks-nodepool-add]: /cli/azure/aks#az_aks_nodepool_add
[enable-fips-nodes]: enable-fips-nodes.md
[gpu-cluster]: gpu-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[quotas-skus-regions]: quotas-skus-regions.md
[supported-versions]: supported-kubernetes-versions.md
[tag-limitation]: ../azure-resource-manager/management/tag-resources.md
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[vm-sizes]: ../virtual-machines/sizes.md
[use-system-pool]: use-system-pools.md
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[vmss-commands]: ../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine
[az-list-ips]: /cli/azure/vmss#az_vmss_list_instance_public_ips
[reduce-latency-ppg]: reduce-latency-ppg.md
[public-ip-prefix-benefits]: ../virtual-network/ip-services/public-ip-address-prefix.md
[az-public-ip-prefix-create]: /cli/azure/network/public-ip/prefix#az_network_public_ip_prefix_create
[node-image-upgrade]: node-image-upgrade.md
[use-tags]: use-tags.md
[use-labels]: use-labels.md
[cordon-and-drain]: resize-node-pool.md#cordon-the-existing-nodes
[internal-lb-different-subnet]: internal-lb.md#specify-a-different-subnet
[drain-nodes]: resize-node-pool.md#drain-the-existing-nodes
