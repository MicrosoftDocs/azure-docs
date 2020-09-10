---
title: Create and deploy template spec
description: Learn how to create a template spec from ARM template. Then, deploy the template spec to a resource group in your subscription.
author: tfitzmac
ms.date: 08/31/2020
ms.topic: quickstart
ms.author: tomfitz
---

# Quickstart: Create and deploy template spec (Preview)

This quickstart shows you how to package an Azure Resource Manager template (ARM template) into a [template spec](template-specs.md) and then deploy that template spec. Your template spec contains an ARM template that deploys a storage account.

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!NOTE]
> Template Specs is currently in preview. To use it, you must [sign up for the wait list](https://aka.ms/templateSpecOnboarding).
>
> After getting approved from the wait list, you'll get instructions for installing the preview PowerShell module and the preview CLI module.

## Create template spec

The template spec is a new resource type named **Microsoft.Resources/templateSpecs**. To create your template spec, you can use Azure PowerShell, Azure CLI, or an ARM template. In all options, you need an ARM template that is packaged within the template spec.

With PowerShell and CLI , the ARM template is passed in as a parameter to the command. With ARM template, the ARM template to package within the template spec is embedded within the template spec definition.

These options are shown below.

# [PowerShell](#tab/azure-powershell)

1. When you create a template spec with PowerShell, you can pass in a local template. Copy the following template and save it locally to a file named **azuredeploy.json**. This quickstart assumes you've saved to a path **c:\Templates\azuredeploy.json** but you can use any path.

    :::code language="json" source="~/quickstart-templates/101-storage-account-create/azuredeploy.json":::

1. Create a new resource group to contain the template spec.

    ```azurepowershell
    New-AzResourceGroup `
      -Name templateSpecRG `
      -Location westus2
    ```

1. Then, create the template spec in that resource group. You give the new template spec the name **storageSpec**.

    ```azurepowershell
    New-AzTemplateSpec `
      -Name storageSpec `
      -Version "1.0" `
      -ResourceGroupName templateSpecRG `
      -Location westus2 `
      -TemplateJsonFile "c:\Templates\azuredeploy.json"
    ```

# [CLI](#tab/azure-cli)

1. When you create a template spec with CLI, you can pass in a local template. Copy the following template and save it locally to a file named **azuredeploy.json**. This quickstart assumes you've saved to a path **c:\Templates\azuredeploy.json** but you can use any path.

    :::code language="json" source="~/quickstart-templates/101-storage-account-create/azuredeploy.json":::

1. Create a new resource group to contain the template spec.

    ```azurecli
    az group create \
      --name templateSpecRG \
      --location westus2
    ```

1. Then, create the template spec in that resource group. You give the new template spec the name **storageSpec**.

    ```azurecli
    az ts create \
      --name storageSpec \
      --version "1.0" \
      --resource-group templateSpecRG \
      --location "westus2" \
      --template-file "c:\Templates\azuredeploy.json"
    ```

# [ARM Template](#tab/azure-resource-manager)

1. When you use an ARM template to create the template spec, the template is embedded in the resource definition. Copy the following template and save it locally as **azuredeploy.json**. This quickstart assumes you've saved to a path **c:\Templates\azuredeploy.json** but you can use any path.

    > [!NOTE]
    > In the embedded template, all left brackets must be escaped with a second left bracket. Use `[[` instead of `[`.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "functions": [],
      "variables": {},
      "resources": [
        {
          "type": "Microsoft.Resources/templateSpecs",
          "apiVersion": "2019-06-01-preview",
          "name": "storageSpec",
          "location": "westus2",
          "properties": {
            "displayName": "Storage template spec"
          },
          "tags": {},
          "resources": [
            {
              "type": "versions",
              "apiVersion": "2019-06-01-preview",
              "name": "1.0",
              "location": "westus2",
              "dependsOn": [ "storageSpec" ],
              "properties": {
                "template": {
                  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                  "contentVersion": "1.0.0.0",
                  "parameters": {
                    "storageAccountType": {
                      "type": "string",
                      "defaultValue": "Standard_LRS",
                      "allowedValues": [
                        "Standard_LRS",
                        "Standard_GRS",
                        "Standard_ZRS",
                        "Premium_LRS"
                      ],
                      "metadata": {
                        "description": "Storage Account type"
                      }
                    },
                    "location": {
                      "type": "string",
                      "defaultValue": "[[resourceGroup().location]",
                      "metadata": {
                        "description": "Location for all resources."
                      }
                    }
                  },
                  "variables": {
                    "storageAccountName": "[[concat('store', uniquestring(resourceGroup().id))]"
                  },
                  "resources": [
                    {
                      "type": "Microsoft.Storage/storageAccounts",
                      "apiVersion": "2019-04-01",
                      "name": "[[variables('storageAccountName')]",
                      "location": "[[parameters('location')]",
                      "sku": {
                        "name": "[[parameters('storageAccountType')]"
                      },
                      "kind": "StorageV2",
                      "properties": {}
                    }
                  ],
                  "outputs": {
                    "storageAccountName": {
                      "type": "string",
                      "value": "[[variables('storageAccountName')]"
                    }
                  }
                }
              },
              "tags": {}
            }
          ]
        }
      ],
      "outputs": {}
    }
    ```

1. Use Azure CLI or PowerShell to create a new resource group.

    ```azurepowershell
    New-AzResourceGroup `
      -Name templateSpecRG `
      -Location westus2
    ```

    ```azurecli
    az group create \
      --name templateSpecRG \
      --location westus2
    ```

1. Deploy your template with Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName templateSpecRG `
      -TemplateFile "c:\Templates\azuredeploy.json"
    ```

    ```azurecli
    az deployment group create \
      --name templateSpecRG \
      --template-file "c:\Templates\azuredeploy.json"
    ```

---

## Deploy template spec

You can now deploy the template spec. Deploying the template spec is just like deploying the template it contains, except that you pass in the resource ID of the template spec. You use the same deployment commands, and if needed, pass in parameter values for the template spec.

# [PowerShell](#tab/azure-powershell)

1. Create a resource group to contain the new storage account.

    ```azurepowershell
    New-AzResourceGroup `
      -Name storageRG `
      -Location westus2
    ```

1. Get the resource ID of the template spec.

    ```azurepowershell
    $id = (Get-AzTemplateSpec -ResourceGroupName templateSpecRG -Name storageSpec -Version "1.0").Version.Id
    ```

1. Deploy the template spec.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -TemplateSpecId $id `
      -ResourceGroupName storageRG
    ```

1. You provide parameters exactly as you would for an ARM template. Redeploy the template spec with a parameter for the storage account type.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -TemplateSpecId $id `
      -ResourceGroupName storageRG `
      -storageAccountType Standard_GRS
    ```

# [CLI](#tab/azure-cli)

1. Create a resource group to contain the new storage account.

    ```azurecli
    az group create \
      --name storageRG \
      --location westus2
    ```

1. Get the resource ID of the template spec.

    ```azurecli
    id = $(az ts show --name storageSpec --resource-group templateSpecRG --version "1.0" --query "id")
    ```

    > [!NOTE]
    > There is a known issue with getting a template spec ID and assigning it to a variable in Windows PowerShell.

1. Deploy the template spec.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id
    ```

1. You provide parameters exactly as you would for an ARM template. Redeploy the template spec with a parameter for the storage account type.

    ```azurecli
    az deployment group create \
      --resource-group storageRG \
      --template-spec $id \
      --parameters storageAccountType='Standard_GRS'
    ```

# [ARM Template](#tab/azure-resource-manager)

1. Copy the following template and save it locally to a file named **storage.json**.

    ```json
       {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "functions": [],
      "variables": {},
      "resources": [
        {
          "type": "Microsoft.Resources/deployments",
          "apiVersion": "2020-06-01",
          "name": "demo",
          "properties": {
            "templateLink": {
              "id": "[resourceId('templateSpecRG', 'Microsoft.Resources/templateSpecs/versions', 'storageSpec', '1.0')]"
            },
            "parameters": {
            },
            "mode": "Incremental"
          }
        }
      ],
      "outputs": {}
    }
    ```

1. Use Azure CLI or PowerShell to create a new resource group for the storage account.

    ```azurepowershell
    New-AzResourceGroup `
      -Name storageRG `
      -Location westus2
    ```

    ```azurecli
    az group create \
      --name storageRG \
      --location westus2
    ```

1. Deploy your template with Azure CLI or PowerShell.

    ```azurepowershell
    New-AzResourceGroupDeployment `
      -ResourceGroupName storageRG `
      -TemplateFile "c:\Templates\storage.json"
    ```

    ```azurecli
    az deployment group create \
      --name storageRG \
      --template-file "c:\Templates\storage.json"
    ```

---

## Grant access

If you want to let other users in your organization deploy your template spec, you need to grant them read access. You can assign the Reader role to an Azure AD group for the resource group that contains template specs you want to share. For more information, see [Tutorial: Grant a group access to Azure resources using Azure PowerShell](../../role-based-access-control/tutorial-role-assignments-group-powershell.md).

## Clean up resources

To clean up the resource you deployed in this quickstart, delete both resource groups that you created.

1. From the Azure portal, select Resource group from the left menu.

1. Enter the resource group name (templateSpecRG and storageRG) in the Filter by name field.

1. Select the resource group name.

1. Select Delete resource group from the top menu.

## Next steps

To learn about creating a template spec that includes linked templates, see [Create a template spec of a linked template](template-specs-create-linked.md).
