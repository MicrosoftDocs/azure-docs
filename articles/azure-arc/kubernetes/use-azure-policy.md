---
title: "Use Azure Policy to apply cluster configurations at scale (Preview)"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 02/10/2021
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Use Azure Policy to apply cluster configurations at scale"
keywords: "Kubernetes, Arc, Azure, K8s, containers"
---

# Use Azure Policy to apply cluster configurations at scale (Preview)

## Overview

You can use Azure Policy to enforce either of the following resources to have specific `Microsoft.KubernetesConfiguration/sourceControlConfigurations` applied:
*  `Microsoft.Kubernetes/connectedclusters` resource.
* GitOps-enabled `Microsoft.ContainerService/managedClusters` resource. 

To use Azure Policy, select an existing policy definition and create a policy assignment. When creating the policy assignment:
1. Set the scope for the assignment.  
    1. The scope will be an Azure resource group or subscription. 
2. Set the parameters for the `sourceControlConfiguration` that will be created. 

Once the assignment is created, the Azure Policy engine identifies all `connectedCluster` or `managedCluster` resources located within the scope and applies the `sourceControlConfiguration` to each one.

You can enable multiple Git repos as the sources of truth for each cluster by using multiple policy assignments. Each policy assignment would be configured to use a different Git repo; for example, one repo for the central IT/cluster operator and other repos for application teams.

## Prerequisite

Verify you have `Microsoft.Authorization/policyAssignments/write` permissions on the scope (subscription or resource group) where you will create this policy assignment.

## Create a policy assignment

1. In the Azure Portal, navigate to **Policy**.
1. In the **Authoring** section of the sidebar, select **Definitions**.
1. In the "Kubernetes" category, choose the "Deploy GitOps to Kubernetes cluster" built-in policy. 
1. Click on **Assign**.
1. Set the **Scope** to the management group, subscription, or resource group to which the policy assignment will apply.
    1. If you want to exclude any resources from the policy scope, set **Exclusions**.
1. Give the policy assignment an easily identifiable **Name** and **Description**.
1. Ensure **Policy enforcement** is set to *Enabled*.
1. Select **Next**.
1. Set the parameter values to be used while creating the `sourceControlConfiguration`.
1. Select **Next**.
1. Enable **Create a remediation task**.
1. Verify **Create a managed identity** is checked, and that the identity will have **Contributor** permissions. 
    1. For more information, see the [Create a policy assignment quickstart](../../governance/policy/assign-policy-portal.md) and the [Remediate non-compliant resources with Azure Policy article](../../governance/policy/how-to/remediate-resources.md).
1. Select **Review + create**.

After creating the policy assignment, the `sourceControlConfiguration` will be applied for any of the following resources located within the scope of the assignment:
* New `connectedCluster` resources.
* New `managedCluster` resources with the GitOps agents installed. 

For existing clusters, you will need to manually run a remediation task. This task typically takes 10 to 20 minutes for the policy assignment to take effect.

## Verify a policy assignment

1. In the Azure Portal, navigate to one of your `connectedCluster` resources.
1. In the **Settings** section of the sidebar, select **Policies**. 
    1. The AKS cluster UX is not implemented yet.
1. In the policies list, you should see the policy assignment that you created earlier with the **Compliance state** set as *Compliant*.
1. In the **Settings** section of the sidebar, select **Configurations**.
1. In the configurations list, you should see the `sourceControlConfiguration` that the policy assignment created.
1. Use `kubectl` to interrogate the cluster. 
    1. You should see the namespace and artifacts that were created by the `sourceControlConfiguration`.
    1. Within 5 minutes, you should see in the cluster the artifacts that are described in the manifests in the configured Git repo.

## Next steps

* [Set up Azure Monitor for Containers with Arc-enabled Kubernetes clusters](../../azure-monitor/insights/container-insights-enable-arc-enabled-clusters.md)
