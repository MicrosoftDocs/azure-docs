---
title: Move Azure VMs to availability zones in another region with Azure Resource Mover
description: Learn how to move Azure VMs to availability zones with Azure Resource Mover.
manager: evansma
author: ankitaduttaMSFT 
ms.service: resource-mover
ms.topic: how-to
ms.date: 09/29/2023
ms.author: ankitadutta

#Customer intent: As an Azure admin,  I want to move Azure VMs to a different Azure region.

---
# Move Azure VMs to an availability zone in another region

In this article, learn how to move Azure VMs (and related network/storage resources) to an availability zone in a different Azure region, using [Azure Resource Mover](overview.md).

[Azure availability zones](../availability-zones/az-overview.md#availability-zones) help protect your Azure deployment from datacenter failures. Each availability zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there’s a minimum of three separate zones in all [enabled regions](../availability-zones/az-region.md). Using Resource Mover, you can move:

- A single instance VM to an availability zone/availability set in the target region.
- A VM in an availability set to an availability zone/availability set in the target region.
- A VM in a source region availability zone to an availability zone in the target region.

If you want to move VMs to a different availability zone in the same region, [review this article](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md).

## Prerequisites

- *Owner* access on the subscription in which resources you want to move are located.
    - The first time you add a resource for a  specific source and destination mapping in an Azure subscription, Resource Mover creates a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly known as Managed Service Identify (MSI)) that's trusted by the subscription.
    - To create the identity, and to assign it the required role (Contributor or User Access administrator in the source subscription), the account you use to add resources needs *Owner* permissions on the subscription. [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles.
- The subscription needs enough quota to create the source resources in the target region. If it doesn't, request additional limits. [Learn more](../azure-resource-manager/management/azure-subscription-service-limits.md).
- Verify pricing and charges associated with the target region to which you're moving VMs. Use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help you.
    
## Check VM requirements

1. Check that the VMs you want to move are supported.

    - [Verify](support-matrix-move-region-azure-vm.md#windows-vm-support) supported Windows VMs.
    - [Verify](support-matrix-move-region-azure-vm.md#linux-vm-support) supported Linux VMs and kernel versions.
    - Check supported [compute](support-matrix-move-region-azure-vm.md#supported-vm-compute-settings), [storage](support-matrix-move-region-azure-vm.md#supported-vm-storage-settings), and [networking](support-matrix-move-region-azure-vm.md#supported-vm-networking-settings) settings.
2. Check that VMs you want to move are turned on.
3. Make sure VMs have the latest trusted root certificates and an updated certificate revocation list (CRL). 
    - On Azure VMs running Windows, install the latest Windows updates.
    - On VMs running Linux, follow the Linux distributor guidance to ensure the machine has the latest certificates and CRL. 
4. Allow outbound connectivity from VMs:
    - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to these [URLs](support-matrix-move-region-azure-vm.md#url-access)
    - If you're using network security group (NSG) rules to control outbound connectivity, create these [service tag rules](support-matrix-move-region-azure-vm.md#nsg-rules).

## Select resources to move

- You can select any supported resource type across resource groups in the source region you have selected.
- You can move resources to a target region in the source region subscription. If you want to change the subscription, you can do that after the resources are moved.

1. In the Azure portal, search for resource mover. Then, under **Services**, select **Azure Resource Mover**.

    ![Search for Resource Mover](./media/move-region-availability-zone/search.png)

2. In **Overview**, select **Get started**.

    ![Button to get started](./media/move-region-availability-zone/get-started.png)

3. In **Move resources** > **Source + destination**, select the source subscription and region.
4. In **Destination**, select the region to which you want to move the VMs. Then select **Next**.

     ![Page to fill in source and destination subscription/region](./media/move-region-availability-zone/source-target.png)

6. In **Resources to move**, select **Select resources**.
7. In **Select resources**, select the VM. You can only add resources supported for move. Then select **Done**. In **Resources to move**, select **Next**.

    ![Page to select VMs to move](./media/move-region-availability-zone/select-vm.png)
8. In **Review + Add**, check the source and destination settings.

    ![Page to review settings and proceed with move](./media/move-region-availability-zone/review.png)

9. Select **Proceed**, to begin adding the resources.
10. After the add process finishes successfully, select **Adding resources for move** in the notification icon.

    ![Message in notifications](./media/move-region-availability-zone/notification.png)

> [!NOTE]
> After selecting the notification, resources appear on the **Across regions** page, in a *Prepare pending* state.
> - If you want to remove an resource from a move collection, the method for doing that depends on where you are in the move process. [Learn more](remove-move-resources.md).

## Resolve dependencies

1. Dependencies are auto-validated at the beginning when you add the resources. In case initial auto validation does not resolves the issue, the **Validate dependencies** ribbon appears. Select the ribbon to validate manually.
2. If dependencies are found, select **Add dependencies**. 
3. In **Add dependencies**, select the dependent resources > **Add dependencies**. Monitor progress in the notifications.

    ![Button to add dependencies](./media/move-region-availability-zone/add-dependencies.png)

3. Add additional dependencies if needed. Dependency validation happens automatically in the background. 

    ![Page to add additional dependencies](./media/move-region-availability-zone/add-additional-dependencies.png)

4. On the **Across regions** page, verify that resources are now in a *Prepare pending* state, with no issues.

    ![Page showing resources in prepare pending state](./media/move-region-availability-zone/prepare-pending.png)

## Move the source resource group 

Before you can prepare and move VMs, the source resource group must be present in the target region. 

### Prepare to move the source resource group

Prepare as follows:

1. In **Across regions**, select the source resource group > **Prepare**.
2. In **Prepare resources**, select **Prepare**.

    ![Button to prepare the source resource group](./media/move-region-availability-zone/prepare-resource-group.png)

    During the Prepare process, Resource Mover generates Azure Resource Manager (ARM) templates using the resource group settings. Resources inside the resource group aren't affected.

> [!NOTE]
>  After preparing the resource group, it's in the *Initiate move pending* state. 

![Status showing initiate pending state](./media/move-region-availability-zone/initiate-resource-group-pending.png)

### Move the source resource group

Initiate the move as follows:

1. In **Across regions**, select the resource group > **Initiate Move**
2. ln **Move Resources**, select **Initiate move**. The resource group moves into an *Initiate move in progress* state.
3. After initiating the move, the target resource group is created, based on the generated ARM template. The source resource group moves into a *Commit move pending* state.

![Status showing commit move](./media/move-region-availability-zone/commit-move-pending.png)

To commit and finish the move process:

1. In **Across regions**, select the resource group > **Commit move**
2. ln **Move Resources**, select **Commit**.

> [!NOTE]
> After committing the move, the source resource group is in a *Delete source pending* state.


## Add a target availability zone

Before we move the rest of the resources, we'll set a target availability zone for the VM.

1. In the **Across regions** page, select the link in the **Destination configuration** column of the VM you're moving.

    ![VM properties](./media/move-region-availability-zone/select-vm-settings.png)

3. In **Configuration settings**, specify the setting for the destination VM. You can configure a VM in the target region as follows:
    -  Create a new equivalent resource in the target region. Except for the settings you specify, the target resource is created with the same settings as the source.
    - Select an existing VM in the target region. 

4. In **Zones**, select the zone in which you want to place the VM when it moves.

    Changes are only made for the resource you're editing. You need to  update any dependent resources separately.

5. In **SKU**, specify the [Azure tier](..//virtual-machines/sizes.md) that you want to assign to the target VM.
6. In **Availability set**, select an availability set if you want the target VM to run within an availability set in the availability zone.
7. Select **Save changes**.

    ![VM settings](./media/move-region-availability-zone/vm-settings.png)


## Prepare resources to move

Now that the source resource group is moved, you can prepare to move the other resources.

1. In **Across regions**, select the resources you want to prepare. 

    ![Page to select prepare for other resources](./media/move-region-availability-zone/prepare-other.png)

2. Select **Prepare**. 

> [!NOTE]
> - During the prepare process, the Azure Site Recovery Mobility agent is installed on VMs, for replication.
> - VM data is replicated periodically to the target region. This doesn't affect the source VM.
> - Resource Move generates ARM templates for the other source resources.
> - After preparing resources, they're in an *Initiate move pending* state.

![Page showing resources in initiate move pending state](./media/move-region-availability-zone/initiate-move-pending.png)

## Initiate the move

With resources prepared, you can now initiate the move. 

1. In **Across regions**, select resources with state *Initiate move pending*. Then select **Initiate move**
2. In **Move resources**, select **Initiate move**.

    ![Page to initiate move of resources](./media/move-region-availability-zone/initiate-move.png)

3. Track move progress in the notifications bar.


> [!NOTE]
> - For VMs, replica VMs are created in the target region. The source VM is shut down, and some downtime occurs (usually minutes).
> - Resource Mover recreates other resources using the ARM templates that were prepared. There's usually no downtime.
> - After preparing resources, they're in an *Commit move pending* state.


![Page to show resources in a commit move pending state](./media/move-region-availability-zone/resources-commit-move-pending.png)

## Discard or commit?

After the initial move, you can decide whether you want to commit the move, or to discard it. 

- **Discard**: You might discard a move if you're testing, and you don't want to actually move the source resource. Discarding the move returns the resource to a state of *Initiate move pending*.
- **Commit**: Commit completes the move to the target region. After committing, a source resource will be in a state of *Delete source pending*, and you can decide if you want to delete it.

## Discard the move 

You can discard the move as follows:

1. In **Across regions**, select resources with state *Commit move pending*, and select **Discard move**.
2. In **Discard move**, select **Discard**.
3. Track move progress in the notifications bar.
 

> [!NOTE]
> For VMs, After discarding resources, they're in an *Initiate move pending* state.

## Commit the move

If you want to complete the move process, commit the move. 

1. In **Across regions**, select resources with state *Commit move pending*, and select **Commit move**.
2. In **Commit resources**, select **Commit**.

    ![Page to commit resources to finalize move](./media/move-region-availability-zone/commit-resources.png)

3. Track the commit progress in the notifications bar.

> [!NOTE]
> - After committing the move, VMs stop replicating. The source VM isn't impacted by the commit.
> - Commit doesn't impact source networking resources.
> - After committing the move, resources are in a *Delete source pending* state.

![Page showing resources in *Delete source pending* state](./media/move-region-availability-zone/delete-source-pending.png)

## Configure settings after the move

The Mobility service isn't uninstalled automatically from VMs. Uninstall it manually, or leave it if you plan to move the server again.


## Delete source resources after commit

After the move, you can optionally delete resources in the source region.

1. In **Across Regions**, select the name of each source resource that you want to delete.
2. In the properties page for each resource, select **Delete**.

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

[Learn about](about-move-process.md) the move process.