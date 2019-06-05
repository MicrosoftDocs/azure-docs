---
title: Integrate Azure Key Vault in Resource Manager template deployment | Microsoft Docs
description: Learn how to use Azure Key Vault to pass secure parameter values during Resource Manager template deployment
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: tysonn

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 05/23/2019
ms.topic: tutorial
ms.author: jgao
ms.custom: seodec18
---

# Tutorial: Integrate Azure Key Vault in Resource Manager Template deployment

Learn how to retrieve secrets from Azure Key Vault and pass the secrets as parameters during Resource Manager deployment. The value is never exposed because you only reference its key vault ID. For more information, see [Use Azure Key Vault to pass secure parameter value during deployment](./resource-manager-keyvault-parameter.md)

In the [Set resource deployment order](./resource-manager-tutorial-create-templates-with-dependent-resources.md) tutorial, you create a virtual machine. You need to provide the virtual machine administrator username and password. Instead of providing the password, you can pre-store the password in an Azure Key Vault and then customize the template to retrieve the password from the key vault during the deployment.

![Resource Manager template Key Vault integration diagram](./media/resource-manager-tutorial-use-key-vault/resource-manager-template-key-vault-diagram.png)

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Prepare a key vault
> * Open a QuickStart template
> * Edit the parameters file
> * Deploy the template
> * Validate the deployment
> * Clean up resources

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

To complete this article, you need:

