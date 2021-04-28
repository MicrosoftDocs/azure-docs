---
title: Secure training environments with virtual networks
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network to secure your Azure Machine Learning training environment. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: larryfr
ms.author: peterlu
author: peterclu
ms.date: 07/16/2020
ms.custom: contperf-fy20q4, tracking-python, contperf-fy21q1

---

# Secure an Azure Machine Learning training environment with virtual networks

In this article, you learn how to secure training environments with a virtual network in Azure Machine Learning.

This article is part three of a five-part series that walks you through securing an Azure Machine Learning workflow. We highly recommend that you read through [Part one: VNet overview](how-to-network-security-overview.md) to understand the overall architecture first. 

See the other articles in this series:

[1. VNet overview](how-to-network-security-overview.md) > [2. Secure the workspace](how-to-secure-workspace-vnet.md) > **3. Secure the training environment** > [4. Secure the inferencing environment](how-to-secure-inferencing-vnet.md)  > [5. Enable studio functionality](how-to-enable-studio-virtual-network.md)

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

    - "Microsoft.Network/virtualNetworks/*/read" on the virtual network resource.
    - "Microsoft.Network/virtualNetworks/subnet/join/action" on the subnet resource.

    For more information on Azure RBAC with networking, see the [Networking built-in roles](../role-based-access-control/built-in-roles.md#networking)


## <a name="compute-instance"></a>Compute clusters & instances 

To use either a [managed Azure Machine Learning __compute target__](concept-compute-target.md#azure-machine-learning-compute-managed) or an [Azure Machine Learning compute __instance__](concept-compute-instance.md) in a virtual network, the following network requirements must be met:

> [!div class="checklist"]
> * The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
> * The subnet that's specified for the compute instance or cluster must have enough unassigned IP addresses to accommodate the number of VMs that are targeted. If the subnet doesn't have enough unassigned IP addresses, a compute cluster will be partially allocated.
> * Check to see whether your security policies or locks on the virtual network's subscription or resource group restrict permissions to manage the virtual network. If you plan to secure the virtual network by restricting traffic, leave some ports open for the compute service. For more information, see the [Required ports](#mlcports) section.
> * If you're going to put multiple compute instances or clusters in one virtual network, you might need to request a quota increase for one or more of your resources.
> * If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network and subnet as the Azure Machine Learning compute instance or cluster. Please configure your storage firewall settings to allow communication to virtual network and subnet compute resides in. Please note selecting checkbox for "Allow trusted Microsoft services to access this account" is not sufficient to allow communication from compute.
> * For compute instance Jupyter functionality to work, ensure that web socket communication is not disabled. Please ensure your network allows websocket connections to *.instances.azureml.net and *.instances.azureml.ms. 
> * When compute instance is deployed in a private link workspace it can be only be accessed from within virtual network. If you are using custom DNS or hosts file please add an entry for `<instance-name>.<region>.instances.azureml.ms` with private IP address of workspace private endpoint. For more information see the [custom DNS](./how-to-custom-dns.md) article.
> * The subnet used to deploy compute cluster/instance should not be delegated to any other service like ACI
> * Virtual network service endpoint policies do not work for compute cluster/instance system storage accounts

    
> [!TIP]
> The Machine Learning compute instance or cluster automatically allocates additional networking resources __in the resource group that contains the virtual network__. For each compute instance or cluster, the service allocates the following resources:
> 
> * One network security group
> * One public IP address. If you have Azure policy prohibiting Public IP creation then deployment of cluster/instances will fail
> * One load balancer
> 
> In the case of clusters these resources are deleted (and recreated) every time the cluster scales down to 0 nodes, however for an instance the resources are held onto till the instance is completely deleted (stopping does not remove the resources). 
> These resources are limited by the subscription's [resource quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). If the virtual network resource group is locked then deletion of compute cluster/instance will fail. Load balancer cannot be deleted until the compute cluster/instance is deleted. Also please ensure there is no Azure policy which prohibits creation of network security groups.


### <a id="mlcports"></a> Required ports

If you plan on securing the virtual network by restricting network traffic to/from the public internet, you must allow inbound communications from the Azure Batch service.

The Batch service adds network security groups (NSGs) at the level of network interfaces (NICs) that are attached to VMs. These NSGs automatically configure inbound and outbound rules to allow the following traffic:

- Inbound TCP traffic on ports 29876 and 29877 from a __Service Tag__ of __BatchNodeManagement__. Traffic over these ports is encrypted and is used by Azure Batch for scheduler/node communication.

    ![An inbound rule that uses the BatchNodeManagement service tag](./media/how-to-enable-virtual-network/batchnodemanagement-service-tag.png)

- (Optional) Inbound TCP traffic on port 22 to permit remote access. Use this port only if you want to connect by using SSH on the public IP.

- Outbound traffic on any port to the virtual network.

- Outbound traffic on any port to the internet.

- For compute instance inbound TCP traffic on port 44224 from a __Service Tag__ of __AzureMachineLearning__. Traffic over this port is encrypted and is used by Azure Machine Learning for communication with applications running on Compute Instances.

> [!IMPORTANT]
> Exercise caution if you modify or add inbound or outbound rules in Batch-configured NSGs. If an NSG blocks communication to the compute nodes, the compute service sets the state of the compute nodes to unusable.
>
> You don't need to specify NSGs at the subnet level, because the Azure Batch service configures its own NSGs. However, if the subnet that contains the Azure Machine Learning compute has associated NSGs or a firewall, you must also allow the traffic listed earlier.

The NSG rule configuration in the Azure portal is shown in the following images:

:::image type="content" source="./media/how-to-enable-virtual-network/amlcompute-virtual-network-inbound.png" alt-text="The inbound NSG rules for Machine Learning Compute" border="true":::



![Inbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/experimentation-virtual-network-outbound.png)

### <a id="limiting-outbound-from-vnet"></a> Limit outbound connectivity from the virtual network

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, use the following steps:

- Deny outbound internet connection by using the NSG rules.

- For a __compute instance__ or a __compute cluster__, limit outbound traffic to the following items:
   - Azure Storage, by using __Service Tag__ of __Storage.RegionName__. Where `{RegionName}` is the name of an Azure region.
   - Azure Container Registry, by using __Service Tag__ of __AzureContainerRegistry.RegionName__. Where `{RegionName}` is the name of an Azure region.
   - Azure Machine Learning, by using __Service Tag__ of __AzureMachineLearning__
   - Azure Resource Manager, by using __Service Tag__ of __AzureResourceManager__
   - Azure Active Directory, by using __Service Tag__ of __AzureActiveDirectory__

The NSG rule configuration in the Azure portal is shown in the following image:

[![The outbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/limited-outbound-nsg-exp.png)](./media/how-to-enable-virtual-network/limited-outbound-nsg-exp.png#lightbox)

> [!NOTE]
> If you plan on using default Docker images provided by Microsoft, and enabling user managed dependencies, you must also use the following __Service Tags__:
>
> * __MicrosoftContainerRegistry__
> * __AzureFrontDoor.FirstParty__
>
> This configuration is needed when you have code similar to the following snippets as part of your training scripts:
>
> __RunConfig training__
> ```python
> # create a new runconfig object
> run_config = RunConfiguration()
> 
> # configure Docker 
> run_config.environment.docker.enabled = True
> # For GPU, use DEFAULT_GPU_IMAGE
> run_config.environment.docker.base_image = DEFAULT_CPU_IMAGE 
> run_config.environment.python.user_managed_dependencies = True
> ```
>
> __Estimator training__
> ```python
> est = Estimator(source_directory='.',
>                 script_params=script_params,
>                 compute_target='local',
>                 entry_script='dummy_train.py',
>                 user_managed=True)
> run = exp.submit(est)
> ```

### Forced tunneling

If you're using [forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) with Azure Machine Learning compute, you must allow communication with the public internet from the subnet that contains the compute resource. This communication is used for task scheduling and accessing Azure Storage.

There are two ways that you can accomplish this:

* Use a [Virtual Network NAT](../virtual-network/nat-overview.md). A NAT gateway provides outbound internet connectivity for one or more subnets in your virtual network. For information, see [Designing virtual networks with NAT gateway resources](../virtual-network/nat-gateway-resource.md).

* Add [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md) to the subnet that contains the compute resource. Establish a UDR for each IP address that's used by the Azure Batch service in the region where your resources exist. These UDRs enable the Batch service to communicate with compute nodes for task scheduling. Also add the IP address for the Azure Machine Learning service, as this is required for access to Compute Instances. When adding the IP for the Azure Machine Learning service, you must add the IP for both the __primary and secondary__ Azure regions. The primary region being the one where your workspace is located.

    To find the secondary region, see the [Ensure business continuity & disaster recovery using Azure Paired Regions](../best-practices-availability-paired-regions.md#azure-regional-pairs). For example, if your Azure Machine Learning service is in East US 2, the secondary region is Central US. 

    To get a list of IP addresses of the Batch service and Azure Machine Learning service, use one of the following methods:

    * Download the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) and search the file for `BatchNodeManagement.<region>` and `AzureMachineLearning.<region>`, where `<region>` is your Azure region.

    * Use the [Azure CLI](/cli/azure/install-azure-cli) to download the information. The following example downloads the IP address information and filters out the information for the East US 2 region (primary) and Central US region (secondary):

        ```azurecli-interactive
        az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'Batch')] | [?properties.region=='eastus2']"
        # Get primary region IPs
        az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='eastus2']"
        # Get secondary region IPs
        az network list-service-tags -l "Central US" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='centralus']"
        ```

        > [!TIP]
        > If you are using the US-Virginia, US-Arizona regions, or China-East-2 regions, these commands return no IP addresses. Instead, use one of the following links to download a list of IP addresses:
        >
        > * [Azure IP ranges and service tags for Azure Government](https://www.microsoft.com/download/details.aspx?id=57063)
        > * [Azure IP ranges and service tags for Azure China](https://www.microsoft.com//download/details.aspx?id=57062)
    
    When you add the UDRs, define the route for each related Batch IP address prefix and set __Next hop type__ to __Internet__. The following image shows an example of this UDR in the Azure portal:

    ![Example of a UDR for an address prefix](./media/how-to-enable-virtual-network/user-defined-route.png)

    > [!IMPORTANT]
    > The IP addresses may change over time.

    In addition to any UDRs that you define, outbound traffic to Azure Storage must be allowed through your on-premises network appliance. Specifically, the URLs for this traffic are in the following forms: `<account>.table.core.windows.net`, `<account>.queue.core.windows.net`, and `<account>.blob.core.windows.net`. 

    For more information, see [Create an Azure Batch pool in a virtual network](../batch/batch-virtual-network.md#user-defined-routes-for-forced-tunneling).

### Create a compute cluster in a virtual network

To create a Machine Learning Compute cluster, use the following steps:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/), and then select your subscription and workspace.

1. Select __Compute__ on the left.

1. Select __Training clusters__ from the center, and then select __+__.

1. In the __New Training Cluster__ dialog, expand the __Advanced settings__ section.

1. To configure this compute resource to use a virtual network, perform the following actions in the __Configure virtual network__ section:

    1. In the __Resource group__ drop-down list, select the resource group that contains the virtual network.
    1. In the __Virtual network__ drop-down list, select the virtual network that contains the subnet.
    1. In the __Subnet__ drop-down list, select the subnet to use.

   ![The virtual network settings for Machine Learning Compute](./media/how-to-enable-virtual-network/amlcompute-virtual-network-screen.png)

You can also create a Machine Learning Compute cluster by using the Azure Machine Learning SDK. The following code creates a new Machine Learning Compute cluster in the `default` subnet of a virtual network named `mynetwork`:

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
                                                           vnet_resourcegroup_name=vnet_resourcegroup_name,
                                                           vnet_name=vnet_name,
                                                           subnet_name=subnet_name)

    # Create the cluster with the specified name and configuration
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

    # Wait for the cluster to be completed, show the output log
    cpu_cluster.wait_for_completion(show_output=True)
```

When the creation process finishes, you train your model by using the cluster in an experiment. For more information, see [Select and use a compute target for training](how-to-set-up-training-targets.md).

[!INCLUDE [low-pri-note](../../includes/machine-learning-low-pri-vm.md)]

### Access data in a Compute Instance notebook

If you're using notebooks on an Azure Compute instance, you must ensure that your notebook is running on a compute resource behind the same virtual network and subnet as your data. 

You must configure your Compute Instance to be in the same virtual network during creation under **Advanced settings** > **Configure virtual network**. You cannot add an existing Compute Instance to a virtual network.

## Azure Databricks

To use Azure Databricks in a virtual network with your workspace, the following requirements must be met:

> [!div class="checklist"]
> * The virtual network must be in the same subscription and region as the Azure Machine Learning workspace.
> * If the Azure Storage Account(s) for the workspace are also secured in a virtual network, they must be in the same virtual network as the Azure Databricks cluster.
> * In addition to the __databricks-private__ and __databricks-public__ subnets used by Azure Databricks, the __default__ subnet created for the virtual network is also required.

For specific information on using Azure Databricks with a virtual network, see [Deploy Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

<a id="vmorhdi"></a>

## Virtual machine or HDInsight cluster

> [!IMPORTANT]
> Azure Machine Learning supports only virtual machines that are running Ubuntu.

In this section you learn how to use a virtual machine or Azure HDInsight cluster in a virtual network with your workspace.

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

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, see the [Limit outbound connectivity from the virtual network](#limiting-outbound-from-vnet) section.

### Attach the VM or HDInsight cluster

Attach the VM or HDInsight cluster to your Azure Machine Learning workspace. For more information, see [Set up compute targets for model training](how-to-set-up-training-targets.md).

## Next steps

This article is part three of a five-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 2: Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Part 4: Secure the inferencing environment](how-to-secure-inferencing-vnet.md)
* [Part 5: Enable studio functionality](how-to-enable-studio-virtual-network.md)

Also see the article on using [custom DNS](how-to-custom-dns.md) for name resolution.
