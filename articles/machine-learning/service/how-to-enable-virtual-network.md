---
title: Run experiments & inference in a virtual network
titleSuffix: Azure Machine Learning service
description: Run machine learning experiments and inferencing securing inside an Azure Virtual Network. Learn how to create compute targets for model training and how to inference within an Azure Virtual Network. It also covers requirements for secured virtual networks, such as require inbound and outbound ports.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: aashishb
author: aashishb
ms.date: 01/08/2019
---

# Securely run experiments and inferencing inside an Azure Virtual Network

In this article, you learn how to run your experiments and inferencing inside a Virtual Network. A virtual network acts as a security boundary, isolating your Azure resources from the public internet. You can also join an Azure Virtual Network to your on-premises network. It allows you to securely train your models and access your deployed models for inferencing.

The Azure Machine Learning service relies on other Azure services for things compute resources. Compute resources (compute targets) are used to train and deploy models. These compute targets can be created inside a virtual network. For example, you can use a Data Science VM to train a model and then deploy the model to Azure Kubernetes Service. For more information about virtual networks, see the [Virtual Networks Overview](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) document.

## Storage account for your workspace

When you create an Azure Machine Learning service workspace, it requires an Azure Storage account. Do not turn on firewall rules for this storage account. The Azure Machine Learning service requires unrestricted access to the storage account.

If you are not sure whether you have modified these settings or not, see the __Change the default network access rule__ section of the [Configure Azure Storage firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security) document and use the steps to _allow access_ from __All networks__.

## Use Machine Learning Compute

To use Machine Learning Compute in a virtual network, use the following information to understand network requirements:

- The virtual network must be in the same subscription and region as the Azure Machine Learning service workspace.

- The subnet specified for the Machine Learning Compute cluster must have enough unassigned IP addresses to accommodate the number of VMs targeted for the cluster. If the subnet doesn't have enough unassigned IP addresses, the cluster will be partially allocated.

- If you plan to secure the virtual network by restricting traffic, you must leave some ports open for the Machine Learning Compute service. For more information, see the [Required ports](#mlcports) section.

- Check whether your security policies or locks on the virtual network's subscription or resource group restrict permissions to manage the virtual network.

- If you are going to place multiple Machine Learning Compute clusters in one virtual network, you may need to request a quota increase for one or more of resources.

    Machine Learning Compute automatically allocates additional networking resources in the resource group containing the virtual network. For each Machine Learning Compute cluster, Azure Machine Learning service allocates the following resources: 

    - One network security group (NSG)

    - One public IP address

    - One load balancer

    These resources are limited by the subscription's [resource quotas](https://docs.microsoft.com/azure/azure-subscription-service-limits). 

### <a id="mlcports"></a> Required ports

Machine Learning Compute currently uses the Azure Batch Service to provision VMs in the specified virtual network. The subnet must allow inbound communication from the Batch service. This communication is used to schedule runs on the Machine Learning Compute nodes, and to communicate with Azure Storage and other resources. Batch adds NSGs at the level of network interfaces (NICs) attached to VMs. These NSGs automatically configure inbound and outbound rules to allow the following traffic:

- Inbound TCP traffic on ports 29876 and 29877 from Batch service role IP addresses. 
 
- Inbound TCP traffic on port 22 to permit remote access.
 
- Outbound traffic on any port to the virtual network.

- Outbound traffic on any port to the internet.

Exercise caution if you modify or add inbound/outbound rules in Batch-configured NSGs. If an NSG blocks communication to the compute nodes, then the Machine Learning Compute services sets the state of the compute nodes to unusable.

You do not need to specify NSGs at the subnet level because Batch configures its own NSGs. However, if the specified subnet has associated NSGs and/or a firewall, configure the inbound and outbound security rules as mentioned earlier. The following screenshots show how the rule configuration looks in the Azure portal:

![Screenshot of inbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/amlcompute-virtual-network-inbound.png)

![Screenshot of outbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/experimentation-virtual-network-outbound.png)

### Create Machine Learning Compute in a virtual network

To create a Machine Learning Compute cluster with the **Azure portal**, use the following steps:

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning service workspace.

1. From the __Application__ section, select __Compute__. Then select __Add compute__. 

    ![How to add a compute in Azure Machine Learning service](./media/how-to-enable-virtual-network/add-compute.png)

1. To configure this compute resource to use a virtual network, use these options:

    - __Network configuration__: Select __Advanced__.

    - __Resource group__: Select the resource group that contains the virtual network.

    - __Virtual network__: Select the virtual network that contains the subnet.

    - __Subnet__: Select the subnet to use.

    ![A screenshot showing virtual network settings for machine learning compute](./media/how-to-enable-virtual-network/amlcompute-virtual-network-screen.png)

You can also create a Machine Learning Compute cluster using the **Azure Machine Learning SDK**. The following code creates a new Machine Learning Compute cluster in the `default` subnet of a virtual network named `mynetwork`:

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# The Azure Virtual Network name, subnet, and resource group
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
                                                           vnet_resourcegroup_name = vnet_resourcegroup_name,
                                                           vnet_name = vnet_name,
                                                           subnet_name = subnet_name)

    # Create the cluster with the specified name and configuration
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)
    
    # Wait for the cluster to complete, show the output log
    cpu_cluster.wait_for_completion(show_output=True)
