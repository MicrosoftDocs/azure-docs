---
title: Multi-user authorization using Resource Guard
description: An overview of Multi-user authorization using Resource Guard.
ms.topic: how-to
ms.date: 12/06/2021
author: v-amallick
ms.service: backup
ms.author: v-amallick
---
# Multi-user authorization using Resource Guard (Preview)

Multi-user authorization (MUA) for Azure Backup allows you to add an additional layer of protection to critical operations on your Recovery Services vaults. For MUA, Azure Backup uses another Azure resource called the Resource Guard to ensure critical operations are performed only with applicable authorization.

This document includes the following:

- How MUA using Resource Guard works
- Before you start
- Testing scenarios
- Create a Resource Guard
- Enable MUA on a Recovery Services vault
- Protect against unauthorized operations on a vault
- Authorize critical operations on a vault
- Disable MUA on a Recovery Services vault

>[!NOTE]
> Multi-user authorization for Backup is currently in preview and is available in all public Azure regions.

## How does MUA for Backup work?

Azure Backup uses the Resource Guard as an authorization service for a Recovery Services vault. Therefore, to perform a critical operation (described below) successfully, you must have sufficient permissions on the associated Resource Guard as well.

> [!Important]
> To function as intended, the Resource Guard must be owned by a different user, and the vault admin must not have Contributor permissions. You can place Resource Guard in a subscription or tenant different from the one containing the Recovery Services vault to provide better protection.

### Critical operations

The following table lists the operations defined as critical operations and can be protected by a Resource Guard. You can choose to exclude certain operations from being protected using the Resource Guard when associating vaults with it. Note that operations denoted as Mandatory cannot be excluded from being protected using the Resource Guard for vaults associated with it. Also, the excluded critical operations would apply to all vaults associated with a Resource Guard.

**Operation** | **Mandatory/Optional**
--- | ---
Disable soft delete | Mandatory
Disable MUA protection | Mandatory
Modify backup policy | Optional: Can be excluded
Modify protection | Optional: Can be excluded
Stop protection | Optional: Can be excluded
Change MARS security PIN | Optional: Can be excluded

### Concepts
The concepts and the processes involved when using MUA for Backup are explained below.

Let’s consider the following two users for a clear understanding of the process and responsibilities. These two roles are referenced throughout this article.

**Backup admin**: Owner of the Recovery Services vault and performs management operations on the vault. To begin with, the Backup admin must not have any permissions on the Resource Guard.

**Security admin**: Owner of the Resource Guard and serves as the gatekeeper of critical operations on the vault. Hence, the Security admin controls permissions that the Backup admin needs to perform critical operations on the vault.

Following is a diagrammatic representation for performing a critical operation on a vault that has MUA configured using a Resource Guard.

:::image type="content" source="./media/multi-user-authorization/configure-mua-using-resource-card-diagram.png" alt-text="Diagrammatic representation on configuring MUA using a Resource Guard.":::
 

Here is the flow of events in a typical scenario:

1. The Backup admin creates the Recovery Services vault.
1. The Security admin creates the Resource Guard. The Resource Guard can be in a different subscription or a different tenant w.r.t the Recovery Services vault. It must be ensured that the Backup admin does not have Contributor permissions on the Resource Guard.
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

## Before you start

-  The Resource Guard and the Recovery Services vault must be in the same Azure region.
-  As stated in the previous section, ensure the Backup admin does **not** have **Contributor** permissions on the Resource Guard. You can choose to have the Resource Guard in another subscription of the same directory or in another directory to ensure maximum isolation.
- Ensure that your subscriptions containing the Recovery Services vault as well as the Resource Guard (in different subscriptions or tenants) are registered to use the **Microsoft.RecoveryServices** provider. For more details, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider-1).

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

## Creating a Resource Guard

The **Security admin** creates the Resource Guard. We recommend that you create it in a **different subscription** or a **different tenant** as the vault. However, it should be in the **same region** as the vault. The Backup admin must **NOT** have *contributor* access on the Resource Guard or the subscription that contains it.

For the following example, create the Resource Guard in a tenant different from the vault tenant.
1. In the Azure portal, navigate to the directory under which you wish to create the Resource Guard.
   
   :::image type="content" source="./media/multi-user-authorization/portal-settings-directories-subscriptions.png" alt-text="Screenshot showing the portal settings.":::
     
