---
title: Create linked Azure Resource Manager templates | Microsoft Docs
description: Learn how to create linked Azure Resource Manager templates for creating virtula machine
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: tysonn

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 08/27/2018
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: create linked Azure Resource Manager templates

Learn how to create linked Azure Resource Manager templates. You modify the same template used in []() to create the following two templates:

- Main template: create all the resources except the storage account.
- Linked template: create the storage account.

What you learn in this tutorial:

- how to create a linked template?
- how to call the linked template from the main template?
- how to pass values from the main template to the linked template?
- how to set dependencies between the two templates?

> [!div class="checklist"]
> * Open a quickstart template
> * Explore the template
> * Deploy the template
> * Clean up resources

The instructions in this tutorial create a virtual machine, a virtual network, and some other dependent resources. 

## Prerequisites

To complete this article, you need:

* [Visual Studio Code](https://code.visualstudio.com/).
* Resource Manager Tools extension.  See [Install the extension
](./resource-manager-quickstart-create-templates-use-visual-studio-code.md#prerequisites)

## Open a Quickstart template

Azure QuickStart Templates is a repository for Resource Manager templates. Instead of creating a template from scratch, you can find a sample template and customize it. The template used in this tutorial is called [Deploy a simple Windows VM](https://azure.microsoft.com/resources/templates/101-vm-simple-windows/).

1. From Visual Studio Code, select **File**>**Open File**.
2. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json
    ```
3. Select **Open** to open the file.
4. Select **File**>**Save As** to save a copy of the file to your local computer with the name **azuredeploy.json**.
5. Select **File**>**Save As** to create another copy of the file with the name **linkedTemplate.json**.

## Create the linked template

In this section, you create the linked template based off the virtual machine template.

1. Open linkedTemplate.json in Visual Studio Code.
2. Make the following changes:

    - Remove all the resources except the storage account. You remove a total of four resources.
    - Remove the content inside the **outputs** element.
    - Remove the parameters that are never used. These parameters have a green wave line underneath them. You shall only have one parameter left called **location**.
    - Remove the **variables** element.
    - Add a parameter called **storageAccountName**. The storage account name is passed from the main template to the linked template as a parameter.

    When you are done, the template shall look like:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
          "storageAccountName":{
            "type": "string",
            "metadata": {
              "description": "Azure Storage account name."
            }
          },
          "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
              "description": "Location for all resources."
            }
          }
        },
        "resources": [
          {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('storageAccountName')]",
            "apiVersion": "2016-01-01",
            "location": "[parameters('location')]",
            "sku": {
              "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {}
          }
        ],
        "outputs": {
        }
    }
    ```

## Upload the linked template



## Link to the linked template

The main template is called azuredeploy.json.

1. Open azuredeploy.json in Visual Studio Code if it is not opened.
2. Delete the storage account resource definition from the template.
3. Add the following json snippet as the first resource:

    ```json
    {
      "apiVersion": "2017-05-10",
      "name": "linkedTemplate",
      "type": "Microsoft.Resources/deployments",
      "properties": {
          "mode": "Incremental",
          "templateLink": {
              "uri":"https://mystorageaccount.blob.core.windows.net/AzureTemplates/newStorageAccount.json"
          },
          "parameters": {
              "storageAccountName":{"value": "[variables('storageAccountName')]"},
              "location":{"value": "[parameters('location')]"}
          }
      }
    },
    ```

    Pay attention to these details:

    - A `deployments` resource in the main template is used to link to another template.
    - The 'deployments' resource has a name called **linkedTemplate**. This name is used for [configuring dependency](#configure-dependency).  
    - You can only use [Incremental](./deployment-modes.md) deployment mode when calling linked templates.
    - `templateLink/uri` contains the linked template URI. The template is uploaded to a share storage account.  You can update the URI if you upload the tempalte to the Internet.
    - Use `parameters` to pass values from the main template to the linked template.

## Configure dependency

Recall from [Tutorial: create multiple resource instances using Resource Manager template](./resource-manager-tutorial-create-multiple-instances.md), the virtual machine resource depends on the storage account:

![Azure Resource Manager templates dependency diagram](./media/resource-manager-tutorial-create-linked-templates/resource-manager-template-visual-studio-code-dependency-diagram.png)

Now the storage account is defined in the linked template. You must update the main template accordingly. 

1. Open azuredeploy.json in Visual Studio Code if it is not opened.
2. Expand the virtual machine resource definition, and update **dependsOn** as shown in the following screenshot:

    ![Azure Resource Manager linked templates configure dependency ](./media/resource-manager-tutorial-create-linked-templates/resource-manager-template-linked-templates-configure-dependency.png)
    
    "linkedTemplate" is the name of the deployments resource.  

## Deploy the template

There are many methods for deploying templates.  In this tutorial, you use Cloud Shell from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com)
2. Select **Cloud Shell** from the upper right corner as shown in the following image:

    ![Azure portal Cloud shell](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell.png)
3. Select **PowerShell** from the upper left corner of the Cloud shell.  You use PowerShell in this tutorial.
4. Select **Restart**
5. Select **Upload file** from the Cloud shell:

    ![Azure portal Cloud shell upload file](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell-upload-file.png)
6. Select the file you saved earlier in the tutorial. The default name is **azuredeploy.json**.  If you have a file with the same file name, the old file will be overwritten without any notification.
7. From the Cloud shell, run the following command to verify the file is uploaded successfully. 

    ```shell
    ls
    ```

    ![Azure portal Cloud shell list file](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell-list-file.png)

    The file name shown on the screenshot is azuredeploy.json.

8. From the Cloud shell run the following command to verify the content of the JSON file:

    ```shell
    cat azuredeploy.json
    ```
9. From the Cloud shell, run the following PowerShell commands:

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
	    -dnsLabelPrefix $dnsLabelPrefix
    ```
    Here is the screenshot for a sample deployment:

    ![Azure portal Cloud shell deploy template](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell-deploy-template.png)

    On the screenshot, these values are used:

    * **$resourceGroupName**: myresourcegroup0710. 
    * **$location**: eastus2
    * **&lt;DeployName>**: mydeployment0710
    * **&lt;TemplateFile>**: azuredeploy.json
    * **Template parameter**s:

        * **adminUsername**: JohnDole
        * **adminPassword**: Pass@word123
        * **dnsLabelPrefix**: myvm0710

10. Run the following PowerShell command to list the newly created virtual machine:

    ```powershell
    Get-AzureRmVM -Name SimpleWinVM -ResourceGroupName <ResourceGroupName>
    ```

    The virtual machine name is hard-coded as **SimpleWinVM** inside the template.

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.  You shall see a total of six resources in the resource group.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you develop and deploy a template to create a virtual machine, a virtual network, and the dependent resources. To learn more about templates, see [Understand the structure and syntax of Azure Resource Manager Templates](./resource-group-authoring-templates.md).