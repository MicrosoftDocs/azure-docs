---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/02/2021
 ms.author: rogarana
 ms.custom: include file
---
You can choose to manage encryption at the level of each managed disk, with your own keys. Server-side encryption for managed disks with customer-managed keys offers an integrated experience with Azure Key Vault. You can either import [your RSA keys](../articles/key-vault/keys/hsm-protected-keys.md) to your Key Vault or generate new RSA keys in Azure Key Vault. 

Azure managed disks handles the encryption and decryption in a fully transparent fashion using [envelope encryption](../articles/storage/common/storage-client-side-encryption.md#encryption-and-decryption-via-the-envelope-technique). It encrypts data using an [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) 256 based data encryption key (DEK), which is, in turn, protected using your keys. The Storage service generates data encryption keys and encrypts them with customer-managed keys using RSA encryption. The envelope encryption allows you to rotate (change) your keys periodically as per your compliance policies without impacting your VMs. When you rotate your keys, the Storage service re-encrypts the data encryption keys with the new customer-managed keys. 

#### Full control of your keys

You must grant access to managed disks in your Key Vault to use your keys for encrypting and decrypting the DEK. This allows you full control of your data and keys. You can disable your keys or revoke access to managed disks at any time. You can also audit the encryption key usage with Azure Key Vault monitoring to ensure that only managed disks or other trusted Azure services are accessing your keys.

When you disable or delete your key, any VMs with disks using that key will automatically shut down. After this, the VMs will not be usable unless the key is enabled again or you assign a new key.	

The following diagram shows how managed disks use Azure Active Directory and Azure Key Vault to make requests using the customer-managed key:

:::image type="content" source="media/virtual-machines-managed-disks-description-customer-managed-keys/customer-managed-keys-sse-managed-disks-workflow.png" alt-text="Managed disk and customer-managed keys workflow. An admin creates an Azure Key Vault, then creates a disk encryption set, and sets up the disk encryption set. The set is associated to a VM, which allows the disk to make use of Azure AD to authenticate":::

The following list explains the diagram in more detail:

1. An Azure Key Vault administrator creates key vault resources.
1. The key vault admin either imports their RSA keys to Key Vault or generate new RSA keys in Key Vault.
1. That administrator creates an instance of Disk Encryption Set resource, specifying an Azure Key Vault ID and a key URL. Disk Encryption Set is a new resource introduced for simplifying the key management for managed disks. 
1. When a disk encryption set is created, a [system-assigned managed identity](../articles/active-directory/managed-identities-azure-resources/overview.md) is created in Azure Active Directory (AD) and associated with the disk encryption set. 
1. The Azure key vault administrator then grants the managed identity permission to perform operations in the key vault.
1. A VM user creates disks by associating them with the disk encryption set. The VM user can also enable server-side encryption with customer-managed keys for existing resources by associating them with the disk encryption set. 
1. Managed disks use the managed identity to send requests to the Azure Key Vault.
1. For reading or writing data, managed disks sends requests to Azure Key Vault to encrypt (wrap) and decrypt (unwrap) the data encryption key in order to perform encryption and decryption of the data. 

To revoke access to customer-managed keys, see [Azure Key Vault PowerShell](/powershell/module/azurerm.keyvault/) and [Azure Key Vault CLI](/cli/azure/keyvault). Revoking access effectively blocks access to all data in the storage account, as the encryption key is inaccessible by Azure Storage.

#### Automatic key rotation of customer-managed keys (preview)

You can choose to enable automatic key rotation to the latest key version. A disk references a key via its disk encryption set. When you enable automatic rotation for a disk encryption set, the system will automatically update all managed disks, snapshots, and images referencing the disk encryption set to use the new version of the key within one hour. The feature is currently available in limited regions in preview. For regional availability, see the [Supported Regions](#supported-regions) section.
