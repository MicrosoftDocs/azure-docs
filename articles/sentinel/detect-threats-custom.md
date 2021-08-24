---
title: Create custom analytics rules to detect threats with Azure Sentinel | Microsoft Docs
description: Learn how to create custom analytics rules to detect security threats with Azure Sentinel. Take advantage of event grouping, alert grouping, and alert enrichment, and understand AUTO DISABLED.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2021
ms.author: yelevin

---
# Create custom analytics rules to detect threats

After [connecting your data sources](quickstart-onboard.md) to Azure Sentinel, create custom analytics rules to help discover threats and anomalous behaviors in your environment.

Analytics rules search for specific events or sets of events across your environment, alert you when certain event thresholds or conditions are reached, generate incidents for your SOC to triage and investigate, and respond to threats with automated tracking and remediation processes.

> [!TIP]
> When creating custom rules, use existing rules as templates or references. Using existing rules as a baseline helps by building out most of the logic before you make any changes needed.
> 

> [!div class="checklist"]
> * Create analytics rules
> * Define how events and alerts are processed
> * Define how alerts and incidents are generated
> * Choose automated threat responses for your rules

## Create a custom analytics rule with a scheduled query

1. From the Azure Sentinel navigation menu, select **Analytics**.

1. In the action bar at the top, select **+Create** and select **Scheduled query rule**. This opens the **Analytics rule wizard**.

    :::image type="content" source="media/tutorial-detect-threats-custom/create-scheduled-query-small.png" alt-text="Create scheduled query" lightbox="media/tutorial-detect-threats-custom/create-scheduled-query-full.png":::

### Analytics rule wizard - General tab

- Provide a unique **Name** and a **Description**. 

