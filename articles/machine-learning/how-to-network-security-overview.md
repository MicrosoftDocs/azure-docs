---
title: Secure workspace resources using virtual networks (VNets)
titleSuffix: Azure Machine Learning
description: Secure Azure Machine Learning workspace resources and compute environments using an isolated Azure Virtual Network (VNet).
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 09/13/2023
ms.topic: how-to
ms.custom: references_regions, contperf-fy21q1, contperf-fy21q4, FY21Q4-aml-seo-hack, security, event-tier1-build-2022, build-2023
monikerRange: 'azureml-api-2 || azureml-api-1'
---

<!-- # Virtual network isolation and privacy overview -->
# Secure Azure Machine Learning workspace resources using virtual networks (VNets)

:::moniker range="azureml-api-2"
[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]
:::moniker-end
:::moniker range="azureml-api-1"
[!INCLUDE [dev v1](includes/machine-learning-dev-v1.md)]
:::moniker-end

[!INCLUDE [managed-vnet-note](includes/managed-vnet-note.md)]

Secure Azure Machine Learning workspace resources and compute environments using Azure Virtual Networks (VNets). This article uses an example scenario to show you how to configure a complete virtual network.

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

:::moniker range="azureml-api-2"
* [Use managed networks](how-to-managed-network.md) (preview)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure machine learning registries](how-to-registry-network-isolation.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)
* [API platform network isolation](how-to-configure-network-isolation-with-v2.md)
:::moniker-end
:::moniker range="azureml-api-1"
* [Secure the workspace resources](./v1/how-to-secure-workspace-vnet.md)
* [Secure the training environment](./v1/how-to-secure-training-vnet.md)
* [Secure the inference environment](./v1/how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)
:::moniker-end

For a tutorial on creating a secure workspace, see [Tutorial: Create a secure workspace](tutorial-create-secure-workspace.md) or [Tutorial: Create a secure workspace using a template](tutorial-create-secure-workspace-template.md).

## Prerequisites

This article assumes that you have familiarity with the following articles:
+ [Azure Virtual Networks](../virtual-network/virtual-networks-overview.md)
+ [IP networking](../virtual-network/ip-services/public-ip-addresses.md)
+ [Azure Machine Learning workspace with private endpoint](how-to-configure-private-link.md)
+ [Network Security Groups (NSG)](../virtual-network/network-security-groups-overview.md)
+ [Network firewalls](../firewall/overview.md)
## Example scenario

In this section, you learn how a common network scenario is set up to secure Azure Machine Learning communication with private IP addresses.

The following table compares how services access different parts of an Azure Machine Learning network with and without a VNet:

| Scenario | Workspace | Associated resources | Training compute environment | Inferencing compute environment |
|-|-|-|-|-|-|
|**No virtual network**| Public IP | Public IP | Public IP | Public IP |
|**Public workspace, all other resources in a virtual network** | Public IP | Public IP (service endpoint) <br> **- or -** <br> Private IP (private endpoint) | Public IP | Private IP  |
|**Secure resources in a virtual network**| Private IP (private endpoint) | Public IP (service endpoint) <br> **- or -** <br> Private IP (private endpoint) | Private IP | Private IP  | 

* **Workspace** - Create a private endpoint for your workspace. The private endpoint connects the workspace to the vnet through several private IP addresses.
    * **Public access** - You can optionally enable public access for a secured workspace.
* **Associated resource** - Use service endpoints or private endpoints to connect to workspace resources like Azure storage, Azure Key Vault. For Azure Container Services, use a private endpoint.
    * **Service endpoints** provide the identity of your virtual network to the Azure service. Once you enable service endpoints in your virtual network, you can add a virtual network rule to secure the Azure service resources to your virtual network. Service endpoints use public IP addresses.
    * **Private endpoints** are network interfaces that securely connect you to a service powered by Azure Private Link. Private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet.
* **Training compute access** - Access training compute targets like Azure Machine Learning Compute Instance and Azure Machine Learning Compute Clusters with public or private IP addresses.
* **Inference compute access** - Access Azure Kubernetes Services (AKS) compute clusters with private IP addresses.


The next sections show you how to secure the network scenario described previously. To secure your network, you must:

