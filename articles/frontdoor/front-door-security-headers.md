---
title: 'Tutorial: Add security headers with Rules Engine - Azure Front Door'
description: This tutorial teaches you how to configure a security header via Rules Engine on Azure Front Door 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 10/05/2023
ms.author: duau
ms.custom: template-tutorial, engagement-fy23
# Customer intent: As an IT admin, I want to learn about Front Door and how to configure a security header via Rules Engine. 
---

# Tutorial: Add Security headers with Rules Engine

This tutorial shows how to implement security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, or X-Frame-Options. Security-based attributes can also be defined with cookies.

The following example shows you how to add a Content-Security-Policy header to all incoming requests that match the path defined in the route your Rules Engine configuration is associated with. Here, we only allow scripts from our trusted site, **https://apiphany.portal.azure-api.net** to run on our application.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Configure a Content-Security-Policy within Rules Engine.

## Prerequisites

* An Azure subscription.
* An Azure Front Door. To complete the steps in this tutorial, you must have a Front Door configured with rules engine. For more information, see [Quickstart: Create a Front Door](quickstart-create-front-door.md) and [Configure your Rules Engine](front-door-tutorial-rules-engine.md).

## Add a Content-Security-Policy header in Azure portal

1. Within your Front door resource, select **Rules engine configuration** under **Settings**, and then select the rules engine that you want to add the security header to.

    :::image type="content" source="media/front-door-security-headers/front-door-rules-engine-configuration.png" alt-text="Screenshot showing rules engine configuration page of Azure Front Door.":::

2. Select **Add rule** to add a new rule. Provide the rule a name and then select **Add an Action** > **Response Header**.

3. Set the Operator to **Append** to add this header as a response to all of the incoming requests to this route.

4. Add the header name: *Content-Security-Policy* and define the values this header should accept, then select **Save**. In this scenario, we choose *`script-src 'self' https://apiphany.portal.azure-api.net`*.

    :::image type="content" source="./media/front-door-security-headers/front-door-security-header.png" alt-text="Screenshot showing the added security header under.":::

   > [!NOTE]
   > Header values are limited to 640 characters.

5. After you have completed adding the rules to your configuration, make sure to associate your Rules engine configuration with the Route Rule of your chosen route. This step is required to enable the rule to work.

    :::image type="content" source="./media/front-door-security-headers/front-door-associate-routing-rule.png" alt-text="Screenshot showing how to associate a routing rule.":::

    > [!NOTE]
    > In this scenario, we did not add [match conditions](front-door-rules-engine-match-conditions.md) to the rule. All incoming requests that match the path defined in the Route Rule will have this rule applied. If you would like it to only apply to a subset of those requests, be sure to add your specific **match conditions** to this rule.

## Clean up resources

In the previous steps, you configured security headers with rules engine of your Front Door. If you no longer want the rule, you can remove it by selecting **Delete rule** within the rules engine.

:::image type="content" source="./media/front-door-security-headers/front-door-delete-security-header.png" alt-text="Screenshot showing how to delete the security rule.":::

## Next steps

To learn how to configure a Web Application Firewall for your Front Door, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Web Application Firewall and Front Door](front-door-waf.md)
