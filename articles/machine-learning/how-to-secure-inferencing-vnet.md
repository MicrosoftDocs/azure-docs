---
title: Secure inferencing environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning inferencing environment.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: larryfr
ms.author: peterlu
author: peterclu
ms.date: 10/23/2020
ms.custom: contperf-fy20q4, tracking-python, contperf-fy21q1, devx-track-azurecli

---

# Secure an Azure Machine Learning inferencing environment with virtual networks

In this article, you learn how to secure inferencing environments with a virtual network in Azure Machine Learning.

This article is part four of a five-part series that walks you through securing an Azure Machine Learning workflow. We highly recommend that you read through [Part one: VNet overview](how-to-network-security-overview.md) to understand the overall architecture first. 

See the other articles in this series:

[1. VNet overview](how-to-network-security-overview.md) > [Secure the workspace](how-to-secure-workspace-vnet.md) > [3. Secure the training environment](how-to-secure-training-vnet.md) > **4. Secure the inferencing environment** > [5. Enable studio functionality](how-to-enable-studio-virtual-network.md)

In this article you learn how to secure the following inferencing resources in a virtual network:
> [!div class="checklist"]
> - Default Azure Kubernetes Service (AKS) cluster
> - Private AKS cluster
> - AKS cluster with private link
> - Azure Container Instances (ACI)

## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet to use with your compute resources.

