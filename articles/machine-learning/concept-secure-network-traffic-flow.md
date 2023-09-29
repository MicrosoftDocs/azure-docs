---
title: Secure network traffic flow
titleSuffix: Azure Machine Learning
description: Learn how network traffic flows between components when your Azure Machine Learning workspace is in a secured virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 10/03/2022
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Network traffic flow when using a secured workspace

When your Azure Machine Learning workspace and associated resources are secured in an Azure Virtual Network, it changes the network traffic between resources. Without a virtual network, network traffic flows over the public internet or within an Azure data center. Once a virtual network (VNet) is introduced, you may also want to harden network security. For example, blocking inbound and outbound communications between the VNet and public internet. However, Azure Machine Learning requires access to some resources on the public internet. For example, Azure Resource Management is used for deployments and management operations.

This article lists the required traffic to/from the public internet. It also explains how network traffic flows between your client development environment and a secured Azure Machine Learning workspace in the following scenarios:

* Using Azure Machine Learning __studio__ to work with:

    * Your workspace
    * AutoML
    * Designer
    * Datasets and datastores

    > [!TIP]
    > Azure Machine Learning studio is a web-based UI that runs partially in your web browser, and makes calls to Azure services to perform tasks such as training a model, using designer, or viewing datasets. Some of these calls use a different communication flow than if you are using the SDK, CLI, REST API, or VS Code.

* Using Azure Machine Learning __studio__, __SDK__, __CLI__, or __REST API__ to work with:

    * Compute instances and clusters
    * Azure Kubernetes Service
    * Docker images managed by Azure Machine Learning

> [!TIP]
> If a scenario or task is not listed here, it should work the same with or without a secured workspace.

## Assumptions

This article assumes the following configuration:

* Azure Machine Learning workspace using a private endpoint to communicate with the VNet.
* The Azure Storage Account, Key Vault, and Container Registry used by the workspace also use a private endpoint to communicate with the VNet.
* A VPN gateway or Express Route is used by the client workstations to access the VNet.

## Inbound and outbound requirements


