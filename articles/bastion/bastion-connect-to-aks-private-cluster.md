---
title: 'Connect to AKS Private Cluster Using Azure Bastion (Preview)'
titleSuffix: Azure Bastion
description: Learn how to securely connect to Azure Kubernetes Service (AKS) private clusters using Azure Bastion's native client tunneling. Step-by-step guide with prerequisites and commands to establish secure access without exposing endpoints.
author: abell
ms.service: azure-bastion
ms.topic: how-to
ms.date: 07/29/2025
ms.author: abell

# Customer intent: "As a cloud administrator, I want to establish a secure connection to an AKS private cluster using Azure Bastion, so that I can access my Kubernetes resources without exposing them to the public internet."
---

# Connect to AKS Private Cluster Using Azure Bastion (Preview)

This article shows you how to connect to Azure Kubernetes Service (AKS) private clusters securely using Azure Bastion's native client tunneling feature. You learn to establish secure connections to AKS private clusters in Azure virtual networks without exposing endpoints to the public internet, eliminating the need for additional client software or agents.

Azure Bastion provides secure connectivity to all resources in the virtual network in which it's provisioned. Using Azure Bastion protects your AKS clusters from exposing endpoints to the outside world, while still providing secure access. For more information, see [What is Azure Bastion?](bastion-overview.md) For more information about AKS private clusters, see [Create a private Azure Kubernetes Service cluster](/azure/aks/private-clusters).

## Prerequisites

Before you begin, verify that you've met the following criteria:


* A virtual network with the Bastion host already installed.

  * Make sure that you have set up an Azure Bastion host for the virtual network in which the AKS cluster is located. Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any AKS private cluster in the virtual network.
  * To set up an Azure Bastion host, see [Quickstart: Deploy Bastion with default settings](quickstart-host-portal.md).
  * The Bastion must be Standard or Premium SKU and have native client support enabled under configuration settings.

* An AKS cluster in the virtual network or any reachable virtual network.

## Required roles


* Reader role on the AKS cluster.
* Reader role on the Azure Bastion resource.
* Reader role on the virtual network of the target AKS cluster (if the Bastion deployment is in a peered virtual network).

## Additional requirements

* If you're using Bastion to connect to a public cluster with API server authorized IP ranges, you need to add the public IP address of the Bastion to the list of authorized IP ranges of your cluster.

## Connect

To connect to your AKS private cluster:

1. Sign in to your Azure account using `az login` via CLI. If you have more than one subscription, you can view them using `az account list` and select the subscription containing your Bastion resource using:

   ```pwsh
   az account set --subscription <subscription ID>
   ```

1. Retrieve credentials to your AKS private cluster:

   ```pwsh
   az aks get-credentials --admin --name <AKSClusterName> --resource-group <ResourceGroupName>
   ```

1. Open the tunnel to your target AKS Cluster with either of the following commands:

   ```pwsh
   az aks bastion --name <aksClusterName> --resource-group <aksClusterResourceGroup> --admin --bastion <bastionResourceId>
   ```

   Or:

   ```pwsh
   az network bastion tunnel --name <BastionName> --resource-group <ResourceGroupName> --target-resource-id <AKSClusterID> --resource-port 443 --port <LocalMachinePort>
   ```

1. If you're using the az network command, open a new command line to connect to the AKS cluster via the Bastion tunnel. Otherwise, you should be all set to interact with your AKS cluster.

   ```pwsh
   kubectl get pods --server=https://localhost:<LocalMachinePort>
   ```

## Next steps

Read the [Bastion FAQ](bastion-faq.md) for more connection information.
