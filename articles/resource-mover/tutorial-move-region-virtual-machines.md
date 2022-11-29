---
title: Move Azure VMs across regions with Azure Resource Mover
description: Learn how to move Azure VMs to another region with Azure Resource Mover
manager: evansma
author: rayne-wiselman 
ms.service: resource-move
ms.topic: tutorial
ms.date: 11/28/2022
ms.author: raynew
ms.custom: mvc, engagement-fy23
#Customer intent: As an Azure admin, I want to move Azure VMs to a different Azure region.

---
# Tutorial: Move Azure VMs across regions

Azure Resource Mover helps you move Azure resources between Azure regions. This tutorial shows you how to move Azure VMs and related network/storage resources to a different Azure region using [Azure Resource Mover](overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Check prerequisites and requirements.
> * Select the resources you want to move.
> * Resolve resource dependencies.
> * Prepare and move the source resource group. 
> * Prepare and move the other resources.
> * Decide whether you want to discard or commit the move. 
> * Optionally remove resources in the source region after the move.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario and using default options. 

## Prerequisites

Before you begin, verify the following prerequisites:

| Requirement | Description |
|------------ | ------------|
| **Resource Mover support** | [Review](common-questions.md) the supported regions and other common questions. |
| **Subscription permissions** | Check that you have *Owner* access on the subscription containing the resources that you want to move<br/><br/> **Why do I need Owner access?** The first time you add a resource for a  specific source and destination pair in an Azure subscription, Resource Mover creates a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly known as Managed Service Identify (MSI)) that's trusted by the subscription. To create the identity, and to assign it the required role (Contributor or User Access administrator in the source subscription), the account you use to add resources needs *Owner* permissions on the subscription. [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles.|
| **VM support** |  Check that the VMs you want to move are supported.<br/> - [Verify](support-matrix-move-region-azure-vm.md#windows-vm-support) supported Windows VMs.<br/> - [Verify](support-matrix-move-region-azure-vm.md#linux-vm-support) supported Linux VMs and kernel versions.<br/> - Check supported [compute](support-matrix-move-region-azure-vm.md#supported-vm-compute-settings), [storage](support-matrix-move-region-azure-vm.md#supported-vm-storage-settings), and [networking](support-matrix-move-region-azure-vm.md#supported-vm-networking-settings) settings.|
| **Destination subscription** | The subscription in the destination region needs enough quota to create the resources you're moving in the target region. If it doesn't have a quota, [request additional limits](../azure-resource-manager/management/azure-subscription-service-limits.md).
**Destination region charges** | Verify pricing and charges associated with the target region to which you're moving VMs. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help you.|
 

## Sign in to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Then sign in to the [Azure portal](https://portal.azure.com).   

## Prepare VMs

To prepare the VMs for the move, follow the given steps:

1. After checking that VMs meet the requirements, ensure that the VMs you want to move are turned on. All VMs disks that you want to be available in the destination region must be attached and initialized in the VM.
1. Make sure VMs have the latest trusted root certificates and an updated certificate revocation list (CRL). To do this:
    - On Windows VMs, install the latest Windows updates.
    - On Linux VMs, follow distributor guidance so that machines have the latest certificates and CRL. 
1. Allow outbound connectivity from VMs:
    - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to these [URLs](support-matrix-move-region-azure-vm.md#url-access)
    - If you're using network security group (NSG) rules to control outbound connectivity, create these [service tag rules](support-matrix-move-region-azure-vm.md#nsg-rules).

## Select resources 

Before you select the resources you want to move:

- All supported resource types in resource groups within the selected source region are displayed.
- Resources that have already been added for moving across regions aren't shown.
- You move resources to a target region in the same subscription as the source region. If you want to change the subscription, you can do that after the resources are moved.

To select the resources you want to move, follow these steps:

1. In the Azure portal, search for *resource mover*. Then, under **Services**, select **Azure Resource Mover**.

    ![Search results for resource mover in the Azure portal](./media/tutorial-move-region-virtual-machines/search.png)

2. In **Overview**, select **Get Started**.

    ![Button to add resources to move to another region](./media/tutorial-move-region-virtual-machines/get-started.png)

3. In **Move resources** > **Source + destination**, select the source subscription and region.
4. In **Destination**, select the region to which you want to move the VMs. Then select **Next**.

    ![Page to select source and destination region](./media/tutorial-move-region-virtual-machines/source-target.png)

6. In **Resources to move**, select **Select resources**.
7. In **Select resources**, select the VM. You can only add the [resources supported for the move](#prepare-vms). Then select **Done**.

    ![Page to select VMs to move](./media/tutorial-move-region-virtual-machines/select-vm.png)

8. In **Resources to move**, select **Next**.
9. In **Review**, check the source and the destination settings. 

    ![Page to review settings and proceed with move](./media/tutorial-move-region-virtual-machines/review.png)
10. Select **Proceed** to begin adding the resources.
11. After the add process finishes successfully, select **Adding resources for move** in the notification icon.
12. After selecting the notification, review the resources on the **Across regions** page.

> [!NOTE]
> - Added resources are in a *Prepare pending* state.
> - The resource group for the VMs is added automatically.
> - If you want to remove a resource from a move collection, the method for doing that depends on where you are in the move process. [Learn more](remove-move-resources.md).

## Resolve dependencies

To resolve dependencies before the move, follow these steps:

1. If resources show a *Validate dependencies* message in the **Issues** column, select the **Validate dependencies** button. The validation process begins.
2. If dependencies are found, select **Add dependencies**. 
3. In **Add dependencies**, leave the default **Show all dependencies** option.

    - Show all dependencies and iterates through all of the direct and indirect dependencies for a resource. For example, for a VM it shows the NIC, virtual network, network security groups (NSGs), etc.
    - Show first-level dependencies only shows only direct dependencies. For example, for a VM it shows the NIC, but not the virtual network.

4. Select the dependent resources you want to add > **Add dependencies**. Monitor the progress in the notifications.

    ![Add dependencies](./media/tutorial-move-region-virtual-machines/add-dependencies.png)

4. Validate dependencies again. 
    ![Page to add additional dependencies](./media/tutorial-move-region-virtual-machines/add-additional-dependencies.png)


## Move the source resource group 

Before you can prepare and move the VMs, the VM resource group must be present in the target region. 

### Prepare to move the source resource group

During the Prepare process, Resource Mover generates Azure Resource Manager (ARM) templates using the resource group settings. Resources inside the resource group aren't affected.

Prepare as follows:

1. In **Across regions**, select the source resource group > **Prepare**.
2. In **Prepare resources**, select **Prepare**.

    ![Prepare resource group](./media/tutorial-move-region-virtual-machines/prepare-resource-group.png)

> [!NOTE]
> After preparing the resource group, it's in the *Initiate move pending* state. 

 
### Move the source resource group

Start the move as follows:

1. In **Across regions**, select the resource group > **Initiate Move**
2. ln **Move Resources**, select **Initiate move**. The resource group moves into an *Initiate move in progress* state.
3. After initiating the move, the target resource group is created, based on the generated ARM template. The source resource group moves into a *Commit move pending* state.

    ![select the initiate move button](./media/tutorial-move-region-virtual-machines/commit-move-pending.png)

To commit and finish the move process:

1. In **Across regions**, select the resource group > **Commit move**.
2. ln **Move Resources**, select **Commit**.

> [!NOTE]
> After committing the move, the source resource group is in a *Delete source pending* state.

## Prepare resources to move

Now that the source resource group is moved, you can prepare to move other resources that are in the *Prepare pending* state.

1. In **Across regions**, verify that the resources are now in a *Prepare pending* state, with no issues. If they're not, validate again and resolve any outstanding issues.

    ![Page showing resources in prepare pending state](./media/tutorial-move-region-virtual-machines/prepare-pending.png)

2. If you want to edit target settings before beginning the move, select the link in the **Destination configuration** column for the resource, and edit the settings. If you edit the target VM settings, the target VM size shouldn't be smaller than the source VM size.  

Now that the source resource group is moved, you can prepare to move the other resources.

3. Select the resources you want to prepare. 

    ![Page to select prepare for other resources](./media/tutorial-move-region-virtual-machines/prepare-other.png)

2. Select **Prepare**. 

> [!NOTE]
> - During the prepare process, the Azure Site Recovery Mobility agent is installed on VMs, to replicate them.
> - VM data is replicated periodically to the target region. This doesn't affect the source VM.
> - Resource Move generates ARM templates for the other source resources.
> - After preparing resources, they're in an *Initiate move pending* state.

![Page showing resources in initiate move pending state](./media/tutorial-move-region-virtual-machines/initiate-move-pending.png)


## Initiate the move

With resources prepared, you can now initiate the move. To start the move, follow these steps:

1. In **Across regions**, select resources with state *Initiate move pending*. Then select **Initiate move**.
2. In **Move resources**, select **Initiate move**.

    ![select for the initiate move button](./media/tutorial-move-region-virtual-machines/initiate-move.png)

3. Track move progress in the notifications bar.

> [!NOTE]
> - For VMs, replica VMs are created in the target region. The source VM is shut down, and some downtime occurs (usually minutes).
> - Resource Mover recreates other resources using the ARM templates that were prepared. There's usually no downtime.
> - After moving resources, they're in a *Commit move pending* state.

![Page showing resources in *Delete source pending* state](./media/tutorial-move-region-virtual-machines/delete-source-pending.png)


## Discard or commit?

After the initial move, you can decide if you want to commit the move or discard it. 

- **Discard**: You might discard a move if you're testing, and you don't want to actually move the source resource. Discarding the move returns the resource to a state of *Initiate move pending*.
- **Commit**: Commit completes the move to the target region. After committing, a source resource will be in a state of *Delete source pending*, and you can decide if you want to delete it.


## Discard the move 

You can discard the move as follows:

1. In **Across regions**, select resources with state *Commit move pending*, and select **Discard move**.
2. In **Discard move**, select **Discard**.
3. Track move progress in the notifications bar.


> [!NOTE]
> After discarding resources, VMs are in an *Initiate move pending* state.

## Commit the move

If you want to complete the move process, commit the move. To commit the move, follow these steps:

1. In **Across regions**, select resources with state *Commit move pending*, and select **Commit move**.
2. In **Commit resources**, select **Commit**.

    ![Page to commit resources to finalize move](./media/tutorial-move-region-virtual-machines/commit-resources.png)

3. Track the commit progress in the notifications bar.

> [!NOTE]
> - After committing the move, VMs stop replicating. The source VM isn't impacted by the commit.
> - Commit doesn't impact source networking resources.
> - After committing the move, resources are in a *Delete source pending* state.

![Page showing resources in *Delete source pending* state](./media/tutorial-move-region-virtual-machines/delete-source-pending.png)


## Configure settings after the move

Configure the following settings after the move process:

- The Mobility service isn't uninstalled automatically from VMs. Uninstall it manually, or leave it if you plan to move the server again.
- Modify Azure role-based access control (Azure RBAC) rules after the move.


## Delete source resources after commit

After the move, you can optionally delete resources in the source region. 

> [!NOTE]
> A few resources, for example key vaults and SQL Server servers, can't be deleted from the portal, and must be deleted from the resource property page.

1. In **Across Regions**, select the name of the source resource that you want to delete.
2. Select **Delete source**.

## Delete additional resources created for move

After the move, you can manually delete the move collection and Site Recovery resources that were created.

Before you delete the additional resources created for the move, note that:

- The move collection is hidden by default. To see it you need to turn on hidden resources.
- The cache storage has a lock that must be deleted, before it can be deleted.

To delete the additional resources created for the move, follow these steps: 

1. Locate the resources in resource group ```RegionMoveRG-<sourceregion>-<target-region>```.
2. Check that all the VM and other source resources in the source region have been moved or deleted. This ensures that there are no pending resources using them.
2. Delete the resources:

    - The move collection name is ```movecollection-<sourceregion>-<target-region>```.
    - The cache storage account name is ```resmovecache<guid>```
    - The vault name is ```ResourceMove-<sourceregion>-<target-region>-GUID```.

## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Moved Azure VMs to another Azure region.
> * Moved resources associated with VMs to another region.

Now, try [moving Azure SQL databases and elastic pools to another region](./tutorial-move-region-sql.md).
