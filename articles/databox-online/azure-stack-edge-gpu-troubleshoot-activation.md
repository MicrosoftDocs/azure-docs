---
title: Use the Azure portal to troubleshoot activation errors related to Azure Stack Edge Pro with GPU| Microsoft Docs 
description: Describes how to troubleshoot Azure Stack Edge Pro GPU activation and key vault-related issues.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 10/08/2020
ms.author: alkohli
---
# Troubleshoot activation issues on your Azure Stack Edge Pro GPU device 

<!--[!INCLUDE [applies-to-skus](../../includes/azure-stack-edge-applies-to-all-sku.md)]-->

This article describes how to troubleshoot activation issues on your Azure Stack Edge Pro GPU device. 


## Activation errors

The following table summarizes the errors related to device activation and the corresponding recommended resolution.

| Error   message| Recommended   resolution |
|------------------------------------------------------|--------------------------------------|
| If the Azure Key Vault used for activation is deleted before the device is activated with the activation key, then you receive this error. <br> ![Key vault error 1](./media/azure-stack-edge-gpu-troubleshoot-activation/key-vault-error-1.png)  | If the key vault has been deleted, you can recover the key vault if the vault is in purge-protection duration. Follow the steps in [Recover a key vault](../key-vault/general/key-vault-recovery.md#list-recover-or-purge-soft-deleted-secrets-keys-and-certificates). <br>If the purge-protection duration has elapsed, then the key vault cannot be recovered. Contact Microsoft Support for next steps. |
| If the Azure Key Vault is deleted after the device is activated, and you then try to perform any operation that involves encryption, for example: **Add User**, **Add Share**, **Configure Compute**, then you receive this error. <br> ![Key vault error 2](./media/azure-stack-edge-gpu-troubleshoot-activation/key-vault-error-2.png)    | If the key vault has been deleted, you can recover the key vault if the vault is in purge-protection duration. Follow the steps in Recover a key vault. <br>If the purge-protection duration has elapsed, then the key vault cannot be recovered. Contact Microsoft Support for next steps. |
| If the Channel Integrity Key in the Azure Key Vault is deleted and you, then try to perform any operations that involve encryption, for example: **Add User**, **Add Share**, **Configure Compute** - then you will receive this error. <br> ![Key vault error 3](./media/azure-stack-edge-gpu-troubleshoot-activation/key-vault-error-3.png) | If the Channel Integrity Key in the key vault is deleted, but it is still within the purge duration, follow the steps in [Undo Key vault key removal](/powershell/module/az.keyvault/undo-azkeyvaultkeyremoval). <br>If the purge protection duration has elapsed, and if you have the key backed up, you can restore from the backup else you can't recover the key. Contact Microsoft Support for next steps. |
| If the activation key generation fails due to any error, then you receive this error. Additional details are present in the notification. <br> ![Key vault error 4](./media/azure-stack-edge-gpu-troubleshoot-activation/key-vault-error-4.png)   | Wait a few minutes and retry the operation. If the problem persists, contact Microsoft Support. |
| If the user has read-only permissions, then the user is not allowed to generate an activation key and this error is presented. <br> ![Key vault error 5](./media/azure-stack-edge-gpu-troubleshoot-activation/key-vault-error-5.png) | This could be because you don't have the right access or  *Microsoft.KeyVault* is not registered.<li>Make sure that you have owner or contributor access at the resource group level used for your Azure Stack Edge resource.</li><li>Make sure that the Microsoft.KeyVault resource provider is registered. To register a resource provider, go to the subscription used for Azure Stack Edge resource. Go to **Resource providers**, search for *Microsoft.KeyVault* and select and **Register**.</li> |

## Next steps

- Learn more on how to [Troubleshoot device issues](azure-stack-edge-gpu-troubleshoot.md).