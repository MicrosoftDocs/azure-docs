---
title: "Network isolation in batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to deploy Batch Endpoints in private networks with isolation.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande
ms.custom: devplatv2
---

# Network isolation in batch endpoints

You can secure batch endpoints communication using private networks. This article explains the requirements to use batch endpoint in an environment secured by private networks.

## Securing batch endpoints

Batch endpoints inherit the networking configuration from the workspace where they are deployed. All the batch endpoints created inside of private link-enabled workspace are deployed as private batch endpoints by default. When the workspace is correctly configured, no further configuration is required.

To verify that your workspace is correctly configured for batch endpoints to work with private networking , ensure the following:

1. You have configured your Azure Machine Learning workspace for private networking. For more details about how to achieve it read [Create a secure workspace](tutorial-create-secure-workspace.md).

2. For Azure Container Registry in private networks, there are [some prerequisites about their configuration](how-to-secure-workspace-vnet.md#prerequisites).

    > [!WARNING]
    > Azure Container Registries with Quarantine feature enabled are not supported by the moment.

3. Ensure blob, file, queue, and table private endpoints are configured for the storage accounts as explained at [Secure Azure storage accounts](how-to-secure-workspace-vnet.md#secure-azure-storage-accounts). Batch deployments require all the 4 to properly work.

The following diagram shows how the networking looks like for batch endpoints when deployed in a private workspace:

:::image type="content" source="./media/how-to-secure-batch-endpoint/batch-vnet-peering.png" alt-text="Diagram that shows the high level architecture of a secure Azure Machine Learning workspace deployment.":::

> [!CAUTION]
> Batch Endpoints, as opposite to Online Endpoints, don't use Azure Machine Learning managed VNets. Hence, they don't support the keys `public_network_access` or `egress_public_network_access`. It is not possible to deploy public batch endpoints on private link-enabled workspaces.

## Securing batch deployment jobs

Azure Machine Learning batch deployments run on compute clusters. To secure batch deployment jobs, those compute clusters have to be deployed in a virtual network too.

1. Create an Azure Machine Learning [computer cluster in the virtual network](how-to-secure-training-vnet.md).

1. Ensure all related services have private endpoints configured in the network. Private endpoints are used for not only Azure Machine Learning workspace, but also its associated resources such as Azure Storage, Azure Key Vault, or Azure Container Registry. Azure Container Registry is a required service. While securing the Azure Machine Learning workspace with virtual networks, please note that there are [some prerequisites about Azure Container Registry](how-to-secure-workspace-vnet.md#prerequisites).

1. If your compute instance uses a public IP address, you must [Allow inbound communication](how-to-secure-training-vnet.md#compute-instancecluster-with-public-ip) so that management services can submit jobs to your compute resources.
    
    > [!TIP]
    > Compute cluster and compute instance can be created with or without a public IP address. If created with a public IP address, you get a load balancer with a public IP to accept the inbound access from Azure batch service and Azure Machine Learning service. You need to configure User Defined Routing (UDR) if you use a firewall. If created without a public IP, you get a private link service to accept the inbound access from Azure batch service and Azure Machine Learning service without a public IP.

1. Extra NSG may be required depending on your case. For more information, see [How to secure your training environment](how-to-secure-training-vnet.md).

For more information, see the [Secure an Azure Machine Learning training environment with virtual networks](how-to-secure-training-vnet.md) article.

## Limitations

Consider the following limitations when working on batch endpoints deployed regarding networking:

- If you change the networking configuration of the workspace from public to private, or from private to public, such doesn't affect existing batch endpoints networking configuration. Batch endpoints rely on the configuration of the workspace at the time of creation. You can recreate your endpoints if you want them to reflect changes you made in the workspace.

- When working on a private link-enabled workspace, batch endpoints can be created and managed using Azure Machine Learning studio. However, they can't be invoked from the UI in studio. Use the Azure Machine Learning CLI v2 instead for job creation. For more details about how to use it see [Run batch endpoint to start a batch scoring job](how-to-use-batch-endpoint.md#run-endpoint-and-configure-inputs-and-outputs).

## Recommended read

* [Secure Azure Machine Learning workspace resources using virtual networks (VNets)](how-to-network-security-overview.md)
