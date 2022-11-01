---
title: 'Quickstart: Create a Microsoft Purview (formerly Azure Purview) account with PowerShell/Azure CLI'
description: This Quickstart describes how to create a Microsoft Purview (formerly Azure Purview) account using Azure PowerShell/Azure CLI.
author: hophanms
ms.author: hophan
ms.date: 06/17/2022
ms.topic: quickstart
ms.service: purview
ms.custom: devx-track-azurepowershell, mode-api, devx-track-azurecli 
ms.devlang: azurecli
#Customer intent: As a data steward, I want create a new Microsoft Purview Account so that I can scan and classify my data.
---
# Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using Azure PowerShell/Azure CLI

In this Quickstart, you'll create a Microsoft Purview account using Azure PowerShell/Azure CLI. [PowerShell reference for Microsoft Purview](/powershell/module/az.purview/) is available, but this article will take you through all the steps needed to create an account with PowerShell.

The Microsoft Purview governance portal surfaces tools like the Microsoft Purview Data Map and Microsoft Purview Data Catalog that help you manage and govern your data landscape. By connecting to data across your on-premises, multi-cloud, and software-as-a-service (SaaS) sources, the Microsoft Purview Data Map creates an up-to-date map of your information. It identifies and classifies sensitive data, and provides end-to-end linage. Data consumers are able to discover data across your organization, and data administrators are able to audit, secure, and ensure right use of your data.

the governance capabilities of Microsoft Purview, formerly Azure Purview, [see our overview page](overview.md). For more information about deploying Microsoft Purview governance services across your organization, [see our deployment best practices](deployment-best-practices.md).

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

### Install PowerShell

 Install either Azure PowerShell or Azure CLI in your client machine to deploy the template: [Command-line deployment](../azure-resource-manager/templates/template-tutorial-create-first-template.md?tabs=azure-cli#command-line-deployment)

## Create an account

1. Sign in with your Azure credential

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    Connect-AzAccount
    ```

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az login
    ```

    ---

1. If you have multiple Azure subscriptions, select the subscription you want to use:

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    Set-AzContext [SubscriptionID/SubscriptionName]
    ```

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az account set --subscription [SubscriptionID/SubscriptionName]
    ```

    ---

1. Create a resource group for your account. You can skip this step if you already have one:

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name myResourceGroup -Location 'East US'
    ```

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create \
      --name myResourceGroup \
      --location "East US"
    ```

    ---

1. Create or Deploy the account:

    # [PowerShell](#tab/azure-powershell)

    Use the [New-AzPurviewAccount](/powershell/module/az.purview/new-azpurviewaccount) cmdlet to create the Microsoft Purview account:

    ```azurepowershell
    New-AzPurviewAccount -Name yourPurviewAccountName -ResourceGroupName myResourceGroup -Location eastus -IdentityType SystemAssigned -SkuCapacity 4 -SkuName Standard -PublicNetworkAccess Enabled
    ```

    # [Azure CLI](#tab/azure-cli)

    1. Create a Microsoft Purview template file such as `purviewtemplate.json`. You can update `name`, `location`, and `capacity` (`4` or `16`):

        ```json
        {
          "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "name": "<yourPurviewAccountName>",
              "type": "Microsoft.Purview/accounts",
              "apiVersion": "2020-12-01-preview",
              "location": "EastUs",
              "identity": {
                "type": "SystemAssigned"
              },
              "properties": {
                "networkAcls": {
                  "defaultAction": "Allow"
                }
              },
              "dependsOn": [],
              "sku": {
                "name": "Standard",
                "capacity": "4"
              },
              "tags": {}
            }
          ],
          "outputs": {}
        }
        ```

    1. Deploy Microsoft Purview template

        To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

        ```azurecli
        az deployment group create --resource-group "<myResourceGroup>" --template-file "<PATH TO purviewtemplate.json>"
        ```

    ---

1. The deployment command returns results. Look for `ProvisioningState` to see whether the deployment succeeded.

1. If you deployed the account using a service principal, instead of a user account, you'll also need to run the below command in the Azure CLI:

    ```azurecli
    az purview account add-root-collection-admin --account-name [Microsoft Purview Account Name] --resource-group [Resource Group Name] --object-id [User Object Id]
    ```

    This command will grant the user account [collection admin](catalog-permissions.md#roles) permissions on the root collection in your Microsoft Purview account. This allows the user to access the Microsoft Purview governance portal and add permission for other users. For more information about permissions in Microsoft Purview, see our [permissions guide](catalog-permissions.md). For more information about collections, see our [manage collections article](how-to-create-and-manage-collections.md).

## Next steps

In this quickstart, you learned how to create a Microsoft Purview (formerly Azure Purview) account.

Follow these next articles to learn how to navigate the Microsoft Purview governance portal, create a collection, and grant access to the Microsoft Purview governance portal.

* [How to use the Microsoft Purview governance portal](use-azure-purview-studio.md)
* [Grant users permissions to the governance portal](catalog-permissions.md)
* [Create a collection](quickstart-create-collection.md)
