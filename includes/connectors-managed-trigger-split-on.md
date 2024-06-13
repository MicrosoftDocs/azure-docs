---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 10/15/2022
---

By default, triggers that return an array have a **Split On** setting that's already enabled. With this setting enabled, the trigger automatically *debatches* the array by internally creating a separate workflow instance to process each array item. All the workflow instances run in parallel so that the array items are processed at the same time.

However, when the **Split On** setting is enabled, *managed* connector triggers return the outputs for all the array items as lists. Any subsequent actions that reference these outputs have to first handle these outputs as lists. To handle each array item individually, you can add extra actions. For example, to iterate through these array items, you can use a **For each** loop. For triggers that return only metadata or properties, use an action that gets the array item's metadata first, and then use an action to get the items contents.

You have to apply this approach only for *managed* connector triggers, not built-in connector triggers that return outputs for one array item at a time when the **Split On** setting is enabled.

For example, suppose you have managed connector trigger named **When a file is added or modified (properties only)** that returns the metadata or properties for the new or updated files as arrays. To get the metadata separately for each file, you might use a **For each** loop that iterates through the array. In this loop, use the following managed connector actions in the specified order:

1. **Get file metadata** to get each file's metadata.

1. **Get file content** action to get each file's content.