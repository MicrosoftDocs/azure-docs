---
title: Create an Azure AI services resource using ARM templates | Microsoft Docs
description: Create an Azure AI service resource with ARM template.
keywords: Azure AI services, cognitive solutions, cognitive intelligence, cognitive artificial intelligence
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 09/01/2022
ms.author: aahi
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create an Azure AI services resource using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create Azure AI services.

Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They are available through REST APIs and client library SDKs in popular development languages. Azure AI services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

Create a resource using an Azure Resource Manager template (ARM template). This multi-service resource lets you:

* Access multiple Azure AI services with a single key and endpoint.
* Consolidate billing from the services you use.
* [!INCLUDE [terms-azure-portal](./includes/quickstarts/terms-azure-portal.md)]

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

* If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/cognitive-services).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cognitive-services-universalkey/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.cognitiveservices/cognitive-services-universalkey/azuredeploy.json":::

One Azure resource is defined in the Bicep file: [Microsoft.CognitiveServices/accounts](/azure/templates/microsoft.cognitiveservices/accounts) specifies that it is an Azure AI services resource. The `kind` field in the Bicep file defines the type of resource.

[!INCLUDE [SKUs and pricing](./includes/quickstarts/sku-pricing.md)]

## Deploy the template

# [Azure portal](#tab/portal)

1. Select the **Deploy to Azure** button.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.cognitiveservices%2Fcognitive-services-universalkey%2Fazuredeploy.json)

2. Enter the following values.

    |Value  |Description  |
    |---------|---------|
    | **Subscription** | Select an Azure subscription. |
    | **Resource group** | Select **Create new**, enter a unique name for the resource group, and then select **OK**. |
    | **Region** | Select a region.  For example, **East US** |
    | **Cognitive Service Name** | Replace with a unique name for your Azure AI services resource. You will need the name in the next section when you validate the deployment. |
    | **Location** | Replace with the region used above. |
    | **Sku** | The [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) for your resource. |

    :::image type="content" source="media/arm-template/universal-key-portal-template.png" alt-text="Resource creation screen.":::

3. Select **Review + Create**, then **Create**. After the resource has successfully finished deploying, the **Go to resource** button will be highlighted.

# [Azure CLI](#tab/CLI)

> [!NOTE]
> `az deployment group` create requires Azure CLI version 2.6 or later. To display the version type `az --version`. For more information, see the [documentation](/cli/azure/deployment/group).

Run the following script via the Azure CLI, either from [your local machine](/cli/azure/install-azure-cli), or from a browser by using the **Try it** button. Enter a name and location (for example `centralus`) for a new resource group, and the ARM template will be used to deploy an Azure AI services resource within it. Remember the name you use. You will use it later to validate the deployment.

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

> [!Tip]
> If your subscription doesn't allow you to create an Azure AI services resource, you may need to enable the privilege of that [Azure resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) using the [Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal), [PowerShell command](../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell) or an [Azure CLI command](../azure-resource-manager/management/resource-providers-and-types.md#azure-cli). If you are not the subscription owner, ask the *Subscription Owner* or someone with a role of *admin* to complete the registration for you or ask for the **/register/action** privileges to be granted to your account.

## Review deployed resources

# [Portal](#tab/portal)

When your deployment finishes, you will be able to select the **Go to resource** button to see your new resource. You can also find the resource group by:

1. Selecting **Resource groups** from the left navigation menu.
2. Selecting the resource group name.

# [Azure CLI](#tab/CLI)

Using the Azure CLI, run the following script, and enter the name of the resource group you created earlier.

```azurecli-interactive
echo "Enter the resource group where the Azure AI services resource exists:" &&
read resourceGroupName &&
az cognitiveservices account list -g $resourceGroupName
```

---


## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources contained in the group.

# [Azure portal](#tab/portal)

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group containing the resource to be deleted
3. Right-click on the resource group listing. Select **Delete resource group**, and confirm.

# [Azure CLI](#tab/CLI)

Using the Azure CLI, run the following script, and enter the name of the resource group you created earlier.

```azurecli-interactive
echo "Enter the resource group name, for deletion:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName
```

---

## See also

* See [Authenticate requests to Azure AI services](authentication.md) on how to securely work with Azure AI services.
* See [What are Azure AI services?](./what-are-ai-services.md) for a list of Azure AI services.
* See [Natural language support](language-support.md) to see the list of natural languages that Azure AI services supports.
* See [Use Azure AI services as containers](cognitive-services-container-support.md) to understand how to use Azure AI services on-prem.
* See [Plan and manage costs for Azure AI services](../ai-studio/how-to/costs-plan-manage.md) to estimate cost of using Azure AI services.
