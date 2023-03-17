---
title: Create a Front Door with HTTP to HTTPS redirection - Azure portal
description: Learn how to create a Front Door with redirected traffic from HTTP to HTTPS using the Azure portal.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 09/30/2020
ms.author: duau

---
# Create a Front Door with HTTP to HTTPS redirection using the Azure portal

You can use the Azure portal to [create a Front Door](quickstart-create-front-door.md) with a certificate for TLS termination. A routing rule is used to redirect HTTP traffic to HTTPS.

## Create a Front Door with an existing Web App resource

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

1. Select **Create a resource** found on the upper left-hand corner of the Azure portal.

1. Search for **Front Door and CDN profiles** using the search bar and once you find the resource type, select **Create**.

1. Select **Explore other offerings**, then select **Azure Front Door (classic)**. Select **Continue** to begin configuring the profile.

    :::image type="content" source="./media/front-door-url-redirect/compare-offerings.png" alt-text="Screenshot of the compare offerings page.":::

1. Choose a *subscription* and then either use an existing resource group or create a new one. Select **Next** to enter the configuration tab.

    > [!NOTE]
    > The location asked in the UI is for the resource group only. Your Front Door configuration will get deployed across all of [Azure Front Door's POP locations](front-door-faq.yml#where-are-the-edge-locations-for-azure-front-door-).

    :::image type="content" source="./media/front-door-url-redirect/front-door-create-basics.png" alt-text="Configure basics for new Front Door":::

1. The configuration for Front Door happens in three steps - adding a default frontend host, adding backends in a backend pool and then creating routing rules to map the routing behavior for frontend host. Select the '**+**' icon on the _Frontend hosts_ to create a frontend host.

    :::image type="content" source="./media/front-door-url-redirect/front-door-designer.png" alt-text="Front Door configuration designer":::

1. Enter a globally unique name for your default frontend host for your Front Door. Select **Add** to continue to the next step.

    :::image type="content" source="./media/front-door-url-redirect/front-door-create-frontend-host.png" alt-text="Add a frontend host":::

### Create Backend Pool

1. Select the '**+**' icon on the _Backend pools_ to create a backend pool. Provide a name for the backend pool and then select **Add a backend**.

    :::image type="content" source="./media/front-door-url-redirect/front-door-designer-backend-pool.png" alt-text="Front Door configuration designer backend pool":::

1. Select the Backend Host Type as _App service_. Select the subscription where your web app is hosted and then select the specific web app from the dropdown for **Backend host name**.

    :::image type="content" source="./media/front-door-url-redirect/front-door-create-backend-pool.png" alt-text="Add a backend in a backend pool":::

1. Select **Add** to save the backend and select **Add** again to save the backend pool config. 

## Create HTTP to HTTPS redirect rule

1. Select the '**+**' icon on the *Routing rules* to create a route. Provide a name for the route, for example 'HttpToHttpsRedirect', and then set the *Accepted Protocol* field to **'HTTP only'**. Ensure that the appropriate *Frontend/domains* is selected.  

    :::image type="content" source="./media/front-door-url-redirect/front-door-designer-routing-rule.png" alt-text="Front Door configuration designer routing rule":::

1. Under the *Route Details* section, set the *Route Type* to **Redirect**. Set the *Redirect type* to **Moved (301)** and *Redirect protocol* get set to **HTTPS only**. 

    :::image type="content" source="./media/front-door-url-redirect/front-door-redirect-config-example.png" alt-text="Add an HTTP to HTTPS redirect route":::

1. Select **Add** to save the routing rule for HTTP to HTTPS redirect.

## Create forwarding rule

1. Add another routing rule to handle the HTTPS traffic. Select the '**+**' sign on the *Routing rules* and provide a name for the route, for example 'DefaultForwardingRoute'. Then set the *Accepted Protocols* field to **HTTPS only**. Ensure that the appropriate *Frontend/domains* is selected.

1. On the Route Details section, set the *Route Type* to **Forward**. Ensure that the right backend pool gets selected and the *Forwarding Protocol* is set to **HTTPS only**. 

    :::image type="content" source="./media/front-door-url-redirect/front-door-forward-route-example.png" alt-text="Add a forward route for HTTPS traffic" border="false":::

1. Select **Add** to save the routing rule for request forwarding.

1. Select **Review + create** and then **Create**, to create your Front Door profile. Go to the resource once created.

    > [!NOTE]
    > The creation of this redirect rule will incur a small charge.

## Next steps

- Learn [how Front Door works](front-door-routing-architecture.md).
- Learn more about [URL redirect on Front Door](front-door-url-redirect.md).
