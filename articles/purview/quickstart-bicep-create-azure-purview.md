---
title: 'Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using Bicep'
description: This Quickstart describes how to create a Microsoft Purview (formerly Azure Purview) account using Bicep.
author: whhender 
ms.author: whhender 
ms.date: 07/05/2022
ms.topic: quickstart
ms.service: purview
ms.custom: mode-arm
---

# Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using Bicep

This quickstart describes the steps to deploy a Microsoft Purview (formerly Azure Purview) account using Bicep.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

After you've created the account, you can begin registering your data sources and using the Microsoft Purview governance portal to understand and govern your data landscape. By connecting to data across your on-premises, multi-cloud, and software-as-a-service (SaaS) sources, the Microsoft Purview Data Map creates an up-to-date map of your information. It identifies and classifies sensitive data, and provides end-to-end data linage. Data consumers are able to discover data across your organization and data administrators are able to audit, secure, and ensure right use of your data.

For more information about the governance capabilities of Microsoft Purview, formerly Azure Purview, [see our overview page](overview.md). For more information about deploying Microsoft Purview across your organization, [see our deployment best practices](deployment-best-practices.md).

To deploy a Microsoft Purview account to your subscription, follow the prerequisites guide below.

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/data-share-share-storage-account/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.datashare/data-share-share-storage-account/main.bicep":::

The following resources are defined in the Bicep file:

* [**Microsoft.Purview/accounts**](/azure/templates/microsoft.purview/accounts)

The Bicep performs the following tasks:

* Creates a Microsoft Purview account in the specified resource group.

## Deploy the Bicep file

1. Save the Bicep file as `main.bicep` to your local computer.
1. Deploy the Bicep file using Azure CLI or Azure PowerShell.

    > [!NOTE]
    > Replace **\<project-name\>** with a project name that will be used to generate resource names. Replace **\<invitation-email\>** with an email address for receiving data share invitations.

    # [CLI](#tab/CLI)
    
    ```azurecli-interactive
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters projectName=<project-name> invitationEmail=<invitation-email>
    ```

    # [PowerShell](#tab/PowerShell)

    ```powershell-interactive
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -projectName "<project-name>" -invitationEmail "<invitation-email>"
    ```

    ---

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

To clean up the resources deployed in this quickstart, delete the resource group, which deletes all resources in the group.

You can delete the resources through the Azure portal, Azure CLI, or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```powershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you learned how to create a Microsoft Purview (formerly Azure Purview) account using Bicep and how to access the Microsoft Purview governance portal.

Next, you can create a user-assigned managed identity (UAMI) that will enable your new Microsoft Purview account to authenticate directly with resources using Azure Active Directory (Azure AD) authentication.

To create a UAMI, follow our [guide to create a user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity).

Follow these next articles to learn how to navigate the Microsoft Purview governance portal, create a collection, and grant access to Microsoft Purview:

> [!div class="nextstepaction"]
> [Using the Microsoft Purview governance portal](use-azure-purview-studio.md)
> [Create a collection](quickstart-create-collection.md)
> [Add users to your Microsoft Purview account](catalog-permissions.md)
