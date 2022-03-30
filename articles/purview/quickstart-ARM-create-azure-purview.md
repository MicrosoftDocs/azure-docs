---
title: 'Quickstart: Create an Azure Purview account using an ARM Template'
description: This Quickstart describes how to create an Azure Purview account using an ARM Template.
author: whhender
ms.author: whhender
ms.date: 03/30/2022
ms.topic: quickstart
ms.service: purview
ms.custom: mode-arm
---

# Quickstart: Create an Azure Purview account using an ARM template

This quickstart describes the steps to deploy an Azure Purview account using an Azure Resource Manager (ARM) template. From there you can begin registering your data source, and using Azure Purview to understand and govern your data landscape. By connecting to data across your on-premises, multi-cloud, and software-as-a-service (SaaS) sources, Azure Purview creates an up-to-date map of your information. It identifies and classifies sensitive data, and provides end-to-end linage. Data consumers are able to discover data across your organization, and data administrators are able to audit, secure, and ensure right use of your data.

For more information about Azure Purview, [see our overview page](overview.md). For more information about deploying Azure Purview across your organization, [see our deployment best practices](deployment-best-practices.md).

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

## Deploy a custom template

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal where you can customize values and deploy.
The template will deploy an Azure Purview account into a new or existing resource group in your subscription.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.azurepurview%2Fazure-purview-deployment%2Fazuredeploy.json)


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/data-share-share-storage-account/).

<!--- Below link needs to be updated to Purview quickstart, which I'm currently working on. --->
:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.azurepurview/azure-purview-deployment/azuredeploy.json":::

The following resources are defined in the template:

* Microsoft.Purview/accounts

The template performs the following tasks:

* Creates an Azure Purview account in the specified resource group.

## Open Azure Purview Studio

After your Azure Purview account is created, you'll use the Azure Purview Studio to access and manage it. There are two ways to open Azure Purview Studio:

* Open your Azure Purview account in the [Azure portal](https://portal.azure.com). Select the "Open Azure Purview Studio" tile on the overview page.
    :::image type="content" source="media/create-catalog-portal/open-purview-studio.png" alt-text="Screenshot showing the Azure Purview account overview page, with the Azure Purview Studio tile highlighted.":::

* Alternatively, you can browse to [https://web.purview.azure.com](https://web.purview.azure.com), select your Azure Purview account, and sign in to your workspace.

## Get started with your Purview resource

After deployment, the first activities are usually:

* [Create a collection](quickstart-create-collection.md)
* [Register a resource](azure-purview-connector-overview.md)
* [Scan the resource](concept-scans-and-ingestion.md)

At this time, these actions aren't able to be taken through an Azure Resource Manager template. Follow the guides above to get started!

## Clean up resources

To clean up the resources deployed in this quickstart, delete the resource group, which deletes the resources in the resource group.
You can delete the resources either through the Azure portal, or using the PowerShell script below.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

In this quickstart, you learned how to create an Azure Purview account and how to access it through the Azure Purview Studio.

Next, you can create a user-assigned managed identity (UAMI) that will enable your new Azure Purview account to authenticate directly with resources using Azure Active Directory (Azure AD) authentication.

To create a UAMI, follow our [guide to create a user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity).

Follow these next articles to learn how to navigate the Azure Purview Studio, create a collection, and grant access to Azure Purview:

> [!div class="nextstepaction"]
> [Using the Azure Purview Studio](use-azure-purview-studio.md)
> [Create a collection](quickstart-create-collection.md)
> [Add users to your Azure Purview account](catalog-permissions.md)



```json
        "resources": [
        {
        "type": "Microsoft.DataShare/accounts",
        "apiVersion": "2021-08-01",
        "name": "[parameters('accounts_my_datashare_account_name')]",
        "location": "<target-region>",
        "identity": {
            "type": "SystemAssigned"
        }
        "properties": {}
        }
       ]
```