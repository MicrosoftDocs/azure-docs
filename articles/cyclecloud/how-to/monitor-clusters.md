---
title: How to Monitor CycleCloud clusters
description: Customize alerts and notifications to help monitor Azure CycleCloud clusters. An event log can be used to analyze CycleCloud activity. Review logging levels.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Monitoring CycleCloud clusters

You can monitor CycleCloud clusters by customizing alerts and notifications. You can also use an event log to analyze all CycleCloud activity.

## Event logging

You can find a log of all Azure CycleCloud activity in the **Event Log** in the sidebar:

![Event Log](~/articles/cyclecloud/images/event-log.png)

You can search the log for a specific event or keyword with the search bar in the upper right corner. You can also change the log to show information based on three parameters:

* Event type
* Priority
* Time frame

Use the drop down menus to select the event log parameters. The page automatically refreshes to show the appropriate information. 

::: moniker range="=cyclecloud-7"
## Alerting

Azure CycleCloud sends notifications when various conditions are met on a monitored resource or in CycleCloud itself. You can view these notifications in the web interface and optionally email them to one or more recipients.

### Viewing Notifications

Any user can view recent notifications by selecting the envelope icon in the upper right corner of the screen. When you select a notification, you see its full subject and body. Each notification has a priority level. From low to high, these levels are:

* **Info**: for informational purposes only. No action is necessary.
* **Warn**: indicates a possible issue. Further investigation might be needed.
* **Error**: indicates a likely problem. Action might be needed to resolve this issue.

### Customizing alerts

Administrators can view, create, or modify alerts on the alert configuration page. Select **Alerting** from the user menu in the upper right corner of the screen to go to this page.

On the left side of the screen, you see a list of named alerting rules, such as **Hosts Not Responding** and **Jobs in Error State**. To view or edit one of these rules, select it in the list. At the bottom of the list, you see icons to create, delete, or duplicate these rules.

Alerting rules come in two forms: query­-based rules and plugin­-based rules. You can create and edit query­-based rules through the web interface. These rules are generic alerting rules. Plugin­-based rules use CycleCloud's plugin architecture to allow alerts that aren't easily generated through a SQL­-style query. Depending on the plugin, plugin­-based rules might support different levels of customization.

When you finish making changes to a rule, select **Apply** in the lower right corner to save your changes.

### Common rule configuration options

Query and plugin alerts have several customization options. The rule form displays these options at the top of the form:

* **Enable this rule**: If checked, this rule generates notifications. Otherwise, no notifications are generated and no emails are sent.
* **Send alert emails to**: One or more email addresses to receive notifications. For multiple addresses, separate each address with a comma. Note that this setting requires SMTP to be configured in CycleCloud.
* **Priority**: The relative priority of this message. See the preceding section for descriptions of these priorities.

### Query­-Based Alerting Rules

Query­-based rules are the most common type, and you can customize them extensively. You write queries using CycleCloud's SQL­-like query language.

Queries run every five minutes, or when you select **Run Now** at the bottom of the rule editing form. If a query returns one or more results, the system generates a notification. For most queries, this setup can result in messages being sent every five minutes until the query returns no results. To limit the number of messages sent, select the option to **Generate messages only when the result count changes**. When you select this option, each time the query runs, it checks the number of results against the previous result count. If the numbers match, the system doesn't generate a notification.

When you edit a query­-based rule, complete two major steps: generating the query and creating the message template.

#### Generating a query

The first step in generating a query is to select the record type via the dropdown that reads **Query from ____ records**. This step corresponds to the FROM clause in the query language. For example, to create an alert on CycleCloud instances, select **Cloud.Instance (Cloud Instance)** from the menu.

The next step is to determine which attributes on each record you need to generate the final notification. To do this step, edit the top half of the query and add a comma-separated list of attribute names after the `SELECT`. For example, the following query allows an instance notification to contain region and instance ID: `SELECT Region, InstanceId`.

To complete the query, determine the conditions that should trigger the notification and fill in the `WHERE` clause with a filter expression. The following examples show various instance filters. For more information about how to write filter expressions, see the datastore query language documentation.

Alert on instances running outside of the **eastus** region

``` Query
WHERE !startswith("eastus", Region)
```

Alert on execute nodes in the **example** cluster that run for less than 1 hour

``` Query
WHERE ClusterName === "example" && SessionUpTime < `1h` && startswith("execute", NodeName) && MachineState === “Terminated”
```

> [!NOTE]
> When you write a query for the first time, use the `cycle_server execute` command to test various queries. Switch to the CycleCloud installation directory and run `./cycle_server execute <query>` to view the results. For example: `./cycle_server execute 'SELECT Region, InstanceId FROM Cloud.Instance WHERE !startswith("eastus", Region)`

#### Creating a message template

Now that you finish the query, create a subject and body for the notification message. The subject is plain text, while the body is HTML. Both the subject and body use a templating language to inject query results into the content.

In the templating language, expressions are surrounded by `{%= %}` symbols. The results of the query are stored in a context variable called `Results`, which is a list of records. For example, `{%= Results %}` prints out the full list of query results, and `{%= size(Results) }` prints out the number of records in the list.

The most common way to format a notification is to include the number of results in the subject and loop over the result set in the body, printing out details of each record. The following example shows a message subject and body for reporting on instances running outside of the `eastus` regions:

``` EmailTemplate
Subject:
{%= size(Results) %} instances found running outside of us­east

Body:
<h2>The following instances are running outside of eastus:</h2>
<ul>
{% for Instance in Results %}
<li>{%= Instance.InstanceId %} is running in {%= Instance.Region %}</li>
{% endfor %}
</ul>
```
::: moniker-end

## Email configuration and logging levels

You can configure logging in CycleCloud to output different levels of detail. The available levels are:

* Debug
* Info
* Warning
* Error

By default, CycleCloud includes all log messages. However, you can adjust the level of logging if you want less detail. Change the value of the **Logging Level** system setting to `INFO`, `WARN`, or `ERROR`.

You can also configure CycleCloud to email a user or group of users when errors occur. You must provide a mail server, the addresses to send to, and the from address. The following system settings control these values:

| System Setting       | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| mail.host            | The SMTP host used to send email.                                  |
| monitor.notify_to    | The comma-separated email addresses the notifications are sent to. |
| monitor.notify_from  | The email address you want to send notifications from.                 |

