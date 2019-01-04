---
title: Run experiments and inferencing inside a Virtual Network 
description: Learn how to run experiments and inferencing inside a Virtual Network 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: aashishb
author: aashishb
ms.date: 01/02/2019
---

# Securely run experiments and inferencing inside an Azure Virtual Network

In this article, you will learn how to run your experiments and inferencing inside a Virtual Network. The Azure Machine Learning service works with Azure Services that can be created in a virtual network. For example, you can use a Data Science VM to train a model and then deploy the model to Azure Kubernetes Service.

A virtual network acts as a security boundary, isolating your Azure resources from the public internet. You can also join an Azure Virtual Network to your on-premise network. It allows you to securely train your models and access your deployed models for inferencing. For more information about virtual networks, see the [Virtual Networks Overview](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview) document.

## Storage account for your workspace

When you create an Azure Machine Learning service workspace, it requires an Azure Storage account. Do not create this storage account within a virtual network.

## Use Machine Learning Compute

To use Machine Learning Compute in a virtual network, use the follow information to understand network requirements:

- The virtual network must be in the same subscription and region as the Azure Machine Learning service workspace.

- The subnet specified for the Machine Learning Compute cluster must have enough unassigned IP addresses to accommodate the number of VMs targeted for the cluster. If the subnet doesn't have enough unassigned IP addresses, the cluster will be partially allocated.

