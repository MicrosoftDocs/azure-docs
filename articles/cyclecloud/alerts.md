---
title: Azure CycleCloud Alerts and Notifications | Microsoft Docs
description: View or customize alerts and notifications within Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Alerting

Azure CycleCloud can send notifications when various conditions are met on a monitored resource or
in CycleCloud itself. These notifications may be viewed in the web interface and optionally may
be emailed to one or more recipients.

## Viewing Notifications

Any user may view recent notifications by clicking the envelope icon in the upper right­hand corner
of the screen. Selecting a notification will display its full subject and body. Each of these
notifications has a priority level. From low to high, these are:

* **Info**: for informational purposes only. No action is necessary.
* **Warn**: indicates a possible issue. Further investigation may be warranted.
* **Error**: indicates a likely problem. Action may be needed to resolve this.

## Customizing Alerts

Administrators can view, create or modify alerts by going to the alert configuration page. This
page may be reached by selecting **Alerting** from the user menu in the upper right­-hand corner
of the screen.

On the left­-hand side of the screen there is a list of named alerting rules (e.g. "Hosts Not
Responding", "Jobs in Error State"). To view or edit one of these rules, simply select it in the list. At the bottom of the list are icons to create, delete, or duplicate these rules.

Alerting rules come in two forms: query­-based rules and plugin­-based rules. Query­-based rules
are generic alerting rules which may be created and edited through the web interface.
Plugin-­based rules use CycleCloud's plugin architecture to allow alerts which are not easily
generated through a SQL­-style query. Plugin­-based rules may support different levels of
customization depending on the plugin.

After making changes to a rule, be sure to click the **Apply** button in the lower right­hand corner
to save your changes.

## Common Rule Configuration Options

Query and Plugin alerts have several customization options. These options
are displayed at the top of the rule form:

* Enable this rule: If checked, this rule will generate notifications. Otherwise no notifications are generated and no emails are sent.
* Send alert emails to: One or more email addresses to receive notifications. For multiple addresses, separate each address with a comma. Note that this requires SMTP to be configured in CycleCloud.
* Priority: The relative priority of this message. See above for descriptions of these priorities.

## Query­-Based Alerting Rules

Query­-based rules are the most common type, and are highly customizable. Queries are written using CycleCloud's SQL­-like query language.

Queries are run every 5 minutes, or when the **Run Now** button is clicked at the bottom of the
rule editing form. If a query returns one or more results, a notification will be generated. For
most queries, this can result in messages being sent every 5 minutes until no results are
returned. To limit the number of messages sent, there is an option to **Generate messages only
when the result count changes**. If this box is checked, each time the query runs the number of
results will be checked against the previous result count. If the numbers match, no notification
will be generated.

When editing a query­-based rule, there are two major steps: generating the query and creating
the message template.

## Generating a Query

The first step in generating a query is to select the record type via the dropdown that reads
"Query from ____ records". This is the equivalent of the FROM clause in the query language.
For example, to create an alert on CycleCloud instances, select "Cloud.Instance (Cloud
Instance)" from the menu.

The next step is to determine which attributes on each record are needed to generate the final notification. To do this, edit the top­-half of the query and add a comma­-separated list of attribute names after the word "SELECT". For example, the following will allow an instance notification to contain region and instance id: "SELECT Region, InstanceId".

To complete the query, determine the condition(s) which should trigger the notification and fill in
the "WHERE" clause with a filter expression. Below are some examples of various instance
filters. See the datastore query language documentation for more information on how to write
filter expressions.

Example 1: Alert on instances running outside of the "us­east­" region

``` Query
WHERE !startswith("us­east", Region)
```

Example 2: Alert on execute nodes in the "example" cluster which were running for less
than 1 hour

``` Query
WHERE ClusterName === "example" && SessionUpTime < `1h` && startswith("execute", NodeName) && MachineState === “Terminated”
```

> [!NOTE]
> When writing a query for the first time, it can be helpful to use the `cycle_server execute` command to > test out various queries. Switch to the CycleCloud installation directory and run `./cycle_server execute <query>` to view instant results. For example: `./cycle_server execute 'SELECT Region, InstanceId FROM Cloud.Instance WHERE !startswith("us­east", Region)`

## Creating a Message Template

Now that the query is finished, create a subject and body for the notification
message. The subject is plain text while the body is HTML. Both the subject and body use a
templating language to inject query results into the content.

In the templating language, expressions are surrounded by `{%= %}` symbols. The results of the
query are stored in a context variable called "Results" which is a list of records. For example,
`{%= Results %}` would print out the full list of query results, and `{%= size(Results) }` would print
out the number of records in the list.

The most common way to format a notification is to print out the number of results in the subject
and loop over the result set in the body, printing out details of each record. Below is an example
of a message subject and body for reporting on instances running outside of the 'us­east'
regions:

``` EmailTemplate
Subject:
{%= size(Results) %} instances found running outside of us­east

Body:
<h2>The following instances are running outside of us­east:</h2>
<ul>
{% for Instance in Results %}
<li>{%= Instance.InstanceId %} is running in {%= Instance.Region %}</li>
{% endfor %}
</ul>
```

## Email Configuration and Logging Levels

Logging in CycleCloud can be configured to output different levels of detail. The available levels are:

* Debug
* Info
* Warning
* Error

By default, CycleCloud includes all log messages. However, if less
detail is desired, the level of logging can be adjusted. To do this,
change the value of the **Logging Level** CycleCloud system setting to
either *INFO* or *WARN*, or *ERROR*.

Additionally, CycleCloud can be configured to email a user or group
of users when errors occur. It must be configured with a mail server
as well as the addresses to send to and the from. The following system
settings control these values:

| System Setting       | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| mail.host            | The SMTP host used to send email.                                  |
| monitor.notify_to    | The comma-separated email addresses the notifications are sent to. |
| monitor.notify_from  | The email address the notifications are sent from.                 |