- In the **Tactics** field, you can choose from among categories of attacks by which to classify the rule. These are based on the tactics of the [MITRE ATT&CK](https://attack.mitre.org/) framework.

- Set the alert **Severity** as appropriate. 

- When you create the rule, its **Status** is **Enabled** by default, which means it will run immediately after you finish creating it. If you don’t want it to run immediately, select **Disabled**, and the rule will be added to your **Active rules** tab and you can enable it from there when you need it.

   :::image type="content" source="media/tutorial-detect-threats-custom/general-tab.png" alt-text="Start creating a custom analytics rule":::

## Define the rule query logic and configure settings

In the **Set rule logic** tab, you can either write a query directly in the **Rule query** field, or create the query in Log Analytics and then copy and paste it here.

- Queries are written in Kusto Query Language (KQL). Learn more about KQL [concepts](/azure/data-explorer/kusto/concepts/) and [queries](/azure/data-explorer/kusto/query/), and see this handy [quick reference guide](/azure/data-explorer/kql-quick-reference).

- The example shown in this screenshot queries the *SecurityEvent* table to display a type of [failed Windows logon events](/windows/security/threat-protection/auditing/event-4625).

   :::image type="content" source="media/tutorial-detect-threats-custom/set-rule-logic-tab-1-new.png" alt-text="Configure query rule logic and settings" lightbox="media/tutorial-detect-threats-custom/set-rule-logic-tab-all-1-new.png":::

- Here's another sample query, one that would alert you when an anomalous number of resources is created in [Azure Activity](../azure-monitor/essentials/activity-log.md).

    ```kusto
    AzureActivity
    | where OperationName == "Create or Update Virtual Machine" or OperationName =="Create Deployment"
    | where ActivityStatus == "Succeeded"
    | make-series dcount(ResourceId)  default=0 on EventSubmissionTimestamp in range(ago(7d), now(), 1d) by Caller
    ```

    > [!NOTE]
    > **Rule query best practices**: 
    > - The query length should be between 1 and 10,000 characters and cannot contain "`search *`" or "`union *`". You can use [user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) to overcome the query length limitation.
    >
    > - Using ADX functions to create Azure Data Explorer queries inside the Log Analytics query window **is not supported**.
    >
    > - When using the **`bag_unpack`** function in a query, if you project the columns as fields using "`project field1`" and the column doesn't exist, the query will fail. To guard against this happening, you must project the column as follows:
    >   - `project field1 = column_ifexists("field1","")`

### Alert enrichment

> [!IMPORTANT]
> The alert enrichment features are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

- Use the **Entity mapping** configuration section to map parameters from your query results to Azure Sentinel-recognized entities. Entities enrich the rules' output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow. They are also the criteria by which you can group alerts together into incidents in the **Incident settings** tab.

    Learn more about [entities in Azure Sentinel](entities-in-azure-sentinel.md).

    See [Map data fields to entities in Azure Sentinel](map-data-fields-to-entities.md) for complete entity mapping instructions, along with important information about [backward compatibility](map-data-fields-to-entities.md#notes-on-the-new-version).

- Use the **Custom details** configuration section to extract event data items from your query and surface them in the alerts produced by this rule, giving you immediate event content visibility in your alerts and incidents.

    Learn more about surfacing custom details in alerts, and see the [complete instructions](surface-custom-details-in-alerts.md).

- Use the **Alert details** configuration section to tailor the alert's presentation details to its actual content. Alert details allow you to display, for example, an attacker's IP address or account name in the title of the alert itself, so it will appear in your incidents queue, giving you a much richer and clearer picture of your threat landscape.

    See complete instructions on [customizing your alert details](customize-alert-details.md).

### Query scheduling and alert threshold

- In the **Query scheduling** section, set the following parameters:

   :::image type="content" source="media/tutorial-detect-threats-custom/set-rule-logic-tab-2.png" alt-text="Set query schedule and event grouping" lightbox="media/tutorial-detect-threats-custom/set-rule-logic-tab-all-2-new.png":::

    - Set **Run query every** to control how often the query is run - as frequently as every 5 minutes or as infrequently as once every 14 days.

    - Set **Lookup data from the last** to determine the time period of the data covered by the query - for example, it can query the past 10 minutes of data, or the past 6 hours of data. The maximum is 14 days.

        > [!NOTE]
        > **Query intervals and lookback period**
        >
        >  These two settings are independent of each other, up to a point. You can run a query at a short interval covering a time period longer than the interval (in effect having overlapping queries), but you cannot run a query at an interval that exceeds the coverage period, otherwise you will have gaps in the overall query coverage.
        >
        > **Ingestion delay**
        >
        > To account for **latency** that may occur between an event's generation at the source and its ingestion into Azure Sentinel, and to ensure complete coverage without data duplication, Azure Sentinel runs scheduled analytics rules on a **five-minute delay** from their scheduled time.
        >
        > For a detailed technical explanation of why this delay is necessary and how it solves this problem, see Ron Marsiano's excellent blog post on the subject, "[Handling ingestion delay in Azure Sentinel scheduled alert rules](https://techcommunity.microsoft.com/t5/azure-sentinel/handling-ingestion-delay-in-azure-sentinel-scheduled-alert-rules/ba-p/2052851)".

- Use the **Alert threshold** section to define the sensitivity level of the rule. For example, set **Generate alert when number of query results** to **Is greater than** and enter the number 1000 if you want the rule to generate an alert only if the query returns more than 1000 results each time it runs. This is a required field, so if you don’t want to set a threshold – that is, if you want your alert to register every event – enter 0 in the number field.

### Results simulation

In the **Results simulation** area, in the right side of the wizard, select **Test with current data** and Azure Sentinel will show you a graph of the results (log events) the query would have generated over the last 50 times it would have run, according to the currently defined schedule. If you modify the query, select **Test with current data** again to update the graph. The graph shows the number of results over the defined time period, which is determined by the settings in the **Query scheduling** section.

Here's what the results simulation might look like for the query in the screenshot above. The left side is the default view, and the right side is what you see when you hover over a point in time on the graph.

:::image type="content" source="media/tutorial-detect-threats-custom/results-simulation.png" alt-text="Results simulation screenshots":::

If you see that your query would trigger too many or too frequent alerts, you can experiment with the settings in the **Query scheduling** and **Alert threshold** [sections](#query-scheduling-and-alert-threshold) and select **Test with current data** again.

### Event grouping and rule suppression

> [!IMPORTANT]
> Event grouping is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

- Under **Event grouping**, choose one of two ways to handle the grouping of **events** into **alerts**: 

    - **Group all events into a single alert** (the default setting). The rule generates a single alert every time it runs, as long as the query returns more results than the specified **alert threshold** above. The alert includes a summary of all the events returned in the results. 

    - **Trigger an alert for each event**. The rule generates a unique alert for each event returned by the query. This is useful if you want events to be displayed individually, or if you want to group them by certain parameters - by user, hostname, or something else. You can define these parameters in the query.

        Currently the number of alerts a rule can generate is capped at 20. If in a particular rule, **Event grouping** is set to **Trigger an alert for each event**, and the rule's query returns more than 20 events, each of the first 19 events will generate a unique alert, and the 20th alert will summarize the entire set of returned events. In other words, the 20th alert is what would have been generated under the **Group all events into a single alert** option.

        If you choose this option, Azure Sentinel will add a new field, **OriginalQuery**, to the results of the query. Here is a comparison of the existing **Query** field and the new field:

        | Field name | Contains | Running the query in this field<br>results in... |
        | - | :-: | :-: |
        | **Query** | The compressed record of the event that generated this instance of the alert | The event that generated this instance of the alert |
        | **OriginalQuery** | The original query as written in the analytics&nbsp;rule | The most recent event in the timeframe in which the query runs, that fits the parameters defined by the query |
        |

        In other words, the **OriginalQuery** field behaves like the **Query** field usually behaves. The result of this extra field is that the problem described by the first item in the [Troubleshooting](#troubleshooting) section below has been solved.
 
    > [!NOTE]
    > What's the difference between **events** and **alerts**?
    >
    > - An **event** is a description of a single occurrence of an action. For example, a single entry in a log file could count as an event. In this context an event refers to a single result returned by a query in an analytics rule.
    >
    > - An **alert** is a collection of events that, taken together, are significant from a security standpoint. An alert could contain a single event if the event had significant security implications - an administrative login from a foreign country outside of office hours, for example.
    >
    > - By the way, what are **incidents**? Azure Sentinel's internal logic creates **incidents** from **alerts** or groups of alerts. The incidents queue is the focal point of SOC analysts' work - triage, investigation and remediation.
    > 
    > Azure Sentinel ingests raw events from some data sources, and already-processed alerts from others. It is important to note which one you're dealing with at any time.

- In the **Suppression** section, you can turn the **Stop running query after alert is generated** setting **On** if, once you get an alert, you want to suspend the operation of this rule for a period of time exceeding the query interval. If you turn this on, you must set **Stop running query for** to the amount of time the query should stop running, up to 24 hours.

## Configure the incident creation settings

In the **Incident Settings** tab, you can choose whether and how Azure Sentinel turns alerts into actionable incidents. If this tab is left alone, Azure Sentinel will create a single, separate incident from each and every alert. You can choose to have no incidents created, or to group several alerts into a single incident, by changing the settings in this tab.

> [!IMPORTANT]
> The incident settings tab is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For example:

:::image type="content" source="media/tutorial-detect-threats-custom/incident-settings-tab.png" alt-text="Define the incident creation and alert grouping settings":::

### Incident settings

In the **Incident settings** section, **Create incidents from alerts triggered by this analytics rule** is set by default to **Enabled**, meaning that Azure Sentinel will create a single, separate incident from each and every alert triggered by the rule.

- If you don’t want this rule to result in the creation of any incidents (for example, if this rule is just to collect information for subsequent analysis), set this to **Disabled**.

- If you want a single incident to be created from a group of alerts, instead of one for every single alert, see the next section.

### Alert grouping

In the **Alert grouping** section, if you want a single incident to be generated from a group of up to 150 similar or recurring alerts (see note), set **Group related alerts, triggered by this analytics rule, into incidents** to **Enabled**, and set the following parameters.


- **Limit the group to alerts created within the selected time frame**: Determine the time frame within which the similar or recurring alerts will be grouped together. All of the corresponding alerts within this time frame will collectively generate an incident or a set of incidents (depending on the grouping settings below). Alerts outside this time frame will generate a separate incident or set of incidents.

- **Group alerts triggered by this analytics rule into a single incident by**: Choose the basis on which alerts will be grouped together:

    | Option | Description |
    | ------- | ---------- |
    | **Group alerts into a single incident if all the entities match** | Alerts are grouped together if they share identical values for each of the mapped entities (defined in the [Set rule logic](#define-the-rule-query-logic-and-configure-settings) tab above). This is the recommended setting. |
    | **Group all alerts triggered by this rule into a single incident** | All the alerts generated by this rule are grouped together even if they share no identical values. |
    | **Group alerts into a single incident if the selected entities and details match** | Alerts are grouped together if they share identical values for all of the mapped entities, alert details, and custom details selected from the respective drop-down lists.<br><br>You might want to use this setting if, for example, you want to create separate incidents based on the source or target IP addresses, or if you want to group alerts that match a specific entity and severity.<br><br>**Note**: When you select this option, you must have at least one entity type or field selected for the rule. Otherwise, the rule validation will fail and the the rule won't be created. |
    |

- **Re-open closed matching incidents**: If an incident has been resolved and closed, and later on another alert is generated that should belong to that incident, set this setting to **Enabled** if you want the closed incident re-opened, and leave as **Disabled** if you want the alert to create a new incident.
    
    > [!NOTE]
    > **Up to 150 alerts** can be grouped into a single incident. If more than 150 alerts are generated by a rule that groups them into a single incident, a new incident will be generated with the same incident details as the original, and the excess alerts will be grouped into the new incident.

## Set automated responses and create the rule

1. In the **Automated responses** tab, you can set automation based on the alert or alerts generated by this analytics rule, or based on the incident created by the alerts.
    - For alert-based automation, select from the drop-down list under **Alert automation** any playbooks you want to run automatically when an alert is generated.
    - For incident-based automation, select or create an automation rule under **Incident automation (preview)**. You can call playbooks (those based on the **incident trigger**) from these automation rules, as well as automate triage, assignment, and closing.
    - For more information and instructions on creating playbooks and automation rules, see [Automate threat responses](tutorial-respond-threats-playbook.md#automate-threat-responses).
    - For more information about when to use the **alert trigger** or the **incident trigger**, see [Use triggers and actions in Azure Sentinel playbooks](playbook-triggers-actions.md#azure-sentinel-triggers-summary).

    :::image type="content" source="media/tutorial-detect-threats-custom/automated-response-tab.png" alt-text="Define the automated response settings":::

1. Select **Review and create** to review all the settings for your new alert rule. When the "Validation passed" message appears, select **Create** to initialize your alert rule.

    :::image type="content" source="media/tutorial-detect-threats-custom/review-and-create-tab.png" alt-text="Review all settings and create the rule":::

## View the rule and its output
  
- You can find your newly created custom rule (of type "Scheduled") in the table under the **Active rules** tab on the main **Analytics** screen. From this list you can enable, disable, or delete each rule.

- To view the results of the alert rules you create, go to the **Incidents** page, where you can triage, [investigate incidents](investigate-cases.md), and remediate the threats.

- You can update the rule query to exclude false positives. For more information, see [Handle false positives in Azure Sentinel](false-positives.md).

> [!NOTE]
> Alerts generated in Azure Sentinel are available through [Microsoft Graph Security](/graph/security-concept-overview). For more information, see the [Microsoft Graph Security alerts documentation](/graph/api/resources/security-api-overview).

## Export the rule to an ARM template

If you want to package your rule to be managed and deployed as code, you can easily [export the rule to an Azure Resource Manager (ARM) template](import-export-analytics-rules.md). You can also import rules from template files in order to view and edit them in the user interface.

## Troubleshooting

### Issue: No events appear in query results

If **event grouping** is set to **trigger an alert for each event**, then in certain scenarios, when viewing the query results at a later time (such as when pivoting back to alerts from an incident), it's possible that no query results will appear. This is because the event's connection to the alert is accomplished by the hashing of the particular event's information, and the inclusion of the hash in the query. If the query results have changed since the alert was generated, the hash will no longer be valid and no results will be displayed. 

To see the events, manually remove the line with the hash from the rule's query, and run the query.

> [!NOTE]
> This issue has been solved by the addition of a new field, **OriginalQuery**, to the results when this event grouping option is selected. See the [description](#event-grouping-and-rule-suppression) above.

### Issue: A scheduled rule failed to execute, or appears with AUTO DISABLED added to the name

It's a rare occurrence that a scheduled query rule fails to run, but it can happen. Azure Sentinel classifies failures up front as either transient or permanent, based on the specific type of the failure and the circumstances that led to it.

#### Transient failure

A transient failure occurs due to a circumstance which is temporary and will soon return to normal, at which point the rule execution will succeed. Some examples of failures that Azure Sentinel classifies as transient are:

- A rule query takes too long to run and times out.
- Connectivity issues between data sources and Log Analytics, or between Log Analytics and Azure Sentinel.
- Any other new and unknown failure is considered transient.

In the event of a transient failure, Azure Sentinel continues trying to execute the rule again after predetermined and ever-increasing intervals, up to a point. After that, the rule will run again only at its next scheduled time. A rule will never be auto-disabled due to a transient failure.

#### Permanent failure - rule auto-disabled

A permanent failure occurs due to a change in the conditions that allow the rule to run, which without human intervention will not return to their former status. The following are some examples of failures that are classified as permanent:

- The target workspace (on which the rule query operated) has been deleted.
- The target table (on which the rule query operated) has been deleted.
- Azure Sentinel had been removed from the target workspace.
- A function used by the rule query is no longer valid; it has been either modified or removed.
- Permissions to one of the data sources of the rule query were changed.
- One of the data sources of the rule query was deleted or disconnected.

**In the event of a predetermined number of consecutive permanent failures, of the same type and on the same rule,** Azure Sentinel stops trying to execute the rule, and also takes the following steps:

- Disables the rule.
- Adds the words **"AUTO DISABLED"** to the beginning of the rule's name.
- Adds the reason for the failure (and the disabling) to the rule's description.

You can easily determine the presence of any auto-disabled rules, by sorting the rule list by name. The auto-disabled rules will be at or near the top of the list.

SOC managers should be sure to check the rule list regularly for the presence of auto-disabled rules.

## Next steps

When using analytics rules to detect threats from Azure Sentinel, make sure that you enable all rules associated with your connected data sources in order to ensure full security coverage for your environment. The most efficient way to enable analytics rules is directly from the data connector page, which lists any related rules. For more information, see [Connect data sources](connect-data-sources.md).

You can also push rules to Azure Sentinel via [API](/rest/api/securityinsights/) and [PowerShell](https://www.powershellgallery.com/packages/Az.SecurityInsights/0.1.0), although doing so requires additional effort. When using API or PowerShell, you must first export the rules to JSON before enabling the rules. API or PowerShell may be helpful when enabling rules in multiple instances of Azure Sentinel with identical settings in each instance.

For more information, see:

For more information, see:

- [Tutorial: Investigate incidents with Azure Sentinel](investigate-cases.md)
- [Classify and analyze data using entities in Azure Sentinel](entities-in-azure-sentinel.md)
- [Tutorial: Use playbooks with automation rules in Azure Sentinel](tutorial-respond-threats-playbook.md)

Also, learn from an example of using custom analytics rules when [monitoring Zoom](https://techcommunity.microsoft.com/t5/azure-sentinel/monitoring-zoom-with-azure-sentinel/ba-p/1341516) with a [custom connector](create-custom-connector.md).
