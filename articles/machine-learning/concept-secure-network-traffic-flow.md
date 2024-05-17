---
title: Secure network traffic flow
titleSuffix: Azure Machine Learning
description: Learn how network traffic flows between components when your Azure Machine Learning workspace is in a secured virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 01/16/2024
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Network traffic flow when using a secured workspace

When you put your Azure Machine Learning workspace and associated resources in an Azure virtual network, it changes the network traffic between resources. Without a virtual network, network traffic flows over the public internet or within an Azure datacenter. After you introduce a virtual network, you might also want to harden network security. For example, you might want to block inbound and outbound communications between the virtual network and the public internet. However, Azure Machine Learning requires access to some resources on the public internet. For example, it uses Azure Resource Manager for deployments and management operations.

This article lists the required traffic to and from the public internet. It also explains how network traffic flows between your client development environment and a secured Azure Machine Learning workspace in the following scenarios:

* Using Azure Machine Learning studio to work with:

  * Your workspace
  * AutoML
  * Designer
  * Datasets and datastores

  Azure Machine Learning studio is a web-based UI that runs partially in your web browser. It makes calls to Azure services to perform tasks such as training a model, using the designer, or viewing datasets. Some of these calls use a different communication flow than if you're using the Azure Machine Learning SDK, the Azure CLI, the REST API, or Visual Studio Code.

* Using Azure Machine Learning studio, the Azure Machine Learning SDK, the Azure CLI, or the REST API to work with:

  * Compute instances and clusters
  * Azure Kubernetes Service (AKS)
  * Docker images that Azure Machine Learning manages

If a scenario or task isn't listed here, it should work the same with or without a secured workspace.

## Assumptions

This article assumes the following configuration:

* The Azure Machine Learning workspace uses a private endpoint to communicate with the virtual network.
* The Azure storage account, key vault, and container registry that the workspace uses also use a private endpoint to communicate with the virtual network.
* Client workstations use a VPN gateway or Azure ExpressRoute to access the virtual network.

## Inbound and outbound requirements

