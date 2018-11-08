---
title: Manage integration account artifact metadata - Azure Logic Apps | Microsoft Docs
description: Add or retrieve artifact metadata from integration accounts in Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.assetid: bb7d9432-b697-44db-aa88-bd16ddfad23f
ms.date: 02/23/2018
---

# Manage artifact metadata from integration accounts in Azure Logic Apps with Enterprise Integration Pack

You can define custom metadata for artifacts in integration accounts 
and retrieve that metadata during runtime for your logic app. 
For example, you can specify metadata for artifacts, such as partners, 
agreements, schemas, and maps - all store metadata using key-value pairs. 

## Add metadata to artifacts in integration accounts

1. In the Azure portal, create an [integration account](logic-apps-enterprise-integration-create-integration-account.md).

2. Add an artifact to your integration account, for example, 
a [partner](logic-apps-enterprise-integration-partners.md), 
[agreement](logic-apps-enterprise-integration-agreements.md), 
or [schema](logic-apps-enterprise-integration-schemas.md).

3. Select the artifact, choose **Edit**, and enter metadata details.

   ![Enter metadata](media/logic-apps-enterprise-integration-metadata/image1.png)

## Retrieve metadata from artifacts for logic apps

1. In the Azure portal, create a [logic app](quickstart-create-first-logic-app-workflow.md).

2. Create a [link from your logic app to your integration account](logic-apps-enterprise-integration-create-integration-account.md#link-account). 

3. In Logic App Designer, add a trigger like **Request** or **HTTP** to your logic app.

4. Under the trigger, choose **New step** > **Add an action**. 
Search for "integration account" so you can find and then select 
this action: **Integration Account - Integration Account Artifact Lookup**

   ![Select Integration Account Artifact Lookup](media/logic-apps-enterprise-integration-metadata/image2.png)

5. Select the **Artifact Type** and provide the **Artifact Name**. 
For example:

   ![Select artifact type and specify artifact name](media/logic-apps-enterprise-integration-metadata/image3.png)

## Example: Retrieve partner metadata

Suppose this partner has this metadata with `routingUrl` details:

![Find partner "routingURL" metadata](media/logic-apps-enterprise-integration-metadata/image6.png)

1. In your logic app, add your trigger, 
an **Integration Account - Integration Account Artifact Lookup** action for your partner, 
and an **HTTP** action, for example:

   ![Add trigger, artifact lookup, and HTTP action to your logic app](media/logic-apps-enterprise-integration-metadata/image4.png)

2. To retrieve the URI, on the Logic App Designer toolbar, choose **Code View** for your logic app. Your logic app definition should look like this example:

   ![Search lookup](media/logic-apps-enterprise-integration-metadata/image5.png)

## Next steps

* [Learn more about agreements](logic-apps-enterprise-integration-agreements.md)
