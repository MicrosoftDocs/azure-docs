---
title: Cross-resource Alerts on Azure Resource Graph by using Azure Monitor
description: Use Azure Monitor to create cross-product alerts on Azure Resource Graph and Log Analytics in Azure Monitor
author: osalzberg
ms.author: orens
ms.topic: conceptual
ms.date: 05/01/2023
ms.reviewer: osalzberg

---
# Cross-resource alerts on Azure Resource Graph by using Azure Monitor
Azure Monitor supports cross-service Alerts on Azure Resource Graph, [Application Insights](../app/app-insights-overview.md), and [Log Analytics](../logs/data-platform-logs.md). You can then create alerts based on your Azure Resource Graph tables by using Log Analytics or Application Insights tools and refer to it in a cross-service query. This article shows how to make a cross-service alert.

## Getting Started
## (Pre-req) Prepare a Log Analytics Workspace

Create a new LA workspace or pick an existing one

> [!TIP]
> * [How to create a Log Analytics Workspace](../logs/quick-create-workspace.md)

## (pre-req) Prepare a managed identity

The alerting query will run with the permission of the managed identity (MI). [You can use either a user-assigned MI or system-assigned MI](../../active-directory/managed-identities-azure-resources/overview#managed-identity-types")

1. Create an empty identity
User-assigned MI: create it before creating the rule
System-assigned MI: ARM will automatically create an empty identity for the rule when the rule is created
2. Grant permission to the identity
The identity need ARM Reader on the LA workspace + Reader on the relevant resources to be queried, for example, one or more subscriptions.
User-assigned MI: grant the permissions before creating the rule
System-assigned MI: grant the permissions after creating the rule

## Prepare your monitoring query

Adapt an existing query or write a new query – navigate to your LA workspace à Logs to prep your query. 
You can access ARG-only or join data from LA to ARG. You can also call ARG once or multiple times per query.
During private preview:

```kusto
adx('cluster=https://arg-sea-rp.arg.core.windows.net/providers/Microsoft.ResourceGraph/adx;database=AzureResourceGraph').Resources
```
to access ARG tables from your LA workspace (Resources in this example)
Public preview onward: 

```kusto
arg().Resources
```
to access ARG tables from your LA workspace (Resources in this example)
If the query doesn’t work at this phase – there is an issue with LA-ARG integration, unrelated to alerts.

## Create an alert rule
Create a regular log alert rule.
* Scope tab: The LA workspace
* Condition tab: select "Custom log search" as the signal name, and use the query you have prepared.
* Details tab: in the Identity section select the relevant managed identity option (pick an existing user-assigned MI or use system-assigned MI).
* Other details as needed (action group if you want one, give to the rule a name etc)
* [System-assigned managed identity only] don't forget to grant the permissions to the rule's identity once the rule is created.)