---
title: Secure training environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning training environment. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 08/04/2021
ms.custom: contperf-fy20q4, tracking-python, contperf-fy21q1

---

# Secure an Azure Machine Learning training environment with virtual networks

In this article, you learn how to secure training environments with a virtual network in Azure Machine Learning.

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
> For a tutorial on creating a secure workspace, compute cluster, and compute instance, see [Tutorial: Create a secure workspace](tutorial-create-secure-workspace.md).

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

    - "Microsoft.Network/virtualNetworks/*/read" on the virtual network resource. This is not needed for ARM template deployments
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.

    For more information on Azure RBAC with networking, see the [Networking built-in roles](../role-based-access-control/built-in-roles.md#networking)

### Azure Machine Learning compute cluster/instance

* The virtual network must be in the same subscription as the Azure Machine Learning workspace.
* The subnet used for the compute instance or cluster must have enough unassigned IP addresses.

    * A compute cluster can dynamically scale. If there aren't enough unassigned IP addresses, the cluster will be partially allocated.
    * A compute instance only requires one IP address.

* Make sure that there are no security policies or locks that restrict permissions to manage the virtual network. When checking for policies or locks, look at both the subscription and resource group for the virtual network.
* Check to see whether your security policies or locks on the virtual network's subscription or resource group restrict permissions to manage the virtual network. 
* If you plan to secure the virtual network by restricting traffic, see the [Required public internet access](#required-public-internet-access) section.
* The subnet used to deploy compute cluster/instance shouldn't be delegated to any other service. For example, it shouldn't be delegated to ACI.

### Azure Databricks

* The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
* If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Databricks cluster.

## Limitations

### Azure Machine Learning compute cluster/instance

* If put multiple compute instances or clusters in one virtual network, you may need to request a quota increase for one or more of your resources. The Machine Learning compute instance or cluster automatically allocates additional networking resources __in the resource group that contains the virtual network__. For each compute instance or cluster, the service allocates the following resources:

    * One network security group (NSG). This NSG contains the following rules, which are specific to compute cluster and compute instance:

        * Allow inbound TCP traffic on ports 29876-29877 from the `BatchNodeManagement` service tag.
        * Allow inbound TCP traffic on port 44224 from the `AzureMachineLearning` service tag.

        The following screenshot shows an example of these rules:

        :::image type="content" source="./media/how-to-secure-training-vnet/compute-instance-cluster-network-security-group.png" alt-text="Screenshot of NSG":::

    * One public IP address. If you have Azure policy prohibiting Public IP creation then deployment of cluster/instances will fail
    * One load balancer

    For compute clusters, these resources are deleted every time the cluster scales down to 0 nodes and created when scaling up.

    For a compute instance, these resources are kept until the instance is deleted. Stopping the instance does not remove the resources. 

    > [!IMPORTANT]
    > These resources are limited by the subscription's [resource quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). If the virtual network resource group is locked then deletion of compute cluster/instance will fail. Load balancer cannot be deleted until the compute cluster/instance is deleted. Also please ensure there is no Azure policy which prohibits creation of network security groups.

* If the Azure Storage Accounts for the workspace are also in the virtual network, use the following guidance on subnet limitations:

    * If you plan to use Azure Machine Learning __studio__ to visualize data or use designer, the storage account must be __in the same subnet as the compute instance or cluster__.
    * If you plan to use the __SDK__, the storage account can be in a different subnet.

    > [!NOTE]
    > Selecting the checkbox for "Allow trusted Microsoft services to access this account" is not sufficient to allow communication from the compute.

* When your workspace uses a private endpoint, the compute instance can only be accessed from inside the virtual network. If you use a custom DNS or hosts file, add an entry for `<instance-name>.<region>.instances.azureml.ms`. Map this entry to the private IP address of the workspace private endpoint. For more information, see the [custom DNS](./how-to-custom-dns.md) article.
* Virtual network service endpoint policies don't work for compute cluster/instance system storage accounts.
* If storage and compute instance are in different regions, you may see intermittent timeouts.
* If you want to use Jupyter Notebooks on a compute instance:

    * Don't disable websocket communication. Make sure your network allows websocket communication to `*.instances.azureml.net` and `*.instances.azureml.ms`.
    * Make sure that your notebook is running on a compute resource behind the same virtual network and subnet as your data. When creating the compute instance, use **Advanced settings** > **Configure virtual network** to select the network and subnet.

* __Compute clusters__ can be created in a different region than your workspace. This functionality is in __preview__, and is only available for __compute clusters__, not compute instances. When using a different region for the cluster, the following limitations apply:

    * If your workspace associated resources, such as storage, are in a different virtual network than the cluster, set up global virtual network peering between the networks. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).
    * If you are using a private endpoint-enabled workspace, creating the cluster in a different region is __not supported__.
    * You may see increased network latency and data transfer costs. The latency and costs can occur when creating the cluster, and when running jobs on it.

    Guidance such as using NSG rules, user-defined routes, and input/output requirements, apply as normal when using a different region than the workspace.

### Azure Databricks

* In addition to the __databricks-private__ and __databricks-public__ subnets used by Azure Databricks, the __default__ subnet created for the virtual network is also required.
* Azure Databricks does not use a private endpoint to communicate with the virtual network.

For more information on using Azure Databricks in a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

### Azure HDInsight or virtual machine

* Azure Machine Learning supports only virtual machines that are running Ubuntu.

## Required public internet access

[!INCLUDE [machine-learning-required-public-internet-access](../../includes/machine-learning-public-internet-access.md)]

For information on using a firewall solution, see [Use a firewall with Azure Machine Learning](how-to-access-azureml-behind-firewall.md).

## <a name="compute-instance"></a>Compute clusters & instances 

Use the tabs below to select how you plan to create a compute cluster:

# [Studio](#tab/azure-studio)

Use the following steps to create a compute cluster in the Azure Machine Learning studio:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/), and then select your subscription and workspace.
1. Select __Compute__ on the left, __Compute clusters__ from the center, and then select __+ New__.

    :::image type="content" source="./media/how-to-enable-virtual-network/create-compute-cluster.png" alt-text="Screenshot of creating a cluster":::

