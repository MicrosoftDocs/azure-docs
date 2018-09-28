---
title: Use condition in Azure Resource Manager templates | Microsoft Docs
description: Learn how to deploy Azure resources based on conditions.
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: tysonn

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 09/28/2018
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Use condition in Azure Resource Manager templates

Learn how to deploy Azure resources based on conditions. 

The scenario used in this tutorial is the same as used in [Tutorial: create Azure Resource Manager templates with dependent resources](./resource-manager-tutorial-create-templates-with-dependent-resources.md). In additional to a storage account, a virtual machine, a virtual network, and some other dependent resources, you also deploy an additional storage account based on the value of a parameter.  If the value of the parameter is "yes", the storage account is deployed.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Open a quickstart template
> * Explore the template
> * Deploy the template

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* [Visual Studio Code](https://code.visualstudio.com/) with [Resource Manager Tools extension](./resource-manager-quickstart-create-templates-use-visual-studio-code.md#prerequisites)

## Open a Quickstart template

Azure QuickStart Templates is a repository for Resource Manager templates. Instead of creating a template from scratch, you can find a sample template and customize it. The template used in this tutorial is called [Deploy a simple Windows VM](https://azure.microsoft.com/resources/templates/101-vm-simple-windows/).

1. From Visual Studio Code, select **File**>**Open File**.
2. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json
    ```
3. Select **Open** to open the file.
4. Select **File**>**Save As** to save a copy of the file to your local computer with the name **azuredeploy.json**.

## Modify the template

You make the following changes to the azuredpeloy.json template:

1. Make a copy of the storage account resource definition.
2. Give the new storage account a new name.
3. Add a condition to the new storage account. This new storage account is only created when the condition is true.
4. add a parameter. The condition is based on the value of this parameter

1. Open **azuredeploy.json** if it is not opened.
2. Make a copy of the storage account definition, and place it right after the existing storage account definition.
3. Update the name of the new storage account as:

    ```json
    "name": "[concat(variables('storageAccountName'), '1')]",
    ```
4. Add the following line to the beginning of the new storage account definition.

    ```json
    "condition": "[equals(parameters('deployStorage1'),'yes')]",
    ```

    The condition checks the value of a parameter called **deployStorage1**. If the parameter value is **yes**, it creates the storage account.

    After you are done, the new storage account definition looks like:

    ![resource manager use condition](./media/resource-manager-tutorial-use-conditions/resource-manager-tutorial-use-condition-template.png)

5. Add one more parameter to the template:

    ```json
    "deployStorage1": {
      "type": "string"
    }
    ```
6. Save the changes.

## Deploy the template

Follow the instructions in [Deploy the template](./resource-manager-tutorial-create-templates-with-dependent-resources.md#deploy-the-template) to deploy the template.

When you deploy the template using Azure PowerShell, you need to specify one additional parameter:

```powershell
$resourceGroupName = "<Enter the resource group name>"
$location = "<Enter the Azure location>"
$vmAdmin = "<Enter the admin username>"
$vmPassword = "<Enter the password>"
$dnsLabelPrefix = "<Enter the prefix>"

New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
$vmPW = ConvertTo-SecureString -String $vmPassword -AsPlainText -Force
New-AzureRmResourceGroupDeployment -Name mydeployment0710 -ResourceGroupName $resourceGroupName `
    -TemplateFile azuredeploy.json -adminUsername $vmAdmin -adminPassword $vmPW `
    -dnsLabelPrefix $dnsLabelPrefix -deployStorage1 "yes"
```

After the template is deployed successfully, open the resource group and check the resources in the group. You shall see two storage accounts. 

Try making another deployment with **deployStorage1**  set to "no".

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.  You shall see a total of six resources in the resource group.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you develop and deploy a template to create a virtual machine, a virtual network, and the dependent resources. To learn how to retrieve secrets from Azure Key Vault, and use the secrets in the template deployment, see:

> [!div class="nextstepaction"]
> [Integrate Key Vault in template deployment](./resource-manager-tutorial-use-key-vault.md)
