---
title: 'Quickstart: Create an Azure Front Door Service by using an Azure Resource Manager template (ARM template)'
description: This quickstart describes how to create an Azure Front Door Service by using Azure Resource Manager template (ARM template).
services: front-door
documentationcenter: 
author: duongau
ms.author: duau
editor: 
ms.date: 09/14/2020
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.custom:
  - subject-armqs
  - mode-arm
# Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create a Front Door using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM Template) to create a Front Door to set up high availability for a web endpoint.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-front-door-create-basic%2Fazuredeploy.json)

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* IP or FQDN of a website or web application.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-front-door-create-basic).

In this quickstart, you'll create a Front Door configuration with a single backend and a single default path matching `/*`.

:::code language="json" source="~/quickstart-templates/101-front-door-create-basic/azuredeploy.json":::

One Azure resource is defined in the template:

* [**Microsoft.Network/frontDoors**](/azure/templates/microsoft.network/frontDoors)

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-front-door-create-basic/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The template deployment creates a Front Door with a single backend. In this example `microsoft.com` is used as the **backendAddress**.

    The resource group name is the project name with **rg** appended.

    > [!NOTE]
    > **frontDoorName** needs to be a globally unique name in order for the template to deploy successfully. If deployment fails, start over with Step 1.

    It takes a few minutes to deploy the template. When completed, the output is similar to:

    :::image type="content" source="./media/quickstart-create-front-door-template/front-door-template-deployment-powershell-output.png" alt-text="Front Door Resource Manager template PowerShell deployment output":::

Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is the project name with **rg** appended.

1. Select the Front Door you created previously and click on the **Frontend host** link. The link will open a web browser redirecting you to your backend FQDN you defined during creation.

    :::image type="content" source="./media/quickstart-create-front-door-template/front-door-overview.png" alt-text="Front Door portal overview":::

## Clean up resources

When you no longer need the Front Door service, delete the resource group. This removes the Front Door and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you created a Front Door.

To learn how to add a custom domain to your Front Door, continue to the Front Door tutorials.

> [!div class="nextstepaction"]
> [Front Door tutorials](front-door-custom-domain.md)