1. In the __Create compute cluster__ dialog, select the VM size and configuration you need and then select __Next__.

    :::image type="content" source="./media/how-to-enable-virtual-network/create-compute-cluster-vm.png" alt-text="Screenshot of setting VM config":::

1. From the __Configure Settings__ section, set the __Compute name__, __Virtual network__, and __Subnet__.

    > [!TIP]
    > If your workspace uses a private endpoint to connect to the virtual network, the __Virtual network__ selection field is greyed out.

    :::image type="content" source="./media/how-to-enable-virtual-network/create-compute-cluster-config.png" alt-text="Screenshot of virtual network settings":::

1. Select __Create__ to create the compute cluster.

# [Python](#tab/python)

The following code creates a new Machine Learning Compute cluster in the `default` subnet of a virtual network named `mynetwork`:

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# The Azure virtual network name, subnet, and resource group
vnet_name = 'mynetwork'
subnet_name = 'default'
vnet_resourcegroup_name = 'mygroup'

# Choose a name for your CPU cluster
cpu_cluster_name = "cpucluster"

# Verify that cluster does not exist already
try:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print("Found existing cpucluster")
except ComputeTargetException:
    print("Creating new cpucluster")

    # Specify the configuration for the new cluster
    compute_config = AmlCompute.provisioning_configuration(vm_size="STANDARD_D2_V2",
                                                           min_nodes=0,
                                                           max_nodes=4,
                                                           location="westus2",
                                                           vnet_resourcegroup_name=vnet_resourcegroup_name,
                                                           vnet_name=vnet_name,
                                                           subnet_name=subnet_name)

    # Create the cluster with the specified name and configuration
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

    # Wait for the cluster to be completed, show the output log
    cpu_cluster.wait_for_completion(show_output=True)
```

---

When the creation process finishes, you train your model by using the cluster in an experiment. For more information, see [Select and use a compute target for training](how-to-set-up-training-targets.md).

[!INCLUDE [low-pri-note](../../includes/machine-learning-low-pri-vm.md)]

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

Attach the VM or HDInsight cluster to your Azure Machine Learning workspace. For more information, see [Set up compute targets for model training](how-to-set-up-training-targets.md).

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)