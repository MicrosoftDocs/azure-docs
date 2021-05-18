---
title: Encrypt an Azure storage account used by a lab in Azure DevTest Labs
description: Learn how to configure encryption of an Azure storage used by a lab in Azure DevTest Labs 
ms.topic: how-to
ms.date: 07/29/2020
---

# Encrypt Azure storage used by a lab in Azure DevTest Labs
Every lab created in Azure DevTest Labs is created with an associated Azure storage account. The storage account is used for the following purposes: 

- Storing [formula](devtest-lab-manage-formulas.md) documents that can be used to create virtual machines.
- Storing artifact results that include deployment and extension logs generated from applying artifacts. 
- [Uploading virtual hard disks (VHDs) to create custom images in the lab.](devtest-lab-create-template.md)
- Caching frequently used [artifacts](add-artifact-vm.md) and [Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md) for faster retrieval during virtual machine/environment creation.

> [!NOTE]
> The information above is critical for the lab to operate. It's stored for the life of the lab (and lab resources) unless explicitly deleted. Manually deleting these resources can lead to errors in creating lab VMs and/or formulas becoming corrupt for future use. 

## Locate the storage account and view its contents

1. On the home page for the lab, select the **resource group** on the **Overview** page. You should see the **Resource group** page for the resource group that contains the lab. 

    :::image type="content" source="./media/encrypt-storage/overview-resource-group-link.png" alt-text="Select resource group on the Overview page":::
1. Select the Azure storage account of the lab. The naming convention for the lab storage account is: `a<labNameWithoutInvalidCharacters><4-digit number>`. For example, if the lab name is `contosolab`, the storage account name could be `acontosolab7576`. 

    :::image type="content" source="./media/encrypt-storage/select-storage-account.png" alt-text="Select storage account in the resource group of the lab":::
3. On the **Storage account** page, select **Storage Explorer (preview)** on the left menu, and then select **BLOB CONTAINERS** to find relevant lab-related content. 

   :::image type="content" source="./media/encrypt-storage/storage-explorer.png" alt-text="Storage Explorer (Preview)" lightbox="./media/encrypt-storage/storage-explorer.png":::

## Encrypt the lab storage account
Azure Storage automatically encrypts your data when it's persisted to the cloud. Azure Storage encryption protects your data and helps you to meet your organizational security and compliance commitments. For more information, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).

Data in the lab storage account is encrypted with a **Microsoft-managed key**. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys for the lab’s storage account, you can specify a **customer-managed key** with Azure Key Vault to use for encrypting/decrypting data in Blob storage and in Azure Files. For more information about customer-managed keys, see [Use customer-managed keys with Azure Key Vault to manage Azure Storage encryption](../storage/common/customer-managed-keys-overview.md).

To learn how to configure customer-managed keys for Azure Storage encryption, see the following articles: 

- [Azure portal](../storage/common/customer-managed-keys-configure-key-vault.md)
- [Azure PowerShell](../storage/common/customer-managed-keys-configure-key-vault.md)
- [Azure CLI](../storage/common/customer-managed-keys-configure-key-vault.md)


## Manage the Azure Blob storage life cycle
As mentioned, the information stored in the Lab’s storage account is critical for the lab to operate without any errors. Unless explicitly deleted, this data will continue to remain in the lab’s storage account for the life of the lab or the life of specific lab virtual machines, depending on the type of data.

### Uploaded VHDs
These VHDs are used to create custom images. Removing them will make it no longer possible to create custom images from these VHDs.

### Artifacts Cache
These caches will be re-created any time artifacts are applied. They'll be refreshed with the latest content from the respective referenced repositories. So, if you delete this information to save Storage-related expenses, the relief will be temporary.

### Azure Resource Manager template Cache
These caches will be re-created any time Azure Resource Manager-based template repositories are connected and spun up in the lab. They'll be refreshed with the latest content from the respective referenced repositories. So, if you delete this information to save Storage-related expenses, the relief will be temporary.

### Formulas
These documents are used to support the option to both create formulas from existing VMs, and creating VMs from formulas. Deleting these formula documents may lead to errors while doing the following operations:

- Creating a formula from an existing lab VM
- Creating or updating formulas 
- Creating a VM from a formula.

### Artifact results
As artifacts are applied, the size of the respective artifact results can increase over time depending on the number and type of artifacts being run on lab VMs. So, as a lab owner, you may want to control the lifecycle of such documents. For more information, see [Manage the Azure Blob storage lifecycle](../storage/blobs/storage-lifecycle-management-concepts.md).

> [!IMPORTANT]
> We recommend that you do this step to reduce expenses associated with the Azure Storage account. 

For example, the following rule is used to set a 90-day expiration rule specifically for artifact results. It ensures that older artifact results are recycled from the storage account on a regular cadence.

```json
{
  "rules": [
    {
      "name": "expirationRule",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": [ "blockBlob" ],
          "prefixMatch": [ "artifacts/results" ]
        },
        "actions": {
          "baseBlob": {
            "delete": { "daysAfterModificationGreaterThan": 90 }
          },
          "snapshot": {
            "delete": { "daysAfterCreationGreaterThan": 90 }
          }
        }
      }
    }
  ]
}
```

## Next steps
To learn how to configure customer-managed keys for Azure Storage encryption, see the following articles: 

- [Azure portal](../storage/common/customer-managed-keys-configure-key-vault.md)
- [Azure PowerShell](../storage/common/customer-managed-keys-configure-key-vault.md)
- [Azure CLI](../storage/common/customer-managed-keys-configure-key-vault.md)