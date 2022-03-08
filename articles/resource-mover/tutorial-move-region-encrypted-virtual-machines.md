---
title: Move encrypted Azure VMs across regions by using Azure Resource Mover
description: Learn how to move encrypted Azure VMs to another region by using Azure Resource Mover.
manager: evansma
author: rayne-wiselman 
ms.service: resource-move
ms.topic: tutorial
ms.date: 02/10/2021
ms.author: raynew
ms.custom: mvc
#Customer intent: As an Azure admin, I want to move Azure VMs to a different Azure region.
---

# Tutorial: Move encrypted Azure VMs across regions

This article discusses how to move encrypted Azure virtual machines (VMs) to a different Azure region by using [Azure Resource Mover](overview.md). 

Encrypted VMS can be described as either:

- VMs that have disks with Azure Disk Encryption enabled. For more information, see [Create and encrypt a Windows virtual machine by using the Azure portal](../virtual-machines/windows/disk-encryption-portal-quickstart.md).
- VMs that use customer-managed keys (CMKs) for encryption at rest, or server-side encryption. For more information, see [Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks](../virtual-machines/disks-enable-customer-managed-keys-portal.md).


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Check prerequisites. 
> * For VMs with Azure Disk Encryption enabled, copy keys and secrets from the source-region key vault to the destination-region key vault.
> * Prepare to move VMs and to select resources in the source region that you want to move them from.
> * Resolve resource dependencies.
> * For VMs with Azure Disk Encryption enabled, manually assign the destination key vault. For VMs that use server-side encryption with customer-managed keys, manually assign a disk encryption set in the destination region.
> * Move the key vault or disk encryption set.
> * Prepare and move the source resource group. 
> * Prepare and move the other resources.
> * Decide whether to discard or commit the move. 
> * Optionally, remove resources in the source region after the move.

> [!NOTE]
> This tutorial shows the quickest path for trying out a scenario. It uses only the default options. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Then, sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites

