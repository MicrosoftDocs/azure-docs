---
title: Update schema for Workflow Definition Language
description: Learn how to update the schema for the Workflow Definition Language in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/15/2023
---

# Update schema for Workflow Definition Language in Azure Logic Apps - June 1, 2016

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

The [latest Workflow Definition Language schema version June-01-2016](https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json) and API version for Azure Logic Apps includes key improvements that make Consumption logic app workflows more reliable and easier to use:

* [Scopes](#scopes) let you group or nest actions as a collection of actions.
* [Conditions and loops](#conditions-loops) are first-class actions.
* More precise ordering for running actions with the `runAfter` property, replacing `dependsOn`

To upgrade older workflow definitions to the current schema, see [Upgrade your schema](#upgrade-your-schema).

<a name="scopes"></a>

## Scopes

This schema includes scopes, which let you group actions together, or nest actions inside each other. For example, a condition can contain another condition. Learn more about [scope syntax](./logic-apps-control-flow-loops.md), 
or review this basic scope example:

```json
{
   "actions": {
      "Scope": {
         "type": "Scope",
         "actions": {
            "Http": {
               "inputs": {
                   "method": "GET",
                   "uri": "https://www.bing.com"
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

In previous schema versions, conditions and loops were parameters associated with a single action. This schema lifts this limitation, so conditions and loops are now available as action types. Learn more about [loops and scopes](./logic-apps-control-flow-loops.md), [conditions](../logic-apps/logic-apps-control-flow-conditional-statement.md), or review this basic example that shows a condition action:

```json
{
   "Condition - If trigger is some trigger": {
      "type": "If",
      "expression": "@equals(triggerBody(), '<trigger-name>')",
      "runAfter": {},
      "actions": {
         "Http_2": {
            "inputs": {
                "method": "GET",
                "uri": "https://www.bing.com"
            },
            "runAfter": {},
            "type": "Http"
         }
      },
      "else": 
      {
         "Condition - If trigger is another trigger": {}
      }  
   }
}
```

<a name="run-after"></a>

## 'runAfter' property

The `runAfter` property replaces `dependsOn`, providing more precision when you specify the run order for actions based on the status of previous actions. The `dependsOn` property indicated whether "the action ran and was successful", based on whether the previous action succeeded, failed, or as skipped - not the number of times you wanted to run the action. The `runAfter` property provides flexibility as an object that specifies all the action names after which the object runs. This property also defines an array of statuses that are acceptable as triggers. For example, if you want an action to run after action A succeeds and also after action B succeeds or fails, set up this `runAfter` property:

```json
{
   // Other parts in action definition
   "runAfter": {
      "A": ["Succeeded"],
      "B": ["Succeeded", "Failed"]
    }
}
```

## Other changes

### Renamed 'manual' trigger to 'request' trigger

The `manual` trigger type was deprecated and renamed to `request` with type `http`. This change creates more consistency for the kind of pattern that the trigger is used to build.

### New 'filter' action

To filter a large array down to a smaller set of items, the `filter` type accepts an array and a condition, evaluates the condition for each item, and returns an array with items that meet the condition.

### Restrictions for 'foreach' and 'until' actions

The `foreach` and `until` loop are restricted to a single action.

### 'trackedProperties' for actions

Actions have an additional property called `trackedProperties`, which is a sibling to the `runAfter` and `type` properties. This object specifies certain action inputs or outputs that you want to include in the Azure Diagnostic telemetry, emitted as part of a workflow, for example:

``` json
{
   "Http": {
      "inputs": {
         "method": "GET",
         "uri": "https://www.bing.com"
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

<a name="upgrade-your-schema"></a>

## Upgrade your schema

If you have a Consumption logic app workflow that uses an older Workflow Definition Language schema, you can update your workflow to use the newest schema. This capability applies only to Consumption logic app workflows. To upgrade to the [most recent schema](https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json), you need only take a few steps. The upgrade process includes running the upgrade script, saving your original logic app workflow as a new Consumption logic app workflow, and if you want, possibly overwriting the original logic app workflow.

<a name="best-practices"></a>

### Best practices

The following list includes some best practices for updating your logic app workflow to the latest schema:

* Don't overwrite your original workflow until after you finish your testing and confirm that your updated workflow works as expected.

* Copy the updated script to a new logic app workflow.

* Test your workflow *before* you deploy to production.

* After you finish and confirm a successful migration, update your logic app workflows to use the latest versions for the [managed connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors) where possible. For example, replace older versions of the Dropbox connector with the latest version.

### Update workflow schema

When you select the option to update the schema, Azure Logic Apps automatically runs the migration steps and provides the code output for you. You can use this output to update your workflow definition. However, before you update your workflow definition using this output, make sure that you review and follow the best practices as described in the [Best practices](#best-practices) section.

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On your logic app resource menu, select **Overview**. On the toolbar, select **Update Schema**.

   > [!NOTE]
   >
   > If the **Update Schema** command is unavailable, your workflow already uses the current schema.

   ![Screenshot showing Azure portal, Consumption logic app resource, Overview page, and selected Update Schema command.](./media/update-workflow-definition-language-schema/update-schema.png)

   The **Update Schema** pane opens and shows a link to a document that describes the improvements in the current schema. You can copy and paste the returned workflow definition, which you can copy and paste into your logic app resource definition if necessary.

1. In the upgrade pane toolbar, select **Save As** so that all the connection references remain valid in the upgraded logic app workflow definition.

1. Provide a name for your logic app workflow, and enter the status.

1. To deploy your upgraded logic app workflow, select **Create**. Confirm that your upgraded logic app works as expected.

   > [!IMPORTANT]
   >
   > If your workflow uses a Request trigger (previously named "manual"), the callback URL changes for this trigger in your upgraded workflow. 
   > Test the new callback URL to make sure the end-to-end experience works. To preserve previous URLs, you can clone over your existing logic app workflow.

1. **Optional**: To overwrite your original logic app workflow with the upgraded version, on the toolbar, next to **Update Schema**, select **Clone**.

   This step is necessary only if you want to keep the same resource ID or Request trigger's callback URL for your logic app workflow.

## Upgrade tool notes

### Resource tags

After you upgrade, resource tags are removed, so you must reset them for the upgraded workflow.

### Mapping conditions

In the upgraded workflow definition, the tool makes the best effort at grouping true and false branch actions together as a scope. Specifically, the designer pattern of `@equals(actions('a').status, 'Skipped')` appears as an `else` action. However, if the tool detects unrecognizable patterns, the tool might create separate conditions for both the true and the false branch. You can remap actions after upgrading, if necessary.

### 'foreach' loop with condition

In the upgraded schema, you can use the filter action to replicate the pattern that uses a **For each** loop with one condition per item. However, the change automatically happens when you upgrade. The condition becomes a filter action that appears prior to the **For each** loop, returning only an array of items that match the condition, and passing that array to **For each** action. For an example, see [Loops and scopes](logic-apps-control-flow-loops.md).

## Next steps

* [Create workflow definitions for logic apps](logic-apps-author-definitions.md)
* [Automate logic app deployment](logic-apps-azure-resource-manager-templates-overview.md)
