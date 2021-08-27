---
title: Secure network traffic flow
titleSuffix: Azure Machine Learning
description: Learn how network traffic flows between components when your Azure Machine Learning workspace is in a secured virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 08/18/2021
---

# blah

When your Azure Machine Learning workspace and associated resources are secured in an Azure Virtual Network, it changes the network traffic between resources. Without a virtual network, network traffic flows over the public internet or within an Azure data center. Once a virtual network (VNet) is introduced, you may also want to harden network security. For example, blocking inbound and outbound communications between the VNet and public internet. However, Azure Machine Learning requires access to some resources on the public internet. For example, Azure Resource Management is used for deployments and management operations.

This article lists the required traffic to/from the public internet. It also explains how network traffic flows between your client development environment and a secured Azure Machine Learning workspace. It covers the following scenarios commonly used with Azure Machine Learning:

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

This article assumes you are using the following configuration:

* Azure Machine Learning workspace using a private endpoint to communicate with the VNet.
* The Azure Storage Account, Key Vault, and Container Registry used by the workspace also use a private endpoint to communicate with the VNet.
* A VPN gateway or Express Route is used by the client workstations to access the VNet.

## Inbound and outbound requirements

TODO: Figure out how to represent the table in the limited width of a doc.

## Scenario: Access workspace from studio

> [!NOTE]
> The information in this section is specific to using the workspace from the Azure Machine Learning studio. If you use the Azure Machine Learning SDK, REST API, CLI, or Visual Studio Code, the information in this section does not apply to you.

When accessing your workspace from studio, the network traffic flows are as follows:

* To authenticate to resources, traffic must be able to reach __Azure Active Directory__.
* To perform management or deployment operations, traffic must be able to reach __Azure Resource Manager__.
* To perform Azure Machine Learning specific tasks, traffic must be able to reach the __Azure Machine Learning service__ and __Azure FrontDoor__.
* For most storage operations, traffic flows through the private endpoint of the default storage for your workspace. Exceptions are discussed in the [Use AutoML, designer, dataset, and datastore](#scenario-use-automl-designer-dataset-and-datastore-from-studio) section.
* You will also need to configure a DNS solution that allows you to resolve the names of the resources within the VNet. For more information, see [Use your workspace with a custom DNS](how-to-custom-dns.md).

:::image type="content" source="{source}" alt-text="Diagram of network traffic between client and workspace":::

## Scenario: Use AutoML, designer, dataset, and datastore from studio

The following features of Azure Machine Learning studio use _data profiling_:

* Dataset: Explore the dataset from studio.
* Designer: Visualize module output data.
* AutoML: View a data preview/profile and choose a target column.
* Labeling

Data profiling depends on the Azure Machine Learning managed service being able to access the default Azure Storage Account for your workspace. The Azure ML managed service _does not exist in your VNet_, so cannot directly access the storage account in the VNet. Instead, the workspace uses a service principal to access storage.

> [!TIP]
> You can provide a service principal when creating the workspace. If you do not, one is created for you and will have the same name as your workspace.

To allow access to the storage account, configure the storage account to __Allow Azure services on the trusted services list to access this storage account__. This setting allows the managed service to access storage through the Azure data center network. 

Next, add the service principal for the workspace to the __Reader__ role to the private endpoint of the storage account. This role is used to verify the workspace and storage subnet information. If they are the same, access is allowed. Finally, the service principal also requires __Blob data contributor__ access to the storage account.

For more information, see the Azure Storage Account section of [How to secure a workspace in a virtual network](how-to-secure-workspace-vnet.md#Secure-Azure-storage-accounts-with-service-endpoints).

:::image type="content" source="{source}" alt-text="Diagram of traffic between client, data profiling, and storage":::

## Scenario: Use compute instance and compute cluster

Azure Machine Learning compute instance and compute cluster are managed services hosted by Microsoft. They are built on top of the Azure Batch service. While they exist in a Microsoft managed environment, they are also injected into your VNet.

When you create a compute instance or compute cluster, the following resources are also created in your VNet:

* A Network Security Group with required outbound rules. These rules allow __inbound__ access from the Azure Machine Learning (TCP on port 44224) and Azure Batch service (TCP on ports 29876-29877).

    > [!IMPORTANT]
    > If you usee a firewall to block internet access into the VNet, you must configure the firewall to allow this traffic. For example, with Azure Firewall you can create user-defined routes. For more information, see [How to use Azure Machine Learning with a firewall](how-to-access-azureml-behind-firewall.md#inbound-configuration).

* A load balancer with a public IP.

You must also allow __outbound__ access to the `Storage.region` service tag (where `region` is the Azure region of your storage account). This outbound access is used to connect to the Azure Storage Account inside the Azure Batch service managed VNet.

Data access from your compute instance or cluster goes through the private endpoint of the Storage Account for your VNet.

If you use Visual Studio Code on a compute instance, you must allow additional outbound traffic. For more information, see [How to use Azure Machine Learning with a firewall](how-to-access-azureml-behind-firewall.md).

:::image type="content" source="{source}" alt-text="{alt-text}":::

## Scenario: Use Azure Kubernetes Service

For information on the outbound configuration required for Azure Kubernetes Service, see the connectivity requirements section of [How to deploy to Azure Kubnetes Service](how-to-deploy-azure-kubernetes-service.md#understand-connectivity-requirements-for-aks-inferencing-cluster).

> [!NOTE]
> The Azure Kubernetes Service load balancer is not the same as the load balancer created by Azure Machine Learning. If you want to host your model as a secured application, only available on the VNet, use the internal load balancer created by Azure Machine Learning. If you want to allow public access, use the public load balancer created by Azure Machine Learning.

If your model requires additional inbound or outbound connectivity, such as to an external data source, use a network security group or your firewall to allow the traffic.

## Scenario: Use Docker images managed by Azure ML

Azure Machine Learning provides Docker images that can be used to train models or perform inference. If you don't specify your own images, the ones provided by Azure Machine Learning are used. These images are hosted on the Microsoft Container Registry (MCR). They are also hosted on a geo-replicated Azure Container Registry named `viennaglobal.azurecr.io`.

If you provide your own docker images, such as on an Azure Container Registry that you provide, you do not need the outbound communication with MCR or `viennaglobal.azurecr.io`.

> [!TIP]
> If your Azure Container Registry is secured in the VNet, it cannot be used by Azure Machine Learning to build Docker images. Instead, you must designate an Azure Machine Learning compute cluster to build images. For more information, see [How to secure a workspace in a virtual network](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr).

## Next steps

