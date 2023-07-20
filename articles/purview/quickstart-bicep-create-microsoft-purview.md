---
title: 'Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using a Bicep file'
description: This Quickstart describes how to create a Microsoft Purview (formerly Azure Purview) account using a Bicep file.
author: whhender
ms.author: whhender
ms.date: 09/12/2022
ms.topic: quickstart
ms.service: purview
ms.custom: devx-track-bicep
---

# Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using a Bicep file

This quickstart describes the steps to deploy a Microsoft Purview (formerly Azure Purview) account using a Bicep file.

After you've created the account, you can begin registering your data sources, and using the Microsoft Purview governance portal to understand and govern your data landscape. By connecting to data across your on-premises, multicloud, and software-as-a-service (SaaS) sources, the Microsoft Purview Data Map creates an up-to-date map of your information. It identifies and classifies sensitive data, and provides end-to-end data linage. Data consumers are able to discover data across your organization and data administrators are able to audit, secure, and ensure right use of your data.

For more information about the governance capabilities of Microsoft Purview, formerly Azure Purview, [see our overview page](overview.md). For more information about deploying Microsoft Purview across your organization, [see our deployment best practices](deployment-best-practices.md)

To deploy a Microsoft Purview account to your subscription using a Bicep file, follow the guide below.

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-purview-deployment/).

<!--- Below link needs to be updated to Purview quickstart, which I'm currently working on. --->
:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.azurepurview/azure-purview-deployment/main.bicep":::

The following resources are defined in the Bicep file:

* [Microsoft.Purview/accounts](/azure/templates/microsoft.purview/accounts?pivots=deployment-language-bicep)

The Bicep file performs the following tasks:

* Creates a Microsoft Purview account in a specified resource group.

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

    ---

You'll be prompted to enter the following values:

* **Purview name**: enter a name for the Microsoft Purview account.

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Open Microsoft Purview governance portal

After your Microsoft Purview account is created, you'll use the Microsoft Purview governance portal to access and manage it. There are two ways to open Microsoft Purview governance portal:

* Open your Microsoft Purview account in the [Azure portal](https://portal.azure.com). Select the "Open Microsoft Purview governance portal" tile on the overview page.
    :::image type="content" source="media/create-catalog-portal/open-purview-studio.png" alt-text="Screenshot showing the Microsoft Purview account overview page, with the Microsoft Purview governance portal tile highlighted.":::

* Alternatively, you can browse to [https://web.purview.azure.com](https://web.purview.azure.com), select your Microsoft Purview account, and sign in to your workspace.

## Get started with your Purview resource

After deployment, the first activities are usually:

* [Create a collection](quickstart-create-collection.md)
* [Register a resource](azure-purview-connector-overview.md)
* [Scan the resource](concept-scans-and-ingestion.md)

At this time, these actions aren't able to be taken through a Bicep file. Follow the guides above to get started!

## Clean up resources

When you no longer need them, use the Azure portal, Azure CLI, or Azure PowerShell to remove the resource group, firewall, and all related resources.

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

In this quickstart, you learned how to create a Microsoft Purview (formerly Azure Purview) account and how to access the Microsoft Purview governance portal.

Next, you can create a user-assigned managed identity (UAMI) that will enable your new Microsoft Purview account to authenticate directly with resources using Azure Active Directory (Azure AD) authentication.

To create a UAMI, follow our [guide to create a user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity).

Follow these next articles to learn how to navigate the Microsoft Purview governance portal, create a collection, and grant access to Microsoft Purview:

> [!div class="nextstepaction"]
> [Using the Microsoft Purview governance portal](use-azure-purview-studio.md)
> [Create a collection](quickstart-create-collection.md)
> [Add users to your Microsoft Purview account](catalog-permissions.md)
