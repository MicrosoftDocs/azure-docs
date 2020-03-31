---
title: Use an Azure Resource Manager template to deploy your service
titleSuffix: Azure Cognitive Search
description: 

manager: nitinme
author: tchristiani
ms.author: terrychr
ms.service: cognitive-search
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 03/20/2020
---

# Quickstart: Deploy Cognitive Search using Resource Manager template

This article walks you through the process for using a Resource Manager template to deploy an Azure Cognitive Search resource in the Azure portal.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a Cognitive Search service

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://docs.microsoft.com/azure/templates/Microsoft.Search/2015-08-19/searchservices).

:::code language="json"
{
  "name": "string",
  "type": "Microsoft.Search/searchServices",
  "apiVersion": "2015-08-19",
  "location": "string",
  "tags": {},
  "identity": {
    "type": "string"
  },
  "properties": {
    "replicaCount": "integer",
    "partitionCount": "integer",
    "hostingMode": "string"
  },
  "sku": {
    "name": "string"
  }
}:::

The Azure resource defined in this template:

- [Microsoft.Search/searchServices](https://docs.microsoft.com/azure/templates/Microsoft.Search/2015-08-19/searchServices): create an Azure Cognitive Search service

### Deploy the template

Select the following image to sign in to Azure and open a template. The template creates an Azure Cognitive Search account and resource.

[![Deploy to Azure](/search/media/search-get-started-arm/arm-deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fazure-quickstart-templates%2Fmaster%2F101-azure-search-create%2Fazuredeploy.json)

The portal displays a form that allows you to easily provide parameter values. Some parameters are pre-filled with the default values from the template. You will need to provide your subscription, resource group, location, and service name. Once you have completed the form, you will need to agree to the terms and conditions and then select the purchase button to complete your deployment.

> [!div class="mx-imgBorder"]
> ![Azure portal display of template](/search/media/search-get-started-arm/arm-portalscrnsht-edit.png)

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


