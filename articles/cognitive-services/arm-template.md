---
title: "Quickstart: Azure Cognitive Services ARM templates | Microsoft Docs"
description: Get started with using an ARM template to deploy a Cognitive Services resource.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: quickstart
ms.date: 05/26/2020
ms.author: aahi
---

# Deploy a Cognitive Services 

An [Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax, which lets you state what you intend to deploy without having to write the sequence of programming commands to create it. If you want to learn more about developing Resource Manager templates, see [Resource Manager documentation](https://docs.microsoft.com/azure/azure-resource-manager/) and the [template reference](https://docs.microsoft.com/azure/templates).

## Prerequisites 

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)

The template will use your Azure AD user object ID to configure permissions. To get the object ID (GUID), run the following Azure PowerShell or Azure CLI command by select **Try it**, and then paste the script into the shell pane. To paste the script, right-click the shell, and then select **Paste**.

# [CLI](#tab/CLI)
```azurecli-interactive
echo "Enter your email address that is used to sign in to Azure:" &&
read upn &&
az ad user show --id $upn --query "objectId" &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)
```azurepowershell-interactive
$upn = Read-Host -Prompt "Enter your email address used to sign in to Azure"
(Get-AzADUser -UserPrincipalName $upn).Id
Write-Host "Press [ENTER] to continue..."
```

---

Make sure to write down the object ID. You need it in the next section of this quickstart.

## Deploy the template

You can find the template in the [Azure quickstart ARM templates](https://docs.microsoft.com/azure/templates/microsoft.cognitiveservices/accounts).

:::code language="json" source="~/quickstart-templates/101-cognitive-services-universalkey/azuredeploy.json":::


### Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    [![Deploy to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cognitive-services-universalkey%2Fazuredeploy.json)

2. Select or enter the following values. Unless it is specified, use the default value to create the key vault and a secret.

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

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-powershell).

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

he output looks similar to:

# [CLI](#tab/CLI)

<!--![Resource Manager template, Key Vault integration, deploy portal validation output](../media/quick-create-template/resource-manager-template-portal-deployment-cli-output.png)-->

# [PowerShell](#tab/PowerShell)

<!-- ![Resource Manager template, Key Vault integration, deploy portal validation output](../media/quick-create-template/resource-manager-template-portal-deployment-powershell-output.png) -->

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

In this quickstart, you created a key vault and a secret using an Azure Resource Manager template, and validated the deployment. To learn more about Key Vault and Azure Resource Manager, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Learn more about [Azure Resource Manager](../../azure-resource-manager/management/overview.md)
- Review [Azure Key Vault best practices](../general/best-practices.md)