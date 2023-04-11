---
title: Quickstart - Create Azure API Management instance by using ARM template
description: Learn how to create an Azure API Management instance in the Developer tier by using an Azure Resource Manager template (ARM template).
services: azure-resource-manager
author: dlepow
ms.service: api-management
tags: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.author: danlep
ms.date: 10/09/2020
---

# Quickstart: Create a new Azure API Management service instance using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create an Azure API Management (APIM) service instance. APIM helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. APIM enables you to create and manage modern API gateways for existing backend services hosted anywhere. For more information, see the [Overview](api-management-key-concepts.md).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fazure-api-management-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-api-management-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.apimanagement/azure-api-management-create/azuredeploy.json":::

The following resource is defined in the template:

- **[Microsoft.ApiManagement/service](/azure/templates/microsoft.apimanagement/service)**

More Azure API Management template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Apimanagement&pageNumber=1&sort=Popular).

## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an API Management service instance with an automatically generated name.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.apimanagement%2Fazure-api-management-create%2Fazuredeploy.json)

    In this example, the instance is configured in the Developer tier, an economical option to evaluate Azure API Management. This tier isn't for production use. For more information about scaling the API Management tiers, see [upgrade and scale](upgrade-and-scale.md).

1. Select or enter the following values.
    - **Subscription**: select an Azure subscription.
    - **Resource group**: select **Create new**, enter a unique name for the resource group, and then select **OK**.
    - **Region**: select a location for the resource group. Example: **Central US**.
    - **Publisher Email**: enter an email address to receive notifications.
    - **Publisher Name**: enter a name you choose for the API publisher.
    - **Sku**: accept the default value of **Developer**.
    - **Sku Count**: accept the default value.
    - **Location**: accept the generated location for the API Management service.

    :::image type="content" source="media/quickstart-arm-template/create-instance-template.png" alt-text="API Management template properties":::

1. Select **Review + Create**, then review the terms and conditions. If you agree, select **Create**.

    > [!TIP]
    >  It can take between 30 and 40 minutes to create and activate an API Management service in the Developer tier.

1. After the instance has been created successfully, you get a notification:

    :::image type="content" source="media/quickstart-arm-template/deployment-notification.png" alt-text="Deployment notification":::

 The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-cli.md).

## Review deployed resources

Use the Azure portal to check the deployed resources, or use tools such as the Azure CLI or Azure PowerShell to list the deployed resources.

1. In the [Azure portal](https://portal.azure.com), search for and select **API Management services**, and select the service instance you created.
1. Review the properties of your service on the **Overview** page.

:::image type="content" source="media/quickstart-arm-template/service-instance-created.png" alt-text="Service overview page":::

When your API Management service instance is online, you're ready to use it. Start with the tutorial to [import and publish](import-and-publish.md) your first API.

## Clean up resources

If you plan to continue working with subsequent tutorials, you might want to leave the API Management instance in place. When no longer needed, delete the resource group, which deletes the resources in the resource group.

1. In the [Azure portal](https://portal.azure.com), search for and select **Resource groups**. You can also select **Resource groups** on the **Home** page.
1. On the **Resource groups** page, select your resource group.
1. On the resource group page, select **Delete resource group**.

    :::image type="content" source="media/quickstart-arm-template/delete-resource-group.png" alt-text="Delete resource group":::
1. Type the name of your resource group, and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Import and publish your first API](import-and-publish.md)
