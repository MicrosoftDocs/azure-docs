---
title: Integration of Azure Key Vault with Azure Stack Edge resource and device activation
description: Describes how Azure Key Vault is associated with secret management during the activation of Azure Stack Edge Pro device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 007/21/2021
ms.author: alkohli
---

# Azure Key Vault integration with Azure Stack Edge 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

Azure Key Vault is integrated with Azure Stack Edge resource for secret management. This article provides details on how an Azure Key Vault is created for Azure Stack Edge resource during device activation and is then used for secret management. 


## About Key vault and Azure Stack Edge

Azure Key Vault cloud service is used to securely store and control access to tokens, passwords, certificates, API keys, and other secrets. Key Vault also makes it easy to create and control the encryption keys used to encrypt your data. For more information about allowed transactions and corresponding charges, see [Pricing for Azure Key Vault](https://azure.microsoft.com/pricing/details/key-vault/).

For Azure Stack Edge service, one of the secrets used is Channel Integrity Key (CIK). This key allows you to encrypt your secrets. With the integration of key vault, the CIK is securely stored in the key vault. For more information, see [Securely store secrets and keys](../key-vault/general/overview.md#securely-store-secrets-and-keys).


## Key vault creation

A key vault is created for Azure Stack Edge resource during the process of activation key generation. 

- When you create Azure Stack Edge resource, you need to register the *Microsoft.KeyVault* resource provider. The resource provider is automatically registered if you have owner or contributor access to the subscription. The key vault is created in the same subscription and the resource group as the Azure Stack Edge resource. 

- When you create an Azure Stack Edge resource, a Managed Service Identity (MSI) is also created that persists for the lifetime of the resource and communicates with the resource provider on the cloud. 

    When the MSI is enabled, Azure creates a trusted identity for the Azure Stack Edge resource.

- After you have created the Azure Stack Edge resource and you generate an activation key from the Azure portal, a key vault is created. This key vault is used for secret management and persists for as long as the Azure Stack Edge resource exists. 

    ![Key Vault created during activation key generation](media/azure-stack-edge-gpu-deploy-prep/azure-stack-edge-resource-3.png)

- You can choose to accept the default key name or specify a custom name for the key vault. The key vault name must be from 3 to 24 characters long. You cannot use a key vault that is already in use. The MSI is then used to authenticate to key vault to retrieve secrets.

    ![MSI created during Azure Stack Edge resource creation](media/azure-stack-edge-gpu-deploy-prep/create-resource-8.png)

- To prevent accidental deletion, a resource lock is enabled on the key vault. A soft-delete is also enabled on the key vault that allows the key vault to be restored within 90 days if there is an accidental deletion. For more information, see [Azure Key Vault soft-delete overview](../key-vault/general/soft-delete-overview.md)

- If you had an existing Azure Stack Edge resource before the Azure Key Vault was integrated with Azure Stack Edge resource, you are not affected. You can continue to use your existing Azure Stack Edge resource. 


If you run into any issues related to key vault and device activation, see [Troubleshoot device activation issues](azure-stack-edge-gpu-troubleshoot-activation.md).

## Generate activation key and create key vault

When you generate an activation key, the following events occur:

1. You request an activation key in the Azure portal. The request is then sent to key vault resource provider. 
1. A standard tier key vault with access policy is created and is locked by default. This key vault uses the default name or the custom name that you specified.
1. A storage account is also created and is used to store the audit logs. The storage account creation is a long running process and takes a few minutes.
1. A diagnostics setting is added to the key vault and the logging is enabled. 
1. The key vault authenticates with MSI the request to generate activation key. The MSI is also added to the key vault access policy and a channel integrity key (CIK) is generated and placed in the key vault.
1. The activation key is returned to the Azure portal. You can then copy this key and use it in the local UI to activate your device.

## Manage your key vault

After the activation key is generated and key vault is created, you can manage your key vault. To access the key vault and the secrets, go to **Security**. Under **Security preferences**, you see the following:

- **Key vault name**: Select to navigate to the key vault associated with your Azure Stack Edge resource. 
    - To view the secrets stored in your key vault, go to **Secrets**. BitLocker recovery key and Baseboard management controller (BMC) passwords are also stored in the key vault.
    - To view the access policies associated with your key vault, go to **Access policies**. You can see that the MSI has been given access. Select **Secret permissions**. You can see that the MSI access is restricted only to the Get and Set of the secret. 
    - To view the diagnostics settings associated with your key vault, go to **Diagnostics settings**. This setting lets you monitor how and when your key vaults are accessed, and by whom. You can see that a diagnostics setting has been created. Logs are flowing into the storage account that was also created. Audit events are also created in the key vault.
    - To view the locks on your key vault, go to **Locks**. To prevent accidental deletion, a resource lock is enabled on the key vault. 
- **Key vault diagnostics**: Select to navigate to the **Insights** associated with your key vault. This blade gives an overview of the operations performed on the key vault.
- **System assigned managed identity**: Select to view if the system assigned managed identity is enabled or disabled.  

## Regenerate activation key

In certain instances, you may need to regenerate activation key. When you regenerate an activation key, the following events occur:

1. You request to regenerate an activation key in the Azure portal. The request is then sent to the key vault resource provider.
1. The key vault authenticates with MSI the request to regenerate the activation key. 
1. The activation key is returned to the Azure portal. You can then copy this key and use it.  
1. An audit event is created in the storage account that was created when you first generated an activation key during device setup.
1. Access policies are synced on the key vault.

## Delete, recover key vault

There are two ways to delete the key vault associated with the Azure Stack Edge resource. 

1. **Delete your Azure Stack Edge resource**: When your Azure Stack Edge resource is deleted, the key vault is also deleted with the resource. You are prompted for confirmation. If you do not intend to delete this key vault, you can choose to not provide consent. Only the Azure Stack Edge resource is deleted leaving the key vault intact. 
1. **Delete the key vault**: You navigate to the key vault associated with your Azure Stack Edge resource and then delete the key vault.

    - To browse to the key vault, go to the **Properties** in your Azure Stack Edge resource. Select the key vault name. 
    - In the key vault page, go to Overview. In the right pane, select Delete.  



    If the key vault is accidentally deleted and the purge protection duration of 90 days hasn't elapsed, follow these steps to [Recover your key vault](../key-vault/general/key-vault-recovery.md#list-recover-or-purge-soft-deleted-secrets-keys-and-certificates). 

- If this key vault was used to store other keys, then you can still restore it within 90 days of deletion. During that purge protection period, the key vault name can't be used to create a new key vault.


## Purge key vault



## Next steps

- Learn more about how to [Generate activation key](azure-stack-edge-gpu-deploy-prep.md#get-the-activation-key).