---
title: 'Tutorial: Add security headers with Rules Engine - Azure Front Door'
description: This tutorial teaches you how to configure a security header via Rules Engine on Azure Front Door 
services: frontdoor
documentationcenter: ''
author: duongau
editor: ''
ms.service: frontdoor
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/14/2020
ms.author: duau
# customer intent: As an IT admin, I want to learn about Front Door and how to configure a security header via Rules Engine. 
---

# Tutorial: Add Security headers with Rules Engine

This tutorial shows how to implement security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, or X-Frame-Options. Security-based attributes can also be defined with cookies.

The following example shows you how to add a Content-Security-Policy header to all incoming requests that match the path defined in the route your Rules Engine configuration is associated with. Here, we only allow scripts from our trusted site, **https://apiphany.portal.azure-api.net** to run on our application.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Configure a Content-Security-Policy within Rules Engine.

## Prerequisites

* Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Quickstart: Create a Front Door](quickstart-create-front-door.md).
* If this is your first time using the Rules Engine feature, see how to [Set up a Rules Engine](front-door-tutorial-rules-engine.md).

## Add a Content-Security-Policy header in Azure portal

1. Click **Add** to add a new rule. Provide the rule a name and then click **Add an Action** > **Response Header**.

1. Set the Operator to be **Append** to add this header as a response to all of the incoming requests to this route.

1. Add the header name: **Content-Security-Policy** and define the values this header should accept. In this scenario, we choose *"script-src 'self' https://apiphany.portal.azure-api.net."*

1. Once you've added all of the rules you'd like to your configuration, don't forget to go to your preferred route and associate your Rules Engine configuration to your Route Rule. This step is required to enable the rule to work. 

![portal sample](./media/front-door-rules-engine/rules-engine-security-header-example.png)

> [!NOTE]
> In this scenario, we did not add [match conditions](front-door-rules-engine-match-conditions.md) to the rule. All incoming requests that match the path defined in the Route Rule will have this rule applied. If you would like it to only apply to a subset of those requests, be sure to add your specific **match conditions** to this rule.

## Clean up resources

In the preceding steps, you configured Security headers with Rules Engine. If you no longer want the rule, you can remove it by clicking Delete rule.

:::image type="content" source="./media/front-door-rules-engine/rules-engine-delete-rule.png" alt-text="Delete rule":::

## Next steps

To learn how to configure a Web Application Firewall for your Front Door, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Web Application Firewall and Front Door](front-door-waf.md)
