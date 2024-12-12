---
title: Audit and enforce backup for Managed Disks using Azure Policy 
description: 'An article describing how to use Azure Policy to audit and enforce backup for all Disks created in a given scope'
ms.topic: how-to
ms.date: 08/26/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Audit and enforce backup for Managed Disks using Azure Policy 

One of the key responsibilities of a Backup or Compliance Admin in an organization is to ensure that all business-critical machines are backed up with the appropriate retention.

Today, Azure Backup provides various built-in policies (using [Azure Policy](../governance/policy/overview.md)) to help you automatically ensure that your Azure Managed Disks are configured for backup. Depending on how your backup teams and resources are organized, you can use any one of the below policies:

## Policy 1 - Azure Backup should be enabled for Managed Disks

Use an [audit-only](../governance/policy/concepts/effects.md#audit) policy to identify disks which don't have backup enabled. However, this policy doesn't automatically configure backups for these disks. It is useful when you're only looking to evaluate the overall compliance of the disks but not looking to take action immediately.

## Policy 2 - Configure backup for Azure Disks (Managed Disks) with a given tag to an existing backup vault in the same region

A central backup team of an organization can use this policy to configure backup to an existing central Backup vault in the same subscription and location as the Managed Disks being governed. You can choose to **include** Disks that contain a certain tag, in the scope of this policy.

## Policy 3 - Configure backup for Azure Disks (Managed Disks) without a given tag to an existing backup vault in the same region

This policy works the same as Policy 2 above, with the only difference being that you can use this policy to **exclude** Disks that contain a certain tag, from the scope of this policy.

## Supported Scenarios

Before you audit and enforce backups for AKS clusters, see the following scenarios supported:

* The built-in policy is currently supported only for Azure Managed Disks. Ensure that the Backup Vault and backup policy specified during assignment is a Disk backup policy. 

* The Policies 2 and 3 can be assigned to a single location and subscription at a time. To enable backup for Disks across locations and subscriptions, multiple instances of the policy assignment need to be created, one for each combination of location and subscription.

* For the Policies 1, 2 and 3, management group scope is currently unsupported.

* For the  Policies 2 and 3, the specified vault and the disks configured for backup can be under different resource groups.


## Using the built-in policies

The below steps describe the end-to-end process of assigning Policy 2: **Configure backup on Managed Disks with a given tag to an existing backup vault in the same location to a given scope** . Similar instructions are applicable for the other policies. Once assigned, any new Managed Disk created in the scope is automatically configured for backup.

To assign Policy 2, follow these steps:

1. Sign in to the Azure portal and navigate to the **Policy** Dashboard.

2. Select **Definitions** in the left menu to get a list of all built-in policies across Azure Resources.

3. Filter the list for **Category=Backup** and select the policy named *Configure backup on Managed Disks with a given tag to an existing backup vault in the same location to a given scope*.
   
:::image type="content" source="./media/backup-managed-disks-policy/policy-dashboard-inline.png" alt-text="Screenshot showing how to filter the list by category on Policy dashboard.":::

4. Select the name of the policy. You're then redirected to the detailed definition for this policy.

:::image type="content" source="./media/backup-managed-disks-policy/policy-definition-blade.png" alt-text="Screenshot showing the Policy Definition pane.":::

5. Select the **Assign** button at the top of the pane. This redirects you to the **Assign Policy** pane.

6. Under **Basics**, select the three dots next to the **Scope** field. It opens up a right context pane where you can select the subscription for the policy to be applied on. You can also optionally select a resource group, so that the policy is applied only for Disks in a particular resource group.

:::image type="content" source="./media/backup-managed-disks-policy/policy-assignment-basics.png" alt-text="Screenshot showing the Policy Assignment Basics tab.":::

7. In the **Parameters** tab, choose a location from the drop-down, and select the vault, backup policy to which the Disks in the scope must be associated, and resource group where these disk snapshots are stored. You can also choose to specify a tag name and an array of tag values. A Disk that contains any of the specified values for the given tag is included in the scope of the policy assignment.

:::image type="content" source="./media/backup-managed-disks-policy/policy-assignment-parameters.png" alt-text="Screenshot showing the Policy Assignment Parameters pane.":::

8. Ensure that **Effect** is set to deployIfNotExists.

9. Navigate to **Review+create** and select **Create**.

> [!NOTE]
>
> - Use [remediation](../governance/policy/how-to/remediate-resources.md) to enable policy of existing Managed Disks.
> - It's recommended that this policy not be assigned to more than 200 Disks at a time. If the policy is assigned to more than 200 Disks, it can result in the backup being triggered a few hours later than that specified by the schedule.

## Next step

[Learn more about Azure Policy](../governance/policy/overview.md)
