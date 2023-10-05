---
title: Add advanced conditions to Microsoft Sentinel automation rules
description: This article explains how to add complex, advanced "Or" conditions to automation rules in Microsoft Sentinel, for more effective triage of incidents.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 05/09/2023
---

# Add advanced conditions to Microsoft Sentinel automation rules

This article explains how to add advanced "Or" conditions to automation rules in Microsoft Sentinel, for more effective triage of incidents.

Add "Or" conditions in the form of *condition groups* in the Conditions section of your automation rule.

Condition groups can contain two levels of conditions:

- [**Simple**](#example-1-simple-conditions): At least two conditions, each separated by an `OR` operator: 

    - **A `OR` B**
    - **A `OR` B `OR` C** ([See Example 1B below](#example-1b-add-more-or-conditions).)
    - and so on.

- [**Compound**](#example-2-compound-conditions): More than two conditions, with at least two conditions on at least one side of an `OR` operator:

    - **(A `and` B) `OR` C**
    - **(A `and` B) `OR` (C `and` D)**
    - **(A `and` B) `OR` (C `and` D `and` E)**
    - **(A `and` B) `OR` (C `and` D) `OR` (E `and` F)**
    - and so on.

You can see that this capability affords you great power and flexibility in determining when rules will run. It can also greatly increase your efficiency by enabling you to combine many old automation rules into one new rule.

## Add a condition group

Since condition groups offer a lot more power and flexibility in creating automation rules, the best way to explain how to do this is by presenting some examples.

Let's create a rule that will change the severity of an incoming incident from whatever it is to High, assuming it meets the conditions we'll set.

1. From the **Automation** page, select **Create > Automation rule** from the button bar at the top.

    See the [general instructions for creating an automation rule](create-manage-use-automation-rules.md) for details.

1. Give the rule a name: "Triage: Change Severity to High"

1. Select the trigger **When incident is created**.

1. Under **Conditions**, leave the **Incident provider** and **Analytics rule name** conditions as they are. We'll add more conditions below.

1. Under **Actions**, select **Change severity** from the drop-down list.

1. Select **High** from the drop-down list that appears below **Change severity**.

:::image type="content" source="media/add-advanced-conditions-to-automation-rules/create-automation-rule-no-conditions.png" alt-text="Screenshot of creating new automation rule without adding conditions.":::

## Example 1: simple conditions

In this first example, we'll create a simple condition group: If either condition A **or** condition B is true, the rule will run and the incident's severity will be set to *High*.

1. Select the **+ Add** expander and choose **Condition group (Or)** from the drop-down list.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-condition-group.png" alt-text="Screenshot of adding a condition group to an automation rule's condition set.":::

1. See that two sets of condition fields are displayed, separated by an `OR` operator. These are the "A" and "B" conditions we mentioned above: If A or B is true, the rule will run.  
    (Don't be confused by all the different layers of "Add" links - these will all be explained.)

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/empty-condition-group.png" alt-text="Screenshot of empty condition group fields.":::

1. Let's decide what these conditions will be. That is, what two *different* conditions will cause the incident severity to be changed to *High*? Let's suggest the following:

    - If the incident's associated MITRE ATT&CK **Tactics** include any of the four we've selected from the drop-down (see the image below), the severity should be raised to High.

    - If the incident contains a **Host name** entity named "SUPER_SECURE_STATION", the severity should be raised to High.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-simple-or-condition.png" alt-text="Screenshot of adding simple OR conditions to an automation rule.":::

    As long as at least ONE of these conditions is true, the actions we define in the rule will run, changing the severity of the incident to High. 

### Example 1A: Add an OR value within a single condition

Let's say we have not one, but two super-sensitive workstations whose incidents we want to make high-severity.
We can add another value to an existing condition (for any conditions based on entity properties) by selecting the dice icon to the right of the existing value and adding the new value below.

:::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-value-to-condition.png" alt-text="Screenshot of adding more values to a single condition.":::

### Example 1B: Add more OR conditions

Let's say we want to have this rule run if one of THREE (or more) conditions is true. If A *or* B *or* C is true, the rule will run.

1. Remember all those "Add" links? To add another OR condition, select the **+ Add** connected by a line to the `OR` operator.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-another-or-condition.png" alt-text="Screenshot of adding another OR condition to an automation rule.":::

1. Now, fill in the parameters and values of this condition the same way you did the first two.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/added-another-or-condition.png" alt-text="Screenshot of another OR condition added to an automation rule.":::

## Example 2: compound conditions

Now we decide we're going to be a little more picky. We want to add more conditions to each side of our original OR condition. That is, we want the rule to run if A *and* B are true, *OR* if C *and* D are true.

1. To add a condition to one side of an OR condition group, select the **+ Add** link immediately below the existing condition, on the same side of the `OR` operator (in the same blue-shaded area) to which you want to add the new condition.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-a-compound-condition.png" alt-text="Screenshot of adding a compound condition to an automation rule.":::

    You'll see a new row added under the existing condition (in the same blue-shaded area), linked to it by an `AND` operator. 

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/empty-new-condition.png" alt-text="Screenshot of empty new condition row in automation rules.":::

1. Fill in the parameters and values of this condition the same way you did the others.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/fill-in-new-condition.png" alt-text="Screenshot of new condition fields to fill in to add to automation rules.":::

1. Repeat the previous two steps to add an AND condition to either side of the OR condition group.

    :::image type="content" source="media/add-advanced-conditions-to-automation-rules/add-compound-conditions.png" alt-text="Screenshot of adding multiple compound conditions to an automation rule.":::

That's it! You can use what you've learned here to add more conditions and condition groups, using different combinations of `AND` and `OR` operators, to create powerful, flexible, and efficient automation rules to really help your SOC run smoothly and lower your response and resolution times.

## Next steps

In this document, you learned how to add condition groups using `OR` operators to automation rules.

- For instructions on creating basic automation rules, see [Create and use Microsoft Sentinel automation rules to manage response](create-manage-use-automation-rules.md).
- To learn more about automation rules, see [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- For help with implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
