---
title: Add advanced conditions to Microsoft Sentinel automation rules
description: This article explains how to add complex, advanced "Or" conditions to automation rules in Microsoft Sentinel, for more effective triage of incidents.
author: yelevin
ms.topic: how-to
ms.date: 09/13/2022
ms.author: yelevin
---

# Add advanced conditions to Microsoft Sentinel automation rules

This article explains how to add complex, advanced "Or" conditions to automation rules in Microsoft Sentinel, for more effective triage of incidents.

Add "Or" conditions in the form of *condition groups* in the Conditions section of your automation rule.

## Add a condition group

Since condition groups offer a lot more power and flexibility in creating automation rules, the best way to explain how to do this is by presenting some examples.

Let's create a rule that will change the severity of an incoming incident from whatever it is to High, assuming it meets the conditions we'll set.

See the general instructions for [creating an automation rule](create-manage-use-automation-rules.md).

1. Give the rule a name: "Triage: Change Severity to High"

1. Select the trigger **When incident is created**.

1. Leave the **Analytics rule** condition as is.

### Example 1: simple conditions

In this first example, we'll create a simple condition group: If either condition A **or** condition B is true, the rule will run.

1. Select the **+ Add** expander and choose **Condition group (Or) (Preview)** from the drop-down list.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-condition-group.png" alt-text="Screenshot of adding a condition group to an automation rule's condition set.":::

1. See that two sets of condition fields are displayed, separated by an `OR` operator. These are the "A" and "B" conditions we mentioned in our formulation: If A or B is true, the rule will run.  
    (Don't be confused by all the different layers of "Add" links - these will all be explained.)

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/empty-condition-group.png" alt-text="Screenshot of empty condition group fields.":::

1. Let's decide what these conditions will be. That is, what two *different* conditions will cause the incident severity to be changed to *High*? Let's suggest the following:

    1. If the incident's associated MITRE ATT&CK **Tactics** include any of the four we've selected from the drop-down (see the image below), the severity should be raised to High.

    1. If the incident contains a **Host name** entity named "SUPER_SECURE_STATION", the severity should be raised to High.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-simple-or-condition.png" alt-text="Screenshot of adding simple OR conditions to an automation rule.":::

    As long as at least ONE of these conditions is true, the actions we define in the rule will run, changing the severity of the incident to High. 

#### Example 1A: Add an OR value within a condition

Let's say we have not one, but two super-sensitive workstations whose incidents we want to make high-severity.
We can add another value to an existing condition (for any conditions based on entity properties) by selecting the dice icon to the right of the existing value and adding the new value below.

:::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-value-to-condition.png" alt-text="Screenshot of adding more values to a single condition.":::

#### Example 1B: Add more OR conditions

Let's say we want to have this rule run if one of THREE (or more) conditions is true. If A *or* B *or* C is true, the rule will run.

1. Remember all those "Add" links? To add another OR condition, select the **+ Add** connected by a line to the `OR` operator.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-another-or-condition.png" alt-text="Screenshot of adding another OR condition to an automation rule.":::

1. Now, fill in the parameters and values of this condition the same way you did the first two.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/added-another-or-condition.png" alt-text="Screenshot of another OR condition added to an automation rule.":::

### Example 2: complex conditions

blah blah blah 

## Final result of automation rule (temp)

:::image type="content" source="media/add-advanced-conditions-to-automation-rules/advanced-conditions.png" alt-text="Screenshot of advanced conditions in an automation rule.":::



## Next steps
In this document, you learned how to use automation rules to centrally manage response automation for Microsoft Sentinel incidents and alerts.

- To learn more about automation rules, see [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- To migrate alert-trigger playbooks to be invoked by automation rules, see [Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules](migrate-playbooks-to-automation-rules.md)
- For help in implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
