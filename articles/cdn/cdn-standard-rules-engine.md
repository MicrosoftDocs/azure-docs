---
title: Use a rules engine to enforce HTTPS in Standard Azure CDN | Microsoft Docs
description: Use the rules engine for Microsoft Standard Azure Content Delivery Network (Azure CDN) to customize how Azure CDN handles HTTP requests, including blocking the delivery of certain types of content, defining a caching policy, and modifying HTTP headers. In this article, learn how to create a rule to redirect users to HTTPS.
services: cdn
author: mdgattuso

ms.service: azure-cdn
ms.topic: article
ms.date: 11/01/2019
ms.author: magattus

---

# Set up the rules engine for Standard Azure CDN

> [!NOTE]
> The rules engine is available only for Standard Azure Content Delivery Network from Microsoft. 

You can use the Standard rules engine for Azure Content Delivery Network (Azure CDN) to customize how HTTP requests are handled. For example, you can use the rules engine to enforce content delivery over specific protocols, define a caching policy, or modify an HTTP header. This article demonstrates how to create a rule that automatically redirects users to HTTPS. 

## Redirect users to HTTPS

1. In your Microsoft profiles, go to Azure Content Delivery Network.

1. On the **CDN profile** page, select the endpoint you want to create rules for.
  
1. Select the **Rules Engine** tab.
   
    The **Rules Engine** pane appears and displays the list of available global rules. 
   
    [![Azure CDN new rules page](./media/cdn-standard-rules-engine/cdn-new-rule.png)](./media/cdn-standard-rules-engine/cdn-new-rule.png#lightbox)
   
   > [!IMPORTANT]
   > The order in which multiple rules are listed affects how rules are handled. A subsequent rule might override the actions that are specified in an existing rule.
   >

1. Select **Add rule** and enter a rule name. Rule names must start with a letter and can contain only numbers and letters.

1. Identify the type of requests the rule applies to:
    1. Select **Add condition**, and then select the **Request protocol** match condition.
    1. For **Operator**, select **Equals**.
    1. For **Value**, select **HTTP**.
   
   [![Azure CDN rule match condition](./media/cdn-standard-rules-engine/cdn-match-condition.png)](./media/cdn-standard-rules-engine/cdn-match-condition.png#lightbox)
   
   > [!NOTE]
   > You can select from multiple match conditions in the **Add condition** drop-down list. For a detailed list of match conditions, see [Rules engine match conditions](cdn-standard-rules-engine-match-conditions.md).
   
1. Select the action to apply to the identified requests:
   1. Select **Add action**, and then select **URL redirect**.
   1. For **Type**, select **Found (302)**.
   1. For **Protocol**, select **HTTPS**.
   1. Leave all other fields blank to use incoming values.
   
   [![Azure CDN rule action](./media/cdn-standard-rules-engine/cdn-action.png)](./media/cdn-standard-rules-engine/cdn-action.png#lightbox)
   
   > [!NOTE]
   > You can select from multiple actions in the **Add action** drop-down list. For a detailed list of actions, see [Rules engine actions](cdn-standard-rules-engine-actions.md).

6. Select **Save** to save the new rule. The rule is now available to use.
   
   > [!IMPORTANT]
   > Rule changes can take up to 15 minutes to propagate through Azure CDN.
   >
   

## Next steps

- [Azure CDN overview](cdn-overview.md)
- [Standard rules engine reference](cdn-standard-rules-engine-reference.md)
- [Match conditions in the Standard rules engine](cdn-standard-rules-engine-match-conditions.md)
- [Actions in the Standard rules engine](cdn-standard-rules-engine-actions.md)
