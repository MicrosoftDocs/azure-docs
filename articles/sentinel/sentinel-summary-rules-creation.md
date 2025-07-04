---
title: Create Summary Rules for Microsoft Sentinel Solutions
description: This article guides you through the process of creating and publishing summary rules to Microsoft Sentinel solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 7/04/2025

#CustomerIntent: As an ISV partner, I want to create and publish summary rules to my Microsoft Sentinel solution so that I can provide inbuilt data summarization that customers can use to speed up query execution and save costs.
---

# Create and publish summary rules for Microsoft Sentinel solutions

Summary rules in Microsoft Sentinel are scheduled queries that aggregate and transform high-volume data into summarized results stored in a custom log table. In essence, a summary rule runs a user-defined KQL (Kusto Query Language) query at a regular interval (for example, every hour or once a day) across a large set of logs, and saves the aggregated output (such as counts, statistics, or filtered records) into a new or existing Log Analytics (LA) table. This mechanism provides concise, precompiled data that is smaller and easier to query than the raw log. For more information, see [Aggregate Microsoft Sentinel data with summary rules](/azure/sentinel/summary-rules).

This article walks you through the process of creating and publishing summary rules to Microsoft Sentinel solutions.

## Importance of summary rules in Microsoft Sentinel solutions

Including summary rules in Microsoft Sentinel solutions is important to ensure that the solution offerings are cost-conscious, powerful, and user-friendly. It reflects a commitment to maximizing security value while minimizing overhead. For example, an ISV providing a cloud application firewall solution might include a summary rule that aggregates all blocked requests by IP and reason, and an analytic rule to alert on IPs with unusually high blocks. This gives clients immediate insight into potential attacks filtered by the firewall, without forcing them to ingest every single request log. The overall result is a win-win: customers get comprehensive protection and insights at lower cost, and ISVs can differentiate their solutions by delivering efficient analytics rather than raw data. Listed next are some of the most important benefits of including summary rules in your Microsoft Sentinel solutions - 

