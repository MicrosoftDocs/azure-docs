---
title: Quickstart - Provision and activate an Azure Managed HSM
description: Quickstart showing how to provision and activate a managed HSM using Azure CLI
services: key-vault
author: msmbaldwin
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: quickstart
ms.date: 05/23/2023
ms.author: mbaldwin
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
#Customer intent: As a security admin who is new to Azure, I want to provision and activate a managed HSM
---

# Quickstart: Provision and activate a Managed HSM using Azure CLI

In this quickstart, you will create and activate an Azure Key Vault Managed HSM (Hardware Security Module) with Azure CLI. Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using **FIPS  140-2 Level 3** validated HSMs. For more information on Managed HSM, you may review the [Overview](overview.md). 

## Prerequisites

To complete the steps in this article, you must have:

* A subscription to Microsoft Azure. If you do not have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* The Azure CLI version 2.25.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Sign in to Azure

To sign in to Azure using the CLI, you can type:

```azurecli
az login
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *ContosoResourceGroup* in the *eastus2* location.

```azurecli-interactive
az group create --name "ContosoResourceGroup" --location eastus2
```

## Create a Managed HSM

Creating a Managed HSM is a two-step process:
1. Provision a Managed HSM resource.
2. Activate your Managed HSM by downloading an artifact called the *security domain*.

### Provision a Managed HSM

Use the `az keyvault create` command to create a Managed HSM. This script has three mandatory parameters: a resource group name, an HSM name, and the geographic location.

You need to provide following inputs to create a Managed HSM resource:
- A resource group where it will be placed in your subscription.
- Azure location.
- A list of initial administrators.

The following example creates an HSM named **ContosoMHSM**, in the resource group  **ContosoResourceGroup**, residing in the **East US 2** location, with **the current signed in user** as the only administrator, with **7 days retention period** for soft-delete. Read more about [Managed HSM soft-delete](soft-delete-overview.md)

```azurecli-interactive
oid=$(az ad signed-in-user show --query id -o tsv)
az keyvault create --hsm-name "ContosoMHSM" --resource-group "ContosoResourceGroup" --location "eastus2" --administrators $oid --retention-days 7
```

> [!NOTE]
> If you are using Managed Identities as the initial admins of your Managed HSM, you should input the OID/PrincipalID of the Managed Identities after '--administrators' and not the ClientID.

> [!NOTE]
> The create command can take a few minutes. Once it returns successfully you are ready to activate your HSM.

> [!WARNING]
> Managed HSM instances are considered always-in-use. If you choose to enable purge protection using the `--enable-purge-protection` flag, you will be billed for the entirety of the retention period.

The output of this command shows properties of the Managed HSM that you've created. The two most important properties are:

* **name**: In the example, the name is ContosoMHSM. You'll use this name for other commands.
* **hsmUri**: In the example, the URI is 'https://contosohsm.managedhsm.azure.net.' Applications that use your HSM through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this Managed HSM. As of yet, nobody else is authorized.

### Activate your Managed HSM

All data plane commands are disabled until the HSM is activated. For example, you will not be able to create keys or assign roles. Only the designated administrators that were assigned during the create command can activate the HSM. To activate the HSM, you must download the [Security Domain](security-domain.md).

To activate your HSM, you will need:
- To provide a minimum of three RSA key-pairs (up to a maximum of 10)
- To specify the minimum number of keys required to decrypt the security domain (called a *quorum*)

To activate the HSM, you send at least three (maximum 10) RSA public keys to the HSM. The HSM encrypts the security domain with these keys and sends it back. Once this security domain download is successfully completed, your HSM is ready to use. You also need to specify quorum, which is the minimum number of private keys required to decrypt the security domain.

The following example shows how to use  `openssl` to generate three self-signed certificates.

```azurecli-interactive
openssl req -newkey rsa:2048 -nodes -keyout cert_0.key -x509 -days 365 -out cert_0.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_1.key -x509 -days 365 -out cert_1.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_2.key -x509 -days 365 -out cert_2.cer
```

> [!IMPORTANT]
> Create and store the RSA key pairs and security domain file generated in this step securely.

Use the `az keyvault security-domain download` command to download the security domain and activate your Managed HSM. The following example uses three RSA key pairs (only public keys are needed for this command) and sets the quorum to two.

```azurecli-interactive
az keyvault security-domain download --hsm-name ContosoMHSM --sd-wrapping-keys ./certs/cert_0.cer ./certs/cert_1.cer ./certs/cert_2.cer --sd-quorum 2 --security-domain-file ContosoMHSM-SD.json
```

Please store the security domain file and the RSA key pairs securely. You will need them for disaster recovery or for creating another Managed HSM that shares same security domain so the two can share keys.

After successfully downloading the security domain, your HSM will be in active state and ready for you to use.

## Clean up resources

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, and all related resources. You can delete the resources as follows:

```azurecli-interactive
az group delete --name ContosoResourceGroup
```
> [!WARNING]
> Deleting the resource group puts the Managed HSM into a soft-deleted state. The Managed HSM will continue to be billed until it is purged. See [Managed HSM soft-delete and purge protection](recovery.md)

## Next steps

In this quickstart, you provisioned a Managed HSM and activated it. To learn more about Managed HSM and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Managed HSM](overview.md)
- Learn about [Managing keys in a managed HSM](key-management.md)
- Learn about [Role management for a managed HSM](role-management.md)
- Review [Managed HSM best practices](best-practices.md)
