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

Action rules allow you to define actions (or the suppression of actions) at any ARM scope (Subscription, Resource Group or Resource ), with a wide variety of filters that allow you to easily narrow down on the specific subset of alert instances that you want it to act on. With action rules you can now do the following:

* Suppress actions and notifications if you have planned maintenance windows or for the weekend/holidays, instead of having to disable each alert rule individually.
* Define actions and notifications at scale: Instead of having to define an action group individually for each alert rule, you can now define an action group to trigger for alerts generated at any scope. For e.g. I can choose to have action group 'ContosoActionGroup' trigger for every alert generated within my subscription.

Action rules work by decoupling the triggering of actions and notifications from the underlying alert rule, thereby allowing for flexibility and control over how the actions are actually triggered for your alert instances at scale.

## Configuring an action rule

You can access the feature by selecting ‘Manage actions’ from the landing page for Alerts in Azure Monitor, and subsequently selecting ‘Action Rules (Preview)’. Else, you can go directly to the feature by selection the ‘Action Rules (preview)’ that’s present on the dashboard of the landing page for Alerts.

![Action rules from the Azure Monitor landing page](media/alerts-action-rules/action-rules-landing-page.png)

Select ‘+ New Action Rule’ to create a new action rule.

![Add new action rule](media/alerts-action-rules/action-rules-new-rule.png)

Alternatively, you can also choose to create an action rule while configuring an alert rule.

![Add new action rule](media/alerts-action-rules/action-rules-alert-rule.png)

You should now see the action rule creation flow open, and the following elements have to be configured.

![New action rule creation flow](media/alerts-action-rules/action-rules-new-rule-creation-flow.png)

### Scope

The first step is to choose the scope, i.e. target resource or resource group or subscription. You also have the ability to multi-select and select a combination of any of the above (within a single subscription). 

![Action rule scope](media/alerts-action-rules/action-rules-new-rule-creation-flow-scope.png)

### Filter criteria

You can additionally define filter(s) to further narrow down to a specific subset of the alerts on the defined scope. The available filters are: 

