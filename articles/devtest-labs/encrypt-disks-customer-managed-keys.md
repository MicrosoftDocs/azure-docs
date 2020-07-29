---
title: Encrypt OS disks using customer-managed keys in Azure DevTest Labs
description: Learn how to encrypt operating system (OS) disks using customer-managed keys in Azure DevTest Labs. 
ms.topic: article
ms.date: 07/28/2020
---

# Encrypt operating system (OS) disks using customer-managed keys in Azure DevTest Labs
Server-side encryption (SSE) protects your data and helps you meet your organizational security and compliance commitments. SSE automatically encrypts your data stored on managed disks in Azure (OS and data disks) at rest by default when persisting it to the cloud. Learn more about [Disk Encryption](../virtual-machines/windows/disk-encryption.md) on Azure. 

Within DevTest Labs, all OS disks and data disks created as part of a lab are encrypted using platform-managed keys. However, as a lab owner you can choose to encrypt lab virtual machine OS disks using your own keys. If you choose to manage encryption with your own keys, you can specify a **customer-managed key** to use for encrypting data in lab OS disks. To learn more on Server-side encryption (SSE) with customer-managed keys, and other managed disk encryption types, see [Customer-managed keys](../virtual-machines/windows/disk-encryption.md#customer-managed-keys). Also, see [restrictions with using customer-managed keys](/virtual-machines/windows/disks-enable-customer-managed-keys-portal.md#restrictions).


> [!NOTE]
> - Currently disk encryption with a customer-managed key is supported only for OS disks in DevTest Labs. 
> 
> - The setting applies to newly created OS disks in the lab. If you choose to change the disk encryption set at some point, older disks in the lab will continue to remain encrypted using the previous disk encryption set. 

The following section shows how a lab owner can set up encryption using a customer-managed key.

## Pre-requisites

- The disk encryption set needs to be in same region and subscription as your lab. 
- Ensure you (lab owner) at least a **reader-level access** to the disk encryption set that will be used to encrypt lab OS disks. If you don’t have a disk encryption set, follow this article to [set up a Key Vault and a Disk Encryption Set](../virtual-machines/windows/disks-enable-customer-managed-keys-portal.md#set-up-your-azure-key-vault). 
- For the lab to handle encryption for all the lab OS disks, lab owner needs to explicitly grant the lab’s system-assigned identity the permission to the disk encryption set. Lab owner can do so by completing the following steps:
    1. On the **Disk Encryption Set** page, select **Access control (IAM)** on the left menu. 
    1. Select **+ Add** on the toolbar and select **Add a role assignment**.  
    1. Select the **Reader** role or a role that allows more access. 
    1. Type the lab name for which the disk encryption set will be used and select the lab name (system-assigned identity for the lab) from the dropdown-list. 
    1. Select **Save** on the toolbar. 

## Encrypt lab OS disks with a customer-managed key 

1. On the home page for your lab in the Azure portal, select **Configuration and policies** on the left menu. 
1. On the **Configuration and policies** page, select **Disks (Preview)** in the **Encryption** section. 
1. By default, **Encryption type** is set to **Encryption at-rest with a platform managed key**.
1. Select **Encryption at-rest with a customer managed key**
4. Select the **disk encryption set** from the dropdown. It's the same disk encryption set that the system-assigned identity of the lab can access.
5. Select **Save** on the toolbar. 

    Once configured, lab OS disks will be encrypted with the customer-managed key provided using the disk encryption set. 

## Next steps
See the following articles: 

- [Azure Disk Encryption](../virtual-machines/windows/disk-encryption.md). 
- [Customer-managed keys](../virtual-machines/windows/disk-encryption.md#customer-managed-keys) 