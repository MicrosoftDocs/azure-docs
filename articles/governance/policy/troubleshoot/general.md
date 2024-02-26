---
title: Troubleshoot common errors
description: Learn how to troubleshoot problems with creating policy definitions, the various SDKs, and the add-on for Kubernetes.
ms.date: 10/26/2022
ms.topic: troubleshooting
---
# Troubleshoot errors with using Azure Policy

When you create policy definitions, work with SDKs, or set up the
[Azure Policy for Kubernetes](../concepts/policy-for-kubernetes.md) add-on, you might run into
errors. This article describes various general errors that might occur, and it suggests ways to
resolve them.

## Find error details

The location of the error details depends on what aspect of Azure Policy you're working with.

- If you're working with a custom policy, go to the Azure portal to get linting feedback about the
  schema, or review resulting [compliance data](../how-to/get-compliance-data.md) to see how
  resources were evaluated.
- If you're working with any of the various SDKs, the SDK provides details about why the function
  failed.
- If you're working with the add-on for Kubernetes, start with the
  [logging](../concepts/policy-for-kubernetes.md#logging) in the cluster.

## General errors

### Scenario: Alias not found

#### Issue

An incorrect or nonexistent alias is used in a policy definition. Azure Policy uses
[aliases](../concepts/definition-structure.md#aliases) to map to Azure Resource Manager properties.

#### Cause

An incorrect or nonexistent alias is used in a policy definition.

#### Resolution

First, validate that the Resource Manager property has an alias. To look up the available aliases,
go to [Azure Policy extension for Visual Studio Code](../how-to/extension-for-vscode.md) or the SDK.
If the alias for a Resource Manager property doesn't exist, create a support ticket.

### Scenario: Evaluation details aren't up to date

#### Issue

A resource is in the _Not Started_ state, or the compliance details aren't current.

#### Cause

A new policy or initiative assignment takes about five minutes to be applied. New or updated
resources within scope of an existing assignment become available in about 15 minutes. A
standard compliance scan occurs every 24 hours. For more information, see
[evaluation triggers](../how-to/get-compliance-data.md#evaluation-triggers).

#### Resolution

First, wait an appropriate amount of time for an evaluation to finish and compliance results to
become available in the Azure portal or the SDK. To start a new evaluation scan with Azure
PowerShell or the REST API, see
[On-demand evaluation scan](../how-to/get-compliance-data.md#on-demand-evaluation-scan).

### Scenario: Compliance isn't as expected

#### Issue

A resource isn't in either the _Compliant_ or _Not-Compliant_ evaluation state that's expected for
the resource.

#### Cause

The resource isn't in the correct scope for the policy assignment, or the policy definition doesn't
operate as intended.

#### Resolution

To troubleshoot your policy definition, do the following:

1. First, wait the appropriate amount of time for an evaluation to finish and compliance results
   to become available in the Azure portal or SDK.

1. To start a new evaluation scan with Azure PowerShell or the REST API, see
   [On-demand evaluation scan](../how-to/get-compliance-data.md#on-demand-evaluation-scan).
1. Ensure that the assignment parameters and assignment scope are set correctly.
1. Check the [policy definition mode](../concepts/definition-structure.md#mode):
   - The mode should be `all` for all resource types.
   - The mode should be `indexed` if the policy definition checks for tags or location.
1. Ensure that the scope of the resource isn't
   [excluded](../concepts/assignment-structure.md#excluded-scopes) or
   [exempt](../concepts/exemption-structure.md).
1. If compliance for a policy assignment shows `0/0` resources, no resources were determined to be
   applicable within the assignment scope. Check both the policy definition and the assignment
   scope.
1. For a noncompliant resource that was expected to be compliant, see
   [determine the reasons for noncompliance](../how-to/determine-non-compliance.md). The comparison
   of the definition to the evaluated property value indicates why a resource was noncompliant.
   - If the **target value** is wrong, revise the policy definition.
   - If the **current value** is wrong, validate the resource payload through `resources.azure.com`.
1. For a [Resource Provider mode](../concepts/definition-structure.md#resource-provider-modes)
   definition that supports a RegEx string parameter (such as `Microsoft.Kubernetes.Data` and the
   built-in definition "Container images should be deployed from trusted registries only"), validate
   that the [RegEx string](/dotnet/standard/base-types/regular-expression-language-quick-reference)
   parameter is correct.
1. For other common issues and solutions, see
   [Troubleshoot: Enforcement not as expected](#scenario-enforcement-not-as-expected).

If you still have an issue with your duplicated and customized built-in policy definition or custom
definition, create a support ticket under **Authoring a policy** to route the issue correctly.

### Scenario: Enforcement not as expected

#### Issue

A resource that you expect Azure Policy to act on isn't being acted on, and there's no entry in the
[Azure Activity log](../../../azure-monitor/essentials/platform-logs-overview.md).

#### Cause

The policy assignment has been configured for an
[**enforcementMode**](../concepts/assignment-structure.md#enforcement-mode) setting of _Disabled_.
While **enforcementMode** is disabled, the policy effect isn't enforced, and there's no entry in the
Activity log.

#### Resolution

Troubleshoot your policy assignment's enforcement by doing the following:

1. First, wait the appropriate amount of time for an evaluation to finish and compliance results to
   become available in the Azure portal or the SDK.

1. To start a new evaluation scan with Azure PowerShell or the REST API, see
   [On-demand evaluation scan](../how-to/get-compliance-data.md#on-demand-evaluation-scan).
1. Ensure that the assignment parameters and assignment scope are set correctly and that
   **enforcementMode** is _Enabled_.
1. Check the [policy definition mode](../concepts/definition-structure.md#mode):
   - The mode should be `all` for all resource types.
   - The mode should be `indexed` if the policy definition checks for tags or location.
1. Ensure that the scope of the resource isn't
   [excluded](../concepts/assignment-structure.md#excluded-scopes) or
   [exempt](../concepts/exemption-structure.md).
1. Verify that the resource payload matches the policy logic. This can be done by
   [capturing an HTTP Archive (HAR) trace](../../../azure-portal/capture-browser-trace.md) or
   reviewing the Azure Resource Manager template (ARM template) properties.
1. For other common issues and solutions, see
   [Troubleshoot: Compliance not as expected](#scenario-compliance-isnt-as-expected).

If you still have an issue with your duplicated and customized built-in policy definition or custom
definition, create a support ticket under **Authoring a policy** to route the issue correctly.

### Scenario: Denied by Azure Policy

#### Issue

Creation or update of a resource is denied.

#### Cause

A policy assignment to the scope of your new or updated resource meets the criteria of a policy
definition with a [Deny](../concepts/effects.md#deny) effect. Resources that meet these definitions
are prevented from being created or updated.

#### Resolution

The error message from a deny policy assignment includes the policy definition and policy assignment
IDs. If the error information in the message is missed, it's also available in the
[Activity log](../../../azure-monitor/essentials/activity-log.md#view-the-activity-log). Use this
information to get more details to understand the resource restrictions and adjust the resource
properties in your request to match allowed values.

### Scenario: Definition targets multiple resource types

#### Issue

A policy definition that includes multiple resource types fails validation during creation or update
with the following error:

```error
The policy definition '{0}' targets multiple resource types, but the policy rule is authored in a way that makes the policy not applicable to the target resource types '{1}'.
```

#### Cause

The policy definition rule has one or more conditions that don't get evaluated by the target
resource types.

#### Resolution

If an alias is used, make sure that the alias gets evaluated against only the resource type it
belongs to by adding a type condition before it. An alternative is to split the policy definition
into multiple definitions to avoid targeting multiple resource types.

### Scenario: Subscription limit exceeded

#### Issue

An error message on the compliance page in Azure portal is shown when retrieving compliance for
policy assignments.

#### Cause

The number of subscriptions under the selected scopes in the request has exceeded the limit of 5000
subscriptions. The compliance results may be partially displayed.

#### Resolution

Select a more granular scope with fewer child subscriptions to see the complete results.

## Template errors

### Scenario: Policy supported functions processed by template

#### Issue

Azure Policy supports a number of ARM template functions and functions that are available only in a
policy definition. Resource Manager processes these functions as part of a deployment instead of as
part of a policy definition.

#### Cause

Using supported functions, such as `parameter()` or `resourceGroup()`, results in the processed
outcome of the function at deployment time instead of allowing the function for the policy
definition and Azure Policy engine to process.

#### Resolution

To pass a function through as part of a policy definition, escape the entire string with `[` such
that the property looks like `[[resourceGroup().tags.myTag]`. The escape character causes Resource
Manager to treat the value as a string when it processes the template. Azure Policy then places the
function into the policy definition, which allows it to be dynamic as expected. For more
information, see
[Syntax and expressions in Azure Resource Manager templates](../../../azure-resource-manager/templates/template-expressions.md).

## Add-on for Kubernetes installation errors

### Scenario: Installation by using a Helm Chart fails because of a password error

#### Issue

The `helm install azure-policy-addon` command fails, and it returns one of the following errors:

- `!: event not found`
- `Error: failed parsing --set data: key "<key>" has no value (cannot end with ,)`

#### Cause

The generated password includes a comma (`,`), which the Helm Chart is splitting on.

#### Resolution

When you run `helm install azure-policy-addon`, escape the comma (`,`) in the password value with a
backslash (`\`).

### Scenario: Installation by using a Helm Chart fails because the name already exists

#### Issue

The `helm install azure-policy-addon` command fails, and it returns the following error:

- `Error: cannot re-use a name that is still in use`

#### Cause

The Helm Chart with the name `azure-policy-addon` has already been installed or partially installed.

#### Resolution

Follow the instructions to
[remove the Azure Policy for Kubernetes add-on](../concepts/policy-for-kubernetes.md#remove-the-add-on),
then rerun the `helm install azure-policy-addon` command.

### Scenario: Azure virtual machine user-assigned identities are replaced by system-assigned managed identities

#### Issue

After you assign Guest Configuration policy initiatives to audit settings inside a machine, the
user-assigned managed identities that were assigned to the machine are no longer assigned. Only a
system-assigned managed identity is assigned.

#### Cause

The policy definitions that were previously used in Guest Configuration DeployIfNotExists
definitions ensured that a system-assigned identity is assigned to the machine, but they also
removed the user-assigned identity assignments.

#### Resolution

The definitions that previously caused this issue appear as _\[Deprecated\]_, and they're replaced
by policy definitions that manage prerequisites without removing user-assigned managed identities. A
manual step is required. Delete any existing policy assignments that are marked as
_\[Deprecated\]_, and replace them with the updated prerequisite policy initiative and policy
definitions that have the same name as the original.

For a detailed narrative, see the blog post
[Important change released for Guest Configuration audit policies](https://techcommunity.microsoft.com/t5/azure-governance-and-management/important-change-released-for-guest-configuration-audit-policies/ba-p/1655316).

## Add-on for Kubernetes general errors

### Scenario: The add-on is unable to reach the Azure Policy service endpoint because of egress restrictions

#### Issue

The add-on can't reach the Azure Policy service endpoint, and it returns one of the following errors:

- `failed to fetch token, service not reachable`
- `Error getting file "Get https://raw.githubusercontent.com/Azure/azure-policy/master/built-in-references/Kubernetes/container-allowed-images/template.yaml: dial tcp 151.101.228.133.443: connect: connection refused`

#### Cause

This issue occurs when a cluster egress is locked down.

#### Resolution

Ensure that the domains and ports mentioned in the following article are open:

- [Required outbound network rules and fully qualified domain names (FQDNs) for AKS clusters](../../../aks/outbound-rules-control-egress.md#required-outbound-network-rules-and-fqdns-for-aks-clusters)

### Scenario: The add-on is unable to reach the Azure Policy service endpoint because of the aad-pod-identity configuration

#### Issue

The add-on can't reach the Azure Policy service endpoint, and it returns one of the following
errors:

- `azure.BearerAuthorizer#WithAuthorization: Failed to refresh the Token for request to https://gov-prod-policy-data.trafficmanager.net/checkDataPolicyCompliance?api-version=2019-01-01-preview: StatusCode=404`
- `adal: Refresh request failed. Status Code = '404'. Response body: getting assigned identities for pod kube-system/azure-policy-8c785548f-r882p in CREATED state failed after 16 attempts, retry duration [5]s, error: <nil>`

#### Cause

This error occurs when _aad-pod-identity_ is installed on the cluster and the _kube-system_ pods
aren't excluded in _aad-pod-identity_.

The _aad-pod-identity_ component Node Managed Identity (NMI) pods modify the nodes' iptables to
intercept calls to the Azure instance metadata endpoint. This setup means that any request that's
made to the metadata endpoint is intercepted by NMI, even if the pod doesn't use _aad-pod-identity_.
The _AzurePodIdentityException_ CustomResourceDefinition (CRD) can be configured to inform
_aad-pod-identity_ that any requests to a metadata endpoint that originate from a pod matching the
labels defined in the CRD should be proxied without any processing in NMI.

#### Resolution

Exclude the system pods that have the `kubernetes.azure.com/managedby: aks` label in _kube-system_
namespace in _aad-pod-identity_ by configuring the _AzurePodIdentityException_ CRD.

For more information, see
[Disable the Azure Active Directory (Azure AD) pod identity for a specific pod/application](https://azure.github.io/aad-pod-identity/docs/configure/application_exception).

To configure an exception, follow this example:

```yaml
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzurePodIdentityException
metadata:
  name: mic-exception
  namespace: default
spec:
  podLabels:
    app: mic
    component: mic
---
apiVersion: "aadpodidentity.k8s.io/v1"
kind: AzurePodIdentityException
metadata:
  name: aks-addon-exception
  namespace: kube-system
spec:
  podLabels:
    kubernetes.azure.com/managedby: aks
```

### Scenario: The resource provider isn't registered

#### Issue

The add-on can reach the Azure Policy service endpoint, but the add-on logs display one of the
following errors:

- `The resource provider 'Microsoft.PolicyInsights' is not registered in subscription '{subId}'. See
  https://aka.ms/policy-register-subscription for how to register subscriptions.`

- `policyinsightsdataplane.BaseClient#CheckDataPolicyCompliance: Failure responding to request:
  StatusCode=500 -- Original Error: autorest/azure: Service returned an error. Status=500
  Code="InternalServerError" Message="Encountered an internal server error.`

#### Cause

The 'Microsoft.PolicyInsights' resource provider isn't registered. It must be registered for the
add-on to get policy definitions and return compliance data.

#### Resolution

Register the 'Microsoft.PolicyInsights' resource provider in the cluster subscription. For
instructions, see
[Register a resource provider](../../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

### Scenario: The subscription is disabled

#### Issue

The add-on can reach the Azure Policy service endpoint, but the following error is displayed:

`The subscription '{subId}' has been disabled for azure data-plane policy. Please contact support.`

#### Cause

This error means that the subscription was determined to be problematic, and the feature flag
`Microsoft.PolicyInsights/DataPlaneBlocked` was added to block the subscription.

#### Resolution

To investigate and resolve this issue, [contact the feature team](mailto:azuredg@microsoft.com).

### Scenario: Definitions in category "Guest Configuration" cannot be duplicated from Azure portal

#### Issue

When attempting to create a custom policy definition from the Azure portal page for policy
definitions, you select the "Duplicate definition" button. After assigning the policy, you
find machines are _NonCompliant_ because no guest configuration assignment resource exists.

#### Cause

Guest configuration relies on custom metadata added to policy definitions when
creating guest configuration assignment resources. The "Duplicate definition" activity in
the Azure portal does not copy custom metadata.

#### Resolution

Instead of using the portal, duplicate the policy definition using the Policy
Insights API. The following PowerShell sample provides an option.

```powershell
# duplicates the built-in policy which audits Windows machines for pending reboots
$def = Get-AzPolicyDefinition -id '/providers/Microsoft.Authorization/policyDefinitions/4221adbc-5c0f-474f-88b7-037a99e6114c' | % Properties
New-AzPolicyDefinition -name (new-guid).guid -DisplayName "$($def.DisplayName) (Copy)" -Description $def.Description -Metadata ($def.Metadata | convertto-json) -Parameter ($def.Parameters | convertto-json) -Policy ($def.PolicyRule | convertto-json -depth 15)
```

### Scenario: Kubernetes resource gets created during connectivity failure despite deny policy being assigned

#### Issue

In the event of a Kubernetes cluster connectivity failure, evaluation for newly created or updated resources may be bypassed due to Gatekeeper's fail-open behavior.

#### Cause

The GK fail-open model is by design and based on community feedback. Gatekeeper documentation expands on these reasons here: https://open-policy-agent.github.io/gatekeeper/website/docs/failing-closed#considerations.

#### Resolution

In the above event, the error case can be monitored from the [admission webhook metrics](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhook-metrics) provided by the kube-apiserver. And even if evaluation is bypassed at creation time and an object is created, it will still be reported on Azure Policy compliance as non-compliant as a flag to customers.

Regardless of the above, in such a scenario, Azure policy will still retain the last known policy on the cluster and keep the guardrails in place.

## Next steps

If your problem isn't listed in this article or you can't resolve it, get support by visiting one of
the following channels:

- Get answers from experts through
  [Microsoft Q&A](/answers/topics/azure-policy.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport). This official Microsoft Azure
  resource on Twitter helps improve the customer experience by connecting the Azure community to the
  right answers, support, and experts.
- If you still need help, go to the
  [Azure support site](https://azure.microsoft.com/support/options/) and select **Submit a support
  request**.
