---
title: Troubleshoot Azure Resource Graph alerts
description: Learn how to troubleshoot issues with Azure Resource Graph alerts integration with Log Analytics.
ms.date: 10/31/2023
ms.topic: troubleshooting
---

# Troubleshoot Azure Resource Graph alerts

> [!NOTE]
> Azure Resource Graph alerts integration with Log Analytics is in public preview.

The following descriptions help you troubleshoot queries for Azure Resource Graph alerts that integrate with Log Analytics.

## Azure Resource Graph operators

Only the operators supported in Azure Resource Graph Explorer are supported as part of this integration with Log Analytics for alerts. For more information, go to [supported operators](../concepts/query-language.md#supported-kql-language-elements).

## Pagination

Azure Resource Graph has pagination in its dedicated APIs. But with the way Log Analytics interacts with Azure Resource Graph, pagination isn't a supported reason why only 1,000 results are returned.

- Cross queries between Azure Resource Graph and Log Analytics don't support pagination and only show the first 1,000 results.
- You must set a limitation of 400 when writing a query with the [mv-expand](../concepts/query-language.md#supported-tabulartop-level-operators) operator.


## Managed identities

The managed identity for your alert must have the role [Log Analytics Contributor](../../../role-based-access-control/built-in-roles.md#log-analytics-contributor) or [Log Analytics Reader](../../../role-based-access-control/built-in-roles.md#log-analytics-reader). The role provides the permissions to get monitoring information.

When you set up an alert, the results can be different than the result after the alert is fired. The reason is that a fired alert is run based on managed identity, but when you manually test an alert it's based on the user's identity.

## Table names

Azure Resource Graph table names need to be camel case with the first letter of each word capitalized, like `Resources` or `ResourceContainers`. You can also use lowercase like `resources` or `resourcecontainers`.