- **Cost-Efficiency for Customers:** One of the strongest motivators is that summary rules help your solution’s users (the customers) manage costs. If your product generates a lot of log data (for example, a security appliance that logs every network flow or an application that audits user actions), a Microsoft Sentinel solution that naively ingests all that data into the Analytics tier could become expensive for the customer. By providing summary rules as part of the solution, you offer a method to ingest the product’s logs in a cost-efficient tier and only promote the useful insights. This shows that as an ISV, you're mindful of cloud costs and are delivering a solution that is optimized for the Microsoft Sentinel data tiering model. In competitive terms, a cost-effective solution is more attractive for clients. Microsoft’s guidance indicates analytics costs can be dramatically reduced (often by orders of magnitude) using a strategy of Basic/Auxiliary logs + summary rules. By baking this strategy into your offering, you help clients "do more with less" – they get security value from your product’s data without an exorbitant SIEM bill. This not only benefits customers directly but can also remove barriers in product adoption (since cost concerns are mitigated).
- **Improved Data Management and Retention:** Solutions that incorporate summary rules encourage a best-practice data management approach. Rather than dumping all data blindly, they enable a tiered logging strategy: less critical data to cheaper storage, critical insights to Analytics. For example, an ISV building a Microsoft Sentinel solution for an IoT security system might guide the user to ingest verbose sensor logs into Auxiliary and use a summary rule to pull anomaly counts daily into an Analytics table. This structured approach ensures the customer’s Microsoft Sentinel workspace stays organized and lean. It also inherently provides a long-term record of key information – your solution can advertise that it keeps important security metrics for extended periods (beyond standard retention), because the summaries are small and cheap to retain. This is a value-add for users who care about compliance or historical analysis, and it reflects well on the ISV as providing a comprehensive solution lifecycle (immediate detection plus historical insight). Essentially, summary rules in your solution help manage the firehose of data, taming it into something actionable and keeping the data around in a usable form for as long as needed.
- **Enhanced Analytics & Detection Capabilities:** By using summary rules, ISVs can deliver more advanced detection logic out-of-the-box. Many modern threats require analyzing patterns over time or correlating across large datasets – exactly what summary rules excel at. If you include summary rules in the solution, you can implement detections that would be otherwise impractical. For instance, instead of simple threshold alerts, your solution could detect trends like "a 200% increase in data exports by an account compared to its 30-day baseline" or "a sudden appearance of 10 new administrative roles in one day" by using summary data. This provides richer security analytics that differentiate your solution. It helps the customer find subtle issues (for example, low-and-slow attacks, creeping changes) that single-event rules might miss. Including ready-made summary rules for such scenarios demonstrates that your content isn’t just doing the bare minimum, but is using Microsoft Sentinel’s full power for depth of detection. Additionally, summary rules can facilitate multi-step detection workflows: For example, one summary rule aggregates unusual events and a second analytic rule triggers on that summary. As an ISV, showing these layered analytical approaches in your solution can highlight your expertise and the thoroughness of your security logic.
- **Better Performance and User Experience:** Solutions that utilize summary rules will often yield faster performance when the customer is querying data or investigating incidents. If a customer installs your solution and it includes some custom tables populated by summary rules (instead of forcing them to run heavy queries on raw data), they notice that the provided workbooks and queries in the solution run quicker and feel more responsive. For example, a workbook that shows a 6-month trend of events can pull from a summary table of daily counts, returning the visualization in a second, whereas a workbook trying to count raw events over six months might time out or take minutes. By designing solution content that uses preaggregated data, you create a smoother user experience and prove the solution’s scalability. Moreover, this approach reduces the load on the customer’s Microsoft Sentinel workspace – fewer gigantic queries means lower risk of hitting query limits or impacting other operations. In summary, summary rules help your solution to scale well for the user, maintaining performance even as their data grows.
- **Holistic Security Coverage (“No Data Left Behind”):** Including summary rules helps ensure that your solution can derive value from all of the data generated by your product, not just the obvious parts. Often an ISV’s product might produce logs that aren't purely security events but can still contain useful signals (think of application logs, or debug logs). A summary rule allows you to incorporate those into the security monitoring story by extracting relevant info. This means when a customer deploys your solution, they benefit from a more complete security visibility regarding your product. They won’t have to decide between ingesting tons of data for minimal gain or ignoring that data completely – your solution will handle it smartly. Microsoft’s ethos with Microsoft Sentinel + Summary Rules is indeed to not have to throw away any data permanently, but to store it appropriately and examine it intelligently. Your solution, by following this principle, ensures the customer isn’t blind to certain activity just because of volume or cost. This can improve security outcomes and also customer satisfaction with your product’s integration.

## Best Practices for Using Summary Rules in Solutions

To ensure both the ISV and the end-user get the most out of summary rules, here are a few best practices (largely derived from Microsoft’s guidance and early user experiences):

- **Design summary queries to significantly reduce data volume:** A summary rule should ideally output far less data than it inputs – aim to filter out noise and use aggregation (grouping) to shrink the dataset by orders of magnitude. For example, use the summarized operator to roll up events by key dimensions (like user, IP, day) so that only patterns or totals are stored, not every detail. Microsoft’s advice is to use techniques like counting, take min/max, etc., and project only necessary fields, to keep the summary table lean. This not only saves cost but ensures queries on the summary table remain snappy.
- **Choose an appropriate schedule and delay:** Align the frequency of summary rule runs with the use case. If you need near-real-time aggregation (for example, summarizing each hour for quick detection), you can run as often as every 20 minutes. If the scenario is reports or daily stats, a daily schedule is fine and incurs less overhead. Also set a latency buffer (delay) if needed – for instance, when running every hour, you might process data up to 15 minutes ago rather than right up to the current minute, to allow late events to arrive. This ensures completeness of data. Document these choices in your solution’s notes so users understand the timing.
- **Leverage analytic rules on summary results:** Encourage or include an analytic rule that triggers on the summary table if the intent is to alert (for example, provide a ready-to-enable rule that looks at the summary table for anomalies or IoC hits). As shown earlier, the workflow is usually Summary Rule -> writes to table -> Analytic Rule -> creates incident. By packaging both, you give the user a turnkey solution. Make sure the analytic rule’s schedule/look-back aligns with how the summary is produced (for example, if summary runs daily, the alert rule might run daily shortly after, or hourly checking the last day’s summary).