| __Scenario__ | __Required inbound__ | __Required outbound__ | __Additional configuration__ | 
| ----- | ----- | ----- | ----- |
| [Access workspace from studio](#scenario-access-workspace-from-studio) | NA | <ul><li>Azure Active Directory</li><li>Azure Front Door</li><li>Azure Machine Learning service</li></ul> | You may need to use a custom DNS server. For more information, see [Use your workspace with a custom DNS](how-to-custom-dns.md). | 
| [Use AutoML, designer, dataset, and datastore from studio](#scenario-use-automl-designer-dataset-and-datastore-from-studio) | NA | NA | <ul><li>Workspace service principal configuration</li><li>Allow access from trusted Azure services</li></ul>For more information, see [How to secure a workspace in  a virtual network](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts). | 
| [Use compute instance and compute cluster](#scenario-use-compute-instance-and-compute-cluster) | <ul><li>Azure Machine Learning service on port 44224</li><li>Azure Batch Management service on ports 29876-29877</li></ul> | <ul><li>Azure Active Directory</li><li>Azure Resource Manager</li><li>Azure Machine Learning service</li><li>Azure Storage Account</li><li>Azure Key Vault</li></ul> | If you use a firewall, create user-defined routes. For more information, see [Configure inbound and outbound traffic](how-to-access-azureml-behind-firewall.md). | 
| [Use Azure Kubernetes Service](#scenario-use-azure-kubernetes-service) | NA | For information on the outbound configuration for AKS, see [How to secure Kubernetes inference](how-to-secure-kubernetes-inferencing-environment.md). | | 
| [Use Docker images managed by Azure Machine Learning](#scenario-use-docker-images-managed-by-azure-machine-learning) | NA | <ul><li>Microsoft Container Registry</li><li>`viennaglobal.azurecr.io` global container registry</li></ul> | If the Azure Container Registry for your workspace is behind the VNet, configure the workspace to use a compute cluster to build images. For more information, see [How to secure a workspace in a virtual network](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr). | 

> [!IMPORTANT]
> Azure Machine Learning uses multiple storage accounts. Each stores different data, and has a different purpose:
>
> * __Your storage__: The Azure Storage Account(s) in your Azure subscription are used to store your data and artifacts such as models, training data, training logs, and Python scripts. For example, the _default_ storage account for your workspace is in your subscription. The Azure Machine Learning compute instance and compute clusters access __file__ and __blob__ data in this storage over ports 445 (SMB) and 443 (HTTPS).
> 
>    When using a __compute instance__ or __compute cluster__, your storage account is mounted as a __file share__ using the SMB protocol. The compute instance and cluster use this file share to store the data, models, Jupyter notebooks, datasets, etc. The compute instance and cluster use the private endpoint when accessing the storage account.
>
> * __Microsoft storage__: The Azure Machine Learning compute instance and compute clusters rely on Azure Batch, and access storage located in a Microsoft subscription. This storage is used only for the management of the compute instance/cluster. None of your data is stored here. The compute instance and compute cluster access the __blob__, __table__, and __queue__ data in this storage, using port 443 (HTTPS).
>
> Machine Learning also stores metadata in an Azure Cosmos DB instance. By default, this instance is hosted in a Microsoft subscription and managed by Microsoft. You can optionally use an Azure Cosmos DB instance in your Azure subscription. For more information, see [Data encryption with Azure Machine Learning](concept-data-encryption.md#azure-cosmos-db).

## Scenario: Access workspace from studio

> [!NOTE]
> The information in this section is specific to using the workspace from the Azure Machine Learning studio. If you use the Azure Machine Learning SDK, REST API, CLI, or Visual Studio Code, the information in this section does not apply to you.

When accessing your workspace from studio, the network traffic flows are as follows:

* To authenticate to resources, __Azure Active Directory__ is used.
* For management and deployment operations, __Azure Resource Manager__ is used.
* For Azure Machine Learning specific tasks, __Azure Machine Learning service__ is used
* For access to Azure Machine Learning studio (https://ml.azure.com), __Azure FrontDoor__ is used.
* For most storage operations, traffic flows through the private endpoint of the default storage for your workspace. Exceptions are discussed in the [Use AutoML, designer, dataset, and datastore](#scenario-use-automl-designer-dataset-and-datastore-from-studio) section.
* You also need to configure a DNS solution that allows you to resolve the names of the resources within the VNet. For more information, see [Use your workspace with a custom DNS](how-to-custom-dns.md).

:::image type="content" source="./media/concept-secure-network-traffic-flow/workspace-traffic-studio.png" alt-text="Diagram of network traffic between client and workspace when using studio":::

## Scenario: Use AutoML, designer, dataset, and datastore from studio

The following features of Azure Machine Learning studio use _data profiling_:

* Dataset: Explore the dataset from studio.
* Designer: Visualize module output data.
* AutoML: View a data preview/profile and choose a target column.
* Labeling

Data profiling depends on the Azure Machine Learning managed service being able to access the default Azure Storage Account for your workspace. The managed service _doesn't exist in your VNet_, so can't directly access the storage account in the VNet. Instead, the workspace uses a service principal to access storage.

> [!TIP]
> You can provide a service principal when creating the workspace. If you do not, one is created for you and will have the same name as your workspace.

To allow access to the storage account, configure the storage account to allow a __resource instance__ for your workspace or select the __Allow Azure services on the trusted services list to access this storage account__. This setting allows the managed service to access storage through the Azure data center network. 

Next, add the service principal for the workspace to the __Reader__ role to the private endpoint of the storage account. This role is used to verify the workspace and storage subnet information. If they're the same, access is allowed. Finally, the service principal also requires __Blob data contributor__ access to the storage account.

For more information, see the Azure Storage Account section of [How to secure a workspace in a virtual network](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts).

:::image type="content" source="./media/concept-secure-network-traffic-flow/storage-traffic-studio.png" alt-text="Diagram of traffic between client, data profiling, and storage":::

## Scenario: Use compute instance and compute cluster

Azure Machine Learning compute instance and compute cluster are managed services hosted by Microsoft. They're built on top of the Azure Batch service. While they exist in a Microsoft managed environment, they're also injected into your VNet.

When you create a compute instance or compute cluster, the following resources are also created in your VNet:

* A Network Security Group with required outbound rules. These rules allow __inbound__ access from the Azure Machine Learning (TCP on port 44224) and Azure Batch service (TCP on ports 29876-29877).

    > [!IMPORTANT]
    > If you use a firewall to block internet access into the VNet, you must configure the firewall to allow this traffic. For example, with Azure Firewall you can create user-defined routes. For more information, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

* A load balancer with a public IP.

Also allow __outbound__ access to the following service tags. For each tag, replace `region` with the Azure region of your compute instance/cluster:

* `Storage.region` - This outbound access is used to connect to the Azure Storage Account inside the Azure Batch service-managed VNet.
* `Keyvault.region` - This outbound access is used to connect to the Azure Key Vault account inside the Azure Batch service-managed VNet.

Data access from your compute instance or cluster goes through the private endpoint of the Storage Account for your VNet.

If you use Visual Studio Code on a compute instance, you must allow other outbound traffic. For more information, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

:::image type="content" source="./media/concept-secure-network-traffic-flow/compute-instance-and-cluster.png" alt-text="Diagram of traffic flow when using compute instance or cluster":::

:::moniker range="azureml-api-2"
## Scenario: Use online endpoints

Security for inbound and outbound communication are configured separately for managed online endpoints.

#### Inbound communication

__Inbound__ communication with the scoring URL of the online endpoint can be secured using the `public_network_access` flag on the endpoint. Setting the flag to `disabled` ensures that the online endpoint receives traffic only from a client's virtual network through the Azure Machine Learning workspace's private endpoint.

The `public_network_access` flag of the Azure Machine Learning workspace also governs the visibility of the online endpoint. If this flag is `disabled`, then the scoring endpoints can only be accessed from virtual networks that contain a private endpoint for the workspace. If it is `enabled`, then the scoring endpoint can be accessed from the virtual network and public networks.

#### Outbound communication

__Outbound__ communication from a deployment can be secured at the workspace level by enabling managed virtual network isolation for your Azure Machine Learning workspace. Enabling this setting causes Azure Machine Learning to create a managed virtual network for the workspace. Any deployments in the workspace's managed virtual network can use the virtual network's private endpoints for outbound communication.

The [legacy network isolation method for securing outbound communication](concept-secure-online-endpoint.md#secure-outbound-access-with-legacy-network-isolation-method) worked by disabling a deployment's `egress_public_network_access` flag. We strongly recommend that you secure outbound communication for deployments by using a [workspace managed virtual network](concept-secure-online-endpoint.md) instead. Unlike the legacy approach, the `egress_public_network_access` flag for the deployment no longer applies when you use a workspace managed virtual network with your deployment. Instead, outbound communication will be controlled by the rules set for the workspace's managed virtual network.

:::moniker-end

## Scenario: Use Azure Kubernetes Service

For information on the outbound configuration required for Azure Kubernetes Service, see the connectivity requirements section of [How to secure inference](how-to-secure-inferencing-vnet.md).

> [!NOTE]
> The Azure Kubernetes Service load balancer is not the same as the load balancer created by Azure Machine Learning. If you want to host your model as a secured application, only available on the VNet, use the internal load balancer created by Azure Machine Learning. If you want to allow public access, use the public load balancer created by Azure Machine Learning.

If your model requires extra inbound or outbound connectivity, such as to an external data source, use a network security group or your firewall to allow the traffic.

## Scenario: Use Docker images managed by Azure Machine Learning

Azure Machine Learning provides Docker images that can be used to train models or perform inference. If you don't specify your own images, the ones provided by Azure Machine Learning are used. These images are hosted on the Microsoft Container Registry (MCR). They're also hosted on a geo-replicated Azure Container Registry named `viennaglobal.azurecr.io`.

If you provide your own docker images, such as on an Azure Container Registry that you provide, you don't need the outbound communication with MCR or `viennaglobal.azurecr.io`.

> [!TIP]
> If your Azure Container Registry is secured in the VNet, it cannot be used by Azure Machine Learning to build Docker images. Instead, you must designate an Azure Machine Learning compute cluster to build images. For more information, see [How to secure a workspace in a virtual network](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr).

:::image type="content" source="./media/concept-secure-network-traffic-flow/azure-machine-learning-docker-images.png" alt-text="Diagram of traffic flow when using provided Docker images":::
## Next steps

Now that you've learned how network traffic flows in a secured configuration, learn more about securing Azure Machine Learning in a virtual network by reading the [Virtual network isolation and privacy overview](how-to-network-security-overview.md) article.

For information on best practices, see the [Azure Machine Learning best practices for enterprise security](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-enterprise-security) article.
