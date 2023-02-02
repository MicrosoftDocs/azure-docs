---
title: 'Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using an ARM Template'
description: This Quickstart describes how to create a Microsoft Purview (formerly Azure Purview) account using an ARM Template.
author: whhender
ms.author: whhender
ms.date: 04/05/2022
ms.topic: quickstart
ms.service: purview
ms.custom: mode-arm
---

# Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using an ARM template

This quickstart describes the steps to deploy a Microsoft Purview (formerly Azure Purview) account using an Azure Resource Manager (ARM) template.

After you've created the account, you can begin registering your data sources and using the Microsoft Purview governance portal to understand and govern your data landscape. By connecting to data across your on-premises, multi-cloud, and software-as-a-service (SaaS) sources, the Microsoft Purview Data Map creates an up-to-date map of your information. It identifies and classifies sensitive data, and provides end-to-end data linage. Data consumers are able to discover data across your organization and data administrators are able to audit, secure, and ensure right use of your data.

For more information about the governance capabilities of Microsoft Purview, formerly Azure Purview, [see our overview page](overview.md). For more information about deploying Microsoft Purview across your organization, [see our deployment best practices](deployment-best-practices.md)

To deploy a Microsoft Purview account to your subscription using an ARM template, follow the guide below.

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

## Deploy a custom template

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal where you can customize values and deploy.
The template will deploy a Microsoft Purview account into a new or existing resource group in your subscription.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.azurepurview%2Fazure-purview-deployment%2Fazuredeploy.json)


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-purview-deployment/).

<!--- Below link needs to be updated to Purview quickstart, which I'm currently working on. --->
:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.azurepurview/azure-purview-deployment/azuredeploy.json":::

The following resources are defined in the template:

* [Microsoft.Purview/accounts](/azure/templates/microsoft.purview/accounts?pivots=deployment-language-arm-template)

The template performs the following tasks:

* Creates a Microsoft Purview account in a specified resource group.

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

At this time, these actions aren't able to be taken through an Azure Resource Manager template. Follow the guides above to get started!

## Clean up resources

To clean up the resources deployed in this quickstart, delete the resource group, which deletes all resources in the group.
You can delete the resources either through the Azure portal, or using the PowerShell script below.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

In this quickstart, you learned how to create a Microsoft Purview (formerly Azure Purview) account and how to access the Microsoft Purview governance portal.

Next, you can create a user-assigned managed identity (UAMI) that will enable your new Microsoft Purview account to authenticate directly with resources using Azure Active Directory (Azure AD) authentication.

To create a UAMI, follow our [guide to create a user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity).

Follow these next articles to learn how to navigate the Microsoft Purview governance portal, create a collection, and grant access to Microsoft Purview:

> [!div class="nextstepaction"]
> [Using the Microsoft Purview governance portal](use-azure-purview-studio.md)
> [Create a collection](quickstart-create-collection.md)
> [Add users to your Microsoft Purview account](catalog-permissions.md)
