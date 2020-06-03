---
title: 'Quickstart: Use a Resource Manager template to create a Windows VM'
description: In this quickstart, you learn how to use the Azure CLI to create a Windows virtual machine
author: cynthn
ms.service: virtual-machines-windows
ms.topic: quickstart
ms.workload: infrastructure
ms.date: 06/01/2020
ms.author: cynthn
ms.custom: subject-armqs

---

# Quickstart: Create a Windows virtual machine using a Resource Manager template

This quickstart shows you how to use a Resource Manager template to deploy a Windows virtual machine (VM) in Azure. 

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.



## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-vm-simple-windows/).

```json
:::code language="json" source="~/quickstart-templates/101-vm-simple-windows/azuredeploy.json" range="000-000" highlight="000-000":::
``` 

Two Azure resources are defined in the template:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create an key vault secret.

## Deploy the template


[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-vm-simple-windows%2fazuredeploy.json)

### Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    [![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json)

2. Select or enter the following values.

    ![Resource Manager template, Key Vault integration, deploy portal](../media/quick-create-template/create-key-vault-using-template-portal.png)

    Unless it is specified, use the default value to create the key vault and a secret.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**.
    * **Location**: select a location.  For example, **Central US**.
    * **Key Vault Name**: enter a name for the key vault, which must be globally unique within the .vault.azure.net namespace. You need the name in the next section when you validate the deployment.
    * **Tenant Id**: the template function automatically retrieves your tenant ID.  Don't change the default value.
    * **Ad User Id**: enter your Azure AD user object ID that you retrieved from [Prerequisites](#prerequisites).
    * **Secret Name**: enter a name for the secret that you store in the key vault.  For example, **adminpassword**.
    * **Secret Value**: enter the secret value.  If you store a password, it is recommended to use the generated password you created in Prerequisites.
    * **I agree to the terms and conditions state above**: Select.
3. Select **Purchase**. After the key vault has been deployed successfully, you get a notification:

    ![Resource Manager template, Key Vault integration, deploy portal notification](../media/quick-create-template/resource-manager-template-portal-deployment-notification.png)

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can either use the Azure portal to check the key vault and the secret, or use the following Azure CLI or Azure PowerShell script to list the secret created.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter your key vault name:" &&
read keyVaultName &&
az keyvault secret list --vault-name $keyVaultName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$keyVaultName = Read-Host -Prompt "Enter your key vault name"
Get-AzKeyVaultSecret -vaultName $keyVaultName
Write-Host "Press [ENTER] to continue..."
```

---

The output looks similar to:

# [CLI](#tab/CLI)

![Resource Manager template, Key Vault integration, deploy portal validation output](../media/quick-create-template/resource-manager-template-portal-deployment-cli-output.png)

# [PowerShell](#tab/PowerShell)

![Resource Manager template, Key Vault integration, deploy portal validation output](../media/quick-create-template/resource-manager-template-portal-deployment-powershell-output.png)

---
## Clean up resources

Other Key Vault quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, delete the resource group, which deletes the Key Vault and related resources. To delete the resource group by using Azure CLI or Azure PowerShell:

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

---



## Next steps

In this quickstart, you deployed a simple virtual machine, open a network port for web traffic, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.


> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
