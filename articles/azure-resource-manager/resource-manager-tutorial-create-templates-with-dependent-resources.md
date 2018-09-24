---
title: Create Azure Resource Manager templates with dependent resources | Microsoft Docs
description: Learn how to create an Azure Resource Manager template with multiple resources, and how to deploy it using the Azure portal
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: tysonn

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 09/07/2018
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: create Azure Resource Manager templates with dependent resources

Learn how to create an Azure Resource Manager template to deploy multiple resources.  After you create the template, you deploy the template using the Cloud shell from the Azure portal.

Some of the resources cannot be deployed until another resource exists. For example, you can't create the virtual machine until its storage account and network interface exist. You define this relationship by making one resource as dependent on the other resources. Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources aren't dependent on each other, Resource Manager deploys them in parallel. For more information, see [Define the order for deploying resources in Azure Resource Manager Templates](./resource-group-define-dependencies.md).

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Open a quickstart template
> * Explore the template
> * Deploy the template

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

## Explore the template

When you explore the template in this section, try to answer these questions:

- How many Azure resources defined in this template?
- One of the resources is an Azure storage account.  Does the definition look like the one used in the last tutorial?
- Can you find the template references for the resources defined in this template?
- Can you find the dependencies of the resources?

1. From Visual Studio Code, collapse the elements until you only see the first-level elements and the second-level elements inside **resources**:

    ![Visual Studio Code Azure Resource Manager templates](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-visual-studio-code.png)

    There are five resources defined by the template.
2. Expand the first resource. It is a storage account. The definition shall be identical to the one used at the begining of the last tutorial.

    ![Visual Studio Code Azure Resource Manager templates storage account definition](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-storage-account-definition.png)

3. Expand the second resource. The resource type is **Microsoft.Network/publicIPAddresses**. To find the template reference, browse to [template reference](https://docs.microsoft.com/azure/templates/), enter **public ip address** or **public ip addresses** in the **Filter by title** field. Compare the resource definition to the template reference.

    ![Visual Studio Code Azure Resource Manager templates public IP address definition](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-public-ip-address-definition.png)
4. Repeat the last step to find the template references for the other resources defined in this template.  Compare the resource definitions to the references.
5. Expand the fourth resource:

    ![Visual Studio Code Azure Resource Manager templates dependson](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-visual-studio-code-dependson.png)

    The dependsOn element enables you to define one resource as a dependent on one or more resources. In this example, this resource is a networkInterface.  It depends on two other resources:

    * publicIPAddress
    * virtualNetwork

6. Expand the fifth resource. This resource is a virtual machine. It depends on two other resources:

    * storageAccount
    * networkInterface

The following diagram illustrates the resources and the dependency information for this template:

![Visual Studio Code Azure Resource Manager templates dependency diagram](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-visual-studio-code-dependency-diagram.png)

By specifying the dependencies, Resource Manager efficiently deploys the solution. It deploys the storage account, public IP address, and virtual network in parallel because they have no dependencies. After the public IP address and virtual network are deployed, the network interface is created. When all other resources are deployed, Resource Manager deploys the virtual machine.

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