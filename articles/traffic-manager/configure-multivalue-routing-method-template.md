---
title: Configure the Multivalue routing method - Azure Resource Manager template (ARM template)
titlesuffix: Azure Traffic Manager
description: Learn how to configure the Multivalue routing method with nested endpoints and the min-child feature.
author: greg-lindsay
ms.author: greglin
ms.service: traffic-manager
ms.topic: how-to
ms.date: 04/28/2022
ms.custom: template-how-to, devx-track-arm-template
---

# Configure the Multivalue routing method using an ARM Template

This article describes how to use an Azure Resource Manager template (ARM Template) to create a nested, Multivalue profile with the min-child feature.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Ftraffic-manager-minchild%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Two existing Azure Traffic Manager profiles. For more information on creating an Azure Traffic Manager profile, see [Quickstart: Create a Traffic Manager profile using an ARM template](quickstart-create-traffic-manager-profile-template.md).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/traffic-manager-minchild/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/traffic-manager-minchild/azuredeploy.json":::

Two Azure resources are defined in the template:

* [**Microsoft.Network/trafficManagerProfiles/nestedEndpoints**](/azure/templates/microsoft.network/trafficmanagerprofiles)

To find more templates that are related to Azure Traffic Manager, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    ```azurepowershell-interactive
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/traffic-manager-minchild/azuredeploy.json"

    $resourceGroupName = Read-Host -Prompt "Enter name of resource group of the existing traffic manager profiles"

    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The template deployment adds two nested endpoints from two existing Azure Traffic Manager profiles.

    The resource group name is the existing resource group that contains the existing profiles.

    > [!NOTE]
    > **existingTMProfileName1**, **existingTMProfileName2**,**TMProfileDNS1**, and **TMProfileDNS2** must match your existing Traffic Manager profiles in order for the template to deploy successfully. If deployment fails, start over with Step 1.

    It takes a few minutes to deploy the template. When completed, the output is similar to:

    :::image type="content" source="./media/configure-multivalue-routing-method-template/traffic-manager-arm-powershell-output.png" alt-text="Azure Traffic Manager Resource Manager template PowerShell deployment output":::

    Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Use [Get-AzTrafficManagerProfile](/powershell/module/az.trafficmanager/get-aztrafficmanagerprofile) to verify that the nested endpoints were added to the profile. For `-Name`, enter the name of the parent Traffic Manger profile you entered when deploying the template.

    ```azurepowershell-interactive
    Get-AzTrafficManagerProfile -ResourceGroupName myResourceGroup -Name tmprofileparent-1 | Select Endpoints
    ```
    The output is similar to:

    :::image type="content" source="./media/configure-multivalue-routing-method-template/validation-output.png" alt-text="Output of validation command":::

## Clean up resources

When you no longer need the Traffic Manager profile, delete the resource group. This command removes the Traffic Manager profile and all the related resources.

To delete the resource group, use the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you added a Multivalue routing method with nested endpoints and the min-child feature.

To learn more about routing traffic, continue to the Traffic Manager tutorials.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)
