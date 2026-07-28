---
title: Deploy Azure SQL from the service catalog into a workload
titleSuffix: Azure Enclave
description: Deploy Azure SQL from the service catalog into a workload.
author: aserfass-msft
ms.author: aserfass
ms.topic: how-to
ms.date: 6/16/2025
---

# Deploy Azure SQL from the service catalog into a workload

In this article, you:

- Deploy a service catalog template for Azure SQL into an existing workload from the Portal.

> [!NOTE]
> 
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This article assumes a basic understanding of networking and Azure Enclave concepts. For more information, see [Best practices of Azure Enclave](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- You need a [community](./what-community.md), [enclave](./what-enclave.md), [workload](./what-workload.md), and at least one [workload resource group](./what-workload.md#workload-resource-group) and permissions to create resources inside the workload resource group.

- Enable `Advanced` [maintenance mode](./maintenance-mode.md) for your enclave so you can add the Private Link resources to your enclave managed resource group.

## Prerequisites
There are guardrail requirements on the enclaves to ensure enclave resources are using Customer-Managed Keys (CMK) encryption. This requires a key and identity to access the key to be accessible in the enclave. Create the CMK (optional Key Vault) and Managed Identity in the [Common Dependencies service catalog template](./deploy-common-dependencies-service-catalog.md)

1. Subnet for Private Endpoints: You had the option to create subnets during enclave creation or you can [create new subnets](./create-new-enclave-subnet.md) after enclave creation.
1. Quickly create these [Private DNS Zones](./deploy-private-dns-zones-service-catalog.md) based on what you create next:
    - `Key Vault` required when creating a Key Vault from this template or the more customizable [Key Vault template](./deploy-key-vault-service-catalog.md).
    - `Storage File`, `Storage Queue`, `Storage Blob`, and `Storage Table` are required when making a Storage Account from this template or the more customizable [Storage Account template](./deploy-storage-account-service-catalog.md).
    - `Azure SQL` which is required to access Azure SQL privately.
1. A Key Vault, Customer Managed Key (CMK), and Managed Identity are required for this template. Create a Key Vault, CMK, and Managed Identity in the [Common Dependencies service catalog quickstart](./deploy-common-dependencies-service-catalog.md) or create your own.
    - These resources should be created inside a [workload resource group](./create-workload-portal.md#add-workload-resource-groups).
    - After creating the User Managed Identity, ensure it has access to the CMK key
        - Assign the `Key Vault Crypto Service Encryption User` RBAC role to the managed identity scoped to the key vault with [these instructions](./create-user-managed-identity.md#assign-role-to-managed-identity). This allows you to then assign the managed identity to another resource, like a Virtual Machine, and that Virtual Machine can encrypt the operating system disk with the CMK in the key vault without having permissions to do other operations on the key vault following least privilege.
1. The Administrators tab requires sign in info. Here's an example of some input: 
   - Microsoft Entra User sign in: `core-enclave-admins`
   - Microsoft Entra User SID: `c0a11793-2fa9-4d7f-894f-0f7f72615a97`
   - Microsoft Entra User Tenant ID: `af783a57-4134-41d8-bea4-fdaaecef6bcc`
   - Microsoft Entra User Principal Type: `Group`

## Deploy the template
1. Navigate to the workload for the intended deployment.
1. Select `+Add an Azure Service` button.
1. Select the `Azure SQL` service template from the [service catalog list](./list-service-catalog-templates.md) dropdown, confirm the version you need (default: `latest`), and select `Next`.

![Screenshot showing the Azure SQL template selected from the service catalog list.](./media/service-catalog-list-azure-sql.png)

1. Go through each tab and enter all the required parameters.
1. Adjust any of the prepopulated parameters as needed.
1. Select `Review + Create` then `Create`.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
Go to the specified resource group to confirm the intended resources were created.

## Delete the deployment
If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the resource group, the whole resource group can be deleted.

## Recommendations
- [Add tags](/azure/azure-resource-manager/management/tag-resources) to service catalog deployments to track important information for that resource such as:
  - Owner: `<main POC>`
  - Deployer: `<yourName>`
  - Purpose: `<prod SQL data>`
  - Service Catalog Name: `<Azure SQL>`
  - Service Catalog Version: `<version you deployed>`
- Consider adding an [Azure Policy to enforce and inherit tags](/azure/azure-resource-manager/management/tag-policies)
