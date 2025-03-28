---
title: Deploy Azure Container Registry (ACR) from the Service Catalog into a Workload
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Quickstart: Deploy a Service Catalog Template into a Workload

Azure Virtual Enclaves (AVE) is a cloud networking service that provides organizations with highly sensitive data the ability to quickly deploy and manage workloads across Commercial and air-gapped Azure clouds at scale. In this quickstart, you:

- Deploy a Service Catalog template for a RemoteApplication into an existing Workload from the Portal.

>Note
>
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.

## WARNING

- If you plan on using this template in conjunction with the [AKS Template](/docs/How%20To%20Guides/Service%20Catalog/Deploy-Azure-Kubernetes-Service-\(AKS\)-from-the-Service-Catalog-into-a-Workload) in the same enclave, perform the AKS Templates pre-requisite steps prior to deploying this as it will have you delete and recreate the enclave's subnets.

## Before you begin

- This quickstart assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Concepts and best practices of Azure Virtual Enclaves](/docs/concepts/Concepts-and-best-practices).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](/docs/overview/what%20is%20a%20community), [deployed Virtual Enclave](/docs/overview/what%20is%20an%20enclave), and [deployed Workload](/docs/overview/what%20is%20a%20workload) and permissions to create resources inside the workload.

## Prerequisites

There are guardrails in the enclaves to ensure an Azure Container registry is using CMK encryption (customer-managed keys). This requires a key and identity to access the key to be accessible in the enclave. Note: These resources are not deployed with the enclave or workload.

1. An existing subnet to place a private endpoint into. 
    - The default enclave subnet intended for resources can be used (ex: `AzureVirtualEnclaveSubnet`).
2. A Key Vault that supports CMK and a key that can be leveraged for CMK encryption. [Setup CMK](docs/How%20To%20Guides/Set%2Dup-customer%2Dmanaged%2Dkey-\(CMK\)-encryption-within-an-enclave)
    - The enclave Key Vault in the `HostedResources` RG can be used.
    - Create a RSA (we recommend 4096 bits) key in the Key Vault.
3. A user identity with access to the CMK key.
    - [Create a user-assigned managed identity](/docs/How%20To%20Guides/Service%20Catalog/Create-User-Managed-Identity) in the enclave `HostedResources` RG.
    - Create an Access Policy in the Key Vault above for this identity with the following Key Permissions: `Unwrap Key, Wrap Key, Recover, Get`

## Deploy the template

1. Navigate to the workload for the intended deployment.
1. Select "Add Service" button.
1. Select the Azure Container Registry" service template from the [Catalog](/docs/How%20To%20Guides/Service%20Catalog) of templates (the dropdown list).

   ![image.png](/assets/image-dc8ca6bf-02c1-44de-ba0a-23aedf76699b.png)

1. Click through the tabs and enter all the required parameters.
   * Under the encryption tab you'll need to use the CMK Key and User Assigned Identity created in the pre-reqs.
1. Adjust any of the prepopulated parameters as needed.
1. Select Review + Add then Add.

It can take a few minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

![image.png](/assets/image-1c9788bc-3c8b-47cc-954c-0ce611c48fda.png)

## Validate the deployment

1. Go to the Workload's Resource Group to confirm the intended resources were created. Including: Container registry, Private endpoint, Network interface, privateDnsZoneGroups (hidden by default)

   ![image.png](/assets/image-10c58c02-2f1d-4524-96af-458073bd4fa2.png)

1. If the Remote App was published: hostpool, app group, and workspace.

## Delete the deployment

If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the Resource Group, the whole Resource Group can be deleted.

## Recommendations

- [Add tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources) to Service Catalog deployments to track important information for that resource such as:
-- Owner: <main POC>
-- Deployer: <yourName>
-- Purpose: <publish abc app to users>
-- Service Catalog Name: <RemoteApp>
-- Service Catalog Version: <version you deployed>
- Consider adding an [Azure Policy to enforce and inherit tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies)

## Next Steps

- Deploy any needed tools onto the management VM (examples: docker cli, azure powershell modules, ...)
- Read the [AKS Template](/docs/How%20To%20Guides/Service%20Catalog/Deploy-Azure-Kubernetes-Service-\(AKS\)-from-the-Service-Catalog-into-a-Workload) documentation to see if you would like to use it.
