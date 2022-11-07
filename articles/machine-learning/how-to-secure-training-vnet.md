---
title: Secure training environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning training environment. 
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 07/28/2022
ms.custom: contperf-fy20q4, tracking-python, contperf-fy21q1, references_regions, devx-track-azurecli, sdkv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Secure an Azure Machine Learning training environment with virtual networks

[!INCLUDE [SDK v2](../../includes/machine-learning-sdk-v2.md)]

> [!div class="op_single_selector" title1="Select the Azure Machine Learning SDK version you are using:"]
> * [SDK v1](./v1/how-to-secure-training-vnet.md)
> * [SDK v2 (current version)](how-to-secure-training-vnet.md)

In this article, you learn how to secure training environments with a virtual network in Azure Machine Learning. You'll learn how to secure training environments through the Azure Machine Learning __studio__ and Python SDK __v2__.

> [!TIP]
> This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:
>
> * [Virtual network overview](how-to-network-security-overview.md)
> * [Secure the workspace resources](how-to-secure-workspace-vnet.md)
> * [Secure the inference environment](how-to-secure-inferencing-vnet.md)
> * [Enable studio functionality](how-to-enable-studio-virtual-network.md)
> * [Use custom DNS](how-to-custom-dns.md)
> * [Use a firewall](how-to-access-azureml-behind-firewall.md)
>
> For a tutorial on creating a secure workspace, see [Tutorial: Create a secure workspace](tutorial-create-secure-workspace.md) or [Tutorial: Create a secure workspace using a template](tutorial-create-secure-workspace-template.md).

In this article you learn how to secure the following training compute resources in a virtual network:
> [!div class="checklist"]
> - Azure Machine Learning compute cluster
> - Azure Machine Learning compute instance
> - Azure Databricks
> - Virtual Machine
> - HDInsight cluster

## Prerequisites

+ Read the [Network security overview](how-to-network-security-overview.md) article to understand common virtual network scenarios and overall virtual network architecture.

+ An existing virtual network and subnet to use with your compute resources.

+ To deploy resources into a virtual network or subnet, your user account must have permissions to the following actions in Azure role-based access control (Azure RBAC):

    - "Microsoft.Network/virtualNetworks/*/read" on the virtual network resource. This permission isn't needed for Azure Resource Manager (ARM) template deployments.
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.

    For more information on Azure RBAC with networking, see the [Networking built-in roles](../role-based-access-control/built-in-roles.md#networking)

### Azure Machine Learning compute cluster/instance

* Compute clusters and instances create the following resources. If they're unable to create these resources (for example, if there's a resource lock on the resource group) then creation, scale out, or scale in, may fail.

    * IP address.
    * Network Security Group (NSG).
    * Load balancer.

* The virtual network must be in the same subscription as the Azure Machine Learning workspace.
* The subnet used for the compute instance or cluster must have enough unassigned IP addresses.

    * A compute cluster can dynamically scale. If there aren't enough unassigned IP addresses, the cluster will be partially allocated.
    * A compute instance only requires one IP address.

