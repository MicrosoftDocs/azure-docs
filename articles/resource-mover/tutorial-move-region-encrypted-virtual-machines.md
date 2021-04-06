---
title: Move encrypted Azure VMs across regions with Azure Resource Mover
description: Learn how to move encrypted Azure VMs to another region with Azure Resource Mover
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

In this article, learn how to move encrypted Azure VMs to a different Azure region using [Azure Resource Mover](overview.md). Here's what we mean by encryption:

- VMs that have disks with Azure disk encryption enabled. [Learn more](../virtual-machines/windows/disk-encryption-portal-quickstart.md)
- Or, VMs that use customer-managed keys (CMKs) for encryption-at-rest (server-side encryption). [Learn more](../virtual-machines/disks-enable-customer-managed-keys-portal.md)


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Check prerequisites. 
> * For VMs with Azure disk encryption enabled, copy keys and secrets from the source region key vault to the destination region key vault.
> * Prepare VMs to move them, and select resources in the source region that you want to move.
> * Resolve resource dependencies.
> * For VMs with Azure disk encryption enabled, manually assign the destination key vault. For VMs using server-side encryption with customer-managed keys, manually assign a disk encryption set in the destination region.
> * Move the key vault and/or disk encryption set.
> * Prepare and move the source resource group. 
> * Prepare and move the other resources.
> * Decide whether you want to discard or commit the move. 
> * Optionally remove resources in the source region after the move.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Then sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites

**Requirement** |**Details**
--- | ---
**Subscription permissions** | Check you have *Owner* access on the subscription containing the resources that you want to move.<br/><br/> **Why do I need Owner access?** The first time you add a resource for a  specific source and destination pair in an Azure subscription, Resource Mover creates a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly known as Managed Service Identify (MSI)) that's trusted by the subscription. To create the identity, and to assign it the required role (Contributor and User Access administrator in the source subscription), the account you use to add resources needs *Owner* permissions on the subscription. [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles.
**VM support** | Check that the VMs you want to move are supported.<br/><br/> - [Verify](support-matrix-move-region-azure-vm.md#windows-vm-support) supported Windows VMs.<br/><br/> - [Verify](support-matrix-move-region-azure-vm.md#linux-vm-support) supported Linux VMs and kernel versions.<br/><br/> - Check supported [compute](support-matrix-move-region-azure-vm.md#supported-vm-compute-settings), [storage](support-matrix-move-region-azure-vm.md#supported-vm-storage-settings), and [networking](support-matrix-move-region-azure-vm.md#supported-vm-networking-settings) settings.
**Key vault requirements (Azure disk encryption)** | If you have Azure disk encryption enabled for VMs, in addition to the key vault in the source region, you need a key vault in the destination region. [Create a key vault](../key-vault/general/quick-create-portal.md).<br/><br/> For the key vaults in the source and target region, you need these permissions:<br/><br/> - Key permissions: Key Management Operations (Get, List); Cryptographic Operations (Decrypt and Encrypt).<br/><br/> - Secret permissions: Secret Management Operations (Get, List and Set)<br/><br/> - Certificate (List and Get).
**Disk encryption set (server-side encryption with CMK)** | If you're using VMs with server-side encryption using a CMK, in addition to the disk encryption set in the source region, you need a disk encryption set in the destination region. [Create a disk encryption set](../virtual-machines/disks-enable-customer-managed-keys-portal.md#set-up-your-disk-encryption-set).<br/><br/> Moving between regions isn't supported if you're using HSM keys for customer-managed keys.
**Target region quota** | The subscription needs enough quota to create the resources you're moving in the target region. If it doesn't have quota, [request additional limits](../azure-resource-manager/management/azure-subscription-service-limits.md).
**Target region charges** | Verify pricing and charges associated with the target region to which you're moving VMs. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help you.


## Verify user permissions on key vault for VMS using Azure Disk Encryption (ADE)

If you're moving VMs that have Azure disk encryption enabled, you need to run a script as mentioned [below](#copy-the-keys-to-the-destination-key-vault) for which the user executing the script should have appropriate permissions. Please refer to below table to know about permissions needed. The options to change the permissions can be found by navigating to the key vault in the Azure portal, Under **Settings**, select **Access policies**.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/key-vault-access-policies.png" alt-text="Button to open key vault access policies." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/key-vault-access-policies.png":::

If there are no user permissions, select **Add Access Policy**, and specify the permissions. If the user account already has a policy, under **User**, set the permissions as per the table below.

Azure VMs using ADE can have the following variations and the permissions need to be set accordingly for relevant components.
- Default option where the disk is encrypted using only secrets
- Added security using [key encryption key](../virtual-machines/windows/disk-encryption-key-vault.md#set-up-a-key-encryption-key-kek)

### Source region keyvault

The below permissions need to be set for the user executing the script 

**Component** | **Permission needed**
--- | ---
Secrets|  Get permission <br> </br> In **Secret permissions**>  **Secret Management Operations**, select **Get** 
Keys <br> </br> If you are using Key encryption key (KEK) you need this permission in addition to secrets| Get and Decrypt permission <br> </br> In **Key Permissions** > **Key Management Operations**, select **Get**. In **Cryptographic Operations**, select **Decrypt**.

### Destination region keyvault

In **Access policies**, make sure that **Azure Disk Encryption for volume encryption** is enabled. 

The below permissions need to be set for the user executing the script 

**Component** | **Permission needed**
--- | ---
Secrets|  Set permission <br> </br> In **Secret permissions**>  **Secret Management Operations**, select **Set** 
Keys <br> </br> If you are using Key encryption key (KEK) you need this permission in addition to secrets| Get, Create and Encrypt permission <br> </br> In **Key Permissions** > **Key Management Operations**, select **Get** and **Create** . In **Cryptographic Operations**, select **Encrypt**.

In addition to the the above permissions, in the destination key vault you need to add permissions for the [Managed System Identity](./common-questions.md#how-is-managed-identity-used-in-resource-mover) that Resource Mover uses for accessing the Azure resources on your behalf. 

1. Under **Settings**, select **Add Access policies**. 
2. In **Select principal**, search for the MSI. The MSI name is ```movecollection-<sourceregion>-<target-region>-<metadata-region>```. 
3. Add the below permissions for the MSI

**Component** | **Permission needed**
--- | ---
Secrets|  Get and List permission <br> </br> In **Secret permissions**>  **Secret Management Operations**, select **Get** and **List** 
Keys <br> </br> If you are using Key encryption key (KEK) you need this permission in addition to secrets| Get, List permission <br> </br> In **Key Permissions** > **Key Management Operations**, select **Get** and **List**



### Copy the keys to the destination key vault

You need to copy the encryption secrets and keys from the source key vault to the destination key vault, using a script we provide.

- You run the script in PowerShell. We recommend running the latest PowerShell version.
- Specifically, the script requires these modules:
    - Az.Compute
    - Az.KeyVault (version 3.0.0
    - Az.Accounts (version 2.2.3)

Run as follows:

1. Navigate to the [script](https://raw.githubusercontent.com/AsrOneSdk/published-scripts/master/CopyKeys/CopyKeys.ps1) in GitHub.
2. Copy the contents of the script to a local file, and name it *Copy-keys.ps1*.
3. Run the script.
4. Sign into Azure.
5. In the **User Input** pop-up, select the source subscription, resource group, and source VM. Then select the target location, and the target vaults for disk and key encryption.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/script-input.png" alt-text="Pop up to input script values." :::


6. When the script completes, screen output indicates that CopyKeys succeeded.

## Prepare VMs

1. After [checking that VMs meet requirements](#prerequisites), make sure that VMs you want to move are turned on. All VMs disks that you want to be available in the destination region must be attached and initialized in the VM.
3. Check that VMs have the latest trusted root certificates, and an updated certificate revocation list (CRL). To do this:
    - On Windows VMs, install the latest Windows updates.
    - On Linux VMs, follow distributor guidance so that machines have the latest certificates and CRL. 
4. Allow outbound connectivity from VMs as follows:
    - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to these [URLs](support-matrix-move-region-azure-vm.md#url-access)
    - If you're using network security group (NSG) rules to control outbound connectivity, create these [service tag rules](support-matrix-move-region-azure-vm.md#nsg-rules).

## Select resources to move


- You can select any supported resource type in any of the resource groups in the source region you select.  
- You move resources to a target region that's in the same subscription as the source region. If you want to change the subscription, you can do that after the resources are moved.

Select resources as follows:

1. In the Azure portal, search for *resource mover*. Then, under **Services**, select **Azure Resource Mover**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/search.png" alt-text="Search results for resource mover in the Azure portal." :::

2. In **Overview**, click **Move across regions**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/move-across-regions.png" alt-text="Button to add resources to move to another region." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/move-across-regions.png":::

3. In **Move resources** > **Source + destination**, select the source subscription and region.
4. In **Destination**, select the region to which you want to move the VMs. Then click **Next**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/source-target.png" alt-text="Page to select source and destination region.." :::

5. In **Resources to move**, click **Select resources**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-resources.png" alt-text="Button to select resource to move.]." :::

6. In **Select resources**, select the VMs. You can only add resources that are [supported for move](#prepare-vms). Then click **Done**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-vm.png" alt-text="Page to select VMs to move." :::

    > [!NOTE]
    >  In this tutorial we're selecting a VM that uses server-side encryption (rayne-vm) with a customer-managed key, and a VM with disk encryption enabled (rayne-vm-ade).

7.  In **Resources to move**, click **Next**.
8. In **Review**, check the source and destination settings. 

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/review.png" alt-text="Page to review settings and proceed with move." :::

9. Click **Proceed**, to begin adding the resources.
10. Select the notifications icon to track progress. After the add process finishes successfully, select **Added resources for move** in the notifications.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/added-resources-notification.png" alt-text="Notification to confirm resources were added successfully." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/added-resources-notification.png":::
    
    
11. After clicking the notification, review the resources on the **Across regions** page.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-prepare-pending.png" alt-text="Pages showing added resources with prepare pending." :::

> [!NOTE]
> - Resources you add are placed into a *Prepare pending* state.
> - The resource group for the VMs is added automatically.
> - If you modify the **Destination configuration** entries to use a resource that already exists in the destination region, the resource state is set to *Commit pending*, since you don't need to initiate a move for it.
> - If you want to remove a resource that's been added, the method for doing that depends on where you are in the move process. [Learn more](remove-move-resources.md).


## Resolve dependencies

1. If any resources show a *Validate dependencies* message in the **Issues** column, select the **Validate dependencies** button.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/check-dependencies.png" alt-text="NButton to check dependencies." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/check-dependencies.png":::

    The validation process begins.
2. If dependencies are found, click **Add dependencies**  

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/add-dependencies.png" alt-text="Button to add dependencies." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/add-dependencies.png":::


3. In **Add dependencies**, leave the default **Show all dependencies** option.

    - **Show all dependencies** iterates through all of the direct and indirect dependencies for a resource. For example, for a VM it shows the NIC, virtual network, network security groups (NSGs) etc.
    - **Show first level dependencies only** shows only direct dependencies. For example, for a VM it shows the NIC, but not the virtual network.
 
4. Select the dependent resources you want to add > **Add dependencies**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-dependencies.png" alt-text="Select dependencies from dependencies list." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/select-dependencies.png":::

5. Validate dependencies again. 

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/validate-again.png" alt-text="Page to validate again." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/validate-again.png":::

## Assign destination resources

Destination resources associated with encryption need manual assignment.

- If you're moving a VM that's has Azure disk encryption (ADE), the key vault in your destination region will appear as a dependency.
- If you're moving a VM that has server-side encryption that uses custom-managed keys (CMKs), then the disk encryption set in the destination region appears as a dependency. 
- Since this tutorial is moving a VM with ADE enabled, and a VM using a CMK, both the destination key vault and disk encryption set show up as dependencies.

Assign manually as follows:

1. In the disk encryption set entry, select **Resource not assigned** in the **Destination configuration** column.
2. In **Configuration settings**, select the destination disk encryption set. Then select **Save changes**.
3. You can select to save and validate dependencies for the resource you're modifying, or you can just save the changes, and validate everything you modify in one go.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/select-destination-set.png" alt-text="Page to select disk encryption set in destination region." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/select-destination-set.png":::

    After adding the destination resource, the status of the disk encryption set turns to *Commit move pending*.
3. In the key vault entry, select **Resource not assigned** in the **Destination configuration** column. **Configuration settings**, select the destination key vault. Save the changes. 

At this stage both the disk encryption set and the key vault status turns to *Commit move pending*.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/prepare-other-resources.png" alt-text="Page to select prepare for other resources." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/prepare-other-resources.png":::

To commit and finish the move process for encryption resources.

1. In **Across regions**, select the resource (disk encryption set or key vault) > **Commit move**.
2. ln **Move Resources**, click **Commit**.

> [!NOTE]
> After committing the move, the resource is in a *Delete source pending* state.


## Move the source resource group 

Before you can prepare and move VMs, the VM resource group must be present in the target region. 

### Prepare to move the source resource group

During the Prepare process, Resource Mover generates Azure Resource Manager (ARM) templates using the resource group settings. Resources inside the resource group aren't affected.

Prepare as follows:

1. In **Across regions**, select the source resource group > **Prepare**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/prepare-resource-group.png" alt-text="Prepare resource group." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/prepare-resource-group.png":::

2. In **Prepare resources**, click **Prepare**.

> [!NOTE]
> After preparing the resource group, it's in the *Initiate move pending* state. 

 
### Move the source resource group

Initiate the move as follows:

1. In **Across regions**, select the resource group > **Initiate Move**

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/initiate-move-resource-group.png" alt-text="Button to initiate move." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/initiate-move-resource-group.png":::

2. ln **Move Resources**, click **Initiate move**. The resource group moves into an *Initiate move in progress* state.   
3. After initiating the move, the target resource group is created, based on the generated ARM template. The source resource group moves into a *Commit move pending* state.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-commit-move-pending.png" alt-text="Review the commit move pending state." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-commit-move-pending.png":::

To commit and finish the move process:

1. In **Across regions**, select the resource group > **Commit move**.
2. ln **Move Resources**, click **Commit**.

> [!NOTE]
> After committing the move, the source resource group is in a *Delete source pending* state.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-delete-move-pending.png" alt-text="Review the delete move pending state." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resource-group-delete-move-pending.png":::

## Prepare resources to move

Now that the encryption resources and the source resource group are moved, you can prepare to move other resources that are in the *Prepare pending* state.


1. In **Across regions**, validate again and resolve any issues.
2. If you want to edit target settings before beginning the move, select the link in the **Destination configuration** column for the resource, and edit the settings. If you edit the target VM settings, the target VM size shouldn't be smaller than the source VM size.
3. Select **Prepare** for resources in the *Prepare pending* state that you want to move.
3. In **Prepare resources**, select **Prepare**

    - During the prepare process, the Azure Site Recovery Mobility agent is installed on VMs, to replicate them.
    - VM data is replicated periodically to the target region. This doesn't affect the source VM.
    - Resource Move generates ARM templates for the other source resources.

After preparing resources, they're in an *Initiate move pending* state.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-initiate-move-pending.png" alt-text="Page showing resources in initiate move pending state." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resources-initiate-move-pending.png":::



## Initiate the move

With resources prepared, you can now initiate the move. 

1. In **Across regions**, select resources with state *Initiate move pending*. Then click **Initiate move**.
2. In **Move resources**, click **Initiate move**.
3. Track move progress in the notifications bar.

    - For VMs, replica VMs are created in the target region. The source VM is shut down, and some downtime occurs (usually minutes).
    - Resource Mover recreates other resources using the ARM templates that were prepared. There's usually no downtime.
    - After moving resources, they're in an *Commit move pending* state.

:::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move-pending.png" alt-text="Page showing resources in a Commit move pending state." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move-pending.png" :::


## Discard or commit?

After the initial move, you can decide whether you want to commit the move, or to discard it. 

- **Discard**: You might discard a move if you're testing, and you don't want to actually move the source resource. Discarding the move returns the resource to a state of *Initiate move pending*.
- **Commit**: Commit completes the move to the target region. After committing, a source resource will be in a state of *Delete source pending*, and you can decide if you want to delete it.


## Discard the move 

You can discard the move as follows:

1. In **Across regions**, select resources with state *Commit move pending*, and click **Discard move**.
2. In **Discard move**, click **Discard**.
3. Track move progress in the notifications bar.


> [!NOTE]
> After discarding resources, VMs are in an *Initiate move pending* state.

## Commit the move

If you want to complete the move process, commit the move. 

1. In **Across regions**, select resources with state *Commit move pending*, and click **Commit move**.
2. In **Commit resources**, click **Commit**.

    :::image type="content" source="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move.png" alt-text="Page to commit resources to finalize move." lightbox="./media/tutorial-move-region-encrypted-virtual-machines/resources-commit-move.png" :::

3. Track the commit progress in the notifications bar.

> [!NOTE]
> - After committing the move, VMs stop replicating. The source VM isn't impacted by the commit.
> - Commit doesn't impact source networking resources.
> - After committing the move, resources are in a *Delete source pending* state.



## Configure settings after the move

- The Mobility service isn't uninstalled automatically from VMs. Uninstall it manually, or leave it if you plan to move the server again.
- Modify Azure role-based access control (Azure RBAC) rules after the move.

## Delete source resources after commit

After the move, you can optionally delete resources in the source region. 

1. In **Across Regions**, select each source resource that you want to delete. then select **Delete source**.
2. In **Delete source**, review what you're intending to delete, and in **Confirm delete**, type **yes**. The action is irreversible, so check carefully!
3. After typing **yes**, select **Delete source**.

> [!NOTE]
>  In the Resource Move portal, you can't delete resource groups, key vaults, or SQL Server servers. You need to delete these individually from the properties page for each resource.


## Delete additional resources created for move

After the move, you can manually delete the move collection, and Site Recovery resources that were created.

- The move collection is hidden by default. To see it you need to turn on hidden resources.
- The cache storage has a lock that must be deleted, before it can be deleted.

Delete as follows: 
1. Locate the resources in resource group ```RegionMoveRG-<sourceregion>-<target-region>```.
2. Check that all the VM and other source resources in the source region have been moved or deleted. This ensures that there are no pending resources using them.
2. Delete the resources:

    - The move collection name is ```movecollection-<sourceregion>-<target-region>```.
    - The cache storage account name is ```resmovecache<guid>```
    - The vault name is ```ResourceMove-<sourceregion>-<target-region>-GUID```.
## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Moved encrypted Azure VMs and their dependent resources to another Azure region.


Now, trying moving Azure SQL databases and elastic pools to another region.

> [!div class="nextstepaction"]
> [Move Azure SQL resources](./tutorial-move-region-sql.md)