## How to create summary rules
Summary rules in Microsoft Sentinel solutions follow the YAML format. For an example of summary rule, see [Sample summary rule in GitHub](https://github.com/Azure/Azure-Sentinel/blob/master/Summary%20rules/Network/FortinetFortigateNetworkSessionIPSummary.yaml)

The following sections provide a detailed walkthrough of various attributes of a summary rule.

### ID

The `id` attribute consists of a standard globally unique identifier (GUID). Generate it by using any development tool, an online generator, or the new PowerShell [New-GUID cmdlet](/powershell/module/microsoft.powershell.utility/new-guid?view=powershell-6&preserve-view=true). It must be unique among other GUIDs.

This field is mandatory.

### Display Name

The `displayName` attribute provides a brief label that summarizes the rule. Make sure the label is clear and concise to help users understand the purpose of the summary rule. This attribute:

* Uses sentence-case capitalization.
* Doesn't end in a period.
* Has a maximum length of 50 characters (whenever possible).

This field is mandatory.

### Description

The `description` attribute provides a detailed description of the summary rule. The description includes information about the rule, frequency, and other relevant details that can help customers know more about the summarization logic and its impact. This attribute:

* Uses sentence case capitalization.
* Is different from and more descriptive than the name field.
* Has a maximum length of 255 characters.
* Is five sentences or less.
* Doesn't provide a technical explanation for the query language.

This field is mandatory.

### Required data connectors

The `requiredDataConnectors` attribute represents the list of data connectors that the rule needs to function correctly, including the data sources against which the rule queries. If there's no current data connector mapping, you must use an open brace: `requiredDataConnectors: []`.

The `connectorId` attribute specifies the ID of the data connector that you need so the query functions correctly. If your summary rule depends on the data fetched from a specific connector, you must specify the connector ID here. For instance, if your summary rule depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the `connectorID` as `1PasswordCCPDefinition`.

The `dataTypes` attribute represents the data types that the summary rule depends on and mentions the name of the data type referenced in the `dataTypes` section of the connector. For instance, if your summary rule depends on the data from this [connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/1Password/Data%20Connectors/1Password_ccpv2/1Password_DataConnectorDefinition.json), you must specify the data type as `OnePasswordEventLogs_CL`. If the summary rule operates on a Kusto function/parser instead of the table (like `Syslog`, `CommonEventFormat`, or `_CL`), `dataTypes` is the Kusto function name/parser name and not the table name.

### Destination table

The `destinationTable` attribute specifies the name of the table in Log Analytics (LA) where the query results are saved.

### Query

The `query` attribute defines the summarization logic. We recommend that you write the query in KQL and make sure that it's structured and easy to understand. We recommend that you create an efficient query that's optimized for performance to ensure it can be run against large datasets without affecting performance. Make sure that your query meets the following criteria.

Limit the query to 10,000 characters. If the query section exceeds this limit, consider reducing the number of characters. A static list of items used for comparison within the query body can cause you to go over the limit. We recommend that you move these lists to one of the following options:

* A [watchlist function](/azure/sentinel/watchlists)
* A [custom JSON/CSV](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml)
* A [custom function](https://techcommunity.microsoft.com/t5/azure-sentinel/using-kql-functions-to-speed-up-analysis-in-azure-sentinel/ba-p/712381)

Each line in the query body must have at least one space at the beginning, but two spaces are standard to support readability.

We highly recommend that you use comments to clarify the query. Avoid adding comments at the end of a query statement line. Instead, add your comments on a separate line. For example:

This field is mandatory.

### Query frequency

The `binSize` attribute represents the frequency at which the query runs in minutes. Only nonzero positive integer values are allowed. Ex- 60 indicates that the query runs every 1 hour.


### Version

When a customer creates a new summary from the template, the template `version` is saved. If a new template version is published, customers are notified in the UX. Versions follow the format `a`, `b`, and `c`, in which `a` is the major version, `b` is the minor version, and `c` is the patch. The version field is the last line of the template.

This field is mandatory.