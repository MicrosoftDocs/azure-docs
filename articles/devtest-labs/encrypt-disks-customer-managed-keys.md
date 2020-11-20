---
title: Encrypt OS disks using customer-managed keys in Azure DevTest Labs
description: Learn how to encrypt operating system (OS) disks using customer-managed keys in Azure DevTest Labs. 
ms.topic: article
ms.date: 09/01/2020
---

# Encrypt operating system (OS) disks using customer-managed keys in Azure DevTest Labs
Server-side encryption (SSE) protects your data and helps you meet your organizational security and compliance commitments. SSE automatically encrypts your data stored on managed disks in Azure (OS and data disks) at rest by default when persisting it to the cloud. Learn more about [Disk Encryption](../virtual-machines/windows/disk-encryption.md) on Azure. 

Within DevTest Labs, all OS disks and data disks created as part of a lab are encrypted using platform-managed keys. However, as a lab owner you can choose to encrypt lab virtual machine OS disks using your own keys. If you choose to manage encryption with your own keys, you can specify a **customer-managed key** to use for encrypting data in lab OS disks. To learn more on Server-side encryption (SSE) with customer-managed keys, and other managed disk encryption types, see [Customer-managed keys](../virtual-machines/windows/disk-encryption.md#customer-managed-keys). Also, see [restrictions with using customer-managed keys](../virtual-machines/disks-enable-customer-managed-keys-portal.md#restrictions).

> [!NOTE]
> - Currently disk encryption with a customer-managed key is supported only for OS disks in DevTest Labs. 
> 
> - The setting applies to newly created OS disks in the lab. If you choose to change the disk encryption set at some point, older disks in the lab will continue to remain encrypted using the previous disk encryption set. 

The following section shows how a lab owner can set up encryption using a customer-managed key.

## Pre-requisites

1. If you don’t have a disk encryption set, follow this article to [set up a Key Vault and a Disk Encryption Set](../virtual-machines/disks-enable-customer-managed-keys-portal.md). Note the following requirements for the disk encryption set: 

    - The disk encryption set needs to be **in same region and subscription as your lab**. 
    - Ensure you (lab owner) have at least a **reader-level access** to the disk encryption set that will be used to encrypt lab OS disks. 
1. For labs created prior to 8/1/2020, lab owner will need to ensure lab system assigned identity is enabled. To do so, lab owner can go to their lab, click on **Configuration and policies**, click on **Identity (Preview)** blade, change System Assigned identity **Status** to **On** and click on **Save**. For new labs created after 8/1/2020 lab's system assigned identity will be enabled by default. 

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/encrypt-disks-customer-managed-keys/managed-keys.png" alt-text="Managed keys":::
1. For the lab to handle encryption for all the lab OS disks, lab owner needs to explicitly grant the lab’s **system-assigned identity** reader role on the disk encryption set as well as virtual machine contributor role on the underlying Azure subscription. Lab owner can do so by completing the following steps:

   
    1. Ensure you are a member of [User Access Administrator role](../role-based-access-control/built-in-roles.md#user-access-administrator) at the Azure subscription level so that you can manage user access to Azure resources. 
    1. On the **Disk Encryption Set** page, select **Access control (IAM)** on the left menu. 
    1. Select **+ Add** on the toolbar and select **Add a role assignment**.  

        :::image type="content" source="./media/encrypt-disks-customer-managed-keys/add-role-management-menu.png" alt-text="Add role management - menu":::
    1. On the **Add role assignment** page, select the **Reader** role or a role that allows more access. 
    1. Type the lab name for which the disk encryption set will be used and select the lab name (system-assigned identity for the lab) from the dropdown-list. 
    
        :::image type="content" source="./media/encrypt-disks-customer-managed-keys/select-lab.png" alt-text="Select system-managed identity of the lab":::        
    1. Select **Save** on the toolbar. 

        :::image type="content" source="./media/encrypt-disks-customer-managed-keys/save-role-assignment.png" alt-text="Save role assignment":::
3. Add the lab's **system-assigned identity** to the **Virtual Machine Contributor** role using the **Subscription** -> **Access control (IAM)** page. The steps are similar to the ones in the previous steps. 

    
    1. Navigate to the **Subscription** page in the Azure portal. 
    1. Select **Access control (IAM)**. 
    1. Select **+Add** on the toolbar, and select **Add a role assignment**. 
    
        :::image type="content" source="./media/encrypt-disks-customer-managed-keys/subscription-access-control-page.png" alt-text="Subscription -> Access control (IAM) page":::
    1. On the **Add role assignment** page, select **Virtual Machine Contributor** for the role.
    1. Type the lab name, and select the **lab name** (system-assigned identity for the lab) from the dropdown-list. 
    1. Select **Save** on the toolbar. 

## Encrypt lab OS disks with a customer-managed key 

1. On the home page for your lab in the Azure portal, select **Configuration and policies** on the left menu. 
1. On the **Configuration and policies** page, select **Disks (Preview)** in the **Encryption** section. By default, **Encryption type** is set to **Encryption at-rest with a platform managed key**.

    :::image type="content" source="./media/encrypt-disks-customer-managed-keys/disks-page.png" alt-text="Disks tab of Configuration and policies page":::
1. For **Encryption type**, select **Encryption at-rest with a customer managed key** from drop-down list. 
1. For **Disk encryption set**, select the disk encryption set you created earlier. It's the same disk encryption set that the system-assigned identity of the lab can access.
1. Select **Save** on the toolbar. 

    :::image type="content" source="./media/encrypt-disks-customer-managed-keys/disk-encryption-set.png" alt-text="Enable encryption with customer-managed key":::
1. On the message box with the following text: *This setting will apply to newly created machines in the lab. Old OS disk will remain encrypted with the old disk encryption set*, select **OK**. 

    Once configured, lab OS disks will be encrypted with the customer-managed key provided using the disk encryption set. 
   
## How to validate if disks are being encrypted

1. Go to a lab virtual machine created after enabling disk encryption with a customer managed key on the lab.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/encrypt-disks-customer-managed-keys/enabled-encryption-vm.png" alt-text="VM with enabled disk encryption":::
1. Click on the resource group of the VM and click on the OS Disk.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/encrypt-disks-customer-managed-keys/vm-resource-group.png" alt-text="VM resource group":::
1. Go to Encryption and validate if encryption is set to customer managed key with the Disk Encryption Set you selected.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/encrypt-disks-customer-managed-keys/validate-encryption.png" alt-text="Validate encryption":::
  
## Next steps

See the following articles: 

- [Azure Disk Encryption](../virtual-machines/windows/disk-encryption.md). 
- [Customer-managed keys](../virtual-machines/windows/disk-encryption.md#customer-managed-keys) 