Requirement |Details
--- | ---
**Subscription permissions** | Check to ensure that you have *Owner* access on the subscription that contains the resources you want to move.<br/><br/> *Why do I need Owner access?* The first time you add a resource for a specific source and destination pair in an Azure subscription, Resource Mover creates a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types), formerly known as the Managed Service Identity (MSI). This identity is trusted by the subscription. Before you can create the identity and assign it the required roles (*Contributor* and *User access administrator* in the source subscription), the account you use to add resources needs *Owner* permissions in the subscription. For more information, see [Classic subscription administrator roles, Azure roles, and Azure AD roles](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles).
**VM support** | Check to ensure that the VMs you want to move are supported by doing the following:<li>[Verify](support-matrix-move-region-azure-vm.md#windows-vm-support) supported Windows VMs.<li>[Verify](support-matrix-move-region-azure-vm.md#linux-vm-support) supported Linux VMs and kernel versions.<li>Check supported [compute](support-matrix-move-region-azure-vm.md#supported-vm-compute-settings), [storage](support-matrix-move-region-azure-vm.md#supported-vm-storage-settings), and [networking](support-matrix-move-region-azure-vm.md#supported-vm-networking-settings) settings.
**Key vault requirements (Azure Disk Encryption)** | If you have Azure Disk Encryption enabled for VMs, you need a key vault in both the source and destination regions. For more information, see [Create a key vault](../key-vault/general/quick-create-portal.md).<br/><br/> For the key vaults in the source and destination regions, you need these permissions:<li>Key permissions: Key Management Operations (Get, List) and Cryptographic Operations (Decrypt and Encrypt)<li>Secret permissions: Secret Management Operations (Get, List, and Set)<li>Certificate (List and Get)
**Disk encryption set (server-side encryption with CMK)** | If you're using VMs with server-side encryption that uses a CMK, you need a disk encryption set in both the source and destination regions. For more information, see [Create a disk encryption set](../virtual-machines/disks-enable-customer-managed-keys-portal.md#set-up-your-disk-encryption-set).<br/><br/> Moving between regions isn't supported if you're using hardware security module (HSM keys) for customer-managed keys.
**Target region quota** | The subscription needs enough quota to create the resources you're moving in the target region. If it doesn't have quota, [request additional limits](../azure-resource-manager/management/azure-subscription-service-limits.md).
**Target region charges** | Verify the pricing and charges that are associated with the target region to which you're moving the VMs. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/).


## Verify permissions in the key vault

If you're moving VMs that have Azure Disk Encryption enabled, you need to run a script as mentioned in the [Copy the keys to the destination key vault](#copy-the-keys-to-the-destination-key-vault) section. The users who execute the script should have appropriate permissions to do so. To understand which permissions are needed, refer to the following table. You'll find the options for changing the permissions by going to the key vault in the Azure portal. Under **Settings**, select **Access policies**.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/key-vault-access-policies.png" alt-text="Screenshot of the 'Access policies' link on the key vault Settings pane." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/key-vault-access-policies.png":::

If the user permissions aren't in place, select **Add Access Policy**, and then specify the permissions. If the user account already has a policy, under **User**, set the permissions according to the instructions in the following table.

Azure VMs that use Azure Disk Encryption can have the following variations, and you'll need to set the permissions according to their relevant components. The VMs might have:
- A default option where the disk is encrypted with secrets only.
- Added security that uses a [Key Encryption Key (KEK)](../virtual-machines/windows/disk-encryption-key-vault.md#set-up-a-key-encryption-key-kek).

### Source region key vault

For users who execute the script, set permissions for the following components: 

Component | Permissions needed
--- | ---
Secrets |  *Get* <br></br> Select **Secret permissions** > **Secret Management Operations**, and then select **Get**. 
Keys <br></br> If you're using a KEK, you need these permissions in addition to the permissions for secrets. | *Get* and *Decrypt* <br></br> Select **Key Permissions** > **Key Management Operations**, and then select **Get**. In **Cryptographic Operations**, select **Decrypt**.

### Destination region key vault

In **Access policies**, make sure that **Azure Disk Encryption for volume encryption** is enabled. 

For users who execute the script, set permissions for the following components: 

Component | Permissions needed
--- | ---
Secrets |  *Set* <br></br> Select **Secret permissions** > **Secret Management Operations**, and then select **Set**. 
Keys <br></br> If you're using a KEK, you need these permissions in addition to the permissions for secrets. | *Get*, *Create*, and *Encrypt* <br></br> Select **Key Permissions** > **Key Management Operations**, and then select **Get** and **Create** . In **Cryptographic Operations**, select **Encrypt**.

<br>

In addition to the preceding permissions, in the destination key vault, you need to add permissions for the [Managed System Identity](./common-questions.md#how-is-managed-identity-used-in-resource-mover) that Resource Mover uses to access the Azure resources on your behalf. 

1. Under **Settings**, select **Add Access policies**. 
1. In **Select principal**, search for the MSI. The MSI name is ```movecollection-<sourceregion>-<target-region>-<metadata-region>```. 
1. For the MSI, add the following permissions:

    Component | Permissions needed
    --- | ---
    Secrets|  *Get* and *List* <br></br> Select **Secret permissions** > **Secret Management Operations**, and then select **Get** and **List**. 
    Keys <br></br> If you're using a KEK, you need these permissions in addition to the permissions for secrets. | *Get* and *List* <br></br> Select **Key Permissions** > **Key Management Operations**, and then select **Get** and **List**.

<br>

### Copy the keys to the destination key vault

Copy the encryption secrets and keys from the source key vault to the destination key vault by using a [script](https://raw.githubusercontent.com/AsrOneSdk/published-scripts/master/CopyKeys/CopyKeys.ps1) that we provide.

- Run the script in PowerShell. We recommend that you use the latest PowerShell version.
- Specifically, the script requires these modules:
    - Az.Compute
    - Az.KeyVault (version 3.0.0)
    - Az.Accounts (version 2.2.3)

To run the script, do the following:

1. Open the [script](https://raw.githubusercontent.com/AsrOneSdk/published-scripts/master/CopyKeys/CopyKeys.ps1) in GitHub.
1. Copy the contents of the script to a local file, and name it *Copy-keys.ps1*.
1. Run the script.
1. Sign in to the Azure portal.
1. In the drop-down lists in the **User Inputs** window, select the source subscription, resource group, and source VM, and then select the target location, and the target vaults for disk and key encryption.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/script-input.png" alt-text="Screenshot of the 'User Inputs' window for entering the script values." :::

1. Select the **Select** button. 
   
   When the script has finished running, a message notifies you that CopyKeys has succeeded.

## Prepare VMs

1. After you've checked to ensure that the VMs satisfy the [prerequisites](#prerequisites), make sure that the VMs you want to move are turned on. All VM disks that you want to be available in the destination region must be attached and initialized in the VM.
1. To ensure that the VMs have the latest trusted root certificates and an updated certificate revocation list (CRL), do the following:
    - On Windows VMs, install the latest Windows updates.
    - On Linux VMs, follow distributor guidance so that the machines have the latest certificates and CRL. 
1. To allow outbound connectivity from the VMs, do either of the following:
    - If you're using a URL-based firewall proxy to control outbound connectivity, [allow access to the URLs](support-matrix-move-region-azure-vm.md#url-access).
    - If you're using network security group (NSG) rules to control outbound connectivity, create these [service tag rules](support-matrix-move-region-azure-vm.md#nsg-rules).

## Select the resources to move

- You can select any supported resource type in any of the resource groups in the source region you select.  
- You can move resources to a target region that's in the same subscription as the source region. If you want to change the subscription, you can do so after the resources are moved.

To select the resources, do the following:

1. In the Azure portal, search for **resource mover**. Then, under **Services**, select **Azure Resource Mover**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/search.png" alt-text="Screenshot of search results for Azure Resource Mover in the Azure portal." :::

1. On the Azure Resource Mover **Overview** pane, select **Move across regions**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/move-across-regions.png" alt-text="Screenshot of the 'Move across regions' button for adding resources to move to another region." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/move-across-regions.png":::

1. On the **Move resources** pane, select the **Source + destination** tab. Then, in the drop-down lists, select the source subscription and region.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/source-target.png" alt-text="Page to select source and destination region.." :::

1. Under **Destination**, select the region where you want to move the VMs, and then select **Next**.

1. Select the **Resources to move** tab, and then select **Select resources**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-resources.png" alt-text="Screenshot of the 'Move resources' pane and 'Select resources' button.]." :::

1. On the **Select resources** pane, select the VMs you want to move. As mentioned in the [Select the resources to move](#select-the-resources-to-move) section, you can add only resources that are supported for a move.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-vm.png" alt-text="Screenshot of the 'Select resources' pane for selecting VMs to move." :::

    > [!NOTE]
    >  In this tutorial, you're selecting a VM that uses server-side encryption (rayne-vm) with a customer-managed key, and a VM with disk encryption enabled (rayne-vm-ade).

1. Select **Done**.
1. Select the **Resources to move** tab, and then select **Next**.
1. Select the **Review** tab, and then check the source and destination settings. 

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/review.png" alt-text="Screenshot of the pane for reviewing source and destination settings." :::

1. Select **Proceed** to begin adding the resources.
1. Select the notifications icon to track progress. After the process finishes successfully, on the **Notifications** pane, select **Added resources for move**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/added-resources-notification.png" alt-text="Screenshot of the 'Notifications' pane for confirming that resources were added successfully." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/added-resources-notification.png":::
    
1. After you select the notification, review the resources on the **Across regions** page.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-prepare-pending.png" alt-text="Screenshot of added resources with a 'Prepare pending' status." :::

> [!NOTE]
> - The resources you add are placed into a *Prepare pending* state.
> - The resource group for the VMs is added automatically.
> - If you modify the **Destination configuration** entries to use a resource that already exists in the destination region, the resource state is set to *Commit pending*, because you don't need to initiate a move for it.
> - If you want to remove a resource that's been added, the method you'll use depends on where you are in the move process. For more information, see [Manage move collections and resource groups](remove-move-resources.md).


## Resolve dependencies

1. If any resources show a *Validate dependencies* message in the **Issues** column, select the **Validate dependencies** button.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/check-dependencies.png" alt-text="Screenshot showing the 'Validate dependencies' button." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/check-dependencies.png":::

    The validation process begins.
1. If dependencies are found, select **Add dependencies**.  

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/add-dependencies.png" alt-text="Screenshot of the 'Add dependencies' button." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/add-dependencies.png":::


1. On the **Add dependencies** pane, leave the default **Show all dependencies** option.

    - **Show all dependencies** iterates through all the direct and indirect dependencies for a resource. For example, for a VM, it shows the NIC, virtual network, network security groups (NSGs), and so on.
    - **Show first-level dependencies only** shows only direct dependencies. For example, for a VM it shows the NIC but not the virtual network.
 
1. Select the dependent resources you want to add, and then select **Add dependencies**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-dependencies.png" alt-text="Screenshot of the dependencies list and the 'Add dependencies' button." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/select-dependencies.png":::

1. Validate the dependencies again. 

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/validate-again.png" alt-text="Screenshot of the pane for revalidating the dependencies." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/validate-again.png":::

## Assign destination resources

You need to manually assign destination resources that are associated with encryption.

- If you're moving a VM that has Azure Disk Encryption enabled, the key vault in your destination region appears as a dependency.
- If you're moving a VM with server-side encryption that uses CMKs, the disk encryption set in the destination region appears as a dependency. 
- Because this tutorial demonstrates moving a VM that has Azure Disk Encryption enabled and that uses a CMK, both the destination key vault and the disk encryption set show up as dependencies.

To assign the destination resources manually, do the following:

1. In the disk encryption set entry, select **Resource not assigned** in the **Destination configuration** column.
1. In **Configuration settings**, select the destination disk encryption set, and then select **Save changes**.
1. You can save and validate dependencies for the resource you're modifying, or you can save only the changes, and then validate everything you modify at the same time.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-destination-set.png" alt-text="Screenshot of the 'Destination configuration' pane for saving changes in the destination region." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/select-destination-set.png":::

    After you've added the destination resource, the status of the disk encryption set is changed to *Commit move pending*.

1. In the key vault entry, select **Resource not assigned** in the **Destination configuration** column. Under **Configuration settings**, select the destination key vault, and then save your changes. 

At this stage, the disk encryption set and key vault statuses are changed to *Commit move pending*.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/prepare-other-resources.png" alt-text="Screenshot of the pane for preparing other resources." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/prepare-other-resources.png":::

To commit and finish the move process for encryption resources, do the following:

1. In **Across regions**, select the resource (disk encryption set or key vault), and then select **Commit move**.
1. In **Move Resources**, select **Commit**.

> [!NOTE]
> After you've committed the move, the resource status changes to *Delete source pending*.


## Move the source resource group 

Before you can prepare and move VMs, the VM resource group must be present in the target region. 

### Prepare to move the source resource group

During the preparation process, Resource Mover generates Azure Resource Manager (ARM) templates from the resource group settings. The resources inside the resource group are unaffected.

To prepare to move the source resource group, do the following:

1. In **Across regions**, select the source resource group, and then select **Prepare**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/prepare-resource-group.png" alt-text="Screenshot of the 'Prepare' button on the 'Prepare resources' pane." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/prepare-resource-group.png":::

1. In **Prepare resources**, select **Prepare**.

> [!NOTE]
> After you've prepared the move, the resource group status changes to *Initiate move pending*. 

 
### Move the source resource group

Begin moving the source resource group by doing the following:

1. On the **Across regions** pane, select the resource group, and then select **Initiate move**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/initiate-move-resource-group.png" alt-text="Screenshot of the 'Initiate move' button on the 'Across regions' pane." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/initiate-move-resource-group.png":::

1. On the **Move resources** pane, select **Initiate move**. The resource group status changes to *Initiate move in progress*.   
1. After you initiate the move, the target resource group is created, based on the generated ARM template. The source resource group status changes to *Commit move pending*.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-commit-move-pending.png" alt-text="Screenshot of the 'Move resources' pane showing the resource group status changed to 'Commit move pending'." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-commit-move-pending.png":::

To commit the move and finish the process, do the following:

1. On the **Across regions** pane, select the resource group, and then select **Commit move**.
1. On the **Move Resources** pane, select **Commit**.

> [!NOTE]
> After you've committed the move, the source resource group status changes to *Delete source pending*.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-delete-move-pending.png" alt-text="Screenshot of the source resource group showing the status changed to 'Delete source pending'." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-delete-move-pending.png":::

## Prepare resources to move

Now that the encryption resources and the source resource group are moved, you can prepare to move other resources whose current status is *Prepare pending*.


1. On the **Across regions** pane, validate the move again and resolve any issues.
1. If you want to edit the target settings before you begin the move, select the link in the **Destination configuration** column for the resource, and then edit the settings. If you edit the target VM settings, the target VM size shouldn't be smaller than the source VM size.
1. For resources with a *Prepare pending* status that you want to move, select **Prepare**.
1. On the **Prepare resources** pane, select **Prepare**.

    - During the preparation, the Azure Site Recovery mobility agent is installed on the VMs to replicate them.
    - The VM data is replicated periodically to the target region. This doesn't affect the source VM.
    - Resource Move generates ARM templates for the other source resources.

> [!NOTE]
> After you've prepared the resources, their status changes to *Initiate move pending*.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-initiate-move-pending.png" alt-text="Screenshot of the 'Prepare resources' pane, showing the resources in 'Initiate move pending' status." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resources-initiate-move-pending.png":::



## Initiate the move

Now that you've prepared the resources prepared, you can initiate the move. 

1. On the **Across regions** pane, select the resources whose status is *Initiate move pending*, and then select **Initiate move**.
1. On the **Move resources** pane, select **Initiate move**.
1. Track the progress of the move in the notifications bar.

    - For VMs, replica VMs are created in the target region. The source VM is shut down, and some downtime occurs (usually minutes).
    - Resource Mover re-creates other resources by using the prepared ARM templates. There's usually no downtime.
    - After you've moved the resources, their status changes to *Commit move pending*.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move-pending.png" alt-text="Screenshot of a list of resources with a 'Commit move pending' status." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move-pending.png" :::


## Discard or commit?

After the initial move, you can decide whether to commit the move or discard it. 

- **Discard**: You might discard a move if you're testing it and don't want to actually move the source resource. Discarding the move returns the resource to *Initiate move pending* status.
- **Commit**: Commit completes the move to the target region. After you've committed a source resource, its status changes to *Delete source pending*, and you can decide whether you want to delete it.


## Discard the move 

To discard the move, do the following:

1. On the **Across regions** pane, select resources whose status is *Commit move pending*, and then select **Discard move**.
1. On the **Discard move** pane, select **Discard**.
1. Track the progress of the move in the notifications bar.


> [!NOTE]
> After you've discarded the resources, The VM statuses change to *Initiate move pending*.

## Commit the move

To complete the move process, you commit the move by doing the following: 

1. On the **Across regions** pane, select resources whose status is *Commit move pending*, and then select **Commit move**.
1. On the **Commit resources** pane, select **Commit**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move.png" alt-text="Screenshot of a list of resources to commit resources to finalize the move." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move.png" :::

1. Track the commit progress in the notifications bar.

> [!NOTE]
> - After you've committed the move, the VMs stop replicating. The source VM is unaffected by the commit.
> - The commit process doesn't affect the source networking resources.
> - After you've committed the move, the resource statuses change to *Delete source pending*.



## Configure settings after the move

- The mobility service isn't uninstalled automatically from VMs. Uninstall it manually, or leave it if you plan to move the server again.
- Modify Azure role-based access control (RBAC) rules after the move.

## Delete source resources after commit

After the move, you can optionally delete resources in the source region. 

1. On the **Across regions** pane, select each source resource that you want to delete, and then select **Delete source**.
1. In **Delete source**, review what you intend to delete and, in **Confirm delete**, type **yes**. The action is irreversible, so check carefully!
1. After you type **yes**, select **Delete source**.

> [!NOTE]
>  In the Resource Move portal, you can't delete resource groups, key vaults, or SQL Server instances. You need to delete each individually from the properties page for each resource.


## Delete resources that you created for the move

After the move, you can manually delete the move collection and Site Recovery resources that you created during this process.

- The move collection is hidden by default. To see it you need to turn on hidden resources.
- The cache storage has a lock that must be deleted, before it can be deleted.

To delete your resources, do the following: 
1. Locate the resources in resource group ```RegionMoveRG-<sourceregion>-<target-region>```.
1. Check to ensure that all the VMs and other source resources in the source region have been moved or deleted. This step ensures that there are no pending resources using them.
1. Delete the resources:

    - Move collection name: ```movecollection-<sourceregion>-<target-region>```
    - Cache storage account name: ```resmovecache<guid>```
    - Vault name: ```ResourceMove-<sourceregion>-<target-region>-GUID```
## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Moved encrypted Azure VMs and their dependent resources to another Azure region.


As a next step, try moving Azure SQL databases and elastic pools to another region.

> [!div class="nextstepaction"]
> [Move Azure SQL resources](./tutorial-move-region-sql.md)
