---
title: Multiuser Authorization Using Resource Guard
description: This article provides an overview of multiuser authorization using Resource Guard.
ms.topic: overview
ms.date: 06/27/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a backup administrator, I want to implement multiuser authorization using Resource Guard so that I can enhance the security of critical operations on my Recovery Services vaults and ensure that only authorized users can perform those operations.
---
# Multiuser authorization using Resource Guard

You can use multiuser authorization (MUA) for Azure Backup to add a layer of protection to critical operations on your Recovery Services vaults and Backup vaults. For MUA, Azure Backup uses another Azure resource called Resource Guard to ensure that critical operations are performed only with applicable authorization.

Multiuser authorization using Resource Guard for a Backup vault is now generally available.

## Permissions for MUA for Azure Backup

Azure Backup uses Resource Guard as an additional authorization mechanism for a Recovery Services vault or a Backup vault. To perform a critical operation (described in the next section) successfully, you must have sufficient permissions on Resource Guard.

For MUA to function as intended:

- A different user must own the Resource Guard instance.
- The vault admin must not have Contributor, Backup MUA Admin, or Backup MUA Operator permissions on Resource Guard.

To provide better protection, you can place Resource Guard in a subscription or tenant that's different from the one that contains the vaults.

## Critical operations

The following table lists the operations that are defined as critical and that Resource Guard can help protect. You can choose to exclude certain operations from being protected via Resource Guard when you're associating vaults with it.

> [!NOTE]
> You can't exclude the operations denoted as *mandatory* from being protected via Resource Guard for vaults that are associated with it. Also, the excluded critical operations would apply to all vaults associated with Resource Guard.

# [Recovery Services vault](#tab/recovery-services-vault)

