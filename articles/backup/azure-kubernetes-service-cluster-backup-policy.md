---
title: Audit and enforce backup operations for Azure Kubernetes Service clusters using Azure Policy 
description: 'An article describing how to use Azure Policy to audit and enforce backup operations for all Azure Kubernetes Service clusters created in a given scope'
ms.topic: how-to
ms.date: 08/26/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Audit and enforce backup operations for Azure Kubernetes Service clusters using Azure Policy 

One of the key responsibilities of a Backup or Compliance Admin in an organization is to ensure that all business-critical machines are backed up with the appropriate retention.

Azure Backup provides various built-in policies (using [Azure Policy](../governance/policy/overview.md)) to help you automatically ensure that your Azure Kubernetes Service clusters are ready for backup configuration. Depending on how your backup teams and resources are organized, you can use any one of the below policies:

## Policy 1 - Azure Backup Extension should be installed in AKS clusters

Use this [audit-only](../governance/policy/concepts/effects.md#audit) policy to identify the AKS clusters that don't have the backup extension installed. However, this policy doesn't automatically install the backup extension to these AKS clusters. It's useful only to evaluate the overall readiness of the AKS clusters for backup compliance, and not to take action immediately.

## Policy 2 - Azure Backup should be enabled for AKS clusters

Use this [audit-only](../governance/policy/concepts/effects.md#audit) policy to identify the clusters that don't have backups enabled. However, this policy doesn't automatically configure backups for these clusters. It's useful only to evaluate the overall compliance of the clusters, and not to take action immediately.

## Policy 3 - Install Azure Backup Extension in AKS clusters (Managed Cluster) with a given tag.

A central backup team in an organization can use this policy to install backup extension to any AKS clusters in a region. You can choose to **include** clusters that contain a certain tag, in the scope of this policy.

## Policy 4 - Install Azure Backup Extension in AKS clusters (Managed Cluster) without a given tag.

A central backup team in an organization can use this policy to install backup extension to any AKS clusters in a region. You can choose to **exclude** clusters that contain a certain tag, from the scope of this policy.

## Supported Scenarios

Before you audit and enforce backups for AKS clusters, see the following scenarios supported:

* The built-in policy is currently supported only for Azure Kubernetes Service clusters. 

* Users must take care to ensure that the necessary [prerequisites](azure-kubernetes-service-cluster-backup-concept.md#backup-extension) are enabled before Policies 3 and 4 are assigned.

* Policies 3 and 4 can be assigned to a single region and subscription at a time. 

* For Policies 1, 2, 3 and 4, management group scope is currently unsupported.

## Using the built-in policies

This section describes the end-to-end process of assigning Policy 3: **Install Azure Backup Extension in AKS clusters (Managed Cluster) with a given tag**. Similar instructions apply for the other policies. Once assigned, any new AKS cluster created under this scope has backup extension installed automatically.

To assign Policy 3, follow these steps:

1. Sign in to the Azure portal and navigate to the **Policy** Dashboard.
   
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

## Next step

[Learn more about Azure Policy](../governance/policy/overview.md)
