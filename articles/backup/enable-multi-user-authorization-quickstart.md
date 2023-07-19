---
title: Quickstart - Multi-user authorization using Resource Guard
description: In this quickstart, learn how to use Multi-user authorization to protect against unauthorized operation.
ms.topic: tutorial
ms.date: 05/05/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Enable protection using Multi-user authorization on Recovery Services vault in Azure Backup

Multi-user authorization (MUA) for Azure Backup allows you to add an additional layer of protection to critical operations on your Recovery Services vaults. For MUA, Azure Backup uses another Azure resource called the Resource Guard to ensure critical operations are performed only with applicable authorization. Learn about [MUA concepts](multi-user-authorization-concept.md).

This quickstart describes how to enable Multi-user authorization (MUA) for Azure Backup.

## Prerequisites

Before you start:

-  Ensure the Resource Guard and the Recovery Services vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions containing the Recovery Services vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the **Microsoft.RecoveryServices** provider. For more details, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).
- Ensure that you [create a Resource Guard](multi-user-authorization.md#create-a-resource-guard) in a different subsctiption/tenant as that of the vault located in the same region.
- Ensure to [assign permissions to the Backup admin on the Resource Guard to enable MUA](multi-user-authorization.md#assign-permissions-to-the-backup-admin-on-the-resource-guard-to-enable-mua).

## Enable MUA

The Backup admin now has the Reader role on the Resource Guard and can easily enable multi-user authorization on vaults managed by them.

Follow these steps:

1. Go to the Recovery Services vault.
1. Go to **Properties** on the left navigation panel, then to **Multi-User Authorization** and click **Update**.
1. The option to enable MUA appears. Choose a Resource Guard using one of the following ways:

   1. You can either specify the URI of the Resource Guard, make sure you specify the URI of a Resource Guard you have **Reader** access to and that is the same regions as the vault. You can find the URI (Resource Guard ID) of the Resource Guard in its **Overview** screen:

   1. Or, you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

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
