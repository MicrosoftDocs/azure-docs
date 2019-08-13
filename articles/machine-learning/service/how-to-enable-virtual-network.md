---
title: Run experiments and inference in a virtual network
titleSuffix: Azure Machine Learning service
description: Run machine learning experiments and inference securing within an Azure virtual network. Learn how to create compute targets for model training and how to run inference within a virtual network. Learn about requirements for secured virtual networks, such as requiring inbound and outbound ports.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: aashishb
author: aashishb
ms.date: 08/05/2019
---

# Run experiments and inference securely within an Azure virtual network

In this article, you learn how to run experiments and inference, or model scoring, within a virtual network. A virtual network acts as a security boundary, isolating your Azure resources from the public internet. You can also join an Azure virtual network to your on-premises network. By joining networks, you can securely train your models and access your deployed models for inference. Inference, or model scoring, is the phase during which the deployed model is used for prediction, most commonly on production data.

The Azure Machine Learning service relies on other Azure services for compute resources. Compute resources, or compute targets, are used to train and deploy models. The targets can be created within a virtual network. For example, you can use Microsoft Data Science Virtual Machine to train a model and then deploy the model to Azure Kubernetes Service (AKS). For more information about virtual networks, see [Azure Virtual Network overview](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview).

This article provides detailed information about *advanced security settings*, information that isn't necessary for basic or experimental use cases. Certain sections of this article provide configuration information for a variety of scenarios. You don't need to complete the instructions in order or in their entirety.

## Prerequisites

Create an Azure Machine Learning service [workspace](how-to-manage-workspace.md) if you don't already have one. This article assumes that you're familiar with both the Azure Virtual Network service and IP networking in general. The article also assumes that you've created a virtual network and subnet to use with your compute resources. If you're unfamiliar with the Azure Virtual Network service, you can learn about it in the following articles:

