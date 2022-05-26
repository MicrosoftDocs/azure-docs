---
title: Use triggers and conditions in Microsoft Sentinel automation rules | Microsoft Docs
description: This article explains the types of triggers and conditions that govern the running of Microsoft Sentinel automation rules. It also explores various use cases to show you how to get the most out of automation in Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 05/16/2022
ms.author: yelevin
---

# Use triggers and conditions in Microsoft Sentinel automation rules

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article explains the types of triggers and conditions that govern the running of [Microsoft Sentinel automation rules](automate-incident-handling-with-automation-rules.md). It also explores various use cases to show you how to get the most out of automation in Microsoft Sentinel.

This article also goes together with our other automation documentation, [Tutorial: Use playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md), and these three documents will refer to each other back and forth.

### Trigger: When an incident is created

#### Current state evaluation

The following conditions evaluate to `true` if the property being evaluated has the specified value.

This is the case regardless of whether the incident *was created* with the property having the value, or if the property *was assigned* the value by another automation rule that ran when the incident was created. 

- Condition: `{property}` "Equals"/"Does not equal" `{value}`
- Condition: `{property}` "Contains"/"Does not contain" `{value}`
- Condition: `{property}` "Starts with"/"Does not start with" `{value}`
- Condition: `{property}` "Ends with"/"Does not end with" `{value}`

### Trigger: When an incident is updated

#### Current state evaluation

The following conditions evaluate to `true` if an incident property `{property}` has the value `{value}` while the incident is being updated, even if these conditions were not changed by the update:

- Condition: `{property}` "Equals"/"Does not equal" {value}
- Condition: `{property}` "Contains"/"Does not contain" {value}
- Condition: `{property}` "Starts with"/"Does not start with" {value}
- Condition: `{property}` "Ends with"/"Does not end with" {value}

#### State change evaluation

The following conditions evaluate to `true` according to the criteria shown below:

| Condition | Evaluates to `true` if... |
| - | - |
| `{property}` "Changed" | The property value changed during the update event. |
| `{property}` "Changed from" `{value}` | The property had the value `{value}` **before** the update, and is different after. |
| `{property}` "Changed to" `{value}` | The property has the value `{value}` **after** the update, and was different before. |
| `{list item}` (Alert/Comment/Tag/Tactic) "Added" | New items of type `{list item}` were added to the list. |




## Next steps

In this article, you learned about using the triggers used to activate Microsoft Sentinel automation rules and the conditions that they evaluate in incidents. 

- Learn more about [automation rules](automate-incident-handling-with-automation-rules.md) in Microsoft Sentinel.
