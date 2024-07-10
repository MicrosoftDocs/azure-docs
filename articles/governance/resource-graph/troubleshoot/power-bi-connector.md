---
title: Troubleshoot Azure Resource Graph Power BI connector
description: Learn how to troubleshoot issues with Azure Resource Graph Power BI connector.
ms.date: 05/08/2024
ms.topic: troubleshooting
---

# Troubleshoot Azure Resource Graph Power BI connector

The following descriptions help you troubleshoot Azure Resource Graph (ARG) data connector in Power BI.

## Connector availability

The ARG Power BI connector isn't available in all Power BI products and versions.

| Version | Products |
| ---- | ---- |
| 2.123.x <br> (November 2023) or later | Power BI Datasets (Desktop + Service) <br> Power BI (Dataflows) <br> Fabric (Dataflow Gen2) |


ARG Power BI connector isn't available in the following products:

- Excel
- Power Apps (Dataflows)
- Dynamic 365 Customer Insights
- Analysis Services

## Supported capabilities

The ARG Power BI connector only supports [import connections](/power-bi/connect-data/desktop-directquery-about#import-connections). The ARG Power BI connector doesn't support `DirectQuery` connections. For more information about connectivity modes and their differences, go to [DirectQuery in Power BI](/power-bi/connect-data/desktop-directquery-about).

## Load times

The load time for ARG queries in Power BI is contingent on the query response size. Larger query results might lead to extended load times.

## Unexpected Results

If your query yields unexpected or inaccurate results, consider the following scenarios:

- **Verify permissions**: Confirm that your [Azure role-based access control (Azure RBAC) permissions](../../../role-based-access-control/overview.md) are accurate, as the results of the queries are subject to Azure RBAC. Ensure you have at least read access to the resources you want to query. Queries don't return results without adequate permissions to the Azure object or object group.
- **Check for comments**: Review your query and remove any comments (`//`) because Power BI doesn't support Kusto comments.
- **Compare results**: For parity checks, run your query in both the ARG Explorer in Azure portal and the ARG Power BI connector. Compare the results obtained from both platforms for consistency.

## Errors

The ARG connector's query capability behaves the same at [ARG Explorer](../first-query-portal.md) in the Azure portal. For information about ARG common errors, go to the [troubleshooting guide](general.md#general-errors).

For Power BI errors, go to [common issues](/power-query/common-issues).

The following table contains descriptions of common ARG Power BI connector errors.

| Error | Description |
| ---- | ---- |
| Invalid query | Query that was entered isn't valid. Check the syntax of your query and refer to the ARG [Kusto Query Language (KQL)](../concepts/query-language.md#supported-kql-language-elements) for guidance. |
| Scope check | If you're querying at the tenant scope, ensure the subscription ID and management group ID fields are empty. <br> <br> If you have inputs in the subscriptions ID or management group ID fields that you want to filter for, select either subscription or management group from the drop-down scope field. |
| Scope subscription mismatch | The subscription scope was selected from the scope drop-down field but a management group ID was entered. |
| Scope management group mismatch | The management group scope was selected from the scope drop-down field but a subscription ID was entered. |
