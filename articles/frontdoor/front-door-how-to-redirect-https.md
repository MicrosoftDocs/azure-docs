---
title: Configure HTTP to HTTPS redirection using the Azure portal
titleSuffix: Azure Front Door
description: This article shows you how to redirect traffic from HTTP to HTTPS for an Azure Front Door (classic) profile using the Azure portal.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 06/02/2023
ms.author: duau
---

# Configure HTTP to HTTPS redirection using the Azure portal

This article shows you how to redirect traffic from HTTP to HTTPS for an Azure Front Door (classic) profile using the Azure portal. This configuration is useful if you want to redirect traffic from HTTP to HTTPS for your domain.

## Prerequisites

* You need to have an Azure Front Door (classic) profile. For more information, see [create a Front Door (classic) profile](quickstart-create-front-door.md).

## Create HTTP to HTTPS redirect rule

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the Azure Front Door (classic) profile that you want to configure for HTTP to HTTPS redirect. Select **Front Door designer** from under *Settings* on the left hand side menu pane.

1. Select the **+** icon for *Routing rules* to create a new route. Enter a name for the route, for example **HttpToHttpsRedirect**, and then set the *Accepted Protocol* field to **HTTP only**. Select the *Frontend/domains* you redirecting HTTP to HTTPS.  

    :::image type="content" source="./media/front-door-url-redirect/front-door-designer-routing-rule.png" alt-text="Screenshot of adding a route in Front Door designer.":::

1. Under the *Route Details* section, set the *Route Type* to **Redirect**. Then set the *Redirect type* to **Moved (301)** and *Redirect protocol* get set to **HTTPS only**. 

    :::image type="content" source="./media/front-door-url-redirect/front-door-redirect-config-example.png" alt-text="Screenshot of add an HTTP to HTTPS redirect route.":::

1. Select **Add** to create the routing rule for HTTP to HTTPS redirect.

## Create forwarding rule

1. Add another routing rule to handle the HTTPS traffic. Select the **+** icon for *Routing rules* to add the route. Enter a name for the route, for example **DefaultForwardingRoute**. Then set the *Accepted Protocols* field to **HTTPS only**. Select the appropriate *Frontend/domains* to accept this traffic.

1. Under the *Route Details* section, set the *Route Type* to **Forward**. Select a backend pool forward traffic to and set the *Forwarding Protocol* to **HTTPS only**. 

    :::image type="content" source="./media/front-door-url-redirect/front-door-forward-route-example.png" alt-text="Screenshot of add a forward route for HTTPS traffic.":::

1. Select **Add** to create the forwarding route and then select **Save** to save the changes to the Front Door profile.

> [!NOTE]
> The creation of this redirect rule will incur a small charge.

## Next steps

- Learn more about [Azure Front Door routing architecture](front-door-routing-architecture.md).
- Learn more about [Azure Front Door URL redirect](front-door-url-redirect.md).
