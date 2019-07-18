---
title: Use Visual Studio Code to create Azure Resource Manager template | Microsoft Docs
description: Use Visual Studio Code and the Azure Resource Manager tools extension to work on Resource Manager templates.
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: tysonn

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 03/04/2019
ms.topic: quickstart
ms.author: jgao

#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Resource Manager templates, so I can use the templates to deploy Azure resources.

---

# Quickstart: Create Azure Resource Manager templates by using Visual Studio Code

Learn how to use Visual Studio code and the Azure Resource Manager Tools extension to create and edit Azure Resource Manager templates. You can create Resource Manager templates in Visual Studio Code without the extension, but the extension provides autocomplete options that simplify template development. To understand the concepts associated with deploying and managing your Azure solutions, see [Azure Resource Manager overview](resource-group-overview.md).

In this tutorial, you deploy a storage account:

![resource manager template quickstart visual studio code diagram](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/resource-manager-template-quickstart-vscode-diagram.png)

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

- [Visual Studio Code](https://code.visualstudio.com/).
- Resource Manager Tools extension. To install, use these steps:

    1. Open Visual Studio Code.
    2. Press **CTRL+SHIFT+X** to open the Extensions pane
    3. Search for **Azure Resource Manager Tools**, and then select **Install**.
    4. Select **Reload** to finish the extension installation.

## Open a Quickstart template

Instead of creating a template from scratch, you open a template from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/). Azure QuickStart Templates is a repository for Resource Manager templates.

The template used in this quickstart is called [Create a standard storage account](https://azure.microsoft.com/resources/templates/101-storage-account-create/). The template defines an Azure Storage account resource.

1. From Visual Studio Code, select **File**>**Open File**.
2. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
    ```

3. Select **Open** to open the file.
4. Select **File**>**Save As** to save the file as **azuredeploy.json** to your local computer.

## Edit the template

To experience how to edit a template using Visual Studio Code, you add one more element into the `outputs` section to show the storage URI.

1. Add one more output to the exported template:

    ```json
    "storageUri": {
      "type": "string",
      "value": "[reference(variables('storageAccountName')).primaryEndpoints.blob]"
    }
    ```

    When you are done, the outputs section looks like:

    ```json
    "outputs": {
      "storageAccountName": {
        "type": "string",
        "value": "[variables('storageAccountName')]"
      },
      "storageUri": {
        "type": "string",
        "value": "[reference(variables('storageAccountName')).primaryEndpoints.blob]"
      }
    }
    ```

    If you copied and pasted the code inside Visual Studio Code, try to retype the **value** element to experience the IntelliSense capability of the Resource Manager Tools extension.

    ![Resource Manager template visual studio code IntelliSense](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/resource-manager-templates-visual-studio-code-intellisense.png)

2. Select **File**>**Save** to save the file.

## Deploy the template

There are many methods for deploying templates. Azure Cloud shell is used in this quickstart. The cloud shell supports both Azure CLI and Azure PowerShell. Use the tab selector to choose between CLI and PowerShell.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

1. Sign in to the [Azure Cloud shell](https://shell.azure.com)

2. Choose your preferred environment by selecting either **PowerShell** or **Bash**(CLI) on the upper left corner.  Restarting the shell is required when you switch.

    # [CLI](#tab/CLI)

    ![Azure portal Cloud shell CLI](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-choose-cli.png)

    # [PowerShell](#tab/PowerShell)

    ![Azure portal Cloud shell PowerShell](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-choose-powershell.png)

    ---

3. Select **Upload/download files**, and then select **Upload**.

    # [CLI](#tab/CLI)

    ![Azure portal Cloud shell upload file](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-upload-file.png)
   
    # [PowerShell](#tab/PowerShell)
    
    ![Azure portal Cloud shell upload file](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-upload-file-powershell.png)
    
    ---

    Select the file you saved in the previous section. The default name is **azuredeploy.json**. The template file must be accessible from the shell.

    You can optionally use the **ls** command and the **cat** command to verify the file is uploaded successfully. 

    # [CLI](#tab/CLI)

    ![Azure portal Cloud shell list file](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-list-file.png)
   
    # [PowerShell](#tab/PowerShell)
    
    ![Azure portal Cloud shell list file](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-list-file-powershell.png)
    
    ---
4. From the Cloud shell, run the following commands. Select the tab to show the PowerShell code or the CLI code.

    # [CLI](#tab/CLI)
    ```azurecli
    echo "Enter the Resource Group name:" &&
    read resourceGroupName &&
    echo "Enter the location (i.e. centralus):" &&
    read location &&
    az group create --name $resourceGroupName --location "$location" &&
    az group deployment create --resource-group $resourceGroupName --template-file "$HOME/azuredeploy.json"
    ```
   
    # [PowerShell](#tab/PowerShell)
    
    ```azurepowershell
    $resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    
    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile "$HOME/azuredeploy.json"
    ```
    
    ---

    Update the template file name if you save the file to a name other than **azuredeploy.json**. 

    The following screenshot shows a sample deployment:

    # [CLI](#tab/CLI)

    ![Azure portal Cloud shell deploy template](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-deploy-template.png)
   
    # [PowerShell](#tab/PowerShell)
    
    ![Azure portal Cloud shell deploy template](./media/resource-manager-quickstart-create-templates-use-visual-studio-code/azure-portal-cloud-shell-deploy-template-powershell.png)
    
    ---

    The storage account name and the storage URL in the outputs section are highlighted on the screenshot. You need the storage account name in the next step.

5. Run the following CLI or PowerShell command to list the newly created storage account:

    # [CLI](#tab/CLI)
    ```azurecli
    echo "Enter the Resource Group name:" &&
    read resourceGroupName &&
    echo "Enter the Storage Account name:" &&
    read storageAccountName &&
    az storage account show --resource-group $resourceGroupName --name $storageAccountName
    ```
   
    # [PowerShell](#tab/PowerShell)
    
    ```azurepowershell
    $resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
    $storageAccountName = Read-Host -Prompt "Enter the Storage Account name"
    Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName
    ```
    
    ---

To learn more about using Azure storage accounts, see [Quickstart: Upload, download, and list blobs using the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md).

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.  You shall see a total of six resources in the resource group.
4. Select **Delete resource group** from the top menu.

## Next steps

The main focus of this quickstart is to use Visual Studio Code to edit an existing template from Azure Quickstart templates. You also learned how to deploy the template using either CLI or PowerShell from the Azure Cloud shell. The templates from Azure Quickstart templates might not give you everything you need. The next tutorial shows you how to find the information from template reference so you can create an encrypted Azure Storage account.

> [!div class="nextstepaction"]
> [Create an encrypted storage account](./resource-manager-tutorial-create-encrypted-storage-accounts.md)
