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

Creating a managed HSM is a two step process:
1. provision a Managed HSM resource
1. activate your Managed HSM by downloading the security domain

### Provision a managed HSM

Use the `az keyvault create` command to create a Managed HSM. This script has three mandatory parameters: a resource group name, an hsm name, and the geographic location.

You need to provide following inputs to create a Managed HSM resource:
- name for the HSM
- resource group where it will be placed in your subscription
- Azure location
- a list of initial administrators
 
The example below creates an HSM named **ContosoMHSM**, in the resource group  **ContosoResourceGroup**, residing in the **East US 2** location, with **the current signed in user** as the only administrator.

```azurecli
oid=$(az ad signed-in-user show --query objectId -o tsv)
az keyvault create --hsm-name "ContosoMHSM" --resource-group "ContosoResourceGroup" --location "East US 2" --administrators $oid
```
> [!NOTE] Create command can take a few minutes. Once it returns successfully you are ready to activate your HSM.

The output of this command shows properties of the Managed HSM that you've created. The two most important properties are:

* **name**: In the example, the name is ContosoMHSM. You'll use this name for other Key Vault commands.
* **hsmUri**: In the example, the URI is https://contosohsm.managedhsm.azure.net. Applications that use your hsm through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this Managed HSM. As of yet, nobody else is authorized.


### Activate your managed HSM
All data plane commands are disabled until the HSM  is activated. You will not be able to create keys or assign roles. Only the designated administrators that were assigned during the create command can activate the HSM. To activate the HSM you must download the [Security Domain](security-domain.md).

To activate your HSM you need:
- Minimum 3 RSA key-pairs (maximum 10)
- Specify minimum number of keys required to decrypt the security domain (quorum)

To activate the HSM you send at least 3 (maximum 10) RSA public keys to the HSM. The HSM encrypts the security domain with these keys and sends it back. Once this security domain download is successfully completed, your HSM is ready to use. You also need to specify quorum, which is the minimum number of private keys required to decrypt the security domain.

The example below shows how to use  `openssl` to generate 3 self signed certificate.

```azurecli
openssl req -newkey rsa:2048 -nodes -keyout cert_0.key -x509 -days 365 -out cert_0.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_1.key -x509 -days 365 -out cert_1.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_2.key -x509 -days 365 -out cert_2.cer
```

Use the `az keyvault security-domain download` command to download the security domain and activate your managed HSM. The example below, uses 3 RSA key pairs (only public keys are needed for this command) and sets the quorum to 2.

```azurecli
az keyvault security-domain download --hsm-name ContosoMHSM --sd-wrapping-keys ./certs/cert_0.cer ./certs/cert_1.cer ./certs/cert_2.cer --sd-quorum 2 --security-domain-file ContosoMHSM-SD.json
```
Please store the security domain file and the RSA key pairs securely. You will need them for disaster recovery or for creating another managed HSM that shares same security domain, so they can share keys.

After successfully downloading the security domain, your HSM will be in active state and ready for you to use.


## Clean up resources

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, and all related resources. You can delete the resources as follows:

```azurecli
az group delete --name ContosoResourceGroup
```

## Next steps

In this quickstart you created a Key Vault and stored a secret in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Managed HSM](overview.md)
- Learn about [Managing keys in a managed HSM](key-management.md)
- Review [Managed HSM best practices](best-practices.md)
