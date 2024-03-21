---
title: Use a rules engine to enforce HTTPS in Standard Azure Content Delivery Network
description: Use the rules engine for Microsoft Standard Azure Content Delivery Network to customize how Azure Content Delivery Network handles HTTP requests. Including blocking the delivery of certain types of content, defining a caching policy, and modifying HTTP headers. In this article, learn how to create a rule to redirect users to HTTPS.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Set up the Standard rules engine for Azure Content Delivery Network

This article describes how to set up and use the Standard rules engine for Azure Content Delivery Network.

## Standard rules engine

You can use the Standard rules engine for Azure Content Delivery Network to customize how HTTP requests are handled. For example, you can use the rules engine to enforce content delivery to use specific protocols, to define a caching policy, or to modify an HTTP header. This article demonstrates how to create a rule that automatically redirects users to HTTPS.

> [!NOTE]
> The rules engine that's described in this article is available only for Standard Azure Content Delivery Network from Microsoft.

## Redirect users to HTTPS

1. In your Microsoft profiles, go to Azure Content Delivery Network.

1. On the **CDN profile** page, select the endpoint you want to create rules for.

1. Select the **Rules Engine** tab.

    The **Rules Engine** pane opens and displays the list of available global rules.

    [![Screenshot of Azure Content Delivery Network new rules page.](./media/cdn-standard-rules-engine/cdn-new-rule.png)](./media/cdn-standard-rules-engine/cdn-new-rule.png#lightbox)

   > [!IMPORTANT]
   > The order in which multiple rules are listed affects how rules are handled. The actions that are specified in a rule might be overwritten by a subsequent rule.
   >

1. Select **Add rule** and enter a rule name. Rule names must begin with a letter and can contain only numbers and letters.

1. To identify the type of requests the rule applies to, create a match condition:
    1. Select **Add condition**, and then select the **Request protocol** match condition.
    1. For **Operator**, select **Equals**.
    1. For **Value**, select **HTTP**.

   [![Screenshot of Azure Content Delivery Network rule match condition.](./media/cdn-standard-rules-engine/cdn-match-condition.png)](./media/cdn-standard-rules-engine/cdn-match-condition.png#lightbox)

   > [!NOTE]
   > You can select from multiple match conditions in the **Add condition** dropdown list. For a detailed list of match conditions, see [Match conditions in the Standard rules engine](cdn-standard-rules-engine-match-conditions.md).

1. Select the action to apply to the requests that satisfy the match condition:
   1. Select **Add action**, and then select **URL redirect**.
   1. For **Type**, select **Found (302)**.
   1. For **Protocol**, select **HTTPS**.
   1. Leave all other fields blank to use incoming values.

   [![Screenshot of Azure Content Delivery Network rule action.](./media/cdn-standard-rules-engine/cdn-action.png)](./media/cdn-standard-rules-engine/cdn-action.png#lightbox)

   > [!NOTE]
   > You can select from multiple actions in the **Add action** dropdown list. For a detailed list of actions, see [Actions in the Standard rules engine](cdn-standard-rules-engine-actions.md).

6. Select **Save** to save the new rule. The rule is now available to use.

   > [!IMPORTANT]
   > Rule changes might take up to 15 minutes to propagate through Azure Content Delivery Network.
   >

## Next steps

- [Azure Content Delivery Network overview](cdn-overview.md)
- [Standard rules engine reference](cdn-standard-rules-engine-reference.md)
- [Match conditions in the Standard rules engine](cdn-standard-rules-engine-match-conditions.md)
- [Actions in the Standard rules engine](cdn-standard-rules-engine-actions.md)
