---
title: Multi-user authorization using Resource Guard
description: An overview of Multi-user authorization using Resource Guard.
ms.topic: conceptual
ms.date: 06/08/2022
author: v-amallick
ms.service: backup
ms.author: v-amallick
---
# Multi-user authorization using Resource Guard

Multi-user authorization (MUA) for Azure Backup allows you to add an additional layer of protection to critical operations on your Recovery Services vaults. For MUA, Azure Backup uses another Azure resource called the Resource Guard to ensure critical operations are performed only with applicable authorization.

## How does MUA for Backup work?

Azure Backup uses the Resource Guard as an authorization service for a Recovery Services vault. Therefore, to perform a critical operation (described below) successfully, you must have sufficient permissions on the associated Resource Guard as well.

> [!Important]
> To function as intended, the Resource Guard must be owned by a different user, and the vault admin must not have Contributor permissions. You can place Resource Guard in a subscription or tenant different from the one containing the Recovery Services vault to provide better protection.

## Critical operations

The following table lists the operations defined as critical operations and can be protected by a Resource Guard. You can choose to exclude certain operations from being protected using the Resource Guard when associating vaults with it. Note that operations denoted as Mandatory cannot be excluded from being protected using the Resource Guard for vaults associated with it. Also, the excluded critical operations would apply to all vaults associated with a Resource Guard.

**Operation** | **Mandatory/Optional**
--- | ---
Disable soft delete | Mandatory
Disable MUA protection | Mandatory
Modify backup policy (reduced retention) | Optional: Can be excluded
Modify protection (reduced retention) | Optional: Can be excluded
Stop protection with delete data | Optional: Can be excluded
Change MARS security PIN | Optional: Can be excluded

### Concepts and process
The concepts and the processes involved when using MUA for Backup are explained below.

Let’s consider the following two users for a clear understanding of the process and responsibilities. These two roles are referenced throughout this article.

**Backup admin**: Owner of the Recovery Services vault and performs management operations on the vault. To begin with, the Backup admin must not have any permissions on the Resource Guard.

**Security admin**: Owner of the Resource Guard and serves as the gatekeeper of critical operations on the vault. Hence, the Security admin controls permissions that the Backup admin needs to perform critical operations on the vault.

Following is a diagrammatic representation for performing a critical operation on a vault that has MUA configured using a Resource Guard.

:::image type="content" source="./media/multi-user-authorization/configure-mua-using-resource-card-diagram.png" alt-text="Diagrammatic representation on configuring M U A using a Resource Guard.":::
 
Here is the flow of events in a typical scenario:

1. The Backup admin creates the Recovery Services vault.
1. The Security admin creates the Resource Guard. The Resource Guard can be in a different subscription or a different tenant with respect to the Recovery Services vault. It must be ensured that the Backup admin does not have Contributor permissions on the Resource Guard.
1. The Security admin grants the **Reader** role to the Backup Admin for the Resource Guard (or a relevant scope). The Backup admin requires the reader role to enable MUA on the vault.
1. The Backup admin now configures the Recovery Services vault to be protected by MUA via the Resource Guard.
1. Now, if the Backup admin wants to perform a critical operation on the vault, they need to request access to the Resource Guard. The Backup admin can contact the Security admin for details on gaining access to perform such operations. They can do this using Privileged Identity Management (PIM) or other processes as mandated by the organization.
1. The Security admin temporarily grants the **Contributor** role on the Resource Guard to the Backup admin to perform critical operations.
1. Now, the Backup admin initiates the critical operation.
1. The Azure Resource Manager checks if the Backup admin has sufficient permissions or not. Since the Backup admin now has Contributor role on the Resource Guard, the request is completed.
   - If the Backup admin did not have the required permissions/roles, the request would have failed.
1. The security admin ensures that the privileges to perform critical operations are revoked after authorized actions are performed or after a defined duration. Using JIT tools  [Azure Active Directory Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md) may be useful in ensuring this.

>[!NOTE]
>- MUA provides protection on the above listed operations performed on the Recovery Services vaults only. Any operations performed directly on the data source (i.e., the Azure resource/workload that is protected) are beyond the scope of the Resource Guard. 
>- This feature is currently available via the Azure portal only.
>- This feature is currently supported for Recovery Services vaults only and not available for Backup vaults.

## Usage scenarios

The following table depicts scenarios for creating your Resource Guard and Recovery Services vault (RS vault), along with the relative protection offered by each.

>[!Important]
> The Backup admin must not have Contributor permissions to the Resource Guard in any scenario.

**Usage scenario** | **Protection due to MUA** | **Ease of implementation** | **Notes**
--- | --- |--- |--- |
RS vault and Resource Guard are **in the same subscription.** </br> The Backup admin does not have access to the Resource Guard. | Least isolation between the Backup admin and the Security admin. | Relatively easy to implement since only one subscription is required. | Resource level permissions/ roles need to be ensured are correctly assigned.
RS vault and Resource Guard are **in different subscriptions but the same tenant.** </br> The Backup admin does not have access to the Resource Guard or the corresponding subscription. | Medium isolation between the Backup admin and the Security admin. | Relatively medium ease of implementation since two subscriptions (but a single tenant) are required. | Ensure that that permissions/ roles are correctly assigned for the resource or the subscription.
RS vault and Resource Guard are **in different tenants.** </br> The Backup admin does not have access to the Resource Guard, the corresponding subscription, or the corresponding tenant.| Maximum isolation between the Backup admin and the Security admin, hence, maximum security. | Relatively difficult to test since requires two tenants or directories to test. | Ensure that permissions/ roles are correctly assigned for the resource, the subscription or the directory.

 >[!NOTE]
 > For this article, we will demonstrate creation of the Resource Guard in a different tenant that offers maximum protection. In terms of requesting and approving requests for performing critical operations, this article demonstrates the same using [Azure Active Directory Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md) in the tenant housing the Resource Guard. You can optionally use other mechanisms to manage JIT permissions on the Resource Guard as per your setup.

## Next steps

[Configure Multi-user authorization using Resource Guard](multi-user-authorization.md)
