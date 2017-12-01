---
title: Convert Json data with liquid transforms - Azure Logic Apps | Microsoft Docs
description: Create transforms or maps to convert Json data between formats in logic apps by using the Enterprise Integration SDK
services: logic-apps
documentationcenter: .net,nodejs,java
author: msftman
manager: anneta
editor: cgronlun

ms.assetid: add01429-21bc-4bab-8b23-bc76ba7d0bde
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/22/2017
ms.author: LADocs; divswa

---
# Enterprise integration with liquid template
## Overview
Logic Apps support basic JSON transformations through native Data Operation actions like Compose or Parse JSON. Logic Apps now also support advanced JSON transformations via Liquid templates. [Liquid](https://shopify.github.io/liquid/) is an open-source, safe, customer-facing template language for flexible web apps.
 
In this document, we are going to cover Liquid action, which uses liquid maps or templates to support more complex JSON transformations, such as iteration, control flow, variables etc. To use liquid action in your logic app, you need to define JSON to JSON mapping through a liquid map, and store it in the Integration Account. 


### Prerequisites
Here are the prerequisites to use the liquid action:

* An Azure subscription. If you don't have a subscription, you can 
[start with a free Azure account](https://azure.microsoft.com/free/). 
Otherwise, you can [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* Basic knowledge about [how to create logic apps](../logic-apps/logic-apps-create-a-logic-app.md). 

* Basic [Integration Account](logic-apps-enterprise-integration-create-integration-account.md).


### Upload liquid template or map to integration account

* Follow the steps below to select your integration account
  * Choose **All services**.
  * Provide your integration account name in the text box, which is *myintegrationaccount* in this example.
  * Select your integration account.

    ![Select integration account](./media/logic-apps-enterprise-integration-liquid-transform/select-integration-account.png)

* On the integration account tile, select **Maps**.

  ![Select maps](./media/logic-apps-enterprise-integration-liquid-transform/add-maps.png)

* Choose **Add** and provide the Map details
  * **Name**: The name used to identify the map, which is JsontoJsonTemplate in this example.
  * **Map type**: The type of map, which must be liquid for JSON to JSON transformation
  * **Map**: The liquid map or template for transformation. Use file picker to select the file, which is SimpleJsonToJsonTemplate.liquid in this example.

    ![Add liquid template](./media/logic-apps-enterprise-integration-liquid-transform/add-liquid-template.png)

    Liquid template defines how you want to transform JSON input. Here are the content of Map used in previous step.

    ```
    {%- assign deviceList = content.devices | Split: ', ' -%}
    {
        "fullName": "{{content.firstName | Append: ' ' | Append: content.lastName}}",
        "firstNameUpperCase": "{{content.firstName | Upcase}}",
        "phoneAreaCode": "{{content.phone | Slice: 1, 3}}",
        "devices" : [
        {%- for device in deviceList -%}
            {%- if forloop.Last == true -%}
            "{{device}}"
            {%- else -%}
            "{{device}}",
            {%- endif -%}
        {%- endfor -%}
        ]
    }
    ```
    > [!NOTE]
    > If you are using any [filters](https://shopify.github.io/liquid/basics/introduction/#filters) in liquid template, they must start with an upper case. 


### Use Liquid action for JSON to JSON transformation

* [Create a logic app](logic-apps-create-a-logic-app.md).

* Add [Request trigger](../connectors/connectors-native-reqres.md#use-the-http-request-trigger) to your logic app.

* Choose **+ New step > Add an action**. Search for *liquid* in the search box. Select **Liquid - Transform JSON to JSON**.

  ![Search-action-liquid](./media/logic-apps-enterprise-integration-liquid-transform/search-action-liquid.png)

* In the **Content** , select **Body** from Dynamic content picker. 
  
  ![Select-body](./media/logic-apps-enterprise-integration-liquid-transform/select-body.png)
 
* In the **Map**, select your map from the drop-down, which is JsonToJsonTemplate in this example. Select **Save** to save your logic app.

  ![Select-map](./media/logic-apps-enterprise-integration-liquid-transform/select-map.png)

   If the drop-down is empty, you likely do not have an integration account associated to the logic app. Follow these steps to link the logic app to your integration account that contains the liquid template or map.

   * For your logic app, select **Workflow settings**. 
   * In **Integration Account** drop down, select your integration account name and then choose **Save**.

     ![Link logic app to integration account](./media/logic-apps-enterprise-integration-liquid-transform/link-integration-account.png)


### Results
* To test your logic app, post JSON input to your logic app from [Postman](https://www.getpostman.com/postman) or similar tool. 
You should see the transformed JSON in the output, like the example below.
  
  ![Example output](./media/logic-apps-enterprise-integration-liquid-transform/example-output.png)


## Learn more
* [Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  
* [Learn more about maps](../logic-apps/logic-apps-enterprise-integration-maps.md "Learn about enterprise integration maps")  

