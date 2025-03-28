---
title: Deploy a Storage Account from the Service Catalog into a Workload
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



## Before you begin
- This quickstart assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Concepts and best practices of Azure Virtual Enclaves](/docs/Concepts/Concepts-and-best-practices).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](/docs/overview/what%20is%20a%20community), [deployed Virtual Enclave](/docs/overview/what%20is%20an%20enclave), and [deployed Workload](/docs/overview/what%20is%20a%20workload) and permissions to create resources inside the workload.


## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select "Add Service" button.
3. Select the Remote App service template from the [Catalog](/docs/How%20to%20Guides/Service%20Catalog) of templates (the dropdown list).
4. Click through the tabs and enter all the required parameters.
5. Adjust any of the prepopulated parameters as needed.
5. Select Review + Add then Add.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
Go to the specified Resource Group to confirm the intended resources were created including: 4 private endpoints and 1 storage account.


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
- [Deploy Additional Services](/docs/How%20to%20Guides/Service%20Catalog) from the Service Catalog
