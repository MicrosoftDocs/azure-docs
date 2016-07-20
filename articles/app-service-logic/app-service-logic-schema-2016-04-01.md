<properties 
	pageTitle="New schema version 2016-04-01-preview | Microsoft Azure" 
	description="Learn how to write the JSON definition for the latest version of Logic apps" 
	authors="jeffhollan" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/17/2016"
	ms.author="jehollan"/>
	
# New schema version 2016-04-01-preview

The new schema and API version for Logic apps has a number of improvements which improve the reliability and ease-of-use of Logic apps. There are 3 key differences:

1. Addition of scopes, which are actions that contain a collection of actions.
1. Conditions and loops are first-class actions
1. Execution ordering more verbose via `runAfter` property (which replaces `dependsOn`)

For information on upgrading your logic apps from the 2015-08-01-preview schema to the 2016-04-01-preview schema, [check out the upgrade section below.](#upgrading-to-2016-04-01-preview-schema)


## 1. Scopes

One of the biggest changes in this schema is the addition of scopes and the ability to nest actions within each other.  This is helpful when grouping a set of actions together, or when needing to nest actions within each other (for example a condition can contain another condition).  More details on scope syntax can be found [here](app-service-logic-loops-and-scopes.md), but a simple scope example can be found below:


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

## 2. Conditions and loops changes

In the previous versions of the schema, conditions and loops were parameters associated to a single action.  This limitation has been lifted in this schema and now conditions and loops show up as a type of action.  More information can be found [in this article](app-service-logic-loops-and-scopes.md), and a simple example of a condition action is shown below:

```
{
    "If_trigger_is_foo": {
        "type": "If",
        "expression": "@equals(triggerBody(), 'foo')",
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
            "if_trigger_is_bar": "..."
        }      
    }
}
```

## 3. RunAfter Property

The new `runAfter` property is replacing `dependsOn` to help allow more precision in run ordering.  `dependsOn` was synonymous with "the action ran and was successful," however many times you need to execute an action if the previous action is successful, failed, or skipped.  `runAfter` allows for that flexibility.  It is an object that specifies all of the action names it will run after, and defines an array of status' that are acceptable to trigger from.  For example if you wanted to run after step A was succeeded and step B was succeeded or failed, you would construct the following `runAfter` property:

```
{
    "...",
    "runAfter": {
        "A": ["Succeeded"],
        "B": ["Succeeded", "Failed"]
    }
}
```

## Upgrading to 2016-04-01-preview schema

Upgrading to the new 2016-04-01-preview schema only takes a few steps.  Details on the changes from the schema can be found [in this article](app-service-logic-schema-2016-04-01.md).  The upgrade process includes running the upgrade script, saving as a new logic app, and potentially overwriting old logic app if needed.

1. Open your current logic app.
1. Click the **Update Schema** button in the toolbar
   
    ![][1]
   
    The upgraded definition will be returned.  You could copy and paste this into a resource definition if you need, but we **strongly recommend** you use the **Save As** button to ensure all connection references are valid in the upgraded logic app.
1. Click the **Save As** button in the toolbar of the upgrade blade.
1. Fill out the name and logic app status and click **Create** to deploy your upgrade logic app.
1. Verify your upgraded logic app is working as expected.

    >[AZURE.NOTE] If you are using a manual or request trigger, the callback URL will have changed in your new logic app.  Use the new URL to verify it works end-to-end, and you can clone over your existing logic app to preserve previous URLs.

1. *Optional* Use the **Clone** button in the toolbar (adjacent to the **Update Schema** icon in the picture above) to overwrite your previous logic app with the new schema version.  This is necessary only if you wish to keep the same resource ID or request trigger URL of your logic app.

### Upgrade tool notes

#### Condition mapping

The tool will make a best effort to group the true and false branch actions together in a scope in the upgraded definition.  Specifically the designer pattern of `@equals(actions('a').status, 'Skipped')` should show up as an `else` action.  However if the tool detects patterns it does not recognize it will potentially create separate conditions for both the true and the false branch.  Actions can be re-mapped post upgrade if needed.

#### ForEach with Condition
  
The previous pattern of a foreach loop with a condition per item can be replicated in the new schema with the filter action.  This should occur automatically on upgrade.  The condition becomes a filter action before the foreach loop (to return only an array of items that match the condition), and that array is passed into the foreach action.  You can view an example of this [in this article](app-service-logic-loops-and-scopes.md)

#### Resource tags

Resource tags will be removed on upgrade and you will need to set them again for the upgraded workflow.

## Other changes

### Manual trigger renamed to Request trigger

The type `manual` has been deprecated and renamed to `request` with the kind of `http`.  This is more consistent with the type of pattern the trigger is used to build.

### New 'filter' action

If you are working with a large array and need to filter it down to a smaller set of items, you can use the new 'filter' type.  It accepts an array and a condition and will evaluate the condition for each item and return an array of items that meet the condition.

### ForEach and until action restrictions

The foreach and until loop are restricted to a single action.

### TrackedProperties on Actions

Actions can now have an additional property (sibling to `runAfter` and `type`) called `trackedProperties`.  It is an object that specifies certain action inputs or outputs to be included in the Azure Diagnostic telemetry that is emitted as part of a workflow.  For example:

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
- [Use the logic app workflow definition](app-service-logic-author-definitions.md)
- [Create a logic app deployment template](app-service-logic-create-deploy-template.md)


<!-- Image references -->
[1]: ./media/app-service-logic-schema-2016-04-01/upgradeButton.png
