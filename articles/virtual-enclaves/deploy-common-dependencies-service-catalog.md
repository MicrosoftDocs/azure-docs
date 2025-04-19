---
title: Deploy Common Dependencies from the Service Catalog into a Workload
description: Deploy Common Dependencies from the Service Catalog into a Workload
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: how-to
ms.date: 04/08/2025
---

# Deploy Common Dependencies from the Service Catalog into a Workload

Azure Virtual Enclaves (AVE) is a cloud networking service that provides organizations with highly sensitive data the ability to quickly deploy and manage workloads across Commercial and air-gapped Azure clouds at scale. In this quickstart, you:

- Deploy a Service Catalog template for Common Dependencies when deploying azure services into an existing Workload from the Portal. Optionally create the following:
1. Key Vault
1. Customer Managed Key (CMK) for encryption
1. Disk Encryption Set (DES) for VM disk encryption
1. Storage Account quickstart. See the Storage Account Service Catalog template for more deployment customization
1. Managed Identity to securely access your resources within Azure Virtual Enclaves

> [!NOTE]
>
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.



## Before you begin
- This quickstart assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Best practices of Azure Virtual Enclaves](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](./what-community.md), [deployed Enclave](./what-enclave.md), and [deployed Workload](./what-workload.md) and permissions to create resources inside the workload.


## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select "Add Service" button.
3. Select the Common Dependencies template from the [Catalog](./list-of-service-catalog-templates.md) of templates (the dropdown list).
4. Select through the tabs and enter all the required parameters.
5. Adjust any of the prepopulated parameters as needed.
5. Select Review + Add then Add.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
1. Go to the specified Resource Group to confirm the intended resources were created. Including: VM, OS Disk, NIC and
1. If the Remote App was published: hostpool, app group, and workspace.

## Delete the deployment
If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the Resource Group, the whole Resource Group can be deleted.

## Recommendations
- [Add tags](../azure-resource-manager/management/tag-resources.md) to Service Catalog deployments to track important information for that resource such as:
-- Owner: `<main POC>`
-- Deployer: `<yourName>`
-- Purpose: `<publish abc app to users>`
-- Service Catalog Name: `<RemoteApp>`
-- Service Catalog Version: `<version you deployed>`
- Consider adding an [Azure Policy to enforce and inherit tags](../azure-resource-manager/management/tag-policies.md)
