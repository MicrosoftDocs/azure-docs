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

# Use Azure Policy to apply GitOps configurations at scale

You can use Azure Policy to apply configurations (`Microsoft.KubernetesConfiguration/sourceControlConfigurations` resource type) at scale on Azure Arc-enabled Kubernetes clusters (`Microsoft.Kubernetes/connectedclusters`).

To use Azure Policy, select a built-in GitOps policy definition and create a policy assignment. When creating the policy assignment:
1. Set the scope for the assignment.
    * The scope will be all resource groups in a subscription or management group or specific resource groups.
2. Set the parameters for the GitOps configuration that will be created. 

Once the assignment is created, the Azure Policy engine identifies all Azure Arc-enabled Kubernetes clusters located within the scope and applies the GitOps configuration to each cluster.

To enable separation of concerns, you can create multiple policy assignments, each with a different GitOps configuration pointing to a different Git repo. For example, one repo may be used by cluster admins and other repositories may be used by application teams.

>[!TIP]
> There are built-in policies for these scenarios:
> * Public repo or private repo with SSH keys created by Flux: `Configure Kubernetes clusters with specified GitOps configuration using no secrets`
> * Private repo with user-provided SSH keys: `Configure Kubernetes clusters with specified GitOps configuration using SSH secrets`
> * Private repo with user-provided HTTPS keys: `Configure Kubernetes clusters with specified GitOps configuration using HTTPS secrets`

## Prerequisite

Verify you have `Microsoft.Authorization/policyAssignments/write` permissions on the scope (subscription or resource group) where you'll create this policy assignment.

## Create a policy assignment

1. In the Azure portal, navigate to **Policy**.
1. In the **Authoring** section of the sidebar, select **Definitions**.
1. In the "Kubernetes" category, choose the "Configure Kubernetes clusters with specified GitOps configuration using no secrets" built-in policy. 
1. Click on **Assign**.
1. Set the **Scope** to the management group, subscription, or resource group to which the policy assignment will apply.
    * If you want to exclude any resources from the policy scope, set **Exclusions**.
1. Give the policy assignment an easily identifiable **Name** and **Description**.
1. Ensure **Policy enforcement** is set to **Enabled**.
1. Select **Next**.
1. Set the parameter values to be used while creating the `sourceControlConfiguration`.
    * For more information about parameters, see the [tutorial on deploying GitOps configurations](./tutorial-use-gitops-connected-cluster.md).
1. Select **Next**.
1. Enable **Create a remediation task**.
1. Verify **Create a managed identity** is checked, and that the identity will have **Contributor** permissions. 
    * For more information, see the [Create a policy assignment quickstart](../../governance/policy/assign-policy-portal.md) and the [Remediate non-compliant resources with Azure Policy article](../../governance/policy/how-to/remediate-resources.md).
1. Select **Review + create**.

After creating the policy assignment, the configuration is applied to new Azure Arc-enabled Kubernetes clusters created within the scope of policy assignment.

For existing clusters, you may need to manually run a remediation task. This task typically takes 10 to 20 minutes for the policy assignment to take effect.

## Verify a policy assignment

1. In the Azure portal, navigate to one of your Azure Arc-enabled Kubernetes clusters.
1. In the **Settings** section of the sidebar, select **Policies**. 
    * In the policies list, you should see the policy assignment that you created earlier with the **Compliance state** set as *Compliant*.
1. In the **Settings** section of the sidebar, select **GitOps**.
    * In the configurations list, you should see the configuration created by the policy assignment.
1. Use `kubectl` to interrogate the cluster. 
    * You should see the namespace and artifacts that were created by the GitOps configuration.
    * You should see the objects described by the manifests in the Git repo getting deployed on the cluster.

## Next steps

[Set up Azure Monitor for Containers with Azure Arc-enabled Kubernetes clusters](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md).
