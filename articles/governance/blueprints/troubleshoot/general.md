---
title: Troubleshoot common errors
description: Learn how to troubleshoot issues creating, assigning, and removing blueprints.
author: DCtheGeek
ms.author: dacoulte
ms.date: 12/11/2018
ms.topic: troubleshooting
ms.service: blueprints
manager: carmonm
ms.custom: seodec18
---
# Troubleshoot errors using Azure Blueprints

You may run into errors when creating or assigning blueprints. This article describes various
errors that may occur and how to resolve them.

## Finding error details

Many errors will be the result of assigning a blueprint to a scope. When an assignment fails, the
blueprint provides details about the failed deployment. This information indicates the issue so
that it can be fixed and the next deployment succeeds.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select **Assigned blueprints** from the page on the left and use the search box to filter the blueprint assignments to find the failed assignment. You can also sort the table of assignments by the **Provisioning State** column to see all failed assignments grouped together.

1. Left-click on the blueprint with the _Failed_ status or right-click and select **View assignment details**.

1. A red banner warning that the assignment has failed is at the top of the blueprint assignment page. Click anywhere on the banner to get more details.

It's common for the error to be caused by an artifact and not the blueprint as a whole. If an
artifact creates a Key Vault and Azure Policy prevents Key Vault creation, the entire assignment
will fail.

## General errors

### <a name="policy-violation"></a>Scenario: Policy Violation

#### Issue

The template deployment failed because of policy violation.

#### Cause

A policy may conflict with the deployment for a number of reasons:

- The resource being created is restricted by policy (commonly SKU or location restrictions)
- The deployment is setting fields that are configured by policy (common with tags)

#### Resolution

Change the blueprint so it doesn't conflict with the policies in the error details. If this change
isn't possible, an alternative option is to have the scope of the policy assignment changed so the
blueprint is no longer in conflict with the policy.

### <a name="escape-function-parameter"></a>Scenario: Blueprint parameter is a function

#### Issue

Blueprint parameters that are functions are processed before being passed to artifacts.

#### Cause

Passing a blueprint parameter that uses a function, such as `[resourceGroup().tags.myTag]`, to an
artifact results in the processed outcome of the function being set on the artifact instead of the
dynamic function.

#### Resolution

To pass a function through as a parameter, escape the entire string with `[` such that the blueprint
parameter looks like `[[resourceGroup().tags.myTag]`. The escape character causes Blueprints to
treat the value as a string when processing the blueprint. Blueprints then places the function on
the artifact allowing it to be dynamic as expected. For more information, see
[Template file structure - syntax](../../../azure-resource-manager/resource-group-authoring-templates.md#syntax).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following
channels for more support:

- Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
- Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.