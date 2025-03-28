---
title: 4. Create Azure resources from the service catalog in an AVE Workload
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Tutorial: Create Azure resources from the service catalog in an AVE Workload

The service catalog enables customers to deploy Azure services and streaming applications into AVE quickly while being compliant with Policy Guardrails and enclave isolation requirements.

In this tutorial, part four of eight, you create Azure resources using service catalog in workloads. You learn how to:

- ✅ Deploy a Service Catalog template for an Azure resource into an existing Workload from the Portal

> [!NOTE] The sample deployment below is just for demonstration purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin

- This tutorial assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Concepts and best practices of Azure Virtual Enclaves](/docs/concepts/Concepts-and-best-practices).
- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).
- A [deployed Community](/docs/overview/what%20is%20a%20community), [deployed Virtual Enclave](/docs/overview/what%20is%20an%20enclave), and [deployed Workload](/docs/overview/what%20is%20a%20workload) and permissions to create resources inside the workload.
- Complete the [prerequisites] for a App Service Web App (docs/How%20To%20Guides/Service%20Catalog/Deploy%20an%20App%20Service%20Web%20App%20from%20the%20Service%20Catalog%20into%20a%20Workload.md#prerequisites)

## Create Azure web app resources from the service catalog

1. Navigate to the 'wl-webapp-ui' Workload to create an Azure App Service for your webapp.
2. Select 'Add an Azure service' button on the overview blade.
3. Select 'App Service' from the Service Catalog drop down list and click 'Next'.
4. Enter all the required parameters on each tab.
5. For 'Web App Site Name' enter 'webapp-ui'
6. For 'App Service Sku Name' select an option from the drop down, 'P1v2' or the lowest option for this tutorial. See this table for a full list of options: https://azure.microsoft.com/en-us/pricing/details/app-service/linux/#pricing
7. For 'App Service Sku Tier' enter 'PremiumV2'.
8. For 'Number of Worker Instances' enter '2'.
9. Select 'Next' to confirm the networking information was prepopulated by the Service Catalog. Ensure the App Service subnet has a delegation to 'Microsoft.Web/serverfarms' and the private link subnet does not.
10. Select 'Review + Create' and then 'Create'.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to complete successfully before you take any actions within your deployed resources.

## Validate the deployment

1. Go to the specified Resource Group to confirm the intended resources were created.

## (Optional) Deploy Web App Quickstart
Azure App Service has quickstarts for many languages such as the [python quickstart](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-cli%2Cazure-cli-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli) or [deploy from a zip file](https://learn.microsoft.com/en-us/azure/app-service/deploy-zip?tabs=cli)

## Clean up resources

If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the Resource Group, the whole Resource Group can be deleted.

## Next steps

In this tutorial, you created Azure resources with service catalog using Azure Portal.

In the [next tutorial](/Virtual-Enclaves-Docs/Tutorials/5.-Create-Azure-resources-in-workloads), you'll learn how to create Azure resources in your enclave.

## Recommendations

- Review an architecture example for a [basic web application](https://learn.microsoft.com/en-us/azure/architecture/web-apps/app-service/architectures/basic-web-app?tabs=cli)
- [Add tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources) to Service Catalog deployments to track important information for that resource such as:
  - Owner: <main POC>
  - Deployer: <yourName>
  - Purpose: <publish abc app to users>
  - Service Catalog Name: <RemoteApp>
  - Service Catalog Version: <version you deployed>
- Consider adding an [Azure Policy to enforce and inherit tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies)
