---
title: "Tutorial: Manually configure Azure Front Door for Azure Static Web Apps"
description: Learn set up Azure Front Door for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 01/12/2022
ms.author: cshoe
---

# Tutorial: Manually configure Azure Front Door for Azure Static Web Apps

Learn to add [Azure Front Door](../frontdoor/front-door-overview.md) as the CDN for your static web app.  Azure Front Door is a scalable and secure entry point for fast delivery of your web applications.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an Azure Front Door Standard/Premium instance
> - Associate Azure Front Door with your Azure Static Web Apps site

> [!NOTE]
> This tutorial requires the Azure Static Web Apps Standard and Azure Front Door Standard / Premium plans.

## Copy web app URL

1. Navigate to the Azure portal.

1. Open the static web app that you want to apply Azure Front Door.

1. Go to the *Overview* section.

1. Copy the *URL* to your clipboard for later use.

## Add Azure Front Door

1. Navigate to the Azure home screen.

1. Select **Create a resource**.

1. Search for **Front Door**.

1. Select **Front Door Standard/Premium**.

    Make sure to select the service labeled *Front Door Standard/Premium* and not the plain *Front Door* option.

1. Select **Create**.

1. Select the **Azure Front Door Standard/Premium** option.

1. Select the **Quick create** option.

1. Select the **Continue to create a front door** button.

1. In the *Basics* tab, enter the following values:

    | Setting | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Enter a resource group name. This name is often the same group name used by your static web app. |
    | Resource group location | If you create a new resource group, enter the location nearest you. |
    | Name | Enter **my-static-web-app-front-door**. |
    | Tier | Select **Standard**. |
    | Endpoint name | Enter a unique name for your Front Door host. |
    | Origin type | Select **Custom**. |
    | Origin host name | Enter the hostname of your static web app that you set aside from the beginning of this tutorial. Make sure your value does not include a trailing slash or protocol. (For example, `desert-rain-04056.azurestaticapps.net`)  |
    | Caching | Check the **Enable caching** checkbox. |
    | Query string caching behavior | Select **Use Query string** from the dropdown. |

1. Select **Review + create**.

1. Select **Create**.

    The creation process may take a few minutes to complete.

1. Select **Go to resource**.

## Disable cache for auth workflow
> [!NOTE]
>The cache expiration, cache key query string and origin group override actions are deprecated. These deprecated actions can still work normally, but your rule set >cannot be changed. You need to replace them with new route configuration override action before changing your rule set.

Add the following settings to disable Front Door's caching policies from trying to cache authentication and authorization-related pages.

### Add a condition

1. Under *Settings*, select **Rule set**.

1. Select **Add**.

1. In the *Rule set name* textbox, enter **Security**.

1. In the *Rule name* textbox, enter **NoCacheAuthRequests**.

1. Select **Add a condition**.

1. Select **Request path**.

1. Select **Begins With** in the *Operator* drop down.

1. Select the **Edit** link above the *Value* textbox.

1. Enter **/.auth** in the textbox.

1. Select the **Update** button.

1. Select the **No transform** option from the *Case transform* dropdown.

### Add an action

1. Select the **Add an action** dropdown.

1. Select **Route configuration override**.

1. Select **Disabled** in the *Caching* dropdown.

1. Select the **Save** button.

### Associate rule to an endpoint

Now that the rule is created, you apply the rule to a Front Door endpoint.

1. Select the **Unassociated** link.

1. Select the Endpoint name to which you want to apply the caching rule.

1. Select the **Next** button.

1. Select the **Associate** button.

## Copy Front Door ID

Use the following steps to copy the Front Door instance's unique identifier.

1. Select the **Overview** link on the left-hand navigation.

1. From the *Overview* window, copy the value labeled **Front Door ID** and paste it into a file for later use.

## Update static web app configuration

To complete the integration with Front Door, you need to update the application configuration file to:

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

    First, configure your app to only allow traffic from your Front Door instance. In every backend request, Front Door automatically adds an `X-Azure-FDID` header that contains your Front Door instance ID. By configuring your static web app to require this header, it will restrict traffic exclusively to your Front Door instance. In the `forwardingGateway` section in your configuration file, add the `requiredHeaders` section and define the `X-Azure-FDID` header. Replace `<YOUR-FRONT-DOOR-ID>` with the *Front Door ID* you set aside earlier.

    Next, add the Azure Front Door hostname (not the Azure Static Web Apps hostname) into the `allowedForwardedHosts` array. If you have custom domains configured in your Front Door instance, also include them in this list.

    In this example, replace `my-sitename.azurefd.net` with the Azure Front Door hostname for your site.

1. For all secured routes in your app, disable Azure Front Door caching by adding `"Cache-Control": "no-store"` to the route header definition.

    ```json
    {
        "route": "/members",
        "allowedRoles": ["authenticated, members"],
        "headers": {
            "Cache-Control": "no-store"
        }
    }
    ```

With this configuration, your site is no longer available via the generated `*.azurestaticapps.net` hostname, but exclusively through the hostnames configured in your Front Door instance.

## Considerations

- **Custom domains**: Now that Front Door is managing your site, you no long use the Azure Static Web Apps custom domain feature. Azure Front Door has a separate process for adding a custom domain. Refer to [Add a custom domain to your Front Door](../frontdoor/front-door-custom-domain.md). When you add a custom domain to Front Door, you'll need to update your static web app configuration file to include it in the `allowedForwardedHosts` list.

- **Traffic statistics**: By default, Azure Front Door configures [health probes](../frontdoor/front-door-health-probes.md) that may affect your traffic statistics. You may want to edit the default values for the [health probes](../frontdoor/front-door-health-probes.md).

- **Serving old versions**: When you deploy updates to existing files in your static web app, Azure Front Door may continue to serve older versions of your files until their [time-to-live](https://wikipedia.org/wiki/Time_to_live) expires. [Purge the Azure Front Door cache](../frontdoor/front-door-caching.md#cache-purge) for the affected paths to ensure the latest files are served.

## Clean up resources

If you no longer want to use the resources created in this tutorial, delete the Azure Static Web Apps and Azure Front Door instances.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](apis.md)
