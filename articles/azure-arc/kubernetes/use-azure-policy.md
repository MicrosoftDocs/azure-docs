# Using Azure Policy for cluster configuration at scale

## Overview

Azure Policy can be used to assure that each `Microsoft.Kubernetes/connectedClusters` or `Microsoft.ContainerService/managedClusters` resource has specific `Microsoft.KubernetesConfiguration/sourceControlConfigurations` applied.  To use Policy you select an existing policy definition and create a policy assignment.  When creating the policy assignment you set the scope for the assignment - this will be an Azure resource group, subscription, or management group.  You also set the parameters for the `sourceControlConfiguration` that will be created for each `connectedCluster` or `managedCluster` that falls within the scope.  Once the assignment is created the Policy engine will identify all `connectedCluster` or `managedCluster` resources that are located within the scope and will apply the `sourceControlConfiguration` to each one.

## Create a policy definition

1. In the Azure portal, navigate to Policy, and in the menu select **Authoring > Definitions**.
2. Select **+ Policy definition**.
3. Set the **Definition location** to your subscription or management group.  This will determine the broadest scope where the policy definition can be used.
4. Give the policy a **Name** and **Description**.
5. Category, **Use existing**, *Kubernetes Cluster - Azure Arc*
6. In the **Policy rule** edit box, copy/paste the contents of [example policy definition](../examples/Assure-GitOps-endpoint-for-Kubernetes-cluster.json).
7. **Save**.

## Create a policy assignment

1. In the Azure portal, navigate to Policy, and in the menu select **Authoring > Definitions**.
2. Find the definition you just created, and select it.
3. In the page actions, select **Assign**.
4. Set the **Scope** to the management group, subscription, or resource group where the policy assignment will apply.
5. If you want to exclude any resources from the policy scope, then set **Exclusions**.
6. Give the policy assignment a **Name** and **Description** that you can use to identify it easily.
7. Set **Policy enforcement** to the default, *Enabled*.
8. **Next**.
9. Set parameter values that will be used during creation of the `sourceControlConfiguration`.
10. **Next**.
11. Enable **Create a remediation task**.
12. Assure that **Create a managed identity** is checked, and that the identity will have **Contributor** permissions.  See [this doc](https://docs.microsoft.com/en-us/azure/governance/policy/assign-policy-portal) and [the comment in this doc](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources) for more information on the permissions you need.
13. **Review + create**

After the policy assignment is created, for any `connectedCluster` or `managedCluster` resource that is located within the scope of the assignment the `sourceControlConfiguration` will be applied.  It typically takes from 10-20 minutes for the policy assignment to take effect.

## Verify a policy assignment

1. In the Azure portal, navigate to one of your `connectedCluster` resources, and in the menu select **Settings > Policies**. (The UX for AKS managed cluster is not implemented yet, but is coming.)
2. In the list, you should see the policy assignment that you created above, and the **Compliance state** should be *Compliant*.
3. In the menu, select **Settings > Configurations**.
4. In the list you should see the `sourceControlConfiguration` that the policy assignment created.
5. Use **kubectl** to interogate the cluster: you should see the namespace and artifacts that were created by the `sourceControlConfiguration`.
6. Within 5 minutes or so you should see in the cluster the artifacts that are described in the manifests in the configured Git repo.
