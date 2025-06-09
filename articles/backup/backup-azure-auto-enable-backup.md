---
title: Audit and enforce backup during VM creation automatically using Azure Policy
description: Learn how to use Azure Policy to autoenable backup for all VMs created in a given scope.
ms.topic: how-to
ms.date: 06/09/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
---

# Audit and enforce backup during virtual machine creation automatically using Azure Policy

This article describes how Backup or Compliance Admins can ensure that all business-critical machines have appropriate backup and retention policies.

Azure Backup offers a variety of built-in policies through [Azure Policy](../governance/policy/overview.md) to help you automatically configure backup for your Azure Virtual Machines (VMs). Based on the structure of your backup teams and the organization of your resources, you can choose the most suitable policy from the following options to ensure effective and consistent backup management.

## Azure Policy types for Azure VM backup

The following table lists the various policy types that allows you to manage Azure VM instances backups automatically:

| Policy type | Description |
| --- | --- |
| Policy 1 | Configures backup on VMs without a given tag to an existing Recovery Services vault in the same location. |
| Policy 2 | Configures backup on VMs with a given tag to an existing Recovery Services vault in the same location. |
| Policy 3 | Configures backup on VMs without a given tag to a new Recovery Services vault with a default policy. |
| Policy 4 | Configures backup on VMs with a given tag to a new Recovery Services vault with a default policy. |

### Policy 1: Configure backup on VMs without a given tag to an existing recovery services vault in the same location

This policy enables a central backup team to configure backup for Azure Virtual Machines using an existing central Recovery Services vault located in the same subscription and region as the governed VMs. You can **exclude** specific VMs from the policy scope with a designated tag.


### Policy 2: Configure backup on VMs with a given tag to an existing recovery services vault in the same location
This policy functions same as Policy 1, with a key difference - the policy **includes** virtual machines in the policy scope if they have a specific tag.

### Policy 3: Configure backup on VMs without a given tag to a new recovery services vault with a default policy

This policy targets applications organized in dedicated resource groups and backs them up using the same Recovery Services vault. It automatically manages this configuration and allows you to **exclude** virtual machines from the policy scope that have a specific tag.

### Policy 4: Configure backup on VMs with a given tag to a new recovery services vault with a default policy

This policy functions same as Policy 3, with a key difference - the policy **includes** virtual machines in the policy scope if they have a specific tag.

Azure Backup also provides an [audit-only](../governance/policy/concepts/effects.md#audit) policy - **Azure Backup should be enabled for Virtual Machines**. This policy identifies virtual machines without backup enabled but doesn't apply any backup configuration, which helps assess compliance without enforcing changes.

## Supported and unsupported Scenarios for  Azure VMs backup  with Azure Policy

The following table lists the supported and unsupported scenarios for the available policy types:

| Policy type | Supported | Unsupported |
| --- | --- | --- |
| **Built-in policy** | Currently supported only for Azure VMs. Ensure that the retention policy specified during assignment is a VM retention policy. <br><br> Learn about [the VM SKUs supported by this policy](./backup-azure-policy-supported-skus.md) . |          |
| **Policies 1 and 2** | - Can be assigned to a single location and subscription at a time. To enable backup for VMs across locations and subscriptions, you need to create multiple instances of the policy assignment, one for each combination of location and subscription. <br><br> - The specified vault and the VMs configured for backup can be under different resource groups. | Management group scope is currently unsupported. |
| **Policies 3 and 4** | Can be assigned to a single subscription at a time (or a resource group within a subscription). |        |

[!INCLUDE [backup-center.md](../../includes/backup-center.md)]

## Assign built-in Azure Policy for Azure VM backup

This section outlines the end-to-end steps to assign [Policy 1](#policy-1-configure-backup-on-vms-without-a-given-tag-to-an-existing-recovery-services-vault-in-the-same-location). The same instructions apply to the other policies. After assignment, the policy automatically configures backup for any new VM created within the defined scope.

To assign Policy 1 for Azure VM backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Policy**> **Authoring** > **Definitions** to view the list of all built-in policies across Azure Resources.

1. On the **Policy Definitions** pane, filter the list for **Category=Backup** and select the policy named *Configure backup on virtual machines without a given tag to an existing recovery services vault in the same location*.

   :::image type="content" source="./media/backup-azure-auto-enable-backup/policy-dashboard-inline.png" alt-text="Screenshot showing how to filter the list by category on Policy dashboard." lightbox="./media/backup-azure-auto-enable-backup/policy-dashboard-expanded.png":::

1. On the selected policy pane, review the policy details, and then select **Assign**.

   :::image type="content" source="./media/backup-azure-auto-enable-backup/policy-definition-blade.png" alt-text="Screenshot shows the Policy Definition pane." lightbox="./media/backup-azure-auto-enable-backup/policy-definition-blade.png":::

1. On the **Assign Policy** pane, on the **Basics** tab, select the **more icon** corresponding to **Scope**.

   :::image type="content" source="./media/backup-azure-auto-enable-backup/policy-assignment-basics.png" alt-text="Screenshot shows the Policy Assignment Basics tab." lightbox="./media/backup-azure-auto-enable-backup/policy-assignment-basics.png":::

1. On the right context pane, select the subscription for the policy to be applied on. 

   You can also select a resource group, so that the policy is applied only for VMs in a particular resource group.

1. On the **Parameters** tab, select the **Location**, **Vault**, and **Backup Policy** to which the VMs in the scope must be associated.

   You can also specify a tag name and an array of tag values. A VM which contains any of the specified values for the given tag are excluded from the scope of the policy assignment.

   :::image type="content" source="./media/backup-azure-auto-enable-backup/policy-assignment-parameters.png" alt-text="Screenshot shows the Policy Assignment Parameters pane." lightbox="./media/backup-azure-auto-enable-backup/policy-assignment-parameters.png":::

   Ensure that **Effect** is set to **`deployIfNotExists`**.

1. On the **Review+create** tab, select **Create**.

> [!NOTE]
>
> - Azure Policy can also be used on existing VMs, using [remediation](../governance/policy/how-to/remediate-resources.md).
> - Avoid assigning this policy to more than 200 VM at once, as it might delay backup triggers by several hours beyond the scheduled time.

## Related content

[About Azure Policy](../governance/policy/overview.md).