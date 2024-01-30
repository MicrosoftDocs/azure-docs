---
title: Create an Azure notification hub using Bicep
description: Learn how to create an Azure notification hub using Bicep.
services: notification-hubs
author: femila
ms.author: femila
ms.date: 05/24/2022
ms.topic: quickstart
ms.service: notification-hubs
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create a notification hub using Bicep

Azure Notification Hubs provides an easy-to-use and scaled-out push engine that enables you to send notifications to any platform (iOS, Android, Windows, Kindle, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs](notification-hubs-push-notification-overview.md).

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

This quickstart uses Bicep to create an Azure Notification Hubs namespace, and a notification hub named **MyHub** within that namespace.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/notification-hub/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.notificationhubs/notification-hub/main.bicep":::

The Bicep file creates the two Azure resources:

* [Microsoft.NotificationHubs/namespaces](/azure/templates/microsoft.notificationhubs/namespaces)
* [Microsoft.NotificationHubs/namespaces/notificationHubs](/azure/templates/microsoft.notificationhubs/namespaces/notificationhubs)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters namespaceName=<namespace-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -namespaceName "<namespace-name>"
    ```

    ---

    >[!NOTE]
    > Replace **\<namespace-name\>** with the name of the Notifications Hub namespace.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

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

When you no longer need the logic app, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

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

For a step-by-step tutorial that guides you through the process of creating a Bicep file, see:

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