+ To deploy resources into a virtual network or subnet, your user account must have permissions to the following actions in Azure role-based access control (Azure RBAC):

    - "Microsoft.Network/virtualNetworks/join/action" on the virtual network resource.
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.

    For more information on Azure RBAC with networking, see the [Networking built-in roles](../role-based-access-control/built-in-roles.md#networking)

<a id="aksvnet"></a>

## Azure Kubernetes Service

To use an AKS cluster in a virtual network, the following network requirements must be met:

> [!div class="checklist"]
> * Follow the prerequisites in [Configure advanced networking in Azure Kubernetes Service (AKS)](../aks/configure-azure-cni.md#prerequisites).
> * The AKS instance and the virtual network must be in the same region. If you secure the Azure Storage Account(s) used by the workspace in a virtual network, they must be in the same virtual network as the AKS instance too.

To add AKS in a virtual network to your workspace, use the following steps:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/), and then select your subscription and workspace.

1. Select __Compute__ on the left.

1. Select __Inference clusters__ from the center, and then select __+__.

1. In the __New Inference Cluster__ dialog, select __Advanced__ under __Network configuration__.

1. To configure this compute resource to use a virtual network, perform the following actions:

    1. In the __Resource group__ drop-down list, select the resource group that contains the virtual network.
    1. In the __Virtual network__ drop-down list, select the virtual network that contains the subnet.
    1. In the __Subnet__ drop-down list, select the subnet.
    1. In the __Kubernetes Service address range__ box, enter the Kubernetes service address range. This address range uses a Classless Inter-Domain Routing (CIDR) notation IP range to define the IP addresses that are available for the cluster. It must not overlap with any subnet IP ranges (for example, 10.0.0.0/16).
    1. In the __Kubernetes DNS service IP address__ box, enter the Kubernetes DNS service IP address. This IP address is assigned to the Kubernetes DNS service. It must be within the Kubernetes service address range (for example, 10.0.0.10).
    1. In the __Docker bridge address__ box, enter the Docker bridge address. This IP address is assigned to Docker Bridge. It must not be in any subnet IP ranges, or the Kubernetes service address range (for example, 172.17.0.1/16).

   ![Azure Machine Learning: Machine Learning Compute virtual network settings](./media/how-to-enable-virtual-network/aks-virtual-network-screen.png)

1. When you deploy a model as a web service to AKS, a scoring endpoint is created to handle inferencing requests. Make sure that the NSG group that controls the virtual network has an inbound security rule enabled for the IP address of the scoring endpoint if you want to call it from outside the virtual network.

    To find the IP address of the scoring endpoint, look at the scoring URI for the deployed service. For information on viewing the scoring URI, see [Consume a model deployed as a web service](how-to-consume-web-service.md#connection-information).

   > [!IMPORTANT]
   > Keep the default outbound rules for the NSG. For more information, see the default security rules in [Security groups](../virtual-network/network-security-groups-overview.md#default-security-rules).

   [![An inbound security rule](./media/how-to-enable-virtual-network/aks-vnet-inbound-nsg-scoring.png)](./media/how-to-enable-virtual-network/aks-vnet-inbound-nsg-scoring.png#lightbox)

    > [!IMPORTANT]
    > The IP address shown in the image for the scoring endpoint will be different for your deployments. While the same IP is shared by all deployments to one AKS cluster, each AKS cluster will have a different IP address.

You can also use the Azure Machine Learning SDK to add Azure Kubernetes Service in a virtual network. If you already have an AKS cluster in a virtual network, attach it to the workspace as described in [How to deploy to AKS](how-to-deploy-and-where.md). The following code creates a new AKS instance in the `default` subnet of a virtual network named `mynetwork`:

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

For more information on using Role-Based Access Control with Kubernetes, see [Use Azure RBAC for Kubernetes authorization](../aks/manage-azure-rbac.md).

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
For more information on using the internal load balancer with AKS, see [Use internal load balancer with Azure Kubernetes Service](../aks/internal-lb.md).

## Secure VNet traffic

There are two approaches to isolate traffic to and from the AKS cluster to the virtual network:

* __Private AKS cluster__: This approach uses Azure Private Link to secure communications with the cluster for deployment/management operations.
* __Internal AKS load balancer__: This approach configures the endpoint for your deployments to AKS to use a private IP within the virtual network.

> [!WARNING]
> Internal load balancer does not work with an AKS cluster that uses kubenet. If you want to use an internal load balancer and a private AKS cluster at the same time, configure your private AKS cluster with Azure Container Networking Interface (CNI). For more information, see [Configure Azure CNI networking in Azure Kubernetes Service](../aks/configure-azure-cni.md).

### Private AKS cluster

By default, AKS clusters have a control plane, or API server, with public IP addresses. You can configure AKS to use a private control plane by creating a private AKS cluster. For more information, see [Create a private Azure Kubernetes Service cluster](../aks/private-clusters.md).

After you create the private AKS cluster, [attach the cluster to the virtual network](how-to-create-attach-kubernetes.md) to use with Azure Machine Learning.

> [!IMPORTANT]
> Before using a private link enabled AKS cluster with Azure Machine Learning, you must open a support incident to enable this functionality. For more information, see [Manage and increase quotas](how-to-manage-quotas.md#private-endpoint-and-private-dns-quota-increases).

### Internal AKS load balancer

By default, AKS deployments use a [public load balancer](../aks/load-balancer-standard.md). In this section, you learn how to configure AKS to use an internal load balancer. An internal (or private) load balancer is used where only private IPs are allowed as frontend. Internal load balancers are used to load balance traffic inside a virtual network

A private load balancer is enabled by configuring AKS to use an _internal load balancer_. 

#### Enable private load balancer

> [!IMPORTANT]
> You cannot enable private IP when creating the Azure Kubernetes Service cluster in Azure Machine Learning studio. You can create one with an internal load balancer when using the Python SDK or Azure CLI extension for machine learning.

The following examples demonstrate how to __create a new AKS cluster with a private IP/internal load balancer__ using the SDK and CLI:

# [Python](#tab/python)

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

> [!IMPORTANT]
> Using the CLI, you can only create an AKS cluster with an internal load balancer. There is no az ml command to upgrade an existing cluster to use an internal load balancer.

For more information, see the [az ml computetarget create aks](/cli/azure/ml/computetarget/create#az_ml_computetarget_create_aks) reference.

---

When __attaching an existing cluster__ to your workspace, you must wait until after the attach operation to configure the load balancer. For information on attaching a cluster, see [Attach an existing AKS cluster](how-to-create-attach-kubernetes.md).

After attaching the existing cluster, you can then update the cluster to use an internal load balancer/private IP:

```python
import azureml.core
from azureml.core.compute.aks import AksUpdateConfiguration
from azureml.core.compute import AksCompute

# ws = workspace object. Creation not shown in this snippet
aks_target = AksCompute(ws,"myaks")

# Change to the name of the subnet that contains AKS
subnet_name = "default"
# Update AKS configuration to use an internal load balancer
update_config = AksUpdateConfiguration(None, "InternalLoadBalancer", subnet_name)
aks_target.update(update_config)
# Wait for the operation to complete
aks_target.wait_for_completion(show_output = True)
```

## Enable Azure Container Instances (ACI)

Azure Container Instances are dynamically created when deploying a model. To enable Azure Machine Learning to create ACI inside the virtual network, you must enable __subnet delegation__ for the subnet used by the deployment.

> [!WARNING]
> When using Azure Container Instances in a virtual network, the virtual network must be:
> * In the same resource group as your Azure Machine Learning workspace.
> * If your workspace has a __private endpoint__, the virtual network used for Azure Container Instances must be the same as the one used by the workspace private endpoint.
>
> When using Azure Container Instances inside the virtual network, the Azure Container Registry (ACR) for your workspace cannot be in the virtual network.

To use ACI in a virtual network to your workspace, use the following steps:

1. To enable subnet delegation on your virtual network, use the information in the [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md) article. You can enable delegation when creating a virtual network, or add it to an existing network.

    > [!IMPORTANT]
    > When enabling delegation, use `Microsoft.ContainerInstance/containerGroups` as the __Delegate subnet to service__ value.

2. Deploy the model using [AciWebservice.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none--vnet-name-none--subnet-name-none-), use the `vnet_name` and `subnet_name` parameters. Set these parameters to the virtual network name and subnet where you enabled delegation.

## Limit outbound connectivity from the virtual network

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, you must allow access to Azure Container Registry. For example, make sure that your Network Security Groups (NSG) contains a rule that allows access to the __AzureContainerRegistry.RegionName__ service tag where `{RegionName} is the name of an Azure region.

## Next steps

This article is part four of a five-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 2: Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Part 3: Secure the training environment](how-to-secure-training-vnet.md)
* [Part 5: Enable studio functionality](how-to-enable-studio-virtual-network.md)

Also see the article on using [custom DNS](how-to-custom-dns.md) for name resolution.