* [IP addressing](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm)
* [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview)
* [Quickstart: Create a virtual network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)
* [Filter network traffic](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

## Use a storage account for your workspace

To use an Azure storage account for the workspace in a virtual network, do the following:

1. Create an experimentation compute instance (for example, a Machine Learning Compute instance) behind a virtual network, or attach an experimentation compute instance to the workspace (for example, an HDInsight cluster or a virtual machine). 

   For more information, see the "Use a Machine Learning Compute instance" and "Use a virtual machine or HDInsight cluster" sections in this article.

1. In the Azure portal, go to the storage that's attached to your workspace. 

   ![The storage that's attached to the Azure Machine Learning service workspace](./media/how-to-enable-virtual-network/workspace-storage.png)

1. On the **Azure Storage** page, select __Firewalls and virtual networks__. 

   ![The "Firewalls and virtual networks" area on the Azure Storage page in the Azure portal](./media/how-to-enable-virtual-network/storage-firewalls-and-virtual-networks.png)

1. On the __Firewalls and virtual networks__ page, do the following:
    - Select __Selected networks__.
    - Under __Virtual networks__, select the __Add existing virtual network__ link. This action adds the virtual network where your experimentation compute instance resides (see step 1).
    - Select the __Allow trusted Microsoft services to access this storage account__ check box.

   ![The "Firewalls and virtual networks" pane in the Azure portal](./media/how-to-enable-virtual-network/storage-firewalls-and-virtual-networks-page.png)

1. As you're running the experiment, in your experimentation code, change the run config to use Azure Blob storage:

    ```python
    run_config.source_directory_data_store = "workspaceblobstore"
    ```

> [!IMPORTANT]
> You can place the _default storage account_ for the Azure Machine Learning service in a virtual network _for experimentation only_.
>
> You can place _non-default storage accounts_ in a virtual network _for experimentation only_.
>
> Both the default and non-default storage accounts that are used for _inference_ must have _unrestricted access to the storage account_.
>
> If you aren't sure whether you've modified the settings, see the "Change the default network access rule" section in [Configure Azure Storage firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security). Follow the instructions to allow access from all networks during inference, or model scoring.

## Use a key vault instance with your workspace

The key vault instance that's associated with the workspace is used by the Azure Machine Learning service to store the following credentials:
* The associated storage account connection string
* Passwords to Azure Container Repository instances
* Connection strings to data stores

To use Azure Machine Learning experimentation capabilities with Azure Key Vault behind a virtual network, do the following:
1. Go to the key vault that's associated with the workspace. 

   ![The key vault that's associated with the Azure Machine Learning service workspace](./media/how-to-enable-virtual-network/workspace-key-vault.png)

1. On the **Key Vault** page, in the left pane, select __Firewalls and virtual networks__. 

   ![The "Firewalls and virtual networks" section in the Key Vault pane](./media/how-to-enable-virtual-network/key-vault-firewalls-and-virtual-networks.png)

1. On the __Firewalls and virtual networks__ page, do the following:
    - Under __Allow access from__, select __Selected networks__.
    - Under __Virtual networks__, select __Add existing virtual networks__ to add the virtual network where your experimentation compute instance resides.
    - Under __Allow trusted Microsoft services to bypass this firewall__, select __Yes__.

   ![The "Firewalls and virtual networks" section in the Key Vault pane](./media/how-to-enable-virtual-network/key-vault-firewalls-and-virtual-networks-page.png)

## Use a Machine Learning Compute instance

To use an Azure Machine Learning Compute instance in a virtual network, consider the following network requirements:

- The virtual network must be in the same subscription and region as the Azure Machine Learning service workspace.

- The subnet that's specified for the compute cluster must have enough unassigned IP addresses to accommodate the number of VMs that are targeted for the cluster. If the subnet doesn't have enough unassigned IP addresses, the cluster will be partially allocated.

- If you plan to secure the virtual network by restricting traffic, leave some ports open for the compute service. For more information, see the [Required ports](#mlcports) section.

- Check to see whether your security policies or locks on the virtual network's subscription or resource group restrict permissions to manage the virtual network.

- If you're going to put multiple compute clusters in one virtual network, you might need to request a quota increase for one or more of your resources.

    The Machine Learning Compute instance automatically allocates additional networking resources in the resource group that contains the virtual network. For each compute cluster, the service allocates the following resources:

    - One network security group

    - One public IP address

    - One load balancer

  These resources are limited by the subscription's [resource quotas](https://docs.microsoft.com/azure/azure-subscription-service-limits).

### <a id="mlcports"></a> Required ports

Machine Learning Compute currently uses the Azure Batch service to provision VMs in the specified virtual network. The subnet must allow inbound communication from the Batch service. You use this communication to schedule runs on the Machine Learning Compute nodes and to communicate with Azure Storage and other resources. The Batch service adds network security groups (NSGs) at the level of network interfaces (NICs) that are attached to VMs. These NSGs automatically configure inbound and outbound rules to allow the following traffic:

- Inbound TCP traffic on ports 29876 and 29877 from a __Service Tag__ of __BatchNodeManagement__.

    ![An inbound rule that uses the BatchNodeManagement service tag](./media/how-to-enable-virtual-network/batchnodemanagement-service-tag.png)

- (Optional) Inbound TCP traffic on port 22 to permit remote access. Use this port only if you want to connect by using SSH on the public IP.

- Outbound traffic on any port to the virtual network.

- Outbound traffic on any port to the internet.

Exercise caution if you modify or add inbound or outbound rules in Batch-configured NSGs. If an NSG blocks communication to the compute nodes, the compute service sets the state of the compute nodes to unusable.

You don't need to specify NSGs at the subnet level, because the Azure Batch service configures its own NSGs. However, if the specified subnet has associated NSGs or a firewall, configure the inbound and outbound security rules as mentioned earlier.

The NSG rule configuration in the Azure portal is shown in the following images:

![The inbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/amlcompute-virtual-network-inbound.png)

![The outbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/experimentation-virtual-network-outbound.png)

### <a id="limiting-outbound-from-vnet"></a> Limit outbound connectivity from the virtual network

If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, do the following:

- Deny outbound internet connection by using the NSG rules.

- Limit outbound traffic to the following:
   - Azure Storage, by using __Service Tag__ of __Storage.Region_Name__ (for example, Storage.EastUS)
   - Azure Container Registry, by using __Service Tag__ of __AzureContainerRegistry.Region_Name__ (for example, AzureContainerRegistry.EastUS)
   - Azure Machine Learning service, by using __Service Tag__ of __AzureMachineLearning__

The NSG rule configuration in the Azure portal is shown in the following image:

![The outbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/limited-outbound-nsg-exp.png)

### User-defined routes for forced tunneling

If you're using forced tunneling with Machine Learning Compute, add [user-defined routes (UDRs)](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview) to the subnet that contains the compute resource.

* Establish a UDR for each IP address that's used by the Azure Batch service in the region where your resources exist. These UDRs enable the Batch service to communicate with compute nodes for task scheduling. To get a list of IP addresses of the Batch service, contact Azure Support.

* Outbound traffic to Azure Storage must not be blocked by your on-premises network appliance. Specifically, the URLs are in the form `<account>.table.core.windows.net`, `<account>.queue.core.windows.net`, and `<account>.blob.core.windows.net`.

When you add the UDRs, define the route for each related Batch IP address prefix and set __Next hop type__ to __Internet__. The following image shows an example of this UDR in the Azure portal:

![Example of a UDR for an address prefix](./media/how-to-enable-virtual-network/user-defined-route.png)

For more information, see [Create an Azure Batch pool in a virtual network](../../batch/batch-virtual-network.md#user-defined-routes-for-forced-tunneling).

### Create a Machine Learning Compute cluster in a virtual network

To create a Machine Learning Compute cluster, do the following:

1. In the [Azure portal](https://portal.azure.com), select your Azure Machine Learning service workspace.

1. In the __Application__ section, select __Compute__, and then select __Add compute__.

1. To configure this compute resource to use a virtual network, do the following:

    a. For __Network configuration__, select __Advanced__.

    b. In the __Resource group__ drop-down list, select the resource group that contains the virtual network.

    c. In the __Virtual network__ drop-down list, select the virtual network that contains the subnet.

    d. In the __Subnet__ drop-down list, select the subnet to use.

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

## Use a virtual machine or HDInsight cluster

To use a virtual machine or Azure HDInsight cluster in a virtual network with your workspace, do the following:

1. Create a VM or HDInsight cluster by using the Azure portal or the Azure CLI, and put the cluster in an Azure virtual network. For more information, see the following articles:
    * [Create and manage Azure virtual networks for Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-virtual-network)

    * [Extend HDInsight using an Azure virtual network](https://docs.microsoft.com/azure/hdinsight/hdinsight-extend-hadoop-virtual-network)

1. To allow the Azure Machine Learning service to communicate with the SSH port on the VM or cluster, configure a source entry for the network security group. The SSH port is usually port 22. To allow traffic from this source, do the following:

    * In the __Source__ drop-down list, select __Service Tag__.

    * In the __Source service tag__ drop-down list, select __AzureMachineLearning__.

    * In the __Source port ranges__ drop-down list, select __*__.

    * In the __Destination__ drop-down list, select __Any__.

    * In the __Destination port ranges__ drop-down list, select __22__.

    * Under __Protocol__, select __Any__.

    * Under __Action__, select __Allow__.

   ![Inbound rules for doing experimentation on a VM or HDInsight cluster within a virtual network](./media/how-to-enable-virtual-network/experimentation-virtual-network-inbound.png)

    Keep the default outbound rules for the network security group. For more information, see the default security rules in [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#default-security-rules).

    If you don't want to use the default outbound rules and you do want to limit the outbound access of your virtual network, see the [Limit outbound connectivity from the virtual network](#limiting-outbound-from-vnet) section.

1. Attach the VM or HDInsight cluster to your Azure Machine Learning service workspace. For more information, see [Set up compute targets for model training](how-to-set-up-training-targets.md).

> [!IMPORTANT]
> The Azure Machine Learning service supports only virtual machines that are running Ubuntu.

## Use Azure Kubernetes Service (AKS)

To add AKS in a virtual network to your workspace, do the following:

> [!IMPORTANT]
> Before you begin the following procedure, check the prerequisites and plan the IP addressing for your cluster. For more information, see [Configure advanced networking in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/configure-advanced-networking).
>
> Keep the default outbound rules for the NSG. For more information, see the default security rules in [Security groups](https://docs.microsoft.com/azure/virtual-network/security-overview#default-security-rules).
>
> The AKS instance and the Azure virtual network should be in the same region.

1. In the [Azure portal](https://portal.azure.com), make sure that the NSG that controls the virtual network has an inbound rule that's enabled for the Azure Machine Learning service by using __AzureMachineLearning__ as the **SOURCE**.

    ![The Azure Machine Learning service Add Compute pane](./media/how-to-enable-virtual-network/aks-vnet-inbound-nsg-aml.png)

1. Select your Azure Machine Learning service workspace.

1. In the __Application__ section, select __Compute__, and then select __Add compute__.

1. To configure this compute resource to use a virtual network, do the following:

    - For __Network configuration__, select __Advanced__.

    - In the __Resource group__ drop-down list, select the resource group that contains the virtual network.

    - In the __Virtual network__ drop-down list, select the virtual network that contains the subnet.

    - In the __Subnet__ drop-down list, select the subnet.

    - In the __Kubernetes Service address range__ box, enter the Kubernetes service address range. This address range uses a Classless Inter-Domain Routing (CIDR) notation IP range to define the IP addresses that are available for the cluster. It must not overlap with any subnet IP ranges (for example, 10.0.0.0/16).

    - In the __Kubernetes DNS service IP address__ box, enter the Kubernetes DNS service IP address. This IP address is assigned to the Kubernetes DNS service. It must be within the Kubernetes service address range (for example, 10.0.0.10).

    - In the __Docker bridge address__ box, enter the Docker bridge address. This IP address is assigned to Docker Bridge. It must not be in any subnet IP ranges, or the Kubernetes service address range (for example, 172.17.0.1/16).

   ![Azure Machine Learning service: Machine Learning Compute virtual network settings](./media/how-to-enable-virtual-network/aks-virtual-network-screen.png)

1. Make sure that the NSG group that controls the virtual network has an inbound security rule enabled for the scoring endpoint so that it can be called from outside the virtual network.

    ![An inbound security rule](./media/how-to-enable-virtual-network/aks-vnet-inbound-nsg-scoring.png)

    > [!TIP]
    > If you already have an AKS cluster in a virtual network, you can attach it to the workspace. For more information, see [How to deploy to AKS](how-to-deploy-to-aks.md).

You can also use the Azure Machine Learning SDK to add AKS in a virtual network. The following code creates a new AKS instance in the `default` subnet of a virtual network named `mynetwork`:

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

When the creation process is completed, you can run inference, or model scoring, on an AKS cluster behind a virtual network. For more information, see [How to deploy to AKS](how-to-deploy-to-aks.md).

## Next steps

* [Set up training environments](how-to-set-up-training-targets.md)
* [Where to deploy models](how-to-deploy-and-where.md)
* [Securely deploy models with SSL](how-to-secure-web-service.md)

