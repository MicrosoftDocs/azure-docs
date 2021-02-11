---
title: Configure security headers with Azure Front Door Rule Set
description: This article provides guidance on how to use rule set to configure security headers. 
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: yuajia
---

# Configure security headers with Azure Front Door Rule Set

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This tutorial shows how to implement security headers to prevent browser-based vulnerabilities like HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, or X-Frame-Options. Security-based attributes can also be defined with cookies.

The following example shows you how to add a Content-Security-Policy header to all incoming requests that matches the path in the Route. Here, we only allow scripts from our trusted site, **https://apiphany.portal.azure-api.net** to run on our application.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Configure a Content-Security-Policy within Rules Engine.
> - Delete Rules and Rule Set

## Prerequisites

* Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Quickstart: Create a Front Door](create-front-door-portal.md).
* Review how to [Set up a Rule Set](how-to-configure-rule-set.md) if you haven't used the Rule Set feature before.

## Add a Content-Security-Policy header in Azure portal

1. Go to the Azure Front Door profile and select **Rule Set** under **Settings.**

1. Select **Add** to add a new rule set. Give the Rule Set a name and then provide a name for the rule. Select **Add an Action** and then select **Response Header**.

1. Set the Operator to **Append** to add this header as a response to all of the incoming requests to this route.

1. Add the header name: **Content-Security-Policy** and define the values this header should accept. In this scenario, we choose *"script-src 'self' https://apiphany.portal.azure-api.net"*.

1. Once you've added all of the rules you'd like to your configuration, don't forget to associate the rule set with a route. This step is required to enable the rule set to work. 

> [!NOTE]
> In this scenario, we did not add [match conditions](concept-rule-set-match-conditions.md) to the rule. All incoming requests that match the path defined in the associated route will have this rule applied. If you would like it to only apply to a subset of those requests, be sure to add your specific **match conditions** to this rule.

## Clean up resources

### Deleting a Rule

In the preceding steps, you configured Content-Security-Policy header with Rule set. If you no longer want a rule, you can select the Rule Set name and then select Delete rule. 

### Deleting a Rule Set
If you want to delete a Rule Set, make sure you disassociate it from all routes before deleting. For detailed guidance on deleting a rule set, refer to [Configure your rule set](configure-rule-set).

## Next steps

To learn how to configure a Web Application Firewall for your Front Door, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Web Application Firewall and Front Door](../../web-application-firewall/afds/afds-overview)
