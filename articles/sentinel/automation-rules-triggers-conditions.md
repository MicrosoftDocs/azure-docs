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

## Triggers summary

Automation rules run when an incident is created or updated. The following table shows the different possible ways that incidents can be created or updated that will cause an automation rule to run.

| Trigger type | Events that cause the rule to run |
| --------- | ------------ |
| **An incident was created** | - A new incident is created by an analytics rule.<br>- An incident is ingested from Microsoft 365 Defender.<br>- A new incident is created manually. |
| **An incident was updated** | - An existing incident has one of its properties changed.<br>- An incident has a new alert added to it.<br>- An incident has a comment added to it. |

## Conditions summary

When an incident is created or updated, any automation rules that apply will run. Recall that [automation rules](automate-incident-handling-with-automation-rules.md) are composed of **conditions** that are evaluated and **actions** that are executed if the conditions are met (if they evaluate to `true`). The following section explains which conditions are evaluated, how they are evaluated, and under which circumstances.

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


<!--### Incident dynamic fields

The **Incident** object received from **Microsoft Sentinel incident** includes the following dynamic fields:

- Incident properties (Shown as "Incident: field name")

- Alerts (array)

  - Alert properties (Shown as "Alert: field name")

    When selecting an alert property such as **Alert: \<property name>**, a *for each* loop is automatically generated, since an incident can include multiple alerts.

