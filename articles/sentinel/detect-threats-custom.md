---
title: Create custom analytics rules to detect threats with Microsoft Sentinel | Microsoft Docs
description: Learn how to create custom analytics rules to detect security threats with Microsoft Sentinel. Take advantage of event grouping, alert grouping, and alert enrichment, and understand AUTO DISABLED.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 05/28/2023
---

# Create custom analytics rules to detect threats

After [connecting your data sources](quickstart-onboard.md) to Microsoft Sentinel, create custom analytics rules to help discover threats and anomalous behaviors in your environment.

Analytics rules search for specific events or sets of events across your environment, alert you when certain event thresholds or conditions are reached, generate incidents for your SOC to triage and investigate, and respond to threats with automated tracking and remediation processes.

> [!TIP]
> When creating custom rules, use existing rules as templates or references. Using existing rules as a baseline helps by building out most of the logic before you make any needed changes.

> [!div class="checklist"]
> - Create analytics rules
> - Define how events and alerts are processed
> - Define how alerts and incidents are generated
> - Choose automated threat responses for your rules

## Create a custom analytics rule with a scheduled query

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. In the action bar at the top, select **+Create** and select **Scheduled query rule**. This opens the **Analytics rule wizard**.

    :::image type="content" source="media/tutorial-detect-threats-custom/create-scheduled-query-small.png" alt-text="Create scheduled query" lightbox="media/tutorial-detect-threats-custom/create-scheduled-query-full.png":::

### Analytics rule wizard&mdash;General tab

- Provide a unique **Name** and a **Description**.

