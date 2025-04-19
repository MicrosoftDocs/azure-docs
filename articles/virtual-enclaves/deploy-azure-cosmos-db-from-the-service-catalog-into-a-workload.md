---
title: Deploy Azure Cosmos DB from the Service Catalog into a Workload
description: Deploy Azure Cosmos DB from the Service Catalog into a Workload
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: how-to
ms.date: 04/08/2025
---

# Deploy Azure Cosmos DB from the Service Catalog into a Workload

Azure Virtual Enclaves (AVE) is a cloud networking service that provides organizations with highly sensitive data the ability to quickly deploy and manage workloads across Commercial and air-gapped Azure clouds at scale. In this quickstart, you:

- Deploy a Service Catalog template for a Azure Cosmos DB account into an existing Workload from the Portal.

> [!NOTE]
> 
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.



## Before you begin
- This quickstart assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Best practices of Azure Virtual Enclaves](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](./what-community.md), [deployed Virtual Enclave](./what-enclave.md), and [deployed Workload](./what-workload.md) and permissions to create resources inside the workload.

## Prerequisites

There are guardrails in the enclaves to ensure a service bus is using CMK encryption (customer-managed keys). This requires a key and identity to access the key to be accessible from the storage account in the enclave.
> [!NOTE] These resources are not deployed with the enclave or workload.

1. An existing subnet to place a private endpoint into. 
    - The default enclave subnet intended for resources can be used (ex: `AzureVirtualEnclaveSubnet`).
2. A Key Vault that supports CMK and a key that can be leveraged for CMK encryption. [Setup CMK](./setup-customer-managed-key-encryption-within-an-enclave.md)
    - The enclave Key Vault in the `HostedResources` RG can be used.
    - Create a RSA (2048) key in the Key Vault.
3. A user identity with access to the CMK key.
    - [Create a user-assigned managed identity](./create-user-managed-identity.md) in the enclave `HostedResources` RG.
    - Create an Access Policy in the Key Vault above for this identity with the following Key Permissions: `Unwrap Key, Wrap Key, Recover, Get`
4. Create Private DNS Zone for Azure Cosmos db.
    - Create a new Private DNS Zone resource in the enclave HostedResources resource group.
      - Commercial cloud: "privatelink.cosmos.azure.com"
    - Next go into the DNS zone and create a virtual network link to attach the enclave vnet.

## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select "Add Service" button.
3. Select the Azure Cosmos DB service template from the [Catalog](./list-of-service-catalog-templates.md) of templates (the dropdown list).
4. Select through the tabs and enter all the required parameters.
5. Adjust any of the prepopulated parameters as needed.
5. Select Review + Add then Add.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
1. Go to the specified Resource Group to confirm the resources were created: an Azure Cosmos DB account and a private endpoint.
2. Verify that the Azure Cosmos DB account was created and it its status is `Online`.
3. Check that the Azure Cosmos DB account `identity` is using the user assigned Managed Identity mentioned in prerequisites section.
4. Check that Azure Cosmos DB account encryption is using the key mentioned in prerequisites section.


## Delete the deployment
If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the Resource Group, the whole Resource Group can be deleted.

## Recommendations
- [Add tags](../azure-resource-manager/management/tag-resources.md) to Service Catalog deployments to track important information for that resource such as:   
-- Owner: `<main POC>`
-- Deployer: `<yourName>`
-- Purpose: `<cosmos db account purpose>`
-- Service Catalog Name: `<AzureCosmosDB>`
-- Service Catalog Version: `<version you deployed>`
- Consider adding an [Azure Policy to enforce and inherit tags](../azure-resource-manager/management/tag-policies.md)
