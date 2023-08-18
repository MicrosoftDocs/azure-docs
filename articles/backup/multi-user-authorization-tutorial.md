---
title: Tutorial - Enable Multi-user authorization using Resource Guard
description: In this tutorial, you'll learn about how create a resource guard and enable Multi-user authorization on Recovery Services vault for Azure Backup.
ms.topic: tutorial
ms.date: 05/05/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Tutorial: Create a Resource Guard and enable Multi-user authorization in Azure Backup

This tutorial describes how to create a Resource Guard and enable Multi-user authorization on a Recovery Services vault. This adds an additional layer of protection to critical operations on your Recovery Services vaults.

This tutorial includes the following:

>[!div class="checklist"]
>- Prerequisies
>- Create a Resource Guard
>- Enable MUA on a Recovery Services vault

>[!NOTE]
> Multi-user authorization for Azure Backup is available in all public Azure regions.

## Prerequisites

Before you start:

-  Ensure the Resource Guard and the Recovery Services vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions containing the Recovery Services vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the **Microsoft.RecoveryServices** provider. For more details, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

Learn about various [MUA usage scenarios](multi-user-authorization-concept.md#usage-scenarios).

## Create a Resource Guard

>[!Note]
>The **Security admin** creates the Resource Guard. We recommend that you create it in a **different subscription** or a **different tenant** as the vault. However, it should be in the **same region** as the vault. The Backup admin must **NOT** have *contributor* access on the Resource Guard or the subscription that contains it.
>
>Create the Resource Guard in a tenant different from the vault tenant.

Follow these steps:

1. In the Azure portal, go to the directory under which you wish to create the Resource Guard.
   
1. Search for **Resource Guards** in the search bar and select the corresponding item from the drop-down.

   - Click **Create** to start creating a Resource Guard.
   - In the create blade, fill in the required details for this Resource Guard.
       - Make sure the Resource Guard is in the same Azure regions as the Recovery Services vault.
       - Also, it is helpful to add a description of how to get or request access to perform actions on associated vaults when needed. This description would also appear in the associated vaults to guide the backup admin on getting the required permissions. You can edit the description later if needed, but having a well-defined description at all times is encouraged.
       
1. On the **Protected operations** tab, select the operations you need to protect using this resource guard.

   You can also [select the operations to be protected after creating the resource guard](#select-operations-to-protect-using-resource-guard).

1. Optionally, add any tags to the Resource Guard as per the requirements
1. Click **Review + Create**.
1. Follow notifications for status and successful creation of the Resource Guard.

### Select operations to protect using Resource Guard

>[!Note]
>Choose the operations you want to protect using the Resource Guard out of all supported critical operations. By default, all supported critical operations are enabled. However, you can exempt certain operations from falling under the purview of MUA using Resource Guard. The security admin can perform the following  steps:

Follow these steps:

1. In the Resource Guard created above, go to **Properties**.
1. Select **Disable** for operations that you wish to exclude from being authorized using the Resource Guard. 

   >[!Note]
   >The operations **Disable soft delete** and **Remove MUA protection** cannot be disabled.
1. Optionally, you can also update the description for the Resource Guard using this blade. 
1. Select **Save**.

## Assign permissions to the Backup admin on the Resource Guard to enable MUA

>[!Note]
>To enable MUA on a vault, the admin of the vault must have **Reader** role on the Resource Guard or subscription containing the Resource Guard. To assign the **Reader** role on the Resource Guard:

Follow these steps:

1. In the Resource Guard created above, go to the Access Control (IAM) blade, and then go to **Add role assignment**.
1. Select **Reader** from the list of built-in roles and click **Next** on the bottom of the screen.
1. Click **Select members** and add the Backup admin’s email ID to add them as the **Reader**. Since the Backup admin is in another  tenant in this case, they will be added as guests to the tenant containing the Resource Guard.
1. Click **Select** and then proceed to **Review + assign** to complete the role assignment.

## Enable MUA on a Recovery Services vault

>[!Note]
>The Backup admin now has the Reader role on the Resource Guard and can easily enable multi-user authorization on vaults managed by them and performs the following steps.

1. Go to the Recovery Services vault.
1. Go to **Properties** on the left navigation panel, then to **Multi-User Authorization** and click **Update**.
1. Now you are presented with the option to enable MUA and choose a Resource Guard using one of the following ways:

   1. You can either specify the URI of the Resource Guard, make sure you specify the URI of a Resource Guard you have **Reader** access to and that is the same regions as the vault. You can find the URI (Resource Guard ID) of the Resource Guard in its **Overview** screen:
    
   1. Or you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

      1. Click **Select Resource Guard**
      1. Click on the dropdown and select the directory the Resource Guard is in.
      1. Click **Authenticate** to validate your identity and access.
      1. After authentication, choose the **Resource Guard** from the list displayed.

1. Click **Save** once done to enable MUA.

## Next steps

- [Protected operations using MUA](multi-user-authorization.md?pivots=vaults-recovery-services-vault#protected-operations-using-mua)
- [Authorize critical (protected) operations using Azure AD Privileged Identity Management](multi-user-authorization.md#authorize-critical-protected-operations-using-azure-ad-privileged-identity-management)
- [Performing a protected operation after approval](multi-user-authorization.md#performing-a-protected-operation-after-approval)
- [Disable MUA on a Recovery Services vault](multi-user-authorization.md#disable-mua-on-a-recovery-services-vault)

