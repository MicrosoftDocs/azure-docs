---
title: Setup Customer Managed Key (CMK) Encryption within an enclave
titleSuffix: Azure Enclave
description: Setup Customer Managed Key (CMK) Encryption within an enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Set-up customer-managed-key (CMK) encryption within an enclave

The fastest way to deploy customer managed keys to be compliant with the Azure Enclave policy requiring CMK is through the [Common Dependencies](./deploy-common-dependencies-service-catalog.md) service catalog template. 

Several types of [encryption](/azure/virtual-machines/windows/disk-encryption-overview) are available for securing your data on managed disks and other Azure PaaS services, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE), and encryption at host. In accordance with Azure Enclave default [governance and cybersecurity posture](./what-azure-enclave.md#multi-layered-governance-security-and-monitoring) requires customer-managed-key encryption for all resources deployed in an [enclave](./what-enclave.md).

## Prerequisites for manual deployment method
- Portal Access from Admin VM (192.168.x.x/26 usually).
  - [Create community endpoint](./create-community-endpoint-portal.md) to Azure portal and Microsoft Azure services.
    - A default endpoint can be created within the community that defines access to common Microsoft sites and endpoints. If so you can skip this step.
  - [Create enclave connection](./create-enclave-connection-portal.md) to community endpoint.
- You have the `Key Vault Contributor` role on the key vault or workload resource group that contains the key vault.

## Steps in this guide
- [Create KV RSA 2048 Key](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) or Bring your own key.
- [Create Managed Identity](./create-user-managed-identity.md) with permissions to the KV Key.

### Enclave Key Vault
Every enclave is deployed with an [Azure Key Vault](https://aka.ms/kv) in the [default resource group](./best-practices.md#enclave-managed-resource-group) for enclave infrastructure. Azure Key Vault is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys. By default, enclave contributors should be able to upload keys, secrets, or certificates to the enclave Key Vault and utilize existing Azure capabilities and design patterns of other Azure services to support CMK encryption.

Examples of setting-up CMK encryption are provided in the next steps, with more [detailed instructions](#create-cmk-via-the-portal) or articles provided.

### Create a Key in a Key Vault
- How-to Azure article - [Key creation starts after Step 6](/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault)

### Disk encryption sets (Windows IaaS)
- Read how-to Azure article - [starting after KV creation](/azure/virtual-machines/disks-enable-customer-managed-keys-portal)
- [Learn more](/azure/virtual-machines/windows/disk-encryption-windows)

### Azure PaaS example (Storage account)
- [Customer Managed Keys overview](/azure/storage/common/customer-managed-keys-overview)
- [Existing storage accounts](/azure/storage/common/customer-managed-keys-configure-existing-account)
- [New storage accounts](/azure/storage/common/customer-managed-keys-configure-new-account)

## Create CMK from the Service Catalog (fastest and easiest)
Follow these instructions to create a [key vault](./deploy-key-vault-service-catalog.md) from the Service Catalog of validated templates for common Azure services.

## Create CMK via the Portal
Alternatively, CMK can be created via the Portal
### Steps in this guide
1. [Sign in to Admin VM](./understand-admin-vm.md).
1. [Create Access Policy from Admin VM](#create-access-policy-from-admin-vm).
1. [Generate Key for CMK in Key Vault](#generate-key-for-cmk-in-key-vault).

### Enable Enclave access to the Azure portal
Key vault access is restricted to the KV virtual network so the key vault Key needs to be created from the Azure portal from within the Admin VM.
* [Create enclave connection](./create-enclave-connection-portal.md) to community endpoint for access to the Azure portal.
 
### Sign in to Admin VM
Follow [these Admin VM](./understand-admin-vm.md) instructions to sign in.

### Update Key Vault from Admin VM
1. After Admin VM sign in, open Microsoft Edge (for example, via the Start Menu).
1. Navigate to `https://portal.azure.com` or the domain specific portal URL.

### Create Access Policy from Admin VM
Key vault access is restricted to the KV virtual network so the key vault Key needs to be created from the Azure portal from within the Admin VM.
1. From the portal, navigate to the Key Vault and select the `Access Policy` on the left side.
1. Select `Create`.
1. Select the "Configure from a template" dropdown and select `Key Management`.
1. Select `Next` to the Principle tab.
1. Enter your username in the search bar and select your user account.
1. Select `Next` and then `Create`.

### Generate Key for CMK in Key Vault
1. From the portal, navigate to the Key Vault and select the `Keys` on the left side.
1. Select `Generate/Import`.
1. Enter the name for the new key.
1. Select `Create`. The default options should create an RSA 2048 key.
1. Copy the key name you created.
1. You can sign out of the Admin VM.

### Create a user-assigned managed identity
[Create a user-assigned managed identity](./create-user-managed-identity.md) for the enclave.

## Further reading
- [Configure Disk Encryption](/azure/virtual-machines/windows/disk-encryption-overview)
Read More:
- [Generate Keys on Windows](/windows-server/administration/openssh/openssh_keymanagement)
- [Configure Key Vault for Storage Account CMK](/azure/storage/common/customer-managed-keys-configure-new-account)
