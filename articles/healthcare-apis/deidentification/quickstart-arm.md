---
title: Create an Azure Health Data Services de-identification service by using Azure Resource Manager template (ARM template)
description: Learn how to create an Azure Health Data Services de-identification service by using Azure Resource Manager template (ARM template).
services: azure-resource-manager
ms.service: azure-health-data-services
ms.subservice: deidentification-service
author: jovinson-ms
ms.author: jovinson
ms.topic: quickstart-arm
ms.custom: subject-armqs
ms.date: 11/11/2024

# Customer intent: As a cloud administrator, I want a quick method to deploy an Azure resource for production environments or to evaluate the service's functionality.
---

# Quickstart: Deploy the de-identification service (preview) using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create
an Azure Health Data Services de-identification service (preview).

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthdataaiservices%2Fdeidentification-service-create%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/deidentification-service-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.healthdataaiservices/deidentification-service-create/azuredeploy.json":::

One Azure resource is defined in the template:

- [Microsoft.HealthDataAIServices/deidServices](/azure/templates/microsoft.healthdataaiservices/deidservices?pivots=deployment-language-arm-template): Create a de-identification service.

## Deploy the template

Deploy the template using any standard method to [Deploy a local ARM template](/azure/azure-resource-manager/templates/deployment-tutorial-local-template) such as the following example using Azure CLI.
1. Save the template file as **azuredeploy.json** to your local computer.
1. Create a resource group in one of the supported regions for the de-identification service, replacing **\<deid-service-name\>** with the name you choose for your de-identification service:
    ```azurecli
    az group create --name exampleRG --location eastus

    az deployment group create --resource-group exampleRG --template-file azuredeploy.json --parameters deidServiceName="<deid-service-name>" 
    ```

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Review your resource with Azure CLI, replacing **\<deid-service-name\>** with the name you choose for your de-identification service:
```azurecli
az resource show -g exampleRG -n <deid-service-name> --resource-type "Microsoft.HealthDataAIServices/deidServices"
```

## Clean up resources

When no longer needed, delete the resource group. The resource group and all the resources in the
resource group are deleted.
```azurecli
az group delete --name exampleRG
```

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)

- [Quickstart: Azure Health De-identification client library for .NET](quickstart-sdk-net.md)