* To create a compute cluster or instance without a public IP address (a preview feature), your workspace must use a private endpoint to connect to the VNet. For more information, see [Configure a private endpoint for Azure Machine Learning workspace](how-to-configure-private-link.md).
* If you plan to secure the virtual network by restricting traffic, see the [Required public internet access](#required-public-internet-access) section.
* The subnet used to deploy compute cluster/instance shouldn't be delegated to any other service. For example, it shouldn't be delegated to ACI.

### Azure Databricks

* The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
* If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Databricks cluster.

## Limitations

### Azure Machine Learning compute cluster/instance

* If put multiple compute instances or clusters in one virtual network, you may need to request a quota increase for one or more of your resources. The Machine Learning compute instance or cluster automatically allocates networking resources __in the resource group that contains the virtual network__. For each compute instance or cluster, the service allocates the following resources:

    * One network security group (NSG). This NSG contains the following rules, which are specific to compute cluster and compute instance:

        > [!IMPORTANT]
        > Compute instance and compute cluster automatically create an NSG with the required rules.
        > 
        > If you have another NSG at the subnet level, the rules in the subnet level NSG mustn't conflict with the rules in the automatically created NSG.
        >
        > To learn how the NSGs filter your network traffic, see [How network security groups filter network traffic](../virtual-network/network-security-group-how-it-works.md).

        * Allow inbound TCP traffic on ports 29876-29877 from the `BatchNodeManagement` service tag.
        * Allow inbound TCP traffic on port 44224 from the `AzureMachineLearning` service tag.

        The following screenshot shows an example of these rules:

        :::image type="content" source="./media/how-to-secure-training-vnet/compute-instance-cluster-network-security-group.png" alt-text="Screenshot of NSG":::


        > [!TIP]
        > If your compute cluster or instance does not use a public IP address (a preview feature), these inbound NSG rules are not required. 
        
    * For compute cluster or instance, it's now possible to remove the public IP address (a preview feature). If you have Azure Policy assignments prohibiting Public IP creation, then deployment of the compute cluster or instance will succeed.

    * One load balancer

    For compute clusters, these resources are deleted every time the cluster scales down to 0 nodes and created when scaling up.

    For a compute instance, these resources are kept until the instance is deleted. Stopping the instance doesn't remove the resources. 

    > [!IMPORTANT]
    > These resources are limited by the subscription's [resource quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). If the virtual network resource group is locked then deletion of compute cluster/instance will fail. Load balancer cannot be deleted until the compute cluster/instance is deleted. Also please ensure there is no Azure Policy assignment which prohibits creation of network security groups.

* If you create a compute instance and plan to use the no public IP address configuration, your Azure Machine Learning workspace's managed identity must be assigned the __Reader__ role for the virtual network that contains the workspace. For more information on assigning roles, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

    > [!IMPORTANT]
    > Using the __no public IP__ configuration requires you to opt-in to this preview. Before opting in, you must have created a workspace and a compute instance on the subscription you plan to use. You can delete the compute instance and/or workspace after creating them.
    >
    > Use the form at [https://forms.office.com/r/0Rw6mXTT07](https://forms.office.com/r/0Rw6mXTT07) to opt in to this Azure Machine Learning preview. Microsoft will contact you once your subscription has been allowlisted to the preview. It may take one to two weeks to allowlist your subscription. Opting-in provides the following benefits:
    > - Additional regions are available for use with no public IP configuration
    > - [Data exfiltration protection](how-to-prevent-data-loss-exfiltration.md).
    > - No networking costs from load balancer, public IP, or private link service.
    >
    > If you have been using compute instances configured for no public IP without opting-in to the preview using the form, you will need to delete and recreate them after your subscription has been allowlisted to take advantage of the new architecture and region availability. For existing compute clusters configured for no public IP, once the cluster has been reduced to 0 nodes (requires the minimum nodes to be configured as 0), it will take advantage of the new architecture the next time nodes are allocated after the subscription is allowlisted.

    [!INCLUDE [no-public-ip-info](../../includes/machine-learning-no-public-ip-availibility.md)]

* If you have configured Azure Container Registry for your workspace behind the virtual network, you must use a compute cluster to build Docker images. If you use a compute cluster configured for no public IP address, you must provide some method for the cluster to access the public internet. Internet access is required when accessing images stored on the Microsoft Container Registry, packages installed on Pypi, Conda, etc. For more information, see [Enable Azure Container Registry](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr).

* If the Azure Storage Accounts for the workspace are also in the virtual network, use the following guidance on subnet limitations:

    * If you plan to use Azure Machine Learning __studio__ to visualize data or use designer, the storage account must be __in the same subnet as the compute instance or cluster__.
    * If you plan to use the __SDK__, the storage account can be in a different subnet.

    > [!NOTE]
    > Adding a resource instance for your workspace or selecting the checkbox for "Allow trusted Microsoft services to access this account" is not sufficient to allow communication from the compute.

* When your workspace uses a private endpoint, the compute instance can only be accessed from inside the virtual network. If you use a custom DNS or hosts file, add an entry for `<instance-name>.<region>.instances.azureml.ms`. Map this entry to the private IP address of the workspace private endpoint. For more information, see the [custom DNS](./how-to-custom-dns.md) article.
* Virtual network service endpoint policies don't work for compute cluster/instance system storage accounts.
* If storage and compute instance are in different regions, you may see intermittent timeouts.
* If the Azure Container Registry for your workspace uses a private endpoint to connect to the virtual network, you can’t use a managed identity for the compute instance. To use a managed identity with the compute instance, don't put the container registry in the VNet.
* If you want to use Jupyter Notebooks on a compute instance:

    * Don't disable websocket communication. Make sure your network allows websocket communication to `*.instances.azureml.net` and `*.instances.azureml.ms`.
    * Make sure that your notebook is running on a compute resource behind the same virtual network and subnet as your data. When creating the compute instance, use **Advanced settings** > **Configure virtual network** to select the network and subnet.

* __Compute clusters__ can be created in a different region than your workspace. This functionality is in __preview__, and is only available for __compute clusters__, not compute instances. When using a different region for the cluster, the following limitations apply:

    * If your workspace associated resources, such as storage, are in a different virtual network than the cluster, set up global virtual network peering between the networks. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).
    * You may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

    Guidance such as using NSG rules, user-defined routes, and input/output requirements, apply as normal when using a different region than the workspace.

    > [!WARNING]
    > If you are using a __private endpoint-enabled workspace__, creating the cluster in a different region is __not supported__.

* An Azure Machine Learning workspace requires outbound access to `storage.<region>/*.blob.core.windows.net` on the public internet, where `<region>` is the Azure region of the workspace. This outbound access is required by Azure Machine Learning compute cluster and compute instance. Both are based on Azure Batch, and need to access a storage account provided by Azure Batch on the public network.

    By using a Service Endpoint Policy, you can mitigate this vulnerability. This feature is currently in preview. For more information, see the [Azure Machine Learning data exfiltration prevention](how-to-prevent-data-loss-exfiltration.md) article. 

### Azure Databricks

* In addition to the __databricks-private__ and __databricks-public__ subnets used by Azure Databricks, the __default__ subnet created for the virtual network is also required.
* Azure Databricks doesn't use a private endpoint to communicate with the virtual network.

For more information on using Azure Databricks in a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

### Azure HDInsight or virtual machine

* Azure Machine Learning supports only virtual machines that are running Ubuntu.

## Required public internet access

[!INCLUDE [machine-learning-required-public-internet-access](../../includes/machine-learning-public-internet-access.md)]

For information on using a firewall solution, see [Use a firewall with Azure Machine Learning](how-to-access-azureml-behind-firewall.md).

## Compute cluster

Use the following steps to create a compute cluster in the Azure Machine Learning studio:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/), and then select your subscription and workspace.
1. Select __Compute__ on the left, __Compute clusters__ from the center, and then select __+ New__.

    :::image type="content" source="./media/how-to-enable-virtual-network/create-compute-cluster.png" alt-text="Screenshot of creating a cluster":::

