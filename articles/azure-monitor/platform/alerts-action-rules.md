---
title: Action rules for Azure Monitor alerts
description: Understanding what action rules are, and how to configure and manage them.
author: anantr
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: anantr
ms.component: alerts
---

# Action rules (preview)

This article describes what action rules are, and how to configure and manage them.

## What are action rules?

Action rules allow you to define actions (or suppression of actions) at any Resource Manager scope (Subscription, Resource Group or Resource), with a wide variety of filters that allow you to easily narrow down on the specific subset of alert instances that you want to act on. With action rules you can now do the following:

* Suppress actions and notifications if you have planned maintenance windows or for the weekend/holidays, instead of having to disable each alert rule individually.
* Define actions and notifications at scale: Instead of having to define an action group individually for each alert rule, you can now define an action group to trigger for alerts generated at any scope. For example, I can choose to have action group 'ContosoActionGroup' trigger for every alert generated within my subscription.

Action rules work by decoupling the triggering of actions and notifications from the underlying alert rule, thereby allowing for flexibility and control over how the actions are actually triggered for your alert instances at scale.

## How do you configure an action rule?

You can access the feature by selecting **Manage actions** from the Alerts landing page in Azure Monitor. Then select **Action Rules (Preview)**. You can also go there directly by selectiing **Action Rules (preview)**  from the dashboard of the landing page for Alerts.

![Action rules from the Azure Monitor landing page](media/alerts-action-rules/action-rules-landing-page.png)

Select **+ New Action Rule**. 

![Add new action rule](media/alerts-action-rules/action-rules-new-rule.png)

You should now see the action rule creation flow open. You have to configuire the following elements. 

![New action rule creation flow](media/alerts-action-rules/action-rules-new-rule-creation-flow.png)

### Scope

First choose the scope, i.e. target resource or resource group or subscription. You also have the ability to multi-select a combination of any of the above (within a single subscription). 

![Action rule scope](media/alerts-action-rules/action-rules-new-rule-creation-flow-scope.png)

### Filter criteria

You can additionally define filter(s) to further narrow down to a specific subset of the alerts on the defined scope. The available filters are: 

* **Severity**: Select one or more alert severities. Severity = Sev1 means that the action rule is applicable for all alerts with severity as Sev1.
* **Monitor Service**: Filter based on the originating monitoring service. This is also multi-select. E.g. Monitor Service = “Application Insights” means that the action rule is applicable for all “Application Insights” based alerts.
* **Resource Type**: Filter based on a specific resource type. This is also multi-select. For e.g. Resource Type = “Virtual Machines” means that the action rule is applicable for all Virtual Machines.
* **Alert Rule ID**: Allows you to filter for specific alert rules using the Resource Manager ID of the alert rule.
* **Monitor Condition**: Filter for alert instances with either "Fired" or "Resolved" as the monitor condition.
* **Description**: Regex matching within the description defined as part of the alert rule.
* **Alert context (payload)**: RegEx matching within the [alert context](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-common-schema-definitions#alert-context-fields) fields of an alert instance.

These filters are applied in conjunction to one another. For example, if I set 'Resource type' = 'Virtual Machines' and 'Severity' = 'Sev0', then I have filtered for all 'Sev0' alerts on my VMs. 

![Action rule filters](media/alerts-action-rules/action-rules-new-rule-creation-flow-filters.png)

### Scope suppression or action group configuration

Next configure the action rule for either alert suppression or action group support. You cannot choose both. The configuration acts on all alert instances matching the previously defined scope and filters.

#### Suppression

If you select **suppression**, configure the duration for the suppression of actions and notifications. Choose one of the following:
* 'From now (always)': Suppresses all notifications indefinitely.
* 'At a scheduled time': Suppress notifications within a bounded duration.
* 'With a recurrence': Suppress on a recurrence schedule, which can be daily, weekly or monthly.

![Action rule suppression](media/alerts-action-rules/action-rules-new-rule-creation-flow-suppression.png)

#### Action group

If you select **Action group** in the toggle, either add an existing action group or create a new one. 

> [!NOTE]
> You can associate only one action group with an action rule.

![Action rule action group](media/alerts-action-rules/action-rules-new-rule-creation-flow-action-group.png)

### Action rule details

Lastly, configure the following details for the action rule
* Name
* Resource Group in which it will be saved
* Description 

## Example scenarios

**Scenario 1:** Contoso wants to suppress notifications for all Sev4 alerts on all VMs within their subscription 'ContosoSub' every weekend.

**Solution:** Create an action rule with
* Scope = 'ContosoSub'
* Filters
    * Severity = 'Sev4'
    * Resource Type = 'Virtual Machines'
* Suppression with recurrence set to weekly, and 'Saturday' and 'Sunday' checked

**Scenario 2:** Contoso wants to suppress notifications for all log alerts generated for 'Computer-01' in 'ContosoSub' indefinitely as it's going through maintenance.

**Solution:** Create an action rule with
* Scope = 'ContosoSub'
* Filters
    * Monitor Service = 'Log Analytics'
    * Alert Context (payload) contains 'Computer-01'
* Suppression set to 'From now (Always)'

> [!Note]
> Log alerts created with the ['number of results'](https://docs.microsoft.com/azure-monitor/platform/alerts-unified-log) option generate **a single alert instance** with the entirety of the search results (which could be across multiple computers for example). If an action rule uses the 'Alert Context (payload)' filter, it will act on the alert instance as long as there is a match. 
> In scenario 2 described above, if the search results for the log alert generated contains both 'Computer-01' and 'Computer-02', the entire notification is suppressed (there is no notification generated for 'Computer-02' at all). To best leverage log alerts with action rules, we advise you to create log alerts with the ['metric measurement'](https://docs.microsoft.com/azure-monitor/platform/alerts-unified-log) option. With that option enabled, separate alert instances are generated based on the Group Field defined. If the log alert in scenario 2 is instead created with the metric measurement option, separate alert instances are generated for 'Computer-01' and 'Computer-02'. Then the action rule would only suppress the notification for 'Computer-01' while the notification for 'Computer-02' would continue to fire as normal.

**Scenario 3:** Contoso has defined [a metric alert at a subscription level](https://docs.microsoft.comazure/azure-monitor/platform/alerts-metric-overview#monitoring-at-scale-using-metric-alerts-in-azure-monitor), but wants to define the actions that trigger for alerts separately for their resource group 'ContosoRG'.

**Solution:** Create an action rule with
* Scope = 'ContosoRG'
* No filters
* Action Group set to 'ContosoActionGroup'

## Managing your action rules

You can view and manage your action rules from the list view as shown below.

![Action rules list view](media/alerts-action-rules/action-rules-list-view.png)

From here, you can enable/disable/delete action rules at scale by selecting the checkbox next to them. Clicking on any action rule opens up its configuration page, allowing you to update its definition and enable/disable it.
