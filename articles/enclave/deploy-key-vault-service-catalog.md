---
title: Deploy a Key Vault from the service catalog into a workload
titleSuffix: Azure Enclave
description: Deploy a Key Vault from the service catalog into a workload
author: aserfass-msft
ms.author: aserfass
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 09/22/2026
---

# Deploy a Key Vault from the service catalog into a workload

In this article, you learn how to:

- Deploy a service catalog template for a Key Vault into an existing workload from the Azure portal.

> [!NOTE]
> 
> This sample deployment is just for demonstration purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This article assumes a basic understanding of networking and Azure Enclave concepts. For more information, see [Best practices of Azure Enclave](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- You need a [community](./what-community.md), [enclave](./what-enclave.md), [workload](./what-workload.md), and at least one [workload resource group](./what-workload.md#workload-resource-group), with permissions to create resources in the workload resource group.

- Configure [maintenance mode](./maintenance-mode.md) for your enclave and include the deploying principal in the maintenance mode configuration. The required mode and justification depend on your deployment configuration.

## Prerequisites
Before you deploy, identify an existing subnet for the private endpoint and make sure the required private DNS zone exists in the appropriate DNS-zone resource group. You also need permissions to use the existing virtual network, subnet, and private DNS zone.

1. Create or identify a subnet for the private endpoint. You can use a subnet created during enclave creation or [create a new subnet](./create-new-enclave-subnet.md). The private endpoint subnet must not have [subnet delegation](/azure/virtual-network/subnet-delegation-overview).
1. Create or identify the `privatelink.vaultcore.azure.net` private DNS zone in the specified DNS-zone resource group. The Key Vault template creates a private DNS zone group that links the private endpoint to this existing zone; it doesn't create the zone. For more information, see the [Private DNS Zones service catalog template](./deploy-private-dns-zones-service-catalog.md).

## Deploy the template
1. Go to the workload where you want to deploy the Key Vault.
1. Select the `+Add an Azure Service` button.
1. Select the `Key Vault` service template from the [service catalog list](./list-service-catalog-templates.md) dropdown list, confirm the version you need, and select `Next`.

    ![Screenshot showing the Key Vault template selected from the service catalog list.](./media/service-catalog-list-key-vault.png)

1. Enter all required parameters on each tab.
1. Adjust the prepopulated parameters as needed.
1. Select `Review + Create`, and then select `Create`.

Deployment time depends on the resources and configuration. Wait for the deployment to complete successfully before using the deployed resources.

## Validate the deployment
Go to the specified resource group and confirm that the deployment created a Key Vault, or Managed HSM when `enableHsm` is enabled, and a private endpoint.

## Delete the deployment
If you don't plan on keeping these resources, delete the Key Vault or Managed HSM and private endpoint to avoid Azure charges. Before deleting a resource group, confirm that it doesn't contain resources used by other deployments, including shared subnets, private DNS zones, managed identities, or keys.

## Recommendations
- [Add tags](/azure/azure-resource-manager/management/tag-resources) to service catalog deployments to track important information for that resource such as:
  - Owner: `<main POC>`
  - Deployer: `<yourName>`
  - Purpose: `<shared secrets>`
  - Service Catalog Name: `<Key Vault>`
  - Service Catalog Version: `<version you deployed>`
- Consider adding an [Azure Policy to enforce and inherit tags](/azure/azure-resource-manager/management/tag-policies).