1. In the __Create compute cluster__ dialog, select the VM size and configuration you need and then select __Next__.

    :::image type="content" source="./media/how-to-enable-virtual-network/create-compute-cluster-vm.png" alt-text="Screenshot of setting VM config":::

1. From the __Configure Settings__ section, set the __Compute name__, __Virtual network__, and __Subnet__.

    :::image type="content" source="media/how-to-enable-virtual-network/create-compute-cluster-config.png" alt-text="Screenshot shows setting compute name, virtual network, and subnet.":::

    > [!TIP]
    > If your workspace uses a private endpoint to connect to the virtual network, the __Virtual network__ selection field is greyed out.
    > 

1. Select __Create__ to create the compute cluster.


When the creation process finishes, you train your model by using the cluster in an experiment. 

[!INCLUDE [low-pri-note](../../includes/machine-learning-low-pri-vm.md)]

### No public IP for compute clusters (preview)

When you enable **No public IP**, your compute cluster doesn't use a public IP for communication with any dependencies. Instead, it communicates solely within the virtual network using Azure Private Link ecosystem and service/private endpoints, eliminating the need for a public IP entirely. No public IP removes access and discoverability of compute cluster nodes from the internet thus eliminating a significant threat vector. **No public IP** clusters help comply with no public IP policies many enterprises have. 

