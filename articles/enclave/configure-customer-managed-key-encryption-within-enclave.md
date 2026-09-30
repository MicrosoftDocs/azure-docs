---
title: Configure customer-managed-key (CMK) encryption within an enclave
titleSuffix: Azure Enclave
description: Configure customer-managed-key (CMK) encryption within an enclave.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 08/24/2026
---

# Configure customer-managed key (CMK) encryption within an enclave

The fastest way to deploy customer-managed keys and stay compliant with the Azure Enclave policy requiring CMK is through the [Common Dependencies](./deploy-common-dependencies-service-catalog.md) service catalog template.

Several types of [encryption](/azure/virtual-machines/windows/disk-encryption-overview) are available for securing your data on managed disks and other Azure PaaS services, including Azure Disk Encryption (ADE), Server-Side Encryption (SSE), and encryption at host. Azure Enclave's default [governance and cybersecurity posture](./what-azure-enclave.md#multi-layered-governance-security-and-monitoring) requires customer-managed key encryption for all resources deployed in an [enclave](./what-enclave.md).

## Prerequisites for manual deployment method
- Portal access from the Admin VM (usually `192.168.x.x/26`).
  - [Create a community endpoint](./create-community-endpoint-portal.md) to the Azure portal and Microsoft Azure services.
    - A default endpoint can be created within the community that defines access to common Microsoft sites and endpoints. If so, you can skip this step.
  - [Create an enclave connection](./create-enclave-connection-portal.md) to the community endpoint.
- You have the `Key Vault Contributor` role on the key vault or on the workload resource group that contains the key vault.

## Steps in this guide
- [Create a KV RSA 2048 key](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) or bring your own key.
- [Create a managed identity](./create-user-managed-identity.md) with permissions to the KV key.

### Enclave Key Vault
Azure Enclave might create or reuse a Key Vault in the enclave managed resource group for flow-log storage CMK configuration. For customer application keys and other workload resources, create the Key Vault in a workload resource group. Azure Key Vault is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys. By default, enclave contributors can upload keys, secrets, or certificates to a Key Vault deployed for the enclave and use existing Azure capabilities and design patterns from other Azure services to support CMK encryption.

The next sections provide examples of setting up CMK encryption, with more [detailed instructions](#create-cmk-via-the-portal) or articles provided.

### Create a key in a Key Vault
- For steps to create a key, see [Set up your Azure Key Vault](/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-azure-key-vault). Key creation begins at step 6 of that article.

### Disk encryption sets (Windows IaaS)
- For steps that start after Key Vault creation, see [Use the Azure portal to enable server-side encryption with customer-managed keys](/azure/virtual-machines/disks-enable-customer-managed-keys-portal).
- [Learn more](/azure/virtual-machines/windows/disk-encryption-windows)

### Azure PaaS example (Storage account)
- [Customer-managed keys overview](/azure/storage/common/customer-managed-keys-overview)
- [Existing storage accounts](/azure/storage/common/customer-managed-keys-configure-existing-account)
- [New storage accounts](/azure/storage/common/customer-managed-keys-configure-new-account)

## Create CMK from the Service Catalog (fastest and easiest)
Follow these instructions to create a [key vault](./deploy-key-vault-service-catalog.md) from the Service Catalog of validated templates for common Azure services.

## Create CMK via the Portal
Alternatively, you can create a CMK through the Azure portal.

### Steps in this guide
1. [Enable enclave access to the Azure portal](#enable-enclave-access-to-the-azure-portal).
1. [Sign in to the Admin VM](#sign-in-to-admin-vm).
1. [Open the Azure portal from the Admin VM](#open-the-azure-portal-from-the-admin-vm).
1. [Assign Key Vault RBAC permissions from the Admin VM](#assign-key-vault-rbac-permissions-from-admin-vm).
1. [Generate a key for CMK in Key Vault](#generate-key-for-cmk-in-key-vault).

### Enable enclave access to the Azure portal
Key vault access is restricted to the KV virtual network, so you must create the key vault key from the Azure portal from within the Admin VM.
* [Create an enclave connection](./create-enclave-connection-portal.md) to the community endpoint for access to the Azure portal.

### Sign in to Admin VM
Follow [these Admin VM](./understand-admin-vm.md) instructions to sign in.

### Open the Azure portal from the Admin VM
1. After you sign in to the Admin VM, open Microsoft Edge (for example, via the Start menu).
1. Go to `https://portal.azure.com` or the domain-specific portal URL.

### Assign Key Vault RBAC permissions from Admin VM
Follow [Grant permission to applications to access an Azure key vault using Azure RBAC](/azure/key-vault/general/rbac-guide)
to assign the appropriate role at the Key Vault scope. To create and manage keys for CMK encryption, assign the
`Key Vault Crypto Officer` role to your user account.

### Generate Key for CMK in Key Vault
1. From the portal, go to the key vault and select `Keys`.
1. Select `Generate/Import`.
1. Enter the name for the new key.
1. Select **Create**. The default options create an RSA 2048 key.
1. Copy the key name you created.
1. You can sign out of the Admin VM.

### Create a user-assigned managed identity
[Create a user-assigned managed identity](./create-user-managed-identity.md) for the enclave.

## Further reading
- [Configure Disk Encryption](/azure/virtual-machines/windows/disk-encryption-overview)
- [Generate Keys on Windows](/windows-server/administration/openssh/openssh_keymanagement)
- [Configure Key Vault for Storage Account CMK](/azure/storage/common/customer-managed-keys-configure-new-account)