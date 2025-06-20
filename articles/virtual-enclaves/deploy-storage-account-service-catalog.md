---
title: Deploy a Storage Account from the service catalog into a workload
description: Deploy a Storage Account from the service catalog into a workload
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: how-to
ms.date: 04/08/2025
---

# Deploy a Storage Account from the service catalog into a workload

In this article, you:

- Deploy a service catalog template for a Storage Account into an existing workload from the Portal.

> [!NOTE]
> 
> This sample deployment is just for demonstration purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This article assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Best practices of Azure Virtual Enclaves](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed community](./what-community.md), [deployed enclave](./what-enclave.md), and [deployed workload](./what-workload.md) and permissions to create resources inside the workload.

## Prerequisites

There are guardrails in the enclaves to ensure a storage account is using CMK encryption (customer-managed keys). This requires a key vault key and managed identity with access to the key in the enclave. 
> [!NOTE]
> 
> These resources are not deployed with the enclave or workload by default. Required:

1. Subnet for Private Endpoints: You had the option to create subnets during enclave creation or you can [create new subnets](./create-new-enclave-subnet.md) after enclave creation.
2. A Key Vault that supports CMK and a key that can be leveraged for CMK encryption. Create a new CMK, if needed, using the [Common Deployment service catalog template](./deploy-common-dependencies-service-catalog.md) article to:
    - Create an RSA (2048 or greater) key.
    - Create a user managed identity with access to the CMK key.
    - Create an Access Policy in the Key Vault above for this identity with the following Key Permissions: `Unwrap Key, Wrap Key, Recover, Get`

## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select `+Add an Azure Service` button.
3. Select the `Storage Account` service service template from the [service catalog list](./list-service-catalog-templates.md) dropdown, confirm the version you need (default: `latest`), and select `Next`.

![Screenshot showing the Storage Account template selected from the service catalog list.](./media/service-catalog-list-storage-account.png)

4. Enter the required parameters on each tab
5. Adjust any of the prepopulated parameters as needed.
5. Select `Review + Add` then `Create`.

It can take up to 15+ minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
Go to the specified resource group to confirm the intended resources were created. Including: 4 private endpoints and 1 storage account.

## Delete the deployment
If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the resource group, the whole resource group can be deleted.

## Recommendations
- [Add tags](/azure/azure-resource-manager/management/tag-resources) to service catalog deployments to track important information for that resource such as:
  - Owner: `<main POC>`
  - Deployer: `<yourName>`
  - Purpose: `<publish abc app to users>`
  - Service Catalog Name: `<RemoteApp>`
  - Service Catalog Version: `<version you deployed>`
- Consider adding an [Azure Policy to enforce and inherit tags](../azure-resource-manager/management/tag-policies.md)
