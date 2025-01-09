---
title: Create a storage task by using Azure Resource Manager template (ARM template)
titleSuffix: Azure Storage Actions Preview
description: Learn how to create an Azure {service name} by using Azure Resource Manager template (ARM template).
services: azure-resource-manager
ms.service: azure-resource-manager
author: normesta
ms.author: normesta
ms.topic: quickstart-arm
ms.custom: subject-armqs
ms.date: 01/09/2025
---


# Create a storage task by using Azure Resource Manager template (ARM template)

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create
storage task.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/articles/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/<encoded template URL>":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/storage-account-create/).

:::code language="json" source="~/quickstart-templates/storage-account-create/azuredeploy.json":::

## Deploy the template

Provide an example of at least one deployment method: Azure CLI, Azure PowerShell, or Azure portal.

## Review deployed resources

<!-- This heading must be titled "Review deployed resources" or "Validate the deployment". -->

Provide an example of at least one method to review deployed resources. Use a portal screenshot of
the resources, Azure CLI commands, or Azure PowerShell commands.

## Clean up resources

<!-- Include a paragraph that explains how to delete unneeded resources. Use the Azure portal, Azure
CLI, or Azure PowerShell.

For more information, see the contributor guide article: Write an ARM template quickstart.

-->

When no longer needed, delete the resource group. The resource group and all the resources in the
resource group are deleted.

## Next steps

<!-- Make the next steps similar to other quickstarts and use a blue button to link to the next
article for your service. Or direct readers to the article: "Tutorial: Create and deploy your first
ARM template" to follow the process of creating a template.

To include additional links for more information about the service, it's acceptable to use a
paragraph and bullet points.

-->

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)