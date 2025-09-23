---
title: Audit and enforce backup operations for Azure Kubernetes Service clusters via Azure Backup using Azure Policy 
description: Learn how to use Azure Policy to audit and enforce backup operations for all Azure Kubernetes Service clusters created in a given scope
ms.topic: how-to
ms.date: 09/18/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a Backup or Compliance Admin, I want to audit and enforce backup operations for Azure Kubernetes Service clusters using Azure Policy, so that I can ensure all critical clusters are adequately backed up and compliant with organizational standards.
---

# Audit and enforce backup operations for Azure Kubernetes Service clusters using Azure Policy 

This article describes how Azure Backup uses built-in [Azure Policy](../governance/policy/overview.md) definitions to automate auditing and enforcement of [backup configurations for Azure Kubernetes Service (AKS) clusters](azure-kubernetes-service-backup-overview.md), ensuring compliance with organizational data protection standards.

As a Backup and Compliance admin, choose the policy that best fits your team's structure and resource organization to manage AKS cluster backups effectively.

## Azure Policy types for AKS cluster backup

The following table lists the various policy types that allows you to manage AKS clusters instances backups automatically:

| Policy type | Description |
| --- | --- |
| [Policy 1](#policy-1---azure-backup-extension-should-be-installed-in-aks-clusters) | Identifies AKS clusters that aren't compliant with backup requirements, without making any changes to the clusters. |
| [Policy 2](#policy-2---azure-backup-should-be-enabled-for-aks-clusters) | Identifies AKS clusters that don't have backups enabled, without making any changes to the clusters. |
| [Policy 3](#policy-3---install-azure-backup-extension-in-aks-clusters-managed-cluster-with-a-given-tag) | Automatically installs the Azure Backup extension on AKS clusters that meet specific tagging criteria, ensuring they're prepared for backup operations. |
| [Policy 4](#policy-4---install-azure-backup-extension-in-aks-clusters-managed-cluster-without-a-given-tag) | Automatically installs the Azure Backup extension on AKS clusters that don't meet specific tagging criteria, ensuring they're prepared for backup operations. |

## Policy 1 - Azure Backup Extension should be installed in AKS clusters

Use this [audit-only](../governance/policy/concepts/effects.md#audit) policy to identify the AKS clusters that don't have the backup extension installed. However, this policy doesn't automatically install the backup extension to these AKS clusters. It's useful only to evaluate the overall readiness of the AKS clusters for backup compliance, and not to take action immediately.

## Policy 2 - Azure Backup should be enabled for AKS clusters

Use this [audit-only](../governance/policy/concepts/effects.md#audit) policy to identify the clusters that don't have backups enabled. However, this policy doesn't automatically configure backups for these clusters. It's useful only to evaluate the overall compliance of the clusters, and not to take action immediately.

## Policy 3 - Install Azure Backup Extension in AKS clusters (Managed Cluster) with a given tag.

A central backup team in an organization can use this policy to install backup extension to any AKS clusters in a region. You can choose to **include** clusters that contain a certain tag, in the scope of this policy.

## Policy 4 - Install Azure Backup Extension in AKS clusters (Managed Cluster) without a given tag.

A central backup team in an organization can use this policy to install backup extension to any AKS clusters in a region. You can choose to **exclude** clusters that contain a certain tag, from the scope of this policy.

## Supported and unsupported Scenarios for AKS clusters backup with Azure Policy

Before you audit and enforce backups for AKS clusters, review the following supported and unsupported scenarios:

| Policy type | Supported | Unsupported |
| --- | --- | --- |
| Policy 1, 2, 3, and 4 | Supported for Azure Kubernetes Service clusters only. | Management group scope is currently unsupported.     |
| Policy 3 and 4 | Can be assigned to a single region and subscription at a time.  <br><b>Ensure that the necessary [prerequisites](azure-kubernetes-service-cluster-backup-concept.md#backup-extension) are enabled before you assign Policies 3 and 4. |       |

## Assign built-in Azure Policy for AKS clusters backup

This section describes the end-to-end process of assigning Policy 3: **Install Azure Backup Extension in AKS clusters (Managed Cluster) with a given tag**. Similar instructions apply for the other policies. Once assigned, any new AKS cluster created under this scope has backup extension installed automatically.

To assign Policy 3, follow these steps:

1. Sign in to the Azure portal and go to the **Policy** Dashboard.
   
2. Select **Definitions** in the left menu to get a list of all built-in policies across Azure Resources.
   
3. Filter the list for **Category=Backup** and select the policy named *Install Azure Backup Extension in AKS clusters (Managed Cluster) with a given tag*.
   
:::image type="content" source="./media/azure-kubernetes-service-cluster-backup-policy/policy-dashboard-inline.png" alt-text="Screenshot showing how to filter the list by category on Policy dashboard.":::

4. Select the name of the policy. You're then redirected to the detailed definition for this policy.

:::image type="content" source="./media/azure-kubernetes-service-cluster-backup-policy/policy-definition-blade.png" alt-text="Screenshot showing the Policy Definition tab.":::

5. Select the **Assign** button at the top of the pane. This redirects you to the **Assign Policy** pane.
   
6. Under **Basics**, select the three dots next to the **Scope** field. It opens up a right context pane where you can select the subscription for the policy to be applied on. You can also optionally select a resource group, so that the policy is applied only for AKS clusters in a particular resource group.

:::image type="content" source="media/azure-kubernetes-service-cluster-backup-policy/policy-assignment-basics.png" alt-text="Screenshot showing the Policy Assignment Basics tab.":::

7. In the **Parameters** tab, choose a location from the drop-down, and select the storage account to which the backup extension installed in the AKS cluster in the scope must be associated. You can also choose to specify a tag name and an array of tag values. An AKS cluster that contains any of the specified values for the given tag are excluded from the scope of the policy assignment.

:::image type="content" source="./media/azure-kubernetes-service-cluster-backup-policy/policy-assignment-parameters.png" alt-text="Screenshot showing the Policy Assignment Parameters pane.":::

8. Ensure that **Effect** is set to deployIfNotExists.
   
9. Navigate to **Review+create** and select **Create**.

> [!NOTE]
>
> - Use [remediation](../governance/policy/how-to/remediate-resources.md) to enable these policies on existing AKS clusters.

## Related content

[Learn more about Azure Policy](../governance/policy/overview.md)
