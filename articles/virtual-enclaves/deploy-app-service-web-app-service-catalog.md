---
title: Deploy an App Service Web App from the Service Catalog into a Workload
description: Deploy an App Service Web App from the Service Catalog into a Workload
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: how-to
ms.date: 04/08/2025
---

# Deploy an App Service Web App from the Service Catalog into a Workload

In this article, you:

- Deploy a Service Catalog App Service Web App template into an existing Workload from the Portal.
- Review an architecture example for a [basic web application](https://learn.microsoft.com/azure/architecture/web-apps/app-service/architectures/basic-web-app?tabs=cli)

> [!NOTE]
> 
> This sample deployment is just for demonstration purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This article assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Concepts and best practices of Azure Virtual Enclaves](/docs/concepts/Concepts-and-best-practices).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](./what-community.md), [deployed Virtual Enclave](./what-enclave.md), and [deployed Workload](./what-workload.md) and permissions to create resources inside the workload.

## Prerequisites

There are guardrails in the enclaves to ensure an App Service is isolated with private endpoints. The App Service also requires a subnet delegation in the enclave virtual network to provide more control to the service. It is important to note that a private endpoint can't be created on a delegated subnet.

1. [Create new subnet](/docs/How-To-Guides/Service-Catalog/Create-New-Subnet-for-AVE-Enclave-Vnet) for App Service delegation. In the AVE product, the subnet management is under the customer's control as there is currently no deny assignments on the virtual network resource. In order to create a new subnet, the existing resource `AzureVirtualEnclaveSubnet` must be split up since it's utilizing the entire IP address space. Use the Create New Subnet instructions to modify the existing subnet as described below:
    - Delete subnet `AzureVirtualEnclaveSubnet 10.0.2.0/23 [10.0.2.0 - 10.0.3.255]`
    - Create new subnet `AzureVirtualEnclaveSubnet 10.0.2.0/26 [10.0.2.0 - 10.0.2.63]`
        - Add NSG rule set
        - Use this subnet for private endpoint resources
    - Create new subnet `AppServiceSubnet 10.0.2.64/26 [10.0.2.64 - 10.0.2.127]`
        - Add NSG rule set
        - Add subnet delegation `Microsoft.Web/serverFarms`
        - Use this subnet for App Service resources
    - Create new subnet `FunctionAppSubnet 10.0.2.128/26 [10.0.2.128 - 10.0.2.191]`
        - Add NSG rule set
        - Add subnet delegation `Microsoft.Web/serverFarms`
        - Use this subnet for Function App resources

2. Create Private DNS Zone for Azure Websites
    - Create a new Private DNS Zone resource in the enclave `HostedResources` resource group.
        - Commercial cloud: "privatelink.azurewebsites.us"
    -  Next go into the DNS zone and create a virtual network link to attach the enclave vnet.

## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select "Add Service" button.
3. Select the App service template from the [Catalog](/docs/How-To-Guides/Service-Catalog) of templates (the dropdown list).
4. Enter all the required parameters on each tab.
5. Adjust any of the prepopulated parameters as needed.
5. Select Review + Add then Add.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
1. Go to the specified Resource Group to confirm the intended resources were created. Including: App Service, App Service Plan, Private Endpoint, Network Interface

## Delete the deployment
If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the Resource Group, the whole Resource Group can be deleted.

## Recommendations
- [Add tags](https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources) to Service Catalog deployments to track important information for that resource such as:
-- Owner: `<main POC>`
-- Deployer: `<yourName>`
-- Purpose: `<publish abc app to users>`
-- Service Catalog Name: `<RemoteApp>`
-- Service Catalog Version: `<version you deployed>`
- Consider adding an [Azure Policy to enforce and inherit tags](https://learn.microsoft.com/azure/azure-resource-manager/management/tag-policies)