* [Visual Studio Code](https://code.visualstudio.com/) with [Resource Manager Tools extension](./resource-manager-quickstart-create-templates-use-visual-studio-code.md#prerequisites).
* To increase security, use a generated password for the virtual machine administrator account. Here is a sample for generating a password:

    ```azurecli-interactive
    openssl rand -base64 32
    ```
    Verify the generated password meets the virtual machine password requirements. Each Azure service has specific password requirements. For the VM password requirements, see [What are the password requirements when creating a VM?](../virtual-machines/windows/faq.md#what-are-the-password-requirements-when-creating-a-vm).

## Prepare a key vault

In this section, you create a key vault and add a secret to the key vault, so that you can retrieve the secret when you deploy your template. There are many ways to create a key vault. In this tutorial, you use Azure PowerShell to deploy a [Resource Manager template](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/tutorials-use-key-vault/CreateKeyVault.json). This template does:

* Create a key vault with the `enabledForTemplateDeployment` property enables. This property must be true before the template deployment process can access the secrets defined in this key vault.
* Add a secret to the key vault.  The secret stores the virtual machine administrator password.

> [!NOTE]
> If you (as the user to deploy the virtual machine template) are not the owner or the contributor of the key vault, the Owner or a Contributor of the key vault must grant you the access to the Microsoft.KeyVault/vaults/deploy/action permission for the key vault. For more information, see [Use Azure Key Vault to pass secure parameter value during deployment](./resource-manager-keyvault-parameter.md)

To run the following PowerShell script, select **Try it** to open the Cloud shell. To paste the script, right-click the shell pane, and then select **Paste**.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$upn = Read-Host -Prompt "Enter your user principal name (email address) used to sign in to Azure"
$secretValue = Read-Host -Prompt "Enter the virtual machine administrator password" -AsSecureString

$resourceGroupName = "${projectName}rg"
$keyVaultName = $projectName
$adUserId = (Get-AzADUser -UserPrincipalName $upn).Id
$templateUri = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/tutorials-use-key-vault/CreateKeyVault.json"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -keyVaultName $keyVaultName -adUserId $adUserId -secretValue $secretValue
```

A few pieces of important information:

* The resource group name is the project name with **rg** appended. To make it easier to [clean up the resources created in this tutorial](#clean-up-resources), use the same project name and resource group name when you [deploy the next template](#deploy-the-template).
* The default name for the secret name is **vmAdminPassword**. It is hardcoded in the template.
* To be able for the template to retrieve the secret, you must enable an access policy called **Enable access to Azure Resource Manager for template deployment** for the key vault. This policy is enabled in the template. For more information about this access policy, see [Deploy key vaults and secrets](./resource-manager-keyvault-parameter.md#deploy-key-vaults-and-secrets).

The template has one output value called **keyVaultId**. Write down the value. You need this ID when you deploy the virtual machine. The Resource ID format is:

```json
/subscriptions/<SubscriptionID>/resourceGroups/mykeyvaultdeploymentrg/providers/Microsoft.KeyVault/vaults/<KeyVaultName>
```

When you copy and paste the ID, the ID might be broken into multiple lines. You must merge the lines and trim the extra spaces.

To validate the deployment, run the following PowerShell command in the same shell pane to retrieve the secret in clear text. The command only works in the same shell session because it uses a variable $keyVaultName defined in the previous PowerShell script.

```azurepowershell
(Get-AzKeyVaultSecret -vaultName $keyVaultName  -name "vmAdminPassword").SecretValueText
```

Now you have prepared a key vault and a secret, the following sections show you how to customize an existing template to retrieve the secret during the deployment.

## Open a Quickstart template

Azure QuickStart Templates is a repository for Resource Manager templates. Instead of creating a template from scratch, you can find a sample template and customize it. The template used in this tutorial is called [Deploy a simple Windows VM](https://azure.microsoft.com/resources/templates/101-vm-simple-windows/).

1. From Visual Studio Code, select **File**>**Open File**.
2. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json
    ```

3. Select **Open** to open the file. It is the same scenario used in [Tutorial: create Azure Resource Manager templates with dependent resources](./resource-manager-tutorial-create-templates-with-dependent-resources.md).
4. There are five resources defined by the template:

   * `Microsoft.Storage/storageAccounts`. See the [template reference](https://docs.microsoft.com/azure/templates/Microsoft.Storage/storageAccounts).
   * `Microsoft.Network/publicIPAddresses`. See the [template reference](https://docs.microsoft.com/azure/templates/microsoft.network/publicipaddresses).
   * `Microsoft.Network/virtualNetworks`. See the [template reference](https://docs.microsoft.com/azure/templates/microsoft.network/virtualnetworks).
   * `Microsoft.Network/networkInterfaces`. See the [template reference](https://docs.microsoft.com/azure/templates/microsoft.network/networkinterfaces).
   * `Microsoft.Compute/virtualMachines`. See the [template reference](https://docs.microsoft.com/azure/templates/microsoft.compute/virtualmachines).

     It is helpful to get some basic understanding of the template before customizing it.
5. Select **File**>**Save As** to save a copy of the file to your local computer with the name **azuredeploy.json**.
6. Repeat steps 1-4 to open the following URL, and then save the file as **azuredeploy.parameters.json**.

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.parameters.json
    ```

## Edit the parameters file

You don't need to make any changes to the template file.

1. Open **azuredeploy.parameters.json** in Visual Studio Code if it is not opened.
2. Update the **adminPassword** parameter to:

    ```json
    "adminPassword": {
        "reference": {
            "keyVault": {
            "id": "/subscriptions/<SubscriptionID>/resourceGroups/mykeyvaultdeploymentrg/providers/Microsoft.KeyVault/vaults/<KeyVaultName>"
            },
            "secretName": "vmAdminPassword"
        }
    },
    ```

    > [!IMPORTANT]
    > Replace the value of **id** with the resource ID of your key vault created in the last procedure.

    ![integrate key vault and Resource Manager template virtual machine deployment parameters file](./media/resource-manager-tutorial-use-key-vault/resource-manager-tutorial-create-vm-parameters-file.png)
3. Give the values to:

    * **adminUsername**: name the virtual machine administrator account.
    * **dnsLabelPrefix**: name the dnsLabelPrefix.

    See an example in the previous screenshot.

4. Save the changes.

## Deploy the template

Follow the instructions in [Deploy the template](./resource-manager-tutorial-create-templates-with-dependent-resources.md#deploy-the-template) to deploy the template. You must upload both **azuredeploy.json** and **azuredeploy.parameters.json** to the Cloud shell, and then use the following PowerShell script to deploy the template:

```azurepowershell
$projectName = Read-Host -Prompt "Enter the same project name that is used for creating the key vault"
$location = Read-Host -Prompt "Enter the same location that is used for creating the key vault (i.e. centralus)"
$resourceGroupName = "${projectName}rg"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile "$HOME/azuredeploy.json" `
    -TemplateParameterFile "$HOME/azuredeploy.parameters.json"
```

When you deploy the template, use the same resource group as the key vault. It makes easier when you clean up the resources. You only need to delete one resource group instead of two.

## Validate the deployment

After you have successfully deployed the virtual machine, test the login using the password stored in the key vault.

1. Open the [Azure portal](https://portal.azure.com).
2. Select **Resource grouips**/**YourResourceGroupName>**/**simpleWinVM**
3. Select **connect** from the top.
4. Select **Download RDP File** and then follow the instructions to sign in into the virtual machine using the password stored in the key vault.

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that is used for creating the key vault"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -Name $resourceGroupName
```

## Next steps

In this tutorial, you retrieved a secret from Azure Key Vault, and used the secret in your template deployment.  To learn how to create linked templates, see:

> [!div class="nextstepaction"]
> [Create linked templates](./resource-manager-tutorial-create-linked-templates.md)
