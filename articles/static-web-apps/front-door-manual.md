---
title: "Tutorial: Manually configure Azure Front Door for Azure Static Web Apps"
description: Learn set up Azure Front Door for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 01/24/2023
ms.author: cshoe
---

# Tutorial: Manually configure Azure Front Door for Azure Static Web Apps

Add [Azure Front Door](../frontdoor/front-door-overview.md) as the CDN for your static web app. Azure Front Door is a scalable and secure entry point for fast delivery of your web applications.

In this tutorial, learn how to create an Azure Front Door Standard/Premium instance and associate Azure Front Door with your Azure Static Web Apps site.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- An Azure Static Web Apps site. [Build your first static web app](get-started-portal.md)
- Azure Static Web Apps Standard and Azure Front Door Standard / Premium plans. For more information, see [Static Web Apps pricing](https://azure.microsoft.com/pricing/details/app-service/static/)
- Consider using [enterprise-grade edge](enterprise-edge.md) for faster page loads, enhanced security, and optimized reliability for global applications.
<!--
## Copy web app URL

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Open the static web app that you want to apply Azure Front Door.

3. Go to the *Overview* section.

4. Copy the *URL* to your clipboard for later use.

   :::image type="content" source="media/front-door-manual/copy-url-static-web-app.png" alt-text="Screenshot of Static Web App Overview page.":::
-->

## Create an Azure Front Door

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the home page or the Azure menu, select **+ Create a resource**. Search for *Front Door and CDN profiles*, and then select **Create** > **Front Door and CDN profiles**.
3. On the Compare offerings page, select **Quick create**, and then select **Continue to create a Front Door**.
4. On the **Create a Front Door profile** page, enter or select the following settings.

    | Setting | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Enter a resource group name. This name is often the same group name used by your static web app. |
    | Resource group location | If you create a new resource group, enter the location nearest you. |
    | Name | Enter **my-static-web-app-front-door**. |
    | Tier | Select **Standard**. |
    | Endpoint name | Enter a unique name for your Front Door host. |
    | Origin type | Select **Static Web App**. |
    | Origin host name | Select the host name of your static web app from the dropdown.  |
    | Caching | Check the **Enable caching** checkbox. |
    | Query string caching behavior | Select **Use Query String** |
    | Compression | Select **Enable compression** |
    | WAF policy | Select **Create new** or select an existing Web Application Firewall policy from the dropdown if you want to enable this feature. |

   > [!NOTE]
   > When you create an Azure Front Door profile, you must select an origin from the same subscription the Front Door is created in.

5. Select **Review + create**, and then select **Create**. The creation process may take a few minutes to complete.
6. When  deployment completes, select **Go to resource**.
7. [Add a condition](#add-a-condition).

## Disable cache for auth workflow

> [!NOTE]
> The cache expiration, cache key query string and origin group override actions are deprecated. These actions can still work normally, but your rule set can't change. Replace these overrides with new route configuration override actions before changing your rule set.

Add the following settings to disable Front Door's caching policies from trying to cache authentication and authorization-related pages.

### Add a condition

1. From your Front Door, under *Settings*, select **Rule set**.

2. Select **Add**.

3. In the *Rule set name* textbox, enter **Security**.

4. In the *Rule name* textbox, enter **NoCacheAuthRequests**.

5. Select **Add a condition**.

6. Select **Request path**.

7. Select the *Operator* drop-down, and then **Begins With**.

8. Select the **Edit** link above the *Value* textbox.

9. Enter `/.auth` in the textbox, and then select **Update**.

10. Select no options from the *String transform* dropdown.

### Add an action

1. Select the **Add an action** dropdown.

2. Select **Route configuration override**.

3. Select **Disabled** in the *Caching* dropdown.

4. Select **Save**.

### Associate rule to an endpoint

Now that the rule is created, apply the rule to a Front Door endpoint.

1. From your Front Door, select **Rule set**, and then the **Unassociated** link.

   :::image type="content" source="media/front-door-manual/rule-set-select-unassociated.png" alt-text="Screenshot showing selections for Rule set and Unassociated links.":::

2. Select the endpoint name to which you want to apply the caching rule, and then select **Next**.

3. Select **Associate**.

   :::image type="content" source="media/front-door-manual/associate-route.png" alt-text="Screenshot showing highlighted button, Associate.":::

## Copy Front Door ID

Use the following steps to copy the Front Door instance's unique identifier.

1. From your Front Door, select the **Overview** link on the left-hand navigation.

1. Copy the value labeled **Front Door ID** and paste it into a file for later use.

   :::image type="content" source="media/front-door-manual/copy-front-door-id.png" alt-text="Screenshot showing highlighted Overview item and highlighted Front Door ID number.":::

## Update static web app configuration

To complete the integration with Front Door, you need to update the application configuration file to do the following functions:

- Restrict traffic to your site only through Front Door
- Restrict traffic to your site only from your Front Door instance
- Define which domains can access your site
- Disable caching for secured routes

Open the [staticwebapp.config.json](configuration.md) file for your site and make the following changes.

1. Restrict traffic to only use Front Door by adding the following section to the configuration file:

    ```json
    "networking": {
      "allowedIpRanges": ["AzureFrontDoor.Backend"]
    }
    ```

1. To define which Azure Front Door instances and domains can access your site, add the `forwardingGateway` section.

    ```json
    "forwardingGateway": {
      "requiredHeaders": {
        "X-Azure-FDID" : "<YOUR-FRONT-DOOR-ID>"
      },
      "allowedForwardedHosts": [
        "my-sitename.azurefd.net"
      ]
    }
    ```

    First, configure your app to only allow traffic from your Front Door instance. In every backend request, Front Door automatically adds an `X-Azure-FDID` header that contains your Front Door instance ID. By configuring your static web app to require this header, it restricts traffic exclusively to your Front Door instance. In the `forwardingGateway` section in your configuration file, add the `requiredHeaders` section and define the `X-Azure-FDID` header. Replace `<YOUR-FRONT-DOOR-ID>` with the *Front Door ID* you set aside earlier.

    Next, add the Azure Front Door hostname (not the Azure Static Web Apps hostname) into the `allowedForwardedHosts` array. If you have custom domains configured in your Front Door instance, also include them in this list.

    In this example, replace `my-sitename.azurefd.net` with the Azure Front Door hostname for your site.

2. For all secured routes in your app, disable Azure Front Door caching by adding `"Cache-Control": "no-store"` to the route header definition.

    ```json
    {
        ...
        "routes": [
            {
                "route": "/members",
                "allowedRoles": ["authenticated", "members"],
                "headers": {
                    "Cache-Control": "no-store"
                }
            }
        ]
        ...
    }
    ```

With this configuration, your site is no longer available via the generated `*.azurestaticapps.net` hostname, but exclusively through the hostnames configured in your Front Door instance.

## Considerations

- **Custom domains**: Now that Front Door is managing your site, you no longer use the Azure Static Web Apps custom domain feature. Azure Front Door has a separate process for adding a custom domain. Refer to [Add a custom domain to your Front Door](../frontdoor/front-door-custom-domain.md). When you add a custom domain to Front Door, you'll need to update your static web app configuration file to include it in the `allowedForwardedHosts` list.

- **Traffic statistics**: By default, Azure Front Door configures [health probes](../frontdoor/front-door-health-probes.md) that may affect your traffic statistics. You may want to edit the default values for the [health probes](../frontdoor/front-door-health-probes.md).

- **Serving old versions**: When you deploy updates to existing files in your static web app, Azure Front Door may continue to serve older versions of your files until their [time-to-live](https://wikipedia.org/wiki/Time_to_live) expires. [Purge the Azure Front Door cache](../frontdoor/front-door-caching.md#cache-purge) for the affected paths to ensure the latest files are served.

## Clean up resources

If you no longer want to use the resources created in this tutorial, delete the Azure Static Web Apps and Azure Front Door instances.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](apis-overview.md)
