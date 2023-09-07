---
title: Configure Multi-user authorization using Resource Guard
description: This article explains how to configure Multi-user authorization using Resource Guard.
ms.topic: how-to
zone_pivot_groups: backup-vaults-recovery-services-vault-backup-vault
ms.date: 09/25/2023
ms.service: backup
ms.custom: devx-track-azurepowershell, devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Configure Multi-user authorization using Resource Guard in Azure Backup




::: zone pivot="vaults-recovery-services-vault"

This article describes how to configure Multi-user authorization (MUA) for Azure Backup to add an additional layer of protection to critical operations on your Recovery Services vaults.

This article demonstrates Resource Guard creation in a different tenant that offers maximum protection. It also demonstrates how to  request and approve requests for performing critical operations using [Azure Active Directory Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md) in the tenant housing the Resource Guard. You can optionally use other mechanisms to manage JIT permissions on the Resource Guard as per your setup.

>[!NOTE]
>- Multi-user authorization for Azure Backup is available in all public Azure regions.
>- Multi-user authorization using Resource Guard for Backup vault is now generally available. [Learn more](multi-user-authorization.md?pivots=vaults-backup-vault).

## Before you start

-  Ensure the Resource Guard and the Recovery Services vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions containing the Recovery Services vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the providers - **Microsoft.RecoveryServices** and **Microsoft.DataProtection** . For more information, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

