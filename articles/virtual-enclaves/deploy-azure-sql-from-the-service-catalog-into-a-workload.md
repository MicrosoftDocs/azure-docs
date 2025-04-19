---
title: Deploy Azure SQL from the Service Catalog into a Workload
description: Deploy Azure SQL from the Service Catalog into a Workload.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: how-to
ms.date: 04/08/2025
---

# Deploy Azure SQL from the Service Catalog into a Workload

In this article, you:

- Deploy a Service Catalog template for Azure SQL into an existing Workload from the Portal.

> [!NOTE]
> 
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This article assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Best practices of Azure Virtual Enclaves](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](./what-community.md), [deployed Virtual Enclave](./what-enclave.md), and [deployed Workload](./what-workload.md) and permissions to create resources inside the workload.

## Prerequisites

### Create CMK and identity:

There are guardrails in the enclaves to ensure the Azure SQL is using CMK encryption (customer-managed keys). This requires a key and identity to access the key to be accessible in the enclave.
> [!NOTE] These resources are not deployed with the enclave or workload.

1. An existing subnet to place a private endpoint into. 
    - The default enclave subnet intended for resources can be used (ex: `AzureVirtualEnclaveSubnet`).
2. A Key Vault that supports CMK and a key that can be leveraged for CMK encryption. [Setup CMK](./setup-customer-managed-key-encryption-within-an-enclave.md)
    - The enclave Key Vault in the `HostedResources` RG can be used.
    - Create a RSA (2048) key in the Key Vault.
3. A user identity with access to the CMK key.
    - [Create a user-assigned managed identity](./create-user-managed-identity.md) in the enclave `HostedResources` RG.
    - Create an Access Policy in the Key Vault above for this identity with the following Key Permissions: `Unwrap Key, Wrap Key, Recover, Get`

### Identify Administrator User 
The Administrators tab requires login info. Here is an example of some input: 
   - Entra User Login: `core-enclave-admins`
   - Entra User SID: `c0a11793-2fa9-4d7f-894f-0f7f72615a97`
   - Entra User Tenant ID: `af783a57-4134-41d8-bea4-fdaaecef6bcc`
   - Entra User Principal Type: `Group`

## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select "Add an Azure Service" button.
3. Select the "Azure SQL" service template from the [Service Catalog](./what-is-the-service-catalog.md) of templates (the dropdown list).
4. Select through the tabs and enter all the required parameters.
5. Adjust any of the prepopulated parameters as needed.
5. Select Review + Add then Add.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
1. Go to the specified Resource Group to confirm the intended resources were created. 

### Testing the Azure SQL instance
[WIP]
