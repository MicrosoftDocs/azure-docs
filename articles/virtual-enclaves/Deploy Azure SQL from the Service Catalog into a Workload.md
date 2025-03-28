---
title: Deploy Azure SQL from the Service Catalog into a Workload
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Deploy a Service Catalog Template into a Workload

In this article, you:

- Deploy a Service Catalog template for Azure SQL into an existing Workload from the Portal.

>Note
>
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This article assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Concepts and best practices of Azure Virtual Enclaves](/docs/concepts/Concepts-and-best-practices).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](/docs/overview/what%20is%20a%20community), [deployed Virtual Enclave](/docs/overview/what%20is%20an%20enclave), and [deployed Workload](/docs/overview/what%20is%20a%20workload) and permissions to create resources inside the workload.

## Prerequisites:

### Create CMK and identity:

There are guardrails in the enclaves to ensure the Azure SQL is using CMK encryption (customer-managed keys). This requires a key and identity to access the key to be accessible in the enclave. Note: These resources are not deployed with the enclave or workload.

1. An existing subnet to place a private endpoint into. 
    - The default enclave subnet intended for resources can be used (ex: `AzureVirtualEnclaveSubnet`).
2. A Key Vault that supports CMK and a key that can be leveraged for CMK encryption. [Setup CMK](docs/How%20To%20Guides/Set%2Dup-customer%2Dmanaged%2Dkey-\(CMK\)-encryption-within-an-enclave)
    - The enclave Key Vault in the `HostedResources` RG can be used.
    - Create a RSA (2048) key in the Key Vault.
3. A user identity with access to the CMK key.
    - [Create a user-assigned managed identity](/docs/How%20To%20Guides/Service%20Catalog/Create-User-Managed-Identity) in the enclave `HostedResources` RG.
    - Create an Access Policy in the Key Vault above for this identity with the following Key Permissions: `Unwrap Key, Wrap Key, Recover, Get`

### Identify Administrator User 

1. The Administrators tab requires login info. Here is an example of some input: 
    - Entra User Login: 'core-enclave-admins'
    - Entra User SID: 'c0a11793-2fa9-4d7f-894f-0f7f72615a97'
    - Entra User Tenant ID: 'af783a57-4134-41d8-bea4-fdaaecef6bcc'
    - Entra User Principal Type: 'Group'

## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select "Add an Azure Service" button.
3. Select the "Azure SQL" service template from the [Service Catalog](/docs/How%20To%20Guides/Service%20Catalog) of templates (the dropdown list).
4. Click through the tabs and enter all the required parameters.
5. Adjust any of the prepopulated parameters as needed.
5. Select Review + Add then Add.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
1. Go to the specified Resource Group to confirm the intended resources were created. 

### Testing the Azure SQL instance
[WIP]
