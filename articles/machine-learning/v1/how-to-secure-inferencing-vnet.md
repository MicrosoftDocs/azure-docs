---
title: Secure v1 inferencing environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning inferencing environment (v1).
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 07/28/2022
ms.custom: UpdateFrequency5, contperf-fy20q4, tracking-python, contperf-fy21q1, devx-track-azurecli, sdkv1, event-tier1-build-2022
---

# Secure an Azure Machine Learning inferencing environment with virtual networks (v1)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]
[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]


In this article, you learn how to secure inferencing environments with a virtual network in Azure Machine Learning. This article is specific to the SDK/CLI v1 deployment workflow of deploying a model as a web service.

> [!TIP]
> This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:
>
> * [Virtual network overview](../how-to-network-security-overview.md)
> * [Secure the workspace resources](../how-to-secure-workspace-vnet.md)
> * [Secure the training environment](../how-to-secure-training-vnet.md)
> * [Enable studio functionality](../how-to-enable-studio-virtual-network.md)
> * [Use custom DNS](../how-to-custom-dns.md)
> * [Use a firewall](../how-to-access-azureml-behind-firewall.md)
>
> For a tutorial on creating a secure workspace, see [Tutorial: Create a secure workspace](../tutorial-create-secure-workspace.md) or [Tutorial: Create a secure workspace using a template](../tutorial-create-secure-workspace-template.md).

In this article you learn how to secure the following inferencing resources in a virtual network:
> [!div class="checklist"]
> - Default Azure Kubernetes Service (AKS) cluster
> - Private AKS cluster
> - AKS cluster with private link

## Prerequisites

