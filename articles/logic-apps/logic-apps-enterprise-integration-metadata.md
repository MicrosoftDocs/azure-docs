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

# Manage artifact metadata in integration accounts with Azure Logic Apps and  Enterprise Integration Pack

You can define custom metadata for artifacts in integration accounts 
and get that metadata during runtime for your logic app to use. 
For example, you can provide metadata for artifacts, such as partners, 
agreements, schemas, and maps - all store metadata using key-value pairs. 

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* A basic [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
that has at least one artifact, for example: 

  * [Partner](logic-apps-enterprise-integration-partners.md)
  * [Agreement](logic-apps-enterprise-integration-agreements.md)
  * [Schema](logic-apps-enterprise-integration-schemas.md)
  * [Map](logic-apps-enterprise-integration-maps.md)

* A logic app that's linked to the integration account 
and artifact metadata you want to use. If your logic app 
isn't already linked, learn [how to link logic apps to integration accounts](logic-apps-enterprise-integration-create-integration-account.md#link-account). 

  If you don't have a logic app yet, learn [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
  Add the trigger and actions you want to use for managing 
  artifact metadata. Or, to just try things out, add a trigger 
  such as **Request** or **HTTP** to your logic app.

## Add metadata to artifacts

1. Sign in to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
with your Azure account credentials. Find and open your integration account.

1. Select the artifact where you want to add metadata, 
and choose **Edit**. Enter the metadata details for that artifact.

   ![Enter metadata](media/logic-apps-enterprise-integration-metadata/image1.png)

## Get artifact metadata

1. In the Azure portal, open the logic app that's 
linked to the integration account you want. 

1. In the Logic App Designer, if you're adding the step for 
getting metadata under the trigger or last action in the workflow, 
choose **New step** > **Add an action**. 

1. Search for "integration account", and select **Enterprise**. 
From the actions list, select this action: 
**Integration Account Artifact Lookup - Integration Account**

   ![Select "Integration Account Artifact Lookup"](media/logic-apps-enterprise-integration-metadata/image2.png)

1. Select the **Artifact Type** and provide the **Artifact Name**. 
For example:

   ![Select artifact type and specify artifact name](media/logic-apps-enterprise-integration-metadata/image3.png)

## Example: Get partner metadata

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
