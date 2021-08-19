---
title: Azure Quickstart - Set and retrieve a certificate from Key Vault using Azure portal | Microsoft Docs
description: Quickstart showing how to set and retrieve a certificate from Azure Key Vault using the Azure portal
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/24/2020
ms.author: mbaldwin
#Customer intent:As a security admin who is new to Azure, I want to use Key Vault to securely store certificates in Azure
---
# Quickstart: Set and retrieve a certificate from Azure Key Vault using the Azure portal

Azure Key Vault is a cloud service that provides a secure store for secrets. You can securely store keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this quickstart, you create a key vault, then use it to store a certificate. For more information on Key Vault, review the [Overview](../general/overview.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a vault

1. From the Azure portal menu, or from the **Home** page, select **Create a resource**.
2. In the Search box, enter **Key Vault**.
3. From the results list, choose **Key Vault**.
4. On the Key Vault section, choose **Create**.
5. On the **Create key vault** section provide the following information:
    - **Name**: A unique name is required. For this quickstart, we use **Example-Vault**. 
    - **Subscription**: Choose a subscription.
    - Under **Resource Group**, choose **Create new** and enter a resource group name.
    - In the **Location** pull-down menu, choose a location.
    - Leave the other options to their defaults.
6. After providing the information above, select **Create**.

Take note of the two properties listed below:

* **Vault Name**: In the example, this is **Example-Vault**. You will use this name for other steps.
* **Vault URI**: In the example, this is `https://example-vault.vault.azure.net/`. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform operations on this new vault.

![Output after Key Vault creation completes](../media/certificates/quick-create-portal/vault-properties.png)

## Add a certificate to Key Vault

To add a certificate to the vault, you just need to take a couple of additional steps. In this case, we add a self-signed certificate that could be used by an application. The certificate is called **ExampleCertificate**.

1. On the Key Vault properties pages, select **Certificates**.
2. Click on **Generate/Import**.
3. On the **Create a certificate** screen choose the following values:
    - **Method of Certificate Creation**: Generate.
    - **Certificate Name**: ExampleCertificate.
    - **Subject**: CN=ExampleDomain
    - Leave the other values to their defaults. (By default, if you don't specify anything special in Advanced policy, it'll be usable as a client auth certificate.)
 4. Click **Create**.

Once that you receive the message that the certificate has been successfully created, you may click on it on the list. You can then see some of the properties. If you click on the current version, you can see the value you specified in the previous step.

![Certificate properties](../media/certificates/quick-create-portal/current-version-hidden.png)

## Export certificate from Key Vault
By clicking "Download in CER format" or "Download in PFX/PEM format" button, you can download the certificate. 

![Certificate download](../media/certificates/quick-create-portal/current-version-shown.png)

## Clean up resources

Other Key Vault quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, delete the resource group, which deletes the Key Vault and related resources. To delete the resource group through the portal:

1. Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this quickstart in the search results, select it.
2. Select **Delete resource group**.
3. In the **TYPE THE RESOURCE GROUP NAME:** box type in the name of the resource group and select **Delete**.


## Next steps

In this quickstart, you created a Key Vault and stored a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)
