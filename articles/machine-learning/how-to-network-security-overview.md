---
title: Network isolation & privacy overview
titleSuffix: Azure Machine Learning
description: Use an isolated Azure Virtual Network with Azure Machine Learning to secure workspace resources and compute environments.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 07/07/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python, references_regions

---

# Network security overview 

In this article, you learn how to use virtual networks to secure network communication in Azure Machine Learning. This article uses an example scenario to show you how to secure communication.

This article is part one of a four-part series that walks you through securing a virtual network. See the other articles in this series:

**1. VNet overview** > [2. Secure the workspace](how-to-secure-workspace-vnet.md) > [3. Secure the training environment](how-to-secure-training-vnet.md) > [4. Secure the inferencing environment](how-to-secure-inferencing-vnet.md) 

## Prerequisites

This article assumes that you have familiarity with the following topics:
+ [Azure Virtual Networks](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview)
+ [IP networking](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm)
+ [Azure Private Link](how-to-configure-private-link.md)
+ [Network Security Groups (NSG)](../virtual-network/security-overview.md)
+ [Network firewalls](../firewall/overview.md)

## Virtual network scenario

In this section, you learn how a common network scenario is setup to secure Azure Machine Learning resources from external communication with public and private IP addresses.

The table below shows how clients and services access different parts of an Azure Machine Learning architecture.

| Scenario | Workspace | Associated resources | Training compute environment | Inferencing compute environment |
|-|-|-|-|-|-|
|**No virtual network**| Public IP | Public IP | Public IP | Public IP |
|**Secure resources in a virtual network**| Private IP (Private Link) | Public IP (service endpoint) <br> **- or -** <br> Private IP (private endpoint) | Private IP | Private IP  | 

* **Workspace** - Use Private Link to connect an Azure Machine Learning workspace to a virtual network with private IP addresses.
* **Associated resource** - Use service endpoints or private endpoints to connec to workspace resources like Azure storage, Azure Key Vault, and Azure Container Services.
    * **Service endpoints** provide the identity of your virtual network to the Azure service. Once you enable service endpoints in your virtual network, you can add a virtual network rule to secure the Azure service resources to your virtual network. Service endpoints use public IP addresses.
    * **Private endpoints** are network interfaces that securely connect you to a service powered by Azure Private Link. Private endpoint use a private IP address from your VNet, effectively bringing the service into your VNet.
* **Training compute access** - Access training compute targets like Azure Machine Learning Compute Instance and Azure Machine Learning Compute Clusters securely in your virtual network with private IP addresses. 
* **Inferencing compute access** - Access Azure Kubernetes Services (AKS) compute clusters with private IP addresses.


## Set up a virtual network

The next five sections show you how to secure the network scenario described above. To secure your network, you must:

