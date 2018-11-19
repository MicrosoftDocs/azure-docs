---
title: Troubleshoot errors using Azure Blueprints
description: Learn how to troubleshoot issues creating and assigning blueprints
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 10/25/2018
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Troubleshoot errors using Azure Blueprints

You may run into errors when creating or assigning blueprints. This article describes various
errors that may occur and how to resolve them.

## Finding Error Details

Many errors will be the result of assigning a blueprint to a scope. When an assignment fails, the
blueprint provides details about the failed deployment. This information indicates the issue so
that it can be fixed and the next deployment succeeds.

1. Click on **All services** and searching for and selecting **Policy** in the left pane. On the **Policy** page, click on **Blueprints**.

1. Select **Assigned Blueprints** from the page on the left and use the search box to filter the blueprint assignments to find the failed assignment. You can also sort the table of assignments by the **Provisioning State** column to see all failed assignments grouped together.

1. Left-click on the blueprint with the _Failed_ status or right-click and select **View Assignment Details**.

1. A red banner warning that the assignment has failed is at the top of the blueprint assignment page. Click anywhere on the banner to get more details.

It's common for the error to be caused by an artifact and not the blueprint as a whole. If an
artifact creates a Key Vault and Azure Policy prevents Key Vault creation, the entire assignment
will fail.

## General Errors

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

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following
channels for more support:

- Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
- Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.