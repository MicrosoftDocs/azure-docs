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
ms.reviewer: larryfr
ms.custom: devplatv2
---

# Network isolation in batch endpoints

When deploying a machine learning model to a batch endpoint, you can secure the communication with using private networks. This article explains the requirements to use batch endpoint in an environment secured by private networks.

## Prerequisites

* A secure Azure Machine Learning workspace. For more details about how to achieve it read [Create a secure workspace](../tutorial-create-secure-workspace).
* Ensure blob, file, queue, and table private endpoints are configured for the storage accounts as explained at [Secure Azure storage accounts](../how-to-secure-workspace-vnet?tabs=pe%2Ccli#secure-azure-storage-accounts). Batch deployments requires all the 4 to properly work.

## Securing batch endpoints

All the batch endpoints created inside of secure workspace are deployed as private batch endpoints by default. Not further configuration is required.

> [!IMPORTANT]
> When working on a private link-enabled workspaces, batch endpoints can be created and managed using Azure Machine Learning studio. However, they can't be invoked from the UI in studio. Please use the Azure ML CLI v2 instead for job creation. For more details about how to use it see [Invoke the batch endpoint to start a batch scoring job](../how-to-use-batch-endpoint.md#invoke-the-batch-endpoint-to-start-a-batch-scoring-job).

The following diagram shows how the networking looks like for batch endpoints:

:::image type="content" source="./media/how-to-secure-batch-endpoint/batch-vnet-peering.png" alt-text="Diagram that shows the high level architecture of a secure Azure Machine Learning workspace deployment.":::

## Securing batch deployment jobs

Azure Machine Learning batch deployments run on compute clusters. To secure batch deployment jobs, those compute clusters have to be deployed in a virtual network too.

1. Create an Azure Machine Learning [computer cluster in the virtual network](../how-to-secure-training-vnet#compute-cluster).
1. If your compute instance uses a public IP address, you must [Allow inbound communication](../how-to-secure-training-vnet.md#required-public-internet-access) so that management services can submit jobs to your compute resources.
    
    > [!TIP]
    > Compute cluster and compute instance can be created with or without a public IP address. If created with a public IP address, you get a load balancer with a public IP to accept the inbound access from Azure batch service and Azure Machine Learning service. You need to configure User Defined Routing (UDR) if you use a firewall. If created without a public IP, you get a private link service to accept the inbound access from Azure batch service and Azure Machine Learning service without a public IP.

1. Extra NSG may be required depending on your case. Please see [Limitations for Azure Machine Learning compute cluster](../how-to-secure-training-vnet.md#azure-machine-learning-compute-clusterinstance-1)

For more details about how to configure compute clusters networking read [Secure an Azure Machine Learning training environment with virtual networks](../how-to-secure-training-vnet.md?#azure-machine-learning-compute-clusterinstance-1)

## Using two-networks architecture

There are cases where the input data is not in the same network as in the Azure Machine Learning resources. In those cases, your Azure Machine Learning workspace may need to interact with more than one VNet. You can achieve this configuration by adding an extra set of private endpoints to the VNet where the rest of the resources are located.

The following diagram shows the high level design:

:::image type="content" source="./media/how-to-secure-batch-endpoint/batch-vnet-two-networks.png" alt-text="Diagram that shows the high level architecture of an Azure Machine Learning workspace interacting with two networks.":::

### Considerations

Have the following considerations when using such architecture:

* Put the second set of private endpoints in a different resource group and hence in different private DNS zones. This prevents a name resolution conflict between the set of IPs used for the workload and the ones used by the client VNets.
* For your storage accounts, add 4 private endpoints in each VNet for blob, file, queue, and table as explained at [Secure Azure storage accounts](../how-to-secure-workspace-vnet?tabs=pe%2Ccli#secure-azure-storage-accounts).


## Recommended read

* [Secure Azure Machine Learning workspace resources using virtual networks (VNets)](../how-to-network-security-overview.md)