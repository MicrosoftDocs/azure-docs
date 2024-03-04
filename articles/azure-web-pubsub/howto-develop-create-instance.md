---
title: Create an Azure Web PubSub resource
titleSuffix: Azure Web PubSub
description: Quickstart showing how to create a Web PubSub resource from Azure portal, using Azure CLI and a Bicep template
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 03/13/2023
ms.custom: mode-ui, devx-track-azurecli, devx-track-bicep
zone_pivot_groups: azure-web-pubsub-create-resource-methods
---

# Create a Web PubSub resource

## Prerequisites

> [!div class="checklist"]
>
> - An Azure account with an active subscription. [Create a free Azure account](https://azure.microsoft.com/free/), if don't have one already.

> [!TIP]
> Web PubSub includes a generous **free tier** that can be used for testing and production purposes.

::: zone pivot="method-azure-portal"

## Create a resource from Azure portal

1. Select the New button found on the upper left-hand corner of the Azure portal. In the New screen, type **Web PubSub** in the search box and press enter.

   :::image type="content" source="./media/create-instance-portal/search-web-pubsub-in-portal.png" alt-text="Screenshot of searching the Azure Web PubSub in portal.":::

2. Select **Web PubSub** from the search results, then select **Create**.

3. Enter the following settings.

   | Setting              | Suggested value      | Description                                                                                                                                                                                   |
   | -------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Resource name**    | Globally unique name | The globally unique Name that identifies your new Web PubSub service instance. Valid characters are `a-z`, `A-Z`, `0-9`, and `-`.                                                             |
   | **Subscription**     | Your subscription    | The Azure subscription under which this new Web PubSub service instance is created.                                                                                                           |
   | **[Resource Group]** | myResourceGroup      | Name for the new resource group in which to create your Web PubSub service instance.                                                                                                          |
   | **Location**         | West US              | Choose a [region](https://azure.microsoft.com/regions/) near you.                                                                                                                             |
   | **Pricing tier**     | Free                 | You can first try Azure Web PubSub service for free. Learn more details about [Azure Web PubSub service pricing tiers](https://azure.microsoft.com/pricing/details/web-pubsub/)               |
   | **Unit count**       | -                    | Unit count specifies how many connections your Web PubSub service instance can accept. Each unit supports 1,000 concurrent connections at most. It is only configurable in the Standard tier. |

   :::image type="content" source="./media/howto-develop-create-instance/create-web-pubsub-instance-in-portal.png" alt-text="Screenshot of creating the Azure Web PubSub instance in portal.":::

4. Select **Create** to provision your Web PubSub resource.
   ::: zone-end

::: zone pivot="method-azure-cli"

## Create a resource using Azure CLI

The [Azure CLI](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation.

> [!IMPORTANT]
> This quickstart requires Azure CLI of version 2.22.0 or higher.

## Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

## Create a resource

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]
::: zone-end

::: zone pivot="method-bicep"

## Create a resource using Bicep template

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Review the Bicep file

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/azure-web-pubsub/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.web/azure-web-pubsub/main.bicep":::

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
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

   ***

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

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

::: zone-end

## Next step

Now that you have created a resource, you are ready to put it to use.
Next, you will learn how to subscribe and publish messages among your clients.

> [!div class="nextstepaction"] 
> [PubSub among clients](quickstarts-pubsub-among-clients.md)
