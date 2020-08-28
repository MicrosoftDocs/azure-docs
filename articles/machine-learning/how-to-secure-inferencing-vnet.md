---
title: Secure inferencing environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning training environment.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 07/16/2020
ms.custom: contperfq4, tracking-python

---

# Secure an Azure Machine Learning inferencing environment with virtual networks
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to secure inferencing environments with a virtual network in Azure Machine Learning.

This article is part four of a four-part series that walks you through securing a virtual network. See the other articles in this series:

[1. VNet overview](how-to-network-security-overview.md) > [Secure the workspace](how-to-secure-workspace-vnet.md) > [3. Secure the training environment](how-to-secure-training-vnet.md) > **4. Secure the inferencing environment** 

## Prerequisites

+ An Azure Machine Learning [workspace](how-to-manage-workspace.md).

+ Understand the [common virtual network scenarios for Azure Machine Learning](how-to-enable-virtual-network.md)

+ General working knowledge of both the [Azure Virtual Network service](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) and [IP networking](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm).

+ A pre-existing virtual network and subnet to use with your compute resources.

If you are accessing the studio from a resource inside of a virtual network (for example, a compute instance or virtual machine), you must allow outbound traffic from the virtual network to the studio. 

For example, if you are using network security groups (NSG) to restrict outbound traffic, add a rule to a __service tag__ destination of __AzureFrontDoor.Frontend__.


<a id="aksvnet"></a>

## Azure Kubernetes Service

To add Azure Kubernetes Service (AKS) in a virtual network to your workspace, use the following steps:

> [!IMPORTANT]
> Before you begin the following procedure, follow the prerequisites in the [Configure advanced networking in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/configure-azure-cni#prerequisites) how-to and plan the IP addressing for your cluster.
>
> The AKS instance and the Azure virtual network must be in the same region. If you secure the Azure Storage Account(s) used by the workspace in a virtual network, they must be in the same virtual network as the AKS instance.

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

1. Make sure that the NSG group that controls the virtual network has an inbound security rule enabled for the scoring endpoint so that it can be called from outside the virtual network.
   > [!IMPORTANT]
   > Keep the default outbound rules for the NSG. For more information, see the default security rules in [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#default-security-rules).

   [![An inbound security rule](./media/how-to-enable-virtual-network/aks-vnet-inbound-nsg-scoring.png)](./media/how-to-enable-virtual-network/aks-vnet-inbound-nsg-scoring.png#lightbox)

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

### Use private IPs with Azure Kubernetes Service

By default, a public IP address is assigned to AKS deployments. When using AKS inside a virtual network, you can use a private IP address instead. Private IP addresses are only accessible from inside the virtual network or joined networks.

A private IP address is enabled by configuring AKS to use an _internal load balancer_. 

#### Network contributor role

> [!IMPORTANT]
> If you create or attach an AKS cluster by providing a virtual network you previously created, you must grant the service principal (SP) or managed identity for your AKS cluster the _Network Contributor_ role to the resource group that contains the virtual network. This must be done before you try to change the internal load balancer to private IP.
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
For more information on using the internal load balancer with AKS, see [Use internal load balancer with Azure Kubernetes Service](/azure/aks/internal-lb).

#### Enable private IP

> [!IMPORTANT]
> You cannot enable private IP when creating the Azure Kubernetes Service cluster. It must be enabled as an update to an existing cluster.

The following code snippet demonstrates how to __create a new AKS cluster__, and then update it to use a private IP/internal load balancer:

```python
import azureml.core
from azureml.core.compute.aks import AksUpdateConfiguration
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
    prov_config = AksCompute.provisioning_configuration(location = "eastus2")
    # Set info for existing virtual network to create the cluster in
    prov_config.vnet_resourcegroup_name = "myvnetresourcegroup"
    prov_config.vnet_name = "myvnetname"
    prov_config.service_cidr = "10.0.0.0/16"
    prov_config.dns_service_ip = "10.0.0.10"
    prov_config.subnet_name = subnet_name
    prov_config.docker_bridge_cidr = "172.17.0.1/16"

    # Create compute target
    aks_target = ComputeTarget.create(workspace = ws, name = "myaks", provisioning_configuration = prov_config)
    # Wait for the operation to complete
    aks_target.wait_for_completion(show_output = True)
    
    # Update AKS configuration to use an internal load balancer
    update_config = AksUpdateConfiguration(None, "InternalLoadBalancer", subnet_name)
    aks_target.update(update_config)
    # Wait for the operation to complete
    aks_target.wait_for_completion(show_output = True)
```

__Azure CLI__

```azurecli-interactive
az rest --method put --uri https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace>/computes/<compute>?api-version=2018-11-19 --body @body.json
```

The contents of the `body.json` file referenced by the command are similar to the following JSON document:

```json
{ 
    "location": "<region>", 
    "properties": { 
        "resourceId": "/subscriptions/<subscription-id>/resourcegroups/<resource-group>/providers/Microsoft.ContainerService/managedClusters/<aks-resource-name>", 
        "computeType": "AKS", 
        "provisioningState": "Succeeded", 
        "properties": { 
            "loadBalancerType": "InternalLoadBalancer", 
            "agentCount": <agent-count>, 
            "agentVmSize": "vm-size", 
            "clusterFqdn": "<cluster-fqdn>" 
        } 
    } 
} 
```

When __attaching an existing cluster__ to your workspace, you must wait until after the attach operation to configure the load balancer.

For information on attaching a cluster, see [Attach an existing AKS cluster](how-to-deploy-azure-kubernetes-service.md#attach-an-existing-aks-cluster).

After attaching the existing cluster, you can then update the cluster to use a private IP.

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

## Next steps

This article is part three in a four-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 2: Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Part 3: Secure the training environment](how-to-secure-training-vnet.md)