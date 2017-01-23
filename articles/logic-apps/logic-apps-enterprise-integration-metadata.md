---
title: Azure Logic Apps Integration Account Metadata | Microsoft Docs
description: Overview of integration account metadata 
author: padmavc
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: bb7d9432-b697-44db-aa88-bd16ddfad23f
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/21/2016
ms.author: padmavc

---
# Azure Logic Apps Integration Account Metadata 

## Overview

Partners, agreements, schemas, maps added to an integration account, store metadata with key-value pairs. You can define custom metadata, which can be retrieved during runtime.  Right now the artifacts do not have the capability to create metadata in UI; you can use rest APIs to create them.  Partner, agreements, and schema have **EDIT as JSON** and allows for keying metadata information.  In a logic app, **Integration Account Artifact LookUp** helps in retrieving the metadata information.

## How to Store metadata 

1. Create an [Integration Account](logic-apps-enterprise-integration-create-integration-account.md)   

2. Add a [partner](logic-apps-enterprise-integration-partners.md#how-to-create-a-partner) or an [agreement](logic-apps-enterprise-integration-agreements.md#how-to-create-agreements) or a [schema](logic-apps-enterprise-integration-schemas.md) in integration account

3. Select a parter or an agreement, or a schema. select **Edit as JSON** and enter metadata details    
![Enter metadata](media/logic-apps-enterprise-integration-metadata/image1.png)  

## Call **Integration Account Artifact LookUp** from a logic app

1. Create a [Logic App](logic-apps-create-a-logic-app.md)

2. [Link](logic-apps-enterprise-integration-create-integration-account.md#how-to-link-an-integration-account-to-a-logic-app) Logic App with an Integration Account    

3. Create a trigger, for example using *Request* or *HTTP* before searching for **Integration Account Artifact LookUp**.  Search **integration** to look for **Integration Account Artifact LookUp** 
![Search lookup](media/logic-apps-enterprise-integration-metadata/image2.png) 

3. Select **Integration Account Artifact LookUp**  

4. Select **Artifact Type** and provide **Artifact Name**  
![Search lookup](media/logic-apps-enterprise-integration-metadata/image3.png)

## An example to retrieve partner metadata 

1. Partner metadata has routing url details    
![Search lookup](media/logic-apps-enterprise-integration-metadata/image6.png)

2. In a logic app configure **Integration Account Artifact LookUp** and **HTTP**   
![Search lookup](media/logic-apps-enterprise-integration-metadata/image4.png)

3. To retrieve URI, the code view should look like    
![Search lookup](media/logic-apps-enterprise-integration-metadata/image5.png)


## Next steps
* [Learn more about agreements](logic-apps-enterprise-integration-agreements.md "Learn about enterprise integration agreements")  