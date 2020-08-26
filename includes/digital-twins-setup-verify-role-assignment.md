---
author: baanders
description: include file for verifying role assignment in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/22/2020
ms.author: baanders
---

One way to check that you've successfully set up the role assignment is to view the role assignments for the Azure Digital Twins instance in the [Azure portal](https://portal.azure.com). Go to your Azure Digital Twins instance in the Azure portal (you can look it up on the page of [Azure Digital Twins instances](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances) or search its name in the portal search bar).

Then, view all of its assigned roles under *Access control (IAM) > Role assignments*. The user should show up in the list with a role of *Azure Digital Twins Owner (Preview)*. 

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/portal/verify-role-assignment.png" alt-text="View of the role assignments for an Azure Digital Twins instance in Azure portal":::