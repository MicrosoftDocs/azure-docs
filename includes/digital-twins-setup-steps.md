---
author: baanders
description: include file for steps overview in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/22/2020
ms.author: baanders
---

>[!NOTE]
>These operations are intended to be completed by a user with an *Owner* role on the Azure subscription. Although some pieces can be completed without this elevated permission, an owner's cooperation will be required to completely set up a usable instance. View more information on this in the [*Prerequisites: Required permissions*](#prerequisites-permission-requirements) section below.

Full setup for a new Azure Digital Twins instance consists of three parts:
1. **Creating the instance**
2. **Setting up your user's access permissions**: Your Azure user needs to have the *Azure Digital Twins Owner (Preview)* role on the instance in order to perform management activities. In this step, you will either assign yourself this role (if you are an Owner in the Azure subscription), or get an Owner on your subscription to assign it to you.
3. **Setting up access permissions for client applications**: It is common to write a client application that you use to interact with your instance. In order for that client app to access your Azure Digital Twins, you need to set up an *app registration* in [Azure Active Directory](../articles/active-directory/fundamentals/active-directory-whatis.md) that the client application will use to authenticate to the instance.

To proceed, you will need an Azure subscription. You can set one up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