| Scenario | Required inbound | Required outbound | Additional configuration |
| ----- | ----- | ----- | ----- |
| [Access a workspace from the studio](#scenario-access-a-workspace-from-the-studio) | Not applicable | <ul><li>Microsoft Entra ID</li><li>Azure Front Door</li><li>Azure Machine Learning</li></ul> | You might need to use a custom DNS server. For more information, see [Use your workspace with a custom DNS server](how-to-custom-dns.md). |
| [Use AutoML, the designer, the dataset, and the datastore from the studio](#scenario-use-automl-the-designer-the-dataset-and-the-datastore-from-the-studio) | Not applicable | Not applicable | <ul><li>Configure the workspace service principal</li><li>Allow access from trusted Azure services</li></ul>For more information, see [Secure an Azure Machine Learning workspace with virtual networks](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts). |
| [Use a compute instance and a compute cluster](#scenario-use-a-compute-instance-and-a-compute-cluster) | <ul><li>Azure Machine Learning on port 44224</li><li>Azure Batch on ports 29876-29877</li></ul> | <ul><li>Microsoft Entra ID</li><li>Azure Resource Manager</li><li>Azure Machine Learning</li><li>Azure Storage</li><li>Azure Key Vault</li></ul> | If you use a firewall, create user-defined routes. For more information, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md). |
| [Use Azure Kubernetes Service](#scenario-use-azure-kubernetes-service) | Not applicable | For information on the outbound configuration for AKS, see [Secure Azure Kubernetes Service inferencing environment](how-to-secure-kubernetes-inferencing-environment.md). | |
| [Use Docker images that Azure Machine Learning manages](#scenario-use-docker-images-that-azure-machine-learning-manages) | Not applicable | Microsoft Artifact Registry | If the container registry for your workspace is behind the virtual network, configure the workspace to use a compute cluster to build images. For more information, see [Secure an Azure Machine Learning workspace with virtual networks](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr). |

## Purposes of storage accounts

Azure Machine Learning uses multiple storage accounts. Each stores different data and has a different purpose:

* __Your storage__: The storage accounts in your Azure subscription store your data and artifacts, such as models, training data, training logs, and Python scripts. For example, the _default_ storage account for your workspace is in your subscription. The Azure Machine Learning compute instance and compute cluster access file and blob data in this storage over ports 445 (SMB) and 443 (HTTPS).

  When you're using a compute instance or compute cluster, your storage account is mounted as a file share via the SMB protocol. The compute instance and cluster use this file share to store items like the data, models, Jupyter notebooks, and datasets. The compute instance and cluster use the private endpoint when they access the storage account.

* __Microsoft storage__: The Azure Machine Learning compute instance and compute cluster rely on Azure Batch. They access storage located in a Microsoft subscription. This storage is used only for the management of the compute instance or cluster. None of your data is stored here. The compute instance and compute cluster access the blob, table, and queue data in this storage, by using port 443 (HTTPS).

Machine Learning also stores metadata in an Azure Cosmos DB instance. By default, this instance is hosted in a Microsoft subscription, and Microsoft manages it. You can optionally use an Azure Cosmos DB instance in your Azure subscription. For more information, see [Data encryption with Azure Machine Learning](concept-data-encryption.md#azure-cosmos-db).

## Scenario: Access a workspace from the studio

> [!NOTE]
> The information in this section is specific to using the workspace from Azure Machine Learning studio. If you use the Azure Machine Learning SDK, the REST API, the Azure CLI, or Visual Studio Code, the information in this section doesn't apply to you.

When you access your workspace from the studio, the network traffic flows are as follows:

* To authenticate to resources, the configuration uses Microsoft Entra ID.
* For management and deployment operations, the configuration uses Azure Resource Manager.
* For tasks that are specific to Azure Machine Learning, the configuration uses the Azure Machine Learning service.
* For access to [Azure Machine Learning studio](https://ml.azure.com), the configuration uses Azure Front Door.
* For most storage operations, traffic flows through the private endpoint of the default storage for your workspace. The [Use AutoML, the designer, the dataset, and the datastore from the studio](#scenario-use-automl-the-designer-the-dataset-and-the-datastore-from-the-studio) section of this article discusses exceptions.
* You also need to configure a DNS solution that allows you to resolve the names of the resources within the virtual network. For more information, see [Use your workspace with a custom DNS server](how-to-custom-dns.md).

:::image type="content" source="./media/concept-secure-network-traffic-flow/workspace-traffic-studio.png" alt-text="Diagram of network traffic between the client and the workspace when you use the studio.":::

## Scenario: Use AutoML, the designer, the dataset, and the datastore from the studio

The following features of Azure Machine Learning studio use _data profiling_:

* Dataset: Explore the dataset from the studio.
* Designer: Visualize module output data.
* AutoML: View a data preview or profile and choose a target column.
* Labeling: Use labels to prepare data for a machine learning project.

Data profiling depends on the ability of the Azure Machine Learning managed service to access the default Azure storage account for your workspace. The managed service _doesn't exist in your virtual network_, so it can't directly access the storage account in the virtual network. Instead, the workspace uses a service principal to access storage.

> [!TIP]
> You can provide a service principal when you're creating the workspace. If you don't, one is created for you and has the same name as your workspace.

To allow access to the storage account, configure the storage account to allow a resource instance for your workspace or select __Allow Azure services on the trusted services list to access this storage account__. This setting allows the managed service to access storage through the Azure datacenter network.

Next, add the service principal for the workspace to the __Reader__ role to the private endpoint of the storage account. Azure uses this role to verify the workspace and storage subnet information. If they're the same, Azure allows access. Finally, the service principal also requires __Blob data contributor__ access to the storage account.

For more information, see the "Secure Azure storage accounts" section of [Secure an Azure Machine Learning workspace with virtual networks](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts).

:::image type="content" source="./media/concept-secure-network-traffic-flow/storage-traffic-studio.png" alt-text="Diagram of traffic between the client, data profiling, and storage.":::

## Scenario: Use a compute instance and a compute cluster

An Azure Machine Learning compute instance and compute cluster are managed services that Microsoft hosts. They're built on top of the Azure Batch service. Although they exist in a Microsoft-managed environment, they're also injected into your virtual network.

When you create a compute instance or compute cluster, the following resources are also created in your virtual network:

* A network security group with required outbound rules. These rules allow _inbound_ access from Azure Machine Learning (TCP on port 44224) and Azure Batch (TCP on ports 29876-29877).

  > [!IMPORTANT]
  > If you use a firewall to block internet access into the virtual network, you must configure the firewall to allow this traffic. For example, with Azure Firewall, you can create user-defined routes. For more information, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

* A load balancer with a public IP address.

Also allow _outbound_ access to the following service tags. For each tag, replace `region` with the Azure region of your compute instance or cluster:

* `Storage.region`: This outbound access is used to connect to the Azure storage account inside the Azure Batch managed virtual network.
* `Keyvault.region`: This outbound access is used to connect to the Azure Key Vault account inside the Azure Batch managed virtual network.

Data access from your compute instance or cluster goes through the private endpoint of the storage account for your virtual network.

If you use Visual Studio Code on a compute instance, you must allow other outbound traffic. For more information, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

:::image type="content" source="./media/concept-secure-network-traffic-flow/compute-instance-and-cluster.png" alt-text="Diagram of traffic flow when you use a compute instance or cluster.":::

:::moniker range="azureml-api-2"

## Scenario: Use online endpoints

You configure security for inbound and outbound communication separately for managed online endpoints.

### Inbound communication

You can help secure inbound communication with the scoring URL of the online endpoint by using the `public_network_access` flag on the endpoint. Setting the flag to `disabled` ensures that the online endpoint receives traffic only from a client's virtual network through the Azure Machine Learning workspace's private endpoint.

The `public_network_access` flag of the Azure Machine Learning workspace also governs the visibility of the online endpoint. If this flag is `disabled`, the scoring endpoints can be accessed only from virtual networks that contain a private endpoint for the workspace. If this flag is `enabled`, the scoring endpoint can be accessed from the virtual network and public networks.

### Outbound communication

You can help secure outbound communication from a deployment at the workspace level by using managed virtual network isolation for your Azure Machine Learning workspace. Using this setting causes Azure Machine Learning to create a managed virtual network for the workspace. Any deployments in the workspace's managed virtual network can use the virtual network's private endpoints for outbound communication.

The [legacy network isolation method for securing outbound communication](concept-secure-online-endpoint.md#secure-outbound-access-with-legacy-network-isolation-method) worked by disabling a deployment's `egress_public_network_access` flag. We strongly recommend that you help secure outbound communication for deployments by using a [workspace managed virtual network](concept-secure-online-endpoint.md) instead. Unlike the legacy approach, the `egress_public_network_access` flag for the deployment no longer applies when you use a workspace managed virtual network with your deployment. Instead, the rules that you set for the workspace's managed virtual network control outbound communication.

:::moniker-end

## Scenario: Use Azure Kubernetes Service

For information on the required outbound configuration for Azure Kubernetes Service, see [Secure an Azure Machine Learning inferencing environment with virtual networks](how-to-secure-inferencing-vnet.md).

> [!NOTE]
> The Azure Kubernetes Service load balancer is not the same as the load balancer that Azure Machine Learning creates. If you want to host your model as a secured application that's available only on the virtual network, use the internal load balancer that Azure Machine Learning creates. If you want to allow public access, use the public load balancer that Azure Machine Learning creates.

If your model requires extra inbound or outbound connectivity, such as to an external data source, use a network security group or your firewall to allow the traffic.

## Scenario: Use Docker images that Azure Machine Learning manages

Azure Machine Learning provides Docker images that you can use to train models or perform inference. These images are hosted on Microsoft Artifact Registry.

If you provide your own Docker images, such as on a container registry that you provide, you don't need the outbound communication with Artifact Registry.

> [!TIP]
> If your container registry is secured in the virtual network, Azure Machine Learning can't use it to build Docker images. Instead, you must designate an Azure Machine Learning compute cluster to build images. For more information, see [Secure an Azure Machine Learning workspace with virtual networks](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr).

:::image type="content" source="./media/concept-secure-network-traffic-flow/azure-machine-learning-docker-images.png" alt-text="Diagram of traffic flow when you use provided Docker images.":::

## Next steps

Now that you've learned how network traffic flows in a secured configuration, learn more about securing Azure Machine Learning in a virtual network by reading the [overview article about virtual network isolation and privacy](how-to-network-security-overview.md).

For information on best practices, see the [Azure Machine Learning best practices for enterprise security](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-enterprise-security) article.