A compute cluster with **No public IP** enabled has **no inbound communication requirements** from public internet. Specifically, neither inbound NSG rule (`BatchNodeManagement`, `AzureMachineLearning`) is required. You still need to allow inbound from source of **VirtualNetwork** and any port source, to destination of **VirtualNetwork**, and destination port of **29876, 29877** and inbound from source **AzureLoadBalancer** and any port source to destination **VirtualNetwork** and port **44224** destination.

> [!WARNING]
> By default, you do not have public internet access from No Public IP Compute Cluster. This prevents *outbound* access to required resources such as Azure Active Directory, Azure Resource Manager, Microsoft Container Registry, and other outbound resources as listed in the [Required public internet access](#required-public-internet-access) section. Or to non-Microsoft resources such as Pypi or Conda repositories. To resolve this problem, you need to configure User Defined Routing (UDR) to reach to a public IP to access the internet. For example, you can use a public IP of your firewall, or you can use [Virtual Network NAT](../virtual-network/nat-gateway/nat-overview.md) with a public IP.

**No public IP** clusters are dependent on [Azure Private Link](how-to-configure-private-link.md) for Azure Machine Learning workspace. 
A compute cluster with **No public IP** also requires you to disable private endpoint network policies and private link service network policies. These requirements come from Azure private link service and private endpoints and aren't Azure Machine Learning specific. Follow instruction from [Disable network policies for Private Link service](../private-link/disable-private-link-service-network-policy.md) to set the parameters `disable-private-endpoint-network-policies` and `disable-private-link-service-network-policies` on the virtual network subnet.

For **outbound connections** to work, you need to set up an egress firewall such as Azure firewall with user defined routes. For instance, you can use a firewall set up with [inbound/outbound configuration](how-to-access-azureml-behind-firewall.md) and route traffic there by defining a route table on the subnet in which the compute cluster is deployed. The route table entry can set up the next hop of the private IP address of the firewall with the address prefix of 0.0.0.0/0.

You can use a service endpoint or private endpoint for your Azure container registry and Azure storage in the subnet in which cluster is deployed.

To create a no public IP address compute cluster (a preview feature) in studio, set **No public IP** checkbox in the virtual network section.
You can also create no public IP compute cluster through an ARM template. In the ARM template set enableNodePublicIP parameter to false.

**Troubleshooting**

* If you get this error message during creation of cluster `The specified subnet has PrivateLinkServiceNetworkPolicies or PrivateEndpointNetworkEndpoints enabled`, follow the instructions from [Disable network policies for Private Link service](../private-link/disable-private-link-service-network-policy.md) and [Disable network policies for Private Endpoint](../private-link/disable-private-endpoint-network-policy.md).

* If job execution fails with connection issues to ACR or Azure Storage, verify that customer has added ACR and Azure Storage service endpoint/private endpoints to subnet and ACR/Azure Storage allows the access from the subnet.

* To ensure that you've created a no public IP cluster, in Studio when looking at cluster details you'll see **No Public IP** property is set to **true** under resource properties.

## Compute instance

For steps on how to create a compute instance deployed in a virtual network, see [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md).

### No public IP for compute instances (preview)

When you enable **No public IP**, your compute instance doesn't use a public IP for communication with any dependencies. Instead, it communicates solely within the virtual network using Azure Private Link ecosystem and service/private endpoints, eliminating the need for a public IP entirely. No public IP removes access and discoverability of compute instance node from the internet thus eliminating a significant threat vector. Compute instances will also do packet filtering to reject any traffic from outside virtual network. **No public IP** instances are dependent on [Azure Private Link](how-to-configure-private-link.md) for Azure Machine Learning workspace. 

> [!WARNING]
> By default, you do not have public internet access from No Public IP Compute Instance. You need to configure User Defined Routing (UDR) to reach to a public IP to access the internet. For example, you can use a public IP of your firewall, or you can use [Virtual Network NAT](../virtual-network/nat-gateway/nat-overview.md) with a public IP. Specifically, you need access to Azure Active Directory, Azure Resource Manager, Microsoft Container Registry, and other outbound resources as listed in the [Required public internet access](#required-public-internet-access) section. You may also need outbound access to non-Microsoft resources such as Pypi or Conda repositories.

For **outbound connections** to work, you need to set up an egress firewall such as Azure firewall with user defined routes. For instance, you can use a firewall set up with [inbound/outbound configuration](how-to-access-azureml-behind-firewall.md) and route traffic there by defining a route table on the subnet in which the compute instance is deployed. The route table entry can set up the next hop of the private IP address of the firewall with the address prefix of 0.0.0.0/0.

A compute instance with **No public IP** enabled has **no inbound communication requirements** from public internet. Specifically, neither inbound NSG rule (`BatchNodeManagement`, `AzureMachineLearning`) is required. You still need to allow inbound from source of **VirtualNetwork**, any port source, destination of **VirtualNetwork**, and destination port of **29876, 29877, 44224**.

A compute instance with **No public IP** also requires you to disable private endpoint network policies and private link service network policies. These requirements come from Azure private link service and private endpoints and aren't Azure Machine Learning specific. Follow instruction from [Disable network policies for Private Link service source IP](../private-link/disable-private-link-service-network-policy.md) to set the parameters `disable-private-endpoint-network-policies` and `disable-private-link-service-network-policies` on the virtual network subnet.

To create a no public IP address compute instance (a preview feature) in studio, set **No public IP** checkbox in the virtual network section.
You can also create no public IP compute instance through an ARM template. In the ARM template set enableNodePublicIP parameter to false.

Next steps:
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)

## Inbound traffic

[!INCLUDE [udr info for computes](../../includes/machine-learning-compute-user-defined-routes.md)]

For more information on input and output traffic requirements for Azure Machine Learning, see [Use a workspace behind a firewall](how-to-access-azureml-behind-firewall.md).

## Azure Databricks

For specific information on using Azure Databricks with a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

<a id="vmorhdi"></a>

## Virtual machine or HDInsight cluster

In this section, you learn how to use a virtual machine or Azure HDInsight cluster in a virtual network with your workspace.

### Create the VM or HDInsight cluster

Create a VM or HDInsight cluster by using the Azure portal or the Azure CLI, and put the cluster in an Azure virtual network. For more information, see the following articles:
* [Create and manage Azure virtual networks for Linux VMs](../virtual-machines/linux/tutorial-virtual-network.md)

* [Extend HDInsight using an Azure virtual network](../hdinsight/hdinsight-plan-virtual-network-deployment.md)

### Configure network ports 

Allow Azure Machine Learning to communicate with the SSH port on the VM or cluster, configure a source entry for the network security group. The SSH port is usually port 22. To allow traffic from this source, do the following actions:

1. In the __Source__ drop-down list, select __Service Tag__.

1. In the __Source service tag__ drop-down list, select __AzureMachineLearning__.

    ![Inbound rules for doing experimentation on a VM or HDInsight cluster within a virtual network](./media/how-to-enable-virtual-network/experimentation-virtual-network-inbound.png)

1. In the __Source port ranges__ drop-down list, select __*__.

1. In the __Destination__ drop-down list, select __Any__.

1. In the __Destination port ranges__ drop-down list, select __22__.

1. Under __Protocol__, select __Any__.

1. Under __Action__, select __Allow__.

Keep the default outbound rules for the network security group. For more information, see the default security rules in [Security groups](../virtual-network/network-security-groups-overview.md#default-security-rules).

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, see the [required public internet access](#required-public-internet-access) section.

### Attach the VM or HDInsight cluster

Attach the VM or HDInsight cluster to your Azure Machine Learning workspace. For more information, see [Manage compute resources for model training and deployment in studio](how-to-create-attach-compute-studio.md).

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)