```

Once the creation process finishes, you can train your model using the cluster. For more information, see the [Select and use a compute target for training](how-to-set-up-training-targets.md) document.

## Use a Virtual Machine or HDInsight

To use a virtual machine or HDInsight cluster in a Virtual Network with your workspace, use the following steps:

> [!IMPORTANT]
> The Azure Machine Learning service only supports virtual machines running Ubuntu.

1. Create a VM or HDInsight cluster using Azure portal, Azure CLI, etc., and put it in an Azure Virtual Network. For more information, see the following documents:
    * [Create and manage Azure Virtual Networks for Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-virtual-network)

    * [Extend HDInsight using Azure Virtual Networks](https://docs.microsoft.com/azure/hdinsight/hdinsight-extend-hadoop-virtual-network) 

1. To allow Azure Machine Learning service to communicate with the SSH port on the VM or cluster, you must configure a source entry for the NSG. The SSH port is usually port 22. To allow traffic from this source, use the following information:

    * __Source__: Select __Service Tag__

    * __Source service tag__: Select __AzureMachineLearning__

    * __Source port ranges__: Select __*__

    * __Destination__: Select __Any__

    * __Destination port ranges__: Select __22__

    * __Protocol__: Select __Any__

    * __Action__: Select __Allow__

   ![Screenshot of inbound rules for doing experimentation on VM or HDInsight inside a virtual network](./media/how-to-enable-virtual-network/experimentation-virtual-network-inbound.png)

    Keep the default outbound rules for the NSG. For more information, see the default security rules section of the [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#default-security-rules) documentation.
    
1. Attach the VM or HDInsight cluster to your Azure Machine Learning service workspace. For more information, see the [Set up compute targets for model training](how-to-set-up-training-targets.md) document.

## Use Azure Kubernetes Service (AKS)

> [!IMPORTANT]
> Please check the prerequisites and plan IP addressing for your cluster before proceeding with the steps mentioned below. You can refer to [Configure advanced networking in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/configure-advanced-networking)
> 
> Keep the default outbound rules for the NSG. For more information, see the default security rules section of the [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#default-security-rules) documentation.
>
> Azure Kubernetes Service and the Azure Virtual Network should be in the same region.

To add Azure Kubernetes Service in a Virtual Network to your workspace, use the following steps from the __Azure portal__:

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning service workspace.

1. From the __Application__ section, select __Compute__. Then select __Add compute__. 

    ![How to add a compute in Azure Machine Learning service](./media/how-to-enable-virtual-network/add-compute.png)

1. To configure this compute resource to use a virtual network, use these options:

    - __Network configuration__: Select __Advanced__.

    - __Resource group__: Select the resource group that contains the virtual network.

    - __Virtual network__: Select the virtual network that contains the subnet.

    - __Subnet__: Select the subnet.

    - __Kubernetes Service address range__: Select the Kubernetes Service address range. This address range uses a CIDR notation IP range to define the IP addresses available for the cluster. It must not overlap with any Subnet IP ranges. For example: 10.0.0.0/16.

    - __Kubernetes DNS service IP address__: Select the Kubernetes DNS service IP address. This IP address is assigned to the Kubernetes DNS service. It must be within the Kubernetes Service address range. For example: 10.0.0.10.

    - __Docker bridge address__: Select the Docker bridge address. This IP address is assigned to Docker Bridge. It must not be in any Subnet IP ranges, or the Kubernetes Service address range. For example: 172.17.0.1/16

   ![Azure Machine Learning service: Machine Learning Compute Virtual Network Settings](./media/how-to-enable-virtual-network/aks-virtual-network-screen.png)

    > [!TIP]
    > If you already have an AKS cluster in a Virtual Network, you can attach it to the workspace. For more information, see [how to deploy to AKS](how-to-deploy-to-aks.md).

You can also use the **Azure Machine Learning SDK** to add Azure Kubernetes service in a Virtual Network. The following code creates a new Azure Kubernetes Service in the `default` subnet of a virtual network named `mynetwork`:

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
aks_target = ComputeTarget.create(workspace = ws,
                                  name = "myaks",
                                  provisioning_configuration = config)
```

Once the creation process completes, you can do inferencing on an AKS cluster behind a virtual network. For more information, see [how to deploy to AKS](how-to-deploy-to-aks.md).

## Next steps

* [Set up training environments](how-to-set-up-training-targets.md)
* [Where to deploy models](how-to-deploy-and-where.md)
* [Secure deployed models with SSL](how-to-secure-web-service.md)