1. Search for **Resource Guards** in the search bar and select the corresponding item from the drop-down.
    
   :::image type="content" source="./media/multi-user-authorization/resource-guards-preview-inline.png" alt-text="Screenshot showing resource guards in preview." lightbox="./media/multi-user-authorization/resource-guards-preview-expanded.png":::
    
   - Click **Create** to start creating a Resource Guard.
   - In the create blade, fill in the required details for this Resource Guard.
       - Make sure the Resource Guard is in the same Azure regions as the Recovery Services vault.
       - Also, it is helpful to add a description of how to get or request access to perform actions on associated vaults when needed. This description would also appear in the associated vaults to guide the backup admin on getting the required permissions. You can edit the description later if needed, but having a well-defined description at all times is encouraged.
       
        :::image type="content" source="./media/multi-user-authorization/create-resource-guard.png" alt-text="Screenshot showing to create resource guard.":::
                
1. Optionally, add any tags to the Resource Guard as per the requirements
1. Click **Review + Create**
1. Follow notifications for status and successful creation of the Resource Guard.

### Select operations to protect using Resource Guard

Choose the operations you want to protect using the Resource Guard out of all supported critical operations. By default, all supported critical operations are enabled. However, you can exempt certain operations from falling under the purview of MUA using Resource Guard. The security admin can perform the following  steps:

1. In the Resource Guard created above, navigate to **Properties**.
2. Select **Disable** for operations that you wish to exclude from being authorized using the Resource Guard. Note that the operations **Disable soft delete** and **Remove MUA protection** cannot be disabled.
3. Optionally, you can also update the description for the Resource Guard using this blade. 
4. Click **Save**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-properties.png" alt-text="Screenshot showing demo resource guard properties.":::

## Assign permissions to the Backup admin on the Resource Guard to enable MUA

To enable MUA on a vault, the admin of the vault must have **Reader** role on the Resource Guard or subscription containing the Resource Guard. To assign the **Reader** role on the Resource Guard:

1. In the Resource Guard created above, navigate to the Access Control (IAM) blade, and then go to **Add role assignment**.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-access-control.png" alt-text="Screenshot showing demo resource guard-access control.":::
    
1. Select **Reader** from the list of built-in roles and click **Next** on the bottom of the screen.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-add-role-assignment-inline.png" alt-text="Screenshot showing demo resource guard-add role assignment." lightbox="./media/multi-user-authorization/demo-resource-guard-add-role-assignment-expanded.png":::

1. Click **Select members** and add the Backup admin’s email ID to add them as the **Reader**. Since the Backup admin is in another  tenant in this case, they will be added as guests to the tenant containing the Resource Guard.

1. Click **Select** and then proceed to **Review + assign** to complete the role assignment.

   :::image type="content" source="./media/multi-user-authorization/demo-resource-guard-select-members-inline.png" alt-text="Screenshot showing demo resource guard-select members." lightbox="./media/multi-user-authorization/demo-resource-guard-select-members-expanded.png":::

## Enable MUA on a Recovery Services vault

Now that the Backup admin has the Reader role on the Resource Guard, they can easily enable multi-user authorization on vaults managed by them. The following steps are performed by the **Backup admin**.

1. Go to the Recovery Services vault. Navigate to **Properties** on the left navigation panel, then to **Multi-User Authorization** and click **Update**.

   :::image type="content" source="./media/multi-user-authorization/test-vault-properties.png" alt-text="Screenshot showing the Recovery services vault-properties.":::

1. Now you are presented with the option to enable MUA and choose a Resource Guard using one of the following ways:

   1. You can either specify the URI of the Resource Guard, make sure you specify the URI of a Resource Guard you have **Reader** access to and that is the same regions as the vault. You can find the URI (Resource Guard ID) of the Resource Guard in its **Overview** screen:

      :::image type="content" source="./media/multi-user-authorization/resource-guard-rg-inline.png" alt-text="Screenshot showing the Resource Guard." lightbox="./media/multi-user-authorization/resource-guard-rg-expanded.png":::
    
   1. Or you can select the Resource Guard from the list of Resource Guards you have **Reader** access to, and those available in the region.

      1. Click **Select Resource Guard**
      1. Click on the dropdown and select the directory the Resource Guard is in.
      1. Click **Authenticate** to validate your identity and access.
      1. After authentication, choose the **Resource Guard** from the list displayed.

      :::image type="content" source="./media/multi-user-authorization/testvault1-multi-user-authorization-inline.png" alt-text="Screenshot showing multi-user authorization." lightbox="./media/multi-user-authorization/testvault1-multi-user-authorization-expanded.png" :::