- If you plan to secure the virtual network by restricting traffic, you must leave some ports open for the Machine Learning Compute service. For more information, see the [Required ports](#mlcports) section.

- Check whether your security policies or locks on the virtual network's subscription or resource group restrict a user's permissions to manage the virtual network.

- Machine Learning Compute automatically allocates additional networking resources in the resource group containing the virtual network. For each Machine Learning Compute cluster, Azure Machine Learning service allocates the following resources: 

    - One network security group (NSG)

    - One public IP address

    - One load balancer

    These resources are limited by the subscription's [resource quotas](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits). If you are going to place multiple Machine Learning Compute clusters in one virtual network, you may need to request a quota increase for one or more of these resources.

### <a id="mlcports"></a> Required ports

> [!IMPORTANT]
> Machine Learning Compute currently uses the Azure Batch Service to provision VMs in the specified virtual network. The subnet must allow inbound communication from the Batch service to be able to schedule runs on the Machine Learning Compute nodes and outbound communication to communicate with Azure Storage and other resources. Note that Batch adds NSGs at the level of network interfaces (NICs) attached to VMs. These NSGs automatically configure inbound and outbound rules to allow the following traffic:
>
>- Inbound TCP traffic on ports 29876 and 29877 from Batch service role IP addresses. 
> 
>- Inbound TCP traffic on port 22 to permit remote access.
> 
>- Outbound traffic on any port to the virtual network.
>
>- Outbound traffic on any port to the internet.

> [!IMPORTANT]
>Exercise caution if you modify or add inbound/outbound rules in Batch-configured NSGs. If communication to the compute nodes in the specified subnet is denied by an NSG, then the Machine Learning Compute services sets the state of the compute nodes to unusable.

>Please note that you do not need to specify NSGs at the subnet level because Batch configures its own NSGs as explained above. However, if the specified subnet has associated NSGs and/or a firewall, configure the inbound and outbound security rules as explained above and as shown in the screenshots below:

>![How to set up inbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/amlcompute-virtual-network-inbound.png)

>![How to set up outbound NSG rules for Machine Learning Compute](./media/how-to-enable-virtual-network/experimentation-virtual-network-outbound.png)

### Create Machine Learning Compute in a virtual network

Follow the steps below to create a Machine Learning Compute cluster that is inside a Virtual Network:

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning service workspace.

1. From the __Application__ section, select __Compute__. Then select __Add compute__. 

    ![How to add a compute in Azure Machine Learning service](./media/how-to-enable-virtual-network/add-compute.png)

1. To configure this compute resource to use a virtual network, use these options:

    - __Network configuration__: Select __Advanced__.

    - __Resource group__: Select the resource group that contains the virtual network.

    - __Virtual network__: Select the virtual network that contains the subnet.

    - __Subnet__: Select the subnet that the Machine Learning Compute will use.

    ![A screenshot showing virtual network settings for machine learning compute](./media/how-to-enable-virtual-network/amlcompute-virtual-network-screen.png)

You can now train your model on the newly created compute. For more information, see the [Select and use a compute target for training](how-to-set-up-training-targets.md) document.


## Use a Virtual Machine or HDInsight

To use a virtual machine or HDInsight cluster in a Virtual Network with your workspace, use the following steps:

> [!IMPORTANT]
> The Azure Machine Learning service only supports virtual machines running Ubuntu.

1. Create a VM or HDInsight cluster using Azure portal, Azure CLI, etc., and put it in an Azure Virtual Network. For more information, see the following documents:
    * [Create and manage Azure Virtual Networks for Linux VMs](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-virtual-network)
    * [Extend HDInsight using Azure Virtual Networks](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-extend-hadoop-virtual-network) 

1. Allow access from Azure Machine Learning service to the SSH port on the VM or cluster. The SSH port is usually port 22. To allow traffic from this source, use the following information:

    * __Source__: Select __Service Tag__.
    * __Source service tag__: Select __AzureMachineLearning__
    * __Source port ranges__: Select __*__
    * __Destination__: Select __Any__
    * __Destination port ranges__: Select __22__
    * __Protocol__: Select __Any__
    * __Action__: Select __Allow__

   ![Inbound rules for doing experimentation on VM or HDI inside a virtual network](./media/how-to-enable-virtual-network/experimentation-virtual-network-inbound.png)

    Keep the default outbound rules as shown in the screenshot below:

    ![Outbound rules for doing experimentation on VM or HDI inside a virtual network](./media/how-to-enable-virtual-network/experimentation-virtual-network-outbound.png)
    
1. Attach the vm or cluster to your Azure Machine Learning service workspace. For more information, see the following Jupyter notebooks:

    * [Train using a remote VM](https://github.com/Azure/MachineLearningNotebooks/blob/master/01.getting-started/04.train-on-remote-vm/04.train-on-remote-vm.ipynb)
    * [Train using an HDI cluster](https://github.com/Azure/MachineLearningNotebooks/blob/master/01.getting-started/05.train-in-spark/05.train-in-spark.ipynb) 


## Use Azure Kubernetes Service (AKS)

> [!IMPORTANT]
> Please check the prerequisites and plan IP addressing for your cluster before proceeding with the steps mentioned below. You can refer to [Configure advanced networking in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/configure-advanced-networking)
> 
>Keep the default outbound rules under NSG as shown in the screenshot below:
> 
>![Azure Machine Learning service: Experimentation inside a Virtual Network](./media/how-to-enable-virtual-network/experimentation-virtual-network-outbound.png)
>
> Azure Kubernetes Service and the Azure Virtual Network should be in the same region.

To add Azure Kubernetes Service in a Virtual Network to your workspace, use the following steps:

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning service workspace.

1. From the __Application__ section, select __Compute__. Then select __Add compute__. 

    ![How to add a compute in Azure Machine Learning service](./media/how-to-enable-virtual-network/add-compute.png)

1. To configure this compute resource to use a virtual network, use these options:

    - __Network configuration__: Select __Advanced__.
    - __Resource group__: Select the resource group that contains the virtual network.
    - __Virtual network__: Select the virtual network that contains the subnet.
    - __Subnet__: Select the subnet that the AKS will use.
    - __Kubernetes Service address range__: Select the Kubernetes Service address range. This address range uses a CIDR notation IP range to define the IP addresses available for the cluster. It must not overlap with any Subnet IP ranges. For example: 10.0.0.0/16
    - __Kubernetes DNS service IP address__: Select the Kubernetes DNS service IP address. This IP address assigned to the Kubernetes DNS service. It must be within the Kubernetes Service address range. For example: 10.0.0.10
    - __Docker bridge address__: Select the Docker bridge address. This IP address is assigned to Docker Bridge. It must not be in any Subnet IP ranges, or the Kubernetes Service address range. For example: 172.17.0.1/16

    ![Azure Machine Learning service: Machine Learning Compute Virtual Network Settings](./media/how-to-enable-virtual-network/aks-virtual-network-screen.png)

    > [!TIP]
    > If you already have an AKS cluster in a Virtual Network, you can attach it to the workspace. For more information, see [how to deploy to AKS](how-to-deploy-to-aks.md).

You are not ready to do inferencing on an AKS cluster behind a virtual network. For more information, see [how to deploy to AKS](how-to-deploy-to-aks.md).