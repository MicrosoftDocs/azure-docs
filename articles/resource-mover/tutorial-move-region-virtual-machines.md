---
title: Move Azure VMs across regions with Azure Resource Mover
description: Learn how to move Azure VMs to another region with Azure Resource Mover
manager: evansma
author: ankitaduttaMSFT 
ms.service: resource-mover
ms.topic: tutorial
ms.date: 02/10/2023
ms.author: ankitadutta
ms.custom: mvc, engagement-fy23
#Customer intent: As an Azure admin, I want to move Azure VMs to a different Azure region.
---

# Move Azure VMs across regions

This tutorial shows you how to move Azure VMs and related network/storage resources to a different Azure region using [Azure Resource Mover](overview.md).

Azure Resource Mover helps you move Azure resources between Azure regions. You might move your resources to another region for many reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Move Azure VMs to another region with Azure Resource Mover.
> * Move resources associated with VMs to another region.

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options where possible.

## Sign in to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin and sign in to the [Azure portal](https://portal.azure.com). 

## Prerequisites

Before you begin, verify the following:

| Requirement | Description |
|------------ | ------------|
| **Resource Mover support** | [Review](common-questions.md) the supported regions and other common questions. |
| **Subscription permissions** | Check that you have *Owner* access on the subscription containing the resources that you want to move<br/><br/> **Why do I need Owner access?** The first time you add a resource for a  specific source and destination pair in an Azure subscription, Resource Mover creates a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types), formerly known as Managed Service Identify (MSI) that's trusted by the subscription. To create the identity, and to assign it the required role (Contributor or User Access administrator in the source subscription), the account you use to add resources needs *Owner* permissions on the subscription. [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles.|
| **VM support** | - Check that the VMs you want to move are supported.<br/> - [Verify](support-matrix-move-region-azure-vm.md#windows-vm-support) supported Windows VMs.<br/> - [Verify](support-matrix-move-region-azure-vm.md#linux-vm-support) supported Linux VMs and kernel versions.<br/> - Check supported [compute](support-matrix-move-region-azure-vm.md#supported-vm-compute-settings), [storage](support-matrix-move-region-azure-vm.md#supported-vm-storage-settings), and [networking](support-matrix-move-region-azure-vm.md#supported-vm-networking-settings) settings.|
| **Destination subscription** | The subscription in the destination region needs enough quota to create the resources you're moving in the target region. If it doesn't have a quota, [request additional limits](../azure-resource-manager/management/azure-subscription-service-limits.md).|
|**Destination region charges** | Verify pricing and charges associated with the target region to which you're moving VMs. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help you.|

## Prepare VMs

To prepare VMs for the move, follow these steps:

1. After checking that VMs meet the requirements, ensure that the VMs you want to move are turned on. All VMs disks that you want to be available in the destination region must be attached and initialized in the VM.
1. Ensure that VMs have the latest trusted root certificates and an updated certificate revocation list (CRL). To do this:
    - On Windows VMs, install the latest Windows updates.
    - On Linux VMs, follow distributor guidance so that machines have the latest certificates and CRL. 
1. Allow outbound connectivity from VMs:
    - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to these [URLs](support-matrix-move-region-azure-vm.md#url-access).
    - If you're using network security group (NSG) rules to control outbound connectivity, create these [service tag rules](support-matrix-move-region-azure-vm.md#nsg-rules).

## Select resources 

Note that, all supported resource types in resource groups within the selected source region are displayed. The resources that have already been added for moving across regions aren't shown. You move resources to a target region in the same subscription as the source region. If you want to change the subscription, you can do that after the resources are moved.

To select the resources you want to move, follow these steps:

1. In the Azure portal, search for *resource mover*. Under **Services**, select **Azure Resource Mover**.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/search.png" alt-text="Screenshot displays search results for resource mover in the Azure portal." lightbox="./media/tutorial-move-region-virtual-machines/search.png":::

2. In **Overview** pane, select **Get Started**.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/get-started.png" alt-text="Screenshot displays button to add resources to move to another region." lightbox="./media/tutorial-move-region-virtual-machines/get-started.png":::

3. In **Move resources** > **Source + destination** tab, do the following: 
    1. Select the source subscription and region.
    1. Under **Destination**, select the region to which you want to move the VMs.
    1. Select **Next**.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/source-target.png" alt-text="Screenshot displays page to select source and destination region." lightbox="./media/tutorial-move-region-virtual-machines/source-target.png":::

6. In **Move resources** > **Resources to move** tab, do the following:
    1. Select the **Select resources** option.
    2. In **Select resources**, select the VM. You can only add the [resources supported for the move](#prepare-vms). 
    1. Select **Done**.

        :::image type="content" source="./media/tutorial-move-region-virtual-machines/select-vm.png" alt-text="Screenshot displays page to select VMs to move." lightbox="./media/tutorial-move-region-virtual-machines/select-vm.png":::

    1. Select **Next**.
1. In **Review**, check the source and the destination settings. 

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/review.png" alt-text="Screenshot displays page to review settings and proceed with move." lightbox="./media/tutorial-move-region-virtual-machines/review.png":::

10. Select **Proceed** to begin adding the resources.
11. After the add process finishes successfully, on the **Notifications** pane, select **Added resources for move**.
12. After you select the notification, review the resources on the **Across regions** page.

> [!NOTE]
> - Added resources are in a *Prepare pending* state.
> - The resource group for the VMs is added automatically.
> - If you want to remove a resource from a move collection, the method for doing that depends on where you are in the move process. [Learn more](remove-move-resources.md).

## Resolve dependencies

To resolve dependencies before the move, follow these steps:

1. Dependencies are automatically validated in the background when you add the resources. If you still see the **Validate dependencies** option, select it to trigger the validation manually.
2. If dependencies are found, select **Add dependencies** to add them. 
3. On **Add dependencies**, retain the default **Show all dependencies** option. 

    - **Show all dependencies** iterates through all the direct and indirect dependencies for a resource. For example, for a VM, it shows the NIC, virtual network, network security groups (NSGs), and so on.
    - **Show first-level dependencies only** shows only direct dependencies. For example, for a VM it shows the NIC but not the virtual network.

4. Select the dependent resources you want to add and select **Add dependencies**. You can monitor the progress in the notifications.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/add-dependencies.png" alt-text="Screenshot displays add dependencies page." lightbox="./media/tutorial-move-region-virtual-machines/add-dependencies.png":::

4. Dependencies are validated in the background after you add them. If you see a **Validate dependencies** button, select it to trigger the manual validation.  
    :::image type="content" source="./media/tutorial-move-region-virtual-machines/add-additional-dependencies.png" alt-text="Screenshot displays page to add additional dependencies." lightbox="./media/tutorial-move-region-virtual-machines/add-additional-dependencies.png":::


## Move the source resource group 

Before you can prepare and move the VMs, the VM resource group must be present in the target region. 

### Prepare to move the source resource group

During the Prepare process, Resource Mover generates Azure Resource Manager (ARM) templates using the resource group settings. Resources inside the resource group aren't affected.

**To prepare to move a source resource group, follow these steps:**

1. On the **Across regions** pane, select the source resource group > **Prepare**.
2. On **Prepare resources** pane, select **Prepare** to start the process.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/prepare-resource-group.png" alt-text="Screenshot displays Prepare resource group." lightbox="./media/tutorial-move-region-virtual-machines/prepare-resource-group.png":::

> [!NOTE]
> After preparing the resource group, it's in the *Initiate move pending* state. 

### Move the source resource group

**To start the move, follows these steps:**

1. On the **Across regions** pane, select the resource group > **Initiate Move**.
2. On the **Move Resources** pane, select **Initiate move**. The resource group moves into an *Initiate move in progress* state.
3. After initiating the move, the target resource group is created, based on the generated ARM template. The source resource group moves into a *Commit move pending* state.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/commit-move-pending.png" alt-text="Screenshot displays select the initiate move button." lightbox="./media/tutorial-move-region-virtual-machines/commit-move-pending.png":::

**To commit and finish the move process:**

1. On the **Across regions** pane, select the resource group > **Commit move**.
2. On the **Move Resources** pane select **Commit**.

> [!NOTE]
> After committing the move, the source resource group is in a *Delete source pending* state.

## Prepare resources to move

Now that the source resource group is moved, you can prepare to move other resources that are in the *Prepare pending* state.

To move resources that are in the *Prepare pending* state, follow these steps:

1. On the **Across regions** pane, verify that the resources are now in a *Prepare pending* state, with no issues. If they're not, validate again and resolve any outstanding issues.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/prepare-pending.png" alt-text="Screenshot displays page showing resources in prepare pending state." lightbox="./media/tutorial-move-region-virtual-machines/prepare-pending.png":::

2. If you want to edit target settings before beginning the move, select the link in the **Destination configuration** column for the resource, and edit the settings. If you edit the target VM settings, the target VM size shouldn't be smaller than the source VM size.  

Now that the source resource group is moved, you can prepare to move the other resources.

3. Select the resources you want to prepare. 

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/prepare-other.png" alt-text="Screenshot displays page to select prepare for other resources." lightbox="./media/tutorial-move-region-virtual-machines/prepare-other.png":::

2. Select **Prepare**. 

> [!NOTE]
> - During the prepare process, the Azure Site Recovery Mobility agent is installed on the VMs to replicate them.
> - VM data is replicated periodically to the target region. This doesn't affect the source VM.
> - Resource Move generates ARM templates for the other source resources.
> - After preparing resources, they're in an *Initiate move pending* state.
> :::image type="content" source="./media/tutorial-move-region-virtual-machines/initiate-move-pending.png" alt-text="Screenshot displays page showing resources in initiate move pending state." lightbox="./media/tutorial-move-region-virtual-machines/initiate-move-pending.png":::


## Initiate the move

With resources prepared, you can now initiate the move. To start the move, follow these steps:

1. On the **Across regions** pane, select resources with state *Initiate move pending*. 
1. Select **Initiate move** to start the process.
1. On the **Move resources** tab, select **Initiate move**.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/initiate-move.png" alt-text="Screenshot displays select for the initiate move button." lightbox="./media/tutorial-move-region-virtual-machines/initiate-move.png":::

3. Track the move progress in the notifications bar.

> [!NOTE]
> - For VMs, replica VMs are created in the target region. The source VM is shut down, and some downtime occurs (usually minutes).
> - Resource Mover recreates other resources using the ARM templates that were prepared. There's usually no downtime.
> - After moving resources, they're in a *Commit move pending* state.
> :::image type="content" source="./media/tutorial-move-region-virtual-machines/delete-source-pending.png" alt-text="Screenshot displays page showing resources in *Delete source pending* state." lightbox="./media/tutorial-move-region-virtual-machines/delete-source-pending.png":::


## Commit or discard the move

After the initial move, you can decide if you want to commit the move or discard it. 

- **Discard**: You might discard a move if you're testing, and you don't want to actually move the source resource. Discarding the move returns the resource to a state of *Initiate move pending*.
- **Commit**: Commit completes the move to the target region. After committing, a source resource will be in a state of *Delete source pending*, and you can decide if you want to delete it.


### Discard the move 

You can discard the move as follows:

1. On **Across regions** pane, select resources with state *Commit move pending*, and select **Discard move**.
2. On **Discard move** pane, select **Discard**.
3. Track move progress in the notifications bar.


> [!NOTE]
> After discarding resources, VMs are in an *Initiate move pending* state.

### Commit the move

If you want to complete the move process, commit the move. To commit the move, follow these steps:

1. On **Across regions** pane, select resources with state *Commit move pending*, and select **Commit move**.
2. On **Commit resources** pane, select **Commit**.

    :::image type="content" source="./media/tutorial-move-region-virtual-machines/commit-resources.png" alt-text="Screenshot displays page to commit resources to finalize move." lightbox="./media/tutorial-move-region-virtual-machines/commit-resources.png":::

3. Track the commit progress in the notifications bar.

> [!NOTE]
> - After committing the move, VMs stop replicating. The source VM isn't impacted by the commit.
> - Commit doesn't impact source networking resources.
> - After committing the move, resources are in a *Delete source pending* state.
> :::image type="content" source="./media/tutorial-move-region-virtual-machines/delete-source-pending.png" alt-text="Screenshot displays page showing resources in *Delete source pending* state." lightbox="./media/tutorial-move-region-virtual-machines/delete-source-pending.png":::


## Configure settings after the move

You can configure the following settings after the move process:

- The Mobility service isn't uninstalled automatically from VMs. Uninstall it manually, or leave it if you plan to move the server again.
- Modify Azure role-based access control (Azure RBAC) rules after the move.


## Delete source resources after commit

After the move, you can optionally delete resources in the source region. To delete source resources after commit:

> [!NOTE]
> A few resources, for example key vaults and SQL Server servers, can't be deleted from the portal, and must be deleted from the resource property page.

1. On **Across Regions** pane, select the name of the source resource that you want to delete.
2. Select **Delete source**.

## Delete additional resources created for move

After the move, you can manually delete the move collection and Site Recovery resources that were created.

Before you delete the additional resources created for the move, note that:

- The move collection is hidden by default. To see it you must turn on hidden resources.
- The cache storage has a lock, before deleting the cache storage you must first delete the lock.

To delete the additional resources created for the move, follow these steps: 

1. Locate the resources in resource group ```RegionMoveRG-<sourceregion>-<target-region>```.
2. Check that all the VM and other source resources in the source region have been moved or deleted. This ensures that there are no pending resources using them.
2. Delete the resources:

    - The move collection name is ```movecollection-<sourceregion>-<target-region>```.
    - The cache storage account name is ```resmovecache<guid>```
    - The vault name is ```ResourceMove-<sourceregion>-<target-region>-GUID```.

## Next steps

[Learn more](./tutorial-move-region-sql.md) about moving Azure SQL databases and elastic pools to another region.

