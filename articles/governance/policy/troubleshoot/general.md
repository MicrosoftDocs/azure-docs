---
title: Troubleshoot common errors
description: Learn how to troubleshoot issues with creating policy definitions, the various SDK, and the add-on for Kubernetes.
ms.date: 05/22/2020
ms.topic: troubleshooting
---
# Troubleshoot errors using Azure Policy

You may run into errors when creating policy definitions, working with SDK, or setting up the
[Azure Policy for Kubernetes](../concepts/policy-for-kubernetes.md) add-on. This article describes
various errors that may occur and how to resolve them.

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

Azure Policy uses [aliases](../concepts/definition-structure.md#aliases) to map to Resource Manager
properties.

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

### Scenario: Evaluation not as expected

#### Issue

A resource isn't in the evaluation state, either _Compliant_ or _Not-Compliant_, that's expected for
that resource.

#### Cause

The resource isn't in the correct scope for the policy assignment or the policy definition doesn't
operate as intended.

#### Resolution

- For a non-compliant resource that was expected to be compliant, start by
  [determining reasons for non-compliance](../how-to/determine-non-compliance.md). The comparison of
  the definition to the evaluated property value indicates why a resource was non-compliant.
- For a compliant resource that was expected to be non-compliant, read the policy definition
  condition by condition and evaluate against the resources properties. Validate that logical
  operators are grouping the right conditions together and that your conditions aren't inverted.

If compliance for a policy assignment shows `0/0` resources, no resources were determined to be
applicable within the assignment scope. Check both the policy definition and the assignment scope.

### Scenario: Enforcement not as expected

#### Issue

A resource that's expected to be acted on by Azure Policy isn't and there's no entry in the
[Azure Activity log](../../../azure-monitor/platform/platform-logs-overview.md).

#### Cause

The policy assignment has been configured for
[enforcementMode](../concepts/assignment-structure.md#enforcement-mode) of _Disabled_. While
enforcement mode is disabled, the policy effect isn't enforced and there is no entry in the Activity
log.

#### Resolution

Update **enforcementMode** to _Enabled_. This change lets Azure Policy act on the resources in this
policy assignment and send entries to Activity log. If **enforcementMode** is already enabled, see
[Evaluation not as expected](#scenario-evaluation-not-as-expected) for courses of action.

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
[Activity log](../../../azure-monitor/platform/activity-log-view.md). Use this information to get
more details to understand the resource restrictions and adjust the resource properties in your
request to match allowed values.

## Template errors

### Scenario: Policy supported functions processed by template

#### Issue

Azure Policy supports a number of Resource Manager template functions and functions that are only
available in a policy definition. Resource Manager processes these functions as part of a deployment
instead of as part of a policy definition.

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

## Add-on installation errors

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

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following
channels for more support:

- Get answers from experts through
  [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-policy.html).
- Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure
  account for improving customer experience by connecting the Azure community to the right
  resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the
  [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
