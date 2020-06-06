---
title: "Use Azure Policy to apply cluster configurations at scale (Preview)"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Use Azure Policy to apply cluster configurations at scale"
keywords: "Kubernetes, Arc, Azure, K8s, containers"
---

# Use Azure Policy to apply cluster configurations at scale (Preview)

## Overview

Use Azure Policy to enforce each `Microsoft.Kubernetes/connectedclusters` or Git-Ops enabled `Microsoft.ContainerService/managedClusters` resource has specific `Microsoft.KubernetesConfiguration/sourceControlConfigurations` applied.  To use Azure Policy you select an existing policy definition and create a policy assignment.  When creating the policy assignment you set the scope for the assignment: this will be an Azure resource group or subscription.  You also set the parameters for the `sourceControlConfiguration` that will be created.  Once the assignment is created the Policy engine will identify all `connectedCluster` or `managedCluster` resources that are located within the scope and will apply the `sourceControlConfiguration` to each one.

If you are using multiple Git repos as the sources of truth for each cluster (for instance, one repo for central IT/cluster operator and other repos for application teams), you can enable this by using multiple policy assignments, each policy assignment configured to use a different Git repo.

## Create a custom policy definition

1. In the Azure portal, navigate to Policy, and in the **Authoring** section of the sidebar, select **Definitions**.
2. Select **+ Policy definition**.
3. Set the **Definition location** to your subscription or management group.  This will determine the broadest scope where the policy definition can be used.
4. Give the policy a **Name** and **Description**.
5. Under category, choose **Create new**, and write *Kubernetes Cluster - Azure Arc*
6. In the **Policy rule** edit box, copy/paste the contents of this [example policy definition](https://raw.githubusercontent.com/Azure/arc-k8s-demo/master/policy/Ensure-GitOps-configuration-for-Kubernetes-cluster.json).
7. **Save**.

This step for creating a custom policy definition will not be needed once the work is completed to make this a built-in policy.

## Create a policy assignment

1. In the Azure portal, navigate to Policy, and in the **Authoring** section of the sidebar, select **Definitions**.
2. Find the definition you just created, and select it.
3. In the page actions, select **Assign**.
4. Set the **Scope** to the management group, subscription, or resource group where the policy assignment will apply.
5. If you want to exclude any resources from the policy scope, then set **Exclusions**.
6. Give the policy assignment a **Name** and **Description** that you can use to identify it easily.
7. Ensure that **Policy enforcement** is set to *Enabled*.
8. Select **Next**.
9. Set parameter values that will be used during the creation of the `sourceControlConfiguration`.
10. Select **Next**.
11. Enable **Create a remediation task**.
12. Assure that **Create a managed identity** is checked, and that the identity will have **Contributor** permissions.  See [this doc](https://docs.microsoft.com/azure/governance/policy/assign-policy-portal) and [the comment in this doc](https://docs.microsoft.com/azure/governance/policy/how-to/remediate-resources) for more information on the permissions you need.
13. Select **Review + create**.

After the policy assignment is created, for any new `connectedCluster` resource (or `managedCluster` resource with the GitOps agents installed) that is located within the scope of the assignment, the `sourceControlConfiguration` will be applied.  For existing clusters, you will need to manually run a remediation task.  It typically takes from 10-20 minutes for the policy assignment to take effect.

## Verify a policy assignment

1. In the Azure portal, navigate to one of your `connectedCluster` resources, and in the **Settings** section of the sidebar, select **Policies**. (The UX for AKS managed cluster is not implemented yet, but is coming.)
2. In the list, you should see the policy assignment that you created above, and the **Compliance state** should be *Compliant*.
3. In the **Settings** section of the sidebar, select **Configurations**.
4. In the list, you should see the `sourceControlConfiguration` that the policy assignment created.
5. Use **kubectl** to interrogate the cluster: you should see the namespace and artifacts that were created by the `sourceControlConfiguration`.
6. Within 5 minutes, you should see in the cluster the artifacts that are described in the manifests in the configured Git repo.

## Next steps

* [Set up Azure Monitor for Containers with Arc enabled Kubernetes clusters](./deploy-azure-monitor-for-containers.md)
