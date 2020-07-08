---
title: Azure Key Vault Backup | Microsoft Docs
description: Use this document to help back up a secret, key, or certificate stored in Azure Key Vault.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/12/2019
ms.author: sudbalas
#Customer intent: As an Azure Key Vault administrator, I want to back up a secret, key, or certificate in my key vault.
---
# Azure Key Vault Backup

## Overview

This document will show you how to perform a backup of the individual secrets, keys, and certificates stored in your key vault. This backup is intended to provide you with an offline copy of all your secrets in the unlikely event that you lose access to your key vault.

Key Vault automatically provides several features to maintain availability and prevent data loss. This backup should only be attempted if there is a critical business justification to maintain a backup of your secrets. Backing up secrets in your key vault may introduce additional operational challenges such as maintaining multiple sets of logs, permissions, and backups when secrets expire or rotate.

Key Vault maintains availability in disaster scenarios and will automatically fail over requests to a paired region without any intervention needed from a user. For more information please see the following link. [Azure Key Vault Disaster Recovery](https://docs.microsoft.com/azure/key-vault/general/disaster-recovery-guidance)

Key Vault protects against accidental and malicious deletion of your secrets through soft-delete and purge protection. If you want protection against accidental or malicious deletion of your secrets, please configure soft-delete and purge protection features on your key vault. For more information, please see the following document. [Azure Key Vault Recovery](https://docs.microsoft.com/azure/key-vault/general/overview-soft-delete)

## Limitations

Azure Key Vault does not currently support a way to back up an entire key vault in a single operation. Any attempt to use the commands listed in this document to perform an automated backup of a key vault will not be supported by Microsoft or the Azure Key Vault Team.

Attempting to use the commands shown in the document below to create custom automation may result in errors.

* Backing up secrets with multiple versions may cause timeout errors.
* Backup creates a point-in-time snapshot. Secrets may renew during a backup causing a mismatch of encryption keys.
* Exceeding key vault service limits for requests per second will cause your key vault to be throttled and will cause the backup to fail.

## Design considerations

When you back up an object stored in key vault (secret, key, or certificate) the backup operation downloads the object as an encrypted blob. This blob cannot be decrypted outside of Azure. To get usable data from this blob, you must restore the blob into a key vault within the same Azure Subscription and Azure Geography.
[Azure Geographies](https://azure.microsoft.com/global-infrastructure/geographies/)

## Prerequisites

* Contributor level or higher permissions on an Azure Subscription
* A primary key vault containing secrets you want to back up
* A secondary key vault where secrets will be restored.

## Backup and restore using Azure portal

### Backup

1. Navigate to the Azure portal.
2. Select your key vault.
3. Navigate to the object (secret, key, or certificate) you want to back up.

    ![Image](../media/backup-1.png)

4. Select the object.
5. Select 'Download Backup'

    ![Image](../media/backup-2.png)

6. Click the 'Download' Button.

    ![Image](../media/backup-3.png)

7. Store the encrypted blob in a secure location.

### Restore

1. Navigate to the Azure portal.
2. Select your key vault.
3. Navigate to the type of object (secret, key, or certificate) you want to restore.
4. Select 'Restore Backup'

    ![Image](../media/backup-4.png)

5. Browse to the location where you stored the encrypted blob.
6. Select "Ok".

## Backup and Restore Using Azure CLI

```azurecli
## Login To Azure
az login

## Set your Subscription
az account set --subscription {AZURE SUBSCRIPTION ID}

## Register Key Vault as a Provider
az provider register -n Microsoft.KeyVault

## Backup a Certificate in Key Vault
az keyvault certificate backup --file {File Path} --name {Certificate Name} --vault-name {Key Vault Name} --subscription {SUBSCRIPTION ID}

## Backup a Key in Key Vault
az keyvault key backup --file {File Path} --name {Key Name} --vault-name {Key Vault Name} --subscription {SUBSCRIPTION ID}

## Backup a Secret in Key Vault
az keyvault secret backup --file {File Path} --name {Secret Name} --vault-name {Key Vault Name} --subscription {SUBSCRIPTION ID}

## Restore a Certificate in Key Vault
az keyvault certificate restore --file {File Path} --vault-name {Key Vault Name} --subscription {SUBSCRIPTION ID}

## Restore a Key in Key Vault
az keyvault key restore --file {File Path} --vault-name {Key Vault Name} --subscription {SUBSCRIPTION ID}

## Restore a Secret in Key Vault
az keyvault secret restore --file {File Path} --vault-name {Key Vault Name} --subscription {SUBSCRIPTION ID}

```

## Next steps

Turn on logging and monitoring for your Azure Key Vault. [Azure Key Vault Logging](https://docs.microsoft.com/azure/key-vault/general/logging)
