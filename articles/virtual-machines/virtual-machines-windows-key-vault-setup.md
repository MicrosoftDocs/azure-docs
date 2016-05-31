<properties
	pageTitle="Setting up Key Vault for Virtual Machines in Azure Resource Manager | Microsoft Azure"
	description="How to setup a Key Vault for use with an Azure Resource Manager virtual machine"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="singhkay"
	manager="drewm"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="singhkay"/>

# Setting up Key Vault for Virtual Machines in Azure Resource Manager

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model

In Azure Resource Manager stack, secrets/certificates are modeled as resources that are provided by the Key Vault Resource Provider. To learn more about Key Vaults see [What is Azure Key Vault?](../articles/key-vault-whatis)

## Setup
In order for a Key Vault to be used with Azure Resource Manager Virtual Machines, the *EnabledForDeployment* property on the Key Vault must be set to true. You can do this in the various clients as shown below.”

#### PowerShell
For creating a Key Vault using PowerShell see [Get started with Azure Key Vault](../articles/key-vault-get-started/#vault)

For new Key Vaults, you can use this PowerShell cmdlet

	New-AzureRmKeyVault -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoResourceGroup' -Location 'East Asia' -EnabledForDeployment

For existing Key Vaults, you can use this PowerShell cmdlet

	Set-AzureRmKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -EnabledForDeployment

#### CLI
For creating the Key Vault using CLI see [Manage Key Vault using CLI](../articles/key-vault-manage-with-cli/#create-a-key-vault)

For CLI, you have to create the Key Vault first, then enable the deployment policy. You can do this using the following command

	azure keyvault set-policy ContosoKeyVault –enabled-for-deployment true

### Templates
While using templates, you need to set the `enabledForDeployment` property to `true` for the Key Vault resource.

	{
      "type": "Microsoft.KeyVault/vaults",
      "name": "ContosoKeyVault",
      "apiVersion": "2015-06-01",
      "location": "<location-of-key-vault>",
      "properties": {
        "enabledForDeployment": "true",
        ....
        ....
      }
    }

For other options you can configure while creating a Key Vault through templates see [here](https://azure.microsoft.com/en-us/documentation/templates/101-create-key-vault)