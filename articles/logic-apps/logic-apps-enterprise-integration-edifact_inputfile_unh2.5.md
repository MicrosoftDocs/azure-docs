---
title: Logic Apps B2B edifact decode resolve UNH2.5 - Azure Logic Apps | Microsoft Docs
description: Azure Logic Apps B2B edifact decode resolve UNH2.5
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: ''

ms.assetid: cf44af18-1fe5-41d5-9e06-cc57a968207c
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2017
ms.author: padmavc

---
# How to handle EDIFACT documents having UNH2.5 segment
When UNH2.5 is present in the EDIFACT document, it is being used for schema lookup. 

Example:  The UNH field is similar to this in the EDIFACT message  
UNH+SSDD1+ORDERS:D:03B:UN:**EAN008**'  

Steps to follow to handle the message 
1. Update the schema
2. Check the agreement settings  

## Update the schema
To process the message, you need to deploy a schema with the UNH2.5 root node name.  For given example, the schema root name would be **EFACT_D03B_ORDERS_EAN008**  

For each D03B_ORDERS with a different UNH2.5 segment, you would have to deploy an individual schema.  

## Add schema to the EDIFACT agreement
1. Add the schema to the integration account    
2. Configure the schema in the EDIFACT agreement receive settings. If the UNH2.5 value doesn't populate, manually enter the values. 
![](./media/logic-apps-enterprise-integration-edifact_inputfile_unh2.5/image1.png)

## Next Steps
* [Learn more about integration account agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md "Learn about enterprise integration agreements")  