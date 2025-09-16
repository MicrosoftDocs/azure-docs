---
ms.service: azure-logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 09/15/2025
---

By default, triggers that accept and return arrays usually have a **Split on** setting that's already enabled. The trigger automatically *debatches* an array by internally creating a separate workflow instance to process each array item. All the workflow instances run in parallel so that the array items are processed at the same time.

With the **Split on** setting enabled, *managed* connector triggers return the outputs for all the array items as lists. Any subsequent actions that reference these outputs must first handle these outputs as lists. To handle each array item individually, you can add extra actions. For example, to iterate through these array items, you can use a **For each** loop. For triggers that return only metadata or properties, use an action that gets the array item's metadata first, and then use an action to get the items contents.

You must apply this approach only for *managed* connector triggers, not built-in connector triggers that return outputs for one array item at a time with the **Split on** setting enabled.

For example, suppose you have managed connector trigger named **When a file is added or modified (properties only)** that returns the metadata or properties for the new or updated files as arrays. To get the metadata separately for each file, you might use a **For each** loop that iterates through the array. In this loop, use the following managed connector actions in the specified order:

1. **Get file metadata** to get each file's metadata.

1. **Get file content** action to get each file's content.