1. Click **Save** once done to enable MUA

   :::image type="content" source="./media/multi-user-authorization/testvault1-enable-mua.png" alt-text="Screenshot showing how to enable Multi-user authentication.":::

## Protect against unauthorized (protected) operations

Once you have enabled MUA, the operations in scope will be restricted on the vault, if the Backup admin tries to perform them without having the required role (i.e., Contributor role) on the Resource Guard.

 >[!NOTE]
 >It is highly recommended that you test your setup after enabling MUA to ensure that protected operations are blocked as expected and to ensure that MUA is correctly configured.

Depicted below is an illustration of what happens when the Backup admin tries to perform such a protected operation (For example, disabling soft delete is depicted here. Other protected operations have a similar experience). The following steps are performed by a Backup admin without required permissions.

1. To disable soft delete, navigate to the Recovery Services Vault > Properties > Security Settings and click **Update**, which brings up the Security Settings.
1. Disable the soft delete using the slider. You are informed that this is a protected operation, and you need to verify their access to the Resource Guard.
1. Select the directory containing the Resource Guard and Authenticate yourself. This step may not be required if the Resource Guard is in the same directory as the vault.
1. Proceed to click **Save**. The request fails with an error informing them about not having sufficient permissions on the Resource Guard to let you perform this operation.

   :::image type="content" source="./media/multi-user-authorization/test-vault-properties-security-settings-inline.png" alt-text="Screenshot showing the Test Vault properties security settings." lightbox="./media/multi-user-authorization/test-vault-properties-security-settings-expanded.png":::

## Authorize critical (protected) operations using Azure AD Privileged Identity Management

The following sub-sections discuss authorizing these requests using PIM. There are cases where you may need to perform critical operations on your backups and MUA can help you ensure that these are performed only when the right approvals or permissions exist. As discussed earlier, the Backup admin needs to have a Contributor role on the Resource Guard to perform critical operations that are in the Resource Guard scope. One of the ways to allow just-in-time for such operations is through the use of [Azure Active Directory (Azure AD) Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md).

>[!NOTE]
> Though using Azure AD PIM is the recommended approach, you can use manual or custom methods to manage access for the Backup admin on the Resource Guard. For managing access to the Resource Guard manually, use the ‘Access control (IAM)’ setting on the left navigation bar of the Resource Guard and grant the **Contributor** role to the Backup admin.

### Create an eligible assignment for the Backup admin (if using Azure AD Privileged Identity Management)

Using PIM, the Security admin can create an eligible assignment for the Backup admin as a Contributor to the Resource Guard. This enables the Backup admin to raise a request (for the Contributor role) when they need to perform a protected operation. To do so, the **security admin** performs the following:

1. In the security tenant (which contains the Resource Guard), navigate to **Privileged Identity Management** (search for this in the search bar in the Azure portal) and then go to  **Azure Resources** (under **Manage** on the left menu).
1. Select the resource (the Resource Guard or the containing subscription/RG) to which you want to assign the **Contributor** role.

   1. If you don’t see the corresponding resource in the list of resources, ensure you add the containing subscription to be managed by PIM.

1. In the selected resource, navigate to **Assignments** (under **Manage** on the left menu) and go to **Add assignments**.

    :::image type="content" source="./media/multi-user-authorization/add-assignments.png" alt-text="Screenshot showing how to add assignments.":::

1. In the Add assignments
   1. Select the role as Contributor.
   1. Go to Select members and add the username (or email IDs) of the Backup admin
   1. Click Next

   :::image type="content" source="./media/multi-user-authorization/add-assignments-membership.png" alt-text="Screenshot showing how to add assignments-membership.":::

1. In the next screen
   1. Under assignment type, choose **Eligible**.
   1. Specify the duration for which the eligible permission is valid.
   1. Click **Assign** to finish creating the eligible assignment.

   :::image type="content" source="./media/multi-user-authorization/add-assignments-setting.png" alt-text="Screenshot showing how to add assignments-setting.":::

### Set up approvers for activating Contributor role

