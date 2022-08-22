---
title: Create an Azure NetApp Files volume using customer-manager keys | Microsoft Docs
description: Describes how to create a volume in Azure NetApp Files using customer-managed keys. 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 08/22/2022
ms.author: anfdocs
---

# Create an Azure NetApp Files volume using customer-manager keys

1. From Azure NetApp Files, select **Volumes** and then **+ Add volume**.    
1. Follow the instructions in [Configure network features for an Azure NetApp Files volume](azure-netapp-files/configure-network-features.md) to:  
    * [Register for the Standard network features](configure-network-features.md#register-the-feature)
    * [Set the Network Features option in volume creation page](configure-network-features.md#set-the-network-features-option)
1. For a NetApp account configured to use a customer-managed key, the Create Volume page includes an option Encryption Key Source.  
 
    To encrypt the volume with your key, select **Customer-Managed Key** in the **Encryption Key Source** dropdown menu.  
     
    When you create a volume using a customer-managed key, you must also select **Standard** for the **Network features** option. Basic network features are not supported. 

    <!-- IMAGE -->
1. Continue to complete the volume creation process. See: 
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](zure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

## Error messages and troubleshoot 

This section lists error messages and possible resolutions when Azure NetApp Files fails to configure customer-managed key encryption or create a volume using a customer-managed key. 

### Errors configuring customer-managed key encryption on a NetApp account 

| Error Condition | Resolution |
| ----------- | ----------- |
| `The operation failed because the specified key vault key was not found` | When entering key URI manually, ensure that the URI is correct. |
| `Azure Key Vault key is not a valid RSA key` | Ensure that the selected key is of type RSA. |
| `Azure Key Vault key is not enabled` | Ensure that the selected key is enabled. |
| `Azure Key Vault key is expired` | Ensure that the selected key is not expired. |
| `Azure Key Vault key has not been activated` | Ensure that the selected key is active. |
| `Key Vault URI is invalid` | When entering key URI manually, ensure that the URI is correct. | 
| `Azure Key Vault is not recoverable. Make sure that Soft-delete and Purge protection are both enabled on the Azure Key Vault` | Update the key vault recovery level to: <br> `“Recoverable/Recoverable+ProtectedSubscription/CustomizedRecoverable/CustomizedRecoverable+ProtectedSubscription”` |

### Errors creating a volume encrypted with customer-managed keys  

| Error Condition | Resolution |
| ----------- | ----------- |
| `Volume cannot be encrypted with Microsoft.KeyVault, NetAppAccount has not been configured with KeyVault encryption` | Your NetApp account does not have customer-managed key encryption enabled. Configure the NetApp account to use customer-managed key. |
| `EncryptionKeySource cannot be changed` | No resolution. The `EncryptionKeySource` property of a volume cannot be changed. |
| `Unable to use the configured encryption key, please check if key is active` | Check the following: <ol><li>Are all access policies correct on the key vault: Get, Encrypt, Decrypt?</li><li>Does a private endpoint for the key vault exist?</li><li>Is there a Virtual Network NAT in the VNet, with the delegated Azure NetApp Files subnet enabled?</li></ol> |