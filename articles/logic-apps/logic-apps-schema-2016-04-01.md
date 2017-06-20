---
title: Schema updates June-1-2016 - Azure Logic Apps | Microsoft Docs
description: Create JSON definitions for Azure Logic Apps with schema version 2016-06-01
author: jeffhollan
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: 349d57e8-f62b-4ec6-a92f-a6e0242d6c0e
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: H1Hack27Feb2017
ms.date: 07/25/2016
ms.author: LADocs; jehollan

---
# Schema updates for Azure Logic Apps - June 1, 2016

This new schema and API version for Azure Logic Apps includes key improvements that make logic apps 
more reliable and easier to use:

* [Scopes](#scopes) let you group or nest actions as a collection of actions.
* [Conditions and loops](#conditions-loops) are now first-class actions.
* More precise ordering for running actions with the `runAfter` property, replacing `dependsOn`

To upgrade your logic apps from the August 1, 2015 preview schema to the June 1, 2016 schema, 
[check out the upgrade section](#upgrading-to-2016-06-01-schema).

<a name="scopes"></a>
## Scopes

This schema includes scopes, which let you group actions together, 
or nest actions inside each other. For example, a condition can contain another condition. 
Learn more about [scope syntax](../logic-apps/logic-apps-loops-and-scopes.md), 
or review this basic scope example:

```
{
    "actions": {
        "My_Scope": {
            "type": "scope",
            "actions": {                
                "Http": {
                    "inputs": {
                        "method": "GET",
                        "uri": "http://www.bing.com"
                    },
                    "runAfter": {},
                    "type": "Http"
                }
            }
        }
    }
}
```

<a name="conditions-loops"></a>
## Conditions and loops changes

In previous schema versions, 
conditions and loops were parameters associated with a single action. 
This schema lifts this limitation, so conditions and loops now appear as action types. 
Learn more about [loops and scopes](../logic-apps/logic-apps-loops-and-scopes.md), 
or review this basic example for a condition action:

```
{
    "If_trigger_is_some-trigger": {
        "type": "If",
        "expression": "@equals(triggerBody(), 'some-trigger')",
        "runAfter": { },
        "actions": {
            "Http_2": {
                "inputs": {
                    "method": "GET",
                    "uri": "http://www.bing.com"
                },
                "runAfter": {},
                "type": "Http"
            }
        },
        "else": 
        {
            "if_trigger_is_another-trigger": "..."
        }      
    }
}
```

<a name="run-after"></a>
## 'runAfter' property

The `runAfter` property replaces `dependsOn`, 
providing more precision when you specify the run order for actions 
based on the status of previous actions.

The `dependsOn` property was synonymous with "the action ran and was successful", 
no matter how many times you wanted to execute an action, 
based on whether the previous action was successful, failed, or skipped. 
The `runAfter` property provides that flexibility as an object 
that specifies all the action names after which the object runs. 
This property also defines an array of statuses that are acceptable as triggers. 
For example, if you wanted to run after step A succeeds and also after 
step B succeeds or fails, you construct this `runAfter` property:

```
{
    "...",
    "runAfter": {
        "A": ["Succeeded"],
        "B": ["Succeeded", "Failed"]
    }
}
```

## Upgrade your schema

Upgrading to the new schema only takes a few steps. 
The upgrade process includes running the upgrade script, 
saving as a new logic app, and if you want, 
possibly overwriting the previous logic app.

1. In the Azure portal, open your logic app.

2. Go to **Overview**. On the logic app toolbar, choose **Update Schema**.
   
    ![Choose Update Schema][1]
   
	The upgraded definition is returned, 
	which you can copy and paste into a resource definition if necessary. 
	However, we **strongly recommend** you choose **Save As** 
	to make sure that all connection references are valid in the upgraded logic app.

3. In the upgrade blade toolbar, choose **Save As**.

4. Enter the logic name and status. 
To deploy your upgraded logic app, choose **Create**.

5. Confirm that your upgraded logic app works as expected.
   
   > [!NOTE]
   > If you are using a manual or request trigger, 
   > the callback URL changes in your new logic app. 
   > Test the new URL to make sure the end-to-end experience works. 
   > To preserve previous URLs, you can clone over your existing logic app.

6. *Optional* To overwrite your previous logic app with the new schema version, 
on the toolbar, choose **Clone**, next to **Update Schema**. 
This step is necessary only if you want to keep the same resource ID 
or request trigger URL of your logic app.

### Upgrade tool notes

#### Mapping conditions

In the upgraded definition, the tool makes a best effort at 
grouping true and false branch actions together as a scope. 
Specifically, the designer pattern of `@equals(actions('a').status, 'Skipped')` 
should appear as an `else` action. However, if the tool detects unrecognizable patterns, 
the tool might create separate conditions for both the true and the false branch. 
You can remap actions after upgrading, if necessary.

#### 'foreach' loop with condition

In the new schema, you can use the filter action 
to replicate the pattern of a `foreach` loop with a condition per item, 
but this change should automatically happen when you upgrade. 
The condition becomes a filter action before the foreach loop 
for returning only an array of items that match the condition, 
and that array is passed into the foreach action. 
For an example, see [Loops and scopes](../logic-apps/logic-apps-loops-and-scopes.md).

#### Resource tags

After you upgrade, resource tags are removed, so you must reset them for the upgraded workflow.

## Other changes

### Renamed 'manual' trigger to 'request' trigger

The `manual` trigger type was deprecated and renamed to `request` with type `http`. 
This change creates more consistency for the kind of pattern that the trigger is used to build.

### New 'filter' action

To filter a large array down to a smaller set of items, 
the new `filter` type accepts an array and a condition, 
evaluates the condition for each item, and returns an array 
with items meeting the condition.

### Restrictions for 'foreach' and 'until' actions

The `foreach` and `until` loop are restricted to a single action.

### New 'trackedProperties' for actions

Actions can now have an additional property called 
`trackedProperties`, which is sibling to the `runAfter` and `type` properties. 
This object specifies certain action inputs or outputs that you want to include in 
the Azure Diagnostic telemetry, emitted as part of a workflow. For example:

```
{                
    "Http": {
        "inputs": {
            "method": "GET",
            "uri": "http://www.bing.com"
        },
        "runAfter": {},
        "type": "Http",
        "trackedProperties": {
            "responseCode": "@action().outputs.statusCode",
            "uri": "@action().inputs.uri"
        }
    }
}
```

## Next Steps
* [Create workflow definitions for logic apps](../logic-apps/logic-apps-author-definitions.md)
* [Create deployment templates for logic apps](../logic-apps/logic-apps-create-deploy-template.md)

<!-- Image references -->
[1]: ./media/logic-apps-schema-2016-04-01/upgradeButton.png
