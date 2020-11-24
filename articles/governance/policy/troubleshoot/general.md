---
title: Troubleshoot common errors
description: Learn how to troubleshoot issues with creating policy definitions, the various SDK, and the add-on for Kubernetes.
ms.date: 10/30/2020
ms.topic: troubleshooting
---
# Troubleshoot errors using Azure Policy

You may run into errors when creating policy definitions, working with SDK, or setting up the
[Azure Policy for Kubernetes](../concepts/policy-for-kubernetes.md) add-on. This article describes
various general errors that may occur and how to resolve them.

## Finding error details

The location of error details depends on the action that causes the error.

- When working with a custom policy, try it in the Azure portal to get linting feedback about the
  schema or review resulting [compliance data](../how-to/get-compliance-data.md) to see how
  resources were evaluated.
- When working with various SDK, the SDK provides details about why the function failed.
- When working with the add-on for Kubernetes, start with the
  [logging](../concepts/policy-for-kubernetes.md#logging) in the cluster.

## General errors

### Scenario: Alias not found

#### Issue

Azure Policy uses [aliases](../concepts/definition-structure.md#aliases) to map to Azure Resource
Manager properties.

#### Cause

An incorrect or non-existent alias is used in a policy definition.

#### Resolution

First, validate that the Resource Manager property has an alias. Use
[Azure Policy extension for Visual Studio Code](../how-to/extension-for-vscode.md),
[Azure Resource Graph](../../resource-graph/samples/starter.md#distinct-alias-values), or SDK to
look up available aliases. If the alias for a Resource Manager property doesn't exist, create a
support ticket.

### Scenario: Evaluation details not up-to-date

#### Issue

A resource is in the "Not Started" state or compliance details aren't current.

#### Cause

A new policy or initiative assignment takes around 30 minutes to be applied. New or updated
resources within scope of an existing assignment become available around 15 minutes later. A
standard compliance scan happens every 24 hours. For more information, see
[evaluation triggers](../how-to/get-compliance-data.md#evaluation-triggers).

#### Resolution

First, wait the appropriate amount of time for an evaluation to complete and compliance results to
become available in Azure portal or SDK. To start a new evaluation scan with Azure PowerShell or
REST API, see
[On-demand evaluation scan](../how-to/get-compliance-data.md#on-demand-evaluation-scan).

### Scenario: Compliance not as expected

#### Issue

A resource isn't in the evaluation state, either _Compliant_ or _Not-Compliant_, that's expected for
that resource.

#### Cause

The resource isn't in the correct scope for the policy assignment or the policy definition doesn't
operate as intended.

#### Resolution

Follow these steps to troubleshoot your policy definition:

1. First, wait the appropriate amount of time for an evaluation to complete and compliance results
   to become available in Azure portal or SDK. To start a new evaluation scan with Azure PowerShell
   or REST API, see
   [On-demand evaluation scan](../how-to/get-compliance-data.md#on-demand-evaluation-scan).
1. Check that the assignment parameters and assignment scope are set correctly.
1. Check the [policy definition mode](../concepts/definition-structure.md#mode):
   - Mode 'all' for all resource types.
   - Mode 'indexed' if the policy definition checks for tags or location.
1. Check that the scope of the resource isn't
   [excluded](../concepts/assignment-structure.md#excluded-scopes) or
   [exempt](../concepts/exemption-structure.md).
1. If compliance for a policy assignment shows `0/0` resources, no resources were determined to be
   applicable within the assignment scope. Check both the policy definition and the assignment
   scope.
1. For a non-compliant resource that was expected to be compliant, check
   [determining reasons for non-compliance](../how-to/determine-non-compliance.md). The comparison
   of the definition to the evaluated property value indicates why a resource was non-compliant.
   - If the **target value** is wrong, revise the policy definition.
   - If the **current value** is wrong, validate the resource payload through `resources.azure.com`.
1. Check [Troubleshoot: Enforcement not as expected](#scenario-enforcement-not-as-expected) for
   other common issues and solutions.

If you still have an issue with your duplicated and customized built-in policy definition or custom
definition, create a support ticket under **Authoring a policy** to route the issue correctly.

### Scenario: Enforcement not as expected

#### Issue

A resource that's expected to be acted on by Azure Policy isn't and there's no entry in the
[Azure Activity log](../../../azure-monitor/platform/platform-logs-overview.md).

#### Cause

The policy assignment has been configured for
[enforcementMode](../concepts/assignment-structure.md#enforcement-mode) of _Disabled_. While
enforcement mode is disabled, the policy effect isn't enforced and there's no entry in the Activity
log.

#### Resolution

Follow these steps to troubleshoot your policy assignment's enforcement:

1. First, wait the appropriate amount of time for an evaluation to complete and compliance results
   to become available in Azure portal or SDK. To start a new evaluation scan with Azure PowerShell
   or REST API, see
   [On-demand evaluation scan](../how-to/get-compliance-data.md#on-demand-evaluation-scan).
1. Check that the assignment parameters and assignment scope are set correctly and that
   **enforcementMode** is _Enabled_. 
1. Check the [policy definition mode](../concepts/definition-structure.md#mode):
   - Mode 'all' for all resource types.
   - Mode 'indexed' if the policy definition checks for tags or location.
1. Check that the scope of the resource isn't
   [excluded](../concepts/assignment-structure.md#excluded-scopes) or
   [exempt](../concepts/exemption-structure.md).
1. Verify the resource payload matches the policy logic. This can be done by
   [capturing a HAR trace](../../../azure-portal/capture-browser-trace.md) or reviewing the ARM
   template properties.
1. Check [Troubleshoot: Compliance not as expected](#scenario-compliance-not-as-expected) for other
   common issues and solutions.

If you still have an issue with your duplicated and customized built-in policy definition or custom
definition, create a support ticket under **Authoring a policy** to route the issue correctly.

### Scenario: Denied by Azure Policy

#### Issue

Creation or update of a resource is denied.

#### Cause

A policy assignment to the scope your new or updated resource is in meets the criteria of a policy
definition with a [Deny](../concepts/effects.md#deny) effect. Resources meetings these definitions
are prevented from being created or updated.

#### Resolution

The error message from a deny policy assignment includes the policy definition and policy assignment
IDs. If the error information in the message is missed, it's also available in the
[Activity log](../../../azure-monitor/platform/activity-log.md#view-the-activity-log). Use this
information to get more details to understand the resource restrictions and adjust the resource
properties in your request to match allowed values.

## Template errors

### Scenario: Policy supported functions processed by template

#### Issue

Azure Policy supports a number of Azure Resource Manager template (ARM template) functions and
functions that are only available in a policy definition. Resource Manager processes these functions
as part of a deployment instead of as part of a policy definition.

#### Cause

Using supported functions, such as `parameter()` or `resourceGroup()`, results in the processed
outcome of the function at deployment time instead of leaving the function for the policy definition
and Azure Policy engine to process.

#### Resolution

To pass a function through to be part of a policy definition, escape the entire string with `[` such
that the property looks like `[[resourceGroup().tags.myTag]`. The escape character causes Resource
Manager to treat the value as a string when processing the template. Azure Policy then places the
function into the policy definition allowing it to be dynamic as expected. For more information, see
[Syntax and expressions in Azure Resource Manager templates](../../../azure-resource-manager/templates/template-expressions.md).

## Add-on for Kubernetes installation errors

### Scenario: Install using Helm Chart fails on password

#### Issue

The `helm install azure-policy-addon` command fails with one of the following messages:

- `!: event not found`
- `Error: failed parsing --set data: key "<key>" has no value (cannot end with ,)`

#### Cause

The generated password includes a comma (`,`) that Helm Chart is splitting on.

#### Resolution

Escape the comma (`,`) in the password value when running `helm install azure-policy-addon` with a
backslash (`\`).

### Scenario: Install using Helm Chart fails as name already exists

#### Issue

The `helm install azure-policy-addon` command fails with the following message:

- `Error: cannot re-use a name that is still in use`

#### Cause

The Helm Chart with the name `azure-policy-addon` has already been installed or partially installed.

#### Resolution

Follow the directions to
[remove the Azure Policy for Kubernetes add-on](../concepts/policy-for-kubernetes.md#remove-the-add-on),
then rerun the `helm install azure-policy-addon` command.

### Scenario: Azure virtual machine user-assigned identities are replaced by system-assigned managed identities

#### Issue

After assigning Guest Configuration policy initiatives to audit settings inside machines, user-assigned managed identities
that were assigned to the machine are no longer assigned. Only a system-assigned managed identity is
assigned.

#### Cause

The policy definitions previously used in Guest Configuration DeployIfNotExists definitions ensured that a system-assigned
identity is assigned to the machine but also removed user-assigned identity assignments.

#### Resolution

The definitions that previously caused this issue appear as \[Deprecated\] and are replaced by policy definitions that manage
prerequisites without removing user-assigned managed identity. A manual step is required. Delete any existing
policy assignments that are marked \[Deprecated\] and replace them with the updated prerequisite policy initiative
and policy definitions that have the same name as the original.

For a detailed narrative, see the following blog post:

[Important change released for Guest Configuration audit policies](https://techcommunity.microsoft.com/t5/azure-governance-and-management/important-change-released-for-guest-configuration-audit-policies/ba-p/1655316)

## Add-on for Kubernetes general errors

### Scenario: Add-on doesn't work with AKS clusters on version 1.19 (preview)

#### Issue

Version 1.19 clusters return this error via gatekeeper controller and policy webhook pods:

```
2020/09/22 20:06:55 http: TLS handshake error from 10.244.1.14:44282: remote error: tls: bad certificate
```

#### Cause

AKS clusers on version 1.19 (preview) isn't yet compatible with the Azure Policy Add-on.

#### Resolution

Avoid using Kubernetes 1.19 (preview) with the Azure Policy Add-on. The add-on can be used with any
supported generally available version such as 1.16, 1.17, or 1.18.

### Scenario: Add-on is unable to reach the Azure Policy service endpoint due to egress restrictions

#### Issue

The add-on can't reach the Azure Policy service endpoint and returns one of the following errors:

- `failed to fetch token, service not reachable`
- `Error getting file "Get https://raw.githubusercontent.com/Azure/azure-policy/master/built-in-references/Kubernetes/container-allowed-images/template.yaml: dial tcp 151.101.228.133.443: connect: connection refused`

#### Cause

This issues happens when a cluster egress is locked down.

#### Resolution

Ensure the domains and ports in the following articles are open:

- [Required outbound network rules and FQDNs for AKS clusters](../../../aks/limit-egress-traffic.md#required-outbound-network-rules-and-fqdns-for-aks-clusters)
- [Install Azure Policy Add-on for Azure Arc enabled Kubernetes (preview)](../concepts/policy-for-kubernetes.md#install-azure-policy-add-on-for-azure-arc-enabled-kubernetes)

### Scenario: Add-on is unable to reach the Azure Policy service endpoint due to aad-pod-identity configuration

#### Issue

The add-on can't reach the Azure Policy service endpoint and returns one of the following errors:

- `azure.BearerAuthorizer#WithAuthorization: Failed to refresh the Token for request to https://gov-prod-policy-data.trafficmanager.net/checkDataPolicyCompliance?api-version=2019-01-01-preview: StatusCode=404`
- `adal: Refresh request failed. Status Code = '404'. Response body: getting assigned identities for pod kube-system/azure-policy-8c785548f-r882p in CREATED state failed after 16 attempts, retry duration [5]s, error: <nil>`

#### Cause

This error occurs when _add-pod-identity_ is installed on the cluster and _kube-system_ pods aren't
excluded in _aad-pod-identity_.

The _aad-pod-identity_ component Node Managed Identity (NMI) pods modify the nodes' iptables to
intercept calls to Azure Instance Metadata endpoint. This setup means any request that's made to the
Metadata endpoint is intercepted by NMI even if the pod doesn't use _aad-pod-identity_.
**AzurePodIdentityException** CRD can be configured to inform _aad-pod-identity_ that any requests
to metadata endpoint originating from a pod that matches labels defined in CRD should be proxied
without any processing in NMI.

#### Resolution

Exclude the system pods with `kubernetes.azure.com/managedby: aks` label in _kube-system_ namespace
in _aad-pod-identity_ by configuring the **AzurePodIdentityException** CRD.

For more information, see
[Disable AAD Pod Identity for a specific Pod/Application](https://azure.github.io/aad-pod-identity/docs/configure/application_exception).

To configure an exception, see this example:

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

### Scenario: The Resource Provider isn't registered

#### Issue

The add-on can reach the Azure Policy service endpoint, but sees the following error:

```
The resource provider 'Microsoft.PolicyInsights' is not registered in subscription '{subId}'. See https://aka.ms/policy-register-subscription for how to register subscriptions.
```

#### Cause

The `Microsoft.PolicyInsights` resource provider isn't registered and must be registered for the
add-on to get policy definitions and return compliance data.

#### Resolution

Register the `Microsoft.PolicyInsights` resource provider. For directions, see
[Register a resource provider](../../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

### Scenario: The subscript is disabled

#### Issue

The add-on can reach the Azure Policy service endpoint, but sees the following error:

```
The subscription '{subId}' has been disabled for azure data-plane policy. Please contact support.
```

#### Cause

This error means the subscription was determined to be problematic and the feature flag
`Microsoft.PolicyInsights/DataPlaneBlocked` was added to block the subscription.

#### Resolution

Contact feature team `azuredg@microsoft.com` to investigate and resolve this issue. 

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following
channels for more support:

- Get answers from experts through
  [Microsoft Q&A](/answers/topics/azure-policy.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure
  account for improving customer experience by connecting the Azure community to the right
  resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the
  [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
