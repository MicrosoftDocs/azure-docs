---
title: Add an external endpoint to an existing profile - Azure Template
titlesuffix: Azure Traffic Manager
description: Learn how to add an external endpoint to an existing Azure Traffic Manager profile using an Azure Template.
author: greg-lindsay
ms.author: greglin
ms.service: traffic-manager
ms.topic: how-to
ms.date: 04/24/2023
ms.custom: template-how-to
---

# Add an external endpoint to an existing profile using an Azure Template

This article describes how to use an Azure Resource Manager template (ARM Template) to add an external endpoint to an existing Traffic Manager profile.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Ftraffic-manager-add-external-endpoint%2Fazuredeploy.json)

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An existing Azure Traffic Manager profile. For more information on creating an Azure Traffic Manager profile, see [Quickstart: Create a Traffic Manager profile using an ARM template](quickstart-create-traffic-manager-profile-template.md).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/traffic-manager-add-external-endpoint).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/traffic-manager-add-external-endpoint/azuredeploy.json":::

One Azure resource is defined in the template:

* [**Microsoft.Network/trafficManagerProfiles/ExternalEndpoints**](/azure/templates/microsoft.network/trafficmanagerprofiles)

To find more templates that are related to Azure Traffic Manager, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    ```azurepowershell-interactive
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/traffic-manager-add-external-endpoint/azuredeploy.json"

    $resourceGroupName = Read-Host -Prompt "Enter name of resource group of existing traffic manager profile"

    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The template deployment adds another endpoint based on your inputs to an existing profile. 

    The resource group name is the existing resource group that contains the existing profile.

    > [!NOTE]
    > **existingTMProfileName** must match your existing profile name in order for the template to deploy successfully. If deployment fails, start over with Step 1.

    It takes a few minutes to deploy the template. When completed, the output is similar to:

    :::image type="content" source="./media/how-to-add-endpoint-existing-profile-template/traffic-manager-arm-powershell-output.png" alt-text="Azure Traffic Manager Resource Manager template PowerShell deployment output":::

    Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Use [Get-AzTrafficManagerProfile](/powershell/module/az.trafficmanager/get-aztrafficmanagerprofile) to verify that another endpoint was added to the profile.

    ```azurepowershell-interactive
    Get-AzTrafficManagerProfile -ResourceGroupName myResourceGroup -Name ExternalEndpointExample | Select Endpoints
    ```
    The output is similar to:

    :::image type="content" source="./media/how-to-add-endpoint-existing-profile-template/validation-output.png" alt-text="Output of validation command":::

## Clean up resources

When you no longer need the Traffic Manager profile, delete the resource group. This command removes the Traffic Manager profile and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you added an endpoint to an existing Traffic Manager profile.

To learn more about routing traffic, continue to the Traffic Manager tutorials.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)
