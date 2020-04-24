---
title: Custom subdomains
titleSuffix: Azure Cognitive Services
description: Custom subdomain names for each Cognitive Service resource are created through the Azure portal, Azure Cloud Shell, or Azure CLI.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 07/24/2019
ms.author: erhopf
---

# Custom subdomain names for Cognitive Services

Azure Cognitive Services use custom subdomain names for each resource created through the [Azure portal](https://portal.azure.com), [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/), or [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). Unlike regional endpoints, which were common for all customers in a specific Azure region, custom subdomain names are unique to the resource. Custom subdomain names are required to enable features like Azure Active Directory (Azure AD) for authentication.

## How does this impact existing resources?

Cognitive Services resources created before July 1, 2019 will use the regional endpoints for the associated service. These endpoints will work with existing and new resources.

If you'd like to migrate an existing resource to leverage custom subdomain names, so that you can enable features like Azure AD, follow these instructions:

1. Sign in to the Azure portal and locate the Cognitive Services resource that you'd like to add a custom subdomain name to.
2. In the **Overview** blade, locate and select **Generate Custom Domain Name**.
3. This opens a panel with instructions to create a unique custom subdomain for your resource.
   > [!WARNING]
   > After you've created a custom subdomain name it **cannot** be changed.

## Do I need to update my existing resources?

No. The regional endpoint will continue to work for new and existing Cognitive Services and the custom subdomain name is optional. Even if a custom subdomain name is added the regional endpoint will continue to work with the resource.

## What if an SDK asks me for the region for a resource?

> [!WARNING]
> The Speech Services **do not** support custom subdomains at this time. Please use the regional endpoints when using the Speech Services and associated SDKs.

Regional endpoints and custom subdomain names are both supported and can be used interchangeably. However, the full endpoint is required.

Region information is available in the **Overview** blade for your resource in the [Azure portal](https://portal.azure.com). For the full list of regional endpoints, see [Is there a list of regional endpoints?](#is-there-a-list-of-regional-endpoints)

## Are custom subdomain names regional?

Yes. Using a custom subdomain name doesn't change any of the regional aspects of your Cognitive Services resource.

## What are the requirements for a custom subdomain name?

A custom subdomain name is unique to your resource. The name can only include alphanumeric characters and the `-` character; it must be between 2 and 64 characters in length and cannot end with a `-`.

## Can I change a custom domain name?

No. After a custom subdomain name is created and associated with a resource it cannot be changed.

## Can I reuse a custom domain name?

Each custom subdomain name is unique, so in order to reuse a custom subdomain name that you've assigned to a Cognitive Services resource, you'll need to delete the existing resource. After the resource has been deleted, you can reuse the custom subdomain name.

## Is there a list of regional endpoints?

Yes. This is a list of regional endpoints that you can use with Azure Cognitive Services resources.

> [!NOTE]
> The Translator service and Bing Search APIs use global endpoints.

| Endpoint type | Region | Endpoint |
|---------------|--------|----------|
| Public | Global (Translator & Bing) | `https://api.cognitive.microsoft.com` |
| | Australia East | `https://australiaeast.api.cognitive.microsoft.com` |
| | Brazil South | `https://brazilsouth.api.cognitive.microsoft.com` |
| | Canada Central | `https://canadacentral.api.cognitive.microsoft.com` |
| | Central US | `https://centralus.api.cognitive.microsoft.com` |
| | East Asia | `https://eastasia.api.cognitive.microsoft.com` |
| | East US | `https://eastus.api.cognitive.microsoft.com` |
| | East US 2 | `https://eastus2.api.cognitive.microsoft.com` |
| | France Central | `https://francecentral.api.cognitive.microsoft.com` |
| | India Central | `https://centralindia.api.cognitive.microsoft.com` |
| | Japan East | `https://japaneast.api.cognitive.microsoft.com` |
| | Korea Central | `https://koreacentral.api.cognitive.microsoft.com` |
| | North Central US | `https://northcentralus.api.cognitive.microsoft.com` |
| | North Europe | `https://northeurope.api.cognitive.microsoft.com` |
| | South Africa North | `https://southafricanorth.api.cognitive.microsoft.com` |
| | South Central US | `https://southcentralus.api.cognitive.microsoft.com` |
| | Southeast Asia | `https://southeastasia.api.cognitive.microsoft.com` |
| | UK South | `https://uksouth.api.cognitive.microsoft.com` |
| | West Central US | `https://westcentralus.api.cognitive.microsoft.com` |
| | West Europe | `https://westeurope.api.cognitive.microsoft.com` |
| | West US | `https://westus.api.cognitive.microsoft.com` |
| | West US 2 | `https://westus2.api.cognitive.microsoft.com` |
| US Gov | US Gov Virginia | `https://virginia.api.cognitive.microsoft.us` |
| China | China East 2 | `https://chinaeast2.api.cognitive.azure.cn` |
| | China North | `https://chinanorth.api.cognitive.azure.cn` |

## See also

* [What are the Cognitive Services?](Welcome.md)
* [Authentication](authentication.md)
