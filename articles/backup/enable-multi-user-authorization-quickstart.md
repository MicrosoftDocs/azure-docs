---
title: Quickstart - Multi-user authorization using Resource Guard
description: In this quickstart, learn how to use Multi-user authorization to protect against unauthorized operation.
ms.topic: quickstart
ms.date: 09/25/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Enable protection using Multi-user authorization in Azure Backup

This quickstart describes how to enable Multi-user authorization (MUA) for Azure Backup.

Multi-user authorization (MUA) for Azure Backup allows you to add an additional layer of protection to critical operations on your Recovery Services vaults and Backup vaults. For MUA, Azure Backup uses another Azure resource called the Resource Guard to ensure critical operations are performed only with applicable authorization. 

>[!Note]
>MUA is now generally available for both Recovery Services vaults and Backup vaults.

Learn about [MUA concepts](multi-user-authorization-concept.md).

## Prerequisites

Before you start:

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

-  Ensure the Resource Guard and the Recovery Services vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions containing the Recovery Services vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the **Microsoft.RecoveryServices** provider. For more details, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).
- Ensure that you [create a Resource Guard](multi-user-authorization.md#create-a-resource-guard) in a different subsctiption/tenant as that of the vault located in the same region.
- Ensure to [assign permissions to the Backup admin on the Resource Guard to enable MUA](multi-user-authorization.md#assign-permissions-to-the-backup-admin-on-the-resource-guard-to-enable-mua).

# [Backup vault](#tab/backup-vault)

-  Ensure the Resource Guard and the Backup vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions contain the Backup vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the provider - **Microsoft.DataProtection**4. For more information, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

---

## Enable MUA

Once the Backup admin has the Reader role on the Resource Guard, they can enable multi-user authorization on vaults managed by following these steps:

**Choose a vault**

# [Recovery Services vault](#tab/recovery-services-vault)

1. Go to the Recovery Services vault for which you want to configure MUA.

1. On the left pane, select **Properties**.

1. Go to **Multi-User Authorization** and select **Update**.

1. To enable MUA and choose a Resource Guard, perform one of the following actions:

   - You can either specify the URI of the Resource Guard, make sure you specify the URI of a Resource Guard you have **Reader** access to and that is the same regions as the vault. You can find the URI (Resource Guard ID) of the Resource Guard in its **Overview** screen:

   - Or, you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

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
- [Authorize critical (protected) operations using Microsoft Entra Privileged Identity Management](multi-user-authorization.md#authorize-critical-protected-operations-using-azure-active-directory-privileged-identity-management)
- [Performing a protected operation after approval](multi-user-authorization.md#performing-a-protected-operation-after-approval)
- Disable MUA on a [Recovery Services vault](multi-user-authorization.md?tabs=azure-portal&pivots=vaults-recovery-services-vault#disable-mua-on-a-recovery-services-vault) or a [Backup vault](multi-user-authorization.md?tabs=azure-portal&pivots=vaults-backup-vault#disable-mua-on-a-backup-vault).
