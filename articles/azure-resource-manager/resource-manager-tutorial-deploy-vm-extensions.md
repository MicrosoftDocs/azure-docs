---
title: Deploy virtual machine extensions with Azure Resource Manager templates | Microsoft Docs
description: Learn how to deploy virtual machine extensions with Azure Resource Manager templates
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: 

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 10/26/2018
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Deploy virtual machine extensions with Azure Resource Manager templates

Learn how to use [Azure virtual machine extensions](../virtual-machines/extensions/features-windows.md) to perform post-deployment configuration and automation tasks on Azure VMs. Many different VM extensions are available for use with Azure VMs. In this tutorial, you deploy a Custom Script extension from a Resource Manager template to run a PowerShell script on a VM.  The script installs Web Server on the VM.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Prepare a PowerShell scripts
> * Open a QuickStart template
> * Edit the template
> * Deploy the template

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* This tutorial uses the same base template used in the [Set resource deployment order](./resource-manager-tutorial-create-templates-with-dependent-resources.md) tutorial. It is helpful to go through that tutorial first, but not necessary if you have some basic knowledge of developing templates.
* [Visual Studio Code](https://code.visualstudio.com/) with the Resource Manager Tools extension.  See [Install the extension
](./resource-manager-quickstart-create-templates-use-visual-studio-code.md#prerequisites)
* You need to specify a password for the virtual machine administrator account. To increase security, use a generated password. Here is a sample:

    ```azurecli-interactive
    openssl rand -base64 32
    ```
    Azure Key Vault is designed to safeguard cryptographic keys and other secrets. For more information, see [Tutorial: Integrate Azure Key Vault in Resource Manager Template deployment](./resource-manager-tutorial-use-key-vault.md). We also recommend you to update your password every three months.

## Prepare a PowerShell script
A PowerShell script is called from the template that you deploy. You need to first create this script and make the script accessible to the template deployment.

1. Use a text editor to create a text file with the following PowerShell script:

    ```azurepowershell
    Install-WindowsFeature -name Web-Server -IncludeManagementTools
    ```

    The script installs IIS Web server on Windows
2. Save the file to your local computer with the file name **installWebServer.ps1**.

This PowerShell is uploaded to [https://armtutorials.blob.core.windows.net/usescriptextensions/installWebServer.ps1](https://armtutorials.blob.core.windows.net/usescriptextensions/installWebServer.ps1). If you choose to publish the file to your own location, you must update the template later in the tutorial.

## Open a Quickstart template

Azure QuickStart Templates is a repository for Resource Manager templates. Instead of creating a template from scratch, you can find a sample template and customize it. The template used in this tutorial is called [Deploy a simple Windows VM](https://azure.microsoft.com/resources/templates/101-vm-simple-windows/).

1. From Visual Studio Code, select **File**>**Open File**.
2. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json
    ```
3. Select **Open** to open the file.
4. Select **File**>**Save As** to save a copy of the file to your local computer with the name **azuredeploy.json**.

## Edit the template

In this section, you add a virtual machine extension resource to the existing template with the following content:

```json
{
    "apiVersion": "2018-06-01",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "name": "[concat(variables('vmName'),'/', 'InstallWebServer')]",
    "location": "[parameters('location')]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/',variables('vmName'))]"
    ],
    "properties": {
        "publisher": "Microsoft.Compute",
        "type": "CustomScriptExtension",
        "typeHandlerVersion": "1.7",
        "autoUpgradeMinorVersion":true,
        "settings": {
            "fileUris": [
                "https://armtutorials.blob.core.windows.net/usescriptextensions/installWebServer.ps1"
            ],
            "commandToExecute": "powershell.exe -ExecutionPolicy Unrestricted -File installWebServer.ps1"
        }
    }
}
```

To understand the resource definition, see the [extension reference](https://docs.microsoft.com/azure/templates/microsoft.compute/virtualmachines/extensions). The following are some important elements:

* **name**: Because the extension resource is a child resource of the virtual machine object, the name must have the virtual machine name prefix. See [Child resources](./resource-manager-templates-resources.md#child-resources).
* **dependsOn**: The extension resource must be created after the virtual machine has been created.
* **fileUris**: These are the locations where the script files are stored. If you choose not to use the one provided, you need to update the values.
* **commandToExecute**: This is the command to invoke the script.  

## Deploy the template

Refer to the [Deploy the template](./resource-manager-tutorial-create-multiple-instances.md#deploy-the-template) section for the deployment procedure.

## Verify the deployment

In the portal, select the VM and in the overview of the VM, use the Click to copy button to the right of the IP address to copy it and paste it into a browser tab. The default IIS welcome page will open, and should look like this:

![Azure Resource Manager deploy vm extensions customer script IIS web server](./media/resource-manager-tutorial-deploy-vm-extensions/resource-manager-template-deploy-extensions-customer-script-web-server.png)

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.  You shall see a total of six resources in the resource group.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you deploy a virtual machine and a virtual machine extension. The extension installs web server to the virtual machine. To learn how to deploy Azure resources across multiple regions, and how to use safe deployment practices, see

> [!div class="nextstepaction"]
> [Use Azure Deployment Manager](./resource-manager-tutorial-deploy-vm-extensions.md)
