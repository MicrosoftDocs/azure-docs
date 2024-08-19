---
title: Relocate Azure Static Web Apps to another region
description: Learn how to relocate Azure Static Web Apps to another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 08/19/2024
ms.service: azure-static-web-apps
ms.topic: how-to
ms.custom:
  - subject-relocation
#Customer intent: As an Azure service administrator, I want to move my Azure Static Web Apps resources to another Azure region.
---

# Relocate Azure Static Web Apps to another region

This article describes how to relocate [Azure Static Web Apps](../static-web-apps/overview.md) resources to another Azure region. 

[!INCLUDE [relocate-reasons](./includes/service-relocation-reason-include.md)]



## Prerequisites

Review the following prerequisites before you prepare for the relocation.

- [Validate that Azure Static Web Apps is available in the target region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

- Make sure that you have permission to create Static Web App resources in the target region. 

- Find out if there any Azure Policy region restrictions applied to your organization.

- If using integrated API support provided by Azure Functions:
    - Determine the availability of Azure Functions in the target region.
    - Determine if Function API Keys are being used. For example, are you using Key Vault or do you deploy them as part of your application configuration files?
    - Determine the deployment model for API support in the target region: [Distributed managed functions](../static-web-apps/distributed-functions.md) or [Bring Your own functions](../static-web-apps/functions-bring-your-own.md). Understand the differences between the two models.

- Ensure that the Standard Hosting Plan is used to host the Static Web App. For more information about hosting plans, see [Azure Static Web Apps hosting plans](../static-web-apps/plans.md).

- Determine the permissible downtime for relocation.

- Depending on your Azure Static Web App deployment, the following dependent resources may need to be deployed and configured in the target region *prior* to relocation:
    
    - [Azure Functions](./relocation-functions.md).
    - [Azure Virtual Network](./relocation-virtual-network.md)
    - [Azure Front Door](//frontdoor/front-door-overview.md)
    - [Network Security Group](./relocation-virtual-network-nsg.md)
    - [Azure Private Link Service](./relocation-private-link.md)
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Storage Account](./relocation-storage-account.md)
    - [Azure Application Gateway](./relocation-app-gateway.md)


## Downtime

Downtime is affected by which deployment pattern you have implemented. If you have implemented a Warm standby pattern, downtime should be minimal. If it is a cold standby pattern, you'll need to expect some downtime during the relocation process.

## Prepare

**To prepare for Azure Static Web Apps deployed with private endpoints:**

- If your Static Web Apps are deployed with private endpoints, make sure to:

- Update host name for connection endpoint.
- Update host name on DNS private zone or custom DNS server (only applicable to Private Link).

For more information, see [Configure private endpoint in Azure Static Web Apps](../static-web-apps/private-endpoint.md).


**To prepare for all other deployments**

- If applicable, retrieve the new Function API keys from Azure Functions in the new region

- If the Azure Function has a dependency on a database, ensure that the DATABASE_CONNECTION_STRING is updated (This database may not be in scope of regional migration).

- Update the custom domain to point to the new hostname of the Azure Static Web App.

- If using Key Vault, provision new Key Vault in target region. Update the Function API Keys in Key Vault if applicable. Any other sensitive data not to be stored in code or config files should be stored in this Key Vault


### Export the template

In this section, you learn how to export a Resource Manager template. This template contains settings that describe your Static Web Site App:
    
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** and then select your Static Web Site App.
3. On the **Static Web Site App** page, select **Export template** in the **Automation** section on the left menu. 
4. Choose **Download** in the **Export template** page.

5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

    This zip file contains the .json files that include the template and scripts to deploy the template.
6. Make the necessary changes to the template, such as updating the location with target region.


## Relocate

The following steps show you how to relocate Azure Static Web Apps to another region.

1. If you are relocating with Private Endpoint, follow the guidelines in [Relocate Azure Private Link Service to another region](./relocation-private-link.md).

1. If you've provided an existing Azure Functions to Azure Static Web App, follow the relocation procedure for [Azure Functions](./relocation-functions.md).

1. Redeploy the Azure Static Web App using the [template that you exported and configured in the previous section](#export-the-template). 

    >[!IMPORTANT]
    >If you're not using a custom domain, your URL to access your application in the target region will change. In that scenario, you must ensure that your consumers are informed about the URL change.

1. If you're using an Integrated API, create a new Integrated API that's supported by Azure Functions.

1. Reconfigure your repository (GitHub or Azure DevOps) to deploy into the newly deployed Azure Static Web App in the target region. Initiate the deployment of the application using GitHub actions or Azure DevOps Pipelines.

1. With a Cold Standby deployment, inform clients about the new URL or, if you are using a custom DNS domain, simply change the DNS entry to point to the target region. With a Warm Standby deployment, a load balancer, such as Front Door or Traffic manager handle migration of the Static Web App in the source region to the Static Web App in the target region.


## Clean up



## Related content