Learn about various [MUA usage scenarios](./multi-user-authorization-concept.md?tabs=recovery-services-vault#usage-scenarios).

## Create a Resource Guard

The **Security admin** creates the Resource Guard. We recommend that you create it in a **different subscription** or a **different tenant** as the vault. However, it should be in the **same region** as the vault. The Backup admin must **NOT** have *contributor* access on the Resource Guard or the subscription that contains it.

**Choose a client**

# [Azure portal](#tab/azure-portal)

To create the Resource Guard in a tenant different from the vault tenant, follow these steps:

1. In the Azure portal, go to the directory under which you want to create the Resource Guard.
   
   :::image type="content" source="./media/multi-user-authorization/portal-settings-directories-subscriptions.png" alt-text="Screenshot showing the portal settings.":::
     
1. Search for **Resource Guards** in the search bar, and then select the corresponding item from the drop-down list.
    
   :::image type="content" source="./media/multi-user-authorization/resource-guards.png" alt-text="Screenshot shows how to search resource guards." lightbox="./media/multi-user-authorization/resource-guards.png":::
    
   - Select **Create** to start creating a Resource Guard.
   - In the create blade, fill in the required details for this Resource Guard.
       - Make sure the Resource Guard is in the same Azure regions as the Recovery Services vault.
       - Also, it's helpful to add a description of how to get or request access to perform actions on associated vaults when needed. This description would also appear in the associated vaults to guide the backup admin on getting the required permissions. You can edit the description later if needed, but having a well-defined description at all times is encouraged.
       
1. On the **Protected operations** tab, select the operations you need to protect using this resource guard.

   You can also [select the operations for protection after creating the resource guard](?pivots=vaults-recovery-services-vault#select-operations-to-protect-using-resource-guard).

1. Optionally, add any tags to the Resource Guard as per the requirements
1. Select **Review + Create** and follow notifications for status and successful creation of the Resource Guard.

# [PowerShell](#tab/powershell)

To create a resource guard, run the following cmdlet:

   ```azurepowershell-interactive
   New-AzDataProtectionResourceGuard -Location “Location” -Name “ResourceGuardName” -ResourceGroupName “rgName”
   ```

# [CLI](#tab/cli)

To create a resource guard, run the following command:

   ```azurecli-interactive
   az dataprotection resource-guard create --location "Location" --tags key1="val1" --resource-group "RgName" --resource-guard-name "ResourceGuardName"
   ```

---

### Select operations to protect using Resource Guard

Choose the operations you want to protect using the Resource Guard out of all supported critical operations. By default, all supported critical operations are enabled. However, you (as the security admin) can exempt certain operations from falling under the purview of MUA using Resource Guard.

**Choose a client**

# [Azure portal](#tab/azure-portal)

To exempt operations, follow these steps:

1. In the Resource Guard created above, go to **Properties** > **Recovery Services vault** tab.
2. Select **Disable** for operations that you want to exclude from being authorized using the Resource Guard.

   >[!Note]
   > You can't disable the protected operations - **Disable soft delete** and **Remove MUA protection**.
1. Optionally, you can also update the description for the Resource Guard using this blade. 
1. Select **Save**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-properties.png" alt-text="Screenshot showing demo resource guard properties.":::

# [PowerShell](#tab/powershell)

To update the operations. These exclude operations from protection by the resource guard, run the following cmdlets:

   ```azurepowershell-interactive
   $resourceGuard = Get-AzDataProtectionResourceGuard -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx" -ResourceGroupName "rgName" -Name "resGuardName"
   $criticalOperations = $resourceGuard.ResourceGuardOperation.VaultCriticalOperation
   $operationsToBeExcluded = $criticalOperations | Where-Object { $_ -match "backupSecurityPIN/action" -or $_ -match "backupInstances/delete" }


   Update-AzDataProtectionResourceGuard -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx" -ResourceGroupName "rgName" -Name $resourceGuard.Name -CriticalOperationExclusionList $operationsToBeExcluded
   ```

- The first command fetches the resource guard that needs to be updated.
- The second and third commands fetch the critical operations that you want to update.
- The fourth command excludes some critical operations from the resource guard.

# [CLI](#tab/cli)

To update the operations that are to be excluded from being protected by the resource guard, run the following commands:

   ```azurecli-interactive
   az dataprotection resource-guard update --name
                                          --resource-group
                                          [--critical-operation-exclusion-list {deleteProtection, getSecurityPIN, updatePolicy, updateProtection}]
                                          [--resource-type {Microsoft.RecoveryServices/vaults}]
                                          [--tags]
                                          [--type]

   ```

**Example**:

   ```azurecli
   az dataprotection resource-guard update --resource-group "RgName" --resource-guard-name "ResourceGuardName" --resource-type "Microsoft.RecoveryServices/vaults" --critical-operation-exclusion-list deleteProtection getSecurityPIN updatePolicy   
   ```


---



## Assign permissions to the Backup admin on the Resource Guard to enable MUA

To enable MUA on a vault, the admin of the vault must have **Reader** role on the Resource Guard or subscription containing the Resource Guard. To assign the **Reader** role on the Resource Guard:

1. In the Resource Guard created above, go to the **Access Control (IAM)** blade, and then go to **Add role assignment**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-access-control.png" alt-text="Screenshot showing demo resource guard-access control.":::
    
1. Select **Reader** from the list of built-in roles, and select **Next**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-add-role-assignment-inline.png" alt-text="Screenshot showing demo resource guard-add role assignment." lightbox="./media/multi-user-authorization/demo-resource-guard-add-role-assignment-expanded.png":::

1. Click **Select members** and add the Backup admin’s email ID to add them as the **Reader**. As the Backup admin is in another  tenant in this case, they'll be added as guests to the tenant containing the Resource Guard.

1. Click **Select** and then proceed to **Review + assign** to complete the role assignment.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-select-members-inline.png" alt-text="Screenshot showing demo resource guard-select members." lightbox="./media/multi-user-authorization/demo-resource-guard-select-members-expanded.png":::

## Enable MUA on a Recovery Services vault

After the Reader role assignment on the Resource Guard is complete, enable multi-user authorization on vaults (as the **Backup admin**) that you manage.

**Choose a client**

# [Azure portal](#tab/azure-portal)

To enable MUA on the vaults, follow these steps.

1. Go to the Recovery Services vault. Go to **Properties** on the left navigation panel, then to **Multi-User Authorization** and select **Update**.

   :::image type="content" source="./media/multi-user-authorization/test-vault-properties.png" alt-text="Screenshot showing the Recovery services vault properties.":::

1. Now, you're presented with the option to enable MUA and choose a Resource Guard using one of the following ways:

   - You can either specify the URI of the Resource Guard, make sure you specify the URI of a Resource Guard you have **Reader** access to and that is the same regions as the vault. You can find the URI (Resource Guard ID) of the Resource Guard in its **Overview** screen:

      :::image type="content" source="./media/multi-user-authorization/resource-guard-rg-inline.png" alt-text="Screenshot showing the Resource Guard." lightbox="./media/multi-user-authorization/resource-guard-rg-expanded.png":::
    
   - Or, you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

      1. Click **Select Resource Guard**
      1. Select the dropdown list, and then choose the directory the Resource Guard is in.
      1. Select **Authenticate** to validate your identity and access.
      1. After authentication, choose the **Resource Guard** from the list displayed.

      :::image type="content" source="./media/multi-user-authorization/testvault1-multi-user-authorization-inline.png" alt-text="Screenshot showing multi-user authorization." lightbox="./media/multi-user-authorization/testvault1-multi-user-authorization-expanded.png" :::

1. Select **Save** once done to enable MUA.

   :::image type="content" source="./media/multi-user-authorization/testvault1-enable-mua.png" alt-text="Screenshot showing how to enable Multi-user authentication.":::

# [PowerShell](#tab/powershell)

To enable MUA on a Recovery Services vault, run the following cmdlet:

   ```azurepowershell-interactive
   $token = (Get-AzAccessToken -TenantId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").Token
   Set-AzRecoveryServicesResourceGuardMapping -VaultId “VaultArmId” -ResourceGuardId "ResourceGuardArmId" -Token $token
   ```

- The first command fetches the access token for the resource guard tenant where the resource guard is present. 
- The second command creates a mapping between the RSVault $vault and Resource guard. 

>[!NOTE]
>The token parameter is optional and is only needed to authenticate cross tenant protected operations.

# [CLI](#tab/cli)

To enable MUA on a Recovery Services vault, run the following command:

   ```azurecli-interactive
   az backup vault resource-guard-mapping update --resource-guard-id
                                                [--ids]
                                                [--name]
                                                [--resource-group]
                                                [--tenant-id]

   ```

The tenant ID is required if the resource guard exists in a different tenant.

**Example**:

   ```azurecli
   az backup vault resource-guard-mapping update --resource-group RgName --name VaultName --resource-guard-id ResourceGuardId
   ```

---


## Protected operations using MUA

Once you have enabled MUA, the operations in scope will be restricted on the vault, if the Backup admin tries to perform them without having the required role (that is, Contributor role) on the Resource Guard.

 >[!NOTE]
 >We highly recommend that you test your setup after enabling MUA to ensure that protected operations are blocked as expected and to ensure that MUA is correctly configured.

Depicted below is an illustration of what happens when the Backup admin tries to perform such a protected operation (For example, disabling soft delete is depicted here. Other protected operations have a similar experience). The following steps are performed by a Backup admin without required permissions.

1. To disable soft delete, go to the Recovery Services vault > **Properties** > **Security Settings** and select **Update**, which brings up the Security Settings.
1. Disable the soft delete using the slider. You're informed that this is a protected operation, and you need to verify their access to the Resource Guard.
1. Select the directory containing the Resource Guard and Authenticate yourself. This step may not be required if the Resource Guard is in the same directory as the vault.
1. Proceed to select **Save**. The request fails with an error informing them about not having sufficient permissions on the Resource Guard to let you perform this operation.

   :::image type="content" source="./media/multi-user-authorization/test-vault-properties-security-settings-inline.png" alt-text="Screenshot showing the Test Vault properties security settings." lightbox="./media/multi-user-authorization/test-vault-properties-security-settings-expanded.png":::

## Authorize critical (protected) operations using Azure Active Directory Privileged Identity Management

The following sections discuss authorizing these requests using PIM. There are cases where you may need to perform critical operations on your backups and MUA can help you ensure that these are performed only when the right approvals or permissions exist. As discussed earlier, the Backup admin needs to have a Contributor role on the Resource Guard to perform critical operations that are in the Resource Guard scope. One of the ways to allow just-in-time for such operations is through the use of [Azure Active Directory (Azure AD) Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md).

>[!NOTE]
>Though using Azure AD PIM is the recommended approach, you can use manual or custom methods to manage access for the Backup admin on the Resource Guard. For managing access to the Resource Guard manually, use the ‘Access control (IAM)’ setting on the left navigation bar of the Resource Guard and grant the **Contributor** role to the Backup admin.

### Create an eligible assignment for the Backup admin (if using Azure Active Directory Privileged Identity Management)

The Security admin can use PIM to create an eligible assignment for the Backup admin as a Contributor to the Resource Guard. This enables the Backup admin to raise a request (for the Contributor role) when they need to perform a protected operation. To do so, the **security admin** performs the following:

1. In the security tenant (which contains the Resource Guard), go to **Privileged Identity Management** (search for this in the search bar in the Azure portal) and then go to  **Azure Resources** (under **Manage** on the left menu).
1. Select the resource (the Resource Guard or the containing subscription/RG) to which you want to assign the **Contributor** role.

      If you don’t see the corresponding resource in the list of resources, ensure you add the containing subscription to be managed by PIM.

1. In the selected resource, go to **Assignments** (under **Manage** on the left menu) and go to **Add assignments**.

    :::image type="content" source="./media/multi-user-authorization/add-assignments.png" alt-text="Screenshot showing how to add assignments.":::

1. In the Add assignments:
   1. Select the role as Contributor.
   1. Go to **Select members** and add the username (or email IDs) of the Backup admin.
   1. Select **Next**.

   :::image type="content" source="./media/multi-user-authorization/add-assignments-membership.png" alt-text="Screenshot showing how to add assignments-membership.":::

1. In the next screen:
   1. Under assignment type, choose **Eligible**.
   1. Specify the duration for which the eligible permission is valid.
   1. Select **Assign** to finish creating the eligible assignment.

   :::image type="content" source="./media/multi-user-authorization/add-assignments-setting.png" alt-text="Screenshot showing how to add assignments-setting.":::

### Set up approvers for activating Contributor role

By default, the setup above may not have an approver (and an approval flow requirement) configured in PIM. To ensure that approvers are required for allowing only authorized requests to go through, the security admin must perform the following steps.

> [!Note]
> If this isn't configured, any requests will be automatically approved without going through the security admins or a designated approver’s review. More details on this can be found [here](../active-directory/privileged-identity-management/pim-resource-roles-configure-role-settings.md)

1. In Azure AD PIM, select **Azure Resources** on the left navigation bar and select your Resource Guard.

1. Go to **Settings** and then go to the **Contributor** role.

   :::image type="content" source="./media/multi-user-authorization/add-contributor.png" alt-text="Screenshot showing how to add contributor.":::

1. If the setting named **Approvers** shows *None* or display incorrect approver(s), select **Edit** to add the reviewers who would need to review and approve the activation request for the Contributor role.

1. On the **Activation** tab, select **Require approval to activate** and add the approver(s) who need to approve each request. You can also select other security options like using MFA and mandating ticket options to activate the Contributor role. Optionally, select relevant settings on the **Assignment** and **Notification** tabs as per your requirements.

   :::image type="content" source="./media/multi-user-authorization/edit-role-settings.png" alt-text="Screenshot showing how to edit role setting.":::

1. Select **Update** once done.

### Request activation of an eligible assignment to perform critical operations

After the security admin creates an eligible assignment, the Backup admin needs to activate the assignment for the Contributor role to be able to perform protected actions. The following actions are performed by the **Backup admin** to activate the role assignment.

1. Go to [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md). If the Resource Guard is in another directory, switch to that directory and then go to [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md).
1. Go to **My roles** > **Azure resources** on the left menu.
1. The Backup admin can see an Eligible assignment for the contributor role. Select **Activate** to activate it.
1. The Backup admin is informed via portal notification that the request is sent for approval.

   :::image type="content" source="./media/multi-user-authorization/identity-management-myroles-inline.png" alt-text="Screenshot showing to activate eligible assignments." lightbox="./media/multi-user-authorization/identity-management-myroles-expanded.png":::

### Approve activation of requests to perform critical operations

Once the Backup admin raises a request for activating the Contributor role, the request is to be reviewed and approved by the **security admin**.
1. In the security tenant, go to [Azure AD Privileged Identity Management.](../active-directory/privileged-identity-management/pim-configure.md)
1. Go to **Approve Requests**.
1. Under **Azure resources**, the request raised by the Backup admin requesting activation as a **Contributor** can be seen.
1. Review the request. If genuine, select the request and select **Approve** to approve it.
1. The Backup admin is informed by email (or other organizational alerting mechanisms) that their request is now approved.
1. Once approved, the Backup admin can perform protected operations for the requested period.

## Performing a protected operation after approval

Once the Backup admin’s request for the Contributor role on the Resource Guard is approved, they can perform protected operations on the associated vault. If the Resource Guard is in another directory, the Backup admin would need to authenticate themselves.

>[!NOTE]
> If the access was assigned using a JIT mechanism, the Contributor role is retracted at the end of the approved period. Else, the Security admin manually removes the **Contributor** role assigned to the Backup admin to perform the critical operation.

The following screenshot shows an example of disabling soft delete for an MUA-enabled vault.

:::image type="content" source="./media/multi-user-authorization/disable-soft-delete-inline.png" alt-text="Screenshot showing to disable soft delete." lightbox="./media/multi-user-authorization/disable-soft-delete-expanded.png":::

## Disable MUA on a Recovery Services vault

Disabling MUA is a protected operation, so, so, vaults are protected using MUA. If you (the Backup admin) want to disable MUA, you must have the required Contributor role in the Resource Guard.

**Choose a client**

# [Azure portal](#tab/azure-portal)

To disable MUA on a vault, follow these steps:

1. The Backup admin requests the Security admin for **Contributor** role on the Resource Guard. They can request this to use the methods approved by the organization such as JIT procedures, like [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md), or other internal tools and procedures. 
1. The Security admin approves the request (if they find it worthy of being approved) and informs the Backup admin. Now the Backup admin has the ‘Contributor’ role on the Resource Guard.
1. The Backup admin goes to the vault > **Properties** > **Multi-user Authorization**.
1. Select **Update**.
   1. Clear the **Protect with Resource Guard** checkbox.
   1. Choose the Directory that contains the Resource Guard and verify access using the Authenticate button (if applicable).
   1. After **authentication**, select **Save**. With the right access, the request should be successfully completed.
   
   :::image type="content" source="./media/multi-user-authorization/disable-mua.png" alt-text="Screenshot showing to disable multi-user authentication.":::

# [PowerShell](#tab/powershell)

To disable MUA on a Recovery Services vault, use the following cmdlet:

   ```azurepowershell-interactive
   $token = (Get-AzAccessToken -TenantId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").Token
   Remove-AzRecoveryServicesResourceGuardMapping -VaultId “VaultArmId”  -Token $token
   ```

- The first command fetches the access token for the resource guard tenant, where the resource guard is present.
- The second command deletes the mapping between the Recovery Services vault and the resource guard.

>[!NOTE]
>The token parameter is optional and is only needed to authenticate the cross tenant protected operations.

# [CLI](#tab/cli)

To disable MUA on a Recovery Services vault, run the following command:

   ```azurecli-interactive
   az backup vault resource-guard-mapping delete [--ids]
                                                [--name]
                                                [--resource-group]
                                                [--tenant-id]
                                                [--yes]

   ```
   ---

The tenant ID is required if the resource guard exists in a different tenant.

**Example**:

   ```azurecli
   az backup vault resource-guard-mapping delete --resource-group RgName --name VaultName
   ```





::: zone-end


::: zone pivot="vaults-backup-vault"

This article describes how to configure Multi-user authorization (MUA) for Azure Backup to add an additional layer of protection to critical operations on your Backup vault.

This article demonstrates Resource Guard creation in a different tenant that offers maximum protection. It also demonstrates how to  request and approve requests for performing critical operations using [Azure Active Directory Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md) in the tenant housing the Resource Guard. You can optionally use other mechanisms to manage JIT permissions on the Resource Guard as per your setup.

>[!NOTE]
>- Multi-user authorization using Resource Guard for Backup vault is now generally available.
>- Multi-user authorization for Azure Backup is available in all public Azure regions.

## Before you start

-  Ensure the Resource Guard and the Backup vault are in the same Azure region.
-  Ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions contain the Backup vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the provider - **Microsoft.DataProtection**4. For more information, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

Learn about various [MUA usage scenarios](./multi-user-authorization-concept.md?tabs=backup-vault#usage-scenarios).

## Create a Resource Guard

The **Security admin** creates the Resource Guard. We recommend that you create it in a **different subscription** or a **different tenant** as the vault. However, it should be in the **same region** as the vault.

The Backup admin must **NOT** have *contributor* access on the Resource Guard or the subscription that contains it.

To create the Resource Guard in a tenant different from the vault tenant as a Security admin, follow these steps:

1. In the Azure portal, go to the directory under which you want to create the Resource Guard.
   
   :::image type="content" source="./media/multi-user-authorization/portal-settings-directories-subscriptions.png" alt-text="Screenshot showing the portal settings to configure for Backup vault.":::
     
1. Search for **Resource Guards** in the search bar, and then select the corresponding item from the dropdown list.
    
   :::image type="content" source="./media/multi-user-authorization/resource-guards.png" alt-text="Screenshot showing resource guards for Backup vault." lightbox="./media/multi-user-authorization/resource-guards.png":::
    
   1. Select **Create** to create a Resource Guard.
   1. In the Create blade, fill in the required details for this Resource Guard.
       - Ensure that the Resource Guard is in the same Azure region as the Backup vault.
       - Add a description on how to request access to perform actions on associated vaults when needed. This description appears in the associated vaults to guide the Backup admin on how to get the required permissions.
       
1. On the **Protected operations** tab, select the operations you need to protect using this resource guard under the **Backup vault** tab.

   Currently, the **Protected operations** tab includes only the *Delete backup instance* option to disable.

   You can also [select the operations for protection after creating the resource guard](?pivots=vaults-recovery-services-vault#select-operations-to-protect-using-resource-guard).

   :::image type="content" source="./media/multi-user-authorization/backup-vault-select-operations-for-protection.png" alt-text="Screenshot showing how to select operations for protecting using Resource Guard.":::

1. Optionally, add any tags to the Resource Guard as per the requirements.
1. Select **Review + Create** and then follow the notifications to monitor the status and the successful creation of the Resource Guard.

### Select operations to protect using Resource Guard

After vault creation, the Security admin can also choose the operations for protection using the Resource Guard among all supported critical operations. By default, all supported critical operations are enabled. However, the Security admin can exempt certain operations from falling under the purview of MUA using Resource Guard.

To select the operations for protection, follow these steps:

1. In the Resource Guard that you've created, go to **Properties** > **Backup vault** tab.
1. Select **Disable** for the operations that you want to exclude from being authorized.

   You can't disable the **Remove MUA protection** and **Disable soft delete** operations.

1. Optionally, in the **Backup vaults** tab, update the description for the Resource Guard.
1. Select **Save**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-properties-backup-vault-inline.png" alt-text="Screenshot showing demo resource guard properties for Backup vault." lightbox="./media/multi-user-authorization/demo-resource-guard-properties-backup-vault-expanded.png":::

## Assign permissions to the Backup admin on the Resource Guard to enable MUA

The Backup admin must have **Reader** role on the Resource Guard or subscription that contains the Resource Guard to enable MUA on a vault. The Security admin needs to assign this role to the Backup admin.

To assign the **Reader** role on the Resource Guard, follow these steps:

1. In the Resource Guard created above, go to the **Access Control (IAM)** blade, and then go to **Add role assignment**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-access-control.png" alt-text="Screenshot showing demo resource guard-access control for Backup vault.":::
    
1. Select **Reader** from the list of built-in roles, and select **Next**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-add-role-assignment-inline.png" alt-text="Screenshot showing demo resource guard-add role assignment for Backup vault." lightbox="./media/multi-user-authorization/demo-resource-guard-add-role-assignment-expanded.png":::

1. Click **Select members** and add the Backup admin's email ID to assign the **Reader** role.

   As the Backup admins are in another  tenant, they'll be added as guests to the tenant that contains the Resource Guard.

1. Click **Select** > **Review + assign** to complete the role assignment.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-select-members-inline.png" alt-text="Screenshot showing demo resource guard-select members to protect the backup items in Backup vault." lightbox="./media/multi-user-authorization/demo-resource-guard-select-members-expanded.png":::

## Enable MUA on a Backup vault

Once the Backup admin has the Reader role on the Resource Guard, they can enable multi-user authorization on vaults managed by following these steps:

1. Go to the Backup vault for which you want to configure MUA.
1. On the left panel, select **Properties**.
1. Go to **Multi-User Authorization** and select **Update**.

   :::image type="content" source="./media/multi-user-authorization/test-backup-vault-properties.png" alt-text="Screenshot showing the Backup vault properties.":::

1. To enable MUA and choose a Resource Guard, perform one of the following actions:

   - You can either specify the URI of the Resource Guard. Ensure that you specify the URI of a Resource Guard you have **Reader** access to and it's in the same region as the vault. You can find the URI (Resource Guard ID) of the Resource Guard on its **Overview** page.

     :::image type="content" source="./media/multi-user-authorization/resource-guard-rg-inline.png" alt-text="Screenshot showing the Resource Guard for Backup vault protection." lightbox="./media/multi-user-authorization/resource-guard-rg-expanded.png":::
    
   - Or, you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

     1. Click **Select Resource Guard**.
     1. Select the dropdown and select the directory the Resource Guard is in.
     1. Select **Authenticate** to validate your identity and access.
     1. After authentication, choose the **Resource Guard** from the list displayed.

     :::image type="content" source="./media/multi-user-authorization/test-backup-vault-1-multi-user-authorization.png" alt-text="Screenshot showing multi-user authorization enabled on Backup vault.":::

1. Select **Save** to enable MUA.

   :::image type="content" source="./media/multi-user-authorization/testvault1-enable-mua.png" alt-text="Screenshot showing how to enable Multi-user authentication.":::

## Protected operations using MUA

Once the Backup admin enables MUA, the operations in scope will be restricted on the vault, and the operations fail if the Backup admin tries to perform them without having the **Contributor** role on the Resource Guard.

>[!NOTE]
>We highly recommend you to test your setup after enabling MUA to ensure that:
>- Protected operations are blocked as expected.
>- MUA is correctly configured.

To perform a protected operation (disabling MUA), follow these steps:

1. Go to the vault > **Properties** in the left pane.
1. Clear the checkbox to disable MUA.

   You'll receive a notification that it's a protected operation, and you need to have access to the Resource Guard.

1. Select the directory containing the Resource Guard and authenticate yourself.

   This step may not be required if the Resource Guard is in the same directory as the vault.

1. Select **Save**.

   The request fails with an error that you don't have sufficient permissions on the Resource Guard to perform this operation.

   :::image type="content" source="./media/multi-user-authorization/test-vault-properties-security-settings-inline.png" alt-text="Screenshot showing the test Backup vault properties security settings." lightbox="./media/multi-user-authorization/test-vault-properties-security-settings-expanded.png":::

## Authorize critical (protected) operations using Azure Active Directory Privileged Identity Management

There are scenarios where you may need to perform critical operations on your backups and you can perform them with the right approvals or permissions with MUA. The following sections explain how to authorize the critical operation requests using Privileged Identity Management (PIM).

The Backup admin must have a Contributor role on the Resource Guard to perform critical operations in the Resource Guard scope. One of the ways to allow just-in-time (JIT) operations is through the use of [Azure Active Directory (Azure AD) Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md).

>[!NOTE]
>We recommend that you use the Azure AD PIM. However, you can also use manual or custom methods to manage access for the Backup admin on the Resource Guard. To manually manage access to the Resource Guard, use the *Access control (IAM)* setting on the left pane of the Resource Guard and grant the **Contributor** role to the Backup admin.

### Create an eligible assignment for the Backup admin using Azure Active Directory Privileged Identity Management

The **Security admin** can use PIM to create an eligible assignment for the Backup admin as a Contributor to the Resource Guard. This enables the Backup admin to raise a request (for the Contributor role) when they need to perform a protected operation.

To create an eligible assignment, follow the steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to security tenant of Resource Guard, and in the search, enter **Privileged Identity Management**.
1. In the left pane, select **Manage and go to Azure Resources**.
1. Select the resource (the Resource Guard or the containing subscription/RG) to which you want to assign the Contributor role.
   
   If you don't find any corresponding resources, then add the containing subscription that is managed by PIM.

1. Select the resource and go to **Manage** > **Assignments** >  **Add assignments**.

   :::image type="content" source="./media/multi-user-authorization/add-assignments.png" alt-text="Screenshot showing how to add assignments to protect a Backup vault.":::

1. In the Add assignments:
   1. Select the role as Contributor.
   1. Go to **Select members** and add the username (or email IDs) of the Backup admin.
   1. Select **Next**.

   :::image type="content" source="./media/multi-user-authorization/add-assignments-membership.png" alt-text="Screenshot showing how to add assignments-membership to protect a Backup vault.":::

1. In Assignment, select **Eligible** and specify the validity of the duration of eligible permission.
1. Select **Assign** to complete creating the eligible assignment.

   :::image type="content" source="./media/multi-user-authorization/add-assignments-setting.png" alt-text="Screenshot showing how to add assignments-setting to protect a Backup vault.":::

### Set up approvers for activating Contributor role

By default, the above setup may not have an approver (and an approval flow requirement) configured in PIM. To ensure that approvers have the **Contributor** role for request approval, the Security admin must follow these steps:

>[!Note]
>If the approver setup isn't configured, the requests are automatically approved without going through the Security admins or a designated approver’s review. [Learn more](../active-directory/privileged-identity-management/pim-resource-roles-configure-role-settings.md).

1. In Azure AD PIM, select **Azure Resources** on the left pane and select your Resource Guard.

1. Go to **Settings** > **Contributor** role.

   :::image type="content" source="./media/multi-user-authorization/add-contributor.png" alt-text="Screenshot showing how to add a contributor.":::

1. Select **Edit** to add the reviewers who must review and approve the activation request for the *Contributor* role in case you find that Approvers show *None* or display incorrect approver(s).

1. On the **Activation** tab, select **Require approval to activate** to add the approver(s) who must approve each request. 
1. Select security options, such as Multi-Factor Authentication (MFA), Mandating ticket to activate *Contributor* role.
1. Select the appropriate options on **Assignment** and **Notification** tabs as per your requirement.

   :::image type="content" source="./media/multi-user-authorization/edit-role-settings.png" alt-text="Screenshot showing how to edit the role setting.":::

1. Select **Update** to complete the setup of approvers to activate the *Contributor* role.

### Request activation of an eligible assignment to perform critical operations

After the Security admin creates an eligible assignment, the Backup admin needs to activate the role assignment for the Contributor role to perform protected actions.

To activate the role assignment, follow the steps:

1. Go to [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md). If the Resource Guard is in another directory, switch to that directory and then go to [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md).
1. Go to **My roles** > **Azure resources** in the left pane.
1. Select **Activate**  to activate the eligible assignment for *Contributor* role.

   A notification appears notifying that the request is sent for approval.

   :::image type="content" source="./media/multi-user-authorization/identity-management-myroles-inline.png" alt-text="Screenshot showing how to activate eligible assignments." lightbox="./media/multi-user-authorization/identity-management-myroles-expanded.png":::

### Approve activation requests to perform critical operations

Once the Backup admin raises a request for activating the Contributor role, the **Security admin** must review and approve the request.

To review and approve the request, follow these steps:

1. In the security tenant, go to [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md).
1. Go to **Approve Requests**.
1. Under **Azure resources**, you can see the request awaiting approval.

   Select **Approve** to review and approve the genuine request.

After the approval, the Backup admin receives a notification, via email or other internal alerting options,  that the request is approved.  Now, the Backup admin can perform the protected operations for the requested period.

## Perform a protected operation after approval

Once the Security admin approves the Backup admin's request for the Contributor role on the Resource Guard, they can perform protected operations on the associated vault. If the Resource Guard is in another directory, the Backup admin must authenticate themselves.

>[!NOTE]
>If the access was assigned using a JIT mechanism, the Contributor role is retracted at the end of the approved period. Otherwise, the Security admin manually removes the **Contributor** role assigned to the Backup admin to perform the critical operation.

The following screenshot shows an example of [disabling soft delete](backup-azure-security-feature-cloud.md#disabling-soft-delete-using-azure-portal) for an MUA-enabled vault.

:::image type="content" source="./media/multi-user-authorization/disable-soft-delete-inline.png" alt-text="Screenshot showing to disable soft delete for an MUA enabled vault." lightbox="./media/multi-user-authorization/disable-soft-delete-expanded.png":::

## Disable MUA on a Backup vault

Disabling the MUA is a protected operation that must be done by the Backup admin only. To do this, the Backup admin must have the required *Contributor* role in the Resource Guard. To obtain this permission, the Backup admin must first request the Security admin for the Contributor role on the Resource Guard using the just-in-time (JIT) procedure, such as [Azure Active Directory (Azure AD) Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md) or internal tools.

Then the Security admin approves the request if it's genuine and updates the Backup admin who now has Contributor role on the Resource guard. Learn more on [how to get this role](?pivots=vaults-backup-vault#assign-permissions-to-the-backup-admin-on-the-resource-guard-to-enable-mua).

To disable the MUA, the Backup admins must follow these steps:

1. Go to vault > **Properties** > **Multi-user Authorization**.
1. Select **Update** and clear the **Protect with Resource Guard** checkbox.
1. Select **Authenticate**  (if applicable) to choose the Directory that contains the Resource Guard and verify access.
1. Select **Save** to complete the process of disabling the MUA.
   
   :::image type="content" source="./media/multi-user-authorization/disable-mua.png" alt-text="Screenshot showing how to disable multi-user authorization.":::


::: zone-end

## Next steps

[Learn more about Multi-user authorization using Resource Guard](multi-user-authorization-concept.md).
