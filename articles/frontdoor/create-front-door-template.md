---
title: 'Quickstart: Create an Azure Front Door using an ARM template'
description: This quickstart describes how to create an Azure Front Door using Azure Resource Manager template (ARM template).
services: front-door
author: duongau
ms.author: duau
ms.date: 11/18/2024
ms.topic: quickstart
ms.service: azure-frontdoor
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
#Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create an Azure Front Door using an ARM template
This quickstart shows you how to use an Azure Resource Manager (ARM) template to create an Azure Front Door with an Azure Web App as the origin.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If you meet the prerequisites and are familiar with ARM templates, select the **Deploy to Azure** button to open the template in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.cdn%2Ffront-door-standard-premium-app-service-public%2Fazuredeploy.json":::

## Prerequisites

* An Azure subscription. Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't have one.
* The IP or FQDN of a website or web application.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/front-door-standard-premium-app-service-public/).

In this quickstart, you'll create an Azure Front Door Standard/Premium, an App Service, and configure the App Service to validate that traffic has come through the Azure Front Door origin.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.cdn/front-door-standard-premium-app-service-public/azuredeploy.json":::

The template defines multiple Azure resources:

* [**Microsoft.Network/frontDoors**](/azure/templates/microsoft.network/frontDoors)
* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms) (App service plan to host web apps)
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites) (Web app origin servicing request for Azure Front Door)

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    > [!NOTE]
    > To deploy Azure Front Door Premium instead of Standard, substitute the value of the sku parameter with `Premium_AzureFrontDoor`. For detailed comparison, view [Azure Front Door tier comparison](standard-premium/tier-comparison.md).

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.cdn/front-door-standard-premium-app-service-public/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -frontDoorSkuName Standard_AzureFrontDoor

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The template deployment creates an Azure Front Door with a web app as origin.

    The resource group name is the project name with **rg** appended.

    > [!NOTE]
    > **frontDoorName** needs to be a globally unique name for the template to deploy successfully. If deployment fails, start over with Step 1.

    It takes a few minutes to deploy the template. When completed, the output is similar to:

    :::image type="content" source="./media/quickstart-create-front-door-template/front-door-standard-premium-template-deployment-powershell-output.png" alt-text="Azure Front Door Resource Manager template PowerShell deployment output":::

Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is the project name with **rg** appended.

1. Select the Azure Front Door you created previously and you'll be able to see the endpoint hostname. Copy the hostname and paste it into the address bar of a browser. Press enter and your request will automatically get routed to the web app.

    :::image type="content" source="./media/create-front-door-portal/front-door-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content.":::

## Clean up resources

When you no longer need the Azure Front Door service, delete the resource group. This will remove the Azure Front Door and all related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you created a:

* Azure Front Door
* App Service plan
* Web App

To learn how to add a custom domain to your Azure Front Door, continue to the Azure Front Door tutorials.

> [!div class="nextstepaction"]
> [Azure Front Door tutorials](front-door-custom-domain.md)
