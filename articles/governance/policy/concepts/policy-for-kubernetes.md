---
title: Learn Azure Policy for Kubernetes
description: Learn how Azure Policy uses Rego and Open Policy Agent to manage clusters running Kubernetes in Azure or on-premises.
ms.date: 09/30/2024
ms.topic: conceptual
ms.custom: devx-track-azurecli
---

# Understand Azure Policy for Kubernetes clusters

Azure Policy extends [Gatekeeper](https://open-policy-agent.github.io/gatekeeper) v3, an _admission
controller webhook_ for [Open Policy Agent](https://www.openpolicyagent.org/) (OPA), to apply at-scale enforcements and safeguards on your cluster components in a centralized, consistent manner. Cluster components include pods, containers, and namespaces.

Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes cluster components from one place. By using Azure Policy's Add-on or Extension, governing your cluster components is enhanced with Azure Policy features, like the ability to use [selectors](./assignment-structure.md#resource-selectors) and [overrides](./assignment-structure.md#overrides) for safe policy rollout and rollback.

Azure Policy for Kubernetes supports the following cluster environments:

- [Azure Kubernetes Service (AKS)](/azure/aks/what-is-aks), through **Azure Policy's **Add-on** for AKS**
- [Azure Arc enabled Kubernetes](/azure/azure-arc/kubernetes/overview), through **Azure Policy's **Extension** for Arc**

> [!IMPORTANT]
> The Azure Policy Add-on Helm model and the add-on for AKS Engine have been _deprecated_. Follow the instructions to [remove the add-ons](#remove-the-add-on).

## Overview

By installing Azure Policy's add-on or extension on your Kubernetes clusters, Azure Policy enacts the following functions:

-  Checks with Azure Policy service for policy assignments to the cluster.
-  Deploys policy definitions into the cluster as [constraint template](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraint-templates) and [constraint](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraints) custom resources or as a mutation template resource (depending on policy definition content).
-  Reports auditing and compliance details back to Azure Policy service.

To enable and use Azure Policy with your Kubernetes cluster, take the following actions:

1. Configure your Kubernetes cluster and install the [Azure Kubernetes Service (AKS)](#install-azure-policy-add-on-for-aks) add-on or Azure Policy's Extension for [Arc-enabled Kubernetes clusters](#install-azure-policy-extension-for-azure-arc-enabled-kubernetes) (depending on your cluster type).

   > [!NOTE]
   > For common issues with installation, see
   > [Troubleshoot - Azure Policy Add-on](../troubleshoot/general.md#add-on-for-kubernetes-installation-errors).

1. [Create or use a sample Azure Policy definition for Kubernetes](#create-a-policy-definition)

1. [Assign a definition to your Kubernetes cluster](#assign-a-policy-definition)

1. [Wait for validation](#policy-evaluation)
1. [Logging](#logging) and [troubleshooting](#troubleshooting-the-add-on)
1. Review [limitations](#limitations) and [recommendations in our FAQ section](#frequently-asked-questions)

## Install Azure Policy Add-on for AKS

The Azure Policy Add-on for AKS is part of Kubernetes version 1.27 with long term support (LTS).

### Prerequisites

1. Register the resource providers and preview features.

   - Azure portal:

     Register the `Microsoft.PolicyInsights` resource providers. For steps, see
     [Resource providers and types](../../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

   - Azure CLI:

     ```azurecli-interactive
     # Log in first with az login if you're not using Cloud Shell

     # Provider register: Register the Azure Policy provider
     az provider register --namespace Microsoft.PolicyInsights
     ```
1. You need the Azure CLI version 2.12.0 or later installed and configured. To find the version, run the `az --version` command. If you need to install or upgrade, see
   [How to install the Azure CLI](/cli/azure/install-azure-cli).

1. The AKS cluster must be a [supported Kubernetes version in Azure Kubernetes Service (AKS)](/azure/aks/supported-kubernetes-versions). Use the following script to validate your AKS
   cluster version:

   ```azurecli-interactive
   # Log in first with az login if you're not using Cloud Shell

   # Look for the value in kubernetesVersion
   az aks list
   ```

1. Open ports for the Azure Policy extension. The Azure Policy extension uses these domains and ports to fetch policy
   definitions and assignments and report compliance of the cluster back to Azure Policy.

   |Domain |Port |
   |---|---|
   |`data.policy.core.windows.net` |`443` |
   |`store.policy.core.windows.net` |`443` |
   |`login.windows.net` |`443` |
   |`dc.services.visualstudio.com` |`443` |

After the prerequisites are completed, install the Azure Policy Add-on in the AKS cluster
you want to manage.

- Azure portal

  1. Launch the AKS service in the Azure portal by selecting **All services**, then searching for
     and selecting **Kubernetes services**.

  1. Select one of your AKS clusters.

  1. Select **Policies** on the left side of the Kubernetes service page.

  1. In the main page, select the **Enable add-on** button.

- Azure CLI

  ```azurecli-interactive
  # Log in first with az login if you're not using Cloud Shell

  az aks enable-addons --addons azure-policy --name MyAKSCluster --resource-group MyResourceGroup
  ```

To validate that the add-on installation was successful and that the _azure-policy_ and _gatekeeper_
pods are running, run the following command:

```bash
# azure-policy pod is installed in kube-system namespace
kubectl get pods -n kube-system

# gatekeeper pod is installed in gatekeeper-system namespace
kubectl get pods -n gatekeeper-system
```

Lastly, verify that the latest add-on is installed by running this Azure CLI command, replacing
`<rg>` with your resource group name and `<cluster-name>` with the name of your AKS cluster:
`az aks show --query addonProfiles.azurepolicy -g <rg> -n <cluster-name>`. The result should look
similar to the following output for clusters using service principals:

```output
{
  "config": null,
  "enabled": true,
  "identity": null
}
```
And the following output for clusters using managed identity:
```output
 {
   "config": null,
   "enabled": true,
   "identity": {
     "clientId": "########-####-####-####-############",
     "objectId": "########-####-####-####-############",
     "resourceId": "<resource-id>"
   }
 }
```

## Install Azure Policy Extension for Azure Arc enabled Kubernetes

[Azure Policy for Kubernetes](./policy-for-kubernetes.md) makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. With Azure Policy's Extension for Arc-enabled Kubernetes clusters, you can govern your Arc-enabled Kubernetes cluster components, like pods and containers.

This article describes how to [create](#create-azure-policy-extension), [show extension status](#show-azure-policy-extension), and [delete](#delete-azure-policy-extension) the Azure Policy for Kubernetes extension.

For an overview of the extensions platform, see [Azure Arc cluster extensions](/azure/azure-arc/kubernetes/conceptual-extensions).

### Prerequisites

If you already deployed Azure Policy for Kubernetes on an Azure Arc cluster using Helm directly without extensions, follow the instructions to [delete the Helm chart](#remove-the-add-on-from-azure-arc-enabled-kubernetes). After the deletion is done, you can then proceed.

1. Ensure your Kubernetes cluster is a supported distribution.

   > [!NOTE]
   > Azure Policy for Arc extension is supported on [the following Kubernetes distributions](/azure/azure-arc/kubernetes/validation-program).

1. Ensure you met all the common prerequisites for Kubernetes extensions listed [here](/azure/azure-arc/kubernetes/extensions) including [connecting your cluster to Azure Arc](/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli).

   > [!NOTE]
   > Azure Policy extension is supported for Arc enabled Kubernetes clusters [in these regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc).

1. Open ports for the Azure Policy extension. The Azure Policy extension uses these domains and ports to fetch policy
   definitions and assignments and report compliance of the cluster back to Azure Policy.

   |Domain |Port |
   |---|---|
   |`data.policy.core.windows.net` |`443` |
   |`store.policy.core.windows.net` |`443` |
   |`login.windows.net` |`443` |
   |`dc.services.visualstudio.com` |`443` |

1. Before you install the Azure Policy extension or enabling any of the service features, your subscription must enable the `Microsoft.PolicyInsights` resource providers.

   > [!NOTE]
   > To enable the resource provider, follow the steps in [Resource providers and types](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal)
   or run either the Azure CLI or Azure PowerShell command.

   - Azure CLI

     ```azurecli-interactive
     # Log in first with az login if you're not using Cloud Shell
     # Provider register: Register the Azure Policy provider
     az provider register --namespace 'Microsoft.PolicyInsights'
     ```

   - Azure PowerShell

     ```azurepowershell-interactive
     # Log in first with Connect-AzAccount if you're not using Cloud Shell

     # Provider register: Register the Azure Policy provider
     Register-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights'
     ```

### Create Azure Policy extension

> [!NOTE]
> Note the following for Azure Policy extension creation:
> - Auto-upgrade is enabled by default which will update Azure Policy extension minor version if any new changes are deployed.
> - Any proxy variables passed as parameters to `connectedk8s` will be propagated to the Azure Policy extension to support outbound proxy.

To create an extension instance, for your Arc enabled cluster, run the following command substituting `<>` with your values:

```azurecli-interactive
az k8s-extension create --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --extension-type Microsoft.PolicyInsights --name <EXTENSION_INSTANCE_NAME>
```

#### Example:

```azurecli-interactive
az k8s-extension create --cluster-type connectedClusters --cluster-name my-test-cluster --resource-group my-test-rg --extension-type Microsoft.PolicyInsights --name azurepolicy
```

#### Example Output:

```json
{
  "aksAssignedIdentity": null,
  "autoUpgradeMinorVersion": true,
  "configurationProtectedSettings": {},
  "configurationSettings": {},
  "customLocationSettings": null,
  "errorInfo": null,
  "extensionType": "microsoft.policyinsights",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-test-rg/providers/Microsoft.Kubernetes/connectedClusters/my-test-cluster/providers/Microsoft.KubernetesConfiguration/extensions/azurepolicy",
 "identity": {
    "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "tenantId": null,
    "type": "SystemAssigned"
  },
  "location": null,
  "name": "azurepolicy",
  "packageUri": null,
  "provisioningState": "Succeeded",
  "releaseTrain": "Stable",
  "resourceGroup": "my-test-rg",
  "scope": {
    "cluster": {
      "releaseNamespace": "kube-system"
    },
    "namespace": null
  },
  "statuses": [],
  "systemData": {
    "createdAt": "2021-10-27T01:20:06.834236+00:00",
    "createdBy": null,
    "createdByType": null,
    "lastModifiedAt": "2021-10-27T01:20:06.834236+00:00",
    "lastModifiedBy": null,
    "lastModifiedByType": null
  },
  "type": "Microsoft.KubernetesConfiguration/extensions",
  "version": "1.1.0"
}
```

### Show Azure Policy extension

To check the extension instance creation was successful, and inspect extension metadata, run the following command substituting `<>` with your values:

```azurecli
az k8s-extension show --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --name <EXTENSION_INSTANCE_NAME>
```

#### Example:

```azurecli
az k8s-extension show --cluster-type connectedClusters --cluster-name my-test-cluster --resource-group my-test-rg --name azurepolicy
```

To validate that the extension installation was successful and that the azure-policy and gatekeeper pods are running, run the following command:

```bash
# azure-policy pod is installed in kube-system namespace
kubectl get pods -n kube-system

# gatekeeper pod is installed in gatekeeper-system namespace
kubectl get pods -n gatekeeper-system
```

### Delete Azure Policy extension

To delete the extension instance, run the following command substituting `<>` with your values:

```azurecli-interactive
az k8s-extension delete --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP> --name <EXTENSION_INSTANCE_NAME>
```

## Create a policy definition

The Azure Policy language structure for managing Kubernetes follows that of existing policy
definitions. There are sample definition files available to assign in [Azure Policy's built-in policy library](../samples/built-in-policies.md#kubernetes) that can be used to govern your cluster components.

Azure Policy for Kubernetes also support custom definition creation at the component-level for both Azure Kubernetes Service clusters and Azure Arc-enabled Kubernetes clusters. Constraint template and mutation template samples are available in the [Gatekeeper community library](https://github.com/open-policy-agent/gatekeeper-library/tree/master). [Azure Policy's Visual Studio Code Extension](../how-to/extension-for-vscode.md#create-policy-definition-from-a-constraint-template-or-mutation-template) can be used to help translate an existing constraint template or mutation template to a custom Azure Policy policy definition.

With a [Resource Provider mode](./definition-structure.md#resource-provider-modes) of
`Microsoft.Kubernetes.Data`, the effects [audit](./effect-audit.md), [deny](./effect-deny.md), [disabled](./effect-disabled.md), and [mutate](./effect-mutate.md) are used to manage your Kubernetes clusters.

_Audit_ and _deny_ must provide `details` properties
specific to working with
[OPA Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint)
and Gatekeeper v3.

As part of the _details.templateInfo_ or _details.constraintInfo_ properties in the policy definition, Azure Policy passes the URI or `Base64Encoded` value of these [CustomResourceDefinitions](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraint-templates)(CRD) to the add-on. Rego is the language that OPA and Gatekeeper support to validate a request to
the Kubernetes cluster. By supporting an existing standard for Kubernetes management, Azure Policy
makes it possible to reuse existing rules and pair them with Azure Policy for a unified cloud
compliance reporting experience. For more information, see
[What is Rego?](https://www.openpolicyagent.org/docs/latest/policy-language/#what-is-rego).

## Assign a policy definition

To assign a policy definition to your Kubernetes cluster, you must be assigned the appropriate Azure
role-based access control (Azure RBAC) policy assignment operations. The Azure built-in roles
**Resource Policy Contributor** and **Owner** have these operations. To learn more, see
[Azure RBAC permissions in Azure Policy](../overview.md#azure-rbac-permissions-in-azure-policy).

Find the built-in policy definitions for managing your cluster using the Azure portal with the
following steps. If using a custom policy definition, search for it by name or the category that
you created it with.

1. Start the Azure Policy service in the Azure portal. Select **All services** in the left pane and
   then search for and select **Policy**.

1. In the left pane of the Azure Policy page, select **Definitions**.

1. From the Category dropdown list box, use **Select all** to clear the filter and then select
   **Kubernetes**.

1. Select the policy definition, then select the **Assign** button.

1. Set the **Scope** to the management group, subscription, or resource group of the Kubernetes
   cluster where the policy assignment applies.

   > [!NOTE]
   > When assigning the Azure Policy for Kubernetes definition, the **Scope** must include the
   > cluster resource.

1. Give the policy assignment a **Name** and **Description** that you can use to identify it easily.

1. Set the [Policy enforcement](./assignment-structure.md#enforcement-mode) to one of the following values:

   - **Enabled** - Enforce the policy on the cluster. Kubernetes admission requests with violations
     are denied.

   - **Disabled** - Don't enforce the policy on the cluster. Kubernetes admission requests with
     violations aren't denied. Compliance assessment results are still available. When you roll out
     new policy definitions to running clusters, _Disabled_ option is helpful for testing the policy
     definition as admission requests with violations aren't denied.

1. Select **Next**.

1. Set **parameter values**

   - To exclude Kubernetes namespaces from policy evaluation, specify the list of namespaces in
     parameter **Namespace exclusions**. The recommendation is to exclude: _kube-system_,
     _gatekeeper-system_, and _azure-arc_.

1. Select **Review + create**.

Alternately, use the [Assign a policy - Portal](../assign-policy-portal.md) quickstart to find and
assign a Kubernetes policy. Search for a Kubernetes policy definition instead of the sample _audit
vms_.

> [!IMPORTANT]
> Built-in policy definitions are available for Kubernetes clusters in category **Kubernetes**. For
> a list of built-in policy definitions, see
> [Kubernetes samples](../samples/built-in-policies.md#kubernetes).

## Policy evaluation

The add-on checks in with Azure Policy service for changes in policy assignments every 15 minutes.
During this refresh cycle, the add-on checks for changes. These changes trigger creates, updates, or
deletes of the constraint templates and constraints.

In a Kubernetes cluster, if a namespace has the cluster-appropriate label, the admission requests
with violations aren't denied. Compliance assessment results are still available.

- Azure Arc-enabled Kubernetes cluster: `admission.policy.azure.com/ignore`

> [!NOTE]
> While a cluster admin might have permission to create and update constraint templates and
> constraints resources install by the Azure Policy Add-on, these aren't supported scenarios as
> manual updates are overwritten. Gatekeeper continues to evaluate policies that existed prior to
> installing the add-on and assigning Azure Policy policy definitions.

Every 15 minutes, the add-on calls for a full scan of the cluster. After gathering details of the
full scan and any real-time evaluations by Gatekeeper of attempted changes to the cluster, the
add-on reports the results back to Azure Policy for inclusion in
[compliance details](../how-to/get-compliance-data.md) like any Azure Policy assignment. Only
results for active policy assignments are returned during the audit cycle. Audit results can also be
seen as [violations](https://github.com/open-policy-agent/gatekeeper#audit) listed in the status
field of the failed constraint. For details on _Non-compliant_ resources, see
[Component details for Resource Provider modes](../how-to/determine-non-compliance.md#component-details-for-resource-provider-modes).

> [!NOTE]
> Each compliance report in Azure Policy for your Kubernetes clusters include all violations within
> the last 45 minutes. The timestamp indicates when a violation occurred.

Some other considerations:

- If the cluster subscription is registered with Microsoft Defender for Cloud, then Microsoft Defender for Cloud Kubernetes policies are applied on the cluster automatically.

- When a deny policy is applied on cluster with existing Kubernetes resources, any preexisting
  resource that isn't compliant with the new policy continues to run. When the non-compliant
  resource gets rescheduled on a different node the Gatekeeper blocks the resource creation.

- When a cluster has a deny policy that validates resources, the user doesn't get a rejection
  message when creating a deployment. For example, consider a Kubernetes deployment that contains
  `replicasets` and pods. When a user executes `kubectl describe deployment $MY_DEPLOYMENT`, it doesn't return a rejection message as part of events. However,
  `kubectl describe replicasets.apps $MY_DEPLOYMENT` returns the events associated with rejection.

> [!NOTE]
> Init containers might be included during policy evaluation. To see if init containers are included, review the CRD for the following or a similar declaration:
>
> ```rego
> input_containers[c] {
>    c := input.review.object.spec.initContainers[_]
> }
> ```

### Constraint template conflicts

If constraint templates have the same resource metadata name, but the policy definition references
the source at different locations, the policy definitions are considered to be in conflict. Example:
Two policy definitions reference the same `template.yaml` file stored at different source locations
like the Azure Policy template store (`store.policy.core.windows.net`) and GitHub.

When policy definitions and their constraint templates are assigned but aren't already installed on
the cluster and are in conflict, they're reported as a conflict and aren't installed into the
cluster until the conflict is resolved. Likewise, any existing policy definitions and their
constraint templates that are already on the cluster that conflicts with newly assigned policy
definitions continue to function normally. If an existing assignment is updated and there's a
failure to sync the constraint template, the cluster is also marked as a conflict. For all conflict
messages, see
[AKS Resource Provider mode compliance reasons](../how-to/determine-non-compliance.md#aks-resource-provider-mode-compliance-reasons)

## Logging

As a Kubernetes controller/container, both the _azure-policy_ and _gatekeeper_ pods keep logs in the
Kubernetes cluster. In general, _azure-policy_ logs can be used to troubleshoot issues with policy ingestion onto the cluster and compliance reporting. The _gatekeeper-controller-manager_ pod logs can be used to troubleshoot runtime denies. The _gatekeeper-audit_ pod logs can be used to troubleshoot audits of existing resources. The logs can be exposed in the **Insights** page of the Kubernetes cluster. For
more information, see
[Monitor your Kubernetes cluster performance with Azure Monitor for containers](/azure/azure-monitor/containers/container-insights-analyze).

To view the add-on logs, use `kubectl`:

```bash
# Get the azure-policy pod name installed in kube-system namespace
kubectl logs <azure-policy pod name> -n kube-system

# Get the gatekeeper pod name installed in gatekeeper-system namespace
kubectl logs <gatekeeper pod name> -n gatekeeper-system
```

If you're attempting to troubleshoot a particular ComplianceReasonCode that is appearing in your compliance results, you can search the azure-policy pod logs for that code to see the full accompanying error.

For more information, see
[Debugging Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/debug/) in the
Gatekeeper documentation.

## View Gatekeeper artifacts

After the add-on downloads the policy assignments and installs the constraint templates and
constraints on the cluster, it annotates both with Azure Policy information like the policy
assignment ID and the policy definition ID. To configure your client to view the add-on related
artifacts, use the following steps:

1. Set up `kubeconfig` for the cluster.

   For an Azure Kubernetes Service cluster, use the following Azure CLI:

   ```azurecli-interactive
   # Set context to the subscription
   az account set --subscription <YOUR-SUBSCRIPTION>

   # Save credentials for kubeconfig into .kube in your home folder
   az aks get-credentials --resource-group <RESOURCE-GROUP> --name <CLUSTER-NAME>
   ```

1. Test the cluster connection.

   Run the `kubectl cluster-info` command. A successful run has each service responding with a URL
   of where it's running.

### View the add-on constraint templates

To view constraint templates downloaded by the add-on, run `kubectl get constrainttemplates`.
Constraint templates that start with `k8sazure` are the ones installed by the add-on.

### View the add-on mutation templates

To view mutation templates downloaded by the add-on, run `kubectl get assign`, `kubectl get assignmetadata`, and `kubectl get modifyset`.

### Get Azure Policy mappings

To identify the mapping between a constraint template downloaded to the cluster and the policy
definition, use `kubectl get constrainttemplates <TEMPLATE> -o yaml`. The results look similar to
the following output:

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
    annotations:
    azure-policy-definition-id: /subscriptions/<SUBID>/providers/Microsoft.Authorization/policyDefinitions/<GUID>
    constraint-template-installed-by: azure-policy-addon
    constraint-template: <URL-OF-YAML>
    creationTimestamp: "2021-09-01T13:20:55Z"
    generation: 1
    managedFields:
    - apiVersion: templates.gatekeeper.sh/v1beta1
    fieldsType: FieldsV1
...
```

`<SUBID>` is the subscription ID and `<GUID>` is the ID of the mapped policy definition.
`<URL-OF-YAML>` is the source location of the constraint template that the add-on downloaded to
install on the cluster.

### View constraints related to a constraint template

Once you have the names of the
[add-on downloaded constraint templates](#view-the-add-on-constraint-templates), you can use the
name to see the related constraints. Use `kubectl get <constraintTemplateName>` to get the list.
Constraints installed by the add-on start with `azurepolicy-`.

### View constraint details

The constraint has details about violations and mappings to the policy definition and assignment. To
see the details, use `kubectl get <CONSTRAINT-TEMPLATE> <CONSTRAINT> -o yaml`. The results look
similar to the following output:

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAzureContainerAllowedImages
metadata:
  annotations:
    azure-policy-assignment-id: /subscriptions/<SUB-ID>/resourceGroups/<RG-NAME>/providers/Microsoft.Authorization/policyAssignments/<ASSIGNMENT-GUID>
    azure-policy-definition-id: /providers/Microsoft.Authorization/policyDefinitions/<DEFINITION-GUID>
    azure-policy-definition-reference-id: ""
    azure-policy-setdefinition-id: ""
    constraint-installed-by: azure-policy-addon
    constraint-url: <URL-OF-YAML>
  creationTimestamp: "2021-09-01T13:20:55Z"
spec:
  enforcementAction: deny
  match:
    excludedNamespaces:
    - kube-system
    - gatekeeper-system
    - azure-arc
  parameters:
    imageRegex: ^.+azurecr.io/.+$
status:
  auditTimestamp: "2021-09-01T13:48:16Z"
  totalViolations: 32
  violations:
  - enforcementAction: deny
    kind: Pod
    message: Container image nginx for container hello-world has not been allowed.
    name: hello-world-78f7bfd5b8-lmc5b
    namespace: default
  - enforcementAction: deny
    kind: Pod
    message: Container image nginx for container hello-world has not been allowed.
    name: hellow-world-89f8bfd6b9-zkggg
```

## Troubleshooting the add-on

For more information about troubleshooting the Add-on for Kubernetes, see the
[Kubernetes section](../troubleshoot/general.md#add-on-for-kubernetes-general-errors)
of the Azure Policy troubleshooting article.

For Azure Policy extension for Arc extension related issues, go to:
- [Azure Arc enabled Kubernetes troubleshooting](/azure/azure-arc/kubernetes/troubleshooting)

For Azure Policy related issues, go to:
- [Inspect Azure Policy logs](#logging)
- [General troubleshooting for Azure Policy on Kubernetes](../troubleshoot/general.md#add-on-for-kubernetes-general-errors)

## Azure Policy Add-on for AKS Changelog

Azure Policy's Add-on for AKS has a version number that indicates the image version of add-on. As feature support is newly introduced on the Add-on, the version number is increased.

This section helps you identify which Add-on version is installed on your cluster and also share a historical table of the Azure Policy Add-on version installed per AKS cluster.

### Identify which Add-on version is installed on your cluster

The Azure Policy Add-on uses the standard [Semantic Versioning](https://semver.org/) schema for each version. To identify the Azure Policy Add-on version being used, you can run the following command:
`kubectl get pod azure-policy-<unique-pod-identifier> -n kube-system -o json | jq '.spec.containers[0].image'`

To identify the Gatekeeper version that your Azure Policy Add-on is using, you can run the following command:
`kubectl get pod gatekeeper-controller-<unique-pod-identifier> -n gatekeeper-system -o json | jq '.spec.containers[0].image' `

Finally, to identify the AKS cluster version that you're using, follow the linked AKS guidance.

### Add-on versions available per each AKS cluster version

#### 1.9.1
Security improvements.

Patch CVE-2024-45337 and CVE-2024-45338.
- Released January 2025
- Kubernetes 1.27+
- Gatekeeper 3.17.1
##### Gatekeeper 3.17.1-5
Patch CVE-2024-45337 and CVE-2024-45338.

#### 1.8.0
Policy can now be used to evaluate CONNECT operations, for instance, to deny `exec`s. Note that there is no brownfield compliance available for noncompliant CONNECT operations, so a policy with Audit effect that targets CONNECTs is a no op.

Security improvements.
- Released November 2024
- Kubernetes 1.27+
- Gatekeeper 3.17.1

#### 1.7.1
Introducing CEL and VAP. Common Expression Language (CEL) is a Kubernetes-native expression language that can be used to declare validation rules of a policy. Validating Admission Policy (VAP) feature provides in-tree policy evaluation, reduces admission request latency, and improves reliability and availability. The supported validation actions include Deny, Warn, and Audit. Custom policy authoring for CEL/VAP is allowed, and existing users won't need to convert their Rego to CEL as they will both be supported and be used to enforce policies. To use CEL and VAP, users need to enroll in the feature flag `AKS-AzurePolicyK8sNativeValidation` in the `Microsoft.ContainerService` namespace. For more information, view the [Gatekeeper Documentation](https://open-policy-agent.github.io/gatekeeper/website/docs/validating-admission-policy/).

Security improvements.
- Released September 2024
- Kubernetes 1.27+ (VAP generation is only supported on 1.30+)
- Gatekeeper 3.17.1

#### 1.7.0

Introducing expansion, a shift left feature that lets you know up front whether your workload resources (Deployments, ReplicaSets, Jobs, etc.) will produce admissible pods. Expansion shouldn't change the behavior of your policies; rather, it just shifts Gatekeeper's evaluation of pod-scoped policies to occur at workload admission time rather than pod admission time. However, to perform this evaluation it must generate and evaluate a what-if pod that is based on the pod spec defined in the workload, which might have incomplete metadata. For instance, the what-if pod won't contain the proper owner references. Because of this small risk of policy behavior changing, we're introducing expansion as disabled by default. To enable expansion for a given policy definition, set `.policyRule.then.details.source` to `All`. Built-ins will be updated soon to enable parameterization of this field. If you test your policy definition and find that the what-if pod being generated for evaluation purposes is incomplete, you can also use a mutation with source `Generated` to mutate the what-if pods. For more information on this option, view the [Gatekeeper documentation](https://open-policy-agent.github.io/gatekeeper/website/docs/expansion#mutating-example).

Expansion is currently only available on AKS clusters, not Arc clusters.

Security improvements.
- Released July 2024
- Kubernetes 1.27+
- Gatekeeper 3.16.3

#### 1.6.1

Security improvements.
- Released May 2024
- Gatekeeper 3.14.2

#### 1.5.0

Security improvements.
- Released May 2024
- Kubernetes 1.27+
- Gatekeeper 3.16.3

#### 1.4.0

Enables mutation and external data by default. The additional mutating webhook and increased validating webhook timeout cap might add latency to calls in the worst case. Also introduces support for viewing policy definition and set definition version in compliance results.

- Released May 2024
- Kubernetes 1.25+
- Gatekeeper 3.14.0

#### 1.3.0

Introduces error state for policies in error, enabling them to be distinguished from policies in noncompliant states. Adds support for v1 constraint templates and use of the excludedNamespaces parameter in mutation policies. Adds an error status check on constraint templates post-installation.

- Released February 2024
- Kubernetes 1.25+
- Gatekeeper 3.14.0

#### 1.2.1

- Released October 2023
- Kubernetes 1.25+
- Gatekeeper 3.13.3

#### 1.1.0

- Released July 2023
- Kubernetes 1.27+
- Gatekeeper 3.11.1

#### 1.0.1

- Released June 2023
- Kubernetes 1.24+
- Gatekeeper 3.11.1

#### 1.0.0

Azure Policy for Kubernetes now supports mutation to remediate AKS clusters at-scale!

## Remove the add-on

### Remove the add-on from AKS

To remove the Azure Policy Add-on from your AKS cluster, use either the Azure portal or Azure CLI:

- Azure portal

  1. Launch the AKS service in the Azure portal by selecting **All services**, then searching for
     and selecting **Kubernetes services**.

  1. Select your AKS cluster where you want to disable the Azure Policy Add-on.

  1. Select **Policies** on the left side of the Kubernetes service page.

  1. In the main page, select the **Disable add-on** button.

- Azure CLI

  ```azurecli-interactive
  # Log in first with az login if you're not using Cloud Shell

  az aks disable-addons --addons azure-policy --name MyAKSCluster --resource-group MyResourceGroup
  ```

### Remove the add-on from Azure Arc enabled Kubernetes

> [!NOTE]
> Azure Policy Add-on Helm model is now deprecated. You should opt for the [Azure Policy Extension for Azure Arc enabled Kubernetes](#install-azure-policy-extension-for-azure-arc-enabled-kubernetes) instead.

To remove the Azure Policy Add-on and Gatekeeper from your Azure Arc enabled Kubernetes cluster, run
the following Helm command:

```bash
helm uninstall azure-policy-addon
```

### Remove the add-on from AKS Engine

> [!NOTE]
>  The AKS Engine product is now deprecated for Azure public cloud customers. Consider using [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) for managed Kubernetes or [Cluster API Provider Azure](https://github.com/kubernetes-sigs/cluster-api-provider-azure) for self-managed Kubernetes. There are no new features planned; this project will only be updated for CVEs & similar, with Kubernetes 1.24 as the final version to receive updates.

To remove the Azure Policy Add-on and Gatekeeper from your AKS Engine cluster, use the method that
aligns with how the add-on was installed:

- If installed by setting the **addons** property in the cluster definition for AKS Engine:

  Redeploy the cluster definition to AKS Engine after changing the **addons** property for
  _azure-policy_ to false:

  ```json
  "addons": [
    {
      "name": "azure-policy",
      "enabled": false
    }
  ]
  ```

  For more information, see
  [AKS Engine - Disable Azure Policy Add-on](https://github.com/Azure/aks-engine/blob/master/examples/addons/azure-policy/README.md#disable-azure-policy-add-on).

- If installed with Helm Charts, run the following Helm command:

  ```bash
  helm uninstall azure-policy-addon
  ```
## Limitations

  - For general Azure Policy definitions and assignment limits, review [Azure Policy's documented limits](../../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-policy-limits)
  - Azure Policy Add-on for Kubernetes can only be deployed to Linux node pools.
  - Maximum number of pods supported by the Azure Policy Add-on per cluster: **10,000**
  - Maximum number of Non-compliant records per policy per cluster: **500**
  - Maximum number of Non-compliant records per subscription: **1 million**
  - Installations of Gatekeeper outside of the Azure Policy Add-on aren't supported. Uninstall any components installed by a previous Gatekeeper installation before enabling the Azure Policy Add-on.
  - [Reasons for non-compliance](../how-to/determine-non-compliance.md#compliance-reasons) aren't available for the Microsoft.Kubernetes.Data [Resource Provider mode](./definition-structure-basics.md#resource-provider-modes). Use [Component details](../how-to/determine-non-compliance.md#component-details-for-resource-provider-modes).
 - Component-level [exemptions](./exemption-structure.md) aren't supported for [Resource Provider modes](./definition-structure-basics.md#resource-provider-modes). Parameters support is available  in Azure Policy definitions to exclude and include particular namespaces.
 - Using the `metadata.gatekeeper.sh/requires-sync-data` annotation in a constraint template to configure the [replication of data](https://open-policy-agent.github.io/gatekeeper/website/docs/sync) from your cluster into the OPA cache is currently only allowed for built-in policies. The reason is because it can dramatically increase the Gatekeeper pods resource usage if not used carefully.

### Configuring the Gatekeeper Config

Changing the Gatekeeper config is unsupported, as it contains critical security settings. Edits to the config are reconciled.

### Using data.inventory in constraint templates

Currently, several built-in policies make use of [data replication](https://open-policy-agent.github.io/gatekeeper/website/docs/sync), which enables users to sync existing on-cluster resources to the OPA cache and reference them during evaluation of an `AdmissionReview` request. Data replication policies can be differentiated by the presence of `data.inventory` in the Rego, and the presence of the `metadata.gatekeeper.sh/requires-sync-data` annotation, which informs the Azure Policy addon which resources need to be cached for policy evaluation to work properly. This process differs from standalone Gatekeeper, where this annotation is descriptive, not prescriptive.

Data replication is currently blocked for use in custom policy definitions, because replicating resources with high instance counts can dramatically increase the Gatekeeper pods\' resource usage if not used carefully. You'll see a `ConstraintTemplateInstallFailed` error when attempting to create a custom policy definition containing a constraint template with this annotation.

Removing the annotation may appear to mitigate the error you see, but then the policy addon will not sync any required resources for that constraint template into the cache. Thus, your policies will be evaluated against an empty `data.inventory` (assuming that no built-in is assigned that replicates the requisite resources). This will lead to misleading compliance results. As noted [previously](#configuring-the-gatekeeper-config), manually editing the config to cache the required resources is also not permitted.

The following limitations apply only to the Azure Policy Add-on for AKS:
-  [AKS Pod security policy](/azure/aks/use-pod-security-policies) and the Azure Policy Add-on for AKS can't both be enabled. For more information, see [AKS pod security limitation](/azure/aks/use-azure-policy).
-  Namespaces automatically excluded by Azure Policy Add-on for evaluation: kube-system and gatekeeper-system.

## Frequently asked questions

### What does the Azure Policy Add-on / Azure Policy Extension deploy on my cluster upon installation?

The Azure Policy Add-on requires three Gatekeeper components to run: One audit pod and two webhook pod replicas. One Azure Policy pod and one Azure Policy webhook pod is also installed.

### How much resource consumption should I expect the Azure Policy Add-on / Extension to use on each cluster?

The Azure Policy for Kubernetes components that run on your cluster consume more resources as the count of Kubernetes resources and policy assignments increases in the cluster, which requires audit and enforcement operations.

The following are estimates to help you plan:

- For fewer than 500 pods in a single cluster with a max of 20 constraints: two vCPUs and 350 MB of memory per component.
- For more than 500 pods in a single cluster with a max of 40 constraints: three vCPUs and 600 MB of memory per component.

### Can Azure Policy for Kubernetes definitions be applied on Windows pods?

Windows pods [don't support security contexts](https://kubernetes.io/docs/concepts/security/pod-security-standards/#what-profiles-should-i-apply-to-my-windows-pods). Thus, some of the Azure Policy definitions, like disallowing root privileges, can't be escalated in Windows pods and only apply to Linux pods.

### What type of diagnostic data gets collected by Azure Policy Add-on?

The Azure Policy Add-on for Kubernetes collects limited cluster diagnostic data. This diagnostic
data is vital technical data related to software and performance. The data is used in the following ways:

- Keep Azure Policy Add-on up to date.
- Keep Azure Policy Add-on secure, reliable, performant.
- Improve Azure Policy Add-on - through the aggregate analysis of the use of the add-on.

The information collected by the add-on isn't personal data. The following details are currently
collected:

- Azure Policy Add-on agent version
- Cluster type
- Cluster region
- Cluster resource group
- Cluster resource ID
- Cluster subscription ID
- Cluster OS (Example: Linux)
- Cluster city (Example: Seattle)
- Cluster state or province (Example: Washington)
- Cluster country or region (Example: United States)
- Exceptions/errors encountered by Azure Policy Add-on during agent installation on policy
  evaluation
- Number of Gatekeeper policy definitions not installed by Azure Policy Add-on

### What are general best practices to keep in mind when installing the Azure Policy Add-on?

  - Use system node pool with `CriticalAddonsOnly` taint to schedule Gatekeeper pods. For more information, see [Using system node pools](/azure/aks/use-system-pools#system-and-user-node-pools).
  - Secure outbound traffic from your AKS clusters. For more information, see [Control egress traffic](/azure/aks/limit-egress-traffic) for cluster nodes.
  - If the cluster has `aad-pod-identity` enabled, Node Managed Identity (NMI) pods modify the nodes `iptables` to intercept calls to the Azure Instance Metadata endpoint. This configuration means any request made to the Metadata endpoint is intercepted by NMI even if the pod doesn't use `aad-pod-identity`.
  - `AzurePodIdentityException` CRD can be configured to inform `aad-pod-identity` that any requests to the Metadata endpoint originating from a pod that matches labels defined in CRD should be proxied without any processing in NMI. The system pods with `kubernetes.azure.com/managedby: aks` label in kube-system namespace should be excluded in `aad-pod-identity` by configuring the `AzurePodIdentityException` CRD. For more information, see [Disable aad-pod-identity for a specific pod or application](https://azure.github.io/aad-pod-identity/docs/configure/application_exception). To configure an exception, install the [mic-exception YAML](https://github.com/Azure/aad-pod-identity/blob/master/deploy/infra/mic-exception.yaml).

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Policy definition structure](definition-structure-basics.md).
- Review [Understanding policy effects](effect-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
