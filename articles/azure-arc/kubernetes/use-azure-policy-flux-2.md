---
title: "Deploy applications consistently at scale using Flux v2 configurations and Azure Policy"
ms.date: 06/02/2023
ms.topic: how-to
description: "Use Azure Policy to apply Flux v2 configurations at scale on Azure Arc-enabled Kubernetes or AKS clusters."
---

# Deploy applications consistently at scale using Flux v2 configurations and Azure Policy

You can use Azure Policy to apply Flux v2 configurations (`Microsoft.KubernetesConfiguration/fluxConfigurations` resource type) at scale on Azure Arc-enabled Kubernetes (`Microsoft.Kubernetes/connectedClusters`) or AKS (`Microsoft.ContainerService/managedClusters`) clusters.

To use Azure Policy, select a built-in policy definition and create a policy assignment. You can search for **flux** to find all of the Flux v2 policy definitions. When creating the policy assignment:

1. Set the scope for the assignment to all resource groups in a subscription or management group, or to specific resource groups.
2. Set the parameters for the Flux v2 configuration that will be created.

Once the assignment is created, the Azure Policy engine identifies all Azure Arc-enabled Kubernetes clusters located within the scope and applies the GitOps configuration to each cluster.

To enable separation of concerns, you can create multiple policy assignments, each with a different Flux v2 configuration pointing to a different source. For example, one git repository may be used by cluster admins and other repositories may be used by application teams.

> [!TIP]
> There are [built-in policy definitions](policy-reference.md) for these scenarios:
>
> * Flux extension install (required for all scenarios): `Configure installation of Flux extension on Kubernetes cluster`
> * Flux configuration using public Git repository (generally a test scenario): `Configure Kubernetes clusters with Flux v2 configuration using public Git repository`
> * Flux configuration using private Git repository with SSH auth: `Configure Kubernetes clusters with Flux v2 configuration using Git repository and SSH secrets`
> * Flux configuration using private Git repository with HTTPS auth: `Configure Kubernetes clusters with Flux v2 configuration using Git repository and HTTPS secrets`
> * Flux configuration using private Git repository with HTTPS CA cert auth: `Configure Kubernetes clusters with Flux v2 configuration using Git repository and HTTPS CA Certificate`
> * Flux configuration using private Git repository with local K8s secret: `Configure Kubernetes clusters with Flux v2 configuration using Git repository and local secrets`
> * Flux configuration using private Bucket source and KeyVault secrets: `Configure Kubernetes clusters with Flux v2 configuration using Bucket source and secrets in KeyVault`
> * Flux configuration using private Bucket source and local K8s secret: `Configure Kubernetes clusters with specified Flux v2 Bucket source using local secrets`

## Prerequisites

Verify you have `Microsoft.Authorization/policyAssignments/write` permissions on the scope (subscription or resource group) where you'll create this policy assignment.

## Create a policy assignment

In order for a policy to apply Flux v2 configurations to a cluster, the Flux extension must be installed on each cluster. You can ensure this by assigning the **Configure installation of Flux extension on Kubernetes cluster** policy definition to the desired scope.

1. In the Azure portal, navigate to **Policy**.
1. In the **Authoring** section of the sidebar, select **Definitions**.
1. In the "Kubernetes" category, select the **Configure installation of Flux extension on Kubernetes cluster** built-in policy definition.
1. Select **Assign**.
1. Set the **Scope** to the management group, subscription, or resource group to which the policy assignment will apply.
    * If you want to exclude any resources from the policy assignment scope, set **Exclusions**.
1. Give the policy assignment an easily identifiable **Assignment name** and **Description**.
1. Ensure **Policy enforcement** is set to **Enabled**.
1. Select **Review + create**, then select **Create**.

Next, return to the **Definitions** list to apply the configuration policy definition to the same scope.

1. In the "Kubernetes" category, select the **Configure Kubernetes clusters with Flux v2 configuration using public Git repository**
built-in policy definition.
1. Select **Assign**.
1. Set the **Scope** to the same scope that you selected when assigning the first policy, including any exceptions.
1. Give the policy assignment an easily identifiable **Assignment name** and **Description**.
1. Ensure **Policy enforcement** is set to **Enabled**.
1. Select **Next**, then select **Next** again to open the **Parameters** tab.
1. Set the parameter values to be used.
    * For more information about parameters, see the [tutorial on deploying Flux v2 configurations](./tutorial-use-gitops-flux2.md).
    * When creating Flux configurations you must provide a value for one (and only one) of these parameters: `repositoryRefBranch`, `repositoryRefTag`, `repositoryRefSemver`, `repositoryRefCommit`.
1. Select **Next** to open the **Remediation** task.
1. Enable **Create a remediation task**.
1. Verify that **Create a Managed Identity** is checked, and that the identity will have **Contributor** permissions.
    * For more information, see [Quickstart: Create a policy assignment to identify non-compliant resources](../../governance/policy/assign-policy-portal.md) and [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md).
1. Select **Review + create**, then select **Create**.

After creating the policy assignments, the configuration is applied to new Azure Arc-enabled Kubernetes or AKS clusters created within the scope of policy assignment.

For existing clusters, you may need to manually run a remediation task. This task typically takes 10 to 20 minutes for the policy assignment to take effect.

## Verify a policy assignment

1. In the Azure portal, navigate to one of your Azure Arc-enabled Kubernetes or AKS clusters.
1. In the **Settings** section of the sidebar, select **GitOps**.
    * In the configurations list, you should see the configuration created by the policy assignment.
1. In the **Kubernetes resources** section of the sidebar, select **Namespaces** and **Workloads**.
    * You should see the namespace and artifacts that were created by the Flux configuration.
    * You should see the objects described by the manifests in the Git repo deployed on the cluster.

## Customizing a policy

The built-in policies cover the main scenarios for using GitOps with Flux v2 in your Kubernetes clusters. However, due to limitations on the number of parameters allowed in Azure Policy assignments (max of 20), not all parameters are present in the built-in policies. Also, to fit within the 20-parameter limit, only a single Kustomization can be created with the built-in policies.  

If you have a scenario that differs from the built-in policies, you can overcome the limitations by creating [custom policies](../../governance/policy/tutorials/create-custom-policy-definition.md) using the built-in policies as templates. You can create custom policies that contain only the parameters you need, and hard-code the rest, therefore working around the 20-parameter limit.

## Next steps

* [Set up Azure Monitor for Containers with Azure Arc-enabled Kubernetes clusters](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md).
* Learn more about [deploying applications using GitOps with Flux v2](tutorial-use-gitops-flux2.md).
