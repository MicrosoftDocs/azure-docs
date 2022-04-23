---
title: Move Azure Virtual Desktop resources between regions - Azure
description: How to move Azure Virtual Desktop resources between regions.
author: Heidilohr
ms.topic: how-to
ms.date: 04/25/2022
ms.author: helohr
manager: femila
---
# Move Azure Virtual Desktop resource between regions

In this article, we'll tell you how to move Azure Virtual Desktop resources between Azure regions.

## Important information

When you move Azure Virtual Desktop resources between regions, there are four things you must keep in mind:

- When exporting resources, you must move them as a set. All resources associated with a specific host pool have to stay together.
The reason for this is that a HostPool and it's associated Application Groups have to be in the same region.
- Also, a Workspace and it's associated Application Groups have to be in the same region.
- All resources to be moved have to be in the same resource group.
This is so the template export can be done. Template export for multiple items requires that the resources to be exported be in the same resource group.
Modify the exported template to change the location of the resources in the template
- Once you're done, you must delete the original resources.
This is needed because the resource ID of the resource will not be changed by this process, so there would be a name conflict if you don't delete the old resources
Deploy the modified template to create the resources in the new region