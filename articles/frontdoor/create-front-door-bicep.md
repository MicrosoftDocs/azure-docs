---
title: 'Quickstart: Create an Azure Front Door using Bicep'
description: This quickstart describes how to create an Azure Front Door using Bicep.
services: front-door
author: duongau
ms.author: duau
ms.date: 11/18/2024
ms.topic: quickstart
ms.service: azure-frontdoor
ms.custom: subject-armqs, mode-arm, devx-track-bicep
#Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create a Front Door using Bicep

This quickstart guides you through using Bicep to create an Azure Front Door with a Web App as the origin.

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

* An active Azure subscription. Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't have one.
* The IP address or FQDN of a website or web application.

## Review the Bicep file

The Bicep file used in this quickstart is available from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/front-door-standard-premium-app-service-public/).

In this quickstart, you will create an Azure Front Door profile, an Azure App Service, and configure the app service to validate that traffic comes through the Azure Front Door origin.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.cdn/front-door-standard-premium-app-service-public/main.bicep":::

The Bicep file defines multiple Azure resources:

* [**Microsoft.Cdn/profiles**](/azure/templates/microsoft.cdn/profiles) - Azure Front Door Standard/Premium profile
* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms) - App service plan to host web apps
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites) - Web app origin servicing requests for Front Door

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** on your local computer.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    After the deployment completes, you should see output similar to:

    :::image type="content" source="./media/create-front-door-bicep/front-door-standard-premium-bicep-deployment-powershell-output.png" alt-text="Screenshot of Front Door Bicep PowerShell deployment output.":::

## Validate the deployment

Use Azure CLI or Azure PowerShell to list the resources deployed in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

You can also validate the deployment using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group you created in the previous section.

1. Select the Front Door you created. You will see the endpoint hostname. Copy the hostname and paste it into the address bar of a browser. Press enter, and your requests will be routed to the web app.

    :::image type="content" source="./media/create-front-door-bicep/front-door-bicep-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content.":::

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the Front Door service and the resource group. The Front Door and all the related resources are removed.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a:

* Front Door
* App Service plan
* Web App

To learn how to add a custom domain to your Front Door, continue to the Front Door tutorials.

> [!div class="nextstepaction"]
> [Front Door tutorials](front-door-custom-domain.md)
