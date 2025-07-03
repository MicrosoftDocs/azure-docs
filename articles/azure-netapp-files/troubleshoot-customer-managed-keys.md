---
title: Troubleshoot Azure NetApp Files customer-managed keys
description: Learn about error messages and resolutions you can encounter when configuring and managing customer-managed key for Azure NetApp Files volume encryption.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom:
ms.topic: troubleshooting
ms.date: 04/18/2025
ms.author: anfdocs
# Customer intent: "As a cloud administrator, I want to troubleshoot errors when configuring customer-managed keys for Azure NetApp Files encryption, so that I can ensure secure volume management and compliance with our security policies."
---
# Troubleshoot customer-managed keys for Azure NetApp Files volume encryption

Learn about error messages and resolutions you can encounter when configuring and managing [customer-managed key for Azure NetApp Files volume encryption](configure-customer-managed-keys.md).

## Errors configuring customer-managed key encryption on a NetApp account

| Error Condition | Resolution |
| ----------- | ----------- |
| `The operation failed because the specified key vault key was not found` | When entering key URI manually, ensure that the URI is correct. |
| `Azure Key Vault key is not a valid RSA key` | Ensure that the selected key is of type RSA. |
| `Azure Key Vault key is not enabled` | Ensure that the selected key is enabled. |
| `Azure Key Vault key is expired` | Ensure that the selected key is valid. |
| `Azure Key Vault key has not been activated` | Ensure that the selected key is active. |
| `Key Vault URI is invalid` | When entering key URI manually, ensure that the URI is correct. |
| `Azure Key Vault is not recoverable. Make sure that Soft-delete and Purge protection are both enabled on the Azure Key Vault` | Update the key vault recovery level to: <br> `“Recoverable/Recoverable+ProtectedSubscription/CustomizedRecoverable/CustomizedRecoverable+ProtectedSubscription”` |
| `Account must be in the same region as the Vault` | Ensure the key vault is in the same region as the NetApp account. |

## Errors creating a volume encrypted with customer-managed keys

| Error Condition | Resolution |
| ----------- | ----------- |
| `Volume cannot be encrypted with Microsoft.KeyVault, NetAppAccount has not been configured with KeyVault encryption` | Customer-managed key encryption isn't enabled on your NetApp account. Configure the NetApp account to use customer-managed keys. |
| `EncryptionKeySource cannot be changed` | No resolution: the `EncryptionKeySource` property of a volume can't be changed. |
| `Unable to use the configured encryption key, please check if key is active` | Check that: <br> -Are all access policies correct on the key vault: Get, Encrypt, Decrypt? <br> -Does a private endpoint for the key vault exist? <br> -Is there a Virtual Network NAT in the VNet, with the delegated Azure NetApp Files subnet enabled? |
| `Could not connect to the KeyVault` | Ensure that the private endpoint is set up correctly and the firewalls aren't blocking the connection from your Virtual Network to your KeyVault. |

## More information 
* [Configure customer-managed key for Azure NetApp Files volume encryption](configure-customer-managed-keys.md)
* [Configure customer-managed keys with managed Hardware Security Module](configure-customer-managed-keys-hardware.md)