---
title: Configure HTTP to HTTPS redirection using the Azure portal
titleSuffix: Azure Front Door
description: This article shows you how to redirect traffic from HTTP to HTTPS for an Azure Front Door (classic) profile using the Azure portal.
services: front-door
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/15/2024
ms.author: duau
---

# Configure HTTP to HTTPS redirection using the Azure portal

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

This guide explains how to redirect traffic from HTTP to HTTPS for an Azure Front Door (classic) profile using the Azure portal. This setup ensures that all traffic to your domain is securely redirected to HTTPS.

## Prerequisites

* An existing Azure Front Door (classic) profile. For more information, see [create a Front Door (classic) profile](quickstart-create-front-door.md).

## Create HTTP to HTTPS redirect rule

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to the Azure Front Door (classic) profile you want to configure. Select **Front Door designer** under *Settings* in the left-hand menu.

3. Select the **+** icon under *Routing rules* to create a new route. Name the route, for example, **HttpToHttpsRedirect**, and set the *Accepted Protocol* to **HTTP only**. Choose the *Frontend/domains* you want to redirect from HTTP to HTTPS.

    :::image type="content" source="./media/front-door-url-redirect/front-door-designer-routing-rule.png" alt-text="Screenshot of adding a route in Front Door designer.":::

4. In the *Route Details* section, set the *Route Type* to **Redirect**. Choose **Moved (301)** for *Redirect type* and **HTTPS only** for *Redirect protocol*.

    :::image type="content" source="./media/front-door-url-redirect/front-door-redirect-config-example.png" alt-text="Screenshot of adding an HTTP to HTTPS redirect route.":::

5. Select **Add** to create the routing rule for HTTP to HTTPS redirection.

## Create forwarding rule

1. Add another routing rule for handling HTTPS traffic. Select the **+** icon under *Routing rules* to add a new route. Name the route, for example, **DefaultForwardingRoute**, and set the *Accepted Protocols* to **HTTPS only**. Select the appropriate *Frontend/domains* for accepting this traffic.

2. In the *Route Details* section, set the *Route Type* to **Forward**. Choose a backend pool to forward the traffic to and set the *Forwarding Protocol* to **HTTPS only**.

    :::image type="content" source="./media/front-door-url-redirect/front-door-forward-route-example.png" alt-text="Screenshot of adding a forward route for HTTPS traffic.":::

3. Select **Add** to create the forwarding route, then select **Save** to apply the changes to the Front Door profile.

> [!NOTE]
> Creating this redirect rule will incur a small charge.

## Next steps

- Learn more about [Azure Front Door routing architecture](front-door-routing-architecture.md).
- Learn more about [Azure Front Door URL redirect](front-door-url-redirect.md).
