---
title: "Use Azure Policy to apply cluster configurations at scale"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 03/03/2021
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Use Azure Policy to apply cluster configurations at scale"
keywords: "Kubernetes, Arc, Azure, K8s, containers"
---

# Use Azure Policy to apply cluster configurations at scale

You can use Azure Policy to apply configurations (`Microsoft.KubernetesConfiguration/sourceControlConfigurations` resource type) at scale on Azure Arc enabled Kubernetes clusters (`Microsoft.Kubernetes/connectedclusters`).

To use Azure Policy, select an existing policy definition and create a policy assignment. When creating the policy assignment:
1. Set the scope for the assignment.
    * The scope will be an Azure resource group or subscription. 
2. Set the parameters for the configuration that will be created. 

Once the assignment is created, Azure Policy engine identifies all Azure Arc enabled Kubernetes clusters located within the scope and applies the configuration to each cluster.

You can create multiple configurations, each pointing to a different Git repo, using multiple policy assignments. For example, one repo for the central IT/cluster operator and other repositories for application teams.

## Prerequisite

Verify you have `Microsoft.Authorization/policyAssignments/write` permissions on the scope (subscription or resource group) where you'll create this policy assignment.

## Create a policy assignment

1. In the Azure portal, navigate to **Policy**.
1. In the **Authoring** section of the sidebar, select **Definitions**.
1. In the "Kubernetes" category, choose the "Deploy GitOps to Kubernetes cluster" built-in policy. 
1. Click on **Assign**.
1. Set the **Scope** to the management group, subscription, or resource group to which the policy assignment will apply.
    * If you want to exclude any resources from the policy scope, set **Exclusions**.
1. Give the policy assignment an easily identifiable **Name** and **Description**.
1. Ensure **Policy enforcement** is set to **Enabled**.
1. Select **Next**.
1. Set the parameter values to be used while creating the `sourceControlConfiguration`.
1. Select **Next**.
1. Enable **Create a remediation task**.
1. Verify **Create a managed identity** is checked, and that the identity will have **Contributor** permissions. 
    * For more information, see the [Create a policy assignment quickstart](../../governance/policy/assign-policy-portal.md) and the [Remediate non-compliant resources with Azure Policy article](../../governance/policy/how-to/remediate-resources.md).
1. Select **Review + create**.

After creating the policy assignment, the configuration is applied to new Azure Arc enabled Kubernetes clusters created within the scope of policy assignment.

For existing clusters, you'll need to manually run a remediation task. This task typically takes 10 to 20 minutes for the policy assignment to take effect.

## Verify a policy assignment

1. In the Azure portal, navigate to one of your Azure Arc enabled Kubernetes clusters.
1. In the **Settings** section of the sidebar, select **Policies**. 
    * In the policies list, you should see the policy assignment that you created earlier with the **Compliance state** set as *Compliant*.
1. In the **Settings** section of the sidebar, select **Configurations**.
    * In the configurations list, you should see the configuration created by the policy assignment.
1. Use `kubectl` to interrogate the cluster. 
    * You should see the namespace and artifacts that were created by the configurations resources.
    * Within 5 minutes (assuming cluster has network connectivity to Azure), you should see the objects described by the manifests in Git repo, getting created on the cluster.

## Next steps

[Set up Azure Monitor for Containers with Azure Arc enabled Kubernetes clusters](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md).
