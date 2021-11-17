---
title: 'Quickstart: Create a Purview account with PowerShell/Azure CLI'
description: This Quickstart describes how to create an Azure Purview account using Azure PowerShell/Azure CLI.
author: hophanms
ms.author: hophan
ms.date: 10/28/2021
ms.topic: quickstart
ms.service: purview
ms.custom: mode-api, devx-track-azurepowershell
# Customer intent: As a data steward, I want create a new Azure Purview Account so that I can scan and classify my data.
---
# Quickstart: Create an Azure Purview account using Azure PowerShell/Azure CLI

In this Quickstart, you'll create an Azure Purview account using Azure PowerShell/Azure CLI. [PowerShell reference for Purview](/powershell/module/az.purview/) is available, but this article will take you through all the steps needed to create an account with PowerShell.

Azure Purview is a data governance service that helps you manage and govern your data landscape. By connecting to data across your on-premises, multi-cloud, and software-as-a-service (SaaS) sources, Purview creates an up-to-date map of your information. It identifies and classifies sensitive data, and provides end to end linage. Data consumers are able to discover data across your organization, and data administrators are able to audit, secure, and ensure right use of your data.

For more information about Purview, [see our overview page](overview.md). For more information about deploying Purview across your organization, [see our deployment best practices](deployment-best-practices.md).

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

### Install PowerShell

 Install either Azure PowerShell or Azure CLI in your client machine to deploy the template: [Command-line deployment](../azure-resource-manager/templates/template-tutorial-create-first-template.md?tabs=azure-cli#command-line-deployment)

## Create an Azure Purview account

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

1. Create a resource group for your Purview account. You can skip this step if you already have one:

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

1. Create or Deploy the Purview account

    # [PowerShell](#tab/azure-powershell)

    Use the [New-AzPurviewAccount](/powershell/module/az.purview/new-azpurviewaccount) cmdlet to create the Purview account:

    ```azurepowershell
    New-AzPurviewAccount -Name yourPurviewAccountName -ResourceGroupName myResourceGroup -Location eastus -IdentityType SystemAssigned -SkuCapacity 4 -SkuName Standard -PublicNetworkAccess
    ```

    # [Azure CLI](#tab/azure-cli)

    1. Create a Purview template file such as `purviewtemplate.json`. You can update `name`, `location`, and `capacity` (`4` or `16`):

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

    1. Deploy Purview template

        To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

        ```azurecli
        az deployment group create --resource-group "<myResourceGroup>" --template-file "<PATH TO purviewtemplate.json>"
        ```

    ---

1. The deployment command returns results. Look for `ProvisioningState` to see whether the deployment succeeded.

1. If you deployed the Azure Purview account using a service principal, instead of a user account, you will also need to run the below command in the Azure CLI:

    ```azurecli
    az purview account add-root-collection-admin --account-name --resource-group [--object-id]
    ```

    This command will grant the user account [collection admin](catalog-permissions.md#roles) permissions on the root collection in your Azure Purview account. This allows the user to access the Purview Studio and add permission for other users. For more information about permissions in Azure Purview, see our [permissions guide](catalog-permissions.md). For more information about collections, see our [manage collections article](how-to-create-and-manage-collections.md).

## Next steps

In this quickstart, you learned how to create an Azure Purview account.

Follow these next articles to learn how to navigate the Purview Studio, create a collection, and grant access to Purview.

* [How to use the Purview Studio](use-purview-studio.md)
* [Add users to your Azure Purview account](catalog-permissions.md)
* [Create a collection](quickstart-create-collection.md)