| Operation | Mandatory/ Optional | Description |
| --- | --- | --- |
| **Disable soft delete or security features** | Mandatory | Disable the soft-delete setting on a vault. |
| **Remove MUA protection** | Mandatory | Disable MUA protection on a vault. |
| **Delete protection** | Optional | Delete protection by stopping backups and deleting data. |
| **Modify protection** | Optional | Add a new backup policy with reduced retention, or change policy frequency to increase [recovery point objective (RPO)](azure-backup-glossary.md#recovery-point-objective-rpo). |
| **Modify policy** | Optional | Modify the backup policy to reduce retention, or change the policy frequency to increase RPO. |
| **Get backup security PIN** | Optional | Change the Microsoft Azure Recovery Services (MARS) security PIN. |
| **Stop backup and retain data** | Optional | Delete protection by stopping backups and retaining data forever or retaining data according to policy. |
| **Disable immutability** | Optional | Disable the immutability setting on a vault. |

# [Backup vault](#tab/backup-vault)

| Operation | Mandatory/ Optional | Description |
| --- | --- | --- |
| **Disable soft delete** | Mandatory | Disable the soft-delete setting on a vault. |
| **Remove MUA protection** | Mandatory | Disable MUA protection on a vault. |
| **Delete Backup Instance** | Optional | Delete protection by stopping backups and deleting data. |
| **Stop backup and retain forever** | Optional | Delete protection by stopping backups and retaining data forever. |
| **Stop backup and retain as per policy** | Optional | Delete protection by stopping backups and retaining data according to policy. |
| **Disable immutability** | Optional | Disable the immutability setting on a vault. |

---

## Concepts and process

This section describes the concepts and the processes involved when you use MUA for Azure Backup.

For a clear understanding of the process and responsibilities, consider the following two personas. These personas are referenced throughout this article.

- **Backup admin**: Owner of the Recovery Services vault or Backup vault who performs management operations on the vault. At first, the backup admin must not have any permissions on Resource Guard. The backup admin can have the Backup Operator or Backup Contributor role-based access control (RBAC) role on the Recovery Services vault.

- **Security admin**: Owner of the Resource Guard instance and serves as the gatekeeper of critical operations on the vault. The security admin controls permissions that the backup admin needs for performing critical operations on the vault. The security admin can have the Backup MUA Admin RBAC role on Resource Guard.

The following diagram shows the steps for performing a critical operation on a vault that has MUA configured via Resource Guard.

:::image type="content" source="./media/multi-user-authorization/configure-multi-user-authorization-using-resource-guard-diagram.png" alt-text="Diagram of configuring multiuser authorization by using Resource Guard.":::

Here's the flow of events in a typical scenario:

1. The backup admin creates the Recovery Services vault or the Backup vault.

2. The security admin creates the Resource Guard instance.

   The Resource Guard instance can be in a different subscription or a different tenant with respect to the vault. Ensure that the backup admin doesn't have Contributor, Backup MUA Admin, or Backup MUA Operator permissions on Resource Guard.

3. The security admin grants the Reader role to the backup admin for Resource Guard (or a relevant scope). The backup admin requires the Reader role to enable MUA on the vault.

4. The backup admin configures MUA to help protect the vault via Resource Guard.

5. If the backup admin or any user who has write access to the vault wants to perform a critical operation that's protected with Resource Guard on the vault, they need to request access to Resource Guard.

   The backup admin can contact the security admin for details on gaining access to perform such operations. They can do this by using privileged identity management (PIM) or other processes that the organization mandates.

   The backup admin can request the Backup MUA Operator RBAC role. This role allows users to perform only critical operations that Resource Guard protects. It doesn't allow the deletion of the Resource Guard instance.

6. The security admin temporarily grants the Backup MUA Operator role on Resource Guard to the backup admin to perform critical operations.

7. The backup admin initiates the critical operation.

8. Azure Resource Manager checks if the backup admin has sufficient permissions. Because the backup admin now has the Backup MUA Operator role on Resource Guard, the request is completed. If the backup admin doesn't have the required permissions or roles, the request fails.

9. The security admin revokes the privileges to perform critical operations after authorized actions are performed or after a defined duration. You can use the just-in-time (JIT) tools in Microsoft Entra Privileged Identity Management to revoke the privileges.

>[!NOTE]
>
>- If you grant the Contributor or Backup MUA Admin role on Resource Guard access temporarily to the backup admin, that access also provides delete permissions on Resource Guard. We recommend that you provide Backup MUA Operator permissions only.
>- MUA provides protection on the previously listed operations performed on the vaulted backups only. Any operations performed directly on the data source (that is, the Azure resource or workload that's protected) are beyond the scope of Resource Guard.

## Usage scenarios

The following table lists the scenarios for creating your Resource Guard instance and vaults (Recovery Services vault and Backup vault), along with the relative protection that each offers.

> [!IMPORTANT]
> The backup admin must not have Contributor, Backup MUA Admin, or Backup MUA Operator permissions for Resource Guard in any scenario. These permissions override the MUA protection on the vault.

| Usage scenario | Protection due to MUA | Ease of implementation | Notes |
| --- | --- |--- |--- |
| Vault and Resource Guard are *in the same subscription.* </br>The backup admin doesn't have access to Resource Guard. | Least isolation between the backup admin and the security admin. | Relatively easy to implement because only one subscription is required. | Resource-level permissions and roles need to be correctly assigned. |
| Vault and Resource Guard are *in different subscriptions but the same tenant.* </br>The backup admin doesn't have access to Resource Guard or the corresponding subscription. | Medium isolation between the backup admin and the security admin. | Medium ease of implementation because two subscriptions (but a single tenant) are required. | Ensure that permissions and roles are correctly assigned for the resource or the subscription. |
| Vault and Resource Guard are *in different tenants*. </br>The backup admin doesn't have access to Resource Guard, the corresponding subscription, or the corresponding tenant.| Maximum isolation between the backup admin and the security admin, which provides maximum security. | Relatively difficult to test because testing requires two tenants or directories. | Ensure that permissions and roles are correctly assigned for the resource, the subscription, or the directory. |

## Related content

- [Configure multiuser authorization by using Resource Guard](multi-user-authorization.md)
