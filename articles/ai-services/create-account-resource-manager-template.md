---
title: "Quickstart: Create an Azure AI services resource by using an ARM template"
description: Learn how to use an Azure Resource Manager template to create an Azure AI services resource.
keywords: Azure AI services, cognitive solutions, cognitive intelligence, cognitive artificial intelligence
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 01/20/2024
ms.author: aahi
ms.custom:
  - subject-armqs
  - mode-arm
  - devx-track-arm-template
  - ignite-2023
---

# Quickstart: Create an Azure AI services resource by using an ARM template

This quickstart shows you how to use an Azure Resource Manager template (ARM template) to create a resource in Azure AI services.

Azure AI services is a cloud-based portfolio of AI services. It helps developers build cognitive intelligence into applications without needing direct skills or knowledge of AI or data science.

Azure AI services is available through REST APIs and client library SDKs in popular development languages. It enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

By creating an Azure AI services resource, you can:

* Access multiple AI services in Azure with a single key and endpoint.
* Consolidate billing from the services that you use.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

* If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/cognitive-services).
* [!INCLUDE [terms-azure-portal](./includes/quickstarts/terms-azure-portal.md)]

## Review the template

The template that you use in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cognitive-services-universalkey/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.cognitiveservices/cognitive-services-universalkey/azuredeploy.json":::

One Azure resource is defined in the Bicep file: [Microsoft.CognitiveServices/accounts](/azure/templates/microsoft.cognitiveservices/accounts) specifies that it's an Azure AI services resource. The `kind` field in the Bicep file defines the type of resource.

[!INCLUDE [SKUs and pricing](./includes/quickstarts/sku-pricing.md)]

## Deploy the template

# [Azure portal](#tab/portal)

1. Select the **Deploy to Azure** button.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.cognitiveservices%2Fcognitive-services-universalkey%2Fazuredeploy.json":::

2. Enter the following values.

    |Value  |Description  |
    |---------|---------|
    | **Subscription** | Select an Azure subscription. |
    | **Resource group** | Select **Create new**, enter a unique name for the resource group, and then select **OK**. |
    | **Region** | Select a region (for example, **East US**). |
    | **Cognitive Service Name** | Replace the value with a unique name for your Azure AI services resource. You'll need the name in the next section when you validate the deployment. |
    | **Location** | Replace with the region that you selected. |
    | **Sku** | Select the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) for your resource. |

    :::image type="content" source="media/arm-template/universal-key-portal-template.png" alt-text="Screenshot that shows the pane for resource creation.":::

3. Select **Review + Create**, and then select **Create**. When deployment is successful, the **Go to resource** button is available.

# [Azure CLI](#tab/CLI)

Run the following script from [your local machine](/cli/azure/install-azure-cli), or run it from a browser by using the **Try it** button. Include a name and location (for example, `centralus`) for a new resource group, and the ARM template will be used to deploy an Azure AI services resource within it. Remember the name that you use. You'll use it later to validate the deployment.

> [!NOTE]
> The `az deployment group create` command in the script requires Azure CLI version 2.6 or later. To display the version, enter `az --version`. For more information, see the [documentation](/cli/azure/deployment/group).

```azurecli-interactive
read -p "Enter a name for your new resource group:" resourceGroupName &&
read -p "Enter the location (i.e. centralus):" location &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.cognitiveservices/cognitive-services-universalkey/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
echo "Press [ENTER] to continue ..." &&
read
```

---

> [!TIP]
> If your subscription doesn't allow you to create an Azure AI services resource, you might need to enable the privilege of that [Azure resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) by using the [Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal), a [PowerShell command](../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell) or an [Azure CLI command](../azure-resource-manager/management/resource-providers-and-types.md#azure-cli). If you're not the subscription owner, ask the subscription owner or someone with an admin role to complete the registration for you. Or ask for the */register/action* privileges to be granted to your account.

## Review deployed resources

# [Portal](#tab/portal)

When your deployment finishes, you can select the **Go to resource** button to see your new resource. You can also find the resource group by:

1. Selecting **Resource groups** from the left pane.
2. Selecting the resource group name.

# [Azure CLI](#tab/CLI)

Run the following script. Include the name of the resource group that you created earlier.

```azurecli-interactive
echo "Enter the resource group where the Azure AI services resource exists:" &&
read resourceGroupName &&
az cognitiveservices account list -g $resourceGroupName
```

---

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or the resource group. Deleting the resource group also deletes any other resources that the group contains.

# [Azure portal](#tab/portal)

1. On the left pane, select **Resource groups** to display the list of your resource groups.
2. Locate the resource group that contains the resource to be deleted.
3. Right-click the resource group, select **Delete resource group**, and then confirm.

# [Azure CLI](#tab/CLI)

Run the following script. Include the name of the resource group that you created earlier.

```azurecli-interactive
echo "Enter the resource group name, for deletion:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName
```

---

## Related content

* For more information on how to securely work with Azure AI services, see [Authenticate requests to Azure AI services](authentication.md).
* For a list of Azure AI services, see [What are Azure AI services?](./what-are-ai-services.md).
* For a list of natural languages that Azure AI services supports, see [Natural language support in Azure AI services](language-support.md).
* To understand how to use Azure AI services on-premises, see [What are Azure AI containers?](cognitive-services-container-support.md).
* To estimate the cost of using Azure AI services, see [Plan and manage costs for Azure AI Studio](../ai-studio/how-to/costs-plan-manage.md).
