---
title: Tutorial - Enable Multi-user authorization using Resource Guard
description: In this tutorial, you'll learn about how create a resource guard and enable Multi-user authorization on Recovery Services vault and Backup vault for Azure Backup.
ms.topic: tutorial
ms.date: 09/25/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Tutorial: Create a Resource Guard and enable Multi-user authorization in Azure Backup

This tutorial describes how to create a Resource Guard and enable Multi-user authorization (MUA) on a Recovery Services vault and Backup vault. This adds an additional layer of protection to critical operations on your vaults.

>[!NOTE]
>- Multi-user authorization is now generally available for both Recovery Services vaults and Backup vaults.
>- Multi-user authorization for Azure Backup is available in all public Azure regions.

Learn about [MUA concepts](multi-user-authorization-concept.md).

## Prerequisites

Before you start:

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

-  Ensure the Resource Guard and the Recovery Services vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions containing the Recovery Services vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the **Microsoft.RecoveryServices** provider. For more details, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

# [Backup vault](#tab/backup-vault)

-  Ensure the Resource Guard and the Backup vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions contain the Backup vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the provider - **Microsoft.DataProtection**4. For more information, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

---

Learn about various [MUA usage scenarios](multi-user-authorization-concept.md#usage-scenarios).

## Create a Resource Guard

The **Security admin** creates the Resource Guard. We recommend that you create it in a **different subscription** or a **different tenant** as the vault. However, it should be in the **same region** as the vault.

>[!Note]
> The Backup admin must **NOT** have *contributor* access on the Resource Guard or the subscription that contains it.
>

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

To create the Resource Guard in a tenant different from the vault tenant as a Security admin, follow these steps:

1. In the Azure portal, go to the directory under which you wish to create the Resource Guard.
   
1. Search for **Resource Guards** in the search bar and select the corresponding item from the drop-down.

   1. Select **Create** to start creating a Resource Guard.
   1. In the **Create** blade, fill in the required details for this Resource Guard.
       - Make sure the Resource Guard is in the same Azure regions as the Recovery Services vault.
       - Also, it is helpful to add a description of how to get or request access to perform actions on associated vaults when needed. This description would also appear in the associated vaults to guide the backup admin on getting the required permissions. You can edit the description later if needed, but having a well-defined description at all times is encouraged.
       
1. On the **Protected operations** tab, select the operations you need to protect using this resource guard.

   You can also [select the operations to be protected after creating the resource guard](#select-operations-to-protect-using-resource-guard).

1. Optionally, add any tags to the Resource Guard as per the requirements
1. Select **Review + Create** and then follow notifications for status and successful creation of the Resource Guard.

# [Backup vault](#tab/backup-vault)

To create the Resource Guard in a tenant different from the vault tenant as a Security admin, follow these steps:

1. In the Azure portal, go to the directory under which you want to create the Resource Guard.
     
1. Search for **Resource Guards** in the search bar and select the corresponding item from the dropdown list.
    
   1. Select **Create** to create a Resource Guard.
   1. In the **Create** blade, fill in the required details for this Resource Guard.
       - Ensure that the Resource Guard is in the same Azure regions as the Backup vault.
       - Add a description on how to request access to perform actions on associated vaults when needed. This description appears in the associated vaults to guide the Backup admin on how to get the required permissions.
       
1. On the **Protected operations** tab, select the operations you need to protect using this resource guard under the **Backup vault** tab.

   Currently, the **Protected operations** tab includes only the *Delete backup instance* option to disable.

   You can also [select the operations for protection after creating the resource guard](?pivots=vaults-recovery-services-vault#select-operations-to-protect-using-resource-guard).

1. Optionally, add any tags to the Resource Guard as per the requirements.
1. Select **Review + Create** and then follow the notifications to monitor the status and a successful creation of the Resource Guard.

---

### Select operations to protect using Resource Guard

After vault creation, the Security admin can also choose the operations for protection using the Resource Guard among all supported critical operations. By default, all supported critical operations are enabled. However, the Security admin can exempt certain operations from falling under the purview of MUA using Resource Guard.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

To select the operations for protection, follow these steps:

1. In the Resource Guard created above, go to **Properties** > **Recovery Services vault** tab.
1. Select **Disable** for operations that you wish to exclude from being authorized using the Resource Guard. 

   >[!Note]
   >The operations **Disable soft delete** and **Remove MUA protection** cannot be disabled.
1. Optionally, you can also update the description for the Resource Guard using this blade. 
1. Select **Save**.

# [Backup vault](#tab/backup-vault)

To select the operations for protection, follow these steps:

1. In the Resource Guard that you've created, go to **Properties** > **Backup vault** tab.
1. Select **Disable** for the operations that you want to exclude from being authorized.

   You can't disable the **Remove MUA protection** and **Disable soft delete** operations.

1. Optionally, in the **Backup vaults** tab, update the description for the Resource Guard.
1. Select **Save**.

---

## Assign permissions to the Backup admin on the Resource Guard to enable MUA

The Backup admin must have **Reader** role on the Resource Guard or subscription that contains the Resource Guard to enable MUA on a vault. The Security admin needs to assign this role to the Backup admin.

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

To assign the **Reader** role on the Resource Guard, follow these steps:

1. In the Resource Guard created above, go to the Access Control (IAM) blade, and then go to **Add role assignment**.
1. Select **Reader** from the list of built-in roles and select **Next**.
1. Click **Select members** and add the Backup admin’s email ID to add them as the **Reader**. Since the Backup admin is in another  tenant in this case, they will be added as guests to the tenant containing the Resource Guard.
1. Click **Select** and then proceed to **Review + assign** to complete the role assignment.

# [Backup vault](#tab/backup-vault)

To assign the **Reader** role on the Resource Guard, follow these steps:

1. In the Resource Guard created above, go to the **Access Control (IAM)** blade, and then go to **Add role assignment**.

    
1. Select **Reader** from the list of built-in roles and select **Next**.

1. Click **Select members** and add the Backup admin's email ID to assign the **Reader** role.

   As the Backup admins are in another  tenant, they'll be added as guests to the tenant that contains the Resource Guard.

1. Click **Select** > **Review + assign** to complete the role assignment.

---


## Enable MUA on a vault

Once the Backup admin has the Reader role on the Resource Guard, they can enable multi-user authorization on vaults managed by following these steps:

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

1. Go to the Recovery Services vault.
1. Go to **Properties** > **Multi-User Authorization**, and then select **Update**.
1. Now you are presented with the option to enable MUA and choose a Resource Guard using one of the following ways:

   1. You can either specify the URI of the Resource Guard, make sure you specify the URI of a Resource Guard you have **Reader** access to and that is the same regions as the vault. You can find the URI (Resource Guard ID) of the Resource Guard in its **Overview** screen:
    
   1. Or you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

      1. Click **Select Resource Guard**
      1. Select the dropdown list and choose the directory the Resource Guard is in.
      1. Select **Authenticate** to validate your identity and access.
      1. After authentication, choose the **Resource Guard** from the list displayed.

1. Select **Save** to enable MUA.

# [Backup vault](#tab/backup-vault)

1. Go to the Backup vault for which you want to configure MUA.
1. On the left panel, select **Properties**.
1. Go to **Multi-User Authorization** and select **Update**.

1. To enable MUA and choose a Resource Guard, perform one of the following actions:

   - You can either specify the URI of the Resource Guard. Ensure that you specify the URI of a Resource Guard you have **Reader** access to and it's in the same regions as the vault. You can find the URI (Resource Guard ID) of the Resource Guard on its **Overview** page.

   - Or, you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

     1. Click **Select Resource Guard**.
     1. Select the drop-down and select the directory the Resource Guard is in.
     1. Select **Authenticate** to validate your identity and access.
     1. After authentication, choose the **Resource Guard** from the list displayed.

1. Select **Save** to enable MUA.

---

## Next steps

- [Protected operations using MUA](multi-user-authorization.md?pivots=vaults-recovery-services-vault#protected-operations-using-mua)
- [Authorize critical (protected) operations using Azure Active Directory Privileged Identity Management](multi-user-authorization.md#authorize-critical-protected-operations-using-azure-active-directory-privileged-identity-management)
- [Performing a protected operation after approval](multi-user-authorization.md#performing-a-protected-operation-after-approval)
- Disable MUA on a [Recovery Services vault](multi-user-authorization.md?tabs=azure-portal&pivots=vaults-recovery-services-vault#disable-mua-on-a-recovery-services-vault) or a [Backup vault](multi-user-authorization.md?tabs=azure-portal&pivots=vaults-backup-vault#disable-mua-on-a-backup-vault).