* **Severity**: You can select one or more alert severities. E.g. Severity = Sev1 means that the action rule is applicable for all alerts with severity as Sev1.
* **Monitor Service**: You can filter based on the originating monitoring service. This is also multi-select. E.g. Monitor Service = “Application Insights” means that the action rule is applicable for all “Application Insights” based alerts.
* **Resource Type**: You can filter based on a specific resource type. This is also multi-select. For e.g. Resource Type = “Virtual Machines” means that the action rule is applicable for all Virtual Machines.
* **Alert Rule ID**: Allows you to filter for specific alert rules using the ARM ID of the alert rule.
* **Monitor Condition**: You can filter for alert instances with either "Fired" or "Resolved" as the monitor condition.
* **Description**: Regex matching within the description defined as part of the alert rule.
* **Alert context (payload)**: RegEx matching within the [alert context](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-common-schema-definitions#alert-context-fields) fields of an alert instance.

These filters are applied in conjunction to one another. For example, if I set 'Resource type' = 'Virtual Machines' and 'Severity' = 'Sev0', then I have filtered for all 'Sev0' alerts on my VMs. 

![Action rule filters](media/alerts-action-rules/action-rules-new-rule-creation-flow-filters.png)

### Suppression/Action group configuration

The next step is to configure the action rule for either suppression or for action group support. This configuration acts on all alert instances matching the previously defined scope and filters.

> [!NOTE]
> You can set either define suppression or an action group, but not both.

#### Suppression

Once you select suppression in the toggle, the next step is to configure the duration for the suppression of actions and notifications. This can be one of the following:
* 'From now (always)': This suppresses all notifications indefinitely.
* 'At a scheduled time': This allows you to suppress notifications within a bounded duration.
* 'With a recurrence': This allows setting up suppression with a recurrence, which can be daily, weekly or monthly.

![Action rule suppression](media/alerts-action-rules/action-rules-new-rule-creation-flow-suppression.png)

#### Action group

Once you select “Action group” in the toggle, either add an existing action group or create a new one. 

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

**Scenario 3:** Contoso has defined [a metric alert on a subscription](https://docs.microsoft.comazure/azure-monitor/platform/alerts-metric-overview#monitoring-at-scale-using-metric-alerts-in-azure-monitor), but wants to define the actions that trigger for alerts separately for their resource group 'ContosoRG'.

**Solution:** Create an action rule with
* Scope = 'ContosoRG'
* No filters
* Action Group set to 'ContosoActionGroup'

## Managing your action rules

You can view and manage your action rules from the list view as shown below.

![Action rules list view](media/alerts-action-rules/action-rules-list-view.png)

From here, you can enable/disable/delete action rules at scale by selecting the checkbox next to them. Clicking on any action rule opens up its configuration page, allowing you to update its definition and enable/disable it.

## Best practices

Log alerts created with the ['number of results'](https://docs.microsoft.com/azure-monitor/platform/alerts-unified-log) option generate **a single alert instance** with the entirety of the search results (which could be across multiple computers for example). In this scenario, if an action rule uses the 'Alert Context (payload)' filter, it will act on the alert instance as long as there is a match. In scenario 2 as described above, if the search results for the log alert generated contains both 'Computer-01' and 'Computer-02', the entire notification is suppressed (there is no notification generated for 'Computer-02' at all).

![Action rules and log alerts (number of results)](media/alerts-action-rules/action-rules-log-alert-number-of-results.png)

To best leverage log alerts with action rules, it is advised to create log alerts with the ['metric measurement'](https://docs.microsoft.com/azure-monitor/platform/alerts-unified-log) option. In this scenario, separate alert instances are generated based on the Group Field defined. In scenario 2 as described above, if the log alert is created with the metric measurement option, separate alert instances are generated for 'Computer-01' and 'Computer-02'. With the action rule described in the scenario, only the notification for 'Computer-01' would be suppressed while the notification for 'Computer-02' will continue to fire as normal.

![Action rules and log alerts (number of results)](media/alerts-action-rules/action-rules-log-alert-metric-measurement.png)

## FAQ

* Q. While configuring an action rule, I would like to see all the possible overlapping action rules so that I avoid duplicate notifications. Is it possible to do so?

    A. Once you define a scope while configuring an action rule, you can see a list of action rules which overlap on the same scope (if any). This overlap could either be one of the following:
    * An exact match: For example, the action rule you are defining and the overlapping action rule are on the same subscription.
    * A subset: For example, the action rule you are defining is on a subscription, and the overlapping action rule is on a resource group within the subscription.
    * A superset: For example, the action rule you are defining is on a resource group, and the overlapping action rule is on the subscription that contains the resource group.
    * An intersection: For example, the action rule you are defining is on 'VM1' and 'VM2', and the overlapping action rule is on 'VM2' and 'VM3'.

    ![Overlapping action rules](media/alerts-action-rules/action-rules-overlapping.png)

* Q. While configuring an alert rule, is it possible to know if there are already action rules defined that might act on the alert rule I am defining?

    A. Once you define the target resource for your alert rule, you can see the list of action rules which act on the same scope (if any) by clicking on 'View configured actions' under the 'Actions' section. This list is populated based on following scenarios for the scope:
    * An exact match: For example, the alert rule you are defining and the  action rule are on the same subscription.
    * A subset: For example, the alert rule you are defining is on a subscription, and the action rule is on a resource group within the subscription.
    * A superset: For example, the alert rule you are defining is on a resource group, and the action rule is on the subscription that contains the resource group.
    * An intersection: For example, the alert rule you are defining is on 'VM1' and 'VM2', and the action rule is on 'VM2' and 'VM3'.
    


    ![Overlapping action rules](media/alerts-action-rules/action-rules-alert-rule-overlapping.png)

* Q. Can I see the alerts that have been suppressed by an action rule?

    A. In the [alerts list page](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-managing-alert-instances), there is an additional column that can be chosen called 'Suppression Status'. If the notification for an alert instance was suppressed, it would show so in the list.

    ![Suppressed alert instances](media/alerts-action-rules/action-rules-suppressed-alerts.png)

* Q. If there's an action rule with an action group and another with suppression active on the same scope, what happens?

    A. **Suppression always takes precedence on the same scope**.

* Q. If I have an action rule 'AR1' defined for 'VM1' and 'VM2' with action group 'AG1' and action rule 'AR2' defined for 'VM2' and 'VM3' with action group 'AG1', what happens?

    A. For every alert on 'VM1' and 'VM3', action group 'AG1' would be triggered once. For every alert on 'VM2', action group 'AG1' would be triggered twice (**action rules do not de-duplicate actions**). 

* Q. If I have an action rule 'AR1' defined for 'VM1' and 'VM2' with action group 'AG1' and action rule 'AR2' defined for 'VM2' and 'VM3' with suppression, what happens?

    A. For every alert on 'VM1', action group 'AG1' would be triggered once. Actions and notifications for every alert on 'VM2' and 'VM3' will be suppressed. 

* Q. If I have an action rule 'AR1' defined for 'VM1' with action group 'AG1', and alert rule 'rule1' on 'VM1' with action group 'AG2', what happens?

    A. For every alert on 'VM1', action group 'AG1' would be triggered once. Whenever alert rule 'rule1' is triggered, it will also trigger 'AG2' additionally. (**action groups defined within action rules and alert rules operate independently, with no de-duplication**) 

## Next steps

- [Learn more about alerts in Azure](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-overview)