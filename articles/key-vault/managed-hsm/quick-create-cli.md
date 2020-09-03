---
title: 'Quickstart: Provision and activate a managed HSM pool'
description: Quickstart showing how to provision and activate a managed HSM pool using Azure CLI
services: key-vault
author: amitbapat
manager: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: quickstart
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019
ms.date: 09/15/2020
ms.author: ambapat
#Customer intent:As a security admin who is new to Azure, I want to provision and activate a managed HSM
---
# Quickstart: Provision and activate a managed HSM pool using Azure CLI

In this quickstart, you create and activate a managed HSM pool with Azure CLI. Azure Key Vault Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguards cryptographic keys for your cloud applications, using **FIPS  140-2 Level 3** validated HSMs. For more information on Managed HSM you may review the [Overview](overview.md). Azure CLI is used to create and manage Azure resources using commands or scripts. Once that you have completed that, you will store a secret.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires the Azure CLI version 2.12.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

To sign in to Azure using the CLI you can type:

```azurecli
az login
```

For more information on login options via the CLI take a look at [sign in with Azure CLI](/cli/azure/authenticate-azure-cli?view=azure-cli-latest)

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *ContosoResourceGroup* in the *eastus2* location.

```azurecli
az group create --name "ContosoResourceGroup" --location eastus2
```

## Create a Managed HSM

Next you will create a Managed HSM in the resource group created in the previous step. You will need to provide some information:

- For this quickstart we use **Contoso-mhsm**. You must provide a unique name in your testing.
- Resource group name **ContosoResourceGroup**.
- The location **East US 2**.
- **Object IDs of the administrators** of Managed HSM. We assume that currently logged in user (using the az login command above) will be the administrator.

```azurecli
adminoid=$(az ad signed-in-user show --query objectId -o tsv)
az keyvault create --hsm-name "Contoso-Vault2" --resource-group "ContosoResourceGroup" --location eastus2 --administrators $adminoid
```

The output of this cmdlet shows properties of the newly created managed HSM. Take note of the two properties listed below:

- **Managed HSM Name**: In the example, this is **Contoso-mhsm**. You will use this name for other commands.
- **Managed HSM URI**: In the example, this is https://contoso-mhsm.managedhsm.azure.net/. Applications that use your managed HSM through its REST API must use this URI.

The managed HSM pool is now created, but it is not active yet. To activate the managed HSM you need to download the security domain. At this point, the list of administrators you provided above are the only authorized administrators who can activate the HSM.

## Download security domain to activate your managed HSM

To activate a newly provisioned managed HSM, you must activate it. To activate it, you must initialize the security domain. Downloading the security domain is just one way to activate a managed HSM. For more information on security domain and ways to activate managed HSM, please review [About managed HSM security domain](security-domains.md).

To activate a security domain you will need to provide following information:
- **RSA public key file names** - You send the public keys when using the download command. The example below uses 3.
- **quorum size** - minium number of keys required to decrypt the security domain. Must be equal to or less than the number of wrapping keys you provided with the --sd-wrapping-keys parameter.
- **security domain file name** - A file name, where the encrypted security domain will be stored.

```azurecli
az keyvault security-domain download --hsm-name "Contoso-mhsm" --sd-wrapping-keys sdw_key1.pem sdw_key2.pem sdw_key3.pem --sd-quorum 2 --security-domain-file contoso-mhsm-sd.json
```

When the security domain is successfully downloaded the managed HSM will enter the active state. Now you are ready to create keys, add new role assignments, create a full backup etc.

To verify that the HSM is activated run folowing command:

```azurecli
az keyvault show --hsm-name "Contoso-mhsm"
```

Now, you have created a Key Vault, stored a secret, and retrieved it.

## Clean up resources

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, and all related resources. You can delete the resources as follows:

```azurecli
az group delete --name ContosoResourceGroup
```

## Next steps

In this quickstart you created a Key Vault and stored a secret in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Managed HSM](overview.md)
- Learn more [About managed HSM security domain](security-domain.md)
- Learn about [Managing managed HSM with Azure CLI](manage-with-cli.md)
- Review [Managed HSM best practices](best-practices.md)