- In the **Tactics and techniques** field, you can choose from among categories of attacks by which to classify the rule. These are based on the tactics and techniques of the [MITRE ATT&CK](https://attack.mitre.org/) framework.

    [Incidents](investigate-cases.md) created from alerts that are detected by rules mapped to MITRE ATT&CK tactics and techniques automatically inherit the rule's mapping.

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

    > [!IMPORTANT]
    >
    > We recommend that your query uses an [Advanced Security Information Model (ASIM) parser](normalization-about-parsers.md) and not a native table. This will ensure that the query supports any current or future relevant data source rather than a single data source.
    >


    > [!NOTE]
    > **Rule query best practices**:
    >
    > - The query length should be between 1 and 10,000 characters and cannot contain "`search *`" or "`union *`". You can use [user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) to overcome the query length limitation.
    >
    > - Using ADX functions to create Azure Data Explorer queries inside the Log Analytics query window **is not supported**.
    >
    > - When using the **`bag_unpack`** function in a query, if you [project the columns](/azure/data-explorer/kusto/query/projectoperator) as fields using "`project field1`" and the column doesn't exist, the query will fail. To guard against this happening, you must [project the column](/azure/data-explorer/kusto/query/projectoperator) as follows:
    >   - `project field1 = column_ifexists("field1","")`

### Alert enrichment

- Use the **Entity mapping** configuration section to map parameters from your query results to Microsoft Sentinel-recognized entities. Entities enrich the rules' output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow. They are also the criteria by which you can group alerts together into incidents in the **Incident settings** tab.

    Learn more about [entities in Microsoft Sentinel](entities.md).

    See [Map data fields to entities in Microsoft Sentinel](map-data-fields-to-entities.md) for complete entity mapping instructions, along with important information about limitations and [backward compatibility](map-data-fields-to-entities.md#notes-on-the-new-version).

- Use the **Custom details** configuration section to extract event data items from your query and surface them in the alerts produced by this rule, giving you immediate event content visibility in your alerts and incidents.

    Learn more about surfacing custom details in alerts, and see the [complete instructions](surface-custom-details-in-alerts.md).

- Use the **Alert details** configuration section to override default values of the alert's properties with details from the underlying query results. Alert details allow you to display, for example, an attacker's IP address or account name in the title of the alert itself, so it will appear in your incidents queue, giving you a much richer and clearer picture of your threat landscape.

    See complete instructions on [customizing your alert details](customize-alert-details.md).

> [!NOTE]
> **The size limit for an entire alert is *64 KB***.
> - Alerts that grow larger than 64 KB will be truncated. As entities are identified, they are added to the alert one by one until the alert size reaches 64 KB, and any remaining entities are dropped from the alert.
>
> - The other alert enrichments also contribute to the size of the alert.
>
> - To reduce the size of your alert, use the `project-away` operator in your query to [remove any unnecessary fields](/azure/data-explorer/kusto/query/projectawayoperator). (Consider also the `project` operator if there are only [a few fields you need to keep](/azure/data-explorer/kusto/query/projectoperator).)

### Query scheduling and alert threshold

- In the **Query scheduling** section, set the following parameters:

   :::image type="content" source="media/tutorial-detect-threats-custom/set-rule-logic-tab-2.png" alt-text="Set query schedule and event grouping" lightbox="media/tutorial-detect-threats-custom/set-rule-logic-tab-all-2-new.png":::

  - Set **Run query every** to control how often the query is run&mdash;as frequently as every 5 minutes or as infrequently as once every 14 days.

  - Set **Lookup data from the last** to determine the time period of the data covered by the query&mdash;for example, it can query the past 10 minutes of data, or the past 6 hours of data. The maximum is 14 days.
  
  - For the new **Start running** setting (in Preview):

      - Leave it set to **Automatically** to continue the original behavior: the rule will run for the first time immediately upon being created, and after that at the interval set in the **Run query every** setting.

      - Toggle the switch to **At specific time** if you want to determine when the rule first runs, instead of having it run immediately. Then choose the date using the calendar picker and enter the time in the format of the example shown.

        :::image type="content" source="media/tutorial-detect-threats-custom/advanced-scheduling.png" alt-text="Screenshot of advanced scheduling toggle and settings.":::
    
        Future runnings of the rule will occur at the specified interval after the first running.

    The line of text under the **Start running** setting (with the information icon at its left) summarizes the current query scheduling and lookback settings.

    > [!NOTE]
    >
    > **Query intervals and lookback period**
    >
    >  These two settings are independent of each other, up to a point. You can run a query at a short interval covering a time period longer than the interval (in effect having overlapping queries), but you cannot run a query at an interval that exceeds the coverage period, otherwise you will have gaps in the overall query coverage.
    >
    > **Ingestion delay**
    >
    > To account for **latency** that may occur between an event's generation at the source and its ingestion into Microsoft Sentinel, and to ensure complete coverage without data duplication, Microsoft Sentinel runs scheduled analytics rules on a **five-minute delay** from their scheduled time.
    >
    > For more information, see [Handle ingestion delay in scheduled analytics rules](ingestion-delay.md).

- Use the **Alert threshold** section to define the sensitivity level of the rule. For example, set **Generate alert when number of query results** to **Is greater than** and enter the number 1000 if you want the rule to generate an alert only if the query returns more than 1000 results each time it runs. This is a required field, so if you don’t want to set a threshold – that is, if you want your alert to register every event – enter 0 in the number field.

### Results simulation

In the **Results simulation** area, in the right side of the wizard, select **Test with current data** and Microsoft Sentinel will show you a graph of the results (log events) the query would have generated over the last 50 times it would have run, according to the currently defined schedule. If you modify the query, select **Test with current data** again to update the graph. The graph shows the number of results over the defined time period, which is determined by the settings in the **Query scheduling** section.

Here's what the results simulation might look like for the query in the screenshot above. The left side is the default view, and the right side is what you see when you hover over a point in time on the graph.

:::image type="content" source="media/tutorial-detect-threats-custom/results-simulation.png" alt-text="Results simulation screenshots":::

If you see that your query would trigger too many or too frequent alerts, you can experiment with the settings in the **Query scheduling** and **Alert threshold** [sections](#query-scheduling-and-alert-threshold) and select **Test with current data** again.

### Event grouping and rule suppression

- Under **Event grouping**, choose one of two ways to handle the grouping of **events** into **alerts**:

  - **Group all events into a single alert** (the default setting). The rule generates a single alert every time it runs, as long as the query returns more results than the specified **alert threshold** above. The alert includes a summary of all the events returned in the results.

  - **Trigger an alert for each event**. The rule generates a unique alert for each event returned by the query. This is useful if you want events to be displayed individually, or if you want to group them by certain parameters&mdash;by user, hostname, or something else. You can define these parameters in the query.

    Currently the number of alerts a rule can generate is capped at 150. If in a particular rule, **Event grouping** is set to **Trigger an alert for each event**, and the rule's query returns more than 150 events, each of the first 149 events will generate a unique alert, and the 150th alert will summarize the entire set of returned events. In other words, the 150th alert is what would have been generated under the **Group all events into a single alert** option.

    If you choose this option, Microsoft Sentinel will add a new field, **OriginalQuery**, to the results of the query. Here is a comparison of the existing **Query** field and the new field:

    | Field name | Contains | Running the query in this field<br>results in... |
    | - | :-: | :-: |
    | **Query** | The compressed record of the event that generated this instance of the alert | The event that generated this instance of the alert;<br>limited to 10240 bytes  |
    | **OriginalQuery** | The original query as written in the analytics&nbsp;rule | The most recent event in the timeframe in which the query runs, that fits the parameters defined by the query |

    In other words, the **OriginalQuery** field behaves like the **Query** field usually behaves. The result of this extra field is that the problem described by the first item in the [Troubleshooting](#troubleshooting) section below has been solved.

  > [!NOTE]
  > What's the difference between **events** and **alerts**?
  >
  > - An **event** is a description of a single occurrence of an action. For example, a single entry in a log file could count as an event. In this context an event refers to a single result returned by a query in an analytics rule.
  >
  > - An **alert** is a collection of events that, taken together, are significant from a security standpoint. An alert could contain a single event if the event had significant security implications - an administrative login from a foreign country/region outside of office hours, for example.
  >
  > - By the way, what are **incidents**? Microsoft Sentinel's internal logic creates **incidents** from **alerts** or groups of alerts. The incidents queue is the focal point of SOC analysts' work - triage, investigation and remediation.
  >
  > Microsoft Sentinel ingests raw events from some data sources, and already-processed alerts from others. It is important to note which one you're dealing with at any time.

- In the **Suppression** section, you can turn the **Stop running query after alert is generated** setting **On** if, once you get an alert, you want to suspend the operation of this rule for a period of time exceeding the query interval. If you turn this on, you must set **Stop running query for** to the amount of time the query should stop running, up to 24 hours.

## Configure the incident creation settings

In the **Incident Settings** tab, you can choose whether and how Microsoft Sentinel turns alerts into actionable incidents. If this tab is left alone, Microsoft Sentinel will create a single, separate incident from each and every alert. You can choose to have no incidents created, or to group several alerts into a single incident, by changing the settings in this tab.

For example:

:::image type="content" source="media/tutorial-detect-threats-custom/incident-settings-tab.png" alt-text="Define the incident creation and alert grouping settings":::

### Incident settings

In the **Incident settings** section, **Create incidents from alerts triggered by this analytics rule** is set by default to **Enabled**, meaning that Microsoft Sentinel will create a single, separate incident from each and every alert triggered by the rule.

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
    | **Group alerts into a single incident if the selected entities and details match** | Alerts are grouped together if they share identical values for all of the mapped entities, alert details, and custom details selected from the respective drop-down lists.<br><br>You might want to use this setting if, for example, you want to create separate incidents based on the source or target IP addresses, or if you want to group alerts that match a specific entity and severity.<br><br>**Note**: When you select this option, you must have at least one entity type or field selected for the rule. Otherwise, the rule validation will fail and the rule won't be created. |

- **Re-open closed matching incidents**: If an incident has been resolved and closed, and later on another alert is generated that should belong to that incident, set this setting to **Enabled** if you want the closed incident re-opened, and leave as **Disabled** if you want the alert to create a new incident.

    > [!NOTE]
    >
    > **Up to 150 alerts** can be grouped into a single incident.
    > - The incident will only be created after all the alerts have been generated. All of the alerts will be added to the incident immediately upon its creation.
    >
    > - If more than 150 alerts are generated by a rule that groups them into a single incident, a new incident will be generated with the same incident details as the original, and the excess alerts will be grouped into the new incident.

## Set automated responses and create the rule

In the **Automated responses** tab, you can use [automation rules](automate-incident-handling-with-automation-rules.md) to set automated responses to occur at any of three types of occasions:
- When an alert is generated by this analytics rule.
- When an incident is created with alerts generated by this analytics rule.
- When an incident is updated with alerts generated by this analytics rule.
   
The grid displayed under **Automation rules** shows the automation rules that already apply to this analytics rule (by virtue of it meeting the conditions defined in those rules). You can edit any of these by selecting the ellipsis at the end of each row. Or, you can [create a new automation rule](create-manage-use-automation-rules.md).

Use automation rules to perform [basic triage](investigate-incidents.md#navigate-and-triage-incidents), assignment, [workflow](incident-tasks.md), and closing of incidents. 

Automate more complex tasks and invoke responses from remote systems to remediate threats by calling playbooks from these automation rules. You can do this for incidents as well as for individual alerts.

- For more information and instructions on creating playbooks and automation rules, see [Automate threat responses](tutorial-respond-threats-playbook.md#automate-threat-responses).

- For more information about when to use the **incident created trigger**, the **incident updated trigger**, or the **alert created trigger**, see [Use triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md#microsoft-sentinel-triggers-summary).

    :::image type="content" source="media/tutorial-detect-threats-custom/automated-response-tab.png" alt-text="Define the automated response settings":::

- Under **Alert automation (classic)** at the bottom of the screen, you'll see any playbooks you've configured to run automatically when an alert is generated using the old method. 
    - **As of June 2023**, you can no longer add playbooks to this list. Playbooks already listed here will continue to run until this method is **deprecated, effective March 2026**.

    - If you still have any playbooks listed here, you should instead create an automation rule based on the **alert created trigger** and invoke the playbook from there. After you've done that, select the ellipsis at the end of the line of the playbook listed here, and select **Remove**. See [Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules](migrate-playbooks-to-automation-rules.md) for full instructions.

Select **Review and create** to review all the settings for your new analytics rule. When the "Validation passed" message appears, select **Create**.

:::image type="content" source="media/tutorial-detect-threats-custom/review-and-create-tab.png" alt-text="Review all settings and create the rule":::

## View the rule and its output
  
- You can find your newly created custom rule (of type "Scheduled") in the table under the **Active rules** tab on the main **Analytics** screen. From this list you can enable, disable, or delete each rule.

- To view the results of the analytics rules you create, go to the **Incidents** page, where you can triage incidents, [investigate them](investigate-cases.md), and [remediate the threats](respond-threats-during-investigation.md).

- You can update the rule query to exclude false positives. For more information, see [Handle false positives in Microsoft Sentinel](false-positives.md).

> [!NOTE]
> Alerts generated in Microsoft Sentinel are available through [Microsoft Graph Security](/graph/security-concept-overview). For more information, see the [Microsoft Graph Security alerts documentation](/graph/api/resources/security-api-overview).

## Export the rule to an ARM template

If you want to package your rule to be managed and deployed as code, you can easily [export the rule to an Azure Resource Manager (ARM) template](import-export-analytics-rules.md). You can also import rules from template files in order to view and edit them in the user interface.

## Troubleshooting

### Issue: No events appear in query results

When **event grouping** is set to **trigger an alert for each event**, query results viewed at a later time may appear to be missing, or different than expected.  For example, you might view a query's results at a later time when you've pivoted back to the results from a related incident.

- Results are automatically saved with the alerts. However, if the results are too large, no results are saved, and then no data will appear when viewing the query results again.
- In cases where there is [ingestion delay](ingestion-delay.md), or the query is not deterministic due to aggregation, the alert's result might be different than the result shown by running the query manually.

> [!NOTE]
> This issue has been solved by the addition of a new field, **OriginalQuery**, to the results when this event grouping option is selected. See the [description](#event-grouping-and-rule-suppression) above.

### Issue: A scheduled rule failed to execute, or appears with AUTO DISABLED added to the name

It's a rare occurrence that a scheduled query rule fails to run, but it can happen. Microsoft Sentinel classifies failures up front as either transient or permanent, based on the specific type of the failure and the circumstances that led to it.

#### Transient failure

A transient failure occurs due to a circumstance which is temporary and will soon return to normal, at which point the rule execution will succeed. Some examples of failures that Microsoft Sentinel classifies as transient are:

- A rule query takes too long to run and times out.
- Connectivity issues between data sources and Log Analytics, or between Log Analytics and Microsoft Sentinel.
- Any other new and unknown failure is considered transient.

In the event of a transient failure, Microsoft Sentinel continues trying to execute the rule again after predetermined and ever-increasing intervals, up to a point. After that, the rule will run again only at its next scheduled time. A rule will never be auto-disabled due to a transient failure.

#### Permanent failure - rule auto-disabled

A permanent failure occurs due to a change in the conditions that allow the rule to run, which without human intervention will not return to their former status. The following are some examples of failures that are classified as permanent:

- The target workspace (on which the rule query operated) has been deleted.
- The target table (on which the rule query operated) has been deleted.
- Microsoft Sentinel had been removed from the target workspace.
- A function used by the rule query is no longer valid; it has been either modified or removed.
- Permissions to one of the data sources of the rule query were changed ([see example below](#permanent-failure-due-to-lost-access-across-subscriptionstenants)).
- One of the data sources of the rule query was deleted.

**In the event of a predetermined number of consecutive permanent failures, of the same type and on the same rule,** Microsoft Sentinel stops trying to execute the rule, and also takes the following steps:

- Disables the rule.
- Adds the words **"AUTO DISABLED"** to the beginning of the rule's name.
- Adds the reason for the failure (and the disabling) to the rule's description.

You can easily determine the presence of any auto-disabled rules, by sorting the rule list by name. The auto-disabled rules will be at or near the top of the list.

SOC managers should be sure to check the rule list regularly for the presence of auto-disabled rules.

#### Permanent failure due to resource drain

Another kind of permanent failure occurs due to an **improperly built query** that causes the rule to consume **excessive computing resources** and risks being a performance drain on your systems. When Microsoft Sentinel identifies such a rule, it takes the same three steps mentioned above for the other permanent failures&mdash;disables the rule, prepends **"AUTO DISABLED"** to the rule name, and adds the reason for the failure to the description.

To re-enable the rule, you must address the issues in the query that cause it to use too many resources. See the following articles for best practices to optimize your Kusto queries:

- [Query best practices - Azure Data Explorer](/azure/data-explorer/kusto/query/best-practices)
- [Optimize log queries in Azure Monitor](../azure-monitor/logs/query-optimization.md)

Also see [Useful resources for working with Kusto Query Language in Microsoft Sentinel](kusto-resources.md) for further assistance.

#### Permanent failure due to lost access across subscriptions/tenants

One particular example of when a permanent failure could occur due to a permissions change on a data source ([see list above](#permanent-failure---rule-auto-disabled)) concerns the case of an MSSP&mdash;or any other scenario where analytics rules query across subscriptions or tenants.

When you create an analytics rule, an access permissions token is applied to the rule and saved along with it. This token ensures that the rule can access the workspace that contains the data queried by the rule, and that this access will be maintained even if the rule's creator loses access to that workspace.

There is one exception to this, however: when a rule is created to access workspaces in other subscriptions or tenants, such as what happens in the case of an MSSP, Microsoft Sentinel takes extra security measures to prevent unauthorized access to customer data. For these kinds of rules, the credentials of the user that created the rule are applied to the rule instead of an independent access token, so that when the user no longer has access to the other tenant, the rule will stop working.

If you operate Microsoft Sentinel in a cross-subscription or cross-tenant scenario, be aware that if one of your analysts or engineers loses access to a particular workspace, any rules created by that user will stop working. You will get a health monitoring message regarding "insufficient access to resource", and the rule will be [auto-disabled according to the procedure described above](#permanent-failure---rule-auto-disabled).

## Next steps

When using analytics rules to detect threats from Microsoft Sentinel, make sure you enable all rules associated with your connected data sources to ensure full security coverage for your environment.

To automate rule enablement, push rules to Microsoft Sentinel via [API](/rest/api/securityinsights/) and [PowerShell](https://www.powershellgallery.com/packages/Az.SecurityInsights/0.1.0), although doing so requires additional effort. When using API or PowerShell, you must first export the rules to JSON before enabling the rules. API or PowerShell may be helpful when enabling rules in multiple instances of Microsoft Sentinel with identical settings in each instance.

For more information, see:

- [Tutorial: Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Navigate and investigate incidents in Microsoft Sentinel - Preview](investigate-incidents.md)
- [Classify and analyze data using entities in Microsoft Sentinel](entities.md)
- [Tutorial: Use playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md)

Also, learn from an example of using custom analytics rules when [monitoring Zoom](https://techcommunity.microsoft.com/t5/azure-sentinel/monitoring-zoom-with-azure-sentinel/ba-p/1341516) with a [custom connector](create-custom-connector.md).