1. Secure the [**workspace and associated resources**](#secure-the-workspace-and-associated-resources).
1. Secure the [**training environment**](#secure-the-training-environment).
1. Secure the [**inferencing environment**](#secure-the-inferencing-environment).
1. Optionally: [**enable studio functionality**](#optional:-enable-studio-functionality).
1. Set up a **firewall** and **NSGs**

## Secure the workspace and associated resources

**Secure the workspace** > [Secure the training environment](#secure-the-training-environment) > [Secure the inferencing environment](#secure-the-inferencing-environment) > [Enable studio functionality](#optional:-enable-studio-functionality) > [Configure firewall settings](#configure-firewall-settings)

Use the following steps to secure your workspace and associated resources. These steps allow your services to communicate with the virtual network.

1. Create a Private Link-enabled workspace to [enable communication between your VNet and workspace](how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint).
1. Set Azure Key Vault to ["Allow trusted Microsoft services to access this storage account"]().
1. Add you Azure [storage account to the virtual network](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts).
1. Set Azure Container Registry to use a private endpoint to [enable network access from your VNet to Azure Container Registry]().

![Architecture diagram showing how the workspace and associated resources communicate to each other over service endpoints or private endpoints inside of a VNet](./media/how-to-network-security-overview/secure-workspace-resources.png)

For detailed instructions on these steps, see [Secure an Azure Machine Learning workspace](how-to-secure-workspace-vnet.md). 

### Limitations

Securing your workspace and associated resources within a virtual network have the following limitations:
- Only available in the following regions: eastus, westus2
- All resources must be under the same VNet. However, subnets within the same VNet are allowed.
- Some studio features like the designer, AutoML, labeling, and data profiling cannot be used with storage accounts configured to use a private endpoint. If you need to use these studio features, use service endpoints instead.

## Secure the training environment

[Secure the workspace](#secure-the-workspace-and-associated-resources) > **Secure the training environment** > [Secure the inferencing environment](#secure-the-inferencing-environment) > [Enable studio functionality](#optional:-enable-studio-functionality) > [Configure firewall settings](#configure-firewall-settings)

In this section, you learn how to secure a training environment in Azure Machine Learning. You also learn how Azure Machine Learning submit a training job using a virtual network.

To secure the training environment, use the following steps:

1. Create an Azure Machine Learning [compute instance and computer cluster in the virtual network]() to run the training job.

    >![NOTE]
    > Azure automatically creates a public load balancer for managed compute resources. You can also  configure your load balancer to only use private IP addresses.

1. [Allow inbound communication from Azure Batch Service]() so that Batch Service can submit jobs to your compute resources. 

![Architecture diagram showing how to secure managed compute clusters and instances](./media/how-to-network-security-overview/secure-training-environment.png)

For detailed instructions, see [Secure a training environment](how-to-secure-training-vnet.md). 

### Example training job submission 

In this section, you learn how Azure Machine Learning securely communicates between services to submit a training job. This workflow shows you how all the configurations work together to secure communications.

1. The client machine uploads training scripts and training data to storage accounts that are secured with a service or private endpoint.

1. The client submits a training job to the Azure Machine Learning workspace through Private Link.

1. Azure Batch services receives the job from the workspace and submits the training job to the compute environment through the public load balancer that's provisioned with the compute resource. 

1. The compute resource receive the job and begins execution. The compute resources accesses secure storage accounts to download training files and upload output. 

![Architecture diagram showing how an Azure Machine Learning training job gets submitted while using a VNet](./media/how-to-network-security-overview/secure-training-job-submission.png)


### Limitations

- Azure Compute Instance and Azure Compute Clusters must be in the same VNet, region, and subscription as the workspace and its associated resources. 

## Secure the inferencing environment

[Secure the workspace](#secure-the-workspace-and-associated-resources) > [Secure the training environment](#secure-the-training-environment) > **Secure the inferencing environment** > [Enable studio functionality](#optional:-enable-studio-functionality) > [Configure firewall settings](#configure-firewall-settings)

In this section, you learn the options available for securing an inferencing environment. We recommend that you use Azure Kubernetes Services (AKS) clusters for high-scale, production deployments.

You have two options for AKS clusters in a virtual network:

- Deploy or attach a default AKS cluster to your VNet.
- Attach a private AKS cluster to your VNet.

**Default AKS clusters** have a control plane with public IP addresses. You can add a default AKS cluster to your VNet during the cluster's deployment or attach a cluster after it's created.

**Private AKS clusters** have a control plane which can only be accessed through private IPs. Private AKS clusters must be attached after creation.

For detailed instructions, see [Secure an inferencing environment](how-to-secure-inferencing-vnet.md). 

The following network diagram shows a completely secured Azure Machine Learning workspace with a private AKS cluster attached to the virtual network.

![Architecture diagram showing how to attach a private AKS cluster to the virtual network. The AKS control plane is placed outside of the customer VNet](./media/how-to-network-security-overview/secure-inferencing-environment.png)

### Limitations
- AKS clusters must belong to the same VNet as the workspace and its associated resources. 
- For private AKS clusters, you must submit a PE Quota Request.

## Optional: enable studio functionality

[Secure the workspace](#secure-the-workspace-and-associated-resources) > [Secure the training environment](#secure-the-training-environment) > [Secure the inferencing environment](#secure-the-inferencing-environment) > **Enable studio functionality** > [Configure firewall settings](#configure-firewall-settings)

By default, the studio cannot access data in storage accounts secured in a virtual network. As a result, the following operations are disabled:

* Preview data in the studio.
* Visualize data in the designer.
* Submit an AutoML experiment.
* Start a labeling project.

To enable full functionality in the studio, you must [configure datastores to use managed identity](how-to-enable-studio-virtual-network.md).

### Limitations
- The studio cannot access data in storage accounts configured to use private endpoints. For full functionality, you must use service endpoints for storage and use managed identity.

## Configure firewall settings

[Secure the workspace](#secure-the-workspace-and-associated-resources) > [Secure the training environment](#secure-the-training-environment) > [Secure the inferencing environment](#secure-the-inferencing-environment) > [Enable studio functionality](#optional:-enable-studio-functionality) > **Configure firewall settings**

Use NSGs and firewalls to limit inbound and outbound traffic. When using a VNet, you must configure your NSG to allow inbound communication from Azure Batch services so that your compute resources can receive jobs.


## Next steps

This article is part one of a four-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 3: Secure the training environment](how-to-secure-training-vnet.md)
* [Part 4: Secure the inferencing environment](how-to-secure-inferencing-vnet.md)