1. Secure the [**workspace and associated resources**](#secure-the-workspace-and-associated-resources).
1. Secure the [**training environment**](#secure-the-training-environment).
1. Secure the [**inferencing environment**](#secure-the-inferencing-environment).
1. Optionally: [**enable studio functionality**](#optional-enable-studio-functionality).
1. Configure [**firewall settings**](#configure-firewall-settings).
1. Configure [**DNS name resolution**](#custom-dns).

## Public workspace and secured resources

> [!IMPORTANT]
> While this is a supported configuration for Azure Machine Learning, Microsoft doesn't recommend it. The data in the Azure Storage Account behind the virtual network can be exposed on the public workspace. You should verify this configuration with your security team before using it in production.

If you want to access the workspace over the public internet while keeping all the associated resources secured in a virtual network, use the following steps:

1. Create an [Azure Virtual Network](../virtual-network/virtual-networks-overview.md). This network secures the resources used by the workspace.
1. Use __one__ of the following options to create a publicly accessible workspace:

    :::moniker range="azureml-api-2"
    * Create an Azure Machine Learning workspace that __does not__ use the virtual network. For more information, see [Manage Azure Machine Learning workspaces](how-to-manage-workspace.md).

    OR

    * Create a [Private Link-enabled workspace](how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint) to enable communication between your VNet and workspace. Then [enable public access to the workspace](#optional-enable-public-access).
    :::moniker-end
    :::moniker range="azureml-api-1"
    * Create an Azure Machine Learning workspace that __does not__ use the virtual network. For more information, see [Manage Azure Machine Learning workspaces](./v1/how-to-manage-workspace.md).
    * Create a [Private Link-enabled workspace](./v1/how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint) to enable communication between your VNet and workspace. Then [enable public access to the workspace](#optional-enable-public-access).
    :::moniker-end

1. Add the following services to the virtual network by using _either_ a __service endpoint__ or a __private endpoint__. Also allow trusted Microsoft services to access these services:

    :::moniker range="azureml-api-2"
    | Service | Endpoint information | Allow trusted information |
    | ----- | ----- | ----- |
    | __Azure Key Vault__| [Service endpoint](../key-vault/general/overview-vnet-service-endpoints.md)</br>[Private endpoint](../key-vault/general/private-link-service.md) | [Allow trusted Microsoft services to bypass this firewall](how-to-secure-workspace-vnet.md#secure-azure-key-vault) |
    | __Azure Storage Account__ | [Service and private endpoint](how-to-secure-workspace-vnet.md?tabs=se#secure-azure-storage-accounts)</br>[Private endpoint](how-to-secure-workspace-vnet.md?tabs=pe#secure-azure-storage-accounts) | [Grant access to trusted Azure services](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) |
    | __Azure Container Registry__ | [Private endpoint](../container-registry/container-registry-private-link.md) | [Allow trusted services](../container-registry/allow-access-trusted-services.md) |
    :::moniker-end
    :::moniker range="azureml-api-1"
    | Service | Endpoint information | Allow trusted information |
    | ----- | ----- | ----- |
    | __Azure Key Vault__| [Service endpoint](../key-vault/general/overview-vnet-service-endpoints.md)</br>[Private endpoint](../key-vault/general/private-link-service.md) | [Allow trusted Microsoft services to bypass this firewall](./v1/how-to-secure-workspace-vnet.md#secure-azure-key-vault) |
    | __Azure Storage Account__ | [Service and private endpoint](./v1/how-to-secure-workspace-vnet.md?tabs=se#secure-azure-storage-accounts)</br>[Private endpoint](./v1/how-to-secure-workspace-vnet.md?tabs=pe#secure-azure-storage-accounts) | [Grant access to trusted Azure services](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) |
    | __Azure Container Registry__ | [Private endpoint](../container-registry/container-registry-private-link.md) | [Allow trusted services](../container-registry/allow-access-trusted-services.md) |
    :::moniker-end

1. In properties for the Azure Storage Account(s) for your workspace, add your client IP address to the allowed list in firewall settings. For more information, see [Configure firewalls and virtual networks](../storage/common/storage-network-security.md#configuring-access-from-on-premises-networks).

## Secure the workspace and associated resources

Use the following steps to secure your workspace and associated resources. These steps allow your services to communicate in the virtual network.

:::moniker range="azureml-api-2"
1. Create an [Azure Virtual Networks](../virtual-network/virtual-networks-overview.md). This network secures the workspace and other resources. Then create a [Private Link-enabled workspace](how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint) to enable communication between your VNet and workspace.
1. Add the following services to the virtual network by using _either_ a __service endpoint__ or a __private endpoint__. Also allow trusted Microsoft services to access these services:

    | Service | Endpoint information | Allow trusted information |
    | ----- | ----- | ----- |
    | __Azure Key Vault__| [Service endpoint](../key-vault/general/overview-vnet-service-endpoints.md)</br>[Private endpoint](../key-vault/general/private-link-service.md) | [Allow trusted Microsoft services to bypass this firewall](how-to-secure-workspace-vnet.md#secure-azure-key-vault) |
    | __Azure Storage Account__ | [Service and private endpoint](how-to-secure-workspace-vnet.md?tabs=se#secure-azure-storage-accounts)</br>[Private endpoint](how-to-secure-workspace-vnet.md?tabs=pe#secure-azure-storage-accounts) | [Grant access from Azure resource instances](../storage/common/storage-network-security.md#grant-access-from-azure-resource-instances)</br>**or**</br>[Grant access to trusted Azure services](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) |
    | __Azure Container Registry__ | [Private endpoint](../container-registry/container-registry-private-link.md) | [Allow trusted services](../container-registry/allow-access-trusted-services.md) |
:::moniker-end
:::moniker range="azureml-api-1"
1. Create an [Azure Virtual Networks](../virtual-network/virtual-networks-overview.md). This virtual network secures the workspace and other resources. Then create a [Private Link-enabled workspace](./v1/how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint) to enable communication between your VNet and workspace.
1. Add the following services to the virtual network by using _either_ a __service endpoint__ or a __private endpoint__. Also allow trusted Microsoft services to access these services:

    | Service | Endpoint information | Allow trusted information |
    | ----- | ----- | ----- |
    | __Azure Key Vault__| [Service endpoint](../key-vault/general/overview-vnet-service-endpoints.md)</br>[Private endpoint](../key-vault/general/private-link-service.md) | [Allow trusted Microsoft services to bypass this firewall](./v1/how-to-secure-workspace-vnet.md#secure-azure-key-vault) |
    | __Azure Storage Account__ | [Service and private endpoint](./v1/how-to-secure-workspace-vnet.md?tabs=se#secure-azure-storage-accounts)</br>[Private endpoint](./v1/how-to-secure-workspace-vnet.md?tabs=pe#secure-azure-storage-accounts) | [Grant access from Azure resource instances](../storage/common/storage-network-security.md#grant-access-from-azure-resource-instances)</br>**or**</br>[Grant access to trusted Azure services](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) |
    | __Azure Container Registry__ | [Private endpoint](../container-registry/container-registry-private-link.md) | [Allow trusted services](../container-registry/allow-access-trusted-services.md) |
:::moniker-end

:::image type="content" source="./media/how-to-network-security-overview/secure-workspace-resources.svg" alt-text="Diagram showing how the workspace and associated resources communicate inside a VNet.":::

:::moniker range="azureml-api-2"
For detailed instructions on how to complete these steps, see [Secure an Azure Machine Learning workspace](how-to-secure-workspace-vnet.md).
:::moniker-end
:::moniker range="azureml-api-1"
For detailed instructions on how to complete these steps, see [Secure an Azure Machine Learning workspace](./v1/how-to-secure-workspace-vnet.md).
:::moniker-end

### Limitations

Securing your workspace and associated resources within a virtual network have the following limitations:
- All resources must be behind the same VNet. However, subnets within the same VNet are allowed.

## Secure the training environment

In this section, you learn how to secure the training environment in Azure Machine Learning. You also learn how Azure Machine Learning completes a training job to understand how the network configurations work together.

To secure the training environment, use the following steps:

:::moniker range="azureml-api-2"
1. Create an Azure Machine Learning [compute instance and computer cluster in the virtual network](how-to-secure-training-vnet.md) to run the training job.
1. If your compute cluster or compute instance uses a public IP address, you must [Allow inbound communication](how-to-secure-training-vnet.md) so that management services can submit jobs to your compute resources. 

    > [!TIP]
    > Compute cluster and compute instance can be created with or without a public IP address. If created with a public IP address, you get a load balancer with a public IP to accept the inbound access from Azure batch service and Azure Machine Learning service. You need to configure User Defined Routing (UDR) if you use a firewall. If created without a public IP, you get a private link service to accept the inbound access from Azure batch service and Azure Machine Learning service without a public IP.
:::moniker-end
:::moniker range="azureml-api-1"
1. Create an Azure Machine Learning [compute instance and computer cluster in the virtual network](./v1/how-to-secure-training-vnet.md) to run the training job.
1. If your compute cluster or compute instance uses a public IP address, you must [Allow inbound communication](./v1/how-to-secure-training-vnet.md) so that management services can submit jobs to your compute resources. 

    > [!TIP]
    > Compute cluster and compute instance can be created with or without a public IP address. If created with a public IP address, you get a load balancer with a public IP to accept the inbound access from Azure batch service and Azure Machine Learning service. You need to configure User Defined Routing (UDR) if you use a firewall. If created without a public IP, you get a private link service to accept the inbound access from Azure batch service and Azure Machine Learning service without a public IP.
:::moniker-end

:::image type="content" source="./media/how-to-network-security-overview/secure-training-environment.svg" alt-text="Diagram showing how to secure managed compute clusters and instances.":::

:::moniker range="azureml-api-2"
For detailed instructions on how to complete these steps, see [Secure a training environment](how-to-secure-training-vnet.md). 
:::moniker-end
:::moniker range="azureml-api-1"
For detailed instructions on how to complete these steps, see [Secure a training environment](./v1/how-to-secure-training-vnet.md). 
:::moniker-end

### Example training job submission 

In this section, you learn how Azure Machine Learning securely communicates between services to submit a training job. This example shows you how all your configurations work together to secure communication.

1. The client uploads training scripts and training data to storage accounts that are secured with a service or private endpoint.

1. The client submits a training job to the Azure Machine Learning workspace through the private endpoint.

1. Azure Batch service receives the job from the workspace. It then submits the training job to the compute environment through the public load balancer for the compute resource. 

1. The compute resource receives the job and begins training. The compute resource uses information stored in key vault to access storage accounts to download training files and upload output.

:::image type="content" source="./media/how-to-network-security-overview/secure-training-job-submission.svg" alt-text="Diagram showing the secure training job submission workflow.":::
### Limitations

- Azure Compute Instance and Azure Compute Clusters must be in the same VNet, region, and subscription as the workspace and its associated resources. 

## Secure the inferencing environment

:::moniker range="azureml-api-2"
You can enable network isolation for managed online endpoints to secure the following network traffic:

* Inbound scoring requests.
* Outbound communication with the workspace, Azure Container Registry, and Azure Blob Storage.

For more information, see [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md).
:::moniker-end
:::moniker range="azureml-api-1"
In this section, you learn the options available for securing an inferencing environment when using the Azure CLI extension for ML v1 or the Azure Machine Learning Python SDK v1. When doing a v1 deployment, we recommend that you use Azure Kubernetes Services (AKS) clusters for high-scale, production deployments.

You have two options for AKS clusters in a virtual network:

- Deploy or attach a default AKS cluster to your VNet.
- Attach a private AKS cluster to your VNet.

**Default AKS clusters** have a control plane with public IP addresses. You can add a default AKS cluster to your VNet during the deployment or attach a cluster after it's created.

**Private AKS clusters** have a control plane, which can only be accessed through private IPs. Private AKS clusters must be attached after the cluster is created. 

For detailed instructions on how to add default and private clusters, see [Secure an inferencing environment](./v1/how-to-secure-inferencing-vnet.md). 

Regardless default AKS cluster or private AKS cluster used, if your AKS cluster is behind of VNET, your workspace and its associate resources (storage, key vault, and ACR) must have private endpoints or service endpoints in the same VNET as the AKS cluster.

The following network diagram shows a secured Azure Machine Learning workspace with a private AKS cluster attached to the virtual network.

:::image type="content" source="./media/how-to-network-security-overview/secure-inferencing-environment.svg" alt-text="Diagram showing an attached private AKS cluster.":::
:::moniker-end

## Optional: Enable public access

You can secure the workspace behind a VNet using a private endpoint and still allow access over the public internet. The initial configuration is the same as [securing the workspace and associated resources](#secure-the-workspace-and-associated-resources). 

After securing the workspace with a private endpoint, use the following steps to enable clients to develop remotely using either the SDK or Azure Machine Learning studio:

:::moniker range="azureml-api-2"
1. [Enable public access](how-to-configure-private-link.md#enable-public-access) to the workspace.
1. [Configure the Azure Storage firewall](../storage/common/storage-network-security.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#grant-access-from-an-internet-ip-range) to allow communication with the IP address of clients that connect over the public internet.
:::moniker-end
:::moniker range="azureml-api-1"
1. [Enable public access](./v1/how-to-configure-private-link.md#enable-public-access) to the workspace.
1. [Configure the Azure Storage firewall](../storage/common/storage-network-security.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#grant-access-from-an-internet-ip-range) to allow communication with the IP address of clients that connect over the public internet.
:::moniker-end


## Optional: enable studio functionality

If your storage is in a VNet, you must use extra configuration steps to enable full functionality in studio. By default, the following features are disabled:

* Preview data in the studio.
* Visualize data in the designer.
* Deploy a model in the designer.
* Submit an AutoML experiment.
* Start a labeling project.

To enable full studio functionality, see [Use Azure Machine Learning studio in a virtual network](how-to-enable-studio-virtual-network.md).

### Limitations

[ML-assisted data labeling](how-to-create-image-labeling-projects.md#use-ml-assisted-data-labeling) doesn't support a default storage account behind a virtual network. Instead, use a storage account other than the default for ML assisted data labeling. 

> [!TIP]
> As long as it is not the default storage account, the account used by data labeling can be secured behind the virtual network. 

## Configure firewall settings

Configure your firewall to control traffic between your Azure Machine Learning workspace resources and the public internet. While we recommend Azure Firewall, you can use other firewall products. 

For more information on firewall settings, see [Use workspace behind a Firewall](how-to-access-azureml-behind-firewall.md).

## Custom DNS

If you need to use a custom DNS solution for your virtual network, you must add host records for your workspace.

For more information on the required domain names and IP addresses, see [how to use a workspace with a custom DNS server](how-to-custom-dns.md).

## Microsoft Sentinel

Microsoft Sentinel is a security solution that can integrate with Azure Machine Learning. For example, using Jupyter notebooks provided through Azure Machine Learning. For more information, see [Use Jupyter notebooks to hunt for security threats](../sentinel/notebooks.md).

### Public access

Microsoft Sentinel can automatically create a workspace for you if you're OK with a public endpoint. In this configuration, the security operations center (SOC) analysts and system administrators connect to notebooks in your workspace through Sentinel.

For information on this process, see [Create an Azure Machine Learning workspace from Microsoft Sentinel](../sentinel/notebooks-hunt.md?tabs=public-endpoint#create-an-azure-ml-workspace-from-microsoft-sentinel)

:::image type="content" source="./media/how-to-network-security-overview/common-public-endpoint-deployment.svg" alt-text="Diagram showing Microsoft Sentinel public connection.":::

### Private endpoint

If you want to secure your workspace and associated resources in a VNet, you must create the Azure Machine Learning workspace first. You must also create a virtual machine 'jump box' in the same VNet as your workspace, and enable Azure Bastion connectivity to it. Similar to the public configuration, SOC analysts and administrators can connect using Microsoft Sentinel, but some operations must be performed using Azure Bastion to connect to the VM.

For more information on this configuration, see [Create an Azure Machine Learning workspace from Microsoft Sentinel](../sentinel/notebooks-hunt.md?tabs=private-endpoint#create-an-azure-ml-workspace-from-microsoft-sentinel)

:::image type="content" source="./media/how-to-network-security-overview/private-endpoint-deploy-bastion.svg" alt-text="Daigram showing Microsoft Sentinel connection through a VNet.":::

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

:::moniker range="azureml-api-2"
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure machine learning registries](how-to-registry-network-isolation.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)
* [API platform network isolation](how-to-configure-network-isolation-with-v2.md)
:::moniker-end
:::moniker range="azureml-api-1"
* [Secure the workspace resources](./v1/how-to-secure-workspace-vnet.md)
* [Secure the training environment](./v1/how-to-secure-training-vnet.md)
* [Secure the inference environment](./v1/how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)
* [Use a firewall](how-to-access-azureml-behind-firewall.md)
:::moniker-end
