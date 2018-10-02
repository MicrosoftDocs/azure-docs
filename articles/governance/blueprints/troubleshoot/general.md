---
title: Troubleshoot errors using Azure Blueprints
description: Learn how to troubleshoot issues creating and assigning blueprints
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: blueprints
manager: carmonm
---
# Troubleshoot errors using Azure Blueprints

You may encounter errors when creating or assigning blueprints. This article describes various
errors that may occur and how to resolve them.

## Finding Error Details

Many errors will be the result of assigning a blueprint to a scope. When an assignment fails,
blueprint provides details about the failed deployment. This information will indicate the issue so
that it can be fixed and the subsequent deployment will succeed.

1. Launch the Azure Blueprints service in the Azure portal by clicking on **All services** and searching for and selecting **Policy** in the left pane. On the **Policy** page, click on **Blueprints**.

1. Select **Assigned Blueprints** from the page on the left and use the search box to filter the blueprint assignments to find the failed assignment. You can also sort the table of assignments by the **Provisioning State** column to see all failed assignments grouped together.

1. Left-click on the blueprint with the _Failed_ status or right-click and select **View Assignment Details**.

1. At the top of the blueprint assignment page is a red banner warning that the assignment has failed. Click anywhere on the banner to get more details.

It is common for the error to be caused by an artifact included in the blueprint and not the
blueprint as a whole. For example, if the blueprint contains an artifact to create a Key Vault,
but Key Vault creation is prevented by Azure Policy, the entire assignment will fail.

## General Errors

### <a name="policy-violation"></a>Scenario: Policy Violation

#### Issue

The template deployment failed because of policy violation.

#### Cause

A policy may conflict with the deployment for a number of reasons:

- The resource being created is restricted by policy (commonly SKU or location restrictions)
- The deployment is setting fields that are configured by policy (common with tags)

#### Resolution

Adjust the blueprint to not be in conflict with the policies listed in the error information. If
this is not possible, an alternative options is to have the scope of the policy assignment changed
so the blueprint is no longer in conflict with the policy.

## Next steps

If you did not see your problem or are unable to solve your issue, visit one of the following
channels for more support:

- Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
- Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.