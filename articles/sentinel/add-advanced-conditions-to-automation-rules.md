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

:::image type="content" source="media/add-advanced-conditions-to-automation-rules/advanced-conditions.png" alt-text="Screenshot of advanced conditions in an automation rule.":::

The best way to explain how to do this is by example.

Let's create a rule that will change the severity of an incoming incident from whatever it is to High, assuming it meets the conditions we'll set.

See the general instructions for [creating an automation rule](create-manage-use-automation-rules.md).

1. Give the rule a name: "Triage: Change Severity to High"

1. Select the trigger **When incident is created**.

1. Leave the **Analytics rule** condition as is.

1. Let's establish the criteria for changing severity to High:
    1. If the incident's severity is already classified as Medium, and the incident has to do with the sensitive Payroll application, the severity should be raised to High.
    1. Regardless of the incoming incident's severity, if the incident has to do with any activity on two particularly sensitive workstations, the severity should be raised to High.

1. 



## Next steps
In this document, you learned how to use automation rules to centrally manage response automation for Microsoft Sentinel incidents and alerts.

- To learn more about automation rules, see [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- To migrate alert-trigger playbooks to be invoked by automation rules, see [Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules](migrate-playbooks-to-automation-rules.md)
- For help in implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
