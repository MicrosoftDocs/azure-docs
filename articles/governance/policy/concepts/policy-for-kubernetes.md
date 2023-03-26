---
title: Learn Azure Policy for Kubernetes
description: Learn how Azure Policy uses Rego and Open Policy Agent to manage clusters running Kubernetes in Azure or on-premises.
ms.date: 06/17/2022
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.author: timwarner
author: timwarner-msft
---
# Understand Azure Policy for Kubernetes clusters

Azure Policy extends [Gatekeeper](https://open-policy-agent.github.io/gatekeeper) v3, an _admission
controller webhook_ for [Open Policy Agent](https://www.openpolicyagent.org/) (OPA), to apply
at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. Azure
Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters
from one place. The add-on enacts the following functions:

- Checks with Azure Policy service for policy assignments to the cluster.
- Deploys policy definitions into the cluster as
  [constraint template](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraint-templates) and
  [constraint](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraints) custom resources.
- Reports auditing and compliance details back to Azure Policy service.

Azure Policy for Kubernetes supports the following cluster environments:

- [Azure Kubernetes Service (AKS)](../../../aks/intro-kubernetes.md)
- [Azure Arc enabled Kubernetes](../../../azure-arc/kubernetes/overview.md)

> [!IMPORTANT]
> The Azure Policy Add-on Helm model and the add-on for AKS Engine have been _deprecated_. Instructions can be found below for [removal of those add-ons](#remove-the-add-on). 

## Overview

To enable and use Azure Policy with your Kubernetes cluster, take the following actions:

1. Configure your Kubernetes cluster and install the [Azure Kubernetes Service (AKS)](#install-azure-policy-add-on-for-aks) add-on

   > [!NOTE]
   > For common issues with installation, see
   > [Troubleshoot - Azure Policy Add-on](../troubleshoot/general.md#add-on-for-kubernetes-installation-errors).

2. [Understand the Azure Policy language for Kubernetes](#policy-language)

3. [Assign a definition to your Kubernetes cluster](#assign-a-policy-definition)

4. [Wait for validation](#policy-evaluation)

## Limitations

The following general limitations apply to the Azure Policy Add-on for Kubernetes clusters:

- Azure Policy Add-on for Kubernetes is supported on Kubernetes version **1.14** or higher.
- Azure Policy Add-on for Kubernetes can only be deployed to Linux node pools.
- Only built-in policy definitions are supported. Custom policy definitions are a _public preview_
  feature.
- Maximum number of pods supported by the Azure Policy Add-on: **10,000**
- Maximum number of Non-compliant records per policy per cluster: **500**
- Maximum number of Non-compliant records per subscription: **1 million**
- Installations of Gatekeeper outside of the Azure Policy Add-on aren't supported. Uninstall any
  components installed by a previous Gatekeeper installation before enabling the Azure Policy
  Add-on.
- [Reasons for non-compliance](../how-to/determine-non-compliance.md#compliance-reasons) aren't
  available for the `Microsoft.Kubernetes.Data`
  [Resource Provider mode](./definition-structure.md#resource-provider-modes). Use
  [Component details](../how-to/determine-non-compliance.md#component-details-for-resource-provider-modes).
- Component-level [exemptions](./exemption-structure.md) aren't supported for
  [Resource Provider modes](./definition-structure.md#resource-provider-modes).

The following limitations apply only to the Azure Policy Add-on for AKS:

- [AKS Pod security policy](../../../aks/use-pod-security-policies.md) and the Azure Policy Add-on
  for AKS can't both be enabled. For more information, see
  [AKS pod security limitation](../../../aks/use-azure-policy.md).
- Namespaces automatically excluded by Azure Policy Add-on for evaluation: _kube-system_ and
  _gatekeeper-system_.

## Recommendations

The following are general recommendations for using the Azure Policy Add-on:

- The Azure Policy Add-on requires three Gatekeeper components to run: One audit pod and two webhook
  pod replicas. These components consume more resources as the count of Kubernetes resources and
  policy assignments increases in the cluster, which requires audit and enforcement operations.

  - For fewer than 500 pods in a single cluster with a max of 20 constraints: two vCPUs and 350 MB
    memory per component.
  - For more than 500 pods in a single cluster with a max of 40 constraints: three vCPUs and 600 MB
    memory per component.

- Windows pods
  [don't support security contexts](https://kubernetes.io/docs/concepts/security/pod-security-standards/#what-profiles-should-i-apply-to-my-windows-pods).
  Thus, some of the Azure Policy definitions, such as disallowing root privileges, can't be
  escalated in Windows pods and only apply to Linux pods.

The following recommendation applies only to AKS and the Azure Policy Add-on:

- Use system node pool with `CriticalAddonsOnly` taint to schedule Gatekeeper pods. For more
  information, see
  [Using system node pools](../../../aks/use-system-pools.md#system-and-user-node-pools).
- Secure outbound traffic from your AKS clusters. For more information, see
  [Control egress traffic for cluster nodes](../../../aks/limit-egress-traffic.md).
- If the cluster has `aad-pod-identity` enabled, Node Managed Identity (NMI) pods modify the nodes'
  iptables to intercept calls to the Azure Instance Metadata endpoint. This configuration means any
  request made to the Metadata endpoint is intercepted by NMI even if the pod doesn't use
  `aad-pod-identity`. AzurePodIdentityException CRD can be configured to inform `aad-pod-identity`
  that any requests to the Metadata endpoint originating from a pod that matches labels defined in
  CRD should be proxied without any processing in NMI. The system pods with
  `kubernetes.azure.com/managedby: aks` label in _kube-system_ namespace should be excluded in
  `aad-pod-identity` by configuring the AzurePodIdentityException CRD. For more information, see
  [Disable aad-pod-identity for a specific pod or application](https://azure.github.io/aad-pod-identity/docs/configure/application_exception).
  To configure an exception, install the
  [mic-exception YAML](https://github.com/Azure/aad-pod-identity/blob/master/deploy/infra/mic-exception.yaml).

## Install Azure Policy Add-on for AKS

Before installing the Azure Policy Add-on or enabling any of the service features, your subscription
must enable the **Microsoft.PolicyInsights** resource providers.

1. You need the Azure CLI version 2.12.0 or later installed and configured. Run `az --version` to
   find the version. If you need to install or upgrade, see
   [Install the Azure CLI](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli).

1. Register the resource providers and preview features.

   - Azure portal:

     Register the **Microsoft.PolicyInsights** resource providers. For steps, see
     [Resource providers and types](../../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

   - Azure CLI:

     ```azurecli-interactive
     # Log in first with az login if you're not using Cloud Shell

     # Provider register: Register the Azure Policy provider
     az provider register --namespace Microsoft.PolicyInsights
     ```

1. If limited preview policy definitions were installed, remove the add-on with the **Disable**
   button on your AKS cluster under the **Policies** page.

1. The AKS cluster must be version _1.14_ or higher. Use the following script to validate your AKS
   cluster version:

   ```azurecli-interactive
   # Log in first with az login if you're not using Cloud Shell

   # Look for the value in kubernetesVersion
   az aks list
   ```

1. Install version _2.12.0_ or higher of the Azure CLI. For more information, see
   [Install the Azure CLI](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli).

Once the above prerequisite steps are completed, install the Azure Policy Add-on in the AKS cluster
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
similar to the following output:

```output
{
        "config": null,
        "enabled": true,
        "identity": null
}
```
## <a name="install-azure-policy-extension-for-azure-arc-enabled-kubernetes"></a>Install Azure Policy Extension for Azure Arc enabled Kubernetes

[Azure Policy for Kubernetes](./policy-for-kubernetes.md) makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place.

This article describes how to [create](#create-azure-policy-extension), [show extension status](#show-azure-policy-extension), and [delete](#delete-azure-policy-extension) the Azure Policy for Kubernetes extension.

For an overview of the extensions platform, see [Azure Arc cluster extensions](../../../azure-arc/kubernetes/conceptual-extensions.md).

### Prerequisites

> Note: If you have already deployed Azure Policy for Kubernetes on an Azure Arc cluster using Helm directly without extensions, follow the instructions listed to [delete the Helm chart](#remove-the-add-on-from-azure-arc-enabled-kubernetes). Once the deletion is done, you can then proceed.
1. Ensure your Kubernetes cluster is a supported distribution.

    > Note: Azure Policy for Arc extension is supported on [the following Kubernetes distributions](../../../azure-arc/kubernetes/validation-program.md).
1. Ensure you have met all the common prerequisites for Kubernetes extensions listed [here](../../../azure-arc/kubernetes/extensions.md) including [connecting your cluster to Azure Arc](../../../azure-arc/kubernetes/quickstart-connect-cluster.md?tabs=azure-cli).

    > Note: Azure Policy extension is supported for Arc enabled Kubernetes clusters [in these regions](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc).
1. Open ports for the Azure Policy extension. The Azure Policy extension uses these domains and ports to fetch policy
   definitions and assignments and report compliance of the cluster back to Azure Policy.

   |Domain |Port |
   |---|---|
   |`data.policy.core.windows.net` |`443` |
   |`store.policy.core.windows.net` |`443` |
   |`login.windows.net` |`443` |
   |`dc.services.visualstudio.com` |`443` |

1. Before installing the Azure Policy extension or enabling any of the service features, your subscription must enable the **Microsoft.PolicyInsights** resource providers.
    > Note: To enable the resource provider, follow the steps in
   [Resource providers and types](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal)
   or run either the Azure CLI or Azure PowerShell command:
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

> Note the following for Azure Policy extension creation:
> - Auto-upgrade is enabled by default which will update Azure Policy extension minor version if any new changes are deployed.
> - Any proxy variables passed as parameters to `connectedk8s` will be propagated to the Azure Policy extension to support outbound proxy.
>
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

## Policy language

The Azure Policy language structure for managing Kubernetes follows that of existing policy
definitions. With a [Resource Provider mode](./definition-structure.md#resource-provider-modes) of
`Microsoft.Kubernetes.Data`, the effects [audit](./effects.md#audit) and [deny](./effects.md#deny)
are used to manage your Kubernetes clusters. _Audit_ and _deny_ must provide **details** properties
specific to working with
[OPA Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint)
and Gatekeeper v3.

As part of the _details.templateInfo_, _details.constraint_, or _details.constraintTemplate_
properties in the policy definition, Azure Policy passes the URI or Base64Encoded value of these
[CustomResourceDefinitions](https://open-policy-agent.github.io/gatekeeper/website/docs/howto/#constraint-templates)
(CRD) to the add-on. Rego is the language that OPA and Gatekeeper support to validate a request to
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
   cluster where the policy assignment will apply.

   > [!NOTE]
   > When assigning the Azure Policy for Kubernetes definition, the **Scope** must include the
   > cluster resource.

1. Give the policy assignment a **Name** and **Description** that you can use to identify it easily.

1. Set the [Policy enforcement](./assignment-structure.md#enforcement-mode) to one of the values
   below.

   - **Enabled** - Enforce the policy on the cluster. Kubernetes admission requests with violations
     are denied.

   - **Disabled** - Don't enforce the policy on the cluster. Kubernetes admission requests with
     violations aren't denied. Compliance assessment results are still available. When rolling out
     new policy definitions to running clusters, _Disabled_ option is helpful for testing the policy
     definition as admission requests with violations aren't denied.

1. Select **Next**.

1. Set **parameter values**

   - To exclude Kubernetes namespaces from policy evaluation, specify the list of namespaces in
     parameter **Namespace exclusions**. It's recommended to exclude: _kube-system_,
     _gatekeeper-system_, and _azure-arc_.

1. Select **Review + create**.

Alternately, use the [Assign a policy - Portal](../assign-policy-portal.md) quickstart to find and
assign a Kubernetes policy. Search for a Kubernetes policy definition instead of the sample 'audit
vms'.

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
> While a cluster admin may have permission to create and update constraint templates and
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

- If the cluster subscription is registered with Microsoft Defender for Cloud, then Microsoft Defender for Cloud
  Kubernetes policies are applied on the cluster automatically.

- When a deny policy is applied on cluster with existing Kubernetes resources, any pre-existing
  resource that is not compliant with the new policy continues to run. When the non-compliant
  resource gets rescheduled on a different node the Gatekeeper blocks the resource creation.

- When a cluster has a deny policy that validates resources, the user will not see a rejection
  message when creating a deployment. For example, consider a Kubernetes deployment that contains
  replicasets and pods. When a user executes `kubectl describe deployment $MY_DEPLOYMENT`, it does
  not return a rejection message as part of events. However,
  `kubectl describe replicasets.apps $MY_DEPLOYMENT` returns the events associated with rejection.

> [!NOTE]
> Init containers may be included during policy evaluation. To see if init containers are included,
> review the CRD for the following or a similar declaration:
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
such as the Azure Policy template store (`store.policy.core.windows.net`) and GitHub.

When policy definitions and their constraint templates are assigned but aren't already installed on
the cluster and are in conflict, they are reported as a conflict and won't be installed into the
cluster until the conflict is resolved. Likewise, any existing policy definitions and their
constraint templates that are already on the cluster that conflict with newly assigned policy
definitions continue to function normally. If an existing assignment is updated and there is a
failure to sync the constraint template, the cluster is also marked as a conflict. For all conflict
messages, see
[AKS Resource Provider mode compliance reasons](../how-to/determine-non-compliance.md#aks-resource-provider-mode-compliance-reasons)

## Logging

As a Kubernetes controller/container, both the _azure-policy_ and _gatekeeper_ pods keep logs in the
Kubernetes cluster. The logs can be exposed in the **Insights** page of the Kubernetes cluster. For
more information, see
[Monitor your Kubernetes cluster performance with Azure Monitor for containers](../../../azure-monitor/containers/container-insights-analyze.md).

To view the add-on logs, use `kubectl`:

```bash
# Get the azure-policy pod name installed in kube-system namespace
kubectl logs <azure-policy pod name> -n kube-system

# Get the gatekeeper pod name installed in gatekeeper-system namespace
kubectl logs <gatekeeper pod name> -n gatekeeper-system
```

For more information, see
[Debugging Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/debug/) in the
Gatekeeper documentation.

## View Gatekeeper artifacts

After the add-on downloads the policy assignments and installs the constraint templates and
constraints on the cluster, it annotates both with Azure Policy information like the policy
assignment ID and the policy definition ID. To configure your client to view the add-on related
artifacts, use the following steps:

1. Setup `kubeconfig` for the cluster.

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

For Azure Policy extension for Arc extension related issues, please see:
- [Azure Arc enabled Kubernetes troubleshooting](../../../azure-arc/kubernetes/troubleshooting.md)

For Azure Policy related issues, please see:
- [Inspect Azure Policy logs](#logging)
- [General troubleshooting for Azure Policy on Kubernetes](../troubleshoot/general.md#add-on-for-kubernetes-general-errors)

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
> Azure Policy Add-on Helm model is now deprecated. Please opt for the [Azure Policy Extension for Azure Arc enabled Kubernetes](#install-azure-policy-extension-for-azure-arc-enabled-kubernetes) instead.

To remove the Azure Policy Add-on and Gatekeeper from your Azure Arc enabled Kubernetes cluster, run
the following Helm command:

```bash
helm uninstall azure-policy-addon
```

### Remove the add-on from AKS Engine

> [!NOTE]
>  The AKS Engine product is now deprecated for Azure public cloud customers. Please consider using [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) for managed Kubernetes or [Cluster API Provider Azure](https://github.com/kubernetes-sigs/cluster-api-provider-azure) for self-managed Kubernetes. There are no new features planned; this project will only be updated for CVEs & similar, with Kubernetes 1.24 as the final version to receive updates.

To remove the Azure Policy Add-on and Gatekeeper from your AKS Engine cluster, use the method that
aligns with how the add-on was installed:

- If installed by setting the **addons** property in the cluster definition for AKS Engine:

  Redeploy the cluster definition to AKS Engine after changing the **addons** property for
  _azure-policy_ to false:

  ```json
  "addons": [{
      "name": "azure-policy",
      "enabled": false
  }]
  ```

  For more information, see
  [AKS Engine - Disable Azure Policy Add-on](https://github.com/Azure/aks-engine/blob/master/examples/addons/azure-policy/README.md#disable-azure-policy-add-on).

- If installed with Helm Charts, run the following Helm command:

  ```bash
  helm uninstall azure-policy-addon
  ```

## Diagnostic data collected by Azure Policy Add-on

The Azure Policy Add-on for Kubernetes collects limited cluster diagnostic data. This diagnostic
data is vital technical data related to software and performance. It's used in the following ways:

- Keep Azure Policy Add-on up to date
- Keep Azure Policy Add-on secure, reliable, performant
- Improve Azure Policy Add-on - through the aggregate analysis of the use of the add-on

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

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Policy definition structure](definition-structure.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