- Entities (array of all an alert's entities)

- Workspace info fields (applies to the Sentinel workspace where the incident was created)
  - Subscription ID
  - Workspace name
  - Workspace ID
  - Resource group name

## Microsoft Sentinel actions summary

| Component | When to use it |
| --------- | -------------- |
| **Alert - Get Incident** | In playbooks that start with Alert trigger. Useful for getting the incident properties, or retrieving the **Incident ARM ID** to use with the **Update incident** or **Add comment to incident** actions. |
| **Get Incident** | When triggering a playbook from an external source or with a non-Sentinel trigger. Identify with an **Incident ARM ID**. Retrieves the incident properties and comments. |
| **Update Incident** | To change an incident's **Status** (for example, when closing the incident), assign an **Owner**, add or remove a tag, or to change its **Severity**, **Title**, or **Description**.
| **Add comments to incident** | To enrich the incident with information collected from external sources; to audit the actions taken by the playbook on the entities; to supply additional information valuable for incident investigation. |
| **Entities - Get \<*entity type*\>** | In playbooks that work on a specific entity type (**IP**, **Account**, **Host**, **URL** or **FileHash**) which is known at playbook creation time, and you need to be able to parse it and work on its unique fields. |
|

## Work with incidents - Usage Examples

> [!TIP] 
> The actions **Update Incident** and **Add a Comment to Incident** require the **Incident ARM ID**.
>
> Use the **Alert - Get Incident** action beforehand to get the **Incident ARM ID**.

### Update an incident
-  Playbook is triggered by **Microsoft Sentinel incident**

    ![Incident trigger simple Update flow example](media/playbook-triggers-actions/incident-simple-flow.png)

-  Playbook is triggered by **Microsoft Sentinel alert**

    ![Alert trigger simple Update Incident flow example](media/playbook-triggers-actions/alert-update-flow.png)
      
### Use Incident Information

Basic playbook to send incident details over mail:
-  Playbook is triggered by **Microsoft Sentinel incident**

    ![Incident trigger simple Get flow example](media/playbook-triggers-actions/incident-simple-mail-flow.png)

-  Playbook is triggered by **Microsoft Sentinel alert**

    ![Alert trigger simple Get Incident flow example](media/playbook-triggers-actions/alert-simple-mail-flow.png)

### Add a comment to the incident

-  Playbook is triggered by **Microsoft Sentinel incident**

    ![Incident trigger simple add comment example](media/playbook-triggers-actions/incident-comment.png)

-  Playbook is triggered by **Microsoft Sentinel alert**

    !["Alert trigger simple add comment example"](media/playbook-triggers-actions/alert-comment.png)

## Work with specific Entity types

The **Entities** dynamic field is an array of JSON objects, each of which represents an entity. Each entity type has its own schema, depending on its unique properties.

The **"Entities - Get \<entity name>"** action allows you to do the following:

- Filter the array of entities by the requested type.
- Parse the specific fields of this type, so they can be used as dynamic fields in further actions.

The input is the **Entities** dynamic field.

The response is an array of entities, where the special properties are parsed and can be directly used in a *For each* loop.

Currently supported entity types are:

- [IP](/connectors/azuresentinel/#entities---get-ips)
- [Host](/connectors/azuresentinel/#entities---get-hosts)
- [Account](/connectors/azuresentinel/#entities---get-accounts)
- [URL](/connectors/azuresentinel/#entities---get-urls)
- [FileHash](/connectors/azuresentinel/#entities---get-filehashes)

    :::image type="content" source="media/playbook-triggers-actions/entities-actions.png" alt-text="Entities Actions List":::

For other entity types, similar functionality can be achieved using Logic Apps' built-in actions:

- Filter the array of entities by the requested type using [**Filter Array**](../logic-apps/logic-apps-perform-data-operations.md#filter-array-action).

- Parse the specific fields of this type, so they can be used as dynamic fields in further actions using [**Parse JSON**](../logic-apps/logic-apps-perform-data-operations.md#parse-json-action).

## Work with custom details

The **Alert custom details** dynamic field, available in the **incident trigger**, is an array of JSON objects, each of which represents a custom detail of an alert. [Custom details](surface-custom-details-in-alerts.md), you will recall, are key-value pairs that allow you to surface information from events in the alert so they can be represented, tracked, and analyzed as part of the incident.

Since this field in the alert is customizable, its schema depends on the type of event being surfaced. You will have to supply data from an instance of this event to generate the schema that will determine how the custom details field will be parsed.

See the following example:

![Custom details defined in analytics rule.](./media/playbook-triggers-actions/custom-details-values.png)

In these key-value pairs, the key (the left-hand column) represents the custom fields you create, and the value (the right-hand column) represents the fields from the event data that populate the custom fields.

You can supply the following JSON code to generate the schema. The code shows the key names as arrays, and the values (shown as the actual values, not the column that contains the values) as items in the arrays.

```json
{ "FirstCustomField": [ "1", "2" ], "SecondCustomField": [ "a", "b" ] }
```

1. Add a new step using the **Parse JSON** built-in action. You can enter 'parse json' in the Search field to find it.

1. Find and select **Alert Custom Details** in the **Dynamic content** list, under the incident trigger.

    ![Select "Alert custom details" from "Dynamic content."](./media/playbook-triggers-actions/custom-details-dynamic-field.png)

    This will create a **For each** loop, since an incident contains an array of alerts.

1. Click on the **Use sample payload to generate schema** link.

    ![Select 'use sample payload to generate schema' link](./media/playbook-triggers-actions/generate-schema-link.png)

1. Supply a sample payload. You can find a sample payload by looking in Log Analytics (the **Logs** blade) for another instance of this alert, and copying the custom details object (under **Extended Properties**). In the screenshot below, we used the JSON code shown above.

    ![Enter sample JSON payload.](./media/playbook-triggers-actions/sample-payload.png)

1. The custom fields are ready to be used dynamic fields of type **Array**. You can see here the array and its items, both in the schema and in the list that appears under **Dynamic content**, that we described above.

    ![Fields from schema ready to use.](./media/playbook-triggers-actions/fields-ready-to-use.png)
    
-->

## Next steps

In this article, you learned about using the triggers used to activate Microsoft Sentinel automation rules and the conditions that they evaluate in incidents. 

- Learn more about [automation rules](automate-incident-handling-with-automation-rules.md) in Microsoft Sentinel.
