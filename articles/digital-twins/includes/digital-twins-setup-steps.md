---
author: baanders
description: Include file for steps overview in Azure Digital Twins setup
ms.service: azure-digital-twins
ms.topic: include
ms.date: 4/21/2025
ms.author: baanders
---

Full setup for a new Azure Digital Twins instance consists of two parts:
1. Creating the instance.
2. Setting up user access permissions: Azure users need to have the **Azure Digital Twins Data Owner** role on the Azure Digital Twins instance to be able to manage it and its data. In this step, you as an Owner/administrator of the Azure subscription assigns this role to the person who manages your Azure Digital Twins instance. This person might be yourself or someone else in your organization.
 
>[!IMPORTANT]
>To complete this full article and set up a usable instance, you need permissions to manage both resources and user access on the Azure subscription. Anyone who's able to create resources on the subscription can complete the first step, but the second step requires user access management permissions (or the cooperation of someone with these permissions). You can read more about the required permissions in the [Prerequisites: Required permissions](#prerequisites-permission-requirements) section for the user access permission step.
