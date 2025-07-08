---
title: Configure security headers with Standard/Premium Rule Set
titleSuffix: Azure Front Door
description: Learn how to use Azure Front Door Standard/Premium rule sets to configure security headers and prevent browser-based vulnerabilities.
author: halkazwini
ms.author: yuajia
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 02/25/2025
---

# Configure security headers with Azure Front Door Standard/Premium Rule Set

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

This article shows how to implement security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, or X-Frame-Options. Security-based attributes can also be defined with cookies.

The following example shows you how to add a Content-Security-Policy header to all incoming requests that matches the path in the Route. Here, we only allow scripts from our trusted site, `https://contoso.azure-api.net` to run on our application.

## Prerequisites

- Azure Front Door. For more information, see [Quickstart: Create a Front Door](create-front-door-portal.md).

- Review how to [Set up a Rule Set](how-to-configure-rule-set.md) if you're new to the Rule Set feature.

## Add a Content-Security-Policy header in Azure portal

1. Go to the Azure Front Door Standard/Premium profile and select **Rule Set** under **Settings.**

1. Select **Add** to add a new rule set. Give the Rule Set a **Name** and then provide a **Name** for the rule. Select **Add an Action** and then select **Response Header**.

1. Set the operator to **Append** to add this header as a response to all of the incoming requests for this route.

1. Add the header name: **Content-Security-Policy** and define the values this header should accept. In this scenario, we choose `"script-src 'self' https://contoso.azure-api.net"`.

1. After adding all the rules you want to your configuration, remember to associate the rule set with a route. This step is **required** for the rule set to take action.

> [!NOTE]
> In this scenario, we didn't add [match conditions](concept-rule-set-match-conditions.md) to the rule. All incoming requests that match the path defined in the associated route have this rule applied. To apply it only to a subset of those requests, add your specific **match conditions** to this rule.

> [!IMPORTANT]
> If you're using Web Application Firewall (WAF) with your Azure Front Door, and it blocks a request, HSTS headers won't be added to the request even if they're enabled on the Azure Front Door.

## Clean up resources

### Deleting a Rule

In the preceding steps, you configured Content-Security-Policy header with Rule set. If you no longer want a rule, you can select the **Rule Set** and then select **Delete rule**. 

### Deleting a Rule Set

If you want to delete a Rule Set, make sure you disassociate it from all routes before deleting. For detailed guidance on deleting a rule set, see [Configure rule sets in Azure Front Door](how-to-configure-rule-set.md).

## Next step

To learn how to configure a Web Application Firewall for your Front Door, see:

> [!div class="nextstepaction"]
> [Web Application Firewall and Front Door](../../web-application-firewall/afds/afds-overview.md)
