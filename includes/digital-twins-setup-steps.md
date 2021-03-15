---
author: baanders
description: include file for steps overview in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 10/14/2020
ms.author: baanders
---

Full setup for a new Azure Digital Twins instance consists of two parts:
1. **Creating the instance**
2. **Setting up user access permissions**: Azure users need to have the *Azure Digital Twins Data Owner* role on the Azure Digital Twins instance to be able to manage it and its data. In this step, you as an Owner/administrator of the Azure subscription will assign this role to the person who will be managing your Azure Digital Twins instance. This may be yourself or someone else in your organization.
 
>[!NOTE]
>These operations are intended to be completed by a user with the power to manage both resources and user access on the Azure subscription. Although some steps can be completed with lower permissions, cooperation of someone with these permissions will be required to completely set up a usable instance. View more information on this in the [*Prerequisites: Required permissions*](#prerequisites-permission-requirements) section below.