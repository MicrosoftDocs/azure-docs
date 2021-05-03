---
title: Handle false positives in Azure Sentinel
description: Learn how to resolve false positives in Azure Sentinel by creating automation rules or modifying alert rules.
author: oshezaf
ms.author: ofshezaf
ms.service: azure-sentinel
ms.topic: how-to
ms.date: 05/03/2021

---

# Handle false positives in Azure Sentinel

No detection rule is perfect. When using Azure Sentinel, you are bound to get some false positives. In this article, you learn how to handle false positives in scheduled analytics rules.

## Understand false positives

A false positive error in Azure Sentinel is an alert that generates when no threat exists. False positives in a correctly-built detection rule often come from specific entities like users or IP addresses that should be excluded from the rule.

Common scenarios include:

- Normal activities of certain specific users like service principals can show a pattern that appears suspicious.
- An intentional security scanning activity that comes from known IP addresses can be detected as malicious.
- A rule excludes private IP addresses, but should also exclude some internal IP addresses that aren't private.

In this article, you learn how to resolve false positives by using two methods:

1. Using *automation rules* involves creating an exception without modifying rules, and lets you apply the same exception to several rules. Also, this method:

- Works for detections that aren't based on scheduled alert rules.
- Allows applying an exception on a limited-time basis. For example, maintenance work might trigger false positives that outside of the maintenance timeframe would be true incidents.
- Keeps a trail, as the exception prevents the creation of an incident, but the alert is still recorded for audit purposes.

1. Modifying the scheduled *alert rule* allows for more elaborate and detailed exceptions, like subnet-based exceptions and advanced boolean expressions. Modifying the query also allows using *watchlists* to centralize exception management.

An important distinction between the two methods is that analysts often generate automation rule-based exceptions, while only Security Operations Center (SOC) engineers typically create alert rule-based exceptions.

## Add an exception using an automation rule

The simplest way to add an exception is to use the **Add automation rule** feature when viewing an incident that is a false positive.

To add and apply an automation rule:

1. In Azure Sentinel, under **Incidents**, select the incident you want to create an exception for.
1. Select **Create automation rule**.
1. In the **Create new automation rule** sidebar, optionally modify the new rule name to identify the exception, rather than just the alert rule name.
1. Under **Conditions**, optionally add more **Analytic rule name**s to apply the exception to.
1. The sidebar presents the specific entities in the current incident that might have caused the false positive. Keep the automatic suggestions, or modify them to tune the exception better. For example, you could change a condition on an IP address to one that checks an entire subnet.
   
   :::image type="content" source="media/false-positives/create-rule.png" alt-text="Screenshot showing how to create an automation rule for an incident in Azure Sentinel":::
   
1. After you define when the rule triggers, you can continue to define what it does:
   
   1. The rule is already configured to close an incident that meets the exception criteria.
   1. You can add a comment to the automatically closed incident that explains the exception. For example, you could specify that the incident was closed because it originated from known administration activity.
   1. By default, the rule is set to expire automatically after 24 hours. This might be the behavior you want, and it reduces the chance of false negative errors. If you want a longer exception, set **Rule expiration** to a later time.
   
1. Select **Apply**. The exception is now active.
   
   :::image type="content" source="media/false-positives/apply-rule.png" alt-text="Screenshot showing how to finish creating and applying an automation rule in Azure Sentinel":::

You can also create a new automation rule from scratch, by selecting **automation** on the left menu and creating a new automation rule.

## Add an exception by modifying an analytics rule

Another option for implementing exceptions is to modify the analytic rule query. You can include the exceptions directly in the rule, or preferably, when possible, use a reference to a watchlist. You then manage the exception list in the watchlist.

### Modify the query

To implement an exception in the typical rule preamble, you can add a line like `where IPAddress !in ('10.0.0.8', '192.168.12.1')` near the beginning of the query. This line excludes specific IP addresses from the rule.

```kusto
let timeFrame = 1d;
SigninLogs
| where TimeGenerated >= ago(timeFrame)
| where IPAddress !in ('10.0.0.8', '192.168.12.1')
...
```

This type of exception isn't limited to IP addresses. You can exclude specific users with the `UserPrincipalName` field, or specific apps with `AppDisplayName`.

You can exclude multiple attributes. For example, to exclude alerts from either the IP address `10.0.0.8` or the user `user@microsoft.com`, use:

```kusto
| where IPAddress !in ('10.0.0.8')
| where UserPrincipalName != 'user@microsoft.com'
```

To implement a more fine-grained exception when applicable, and reduce the chance for false negatives, you can combine attributes. The following exception applies only if both values appear in the same alert:

```kusto
| where IPAddress != '10.0.0.8' and UserPrincipalName != 'user@microsoft.com'
```

The flexibility of in-query exceptions makes it the most complete solution for false positives, but rules modification can be costly.

### Exclude subnets

The use case that excludes IP ranges used by a certain organization requires subnet exclusion. The following example shows how to exclude subnets.

The `ipv_lookup` operator is an enrichment operator, not a filtering operator. The `where isempty(network)` line actually does the filtering by inspecting those events for which a match wasn't found.

```kusto
let subnets = datatable(network:string) [ "111.68.128.0/17", "5.8.0.0/19", ...];
let timeFrame = 1d;
SigninLogs
| where TimeGenerated >= ago(timeFrame)
| evaluate ipv4_lookup(subnets, IPAddress, network, return_unmatched = true)
| where isempty(network)
...
```

### Use watchlists to manage exceptions

You can use a watchlist to manage the list of exceptions outside the rule itself. When applicable, this preferred solution has several advantages:

- An analyst can add exceptions without editing the rule, which better follows SOC best practices.
- The same watchlist can apply to several rules, enabling central exception management.

Using a watchlist is similar to using a direct exception.

```kusto
let timeFrame = 1d;
let logonDiff = 10m;
let allowlist = (_GetWatchlist('ipallowlist') | project IPAddress);
SigninLogs
| where TimeGenerated >= ago(timeFrame)
| where IPAddress !in (allowlist)
...
```

You can also do subnet filtering by using a watchlist. In the preceding subnets code example, replace the subnets `datatable` definition with a watchlist:

```kusto
let subnets = _GetWatchlist('subnetallowlist');
```

## Next steps
- [Automate incident handling in Azure Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
- [Use Azure Sentinel watchlists](watchlists.md)

