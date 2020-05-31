---
title: Use an Azure Resource Manager template to deploy your service
titleSuffix: Azure Cognitive Search
description: You can quickly deploy an Azure Cognitive Search service instance using the Azure resource manager template.

manager: nitinme
author: tchristiani
ms.author: terrychr
ms.service: cognitive-search
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 03/20/2020
---

# Quickstart: Deploy Cognitive Search using a Resource Manager template

This article walks you through the process for using a Resource Manager template to deploy an Azure Cognitive Search resource in the Azure portal.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a Cognitive Search service

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-azure-search-create/).

:::code language="json"source="~/quickstart-templates/101-azure-search-create/azuredeploy.json" range="1-86" highlight="4-50,70-85":::

The Azure resource defined in this template:

- [Microsoft.Search/searchServices](https://docs.microsoft.com/azure/templates/Microsoft.Search/2015-08-19/searchServices): create an Azure Cognitive Search service

### Deploy the template

Select the following image to sign in to Azure and open a template. The template creates an Azure Cognitive Search resource.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fazure-quickstart-templates%2Fmaster%2F101-azure-search-create%2Fazuredeploy.json)

The portal displays a form that allows you to easily provide parameter values. Some parameters are pre-filled with the default values from the template. You will need to provide your subscription, resource group, location, and service name. If you want to use Cognitive Services in an [AI enrichment](https://docs.microsoft.com/azure/search/cognitive-search-concept-intro) pipeline, for example to analyze binary image files for text, choose a location that offers both Cognitive Search and Cognitive Services. Both services are required to be in the same region for AI enrichment workloads. Once you have completed the form, you will need to agree to the terms and conditions and then select the purchase button to complete your deployment.

> [!div class="mx-imgBorder"]
> ![Azure portal display of template](./media/search-get-started-arm/arm-portalscrnsht.png)

## Review deployed resources

When your deployment is complete you can access your new resource group and new search service in the portal.

## Clean up resources

Other Cognitive Search quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave this resource in place. When no longer needed, you can delete the resource group, which deletes the Cognitive Search service and related resources.

## Next steps

In this quickstart, you created a Cognitive Search service using an Azure Resource Manager template, and validated the deployment. To learn more about Cognitive Search and Azure Resource Manager, continue on to the articles below.

 - Read an [overview of Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-what-is-azure-search)
 - [Create an index](https://docs.microsoft.com/azure/search/search-get-started-portal) for your search service
 - [Create a search app](https://docs.microsoft.com/azure/search/search-create-app-portal) using the portal wizard
 - [Create a skillset](https://docs.microsoft.com/azure/search/cognitive-search-quickstart-blob) to extract information from your data