By default, the setup above may not have an approver (and an approval flow requirement) configured in PIM. To ensure that approvers are required for allowing only authorized requests to go through, the security admin must perform the following steps.
Note if this is not configured, any requests will be automatically approved without going through the security admins or a designated approver’s review. More details on this can be found [here](../active-directory/privileged-identity-management/pim-resource-roles-configure-role-settings.md)

1. In Azure AD PIM, select **Azure Resources** on the left navigation bar and select your Resource Guard.

1. Go to **Settings** and then navigate to the **Contributor** role.

   :::image type="content" source="./media/multi-user-authorization/add-contributor.png" alt-text="Screenshot showing how to add contributor.":::

1. If the setting named **Approvers** shows None or displays incorrect approvers, click **Edit** to add the reviewers who would need to review and approve the activation request for the Contributor role.

1. In the **Activation** tab, select **Require approval to activate** and add the approver(s) who need to approve each request. You can also select other security options like using MFA and mandating ticket options to activate the Contributor role. Optionally, select relevant settings in the **Assignment** and **Notification** tabs as per your requirements.

   :::image type="content" source="./media/multi-user-authorization/edit-role-settings.png" alt-text="Screenshot showing how to edit role setting.":::

1. Click **Update** once done.

### Request activation of an eligible assignment to perform critical operations

After the security admin creates an eligible assignment, the Backup admin needs to activate the assignment for the Contributor role to be able to perform protected actions. The following actions are performed by the **Backup admin** to activate the role assignment.

1. Navigate to [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md). If the Resource Guard is in another directory, switch to that directory and then navigate to [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md).
1. Navigate to My roles > Azure resources on the left menu.
1. The Backup admin can see an Eligible assignment for the contributor role. Click **Activate** to activate it.
1. The Backup admin is informed via portal notification that the request is sent for approval.

   :::image type="content" source="./media/multi-user-authorization/identity-management-myroles-inline.png" alt-text="Screenshot showing to activate eligible assignments." lightbox="./media/multi-user-authorization/identity-management-myroles-expanded.png":::

### Approve activation of requests to perform critical operations

Once the Backup admin raises a request for activating the Contributor role, the request is to be reviewed and approved by the **security admin**.
1. In the security tenant, navigates to [Azure AD Privileged Identity Management.](../active-directory/privileged-identity-management/pim-configure.md)
1. Navigate to **Approve Requests**.
1. Under **Azure resources**, the request raised by the Backup admin requesting activation as a **Contributor** can be seen.
1. Review the request. If genuine, select the request and click **Approve** to approve it.
1. The Backup admin is informed by email (or other organizational alerting mechanisms) that their request is now approved.
1. Once approved, the Backup admin can perform protected operations for the requested period.

## Performing a protected operation after approval

Once the Backup admin’s request for the Contributor role on the Resource Guard is approved, they can perform protected operations on the associated vault. If the Resource Guard is in another directory, the Backup admin would need to authenticate themselves.

>[!NOTE]
> If the access was assigned using a JIT mechanism, the Contributor role is retracted at the end of the approved period. Else, the Security admin manually removes the **Contributor** role assigned to the Backup admin to perform the critical operation.

The following screenshot shows an example of disabling soft delete for an MUA-enabled vault.

:::image type="content" source="./media/multi-user-authorization/disable-soft-delete-inline.png" alt-text="Screenshot showing to disable soft delete." lightbox="./media/multi-user-authorization/disable-soft-delete-expanded.png":::

## Disable MUA on a Recovery Services vault

Disabling MUA is a protected operation, and hence, is protected using MUA. This means that the Backup admin must have the required Contributor role in the Resource Guard. Details on obtaining this role are described here. Following is a summary of steps to disable MUA on a vault.
1. The Backup admin requests the Security admin for **Contributor** role on the Resource Guard. They can request this to use the methods approved by the organization such as JIT procedures, like [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md), or other internal tools and procedures. 
1. The Security admin approves the request (if they find it worthy of being approved) and informs the Backup admin. Now the Backup admin has the ‘Contributor’ role on the Resource Guard.
1. The Backup admin navigates to the vault > Properties > Multi-user Authorization
1. Click **Update**
   1. Uncheck the Protect with Resource Guard check box
   1. Choose the Directory that contains the Resource Guard and verify access using the Authenticate button (if applicable).
   1. After **authentication**, click **Save**. With the right access, the request should be successfully completed.
   
   :::image type="content" source="./media/multi-user-authorization/disable-mua.png" alt-text="Screenshot showing to disable multi-user authentication.":::