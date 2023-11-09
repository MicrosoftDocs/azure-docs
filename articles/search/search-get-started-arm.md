---
title: 'Quickstart: Deploy using templates'
titleSuffix: Azure AI Search
description: You can quickly deploy an Azure AI Search service instance using the Azure Resource Manager template.
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 06/29/2023
---

# Quickstart: Deploy Azure AI Search using an Azure Resource Manager template

This article walks you through the process for using an Azure Resource Manager (ARM) template to deploy an Azure AI Search resource in the Azure portal.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

Only those properties included in the template are used in the deployment. If more customization is required, such as [setting up network security](search-security-overview.md#network-security), you can update the service as a post-deployment task. To customize an existing service with the fewest steps, use [Azure CLI](search-manage-azure-cli.md) or [Azure PowerShell](search-manage-powershell.md). If you're evaluating preview features, use the [Management REST API](search-manage-rest.md).

Assuming your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.search%2Fazure-search-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-search-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.search/azure-search-create/azuredeploy.json":::

The Azure resource defined in this template:

- [Microsoft.Search/searchServices](/azure/templates/Microsoft.Search/searchServices): create an Azure AI Search service

## Deploy the template

Select the following image to sign in to Azure and open a template. The template creates an Azure AI Search resource.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.search%2Fazure-search-create%2Fazuredeploy.json)

The portal displays a form that allows you to easily provide parameter values. Some parameters are pre-filled with the default values from the template. You will need to provide your subscription, resource group, location, and service name. If you want to use Azure AI services in an [AI enrichment](cognitive-search-concept-intro.md) pipeline, for example to analyze binary image files for text, choose a location that offers both Azure AI Search and Azure AI services. Both services are required to be in the same region for AI enrichment workloads. Once you have completed the form, you will need to agree to the terms and conditions and then select the purchase button to complete your deployment.

> [!div class="mx-imgBorder"]
> ![Azure portal display of template](./media/search-get-started-arm/arm-portalscrnsht.png)

## Review deployed resources

When your deployment is complete you can access your new resource group and new search service in the portal.

## Clean up resources

Other Azure AI Search quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave this resource in place. When no longer needed, you can delete the resource group, which deletes the Azure AI Search service and related resources.

## Next steps

In this quickstart, you created an Azure AI Search service using an ARM template, and validated the deployment. To learn more about Azure AI Search and Azure Resource Manager, continue on to the articles below.

- Read an [overview of Azure AI Search](search-what-is-azure-search.md).
- [Create an index](search-get-started-portal.md) for your search service.
- [Create a demo app](search-create-app-portal.md) using the portal wizard.
- [Create a skillset](cognitive-search-quickstart-blob.md) to extract information from your data.
