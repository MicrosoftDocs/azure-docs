---
title: Create an Azure notification hub using Azure Resource Manager template
description: Learn how to create an Azure notification hub by using an Azure Resource Manager template (ARM template).
services: notification-hubs
author: sethmanheim
ms.author: sethm
ms.reviewer: thsomasu
ms.date: 09/21/2022
ms.lastreviewed: 05/15/2020
ms.topic: quickstart
ms.service: notification-hubs
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create a notification hub using a Resource Manager template

Azure Notification Hubs provides an easy-to-use and scaled-out push engine that enables you to send notifications to any platform (iOS, Android, Windows, Kindle, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs](notification-hubs-push-notification-overview.md).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

This quickstart uses an Azure Resource Manager template to create an Azure Notification Hubs namespace, and a notification hub named **MyHub** within that namespace.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.notificationhubs%2Fnotification-hub%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/notification-hub/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.notificationhubs/notification-hub/azuredeploy.json":::

* [Microsoft.NotificationHubs/namespaces](/azure/templates/microsoft.notificationhubs/namespaces)
* [Microsoft.NotificationHubs/namespaces/notificationHubs](/azure/templates/microsoft.notificationhubs/namespaces/notificationhubs)

## Deploy the template

Select the following image to sign in to Azure and open a template. The template takes a Notification Hubs namespace name as a parameter. The template then creates a namespace with that name and a notification hub named **MyHub** within that namespace.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.notificationhubs%2Fnotification-hub%2Fazuredeploy.json":::

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed Notification Hubs namespace and hub:

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzNotificationHub -Namespace "nhtestns123" -ResourceGroup "ContosoNotificationsGroup"
Get-AzNotificationHubsNamespace -Namespace "nhtestns123"
```

# [CLI](#tab/CLI)

```azurecli-interactive
az notification-hub show --resource-group ContosoNotificationsGroup --namespace-name nhtestns123 --name MyHub
az notification-hub namespace show --resource-group ContosoNotificationsGroup --name nhtestns123
```

---

The output looks similar to:

:::image type="content" source="media/create-notification-hub-template/verify-deploy.png" alt-text="Verify deployment":::

---

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
