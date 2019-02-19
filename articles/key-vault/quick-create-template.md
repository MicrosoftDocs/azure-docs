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

Azure Key Vault is a cloud service that provides a secure store for secrets, such as keys, passwords, certificates, and other secrets. In this quickstart, you create a key vault, and use the key vault to store a secret using a Resource Manager template. For more information on Key Vault, review the [Overview](key-vault-overview.md). This quickstart focuses on deploying a Resource Manager template. For more information on developing Resource Manager templates, see [Resource Manager documentation](/azure/azure-resource-manager/).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this article, you need:

* Your Azure AD user object ID is needed by the template to configure permissions. The following procedure gets the object ID (GUID).

    1. Run the following Azure PowerShell or Azure CLI command by select **Try it**, and then paste the script into the shell pane.  
    
        ```azurecli-interactive
        echo "Enter your email address that is associated with your Azure subscription):" &&
        read upn &&
        az ad user show --upn-or-object-id $upn --query "objectId" &&
        ```
        ```azurepowershell-interactive
        $upn = Read-Host -Prompt "Input your user principal name (email address) used to sign in to Azure"
        (Get-AzADUser -UserPrincipalName $upn).Id
        ```
    2. Write down the object ID. You need it later in the tutorial.

* To increase security, use a generated password for the virtual machine administrator account. Here is a sample for generating a password:

    ```azurecli-interactive
    openssl rand -base64 32
    ```
    Verify the generated password meets the virtual machine password requirements. Each Azure service has specific password requirements. For the VM password requirements, see [What are the password requirements when creating a VM?](../virtual-machines/windows/faq.md#what-are-the-password-requirements-when-creating-a-vm).

## Create a vault and a secret

1. Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json"><img src="./media/quick-create-template/deploy-to-azure.png" alt="deploy to azure"/></a>

2. Select or enter the following values.  Don't select **Purchase** after you enter the values.

    ![Resource Manager template Key Vault integration deploy portal](./media/resource-manager-tutorial-use-key-vault/resource-manager-tutorial-create-key-vault-portal.png)

    Unless it is specified, use the default value to create the key vault and a secret.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, and then enter a unique name for the resource group.
    * **Location**: select a location.  The default location is **Central US**.
    * **Key Vault Name**: enter a unique name for the key vault.  
    * **Tenant Id**: the template function automatically retrieve your tenant id.  Don't change the default value
    * **Ad User Id**: enter your Azure AD user object ID that you retrieved from [Prerequisites](#prerequisites).
    * **Secret Name**: enter a name for the secret that you store in the key vault.  For example, **adminpassword**
    * **Secret Value**: enter the secret value.  If you store a password, it is recommended to use the generated password you created in [Prerequisite](#prerequisite).
    * **I agree to the terms and conditions state above**: Select.
3. Select **Purchase**.

## Clean up resources

Other Key Vault quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, delete the resource group, which deletes the Key Vault and related resources. To delete the resource group through the portal:

1. Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this quickstart in the search results, select it.
2. Select **Delete resource group**.
3. In the **TYPE THE RESOURCE GROUP NAME:** box type in the name of the resource group and select **Delete**.

## Next steps

In this quickstart, you have created a Key Vault and stored a secret. To learn more about Key Vault and how you can use it with your applications, continue to the tutorial for web applications working with Key Vault.

> [!div class="nextstepaction"]
> To learn how to read a secret from Key Vault from a web application using managed identities for Azure resources, continue with the following tutorial [Configure an Azure web application to read a secret from Key vault](quick-create-net.md).
