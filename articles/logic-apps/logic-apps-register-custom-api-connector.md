---
title: Register and use custom connectors - Azure Logic Apps | Microsoft Docs
description: 
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
ms.date: 08/31/2017
ms.author: LADocs; estfan
---

# Register and use custom APIs (connectors) in Azure Logic Apps

Logic Apps helps you build workflows without code. 
But sometimes, you need to extend Logic Apps capabilites, 
and web services naturally fit this scenario. 
Your workflow can connect to a service, perform operations, 
and get data back. When you have a web service that 
you want to connect to Azure Logic Apps, 
you can register your service as a custom connector. 
This process helps Azure Logic Apps understand the 
your web API's characteristics, including the required authentication, 
the supported operations, and the parameters and outputs for each operation.

This topic shows the steps required to register and use a custom connector. 
We'll use the Azure Cognitive Services Text Analytics API as an example. 
This API identifies the language, sentiment, and key phrases in the text 
that you pass to this API. For example, this image shows the interaction between your service, the custom API, or connector, that we create from 
that service, and the logic app that calls the API.

![Conceptual overview for Azure Cognitive Services API, custom connector, and Logic Apps](./media/logic-apps-register-custom-api-connector/custom-connector-conceptual.png)

