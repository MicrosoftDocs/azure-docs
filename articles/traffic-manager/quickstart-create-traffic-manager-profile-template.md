---
title: 'Quickstart: Create a Traffic Manager by using Azure Resource Manager template (ARM template)'
description: This quickstart article describes how to create an Azure Traffic Manager profile by using Azure Resource Manager template (ARM template).
services: traffic-manager
author: greg-lindsay
ms.author: greglin
ms.date: 02/19/2023
ms.topic: quickstart
ms.service: traffic-manager
ms.custom: template-quickstart, subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create a Traffic Manager profile using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM Template) to create a Traffic Manager profile with external endpoints using the performance routing method.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Ftraffic-manager-external-endpoint%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/traffic-manager-external-endpoint).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/traffic-manager-external-endpoint/azuredeploy.json":::

One Azure resource is defined in the template:

* [**Microsoft.Network/trafficManagerProfiles**](/azure/templates/microsoft.network/trafficmanagerprofiles)

To find more templates that are related to Azure Traffic Manager, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/traffic-manager-external-endpoint/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The template deployment creates a profile with two external endpoints. **Endpoint1** uses a target endpoint of `www.microsoft.com` with the location in **North Europe**. **Endpoint2** uses a target endpoint of `learn.microsoft.com` with the location in **South Central US**.

    The resource group name is the project name with **rg** appended.

    > [!NOTE]
    > **uniqueDNSname** needs to be a globally unique name in order for the template to deploy successfully. If deployment fails, start over with Step 1.

    It takes a few minutes to deploy the template. When completed, the output is similar to:

    :::image type="content" source="./media/quickstart-create-traffic-manager-profile/traffic-manager-arm-powershell-output.png" alt-text="Azure Traffic Manager Resource Manager template PowerShell deployment output":::

Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Determine the DNS name of the Traffic Manager profile using [Get-AzTrafficManagerProfile](/powershell/module/az.trafficmanager/get-aztrafficmanagerprofile).

    ```azurepowershell-interactive
    Get-AzTrafficManagerProfile -Name ExternalEndpointExample -ResourceGroupName $resourceGroupName | Select RelativeDnsName
    ```

    Copy the **RelativeDnsName** value. The DNS name of your Traffic Manager profile is `<relativednsname>.trafficmanager.net`.

1. From a local PowerShell run the following command by replacing the **{relativeDNSname}** variable with `<relativednsname>.trafficmanager.net`.

    ```powershell
    Resolve-DnsName -Name {relativeDNSname} | Select-Object NameHost | Select -First 1
    ```

    You should get a NameHost of either `www.microsoft.com` or `learn.microsoft.com` depending on which region is closer to you.

1. To check if you can resolve to the other endpoint, disable the endpoint for the target you got in the last step. Replace the **{endpointName}** with either **endpoint1** or **endpoint2** to disable the target for `www.microsoft.com` or `learn.microsoft.com` respectively.

    ```azurepowershell-interactive
    Disable-AzTrafficManagerEndpoint -Name {endpointName} -Type ExternalEndpoints -ProfileName ExternalEndpointExample -ResourceGroupName $resourceGroupName -Force
    ```

1. Run the command from Step 2 again in a local PowerShell. This time you should get the other NameHost for the other endpoint.

## Clean up resources

When you no longer need the Traffic Manager profile, delete the resource group. This removes the Traffic Manager profile and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you created a Traffic Manager profile.

To learn more about routing traffic, continue to the Traffic Manager tutorials.

> [!div class="nextstepaction"]
> [Traffic Manager tutorials](tutorial-traffic-manager-improve-website-response.md)
