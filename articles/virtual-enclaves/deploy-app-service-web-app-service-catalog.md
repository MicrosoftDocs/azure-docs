---
title: Deploy an App Service Web App from the service catalog into a workload
description: Deploy an App Service Web App from the service catalog into a workload.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: how-to
ms.date: 04/08/2025
---

# Deploy an App Service Web App from the service catalog into a workload

In this article, you:

- Deploy a service catalog App Service Web App template into an existing workload from the Azure portal.
- Review an architecture example for a [basic web application](/azure/architecture/web-apps/app-service/architectures/basic-web-app)

> [!NOTE]
> 
> This sample deployment is just for demonstration purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This article assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Best practices of Azure Virtual Enclaves](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed community](./what-community.md), [deployed enclave](./what-enclave.md), and [deployed workload](./what-workload.md) and permissions to create resources inside the workload.

## Prerequisites

There are guardrails in the enclaves to ensure an App Service is isolated with private endpoints. The App Service also requires a subnet delegation in the enclave virtual network to provide more control to the service. 

> [!IMPORTANT]
> 
> A private endpoint can't be created on a [delegated subnet](../virtual-network/subnet-delegation-overview.md) and subnets can't be deleted with resources (like a virtual machine) attached or using that subnet.

1. Subnet setup and creation:  Create the App Service subnets with subnet delegation. You had the option to create subnets during enclave creation or you can [create new subnets](./create-new-enclave-subnet.md) after enclave creation. Create these subnets:
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

2. Create Private DNS Zone for Azure Websites: Create a new Private DNS Zone resource (for example `privatelink.azurewebsites.net`) in the enclave `HostedResources` resource group (for example `your-enclave-name-HostedResources-...`).
3. Next go into the DNS zone and create a virtual network link to attach the enclave virtual network found in the enclave `HostedResources` resource group.

## Deploy the template
1. Navigate to the [workload](./what-workload.md) for the intended deployment.
2. Select `+Add Azure Service` button.
3. Select the `App Service` service service template from the [service catalog list](./list-service-catalog-templates.md) dropdown, confirm the version you need (default: `latest`), and select `Next`.

![Screenshot showing the App Service template selected from the service catalog list.](./media/service-catalog-list-app-service.png)

4. Enter all the required parameters on each page.
5. Adjust any of the prepopulated parameters as needed.
5. Select `Review + Add` then `Create`.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to be successfully completed before you take any actions within your deployed resources.

## Validate the deployment
Go to the specified resource group to confirm the intended resources were created. Including: App Service, App Service Plan, Private Endpoint, Network Interface

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