+ Read the [Network security overview](../how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet to use with your compute resources.

[!INCLUDE [network-rbac](../includes/network-rbac.md)]

[!INCLUDE [cli v1 deprecation](../includes/machine-learning-cli-v1-deprecation.md)]

## Limitations

### Azure Container Instances

When your Azure Machine Learning workspace is configured with a private endpoint, deploying to Azure Container Instances in a VNet is not supported. Instead, consider using a [Managed online endpoint with network isolation](../how-to-secure-online-endpoint.md).

### Azure Kubernetes Service

* If your AKS cluster is behind of a VNET, your workspace and its associated resources (storage, key vault, Azure Container Registry) must have private endpoints or service endpoints in the same VNET as AKS cluster's VNET. Please read tutorial [create a secure workspace](../tutorial-create-secure-workspace.md) to add those private endpoints or service endpoints to your VNET.
* If your workspace has a __private endpoint__, the Azure Kubernetes Service cluster must be in the same Azure region as the workspace.
* Using a [public fully qualified domain name (FQDN) with a private AKS cluster](../../aks/private-clusters.md) is __not supported__ with Azure Machine Learning.

<a id="aksvnet"></a>

## Azure Kubernetes Service

> [!IMPORTANT]
> To use an AKS cluster in a virtual network, first follow the prerequisites in [Configure advanced networking in Azure Kubernetes Service (AKS)](../../aks/configure-azure-cni.md#prerequisites).


To add AKS in a virtual network to your workspace, use the following steps:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/), and then select your subscription and workspace.
1. Select __Compute__ on the left, __Inference clusters__ from the center, and then select __+ New__.

    :::image type="content" source="./media/how-to-secure-inferencing-vnet/create-inference.png" alt-text="Screenshot of create inference cluster dialog.":::

1. From the __Create inference cluster__ dialog, select __Create new__ and the VM size to use for the cluster. Finally, select __Next__.

    :::image type="content" source="./media/how-to-secure-inferencing-vnet/create-inference-vm.png" alt-text="Screenshot of VM settings.":::

1. From the __Configure Settings__ section, enter a __Compute name__, select the __Cluster Purpose__, __Number of nodes__, and then select __Advanced__ to display the network settings. In the __Configure virtual network__ area, set the following values:

    * Set the __Virtual network__ to use.

        > [!TIP]
        > If your workspace uses a private endpoint to connect to the virtual network, the __Virtual network__ selection field is greyed out.

    * Set the __Subnet__ to create the cluster in.
    * In the __Kubernetes Service address range__ field, enter the Kubernetes service address range. This address range uses a Classless Inter-Domain Routing (CIDR) notation IP range to define the IP addresses that are available for the cluster. It must not overlap with any subnet IP ranges (for example, 10.0.0.0/16).
    * In the __Kubernetes DNS service IP address__ field, enter the Kubernetes DNS service IP address. This IP address is assigned to the Kubernetes DNS service. It must be within the Kubernetes service address range (for example, 10.0.0.10).
    * In the __Docker bridge address__ field, enter the Docker bridge address. This IP address is assigned to Docker Bridge. It must not be in any subnet IP ranges, or the Kubernetes service address range (for example, 172.18.0.1/16).

    :::image type="content" source="./media/how-to-secure-inferencing-vnet/create-inference-settings.png" alt-text="Screenshot of configure network settings.":::

1. When you deploy a model as a web service to AKS, a scoring endpoint is created to handle inferencing requests. Make sure that the network security group (NSG) that controls the virtual network has an inbound security rule enabled for the IP address of the scoring endpoint if you want to call it from outside the virtual network.

    To find the IP address of the scoring endpoint, look at the scoring URI for the deployed service. For information on viewing the scoring URI, see [Consume a model deployed as a web service](how-to-consume-web-service.md#connection-information).

   > [!IMPORTANT]
   > Keep the default outbound rules for the NSG. For more information, see the default security rules in [Security groups](../../virtual-network/network-security-groups-overview.md#default-security-rules).

   ![Screenshot that shows an inbound security rule.](./media/how-to-secure-inferencing-vnet/aks-vnet-inbound-nsg-scoring.png)](./media/how-to-secure-inferencing-vnet/aks-vnet-inbound-nsg-scoring.png#lightbox)

    > [!IMPORTANT]
    > The IP address shown in the image for the scoring endpoint will be different for your deployments. While the same IP is shared by all deployments to one AKS cluster, each AKS cluster will have a different IP address.

You can also use the Azure Machine Learning SDK to add Azure Kubernetes Service in a virtual network. If you already have an AKS cluster in a virtual network, attach it to the workspace as described in [How to deploy to AKS](how-to-deploy-and-where.md). The following code creates a new AKS instance in the `default` subnet of a virtual network named `mynetwork`:

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core.compute import ComputeTarget, AksCompute

# Create the compute configuration and set virtual network information
config = AksCompute.provisioning_configuration(location="eastus2")
config.vnet_resourcegroup_name = "mygroup"
config.vnet_name = "mynetwork"
config.subnet_name = "default"
config.service_cidr = "10.0.0.0/16"
config.dns_service_ip = "10.0.0.10"
config.docker_bridge_cidr = "172.17.0.1/16"

# Create the compute target
aks_target = ComputeTarget.create(workspace=ws,
                                  name="myaks",
                                  provisioning_configuration=config)
```

When the creation process is completed, you can run inference, or model scoring, on an AKS cluster behind a virtual network. For more information, see [How to deploy to AKS](how-to-deploy-and-where.md).

For more information on using Role-Based Access Control with Kubernetes, see [Use Azure RBAC for Kubernetes authorization](../../aks/manage-azure-rbac.md).

## Network contributor role

> [!IMPORTANT]
> If you create or attach an AKS cluster by providing a virtual network you previously created, you must grant the service principal (SP) or managed identity for your AKS cluster the _Network Contributor_ role to the resource group that contains the virtual network.
>
> To add the identity as network contributor, use the following steps:

1. To find the service principal or managed identity ID for AKS, use the following Azure CLI commands. Replace `<aks-cluster-name>` with the name of the cluster. Replace `<resource-group-name>` with the name of the resource group that _contains the AKS cluster_:

    ```azurecli-interactive
    az aks show -n <aks-cluster-name> --resource-group <resource-group-name> --query servicePrincipalProfile.clientId
    ``` 

    If this command returns a value of `msi`, use the following command to identify the principal ID for the managed identity:

    ```azurecli-interactive
    az aks show -n <aks-cluster-name> --resource-group <resource-group-name> --query identity.principalId
    ```

1. To find the ID of the resource group that contains your virtual network, use the following command. Replace `<resource-group-name>` with the name of the resource group that _contains the virtual network_:

    ```azurecli-interactive
    az group show -n <resource-group-name> --query id
    ```

1. To add the service principal or managed identity as a network contributor, use the following command. Replace `<SP-or-managed-identity>` with the ID returned for the service principal or managed identity. Replace `<resource-group-id>` with the ID returned for the resource group that contains the virtual network:

    ```azurecli-interactive
    az role assignment create --assignee <SP-or-managed-identity> --role 'Network Contributor' --scope <resource-group-id>
    ```
For more information on using the internal load balancer with AKS, see [Use internal load balancer with Azure Kubernetes Service](../../aks/internal-lb.md).

## Secure VNet traffic

There are two approaches to isolate traffic to and from the AKS cluster to the virtual network:

* __Private AKS cluster__: This approach uses Azure Private Link to secure communications with the cluster for deployment/management operations.
* __Internal AKS load balancer__: This approach configures the endpoint for your deployments to AKS to use a private IP within the virtual network.

### Private AKS cluster

By default, AKS clusters have a control plane, or API server, with public IP addresses. You can configure AKS to use a private control plane by creating a private AKS cluster. For more information, see [Create a private Azure Kubernetes Service cluster](../../aks/private-clusters.md).

After you create the private AKS cluster, [attach the cluster to the virtual network](how-to-create-attach-kubernetes.md) to use with Azure Machine Learning.

### Internal AKS load balancer

By default, AKS deployments use a [public load balancer](../../aks/load-balancer-standard.md). In this section, you learn how to configure AKS to use an internal load balancer. An internal (or private) load balancer is used where only private IPs are allowed as frontend. Internal load balancers are used to load balance traffic inside a virtual network

A private load balancer is enabled by configuring AKS to use an _internal load balancer_. 

#### Enable private load balancer

> [!IMPORTANT]
> You cannot enable private IP when creating the Azure Kubernetes Service cluster in Azure Machine Learning studio. You can create one with an internal load balancer when using the Python SDK or Azure CLI extension for machine learning.

The following examples demonstrate how to __create a new AKS cluster with a private IP/internal load balancer__ using the SDK and CLI:

# [Python SDK](#tab/python)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
import azureml.core
from azureml.core.compute import AksCompute, ComputeTarget

# Verify that cluster does not exist already
try:
    aks_target = AksCompute(workspace=ws, name=aks_cluster_name)
    print("Found existing aks cluster")

except:
    print("Creating new aks cluster")

    # Subnet to use for AKS
    subnet_name = "default"
    # Create AKS configuration
    prov_config=AksCompute.provisioning_configuration(load_balancer_type="InternalLoadBalancer")
    # Set info for existing virtual network to create the cluster in
    prov_config.vnet_resourcegroup_name = "myvnetresourcegroup"
    prov_config.vnet_name = "myvnetname"
    prov_config.service_cidr = "10.0.0.0/16"
    prov_config.dns_service_ip = "10.0.0.10"
    prov_config.subnet_name = subnet_name
    prov_config.load_balancer_subnet = subnet_name
    prov_config.docker_bridge_cidr = "172.17.0.1/16"

    # Create compute target
    aks_target = ComputeTarget.create(workspace = ws, name = "myaks", provisioning_configuration = prov_config)
    # Wait for the operation to complete
    aks_target.wait_for_completion(show_output = True)
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az ml computetarget create aks -n myaks --load-balancer-type InternalLoadBalancer
```

To upgrade an existing AKS cluster to use an internal load balancer, use the following command:

```azurecli
az ml computetarget update aks \
                           -n myaks \
                           --load-balancer-subnet mysubnet \
                           --load-balancer-type InternalLoadBalancer \
                           --workspace-name myworkspace \
                           -g myresourcegroup
```


For more information, see the [az ml computetarget create aks](/cli/azure/ml(v1)/computetarget/create#az-ml-computetarget-create-aks) and [az ml computetarget update aks](/cli/azure/ml(v1)/computetarget/update#az-ml-computetarget-update-aks) reference.

---

When __attaching an existing cluster__ to your workspace, use the `load_balancer_type` and `load_balancer_subnet` parameters of [AksCompute.attach_configuration()](/python/api/azureml-core/azureml.core.compute.aks.akscompute#azureml-core-compute-aks-akscompute-attach-configuration) to configure the load balancer.

For information on attaching a cluster, see [Attach an existing AKS cluster](how-to-create-attach-kubernetes.md).

## Limit outbound connectivity from the virtual network

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, you must allow access to Azure Container Registry. For example, make sure that your Network Security Groups (NSG) contains a rule that allows access to the __AzureContainerRegistry.RegionName__ service tag where `{RegionName} is the name of an Azure region.

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](../how-to-network-security-overview.md)
* [Secure the workspace resources](../how-to-secure-workspace-vnet.md)
* [Secure the training environment](../how-to-secure-training-vnet.md)
* [Enable studio functionality](../how-to-enable-studio-virtual-network.md)
* [Use custom DNS](../how-to-custom-dns.md)
* [Use a firewall](../how-to-access-azureml-behind-firewall.md)
