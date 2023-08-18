---
title: 'Quickstart: Create an Azure Front Door Service - Bicep'
description: This quickstart describes how to create an Azure Front Door Service using Bicep.
services: front-door
author: duongau
ms.author: duau
ms.date: 03/30/2022
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.custom: subject-armqs, mode-arm, devx-track-bicep
#Customer intent: As an IT admin, I want to direct user traffic to ensure high availability of web applications.
---

# Quickstart: Create a Front Door using Bicep

This quickstart describes how to use Bicep to create a Front Door to set up high availability for a web endpoint.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* IP or FQDN of a website or web application.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/front-door-create-basic).

In this quickstart, you'll create a Front Door configuration with a single backend and a single default path matching `/*`.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/front-door-create-basic/main.bicep":::

One Azure resource is defined in the Bicep file:

* [**Microsoft.Network/frontDoors**](/azure/templates/microsoft.network/frontDoors)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters frontDoorName=<door-name> backendAddress=<backend-address>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -frontDoorName "<door-name>" -backendAddress "<backend-address>"
    ```

    ---

    > [!NOTE]
    > Replace **\<door-name\>** with the name of the Front Door resource. Replace **\<backend-address\>** with the hostname of the backend. It must be an IP address or FQDN.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the Front Door service and the resource group. This removes the Front Door and all the related resources.

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

In this quickstart, you created a Front Door.

To learn how to add a custom domain to your Front Door, continue to the Front Door tutorials.

> [!div class="nextstepaction"]
> [Front Door tutorials](front-door-custom-domain.md)
