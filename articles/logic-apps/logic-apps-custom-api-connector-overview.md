---
title: Custom API connector overview - Azure Logic Apps | Microsoft Docs
description: Build custom API connectors and certify them with Microsoft for Azure Logic Apps
author: ecfan
manager: anneta
editor: 
services: logic-apps
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/1/2017
ms.author: LADocs; estfan
---

# Custom API connector overview for Azure Logic Apps

To support your users' various business and productivity scenarios, 
you can build custom *API connectors*. These connectors help you expand your 
set of integrations, and increase the reach, discoverability, and usage 
for your service.

An API connector is a wrapper, based on the OpenAPI (Swagger) specification, 
around a REST API that lets the underlying service talk to 
[Logic Apps](https://docs.microsoft.com/azure/logic-apps/), 
[Microsoft Flow](https://flow.microsoft.com), 
and [Microsoft PowerApps](https://powerapps.microsoft.com). 
The connector provides a way that users can connect to their accounts 
and use prebuilt *triggers* and *actions* for building workflows and apps.

## Requirements

* An active Azure subscription

## Build your connector

<!-- The first step to building an API Connector is to build a fully functional custom connector. A custom connector operates exactly like an API connector, but it is limited in availability to its author and specific users within the author's tenant. -->  All accurate but available only to THAT SUBSCRIPTION FOR APPS IN THE REGION DEPLOYED

The process to build a connector involves multiple steps:

![API connector authoring steps](./media/api-connectors-overview/authoring-steps.png)

[Learn more](api-connector-dev.md) about how to develop an API connector.
 

## Submit for certification

After you've built a connector, you <!-- can if you want --> submit it for certification. As part of our third party certification process, Microsoft reviews the connector before publishing.

This process validates the functionality of your connector in Microsoft Flow and PowerApps, and checks for technical and content compliance.

[Learn more](api-connector-submission.md) about the process to submit your connector for certification and publishing.

## Get support

For onboarding and development support, please email 
[condevhelp@microsoft.com](mailto:condevhelp@microsoft.com). 
This account is actively monitored and managed. 
Developer questions and incidents will quickly find their way to the appropriate team.

## Next steps


