---
title: Azure Quickstart - Set and retrieve a secret from Key Vault using Azure portal | Microsoft Docs
description: Quickstart showing how to set and retrieve a secret from Azure Key Vault using the Azure portal
services: key-vault
author: barclayn
manager: barbkess
tags: azure-resource-manager

ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 02/19/2019
ms.author: barclayn
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a secret from Azure Key Vault using Resource Manager template

[Azure Key Vault](./key-vault-overview.md) is a cloud service that provides a secure store for secrets, such as keys, passwords, certificates, and other secrets. This quickstart focuses on the process of deploying a Resource Manager template to create a key vault and a secret. For more information on developing Resource Manager templates, see [Resource Manager documentation](/azure/azure-resource-manager/) and the [template reference](/azure/templates/microsoft.keyvault/allversions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this article, you need:

* Your Azure AD user object ID is needed by the template to configure permissions. The following procedure gets the object ID (GUID).

    1. Run the following Azure PowerShell or Azure CLI command by select **Try it**, and then paste the script into the shell pane. To paste the script, right-click the shell, and then select **Paste**. 
    
        ```azurecli-interactive
        echo "Enter your email address that is associated with your Azure subscription):" &&
        read upn &&
        az ad user show --upn-or-object-id $upn --query "objectId" 
        ```
        ```azurepowershell-interactive
        $upn = Read-Host -Prompt "Input your user principal name (email address) used to sign in to Azure"
        (Get-AzADUser -UserPrincipalName $upn).Id
        ```
    2. Write down the object ID. You need it later in the tutorial.

## Create a vault and a secret

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-key-vault-create/). More Azure Key Vault template samples can be found [here](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Keyvault).

1. Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json"><img src="./media/quick-create-template/deploy-to-azure.png" alt="deploy to azure"/></a>

2. Select or enter the following values.  Don't select **Purchase** after you enter the values.

    ![Resource Manager template Key Vault integration deploy portal](./media/quick-create-template/create-key-vault-using-template-portal.png)

    Unless it is specified, use the default value to create the key vault and a secret.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**. 
    * **Location**: select a location.  For example, **Central US**.
    * **Key Vault Name**: enter a unique name for the key vault.  
    * **Tenant Id**: the template function automatically retrieve your tenant id.  Don't change the default value
    * **Ad User Id**: enter your Azure AD user object ID that you retrieved from [Prerequisites](#prerequisites).
    * **Secret Name**: enter a name for the secret that you store in the key vault.  For example, **adminpassword**
    * **Secret Value**: enter the secret value.  If you store a password, it is recommended to use the generated password you created in [Prerequisite](#prerequisite).
    * **I agree to the terms and conditions state above**: Select.
3. Select **Purchase**.

## Validate the deployment

Use the following Azure CLI or Azure PowerShell script to list the secret created.

```azurecli-interactive
echo "Enter your key vault name):" &&
read keyVaultName &&
az keyvault secret list --vault-name $keyVaultName
```
```azurepowershell-interactive
$keyVaultName = Read-Host -Prompt "Enter your key vault name"
Get-AzKeyVaultSecret -vaultName $keyVaultName
```

## Clean up resources

Other Key Vault quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, delete the resource group, which deletes the Key Vault and related resources. To delete the resource group through the portal:

1. Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this quickstart in the search results, select it.
2. Select **Delete resource group**.
3. In the **TYPE THE RESOURCE GROUP NAME:** box type in the name of the resource group and select **Delete**.

## Next steps

* [Azure Key Vault Home Page](https://azure.microsoft.com/services/key-vault/)
* [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
* [Azure SDK For Node](https://docs.microsoft.com/javascript/api/overview/azure/key-vault)
* [Azure REST API Reference](https://docs.microsoft.com/rest/api/keyvault/)